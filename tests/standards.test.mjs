// The scenes are built to the trade standards in docs/building-standards.md: this test reads
// the scene markup and fails when a door, its hardware, the base or the switch drifts from
// them (an invented size shows up here before the owner sees it in the headset).
import assert from 'node:assert/strict';
import { sceneHTML } from '../src/rooms/01-control/scene.js';
import { corridorHTML, printTurn } from '../src/app/lobby/scene.js';
import { DOORS, PLAN, CORK_Z, CENTRE, LENGTH, WIDTH } from '../src/app/lobby/plan.js';
import { jointOrigin, CEILING } from '../src/engine/tile-math.js';

const html = sceneHTML + corridorHTML;
const near = (a, b, e = 0.0015) => Math.abs(a - b) < e;
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}="([^"]*)"`)); return m && m[1]; };
const prop = (value, name) => { const m = value && value.match(new RegExp(`${name}:\\s*([-\\d.]+)`)); return m && Number(m[1]); };
const pos = (tag) => attr(tag, 'position').split(' ').map(Number);
const tags = (kind) => [...html.matchAll(new RegExp(`<${kind}[^>]*>`, 'g'))].map(m => m[0]);

// Door leaves: 3'0" × 7'0" (0.914 × 2.134 m)
const leaves = [...tags('a-entity')].filter(t => /color: #6a5641/.test(attr(t, 'rounded-box') || ''));
assert.equal(leaves.length, DOORS.length, 'every door of the corridor plan');
for (const t of leaves) {
  const rb = attr(t, 'rounded-box');
  assert.ok(near(prop(rb, 'width'), 0.914) && near(prop(rb, 'height'), 2.134), `door leaf ${rb}`);
}
// Every door set in its wall the same way (src/engine/door.js): leaves at one depth, frames
// through the whole wall
assert.equal(new Set(leaves.map(t => Math.abs(pos(t)[2]))).size, 1, 'door leaves at different depths in their walls');
const jambs = tags('a-box').filter(t => attr(t, 'height') === '2.2042');
assert.ok(jambs.length === DOORS.length * 2 && jambs.every(t => attr(t, 'depth') === '0.22' && (near(pos(t)[2], PLAN.north - PLAN.thick / 2) || near(pos(t)[2], PLAN.south + PLAN.thick / 2))), 'every frame through the wall');
// Round knobs as in 1979, at 1.024 m (strike centreline), 2 3/4 in (70 mm) from the latch edge;
// one on the corridor side of every door, one inside the room that opens
const knobs = tags('a-entity').filter(t => /class="knob"/.test(t));
assert.equal(knobs.length, DOORS.length + 1, 'a knob on each door, and inside room 1');
assert.ok(knobs.every(t => near(pos(t)[1], 1.024) && near(Math.abs(pos(t)[0]), 0.914 - 0.07)), 'knobs at 1.024 m, 70 mm from the latch edge');
assert.ok(!tags('a-cylinder').some(t => attr(t, 'radius') === '0.028'), 'no lever roses left');
// kick plates 10 × 34 in on every door
const kicks = tags('a-box').filter(t => attr(t, 'width') === '0.864');
assert.ok(kicks.length === DOORS.length && kicks.every(t => near(Number(attr(t, 'height')), 0.254)), 'kick plates 254 × 864 mm');
// Door 1: three hinges, top 248 mm below the frame head (2.1532 m), bottom top 264 mm above the floor
const door1 = corridorHTML.slice(corridorHTML.indexOf('id="door1"'));   // the doorway closes the corridor's markup
const hinges = [...door1.matchAll(/<a-cylinder radius="0.007" height="0.114" position="[-\d.]+ ([\d.]+)/g)].map(m => Number(m[1])).sort((a, b) => b - a);
const top = 2.1532 - 0.248 - 0.057, bottom = 0.264 - 0.057;
assert.equal(hinges.length, 3, 'three hinges on door 1');
assert.ok(near(hinges[0], top) && near(hinges[2], bottom) && near(hinges[1], (top + bottom) / 2), `hinge centres ${hinges}`);
// Threshold at most 1/2 in high
const sills = tags('a-box').filter(t => attr(t, 'depth') === '0.127'); // the 5 in wide saddle
assert.ok(sills.length === DOORS.length && sills.every(t => Number(attr(t, 'height')) <= 0.013), 'a threshold at most 13 mm at every door');
// 4 in vinyl base everywhere
const bases = tags('a-box').filter(t => attr(t, 'color') === '#2b2d29');
assert.ok(bases.length >= 10 && bases.every(t => near(Number(attr(t, 'height')), 0.102)), 'base 102 mm high');
// Light switch within reach, 15–48 in (0.381–1.219 m) to centre; set inside one block course
// (docs/building-standards.md; the joints: tests/masonry.test.mjs)
const sw = tags('a-entity').find(t => /color: #d8d2c2/.test(attr(t, 'rounded-box') || ''));
assert.ok(sw && pos(sw)[1] >= 0.381 && pos(sw)[1] <= 1.219, 'switch within reach');
// Notices on the board: US Letter, 8.5 × 11 in (215.9 × 279.4 mm), the paper of a US university
// in 1979 (docs/research/vr/07-corridor-1979.md, C21), not A4
const notes = tags('a-entity').filter(t => /^note/.test(attr(t, 'id') || ''));
assert.ok(notes.length === 2 && notes.every(t => near(prop(attr(t, 'panel'), 'w'), 0.2159, 0.0002) && near(prop(attr(t, 'panel'), 'h'), 0.2794, 0.0002)), 'notices on Letter paper');
// Tackboard: a 44 mm aluminium trim round the cork
const board = tags('a-box').find(t => /metalness: .6/.test(attr(t, 'material') || '') && attr(t, 'class') === 'on-wall');
const cork = tags('a-plane').find(t => /kind: cork/.test(attr(t, 'surface') || ''));
assert.ok(near((Number(attr(board, 'width')) - Number(attr(cork, 'width'))) / 2, 0.044) && near((Number(attr(board, 'height')) - Number(attr(cork, 'height'))) / 2, 0.044), 'tackboard trim 44 mm');
// Troffers: 2 × 4 ft (0.6096 × 1.2192 m)
const troffers = tags('a-box').filter(t => attr(t, 'color') === '#dcdcd5');
assert.ok(troffers.length >= 2 && troffers.every(t => near(Number(attr(t, 'width')), 1.2192) && near(Number(attr(t, 'depth')), 0.6096)), 'troffers 2 × 4 ft');
// ...lying in the ceiling grid's openings, every edge on a tee (S20), a row stepping by the 4 ft
// between main beams (S29): 8 ft apart, inside the Metalux 2G-240A spacing criterion (S28); the
// grid laid from the corridor's centre as the scene draws it
const onJoint = (v, origin) => near((v - origin) / CEILING.tile, Math.round((v - origin) / CEILING.tile), 0.002);
const jx = jointOrigin(CENTRE.x, LENGTH, CEILING.tile), jz = jointOrigin(CENTRE.z, WIDTH, CEILING.tile);
const hallTroffers = [...corridorHTML.matchAll(/<a-box[^>]*>/g)].map(m => m[0]).filter(t => attr(t, 'color') === '#dcdcd5');
for (const t of hallTroffers) {
  const [x, , z] = pos(t);
  assert.ok(onJoint(x - 0.6096, jx) && onJoint(x + 0.6096, jx) && onJoint(z - 0.3048, jz) && onJoint(z + 0.3048, jz), `the troffer at x ${x} does not lie between the grid's tees`);
}
const xs = hallTroffers.map(t => pos(t)[0]).sort((a, b) => a - b);
assert.ok(xs.length >= 2 && xs.slice(1).every((x, i) => near(x - xs[i], 4 * CEILING.tile, 0.002)), `troffers 8 ft apart: ${xs}`);
// Fire extinguisher up to 40 lb: top at most 5 ft (1.524 m), bottom at least 4 in (102 mm)
const extAt = html.indexOf('class="extinguisher"');
const ext = html.slice(extAt, html.indexOf('\n    </a-entity>', extAt));
// each part's box in the world [min, max] per axis: boxes (turned a little about z at most),
// cylinders upright or laid along z or x, flattened spheres, rings facing z, turned parts (lathe:
// "radius height" pairs up from the entity), parts cut from a side view (outline: "x y" points,
// their thickness along z), hoses through their points
const pairs = (v) => v.split(',').map((p) => p.trim().split(/\s+/).map(Number));
const bound = (t) => {
  const kind = t.match(/^<a-([a-z]+)/)[1];
  if (/ lathe="/.test(t) || / outline="/.test(t)) {
    const [x, y, z] = pos(t);
    if (/ lathe="/.test(t)) {
      const pts = pairs(attr(t, 'lathe').match(/points:\s*([^;"]*)/)[1]), r = Math.max(...pts.map((p) => p[0]));
      return [[x - r, x + r], [y + Math.min(...pts.map((p) => p[1])), y + Math.max(...pts.map((p) => p[1]))], [z - r, z + r]];
    }
    const o = attr(t, 'outline'), pts = pairs(o.match(/points:\s*([^;"]*)/)[1]), d = prop(o, 'depth') / 2;
    const box = [[x + Math.min(...pts.map((p) => p[0])), x + Math.max(...pts.map((p) => p[0]))], [y + Math.min(...pts.map((p) => p[1])), y + Math.max(...pts.map((p) => p[1]))], [z - d, z + d]];
    box.outline = pts.map(([px, py]) => [x + px, y + py]);   // a curved part is more than its box
    return box;
  }
  if (/cable="/.test(t)) {
    const r = prop(attr(t, 'cable'), 'radius');
    const pts = attr(t, 'cable').match(/points:\s*([^"]*)/)[1].split(',').map((p) => p.trim().split(/\s+/).map(Number));
    return [0, 1, 2].map((i) => [Math.min(...pts.map((p) => p[i])) - r, Math.max(...pts.map((p) => p[i])) + r]);
  }
  const [x, y, z] = pos(t);
  const rot = (attr(t, 'rotation') || '0 0 0').split(' ').map(Number);
  let half;
  if (kind === 'box') {
    const [w, h, d] = ['width', 'height', 'depth'].map((n) => Number(attr(t, n)));
    const a = rot[2] * Math.PI / 180;
    half = [(w * Math.abs(Math.cos(a)) + h * Math.abs(Math.sin(a))) / 2, (w * Math.abs(Math.sin(a)) + h * Math.abs(Math.cos(a))) / 2, d / 2];
  } else if (kind === 'cylinder') {
    const r = Number(attr(t, 'radius')), h = Number(attr(t, 'height'));
    // a few-sided one (the hex collar) reaches r only at its corners: three.js puts corner k at
    // 2πk/n from +z towards +x, then the entity turns it about y
    const n = Number(attr(t, 'segments-radial')) || 0, corners = [...Array(n)].map((_, k) => 2 * Math.PI * k / n + rot[1] * Math.PI / 180);
    const [rx, rz] = n && n < 12 ? [Math.max(...corners.map((a) => Math.abs(r * Math.sin(a)))), Math.max(...corners.map((a) => Math.abs(r * Math.cos(a))))] : [r, r];
    half = rot[0] === 90 ? [r, r, h / 2] : rot[2] === 90 ? [h / 2, r, r] : [rx, h / 2, rz];
  } else if (kind === 'torus') {
    // A-Frame passes twice radius-tubular to three.js as the tube's radius (vendor/aframe-1.8.0.min.js)
    const tube = 2 * Number(attr(t, 'radius-tubular')), r = Number(attr(t, 'radius')) + tube;
    half = [r, r, tube];
  } else if (kind === 'sphere') {
    const r = Number(attr(t, 'radius')), s = (attr(t, 'scale') || '1 1 1').split(' ').map(Number);
    half = [r * s[0], r * s[1], r * s[2]];
  }
  return [[x - half[0], x + half[0]], [y - half[1], y + half[1]], [z - half[2], z + half[2]]];
};
const tagsOf = [...ext.matchAll(/<a-(box|cylinder|sphere|torus|entity)[^>]*>/g)].map((m) => m[0]).filter((t) => !/^<a-entity/.test(t) || / (cable|lathe|outline)="/.test(t));
const parts = tagsOf.map(bound);
assert.ok(parts.length > 5, 'an extinguisher in the corridor');
const extTop = Math.max(...parts.map((b) => b[1][1])), extBottom = Math.min(...parts.map((b) => b[1][0]));
assert.ok(extTop <= 1.524 && extBottom >= 0.102, `extinguisher from ${extBottom.toFixed(3)} to ${extTop.toFixed(3)} m`);
// nothing hangs in the air: every part touches the parts it is fixed to, all held by the wall hook
// (the first part, on the wall); 1 mm of play for rounding
const touch = (a, b) => [0, 1, 2].every((i) => a[i][0] <= b[i][1] + 0.001 && b[i][0] <= a[i][1] + 0.001);
const held = new Set([0]);
for (let grew = true; grew;) {
  grew = false;
  parts.forEach((b, i) => { if (!held.has(i) && [...held].some((j) => touch(b, parts[j]))) { held.add(i); grew = true; } });
}
assert.equal(held.size, parts.length, `extinguisher parts hanging in the air: ${parts.map((_, i) => i).filter((i) => !held.has(i)).join(', ')}`);
// the wall hanger holds the extinguisher from outside: no bar of it runs through the shell, the
// neck or the valve (their boxes meet, overlapping by 1 mm at most; the hose's box is only its
// path's bounds, so it is left out)
const hanger = tagsOf.map((t, i) => /class="hanger"/.test(t) ? i : -1).filter((i) => i >= 0);
// it hangs by the loop on its back (photo 16): the loop's far bar, the one nearest the wall, lies on
// the hook's bottom, and the hook's lip rises inside the loop, clear of the shell and of the far bar,
// higher than the bar, so the loop cannot slide off it
const lug = tagsOf.map((t, i) => (/class="lug"/.test(t) ? parts[i] : null)).filter(Boolean);
assert.ok(lug.length >= 3, 'the hanging loop is marked class="lug"');
const farBar = lug.reduce((a, b) => (b[0][1] - b[0][0] > a[0][1] - a[0][0] ? b : a));   // the one across the loop
const hook = hanger.map((i) => parts[i]);
const across = (a, b, i) => Math.min(a[i][1], b[i][1]) - Math.max(a[i][0], b[i][0]);
assert.ok(hook.some((h) => Math.abs(h[1][1] - farBar[1][0]) <= 0.001 && across(h, farBar, 0) > 0.01 && across(h, farBar, 2) > 0.003), 'the loop\'s far bar lies on the hook\'s bottom');
const shellBack = Math.max(...parts.filter((b) => b[1][1] - b[1][0] > 0.3).map((b) => b[2][1]));
const lip = hook.reduce((a, b) => (b[2][1] < a[2][1] ? b : a));   // the part farthest from the wall
assert.ok(lip[2][0] > shellBack + 0.001 && lip[2][1] < farBar[2][0] - 0.001 && lip[1][1] > farBar[1][1] + 0.003, `the hook's lip rises inside the loop (z ${lip[2][0].toFixed(4)}–${lip[2][1].toFixed(4)} between the shell ${shellBack.toFixed(4)} and the far bar ${farBar[2][0].toFixed(4)})`);
const overlap = (a, b) => [0, 1, 2].map((i) => Math.min(a[i][1], b[i][1]) - Math.max(a[i][0], b[i][0]));
// a part cut from its side view (an outline) is tested by its outline's height over the other box's
// width, not by its whole box: a curved handle's box takes in the air under its curve
const outlineSpan = (poly, x0, x1) => {
  const ys = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length], [a, b] = p[0] <= q[0] ? [p, q] : [q, p];
    const lo = Math.max(a[0], x0), hi = Math.min(b[0], x1);
    if (lo > hi) return;
    const at = (xx) => (b[0] === a[0] ? a[1] : a[1] + (b[1] - a[1]) * (xx - a[0]) / (b[0] - a[0]));
    ys.push(at(lo), at(hi));
  });
  return ys.length ? [Math.min(...ys), Math.max(...ys)] : null;
};
const pierce = (a, b) => {
  if (!overlap(a, b).every((o) => o > 0.001)) return false;
  const [c, d] = a.outline ? [a, b] : b.outline ? [b, a] : [null, null];
  if (!c) return true;
  const span = outlineSpan(c.outline, Math.max(c[0][0], d[0][0]), Math.min(c[0][1], d[0][1]));
  return !!span && Math.min(span[1], d[1][1]) - Math.max(span[0], d[1][0]) > 0.001;
};
assert.ok(hanger.length >= 3, 'the wall hanger is marked class="hanger"');
// its bars are bent from one strap: each meets another face to face (more than 1 mm across in two
// directions), never along an edge only, which shows as a step instead of a bend
for (const h of hanger) {
  assert.ok(hanger.some((g) => g !== h && touch(parts[h], parts[g]) && overlap(parts[h], parts[g]).filter((o) => o > 0.001).length >= 2), `the hanger's part ${h} meets the rest only along an edge`);
}
for (const h of hanger) {
  tagsOf.forEach((t, i) => {
    if (hanger.includes(i) || /cable="/.test(t)) return;
    assert.ok(!pierce(parts[h], parts[i]), `the hanger's part ${h} runs through the extinguisher's part ${i}`);
  });
}
// The board as framed cork boards are made: the cork lies inside the aluminium lip, below its face
// and off the body under it; the sheets lie on the cork (drawn over it as decals), each pin's head
// on its sheet, the peg out of the cork
const B = PLAN.board;
const corkZ = pos(cork)[2];
assert.equal(corkZ, CORK_Z, 'the cork where the plan puts it');
const alu = tags('a-box').filter((t) => /#b9bcbf/.test(attr(t, 'material') || ''));
const body = alu.find((t) => near(Number(attr(t, 'width')), B.w) && near(Number(attr(t, 'height')), B.h) && near(Number(attr(t, 'depth')), B.body));
const lips = alu.filter((t) => near(Number(attr(t, 'depth')), B.lip));
assert.ok(body && lips.length === 4, 'the board: a body and a lip of four bars');
const bodyFace = pos(body)[2] + B.body / 2;
assert.ok(near(pos(body)[2] - B.body / 2, PLAN.north), 'the body of the board on the wall');
for (const l of lips) {
  assert.ok(near(pos(l)[2] - B.lip / 2, bodyFace), 'the lip on the face of the body');
  assert.ok(corkZ < pos(l)[2] + B.lip / 2, 'the cork below the face of the lip');
}
// the cork 1/4 in thick on the body (S21), which also keeps its face 5 mm or more off the body's
// face behind it (closer faces flicker in a headset)
assert.ok(near(corkZ - bodyFace, 0.00635, 0.0005) && corkZ - bodyFace >= 0.005, `the cork ${((corkZ - bodyFace) * 1000).toFixed(1)} mm thick`);
const [cw, ch] = [Number(attr(cork, "width")), Number(attr(cork, "height"))];
assert.ok(near(cw, B.w - 2 * B.border) && near(ch, B.h - 2 * B.border), 'the cork fills the lip');
const sheets = tags('a-entity').filter((t) => /id="note/.test(t));
assert.ok(sheets.length === 2, 'two sheets pinned on the board');
for (const s of sheets) {
  assert.ok(pos(s)[2] > corkZ && pos(s)[2] - corkZ <= 0.001, `${attr(s, 'id')}: ${((pos(s)[2] - corkZ) * 1000).toFixed(1)} mm off the cork`);
  assert.ok(/decal: true/.test(attr(s, 'panel')), `${attr(s, 'id')}: drawn over the cork as a decal`);
}
// the pins: spheres over the board, in front of the cork (within 5 cm: a window to find them, not a measure)
const pins = tags('a-sphere').filter((t) => near(pos(t)[0], B.x, B.w / 2) && near(pos(t)[1], B.y, B.h / 2) && pos(t)[2] > corkZ && pos(t)[2] < corkZ + 0.05);
assert.equal(pins.length, sheets.length, 'a pin in each sheet');
for (const p of pins) assert.ok(near(pos(p)[2] - Number(attr(p, 'radius')), pos(sheets[0])[2], 0.0005), 'the head of a pin on its sheet');
const peg = tags('a-cylinder').find((t) => near(pos(t)[1], B.hook, 1e-6) && near(pos(t)[0], B.x, 1e-6));
assert.ok(peg && near(pos(peg)[2] - Number(attr(peg, 'height')) / 2, corkZ, 0.0005), 'the peg comes out of the cork');
// the end walls' picture: one end upside down, and the two swap ends with each visit (the owner's detail)
assert.deepEqual([0, 1, 2, 3].map((v) => [printTurn(0, v), printTurn(1, v)]), [[0, 180], [180, 0], [0, 180], [180, 0]], 'the prints swap ends each visit');
assert.deepEqual([printTurn(0, NaN), printTurn(1, -1)], [0, 0], 'a broken visit count keeps one end upside down');
console.log(`standards tests: ok (${leaves.length} doors, ${bases.length} base runs, extinguisher ${extBottom.toFixed(2)}–${extTop.toFixed(2)} m)`);
