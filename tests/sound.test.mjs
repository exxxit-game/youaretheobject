// Every sound effect of every room must have its file.
import assert from 'node:assert/strict';
import fs from 'node:fs';

// every room, plus the corridor shared by all rooms
const rooms = [...fs.readdirSync(new URL('../src/rooms/', import.meta.url)).map(r => `rooms/${r}`), 'app/lobby'];
let total = 0;
for (const room of rooms) {
  const dir = new URL(`../src/${room}/`, import.meta.url);
  const { SOUNDS } = await import(new URL('sound-list.js', dir));
  for (const s of SOUNDS) {
    const file = new URL(s.file, dir);
    assert.ok(fs.existsSync(file), `${room}: missing sound ${s.file}`);
    assert.ok(fs.statSync(file).size > 1000, `${room}: sound too small ${s.file}`);
  }
  assert.equal(new Set(SOUNDS.map(s => s.name)).size, SOUNDS.length, `${room}: two sounds share a name`);
  total += SOUNDS.length;
}
// the corridor plays its sounds at measured gains: a sound without one would play at full
// volume and escape the headset check (tools/quest-look.mjs, levels)
const lobby = await import(new URL('../src/app/lobby/sound-list.js', import.meta.url));
assert.deepEqual(Object.keys(lobby.SOUND_GAIN).sort(), lobby.SOUNDS.map(s => s.name).sort(), 'every corridor sound has a gain');
console.log(`sound tests: ok (${total} sounds in ${rooms.length} rooms)`);
