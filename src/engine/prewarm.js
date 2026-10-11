// Draws everything once before it is first seen, so nothing is built in the middle of play: every
// material's shaders compiled, every picture and shape on the GPU. A-Frame: "try to draw all
// materials and textures up front" (A-Frame 1.8.0, docs/introduction/best-practices.md). Once a moment
// after load, into a one-pixel picture, unseen; and once more on the first frame in a headset, since
// a headset that draws both eyes in one pass (multiview) uses other shaders than the flat page
// (three.js keys a program by its view count). For both, nothing is left out for being off the
// camera's view, and the groups named by show (hidden now: a room behind its shut door) are drawn
// too; on the headset's frame they are hidden again right after it is drawn (tock: "after the scene
// has rendered", docs/core/component.md), behind the walls that hide them anyway.
// <a-scene prewarm="show: .room-interior">
AFRAME.registerComponent('prewarm', {
  schema: { show: { default: '' } },

  init() {
    const sc = this.el;
    this.due = false;
    this.back = null;
    // after load and after merge-static's merge (a moment after load): the merged meshes have
    // their own materials
    const later = () => setTimeout(() => this.flat(), 0);
    if (sc.hasLoaded) later(); else sc.addEventListener('loaded', later, { once: true });
    sc.addEventListener('enter-vr', () => { if (sc.renderer.xr.isPresenting) this.due = true; });
  },

  // everything drawable: the hidden groups shown, nothing culled; returns the way back
  open() {
    const groups = this.data.show ? [...this.el.querySelectorAll(this.data.show)] : [];
    const shown = groups.map((g) => g.object3D.visible), culled = [];
    this.el.object3D.traverse((o) => { if (o.frustumCulled) { culled.push(o); o.frustumCulled = false; } });
    for (const g of groups) g.object3D.visible = true;
    return () => {
      groups.forEach((g, i) => { g.object3D.visible = shown[i]; });
      for (const o of culled) o.frustumCulled = true;
    };
  },

  flat() {
    const renderer = this.el.renderer, scene = this.el.object3D;
    renderer.compile(scene, this.el.camera);
    scene.traverse((o) => {
      for (const m of [].concat(o.material || [])) {
        for (const key of ['map', 'emissiveMap', 'envMap']) if (m[key]) renderer.initTexture(m[key]);
      }
    });
    const back = this.open();
    const target = new THREE.WebGLRenderTarget(1, 1), was = renderer.getRenderTarget();
    // whatever happens in the draw, the scene is left as it was
    try {
      renderer.setRenderTarget(target);
      renderer.render(scene, this.el.camera);
    } finally {
      renderer.setRenderTarget(was);
      target.dispose();
      back();
    }
  },

  // the headset's first frame: opened before it is drawn, closed right after
  tick() {
    if (!this.due) return;
    this.due = false;
    this.back = this.open();
  },
  tock() {
    if (!this.back) return;
    this.back();
    this.back = null;
  }
});
