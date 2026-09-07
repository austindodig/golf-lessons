import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, BALL_RADIUS } from '../objects/ball.js';
import { createRangeGround, createMotes } from '../objects/terrain.js';
import { createFlag } from '../objects/markers.js';
import { makeGreen, rollPutt, solvePutt, HOLE_R, FT } from '../physics/putting.js';
import { h, svgIcon, fmt, signed } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

const DIRS = { 'left-to-right': 90, 'right-to-left': 270, uphill: 180, downhill: 0 };
const DIR_NAMES = [[0, 'Downhill'], [45, 'Down, left-to-right'], [90, 'Left-to-right'], [135, 'Up, left-to-right'], [180, 'Uphill'], [225, 'Up, right-to-left'], [270, 'Right-to-left'], [315, 'Down, right-to-left']];

// Green Reader: a tilted green with a rolling ball. Aim and pace are yours; gravity and friction do the rest.
export function mountGreenReader(root, preset = {}) {
  const state = {
    distFt: THREE.MathUtils.clamp(preset.distance ?? 15, 3, 40), slope: THREE.MathUtils.clamp(preset.slopePercent ?? 2, 0, 4),
    dir: DIRS[preset.direction] ?? 90, stimp: THREE.MathUtils.clamp(preset.stimp ?? 10, 8, 13), aim: 0, pace: 1, showIdeal: true, busy: false,
  };
  root.classList.add('module', 'module--green');
  const stageEl = h('div.module__stage');
  const hudTL = h('div.hud.hud--tl'), hudTR = h('div.hud.hud--tr'), hudBL = h('div.hud.hud--bl', h('div.hud__pos'));
  stageEl.append(hudTL, hudTR, hudBL);
  const rows = {};
  const ctl = h('div.ctl');
  const SL = [
    { key: 'distFt', label: 'Distance', min: 3, max: 40, step: 1, unit: ' ft' },
    { key: 'slope', label: 'Slope', min: 0, max: 4, step: 0.25, unit: '%' },
    { key: 'dir', label: 'Fall line', min: 0, max: 359, step: 1, unit: '°', fmt: (v) => nearestDir(v) },
    { key: 'stimp', label: 'Green speed', min: 8, max: 13, step: 0.5, unit: ' stimp' },
    { key: 'aim', label: 'Aim', min: -12, max: 12, step: 0.25, unit: ' cups', signed: true, fmt: (v) => v === 0 ? 'at the hole' : `${Math.abs(v)} cups ${v < 0 ? 'left' : 'right'}` },
    { key: 'pace', label: 'Pace', min: 0, max: 5, step: 0.25, unit: ' ft past', fmt: (v) => `${v} ft past` },
  ];
  for (const s of SL) {
    const input = h('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: state[s.key] });
    const out = h('output');
    rows[s.key] = { input, out, s };
    input.addEventListener('input', () => { state[s.key] = Number(input.value); syncRow(s.key); if (['distFt', 'slope', 'dir', 'stimp'].includes(s.key)) rebuildGreen(); else drawPreview(); });
    input.addEventListener('change', () => putt());
    ctl.append(h('div.ctl__row', { class: ['aim', 'pace'].includes(s.key) ? 'ctl__row is-focus' : 'ctl__row' }, h('label', s.label), input, out));
  }
  const dirChips = h('div.chips');
  for (const [name, deg] of Object.entries(DIRS)) dirChips.append(h('button.chip', { type: 'button', dataset: { deg }, onClick: () => { state.dir = deg; syncRow('dir'); rebuildGreen(); putt(); } }, name.replace(/-/g, ' ')));
  const puttBtn = h('button.btn.btn--gold.btn--sm', { type: 'button', onClick: () => putt() }, h('span.ic', { html: svgIcon.play }), 'Putt');
  const solveBtn = h('button.btn.btn--sm', { type: 'button', onClick: () => applySolution() }, 'Show me the line');
  const idealToggle = h('button.toggle.is-on', { type: 'button', onClick: () => { state.showIdeal = !state.showIdeal; idealToggle.classList.toggle('is-on', state.showIdeal); if (idealLine) idealLine.visible = state.showIdeal; } }, h('i'), 'Ideal line');
  ctl.append(h('div.ctl__row', h('label', 'Break'), dirChips), h('div.ctl__actions', puttBtn, solveBtn, idealToggle));
  const readout = h('div.readout');
  const insight = h('div.insight', h('span.ic', { html: svgIcon.spark }), h('div.insight__text'));
  root.append(h('div.module__bar', h('div.module__title', h('span.dot'), 'Green Reader'), h('div.module__hint', 'drag to orbit · set aim and pace · release to putt')), stageEl,
    h('div.module__panel', h('div', h('div.kicker.kicker--gold', 'The putt'), h('div', { style: { height: '10px' } }), ctl), h('div.stack', h('div.kicker', 'Read'), readout, insight)));
  if (preset.caption) root.append(h('div.module__caption', preset.caption));
  function nearestDir(v) { let best = DIR_NAMES[0]; for (const d of DIR_NAMES) { const dd = Math.min(Math.abs(d[0] - v), 360 - Math.abs(d[0] - v)); if (dd < Math.min(Math.abs(best[0] - v), 360 - Math.abs(best[0] - v))) best = d; } return best[1]; }
  function syncRow(k) { const { input, out, s } = rows[k]; input.value = state[k]; input.style.setProperty('--pct', `${((state[k] - s.min) / (s.max - s.min)) * 100}%`); out.textContent = s.fmt ? s.fmt(state[k]) : `${s.signed ? signed(state[k], 2) : state[k]}${s.unit}`; }
  Object.keys(rows).forEach(syncRow);

  // ---------- 3D ----------
  const stage = createStage(stageEl, { fov: 34, near: 0.05, far: 300, exposure: 1.05, postfx: { bloom: { strength: 0.35, radius: 0.5, threshold: 0.88 }, vignette: 0.5 } });
  let green = makeGreen({ slopePct: state.slope, dirDeg: state.dir });
  let controls, surface, ball, hole, flag, pathLine, idealLine, arrow, motes, roll = null, solution = null;
  const D = () => state.distFt * FT;
  if (stage) {
    const { scene, camera, renderer } = stage;
    const sunDir = new THREE.Vector3(0.55, 0.15, -0.82);
    buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.03, fogColor: '#0a161b', sunIntensity: 2.0 });
    scene.add(createRangeGround({ fairwayHalf: 0, sunDir, size: 200, behind: 40, rough: '#0d2416', glint: 0.05 }));
    motes = createMotes({ count: 120, center: [0, 0.8, -4], spread: [8, 2, 12], size: 0.06 }); scene.add(motes);
    ball = createBall({ lowPoly: quality.tier === 'low' }); scene.add(ball);
    hole = new THREE.Group();
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(HOLE_R, HOLE_R, 0.1, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, side: THREE.BackSide, roughness: 1 }));
    cup.position.y = -0.05; const rim = new THREE.Mesh(new THREE.RingGeometry(HOLE_R, HOLE_R + 0.012, 32), new THREE.MeshBasicMaterial({ color: 0xf1f1f1, side: THREE.DoubleSide })); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.002;
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(HOLE_R, 32), new THREE.MeshBasicMaterial({ color: 0x050505 })); bottom.rotation.x = -Math.PI / 2; bottom.position.y = -0.1;
    hole.add(cup, rim, bottom); scene.add(hole);
    flag = createFlag({ height: 2.1 }); scene.add(flag);
    arrow = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0xf3cf7a })); shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.2;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 12), shaft.material); tip.rotation.x = -Math.PI / 2; tip.position.z = -0.42;
    arrow.add(shaft, tip); scene.add(arrow);
    controls = new OrbitControls(camera, stage.canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI / 2 - 0.08; controls.minDistance = 1; controls.maxDistance = 30; controls.enablePan = false;
    for (const [name, label] of [['behind', 'Behind the ball'], ['hole', 'Behind the hole'], ['overhead', 'Overhead'], ['low', 'Low side']]) hudBL.firstChild.append(h('button', { type: 'button', dataset: { cam: name }, onClick: () => setCam(name) }, label));
    rebuildGreen();
    setCam('behind', true);
    stage.onFrame((dt, t) => { motes.userData.update(t); flag.userData.update(t); controls.update(); stepRoll(dt); });
    stage.start();
  } else { rebuildGreen(); }

  function setCam(name, instant) {
    if (!stage) return;
    hudBL.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.cam === name));
    const d = D();
    const cams = { behind: [[0.55, 1.35, 2.6], [0, 0, -d * 0.45]], hole: [[0, 1.0, -d - 2.2], [0, 0, -d * 0.4]], overhead: [[0, d * 0.9 + 3, -d * 0.5], [0, 0, -d * 0.5]], low: [[Math.sin(green.dirDeg * Math.PI / 180) * (d * 0.5 + 2.5), 0.7, -d * 0.5 - Math.cos(green.dirDeg * Math.PI / 180) * (d * 0.5 + 2.5)], [0, 0, -d * 0.5]] };
    const [p, l] = cams[name] || cams.behind;
    const pos = new THREE.Vector3(...p), look = new THREE.Vector3(...l);
    pos.y += green.height(pos.x, pos.z) * 0 + 0; look.y = green.height(look.x, look.z);
    if (instant || quality.reducedMotion) { stage.camera.position.copy(pos); controls.target.copy(look); controls.update(); return; }
    const p0 = stage.camera.position.clone(), t0 = controls.target.clone(); let k = 0;
    const off = stage.onFrame((dt) => { k = Math.min(1, k + dt * 1.5); const e = 1 - Math.pow(1 - k, 3); stage.camera.position.lerpVectors(p0, pos, e); controls.target.lerpVectors(t0, look, e); if (k >= 1) off(); });
  }
  function rebuildGreen() {
    green = makeGreen({ slopePct: state.slope, dirDeg: state.dir });
    solution = null;
    if (!stage) { drawPreview(); return; }
    const { scene } = stage;
    if (surface) { scene.remove(surface); surface.geometry.dispose(); }
    const d = D(), L = d + 10, W = Math.max(14, d + 8);
    const geo = new THREE.PlaneGeometry(W, L, 90, Math.round(L * 6)); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -d / 2 - 0.5);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, green.height(pos.getX(i), pos.getZ(i)));
    geo.computeVertexNormals();
    surface = new THREE.Mesh(geo, greenMaterial(green)); surface.material.uniforms.holeZ.value = -d; surface.receiveShadow = true; scene.add(surface);
    hole.position.set(0, green.height(0, -d) - 0.002, -d);
    flag.position.set(0, green.height(0, -d) - 0.06, -d);
    ball.position.set(0, green.height(0, 0) + BALL_RADIUS, 0);
    const [dx, dz] = green.downhill;
    arrow.position.set(0.35, green.height(0.35, -d + 0.3) + 0.03, -d + 0.3);
    arrow.rotation.y = Math.atan2(dx, -dz) * -1 + Math.PI; arrow.rotation.y = Math.atan2(-dx, -dz) + Math.PI;
    arrow.visible = state.slope > 0;
    drawPreview();
  }
  function greenMaterial(g) {
    return new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, holeZ: { value: -5 }, colorA: { value: new THREE.Color('#245c35') }, colorB: { value: new THREE.Color('#1e4f2d') }, fringe: { value: new THREE.Color('#163a22') }, rough: { value: new THREE.Color('#0e2417') }, sunDir: { value: new THREE.Vector3(0.55, 0.15, -0.82) }, fogColor: { value: new THREE.Color('#0a161b') }, fogDensity: { value: 0.03 } },
      vertexShader: `varying vec3 vW; varying vec3 vN; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `uniform vec3 colorA, colorB, sunDir, fogColor, fringe, rough; uniform float fogDensity, holeZ; varying vec3 vW; varying vec3 vN;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        void main(){
          float stripe = step(0.5, fract(vW.z / 1.2));
          vec3 col = mix(colorA, colorB, stripe);
          // putting surface is an ellipse around the ball-hole line; fringe then rough beyond it
          float mid = holeZ * 0.5; float rx = max(3.5, abs(holeZ) * 0.45 + 2.0), rz = abs(holeZ) * 0.5 + 3.0;
          float e = length(vec2(vW.x / rx, (vW.z - mid) / rz)) + (hash(floor(vW.xz * 3.0)) - 0.5) * 0.06;
          col = mix(col, fringe, smoothstep(0.95, 1.05, e));
          col = mix(col, rough, smoothstep(1.12, 1.3, e));
          col *= 0.9 + hash(floor(vW.xz * 40.0)) * 0.18;
          // faint contour lines every 2 cm of height so the tilt is legible
          float c = fract(vW.y / 0.02);
          float line = (1.0 - smoothstep(0.0, 0.035, min(c, 1.0 - c))) * (1.0 - smoothstep(0.9, 1.05, e));
          col += vec3(0.95, 0.82, 0.45) * line * 0.10;
          float diff = max(dot(normalize(vN), sunDir), 0.0);
          vec3 V = normalize(cameraPosition - vW); vec3 H = normalize(sunDir + V);
          col += vec3(1.0, 0.7, 0.42) * (pow(max(dot(normalize(vN), H), 0.0), 50.0) * 0.25 + diff * 0.12);
          float dist = length(cameraPosition - vW); float f = 1.0 - exp(-fogDensity * fogDensity * dist * dist);
          gl_FragColor = vec4(mix(col, fogColor, f), 1.0);
        }`,
    });
  }
  function makeLine(points, color, opacity, width) {
    const pos = []; for (const p of points) pos.push(p[0], green.height(p[0], p[1]) + 0.012, p[1]);
    if (pos.length < 6) pos.push(...pos.slice(0, 3));
    const geo = new LineGeometry(); geo.setPositions(pos);
    const mat = new LineMaterial({ color, linewidth: width, transparent: true, opacity, worldUnits: false, depthTest: true });
    mat.resolution.set(stage.size.w * stage.renderer.getPixelRatio(), stage.size.h * stage.renderer.getPixelRatio());
    const l = new Line2(geo, mat); l.computeLineDistances(); l.userData.total = points.length - 1; return l;
  }
  function drawPreview() {
    const args = { green, distFt: state.distFt, aimCups: state.aim, pastFt: state.pace, stimp: state.stimp };
    const r = rollPutt(args);
    if (!solution) solution = solvePutt({ green, distFt: state.distFt, stimp: state.stimp });
    renderRead(r);
    if (!stage) return;
    if (idealLine) { stage.scene.remove(idealLine); idealLine = null; }
    if (solution) {
      const ideal = rollPutt({ ...args, aimCups: solution.aim, pastFt: solution.pastFt });
      idealLine = makeLine(ideal.points, 0xf3cf7a, 0.35, 1.5); idealLine.visible = state.showIdeal; stage.scene.add(idealLine);
    }
  }
  function putt() {
    if (!stage) { drawPreview(); return; }
    const args = { green, distFt: state.distFt, aimCups: state.aim, pastFt: state.pace, stimp: state.stimp };
    const r = rollPutt(args);
    if (pathLine) stage.scene.remove(pathLine);
    pathLine = makeLine(r.points, 0x6ee7a8, 0.95, 2.5); pathLine.geometry.instanceCount = 0; stage.scene.add(pathLine);
    roll = { r, t: 0, idx: 0, done: false };
    ball.position.set(0, green.height(0, 0) + BALL_RADIUS, 0); ball.visible = true;
    hudTL.replaceChildren(h('div.hud__shot', h('b', 'Rolling…'), h('span', `${state.distFt} ft · ${state.slope}% ${nearestDir(state.dir).toLowerCase()}`)));
    sfx.strike('putter');
    if (quality.reducedMotion) { roll.t = 1e9; }
  }
  function stepRoll(dt) {
    if (!roll || roll.done) return;
    const pts = roll.r.points;
    roll.t += dt;
    while (roll.idx < pts.length - 2 && pts[roll.idx + 1][2] <= roll.t) roll.idx++;
    const a = pts[roll.idx], b = pts[Math.min(roll.idx + 1, pts.length - 1)];
    const span = Math.max(b[2] - a[2], 1e-4), k = THREE.MathUtils.clamp((roll.t - a[2]) / span, 0, 1);
    const x = a[0] + (b[0] - a[0]) * k, z = a[1] + (b[1] - a[1]) * k;
    ball.position.set(x, green.height(x, z) + BALL_RADIUS, z);
    ball.rotation.x -= dt * 6;
    pathLine.geometry.instanceCount = Math.min(roll.idx + 1, pathLine.userData.total);
    if (roll.t >= pts[pts.length - 1][2]) {
      roll.done = true; pathLine.geometry.instanceCount = pathLine.userData.total;
      if (roll.r.holed) { ball.visible = false; sfx.hole(); }
      renderResult(roll.r);
    }
  }
  function renderRead(r) {
    const cupsIn = (c) => `${fmt(Math.abs(c * HOLE_R * 2 / 0.0254))} in`;
    hudTR.replaceChildren(
      h('div.hud__stat', h('b', `${state.distFt} ft`), h('span', 'Distance')),
      h('div.hud__stat', h('b', `${state.slope}%`), h('span', 'Slope')),
      h('div.hud__stat', h('b', `${state.stimp}`), h('span', 'Stimp')),
      h('div.hud__stat.is-gold', h('b', solution ? `${Math.abs(solution.aim)} cups` : '–'), h('span', solution ? `aim ${solution.aim < 0 ? 'left' : solution.aim > 0 ? 'right' : 'centre'}` : 'no line')),
    );
    readout.replaceChildren(...[
      ['Aim', solution ? `${Math.abs(solution.aim)} cups ${solution.aim < 0 ? 'left' : solution.aim > 0 ? 'right' : ''} (${cupsIn(solution.aim)})` : 'No line at any pace'],
      ['Pace', solution ? `${solution.pastFt} ft past on flat` : '–'],
      ['Window', solution ? `${fmt((solution.max - solution.min) * HOLE_R * 2 / 0.0254)} in wide` : '–'],
      ['Your aim', state.aim === 0 ? 'At the hole' : `${Math.abs(state.aim)} cups ${state.aim < 0 ? 'left' : 'right'}`],
      ['Your pace', `${state.pace} ft past`],
      ['Ball speed', `${fmt(r.v0 * 2.237, 1)} mph`],
    ].map(([l, v]) => h('div', h('b', { style: { fontSize: '14px', fontWeight: '600' } }, v), h('span', l))));
    const dirName = nearestDir(state.dir).toLowerCase();
    insight.querySelector('.insight__text').innerHTML = state.slope === 0
      ? `A flat putt has no break; only pace matters. Roll it so it would finish about a foot past.`
      : solution
        ? `A ${state.distFt}-foot putt on a <b>${state.slope}% ${dirName}</b> slope at stimp ${state.stimp} needs the ball aimed about <b>${Math.abs(solution.aim)} cups ${solution.aim < 0 ? 'left' : 'right'}</b> of the hole with a pace that would run <b>${solution.pastFt} ft past</b> on a flat green. ${state.dir > 90 && state.dir < 270 ? 'Uphill putts break less and need more pace.' : state.dir < 90 || state.dir > 270 ? 'Downhill putts break more and need a gentler pace.' : 'Firmer pace straightens the line; softer pace needs more aim.'}`
        : `This putt is too severe to hole at any sensible pace. Lag it to the low side and take two.`;
  }
  function renderResult(r) {
    const name = r.holed ? 'Holed' : r.lipped ? 'Lipped out' : r.pastFt < -0.5 ? 'Short' : Math.abs(r.sideFt) > 0.4 ? `Missed ${r.sideFt > 0 ? 'right' : 'left'}` : 'Missed';
    const detail = r.holed ? `at ${fmt(r.v0 * 2.237, 1)} mph off the face` : `${fmt(Math.abs(r.pastFt), 1)} ft ${r.pastFt >= 0 ? 'past' : 'short'} · ${fmt(Math.abs(r.sideFt), 1)} ft ${r.sideFt >= 0 ? 'right' : 'left'}`;
    hudTL.replaceChildren(h('div.hud__shot', h('b', { style: r.holed ? { color: 'var(--green-bright)' } : {} }, name), h('span', detail)));
  }
  function applySolution() {
    if (!solution) solution = solvePutt({ green, distFt: state.distFt, stimp: state.stimp });
    if (!solution) return;
    state.aim = solution.aim; state.pace = solution.pastFt; syncRow('aim'); syncRow('pace'); drawPreview(); putt();
  }
  drawPreview();
  if (stage && !quality.reducedMotion) setTimeout(() => putt(), 700);
  return { state, putt, applySolution };
}
