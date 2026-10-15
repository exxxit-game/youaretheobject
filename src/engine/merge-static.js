// Static parts of a room (walls, rails, furniture): each part is one draw call, and a
// hundred of them cost frame rate in a headset. After the scene loads, the opaque meshes
// under this entity that share a look are merged into one mesh per look. Parts that
// change (a lamp that lights up, a button, something shown later) carry data-dynamic
// and are left alone; transparent parts (text panels, shadows, glass) are skipped.
// A part's colour is not part of its look: it goes into the merged mesh's vertices, which
// the material multiplies in where it would multiply its own colour, so parts that differ
// only in colour become one draw call and look exactly as before (Meta's first fix for draw
// calls: "merge small meshes into larger chunks", batching "objects that use the same material
// into a single call", docs/research/engine-and-tools.md; gltf-transform's palette does the same
// for glTF, docs/research/revision-4-graphics.md).
const KEEP = ['position', 'normal', 'uv'];

// a decal (a depth offset, decal.js) merges only with decals, so it keeps lying over its surface
function look(m) {
  return [m.type, m.roughness, m.metalness, m.opacity, m.flatShading,
    m.emissive && m.emissive.getHexString(), m.emissiveIntensity, m.map && m.map.uuid, m.emissiveMap && m.emissiveMap.uuid,
    m.side, m.envMap && m.envMap.uuid, m.envMapIntensity, m.polygonOffset && `${m.polygonOffsetFactor},${m.polygonOffsetUnits}`].join('|');
}

// a part the laser answers keeps its own mesh: it is what the rays hit and what lights up under them
function dynamic(o, root) {
  for (let p = o; p && p !== root; p = p.parent) {
    if (p.el && (p.el.hasAttribute('data-dynamic') || p.el.classList.contains('clickable'))) return true;
  }
  return false;
}

// Same attributes, no index, no groups: what mergeGeometries needs from every part. The
// part's colour is written into every vertex as the material holds it (three.js keeps a
// material's colour and reads vertex colours in the same linear working space).
function prepared(geometry, matrix, color) {
  let g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) if (!KEEP.includes(name)) g.deleteAttribute(name);
  if (!g.attributes.uv) return null;
  g.clearGroups();
  const n = g.attributes.position.count, rgb = new Float32Array(n * 3);
  // written component by component: an array a vertex made garbage at load on the weakest headset
  for (let i = 0; i < n; i++) { rgb[i * 3] = color.r; rgb[i * 3 + 1] = color.g; rgb[i * 3 + 2] = color.b; }
  g.setAttribute('color', new THREE.BufferAttribute(rgb, 3));
  return g.applyMatrix4(matrix);
}

AFRAME.registerComponent('merge-static', {
  init() {
    this.merged = [];
    // removed before its scene or parts have loaded, it merges nothing: what merge() made after remove()
    // would never be freed
    const later = () => setTimeout(() => { if (!this.removed) this.merge(); }, 0);
    // a scene's parts merge once it has loaded; an entity added to a running scene (the
    // clipboard), once its own parts have
    const ready = this.el.sceneEl.hasLoaded ? this.el : this.el.sceneEl;
    if (ready.hasLoaded) later(); else ready.addEventListener('loaded', later, { once: true });
  },
  merge() {
    const root = this.el.object3D;
    root.updateMatrixWorld(true);
    const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const groups = new Map();
    root.traverse((o) => {
      if (!o.isMesh || !o.geometry || Array.isArray(o.material) || o.material.transparent || o.material.vertexColors || !o.material.color) return;
      if (!o.visible || dynamic(o, root)) return;
      const key = look(o.material);
      if (!groups.has(key)) groups.set(key, { material: o.material, parts: [] });
      groups.get(key).parts.push(o);
    });
    for (const { material, parts } of groups.values()) {
      if (parts.length < 2) continue;
      const geos = parts.map((o) => prepared(o.geometry, new THREE.Matrix4().multiplyMatrices(toRoot, o.matrixWorld), o.material.color));
      if (geos.some((g) => !g)) continue;
      const merged = THREE.BufferGeometryUtils.mergeGeometries(geos);
      geos.forEach((g) => g.dispose());
      if (!merged) continue;
      // its own copy: the parts' colours are in the vertices, so the material's is white
      const shared = material.clone();
      shared.color.setRGB(1, 1, 1);
      shared.vertexColors = true;
      const mesh = new THREE.Mesh(merged, shared);
      root.add(mesh);
      this.merged.push({ mesh, parts });
      parts.forEach((o) => { o.visible = false; });
    }
  },
  // a merged group taken away (a room, the clipboard) frees what the merge made and shows its parts
  // again (three.js r184 manual, how-to-dispose-of-objects)
  remove() {
    this.removed = true;
    for (const { mesh, parts } of this.merged) {
      mesh.removeFromParent();
      mesh.geometry.dispose();
      mesh.material.dispose();
      parts.forEach((o) => { o.visible = true; });
    }
    this.merged = [];
  }
});
