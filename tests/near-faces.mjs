// Two faces that face the same way less than 5 mm apart and overlap flicker in a headset, the
// farther the worse (docs/vr-checklist.md): a print or a thin plate is drawn over what it lies on
// as a decal (a depth offset: panel decal, the decal component), never a few millimetres in front
// of it. This scans the drawn scene for such pairs and excuses one only when its depth offsets put
// the front face over the back one, when no eye can be in front of it, or when a solid of another
// mesh stands on that very spot. Flat faces only: a curved label on a curved shell has facets that
// are not parallel to the shell's, so curved prints go by the decal rule alone.
// Runs in the page (the smoke test passes it to page.evaluate; the browser pane can paste it):
// self-contained, it uses only the page's THREE and document. eyes: where an eye can be, boxes
// [[x0, y0, z0], [x1, y1, z1]] inside the place's walls, floor and ceiling (a headset walks
// anywhere in them; the cameras that draw reflections stand inside them too).
export function nearFaces({ eyes: boxes, minGap = 0.005 } = {}) {
  if (!boxes || !boxes.length) throw new Error('nearFaces: where an eye can be is not given');
  const scene = document.querySelector('a-scene').object3D;
  scene.updateMatrixWorld(true);
  const shown = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  const name = (o) => {
    for (let p = o; p; p = p.parent) if (p.el && (p.el.id || p.el.classList.length)) return p.el.id || [...p.el.classList].join('.');
    return o.type;
  };
  // every flat face of every drawn mesh, grouped by mesh and plane (its normal to 0.001 and its
  // distance from the origin to 0.1 mm), each face kept as a triangle in the plane's own axes
  const groups = new Map();
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3(), n0 = new THREE.Vector3();
  const u = new THREE.Vector3(), v = new THREE.Vector3();
  scene.traverse((o) => {
    if (!o.isMesh || !shown(o)) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    if (mats.every((m) => !m.visible || m.opacity === 0)) return;
    // the depth offset (factor, units): a decal pulled forward is negative, a surface under prints
    // pushed back positive; it settles a pair only when the front face is pulled more than the back
    const m0 = mats[0];
    const off = m0.polygonOffset ? [m0.polygonOffsetFactor, m0.polygonOffsetUnits] : [0, 0];
    // a face that writes no depth (a soft shadow) cannot flicker with another such face
    const writes = mats.some((m) => m.depthWrite !== false);
    const solid = mats.every((m) => !m.transparent && m.opacity === 1);
    // the way a face is seen: a back-side material shows its triangles from behind, a two-sided one
    // from both sides (each way counted)
    const side = mats.every((m) => m.side === THREE.FrontSide) ? THREE.FrontSide : mats.every((m) => m.side === THREE.BackSide) ? THREE.BackSide : THREE.DoubleSide;
    const ways = side === THREE.FrontSide ? [1] : side === THREE.BackSide ? [-1] : [1, -1];
    // what the face looks like: two faces of one look cannot be seen to flicker into each other
    const look = mats.map((m) => [m.type, m.color && m.color.getHexString(), m.map && m.map.uuid, m.emissive && m.emissive.getHexString(), m.emissiveIntensity].join('/')).join(';');
    const pos = o.geometry.attributes.position, idx = o.geometry.index;
    const count = idx ? idx.count : pos.count;
    const at = (k) => (idx ? idx.getX(k) : k);
    for (let k = 0; k + 2 < count; k += 3) {
      a.fromBufferAttribute(pos, at(k)).applyMatrix4(o.matrixWorld);
      b.fromBufferAttribute(pos, at(k + 1)).applyMatrix4(o.matrixWorld);
      c.fromBufferAttribute(pos, at(k + 2)).applyMatrix4(o.matrixWorld);
      n0.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a));
      if (n0.length() / 2 < 1e-6) continue;
      n0.normalize();
      for (const way of ways) {
        n.copy(n0).multiplyScalar(way);
        const key = [n.x, n.y, n.z].map((x) => Math.round(x * 1000)).join(',');
        // two axes in the plane, the same for every face with this normal
        u.set(1, 0, 0); if (Math.abs(n.x) > 0.9) u.set(0, 1, 0);
        u.sub(n.clone().multiplyScalar(u.dot(n))).normalize();
        v.crossVectors(n, u);
        const d = n.dot(a);
        const id = `${o.uuid}|${key}|${Math.round(d * 1e4)}`;
        let g = groups.get(id);
        if (!g) { g = { key, n: n.toArray(), d, off, writes, solid, side, look, name: name(o), mesh: o.uuid, tris: [] }; groups.set(id, g); }
        g.tris.push([a, b, c].map((p) => [p.dot(u), p.dot(v)]));
        if (!g.at) g.at = a.toArray().map((x) => x.toFixed(2)).join(' ');
      }
    }
  });
  // two triangles in a plane overlap: no edge's normal separates them (the separating axis
  // theorem) with less than 0.1 mm in common, so faces that only touch along an edge do not count
  const overlap = (t, s) => {
    for (const tri of [t, s]) {
      for (let i = 0; i < 3; i++) {
        const [p, q] = [tri[i], tri[(i + 1) % 3]];
        const ax = [q[1] - p[1], p[0] - q[0]], len = Math.hypot(ax[0], ax[1]);
        const span = (r) => r.map((w) => (w[0] * ax[0] + w[1] * ax[1]) / len);
        const [x, y] = [span(t), span(s)];
        if (Math.min(Math.max(...x), Math.max(...y)) - Math.max(Math.min(...x), Math.min(...y)) <= 0.0001) return false;
      }
    }
    return true;
  };
  // the part of a convex polygon inside triangle s (Sutherland-Hodgman), and a polygon's area
  const cross = (o, p, q) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
  const clip = (poly, s) => {
    const turn = Math.sign(cross(s[0], s[1], s[2]));
    for (let i = 0; i < 3 && poly.length; i++) {
      const [e0, e1] = [s[i], s[(i + 1) % 3]], side = (p) => turn * cross(e0, e1, p);
      const next = [];
      poly.forEach((p, k) => {
        const q = poly[(k + 1) % poly.length], [sp, sq] = [side(p), side(q)];
        if (sp >= 0) next.push(p);
        if ((sp >= 0) !== (sq >= 0)) { const f = sp / (sp - sq); next.push([p[0] + f * (q[0] - p[0]), p[1] + f * (q[1] - p[1])]); }
      });
      poly = next;
    }
    return poly;
  };
  const area = (poly) => Math.abs(poly.reduce((sum, p, k) => sum + cross([0, 0], p, poly[(k + 1) % poly.length]), 0)) / 2;
  const inTri = (p, s) => { const t = Math.sign(cross(s[0], s[1], s[2])); return [0, 1, 2].every((i) => t * cross(s[i], s[(i + 1) % 3], p) >= -1e-10); };
  // a spot lies wholly under one mesh's faces in a plane: as much area under them as it has (the
  // pieces of a merged mesh may overlap and count twice), and every one of a grid of its points
  // under one of them, so no gap between two pieces passes
  const covered = (spot, tris) => {
    if (spot.length < 3) return true;
    if (area(spot) - tris.reduce((sum, s) => sum + area(clip(spot, s)), 0) > Math.max(1e-9, 1e-3 * area(spot))) return false;
    const xs = spot.map((p) => p[0]), ys = spot.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const turn = Math.sign(cross(spot[0], spot[1], spot[2]));
    const inSpot = (p) => spot.every((a, k) => turn * cross(a, spot[(k + 1) % spot.length], p) > 1e-10);
    for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
      const p = [x0 + (x1 - x0) * i / 6, y0 + (y1 - y0) * j / 6];
      if (inSpot(p) && !tris.some((s) => inTri(p, s))) return false;
    }
    return true;
  };
  const byKey = new Map(), byMesh = new Map();
  for (const g of groups.values()) {
    (byKey.get(g.key) || byKey.set(g.key, []).get(g.key)).push(g);
    (byMesh.get(g.mesh) || byMesh.set(g.mesh, []).get(g.mesh)).push(g);
  }
  // A spot is never seen when a solid of another mesh stands on it: one of its faces lies on the
  // spot facing it (a box's end against a jamb), and its far side covers the spot too, so the solid
  // stands where an eye would have to be. Only the overlap of the two faces is tested, never the
  // rest of them; only one-sided faces (a two-sided one is also seen from behind), and only opaque
  // solids (glass or a lone plane hides nothing).
  const facing = (key) => key.split(',').map((x) => String(-Number(x))).join(',');
  // (a facing plane's second axis runs the other way: n × u flips with n)
  const flip = (tris) => tris.map((t) => t.map(([x, y]) => [x, -y]));
  const underSolid = (spot, g) => [...byMesh.entries()].some(([mesh, own]) => mesh !== g.mesh &&
    own.some((h) => h.solid && h.key === facing(g.key) && Math.abs(h.d + g.d) < 1e-4 && covered(spot, flip(h.tris))) &&
    own.some((h) => h.solid && h.key === g.key && h.d > g.d + 1e-4 && covered(spot, h.tris)));
  // A face whose plane has every corner of every eye box behind it is never seen (the back of a
  // strap against its wall, a foot on the floor), nor anything behind it: the boxes are convex.
  const eyes = boxes.flatMap(([a, b]) => [a[0], b[0]].flatMap((x) => [a[1], b[1]].flatMap((y) => [a[2], b[2]].map((z) => [x, y, z]))));
  const unseen = (g) => eyes.every((e) => g.n[0] * e[0] + g.n[1] * e[1] + g.n[2] * e[2] < g.d - 1e-6);
  const hidden = (spot, front) => front.side !== THREE.DoubleSide && underSolid(spot, front);
  // the front face q drawn over the back face p by depth offsets: pulled forward more, never less
  // (two faces in one plane: whichever is pulled over the other)
  const pulled = (p, q) => q.off[0] <= p.off[0] && q.off[1] <= p.off[1] && (q.off[0] < p.off[0] || q.off[1] < p.off[1]);
  const ordered = (p, q) => pulled(p, q) || (Math.abs(q.d - p.d) < 1e-6 && pulled(q, p));
  // pairs of groups facing one way, from different meshes of different looks, closer than minGap
  const found = new Set();
  for (const list of byKey.values()) {
    list.sort((p, q) => p.d - q.d);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length && list[j].d - list[i].d < minGap - 1e-6; j++) {
        const [p, q] = [list[i], list[j]];
        if (p.mesh === q.mesh || p.look === q.look || ordered(p, q) || (!p.writes && !q.writes) || (p.side !== THREE.DoubleSide && unseen(p))) continue;
        // q lies in front (its plane is the farther along the normal); in one plane either may
        const fronts = Math.abs(q.d - p.d) < 1e-6 ? [q, p] : [q];
        if (p.tris.some((t) => q.tris.some((s) => overlap(t, s) && !(p.side !== THREE.DoubleSide && fronts.some((front) => hidden(clip(t, s), front)))))) {
          found.add(`${p.name} and ${q.name} near ${q.at}, facing ${q.key}: ${((q.d - p.d) * 1000).toFixed(1)} mm apart`);
        }
      }
    }
  }
  return [...found];
}
