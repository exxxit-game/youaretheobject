// A room's door plaque shows its number only: the experiment's name would tell the player what
// is studied before they do it (demand characteristics, Orne 1962; docs/mistakes.md). The name
// comes in the reveal, after the room.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writePlaque } from '../src/app/brand.js';
import { DOORS, ROOM1_NUMBER } from '../src/app/lobby/plan.js';
import { corridorHTML } from '../src/app/lobby/scene.js';
import { sceneHTML } from '../src/rooms/01-control/scene.js';

let written = null;
writePlaque({ write: (blocks) => { written = blocks; } }, { number: '101', name: 'X', year: '1979' });
assert.deepEqual(written.map(b => b.t), ['101'], 'the plaque writes the number and nothing else');

// no room hands an experiment name or year to its plaque
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rooms = path.join(ROOT, 'src/rooms');
for (const dir of fs.readdirSync(rooms)) {
  for (const f of fs.readdirSync(path.join(rooms, dir)).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(rooms, dir, f), 'utf8');
    for (const call of src.match(/writePlaque\([^;]*\)|plaque:\s*\{[^}]*\}/g) || []) {
      assert.ok(!/name|year/.test(call), `${dir}/${f}: ${call}`);
    }
    assert.ok(!/plaque:\s*T\.|\.\.\.T\.plaque|#plaque'\)\.components\.panel\.write/.test(src), `${dir}/${f}: a plaque written past writePlaque`);
  }
}
// every room door carries the number the plan drawing gives it (docs/art/corridor-plan.svg, plan B),
// west to east along each wall; the stairs have none
const svg = fs.readFileSync(path.join(ROOT, 'docs/art/corridor-plan.svg'), 'utf8');
const drawn = [...svg.slice(svg.indexOf('Б. Вход')).matchAll(/<rect class="(?:room|stairs)" x="(\d+)" y="(\d+)"[^>]*\/>(?:<text class="num"[^>]*>(\d+)<\/text>)?/g)];
const fromDrawing = (y) => drawn.filter(m => m[2] === y).sort((p, q) => p[1] - q[1]).map(m => m[3] || '-');
const fromPlan = (wall) => DOORS.filter(d => d.wall === wall).sort((p, q) => p.x - q.x).map(d => d.number || '-');
assert.deepEqual(fromPlan('north'), fromDrawing('0'), 'north wall numbers as drawn');
assert.deepEqual(fromPlan('south'), fromDrawing('176'), 'south wall numbers as drawn');
assert.equal(ROOM1_NUMBER, '101', 'the room facing the stairs is 101');
// the doors' signs carry them, one per room door (room 101's door is room 01's)
const plates = [...(corridorHTML + sceneHTML).matchAll(/data-number="(\d+)"/g)].map(m => m[1]).sort();
assert.deepEqual(plates, DOORS.filter(d => d.number).map(d => d.number).sort(), 'a numbered plaque at every room door');
console.log('plaque tests: ok');
