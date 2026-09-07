import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Vignette + film grain + a whisper of chromatic aberration. Runs in linear space before OutputPass.
const CinematicShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    vignette: { value: 0.55 },
    grain: { value: 0.045 },
    aberration: { value: 0.0004 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float time, vignette, grain, aberration;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 uv = vUv;
      vec2 d = (uv - 0.5) * aberration * 2.0;
      float r = texture2D(tDiffuse, uv + d).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - d).b;
      vec3 col = vec3(r, g, b);
      float dist = distance(uv, vec2(0.5));
      col *= 1.0 - smoothstep(0.35, 0.95, dist) * vignette;
      float n = hash(uv * vec2(1920.0, 1080.0) + fract(time) * 100.0) - 0.5;
      col += n * grain * (0.5 + 0.5 * (1.0 - dist));
      gl_FragColor = vec4(col, 1.0);
    }`,
};

export function createComposer(renderer, scene, camera, opts = {}) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  let bloom = null;
  if (opts.bloom !== false) {
    const b = opts.bloom || {};
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), b.strength ?? 0.55, b.radius ?? 0.6, b.threshold ?? 0.82);
    composer.addPass(bloom);
  }
  const cine = new ShaderPass(CinematicShader);
  if (opts.vignette !== undefined) cine.uniforms.vignette.value = opts.vignette;
  if (opts.grain !== undefined) cine.uniforms.grain.value = opts.grain;
  composer.addPass(cine);
  composer.addPass(new OutputPass());
  return {
    composer, bloom, cine,
    setSize(w, h, dpr) { composer.setPixelRatio(dpr); composer.setSize(w, h); },
    render(time) { cine.uniforms.time.value = time; composer.render(); },
  };
}
