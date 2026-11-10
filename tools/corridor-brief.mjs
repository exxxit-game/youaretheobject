// Read the current task from the one map without executing its HTML or changing state.
// Refuse a stale visible task: a hidden JSON update must not leave the owner seeing another one.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildIndex, MANIFEST_PATH } from './knowledge.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIELDS = ['id', 'title', 'why', 'in', 'out', 'bounds', 'owner', 'proof'];
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
  for (const field of ['updated', 'authority']) {
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
  if (fieldValue(visible, 'goal') !== data.goal.replace(/\s+/g, ' ').trim()) {
    throw new Error('Visible goal differs from the structured goal');
  }
  if (!Array.isArray(data.obstacles)) throw new Error('Expected an explicit obstacle list');
  for (const item of data.obstacles) {
    if (!item.id || !item.status || !item.affected || !item.next) throw new Error('Incomplete obstacle record');
    if (typeof item.open !== 'boolean') throw new Error(`Obstacle ${item.id} needs an explicit boolean open state`);
  }
  const blockers = data.obstacles.filter(item => item.open).map(item =>
    ({ id: item.id, status: item.status, affects: item.affected, next: item.next }));
  return { updated: data.updated, goal: data.goal, task, blockers,
    queue: data.work_queue || [], evidence: data.latest_evidence || [],
    historicalEvidence: Object.entries(data).filter(([, value]) => value?.evidenceStatus === 'historical').map(([id]) => id),
    meaningSource: data.authority,
    notice: 'Recorded state only: reading this brief does not run checks or approve the work.' };
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

export function readBrief(repoRoot = ROOT) {
  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, MANIFEST_PATH), 'utf8'));
  const entry = buildIndex(manifest, repoRoot).entries.find(item => item.id === 'corridor-project-map');
  if (!entry?.locations[0]?.exists) throw new Error('Working map is missing; locate it through the source catalogue');
  const mapPath = entry.locations[0].path;
  const html = fs.readFileSync(mapPath, 'utf8');
  const brief = briefFromHtml(html);
  return { mapPath, mapSha256: crypto.createHash('sha256').update(html).digest('hex'), ...brief,
    evidenceChecks: checkEvidence(brief.evidence) };
}

export function formatBrief(brief) {
  const t = brief.task;
  return [
    `Map: ${brief.mapPath}`, `Snapshot: ${brief.updated}; SHA-256: ${brief.mapSha256}`,
    `Goal: ${brief.goal}`, `Current step: ${t.id} - ${t.title}`, `Why: ${t.why}`,
    `Inputs: ${t.in}`, `Expected result: ${t.out}`, `Scope: ${t.bounds}`,
    `Owner: ${t.owner}`, `Completion check: ${t.proof}`,
    ...brief.blockers.map(b => `Open limitation ${b.id}: ${b.status}. Affects: ${b.affects}`),
    ...(brief.historicalEvidence || []).map(id => `Historical content review: ${id}; current text is not covered by that review.`),
    ...(brief.evidenceChecks || []).filter(item => item.status !== 'matched').map(item =>
      `Evidence ${item.status}: ${item.path}; expected ${item.expected}; actual ${item.actual || item.error}`),
    `Meaning source: ${brief.meaningSource}`, brief.notice
  ].join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--json')) throw new Error('Usage: node tools/corridor-brief.mjs [--json]');
    const brief = readBrief();
    console.log(args.includes('--json') ? JSON.stringify(brief, null, 2) : formatBrief(brief));
    if (brief.evidenceChecks.some(item => item.status !== 'matched')) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`corridor brief: ${error.message}\n`);
    process.exitCode = 1;
  }
}
