import { shoot, NINE } from '../physics/ballFlight.js';
import { h, svgIcon, fmt, signed } from '../ui/dom.js';
import { sfx } from '../ui/audio.js';
import { quality } from '../core/quality.js';

// Flight Laws: a top-down 2-D study of the ball-flight laws with a stock 7-iron.
// The face sets the start direction, face-to-path sets the curve; every number comes from physics/ballFlight.js.
const CLUB = '7-iron';
const EXAG = 4;                       // face/path arrows are drawn ×4 so half-degree changes still read
const RANGE = 205;                    // yards downrange that fit the canvas height
const HALF = 27;                      // fairway half-width (yd)
const GREEN = { d: 160, r: 13 };      // a green where the stock 7-iron lands
const DEG = Math.PI / 180, M2YD = 1.0936;
const GOLD = '#f3cf7a', MINT = '#6ee7a8', FLIGHT = '255,241,201';
const SLIDERS = [
  { key: 'face', label: 'Face angle', hint: '+ open', min: -8, max: 8, step: 0.5 },
  { key: 'path', label: 'Club path', hint: '+ in-to-out', min: -8, max: 8, step: 0.5 },
];
const CSS = `
.module--laws .module__stage { background: #071009; }
.laws__legend { display: flex; flex-direction: column; gap: 5px; padding: 9px 12px; border-radius: 10px; background: rgba(6,10,13,0.55); border: 1px solid var(--line); backdrop-filter: blur(6px); font-size: 11px; color: var(--ink-2); letter-spacing: 0.02em; }
.laws__legend i { display: inline-block; width: 20px; height: 0; border-top: 2px solid; vertical-align: middle; margin-right: 9px; }
.laws__legend i.is-dashed { border-top-style: dashed; border-color: rgba(255,255,255,0.55); }
.laws__note { padding: 6px 10px; border-radius: 8px; background: rgba(6,10,13,0.45); border: 1px solid var(--line); font-size: 10px; color: var(--ink-3); letter-spacing: 0.16em; text-transform: uppercase; }
.laws__axes { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-4); }
.laws__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.laws__cell { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 10px 6px 9px; border-radius: 12px; border: 1px solid var(--line); background: var(--surface); color: var(--ink-2); font-size: 12px; font-weight: 600; transition: border-color .2s, background .2s, color .2s, box-shadow .2s; }
.laws__cell:hover { border-color: var(--line-strong); color: var(--ink); }
.laws__cell.is-active { border-color: var(--green-bright); background: rgba(110,231,168,0.10); color: var(--green-bright); box-shadow: 0 0 0 1px rgba(110,231,168,0.25), var(--glow-green); }
.laws__mini { width: 56px; height: 56px; border-radius: 8px; }
.laws__laws { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--line); }
.laws__law { display: grid; grid-template-columns: 24px 52px 1fr; gap: 10px; align-items: baseline; font-size: 13px; line-height: 1.5; color: var(--ink-3); }
.laws__law i { font-style: normal; font-family: var(--font-mono); font-size: 11px; color: var(--gold-bright); }
.laws__law em { font-style: normal; font-weight: 700; color: var(--ink); }
.laws__law b { color: var(--ink-2); font-weight: 600; }`;

export function mountFlightLaws(root, preset = {}) {
  const state = { face: snap(preset.face), path: snap(preset.path) };
  injectCss();
  root.classList.add('module', 'module--laws', 'module--tall');

  // ---------- DOM ----------
  const canvas = h('canvas.laws__map', { 'aria-label': 'Top-down view of the ball flight' });
  const hudShot = h('div.hud.hud--tl');
  const hudStats = h('div.hud.hud--tr');
  const legend = h('div.hud.hud--bl', h('div.laws__legend',
    legendRow(GOLD, 'Face → start direction'), legendRow(MINT, 'Club path'),
    legendRow(`rgb(${FLIGHT})`, 'Ball flight'), legendRow('dashed', 'Start line')));
  const note = h('div.hud.hud--br', h('div.laws__note', `top view · stock 7-iron · arrows ×${EXAG}`));
  const stageEl = h('div.module__stage', canvas, hudShot, hudStats, legend, note);

  const ctl = h('div.ctl');
  const sliders = {};
  for (const s of SLIDERS) {
    const input = h('input', { type: 'range', min: s.min, max: s.max, step: s.step, value: state[s.key] });
    const out = h('output');
    sliders[s.key] = { input, out, spec: s };
    input.addEventListener('input', () => { state[s.key] = Number(input.value); sync(s.key); update(false); });
    input.addEventListener('change', () => update(true));
    ctl.append(h('div.ctl__row', h('label', s.label, h('small.muted', ` ${s.hint}`)), input, out));
  }
  ctl.append(h('div.ctl__row', h('label', 'Quick set'), h('div.chips',
    h('button.chip', { type: 'button', onClick: () => setShot(0, 0) }, 'Square it up'),
    h('button.chip', { type: 'button', onClick: () => setShot(-state.face, -state.path) }, 'Mirror the shot'),
    h('button.chip', { type: 'button', onClick: () => setShot(state.face, state.face) }, 'Match path to face'))));
  const laws = h('div.laws__laws',
    law('01', 'Start', 'The ball starts close to where the <b>face</b> points — with an iron, about three-quarters of the way from the path to the face.'),
    law('02', 'Curve', 'The ball curves away from the <b>path</b> and toward the face: face open to the path fades, face closed to it draws.'),
    law('03', 'Size', 'The wider the face-to-path gap, the more the spin axis tilts and the further the ball bends.'));

  const grid = h('div.laws__grid');
  const cells = NINE.map((p) => {
    const mini = h('canvas.laws__mini');
    const btn = h('button.laws__cell', { type: 'button', title: `face ${signed(p.face, 0, '°')} · path ${signed(p.path, 0, '°')}`, onClick: () => { sfx.tick(); setShot(p.face, p.path); } }, mini, h('span', p.name));
    grid.append(btn);
    return { btn, mini, p };
  });
  const insight = h('div.insight', h('span.ic', { html: svgIcon.spark }), h('div.insight__text'));
  root.append(
    h('div.module__bar', h('div.module__title', h('span.dot'), 'Flight Laws'), h('div.module__hint', 'face sets the start · face-to-path sets the curve')),
    stageEl,
    h('div.module__panel',
      h('div', h('div.kicker.kicker--gold', 'Delivery'), h('div', { style: { height: '10px' } }), ctl, laws),
      h('div.stack', h('div.kicker', 'The nine ball flights'), h('div.laws__axes', h('span', 'rows · start direction'), h('span', 'columns · curve')), grid, insight)),
  );
  if (preset.caption) root.append(h('div.module__caption', preset.caption));

  // ---------- Canvas ----------
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, bg = null, result = null, raf = 0, anim = null;
  const padB = 34, padT = 24;
  const ppy = () => (H - padB - padT) / RANGE;             // px per yard
  const sx = (x) => W / 2 + x * ppy();                     // x: yards right of the target line
  const sy = (d) => H - padB - d * ppy();                  // d: yards downrange

  function resize() {
    const w = stageEl.clientWidth, hh = stageEl.clientHeight;
    if (!w || !hh) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = w; H = hh;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    bg = paintBackground();
    schedule();
  }
  new ResizeObserver(resize).observe(stageEl);
  document.fonts?.ready.then(() => { if (W) { bg = paintBackground(); schedule(); } });

  // Static layer: a yardage-book style map painted once per resize.
  function paintBackground() {
    const off = document.createElement('canvas'); off.width = canvas.width; off.height = canvas.height;
    const g = off.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const k = ppy(), rand = lcg(11);
    const grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, '#05100a'); grad.addColorStop(1, '#0b1d13');
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,255,255,0.035)';
    for (let i = 0; i < (W * H) / 900; i++) g.fillRect(rand() * W, rand() * H, 1, 1);
    // trees in the rough
    g.lineWidth = 1;
    for (let i = 0; i < 110; i++) {
      const side = i % 2 ? 1 : -1, x = side * (HALF + 7 + rand() * 115), d = rand() * (RANGE + 10) - 4, r = (2.5 + rand() * 4) * k;
      const X = sx(x), Y = sy(d); if (X < -r || X > W + r) continue;
      g.fillStyle = 'rgba(0,0,0,0.28)'; g.strokeStyle = 'rgba(110,231,168,0.13)';
      g.beginPath(); g.arc(X, Y, r, 0, Math.PI * 2); g.fill(); g.stroke();
    }
    // fairway corridor with gently wandering edges and mown stripes
    const edge = (side, d) => sx(side * (HALF + Math.sin(d * 0.045 + side) * 2.2));
    g.beginPath();
    for (let d = -6; d <= RANGE + 6; d += 4) g.lineTo(edge(-1, d), sy(d));
    for (let d = RANGE + 6; d >= -6; d -= 4) g.lineTo(edge(1, d), sy(d));
    g.closePath(); g.fillStyle = 'rgba(110,231,168,0.06)'; g.fill();
    g.save(); g.clip(); g.fillStyle = 'rgba(255,255,255,0.022)';
    for (let d = 0; d < RANGE + 10; d += 30) g.fillRect(0, sy(d + 15), W, sy(d) - sy(d + 15));
    g.restore(); g.strokeStyle = 'rgba(110,231,168,0.25)'; g.stroke();
    // bunkers and the green
    for (const [x, d, rx, ry, rot] of [[-19, 151, 5.5, 3.2, -0.4], [17, 170, 4.5, 3, 0.5]]) {
      g.beginPath(); g.ellipse(sx(x), sy(d), rx * k, ry * k, rot, 0, Math.PI * 2);
      g.fillStyle = 'rgba(243,207,122,0.08)'; g.fill(); g.strokeStyle = 'rgba(243,207,122,0.35)'; g.stroke();
    }
    g.beginPath(); g.arc(sx(0), sy(GREEN.d), GREEN.r * k, 0, Math.PI * 2);
    g.fillStyle = 'rgba(110,231,168,0.11)'; g.fill(); g.strokeStyle = 'rgba(110,231,168,0.4)'; g.stroke();
    g.fillStyle = GOLD; g.beginPath(); g.arc(sx(0), sy(GREEN.d), 2.2, 0, Math.PI * 2); g.fill();
    // target line and yardage ticks
    g.setLineDash([4, 7]); g.strokeStyle = 'rgba(110,231,168,0.45)'; g.beginPath(); g.moveTo(sx(0), sy(0)); g.lineTo(sx(0), sy(RANGE)); g.stroke(); g.setLineDash([]);
    g.font = '500 10px "JetBrains Mono", monospace'; g.textBaseline = 'middle';
    for (const d of [50, 100, 150, 200]) {
      g.strokeStyle = 'rgba(255,255,255,0.13)'; g.beginPath(); g.moveTo(sx(-HALF - 3), sy(d)); g.lineTo(sx(HALF + 3), sy(d)); g.stroke();
      g.fillStyle = 'rgba(243,207,122,0.6)'; g.textAlign = 'right'; g.fillText(`${d}`, sx(-HALF - 8), sy(d)); g.textAlign = 'left'; g.fillText(`${d}`, sx(HALF + 8), sy(d));
    }
    const v = g.createRadialGradient(W / 2, H * 0.55, H * 0.35, W / 2, H * 0.55, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(3,7,5,0)'); v.addColorStop(1, 'rgba(3,7,5,0.6)');
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    return off;
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); }
  function render() {
    if (!bg || !result) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bg, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let k = 1;
    if (anim) { k = Math.min(1, (performance.now() - anim.t0) / anim.dur); k = 1 - Math.pow(1 - k, 3); if (k >= 1) anim = null; else schedule(); }
    const { launch: L, flight: F } = result;
    // start line
    ctx.setLineDash([3, 6]); ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx(0), sy(0)); ctx.lineTo(sx(Math.tan(L.startDir * DEG) * RANGE), sy(RANGE)); ctx.stroke(); ctx.setLineDash([]);
    // flight: soft glow under a bright core
    const pts = F.points, n = Math.max(2, Math.round(pts.length * k));
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const [w, a] of [[7, 0.16], [2, 0.95]]) {
      ctx.strokeStyle = `rgba(${FLIGHT},${a})`; ctx.lineWidth = w; ctx.beginPath();
      for (let i = 0; i < n; i++) { const X = sx(pts[i][0] * M2YD), Y = sy(-pts[i][2] * M2YD); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.stroke();
    }
    if (k < 1) dot(sx(pts[n - 1][0] * M2YD), sy(-pts[n - 1][2] * M2YD), 3, `rgba(${FLIGHT},1)`);
    else {
      const last = pts[pts.length - 1], prev = pts[Math.max(0, pts.length - 3)];
      const lx = sx(last[0] * M2YD), ly = sy(-last[2] * M2YD);
      const dx = last[0] - prev[0], dz = -(last[2] - prev[2]), len = Math.hypot(dx, dz) || 1;
      const rx = lx + (dx / len) * F.roll * ppy(), ry = ly - (dz / len) * F.roll * ppy();
      ctx.setLineDash([2, 4]); ctx.strokeStyle = `rgba(${FLIGHT},0.5)`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke(); ctx.setLineDash([]);
      dot(rx, ry, 2.5, `rgba(${FLIGHT},0.6)`);
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(lx, ly, 5.5, 0, Math.PI * 2); ctx.stroke(); dot(lx, ly, 2, GOLD);
    }
    drawDelivery(L);
  }
  function drawDelivery(L) {
    const bx = sx(0), by = sy(0), len = Math.min(96, Math.max(60, H * 0.14));
    const fa = L.face * EXAG * DEG, pa = L.path * EXAG * DEG;
    if (Math.abs(fa - pa) > 1.5 * DEG) {   // the face-to-path wedge
      ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(bx, by, len * 0.62, Math.min(fa, pa) - Math.PI / 2, Math.max(fa, pa) - Math.PI / 2); ctx.stroke(); ctx.setLineDash([]);
    }
    const fx = Math.sin(fa), fy = -Math.cos(fa);   // clubface: a short bar perpendicular to the face normal, just behind the ball
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(bx - fx * 7 - fy * 13, by - fy * 7 + fx * 13); ctx.lineTo(bx - fx * 7 + fy * 13, by - fy * 7 - fx * 13); ctx.stroke();
    const pHead = arrow(bx, by, pa, len * 0.92, MINT);
    const fHead = arrow(bx, by, fa, len, GOLD);
    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 14); glow.addColorStop(0, 'rgba(255,255,255,0.6)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
    dot(bx, by, 4, '#ffffff');
    const faceLeft = fa <= pa;                     // whichever arrow leans further left takes the left-hand label
    label(`FACE ${signed(L.face, 1, '°')}`, fHead, faceLeft ? 'right' : 'left', GOLD);
    label(`PATH ${signed(L.path, 1, '°')}`, pHead, faceLeft ? 'left' : 'right', MINT);
  }
  function arrow(x0, y0, ang, len, color) {
    const dx = Math.sin(ang), dy = -Math.cos(ang), x1 = x0 + dx * len, y1 = y0 + dy * len;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color; ctx.globalAlpha = 0.22; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - dx * 6, y1 - dy * 6); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - dx * 10 - dy * 5, y1 - dy * 10 + dx * 5); ctx.lineTo(x1 - dx * 10 + dy * 5, y1 - dy * 10 - dx * 5); ctx.closePath(); ctx.fill();
    return [x1, y1];
  }
  function label(text, [x, y], align, color) {
    ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = align; ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 4;
    ctx.fillText(text, x + (align === 'left' ? 10 : -10), y - 2);
    ctx.shadowBlur = 0;
  }
  function dot(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

  // Tiny top-down sketch for a grid cell (lateral offset ×2.2 so the shape reads at 56 px).
  function drawMini(mini, res) {
    const S = 56, d = Math.min(devicePixelRatio || 1, 2);
    mini.width = S * d; mini.height = S * d;
    const g = mini.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0);
    const k = (S - 12) / 175, cx = S / 2, by = S - 6;
    const px = (p) => [cx + p[0] * M2YD * k * 2.2, by - -p[2] * M2YD * k];
    g.fillStyle = 'rgba(6,10,13,0.6)'; g.beginPath(); g.roundRect(0, 0, S, S, 8); g.fill();
    g.strokeStyle = 'rgba(110,231,168,0.35)'; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(cx, by); g.lineTo(cx, 6); g.stroke(); g.setLineDash([]);
    g.strokeStyle = `rgb(${FLIGHT})`; g.lineWidth = 1.5; g.lineJoin = 'round'; g.beginPath();
    res.flight.points.forEach((p, i) => { const [X, Y] = px(p); i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
    g.stroke();
    const [ex, ey] = px(res.flight.points[res.flight.points.length - 1]);
    g.fillStyle = GOLD; g.beginPath(); g.arc(ex, ey, 2.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, by, 1.6, 0, Math.PI * 2); g.fill();
  }

  // ---------- State ----------
  function sync(k) {
    const { input, out, spec } = sliders[k];
    input.value = state[k];
    input.style.setProperty('--pct', `${((state[k] - spec.min) / (spec.max - spec.min)) * 100}%`);
    out.textContent = signed(state[k], 1, '°');
  }
  function setShot(face, path) { state.face = snap(face); state.path = snap(path); sync('face'); sync('path'); update(true); }
  function update(animate) {
    result = shoot({ club: CLUB, face: state.face, path: state.path });
    const idx = NINE.findIndex((p) => p.face === state.face && p.path === state.path);
    cells.forEach((c, i) => c.btn.classList.toggle('is-active', i === idx));
    renderHud(); renderInsight();
    anim = animate && !quality.reducedMotion ? { t0: performance.now(), dur: 900 } : null;
    schedule();
  }
  function stat(lbl, value, cls = '') { return h('div', { class: `hud__stat ${cls}` }, h('b', value), h('span', lbl)); }
  function renderHud() {
    const { launch: L, flight: F, shot: C } = result;
    hudShot.replaceChildren(h('div.hud__shot', h('b', C.name), h('span', `face-to-path ${signed(C.faceToPath, 1, '°')} · ${C.verdict}`)));
    hudStats.replaceChildren(
      stat('Start dir', signed(L.startDir, 1, '°'), 'is-gold'), stat('Curve', signed(F.curve, 0, ' yd'), 'is-green'),
      stat('Carry', `${fmt(F.carry)} yd`), stat('Offline', signed(F.offline, 0, ' yd'), Math.abs(F.offline) > 15 ? 'is-red' : ''));
  }
  function renderInsight() {
    const { launch: L, flight: F, shot: C } = result;
    const side = (v) => (v > 0 ? 'right' : 'left');
    const ftp = L.face - L.path, parts = [];
    const share = Math.abs(ftp) > 0.01 ? Math.round(((L.startDir - L.path) / ftp) * 100) : 77;
    if (Math.abs(L.face) < 0.25) parts.push(`With a <b>square face</b> the ball starts on the target line${Math.abs(L.path) >= 0.5 ? ` — the path only nudges it to ${signed(L.startDir, 1, '°')}, about ${100 - share}% of its own angle` : ''}.`);
    else parts.push(`The face is <b>${fmt(Math.abs(L.face), 1)}° ${L.face > 0 ? 'open' : 'closed'}</b>, so the ball starts <b>${fmt(Math.abs(L.startDir), 1)}° ${side(L.startDir)}</b>: with an iron the face sets about ${share}% of the start direction and the path the rest.`);
    if (Math.abs(ftp) < 0.75) parts.push(`Path and face match, so the spin axis stays level and the flight holds its start line: a <b>${C.name}</b> that finishes ${fmt(Math.abs(F.offline))} yd ${side(F.offline)} of the target.`);
    else parts.push(`The face is <b>${fmt(Math.abs(ftp), 1)}° ${ftp > 0 ? 'open' : 'closed'} to the path</b>, which tilts the spin axis ${signed(L.axisTilt, 0, '°')} and bends the ball <b>${fmt(Math.abs(F.curve))} yd ${side(F.curve)}</b>: a <b>${C.name}</b> that finishes ${fmt(Math.abs(F.offline))} yd ${side(F.offline)} of the target.`);
    insight.querySelector('.insight__text').innerHTML = parts.join(' ');
  }

  // ---------- Init ----------
  for (const c of cells) drawMini(c.mini, shoot({ club: CLUB, face: c.p.face, path: c.p.path }));
  sync('face'); sync('path');
  update(true);
  return { state, setShot, update };
}

function snap(v) { const n = Number(v); return Number.isFinite(n) ? Math.max(-8, Math.min(8, Math.round(n * 2) / 2)) : 0; }
function lcg(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function legendRow(color, text) { return h('div', h('i', color === 'dashed' ? { class: 'is-dashed' } : { style: { borderColor: color } }), text); }
function law(num, title, html) { return h('div.laws__law', h('i', num), h('em', title), h('span', { html })); }
function injectCss() { if (!document.getElementById('fi-laws-css')) document.head.append(h('style', { id: 'fi-laws-css' }, CSS)); }
