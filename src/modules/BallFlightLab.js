import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, createTee, BALL_RADIUS } from '../objects/ball.js';
import { createClub } from '../objects/clubs.js';
import { createRangeGround, createTreeLine, createMotes } from '../objects/terrain.js';
import { createTargetLine, createDistanceArcs, createFlag, createLandingRing } from '../objects/markers.js';
import { CLUBS, shoot, impact } from '../physics/ballFlight.js';
import { h, svgIcon, fmt, signed } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

const YD = 0.9144;
const CLUB_MODEL = { 'driver': 'driver', '3-wood': '3-wood', '5-iron': '5-iron', '7-iron': '7-iron', '9-iron': '9-iron', 'pitching-wedge': 'pitching-wedge', 'sand-wedge': 'sand-wedge' };
const TOUR = { driver: [113, -1.3], '3-wood': [107, -2.9], '5-iron': [94, -3.7], '7-iron': [90, -4.3], '9-iron': [85, -4.7], 'pitching-wedge': [83, -5], 'sand-wedge': [78, -5.5] };

const SLIDERS = [
  { key: 'speed', label: 'Club speed', min: 55, max: 125, step: 1, unit: ' mph' },
  { key: 'attack', label: 'Attack angle', min: -8, max: 8, step: 0.5, unit: '°', signed: true },
  { key: 'path', label: 'Club path', min: -10, max: 10, step: 0.5, unit: '°', signed: true, hint: '+ in-to-out' },
  { key: 'face', label: 'Face angle', min: -10, max: 10, step: 0.5, unit: '°', signed: true, hint: '+ open' },
  { key: 'strike', label: 'Strike', min: -15, max: 15, step: 1, unit: ' mm', signed: true, hint: '+ toe' },
];
const PRESETS = [
  { name: 'Stock', set: (c) => ({ speed: CLUBS[c].speed, attack: CLUBS[c].attack, path: 0, face: 0, strike: 0 }) },
  { name: 'Tour', set: (c) => ({ speed: TOUR[c][0], attack: TOUR[c][1], path: 0.5, face: 0.2, strike: 0 }) },
  { name: 'Slice', set: () => ({ path: -6, face: 5, strike: -4 }) },
  { name: 'Hook', set: () => ({ path: 4, face: -4, strike: 4 }) },
  { name: 'Push-draw', set: () => ({ path: 5, face: 2, strike: 0 }) },
  { name: 'Pull-fade', set: () => ({ path: -5, face: -2, strike: 0 }) },
];

export function mountBallFlightLab(root, preset = {}) {
  const state = {
    club: CLUBS[preset.club] ? preset.club : '7-iron',
    speed: null, attack: null, path: preset.path ?? 0, face: preset.face ?? 0, strike: 0,
    focus: preset.focus || null, compare: true,
  };
  state.speed = preset.speed ?? CLUBS[state.club].speed;
  state.attack = preset.attack ?? CLUBS[state.club].attack;

  // ---------- DOM ----------
  root.classList.add('module', 'module--lab');
  const stageEl = h('div.module__stage');
  const hudShot = h('div.hud.hud--tl', h('div.hud__shot', h('b', 'Ready'), h('span', 'Set the sliders and hit')));
  const hudStats = h('div.hud.hud--tr');
  const hudLaunch = h('div.hud.hud--bl');
  const mini = h('canvas.lab__mini', { width: 220, height: 150 });
  const hudMini = h('div.hud.hud--br', mini);
  const fallback = h('div.webgl-fallback', { style: { backgroundImage: 'url(https://d8j0ntlcm91z4.cloudfront.net/user_3FQ6hJE1ducm6cZtplfchRi2NhJ/hf_20260907_183956_6cc3ebb2-9813-4b35-a071-3f75b0ae6efb.png)' } });
  stageEl.append(fallback, hudShot, hudStats, hudLaunch, hudMini);

  const clubSeg = h('div.chips');
  const sliderRows = {};
  const ctl = h('div.ctl');
  ctl.append(h('div.ctl__row.ctl__row--top', h('label', 'Club'), clubSeg));
  for (const s of SLIDERS) {
    const input = h('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: state[s.key] });
    const out = h('output');
    const row = h('div.ctl__row', { class: state.focus === s.key ? 'ctl__row is-focus' : 'ctl__row' }, h('label', s.label, s.hint ? h('small.muted', ` ${s.hint}`) : null), input, out);
    sliderRows[s.key] = { input, out, row, spec: s };
    input.addEventListener('input', () => { state[s.key] = Number(input.value); syncSlider(s.key); previewLaunch(); });
    input.addEventListener('change', () => hit());
    ctl.append(row);
  }
  const presetChips = h('div.chips');
  for (const p of PRESETS) presetChips.append(h('button.chip', { type: 'button', onClick: () => { Object.assign(state, p.set(state.club)); syncAll(); hit(); } }, p.name));
  const hitBtn = h('button.btn.btn--gold.btn--sm', { type: 'button', onClick: () => hit() }, h('span', { html: svgIcon.play, class: 'ic' }), 'Hit');
  const clearBtn = h('button.btn.btn--sm', { type: 'button', onClick: () => clearTracers() }, 'Clear tracers');
  const compareToggle = h('button.toggle.is-on', { type: 'button', onClick: () => { state.compare = !state.compare; compareToggle.classList.toggle('is-on', state.compare); if (!state.compare) clearTracers(true); } }, h('i'), 'Keep previous tracers');
  ctl.append(h('div.ctl__row', h('label', 'Presets'), presetChips));
  const actions = h('div.module__actions', hitBtn, clearBtn, compareToggle);

  const readout = h('div.readout');
  const insight = h('div.insight', h('span.ic', { html: svgIcon.spark }), h('div.insight__text', 'Change the face or the path and watch what the ball does.'));
  const panelRight = h('div.stack', h('div.kicker', 'Launch monitor'), readout, insight);
  const panel = h('div.module__panel', h('div', h('div.kicker.kicker--gold', 'Delivery'), h('div', { style: { height: '10px' } }), ctl), panelRight);
  root.append(
    h('div.module__bar', h('div.module__title', h('span.dot'), 'Ball Flight Lab'), h('div.module__hint', 'release a slider to fire · every number is computed from physics')),
    stageEl, actions, panel,
  );
  if (preset.caption) root.append(h('div.module__caption', preset.caption));

  for (const c of Object.keys(CLUBS)) {
    clubSeg.append(h('button.chip', { type: 'button', dataset: { club: c }, onClick: () => selectClub(c) }, CLUBS[c].name));
  }

  // ---------- 3D ----------
  const stage = createStage(stageEl, { fov: 36, near: 0.05, far: 1500, exposure: 1.05, postfx: { bloom: { strength: 0.42, radius: 0.5, threshold: 0.86 }, vignette: 0.5, grain: 0.035 } });
  const sunDir = new THREE.Vector3(0.7, 0.09, -0.71);
  let ball, tee, club, tracerGroup, landingRing, motes, comet, flags = [];
  const ghosts = [];
  let current = null;         // { shot, tracer, t, playing, idx }
  // Camera choreography: critically damped smoothing toward a goal position and an aim point.
  const restPos = new THREE.Vector3(1.25, 1.85, 3.6);
  const restLook = new THREE.Vector3(0, 0.4, -12);
  const cam = { goal: restPos.clone(), aim: restLook.clone(), pos: restPos.clone(), look: restLook.clone(), vel: new THREE.Vector3(), lookVel: new THREE.Vector3(), fov: 36, fovGoal: 36, fovVel: { v: 0 } };
  const P1 = new THREE.Vector3(), P2 = new THREE.Vector3();
  const tmp = new THREE.Vector3(), velDir = new THREE.Vector3();
  const fade = h('div.stage-fade');
  stageEl.append(fade);
  // Unity-style SmoothDamp on one axis.
  function smoothDamp(cur, target, velObj, key, smoothTime, dt) {
    const omega = 2 / Math.max(smoothTime, 1e-3), x = omega * dt;
    const ex = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const change = cur - target;
    const temp = (velObj[key] + omega * change) * dt;
    velObj[key] = (velObj[key] - omega * temp) * ex;
    let out = target + (change + temp) * ex;
    if ((target - cur > 0) === (out > target)) { out = target; velObj[key] = 0; }
    return out;
  }
  function dampVec(v, target, vel, smoothTime, dt) {
    v.x = smoothDamp(v.x, target.x, vel, 'x', smoothTime, dt);
    v.y = smoothDamp(v.y, target.y, vel, 'y', smoothTime, dt);
    v.z = smoothDamp(v.z, target.z, vel, 'z', smoothTime, dt);
  }
  function cutTo(pos, look) {
    fade.classList.add('is-on');
    setTimeout(() => {
      cam.pos.copy(pos); cam.goal.copy(pos); cam.look.copy(look); cam.aim.copy(look);
      cam.vel.set(0, 0, 0); cam.lookVel.set(0, 0, 0);
      requestAnimationFrame(() => fade.classList.remove('is-on'));
    }, 190);
  }

  if (stage) {
    const { scene, camera, renderer } = stage;
    buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.0055, fogColor: '#0a161b', sunIntensity: 2.2, skyIntensity: 1.0 });
    scene.add(createRangeGround({ fairwayHalf: 26, sunDir, stripeWidth: 8, glint: 0.05 }));
    scene.add(createTreeLine({ side: 1, count: 220, seed: 3, xMin: 52, xMax: 150 }), createTreeLine({ side: -1, count: 220, seed: 7, xMin: 52, xMax: 150 }));
    scene.add(createTargetLine({ length: 320 }));
    scene.add(createDistanceArcs({ distances: [50, 100, 150, 200, 250, 300] }));
    for (const [d, x] of [[100, -7], [150, 9], [200, -5], [250, 8]]) {
      const f = createFlag({ height: 2.4 });
      f.position.set(x, 0, -d * YD);
      const green = new THREE.Mesh(new THREE.CircleGeometry(9, 40), new THREE.MeshBasicMaterial({ color: 0x2f7a46, transparent: true, opacity: 0.35, depthWrite: false }));
      green.rotation.x = -Math.PI / 2; green.position.set(x, 0.02, -d * YD);
      scene.add(f, green); flags.push(f);
    }
    motes = createMotes({ count: quality.tier === 'low' ? 120 : 360, center: [0, 1.5, -8], spread: [30, 4, 40] });
    scene.add(motes);
    ball = createBall({ lowPoly: quality.tier === 'low' });
    tee = createTee();
    scene.add(ball, tee);
    landingRing = createLandingRing();
    scene.add(landingRing);
    comet = new THREE.Sprite(new THREE.SpriteMaterial({ map: cometTexture(), color: 0xfff1c9, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, opacity: 0 }));
    comet.scale.set(0.6, 0.6, 1); comet.renderOrder = 30; scene.add(comet);
    tracerGroup = new THREE.Group(); scene.add(tracerGroup);
    camera.position.copy(restPos);
    camera.lookAt(restLook);

    stage.onFrame((dt, t) => {
      motes.userData.update(t);
      for (const f of flags) f.userData.update(t);
      landingRing.userData.update(t);
      updateFlight(dt);
      // Camera: crane shot — starts behind the tee, swings out beside the flight, settles near the landing zone.
      dampVec(cam.pos, cam.goal, cam.vel, 0.55, dt);
      dampVec(cam.look, cam.aim, cam.lookVel, 0.32, dt);
      camera.position.copy(cam.pos);
      camera.lookAt(cam.look);
      cam.fov = smoothDamp(cam.fov, cam.fovGoal, cam.fovVel, 'v', 0.6, dt);
      if (Math.abs(camera.fov - cam.fov) > 0.01) { camera.fov = cam.fov; camera.updateProjectionMatrix(); }
      if (comet) { const d = camera.position.distanceTo(ball.position); comet.scale.setScalar(THREE.MathUtils.clamp(d * 0.012, 0.35, 2.4)); comet.position.copy(ball.position); }
    });
    stage.start();
  }

  // ---------- Helpers ----------
  function selectClub(c) {
    const changed = c !== state.club;
    state.club = c;
    if (changed) { state.speed = CLUBS[c].speed; state.attack = CLUBS[c].attack; }
    for (const b of clubSeg.children) b.classList.toggle('is-active', b.dataset.club === c);
    placeClub();
    syncAll();
    hit();
  }
  function placeClub() {
    if (!stage) return;
    if (club) { stage.scene.remove(club); }
    club = createClub(CLUB_MODEL[state.club] || 'iron');
    const onTee = CLUBS[state.club].loft < 20;
    tee.visible = onTee;
    ball.position.set(0, onTee ? 0.045 + BALL_RADIUS : BALL_RADIUS, 0);
    club.position.set(0, onTee ? 0.012 : 0.002, 0.03 + BALL_RADIUS);
    stage.scene.add(club);
  }
  function syncSlider(k) {
    const { input, out, spec } = sliderRows[k];
    input.value = state[k];
    const pct = ((state[k] - spec.min) / (spec.max - spec.min)) * 100;
    input.style.setProperty('--pct', pct + '%');
    out.textContent = spec.signed ? signed(state[k], spec.step < 1 ? 1 : 0, spec.unit) : `${fmt(state[k])}${spec.unit}`;
  }
  function syncAll() { for (const k of Object.keys(sliderRows)) syncSlider(k); }
  function stat(label, value, cls = '') { return h('div.hud__stat', { class: `hud__stat ${cls}` }, h('b', value), h('span', label)); }
  function previewLaunch() {
    const L = impact(state);
    renderReadout(L, null);
  }
  function renderReadout(L, F) {
    readout.replaceChildren(
      cell('Ball speed', fmt(L.ballSpeedMph), 'mph'), cell('Launch', fmt(L.launch, 1), '°'), cell('Spin', fmt(L.spinRpm), 'rpm'),
      cell('Spin axis', signed(L.axisTilt, 0), '°'), cell('Dyn. loft', fmt(L.dynLoft, 1), '°'), cell('Spin loft', fmt(L.spinLoft, 1), '°'),
      cell('Smash', fmt(L.smash, 2), ''), cell('Land angle', F ? fmt(F.landAngle) : '–', '°'), cell('Hang time', F ? fmt(F.time, 1) : '–', 's'),
    );
    function cell(l, v, u) { return h('div', h('b', v, h('span.u', u)), h('span', l)); }
  }
  function explain(L, F, C) {
    const parts = [];
    const dirWord = (v) => (v > 0 ? 'right' : 'left');
    const faceAbs = Math.abs(L.face), ftp = L.face - L.path;
    if (faceAbs < 0.75) parts.push(`The face is square to the target, so the ball starts almost on line.`);
    else parts.push(`The face is <b>${fmt(faceAbs, 1)}° ${L.face > 0 ? 'open' : 'closed'}</b> to the target, so the ball starts ${dirWord(L.startDir)} (start direction ${signed(L.startDir, 1, '°')}).`);
    if (Math.abs(ftp) < 1) parts.push(`Face and path match, so the spin axis stays level and the flight is nearly straight.`);
    else parts.push(`Face-to-path is <b>${signed(ftp, 1, '°')}</b> (face ${ftp > 0 ? 'open' : 'closed'} to the path), which tilts the spin axis ${signed(L.axisTilt, 0, '°')} and curves the ball <b>${fmt(Math.abs(F.curve))} yd ${dirWord(F.curve)}</b>.`);
    if (state.focus === 'attack' || Math.abs(L.attack - CLUBS[state.club].attack) > 1.5) {
      parts.push(L.club.loft < 20
        ? `Attack angle ${signed(L.attack, 1, '°')}: hitting ${L.attack > 0 ? 'up reduces spin loft, lowering spin to' : 'down adds spin loft, raising spin to'} ${fmt(L.spinRpm)} rpm with a ${fmt(L.launch, 1)}° launch.`
        : `Attack angle ${signed(L.attack, 1, '°')} with ${fmt(L.dynLoft, 1)}° of delivered loft gives ${fmt(L.spinLoft, 1)}° of spin loft and ${fmt(L.spinRpm)} rpm.`);
    }
    if (Math.abs(L.strike) >= 4) parts.push(`A ${Math.abs(L.strike)} mm ${L.strike > 0 ? 'toe' : 'heel'} strike costs ball speed and adds gear-effect ${L.strike > 0 ? 'hook' : 'slice'} spin.`);
    parts.push(`Result: <b>${C.name}</b>, ${fmt(F.carry)} yd carry, ${fmt(Math.abs(F.offline))} yd ${F.offline > 0 ? 'right' : 'left'} of target.`);
    insight.querySelector('.insight__text').innerHTML = parts.join(' ');
  }

  // ---------- Shot lifecycle ----------
  function hit() {
    const result = shoot({ club: state.club, speed: state.speed, attack: state.attack, path: state.path, face: state.face, strike: state.strike });
    const { launch: L, flight: F, shot: C } = result;
    renderReadout(L, F);
    explain(L, F, C);
    hudShot.replaceChildren(h('div.hud__shot', h('b', C.name), h('span', `face-to-path ${signed(C.faceToPath, 1, '°')} · ${C.verdict}`)));
    hudStats.replaceChildren(stat('Carry', `${fmt(F.carry)} yd`, 'is-gold'), stat('Total', `${fmt(F.total)} yd`), stat('Apex', `${fmt(F.apex)} yd`), stat('Curve', `${signed(F.curve, 0)} yd`, Math.abs(F.curve) > 12 ? 'is-red' : 'is-green'));
    hudLaunch.replaceChildren(stat('Ball speed', `${fmt(L.ballSpeedMph)} mph`), stat('Launch', `${fmt(L.launch, 1)}°`), stat('Spin', `${fmt(L.spinRpm)} rpm`), stat('Axis', `${signed(L.axisTilt)}°`));
    drawMini(result);
    if (!stage) return;
    sfx.strike(state.club === 'driver' ? 'driver' : 'iron');
    // retire the previous tracer as a ghost
    if (current) {
      if (state.compare) { current.tracer.material.opacity = 0.28; current.tracer.material.color.set(0x8fa8b8); ghosts.push(current.tracer); while (ghosts.length > 4) tracerGroup.remove(ghosts.shift()); }
      else tracerGroup.remove(current.tracer);
    }
    const tracer = makeTracer(F.points, L.club.loft < 20 ? 0xf3cf7a : 0x6ee7a8);
    tracerGroup.add(tracer);
    current = { result, tracer, t: 0, idx: 0, playing: true, landed: false, rollT: 0 };
    landingRing.visible = false;
    const last = F.points[F.points.length - 1];
    const side = F.curve >= 0 ? -1 : 1;                      // view from the side the ball curves away from
    P1.set(side * (12 + F.carry * 0.045), 5 + F.apex * 0.5, last[2] * 0.45);
    P2.set(last[0] + side * (9 + F.carry * 0.03), 3.5 + F.apex * 0.18, last[2] + 26);
    if (cam.pos.distanceTo(restPos) > 12) cutTo(restPos, restLook);   // broadcast-style cut back to the tee camera
    else { cam.goal.copy(restPos); cam.aim.copy(restLook); }
    cam.fovGoal = 36;
    comet.material.opacity = 1;
    if (quality.reducedMotion) { finishInstantly(); }
  }
  function makeTracer(points, color) {
    const positions = [], colors = [];
    const c1 = new THREE.Color(color), c2 = new THREE.Color(0xffffff);
    for (let i = 0; i < points.length; i++) {
      const p = points[i]; positions.push(p[0], Math.max(p[1], 0.03), p[2]);
      const k = i / (points.length - 1); const c = c1.clone().lerp(c2, 0.12 * k);
      colors.push(c.r, c.g, c.b);
    }
    const geo = new LineGeometry(); geo.setPositions(positions); geo.setColors(colors);
    const mat = new LineMaterial({ color: 0xffffff, vertexColors: true, linewidth: 2.5, transparent: true, opacity: 0.95, depthTest: true, worldUnits: false });
    mat.resolution.set(stage.size.w * stage.renderer.getPixelRatio(), stage.size.h * stage.renderer.getPixelRatio());
    const line = new Line2(geo, mat);
    line.computeLineDistances();
    line.geometry.instanceCount = 0;
    line.userData.total = points.length - 1;
    return line;
  }
  function cometTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, 'rgba(255,240,200,0.8)'); grd.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function finishInstantly() {
    const { flight: F } = current.result;
    current.tracer.geometry.instanceCount = current.tracer.userData.total;
    const last = F.points[F.points.length - 1];
    ball.position.set(last[0], BALL_RADIUS, last[2]);
    landingRing.position.set(last[0], 0.02, last[2]); landingRing.visible = true;
    cutTo(P2, new THREE.Vector3(last[0], 0.5, last[2]));
    current.playing = false; current.landed = true;
  }
  function updateFlight(dt) {
    if (!current) { cam.aim.copy(restLook); cam.goal.copy(restPos); cam.fovGoal = 36; return; }
    const { flight: F } = current.result;
    const pts = F.points;
    const total = pts[pts.length - 1][3];
    const k = THREE.MathUtils.clamp(current.t / total, 0, 1);
    // Crane path: quadratic bezier tee → beside the flight → behind the landing zone, eased so it starts gently.
    const kk = Math.min(1, k / 0.85), e = kk * kk * (3 - 2 * kk), u = 1 - e;   // settle beside the landing zone before touchdown
    cam.goal.set(0, 0, 0).addScaledVector(restPos, u * u).addScaledVector(P1, 2 * u * e).addScaledVector(P2, e * e);
    cam.fovGoal = 36 - 7 * (e * e);
    if (current.playing) {
      current.t += dt * 1.15;
      while (current.idx < pts.length - 2 && pts[current.idx + 1][3] <= current.t) current.idx++;
      const a = pts[current.idx], b = pts[Math.min(current.idx + 1, pts.length - 1)];
      const span = Math.max(b[3] - a[3], 1e-4);
      const k = THREE.MathUtils.clamp((current.t - a[3]) / span, 0, 1);
      ball.position.set(a[0] + (b[0] - a[0]) * k, Math.max(a[1] + (b[1] - a[1]) * k, BALL_RADIUS), a[2] + (b[2] - a[2]) * k);
      ball.rotation.x -= dt * 40;
      current.tracer.geometry.instanceCount = Math.min(current.idx + 1, current.tracer.userData.total);
      // Aim a little ahead of the ball along its flight so it rides steady in the lower-middle of the frame.
      velDir.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
      const lead = 5 + 0.06 * cam.pos.distanceTo(ball.position);
      cam.aim.copy(ball.position).addScaledVector(velDir, lead).add(tmp.set(0, 0.35 + 0.02 * lead, 0));
      if (current.t >= pts[pts.length - 1][3]) {
        current.playing = false; current.landed = true; current.rollT = 0;
        const last = pts[pts.length - 1];
        current.landPos = new THREE.Vector3(last[0], BALL_RADIUS, last[2]);
        const prev = pts[pts.length - 2];
        current.rollDir = new THREE.Vector3(last[0] - prev[0], 0, last[2] - prev[2]).normalize();
        current.tracer.geometry.instanceCount = current.tracer.userData.total;
        landingRing.position.set(last[0], 0.02, last[2]); landingRing.visible = true;
        comet.material.opacity = 0;
      }
    } else if (current.landed && current.rollT < 1.6) {
      current.rollT += dt;
      const k = 1 - Math.pow(1 - Math.min(current.rollT / 1.6, 1), 2);
      tmp.copy(current.landPos).addScaledVector(current.rollDir, F.roll * YD * k);
      ball.position.copy(tmp);
      ball.rotation.x -= dt * 12 * (1 - k);
      cam.aim.set(tmp.x, 0.4, tmp.z - 2);
    }
  }
  function clearTracers(keepCurrent = false) {
    for (const g of ghosts) tracerGroup.remove(g);
    ghosts.length = 0;
    if (!keepCurrent && current) { tracerGroup.remove(current.tracer); current = null; landingRing.visible = false; if (ball) placeClub(); }
    miniShots.length = keepCurrent && current ? 1 : 0;
    drawMini(null);
  }

  // ---------- Mini-map ----------
  const miniShots = [];
  function drawMini(result) {
    if (result) { miniShots.push(result); while (miniShots.length > 5) miniShots.shift(); }
    const ctx = mini.getContext('2d');
    const W = mini.width, H = mini.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(6,10,13,0.75)'; roundRect(ctx, 0, 0, W, H, 12); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.stroke();
    const maxZ = 300 * YD, halfX = 60 * YD;
    const sx = (x) => W / 2 + (x / halfX) * (W / 2 - 10);
    const sz = (z) => H - 12 - (-z / maxZ) * (H - 24);
    // fairway corridor
    ctx.fillStyle = 'rgba(53,194,122,0.10)'; ctx.fillRect(sx(-26), sz(-maxZ), sx(26) - sx(-26), sz(0) - sz(-maxZ));
    ctx.strokeStyle = 'rgba(110,231,168,0.45)'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(sx(0), sz(0)); ctx.lineTo(sx(0), sz(-maxZ)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '9px JetBrains Mono, monospace';
    for (const d of [100, 200, 300]) { ctx.fillRect(sx(-halfX) + 6, sz(-d * YD), 6, 1); ctx.fillText(d, sx(-halfX) + 14, sz(-d * YD) + 3); }
    miniShots.forEach((r, i) => {
      const isLast = i === miniShots.length - 1;
      ctx.strokeStyle = isLast ? (r.launch.club.loft < 20 ? '#f3cf7a' : '#6ee7a8') : 'rgba(180,200,210,0.35)';
      ctx.lineWidth = isLast ? 2 : 1;
      ctx.beginPath();
      r.flight.points.forEach((p, j) => { const X = sx(p[0]), Z = sz(p[2]); if (j === 0) ctx.moveTo(X, Z); else ctx.lineTo(X, Z); });
      ctx.stroke();
      const last = r.flight.points[r.flight.points.length - 1];
      ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(sx(last[0]), sz(last[2]), isLast ? 3 : 2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px JetBrains Mono, monospace'; ctx.fillText('TOP VIEW', 8, 14);
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // ---------- Init ----------
  selectClub(state.club);
  return { hit, state, stage, setPreset: (p) => { Object.assign(state, p); syncAll(); hit(); } };
}
