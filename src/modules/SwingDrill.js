import * as THREE from 'three';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, createTee, BALL_RADIUS } from '../objects/ball.js';
import { createRangeGround } from '../objects/terrain.js';
import { createSwingModel, createGolferRig, POSITIONS, SWING_PRESETS } from '../objects/golfer.js';
import { h, svgIcon } from '../ui/dom.js';
import { quality } from '../core/quality.js';

// Small looping demonstrations of a drill on the swing model: what to do, with the props on the ground.
const CAMS = {
  'face-on': { pos: [3.3, 1.2, 0.05], look: [-0.45, 0.85, 0.05] },
  'down-the-line': { pos: [-0.3, 1.35, 3.6], look: [-0.35, 0.85, 0] },
  'three-quarter': { pos: [2.5, 1.7, 2.7], look: [-0.4, 0.8, 0.05] },
  'overhead': { pos: [0.1, 4.2, 0.4], look: [-0.4, 0, 0.1] },
};
const ORANGE = 0xff8a3d, WHITE = 0xf1f1f1;

function buildProgram(name, models, times) {
  const T = times, D = models[0].duration;
  const seg = (from, to, speed = 1, hold = 0, mi = 0, label = null) => ({ from, to, dur: Math.abs(to - from) / speed, hold, mi, label });
  switch (name) {
    case 'address': return [seg(0, 0, 1, 2.5, 0, 'Hold the address')];
    case 'nine-to-three': return [seg(0, T[2], 0.4, 0.5, 0, 'To P3: lead arm parallel'), seg(T[2], T[8], 0.7, 0.4, 0, 'Through to P9'), seg(T[8], T[9], 0.5, 0.8, 0, 'Finish')];
    case 'pump': return [seg(0, T[3], 0.5, 0.4, 0, 'To the top'), seg(T[3], T[5], 0.35, 0.3, 0, 'Pump to P6'), seg(T[5], T[3], 0.35, 0.3, 0, 'Back up'), seg(T[3], T[5], 0.35, 0.3, 0, 'Pump again'), seg(T[5], T[3], 0.35, 0.3, 0, 'Back up'), seg(T[3], D, 0.9, 1.0, 0, 'Now swing through')];
    case 'checkpoints': return [seg(0, T[1], 0.45, 0.9, 0, 'Stop at P2'), seg(T[1], T[3], 0.45, 0.9, 0, 'Stop at P4'), seg(T[3], T[6], 0.6, 0.9, 0, 'Stop at P7'), seg(T[6], D, 0.7, 1.0, 0, 'Finish')];
    case 'slow': return [seg(0, T[3], 0.3, 0.2, 0, 'One, two, three...'), seg(T[3], D, 0.5, 0.9, 0, '...one')];
    case 'ladder': return [seg(0, D, 0.6, 0.7, 0, '7:30'), seg(0, D, 0.6, 0.7, 1, '9:00'), seg(0, D, 0.6, 0.9, 2, '10:30')];
    case 'step': return [seg(0, T[2], 0.45, 0.2, 0, 'Feet together'), seg(T[2], T[3], 0.35, 0.3, 0, 'Step out to width'), seg(T[3], D, 0.8, 1.0, 0, 'Swing through')];
    default: return [seg(0, D, 0.55, 0.9, 0, null)];
  }
}

export function mountSwingDrill(root, preset = {}) {
  root.classList.add('drill__viz');
  const stageEl = h('div.drill__stage');
  const label = h('div.drill__label', h('b', preset.note || ''), h('span'));
  const playBtn = h('button.drill__play', { type: 'button', 'aria-label': 'Play or pause', html: svgIcon.pause });
  root.append(stageEl, label, playBtn);
  const stage = createStage(stageEl, { fov: 40, near: 0.05, far: 200, exposure: 1.05, postfx: false, maxDpr: 1.25 });
  if (!stage) { root.classList.add('drill__viz--static'); label.querySelector('span').textContent = 'Needs WebGL to animate.'; playBtn.remove(); return null; }
  const { scene, camera, renderer } = stage;
  const sunDir = new THREE.Vector3(0.62, 0.09, -0.77);
  buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.03, fogColor: '#0a161b', sunIntensity: 1.8, skyIntensity: 0.9 });
  scene.add(createRangeGround({ fairwayHalf: 14, sunDir, stripeWidth: 2.5, stripeDir: 1, size: 200, behind: 40, glint: 0.05 }));
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), new THREE.MeshStandardMaterial({ color: 0x0e1c16, roughness: 0.95 }));
  mat.rotation.x = -Math.PI / 2; mat.position.set(-0.55, 0.004, 0.05); scene.add(mat);

  const club = SWING_PRESETS[preset.club] ? preset.club : 'iron';
  const feet = {};
  if (preset.trailFootBack) feet.trailBack = true;
  const amps = preset.program === 'ladder' ? [0.45, 0.65, 0.85] : [1];
  const models = amps.map((amp) => createSwingModel(club, { amp, feet }));
  const base = models[0];
  if (preset.trailFootBack) { const tf = base.trailFoot.clone(); tf.z += 0.22; tf.x -= 0.18; tf.y += 0.04; models.forEach((m) => { m.preset.__tf = tf; }); feet.trail = tf; }
  if (preset.program === 'step') {
    const leadZ = base.leadFoot.z, trailZ = base.trailFoot.z, t2 = base.times[2], t3 = base.times[3];
    feet.dynamic = (t, lf) => { const k = THREE.MathUtils.smoothstep(t, t2, t3); lf.z = THREE.MathUtils.lerp(trailZ - 0.14, leadZ, k); };
  }
  const rigs = models.map((m) => createGolferRig(m, { hideLeadArm: !!preset.hideLeadArm }));
  rigs.forEach((r, i) => { r.group.visible = i === 0; scene.add(r.group); });
  const ball = createBall({ lowPoly: true }); const tee = createTee(); scene.add(ball, tee);
  tee.visible = !!base.preset.tee; ball.position.set(0, base.ballY + BALL_RADIUS, 0); ball.visible = !preset.hideBall;
  if (preset.hideBall) tee.visible = true;

  // Props
  const props = new THREE.Group(); scene.add(props);
  const dynamicProps = [];
  const stick = (x, z, len, rot = 0, color = ORANGE) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, len, 8), new THREE.MeshStandardMaterial({ color, roughness: 0.6 })); m.rotation.z = Math.PI / 2; m.rotation.y = rot; m.position.set(x, 0.012, z); return m; };
  const flat = (w, d, x, z, color, opacity = 1) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color, roughness: 1, transparent: opacity < 1, opacity })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.01, z); return m; };
  const teeMark = (x, z) => { const t = createTee({ height: 0.05 }); t.position.set(x, 0, z); return t; };
  for (const p of preset.props || []) {
    if (p === 'tee-gate') props.add(teeMark(-0.07, -0.6), teeMark(0.07, -0.6));
    if (p === 'tee-gate-putt') props.add(teeMark(-0.075, -0.35), teeMark(0.075, -0.35));
    if (p === 'stick-outside') props.add(stick(0.16, -0.2, 1.2, Math.PI / 2));
    if (p === 'stick-feet') props.add(stick(base.leadFoot.x + 0.2, 0.0, 1.2, Math.PI / 2));
    if (p === 'ground-line' || p === 'sand-line') props.add(stick(0, p === 'sand-line' ? 0.05 : 0, 0.5, 0, WHITE));
    if (p === 'headcover') { const c = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.16), new THREE.MeshStandardMaterial({ color: 0x2b2f38, roughness: 0.8 })); c.position.set(0.18, 0.045, 0.0); props.add(c); }
    if (p === 'towel-landing') props.add(flat(0.5, 0.35, 0, -5.5, 0xe8e2d0));
    if (p === 'towel-behind') props.add(flat(0.35, 0.18, 0, 0.16, 0xe8e2d0));
    if (p === 'bill') props.add(flat(0.06, 0.15, 0, -0.02, 0xd8c98a, 0.9));
    if (p === 'buried-tee') { const t = createTee({ height: 0.03 }); t.position.set(0, -0.02, 0); props.add(t); }
    if (p === 'stick-grip') { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 8), new THREE.MeshStandardMaterial({ color: ORANGE })); props.add(m); dynamicProps.push((pose) => { const dir = new THREE.Vector3().subVectors(pose.hands, pose.head).normalize(); m.position.copy(pose.hands).addScaledVector(dir, 0.42); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); }); }
    if (p === 'glove') { const g = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.12), new THREE.MeshStandardMaterial({ color: 0xf3f3f3 })); props.add(g); dynamicProps.push((pose) => { g.position.copy(pose.shoulderL).lerp(pose.elbowL, 0.3).add(new THREE.Vector3(0, -0.07, 0)); }); }
  }

  const c = CAMS[preset.camera] || CAMS['three-quarter'];
  camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look));
  const program = buildProgram(preset.program, models, base.times);
  let step = 0, k = 0, holding = 0, playing = !quality.reducedMotion;
  let active = 0;
  const note = label.querySelector('span');
  function show(mi) { if (mi === active) return; rigs[active].group.visible = false; active = mi; rigs[active].group.visible = true; }
  function applyStep() {
    const s = program[step], m = models[s.mi];
    show(s.mi);
    const t = s.dur > 0 ? s.from + (s.to - s.from) * THREE.MathUtils.clamp(k / s.dur, 0, 1) : s.from;
    const pose = m.pose(t);
    rigs[active].apply(pose);
    for (const fn of dynamicProps) fn(pose);
    let pi = 0; while (pi < 9 && m.times[pi + 1] <= t + 1e-3) pi++;
    const P = POSITIONS[pi];
    note.textContent = s.label ? `${s.label} · ${P.short}` : `${P.short} · ${P.name}`;
    ball.visible = !preset.hideBall && t < m.times[6];
  }
  applyStep();
  stage.onFrame((dt) => {
    if (!playing) return;
    const s = program[step];
    if (k < s.dur) k += dt; else if (holding < s.hold) holding += dt; else { step = (step + 1) % program.length; k = 0; holding = 0; }
    applyStep();
  });
  stage.start();
  const toggle = () => { playing = !playing; playBtn.innerHTML = playing ? svgIcon.pause : svgIcon.play; };
  playBtn.addEventListener('click', toggle);
  stageEl.addEventListener('click', toggle);
  if (!playing) playBtn.innerHTML = svgIcon.play;
  return { stage, toggle };
}
