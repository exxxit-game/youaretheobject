// Polished metal shows the room round it; with nothing to mirror it reads as grey plastic.
// reflect-env takes a small picture of the surroundings from the object's place (a cube map) and
// gives it to the object's metal parts (metalness 0.5 or more). It takes it again a few times
// while the lights settle after load, then never, so it costs nothing afterwards. The picture is
// blurred for rough metal (PMREM) right here, in the tick, before either eye is drawn: left to
// three.js it would be blurred in the middle of drawing an eye, which in a headset spoils a frame.
// <a-entity reflect-env> ... polished parts ... </a-entity>

// What a picture taken once must not hold, or it holds it frozen where it was (the controllers
// showed so in the extinguisher's steel): the player (the camera's rig: controllers, lasers, the
// fade round the camera) and what only shows the player's aim (marked userData.player: the teleport
// arc and ring), as a static reflection probe leaves out what moves (Unity: a baked probe "does not
// capture GameObjects at runtime that have their Reflection Probe Static flag disabled",
// docs.unity3d.com/Manual/class-ReflectionProbe.html). Returns the way back.
export function hidePlayer(sceneEl) {
  let rig = sceneEl.camera.el.object3D;
  while (rig.parent && rig.parent !== sceneEl.object3D) rig = rig.parent;
  const hidden = [rig, ...sceneEl.object3D.children.filter((c) => c.userData.player)].filter((c) => c.visible);
  for (const c of hidden) c.visible = false;
  return () => { for (const c of hidden) c.visible = true; };
}

AFRAME.registerComponent('reflect-env', {
  // strength: how much of the picture the metal shows (a small satin part near a bright sign glares at 1)
  // out: metres to move the picture's point along the entity's own +z, for a flat thing on a wall
  // (a frame): taken closer to the wall than the camera's near limit, it would see through the wall
  schema: { size: { default: 128 }, times: { default: 6 }, every: { default: 2500 }, strength: { default: 1 }, out: { default: 0 } },

  init() {
    const THREE = AFRAME.THREE;
    this.target = new THREE.WebGLCubeRenderTarget(this.data.size);
    this.cam = new THREE.CubeCamera(0.05, 30, this.target);
    this.el.sceneEl.object3D.add(this.cam);
    this.taken = 0;
    this.last = -Infinity;
  },

  tick(t) {
    if (this.taken >= this.data.times || t - this.last < this.data.every) return;
    this.last = t;
    this.taken++;
    this.take();
  },

  take() {
    const renderer = this.el.sceneEl.renderer, o = this.el.object3D;
    // from the middle of the object itself (its parts may sit far from the entity's origin)
    new AFRAME.THREE.Box3().setFromObject(o).getCenter(this.cam.position);
    if (this.data.out) this.cam.position.addScaledVector(new AFRAME.THREE.Vector3(0, 0, 1).transformDirection(o.matrixWorld), this.data.out);
    const shown = o.visible;
    o.visible = false;   // the object must not mirror itself
    const back = hidePlayer(this.el.sceneEl);
    const xr = renderer.xr.enabled;
    renderer.xr.enabled = false;
    try {
      this.cam.update(renderer, this.el.sceneEl.object3D);
    } finally {
      renderer.xr.enabled = xr;
      back();
    }
    o.visible = shown;   // a hidden object stays hidden
    this.pmrem = this.pmrem || new AFRAME.THREE.PMREMGenerator(renderer);
    this.blurred = this.pmrem.fromCubemap(this.target.texture, this.blurred);
    const map = this.blurred.texture;
    // a mesh may carry several materials (a frame's burnished and matte gilding)
    o.traverse((m) => {
      for (const mat of m.material ? [].concat(m.material) : []) {
        if (mat.metalness >= 0.5 && mat.envMap !== map) {
          mat.envMap = map;
          mat.envMapIntensity = this.data.strength;
          mat.needsUpdate = true;
        }
      }
    });
  },

  remove() {
    this.el.sceneEl.object3D.remove(this.cam);
    this.target.dispose();
    if (this.blurred) this.blurred.dispose();
    if (this.pmrem) this.pmrem.dispose();
  }
});
