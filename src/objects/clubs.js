import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Club local frame: origin at the sweet spot on the face at ground level, face normal toward -Z (target),
// toe toward +X, hosel toward -X, shaft rising toward the golfer who stands at -X.
const steel = () => new THREE.MeshPhysicalMaterial({ color: 0xd8dcdf, metalness: 1, roughness: 0.32, envMapIntensity: 1.2 });
const satin = () => new THREE.MeshPhysicalMaterial({ color: 0xb9bec2, metalness: 1, roughness: 0.48, envMapIntensity: 1.0 });
const carbon = () => new THREE.MeshPhysicalMaterial({ color: 0x0b0d10, metalness: 0.2, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.2 });
const gold = () => new THREE.MeshPhysicalMaterial({ color: 0xd9b45a, metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
const rubber = () => new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.9, metalness: 0 });

export const CLUB_SPECS = {
  driver: { length: 1.16, lie: 58, loft: 10.5, kind: 'wood' },
  '3-wood': { length: 1.09, lie: 57, loft: 15, kind: 'wood' },
  iron: { length: 0.94, lie: 62, loft: 31, kind: 'iron' },
  '5-iron': { length: 0.97, lie: 61, loft: 24, kind: 'iron' },
  '7-iron': { length: 0.94, lie: 62, loft: 31, kind: 'iron' },
  '9-iron': { length: 0.91, lie: 63, loft: 40, kind: 'iron' },
  wedge: { length: 0.90, lie: 64, loft: 56, kind: 'wedge' },
  'pitching-wedge': { length: 0.90, lie: 64, loft: 45, kind: 'wedge' },
  'sand-wedge': { length: 0.89, lie: 64, loft: 56, kind: 'wedge' },
  chip: { length: 0.91, lie: 63, loft: 40, kind: 'iron' },
  putter: { length: 0.86, lie: 70, loft: 3, kind: 'putter' },
};

function shaftAndGrip(length, lie, hoselPoint) {
  const g = new THREE.Group();
  const lieRad = THREE.MathUtils.degToRad(lie);
  const dir = new THREE.Vector3(-Math.cos(lieRad), Math.sin(lieRad), 0);
  const shaftLen = length - 0.02;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0072, 0.0047, shaftLen, 20, 1), steel());
  shaft.castShadow = true;
  const mid = hoselPoint.clone().addScaledVector(dir, shaftLen / 2);
  shaft.position.copy(mid);
  shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.0135, 0.0105, 0.265, 20, 1), rubber());
  grip.position.copy(hoselPoint).addScaledVector(dir, shaftLen - 0.13);
  grip.quaternion.copy(shaft.quaternion);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0138, 0.0135, 0.006, 20), gold());
  cap.position.copy(hoselPoint).addScaledVector(dir, shaftLen + 0.003);
  cap.quaternion.copy(shaft.quaternion);
  g.add(shaft, grip, cap);
  g.userData.dir = dir; g.userData.gripPoint = hoselPoint.clone().addScaledVector(dir, shaftLen - 0.05);
  return g;
}

function woodHead(spec) {
  const g = new THREE.Group();
  const w = spec.loft < 13 ? 0.122 : 0.105, d = spec.loft < 13 ? 0.112 : 0.09, h = spec.loft < 13 ? 0.062 : 0.045;
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, 0.028), carbon());
  body.position.set(0.045, h / 2 - 0.004, d / 2 - 0.006);
  body.scale.set(1, 1, 1);
  body.castShadow = true;
  const face = new THREE.Mesh(new RoundedBoxGeometry(w * 0.94, h * 0.92, 0.012, 4, 0.01), steel());
  face.position.set(0.045, h / 2 - 0.004, 0.0);
  face.rotation.x = THREE.MathUtils.degToRad(-spec.loft);
  const sole = new THREE.Mesh(new RoundedBoxGeometry(w * 0.8, 0.004, d * 0.75, 3, 0.002), gold());
  sole.position.set(0.045, -0.003, d / 2);
  const hosel = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0095, 0.05, 16), satin());
  const lieRad = THREE.MathUtils.degToRad(spec.lie);
  const dir = new THREE.Vector3(-Math.cos(lieRad), Math.sin(lieRad), 0);
  const hoselBase = new THREE.Vector3(-0.012, 0.012, 0.04);
  hosel.position.copy(hoselBase).addScaledVector(dir, 0.025);
  hosel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(body, face, sole, hosel);
  g.userData.hoselTop = hoselBase.clone().addScaledVector(dir, 0.045);
  return g;
}

function ironHead(spec) {
  const g = new THREE.Group();
  const isWedge = spec.kind === 'wedge';
  // Blade profile in the face plane (x = heel→toe, y = sole→topline)
  const s = new THREE.Shape();
  const L = 0.082, hHeel = 0.036, hToe = isWedge ? 0.05 : 0.046;
  s.moveTo(-0.004, 0);
  s.quadraticCurveTo(0.03, -0.006, 0.06, 0.0);
  s.quadraticCurveTo(L + 0.004, 0.006, L, hToe * 0.6);
  s.quadraticCurveTo(L - 0.004, hToe, L - 0.02, hToe);
  s.lineTo(0.02, hHeel);
  s.quadraticCurveTo(0.0, hHeel, -0.004, hHeel - 0.008);
  s.lineTo(-0.004, 0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: isWedge ? 0.011 : 0.009, bevelEnabled: true, bevelThickness: 0.0035, bevelSize: 0.0025, bevelSegments: 3, curveSegments: 12 });
  const blade = new THREE.Mesh(geo, steel());
  blade.castShadow = true;
  // Muscle/cavity mass behind the face
  const mass = new THREE.Mesh(new RoundedBoxGeometry(0.058, 0.014, 0.012, 3, 0.004), satin());
  mass.position.set(0.045, 0.011, 0.014);
  const head = new THREE.Group();
  head.add(blade, mass);
  head.rotation.x = THREE.MathUtils.degToRad(-spec.loft);  // loft the face back from vertical
  // Grooves
  const grooveMat = new THREE.MeshStandardMaterial({ color: 0x6d7276, roughness: 0.6, metalness: 0.8 });
  for (let i = 0; i < 9; i++) {
    const gr = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.0009, 0.0008), grooveMat);
    gr.position.set(0.04, 0.008 + i * 0.0036, -0.0002);
    head.add(gr);
  }
  const lieRad = THREE.MathUtils.degToRad(spec.lie);
  const dir = new THREE.Vector3(-Math.cos(lieRad), Math.sin(lieRad), 0);
  const hosel = new THREE.Mesh(new THREE.CylinderGeometry(0.0068, 0.0085, 0.06, 16), steel());
  const hoselBase = new THREE.Vector3(-0.004, 0.01, 0.006);
  hosel.position.copy(hoselBase).addScaledVector(dir, 0.03);
  hosel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(head, hosel);
  g.userData.hoselTop = hoselBase.clone().addScaledVector(dir, 0.056);
  return g;
}

function putterHead(spec) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.024, 0.03, 4, 0.006), satin());
  body.position.set(0.045, 0.012, 0.016);
  const flange = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.012, 0.05, 4, 0.005), carbon());
  flange.position.set(0.045, 0.006, 0.05);
  const line = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.001, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  line.position.set(0.045, 0.0245, 0.03);
  const lieRad = THREE.MathUtils.degToRad(spec.lie);
  const dir = new THREE.Vector3(-Math.cos(lieRad), Math.sin(lieRad), 0);
  const hosel = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.007, 0.05, 16), satin());
  const hoselBase = new THREE.Vector3(0.0, 0.02, 0.012);
  hosel.position.copy(hoselBase).addScaledVector(dir, 0.025);
  hosel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(body, flange, line, hosel);
  g.userData.hoselTop = hoselBase.clone().addScaledVector(dir, 0.045);
  return g;
}

export function createClub(type = 'iron') {
  const spec = CLUB_SPECS[type] || CLUB_SPECS.iron;
  const club = new THREE.Group();
  club.name = `club-${type}`;
  let head;
  if (spec.kind === 'wood') head = woodHead(spec);
  else if (spec.kind === 'putter') head = putterHead(spec);
  else head = ironHead(spec);
  const shaft = shaftAndGrip(spec.length, spec.lie, head.userData.hoselTop);
  club.add(head, shaft);
  club.userData = { spec, gripPoint: shaft.userData.gripPoint, shaftDir: shaft.userData.dir, head, shaft };
  return club;
}
