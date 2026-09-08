import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createStage } from '../core/stage.js';
import { buildEnvironment } from '../core/environment.js';
import { createBall, createTee, BALL_RADIUS } from '../objects/ball.js';
import { createClub } from '../objects/clubs.js';
import { createMotes } from '../objects/terrain.js';
import { quality } from '../core/quality.js';

gsap.registerPlugin(ScrollTrigger);

// Home hero: a macro shot of a ball on a tee with a driver behind it, floating over the photograph.
// Scroll orbits the camera and spins the ball; the pointer adds a little parallax.
export function mountHero(stageEl, heroSection) {
  const stage = createStage(stageEl, { alpha: true, fov: 30, near: 0.01, far: 50, exposure: 1.1, postfx: { bloom: { strength: 0.35, radius: 0.7, threshold: 0.9 }, vignette: 0.35, grain: 0.03 } });
  if (!stage) return null;
  const { scene, camera, renderer } = stage;
  const sunDir = new THREE.Vector3(0.55, 0.22, -0.8);
  const env = buildEnvironment(renderer, scene, { sky: false, fog: false, sunDir, sunIntensity: 2.2, hemiIntensity: 0.7, rimIntensity: 0.4, envIntensity: 0.8 });
  env.hemi.color.set('#4a5258'); env.hemi.groundColor.set('#2a1d10');
  const key = new THREE.DirectionalLight(new THREE.Color('#fff1dc'), 1.1); key.position.set(1.5, 1.2, 2.2); scene.add(key);
  const fill = new THREE.DirectionalLight(new THREE.Color('#ffd9b0'), 0.5); fill.position.set(-1.5, 0.6, 1.5); scene.add(fill);

  const rig = new THREE.Group(); scene.add(rig);
  const ball = createBall({ lowPoly: quality.tier === 'low' });
  const tee = createTee({ height: 0.05 });
  ball.position.y = 0.05 + BALL_RADIUS;
  const club = createClub('driver');
  club.position.set(0.0, 0.012, 0.035 + BALL_RADIUS);
  club.rotation.y = 0.35;
  club.userData.head.traverse((o) => { if (!o.material) return; if (o.material.metalness === 1) o.material.roughness = 0.55; if (o.material.clearcoat) { o.material.clearcoat = 0.35; o.material.clearcoatRoughness = 0.5; o.material.envMapIntensity = 0.35; } });
  rig.add(ball, tee, club);
  // Soft contact shadow under the tee
  const shadowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(0,0,0,0.75)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.001; rig.add(shadow);
  const motes = createMotes({ count: quality.tier === 'low' ? 80 : 220, center: [0, 0.12, 0], spread: [1.4, 0.5, 1.2], size: 0.012, color: 0xffe2b0 });
  scene.add(motes);

  // Camera choreography
  const look = new THREE.Vector3(0.02, 0.06, 0);
  const state = { k: 0, px: 0, py: 0 };
  const basePos = new THREE.Vector3(), tmp = new THREE.Vector3(), lookShift = new THREE.Vector3();
  function placeCamera() {
    const k = state.k;
    const az = -0.55 + k * 1.35;            // orbit from front-right to behind the ball
    const el = 0.18 + k * 0.62;             // rise up as we scroll
    const r = 0.36 - k * 0.06;
    basePos.set(Math.sin(az) * Math.cos(el) * r, Math.sin(el) * r + 0.05, Math.cos(az) * Math.cos(el) * r);
    tmp.copy(basePos).add(new THREE.Vector3(state.px * 0.03, state.py * 0.02, 0));
    camera.position.copy(tmp);
    camera.lookAt(look);
    // Frame the subject on the right third so the headline breathes on the left.
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const shift = innerWidth > 900 ? -0.105 : -0.02;
    camera.position.addScaledVector(right, shift);
    lookShift.copy(look).addScaledVector(right, shift);
    camera.lookAt(lookShift);
    ball.rotation.y = k * 2.2; ball.rotation.x = k * 0.6;
    club.rotation.y = 0.35 - k * 0.5; club.position.z = 0.035 + BALL_RADIUS + k * 0.08;
  }
  placeCamera();
  const onMove = (e) => { state.px = (e.clientX / innerWidth - 0.5) * 2; state.py = (e.clientY / innerHeight - 0.5) * 2; };
  if (!quality.touch) addEventListener('pointermove', onMove, { passive: true });
  let t0 = 0;
  stage.onFrame((dt, t) => { motes.userData.update(t); t0 = t; placeCamera(); ball.rotation.y += dt * 0.05; });
  stage.start();

  if (!quality.reducedMotion) {
    gsap.to(state, { k: 1, ease: 'none', scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.8 } });
    gsap.to(stageEl, { opacity: 0.15, ease: 'none', scrollTrigger: { trigger: heroSection, start: '55% top', end: 'bottom top', scrub: true } });
  }
  return stage;
}
