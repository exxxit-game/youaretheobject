import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { buildIndex, searchIndex, validateManifest, checkIndex, renderHtml } from '../tools/knowledge.mjs';

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'knowledge-tool-'));
const write = (relative, value) => {
  const target = path.join(fixture, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
};
const manifest = {
  version: 1,
  roots: { repo: '.', papers: 'source-papers', world: 'world', site: 'site' },
  topics: [{ id: 'parallax', label: 'Параллакс движения', terms: ['параллакс', 'motion parallax'] }],
  entries: [
    { id: 'route', title: 'Карточка рабочего маршрута', kind: 'plan', topics: ['parallax'],
      location: { root: 'repo', path: 'docs/route.md' }, purpose: 'Связать наблюдения с проверкой',
      note: 'Размеры ещё не измерены', reading: 'read', expected: 'present', source: 'https://example.org/research' },
    { id: 'world-geometry', title: 'Локальная геометрия', kind: 'directory', topics: ['parallax'],
      location: { root: 'world', path: 'geometry' }, purpose: 'Найти существующие материалы', reading: 'inventory only', expected: 'present' },
    { id: 'missing-original', title: 'Исходник, который пока не найден', kind: 'original', topics: ['parallax'],
      location: { root: 'world', path: 'original.html' }, purpose: 'Отметить известный пробел', reading: 'not read', expected: 'missing' }
  ]
};
const registry = { papers: [
  { id: 'rogers-1979', title: 'Motion parallax as an independent cue for depth perception', authors: 'Rogers and Graham',
    year: '1979', type: 'article', tags: ['motion parallax'], sections: ['perception'], status: 'card', text: 'placeholder',
    card: 'docs/cards/rogers-1979.md', source: 'https://doi.org/10.1068/p080125' },
  { id: 'measurements', dir: 'datasets/room', title: 'Room measurements', authors: 'Test author', year: '2026',
    type: 'dataset', tags: ['measurement'], sections: ['data-sets'], status: 'no card', text: 'none', source: 'javascript:alert(1)' }
] };

try {
  write('docs/library/papers.json', JSON.stringify(registry));
  write('docs/route.md', 'A reference route');
  write('docs/cards/rogers-1979.md', 'Only a card, not a complete paper');
  write('source-papers/papers/rogers-1979.txt', 'An excerpt');
  write('source-papers/datasets/room/measurements.pdf', 'A fixture');
  fs.mkdirSync(path.join(fixture, 'world/geometry'), { recursive: true });

  const index = buildIndex(manifest, fixture);
  assert.equal(index.library.records, 2);
  const found = searchIndex(index, 'параллакс');
  const english = found.find(entry => entry.id === 'paper:rogers-1979');
  assert.ok(english, 'a Russian alias finds an English paper');
  assert.equal(found.at(-1).id, english.id, 'curated references rank ahead of automatically imported metadata');
  assert.equal(english.reading, 'metadata only');
  assert.equal(english.textStatus, 'placeholder', 'an existing excerpt does not turn into a read full paper');
  assert.deepEqual(english.locations.map(item => [item.role, item.exists]), [['card', true], ['txt', true], ['pdf', false]]);
  assert.ok(english.locations[0].url.startsWith('file:///'), 'existing originals have local open links');
  assert.ok(index.entries.find(entry => entry.id === 'world-geometry').locations[0].exists, 'directories are navigable references');
  const dataset = index.entries.find(entry => entry.id === 'paper:datasets/room/measurements');
  assert.ok(dataset.locations.find(item => item.role === 'pdf').exists, 'dataset paths retain their recorded directory');
  assert.equal(dataset.source, null, 'unsafe imported links are not offered');
  assert.equal(searchIndex(index, 'a completely unrelated subject').length, 0);
  assert.equal(searchIndex(index, '', 2).length, 2);

  const specific = structuredClone(index);
  specific.topics.push(
    { id: 'depth', label: 'Глубина', terms: ['motion', 'stereo', 'stable world'] },
    { id: 'memory', label: 'Память', terms: ['память', 'memory'] }
  );
  for (let i = 0; i < 15; i++) specific.entries.push({
    id: `general-${i}`, title: `Общий материал ${i}`, kind: 'index', curated: true,
    topics: ['depth', 'memory'], purpose: 'Общая подборка', locations: [], reading: 'inventory only'
  });
  const glennersterTitle = 'Humans ignore motion and stereo cues in favor of a fictional stable world';
  specific.entries.push(
    { id: 'paper:glennerster-2006', title: glennersterTitle, kind: 'article', curated: false,
      topics: ['depth'], authors: 'Glennerster, Tcheang, Gilson, Fitzgibbon & Parker', tags: ['motion parallax'],
      purpose: 'Research reference', reading: 'metadata only', locations: [] },
    { id: 'paper:shelton-mcnamara-2001', title: 'Systems of Spatial Reference in Human Memory', kind: 'article', curated: false,
      topics: ['memory'], authors: 'Shelton & McNamara', tags: ['spatial memory'],
      purpose: 'Research reference', reading: 'metadata only', locations: [] }
  );
  assert.equal(searchIndex(specific, glennersterTitle)[0].id, 'paper:glennerster-2006', 'an exact paper title stays above broad curated matches within the twelve-result limit');
  const qualified = searchIndex(specific, 'память Shelton');
  assert.equal(qualified[0].id, 'paper:shelton-mcnamara-2001', 'a translated topic keeps the author qualifier');
  assert.ok(!qualified.some(entry => entry.id.startsWith('general-')), 'topic expansion cannot discard an unmatched author qualifier');

  const lexicalManifest = structuredClone(manifest);
  lexicalManifest.topics.push(
    { id: 'observer', label: 'Высота глаз', terms: ['рост', 'height', 'eye height'] },
    { id: 'xr', label: 'Шлем', terms: ['MR', 'VR', '2D'] }
  );
  lexicalManifest.entries.push(
    { id: 'observer-checks', title: 'Рост и высота глаз', kind: 'plan', topics: ['observer'],
      location: { root: 'repo', path: 'docs/route.md' }, purpose: 'Проверить разные ростовые положения', reading: 'read', expected: 'present' },
    { id: 'space-only', title: 'Муар и звук в пространстве', kind: 'plan', topics: [],
      location: { root: 'repo', path: 'docs/route.md' }, purpose: 'Пространство и структурный цвет', reading: 'read', expected: 'present' }
  );
  const lexicalRegistry = structuredClone(registry);
  lexicalRegistry.papers.push({ id: 'armrest', title: 'Armrest avro 12D texture', authors: 'A researcher', year: '2026',
    type: 'article', tags: ['texture'], sections: [], status: 'wanted', text: 'none' });
  write('docs/library/papers.json', JSON.stringify(lexicalRegistry));
  const lexical = buildIndex(lexicalManifest, fixture);
  write('docs/library/papers.json', JSON.stringify(registry));
  assert.deepEqual(searchIndex(lexical, 'рост').map(entry => entry.id), ['observer-checks'], 'рост cannot match the middle of пространство');
  assert.equal(searchIndex(lexical, 'ростов')[0].id, 'observer-checks', 'Russian word prefixes still find an inflected form');
  assert.equal(searchIndex(lexical, 'ростом')[0].id, 'observer-checks', 'a Russian form can use the explicit рост topic alias');
  assert.deepEqual(lexical.entries.find(entry => entry.id === 'paper:armrest').topics, [], 'short aliases are not inferred inside unrelated words');
  for (const query of ['MR', 'VR', '2D']) {
    assert.ok(!searchIndex(lexical, query).some(entry => entry.id === 'paper:armrest'), `${query} requires a complete token`);
  }

  const report = checkIndex(index);
  assert.equal(report.ok, true, 'known missing originals and absent paper copies do not fail the curated-source check');
  assert.equal(report.knownMissing[0].id, 'missing-original');
  assert.ok(report.missingMetadata.some(item => item.id === english.id && item.role === 'pdf'));
  fs.renameSync(path.join(fixture, 'docs/route.md'), path.join(fixture, 'docs/route-moved.md'));
  assert.equal(checkIndex(buildIndex(manifest, fixture)).ok, false, 'a missing required source is detected on the next build');
  const updated = structuredClone(manifest);
  updated.entries[0].location.path = 'docs/route-moved.md';
  updated.roots.papers = 'new-papers';
  write('new-papers/papers/rogers-1979.pdf', 'A newly located copy');
  const refreshed = buildIndex(updated, fixture);
  const moved = refreshed.entries.find(entry => entry.id === english.id);
  assert.equal(checkIndex(refreshed).ok, true);
  assert.deepEqual(moved.locations.map(item => [item.role, item.exists]), [['card', true], ['txt', false], ['pdf', true]], 'root changes are resolved freshly');

  for (const [change, message] of [
    [copy => copy.entries.push(copy.entries[0]), /Duplicate/],
    [copy => copy.topics.push(copy.topics[0]), /Duplicate/],
    [copy => copy.entries[0].topics.push('unknown'), /unknown topic/],
    [copy => { copy.entries[0].location.root = 'unknown'; }, /unknown root/],
    [copy => { copy.entries[0].source = 'javascript:alert(1)'; }, /HTTP/]
  ]) {
    const copy = structuredClone(manifest);
    change(copy);
    assert.throws(() => validateManifest(copy), message);
  }
  const outside = structuredClone(updated);
  outside.entries[0].location.path = '../unrelated.txt';
  assert.throws(() => buildIndex(outside, fixture), /leaves root/, 'the catalogue cannot silently escape its named root');

  const hostile = structuredClone(refreshed);
  hostile.entries[0].title = '</script><img src=x onerror="danger()">';
  const html = renderHtml(hostile);
  assert.ok(!html.includes(hostile.entries[0].title), 'embedded JSON cannot close its script element');
  assert.ok(html.includes('\\u003c/script>'));
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 2);
  assert.equal(JSON.parse(scripts[0][1]).entries[0].title, hostile.entries[0].title);
  const nodes = new Map();
  class Element {
    constructor() { this.children = []; this.textContent = ''; this.value = ''; }
    append(element) { this.children.push(element); }
    replaceChildren() { this.children = []; }
    addEventListener() {}
  }
  for (const id of ['knowledge-data', 'query', 'count', 'results']) nodes.set(id, new Element());
  nodes.get('knowledge-data').textContent = scripts[0][1];
  const runtime = { document: { getElementById: id => nodes.get(id), createElement: () => new Element() } };
  vm.runInNewContext(scripts[1][1], runtime);
  assert.equal(runtime.searchIndex(specific, glennersterTitle)[0].id, 'paper:glennerster-2006', 'the exported page uses the same exact-title ranking');
  assert.equal(runtime.searchIndex(specific, 'память Shelton')[0].id, 'paper:shelton-mcnamara-2001', 'the exported page keeps author qualifiers too');
  assert.equal(runtime.searchIndex(lexical, 'рост')[0].id, 'observer-checks', 'the exported page uses the same word boundaries');
  assert.ok(!runtime.searchIndex(lexical, 'рост').some(entry => entry.id === 'space-only'));
  assert.ok(nodes.get('results').children.some(article => article.children.some(child => child.textContent === hostile.entries[0].title)), 'rendered titles are text, including hostile-looking source content');
  assert.ok(!html.includes('innerHTML'), 'search rendering uses text content');
  assert.ok(!html.includes('fetch('), 'the exported catalogue requires no network access');

  fs.unlinkSync(path.join(fixture, 'docs/library/papers.json'));
  const missingRegistry = buildIndex(updated, fixture);
  assert.equal(missingRegistry.entries.length, updated.entries.length);
  assert.equal(missingRegistry.library.exists, false);
  assert.ok(checkIndex(missingRegistry).libraryError, 'an unavailable metadata registry is visible');
  console.log('knowledge: aliases, live paths, missing sources, validation and safe offline HTML pass');
} finally {
  const parent = fs.realpathSync(os.tmpdir());
  assert.equal(path.dirname(fixture), parent, 'cleanup stays inside the temporary directory');
  assert.ok(path.basename(fixture).startsWith('knowledge-tool-'));
  fs.rmSync(fixture, { recursive: true, force: true });
}
