import * as THREE from 'three';

const YD = 0.9144;

// Canvas text sprite for distance labels and callouts.
export function createLabel(text, { color = '#e9efeb', size = 0.9, font = '600 44px Manrope, system-ui, sans-serif', bg = null, mono = false } = {}) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = mono ? '500 40px "JetBrains Mono", monospace' : font;
  const w = Math.ceil(ctx.measureText(text).width) + 40, h = 72;
  c.width = w; c.height = h;
  ctx.font = mono ? '500 40px "JetBrains Mono", monospace' : font;
  if (bg) { ctx.fillStyle = bg; roundRect(ctx, 0, 0, w, h, 14); ctx.fill(); }
  ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
  const sp = new THREE.Sprite(mat);
  sp.scale.set((w / h) * size, size, 1);
  sp.renderOrder = 20;
  sp.userData.setText = (t) => { /* simple: rebuild */ };
  return sp;
}
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// Faint glowing target line along -Z.
export function createTargetLine({ length = 300, color = 0x6ee7a8, opacity = 0.35 } = {}) {
  const geo = new THREE.PlaneGeometry(0.12, length);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(0, 0.012, -length / 2 + 2);
  return m;
}

// Range distance arcs with yardage painted flat on the grass so they never stack up in perspective.
export function createDistanceArcs({ distances = [50, 100, 150, 200, 250], color = 0xffffff, edgeX = 30 } = {}) {
  const g = new THREE.Group();
  for (const d of distances) {
    const r = d * YD;
    const pts = [];
    const span = Math.min(0.5, 26 / r);
    for (let i = 0; i <= 48; i++) {
      const a = -span + (i / 48) * span * 2;
      pts.push(new THREE.Vector3(Math.sin(a) * r, 0.02, -Math.cos(a) * r));
    }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.14, fog: true }));
    g.add(line);
    for (const side of [-1, 1]) {
      const label = createGroundText(`${d}`, { color: '#f3cf7a' });
      const w = 2.4 + d * 0.02;
      label.scale.set(w * 2.2, w, 1);
      label.rotation.x = -Math.PI / 2;
      label.position.set(side * (edgeX + w), 0.03, -r);
      g.add(label);
    }
  }
  return g;
}

// Text drawn on a ground plane (mesh, not sprite) so it foreshortens like paint on grass.
export function createGroundText(text, { color = '#f3cf7a' } = {}) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 116;
  const ctx = c.getContext('2d');
  ctx.font = '600 92px Manrope, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = color; ctx.fillText(text, 128, 62);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, depthWrite: false, fog: true });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  m.renderOrder = 5;
  return m;
}

export function createFlag({ height = 2.2, color = 0xf3cf7a } = {}) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, height, 10), new THREE.MeshStandardMaterial({ color: 0xf1f1f1, roughness: 0.5 }));
  pole.position.y = height / 2;
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.36, 8, 4), new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 0.8, emissive: new THREE.Color(color), emissiveIntensity: 0.15 }));
  flag.position.set(0.28, height - 0.2, 0);
  const cup = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.055, 24), new THREE.MeshBasicMaterial({ color: 0x0a0a0a, side: THREE.DoubleSide }));
  cup.rotation.x = -Math.PI / 2; cup.position.y = 0.011;
  g.add(pole, flag, cup);
  const base = flag.geometry.attributes.position.array.slice();
  g.userData.update = (t) => {
    const pos = flag.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1];
      const k = (x + 0.275) / 0.55;
      pos.setZ(i, Math.sin(t * 6 + k * 5) * 0.05 * k + Math.sin(t * 2.3 + y * 8) * 0.02 * k);
    }
    pos.needsUpdate = true;
  };
  return g;
}

// Landing marker ring pulsing on the ground.
export function createLandingRing({ color = 0xf3cf7a } = {}) {
  const geo = new THREE.RingGeometry(0.6, 0.85, 48);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide });
  const m = new THREE.Mesh(geo, mat);
  m.position.y = 0.02;
  m.visible = false;
  m.userData.update = (t) => { const s = 1 + Math.sin(t * 3) * 0.08; m.scale.set(s, 1, s); };
  return m;
}
