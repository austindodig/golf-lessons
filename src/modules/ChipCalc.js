import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, BALL_RADIUS } from '../objects/ball.js';
import { createClub } from '../objects/clubs.js';
import { createRangeGround, createTreeLine, createMotes } from '../objects/terrain.js';
import { createFlag, createLandingRing, createLabel } from '../objects/markers.js';
import { h, svgIcon, fmt } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

// Chip Calculator: carry-to-roll guidelines for the four chipping clubs, played with shaft lean and a putting stroke.
const YD = 0.9144, G = 9.81, DEG = Math.PI / 180;
const FRINGE = 3;                                // yards of fringe between the ball and the front edge of the green
const GREEN_R = 16;                              // metres: big enough that the hole is always on the green
const GREEN_Z = -(FRINGE * YD + GREEN_R);
const CLUBS = {
  '7-iron':         { key: '7-iron',         name: '7-iron',         short: '7i', ratio: 5, launch: 18 },
  '9-iron':         { key: '9-iron',         name: '9-iron',         short: '9i', ratio: 3, launch: 26 },
  'pitching-wedge': { key: 'pitching-wedge', name: 'Pitching wedge', short: 'PW', ratio: 2, launch: 32 },
  'sand-wedge':     { key: 'sand-wedge',     name: 'Sand wedge',     short: 'SW', ratio: 1, launch: 40 },
};
const ORDER = Object.keys(CLUBS);
const SLIDERS = [
  { key: 'dist', label: 'Distance to hole', min: 8, max: 35, step: 1, unit: ' yd' },
  { key: 'stimp', label: 'Green speed', hint: 'stimp', min: 8, max: 12, step: 0.5, unit: ' ft' },
];
const CSS = `
.chip__play svg { width: 12px; height: 12px; fill: currentColor; display: block; }
.chip__note { font-size: 12px; }
.chip__strip { position: relative; height: 60px; margin: 2px 8px 4px 4px; }
.chip__track { position: absolute; left: 0; right: 0; top: 34px; height: 5px; border-radius: 3px; background: linear-gradient(90deg, rgba(243,207,122,0.55) 0, rgba(243,207,122,0.55) var(--fringe, 15%), rgba(53,194,122,0.55) var(--fringe, 15%), rgba(53,194,122,0.55) 100%); }
.chip__mark { position: absolute; top: 4px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 2px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; color: var(--ink-3); }
.chip__mark i { display: block; width: 2px; height: 20px; background: currentColor; border-radius: 1px; }
.chip__mark.is-active { color: var(--gold-bright); text-shadow: 0 0 10px rgba(243,207,122,0.6); }
.chip__mark.is-fringe { color: var(--danger); }
.chip__hole { position: absolute; right: 0; top: 30px; width: 13px; height: 13px; border-radius: 50%; border: 2px solid var(--ink); background: var(--bg); transform: translateX(50%); }
.chip__tick { position: absolute; top: 45px; transform: translateX(-50%); font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-4); white-space: nowrap; }
.chip__spots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.chip__spot { text-align: left; padding: 10px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line); transition: border-color .2s, background .2s; }
.chip__spot:hover { border-color: var(--line-strong); }
.chip__spot b { display: block; font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.chip__spot b .u { font-size: 12px; color: var(--ink-3); margin-left: 3px; }
.chip__spot > span { display: block; font-size: 10px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.14em; font-family: var(--font-mono); }
.chip__spot small { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); margin-top: 4px; }
.chip__spot.is-active { border-color: var(--green-bright); background: rgba(110,231,168,0.08); }
.chip__spot.is-active b { color: var(--gold-bright); }
.chip__spot.is-fringe b { color: var(--danger); }
.no-webgl .module__stage .chip__fallback { display: grid; place-items: center; background: radial-gradient(ellipse at 50% 80%, #12301c, #060a0d 70%); }
.chip__fallback svg { width: min(100%, 760px); height: auto; }
@media (max-width: 860px) { .chip__spots { grid-template-columns: repeat(2, 1fr); } }`;

function plan(club, dist, stimp) {
  const c = CLUBS[club] || CLUBS['9-iron'];
  const ratio = c.ratio * (stimp / 10);           // a quicker green rolls a little further
  const carry = dist / (1 + ratio);
  return { club: c, ratio, carry, roll: dist - carry, onGreen: carry - FRINGE };
}
// Low parabola that lands exactly on the spot: range = v² sin2θ / g.
function ballistics(P) {
  const c = Math.max(P.carry * YD, 0.3), th = P.club.launch * DEG;
  const v = Math.sqrt((c * G) / Math.sin(2 * th)), vy = v * Math.sin(th);
  return { vy, vz: v * Math.cos(th), T: (2 * vy) / G, c };
}

export function mountChipCalc(root, preset = {}) {
  const state = { club: CLUBS[preset.club] ? preset.club : '9-iron', dist: num(preset.distance, 8, 35, 20), stimp: num(preset.stimp, 8, 12, 10) };
  let current = plan(state.club, state.dist, state.stimp);
  injectCss();
  root.classList.add('module', 'module--chip');

  // ---------- DOM ----------
  const stageEl = h('div.module__stage');
  const hudShot = h('div.hud.hud--tl'), hudStats = h('div.hud.hud--tr'), hudLand = h('div.hud.hud--bl');
  const fallback = h('div.webgl-fallback.chip__fallback');
  stageEl.append(fallback, hudShot, hudStats, hudLand);
  const clubSeg = h('div.chips');
  for (const k of ORDER) clubSeg.append(h('button.chip', { type: 'button', dataset: { club: k }, onClick: () => selectClub(k) }, CLUBS[k].name));
  const ctl = h('div.ctl', h('div.ctl__row.ctl__row--top', h('label', 'Club'), clubSeg));
  const sliders = {};
  for (const s of SLIDERS) {
    const input = h('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: state[s.key] });
    const out = h('output');
    sliders[s.key] = { input, out, spec: s };
    input.addEventListener('input', () => { state[s.key] = Number(input.value); sync(s.key); refresh(); });
    input.addEventListener('change', () => autoChip());
    ctl.append(h('div.ctl__row', h('label', s.label, s.hint ? h('small.muted', ` ${s.hint}`) : null), input, out));
  }
  const actions = h('div.module__actions',
    h('button.btn.btn--gold.btn--sm', { type: 'button', onClick: () => chip() }, h('span.chip__play', { html: svgIcon.play }), 'Chip'),
    h('span.muted.chip__note', 'Guideline ratios: ball back, hands ahead, putting stroke.'));
  const strip = h('div.chip__strip'), spots = h('div.chip__spots');
  const insight = h('div.insight', h('span.ic', { html: svgIcon.spark }), h('div.insight__text'));
  root.append(
    h('div.module__bar', h('div.module__title', h('span.dot'), 'Chip Calculator'), h('div.module__hint', 'carry : roll guidelines · land it on the green, let it roll like a putt')),
    stageEl, actions,
    h('div.module__panel',
      h('div', h('div.kicker.kicker--gold', 'The shot'), h('div', { style: { height: '10px' } }), ctl),
      h('div.stack', h('div.kicker', 'Where each club lands'), strip, spots, insight)),
  );
  if (preset.caption) root.append(h('div.module__caption', preset.caption));

  // ---------- 3D ----------
  let lineMats = null, pr = 1;
  const stage = createStage(stageEl, { fov: 34, near: 0.05, far: 900, exposure: 1.05, postfx: { bloom: { strength: 0.4, radius: 0.5, threshold: 0.86 }, vignette: 0.5, grain: 0.035 }, onResize: (w, hh) => { if (lineMats) for (const m of lineMats) m.resolution.set(w * pr, hh * pr); } });
  const sunDir = new THREE.Vector3(0.62, 0.1, -0.77);
  let ball, club, flag, ring, ringG, motes, comet, arc, rollLine, landLabel, run = null;
  const camGoal = new THREE.Vector3(), camTarget = new THREE.Vector3(), camLook = new THREE.Vector3();
  if (stage) {
    const { scene, camera, renderer } = stage;
    pr = renderer.getPixelRatio();
    buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.010, fogColor: '#0a161b', sunIntensity: 2.2, skyIntensity: 1.0 });
    scene.add(createRangeGround({ fairwayHalf: 34, sunDir, stripeWidth: 5, greenCenter: new THREE.Vector3(0, 0, GREEN_Z), greenRadius: GREEN_R, green: '#2a6a3c' }));
    scene.add(
      createTreeLine({ side: 1, count: 150, seed: 5, xMin: -80, xMax: 80, zMin: -60, zMax: -170 }),
      createTreeLine({ side: 1, count: 90, seed: 8, xMin: 48, xMax: 130, zMin: 20, zMax: -170 }),
      createTreeLine({ side: -1, count: 90, seed: 13, xMin: 48, xMax: 130, zMin: 20, zMax: -170 }));
    motes = createMotes({ count: quality.tier === 'low' ? 80 : 220, center: [0, 1.2, -12], spread: [30, 3, 34], size: 0.09 });
    ball = createBall({ lowPoly: quality.tier === 'low' }); ball.position.y = BALL_RADIUS;
    flag = createFlag({ height: 2.1 });
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.054, 24), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    hole.rotation.x = -Math.PI / 2; hole.position.y = 0.006; flag.add(hole);
    ring = createLandingRing(); ring.visible = true;
    ringG = new THREE.Group(); ringG.add(ring); ringG.scale.set(0.4, 1, 0.4);
    comet = new THREE.Sprite(new THREE.SpriteMaterial({ map: cometTexture(), color: 0xfff1c9, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, opacity: 0.6 }));
    comet.renderOrder = 30;
    arc = makeLine(0xf3cf7a, 2.2, false); rollLine = makeLine(0x6ee7a8, 1.6, true);
    lineMats = [arc.material, rollLine.material];
    scene.add(motes, ball, flag, ringG, comet, arc, rollLine);
    stage.onFrame((dt, t) => {
      flag.userData.update(t); ring.userData.update(t); motes.userData.update(t);
      step(dt);
      camera.position.lerp(camGoal, 1 - Math.exp(-dt * 2.4));
      camLook.lerp(camTarget, 1 - Math.exp(-dt * 4));
      camera.lookAt(camLook);
      comet.position.copy(ball.position);
      comet.scale.setScalar(THREE.MathUtils.clamp(camera.position.distanceTo(ball.position) * 0.016, 0.1, 0.7));
    });
    stage.start();
  }
  function makeLine(color, width, dashed) {
    const mat = new LineMaterial({ color, linewidth: width, transparent: true, opacity: 0.9, dashed, dashSize: 0.28, gapSize: 0.18, worldUnits: false });
    mat.resolution.set(stage.size.w * pr, stage.size.h * pr);
    const line = new Line2(new LineGeometry(), mat); line.visible = false; return line;
  }
  function setLine(line, positions) {
    line.geometry.dispose(); line.geometry = new LineGeometry(); line.geometry.setPositions(positions);
    line.computeLineDistances(); line.visible = true;
  }
  function cometTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, 'rgba(255,240,200,0.8)'); grd.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function placeClub() {
    if (!stage) return;
    if (club) stage.scene.remove(club);
    club = createClub(state.club);
    club.position.set(0, 0.002, 0.03 + BALL_RADIUS);
    club.rotation.x = -10 * DEG;                    // shaft leaning toward the target
    stage.scene.add(club);
  }
  // Move the flag, landing ring, planned arc and roll line, then re-frame the camera.
  function layout(P) {
    if (!stage) return;
    const D = state.dist * YD, { vy, vz, T, c } = ballistics(P);
    flag.position.set(0, 0, -D);
    ringG.position.set(0, 0, -c);
    const pos = [];
    for (let i = 0; i <= 48; i++) { const t = (i / 48) * T; pos.push(0, Math.max(BALL_RADIUS + vy * t - 0.5 * G * t * t, 0.02), -vz * t); }
    setLine(arc, pos);
    setLine(rollLine, [0, 0.025, -c, 0, 0.025, -D]);
    if (landLabel) { stage.scene.remove(landLabel); landLabel.material.map.dispose(); landLabel.material.dispose(); }
    landLabel = createLabel(`${fmt(P.carry, 1)} yd`, { color: '#f3cf7a', size: 0.42, mono: true });
    landLabel.position.set(0, 0.5, -c); stage.scene.add(landLabel);
    camTarget.set(0.2, 0.15, -D * 0.46);
    const dist = D * 0.98 + 4.2, az = 57 * DEG, el = 16 * DEG;
    camGoal.set(camTarget.x + Math.sin(az) * Math.cos(el) * dist, camTarget.y + Math.sin(el) * dist, camTarget.z + Math.cos(az) * Math.cos(el) * dist);
    if (!camLook.lengthSq()) { camLook.copy(camTarget); stage.camera.position.copy(camGoal).multiplyScalar(1.12); }
  }

  // ---------- Animation ----------
  function chip() {
    if (!stage) return;
    const P = current, { vy, vz, T, c } = ballistics(P);
    const r = Math.max(P.roll * YD, 0.05), a = 1.5 - 0.06 * (state.stimp - 10);
    run = { phase: 'fly', t: 0, vy, vz, T, c, r, Tr: THREE.MathUtils.clamp(Math.sqrt((2 * r) / a), 0.8, 3.2) };
    ball.visible = true; ball.position.set(0, BALL_RADIUS, 0); comet.material.opacity = 1;
    sfx.strike('iron');
  }
  function autoChip() { if (!quality.reducedMotion) chip(); }
  function step(dt) {
    if (!run) return;
    run.t += dt;
    if (run.phase === 'fly') {
      const t = Math.min(run.t, run.T);
      ball.position.set(0, BALL_RADIUS + run.vy * t - 0.5 * G * t * t, -run.vz * t);
      ball.rotation.x -= dt * 25;
      if (run.t >= run.T) { run.phase = 'roll'; run.t = 0; ball.position.set(0, BALL_RADIUS, -run.c); sfx.tick(); }
    } else if (run.phase === 'roll') {
      const k = Math.min(run.t / run.Tr, 1);       // constant deceleration: s = r·(1 − (1 − k)²)
      ball.position.set(0, BALL_RADIUS, -(run.c + run.r * (1 - (1 - k) * (1 - k))));
      ball.rotation.x -= ((2 * run.r * (1 - k)) / run.Tr) * dt / BALL_RADIUS;
      if (k >= 1) { run.phase = 'drop'; run.t = 0; sfx.hole(); }
    } else {
      const k = Math.min(run.t / 0.35, 1);
      ball.position.y = BALL_RADIUS - 0.09 * k * k;
      if (k >= 1) { run = null; ball.visible = false; comet.material.opacity = 0; }
    }
  }

  // ---------- Readouts ----------
  function sync(k) {
    const { input, out, spec } = sliders[k];
    input.value = state[k];
    input.style.setProperty('--pct', `${((state[k] - spec.min) / (spec.max - spec.min)) * 100}%`);
    out.textContent = `${fmt(state[k], spec.step < 1 ? 1 : 0)}${spec.unit}`;
  }
  function stat(lbl, value, cls = '') { return h('div', { class: `hud__stat ${cls}` }, h('b', value), h('span', lbl)); }
  function selectClub(k) { state.club = k; placeClub(); refresh(); autoChip(); }
  function refresh() {
    const P = (current = plan(state.club, state.dist, state.stimp));
    for (const b of clubSeg.children) b.classList.toggle('is-active', b.dataset.club === state.club);
    hudShot.replaceChildren(h('div.hud__shot', h('b', P.club.name), h('span', `carry 1 : roll ${fmt(P.ratio, 1)} · ${P.club.launch}° launch · stimp ${fmt(state.stimp, 1)}`)));
    hudStats.replaceChildren(stat('Carry · air', `${fmt(P.carry, 1)} yd`), stat('Roll · ground', `${fmt(P.roll, 1)} yd`), stat('Ratio', `1 : ${fmt(P.ratio, 1)}`), stat('Landing spot', `${fmt(P.carry, 1)} yd`, 'is-gold'));
    hudLand.replaceChildren(P.onGreen >= 0 ? stat('onto the green', `${fmt(P.onGreen, 1)} yd`, P.onGreen >= 1 ? 'is-green' : '') : stat('short of the green', `${fmt(-P.onGreen, 1)} yd`, 'is-red'));
    const plans = ORDER.map((k) => plan(k, state.dist, state.stimp));
    const fr = (FRINGE / state.dist) * 100;
    strip.style.setProperty('--fringe', `${fr}%`);
    strip.replaceChildren(h('div.chip__track'), h('div.chip__hole', { title: `hole · ${state.dist} yd` }),
      h('div.chip__tick', { style: { left: `${fr / 2}%` } }, 'fringe'), h('div.chip__tick', { style: { left: `${fr + (100 - fr) / 2}%` } }, 'green'),
      ...plans.map((p) => h('div', { class: `chip__mark ${p.club.key === state.club ? 'is-active' : ''} ${p.onGreen < 0 ? 'is-fringe' : ''}`, style: { left: `${(p.carry / state.dist) * 100}%` }, title: `${p.club.name} lands ${fmt(p.carry, 1)} yd out` }, h('span', p.club.short), h('i'))));
    spots.replaceChildren(...plans.map((p) => h('button', { type: 'button', class: `chip__spot ${p.club.key === state.club ? 'is-active' : ''} ${p.onGreen < 0 ? 'is-fringe' : ''}`, onClick: () => selectClub(p.club.key) },
      h('b', fmt(p.carry, 1), h('span.u', 'yd')), h('span', p.club.name), h('small', `${p.onGreen < 0 ? 'on the fringe' : `${fmt(p.onGreen, 1)} yd on`} · roll ${fmt(p.roll, 1)}`))));
    advise(P, plans); renderFallback(P); layout(P);
  }
  function advise(P, plans) {
    const best = plans.find((p) => p.onGreen >= 1) || plans.find((p) => p.onGreen >= 0), parts = [];
    if (P.onGreen < 0) parts.push(`<b>Careful:</b> the ${P.club.name} would land ${fmt(P.carry, 1)} yd out — ${fmt(-P.onGreen, 1)} yd short of the green, on fringe whose first bounce is a guess.`);
    else if (P.onGreen < 1) parts.push(`The ${P.club.name} lands just ${fmt(P.onGreen, 1)} yd onto the green — on the edge, so a slightly heavy strike drops it on the fringe.`);
    else parts.push(`The ${P.club.name} lands ${fmt(P.onGreen, 1)} yd onto the green and rolls the remaining ${fmt(P.roll, 1)} yd like a putt.`);
    if (!best) parts.push(`From ${state.dist} yd nothing lands on the green with a chipping stroke, even the sand wedge (${fmt(plans[3].carry, 1)} yd) — this one wants a firmer pitch.`);
    else if (best.club === P.club) parts.push(`It is also the <b>lowest-lofted club that reaches the green</b> from ${state.dist} yd, so it gets the ball rolling soonest: the pick.`);
    else if (ORDER.indexOf(best.club.key) < ORDER.indexOf(P.club.key)) parts.push(`You can take less loft: the <b>${best.club.name}</b> lands ${fmt(best.onGreen, 1)} yd on and rolls ${fmt(best.roll, 1)} yd — less air time, less to go wrong.`);
    else parts.push(`Take more loft: the <b>${best.club.name}</b> is the lowest-lofted club that lands on the green from here (${fmt(best.carry, 1)} yd out).`);
    parts.push(`Rule of thumb: pick the <b>lowest lofted club whose landing spot is on the green</b>.`);
    insight.querySelector('.insight__text').innerHTML = parts.join(' ');
  }
  // Static side-view explanation shown when WebGL is unavailable.
  function renderFallback(P) {
    const W = 760, x0 = 60, x1 = 690, gy = 170, sx = (yd) => x0 + (yd / state.dist) * (x1 - x0);
    const fr = sx(FRINGE), lx = sx(P.carry), apex = 30 + P.club.launch * 1.6;
    fallback.innerHTML = `<svg viewBox="0 0 ${W} 250" role="img" aria-label="Side view of the chip">
      <rect x="0" y="${gy}" width="${W}" height="80" fill="#0f2417"/><rect x="${fr}" y="${gy}" width="${W - fr}" height="80" fill="#245f34"/>
      <text x="${(x0 + fr) / 2}" y="${gy + 22}" fill="#f3cf7a" font-size="10" text-anchor="middle" font-family="monospace" opacity="0.8">FRINGE</text>
      <path d="M${x0} ${gy} Q ${(x0 + lx) / 2} ${gy - apex * 2} ${lx} ${gy}" fill="none" stroke="#f3cf7a" stroke-width="2"/>
      <line x1="${lx}" y1="${gy}" x2="${x1}" y2="${gy}" stroke="#6ee7a8" stroke-width="2" stroke-dasharray="6 5"/>
      <circle cx="${x0}" cy="${gy - 4}" r="4" fill="#fff"/><circle cx="${lx}" cy="${gy}" r="7" fill="none" stroke="#f3cf7a" stroke-width="1.5"/>
      <line x1="${x1}" y1="${gy}" x2="${x1}" y2="${gy - 70}" stroke="#eee" stroke-width="2"/><path d="M${x1} ${gy - 70} l 22 7 l -22 7 z" fill="#f3cf7a"/>
      <text x="${lx}" y="${gy + 44}" fill="#f3cf7a" font-size="12" text-anchor="middle" font-family="monospace">land ${fmt(P.carry, 1)} yd</text>
      <text x="${(lx + x1) / 2}" y="${gy + 44}" fill="#6ee7a8" font-size="12" text-anchor="middle" font-family="monospace">roll ${fmt(P.roll, 1)} yd</text>
      <text x="${x0}" y="40" fill="#b9c5bf" font-size="14" font-family="sans-serif">Side view · ${P.club.name} from ${state.dist} yd · carry 1 : roll ${fmt(P.ratio, 1)}</text>
      <text x="${x0}" y="60" fill="#7f8f88" font-size="12" font-family="sans-serif">The 3-D preview needs WebGL; the numbers below are the same.</text></svg>`;
  }

  // ---------- Init ----------
  placeClub();
  sync('dist'); sync('stimp');
  refresh();
  if (stage) setTimeout(autoChip, 700);
  return { state, chip, refresh, stage };
}

function num(v, min, max, dflt) { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : dflt; }
function injectCss() { if (!document.getElementById('fi-chip-css')) document.head.append(h('style', { id: 'fi-chip-css' }, CSS)); }
