import * as THREE from 'three';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, BALL_RADIUS } from '../objects/ball.js';
import { createClub } from '../objects/clubs.js';
import { createRangeGround, createMotes } from '../objects/terrain.js';
import { createFlag } from '../objects/markers.js';
import { h, svgIcon, fmt } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

const IN = 0.0254;
// Greenside bunker: the only shot where you hit the sand on purpose. Entry point, face and speed decide the outcome.
export function mountBunkerViz(root, preset = {}) {
  const state = { entry: 2, face: 30, speed: 75, busy: false };
  root.classList.add('module', 'module--bunker');
  const stageEl = h('div.module__stage');
  const hudTL = h('div.hud.hud--tl'), hudTR = h('div.hud.hud--tr');
  stageEl.append(hudTL, hudTR);
  const rows = {};
  const ctl = h('div.ctl');
  for (const s of [{ key: 'entry', label: 'Entry behind ball', min: 0, max: 4, step: 0.25, unit: ' in' }, { key: 'face', label: 'Face open', min: 0, max: 45, step: 1, unit: '°' }, { key: 'speed', label: 'Swing speed', min: 50, max: 100, step: 1, unit: '%' }]) {
    const input = h('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: state[s.key] });
    const out = h('output');
    rows[s.key] = { input, out, s };
    input.addEventListener('input', () => { state[s.key] = Number(input.value); syncRow(s.key); updateMarkers(); });
    input.addEventListener('change', () => splash());
    ctl.append(h('div.ctl__row', h('label', s.label), input, out));
  }
  const btn = h('button.btn.btn--gold.btn--sm', { type: 'button', onClick: () => splash() }, h('span.ic', { html: svgIcon.play }), 'Splash');
  const actions = h('div.module__actions', btn, h('span.muted', { style: { fontSize: '12px' } }, 'Release a slider to swing'));
  const readout = h('div.readout');
  const insight = h('div.insight', h('span.ic', { html: svgIcon.spark }), h('div.insight__text'));
  root.append(h('div.module__bar', h('div.module__title', h('span.dot'), 'Bunker Splash'), h('div.module__hint', 'hit the sand, not the ball · the sand throws the ball out')), stageEl, actions,
    h('div.module__panel', h('div', h('div.kicker.kicker--gold', 'Delivery'), h('div', { style: { height: '10px' } }), ctl), h('div.stack', h('div.kicker', 'What happened'), readout, insight)));
  if (preset.caption) root.append(h('div.module__caption', preset.caption));
  function syncRow(k) { const { input, out, s } = rows[k]; input.style.setProperty('--pct', `${((state[k] - s.min) / (s.max - s.min)) * 100}%`); out.textContent = `${state[k]}${s.unit}`; }
  Object.keys(rows).forEach(syncRow);

  const stage = createStage(stageEl, { fov: 34, near: 0.05, far: 400, exposure: 1.05, postfx: { bloom: { strength: 0.35, radius: 0.5, threshold: 0.88 }, vignette: 0.5 } });
  let ball, club, pivot, sand, grains, entryLine, bill, flag, sandDepthAt = () => 0, particles = null;
  const ballRest = new THREE.Vector3(0, 0, 0);
  const green = new THREE.Vector3(0, 0, -13);
  const planeAxis = new THREE.Vector3(1, 0.35, 0).normalize();
  if (stage) {
    const { scene, camera, renderer } = stage;
    const sunDir = new THREE.Vector3(0.5, 0.16, -0.85);
    buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.02, fogColor: '#0a161b', sunIntensity: 2.4, hemiIntensity: 1.3, rimIntensity: 0.15 });
    scene.add(createRangeGround({ fairwayHalf: 18, sunDir, stripeWidth: 3, size: 200, behind: 40, greenCenter: green, greenRadius: 7, glint: 0.08, holes: [{ x: 0, z: -0.2, rx: 2.45, rz: 1.9 }] }));
    flag = createFlag({ height: 2.2 }); flag.position.copy(green).add(new THREE.Vector3(0.5, 0, 1)); scene.add(flag);
    // Sand bowl
    const geo = new THREE.PlaneGeometry(6, 5, 90, 75); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const depth = (x, z) => { const r = Math.hypot(x / 2.6, (z + 0.2) / 2.0); const bowl = -0.42 * (1 - THREE.MathUtils.smoothstep(r, 0.35, 1.0)); const ripple = Math.sin(x * 22) * 0.004 * (1 - Math.min(1, r)); return bowl + ripple; };
    for (let i = 0; i < pos.count; i++) pos.setY(i, depth(pos.getX(i), pos.getZ(i)) + 0.01);
    geo.computeVertexNormals();
    sandDepthAt = (x, z) => depth(x, z) + 0.01;
    sand = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xefe3c4, roughness: 0.92, metalness: 0, emissive: new THREE.Color(0x4a3b22), emissiveIntensity: 0.4 }));
    sand.receiveShadow = true; scene.add(sand);
    
    ball = createBall({ lowPoly: quality.tier === 'low' }); scene.add(ball);
    // Club on a pivot roughly at the hands' arc centre
    pivot = new THREE.Group(); pivot.position.set(-0.55, 1.05, 0.05); scene.add(pivot);
    club = createClub('sand-wedge'); pivot.add(club);
    entryLine = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.012), new THREE.MeshBasicMaterial({ color: 0xf3cf7a, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }));
    entryLine.rotation.x = -Math.PI / 2; scene.add(entryLine);
    bill = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.06), new THREE.MeshBasicMaterial({ color: 0xf3cf7a, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }));
    bill.rotation.x = -Math.PI / 2; scene.add(bill);
    const motes = createMotes({ count: 100, center: [0, 1, -3], spread: [8, 3, 10], size: 0.08 }); scene.add(motes);
    camera.position.set(1.35, 0.95, 1.95); camera.lookAt(-0.05, -0.15, -1.3);
    // Sand grains particle system
    const N = quality.tier === 'low' ? 250 : 700;
    const pg = new THREE.BufferGeometry();
    const parr = new Float32Array(N * 3), vel = new Float32Array(N * 3), life = new Float32Array(N);
    pg.setAttribute('position', new THREE.BufferAttribute(parr, 3));
    grains = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe6d6b0, size: 0.018, transparent: true, opacity: 0.95, depthWrite: false }));
    grains.visible = false; grains.frustumCulled = false; scene.add(grains);
    particles = { parr, vel, life, N };
    reset();
    stage.onFrame((dt, t) => { motes.userData.update(t); flag.userData.update(t); step(dt); });
    stage.start();
  }
  function reset() {
    if (!stage) return;
    ballRest.set(0, sandDepthAt(0, 0) + BALL_RADIUS - 0.006, 0);
    ball.position.copy(ballRest);
    poseClub(THREE.MathUtils.degToRad(72));
    updateMarkers();
  }
  function updateMarkers() {
    if (!stage) return;
    const ez = state.entry * IN;
    entryLine.position.set(0, sandDepthAt(0, ez) + 0.004, ez);
    bill.position.set(0, sandDepthAt(0, ez - 0.075) + 0.003, ez - 0.075);
    bill.scale.x = 1; bill.visible = state.entry > 0.2;
    // Club address: face opened, head hovering behind the ball at the entry point
    club.rotation.set(0, 0, 0);
    club.position.set(0, sandDepthAt(0, ez) + 0.02, ez).sub(pivot.position);
    club.rotation.y = -THREE.MathUtils.degToRad(state.face);
  }
  // Rotate the club about the pivot in the swing plane; angle 0 = the head at the entry point.
  function poseClub(angle) { pivot.quaternion.setFromAxisAngle(planeAxis, angle); }

  let anim = null;
  function outcome() {
    const e = state.entry, sp = state.speed;
    if (e < 0.9) return { name: 'Thin', desc: 'Leading edge caught the ball first. It rockets over the green.', carry: 22 + sp * 0.12, height: 0.9, sand: 'Almost none' };
    if (e > 3.4 || sp < 60) return { name: e > 3.4 ? 'Fat' : 'Decelerated', desc: e > 3.4 ? 'Too much sand between face and ball. The ball barely moves.' : 'The club slowed into the sand and the sand won.', carry: 1.2 + sp * 0.01, height: 0.6, sand: 'A shovelful' };
    const faceOk = state.face >= 15;
    const carry = (5.5 + (sp - 60) * 0.19) * (faceOk ? 1 : 1.25);
    return { name: faceOk ? 'Splash' : 'Dug in', desc: faceOk ? 'The bounce skidded through the sand and the sand lifted the ball out softly.' : 'A square face dug rather than skidded; it came out, but low and hot.', carry, height: faceOk ? 2.4 + sp * 0.015 : 1.2, sand: faceOk ? 'A dollar bill' : 'A deep divot' };
  }
  function splash() {
    if (!stage || state.busy) { if (!stage) renderResult(outcome()); return; }
    state.busy = true;
    const o = outcome();
    const ez = state.entry * IN;
    anim = { t: 0, o, ez, launched: false, splashed: false };
    sfx.whoosh(0.4);
  }
  function step(dt) {
    if (!anim) return;
    anim.t += dt;
    const swingDur = 0.55, back = THREE.MathUtils.degToRad(72), through = THREE.MathUtils.degToRad(-95);
    const k = Math.min(1, anim.t / swingDur);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;    // ease-in-out
    poseClub(back + (through - back) * e);
    const contactK = (0 - back) / (through - back);
    if (!anim.splashed && e >= contactK) {
      anim.splashed = true; burst(anim.ez, state.speed / 100); sfx.strike('iron');
      anim.launched = true; anim.lt = 0;
      const o = anim.o; anim.v = new THREE.Vector3(0.15 * (Math.random() - 0.5), Math.sqrt(2 * 9.81 * o.height), -o.carry / (2 * Math.sqrt(2 * o.height / 9.81)));
      renderResult(o);
    }
    if (anim.launched) {
      anim.lt += dt;
      const g = 9.81, t = anim.lt;
      const p = new THREE.Vector3(ballRest.x + anim.v.x * t, ballRest.y + anim.v.y * t - 0.5 * g * t * t, ballRest.z + anim.v.z * t);
      if (p.y < BALL_RADIUS && t > 0.1) { p.y = BALL_RADIUS; anim.v.z *= 0.98; if (Math.abs(anim.v.z) > 0.05) { anim.v.z *= 0.9; anim.v.y = 0; ballRest.copy(p); anim.lt = 0; } }
      ball.position.copy(p);
      ball.rotation.x -= dt * 12;
    }
    stepGrains(dt);
    if (anim.t > 3.2) { anim = null; state.busy = false; setTimeout(reset, 900); }
  }
  function burst(ez, power) {
    const { parr, vel, life, N } = particles;
    for (let i = 0; i < N; i++) {
      parr[i * 3] = (Math.random() - 0.5) * 0.06; parr[i * 3 + 1] = sandDepthAt(0, ez) + 0.01; parr[i * 3 + 2] = ez - Math.random() * 0.12;
      const sp = (1.2 + Math.random() * 2.2) * (0.6 + power * 0.8);
      vel[i * 3] = (Math.random() - 0.5) * 1.2; vel[i * 3 + 1] = sp * (0.6 + Math.random() * 0.6); vel[i * 3 + 2] = -sp * (0.5 + Math.random() * 0.6);
      life[i] = 0.9 + Math.random() * 0.8;
    }
    grains.visible = true; grains.material.opacity = 0.95;
  }
  function stepGrains(dt) {
    if (!grains.visible) return;
    const { parr, vel, life, N } = particles; let alive = 0;
    for (let i = 0; i < N; i++) {
      if (life[i] <= 0) continue;
      life[i] -= dt; alive++;
      vel[i * 3 + 1] -= 9.81 * dt;
      parr[i * 3] += vel[i * 3] * dt; parr[i * 3 + 1] += vel[i * 3 + 1] * dt; parr[i * 3 + 2] += vel[i * 3 + 2] * dt;
      const floor = sandDepthAt(parr[i * 3], parr[i * 3 + 2]);
      if (parr[i * 3 + 1] < floor) { parr[i * 3 + 1] = floor; vel[i * 3 + 1] = 0; vel[i * 3] *= 0.5; vel[i * 3 + 2] *= 0.5; life[i] -= dt * 2; }
    }
    grains.geometry.attributes.position.needsUpdate = true;
    if (!alive) grains.visible = false;
  }
  function renderResult(o) {
    hudTL.replaceChildren(h('div.hud__shot', h('b', o.name), h('span', o.desc)));
    hudTR.replaceChildren(h('div.hud__stat.is-gold', h('b', `${fmt(o.carry * 1.094)} yd`), h('span', 'Carry')), h('div.hud__stat', h('b', `${state.entry} in`), h('span', 'Entry')), h('div.hud__stat', h('b', `${state.face}°`), h('span', 'Face')));
    readout.replaceChildren(...[['Outcome', o.name], ['Sand taken', o.sand], ['Entry point', `${state.entry} in behind`], ['Face open', `${state.face}°`], ['Speed', `${state.speed}%`], ['Bounce', state.face >= 15 ? 'Exposed: skids' : 'Hidden: digs']].map(([l, v]) => h('div', h('b', { style: { fontSize: '15px', fontWeight: '600' } }, v), h('span', l))));
    insight.querySelector('.insight__text').innerHTML = state.face >= 15
      ? `Opening the face <b>${state.face}°</b> exposes the bounce on the sole, so the club skids through the sand instead of digging. Entering <b>${state.entry} inches</b> behind the ball takes a shallow cushion of sand that carries the ball out. ${state.speed < 60 ? 'Below about 60% speed the sand absorbs the energy: commit to the finish.' : 'Distance comes from swing length and speed, never from hitting closer to the ball.'}`
      : `With the face only <b>${state.face}°</b> open the leading edge leads and digs. Open the face before you take your grip, aim the body left to compensate, and let the bounce do the work.`;
  }
  renderResult(outcome());
  if (stage && !quality.reducedMotion) setTimeout(() => splash(), 900);
  return { state, splash };
}
