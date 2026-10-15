// Listens to every recording of a room with ElevenLabs speech-to-text and
// compares the words with the script, so a misread line (wrong word, wrong
// ending, skipped word) is caught without a human listening. Stress (ударение)
// is not checked: speech-to-text hears through it.
// Usage: node tools/check-voice.mjs 01-control
// Numbers may come back as digits ("40" for "сорок"): such lines show as DIFF
// with only the number missing, which is fine.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const room = process.argv[2];
if (!/^[\w/-]+$/.test(room || '')) { console.error('usage: node tools/check-voice.mjs <room-id | app/lobby>'); process.exit(1); }
const roomDir = room.includes('/') ? path.resolve('src', room) : path.resolve('src/rooms', room);
const { VOICE_LINES } = await import(pathToFileURL(path.join(roomDir, 'voice-lines.js')).href);
const key = fs.readFileSync(path.join(os.homedir(), '.elevenlabs-key.txt'), 'utf8').replace(/^﻿/, '').trim();
const norm = (s) => s.toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s) => norm(s).split(' ');
for (const line of VOICE_LINES) {
  const form = new FormData();
  form.append('model_id', 'scribe_v1');
  form.append('language_code', 'rus');
  form.append('file', new Blob([fs.readFileSync(path.join(roomDir, line.file))], { type: 'audio/mpeg' }), 'a.mp3');
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': key }, body: form });
  if (!res.ok) { console.log('ERR', line.file, res.status, (await res.text()).slice(0, 150)); continue; }
  const heard = (await res.json()).text || '';
  const a = words(line.spoken || line.text), b = new Set(words(heard));
  const missing = a.filter(w => !b.has(w));
  console.log(missing.length ? 'DIFF' : 'ok  ', line.file, missing.length ? `missing: ${missing.join(', ')} | heard: ${heard}` : '');
}
