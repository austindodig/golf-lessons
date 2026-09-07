import * as THREE from 'three';
import { quality } from './quality.js';
import { createComposer } from './postfx.js';

// A Stage owns one canvas: renderer, scene, camera, optional post-processing,
// resize handling, and a frame loop that pauses when the canvas is off-screen.
export function createStage(container, opts = {}) {
  if (!quality.webgl) return null;
  const canvas = document.createElement('canvas');
  canvas.className = 'stage';
  container.appendChild(canvas);
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: quality.tier !== 'low', alpha: !!opts.alpha, powerPreference: 'high-performance',
    stencil: false,
  });
  const dpr = Math.min(devicePixelRatio || 1, opts.maxDpr ?? quality.dpr);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.0;
  renderer.shadowMap.enabled = !!(opts.shadows && quality.shadows);
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if (opts.alpha) renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov ?? 40, 1, opts.near ?? 0.05, opts.far ?? 600);
  camera.position.set(0, 1.4, 4);

  const usePost = opts.postfx !== false && quality.bloom;
  const post = usePost ? createComposer(renderer, scene, camera, opts.postfx || {}) : null;

  const frameFns = new Set();
  const clock = { running: false, last: 0, elapsedTime: 0, start() { this.running = true; this.last = performance.now(); }, getDelta() { const n = performance.now(); const d = (n - this.last) / 1000; this.last = n; this.elapsedTime += d; return d; } };
  let running = false, visible = true, pageVisible = !document.hidden, size = { w: 1, h: 1 };
  let needsRender = true;

  function resize() {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
    if (w === size.w && h === size.h) return;
    size = { w, h };
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    post?.setSize(w, h, dpr);
    needsRender = true;
    opts.onResize?.(w, h);
  }
  const ro = new ResizeObserver(() => { resize(); if (!running) renderOnce(); });
  ro.observe(container);
  resize();

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (running) syncLoop();
  }, { rootMargin: '120px' });
  io.observe(container);
  const onVis = () => { pageVisible = !document.hidden; if (running) syncLoop(); };
  document.addEventListener('visibilitychange', onVis);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.elapsedTime;
    for (const fn of frameFns) fn(dt, t);
    if (post) post.render(t); else renderer.render(scene, camera);
  }
  function renderOnce() { if (post) post.render(clock.elapsedTime); else renderer.render(scene, camera); }
  function syncLoop() {
    const active = running && visible && pageVisible;
    renderer.setAnimationLoop(active ? frame : null);
    if (active && !clock.running) clock.start();
  }
  const stage = {
    renderer, scene, camera, post, canvas, quality,
    get size() { return size; },
    onFrame(fn) { frameFns.add(fn); return () => frameFns.delete(fn); },
    start() { running = true; syncLoop(); return stage; },
    stop() { running = false; syncLoop(); },
    renderOnce,
    dispose() {
      running = false; renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => { o.geometry?.dispose?.(); if (o.material) [].concat(o.material).forEach((m) => m.dispose?.()); });
      renderer.dispose(); canvas.remove();
    },
  };
  return stage;
}
