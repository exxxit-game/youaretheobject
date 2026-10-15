// A picture frame as framers make one: a length of moulding with one cross-section (its profile)
// cut at 45 degrees and joined round the picture, so every bead, step and hollow runs unbroken
// round the corners. The profile is a list of "u h" points from the outside of the frame in to the
// picture: u metres in from the outer edge, h metres off the wall; a rounded part is given as
// several points. Where two neighbouring pieces of the profile meet at a slight angle the light
// runs smoothly over them; at a sharp step it breaks, as on a real moulding. Gilding is burnished
// bright on some parts and left matte on others: matte gives the stretch of the profile (u from, to)
// laid matte. The frame lies on the entity's plane, its back on it, facing +z, centred on the entity.
// <a-entity moulding="width: 0.4; height: 0.48; profile: 0 0, 0 0.03, 0.04 0.03; matte: 0.01 0.03">
// neighbours turning less than this share their light: three.js's own crease angle, 60 degrees
// (BufferGeometryUtils, toCreasedNormals)
const SMOOTH = Math.cos(THREE.MathUtils.degToRad(60));

AFRAME.registerComponent('moulding', {
  schema: {
    width: { default: 0.4 },
    height: { default: 0.5 },
    profile: { default: '' },
    color: { default: '#ffe396' },
    metalness: { default: 1 },
    roughness: { default: 0.35 },
    matte: { default: '' },
    matteRoughness: { default: 0.7 }
  },
  update() {
    this.remove();
    const pts = this.data.profile.split(',').map((p) => p.trim().split(/\s+/).map(Number));
    if (pts.length < 2) return;
    const { width: W, height: H } = this.data;
    // the light's direction on each piece of the profile, in its own plane: (towards the picture, off the wall)
    const seg = pts.slice(1).map((p, i) => {
      const du = p[0] - pts[i][0], dh = p[1] - pts[i][1], l = Math.hypot(du, dh) || 1;
      return [-dh / l, du / l];
    });
    const shared = (i, j) => {
      const a = seg[i], b = seg[j];
      if (!b || a[0] * b[0] + a[1] * b[1] < SMOOTH) return a;
      const s = [a[0] + b[0], a[1] + b[1]], l = Math.hypot(s[0], s[1]);
      return [s[0] / l, s[1] / l];
    };
    // the four lengths: where the outer edge lies, which way is in, which way runs along, half its length
    const sides = [
      { edge: [0, H / 2], inward: [0, -1], along: [1, 0], half: W / 2 },
      { edge: [0, -H / 2], inward: [0, 1], along: [1, 0], half: W / 2 },
      { edge: [-W / 2, 0], inward: [1, 0], along: [0, 1], half: H / 2 },
      { edge: [W / 2, 0], inward: [-1, 0], along: [0, 1], half: H / 2 }
    ];
    // the burnished parts and the matte ones, each drawn with its own finish
    const [m0, m1] = this.data.matte ? this.data.matte.split(/\s+/).map(Number) : [Infinity, -Infinity];
    const isMatte = (i) => { const u = (pts[i][0] + pts[i + 1][0]) / 2; return u >= m0 && u <= m1; };
    const out = [{ pos: [], nor: [] }, { pos: [], nor: [] }];
    for (const s of sides) {
      // a point of the profile at one mitred end of this length (end: -1 or 1)
      const at = ([u, h], end) => {
        const run = end * (s.half - u);
        return [s.edge[0] + s.inward[0] * u + s.along[0] * run, s.edge[1] + s.inward[1] * u + s.along[1] * run, h];
      };
      const normal = ([nu, nh]) => [s.inward[0] * nu, s.inward[1] * nu, nh];
      for (let i = 0; i < seg.length; i++) {
        const n0 = normal(shared(i, i - 1)), n1 = normal(shared(i, i + 1));
        const A = at(pts[i], -1), B = at(pts[i], 1), C = at(pts[i + 1], 1), D = at(pts[i + 1], -1);
        // wound so the face looks the way its light says
        const ab = A.map((v, k) => B[k] - v), ac = A.map((v, k) => C[k] - v), want = normal(seg[i]);
        const g = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
        const tris = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] >= 0
          ? [[A, n0], [B, n0], [C, n1], [A, n0], [C, n1], [D, n1]]
          : [[A, n0], [C, n1], [B, n0], [A, n0], [D, n1], [C, n1]];
        const into = out[isMatte(i) ? 1 : 0];
        for (const [p, n] of tris) { into.pos.push(...p); into.nor.push(...n); }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([...out[0].pos, ...out[1].pos], 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute([...out[0].nor, ...out[1].nor], 3));
    const bright = out[0].pos.length / 3, dull = out[1].pos.length / 3;
    geo.addGroup(0, bright, 0);
    geo.addGroup(bright, dull, 1);
    const { color, metalness, roughness, matteRoughness } = this.data;
    this.mesh = new THREE.Mesh(geo, [
      new THREE.MeshStandardMaterial({ color, metalness, roughness }),
      new THREE.MeshStandardMaterial({ color, metalness, roughness: matteRoughness })
    ]);
    this.el.setObject3D('mesh', this.mesh);
  },
  remove() {
    if (!this.mesh) return;
    this.el.removeObject3D('mesh');
    this.mesh.geometry.dispose();
    for (const m of this.mesh.material) m.dispose();
    this.mesh = null;
  }
});
