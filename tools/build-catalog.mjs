// Builds docs/catalog.md from the experiment cards in docs/cards/. The catalog is
// never edited by hand, so it cannot drift from the cards; tests/structure.test.mjs
// fails when it is out of date. Usage: node tools/build-catalog.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CARDS = path.join(ROOT, 'docs', 'cards');
const OUT = path.join(ROOT, 'docs', 'catalog.md');

const line = (text, key) => (text.match(new RegExp(`^- ${key}:\\s*(.*)$`, 'm')) || [])[1] || '';
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s).replace(/\|/g, '/');

function verdictOf(v) {
  const s = v.toLowerCase();
  if (s.startsWith('first-room candidate')) return 'first';
  if (s.startsWith('reject')) return 'reject';
  if (s.startsWith('interlude')) return 'interlude';
  if (s.startsWith('room')) return 'room';
  return 'other';
}
function spaceOf(s) {
  const t = s.toLowerCase();
  if (!t || t.startsWith('unknown')) return '?';
  if (/^large|large-space only|large \d/.test(t)) return 'large';
  if (t.startsWith('roomscale')) return 'roomscale';
  if (t.startsWith('standing')) return 'standing';
  if (t.startsWith('seated') || t.startsWith('task 1 seated')) return 'seated';
  if (/large/.test(t)) return 'large';
  if (/roomscale/.test(t)) return 'roomscale';
  if (/standing/.test(t)) return 'standing';
  if (/seated/.test(t)) return 'seated';
  return '?';
}
function realityOf(s) {
  const t = s.toLowerCase();
  if (!t) return 'not judged';
  if (t.startsWith('mixed reality') || t.startsWith('mr')) return 'MR';
  if (t.startsWith('vr')) return 'VR';
  if (/^(neither|either|both|desktop|the original is a flat|no headset)/.test(t)) return 'any';
  if (/mixed reality (suits|is closer|is the original|fits)/.test(t)) return 'MR';
  if (/vr (suits|is closer|fits|only)/.test(t)) return 'VR';
  return 'not judged';
}

const cards = fs.readdirSync(CARDS).filter(f => f.endsWith('.md') && f !== 'README.md').sort().map((f) => {
  const text = fs.readFileSync(path.join(CARDS, f), 'utf8').replace(/\r\n/g, '\n');
  const id = f.slice(0, -3);
  const name = ((text.match(/^# [^—\n]*—\s*(.+)$/m) || [])[1] || id).trim();
  const verdict = line(text, 'Verdict');
  const live = line(text, 'Live players needed');
  return {
    id, name,
    status: line(text, 'status'),
    group: line(text, 'status') === 'no-full-text' ? 'unread' : verdictOf(verdict),
    space: spaceOf(line(text, 'Space tier')),
    reality: realityOf(line(text, 'VR or mixed reality')),
    live: (live.match(/\d+/) || [''])[0],
    why: clip(verdict.replace(/^(first-room candidate|room|interlude|reject)( as a room| for a room| for now| until read)?\s*(\([^)]*\))?\s*[—:.,-]?\s*/i, ''), 160)
  };
});

const GROUPS = [
  ['first', 'First-room candidates'],
  ['room', 'Rooms'],
  ['interlude', 'Interludes (short moments inside or between rooms)'],
  ['reject', 'Rejected (reason on the card)'],
  ['unread', 'Not read: no legal full text when the card was written (status now: docs/library.md)'],
  ['other', 'Unclassified verdict (fix the card)']
];
const counts = Object.fromEntries(GROUPS.map(([g]) => [g, cards.filter(c => c.group === g).length]));
const out = [
  '# Experiment catalog',
  '',
  'Generated from `docs/cards/` by `node tools/build-catalog.mjs`. Do not edit by hand.',
  'Every row links to a card written from the paper\'s full text with checked quotes.',
  'Space: seated · standing · roomscale (1.8 × 1.8 m) · large (more than 1.8 × 1.8 m, offered only',
  'to players with that space). Reality: VR, MR (mixed reality fits the original better),',
  'any, or "not judged" (card written before that line was required). Live: real players',
  'needed at the same time.',
  '',
  `Cards: ${cards.length} — ` + GROUPS.filter(([g]) => counts[g]).map(([g, t]) => `${t.split(' (')[0].toLowerCase()}: ${counts[g]}`).join(', ') + '.',
  ''
];
for (const [g, title] of GROUPS) {
  const rows = cards.filter(c => c.group === g);
  if (!rows.length) continue;
  out.push(`## ${title}`, '', '| Card | Experiment | Space | Reality | Live | Why |', '|---|---|---|---|---|---|');
  for (const c of rows) {
    out.push(`| [${c.id}](cards/${c.id}.md) | ${clip(c.name, 70)} | ${c.space} | ${c.reality} | ${c.live || '—'} | ${c.why} |`);
  }
  out.push('');
}
const text = out.join('\n');
if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (current !== text) { console.error('docs/catalog.md is out of date: run node tools/build-catalog.mjs'); process.exit(1); }
  console.log('catalog up to date');
} else {
  fs.writeFileSync(OUT, text);
  console.log(`catalog: ${cards.length} cards`, counts);
}
