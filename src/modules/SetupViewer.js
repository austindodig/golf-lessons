import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, createTee, BALL_RADIUS } from '../objects/ball.js';
import { createRangeGround, createMotes } from '../objects/terrain.js';
import { createLabel } from '../objects/markers.js';
import { createSwingModel, createGolferRig, SWING_PRESETS } from '../objects/golfer.js';
import { h, fmt } from '../ui/dom.js';
import { quality } from '../core/quality.js';

// Address position explorer: the hologram golfer at P1 with alignment rails, ball-position band,
// stance width, spine tilt and shaft lean drawn as measurements.
const CLUBS = ['driver', 'iron', 'wedge', 'putter'];
const LABEL = { driver: 'Driver', iron: '7-iron', wedge: 'Wedge', putter: 'Putter' };
const NOTES = {
  driver: { ball: 'Inside the lead heel', stance: 'Shoulder width plus a step', tilt: 'Spine tilted a little away from the target', weight: '55 / 45 trail', lean: 'Shaft neutral or a touch back', eyes: 'Head behind the ball', points: ['Ball forward, tee half a ball above the crown', 'Widest stance in the bag for a stable base', 'Trail shoulder lower than lead: spine tilts away from the target', 'Hands level with or just behind the ball', 'Feel the upward hit built into the setup'] },
  iron: { ball: 'A ball forward of centre', stance: 'Shoulder width, heels', tilt: 'Hinge from the hips, arms hang', weight: '50 / 50', lean: 'Shaft leans slightly toward the target', eyes: 'Over the inside of the ball', points: ['Ball just forward of centre so the low point falls ahead of it', 'Hinge from the hips until the arms hang under the shoulders', 'Hands a fist ahead of the ball: small forward shaft lean', 'Knees soft, weight on the balls of the feet', 'Shoulders, hips and feet parallel left of the target'] },
  wedge: { ball: 'Centre of the stance', stance: 'Inside shoulder width', tilt: 'A touch more forward bend', weight: '60 / 40 lead', lean: 'Moderate forward lean', eyes: 'Over the ball', points: ['Ball in the centre, narrow stance, weight favouring the lead side', 'Grip down an inch for control', 'Hands ahead so the leading edge sits square', 'Chest over the ball; stay there through the strike', 'Slightly open stance to let the body turn through'] },
  putter: { ball: 'Just forward of centre', stance: 'Comfortable, roughly hip width', tilt: 'Bend until the eyes are over the ball', weight: 'Even, quiet', lean: 'Shaft near vertical', eyes: 'Directly over or just inside the ball', points: ['Eyes over the ball or a fraction inside the line', 'Forearms and shaft form one line to the ball', 'Light grip: the putter should feel heavy in the hands', 'Ball forward of centre so the putter strikes slightly upward', 'Shoulders level; the stroke is a rock, not a lift'] },
};
const CAMS = { 'face-on': { pos: [3.4, 1.0, 0.1], look: [-0.45, 0.75, 0.05] }, 'down-the-line': { pos: [-0.3, 1.15, 3.6], look: [-0.3, 0.75, 0] }, overhead: { pos: [-0.2, 4.2, 0.4], look: [-0.4, 0, 0.05] } };

export function mountSetupViewer(root, preset = {}) {
  const state = { club: CLUBS.includes(preset.club) ? preset.club : 'iron', cam: 'face-on' };
  root.classList.add('module', 'module--setup');
  const stageEl = h('div.module__stage');
  const hudTL = h('div.hud.hud--tl'), hudTR = h('div.hud.hud--tr'), hudBL = h('div.hud.hud--bl', h('div.hud__pos'));
  stageEl.append(hudTL, hudTR, hudBL);
  const clubSeg = h('div.chips');
  for (const c of CLUBS) clubSeg.append(h('button.chip', { type: 'button', dataset: { club: c }, onClick: () => setClub(c) }, LABEL[c]));
  const list = h('ul.keypoints');
  const readout = h('div.readout');
  const panel = h('div.module__panel', h('div', h('div.kicker.kicker--gold', 'Address position'), h('div', { style: { height: '10px' } }), h('div.ctl', h('div.ctl__row', h('label', 'Club'), clubSeg), readout)), h('div.stack', h('div.kicker', 'What to check'), list));
  root.append(h('div.module__bar', h('div.module__title', h('span.dot'), 'Setup Viewer'), h('div.module__hint', 'drag to orbit · pick a club · read the measurements')), stageEl, panel);
  if (preset.caption) root.append(h('div.module__caption', preset.caption));

  const stage = createStage(stageEl, { fov: 34, near: 0.05, far: 300, exposure: 1.05, postfx: { bloom: { strength: 0.4, radius: 0.5, threshold: 0.86 }, vignette: 0.5 } });
  let controls, model, rig, overlays, ball, tee, motes;
  if (stage) {
    const { scene, camera, renderer } = stage;
    const sunDir = new THREE.Vector3(-0.6, 0.14, 0.78);
    buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.02, fogColor: '#0a161b', sunIntensity: 2.0 });
    scene.add(createRangeGround({ fairwayHalf: 14, sunDir, stripeWidth: 3, size: 200, behind: 40, glint: 0.08 }));
    motes = createMotes({ count: 120, center: [0, 1, 0], spread: [8, 3, 8], size: 0.08 }); scene.add(motes);
    ball = createBall({ lowPoly: quality.tier === 'low' }); tee = createTee(); scene.add(ball, tee);
    controls = new OrbitControls(camera, stage.canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI / 2 - 0.05; controls.minDistance = 1.5; controls.maxDistance = 7; controls.enablePan = false;
    controls.target.set(-0.4, 0.75, 0.05);
    setCam('face-on', true);
    stage.onFrame((dt, t) => { motes.userData.update(t); controls.update(); });
    stage.start();
  }
  function setCam(name, instant) {
    state.cam = name; hudBL.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.cam === name));
    if (!stage) return;
    const c = CAMS[name]; const pos = new THREE.Vector3(...c.pos), look = new THREE.Vector3(...c.look);
    if (instant || quality.reducedMotion) { stage.camera.position.copy(pos); controls.target.copy(look); controls.update(); return; }
    const p0 = stage.camera.position.clone(), t0 = controls.target.clone(); let k = 0;
    const off = stage.onFrame((dt) => { k = Math.min(1, k + dt * 1.6); const e = 1 - Math.pow(1 - k, 3); stage.camera.position.lerpVectors(p0, pos, e); controls.target.lerpVectors(t0, look, e); if (k >= 1) off(); });
  }
  for (const [name, label] of [['face-on', 'Face-on'], ['down-the-line', 'Down the line'], ['overhead', 'Overhead']]) hudBL.firstChild.append(h('button', { type: 'button', dataset: { cam: name }, onClick: () => setCam(name) }, label));

  function build() {
    if (!stage) return;
    const { scene } = stage;
    if (rig) scene.remove(rig.group); if (overlays) scene.remove(overlays);
    model = createSwingModel(state.club);
    rig = createGolferRig(model);
    const p = model.pose(0);
    rig.apply(p);
    scene.add(rig.group);
    const onTee = model.preset.tee; tee.visible = onTee; ball.position.set(0, onTee ? 0.045 + BALL_RADIUS : BALL_RADIUS, 0);
    overlays = new THREE.Group(); scene.add(overlays);
    const gold = 0xf3cf7a, green = 0x6ee7a8;
    const line = (a, b, color, opacity = 0.9) => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color, transparent: true, opacity })); overlays.add(l); return l; };
    // Railroad tracks: target line through the ball, toe line through the feet.
    line(new THREE.Vector3(0, 0.005, 3), new THREE.Vector3(0, 0.005, -8), green, 0.6);
    const toeX = p.leadFoot.x + 0.19;
    line(new THREE.Vector3(toeX, 0.005, 1.2), new THREE.Vector3(toeX, 0.005, -1.2), green, 0.4);
    // Stance width dimension line between the heels
    const heelY = 0.02, hx = p.leadFoot.x - 0.06;
    line(new THREE.Vector3(hx, heelY, p.leadFoot.z), new THREE.Vector3(hx, heelY, p.trailFoot.z), gold);
    const widthCm = Math.abs(p.trailFoot.z - p.leadFoot.z) * 100;
    const wl = createLabel(`${fmt(widthCm)} cm`, { color: '#f3cf7a', size: 0.09, mono: true }); wl.position.set(hx - 0.12, 0.08, (p.leadFoot.z + p.trailFoot.z) / 2); overlays.add(wl);
    // Ball position band: from the ball across to the feet line
    const band = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(hx) + 0.1, 0.05), new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }));
    band.rotation.x = -Math.PI / 2; band.position.set(hx / 2 - 0.05, 0.006, 0); overlays.add(band);
    const bl = createLabel(NOTES[state.club].ball, { color: '#f3cf7a', size: 0.08 }); bl.position.set(0.05, 0.12, -0.35); overlays.add(bl);
    // Spine tilt and shaft lean measurements
    const spineTop = p.headC.clone(), spineBot = p.hipC.clone();
    line(spineBot, spineTop.clone().add(new THREE.Vector3(0, 0.1, 0)), gold, 0.7);
    line(spineBot, spineBot.clone().add(new THREE.Vector3(0, 0.9, 0)), 0xffffff, 0.25);
    const spineDeg = THREE.MathUtils.radToDeg(Math.atan2(Math.hypot(spineTop.x - spineBot.x, 0), spineTop.y - spineBot.y));
    const sl = createLabel(`${fmt(spineDeg)}° hinge`, { color: '#e9efeb', size: 0.08, mono: true }); sl.position.copy(spineBot).add(new THREE.Vector3(-0.28, 0.5, 0)); overlays.add(sl);
    const leanDeg = THREE.MathUtils.radToDeg(Math.atan2(-(p.hands.z - p.head.z), p.hands.y - p.head.y));
    const ll = createLabel(`shaft ${leanDeg >= 0 ? '+' : ''}${fmt(leanDeg)}° lean`, { color: '#6ee7a8', size: 0.075, mono: true }); ll.position.set(0.02, 0.45, -0.22); overlays.add(ll);
    line(p.hands.clone().add(new THREE.Vector3(0, 0.02, 0)), p.hands.clone().add(new THREE.Vector3(0, -0.85, 0)), 0xffffff, 0.2);
    // Eye line for the putter
    if (state.club === 'putter') line(p.headC.clone(), new THREE.Vector3(p.headC.x, 0, p.headC.z), green, 0.5);
    renderInfo(spineDeg, leanDeg, widthCm);
  }
  function renderInfo(spineDeg, leanDeg, widthCm) {
    const n = NOTES[state.club];
    hudTL.replaceChildren(h('div.hud__shot', h('b', LABEL[state.club]), h('span', `Ball: ${n.ball}`)));
    hudTR.replaceChildren(h('div.hud__stat', h('b', `${fmt(widthCm)} cm`), h('span', 'Stance')), h('div.hud__stat', h('b', `${fmt(spineDeg)}°`), h('span', 'Hip hinge')), h('div.hud__stat', h('b', `${leanDeg >= 0 ? '+' : ''}${fmt(leanDeg)}°`), h('span', 'Shaft lean')));
    readout.replaceChildren(...[['Ball position', n.ball], ['Stance', n.stance], ['Spine', n.tilt], ['Weight', n.weight], ['Shaft', n.lean], ['Eyes', n.eyes]].map(([l, v]) => h('div', h('b', { style: { fontSize: '14px', fontWeight: '600' } }, v), h('span', l))));
    list.replaceChildren(...n.points.map((t) => h('li', t)));
  }
  function setClub(c) { state.club = c; clubSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.club === c)); if (stage) build(); else renderInfo(36, 6, 42); }
  setClub(state.club);
  return { state, stage, setClub };
}
