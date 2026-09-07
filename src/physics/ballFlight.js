// Golf ball flight model: impact → launch conditions → aerodynamic flight (drag + Magnus lift).
// Coordinate frame: target line is -Z, +X is the golfer's right (right-handed golfer), +Y up.
// Angles in degrees, speeds in mph at the API boundary, SI inside.

export const CLUBS = {
  'driver':         { name: 'Driver',         loft: 10.5, dynLoft: 12.5, attack: -1,   speed: 100, smash: 1.48, length: 1.16, ballPos: 0.9 },
  '3-wood':         { name: '3-wood',         loft: 15,   dynLoft: 16.5, attack: -2,   speed: 95,  smash: 1.46, length: 1.09, ballPos: 0.7 },
  '5-iron':         { name: '5-iron',         loft: 24,   dynLoft: 17.5, attack: -3.5, speed: 88,  smash: 1.40, length: 0.97, ballPos: 0.35 },
  '7-iron':         { name: '7-iron',         loft: 31,   dynLoft: 21,   attack: -4.3, speed: 83,  smash: 1.36, length: 0.94, ballPos: 0.2 },
  '9-iron':         { name: '9-iron',         loft: 40,   dynLoft: 27,   attack: -4.5, speed: 78,  smash: 1.32, length: 0.91, ballPos: 0.05 },
  'pitching-wedge': { name: 'Pitching wedge', loft: 45,   dynLoft: 31,   attack: -5,   speed: 74,  smash: 1.27, length: 0.90, ballPos: 0 },
  'sand-wedge':     { name: 'Sand wedge',     loft: 56,   dynLoft: 40,   attack: -5.5, speed: 68,  smash: 1.20, length: 0.89, ballPos: 0 },
};

const DEG = Math.PI / 180;
const MPH = 0.44704;           // m/s per mph
const YD = 1.0936;             // yards per metre
const G = 9.81;
const RHO = 1.225;
const MASS = 0.04593;
const RADIUS = 0.02135;
const AREA = Math.PI * RADIUS * RADIUS;

// Aerodynamic coefficients as a function of spin ratio S = r·ω / v (calibrated to tour launch-monitor averages).
export const AERO = { cd0: 0.205, cdS: 0.28, cl0: 0.05, clS: 1.05, clMax: 0.34, spinDecay: 28 };

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// Impact model → launch conditions.
export function impact({ club = '7-iron', speed, attack, path = 0, face = 0, strike = 0 } = {}) {
  const c = CLUBS[club] || CLUBS['7-iron'];
  const clubSpeed = speed ?? c.speed;
  const aoa = attack ?? c.attack;
  // Delivered loft rises a little when the attack angle rises (less shaft lean when hitting up).
  const dynLoft = clamp(c.dynLoft + 0.5 * (aoa - c.attack), 4, 70);
  const spinLoftV = dynLoft - aoa;                                   // vertical spin loft (deg)
  // Smash factor falls as spin loft grows and with off-centre strikes.
  const smash = clamp(c.smash - 0.0025 * Math.max(0, spinLoftV - 12) - 0.0035 * Math.abs(strike), 1.05, 1.5);
  const ballSpeedMph = clubSpeed * smash;

  // Start direction: the face dominates, the path contributes more as spin loft grows.
  const w = clamp(0.85 - (spinLoftV - 12) * 0.006, 0.7, 0.9);
  const startDir = w * face + (1 - w) * path;                        // deg, + = right of target
  const launch = clamp(0.85 * dynLoft + 0.15 * aoa, 1, 60);          // deg above ground

  // 3-D spin axis from the geometry of the delivered face and the club's motion.
  const n = [Math.cos(dynLoft * DEG) * Math.sin(face * DEG), Math.sin(dynLoft * DEG), -Math.cos(dynLoft * DEG) * Math.cos(face * DEG)];
  const v = [Math.cos(aoa * DEG) * Math.sin(path * DEG), Math.sin(aoa * DEG), -Math.cos(aoa * DEG) * Math.cos(path * DEG)];
  let axis = [v[1] * n[2] - v[2] * n[1], v[2] * n[0] - v[0] * n[2], v[0] * n[1] - v[1] * n[0]];
  const sinSpinLoft = Math.hypot(...axis);
  const spinLoft3 = Math.asin(clamp(sinSpinLoft, 0, 1)) / DEG;       // full 3-D spin loft
  axis = axis.map((a) => a / (sinSpinLoft || 1));
  // Gear effect from heel/toe strikes tilts the axis (toe strike → hook spin), strongest with the driver.
  const gear = (c.loft < 20 ? 1.0 : 0.35) * strike * -0.9;           // deg of axis tilt per mm
  if (gear) {
    const t = gear * DEG, cx = axis[0], cy = axis[1];
    axis[0] = cx * Math.cos(t) - cy * Math.sin(t); axis[1] = cx * Math.sin(t) + cy * Math.cos(t);
  }
  const k = clamp(1.05 + (spinLoft3 - 12) * 0.095, 0.95, 2.5);         // rpm per (mph · deg)
  const spinRpm = clamp(ballSpeedMph * spinLoft3 * k, 300, 13000);
  const axisTilt = Math.atan2(-axis[1], axis[0]) / DEG;              // + = fade axis (curves right)

  return { club: c, clubSpeed, attack: aoa, path, face, strike, dynLoft, spinLoft: spinLoft3, smash, ballSpeedMph, launch, startDir, spinRpm, axis, axisTilt };
}

// Integrate the flight. Returns trajectory samples (metres) and summary numbers (yards, degrees).
export function fly(L, { dt = 0.004, sampleEvery = 5, wind = [0, 0, 0] } = {}) {
  const v0 = L.ballSpeedMph * MPH;
  const sd = L.startDir * DEG, la = L.launch * DEG;
  let p = [0, 0.02, 0];
  let v = [v0 * Math.cos(la) * Math.sin(sd), v0 * Math.sin(la), -v0 * Math.cos(la) * Math.cos(sd)];
  let omega = (L.spinRpm * 2 * Math.PI) / 60;
  const ax = L.axis;
  const pts = [[...p, 0]];
  let t = 0, apex = 0, step = 0;
  while (t < 15) {
    const vr = [v[0] - wind[0], v[1] - wind[1], v[2] - wind[2]];
    const speed = Math.hypot(...vr) || 1e-6;
    const S = (RADIUS * omega) / speed;
    const cd = AERO.cd0 + AERO.cdS * S;
    const cl = Math.min(AERO.clMax, AERO.cl0 + AERO.clS * S);
    const q = 0.5 * RHO * AREA * speed;
    // Magnus direction: axis × velocity
    const mx = ax[1] * vr[2] - ax[2] * vr[1], my = ax[2] * vr[0] - ax[0] * vr[2], mz = ax[0] * vr[1] - ax[1] * vr[0];
    const mlen = Math.hypot(mx, my, mz) || 1e-6;
    const a = [
      (-q * cd * vr[0] + q * cl * speed * (mx / mlen)) / MASS,
      (-q * cd * vr[1] + q * cl * speed * (my / mlen)) / MASS - G,
      (-q * cd * vr[2] + q * cl * speed * (mz / mlen)) / MASS,
    ];
    v = [v[0] + a[0] * dt, v[1] + a[1] * dt, v[2] + a[2] * dt];
    const np = [p[0] + v[0] * dt, p[1] + v[1] * dt, p[2] + v[2] * dt];
    t += dt; step++;
    omega *= Math.exp(-dt / AERO.spinDecay);
    if (np[1] <= 0 && t > 0.05) {
      const f = p[1] / (p[1] - np[1]);
      p = [p[0] + (np[0] - p[0]) * f, 0, p[2] + (np[2] - p[2]) * f];
      pts.push([...p, t]);
      break;
    }
    p = np;
    if (p[1] > apex) apex = p[1];
    if (step % sampleEvery === 0) pts.push([...p, t]);
  }
  const carryM = Math.hypot(p[0], p[2]);
  const landAngle = Math.atan2(-v[1], Math.hypot(v[0], v[2])) / DEG;
  const landSpeed = Math.hypot(...v);
  // Lateral offset from target line and curvature relative to the start line.
  const lateral = p[0];
  const startLineLateral = Math.tan(sd) * -p[2];
  const curve = lateral - startLineLateral;
  const rollYd = clamp((62 - landAngle) * 1.2 - (L.spinRpm / 1000) * 1.5, 0, 45) * (landSpeed / 30);
  const carryYd = carryM * YD;
  return {
    points: pts, time: t,
    carry: carryYd, total: carryYd + rollYd, roll: rollYd,
    apex: apex * YD, landAngle, lateral: lateral * YD, curve: curve * YD, offline: lateral * YD,
    landSpeedMph: landSpeed / MPH,
  };
}

// Human name for the shot from start direction and curve (right-handed golfer).
export function classify(L, F) {
  const start = L.startDir > 1.5 ? 'push' : L.startDir < -1.5 ? 'pull' : 'straight';
  const c = F.curve;
  const curve = Math.abs(c) < 3 ? 'straight' : c > 0 ? (c > 25 ? 'slice' : 'fade') : (c < -25 ? 'hook' : 'draw');
  let name;
  if (start === 'straight' && curve === 'straight') name = 'Straight';
  else if (start === 'straight') name = cap(curve);
  else if (curve === 'straight') name = cap(start);
  else name = `${cap(start)}-${curve}`;
  const faceToPath = L.face - L.path;
  const verdict = Math.abs(F.offline) < 6 ? 'On target' : F.offline > 0 ? 'Finishes right' : 'Finishes left';
  return { name, start, curve, faceToPath, verdict };
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export function shoot(params) {
  const L = impact(params);
  const F = fly(L);
  const C = classify(L, F);
  return { launch: L, flight: F, shot: C };
}

// The nine ball flights (face/path combinations) for the flight-laws grid.
export const NINE = [
  { name: 'Pull-hook',     face: -6, path: -2 }, { name: 'Pull',        face: -4, path: -4 }, { name: 'Pull-fade',    face: -2, path: -7 },
  { name: 'Draw',          face: -1, path: 3 },  { name: 'Straight',    face: 0,  path: 0 },  { name: 'Fade',         face: 1,  path: -3 },
  { name: 'Push-draw',     face: 3,  path: 7 },  { name: 'Push',        face: 4,  path: 4 },  { name: 'Push-slice',   face: 6,  path: 2 },
];
