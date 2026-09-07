// Synthesized sound design (no audio files): strikes, whooshes, a holed putt, UI ticks and a soft ambience.
const KEY = 'fi-audio';
let ctx = null, master = null, ambience = null;
let enabled = false;
try { enabled = localStorage.getItem(KEY) === '1'; } catch { enabled = false; }

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);
  return ctx;
}
function noise(dur) {
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; return src;
}
function env(g, t0, a, peak, d) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d); }

export const sfx = {
  get enabled() { return enabled; },
  set(on) {
    enabled = !!on;
    try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch {}
    if (enabled) { ensure(); ctx.resume?.(); startAmbience(); } else stopAmbience();
    document.dispatchEvent(new CustomEvent('fi:audio', { detail: { enabled } }));
  },
  toggle() { sfx.set(!enabled); },
  strike(kind = 'iron') {
    if (!enabled || !ensure()) return;
    const t = ctx.currentTime;
    const n = noise(0.08); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = kind === 'driver' ? 1600 : kind === 'putter' ? 2600 : 2100; bp.Q.value = 1.2;
    const g = ctx.createGain(); env(g, t, 0.002, kind === 'putter' ? 0.25 : 0.7, 0.07);
    n.connect(bp).connect(g).connect(master); n.start(t);
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(kind === 'driver' ? 420 : 620, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.06);
    const g2 = ctx.createGain(); env(g2, t, 0.002, 0.35, 0.06); o.connect(g2).connect(master); o.start(t); o.stop(t + 0.1);
  },
  whoosh(dur = 0.35) {
    if (!enabled || !ensure()) return;
    const t = ctx.currentTime;
    const n = noise(dur + 0.1); const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2400, t + dur * 0.7); f.frequency.exponentialRampToValueAtTime(500, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + dur * 0.65); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f).connect(g).connect(master); n.start(t);
  },
  hole() {
    if (!enabled || !ensure()) return;
    const t = ctx.currentTime;
    const n = noise(0.12); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const g = ctx.createGain(); env(g, t, 0.003, 0.5, 0.11); n.connect(lp).connect(g).connect(master); n.start(t);
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t + 0.05); o.frequency.exponentialRampToValueAtTime(90, t + 0.2);
    const g2 = ctx.createGain(); env(g2, t + 0.05, 0.005, 0.3, 0.18); o.connect(g2).connect(master); o.start(t + 0.05); o.stop(t + 0.3);
  },
  tick() {
    if (!enabled || !ensure()) return;
    const t = ctx.currentTime; const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 1800;
    const g = ctx.createGain(); env(g, t, 0.001, 0.08, 0.04); o.connect(g).connect(master); o.start(t); o.stop(t + 0.06);
  },
  chime() {
    if (!enabled || !ensure()) return;
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const g = ctx.createGain(); env(g, t + i * 0.09, 0.01, 0.12, 0.5); o.connect(g).connect(master); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.6); });
  },
};
function startAmbience() {
  if (ambience || !ctx) return;
  const n = noise(4); n.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; lp.Q.value = 0.4;
  const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08; const lg = ctx.createGain(); lg.gain.value = 120; lfo.connect(lg).connect(lp.frequency); lfo.start();
  n.connect(lp).connect(g).connect(master); n.start();
  ambience = { n, g, lfo };
}
function stopAmbience() {
  if (!ambience || !ctx) return;
  const { n, g, lfo } = ambience; g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
  setTimeout(() => { try { n.stop(); lfo.stop(); } catch {} }, 900);
  ambience = null;
}
if (enabled) document.addEventListener('pointerdown', () => { ensure(); ctx?.resume?.(); startAmbience(); }, { once: true });
