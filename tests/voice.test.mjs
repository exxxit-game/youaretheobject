// Every line the experimenter speaks, in every room, must have its recording.
import assert from 'node:assert/strict';
import fs from 'node:fs';

// every room, and the lab corridor before the rooms
const rooms = [...fs.readdirSync(new URL('../src/rooms/', import.meta.url)).map((r) => `rooms/${r}`), 'app/lobby'];
let total = 0;
for (const room of rooms) {
  const dir = new URL(`../src/${room}/`, import.meta.url);
  const { VOICE_LINES } = await import(new URL('voice-lines.js', dir));
  for (const line of VOICE_LINES) {
    const file = new URL(line.file, dir);
    assert.ok(fs.existsSync(file), `${room}: missing recording ${line.file}`);
    assert.ok(fs.statSync(file).size > 1000, `${room}: recording too small ${line.file}`);
  }
  const texts = VOICE_LINES.map(l => l.text);
  assert.equal(new Set(texts).size, texts.length, `${room}: two voice lines share the same text`);
  assert.equal(new Set(VOICE_LINES.map(l => l.file)).size, VOICE_LINES.length, `${room}: two lines share a file`);
  total += VOICE_LINES.length;
}
// One rule for a sound asked for before the player's first gesture: it waits for it, never lost
// silently (it was: the voice line pointing to the clipboard was dropped, the clicks too), and the
// wait ends at the unlock even where there is no audio at all, so no step of a room hangs on it.
const { speak, loadVoice } = await import('../src/engine/voice.js');
const { unlock, onUnlock } = await import('../src/engine/audio.js');
globalThis.fetch = async () => ({ ok: false });   // node: no files, so no recording plays
loadVoice([{ text: 'a line', file: 'a.mp3' }], 'file:///x/');
let said = 'waiting', ran = 0;
const line = speak('a line').then((v) => { said = v; });
onUnlock(() => { ran++; });
assert.equal(await speak('a line with no recording'), false, 'a line with no recording ends at once');
await new Promise((r) => setTimeout(r, 20));
assert.equal(said, 'waiting', 'a line asked for before the first gesture waits for it');
assert.equal(ran, 0, 'what waits for the unlock does not run before it');
unlock();   // node has no audio: the line ends unheard, the waiting ones run
await line;
assert.equal(said, false, 'after the unlock the line ends even with no audio');
assert.equal(ran, 1, 'the waiting ones run at the unlock even with no audio');
onUnlock(() => { ran++; });
assert.equal(ran, 2, 'after the unlock a request runs at once');
console.log(`voice tests: ok (${total} recordings in ${rooms.length} rooms; sounds before the first gesture wait for it)`);
