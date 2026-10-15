// Tile layout follows the trade rule (Ceramic Tile Education Foundation; UFGS 09 65 00):
// centre and balance the field, equal cuts on opposite sides, no edge tile under half a tile.
import assert from 'node:assert/strict';
import { jointOrigin, endCut, bondOrigin, CEILING as GRID, GRID as GRIDDED } from '../src/engine/tile-math.js';
import { CENTRE, LENGTH, WIDTH } from '../src/app/lobby/plan.js';
import { sceneHTML } from '../src/rooms/01-control/scene.js';
import { corridorHTML } from '../src/app/lobby/scene.js';

const near = (a, b) => Math.abs(a - b) < 1e-9;
const FLOOR = 0.3048, CEILING = 0.6096; // 12 in tiles, 24 in grid (docs/building-standards.md)
const cases = [
  // centre, length, tile: every surface of the room and the corridor
  [0, 3.2, FLOOR], [0, 3.2, CEILING],                  // room 01
  [CENTRE.x, LENGTH, FLOOR], [CENTRE.x, LENGTH, CEILING], // corridor, along
  [CENTRE.z, WIDTH, FLOOR], [CENTRE.z, WIDTH, CEILING],   // corridor, across
  [1.0, 2.7, 0.3], [-4, 5.0, 0.6]
];
for (const [centre, length, tile] of cases) {
  const o = jointOrigin(centre, length, tile);
  const lo = endCut(centre - length / 2, o, tile, +1);
  const hi = endCut(centre + length / 2, o, tile, -1);
  assert.ok(near(lo, hi), `unequal cuts ${lo} / ${hi} for ${centre}, ${length}, ${tile}`);
  assert.ok(lo >= tile / 2 - 1e-9, `cut under half a tile (${lo}) for ${centre}, ${length}, ${tile}`);
}

// Blocks in running bond: both courses keep every end piece at half a block or more.
// Possible only when a wall is a whole number of half blocks, which is why masons lay
// walls out in half units: every wall of the room and the corridor is.
const walls = [[0, 3.2], [CENTRE.x, LENGTH], [CENTRE.z, WIDTH], [-0.3, 1.2], [1, 2.6]];
for (const [, length] of walls) assert.ok(near(Math.round(length / 0.2) * 0.2, length), `${length} m is not whole half blocks`);
for (const [centre, length] of walls) {
  const b = 0.4, o = bondOrigin(centre, length, b);
  for (const shift of [0, b / 2]) {
    const lo = endCut(centre - length / 2, o + shift, b, +1), hi = endCut(centre + length / 2, o + shift, b, -1);
    assert.ok(lo >= b / 2 - 1e-9 && hi >= b / 2 - 1e-9, `block piece under half (${lo}, ${hi}) on a ${length} m wall`);
  }
}
// the room's walls keep whole blocks at the floor course
assert.ok(near(((bondOrigin(0, 3.2, 0.4) % 0.4) + 0.4) % 0.4, 0));
// the ceiling grid as the standard has it: 24 in tiles, a 15/16 in face (it was drawn at half)
assert.ok(Math.abs(GRID.tile - CEILING) < 1e-9 && Math.abs(GRID.face - 0.0238125) < 1e-9, 'ceiling grid 24 in, face 15/16 in');
assert.ok(near(GRIDDED.linoleum.tile, FLOOR) && near(GRIDDED.ceiling.tile, CEILING) && near(GRIDDED.block.tile, 0.4), 'the drawn grids are the standard sizes');
// every gridded surface names the space it is laid from: the engine has no default space (one
// room's centre as a default would lay a new room's joints from it without a word)
const gridded = [...(sceneHTML + corridorHTML).matchAll(/surface="([^"]*)"/g)].map((m) => m[1])
  .filter((v) => Object.hasOwn(GRIDDED, (v.match(/kind:\s*(\w+)/) || [])[1]));
assert.ok(gridded.length > 10, `${gridded.length} gridded surfaces found`);
for (const v of gridded) assert.match(v, /space:\s*[-\d.]+\s+[-\d.]+\s+[\d.]*[1-9][\d.]*\s+[\d.]*[1-9][\d.]*/, `a gridded surface without its space: ${v}`);
// and the space of its own room: room 01's booth round the origin, the corridor's from its plan
const spaceOf = (html) => [...html.matchAll(/surface="([^"]*)"/g)].map((m) => m[1]).filter((v) => gridded.includes(v)).map((v) => v.match(/space:\s*([^;]+)/)[1].trim());
assert.ok(spaceOf(sceneHTML).every((s) => s === '0 0 3.2 3.2'), 'a surface of room 01 laid from another space');
assert.ok(spaceOf(corridorHTML).every((s) => s === `${CENTRE.x} ${CENTRE.z} ${LENGTH} ${WIDTH}`), 'a surface of the corridor laid from another space');
console.log(`tiles tests: ok (${cases.length} surfaces, ${walls.length} walls, ${gridded.length} gridded surfaces with their space)`);
