// Generates the sound effects of a room (or of a folder under src/ with its own
// sound-list.js, e.g. app/lobby) with ElevenLabs sound generation.
// Usage: node tools/make-sounds.mjs <room-id | app/lobby> [--force]
// The API key is read from ~/.elevenlabs-key.txt and never printed or stored in the repo.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const room = process.argv[2];
const force = process.argv.includes('--force');
if (!/^[\w/-]+$/.test(room || '')) { console.error('usage: node tools/make-sounds.mjs <room-id | app/lobby> [--force]'); process.exit(1); }

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const roomDir = room.includes('/') ? path.join(src, room) : path.join(src, 'rooms', room);
const { SOUNDS } = await import(pathToFileURL(path.join(roomDir, 'sound-list.js')).href);
const key = fs.readFileSync(path.join(os.homedir(), '.elevenlabs-key.txt'), 'utf8').replace(/^﻿/, '').trim();

for (const s of SOUNDS) {
  const out = path.join(roomDir, s.file);
  if (fs.existsSync(out) && !force) { console.log('keep  ', s.file); continue; }
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: s.prompt, duration_seconds: s.seconds, prompt_influence: 0.5 })
  });
  if (!res.ok) { console.error('error ', s.file, res.status, (await res.text()).slice(0, 200)); process.exitCode = 1; continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log('wrote ', s.file);
}
