// Putting on a tilted green: gravity along the surface gradient plus stimp-derived rolling resistance.
const G = 9.81;
const ROLL = 5 / 7;               // a rolling sphere converts only 5/7 of the slope force into acceleration
export const HOLE_R = 0.054;      // 4.25 in cup
export const BALL_R = 0.02135;
export const FT = 0.3048;

// Surface height (m). slopePct: rise per 100 across; dirDeg: downhill direction measured from the target line
// (0 = downhill toward the hole, 90 = downhill to the golfer's right → left-to-right break).
export function makeGreen({ slopePct = 2, dirDeg = 90, undulation = 0 } = {}) {
  const s = slopePct / 100, a = (dirDeg * Math.PI) / 180;
  const dx = Math.sin(a), dz = -Math.cos(a);          // downhill unit vector in xz
  return {
    slopePct, dirDeg, undulation,
    height(x, z) { return -s * (x * dx + z * dz) + undulation * (Math.sin(x * 1.7) * Math.cos(z * 0.9)) * 0.01; },
    grad(x, z) {
      const e = 0.01;
      return [(this.height(x + e, z) - this.height(x - e, z)) / (2 * e), (this.height(x, z + e) - this.height(x, z - e)) / (2 * e)];
    },
    downhill: [dx, dz],
  };
}

export function stimpDecel(stimp) { return 5.49 / stimp; }          // m/s² from the Stimpmeter release speed

// Speed needed on a flat green to finish `pastFt` feet beyond a hole `distM` away.
export function paceSpeed(distM, pastFt, stimp) { return Math.sqrt(2 * stimpDecel(stimp) * (distM + pastFt * FT)); }

export function rollPutt({ green, distFt = 15, aimCups = 0, pastFt = 1, stimp = 10, dt = 1 / 240 }) {
  const D = distFt * FT;
  const hole = [0, -D];
  const aimM = aimCups * (HOLE_R * 2);
  const ang = Math.atan2(aimM, D);                       // + = aim right
  const v0 = paceSpeed(D, pastFt, stimp);
  let p = [0, 0], v = [v0 * Math.sin(ang), -v0 * Math.cos(ang)];
  const decel = stimpDecel(stimp);
  const pts = [[0, 0, 0]];
  let t = 0, holed = false, lipped = false, minHoleDist = 1e9, maxLateral = 0, closest = null;
  while (t < 25) {
    const speed = Math.hypot(v[0], v[1]);
    const g = green.grad(p[0], p[1]);
    const ax = -ROLL * G * g[0] - (speed > 1e-4 ? decel * (v[0] / speed) : 0);
    const az = -ROLL * G * g[1] - (speed > 1e-4 ? decel * (v[1] / speed) : 0);
    const nv = [v[0] + ax * dt, v[1] + az * dt];
    // stop when friction has consumed the velocity (avoid oscillating around zero)
    if (speed < 0.03 && Math.hypot(nv[0], nv[1]) < 0.03 && Math.hypot(ROLL * G * g[0], ROLL * G * g[1]) < decel) { v = [0, 0]; break; }
    v = nv;
    p = [p[0] + v[0] * dt, p[1] + v[1] * dt];
    t += dt;
    const dh = Math.hypot(p[0] - hole[0], p[1] - hole[1]);
    if (dh < minHoleDist) { minHoleDist = dh; closest = [...p]; }
    maxLateral = Math.max(maxLateral, Math.abs(p[0]));
    if (dh < HOLE_R - BALL_R * 0.35) {
      const sp = Math.hypot(v[0], v[1]);
      if (sp < 1.55) { holed = true; pts.push([hole[0], hole[1], t]); break; }
      else { lipped = true; }
    }
    if (Math.round(t / dt) % 4 === 0) pts.push([p[0], p[1], t]);
  }
  pts.push([p[0], p[1], t]);
  const finish = p;
  const past = -(finish[1] - hole[1]);                    // + = finished beyond the hole
  const side = finish[0] - hole[0];                      // + = right of the hole
  return { points: pts, holed, lipped, time: t, finish, pastFt: past / FT, sideFt: side / FT, minHoleDistFt: minHoleDist / FT, closest, breakIn: (maxLateral / 0.0254), v0 };
}

// Scan aims to find the ones that hole out at this pace; returns the recommended aim in cups and the range.
export function solveAim(args, { minCups = -30, maxCups = 30, step = 0.25 } = {}) {
  const good = [];
  for (let a = minCups; a <= maxCups; a += step) {
    const r = rollPutt({ ...args, aimCups: a });
    if (r.holed) good.push(a);
  }
  if (!good.length) return null;
  const mid = good[Math.floor(good.length / 2)];
  return { aim: mid, min: good[0], max: good[good.length - 1], count: good.length };
}

// Search pace and aim together: the holed combination whose pace is closest to `preferPast` feet past.
export function solvePutt(args, { preferPast = 1 } = {}) {
  let best = null;
  for (let past = 0.25; past <= 7; past += 0.25) {
    const sol = solveAim({ ...args, pastFt: past }, { step: 0.5 });
    if (!sol) continue;
    const score = Math.abs(past - preferPast) - sol.count * 0.02;
    if (!best || score < best.score) best = { ...sol, pastFt: past, score };
  }
  return best;
}
