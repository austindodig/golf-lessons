import { h, fmt } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

// The clock system for wedge distance control: lead-arm positions at 7:30, 9:00 and 10:30
// produce three stock carries per wedge. Full-swing numbers are editable and remembered.
const WEDGES = [
  { key: 'lob-wedge', label: 'Lob wedge', short: 'LW', loft: 60, full: 65 },
  { key: 'sand-wedge', label: 'Sand wedge', short: 'SW', loft: 56, full: 85 },
  { key: 'gap-wedge', label: 'Gap wedge', short: 'GW', loft: 52, full: 100 },
  { key: 'pitching-wedge', label: 'Pitching wedge', short: 'PW', loft: 46, full: 115 },
];
const POS = [
  { key: '7:30', hour: 7.5, pct: 0.45, hinge: 45, note: 'Hands just past the trail hip. Wrists half set. The quietest, most repeatable swing you own.' },
  { key: '9:00', hour: 9, pct: 0.65, hinge: 90, note: 'Lead arm parallel to the ground, wrists fully set, shaft pointing up. The workhorse pitch.' },
  { key: '10:30', hour: 10.5, pct: 0.85, hinge: 90, note: 'Lead arm above shoulder height. Almost a full swing, still with the same tempo.' },
];
const KEY = 'fi-wedge-matrix';
const ns = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}) => { const el = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); return el; };

export function mountWedgeClock(root, preset = {}) {
  let matrix = {};
  try { matrix = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
  const fullOf = (w) => Number(matrix[w.key]) || w.full;
  const state = { club: WEDGES.find((w) => w.key === preset.club) ? preset.club : 'sand-wedge', pos: 1, angle: 180, target: 180 };

  root.classList.add('module', 'module--clock');
  const stageEl = h('div.module__stage.module__stage--svg');
  const hudTL = h('div.hud.hud--tl'), hudTR = h('div.hud.hud--tr');
  const S = svg('svg', { viewBox: '0 0 900 520', class: 'clock', role: 'img', 'aria-label': 'Wedge clock system' });
  stageEl.append(S, hudTL, hudTR);

  // ----- Clock face -----
  const cx = 250, cy = 250, R = 175;
  const face = svg('g');
  face.append(svg('circle', { cx, cy, r: R, fill: 'none', stroke: 'rgba(255,255,255,0.12)', 'stroke-width': 1 }));
  face.append(svg('circle', { cx, cy, r: R + 22, fill: 'none', stroke: 'rgba(255,255,255,0.05)', 'stroke-width': 1, 'stroke-dasharray': '2 6' }));
  for (let hr = 0; hr < 12; hr++) {
    const a = (hr * 30 * Math.PI) / 180, big = hr % 3 === 0;
    face.append(svg('line', { x1: cx + Math.sin(a) * (R - (big ? 14 : 8)), y1: cy - Math.cos(a) * (R - (big ? 14 : 8)), x2: cx + Math.sin(a) * R, y2: cy - Math.cos(a) * R, stroke: big ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)', 'stroke-width': big ? 2 : 1 }));
    if (big) { const t = svg('text', { x: cx + Math.sin(a) * (R + 34), y: cy - Math.cos(a) * (R + 34) + 5, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.45)', 'font-size': 13, 'font-family': 'JetBrains Mono, monospace' }); t.textContent = hr === 0 ? '12' : String(hr); face.append(t); }
  }
  const posMarks = POS.map((p) => {
    const a = (p.hour * 30 * Math.PI) / 180;
    const g = svg('g', { class: 'clock__mark', style: 'cursor:pointer' });
    g.append(svg('circle', { cx: cx + Math.sin(a) * (R + 6), cy: cy - Math.cos(a) * (R + 6), r: 6, fill: '#f3cf7a', opacity: 0.9 }));
    const t = svg('text', { x: cx + Math.sin(a) * (R + 58), y: cy - Math.cos(a) * (R + 58) + 5, 'text-anchor': 'middle', fill: '#f3cf7a', 'font-size': 15, 'font-weight': 700, 'font-family': 'Manrope, sans-serif' }); t.textContent = p.key; g.append(t);
    g.addEventListener('click', () => setPos(POS.indexOf(p)));
    return g;
  });
  face.append(...posMarks);
  // Golfer: head, spine, hips, legs, drawn face-on with the target to the right.
  const body = svg('g', { stroke: '#6ee7a8', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none', opacity: 0.85 });
  body.append(svg('circle', { cx: cx + 8, cy: cy - 52, r: 18, stroke: '#6ee7a8', fill: 'rgba(110,231,168,0.08)' }));
  body.append(svg('path', { d: `M${cx + 4} ${cy - 34} L${cx - 6} ${cy + 70} M${cx - 6} ${cy + 70} L${cx - 42} ${cy + 165} M${cx - 6} ${cy + 70} L${cx + 40} ${cy + 165} M${cx - 44} ${cy + 168} h20 M${cx + 30} ${cy + 168} h22` }));
  const armG = svg('g', { 'stroke-linecap': 'round', fill: 'none' });
  const arm = svg('line', { stroke: '#f3cf7a', 'stroke-width': 5 });
  const forearmTrail = svg('line', { stroke: 'rgba(110,231,168,0.6)', 'stroke-width': 3 });
  const shaft = svg('line', { stroke: '#dfe6e2', 'stroke-width': 3 });
  const head = svg('circle', { r: 7, fill: '#dfe6e2' });
  const hands = svg('circle', { r: 6, fill: '#f3cf7a' });
  armG.append(forearmTrail, arm, shaft, head, hands);
  const pivot = svg('circle', { cx, cy, r: 5, fill: '#f3cf7a' });
  const ball = svg('circle', { cx: cx + 50, cy: cy + 172, r: 6, fill: '#fff' });
  const ground = svg('line', { x1: 40, y1: cy + 178, x2: 470, y2: cy + 178, stroke: 'rgba(110,231,168,0.35)', 'stroke-width': 1 });
  S.append(face, body, armG, pivot, ball, ground);

  // ----- Flight panel (right) -----
  const fx0 = 520, fy0 = 400, fw = 340;
  const flight = svg('g');
  flight.append(svg('line', { x1: fx0, y1: fy0, x2: fx0 + fw + 10, y2: fy0, stroke: 'rgba(110,231,168,0.35)', 'stroke-width': 1 }));
  for (const d of [25, 50, 75, 100, 125]) {
    const x = fx0 + (d / 130) * fw;
    flight.append(svg('line', { x1: x, y1: fy0, x2: x, y2: fy0 + 6, stroke: 'rgba(255,255,255,0.3)' }));
    const t = svg('text', { x, y: fy0 + 22, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.4)', 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }); t.textContent = d; flight.append(t);
  }
  const arcs = POS.map((p, i) => svg('path', { fill: 'none', stroke: i === 1 ? '#f3cf7a' : 'rgba(243,207,122,0.35)', 'stroke-width': i === 1 ? 3 : 1.5, 'stroke-dasharray': i === 1 ? '' : '4 5' }));
  flight.append(...arcs);
  const landing = svg('circle', { r: 6, fill: '#f3cf7a' });
  const carryText = svg('text', { fill: '#f3cf7a', 'font-size': 40, 'font-family': 'Cormorant Garamond, serif', 'font-weight': 600 });
  const carrySub = svg('text', { fill: 'rgba(255,255,255,0.5)', 'font-size': 12, 'font-family': 'JetBrains Mono, monospace', 'letter-spacing': '0.15em' });
  flight.append(landing, carryText, carrySub);
  S.append(flight);

  // ----- Panel -----
  const clubSeg = h('div.chips');
  for (const w of WEDGES) clubSeg.append(h('button.chip', { type: 'button', dataset: { club: w.key }, onClick: () => { state.club = w.key; sync(); } }, `${w.label} ${w.loft}°`));
  const posSeg = h('div.seg.seg--gold');
  POS.forEach((p, i) => posSeg.append(h('button', { type: 'button', dataset: { i }, onClick: () => setPos(i) }, p.key)));
  const inputs = h('div.clock__inputs');
  for (const w of WEDGES) {
    const inp = h('input', { type: 'number', min: 20, max: 160, step: 1, value: fullOf(w), 'aria-label': `${w.label} full swing carry` });
    inp.addEventListener('input', () => { matrix[w.key] = Number(inp.value) || w.full; try { localStorage.setItem(KEY, JSON.stringify(matrix)); } catch {} sync(); });
    inputs.append(h('label.clock__input', h('span', `${w.short} full`), inp, h('em', 'yd')));
  }
  const table = h('table.clock__table');
  const insight = h('div.insight', h('div', 'Same tempo, same rhythm, three arm lengths. The clock position sets the distance; never slow the club down to take yards off.'));
  const panel = h('div.module__panel',
    h('div', h('div.kicker.kicker--gold', 'Your wedges'), h('div', { style: { height: '10px' } }), h('div.ctl', h('div.ctl__row', h('label', 'Wedge'), clubSeg), h('div.ctl__row', h('label', 'Position'), posSeg), h('div.ctl__row', h('label', 'Full carry'), inputs))),
    h('div.stack', h('div.kicker', 'Your yardage matrix'), table, insight));
  root.append(h('div.module__bar', h('div.module__title', h('span.dot'), 'Wedge Clock'), h('div.module__hint', '45% · 65% · 85% of your full carry — calibrate on the range')), stageEl, panel);
  if (preset.caption) root.append(h('div.module__caption', preset.caption));

  // ----- Logic -----
  function carryFor(w, i) { return fullOf(w) * POS[i].pct; }
  function drawArm(angleDeg, hingeDeg) {
    const a = (angleDeg * Math.PI) / 180;
    const ax = Math.sin(a), ay = -Math.cos(a);
    const L = R - 10;
    const hx = cx + ax * L, hy = cy + ay * L;
    arm.setAttribute('x1', cx); arm.setAttribute('y1', cy); arm.setAttribute('x2', hx); arm.setAttribute('y2', hy);
    forearmTrail.setAttribute('x1', cx + 30); forearmTrail.setAttribute('y1', cy + 6); forearmTrail.setAttribute('x2', hx); forearmTrail.setAttribute('y2', hy);
    const hr = (hingeDeg * Math.PI) / 180;
    const sx = Math.cos(hr) * ax - Math.sin(hr) * ay, sy = Math.sin(hr) * ax + Math.cos(hr) * ay;
    const CL = 150;
    shaft.setAttribute('x1', hx); shaft.setAttribute('y1', hy); shaft.setAttribute('x2', hx + sx * CL); shaft.setAttribute('y2', hy + sy * CL);
    head.setAttribute('cx', hx + sx * CL); head.setAttribute('cy', hy + sy * CL);
    hands.setAttribute('cx', hx); hands.setAttribute('cy', hy);
  }
  function drawFlights() {
    const w = WEDGES.find((x) => x.key === state.club);
    POS.forEach((p, i) => {
      const c = carryFor(w, i), x1 = fx0 + (c / 130) * fw, hgt = 40 + c * 1.3 * (w.loft / 56);
      arcs[i].setAttribute('d', `M${fx0} ${fy0} Q${(fx0 + x1) / 2} ${fy0 - hgt} ${x1} ${fy0}`);
      arcs[i].setAttribute('stroke', i === state.pos ? '#f3cf7a' : 'rgba(243,207,122,0.3)');
      arcs[i].setAttribute('stroke-width', i === state.pos ? 3 : 1.5);
      arcs[i].setAttribute('stroke-dasharray', i === state.pos ? '' : '4 5');
    });
    const c = carryFor(w, state.pos), x1 = fx0 + (c / 130) * fw;
    landing.setAttribute('cx', x1); landing.setAttribute('cy', fy0);
    carryText.setAttribute('x', fx0); carryText.setAttribute('y', 110); carryText.textContent = `${fmt(c)} yd`;
    carrySub.setAttribute('x', fx0 + 2); carrySub.setAttribute('y', 132); carrySub.textContent = `${w.label.toUpperCase()} · ${POS[state.pos].key} · ${Math.round(POS[state.pos].pct * 100)}% OF FULL`;
  }
  function drawTable() {
    const rows = WEDGES.map((w) => h('tr', { class: w.key === state.club ? 'is-current' : '' }, h('th', `${w.short} ${w.loft}°`), ...POS.map((p, i) => h('td', { class: w.key === state.club && i === state.pos ? 'is-active' : '' }, fmt(carryFor(w, i)))), h('td.full', fmt(fullOf(w)))));
    table.replaceChildren(h('thead', h('tr', h('th', ''), ...POS.map((p) => h('th', p.key)), h('th', 'Full'))), h('tbody', ...rows));
  }
  function setPos(i) { state.pos = i; state.target = POS[i].hour * 30; sfx.tick(); sync(); }
  function sync() {
    clubSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.club === state.club));
    posSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.i) === state.pos));
    posMarks.forEach((g, i) => g.setAttribute('opacity', i === state.pos ? 1 : 0.45));
    const w = WEDGES.find((x) => x.key === state.club);
    hudTL.replaceChildren(h('div.hud__shot', h('b', `${POS[state.pos].key} · ${fmt(carryFor(w, state.pos))} yd`), h('span', POS[state.pos].note)));
    hudTR.replaceChildren(...POS.map((p, i) => h('div.hud__stat', { class: i === state.pos ? 'hud__stat is-gold' : 'hud__stat' }, h('b', `${fmt(carryFor(w, i))}`), h('span', p.key))));
    drawFlights(); drawTable();
  }
  // Arm animation
  let raf = 0;
  function animate() {
    const targetHinge = POS[state.pos].hinge;
    const d = state.target - state.angle;
    state.angle += quality.reducedMotion ? d : d * 0.12;
    const k = Math.min(1, Math.abs(state.angle - 180) / 60);
    drawArm(state.angle, targetHinge * Math.min(1, k * 1.3));
    if (Math.abs(d) > 0.05) raf = requestAnimationFrame(animate); else { drawArm(state.target, targetHinge); raf = 0; }
  }
  const origSetPos = setPos;
  setPos = function (i) { origSetPos(i); if (!raf) raf = requestAnimationFrame(animate); };
  posSeg.querySelectorAll('button').forEach((b, i) => { b.onclick = () => setPos(i); });
  posMarks.forEach((g, i) => { g.onclick = () => setPos(i); });
  setPos(1);
  drawArm(state.angle, 0);
  return { state, setPos };
}
