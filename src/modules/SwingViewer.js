import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, createTee, BALL_RADIUS } from '../objects/ball.js';
import { createRangeGround, createMotes, createTreeLine } from '../objects/terrain.js';
import { createDistanceArcs, createLandingRing } from '../objects/markers.js';
import { shoot } from '../physics/ballFlight.js';
import { createSwingModel, createGolferRig, POSITIONS, SWING_PRESETS } from '../objects/golfer.js';
import { h, svgIcon, fmt, signed } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

const CAMERAS = {
  'down-the-line': { pos: [-0.3, 1.55, 4.9], look: [-0.35, 1.0, 0] },
  'face-on': { pos: [4.6, 1.4, 0.05], look: [-0.45, 1.0, 0.05] },
  'overhead': { pos: [0.3, 5.6, 0.6], look: [-0.4, 0, 0.1] },
  'three-quarter': { pos: [3.4, 2.1, 3.8], look: [-0.4, 0.95, 0.05] },
};
const PHYS_CLUB = { driver: 'driver', '3-wood': '3-wood', iron: '7-iron', wedge: 'pitching-wedge', chip: '9-iron', putter: null };
const YD = 0.9144;
const CLUB_LABELS = { driver: 'Driver', '3-wood': '3-wood', iron: '7-iron', wedge: 'Wedge pitch', chip: 'Chip', putter: 'Putter' };

export function mountSwingViewer(root, preset = {}) {
  const state = {
    club: SWING_PRESETS[preset.club] ? preset.club : 'iron',
    camera: CAMERAS[preset.camera] ? preset.camera : 'three-quarter',
    highlight: Array.isArray(preset.highlight) ? preset.highlight : [],
    t: 0, playing: !quality.reducedMotion, speed: 0.35, loop: true, showPlane: true, showTrail: true, follow: false,
  };
  root.classList.add('module', 'module--swing');
  const stageEl = h('div.module__stage');
  const hudPos = h('div.module__now');
  const hudRead = h('div.hud.hud--br.hud--compact');
  const hudShot = h('div.hud.hud--tl');
  const hudCams = h('div.hud.hud--bl', h('div.hud__pos'));
  stageEl.append(hudShot, hudRead, hudCams);

  // Controls
  const scrubInput = h('input', { type: 'range', min: 0, max: 1000, step: 1, value: 0, 'aria-label': 'Swing position' });
  const marks = h('div.scrub__marks');
  const scrub = h('div.scrub', h('div.scrub__track', scrubInput, marks));
  const playBtn = h('button.iconbtn', { type: 'button', title: 'Play / pause', html: svgIcon.pause });
  const speedSeg = h('div.seg');
  for (const s of [0.15, 0.35, 1]) speedSeg.append(h('button', { type: 'button', dataset: { speed: s }, onClick: () => setSpeed(s) }, s === 1 ? 'Real time' : `${s}×`));
  const posButtons = h('div.hud__pos');
  for (const p of POSITIONS) posButtons.append(h('button', { type: 'button', dataset: { id: p.id }, class: state.highlight.includes(p.id) ? 'is-highlight' : '', onClick: () => jumpTo(p.id) }, p.short));
  const clubSeg = h('div.chips');
  for (const c of Object.keys(SWING_PRESETS)) clubSeg.append(h('button.chip', { type: 'button', dataset: { club: c }, onClick: () => setClub(c) }, CLUB_LABELS[c]));
  const planeToggle = h('button.toggle.is-on', { type: 'button', onClick: () => { state.showPlane = !state.showPlane; planeToggle.classList.toggle('is-on', state.showPlane); if (plane) plane.visible = state.showPlane; } }, h('i'), 'Swing plane');
  const trailToggle = h('button.toggle.is-on', { type: 'button', onClick: () => { state.showTrail = !state.showTrail; trailToggle.classList.toggle('is-on', state.showTrail); if (trail) { trail.visible = state.showTrail; ribbon.visible = state.showTrail; } } }, h('i'), 'Club trail');
  const ctl = h('div.ctl',
    h('div.kicker.kicker--gold', 'Scrub the swing'), scrub,
    h('div.ctl__row', h('label', 'Positions'), posButtons),
    h('div.ctl__row', h('label', 'Shot'), clubSeg),
  );
  const hitBtn = h('button.btn.btn--gold.btn--sm', { type: 'button', onClick: () => hitAndFollow() }, h('span.ic', { html: svgIcon.play }), 'Hit & follow the ball');
  const actions = h('div.module__actions', hitBtn, playBtn, speedSeg, planeToggle, trailToggle);
  const posInfo = h('div.stack');
  const panel = h('div.module__panel', ctl, posInfo);
  root.append(h('div.module__bar', h('div.module__title', h('span.dot'), 'Swing Plane Viewer'), h('div.module__hint', 'drag to orbit · scroll to zoom · scrub P1–P10')), stageEl, hudPos, actions, panel);
  if (preset.caption) root.append(h('div.module__caption', preset.caption));

  // Scene
  const stage = createStage(stageEl, { fov: 38, near: 0.05, far: 900, exposure: 1.05, postfx: { bloom: { strength: 0.38, radius: 0.5, threshold: 0.88 }, vignette: 0.5, grain: 0.03 } });
  let model, rig, plane, trail, ribbon, ball, tee, controls, motes, headPath = [], trailTotal = 0;
  let flight = null, shotTracer = null, landingRing = null, comet = null;
  const cam = { pos: new THREE.Vector3(), look: new THREE.Vector3(), goal: new THREE.Vector3(), aim: new THREE.Vector3(), vel: new THREE.Vector3(), lookVel: new THREE.Vector3() };
  const fade = h('div.stage-fade'); stageEl.append(fade);
  const P0 = new THREE.Vector3(), P1 = new THREE.Vector3(), P2 = new THREE.Vector3(), tmpV = new THREE.Vector3(), velDir = new THREE.Vector3();
  const sunDir = new THREE.Vector3(0.62, 0.09, -0.77);
  if (stage) {
    const { scene, camera, renderer } = stage;
    buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.0065, fogColor: '#0a161b', sunIntensity: 1.9, shadows: false, skyIntensity: 0.95 });
    scene.add(createRangeGround({ fairwayHalf: 22, sunDir, stripeWidth: 6, size: 900, behind: 60, glint: 0.06 }));
    scene.add(createTreeLine({ side: 1, count: 160, seed: 3, xMin: 48, xMax: 140 }), createTreeLine({ side: -1, count: 160, seed: 7, xMin: 48, xMax: 140 }));
    scene.add(createDistanceArcs({ distances: [50, 100, 150, 200, 250] }));
    landingRing = createLandingRing(); scene.add(landingRing);
    comet = new THREE.Sprite(new THREE.SpriteMaterial({ map: cometTexture(), color: 0xfff1c9, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, opacity: 0 }));
    comet.scale.set(0.5, 0.5, 1); comet.renderOrder = 30; scene.add(comet);
    // practice mat + alignment lines
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), new THREE.MeshStandardMaterial({ color: 0x0e1c16, roughness: 0.95 }));
    mat.rotation.x = -Math.PI / 2; mat.position.set(-0.55, 0.004, 0.05); scene.add(mat);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x6ee7a8, transparent: true, opacity: 0.5 });
    for (const [x, len] of [[0, 6], [-0.62, 1.4]]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.012, len), lineMat); l.rotation.x = -Math.PI / 2; l.position.set(x, 0.006, -len / 2 + 1); scene.add(l); }
    motes = createMotes({ count: quality.tier === 'low' ? 80 : 220, center: [0, 1.4, 0], spread: [8, 3, 8], size: 0.06 }); scene.add(motes);
    ball = createBall({ lowPoly: quality.tier === 'low' }); tee = createTee(); scene.add(ball, tee);
    controls = new OrbitControls(camera, stage.canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 1.2; controls.maxDistance = 9; controls.maxPolarAngle = Math.PI / 2 - 0.02; controls.enablePan = false;
    controls.addEventListener('start', () => hudCams.querySelectorAll('button').forEach((b) => b.classList.remove('is-active')));
    build();
    setCamera(state.camera, true);
    stage.onFrame((dt, t) => {
      motes.userData.update(t);
      landingRing.userData.update(t);
      if (state.playing) {
        state.t += dt * state.speed;
        const done = state.follow ? (flight?.landed && flight.holdT > 1.8) : state.t > model.duration + 0.5;
        if (done) { if (state.follow) endFollow(); if (state.loop) state.t = 0; else { state.t = model.duration; state.playing = false; playBtn.innerHTML = svgIcon.play; } }
      }
      applyTime(dt);
      if (state.follow && flight) updateFollowCamera(dt); else controls.update();
    });
    stage.start();
  } else {
    model = createSwingModel(state.club);
  }

  function build() {
    if (rig) { stage.scene.remove(rig.group, plane, trail, ribbon); }
    model = createSwingModel(state.club);
    rig = createGolferRig(model); stage.scene.add(rig.group);
    tee.visible = !!model.preset.tee; ball.position.set(0, model.ballY + BALL_RADIUS, 0);
    plane = makePlane(model); plane.visible = state.showPlane; stage.scene.add(plane);
    ({ trail, ribbon, headPath, trailTotal } = makeTrail(model)); trail.visible = ribbon.visible = state.showTrail; stage.scene.add(trail, ribbon);
    buildMarks();
    state.t = 0; resetFlight();
  }
  function cometTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.3, 'rgba(255,240,200,0.8)'); grd.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  // ---------- Real ball flight after impact (shared physics with the Ball Flight Lab) ----------
  function resetFlight() {
    if (shotTracer) { stage.scene.remove(shotTracer); shotTracer = null; }
    flight = null; if (landingRing) landingRing.visible = false; if (comet) comet.material.opacity = 0;
  }
  function launch() {
    const phys = PHYS_CLUB[model.preset.club];
    if (!phys) return;
    const result = shoot({ club: phys });
    const F = result.flight;
    const positions = [], colors = [], gold = new THREE.Color(model.preset.club === 'driver' || model.preset.club === '3-wood' ? 0xf3cf7a : 0x6ee7a8);
    for (const p of F.points) { positions.push(p[0], Math.max(p[1], 0.03), p[2]); colors.push(gold.r, gold.g, gold.b); }
    const geo = new LineGeometry(); geo.setPositions(positions); geo.setColors(colors);
    const mat = new LineMaterial({ vertexColors: true, linewidth: 2.4, transparent: true, opacity: 0.95, worldUnits: false });
    mat.resolution.set(stage.size.w * stage.renderer.getPixelRatio(), stage.size.h * stage.renderer.getPixelRatio());
    shotTracer = new Line2(geo, mat); shotTracer.computeLineDistances(); shotTracer.geometry.instanceCount = 0; shotTracer.userData.total = F.points.length - 1;
    stage.scene.add(shotTracer);
    flight = { result, t: 0, idx: 0, landed: false, holdT: 0 };
    comet.material.opacity = 1;
    const last = F.points[F.points.length - 1];
    const side = F.curve >= 0 ? -1 : 1;
    P0.copy(stage.camera.position);
    P1.set(side * (12 + F.carry * 0.045), 5 + F.apex * 0.5, last[2] * 0.45);
    P2.set(last[0] + side * (9 + F.carry * 0.03), 3.5 + F.apex * 0.18, last[2] + 26);
    hudShot.replaceChildren(h('div.hud__shot', h('b', `${fmt(F.carry)} yd carry`), h('span', `${result.shot.name} · ${fmt(result.launch.ballSpeedMph)} mph · ${fmt(result.launch.launch, 1)}° launch · ${fmt(result.launch.spinRpm)} rpm`)));
    sfx.strike(model.preset.club === 'driver' ? 'driver' : 'iron');
  }
  function updateFlight(dt) {
    if (!flight) return;
    const F = flight.result.flight, pts = F.points;
    if (!flight.landed) {
      flight.t += dt * (state.follow ? 1.15 : state.speed);
      while (flight.idx < pts.length - 2 && pts[flight.idx + 1][3] <= flight.t) flight.idx++;
      const a = pts[flight.idx], b = pts[Math.min(flight.idx + 1, pts.length - 1)];
      const k = THREE.MathUtils.clamp((flight.t - a[3]) / Math.max(b[3] - a[3], 1e-4), 0, 1);
      ball.position.set(a[0] + (b[0] - a[0]) * k, Math.max(a[1] + (b[1] - a[1]) * k, BALL_RADIUS), a[2] + (b[2] - a[2]) * k);
      ball.visible = true; ball.rotation.x -= dt * 30;
      velDir.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
      shotTracer.geometry.instanceCount = Math.min(flight.idx + 1, shotTracer.userData.total);
      comet.position.copy(ball.position); comet.scale.setScalar(THREE.MathUtils.clamp(stage.camera.position.distanceTo(ball.position) * 0.012, 0.3, 2.2));
      if (flight.t >= pts[pts.length - 1][3]) { flight.landed = true; shotTracer.geometry.instanceCount = shotTracer.userData.total; const last = pts[pts.length - 1]; landingRing.position.set(last[0], 0.02, last[2]); landingRing.visible = true; comet.material.opacity = 0; }
    } else flight.holdT += dt;
  }
  function hitAndFollow() {
    if (!stage) return;
    state.follow = true; state.prevSpeed = state.speed; state.speed = 1; state.t = 0; state.playing = true; playBtn.innerHTML = svgIcon.pause;
    resetFlight(); controls.enabled = false; cam.pos.copy(stage.camera.position); cam.look.copy(controls.target); cam.goal.copy(cam.pos); cam.aim.copy(cam.look); cam.vel.set(0, 0, 0); cam.lookVel.set(0, 0, 0);
    hitBtn.disabled = true;
  }
  function endFollow() {
    state.follow = false; state.speed = state.prevSpeed || 0.35; hitBtn.disabled = false;
    fade.classList.add('is-on');
    setTimeout(() => { controls.enabled = true; setCamera(state.camera, true); resetFlight(); hudShot.replaceChildren(); requestAnimationFrame(() => fade.classList.remove('is-on')); }, 190);
  }
  function smoothDamp(cur, target, vel, key, smoothTime, dt) {
    const omega = 2 / Math.max(smoothTime, 1e-3), x = omega * dt, ex = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const change = cur - target, temp = (vel[key] + omega * change) * dt; vel[key] = (vel[key] - omega * temp) * ex;
    let out = target + (change + temp) * ex; if ((target - cur > 0) === (out > target)) { out = target; vel[key] = 0; } return out;
  }
  function dampVec(v, target, vel, st, dt) { v.x = smoothDamp(v.x, target.x, vel, 'x', st, dt); v.y = smoothDamp(v.y, target.y, vel, 'y', st, dt); v.z = smoothDamp(v.z, target.z, vel, 'z', st, dt); }
  function updateFollowCamera(dt) {
    const F = flight.result.flight, total = F.points[F.points.length - 1][3];
    const k = THREE.MathUtils.clamp(flight.t / total, 0, 1), kk = Math.min(1, k / 0.85), e = kk * kk * (3 - 2 * kk), u = 1 - e;
    cam.goal.set(0, 0, 0).addScaledVector(P0, u * u).addScaledVector(P1, 2 * u * e).addScaledVector(P2, e * e);
    if (!flight.landed) { const lead = 5 + 0.06 * cam.pos.distanceTo(ball.position); cam.aim.copy(ball.position).addScaledVector(velDir, lead).add(tmpV.set(0, 0.35 + 0.02 * lead, 0)); }
    else cam.aim.copy(ball.position).add(tmpV.set(0, 0.4, -2));
    dampVec(cam.pos, cam.goal, cam.vel, 0.55, dt); dampVec(cam.look, cam.aim, cam.lookVel, 0.32, dt);
    stage.camera.position.copy(cam.pos); stage.camera.lookAt(cam.look);
  }
  function makePlane(m) {
    const geo = new THREE.PlaneGeometry(3.4, 2.7, 1, 1);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { color: { value: new THREE.Color(0xf3cf7a) }, color2: { value: new THREE.Color(0x6ee7a8) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 color, color2; varying vec2 vUv;
        void main(){ vec2 g = abs(fract(vUv * vec2(8.0, 6.0)) - 0.5); float line = 1.0 - smoothstep(0.0, 0.05, min(g.x, g.y));
          float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(0.0, 0.25, 1.0 - vUv.x) * smoothstep(0.08, 0.35, vUv.y) * smoothstep(0.0, 0.25, 1.0 - vUv.y);
          vec3 c = mix(color2, color, vUv.y); gl_FragColor = vec4(c, (0.04 + line * 0.2) * edge); }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    // Orient: plane spanned by e1 (target line) and e2, passing through the ball, centred a bit up the plane.
    const basis = new THREE.Matrix4().makeBasis(m.e1.clone(), m.e2.clone(), m.normal.clone());
    mesh.quaternion.setFromRotationMatrix(basis);
    mesh.position.set(0, m.ballY, 0).addScaledVector(m.e2, 1.15).addScaledVector(m.e1, 0.0);
    mesh.renderOrder = 8;
    return mesh;
  }
  function makeTrail(m) {
    const N = 160, positions = [], colors = [], strip = [], stripCol = [];
    const gold = new THREE.Color(0xf3cf7a), green = new THREE.Color(0x6ee7a8);
    const path = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * m.duration;
      const p = m.pose(t);
      path.push({ t, head: p.head.clone(), hands: p.hands.clone() });
      positions.push(p.head.x, p.head.y, p.head.z);
      const c = t < m.times[6] ? gold.clone().lerp(green, t / m.times[6]) : green.clone().lerp(gold, (t - m.times[6]) / (m.duration - m.times[6]) * 0.6);
      colors.push(c.r, c.g, c.b);
      strip.push(p.hands.x, p.hands.y, p.hands.z, p.head.x, p.head.y, p.head.z);
      stripCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    const geo = new LineGeometry(); geo.setPositions(positions); geo.setColors(colors);
    const lm = new LineMaterial({ vertexColors: true, linewidth: 2.2, transparent: true, opacity: 0.9, worldUnits: false });
    lm.resolution.set(stage.size.w * stage.renderer.getPixelRatio(), stage.size.h * stage.renderer.getPixelRatio());
    const line = new Line2(geo, lm); line.computeLineDistances();
    // Ribbon of shaft positions (light painting)
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(strip, 3));
    rg.setAttribute('color', new THREE.Float32BufferAttribute(stripCol, 3));
    const idx = [];
    for (let i = 0; i < N; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    rg.setIndex(idx);
    const rm = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const rib = new THREE.Mesh(rg, rm); rib.renderOrder = 9;
    return { trail: line, ribbon: rib, headPath: path, trailTotal: N };
  }
  function buildMarks() {
    marks.replaceChildren();
    for (let i = 0; i < 10; i++) {
      const u = model.times[i] / model.duration;
      marks.append(h('i', { style: { left: `${u * 100}%` }, class: state.highlight.includes(i + 1) ? 'is-highlight' : '' }, `P${i + 1}`));
    }
  }
  function applyTime(dt = 0) {
    const t = Math.min(state.t, model.duration);
    const p = model.pose(t);
    rig.apply(p);
    scrubInput.value = Math.round((t / model.duration) * 1000);
    scrubInput.style.setProperty('--pct', `${(t / model.duration) * 100}%`);
    const seg = Math.min(trailTotal, Math.floor((t / model.duration) * trailTotal));
    trail.geometry.instanceCount = seg;
    ribbon.geometry.setDrawRange(0, seg * 6);
    // Ball: sits on the tee until impact, then flies the real physics trajectory for this club.
    const impactT = model.times[6];
    if (t < impactT) { if (flight) resetFlight(); ball.position.set(0, model.ballY + BALL_RADIUS, 0); ball.visible = true; }
    else if (state.playing || state.follow) {
      if (!flight && PHYS_CLUB[model.preset.club]) launch();
      if (flight) updateFlight(dt);
      else { const k = t - impactT; const v = model.preset.club === 'putter' ? 2.5 : 8; ball.position.set(0, model.ballY + BALL_RADIUS, -v * k); ball.visible = k < 0.6; }
    } else if (!flight) ball.visible = false;
    // Position readout
    let pi = 0; while (pi < 9 && model.times[pi + 1] <= t) pi++;
    const posIdx = (t - model.times[pi]) / Math.max(model.times[pi + 1] - model.times[pi], 1e-3) > 0.5 ? Math.min(pi + 1, 9) : pi;
    const P = POSITIONS[posIdx];
    if (hudPos.dataset.pos !== String(P.id)) {
      hudPos.dataset.pos = String(P.id);
      hudPos.replaceChildren(h('b', `${P.short} · ${P.name}`), h('span', P.note));
      posButtons.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.id) === P.id));
      renderPosInfo(P);
    }
    hudRead.replaceChildren(
      stat('Shoulders', signed(p.shYaw / (Math.PI / 180), 0, '°')), stat('Hips', signed(p.hipYaw / (Math.PI / 180), 0, '°')),
      stat('Wrist set', `${fmt(Math.abs(p.phi / (Math.PI / 180)))}°`), stat('Time', `${fmt(t, 2)} s`),
    );
  }
  function stat(l, v) { return h('div.hud__stat', h('b', v), h('span', l)); }
  function renderPosInfo(P) {
    posInfo.replaceChildren(
      h('div.kicker', 'Checkpoint'),
      h('h3', { style: { margin: '6px 0 6px' } }, `${P.short} — ${P.name}`),
      h('p', { class: 'muted', style: { fontSize: '15px' } }, P.note),
      h('div.divider'),
      h('div', { style: { fontSize: '13px', color: 'var(--ink-3)' } }, 'The ', h('b', 'gold pane'), ' is the swing plane, a sheet that runs through the ball at the angle of the shaft. When you\'re on plane the club stays on that sheet. ', h('b', 'The trail'), ' is the path of the club head, and the faint ribbon is the shaft sweeping through behind it.'),
      state.highlight.length ? h('div.insight', h('span.ic', { html: svgIcon.spark }), h('div', 'This lesson is mostly about ', h('b', state.highlight.map((i) => `P${i}`).join(', ')), '. The buttons above will jump you straight there.')) : null,
    );
  }
  function setCamera(name, instant = false) {
    if (!stage) return;
    state.camera = name;
    const c = CAMERAS[name];
    const target = new THREE.Vector3(...c.look), pos = new THREE.Vector3(...c.pos);
    hudCams.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.cam === name));
    if (instant || quality.reducedMotion) { stage.camera.position.copy(pos); controls.target.copy(target); controls.update(); return; }
    const p0 = stage.camera.position.clone(), t0 = controls.target.clone(); let k = 0;
    const off = stage.onFrame((dt) => { k = Math.min(1, k + dt * 1.6); const e = 1 - Math.pow(1 - k, 3); stage.camera.position.lerpVectors(p0, pos, e); controls.target.lerpVectors(t0, target, e); if (k >= 1) off(); });
  }
  function setSpeed(s) { state.speed = s; speedSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.speed) === s)); }
  function setClub(c) { state.club = c; clubSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.club === c)); if (stage) build(); else model = createSwingModel(c); }
  function jumpTo(id) { if (state.follow) endFollow(); state.t = model.times[id - 1]; state.playing = false; playBtn.innerHTML = svgIcon.play; sfx.tick(); if (!stage) return; resetFlight(); applyTime(); }

  playBtn.addEventListener('click', () => { state.playing = !state.playing; playBtn.innerHTML = state.playing ? svgIcon.pause : svgIcon.play; if (state.playing && state.t >= model.duration) state.t = 0; });
  scrubInput.addEventListener('input', () => { if (state.follow) endFollow(); state.playing = false; playBtn.innerHTML = svgIcon.play; state.t = (Number(scrubInput.value) / 1000) * model.duration; if (stage) resetFlight(); });
  for (const [name, label] of [['three-quarter', '¾ view'], ['face-on', 'Face-on'], ['down-the-line', 'Down the line'], ['overhead', 'Overhead']]) {
    hudCams.firstChild.append(h('button', { type: 'button', dataset: { cam: name }, onClick: () => setCamera(name) }, label));
  }
  setSpeed(state.speed);
  clubSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.club === state.club));
  if (!state.playing) playBtn.innerHTML = svgIcon.play;
  renderPosInfo(POSITIONS[0]);
  if (!stage) { hudPos.replaceChildren(); hitBtn.disabled = true; posInfo.prepend(h('p.muted', 'Interactive 3D needs WebGL. The checkpoints below still apply.')); }
  return { state, stage, jumpTo, setClub, hitAndFollow };
}
