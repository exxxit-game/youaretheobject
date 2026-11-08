import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PUBLIC, isPublic } from '../tests/static-server.mjs';

export const RECORD = process.env.OBJECT_REVIEW_RECORD
  || path.join(os.homedir(), 'Documents', 'objekt-files', 'notes', 'practice-reviews.jsonl');
export const REVIEWER = 'practice-reviewer';
export const REPORT_END = 'FOR THE OWNER:';

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

export const reviewScope = root => prints(root, ['tools/', 'tests/', 'package.json', '.github/workflows/', '.coderabbit.yaml',
  'AGENTS.md','WORKFLOW.md','policy/', '.codex/', '../../.codex/']
  .flatMap(p => !fs.existsSync(path.join(root,p)) ? [] : p.endsWith('/')
    ? fs.readdirSync(path.join(root,p),{recursive:true}).map(f => p + String(f).split(path.sep).join('/')) : [p])
  .filter(p => fs.statSync(path.join(root,p)).isFile())).print;
const valid = (entry, root) => {
  if (!Object.hasOwn(entry, 'source')) return false;
  if (entry.source !== 'codex' || entry.root !== fs.realpathSync.native(root) ||
      entry.scope !== reviewScope(root) || entry.verdict !== 'pass' ||
      !entry.agent || !entry.session || entry.agent === entry.session) return false;
  const paper = entry.kind === 'paper', end = paper ? PAPER_END : REPORT_END;
  return entry.agent_type === (paper ? PAPER_REVIEWER : REVIEWER) &&
    typeof entry.report === 'string' && endsWithBlock(entry.report, end) &&
    entry.report_sha256 === crypto.createHash('sha256').update(entry.report).digest('hex') &&
    [...entry.report.matchAll(/^REVIEW VERDICT: (pass|changes-required|unverified)\s*$/gm)].length === 1 &&
    /^REVIEW VERDICT: pass\s*$/m.test(entry.report) &&
    entry.report.includes('REVIEW SCOPE: ' + entry.scope) &&
    (paper ? checkedRooms(entry.report).includes(entry.room) :
      /^REVIEW COVERAGE: full-practice\s*$/m.test(entry.report) &&
      [...entry.report.matchAll(/^REVIEW COVERAGE:.*$/gm)].length === 1);
};

export const PAPER_REVIEWER = 'paper-reviewer';
export const PAPER_END = 'ROOMS CHECKED:';
const ROOMS = 'src/rooms';
export function roomScan(root) {
  const dir = path.join(root, ROOMS);
  const rooms = fs.existsSync(dir) ? fs.readdirSync(dir).filter((r) => fs.statSync(path.join(dir, r)).isDirectory()) : [];
  return Object.fromEntries(rooms.map((r) => [r, prints(root, fs.readdirSync(path.join(dir, r), { recursive: true })
    .map((f) => `${ROOMS}/${r}/${String(f).split(path.sep).join('/')}`).filter((rel) => fs.statSync(path.join(root, rel)).isFile()))]));
}
export const endsWithBlock = (text, end) => {
  const lines = String(text).split('\n').map((l) => l.trim());
  const at = lines.map((l) => l.startsWith(end)).lastIndexOf(true);
  return at >= 0 && lines.slice(at + 1).every((l) => !l || l.startsWith('- '));
};
export const checkedRooms = (report) => {
  const last = String(report).split('\n').map((l) => l.trim()).filter(Boolean).pop() || '';
  return last.startsWith(PAPER_END) ? last.slice(PAPER_END.length).split(/[\s,]+/).filter((r) => /^\d{2}-[\w-]+$/.test(r)) : [];
};

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

export const reviewOf = (root, record = RECORD) => {
  const print = fingerprint(root);
  const entry = entries(record).filter(e => (e.kind === 'review' ||
    (e.source === 'codex' && e.agent_type === REVIEWER && ['start','void'].includes(e.kind))) && e.print === print).pop();
  return entry && valid(entry, root) ? entry : null;
};

const fixes = (e, now) => Array.isArray(e.named) && e.files && Object.keys({ ...e.files, ...now.files })
  .filter((f) => e.files[f] !== now.files[f]).every((f) => e.named.some((n) => f === n || f.endsWith(`/${n}`)));
export const lookOf = (root, record = RECORD) => {
  const now = scan(root);
  const entry = entries(record).filter(e => (e.kind === 'review' ||
    (e.source === 'codex' && e.agent_type === REVIEWER && ['start','void'].includes(e.kind))) && (e.print === now.print || fixes(e, now))).pop();
  return entry && valid(entry, root) ? entry : null;
};

export const paperOf = (root, room, { look = false } = {}, record = RECORD) => {
  const now = roomScan(root)[room];
  if (!now) return null;
  const entry = entries(record).filter(e => (e.kind === 'paper' && e.room === room && (e.print === now.print || (look && fixes(e, now)))) ||
    (e.source === 'codex' && e.agent_type === PAPER_REVIEWER && ['paper-start','void'].includes(e.kind) && e.rooms?.[room] === now.print)).pop();
  return entry && valid(entry, root) ? entry : null;
};

export function requirePaper(root, action, { look = false } = {}) {
  const missing = Object.keys(roomScan(root)).filter((room) => !paperOf(root, room, { look }));
  if (!missing.length) return;
  console.log(`not now: ${action} waits for the paper check of ${missing.join(', ')}. Run the paper-reviewer through its trusted lifecycle hook, fix findings and verify the main claims in the paper. A current recorded review is required.`);
  process.exit(1);
}

export function requireReview(root, action, { look = false } = {}) {
  if (look ? lookOf(root) : reviewOf(root)) return;
  console.log(`not now: ${action} waits for the practice reviewer. The game or probe changed (or no review ran)${look ? ' outside the named fixes' : ''}. Run the practice-reviewer through its trusted lifecycle hook and resolve findings; the current files need a recorded review.`);
  process.exit(1);
}
