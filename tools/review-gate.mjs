// The automatic stop before the owner meets anything: the headset tools do not start VR and the
// test copy is not published until the practice reviewer (.claude/agents/practice-reviewer.md)
// has seen the files a person meets: the game and the headset probe, as the local server serves
// them (PUBLIC, tests/static-server.mjs). A check built from a first idea wasted his headset run
// (docs/mistakes.md); a rule in text was not enough to stop the next one.
// The record is kept outside the repository and written only by Claude Code's own hook when a
// reviewer run ends (tools/claude-guard.mjs, subagent-start and subagent-stop): the review counts
// only if the files did not change while it read them and its report reached its last block. The
// same guard refuses the assistant's own writes to the record (tests/review-gate.test.mjs).
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PUBLIC, isPublic } from '../tests/static-server.mjs';

export const RECORD = process.env.OBJECT_REVIEW_RECORD
  || path.join(os.homedir(), 'Documents', 'objekt-files', 'notes', 'practice-reviews.jsonl');
export const REVIEWER = 'practice-reviewer';
// the last block every reviewer report ends with: a run cut short has not reported
export const REPORT_END = 'FOR THE OWNER:';

// Every file a person meets, read once: a hash of each (by path) and the print, one hash of them
// all by path and content. Text is read with LF line ends, so a checkout where git writes CRLF
// gives the same print as one with LF.
export function scan(root) {
  const names = [];
  for (const p of PUBLIC) {
    const abs = path.join(root, p);
    if (!fs.existsSync(abs)) continue;
    const found = p.endsWith('/') ? fs.readdirSync(abs, { recursive: true }).map((f) => p + String(f).split(path.sep).join('/')) : [p];
    for (const rel of found) if (isPublic(rel) && fs.statSync(path.join(root, rel)).isFile()) names.push(rel);
  }
  return prints(root, names);
}
const prints = (root, names) => {
  const hash = crypto.createHash('sha256'), files = {};
  for (const rel of names.sort()) {
    let bytes = fs.readFileSync(path.join(root, rel));
    if (!bytes.subarray(0, 8000).includes(0)) bytes = Buffer.from(bytes.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
    hash.update(`${rel}\0${bytes.length}\0`).update(bytes);
    files[rel] = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  }
  return { print: hash.digest('hex'), files };
};
export const fingerprint = (root) => scan(root).print;

// The check against the paper (.claude/agents/paper-reviewer.md), room by room: the headset and the
// test copy also wait until each room was checked against its paper as its folder now stands, since
// an unchecked room in the headset costs the owner his time (docs/owner-decisions.md: a ban only where
// a mistake cannot be undone or costs him time). A run counts for the rooms its last line lists.
export const PAPER_REVIEWER = 'paper-reviewer';
export const PAPER_END = 'ROOMS CHECKED:';
const ROOMS = 'src/rooms';
export function roomScan(root) {
  const dir = path.join(root, ROOMS);
  const rooms = fs.existsSync(dir) ? fs.readdirSync(dir).filter((r) => fs.statSync(path.join(dir, r)).isDirectory()) : [];
  return Object.fromEntries(rooms.map((r) => [r, prints(root, fs.readdirSync(path.join(dir, r), { recursive: true })
    .map((f) => `${ROOMS}/${r}/${String(f).split(path.sep).join('/')}`).filter((rel) => fs.statSync(path.join(root, rel)).isFile()))]));
}
// the rooms a report's last line lists ("ROOMS CHECKED: 01-control"), and only its last line: a
// run that named a room further up and was then cut short has not finished its check
export const checkedRooms = (report) => {
  const last = String(report).split('\n').map((l) => l.trim()).filter(Boolean).pop() || '';
  return last.startsWith(PAPER_END) ? last.slice(PAPER_END.length).split(/[\s,]+/).filter((r) => /^\d{2}-[\w-]+$/.test(r)) : [];
};

// the files a reviewer's report names, by path or by file name: the fixes it asks for touch these
export const named = (report) => [...new Set((String(report).match(/[\w./\\-]+\.(?:m?js|html|css|json|svg|png|jpe?g|webp|mp3|wav|woff2|glb|gltf)\b/g) || [])
  .map((p) => p.replace(/\\/g, '/').replace(/^(\.\/)+/, '')))];

export const entries = (record = RECORD) => {
  try {
    return fs.readFileSync(record, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return {}; } });
  } catch { return []; }
};

export const write = (entry, record = RECORD) => {
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.appendFileSync(record, `${JSON.stringify({ ...entry, at: new Date().toISOString() })}\n`);
};

// the last assistant entry of a transcript (JSON lines), as text: a subagent hands its report back
// through a tool call, so its text or the text values of its tool call's input, with their own line
// ends (as JSON a report would be one line, and its last line could not be read)
const texts = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? Object.values(v).map(texts).filter(Boolean).join('\n') : '');
export function lastReport(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    let e;
    try { e = JSON.parse(lines[i]); } catch { continue; }
    if (e.type !== 'assistant') continue;
    const parts = (e.message && e.message.content) || [];
    const text = parts.map((p) => (p.type === 'text' ? p.text : p.type === 'tool_use' ? texts(p.input) : '')).join('\n');
    if (text.trim()) return text;
  }
  return '';
}

// the reviewer run that saw these very files, or null: what the owner meets, and the test copy
export const reviewOf = (root, record = RECORD) => {
  const print = fingerprint(root);
  return entries(record).filter((e) => e.kind === 'review' && e.print === print).pop() || null;
};

// The assistant's own look in the headset after fixing what a review found: a review that saw
// these files, or one whose report names every file changed since (a file it did not name, or one
// added or removed that it did not name, needs a new review). Without this, a one-line fix
// waited for a whole new review before the look that checks it.
const fixes = (e, now) => Array.isArray(e.named) && e.files && Object.keys({ ...e.files, ...now.files })
  .filter((f) => e.files[f] !== now.files[f]).every((f) => e.named.some((n) => f === n || f.endsWith(`/${n}`)));
export const lookOf = (root, record = RECORD) => {
  const now = scan(root);
  return entries(record).filter((e) => e.kind === 'review' && (e.print === now.print || fixes(e, now))).pop() || null;
};

// the paper check of one room as its folder now stands; for the own look also one whose report
// named every file of the room changed since, as with the practice review
export const paperOf = (root, room, { look = false } = {}, record = RECORD) => {
  const now = roomScan(root)[room];
  if (!now) return null;
  return entries(record).filter((e) => e.kind === 'paper' && e.room === room && (e.print === now.print || (look && fixes(e, now)))).pop() || null;
};

// Called with requireReview by the headset tools and the test copy; no flag skips it
export function requirePaper(root, action, { look = false } = {}) {
  const missing = Object.keys(roomScan(root)).filter((room) => !paperOf(root, room, { look }));
  if (!missing.length) return;
  console.log(`not now: ${action} waits for the paper check of ${missing.join(', ')}. The room changed since its last check against its paper (or none ran): run the paper-reviewer agent on it, fix what it finds and verify its main claims in the paper; its run on the room as it then stands, recorded by Claude Code's hook, lets this go ahead.`);
  process.exit(1);
}

// Called by a tool before it starts VR in the headset or publishes the test copy; no flag skips it.
// look: the assistant's own look (tools/quest-look.mjs vr), which a fix of the review's findings
// does not stop; anything else needs a review of exactly the current files.
export function requireReview(root, action, { look = false } = {}) {
  if (look ? lookOf(root) : reviewOf(root)) return;
  console.log(`not now: ${action} waits for the practice reviewer. The game or the probe changed since its last review (or none ran)${look ? ' in a file its report did not name' : ''}: run the practice-reviewer agent on what the owner will meet and fix what it finds; a review of the files as they then stand, recorded by Claude Code's hook, lets this go ahead.`);
  process.exit(1);
}
