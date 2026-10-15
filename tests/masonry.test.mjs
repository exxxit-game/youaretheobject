// Block walls are laid out on their module (NCMA TEK 05-12, Modular Layout of Concrete Masonry):
// door openings start and end on it, so no block beside a door is cut into a sliver. Our blocks
// are 0.4 × 0.2 m in running bond, the module 0.2 m. The same holds for the flat things fixed to a
// wall (class "on-wall": the board, the sign box, the switch) that no standard places: each edge
// lies on a joint, or at least MIN_GAP from every joint, because a joint a few millimetres from an
// edge reads as a cut stub (MIN_GAP is our choice). Door signs (class "door-sign": on the doors,
// and room 01's inside its door) hang where the sign standard puts them (src/app/brand.js), and the
// joints fall where they fall, as on a real block wall.
import assert from 'node:assert/strict';
import { sceneHTML } from '../src/rooms/01-control/scene.js';
import { corridorHTML } from '../src/app/lobby/scene.js';
import { bondOrigin, courseShifted } from '../src/engine/tile-math.js';
import { PLAN, DOORS, CENTRE, LENGTH, WIDTH } from '../src/app/lobby/plan.js';
import { SIGN, CAP } from '../src/app/brand.js';
import { LEAF } from '../src/engine/door.js';

const BLOCK = 0.4, COURSE = 0.2, MODULE = 0.2, MIN_GAP = 0.04, EPS = 0.002;
// the walls things sit on, by the z of their face: the corridor's long walls (from its plan) and
// room 01's back wall (the room's side of the corridor's north wall), each with the joint origin
// its surface uses (surface.js, space of the corridor / the room), and how many door frames stand
// in it; a thing fixed to a wall stands at most REACH off its face, and SKIN keeps the two faces
// of the north wall apart (both our choice: they only sort things to their wall; the check below
// holds every back within 2 mm of its face)
const ROOM_FACE = PLAN.north - PLAN.thick, NORTH_FRAME = PLAN.north - PLAN.thick / 2, REACH = 0.15, SKIN = 0.01;
const WALLS = [
  { name: 'corridor north wall', z: [PLAN.north - SKIN, PLAN.north + REACH], x: [PLAN.from, PLAN.to], origin: bondOrigin(CENTRE.x, LENGTH, BLOCK), doors: DOORS.filter(d => d.wall === 'north').length },
  { name: 'room back wall', z: [ROOM_FACE - REACH, PLAN.north - SKIN], x: [-1.6, 1.6], origin: bondOrigin(0, 3.2, BLOCK), doors: 1 },
  { name: 'corridor south wall', z: [PLAN.south - REACH, PLAN.south + PLAN.thick + REACH], x: [PLAN.from, PLAN.to], origin: bondOrigin(CENTRE.x, LENGTH, BLOCK), doors: DOORS.filter(d => d.wall === 'south').length }
];
// the corridor's end walls, for anything fixed to them: they run along z, their joints laid out
// across the corridor's depth
const END = { name: 'corridor end wall', origin: bondOrigin(CENTRE.z, WIDTH, BLOCK) };
const wallAt = (z) => WALLS.find(w => z >= w.z[0] && z < w.z[1]);
const offGrid = (v, origin, step) => { const r = (((v - origin) % step) + step) % step; return Math.min(r, step - r); };
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`)); return m && m[1]; };
const prop = (value, name) => { const m = value && value.match(new RegExp(`${name}:\\s*([-\\d.]+)`)); return m && Number(m[1]); };
// room 01 stands as built behind door 101 (tests/plan.test.mjs), so its metres are the corridor's here
const html = sceneHTML + corridorHTML;

// door openings: a jamb of the 2 in frame stands 14.3 mm inside its opening's edge
const jambs = [...html.matchAll(/<a-box position="([-\d.]+) 1\.1021 ([\d.]+)" width="0\.051" height="2\.2042"/g)]
  .map(m => ({ x: Number(m[1]), z: Number(m[2]) }));
assert.equal(jambs.length, DOORS.length * 2, 'every door of the plan, two jambs each');
// the floor course is laid whole from the origin, the next one shifted (as surface.js draws)
assert.ok(!courseShifted(0) && courseShifted(1) && !courseShifted(2), 'running bond from a whole floor course');
for (const wall of WALLS) {
  // a frame goes through the whole wall (NORTH_FRAME on the north): it counts for each face it stands in
  const xs = jambs.filter(j => (wallAt(j.z) === wall || (Math.abs(j.z - NORTH_FRAME) < EPS && wall.z[1] <= PLAN.north + REACH)) && j.x > wall.x[0] && j.x < wall.x[1]).map(j => j.x).sort((a, b) => a - b);
  assert.equal(xs.length, wall.doors * 2, `${wall.name}: its door frames`);
  for (let i = 0; i < xs.length; i += 2) {
    for (const edge of [xs[i] - 0.0143, xs[i + 1] + 0.0143]) {
      assert.ok(offGrid(edge, wall.origin, MODULE) < EPS, `${wall.name}: door opening edge at ${edge.toFixed(4)} is off the block module`);
    }
  }
}

// the door frames' heads: 51 mm deep across the top of each opening, 11.2 mm past its edges
const heads = [];
for (let i = 0; i + 1 < jambs.length; i++) {
  const [a, b] = [jambs[i], jambs[i + 1]];
  if (a.z === b.z && Math.abs(b.x - a.x - (1.0 - 2 * 0.0143)) < EPS) heads.push({ from: a.x - 0.0255, to: b.x + 0.0255, top: 2.2042 });
}
assert.equal(heads.length, DOORS.length, 'a head over every door');

// flat things on a wall: no joint closer than MIN_GAP to an edge, unless the edge is on it
const items = [...html.matchAll(/<a-[a-z]+[^>]*class="[^"]*\bon-wall\b[^"]*"[^>]*>/g)].map(m => m[0]);
assert.ok(items.length >= 3, `${items.length} things on walls`);
for (const tag of items.filter(t => !/\bdoor-sign\b/.test(attr(t, 'class')))) {
  const [x, y, z] = attr(tag, 'position').split(' ').map(Number);
  const panel = attr(tag, 'panel'), box = attr(tag, 'rounded-box'), frame = attr(tag, 'moulding');
  const w = panel ? prop(panel, 'w') : box ? prop(box, 'width') : frame ? prop(frame, 'width') : Number(attr(tag, 'width'));
  const h = panel ? prop(panel, 'h') : box ? prop(box, 'height') : frame ? prop(frame, 'height') : Number(attr(tag, 'height'));
  const wall = x <= PLAN.from + 0.05 || x >= PLAN.to - 0.05 ? END : wallAt(z);
  assert.ok(wall, `no wall at z ${z}`);
  const across = wall === END ? z : x;
  const name = `${(attr(tag, 'id') || tag.slice(0, 40))} on the ${wall.name}`;
  const clear = (d) => d < EPS || d >= MIN_GAP - 1e-9;
  // a thing standing on a door frame's head, flush with its ends (the light box over door 1): the
  // head hides the joint under its foot, and its ends are the frame's own, 11 mm past the opening
  const head = heads.find((hd) => Math.abs(y - h / 2 - hd.top) < EPS && across - w / 2 >= hd.from - EPS && across + w / 2 <= hd.to + EPS);
  const flush = (edge) => head && (Math.abs(edge - head.from) < EPS || Math.abs(edge - head.to) < EPS);
  for (const edge of [y - h / 2, y + h / 2]) {
    if (head && Math.abs(edge - head.top) < EPS) continue;
    assert.ok(clear(offGrid(edge, 0, COURSE)), `${name}: a bed joint ${(offGrid(edge, 0, COURSE) * 1000).toFixed(0)} mm from its edge at ${edge.toFixed(3)} m`);
  }
  // the vertical joints of each course it covers, courses counted up from the floor
  for (let k = Math.floor((y - h / 2) / COURSE + EPS); k < Math.ceil((y + h / 2) / COURSE - EPS); k++) {
    const origin = wall.origin + (courseShifted(k) ? BLOCK / 2 : 0);
    for (const edge of [across - w / 2, across + w / 2]) {
      if (flush(edge)) continue;
      const d = offGrid(edge, origin, BLOCK);
      assert.ok(clear(d), `${name}: a joint ${(d * 1000).toFixed(0)} mm from its edge at ${edge.toFixed(3)} in course ${k}`);
    }
  }
}

// nothing on a wall floats off it: its back rests on the wall face, within 2 mm: a box's back, or
// a sign's, whose printed face stands on a body as deep as the face is off the wall (panel thick:
// faces closer than 5 mm flicker in a headset); the faces are the corridor's long walls (z 1.8 and
// 3.6, from the plan), the inside of room 01's back wall (ROOM_FACE, z 1.6) and the end walls (x,
// for a thing turned to face along the corridor: its depth lies along x)
for (const tag of items) {
  const [x, , z] = attr(tag, 'position').split(' ').map(Number);
  const box = attr(tag, 'rounded-box'), panel = attr(tag, 'panel'), frame = attr(tag, 'moulding');
  const end = x <= PLAN.from + 0.05 ? [PLAN.from, 1] : x >= PLAN.to - 0.05 ? [PLAN.to, -1] : null;
  const faces = [[PLAN.north, 1], [PLAN.south, -1], [ROOM_FACE, -1]];   // [face z, the way off it]
  const [face, off] = end || faces.reduce((a, b) => (Math.abs(z - b[0]) < Math.abs(z - a[0]) ? b : a));
  const at = end ? x : z;
  // a moulding's back lies on its entity's plane (src/engine/moulding.js)
  const back = frame ? at : panel ? at - off * (prop(panel, 'thick') || 0) : at - off * (box ? prop(box, 'depth') : Number(attr(tag, 'depth'))) / 2;
  const gap = (back - face) * off;
  const name = attr(tag, 'id') || tag.slice(0, 50);
  assert.ok(gap >= -1e-9 && gap <= 0.002 + 1e-9, `${name}: its back ${(gap * 1000).toFixed(1)} mm off its wall`);
}

// every door sign is the standard's 9 × 9 in, centred 60 in above the floor (NIU installation,
// ADA 1991 4.30.6), its text between 48 and 60 in (docs/building-standards.md, S1 703.4.1); a
// sign on a door rides on its leaf, whose group stands on the floor, so its y is its height
const signs = [...html.matchAll(/<a-entity[^>]*class="[^"]*\bdoor-sign\b[^"]*"[^>]*>/g)].map(m => m[0]);
assert.equal(signs.length, DOORS.length + 1, 'a sign at every door and inside room 01');
assert.ok(SIGN.w === 0.2286 && SIGN.y === 1.524 && SIGN.fromFrame === 0.1016, 'the sign family in inches: 9 in square, 60 in up, 4 in from the frame');
// the room number as large as the rules allow, 2 in (ADA 2010 703.2.5), measured on its capitals
// (CAP, the font's own): never more, and not a pixel short of it
const capM = (size) => size * CAP / SIGN.px;
assert.ok(capM(SIGN.number) <= 0.0508 && capM(SIGN.number + 1) > 0.0508, `a room number's capitals 2 in high, never more (${(capM(SIGN.number) * 1000).toFixed(1)} mm)`);
assert.ok(capM(SIGN.letters) <= 0.01905 && capM(SIGN.letters + 1) > 0.01905, 'the stairs word in 3/4 in capitals, never more');
for (const tag of signs) {
  const y = Number(attr(tag, 'position').split(' ')[1]);
  const name = attr(tag, 'id') || attr(tag, 'data-number');
  assert.ok(y === SIGN.y && y >= 1.22 && y <= 1.525, `${name} centre at ${y} m`);
  assert.ok(prop(attr(tag, 'panel'), 'w') === SIGN.w && prop(attr(tag, 'panel'), 'h') === SIGN.w, `${name}: not the 9 in sign`);
  // a sign on a leaf: its face 5 mm or more off the leaf's corridor face (closer faces flicker), on
  // a body that reaches back to the leaf, facing away from it
  if (!/\bon-wall\b/.test(attr(tag, 'class'))) {
    const z = Number(attr(tag, 'position').split(' ')[2]);
    assert.ok(Math.abs(z) - LEAF.t >= 0.005 - 1e-9, `${name}: ${((Math.abs(z) - LEAF.t) * 1000).toFixed(1)} mm off the leaf`);
    assert.ok(Math.abs(prop(attr(tag, 'panel'), 'thick') - (Math.abs(z) - LEAF.t)) < 1e-6, `${name}: its body does not reach the leaf`);
    assert.equal(z < 0, /0 180 0/.test(attr(tag, 'rotation') || ''), `${name}: faces into its door`);
  }
}
console.log(`masonry tests: ok (${jambs.length / 2} doors, ${items.length} things on walls)`);
