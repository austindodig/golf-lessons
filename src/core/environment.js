import * as THREE from 'three';

// Dusk sky dome: deep teal zenith, warm gold horizon, a low sun with a soft halo.
export function createSkyDome({ radius = 400, sunDir = new THREE.Vector3(0.6, 0.12, -0.78), intensity = 1 } = {}) {
  const geo = new THREE.SphereGeometry(radius, 48, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      topColor: { value: new THREE.Color('#050b10') },
      midColor: { value: new THREE.Color('#0c2530') },
      horizonColor: { value: new THREE.Color('#d67a2f') },
      hazeColor: { value: new THREE.Color('#5a3a2a') },
      sunColor: { value: new THREE.Color('#ffd89a') },
      sunDir: { value: sunDir.clone().normalize() },
      intensity: { value: intensity },
    },
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform vec3 topColor, midColor, horizonColor, hazeColor, sunColor, sunDir; uniform float intensity;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        // Gradient from horizon to zenith
        vec3 col = mix(midColor, topColor, smoothstep(0.05, 0.6, h));
        float horizonBand = exp(-abs(h) * 16.0);
        // Sun-facing side of the horizon glows gold, opposite side stays dusky
        float sunSide = 0.5 + 0.5 * dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(sunDir.x, 0.0, sunDir.z)));
        col = mix(col, horizonColor, horizonBand * (0.12 + 0.88 * pow(sunSide, 4.0)) * 0.85);
        col = mix(col, hazeColor, exp(-abs(h) * 30.0) * 0.35);
        // Sun disc + halo
        float cosA = max(dot(d, sunDir), 0.0);
        col += sunColor * pow(cosA, 900.0) * 2.2;
        col += sunColor * pow(cosA, 40.0) * 0.32;
        col += sunColor * pow(cosA, 6.0) * 0.05;
        // Below the horizon: fade to ground darkness
        col = mix(col, topColor * 0.6, smoothstep(0.0, -0.15, h));
        gl_FragColor = vec4(col * intensity, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'sky';
  mesh.renderOrder = -10;
  return mesh;
}

// Adds sky, environment map, lights and fog to a scene.
export function buildEnvironment(renderer, scene, opts = {}) {
  const sunDir = (opts.sunDir || new THREE.Vector3(0.6, 0.12, -0.78)).clone().normalize();
  const sky = createSkyDome({ radius: opts.skyRadius || 400, sunDir, intensity: opts.skyIntensity ?? 1 });
  if (opts.sky !== false) scene.add(sky);

  // Environment map generated from the same sky so materials pick up dusk reflections.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(createSkyDome({ radius: 50, sunDir, intensity: opts.envIntensity ?? 0.9 }));
  const envTex = pmrem.fromScene(envScene, 0.02).texture;
  scene.environment = envTex;
  pmrem.dispose();

  const sun = new THREE.DirectionalLight(new THREE.Color('#ffc07a'), opts.sunIntensity ?? 2.6);
  sun.position.copy(sunDir).multiplyScalar(60);
  if (opts.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const s = opts.shadowSize || 6;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 200 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
  }
  scene.add(sun);
  scene.add(sun.target);

  const hemi = new THREE.HemisphereLight(new THREE.Color('#1f4a5a'), new THREE.Color('#0b1a12'), opts.hemiIntensity ?? 0.9);
  scene.add(hemi);
  const rim = new THREE.DirectionalLight(new THREE.Color('#7fb8ff'), opts.rimIntensity ?? 0.7);
  rim.position.set(-sunDir.x, 0.5, -sunDir.z).multiplyScalar(40);
  scene.add(rim);

  if (opts.fog !== false) {
    scene.fog = new THREE.FogExp2(new THREE.Color(opts.fogColor || '#0b1a20'), opts.fogDensity ?? 0.012);
  }
  return { sky, sun, hemi, rim, envTex, sunDir };
}
