// A controller's model drawn as one mesh. A-Frame's Touch model is six parts (body, two buttons,
// squeeze, stick, trigger), and A-Frame gives each its own copy of the material to light it when
// pressed: six draw calls a controller, each eye. Meta's own IWSDK draws the same model as one batch,
// buttons still moving (github.com/facebook/immersive-web-sdk, packages/xr-input/src/visual:
// AnimatedController ends with "new FlexBatchedMesh(this.model)"). Here the parts are merged into one
// skinned mesh, each part its bone: A-Frame keeps moving and recolouring the hidden parts as before, the
// bones follow them, and the colours go into the vertices. Built again whenever the model loads.
// The bones hold each part's place relative to the controller, as IWSDK's batch does, and the
// controller's own place stays in the mesh's matrix: with multiview, three.js uploads the bones' texture
// a frame late (A-Frame, docs/components/renderer.md: "all bone animations will lag by one frame"), so
// only a pressed button lags, never the controller behind its ray.
// <a-entity laser-controls="hand: right" controller-batch>
const KEEP = ['position', 'normal', 'uv'];

AFRAME.registerComponent('controller-batch', {
  init() {
    this.build = this.build.bind(this);
    this.el.addEventListener('controllermodelready', this.build);
  },
  remove() {
    this.el.removeEventListener('controllermodelready', this.build);
    this.clear();
  },
  clear() {
    if (!this.mesh) return;
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    // the bones' texture three.js made for this skeleton; the model reloads on every reconnect
    this.mesh.skeleton.dispose();
    for (const part of this.parts) part.visible = true;
    this.mesh = null;
  },
  build() {
    this.clear();
    const model = this.el.getObject3D('mesh');
    if (!model) return;
    const parts = [];
    model.traverse((o) => { if (o.isMesh && !o.isSkinnedMesh && o.geometry.attributes.uv) parts.push(o); });
    if (parts.length < 2) return;
    model.updateMatrixWorld(true);
    // a part's place in the controller's own space
    const toModel = new THREE.Matrix4();
    const inModel = (part, out) => out.multiplyMatrices(toModel.copy(model.matrixWorld).invert(), part.matrixWorld);
    const geos = parts.map((part, i) => {
      const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
      for (const name of Object.keys(g.attributes)) if (!KEEP.includes(name)) g.deleteAttribute(name);
      g.clearGroups();
      g.applyMatrix4(inModel(part, new THREE.Matrix4()));
      const n = g.attributes.position.count;
      g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(n * 4).map((v, k) => (k % 4 ? 0 : i)), 4));
      g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(new Float32Array(n * 4).map((v, k) => (k % 4 ? 0 : 1)), 4));
      g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
      return g;
    });
    const merged = THREE.BufferGeometryUtils.mergeGeometries(geos);
    geos.forEach((g) => g.dispose());
    if (!merged) return;
    // each part's run of vertices, to recolour it alone
    let start = 0;
    this.ranges = geos.map((g) => { const r = [start, start + g.attributes.position.count]; start = r[1]; return r; });
    const material = parts[0].material.clone();
    material.color.setRGB(1, 1, 1);
    material.vertexColors = true;
    const mesh = new THREE.SkinnedMesh(merged, material);
    // the controller is always at hand: never culled by the bounds of its pose when it was built
    mesh.frustumCulled = false;
    model.add(mesh);
    // bones never in the scene: each holds its part's place in the controller, set just before the
    // skeleton is read for drawing, when every part's world matrix is this frame's
    const bones = parts.map(() => new THREE.Bone());
    bones.forEach((bone, i) => inModel(parts[i], bone.matrixWorld));
    const skeleton = new THREE.Skeleton(bones, bones.map((b) => new THREE.Matrix4().copy(b.matrixWorld).invert()));
    const update = skeleton.update.bind(skeleton);
    skeleton.update = () => { bones.forEach((bone, i) => inModel(parts[i], bone.matrixWorld)); update(); };
    mesh.bindMode = THREE.DetachedBindMode;
    mesh.bind(skeleton, new THREE.Matrix4());
    this.mesh = mesh;
    this.parts = parts;
    this.colors = parts.map(() => new THREE.Color(NaN, NaN, NaN));
    for (const part of parts) part.visible = false;
    this.tick();
  },
  // the parts' colours as A-Frame sets them (pressed, touched, at rest), into their vertices
  tick() {
    if (!this.mesh) return;
    const attr = this.mesh.geometry.attributes.color;
    let changed = false;
    this.parts.forEach((part, i) => {
      const c = part.material.color;
      if (this.colors[i].equals(c)) return;
      this.colors[i].copy(c);
      for (let v = this.ranges[i][0]; v < this.ranges[i][1]; v++) attr.setXYZ(v, c.r, c.g, c.b);
      changed = true;
    });
    if (changed) attr.needsUpdate = true;
  }
});
