import { jointOrigin, bondOrigin, courseShifted, CEILING, GRID } from './tile-math.js';

// Surfaces drawn once on a canvas (no image files to load): painted block wall,
// linoleum tiles, acoustic ceiling tiles, cork, a lamp's lens, wood. Each kind is drawn once
// and shared.
// Tiles and blocks follow ONE grid per space (a room, the corridor), laid out from that
// space's centre in world metres by the tile trade's rule (tile-math.js), so a wall cut
// into pieces, the band below the rail and the next wall all line up, and the edges of
// the space get equal cuts, never less than half a tile.
// Cork, lens and wood (no grid) only repeat.
// <a-plane surface="kind: linoleum; space: 0 0 3.2 3.2"></a-plane>  <a-entity surface="kind: wood; repeat: 1 1">
const SIZE = 512;
// the ceiling grid's face (tile-math.js) in a 24 in tile's pixels: a stroke of that width on the
// tile's edge shows half on this tile and half on its neighbour, the full face where they meet
const GRID_FACE = CEILING.face / CEILING.tile * SIZE;
const cache = {};

// The same speckle every load: rooms must look identical for every player.
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

function speckle(ctx, rand, count, size, colors) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    ctx.fillRect(rand() * SIZE, rand() * SIZE, size, size);
  }
}

const KINDS = {
  // painted concrete block: 4 × 8 blocks of 40 × 20 cm over 1.6 m, joints under the paint
  block(ctx, rand) {
    ctx.fillStyle = '#e6e4da'; // light paint; the entity's tint gives the colour
    ctx.fillRect(0, 0, SIZE, SIZE);
    speckle(ctx, rand, 9000, 2, ['rgba(255,255,255,.035)', 'rgba(0,0,0,.05)']);
    ctx.strokeStyle = 'rgba(0,0,0,.075)';
    ctx.lineWidth = 2;
    const bw = SIZE / 4, bh = SIZE / 8;
    for (let row = 0; row < 8; row++) {
      const y = row * bh;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(SIZE, y); ctx.stroke();
      // rows run down the canvas, which is laid upside up on the wall: the last row is the
      // course at the floor (course 0 of each 1.6 m)
      const shift = courseShifted(7 - row) ? bw / 2 : 0;
      for (let x = shift; x < SIZE + 1; x += bw) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bh); ctx.stroke();
      }
    }
  },
  // vinyl composition tile: 2 × 2 tiles of 12 in in two muted tones, fine speckle
  linoleum(ctx, rand) {
    const half = SIZE / 2;
    ['#6b6257', '#615950', '#615950', '#6b6257'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect((i % 2) * half, Math.floor(i / 2) * half, half, half);
    });
    speckle(ctx, rand, 14000, 2, ['rgba(255,255,255,.06)', 'rgba(0,0,0,.08)', 'rgba(140,120,90,.1)']);
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, SIZE, SIZE);
    ctx.beginPath(); ctx.moveTo(half, 0); ctx.lineTo(half, SIZE); ctx.moveTo(0, half); ctx.lineTo(SIZE, half); ctx.stroke();
  },
  // acoustic ceiling tile 24 in with pinholes, framed by the metal grid: a 15/16 in face
  // (docs/building-standards.md), half of it drawn on each of the two tiles that meet there
  ceiling(ctx, rand) {
    ctx.fillStyle = '#cfcbc0';
    ctx.fillRect(0, 0, SIZE, SIZE);
    speckle(ctx, rand, 2600, 3, ['rgba(60,55,45,.35)', 'rgba(60,55,45,.2)']);
    ctx.strokeStyle = '#9d9a92';
    ctx.lineWidth = GRID_FACE;
    ctx.strokeRect(0, 0, SIZE, SIZE);
  },
  // cork tackboard: tan granules of several shades (docs/building-standards.md, S21)
  cork(ctx, rand) {
    ctx.fillStyle = '#a5815a';
    ctx.fillRect(0, 0, SIZE, SIZE);
    speckle(ctx, rand, 26000, 3, ['rgba(90,60,30,.22)', 'rgba(200,165,115,.2)', 'rgba(60,40,20,.15)', 'rgba(170,130,85,.25)']);
  },
  // prismatic acrylic troffer lens (S20) over two lamps, which show as soft bands along it; the
  // prism grid is faint on purpose: a fine high-contrast pattern shimmers in a headset
  lens(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, SIZE);
    for (const [at, c] of [[0, '#c9ced3'], [0.33, '#ffffff'], [0.5, '#e4e8ec'], [0.67, '#ffffff'], [1, '#c9ced3']]) g.addColorStop(at, c);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = 'rgba(0,0,0,.035)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= SIZE; i += 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, SIZE); ctx.moveTo(0, i); ctx.lineTo(SIZE, i); ctx.stroke();
    }
  },
  // light wood with long grain (table top)
  wood(ctx, rand) {
    ctx.fillStyle = '#8a6d4f';
    ctx.fillRect(0, 0, SIZE, SIZE);
    for (let i = 0; i < 220; i++) {
      const y = rand() * SIZE;
      ctx.strokeStyle = `rgba(${rand() < 0.5 ? '70,45,25' : '190,150,105'},${0.05 + rand() * 0.12})`;
      ctx.lineWidth = 1 + rand() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= SIZE; x += 32) ctx.lineTo(x, y + Math.sin(x / 90 + i) * 3);
      ctx.stroke();
    }
  }
};

// UVs from positions in the space's own metres: across the surface (x, or z for walls facing x)
// and up (y for walls, z for floor and ceiling); block courses start at the floor. The space's
// metres are the world's, or a room's own wherever the corridor stands it (frame: the room's group,
// data-frame, src/app/lab.js), so its grid is laid from its own centre. The geometry is cloned
// first: A-Frame shares one geometry between planes of the same size.
// space: { x, y: centre (x, z), z, w: length along x and along z } of the room it belongs to.
function worldUV(mesh, { size, tile, bond }, space, frame) {
  const origin = bond ? bondOrigin : jointOrigin;
  const ox = origin(space.x, space.z, tile), oz = origin(space.y, space.w, tile);
  mesh.updateWorldMatrix(true, false);
  const toSpace = new THREE.Matrix4();
  if (frame) { frame.updateWorldMatrix(true, false); toSpace.copy(frame.matrixWorld).invert(); }
  toSpace.multiply(mesh.matrixWorld);
  mesh.geometry = mesh.geometry.clone();
  const pos = mesh.geometry.attributes.position, uv = mesh.geometry.attributes.uv;
  const n = new THREE.Vector3(0, 0, 1).transformDirection(toSpace);
  const flat = Math.abs(n.y) > 0.5, facesZ = Math.abs(n.z) > 0.5;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i).applyMatrix4(toSpace);
    const across = flat || facesZ ? p.x - ox : p.z - oz;
    const up = flat ? p.z - oz : p.y;
    uv.setXY(i, across / size, up / size);
  }
  uv.needsUpdate = true;
}

function texture(kind) {
  if (cache[kind]) return cache[kind];
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  KINDS[kind](c.getContext('2d'), seeded(kind.length * 7919));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  cache[kind] = t;
  return t;
}

function repeated(kind, { x, y }) {
  const key = `${kind} ${x} ${y}`;
  if (cache[key]) return cache[key];
  const t = texture(kind).clone();
  t.repeat.set(x, y);
  t.needsUpdate = true;
  cache[key] = t;
  return t;
}

AFRAME.registerComponent('surface', {
  schema: {
    kind: { default: 'block', oneOf: Object.keys(KINDS) },
    repeat: { type: 'vec2', default: { x: 1, y: 1 } }, // kinds without a grid; tiled kinds use the room grid
    tint: { default: '#ffffff' }, // multiplies the drawn colours (darker paint band, etc.)
    glow: { default: false },     // a lit surface (a lamp's lens): the drawing also shapes its glow
    // the space whose tiles this surface shares: centre x, centre z, length along x, along z;
    // required for a gridded kind, and no default: one room's space as the engine's default
    // would lay every other space's joints from that room's centre without a word
    space: { type: 'vec4', default: { x: 0, y: 0, z: 0, w: 0 } }
  },
  init() { this.apply = this.apply.bind(this); this.el.addEventListener('object3dset', this.apply); },
  update() { this.apply(); },
  remove() { this.el.removeEventListener('object3dset', this.apply); },
  apply() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    const grid = GRID[this.data.kind];
    if (grid && !(this.data.space.z > 0 && this.data.space.w > 0)) throw new Error(`surface ${this.data.kind}: no space given`);
    const sceneEl = this.el.sceneEl;
    // world positions are final only once the scene has loaded (merge-static runs after this)
    if (grid && !sceneEl.hasLoaded) { sceneEl.addEventListener('loaded', () => this.apply(), { once: true }); return; }
    if (grid) worldUV(mesh, grid, this.data.space, this.el.closest('[data-frame]')?.object3D);
    // A gridded kind takes its place from world UVs, so every surface of the kind shares one
    // texture, and merge-static can merge the pieces of a wall into one mesh (one draw call;
    // Meta: batch objects that share a material). A kind without a grid is repeated: one copy
    // per repeat, shared the same way (the corridor's lamp lenses merge into one).
    const map = grid ? texture(this.data.kind) : repeated(this.data.kind, this.data.repeat);
    mesh.material.map = map;
    if (this.data.glow) mesh.material.emissiveMap = map;
    mesh.material.color.set(this.data.tint);
    mesh.material.needsUpdate = true;
  }
});
