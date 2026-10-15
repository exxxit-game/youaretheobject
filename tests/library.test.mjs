// The papers library index: docs/library/papers.json holds one record per paper, and the files built from
// it (docs/library.md, docs/library/*.md) must be what tools/build-library.mjs makes of it now. Every card
// must be named by its record, and where the library folder exists (the laptop; CI has no copy of the
// copyrighted papers) every paper file must have a record and every record its file, so the index cannot
// drift from the folder the way the old lists did.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, staleFiles, loadLibrary } from '../tools/build-library.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lib = loadLibrary(ROOT);
const papers = lib.papers;
const key = (p) => (p.dir ? `${p.dir}/` : '') + p.id;

// 1. Every record is complete and uses the agreed words.
const STATUS = ['card', 'no card', 'wanted', 'read-not-saved', 'dropped'];
const TEXT = ['ok', 'ocr', 'placeholder', 'none'];
const sectionIds = lib.sections.map((s) => s.id);
const seen = new Set();
for (const p of papers) {
  const k = key(p);
  assert.ok(!seen.has(k), `two records for ${k}`); seen.add(k);
  for (const f of ['id', 'authors', 'year', 'title', 'type']) assert.ok(typeof p[f] === 'string' && p[f].trim(), `${k}: no ${f}`);
  assert.ok(Array.isArray(p.sections) && p.sections.length >= 1 && p.sections.length <= 2, `${k}: one or two sections`);
  for (const s of p.sections) assert.ok(sectionIds.includes(s), `${k}: unknown section ${s}`);
  assert.ok(Array.isArray(p.tags) && p.tags.length > 0, `${k}: no tags`);
  assert.ok(STATUS.includes(p.status), `${k}: status ${p.status}`);
  assert.ok(TEXT.includes(p.text), `${k}: text ${p.text}`);
  if (p.status === 'card') assert.ok(p.card, `${k}: status card without a card`);
  if (p.card) assert.ok(fs.existsSync(path.join(ROOT, p.card)), `${k}: card ${p.card} does not exist`);
  if (!['card', 'no card'].includes(p.status)) {
    assert.ok(p.reason, `${k}: ${p.status} without a reason`);
    assert.equal(p.text, 'none', `${k}: not on disk, so no text`);
    assert.ok(!p.dir, `${k}: not on disk, so no folder`);
  }
  if (p.status === 'wanted') assert.ok(['high', 'medium', 'low'].includes(p.priority), `${k}: wanted without a priority`);
}

// 2. The generated files are current, and none is left over from an older layout.
const out = render(lib);
for (const [f, text] of Object.entries(out)) {
  const disk = fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n') : null;
  assert.equal(disk, text, `${f} is out of date: run node tools/build-library.mjs`);
}
assert.deepEqual(staleFiles(out, ROOT), [], 'generated files nobody makes any more: run node tools/build-library.mjs');

// 3. Every card appears with its card path.
const cards = fs.readdirSync(path.join(ROOT, 'docs/cards')).filter((f) => f.endsWith('.md') && f !== 'README.md');
const named = new Set(papers.map((p) => p.card).filter(Boolean));
const missing = cards.filter((f) => !named.has(`docs/cards/${f}`));
assert.deepEqual(missing, [], `cards with no record in ${'docs/library/papers.json'}: ${missing.join(', ')}`);

// 4. The folder and the records agree (only where the folder exists). A paper lives in papers\ under its id;
// a data set in datasets\ under its dir; imports\ (exports as downloaded) and notes\ hold no records.
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
if (fs.existsSync(lib.root)) {
  const under = (dir, base) => (fs.existsSync(dir) ? walk(dir).map((f) => path.relative(base, f).replaceAll('\\', '/')) : []);
  const files = [...under(path.join(lib.root, 'papers'), path.join(lib.root, 'papers')), ...under(path.join(lib.root, 'datasets'), lib.root)];
  const byStem = new Map();
  for (const f of files) {
    const stem = f.replace(/\.[^./]+$/, '');
    if (!byStem.has(stem)) byStem.set(stem, []);
    byStem.get(stem).push(f.slice(stem.length + 1).toLowerCase());
  }
  const onDisk = new Map(papers.filter((p) => ['card', 'no card'].includes(p.status)).map((p) => [key(p), p]));
  const unrecorded = [...byStem.keys()].filter((s) => !onDisk.has(s));
  assert.deepEqual(unrecorded, [], `paper files with no record in docs/library/papers.json: ${unrecorded.join(', ')}`);
  const lost = [...onDisk.keys()].filter((k) => !byStem.has(k));
  assert.deepEqual(lost, [], `records whose file is not in the library folder: ${lost.join(', ')}`);
  for (const [k, p] of onDisk) {
    const readable = byStem.get(k).some((e) => ['txt', 'json', 'csv'].includes(e));
    assert.equal(readable, p.text !== 'none', `${k}: text "${p.text}" but the folder ${readable ? 'has' : 'has no'} readable text`);
  }
  const offDisk = papers.filter((p) => !['card', 'no card'].includes(p.status) && byStem.has(key(p))).map(key);
  assert.deepEqual(offDisk, [], `records marked not in the library whose file is there: ${offDisk.join(', ')}`);
  console.log(`library tests: ok (${papers.length} records, ${byStem.size} papers in the folder)`);
} else {
  console.log(`library tests: ok (${papers.length} records); the library folder is not on this machine, so the file checks were skipped`);
}
