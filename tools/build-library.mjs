// Builds the index of the papers library from docs/library/papers.json: docs/library.md (always cheap
// to read: one line per section, the status counts) and docs/library/<section>.md (one line per paper),
// wanted.md and coverage.md. Progressive disclosure, as Anthropic's skills load metadata first and the
// body on demand; one record per item with Dublin Core-like fields (creator, date, title, subject, type,
// relation), as library catalogues and Zotero keep them. The files are never edited by hand, so they
// cannot drift from the records; tests/library.test.mjs fails when they are stale.
// Usage: node tools/build-library.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const JSON_PATH = 'docs/library/papers.json';
const MAX_LINES = 250;   // docs stay under 300 lines (tests/structure.test.mjs); a longer section is split
const TITLE_MAX = 140;
const ON_DISK = ['card', 'no card'];
const STATUS_ORDER = ['card', 'no card', 'wanted', 'read-not-saved', 'dropped'];
const TEXT_ORDER = ['ok', 'ocr', 'placeholder', 'none'];

export function loadLibrary(root = ROOT) {
  return JSON.parse(fs.readFileSync(path.join(root, JSON_PATH), 'utf8'));
}

const byKey = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const key = (p) => (p.dir ? `${p.dir}/` : '') + p.id;
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '...' : s);
const shortAuthors = (a) => {
  if (/ et al\./.test(a)) return a.split(/,| et al\./)[0].trim() + ' et al.';
  const names = a.split(/, | & /);
  return names.length > 2 ? `${names[0]} et al.` : a;
};
const counts = (items, f) => items.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const sectionFiles = (lib) => {
  // one file per section, or numbered parts when a section outgrows a readable doc
  const files = {};
  for (const s of lib.sections) {
    const n = lib.papers.filter((p) => p.sections.includes(s.id)).length;
    const parts = Math.max(1, Math.ceil((n + 12) / MAX_LINES));
    files[s.id] = parts === 1 ? [`${s.id}.md`] : Array.from({ length: parts }, (_, i) => `${s.id}-${i + 1}.md`);
  }
  return files;
};
const topTags = (papers, n) => Object.entries(counts(papers.flatMap((p) => p.tags), (t) => t))
  .sort((a, b) => b[1] - a[1] || byKey(a[0], b[0])).slice(0, n).map(([t]) => t);

function paperLine(p) {
  const bits = [`- **${key(p)}** ${shortAuthors(p.authors)} ${p.year}. ${clip(p.title, TITLE_MAX)}`, p.tags.join(', ')];
  if (p.status === 'card') bits.push(`[card](../${p.card.replace(/^docs\//, '')})`);
  else if (p.status === 'wanted') bits.push('wanted (wanted.md)');
  else if (p.status === 'read-not-saved') bits.push('read, not saved (wanted.md)');
  else bits.push(p.status);
  if (ON_DISK.includes(p.status) && p.text !== 'ok') bits.push(`text: ${p.text}`);
  if (p.relation) bits.push(p.relation);
  if (p.note) bits.push(p.note);
  return bits.join(' · ');
}

function renderSection(lib, s, files) {
  const papers = lib.papers.filter((p) => p.sections.includes(s.id));
  const here = papers.filter((p) => ON_DISK.includes(p.status)).sort((a, b) => byKey(key(a), key(b)));
  const away = papers.filter((p) => !ON_DISK.includes(p.status)).sort((a, b) => byKey(key(a), key(b)));
  const lines = [...here.map(paperLine), ...(away.length ? ['', '## Not in the library', '', ...away.map(paperLine)] : [])];
  const per = Math.ceil(lines.length / files.length);
  return files.map((f, i) => [
    `# ${s.name}${files.length > 1 ? ` (part ${i + 1} of ${files.length})` : ''}`,
    '',
    'Generated from `docs/library/papers.json` by `node tools/build-library.mjs`. Do not edit by hand.',
    `${papers.length} papers. Each line: id, authors and year, title, tags, then the card or the status. The text is`,
    'in the library folder\'s papers\\ as `<id>.txt` (a data set: `<dir>/<id>.txt` from the library folder); "text: ocr" marks a scan\'s',
    'text, "placeholder" an excerpt. Index of all sections: [library](../library.md).',
    '',
    ...lines.slice(i * per, (i + 1) * per),
    ''
  ].join('\n'));
}

function renderWanted(lib) {
  const pick = (st) => lib.papers.filter((p) => p.status === st);
  const rank = { high: 0, medium: 1, low: 2 };
  const cite = (p) => `${p.authors} (${p.year}). ${p.title}`;
  const link = (p) => (p.source ? `[link](${p.source})` : '-');
  const cell = (s) => String(s).replace(/\|/g, '/');
  const wanted = pick('wanted').sort((a, b) => rank[a.priority] - rank[b.priority] || byKey(a.id, b.id));
  return [
    '# Papers not in the library',
    '',
    'Generated from `docs/library/papers.json` by `node tools/build-library.mjs`. Do not edit by hand.',
    'Papers still wanted, read but never saved, or dropped. A legal copy goes into the library folder as',
    '`<id>.pdf` and `<id>.txt` (`pdftotext <id>.pdf <id>.txt`); then its record changes status and a card can be',
    'written (`docs/cards/README.md`).',
    '',
    'Legal ways, cheapest first: Google Scholar may show a free [PDF] on the right; write to the corresponding',
    'author or use "Request full-text" on ResearchGate; a library; buying the article. Never Sci-Hub or LibGen,',
    'never around a CAPTCHA or bot check (the owner opens such pages in his own browser). Pages only the owner',
    'can open, with what to bring back: `docs/research/own-experiments-now-2.md`.',
    '',
    `## Wanted (${wanted.length})`,
    '',
    '| Priority | Id | Paper | Link | Next legal step |',
    '|---|---|---|---|---|',
    ...wanted.map((p) => `| ${p.priority} | ${p.card ? `[${p.id}](../${p.card.replace(/^docs\//, '')})` : p.id} | ${cell(cite(p))} | ${link(p)} | ${cell(p.reason)} |`),
    '',
    `## Read but not saved (${pick('read-not-saved').length})`,
    '',
    '| Id | Paper | Link | Where it was read |',
    '|---|---|---|---|',
    ...pick('read-not-saved').sort((a, b) => byKey(a.id, b.id)).map((p) => `| ${p.id} | ${cell(cite(p))} | ${link(p)} | ${cell(p.reason)} |`),
    '',
    `## Dropped (${pick('dropped').length})`,
    '',
    '| Id | Paper | Why |',
    '|---|---|---|',
    ...pick('dropped').sort((a, b) => byKey(a.id, b.id)).map((p) => `| ${p.id} | ${cell(cite(p))} | ${cell(p.reason)} |`),
    ''
  ].join('\n');
}

function renderCoverage(lib) {
  const cards = new Set(lib.papers.filter((p) => p.card).map((p) => p.card));
  const ref = (id) => (cards.has(`docs/cards/${id}.md`) ? `[${id}](../cards/${id}.md)` : id);
  const groups = [...new Set(lib.coverage.areas.map((a) => a.group))];
  return [
    '# Search coverage',
    '',
    'Generated from `docs/library/papers.json` by `node tools/build-library.mjs`. Do not edit by hand.',
    'Every area of human-subject science that could give a room, and what the search with the card method',
    '(`docs/cards/README.md`) found. An area is closed when an agent searched it across languages and either',
    'carded what fits or wrote why nothing fits. The ranked result is `docs/catalog.md`; papers still missing',
    'are in [wanted.md](wanted.md).',
    '',
    `Languages searched: ${lib.coverage.languages}`,
    '',
    ...groups.flatMap((g) => [
      `## ${g}`,
      '',
      '| Area | Cards | Note |',
      '|---|---|---|',
      ...lib.coverage.areas.filter((a) => a.group === g).map((a) => `| ${a.area} | ${a.papers.map(ref).join(', ')} | ${a.note || ''} |`),
      ''
    ])
  ].join('\n');
}

function renderIndex(lib, files) {
  const all = lib.papers;
  const st = counts(all, (p) => p.status), tx = counts(all.filter((p) => ON_DISK.includes(p.status)), (p) => p.text);
  const rel = counts(all.filter((p) => p.relation), (p) => p.relation.split(' ')[0]);
  const fmt = (order, c) => order.filter((k) => c[k]).map((k) => `${k} ${c[k]}`).join(' · ');
  return [
    '# Papers library',
    '',
    'Generated from `docs/library/papers.json` by `node tools/build-library.mjs`. Do not edit by hand.',
    '',
    'How to find a paper: pick the section whose keywords fit and open its file (one line per paper: id,',
    'authors, year, title, tags, status); if the line links a card, read the card (checked quotes, verdict);',
    `only then open the text, \`<id>.txt\` in ${lib.root}\\papers\\ ("ocr": a scan's text, "placeholder": an`,
    'excerpt). A phenomenon by name: search `docs/library/papers.json`, every record carries its tags.',
    '',
    '## Sections',
    '',
    ...lib.sections.map((s) => {
      const papers = all.filter((p) => p.sections.includes(s.id));
      // keywords from the papers themselves: a supplement or a second copy would count its paper twice
      const own = papers.filter((p) => !/^(supplement|duplicate) of/.test(p.relation || ''));
      const links = files[s.id].map((f, i) => `[${files[s.id].length > 1 ? `${s.name} ${i + 1}` : s.name}](library/${f})`).join(', ');
      return `- ${links} (${papers.length}): ${topTags(own, 10).join(', ')}`;
    }),
    '',
    '## Status',
    '',
    `${all.length} records: ${fmt(STATUS_ORDER, st)}. Text of the papers on disk: ${fmt(TEXT_ORDER, tx)}.`,
    `Relations: ${Object.entries(rel).sort((a, b) => byKey(a[0], b[0])).map(([k, v]) => `${k} ${v}`).join(' · ')}.`,
    'Not in the library (wanted, read but not saved, dropped): [wanted](library/wanted.md). Areas searched',
    'for rooms: [coverage](library/coverage.md). Experiment cards: [catalog](catalog.md).',
    ''
  ].join('\n');
}

// Every generated file, keyed by its path from the repository root.
export function render(lib) {
  const files = sectionFiles(lib);
  const out = { 'docs/library.md': renderIndex(lib, files) };
  for (const s of lib.sections) {
    renderSection(lib, s, files[s.id]).forEach((text, i) => { out[`docs/library/${files[s.id][i]}`] = text; });
  }
  out['docs/library/wanted.md'] = renderWanted(lib);
  out['docs/library/coverage.md'] = renderCoverage(lib);
  return out;
}

// Generated files on disk that render() no longer produces (a section renamed or merged).
export function staleFiles(out, root = ROOT) {
  return fs.readdirSync(path.join(root, 'docs/library')).filter((f) => f.endsWith('.md'))
    .map((f) => `docs/library/${f}`).filter((f) => !(f in out));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = render(loadLibrary());
  const read = (f) => (fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n') : null);
  if (process.argv.includes('--check')) {
    const bad = [...Object.keys(out).filter((f) => read(f) !== out[f]), ...staleFiles(out)];
    if (bad.length) { console.error(`library index out of date (${bad.join(', ')}): run node tools/build-library.mjs`); process.exit(1); }
    console.log('library index up to date');
  } else {
    for (const f of staleFiles(out)) fs.rmSync(path.join(ROOT, f));
    for (const [f, text] of Object.entries(out)) fs.writeFileSync(path.join(ROOT, f), text);
    console.log(`library index: ${Object.keys(out).length} files from ${loadLibrary().papers.length} records`);
  }
}
