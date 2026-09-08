import * as THREE from 'three';

// Dusk grass shader: fairway corridor with mowing stripes, rough at the edges, subtle noise,
// a sun glint from the low sun, and scene fog. Works in world space so any mesh can use it.
export function createGrassMaterial(opts = {}) {
  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      fairwayColorA: { value: new THREE.Color(opts.fairwayA || '#1c4a2b') },
      fairwayColorB: { value: new THREE.Color(opts.fairwayB || '#173d24') },
      roughColor: { value: new THREE.Color(opts.rough || '#0f2417') },
      greenColor: { value: new THREE.Color(opts.green || '#245f34') },
      sunDir: { value: (opts.sunDir || new THREE.Vector3(0.6, 0.12, -0.78)).clone().normalize() },
      sunColor: { value: new THREE.Color('#ffb36b') },
      fairwayHalf: { value: opts.fairwayHalf ?? 20 },
      stripeWidth: { value: opts.stripeWidth ?? 7 },
      stripeDir: { value: opts.stripeDir ?? 0 },  // 0 = across the target line, 1 = along it
      greenCenter: { value: opts.greenCenter || new THREE.Vector3(0, 0, -99999) },
      greenRadius: { value: opts.greenRadius ?? 0 },
      pathPts: { value: (opts.pathPts || []).concat(Array(8).fill(new THREE.Vector3())).slice(0, 8) },
      pathCount: { value: opts.pathPts ? opts.pathPts.length : 0 },
      bunkers: { value: (opts.bunkers || []).concat(Array(5).fill(new THREE.Vector4())).slice(0, 5) },
      bunkerCount: { value: opts.bunkers ? opts.bunkers.length : 0 },
      water: { value: opts.water || new THREE.Vector4(0, 0, 0, 0) },
      sandColor: { value: new THREE.Color('#cbb98f') },
      waterColor: { value: new THREE.Color('#0a2430') },
      glint: { value: opts.glint ?? 0.35 },
      time: { value: 0 },
    },
  ]);
  const mat = new THREE.ShaderMaterial({
    uniforms, fog: true,
    vertexShader: /* glsl */`
      #include <fog_pars_vertex>
      varying vec3 vWorld; varying vec3 vNormalW;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */`
      #include <fog_pars_fragment>
      uniform vec3 fairwayColorA, fairwayColorB, roughColor, greenColor, sunDir, sunColor, greenCenter, sandColor, waterColor;
      uniform float fairwayHalf, stripeWidth, stripeDir, greenRadius, time, glint;
      uniform vec3 pathPts[8]; uniform int pathCount; uniform vec4 bunkers[5]; uniform int bunkerCount; uniform vec4 water;
      float segDist(vec2 p, vec2 a, vec2 b) { vec2 ab = b - a; float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0); return distance(p, a + ab * t); }
      varying vec3 vWorld; varying vec3 vNormalW;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      void main() {
        vec2 p = vWorld.xz;
        float n = noise(p * 0.8) * 0.6 + noise(p * 3.1) * 0.3 + noise(p * 11.0) * 0.1;
        float edgeWobble = (noise(vec2(p.y * 0.05, 0.0)) - 0.5) * 6.0;
        float dx = abs(p.x - edgeWobble);
        if (pathCount > 1) {
          dx = 1e9;
          for (int i = 0; i < 7; i++) { if (i + 1 >= pathCount) break; dx = min(dx, segDist(p, pathPts[i].xz, pathPts[i + 1].xz)); }
          dx += (noise(p * 0.08) - 0.5) * 8.0;
        }
        float fairway = 1.0 - smoothstep(fairwayHalf - 2.0, fairwayHalf + 2.0, dx);
        float stripeCoord = mix(p.y, p.x, stripeDir);
        float stripe = step(0.5, fract(stripeCoord / (stripeWidth * 2.0)));
        vec3 fw = mix(fairwayColorA, fairwayColorB, stripe);
        vec3 col = mix(roughColor, fw, fairway);
        // Putting green disc
        float dg = distance(p, greenCenter.xz);
        float green = 1.0 - smoothstep(greenRadius - 1.5, greenRadius + 1.5, dg);
        col = mix(col, greenColor, green * step(0.1, greenRadius));
        // Bunkers and water
        for (int i = 0; i < 5; i++) {
          if (i >= bunkerCount) break;
          vec4 b = bunkers[i];
          float e = length((p - b.xy) / b.zw) + (noise(p * 0.6) - 0.5) * 0.25;
          col = mix(col, sandColor * (0.9 + n * 0.2), 1.0 - smoothstep(0.85, 1.0, e));
        }
        if (water.z > 0.0) {
          float e = length((p - water.xy) / water.zw) + (noise(p * 0.3) - 0.5) * 0.2;
          float w = 1.0 - smoothstep(0.9, 1.0, e);
          vec3 wc = waterColor + sunColor * 0.25 * pow(max(dot(reflect(-sunDir, vec3(0.0, 1.0, 0.0)), normalize(cameraPosition - vWorld)), 0.0), 16.0);
          wc += (noise(p * 2.0 + time * 0.3) - 0.5) * 0.04;
          col = mix(col, wc, w);
        }
        col *= 0.85 + n * 0.3;
        // Low-sun glint (cheap Blinn-Phong)
        vec3 V = normalize(cameraPosition - vWorld);
        vec3 H = normalize(sunDir + V);
        float spec = pow(max(dot(normalize(vNormalW), H), 0.0), 60.0);
        float diff = max(dot(normalize(vNormalW), sunDir), 0.0);
        col += sunColor * (spec * glint + diff * 0.08) * (0.8 + fairway * 0.4);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`,
  });
  return mat;
}

export function createRangeGround(opts = {}) {
  const size = opts.size ?? 900;
  let geo;
  if (opts.holes?.length) {
    // Shape with elliptical holes (e.g. a bunker bowl rendered as its own mesh). Shape y maps to world -z.
    const shape = new THREE.Shape();
    shape.moveTo(-size / 2, -size / 2); shape.lineTo(size / 2, -size / 2); shape.lineTo(size / 2, size / 2); shape.lineTo(-size / 2, size / 2); shape.closePath();
    for (const hle of opts.holes) { const path = new THREE.Path(); path.absellipse(hle.x, -hle.z - (size / 2 - (opts.behind ?? 60)), hle.rx, hle.rz, 0, Math.PI * 2, false); shape.holes.push(path); }
    geo = new THREE.ShapeGeometry(shape, 24);
  } else geo = new THREE.PlaneGeometry(size, size, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mat = createGrassMaterial(opts);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, -size / 2 + (opts.behind ?? 60));
  mesh.receiveShadow = true;
  mesh.name = 'ground';
  return mesh;
}

// Silhouetted pine tree lines along the rough: tiered cones on a trunk, instanced and cheap.
export function createTreeLine({ count = 160, side = 1, xMin = 40, xMax = 140, zMin = -20, zMax = -420, seed = 1 } = {}) {
  const rand = mulberry(seed);
  const tier = new THREE.ConeGeometry(1, 1, 8, 1);
  const parts = [];
  for (const [y, r, hgt] of [[0.0, 1.0, 0.5], [0.3, 0.8, 0.45], [0.55, 0.6, 0.4], [0.78, 0.38, 0.32]]) {
    const g = tier.clone(); g.scale(r, hgt, r); g.translate(0, y + hgt / 2, 0); parts.push(g);
  }
  const trunk = new THREE.CylinderGeometry(0.05, 0.07, 0.35, 6); trunk.translate(0, 0.17, 0); parts.push(trunk);
  const merged = mergeGeometries(parts);
  const mat = new THREE.MeshStandardMaterial({ color: 0x0e2417, roughness: 1, metalness: 0 });
  const inst = new THREE.InstancedMesh(merged, mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < count; i++) {
    const h = 9 + rand() * 9, w = h * (0.22 + rand() * 0.1);
    p.set(side * (xMin + Math.pow(rand(), 0.7) * (xMax - xMin)), -0.2, zMin + rand() * (zMax - zMin));
    s.set(w, h, w);
    q.setFromAxisAngle(up, rand() * Math.PI);
    m.compose(p, q, s);
    inst.setMatrixAt(i, m);
  }
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}

function mergeGeometries(geos) {
  const flat = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let count = 0; for (const g of flat) count += g.attributes.position.count;
  const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3);
  let off = 0;
  for (const g of flat) {
    pos.set(g.attributes.position.array, off); nor.set(g.attributes.normal.array, off);
    off += g.attributes.position.array.length;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return out;
}

// Drifting particles: pollen / mist motes catching the light.
export function createMotes({ count = 400, spread = [40, 6, 60], center = [0, 2, -20], size = 0.12, color = 0xffd9a0 } = {}) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3), seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = center[0] + (Math.random() - 0.5) * spread[0];
    pos[i * 3 + 1] = center[1] + (Math.random() - 0.5) * spread[1];
    pos[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread[2];
    seeds[i] = Math.random() * 100;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { time: { value: 0 }, size: { value: size }, color: { value: new THREE.Color(color) } },
    vertexShader: /* glsl */`
      attribute float seed; uniform float time, size; varying float vA;
      void main() {
        vec3 p = position;
        p.x += sin(time * 0.3 + seed) * 0.6; p.y += sin(time * 0.5 + seed * 1.7) * 0.4; p.z += cos(time * 0.25 + seed * 0.3) * 0.6;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = size * (300.0 / -mv.z);
        vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(time * 1.3 + seed * 3.0));
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 color; varying float vA;
      void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(color, a * vA * 0.7); }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.visible = false;   // drifting motes retired: they read as fireflies over the scenes
  pts.userData.update = (t) => { mat.uniforms.time.value = t; };
  return pts;
}

export function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
