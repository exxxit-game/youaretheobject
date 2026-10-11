// One-way mirror seen from the subject's side: it reflects the room. The reflection is captured
// once (a cube camera a little in front of the glass), so it costs nothing per frame. It is taken
// when the room is as the player will see it: after the scene has loaded, or, for a room that waits
// dark and undrawn behind its shut door, when the event named by `on` reaches the scene (the app's
// room-entered: the room lit and the player in). It is taken in a tick, before either eye is drawn:
// A-Frame's multiview cannot take another view rendered in the middle of a frame (A-Frame 1.8.0,
// docs/components/renderer.md: such rendering "would have to move to the beginning of the frame").
// The player is left out of it (their rig: the controllers, the fade round the camera), as a picture
// taken once would hold them frozen there.
// The room still controls the glass opacity: when the observation room is lit, the glass turns
// see-through and the reflection fades with it.
AFRAME.registerComponent('mirror-glass', {
  schema: { size: { default: 256 }, delay: { default: 1200 }, offset: { default: 0.6 }, eye: { default: 1.4 }, intensity: { default: 1.8 },
    on: { default: '' } },
  init() {
    this.envMap = null;
    this.due = false;
    // A-Frame's material clears envMap whenever the material attribute changes (opacity).
    this.el.addEventListener('componentchanged', (e) => { if (e.detail.name === 'material') this.apply(); });
    const sceneEl = this.el.sceneEl;
    if (this.data.on) { sceneEl.addEventListener(this.data.on, () => { this.due = true; }); return; }
    const later = () => setTimeout(() => { this.due = true; }, this.data.delay);
    if (sceneEl.hasLoaded) later(); else sceneEl.addEventListener('loaded', later);
  },
  tick() {
    if (!this.due) return;
    this.due = false;
    this.capture();
  },
  capture() {
    const mesh = this.el.getObject3D('mesh');
    const sceneEl = this.el.sceneEl;
    if (!mesh || !sceneEl.renderer) return;
    const target = new THREE.WebGLCubeRenderTarget(this.data.size);
    const camera = new THREE.CubeCamera(0.05, 20, target);
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    this.el.object3D.getWorldPosition(pos);
    this.el.object3D.getWorldQuaternion(quat);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
    camera.position.copy(pos).addScaledVector(normal, this.data.offset).setY(this.data.eye);
    let player = sceneEl.camera.el.object3D;
    while (player.parent && player.parent !== sceneEl.object3D) player = player.parent;
    const shown = player.visible;
    sceneEl.object3D.add(camera);
    mesh.visible = false;
    player.visible = false;
    const xr = sceneEl.renderer.xr.enabled;
    sceneEl.renderer.xr.enabled = false;
    camera.update(sceneEl.renderer, sceneEl.object3D);
    sceneEl.renderer.xr.enabled = xr;
    player.visible = shown;
    mesh.visible = true;
    sceneEl.object3D.remove(camera);
    // blurred for the glass here (PMREM), as reflect-env.js does: left to three.js it is blurred the
    // first time the glass is drawn, in the middle of a frame
    const pmrem = new THREE.PMREMGenerator(sceneEl.renderer);
    if (this.envMap) this.envMap.dispose();
    this.envMap = pmrem.fromCubemap(target.texture).texture;
    pmrem.dispose();
    target.dispose();
    this.apply();
  },
  apply() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh || !this.envMap) return;
    mesh.material.envMap = this.envMap;
    mesh.material.envMapIntensity = this.data.intensity;
    mesh.material.needsUpdate = true;
  }
});
