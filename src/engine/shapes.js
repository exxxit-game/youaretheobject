// Shapes A-Frame lacks, for objects that should look made rather than cut from blocks.
// rounded-box: a box with rounded edges (bakelite boxes, table tops, chair seats).
// lathe: a shape turned around the vertical axis (lamp shades, bezels), from
// "radius height" pairs listed bottom to top.
function roundedBoxGeometry(w, h, d, r, smooth) {
  const rr = Math.min(r, w / 2, h / 2, d / 2) - 1e-5;
  const shape = new THREE.Shape();
  const eps = 1e-5;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, h - rr * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(w - rr * 2, h - rr * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(w - rr * 2, eps, eps, 0, -Math.PI / 2, true);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(d - rr * 2, 1e-4), bevelEnabled: true, bevelSegments: smooth,
    steps: 1, bevelSize: rr, bevelThickness: rr, curveSegments: smooth
  });
  g.center();
  return g;
}

const MATERIAL = {
  color: { default: '#222' },
  roughness: { default: 0.6 },
  metalness: { default: 0 }
};
const SIDES = { front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide };
const material = (d) => new THREE.MeshStandardMaterial({
  color: d.color, roughness: d.roughness, metalness: d.metalness, side: SIDES[d.side] || THREE.FrontSide
});

function shapeComponent(name, schema, build) {
  AFRAME.registerComponent(name, {
    schema: { ...MATERIAL, ...schema },
    update() {
      this.remove();
      this.mesh = new THREE.Mesh(build(this.data), material(this.data));
      this.el.setObject3D('mesh', this.mesh);
    },
    remove() {
      if (!this.mesh) return;
      this.el.removeObject3D('mesh');
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh = null;
    }
  });
}

shapeComponent('rounded-box', {
  width: { default: 1 }, height: { default: 1 }, depth: { default: 1 }, radius: { default: 0.01 }
}, (d) => roundedBoxGeometry(d.width, d.height, d.depth, d.radius, 3));

// slat: a venetian blind's slat, an arc of a circle across its width with its crown up (+y), its
// length along z, centred on the entity. Lit as one flat face, every normal the crown's: with curved
// normals each closed slat turned from light to dark across its width, and a blind seen close made
// more than five such pairs of stripes, which ITU-R BT.1702-3 counts as a harmful pattern (measured on
// room 101's blinds: 20-50 cd/m2 a slat; docs/research/vr/02-standards.md). Only the two edges turn,
// a third of the way to the arc's own normal, so each overlap still shows as a faint line under the 20 cd/m2 the
// standard counts (a blind of one even colour read as a plain panel). The arc keeps the crown's
// shape, so closed slats still rest on each other and show no gap.
const EDGE_TURN = 0.35;
// corner: the slat's corners rounded to this radius at both ends (a specification asks for it), each
// end drawn in as the quarter circle reaches across the width
function slatGeometry(w, crown, length, n, corner = 0) {
  const R = (w * w) / (8 * crown) + crown / 2, y = (u) => Math.sqrt(R * R - u * u) - (R - crown / 2);
  const end = (u) => { const off = Math.abs(u) - (w / 2 - corner); return length / 2 - (off > 0 ? corner - Math.sqrt(Math.max(0, corner * corner - off * off)) : 0); };
  const normal = (u) => {
    if (Math.abs(u) < w / 2 - 1e-9) return [0, 1, 0];
    const v = new THREE.Vector3(0, 1, 0).lerp(new THREE.Vector3(u / R, (y(u) + R - crown / 2) / R, 0), EDGE_TURN).normalize();
    return [v.x, v.y, v.z];
  };
  const pos = [], nor = [], uv = [];
  for (let i = 0; i < n; i++) {
    const a = -w / 2 + (w * i) / n, b = -w / 2 + (w * (i + 1)) / n;
    const p = [[a, -end(a), i / n, 0], [b, -end(b), (i + 1) / n, 0], [b, end(b), (i + 1) / n, 1], [a, end(a), i / n, 1]];
    // wound so the face's front is its crown side, where the normals point
    for (const k of [0, 2, 1, 0, 3, 2]) { const [u, z, s, t] = p[k]; pos.push(u, y(u), z); nor.push(...normal(u)); uv.push(s, t); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}
shapeComponent('slat', {
  width: { default: 0.0508 }, crown: { default: 0.00635 }, length: { default: 1 }, corner: { default: 0 }, side: { default: 'double' }
}, (d) => slatGeometry(d.width, d.crown, d.length, 6, d.corner));

// plate: a flat plate with its corners rounded in its own plane (a clipboard, a clip's jaw), however
// thin it is; its thickness along z, centred on the entity.
function plateGeometry(w, h, d, c) {
  const x = w / 2, y = h / 2, r = Math.min(c, x, y), s = new THREE.Shape();
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y); s.absarc(x - r, -y + r, r, -Math.PI / 2, 0);
  s.lineTo(x, y - r); s.absarc(x - r, y - r, r, 0, Math.PI / 2);
  s.lineTo(-x + r, y); s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI);
  s.lineTo(-x, -y + r); s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -d / 2);
  return g;
}
shapeComponent('plate', {
  width: { default: 1 }, height: { default: 1 }, depth: { default: 0.01 }, corner: { default: 0.01 }
}, (d) => plateGeometry(d.width, d.height, d.depth, d.corner));

// loop: a flat ring of sheet metal (a clipboard clip's hanging loop): outer and hole radius,
// thickness along z, centred on the entity.
function loopGeometry(outer, hole, d) {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  h.absarc(0, 0, hole, 0, Math.PI * 2, true);
  s.holes.push(h);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 24 });
  g.translate(0, 0, -d / 2);
  return g;
}
shapeComponent('loop', {
  outer: { default: 0.03 }, hole: { default: 0.02 }, depth: { default: 0.003 }
}, (d) => loopGeometry(d.outer, d.hole, d.depth));

shapeComponent('lathe', {
  points: { default: '0.1 0, 0.1 0.1' }, segments: { default: 32 }, side: { default: 'front' }
}, (d) => new THREE.LatheGeometry(
  d.points.split(',').map((p) => { const [r, y] = p.trim().split(/\s+/).map(Number); return new THREE.Vector2(r, y); }),
  d.segments
));

// outline: a part cut out of its side view and given its thickness (a cast lever, a handle), from
// "x y" points round its outline in the entity's x-y plane, its thickness along z, centred on the
// entity, its edges rounded by bevel; three.js grows the outline by bevelSize unless bevelOffset pulls
// it back, so the walls stay on the points
shapeComponent('outline', {
  points: { default: '0 0, 0.1 0, 0 0.1' }, depth: { default: 0.01 }, bevel: { default: 0.002 }
}, (d) => {
  const pts = d.points.split(',').map((p) => p.trim().split(/\s+/).map(Number));
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const b = Math.min(d.bevel, d.depth / 2 - 1e-4);
  const g = new THREE.ExtrudeGeometry(s, { depth: d.depth - 2 * b, bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 2, curveSegments: 8 });
  g.translate(0, 0, -(d.depth - 2 * b) / 2);
  return g;
});
