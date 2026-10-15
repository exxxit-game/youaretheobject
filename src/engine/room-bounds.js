// Keeps the desktop camera (mouse + WASD) inside the room: its world position, so the walls hold
// however the rig is turned (A-Frame turns the view with the camera rig: components/camera.md). In a
// headset the pose is the player's real position, so it is left alone there. A computer's full screen
// is A-Frame's VR mode too (its enterVR sets "vr-mode" without a headset), and the camera walked
// through the walls in it: a headset is told by its session presenting.
const p = new THREE.Vector3();
AFRAME.registerComponent('room-bounds', {
  schema: {
    minX: { default: -1.4 }, maxX: { default: 1.4 },
    minZ: { default: -0.5 }, maxZ: { default: 1.0 }
  },
  tick() {
    if (this.el.sceneEl.renderer.xr.isPresenting) return;
    const o = this.el.object3D, rig = o.parent, d = this.data;
    rig.updateMatrixWorld();
    p.copy(o.position).applyMatrix4(rig.matrixWorld);
    const x = Math.max(d.minX, Math.min(d.maxX, p.x)), z = Math.max(d.minZ, Math.min(d.maxZ, p.z));
    if (x === p.x && z === p.z) return;
    p.x = x;
    p.z = z;
    rig.worldToLocal(p);
    o.position.x = p.x;
    o.position.z = p.z;
  }
});
