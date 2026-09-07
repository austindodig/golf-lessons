import * as THREE from 'three';
import { createClub, CLUB_SPECS } from './clubs.js';

// A stylised hologram golfer driven by a double-pendulum swing model on an inclined plane.
// Frame: ball at the origin, target -Z, golfer stands at -X facing +X, right-handed.
const DEG = Math.PI / 180;

// Per-shot swing definitions: key positions P1..P10 with time (s), arm angle θ, wrist angle φ (deg, in-plane),
// hip and shoulder turn (deg, + = backswing), lateral hip shift (m, + = away from target), hub drop (m).
const FULL = {
  times: [0, 0.28, 0.52, 0.84, 0.96, 1.04, 1.11, 1.19, 1.3, 1.6],
  theta: [null, 45, 90, 172, 92, 42, null, -45, -95, -168],
  phi:   [null, 40, 88, 92, 105, 58, null, -40, -88, -105],
  hips:  [0, 14, 28, 46, 24, 8, -38, -66, -84, -96],
  shoulders: [0, 30, 62, 96, 74, 46, -22, -58, -84, -102],
  shift: [0, 0.01, 0.02, 0.035, 0.0, -0.04, -0.09, -0.11, -0.12, -0.12],
  drop:  [0, 0, 0.005, 0.01, 0.02, 0.03, 0.03, 0.02, 0.0, -0.01],
};
const PITCH = {
  times: [0, 0.25, 0.45, 0.68, 0.8, 0.9, 0.98, 1.08, 1.2, 1.5],
  theta: [null, 42, 80, 100, 78, 40, null, -42, -78, -100],
  phi:   [null, 30, 62, 78, 82, 48, null, -30, -62, -80],
  hips:  [0, 8, 16, 26, 14, 4, -26, -46, -60, -70],
  shoulders: [0, 18, 38, 58, 44, 26, -16, -40, -58, -72],
  shift: [0, 0, 0.01, 0.015, 0, -0.02, -0.05, -0.07, -0.08, -0.08],
  drop:  [0, 0, 0, 0.005, 0.01, 0.015, 0.015, 0.01, 0, 0],
};
const CHIP = {
  times: [0, 0.22, 0.38, 0.5, 0.6, 0.68, 0.76, 0.86, 0.98, 1.2],
  theta: [null, 22, 34, 42, 34, 22, null, -26, -34, -42],
  phi:   [null, 8, 14, 18, 18, 12, null, -6, -10, -14],
  hips:  [0, 3, 6, 8, 5, 2, -8, -14, -18, -22],
  shoulders: [0, 8, 14, 18, 13, 8, -8, -16, -22, -26],
  shift: [0, 0, 0, 0, 0, 0, -0.01, -0.02, -0.02, -0.02],
  drop:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};
const PUTT = {
  times: [0, 0.25, 0.42, 0.55, 0.68, 0.78, 0.86, 0.98, 1.1, 1.3],
  theta: [null, 8, 13, 16, 12, 6, null, -10, -14, -16],
  phi:   [null, 0, 0, 0, 0, 0, null, 0, 0, 0],
  hips:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  shoulders: [0, 4, 7, 9, 7, 3, -3, -7, -9, -10],
  shift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  drop:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

export const SWING_PRESETS = {
  driver: { club: 'driver', curves: FULL, plane: 50, hubBehind: 0.24, handsAhead: -0.03, stance: 0.56, ballForward: 0.2, tee: true, spine: 33, impactLean: -2 },
  '3-wood': { club: '3-wood', curves: FULL, plane: 52, hubBehind: 0.16, handsAhead: 0.0, stance: 0.5, ballForward: 0.14, tee: false, spine: 34, impactLean: 3 },
  iron: { club: 'iron', curves: FULL, plane: 60, hubBehind: 0.06, handsAhead: 0.04, stance: 0.42, ballForward: 0.05, tee: false, spine: 36, impactLean: 6 },
  wedge: { club: 'wedge', curves: PITCH, plane: 63, hubBehind: 0.02, handsAhead: 0.05, stance: 0.32, ballForward: 0.0, tee: false, spine: 38, impactLean: 6 },
  chip: { club: 'chip', curves: CHIP, plane: 63, hubBehind: -0.04, handsAhead: 0.08, stance: 0.24, ballForward: -0.06, tee: false, spine: 40, impactLean: 8 },
  putter: { club: 'putter', curves: PUTT, plane: 72, hubBehind: 0.0, handsAhead: 0.02, stance: 0.3, ballForward: 0.04, tee: false, spine: 42, impactLean: 2 },
};

export const POSITIONS = [
  { id: 1, name: 'Address', short: 'P1', note: 'Athletic setup: hinge from the hips, arms hanging, weight balanced.' },
  { id: 2, name: 'Shaft parallel', short: 'P2', note: 'Takeaway: shaft parallel to the ground and to the target line, toe up.' },
  { id: 3, name: 'Lead arm parallel', short: 'P3', note: 'Wrists fully set, chest turned, club pointing skyward.' },
  { id: 4, name: 'Top', short: 'P4', note: 'Full turn, lead arm across the shoulders, shaft near parallel to the target line.' },
  { id: 5, name: 'Lead arm parallel down', short: 'P5', note: 'Transition: hips have opened while the club still lags behind the hands.' },
  { id: 6, name: 'Shaft parallel down', short: 'P6', note: 'Shaft parallel again, club pointing at the ball-target line: on plane.' },
  { id: 7, name: 'Impact', short: 'P7', note: 'Hands ahead, shaft leaning forward, hips open, head behind the ball.' },
  { id: 8, name: 'Shaft parallel through', short: 'P8', note: 'Both arms extended toward the target, toe rotating up.' },
  { id: 9, name: 'Trail arm parallel', short: 'P9', note: 'Full release, body rotating, arms folding naturally.' },
  { id: 10, name: 'Finish', short: 'P10', note: 'Balanced on the lead leg, chest facing the target, club resting behind the head.' },
];

// Catmull-Rom with clamped ends over irregular key times
function interp(times, values, t) {
  const n = times.length;
  if (t <= times[0]) return values[0];
  if (t >= times[n - 1]) return values[n - 1];
  let i = 0; while (times[i + 1] < t) i++;
  const t0 = times[Math.max(i - 1, 0)], t1 = times[i], t2 = times[i + 1], t3 = times[Math.min(i + 2, n - 1)];
  const p0 = values[Math.max(i - 1, 0)], p1 = values[i], p2 = values[i + 1], p3 = values[Math.min(i + 2, n - 1)];
  const u = (t - t1) / (t2 - t1);
  // tangents (finite differences scaled to the segment)
  const m1 = (i === 0 ? 0 : (p2 - p0) / (t2 - t0)) * (t2 - t1);
  const m2 = (i + 2 >= n ? 0 : (p3 - p1) / (t3 - t1)) * (t2 - t1);
  const u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p1 + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2 + (u3 - u2) * m2;
}

export function createSwingModel(presetName = 'iron') {
  const preset = SWING_PRESETS[presetName] || SWING_PRESETS.iron;
  const spec = CLUB_SPECS[preset.club];
  const L1 = 0.62;                       // shoulder hub → hands
  const L2 = spec.length - 0.05;         // hands → club head
  const alpha = preset.plane * DEG;
  const e1 = new THREE.Vector3(0, 0, 1);                                   // in-plane, along the target line (away from target)
  const e2 = new THREE.Vector3(-Math.cos(alpha), Math.sin(alpha), 0);      // in-plane, up toward the golfer
  const normal = new THREE.Vector3().crossVectors(e1, e2).normalize();      // plane normal
  const dir = (a, out = new THREE.Vector3()) => out.copy(e1).multiplyScalar(Math.sin(a)).addScaledVector(e2, -Math.cos(a));

  // Address geometry: solve θ0 / φ0 from where the hub and hands sit relative to the ball.
  const hubZ = preset.hubBehind, handsZ = -preset.handsAhead;
  const theta0 = Math.asin(THREE.MathUtils.clamp((handsZ - hubZ) / L1, -0.95, 0.95));
  const a0 = Math.asin(THREE.MathUtils.clamp((0 - handsZ) / L2, -0.95, 0.95));
  const phi0 = a0 - theta0;
  const ballY = preset.tee ? 0.045 : 0;
  const hub = new THREE.Vector3(0, ballY, 0).addScaledVector(dir(theta0), -L1).addScaledVector(dir(a0), -L2);
  // Impact: hands a touch further ahead (forward shaft lean); search θ7 so the club head meets the ball.
  const phi7 = phi0 - preset.impactLean * DEG;
  let theta7 = theta0, best = 1e9;
  for (let th = theta0 - 25 * DEG; th <= theta0 + 10 * DEG; th += 0.25 * DEG) {
    const hands = hub.clone().addScaledVector(dir(th), L1);
    const head = hands.addScaledVector(dir(th + phi7), L2);
    const d = head.distanceTo(new THREE.Vector3(0, ballY, 0));
    if (d < best) { best = d; theta7 = th; }
  }
  const c = preset.curves;
  const theta = c.theta.map((v, i) => (i === 0 ? theta0 / DEG : i === 6 ? theta7 / DEG : v));
  const phi = c.phi.map((v, i) => (i === 0 ? phi0 / DEG : i === 6 ? phi7 / DEG : v));
  const duration = c.times[c.times.length - 1];

  // Body proportions
  const spineLen = 0.56, spineTilt = preset.spine * DEG;
  const hipCenter0 = hub.clone().sub(new THREE.Vector3(Math.sin(spineTilt) * spineLen, Math.cos(spineTilt) * spineLen, 0));
  const stanceCenterZ = preset.ballForward;
  const feetX = hipCenter0.x - 0.02;
  const leadFoot = new THREE.Vector3(feetX, 0, stanceCenterZ - preset.stance / 2);
  const trailFoot = new THREE.Vector3(feetX, 0, stanceCenterZ + preset.stance / 2);

  function pose(t) {
    const th = interp(c.times, theta, t) * DEG;
    const ph = interp(c.times, phi, t) * DEG;
    const hipYaw = interp(c.times, c.hips, t) * DEG;
    const shYaw = interp(c.times, c.shoulders, t) * DEG;
    const shift = interp(c.times, c.shift, t);
    const drop = interp(c.times, c.drop, t);

    const hubP = hub.clone(); hubP.z += shift * 0.6; hubP.y -= drop;
    const hands = hubP.clone().addScaledVector(dir(th), L1);
    const head = hands.clone().addScaledVector(dir(th + ph), L2);
    const hipC = hipCenter0.clone(); hipC.z += shift; hipC.y -= drop * 0.5;
    const spineAxis = hubP.clone().sub(hipC).normalize();
    const rotS = new THREE.Quaternion().setFromAxisAngle(spineAxis, shYaw);
    const rotH = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0).lerp(spineAxis, 0.4).normalize(), hipYaw);
    const shoulderL = new THREE.Vector3(0, 0, -0.21).applyQuaternion(rotS).add(hubP);
    const shoulderR = new THREE.Vector3(0, 0, 0.21).applyQuaternion(rotS).add(hubP);
    const hipL = new THREE.Vector3(0, 0, -0.16).applyQuaternion(rotH).add(hipC);
    const hipR = new THREE.Vector3(0, 0, 0.16).applyQuaternion(rotH).add(hipC);
    const neck = hubP.clone().addScaledVector(spineAxis, 0.1);
    const headC = hubP.clone().addScaledVector(spineAxis, 0.26).add(new THREE.Vector3(0.02, 0, shift * 0.3));
    // Arms: two-bone IK toward the shared grip point (lead hand lower on the grip).
    const gripDir = dir(th + ph).normalize();
    const handL = hands.clone().addScaledVector(gripDir, 0.03);
    const handR = hands.clone().addScaledVector(gripDir, -0.04);
    const poleL = new THREE.Vector3(0.2, -1, -0.4).applyQuaternion(rotS).normalize();
    const poleR = new THREE.Vector3(-0.1, -1, 0.7).applyQuaternion(rotS).normalize();
    const elbowL = ik(shoulderL, handL, 0.31, 0.29, poleL);
    const elbowR = ik(shoulderR, handR, 0.31, 0.29, poleR);
    // Legs: knees flex toward the ball; feet stay planted.
    const kneeL = ik(hipL, leadFoot.clone().setY(0.08), 0.45, 0.44, new THREE.Vector3(1, -0.15, -0.2 + shift * -2).normalize());
    const kneeR = ik(hipR, trailFoot.clone().setY(0.08), 0.45, 0.44, new THREE.Vector3(1, -0.15, 0.2 + shift * 2).normalize());
    return {
      t, theta: th, phi: ph, hipYaw, shYaw, shift, drop,
      hub: hubP, hands, head, hipC, spineAxis, shoulderL, shoulderR, hipL, hipR, neck, headC, handL, handR, elbowL, elbowR, kneeL, kneeR,
      leadFoot, trailFoot, clubAngle: th + ph, roll: th - theta0,
    };
  }

  function ik(a, b, l1, l2, pole) {
    const ab = b.clone().sub(a); const d = THREE.MathUtils.clamp(ab.length(), Math.abs(l1 - l2) + 0.001, l1 + l2 - 0.001);
    const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
    const ang = Math.acos(THREE.MathUtils.clamp(cosA, -1, 1));
    const axisDir = ab.clone().normalize();
    const p = pole.clone().sub(axisDir.clone().multiplyScalar(pole.dot(axisDir))).normalize();
    if (p.lengthSq() < 1e-6) p.set(0, -1, 0);
    return a.clone().addScaledVector(axisDir, Math.cos(ang) * l1).addScaledVector(p, Math.sin(ang) * l1);
  }

  return { preset, spec, L1, L2, alpha, e1, e2, normal, dir, hub, theta0, phi0, a0, duration, times: c.times, pose, ballY, leadFoot, trailFoot, hipCenter0, stanceCenterZ };
}

// ---------- Visual rig ----------
export function createGolferRig(model, { color = 0x6ee7a8, accent = 0xf3cf7a } = {}) {
  const g = new THREE.Group(); g.name = 'golfer';
  const jointMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(color), emissiveIntensity: 1.6, roughness: 0.3 });
  const boneMat = new THREE.MeshStandardMaterial({ color: 0x9fe6c3, emissive: new THREE.Color(color), emissiveIntensity: 0.55, roughness: 0.5, transparent: true, opacity: 0.9 });
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x0f2a24, emissive: new THREE.Color(color), emissiveIntensity: 0.12, roughness: 0.35, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide });
  const jointGeo = new THREE.SphereGeometry(0.03, 16, 12);
  const boneGeo = new THREE.CylinderGeometry(0.016, 0.016, 1, 10, 1); boneGeo.translate(0, 0.5, 0);
  const joints = {}, bones = [];
  const JOINTS = ['hub', 'neck', 'shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'handL', 'handR', 'hipC', 'hipL', 'hipR', 'kneeL', 'kneeR', 'leadFoot', 'trailFoot'];
  for (const j of JOINTS) { const m = new THREE.Mesh(jointGeo, jointMat); m.name = j; joints[j] = m; g.add(m); }
  const BONES = [['hipC', 'hub'], ['hub', 'neck'], ['shoulderL', 'shoulderR'], ['shoulderL', 'elbowL'], ['elbowL', 'handL'], ['shoulderR', 'elbowR'], ['elbowR', 'handR'], ['hipL', 'hipR'], ['hipL', 'kneeL'], ['kneeL', 'leadFoot'], ['hipR', 'kneeR'], ['kneeR', 'trailFoot']];
  for (const [a, b] of BONES) { const m = new THREE.Mesh(boneGeo, boneMat); m.userData = { a, b }; bones.push(m); g.add(m); }
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 18), bodyMat); g.add(headMesh);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.32, 6, 16), bodyMat); g.add(torso);
  const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.18, 6, 16), bodyMat); pelvis.rotation.x = Math.PI / 2; g.add(pelvis);
  const club = createClub(model.preset.club); g.add(club);
  const feetGeo = new THREE.BoxGeometry(0.26, 0.05, 0.1);
  const footMat = new THREE.MeshStandardMaterial({ color: 0x1a2a24, emissive: new THREE.Color(color), emissiveIntensity: 0.25 });
  const footL = new THREE.Mesh(feetGeo, footMat), footR = new THREE.Mesh(feetGeo, footMat); g.add(footL, footR);

  const up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3(), q = new THREE.Quaternion();
  const clubAddress = new THREE.Quaternion();
  // Club: at address its local shaft (−cos lie, sin lie, 0) should map onto the plane's e2 direction.
  const lie = model.spec.lie * DEG;
  const localShaft = new THREE.Vector3(-Math.cos(lie), Math.sin(lie), 0);
  clubAddress.setFromUnitVectors(localShaft, model.e2.clone());

  function apply(p) {
    for (const j of JOINTS) joints[j].position.copy(p[j]);
    for (const b of bones) {
      const a = p[b.userData.a], c = p[b.userData.b];
      b.position.copy(a); tmp.subVectors(c, a); const len = tmp.length(); b.scale.set(1, len, 1);
      q.setFromUnitVectors(up, tmp.normalize()); b.quaternion.copy(q);
    }
    headMesh.position.copy(p.headC);
    torso.position.copy(p.hub).lerp(p.hipC, 0.45); q.setFromUnitVectors(up, p.spineAxis); torso.quaternion.copy(q);
    pelvis.position.copy(p.hipC); pelvis.quaternion.copy(q).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
    footL.position.copy(p.leadFoot).add(new THREE.Vector3(0.06, 0.025, 0)); footR.position.copy(p.trailFoot).add(new THREE.Vector3(0.06, 0.025, 0));
    footL.rotation.y = 0.25; footR.rotation.y = -0.1;
    // Club: rotate the address orientation within the plane by (a − a0), then roll the face around the shaft.
    const inPlane = new THREE.Quaternion().setFromAxisAngle(model.normal, -(p.clubAngle - model.a0));
    const shaftWorld = model.dir(p.clubAngle).multiplyScalar(-1).normalize();
    const roll = new THREE.Quaternion().setFromAxisAngle(shaftWorld, -p.roll * 0.9);
    club.quaternion.copy(roll).multiply(inPlane).multiply(clubAddress);
    club.position.copy(p.head);
  }
  return { group: g, joints, bones, club, apply, materials: { jointMat, boneMat, bodyMat } };
}
