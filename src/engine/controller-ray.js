// WHY: WebXR 10.1 distinguishes the held object's gripSpace from targetRaySpace, the
// platform's ergonomic pointing ray (https://www.w3.org/TR/webxr/#xrinputsource-interface).
// A-Frame 1.8.0 tracks gripSpace but laser-controls applies its pointing correction only
// after a model loads. A failed model request therefore leaves the wrong, grip-forward ray.
// Read the native ray in grip coordinates: the entity/rig still supplies its world transform.
AFRAME.registerComponent('controller-ray', {
  after: ['tracked-controls'],
  init() {
    this.direction = new THREE.Vector3();
    // tracked-controls updates buttons before this tick. Its triggerup can therefore
    // dispatch a cursor click in the very frame absolute tracking became null. Stop
    // the target's click in capture phase, before its choice handler, not one tick later.
    this.guardClick = event => {
      if (this.el.sceneEl.renderer.xr.isPresenting && event.detail?.cursorEl === this.el &&
          !this.el.components['tracked-controls']?.pose) event.stopImmediatePropagation();
    };
    this.el.sceneEl.addEventListener('click', this.guardClick, true);
  },
  remove() {
    this.el.sceneEl.removeEventListener('click', this.guardClick, true);
  },
  tick() {
    const scene = this.el.sceneEl, tracked = this.el.components['tracked-controls'], source = tracked?.controller;
    const ray = this.el.components.raycaster;
    if (!scene.renderer.xr.isPresenting || !ray) return;
    // Related input spaces can remain known while absolute grip tracking is lost.
    // tracked-controls keeps its previous matrix then; never aim from that stale hand.
    const pose = tracked?.pose && source?.gripSpace && source.targetRaySpace && scene.frame?.getPose(source.targetRaySpace, source.gripSpace);
    if (!pose) {
      const cursor = this.el.components.cursor;
      if (cursor) { cursor.isCursorDown = false; cursor.cursorDownEl = null; }
      if (ray.data.enabled) this.el.setAttribute('raycaster', 'enabled', false);
      return;
    }
    const origin = pose.transform.position;
    const direction = this.direction.set(0, 0, -1).applyQuaternion(pose.transform.orientation);
    const same = (a, b) => Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6 && Math.abs(a.z - b.z) < 1e-6;
    // Avoid schema/line updates for the usual fixed transform. A late model-ready event
    // may replace these values, so compare the raycaster itself, not a private last pose.
    if (!ray.data.enabled || !same(origin, ray.data.origin) || !same(direction, ray.data.direction)) {
      this.el.setAttribute('raycaster', { origin: { x: origin.x, y: origin.y, z: origin.z },
        direction: { x: direction.x, y: direction.y, z: direction.z }, enabled: true });
    }
  }
});
