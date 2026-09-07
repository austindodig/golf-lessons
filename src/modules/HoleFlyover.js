import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createGrassMaterial, createTreeLine, createMotes, mulberry } from '../objects/terrain.js';
import { createFlag } from '../objects/markers.js';
import { quality } from '../core/quality.js';

gsap.registerPlugin(ScrollTrigger);
const YD = 0.9144;

// A procedural par four: dogleg-left fairway, three bunkers, a pond, tiered pines.
// Scroll scrubs a camera along a spline from the pin back to the tee ("play the hole backwards").
export function mountFlyover(pinEl, stageEl, hudEl) {
  const stage = createStage(stageEl, { fov: 42, near: 0.5, far: 1500, exposure: 1.02, postfx: { bloom: { strength: 0.35, radius: 0.5, threshold: 0.88 }, vignette: 0.5, grain: 0.035 } });
  if (!stage) return null;
  const { scene, camera, renderer } = stage;
  const sunDir = new THREE.Vector3(-0.72, 0.1, -0.68);
  buildEnvironment(renderer, scene, { sunDir, fogDensity: 0.0032, fogColor: '#0a161b', sunIntensity: 2.3 });

  // Hole layout (metres). Tee at z=0, green ~390 m down -Z with a dogleg to the left (−X).
  const path = [new THREE.Vector3(0, 0, 10), new THREE.Vector3(2, 0, -90), new THREE.Vector3(-6, 0, -200), new THREE.Vector3(-34, 0, -290), new THREE.Vector3(-58, 0, -365)];
  const green = new THREE.Vector3(-62, 0, -380);
  const bunkers = [new THREE.Vector4(-40, -350, 9, 6), new THREE.Vector4(-78, -372, 7, 10), new THREE.Vector4(22, -235, 12, 7)];
  const water = new THREE.Vector4(-28, -150, 26, 18);

  // Terrain heightfield: gentle rolling noise, flattened along the fairway and on the green.
  const size = 560, seg = quality.tier === 'low' ? 140 : 220;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -size / 2 + 60);
  const rand = mulberry(11);
  const pos = geo.attributes.position;
  const hash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, z) => { const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz); return (hash(ix, iz) * (1 - u) + hash(ix + 1, iz) * u) * (1 - v) + (hash(ix, iz + 1) * (1 - u) + hash(ix + 1, iz + 1) * u) * v; };
  function distToPath(x, z) { let d = 1e9; for (let i = 0; i < path.length - 1; i++) { const a = path[i], b = path[i + 1]; const abx = b.x - a.x, abz = b.z - a.z; const t = Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.z) * abz) / (abx * abx + abz * abz))); d = Math.min(d, Math.hypot(x - (a.x + abx * t), z - (a.z + abz * t))); } return d; }
  function height(x, z) {
    let h = noise(x * 0.012, z * 0.012) * 9 + noise(x * 0.04, z * 0.04) * 2.2 + noise(x * 0.12, z * 0.12) * 0.5;
    const dp = distToPath(x, z);
    const flat = THREE.MathUtils.smoothstep(dp, 18, 60);           // 0 on fairway → 1 in the rough
    h = h * (0.25 + 0.75 * flat) + (z < -300 ? (z + 300) * -0.015 : 0);   // green sits slightly raised
    const dg = Math.hypot(x - green.x, z - green.z);
    h += (1 - THREE.MathUtils.smoothstep(dg, 10, 30)) * 1.2;
    const dw = Math.hypot((x - water.x) / water.z, (z - water.y) / water.w);
    h -= (1 - THREE.MathUtils.smoothstep(dw, 0.7, 1.15)) * 2.2;
    return h;
  }
  for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, createGrassMaterial({ sunDir, fairwayHalf: 20, stripeWidth: 9, pathPts: path, bunkers, water, greenCenter: green, greenRadius: 16, fairwayA: '#1d4d2d', fairwayB: '#174026' }));
  ground.receiveShadow = true;
  scene.add(ground);
  const sampleH = (x, z) => height(x, z);

  // Trees: keep them off the fairway and out of the water.
  const treeGeoCount = quality.tier === 'low' ? 500 : 1100;
  const trees = createTreeLine({ count: treeGeoCount, side: 1, xMin: -220, xMax: 220, zMin: 40, zMax: -480, seed: 5 });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let placed = 0, tries = 0;
  while (placed < treeGeoCount && tries < treeGeoCount * 20) {
    tries++;
    const x = (rand() - 0.5) * 460, z = 40 - rand() * 520;
    if (distToPath(x, z) < 34 + rand() * 12) continue;
    if (Math.hypot(x - green.x, z - green.z) < 40) continue;
    if (Math.hypot((x - water.x) / water.z, (z - water.y) / water.w) < 1.3) continue;
    const h = 9 + rand() * 10, w = h * (0.24 + rand() * 0.1);
    p.set(x, sampleH(x, z) - 0.3, z); s.set(w, h, w); q.setFromAxisAngle(up, rand() * Math.PI); m.compose(p, q, s); trees.setMatrixAt(placed++, m);
  }
  trees.count = placed; trees.instanceMatrix.needsUpdate = true;
  scene.add(trees);

  const flag = createFlag({ height: 2.4 }); flag.position.set(green.x + 2, sampleH(green.x + 2, green.z - 3), green.z - 3); scene.add(flag);
  const teeMark = new THREE.Mesh(new THREE.CircleGeometry(6, 24), new THREE.MeshStandardMaterial({ color: 0x2f6a3d, roughness: 1 }));
  teeMark.rotation.x = -Math.PI / 2; teeMark.position.set(0, sampleH(0, 4) + 0.05, 4); scene.add(teeMark);
  const motes = createMotes({ count: 250, center: [-30, 8, -200], spread: [160, 12, 300], size: 0.5 }); scene.add(motes);

  // Camera path: pin → green → approach → tee. Look targets follow slightly ahead on the ground.
  const camPts = [new THREE.Vector3(-30, 24, -420), new THREE.Vector3(-62, 12, -350), new THREE.Vector3(-40, 22, -270), new THREE.Vector3(-4, 30, -150), new THREE.Vector3(14, 26, -40), new THREE.Vector3(6, 6, 30)];
  const lookPts = [new THREE.Vector3(-62, 0, -380), new THREE.Vector3(-64, 0, -378), new THREE.Vector3(-30, 0, -300), new THREE.Vector3(-8, 0, -200), new THREE.Vector3(0, 0, -100), new THREE.Vector3(-20, 0, -180)];
  const camCurve = new THREE.CatmullRomCurve3(camPts, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(lookPts, false, 'centripetal');
  const state = { k: 0 };
  const cp = new THREE.Vector3(), lp = new THREE.Vector3();
  const steps = hudEl ? [...hudEl.querySelectorAll('.flyover__step')] : [];
  const thresholds = [0, 0.3, 0.62, 0.88];
  function place() {
    const k = THREE.MathUtils.clamp(state.k, 0, 1);
    camCurve.getPointAt(k, cp); lookCurve.getPointAt(k, lp);
    cp.y = Math.max(cp.y, sampleH(cp.x, cp.z) + 5);
    camera.position.lerp(cp, 0.5);
    camera.lookAt(lp);
    let active = 0; for (let i = 0; i < thresholds.length; i++) if (k >= thresholds[i]) active = i;
    steps.forEach((el, i) => el.classList.toggle('is-active', i === active));
  }
  camera.position.copy(camPts[0]); place();
  stage.onFrame((dt, t) => { motes.userData.update(t); flag.userData.update(t); ground.material.uniforms.time.value = t; place(); });
  stage.start();

  if (quality.reducedMotion) { state.k = 0.5; return stage; }
  ScrollTrigger.create({ trigger: pinEl, start: 'top top', end: '+=260%', pin: true, scrub: 0.9, onUpdate: (self) => { state.k = self.progress; } });
  return stage;
}
