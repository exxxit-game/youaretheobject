// Read the current task from the one map without executing its HTML or changing state.
// Refuse a stale visible task: a hidden JSON update must not leave the owner seeing another one.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { isMain } from './is-main.mjs';
import { buildIndex, MANIFEST_PATH } from './knowledge.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIELDS = ['id', 'title', 'why', 'in', 'out', 'bounds', 'owner', 'proof'];
const STATE_START = '<!-- corridor-current:start -->';
const STATE_END = '<!-- corridor-current:end -->';
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const oneLine = value => String(value).replace(/\s+/g, ' ').trim();
function textValue(html) {
  const named = { amp: '&', AMP: '&', lt: '<', LT: '<', gt: '>', GT: '>',
    quot: '"', QUOT: '"', apos: "'", nbsp: ' ' };
  return html.replace(/<[^>]*>/g, '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] !== '#') return named[code] ?? entity;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  }).replace(/\s+/g, ' ').trim();
}
function fieldValue(html, field) {
  const expression = new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\bdata-brief-field="${field}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'gi');
  const matches = [...html.matchAll(expression)];
  if (matches.length !== 1) throw new Error(`Expected one visible ${field} field`);
  return textValue(matches[0][2]);
}

export function briefFromHtml(html) {
  const records = [...html.matchAll(/<script\b[^>]*\bid="project-map-data"[^>]*>([\s\S]*?)<\/script>/g)];
  if (records.length !== 1) throw new Error('Expected exactly one project-map-data record');
  const data = JSON.parse(records[0][1]);
  if (data.schema !== 1 || typeof data.goal !== 'string' || !data.goal.trim()) {
    throw new Error('Expected map schema 1 and a goal');
  }
  for (const field of ['updated', 'authority', 'authorPurpose']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`Map is missing ${field}`);
  }
  const task = data.active_step || data.next;
  for (const field of FIELDS) {
    if (typeof task?.[field] !== 'string' || !task[field].trim()) throw new Error(`Task is missing ${field}`);
  }
  const visible = html.slice(0, records[0].index);
  const section = visible.match(/<section\b[^>]*\bid="next"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  if (!section) throw new Error('Missing visible next task');
  for (const field of FIELDS) {
    if (fieldValue(section, field) !== task[field].replace(/\s+/g, ' ').trim()) {
      throw new Error(`Visible next task differs from the structured task: ${field}`);
    }
  }
  for (const field of ['goal', 'authorPurpose']) {
    if (fieldValue(visible, field) !== data[field].replace(/\s+/g, ' ').trim()) {
      throw new Error(`Visible ${field} differs from the structured ${field}`);
    }
  }
  if (!Array.isArray(data.obstacles)) throw new Error('Expected an explicit obstacle list');
  for (const item of data.obstacles) {
    if (!item.id || !item.status || !item.affected || !item.next) throw new Error('Incomplete obstacle record');
    if (typeof item.open !== 'boolean') throw new Error(`Obstacle ${item.id} needs an explicit boolean open state`);
  }
  const blockers = data.obstacles.filter(item => item.open).map(item =>
    ({ id: item.id, status: item.status, affects: item.affected, next: item.next }));
  return { updated: data.updated, goal: data.goal, authorPurpose: data.authorPurpose, task, blockers,
    queue: data.work_queue || [], evidence: data.latest_evidence || [],
    historicalEvidence: Object.entries(data).filter(([, value]) => value?.evidenceStatus === 'historical').map(([id]) => id),
    meaningSource: data.authority,
    notice: 'Recorded state only: reading this brief does not run checks or approve the work.' };
}

// Only marked current views are derived. Historical decisions and receipts are untouched.
export function renderMapFields(html) {
  const records = [...html.matchAll(/<script\b[^>]*\bid="project-map-data"[^>]*>([\s\S]*?)<\/script>/g)];
  if (records.length !== 1) throw new Error('Expected exactly one project-map-data record');
  const data = JSON.parse(records[0][1]), task = data.active_step || data.next;
  let visible = html.slice(0, records[0].index);
  for (const [field, value] of Object.entries({ goal: data.goal, authorPurpose: data.authorPurpose,
    ...Object.fromEntries(FIELDS.map(field => [field, task?.[field]])) })) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing source field ${field}`);
    fieldValue(visible, field);
    const expression = new RegExp(`(<([a-z][\\w-]*)\\b[^>]*\\bdata-brief-field="${field}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i');
    visible = visible.replace(expression, (_, open, tag, close) => open + escapeHtml(value) + close);
  }
  const result = visible + html.slice(records[0].index);
  briefFromHtml(result);
  return result;
}

export function renderCurrentState(brief) {
  const t = brief.task;
  const safe = value => oneLine(value).replace(/[\\`*_\[\]<>]/g, '\\$&');
  return [STATE_START,
    'Generated from the working map by `node tools/corridor-brief.mjs --sync`; edit its source, not this block.',
    '', `**Goal:** ${safe(brief.goal)}`, `**Author purpose:** ${safe(brief.authorPurpose)}`,
    `**Current step:** ${safe(t.id)} — ${safe(t.title)}`, `**Why:** ${safe(t.why)}`,
    `**Result:** ${safe(t.out)}`, `**Completion:** ${safe(t.proof)}`,
    `**Scope:** ${safe(t.bounds)}`, `**Owner action:** ${safe(t.owner)}`, STATE_END].join('\n');
}

function stateBlock(text) {
  if (text.split(STATE_START).length !== 2 || text.split(STATE_END).length !== 2) {
    throw new Error('Expected one current-state block in docs/state.md');
  }
  const start = text.indexOf(STATE_START), end = text.indexOf(STATE_END);
  if (end < start) throw new Error('Invalid current-state block');
  return { start, end: end + STATE_END.length };
}

export function updateCurrentState(text, brief) {
  const block = stateBlock(text);
  return text.slice(0, block.start) + renderCurrentState(brief) + text.slice(block.end);
}

// Hash only the named current receipt(s), never the library described inside them.
export function checkEvidence(evidence, read = file => fs.readFileSync(file)) {
  return (Array.isArray(evidence) ? evidence : [evidence]).map(item => {
    if (typeof item?.path !== 'string' || !item.path.trim() || !/^[a-f0-9]{64}$/i.test(item.sha256 || '')) {
      throw new Error('Invalid current evidence');
    }
    const result = { path: item.path, expected: item.sha256 };
    let bytes;
    try { bytes = read(item.path); }
    catch (error) { return { ...result, status: 'unavailable', error: error.code || error.message }; }
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    return { ...result, actual, status: actual === item.sha256.toLowerCase() ? 'matched' : 'changed' };
  });
}

function mapLocation(repoRoot) {
  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, MANIFEST_PATH), 'utf8'));
  const entry = buildIndex(manifest, repoRoot).entries.find(item => item.id === 'corridor-project-map');
  if (!entry?.locations[0]?.exists) throw new Error('Working map is missing; locate it through the source catalogue');
  return entry.locations[0].path;
}

export function readBrief(repoRoot = ROOT) {
  const mapPath = mapLocation(repoRoot);
  const html = fs.readFileSync(mapPath, 'utf8');
  const brief = briefFromHtml(html);
  const state = fs.readFileSync(path.join(repoRoot, 'docs/state.md'), 'utf8').replaceAll('\r\n', '\n');
  if (updateCurrentState(state, brief) !== state) {
    throw new Error('Current state differs from the map; run node tools/corridor-brief.mjs --sync');
  }
  return { mapPath, mapSha256: crypto.createHash('sha256').update(html).digest('hex'), ...brief,
    evidenceChecks: checkEvidence(brief.evidence) };
}

export function syncCurrentViews(repoRoot = ROOT) {
  const mapPath = mapLocation(repoRoot), statePath = path.join(repoRoot, 'docs/state.md');
  const html = fs.readFileSync(mapPath, 'utf8'), state = fs.readFileSync(statePath, 'utf8');
  const rendered = renderMapFields(html);
  const updated = updateCurrentState(state.replaceAll('\r\n', '\n'), briefFromHtml(rendered));
  const changes = [[mapPath, html, rendered], [statePath, state, updated]].filter(([, old, next]) => old !== next);
  for (const [file, old] of changes) {
    if (fs.readFileSync(file, 'utf8') !== old) throw new Error(`Source changed during synchronization: ${file}`);
  }
  for (const [file, , next] of changes) fs.writeFileSync(file, next, 'utf8');
  return { changed: changes.map(([file]) => file), ...readBrief(repoRoot) };
}

export function formatBrief(brief) {
  const t = brief.task;
  return [
    `Map: ${brief.mapPath}`, `Snapshot: ${brief.updated}; SHA-256: ${brief.mapSha256}`,
    `Goal: ${brief.goal}`, `Author's purpose: ${brief.authorPurpose}`,
    `Current step: ${t.id} - ${t.title}`, `Why: ${t.why}`,
    `Inputs: ${t.in}`, `Expected result: ${t.out}`, `Scope: ${t.bounds}`,
    `Owner: ${t.owner}`, `Completion check: ${t.proof}`,
    ...brief.blockers.map(b => `Open limitation ${b.id}: ${b.status}. Affects: ${b.affects}`),
    ...(brief.historicalEvidence || []).map(id => `Historical content review: ${id}; current text is not covered by that review.`),
    ...(brief.evidenceChecks || []).filter(item => item.status !== 'matched').map(item =>
      `Evidence ${item.status}: ${item.path}; expected ${item.expected}; actual ${item.actual || item.error}`),
    `Meaning source: ${brief.meaningSource}`, brief.notice
  ].join('\n');
}

if (isMain(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || args.some(arg => !['--json', '--sync', '--check'].includes(arg))) {
      throw new Error('Usage: node tools/corridor-brief.mjs [--json|--check|--sync]');
    }
    const brief = args.includes('--sync') ? syncCurrentViews() : readBrief();
    console.log(args.includes('--json') ? JSON.stringify(brief, null, 2) : args.includes('--check')
      ? 'Current map, state view and receipt checked.' : formatBrief(brief));
    if (brief.evidenceChecks.some(item => item.status !== 'matched')) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`corridor brief: ${error.message}\n`);
    process.exitCode = 1;
  }
}
