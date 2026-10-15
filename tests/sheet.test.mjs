// The clipboard sheet appears where research puts comfortable reading: 1 m from the
// eyes, a little below them, straight ahead, facing the player (sources in docs/decisions.md).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { frontPose, readingPose, letterDeg, letterFrom, MIN_LETTER, READ_DIST, DROP_DEG, GLIDE, glidePath, curvePoint, easeInOut, tripPose, boardCorners, within, EDGE_CLEAR, BOARD_REACH, CLIP,
  PAPER_BG, INK, INK_SOFT, BUTTON, LIGHT_LIMIT, DARK_LIMIT } from '../src/engine/ui/sheet-math.js';
import { EYE } from '../src/engine/recenter-math.js';
import { corridorHTML, WALLS } from '../src/app/lobby/scene.js';
import { BOUNDS, PLAN, SHEET_HOME, CORK_Z, SPOT, HOOK_READ } from '../src/app/lobby/plan.js';

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const poses = [[[0, 1.2, 0.35], 0], [[0.6, 1.65, 2.9], 0], [[0.5, 1.1, 0], Math.PI / 2], [[1, 1.7, -1], -2.4]];
for (const [head, yaw] of poses) {
  const p = frontPose(head, yaw);
  assert.ok(near(dist(p.pos, head), READ_DIST), 'centre 1 m from the eyes');
  const down = Math.asin((head[1] - p.pos[1]) / READ_DIST) * 180 / Math.PI;
  assert.ok(near(down, DROP_DEG), 'a little below the eyes');
  // straight ahead in the player's yaw (three.js: yaw 0 looks along -Z)
  const ahead = [-Math.sin(yaw), -Math.cos(yaw)];
  const flat = [p.pos[0] - head[0], p.pos[2] - head[2]];
  assert.ok(near(flat[0] * ahead[1] - flat[1] * ahead[0], 0), 'not to the side');
  assert.ok(flat[0] * ahead[0] + flat[1] * ahead[1] > 0, 'in front');
  // three.js rotation (order YXZ): the sheet's face (+Z) must point back at the eyes
  const n = [Math.sin(p.yaw) * Math.cos(p.pitch), -Math.sin(p.pitch), Math.cos(p.yaw) * Math.cos(p.pitch)];
  const toEyes = head.map((h, i) => (h - p.pos[i]) / READ_DIST);
  assert.ok(near(n[0], toEyes[0]) && near(n[1], toEyes[1]) && near(n[2], toEyes[2]), 'faces the eyes');
}
assert.ok(near(letterDeg(MIN_LETTER, READ_DIST), 1.375, 0.01), 'the smallest letter, 24 mm at 1 m, is Google\'s 1.375 degrees');

// The clipboard's trip from its hook to the reading spot and back (docs/mistakes.md):
// slow enough, eased, swinging out from the wall and down, never nearer than
// GLIDE.nearest to the eyes, and the same arc back.
const home = SHEET_HOME.pos, away = SHEET_HOME.away, wall = { pos: home, away };
let trips = 0;
// from the arrival spot, across the corridor, and pressed against the board (people walk
// up to a thing they are told to take); the corridor keeps the eyes at z 2.1 or more
for (const head of [[0.7, 1.6, 3.05], [-1.0, 1.6, 2.9], [2.5, 1.2, 3.3], [-3.0, 1.75, 2.2], [-1.0, 1.6, 2.1], [-0.6, 1.3, 2.3]]) {
  const look = [home[0] - head[0], home[2] - head[2]];
  const p = readingPose(head, Math.atan2(-look[0], -look[1]), wall);   // the player looks at the hook
  assert.ok(near(dist(p.pos, head), READ_DIST), 'read 1 m from the eyes');
  assert.ok(p.pos[2] - home[2] >= 0.15 - 1e-9, `the reading spot is behind the wall (z ${p.pos[2].toFixed(2)})`);
  for (const [a, b] of [[home, p.pos], [p.pos, home]]) {
    const { ctrl, ms } = glidePath(a, b, away, head);
    assert.ok(ms >= 1000 && ms <= GLIDE.maxMs && GLIDE.minMs >= 1000, `a trip takes ${ms} ms (at least 1 s)`);
    assert.ok(ctrl[2] >= Math.min(a[2], b[2]), 'the arc swings out from the wall, not into it');
    assert.ok(ctrl[1] < (a[1] + b[1]) / 2, 'the arc dips below the straight line');
    let nearest = Infinity;
    for (let i = 0; i <= 100; i++) nearest = Math.min(nearest, dist(curvePoint(a, ctrl, b, i / 100), head));
    const allowed = Math.min(0.5, dist(a, head), dist(b, head));   // never nearer the eyes than 0.5 m
    assert.ok(nearest >= allowed - 0.01, `the sheet comes within ${nearest.toFixed(2)} m of the eyes (allowed ${allowed.toFixed(2)})`);
    trips++;
  }
}
// Anywhere the player can stand in the corridor, facing anywhere, the sheet is read inside its
// walls, and on its trip from the hook and back no corner of the board, tilted and turned as it
// goes, comes nearer a wall than EDGE_CLEAR (docs/mistakes.md), except the wall it hangs on: on
// its hook its back lies on the cork, nearer that wall, and it comes no nearer than that. Facing
// door 1 from the arrival spot it stays straight ahead.
const SPACE = corridorHTML.match(/space: ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)/).slice(1).map(Number);
assert.deepEqual([(WALLS.minX + WALLS.maxX) / 2, (WALLS.minZ + WALLS.maxZ) / 2, WALLS.maxX - WALLS.minX, WALLS.maxZ - WALLS.minZ].map(v => +v.toFixed(3)), SPACE, 'WALLS is the corridor drawn by scene.js');
let spots = 0, legs = 0;
const hook = { pos: home, pitch: 0, yaw: 0 };
const clear = (p) => boardCorners(p, BOARD_REACH).every((c) => within(WALLS, c, EDGE_CLEAR - 1e-9));
const hookBack = Math.min(...boardCorners(hook, BOARD_REACH).map((c) => c[2]));
assert.ok(hookBack >= CORK_Z && hookBack - CORK_Z <= 0.001, `on its hook the clipboard's back lies on the cork (${((hookBack - CORK_Z) * 1000).toFixed(1)} mm off it)`);
const onTrip = (p) => boardCorners(p, BOARD_REACH).every((c) => c[0] >= WALLS.minX + EDGE_CLEAR - 1e-9 && c[0] <= WALLS.maxX - EDGE_CLEAR + 1e-9
  && c[2] >= Math.min(WALLS.minZ + EDGE_CLEAR, hookBack) - 1e-9 && c[2] <= WALLS.maxZ - EDGE_CLEAR + 1e-9);
for (let x = BOUNDS.minX; x <= BOUNDS.maxX + 1e-9; x += 0.29) {
  for (const z of [BOUNDS.minZ, (BOUNDS.minZ + BOUNDS.maxZ) / 2, BOUNDS.maxZ]) {
    for (let deg = 0; deg < 360; deg += 30) {
      const head = [x, 1.6, z], p = readingPose(head, deg * Math.PI / 180, wall, WALLS, BOARD_REACH);
      const where = `head (${x.toFixed(2)}, ${z}) facing ${deg}°`;
      assert.ok(clear(p), `${where}: a corner of the read sheet is in a wall`);
      for (const [a, b] of [[hook, p], [p, hook]]) {
        const room = { from: { pitch: a.pitch, yaw: a.yaw }, to: { pitch: b.pitch, yaw: b.yaw }, board: BOARD_REACH, inside: WALLS };
        const { ctrl } = glidePath(a.pos, b.pos, away, head, room);
        for (let i = 0; i <= 40; i++) {
          assert.ok(onTrip(tripPose(a, ctrl, b, easeInOut(i / 40))), `${where}: on the trip a corner of the sheet goes into a wall`);
        }
        legs++;
      }
      spots++;
    }
  }
}
assert.equal(readingPose([0.7, 1.6, 3.05], 0, wall, WALLS, BOARD_REACH).yaw, 0, 'facing door 1: straight ahead');

// on its hook the clipboard hangs by its ring: the peg touches the inside top of the ring, and
// the ring stands where the peg is (along its length)
{
  const ringTop = SHEET_HOME.pos[1] + CLIP.ring.y + CLIP.ring.r - CLIP.ring.tube;
  assert.ok(near(ringTop, PLAN.board.hook + PLAN.board.peg, 1e-4), `the ring rests on the peg (${ringTop.toFixed(4)} vs ${(PLAN.board.hook + PLAN.board.peg).toFixed(4)})`);
  const ringZ = SHEET_HOME.pos[2] + CLIP.ring.z;
  assert.ok(ringZ > CORK_Z && ringZ < CORK_Z + 0.045, 'the ring is on the peg, not past its end');
}
assert.ok(easeInOut(0) === 0 && easeInOut(1) === 1 && near(easeInOut(0.5), 0.5), 'eases from start to end');
assert.ok(easeInOut(0.1) < 0.1 && easeInOut(0.9) > 0.9, 'slow start and slow stop');

// A page on its hook is read from where the player arrives: a line meant for that distance is set
// at the smallest letter's angle from there (24 mm a metre), in whole millimetres up; read at 1 m a
// role keeps its own size
assert.ok(near(HOOK_READ, dist([SPOT.x, EYE, SPOT.z], SHEET_HOME.pos), 1e-4), `the hook is read from the arrival spot's eyes (${HOOK_READ} m)`);
assert.ok(HOOK_READ > 1.5, 'the arrival spot is well away from the hook');
for (const m of [MIN_LETTER, 0.028, 0.044]) {
  assert.equal(letterFrom(m, READ_DIST), m, `a ${m * 1000} mm role read at 1 m keeps its size`);
  assert.ok(letterDeg(letterFrom(m, HOOK_READ), HOOK_READ) >= letterDeg(MIN_LETTER, READ_DIST), `a ${m * 1000} mm line read from the hook is at least 1.375°`);
}
assert.equal(letterFrom(0.028, HOOK_READ), 0.047, 'the hook pages\' letters as shown to the owner: 47 mm');

// Colours of print and controls inside Meta's limits ("Color": light no brighter than #DADADA, dark
// no darker than #1A1A1A, for text, backgrounds and all UI), read strictly: every channel inside both;
// text at least 4.5:1 on its ground (Meta and WCAG 2.1 AA). Every colour written in the engine's UI
// code is inside the limits too, so a new one cannot slip past them.
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex) => rgb(hex).map((v) => v / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const inLimits = (hex) => rgb(hex).every((v, i) => v >= rgb(DARK_LIMIT)[i] && v <= rgb(LIGHT_LIMIT)[i]);
assert.ok(LIGHT_LIMIT === '#dadada' && DARK_LIMIT === '#1a1a1a', 'Meta\'s limits as on its page');
for (const c of [PAPER_BG, INK, INK_SOFT, BUTTON.bg, BUTTON.hover, BUTTON.text]) assert.ok(inLimits(c), `${c} is outside Meta's limits`);
for (const [fg, bg] of [[INK, PAPER_BG], [INK_SOFT, PAPER_BG], [BUTTON.text, BUTTON.bg], [BUTTON.text, BUTTON.hover]]) {
  assert.ok(contrast(fg, bg) >= 4.5, `${fg} on ${bg}: ${contrast(fg, bg).toFixed(1)}:1, under 4.5:1`);
}
const uiDir = new URL('../src/engine/ui/', import.meta.url);
for (const f of fs.readdirSync(uiDir).filter((n) => n.endsWith('.js'))) {
  for (const [c] of fs.readFileSync(new URL(f, uiDir), 'utf8').matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    assert.ok(inLimits(c.toLowerCase()), `src/engine/ui/${f}: ${c} is outside Meta's limits (#1a1a1a to #dadada each channel)`);
  }
}
console.log(`sheet tests: ok (${poses.length} poses, ${trips} trips, ${spots} corridor spots, ${legs} trips there and back clear of the walls)`);
