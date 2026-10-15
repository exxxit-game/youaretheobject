import { areasFrom, keep } from './locomotion-math.js';

// Keeps the desktop camera (mouse + WASD) inside the room: its world position, so the walls hold
// however the rig is turned (A-Frame turns the view with the camera rig: components/camera.md). In a
// headset the pose is the player's real position, so it is left alone there. A computer's full screen
// is A-Frame's VR mode too (its enterVR sets "vr-mode" without a headset), and the camera walked
// through the walls in it: a headset is told by its session presenting. The area: the rectangle
// minX..maxZ and the ones in also, as locomotion takes them (locomotion-math.js).
const p = new THREE.Vector3();
AFRAME.registerComponent('room-bounds', {
  schema: {
    minX: { default: -1.4 }, maxX: { default: 1.4 },
    minZ: { default: -0.5 }, maxZ: { default: 1.0 },
    also: { default: '' }
  },
  update() {
    const d = this.data;
    this.areas = [{ minX: d.minX, maxX: d.maxX, minZ: d.minZ, maxZ: d.maxZ }, ...areasFrom(d.also)];
    this.last = null;
  },
  tick() {
    if (this.el.sceneEl.renderer.xr.isPresenting) return;
    const o = this.el.object3D, rig = o.parent;
    rig.updateMatrixWorld();
    p.copy(o.position).applyMatrix4(rig.matrixWorld);
    // from where the camera last stood inside: a step across the opening between two areas is kept
    const [x, z] = keep(this.last || [p.x, p.z], [p.x, p.z], this.areas);
    this.last = [x, z];
    if (x === p.x && z === p.z) return;
    p.x = x;
    p.z = z;
    rig.worldToLocal(p);
    o.position.x = p.x;
    o.position.z = p.z;
  }
});
