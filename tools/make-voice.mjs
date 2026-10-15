// Generates the experimenter recordings of a room with ElevenLabs, then evens them out.
// Usage: node tools/make-voice.mjs <room-id | app/lobby> [--force] [--even]
//   --force  record again even where a file exists
//   --even   only even out the existing files (no recording, costs nothing)
// The API key is read from ~/.elevenlabs-key.txt and never printed or stored in the repo.
// Existing files are kept unless --force is given, so re-running costs nothing. Needs ffmpeg.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// The experimenter voice: "Daniel" (ElevenLabs stock voice), firm and confident: model v3 with
// a delivery tag in front of every line.
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';
const MODEL_ID = 'eleven_v3';
// v3's stability: 0 Creative, 0.5 Natural, 1 Robust, the most consistent (ElevenLabs, "Prompting
// Eleven v3"). Lines recorded at 0.5 came out in different tempo and loudness, and
// the voice was heard to change from line to line.
const SETTINGS = { stability: 1 };
const DELIVERY = '[уверенно, твёрдо] ';
// Every file is evened out the same way: one loudness (EBU R128 normalises programme loudness, true
// peak at most -1 dBTP; -18 LUFS is where the recordings already sat, so the mix measured with the
// corridor's sounds holds), silence cut at both ends, then the same short lead-in and a tail, so no
// line starts late or stops dead on its last sound (lead and tail lengths are our choice).
const EVEN = { lufs: -18, truePeak: -1.5, leadMs: 100, tailMs: 500, tolerance: 0.5 };

const room = process.argv[2];
const force = process.argv.includes('--force');
const evenOnly = process.argv.includes('--even');
if (!/^[\w/-]+$/.test(room || '')) { console.error('usage: node tools/make-voice.mjs <room-id | app/lobby> [--force] [--even]'); process.exit(1); }

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const roomDir = room.includes('/') ? path.join(src, room) : path.join(src, 'rooms', room);
const { VOICE_LINES } = await import(pathToFileURL(path.join(roomDir, 'voice-lines.js')).href);

// runs ffmpeg and returns what it printed on stderr (where it reports its measurements)
function ff(...args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${(r.stderr || '').split('\n').slice(-3).join(' ')}`);
  return r.stderr;
}
const TRIM = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,areverse,' +
  'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,areverse';

function even(file) {
  const tmp = file.replace(/\.mp3$/, '.even.mp3');
  // pass 1: measure the trimmed speech; pass 2: one linear gain to the target, then the same
  // lead-in and tail on every line
  const m = JSON.parse(ff('-i', file, '-af', `${TRIM},loudnorm=I=${EVEN.lufs}:TP=${EVEN.truePeak}:print_format=json`, '-f', 'null', '-').match(/\{[^{}]*\}/)[0]);
  ff('-y', '-i', file, '-af',
    `${TRIM},loudnorm=I=${EVEN.lufs}:TP=${EVEN.truePeak}:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}` +
    `:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset},` +
    `adelay=${EVEN.leadMs}:all=1,apad=pad_dur=${EVEN.tailMs / 1000},aresample=44100`,
    '-codec:a', 'libmp3lame', '-b:a', '128k', tmp);
  fs.renameSync(tmp, file);
  const lufs = Number(ff('-i', file, '-af', 'ebur128', '-f', 'null', '-').match(/Integrated loudness:\s*\n\s*I:\s+(-?[\d.]+) LUFS/)?.[1]);
  const ok = Math.abs(lufs - EVEN.lufs) <= EVEN.tolerance;
  console.log(`even   ${rel(file)}  ${lufs} LUFS${ok ? '' : '  OUTSIDE the target'}`);
  if (!ok) process.exitCode = 1;
}
const rel = (file) => path.relative(roomDir, file).replace(/\\/g, '/');

const key = evenOnly ? '' : fs.readFileSync(path.join(os.homedir(), '.elevenlabs-key.txt'), 'utf8').replace(/^\uFEFF/, '').trim();
for (const line of VOICE_LINES) {
  const out = path.join(roomDir, line.file);
  if (evenOnly) {
    if (fs.existsSync(out)) even(out);
    continue;
  }
  if (fs.existsSync(out) && !force) { console.log('keep  ', line.file); continue; }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: DELIVERY + (line.spoken || line.text), model_id: MODEL_ID, voice_settings: SETTINGS })
  });
  if (!res.ok) { console.error('error ', line.file, res.status, (await res.text()).slice(0, 200)); process.exitCode = 1; continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log('wrote ', line.file);
  even(out);
}
