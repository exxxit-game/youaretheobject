import { DECAL_OFFSET } from './decal.js';

// Soft contact shadow under an object: a flat, transparent plane with a radial
// gradient. Real-time shadows are too expensive in a headset; this keeps objects
// from looking like they float, at almost no cost. It lies on the floor or the table as a decal
// (decal.js): a few millimetres over it, it would flicker into it.
let texture = null;
function gradientTexture() {
  if (texture) return texture;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  texture = new THREE.CanvasTexture(c);
  return texture;
}

AFRAME.registerComponent('blob-shadow', {
  schema: { w: { default: 0.5 }, h: { default: 0.5 }, opacity: { default: 0.45 } },
  init() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.data.w, this.data.h),
      new THREE.MeshBasicMaterial({ map: gradientTexture(), transparent: true, opacity: this.data.opacity, depthWrite: false, ...DECAL_OFFSET })
    );
    mesh.rotation.x = -Math.PI / 2;
    this.el.setObject3D('mesh', mesh);
  },
  // its plane and material are its own, the gradient is every shadow's (three.js r184 manual,
  // how-to-dispose-of-objects: "geometries and materials can be shared")
  remove() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    this.el.removeObject3D('mesh');
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
});
