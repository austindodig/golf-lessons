import { makeGreen, rollPutt, solveAim } from '../src/physics/putting.js';
for (const [dist, slope, dir, stimp] of [[10, 2, 90, 10], [15, 2, 90, 10], [20, 1, 90, 10], [15, 2, 0, 10], [15, 2, 180, 10], [30, 3, 90, 12], [6, 4, 90, 11]]) {
  const green = makeGreen({ slopePct: slope, dirDeg: dir });
  const flat = rollPutt({ green, distFt: dist, aimCups: 0, pastFt: 1, stimp });
  const sol = solveAim({ green, distFt: dist, pastFt: 1, stimp });
  console.log(`${dist}ft ${slope}% dir${dir} stimp${stimp}: straight-at-hole finishes ${flat.sideFt.toFixed(2)}ft side, ${flat.pastFt.toFixed(2)}ft past, holed=${flat.holed}; aim ${sol ? sol.aim + ' cups (' + sol.min + '..' + sol.max + ')' : 'none'} break≈${flat.breakIn.toFixed(0)}in`);
}
