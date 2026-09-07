import * as THREE from 'three';

export const BALL_RADIUS = 0.02135;

// Procedural golf ball: real geometric dimples (fibonacci-distributed) so rim light catches them.
let cachedGeo = null;
export function createBallGeometry({ radius = BALL_RADIUS, dimples = 336, widthSegments = 256, heightSegments = 160, depth = 0.0009, dimpleRadius = 0.0032 } = {}) {
  if (cachedGeo && radius === BALL_RADIUS) return cachedGeo;
  const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const pos = geo.attributes.position;
  // Dimple centres on the unit sphere
  const centers = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < dimples; i++) {
    const y = 1 - (i / (dimples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    centers.push(Math.cos(th) * r, y, Math.sin(th) * r);
  }
  // Bucket dimple centres by latitude band to keep the nearest-search cheap.
  const bands = 24, buckets = Array.from({ length: bands }, () => []);
  for (let i = 0; i < dimples; i++) { const b = Math.min(bands - 1, Math.floor(((centers[i * 3 + 1] + 1) / 2) * bands)); buckets[b].push(i); }
  const v = new THREE.Vector3();
  const dr = dimpleRadius / radius; // angular-ish radius in unit-sphere chord units
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const band = Math.min(bands - 1, Math.floor(((v.y + 1) / 2) * bands));
    let best = 10;
    for (let b = Math.max(0, band - 1); b <= Math.min(bands - 1, band + 1); b++) {
      for (const idx of buckets[b]) {
        const dx = v.x - centers[idx * 3], dy = v.y - centers[idx * 3 + 1], dz = v.z - centers[idx * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < best) best = d;
      }
    }
    const d = Math.sqrt(best) / dr;
    if (d < 1) {
      const k = 1 - d * d;           // spherical-cap style profile
      const disp = radius - depth * k;
      pos.setXYZ(i, v.x * disp, v.y * disp, v.z * disp);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  if (radius === BALL_RADIUS) cachedGeo = geo;
  return geo;
}

export function createBallMaterial(opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: opts.color ?? 0xf4f4ef,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.35,
    envMapIntensity: opts.envMapIntensity ?? 0.9,
    sheen: 0.2,
    sheenColor: new THREE.Color(0xffffff),
  });
}

export function createBall(opts = {}) {
  const geo = opts.lowPoly ? new THREE.SphereGeometry(opts.radius ?? BALL_RADIUS, 32, 24) : createBallGeometry(opts);
  const mesh = new THREE.Mesh(geo, createBallMaterial(opts));
  mesh.castShadow = true;
  mesh.name = 'ball';
  return mesh;
}

// Wooden tee
export function createTee({ height = 0.045 } = {}) {
  const g = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0018, height * 0.85, 12), new THREE.MeshStandardMaterial({ color: 0xf1ede4, roughness: 0.7 }));
  stem.position.y = height * 0.425;
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.004, height * 0.15, 16), stem.material);
  cup.position.y = height * 0.925;
  g.add(stem, cup);
  return g;
}
