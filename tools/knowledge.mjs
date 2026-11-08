// One navigation index over existing files and the papers registry. No source files are copied.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadLibrary, JSON_PATH } from './build-library.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MANIFEST_PATH = 'docs/research/perception-knowledge.json';
const validUrl = value => {
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};
function wordsOf(value) {
  return String(value || '').normalize('NFKC').toLowerCase().replaceAll('ё', 'е').match(/[\p{L}\p{N}]+/gu) || [];
}
function wordMatches(word, term) {
  return word === term || (term.length >= 3 && /^[а-я]+$/u.test(term) && word.startsWith(term));
}
function hasPhrase(value, phrase) {
  const words = Array.isArray(value) ? value : wordsOf(value);
  const wanted = wordsOf(phrase);
  return wanted.length > 0 && words.some((word, at) => wanted.every((term, i) =>
    words[at + i] !== undefined && wordMatches(words[at + i], term)));
}

export function validateManifest(manifest) {
  if (manifest?.version !== 1 || !manifest.roots || !Array.isArray(manifest.topics) || !Array.isArray(manifest.entries)) {
    throw new Error('Expected manifest version 1, roots, topics and entries');
  }
  for (const [name, value] of Object.entries(manifest.roots)) {
    if (!name || typeof value !== 'string' || !value.trim()) throw new Error(`Invalid root: ${name}`);
  }
  for (const required of ['repo', 'papers']) {
    if (!Object.hasOwn(manifest.roots, required)) throw new Error(`Missing root: ${required}`);
  }
  const topics = new Set(), ids = new Set();
  for (const topic of manifest.topics) {
    if (!topic.id || topics.has(topic.id)) throw new Error(`Duplicate or empty topic id: ${topic.id}`);
    if (!topic.label || !Array.isArray(topic.terms) || topic.terms.some(term => typeof term !== 'string' || !term.trim())) {
      throw new Error(`Invalid topic: ${topic.id}`);
    }
    topics.add(topic.id);
  }
  for (const entry of manifest.entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or empty entry id: ${entry.id}`);
    ids.add(entry.id);
    for (const field of ['title', 'kind', 'purpose', 'reading']) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) throw new Error(`${entry.id}: missing ${field}`);
    }
    if (!Array.isArray(entry.topics) || entry.topics.some(id => !topics.has(id))) throw new Error(`${entry.id}: unknown topic`);
    if (!Object.hasOwn(manifest.roots, entry.location?.root)) throw new Error(`${entry.id}: unknown root`);
    if (typeof entry.location.path !== 'string' || path.isAbsolute(entry.location.path)) throw new Error(`${entry.id}: expected relative path`);
    if (!['present', 'missing'].includes(entry.expected)) throw new Error(`${entry.id}: invalid expected state`);
    if (entry.source && !validUrl(entry.source)) throw new Error(`${entry.id}: source must be an HTTP(S) URL`);
  }
  return manifest;
}

function location(roots, root, relative, role) {
  const absolute = path.resolve(roots[root], relative);
  const inside = path.relative(roots[root], absolute);
  if (inside === '..' || inside.startsWith(`..${path.sep}`) || path.isAbsolute(inside)) throw new Error(`Path leaves root ${root}: ${relative}`);
  return { role, path: absolute, url: pathToFileURL(absolute).href, exists: fs.existsSync(absolute) };
}

export function buildIndex(manifest, repoRoot = ROOT) {
  validateManifest(manifest);
  const roots = Object.fromEntries(Object.entries(manifest.roots).map(([id, value]) => [id, path.resolve(repoRoot, value)]));
  const entries = manifest.entries.map(entry => ({ ...entry, curated: true,
    locations: [location(roots, entry.location.root, entry.location.path, 'source')] }));
  const libraryPath = path.join(repoRoot, JSON_PATH);
  const library = { path: libraryPath, exists: fs.existsSync(libraryPath), records: 0, error: null };
  let papers = [];
  try {
    const source = loadLibrary(repoRoot);
    if (!Array.isArray(source.papers)) throw new Error('Paper registry has no papers array');
    papers = source.papers;
    library.records = papers.length;
  }
  catch (error) { library.error = error.message; }
  for (const paper of papers) {
    const key = paper.dir ? `${paper.dir}/${paper.id}` : paper.id;
    const id = `paper:${key}`;
    if (entries.some(entry => entry.id === id)) throw new Error(`Duplicate entry id: ${id}`);
    const haystack = wordsOf([paper.id, paper.title, ...(paper.tags || []), ...(paper.sections || [])].join(' '));
    const topics = manifest.topics.filter(topic => [topic.id, topic.label, ...topic.terms]
      .some(term => hasPhrase(haystack, term))).map(topic => topic.id);
    const stem = paper.dir ? `${paper.dir}/${paper.id}` : `papers/${paper.id}`;
    const locations = paper.card ? [location(roots, 'repo', paper.card, 'card')] : [];
    for (const extension of ['txt', 'pdf']) locations.push(location(roots, 'papers', `${stem}.${extension}`, extension));
    entries.push({ id, title: paper.title, kind: paper.type, curated: false, topics,
      tags: paper.tags || [], authors: paper.authors, year: paper.year,
      purpose: paper.relation || paper.reason || 'Research reference', note: paper.note || '',
      reading: 'metadata only', metadataStatus: paper.status, textStatus: paper.text,
      source: validUrl(paper.source) ? paper.source : null, locations });
  }
  return { sourceFile: path.join(repoRoot, MANIFEST_PATH), builtAt: new Date().toISOString(), roots,
    topics: manifest.topics, entries, library };
}

// This same function runs in the generated page, keeping aliases and ranking consistent.
export function searchIndex(index, query, limit = 12) {
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replaceAll('ё', 'е');
  const text = normalize(query).trim();
  const words = wordsOf(text);
  const matchedTopics = index.topics.map(topic => {
    const terms = [topic.id, topic.label, ...topic.terms].map(normalize);
    const matched = terms.filter(term => hasPhrase(words, term) || (words.length === 1 && hasPhrase(term, text)));
    return { id: topic.id, terms, matched };
  }).filter(topic => topic.matched.length);
  const aliases = matchedTopics.flatMap(topic => topic.terms);
  const covered = matchedTopics.flatMap(topic => topic.matched.flatMap(wordsOf));
  const qualifiers = words.filter(word => !covered.some(term => wordMatches(word, term) || wordMatches(term, word)));
  return index.entries.map(entry => {
    const title = wordsOf(entry.title), authors = wordsOf(entry.authors);
    const haystack = wordsOf([entry.id, entry.title, entry.kind, entry.purpose, entry.note,
      entry.authors, entry.year, ...(entry.tags || []), ...entry.topics].join(' '));
    const contains = (source, term) => source.some(word => wordMatches(word, term));
    const direct = words.every(word => contains(haystack, word));
    const related = matchedTopics.some(topic => entry.topics.includes(topic.id)) || aliases.some(alias => hasPhrase(haystack, alias));
    if (words.length && !direct && !(related && qualifiers.every(word => contains(haystack, word)))) return null;
    const exactTitle = words.length && title.join(' ') === words.join(' ');
    const titleMatch = words.length && words.every(word => contains(title, word));
    const authorWords = qualifiers.length ? qualifiers : words;
    const authorMatch = authorWords.length && authorWords.every(word => contains(authors, word));
    const rank = !words.length ? 0 : exactTitle ? 4 : direct ? 3 : qualifiers.length ? 2 : 1;
    const score = rank * 10000 + (entry.curated ? 100 : 0) + (titleMatch ? 500 : 0)
      + (authorMatch ? 300 : 0) + (text && normalize(entry.id) === text ? 700 : 0);
    return { entry, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
    .slice(0, Math.max(0, limit)).map(result => result.entry);
}

export function checkIndex(index) {
  const missingRequired = index.entries.filter(entry => entry.curated && entry.expected === 'present')
    .flatMap(entry => entry.locations.filter(item => !item.exists).map(item => ({ id: entry.id, path: item.path })));
  const knownMissing = index.entries.filter(entry => entry.curated && entry.expected === 'missing')
    .flatMap(entry => entry.locations.filter(item => !item.exists).map(item => ({ id: entry.id, path: item.path })));
  const missingMetadata = index.entries.filter(entry => !entry.curated)
    .flatMap(entry => entry.locations.filter(item => !item.exists).map(item => ({ id: entry.id, role: item.role, path: item.path })));
  return { ok: !missingRequired.length && !index.library.error, missingRequired, knownMissing,
    missingMetadata, libraryError: index.library.error };
}

export function renderHtml(index) {
  const data = JSON.stringify(index).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
  return `<!doctype html>
<html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Знания для коридора восприятия</title>
<style>
body{margin:0;font:16px/1.5 system-ui,sans-serif;background:#f5f6f3;color:#202722}
main{max-width:980px;margin:auto;padding:28px 20px}h1{font-size:26px}input{box-sizing:border-box;width:100%;font:inherit;padding:12px}
article{border-top:1px solid #c9d0c9;padding:15px 0}h2{font-size:19px;margin:0}p{margin:7px 0}.small{font-size:14px;color:#455447}
ul{padding-left:22px}li{overflow-wrap:anywhere}a{color:#165e89}code{overflow-wrap:anywhere}strong{font-weight:600}
</style><main><h1>Знания для коридора восприятия</h1>
<p>Каталог связывает существующие материалы. Запись о статье означает только знакомство с её метаданными. Наличие файла проверено при сборке каталога.</p>
<p>Наличие источника само по себе не подтверждает, что основанный на нём опыт создан и проверен.</p>
<p><strong>Перед действием.</strong> Опереться на знания людей, понять вклад в цель и последствия, выбрать проверку и закончить подготовку до участия владельца.</p>
<label for="query">Тема, название или автор</label><input id="query" type="search" placeholder="Например, анаморфоз или память" autocomplete="off">
<p id="count" class="small" aria-live="polite"></p><div id="results"></div>
<script id="knowledge-data" type="application/json">${data}</script>
<script>
const index = JSON.parse(document.getElementById('knowledge-data').textContent);
${wordsOf.toString()}
${wordMatches.toString()}
${hasPhrase.toString()}
${searchIndex.toString()}
const query = document.getElementById('query');
const results = document.getElementById('results');
function add(parent, tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}
function render() {
  const found = searchIndex(index, query.value, index.entries.length);
  document.getElementById('count').textContent = 'Найдено ' + found.length + '. Показаны первые 12. Проверка файлов ' + index.builtAt + '.';
  results.replaceChildren();
  for (const entry of found.slice(0, 12)) {
    const article = add(results, 'article', '');
    add(article, 'h2', entry.title);
    add(article, 'p', entry.id + ' · ' + entry.kind, 'small');
    add(article, 'p', entry.purpose);
    if (entry.note) add(article, 'p', entry.note);
    const reading = entry.reading === 'metadata only' ? 'пока только запись в реестре' : entry.reading;
    add(article, 'p', 'Чтение — ' + reading + (entry.metadataStatus ? ' · Прежний реестр — ' + entry.metadataStatus + ' · Текст — ' + entry.textStatus : ''), 'small');
    if (entry.anchor) add(article, 'p', 'Место в источнике — ' + entry.anchor, 'small');
    const list = add(article, 'ul', '');
    for (const item of entry.locations) {
      const row = add(list, 'li', (item.exists ? 'Есть' : 'Отсутствует') + ' · ' + item.role + ' · ', 'small');
      if (item.exists && String(item.url).startsWith('file:///')) {
        const link = add(row, 'a', item.path); link.href = item.url;
      } else add(row, 'span', item.path);
    }
    if (entry.source && /^https?:/i.test(entry.source)) {
      const link = add(article, 'a', 'Открыть первоисточник');
      link.href = entry.source; link.rel = 'noreferrer';
    }
  }
}
query.addEventListener('input', render);
render();
</script></main></html>`;
}

function main() {
  const args = process.argv.slice(2);
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, MANIFEST_PATH), 'utf8'));
  const index = buildIndex(manifest);
  if (index.library.error) console.error(`Paper registry unavailable: ${index.library.error}`);
  if (args.includes('--check')) {
    const report = checkIndex(index);
    console.log(JSON.stringify({ ...report, missingMetadata: report.missingMetadata.slice(0, 12), missingMetadataCount: report.missingMetadata.length }, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } else if (args.includes('--html')) {
    const target = args[args.indexOf('--html') + 1];
    if (!target || !path.isAbsolute(target)) throw new Error('Supply an absolute HTML output filename');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderHtml(index));
    console.log(`Written ${target}`);
  } else {
    const query = args.filter(arg => arg !== '--json').join(' ');
    if (!query) {
      console.log(`Usage: node tools/knowledge.mjs <query> [--json] | --check | --html ABS_PATH\n${index.entries.length} entries (${index.library.records} paper records). Source: ${MANIFEST_PATH}`);
      return;
    }
    const found = searchIndex(index, query);
    if (args.includes('--json')) console.log(JSON.stringify(found, null, 2));
    else for (const entry of found) {
      console.log(`${entry.title}\n${entry.id} | ${entry.kind}\n${entry.purpose}\nReading: ${entry.reading}`);
      if (entry.metadataStatus) console.log(`Registry: ${entry.metadataStatus}; text: ${entry.textStatus}`);
      for (const item of entry.locations) console.log(`${item.exists ? 'present' : 'missing'} | ${item.role} | ${item.path}`);
      if (entry.source) console.log(entry.source);
      console.log('');
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
