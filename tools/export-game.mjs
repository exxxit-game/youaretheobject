// Export public game files with an atomic code update and shared, verified chunks.
// Original paths remain available for browsers without persistent worker storage.
import fs from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deliveryFiles, makePack, hash, ROOT } from './delivery-pack.mjs';
import { deliveryWorker } from '../src/delivery-worker.js';
import { DELIVERY_T } from '../src/app/texts.ru.js';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };
const escaped = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const isCore = name => name === 'index.html' || name === 'privacy.html'
  || (name.startsWith('src/') && name.endsWith('.js')) || name.startsWith('css/')
  || /^vendor\/aframe-[\d.]+\.min\.js$/.test(name) || name.startsWith('vendor/fonts/');

// Keep published immutable pieces for still-open old tabs. Never copy arbitrary files.
export function retainObjects(previous, output) {
  const from = path.join(previous, 'delivery/objects');
  if (!fs.existsSync(from)) return 0;
  const to = path.join(output, 'delivery/objects'); fs.mkdirSync(to, { recursive: true });
  let count = 0;
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    if (!item.isFile() || !/^[a-f0-9]{64}\.bin(?:\.gz)?$/.test(item.name)) throw new Error('Unexpected retained object');
    const data = fs.readFileSync(path.join(from, item.name));
    if (hash(item.name.endsWith('.gz') ? gunzipSync(data, { maxOutputLength: 262144 }) : data) !== item.name.slice(0,64)) throw new Error('Corrupt retained object');
    if (!fs.existsSync(path.join(to, item.name))) { fs.writeFileSync(path.join(to, item.name), data); count++; }
  }
  return count;
}

export function prepareDelivery(directory) {
  const index = path.join(directory, 'index.html');
  const original = fs.readFileSync(index, 'utf8');
  if (original.includes('data-delivery=')) throw new Error('Already exported');
  // This module is also part of the fingerprint checked before a preview publication.
  const game = original.replace('<html ', '<html data-delivery="game" ')
    .replace('</head>', '  <script type="module" src="src/delivery-boot.js"></script>\n</head>');
  const entries = deliveryFiles(directory).map(file => ({ ...file, data: file.path === 'index.html' ? Buffer.from(game) : file.data }));
  const pack = makePack(entries);
  const compressed = new Map([...pack.objects].map(([sha, bytes]) => [sha, gzipSync(bytes, { level: 9 })])
    .filter(([sha, bytes]) => bytes.length < pack.objects.get(sha).length));
  const body = { schema: 1, scope: 'public-game', chunkBytes: pack.manifest.chunkBytes,
    files: pack.manifest.files.map(file => ({ ...file, parts: file.parts.map(part => ({ ...part, ...(compressed.has(part.sha256) ? { gzipBytes: compressed.get(part.sha256).length } : {}) })), core: isCore(file.path), type: TYPES[path.extname(file.path)] || 'application/octet-stream' })) };
  const manifest = { ...body, version: hash(JSON.stringify(body)) };
  const objects = path.join(directory, 'delivery/objects'); fs.mkdirSync(objects, { recursive: true });
  for (const [sha, bytes] of pack.objects) fs.writeFileSync(path.join(objects, sha + '.bin'), bytes);
  for (const [sha, bytes] of compressed) fs.writeFileSync(path.join(objects, sha + '.bin.gz'), bytes);
  // Git must not normalize text-looking chunks: their URL pins exact bytes.
  fs.writeFileSync(path.join(directory, '.gitattributes'), 'delivery/objects/** -text\n');
  fs.writeFileSync(path.join(directory, 'delivery/manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(directory, 'delivery-worker.js'), `(${deliveryWorker.toString()})(${JSON.stringify(manifest)});\n`);
  fs.writeFileSync(path.join(directory, 'uncached.html'), original);
  const robots = original.match(/<meta name="robots"[^>]+>/)?.[0] || '';
  fs.writeFileSync(index, `<!doctype html>
<html lang="ru" data-delivery="prepare"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  ${robots}<title>You are the object</title>
  <link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/delivery.css">
  <script type="module" src="src/delivery-boot.js"></script>
</head><body><main class="delivery">
  <h1>You are the object</h1>
  <p id="delivery-status" data-failed="${escaped(DELIVERY_T.failed)}">${escaped(DELIVERY_T.preparing)}</p>
  <button id="delivery-retry" hidden>${escaped(DELIVERY_T.retry)}</button>
  <button id="delivery-plain" hidden>${escaped(DELIVERY_T.plain)}</button>
  <noscript>${escaped(DELIVERY_T.scripting)}</noscript>
</main></body></html>\n`);
  return manifest;
}

export function exportGame(root, output, { previous, preview = false } = {}) {
  fs.mkdirSync(output); // Existing exports must never be overwritten.
  for (const file of deliveryFiles(root)) {
    const target = path.join(output, file.path); fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.data);
  }
  const index = path.join(output, 'index.html');
  if (preview) fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">'));
  fs.writeFileSync(path.join(output, '.nojekyll'), '');
  const manifest = prepareDelivery(output);
  if (previous) retainObjects(previous, output);
  return manifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args[0] !== '--out' || !args[1] || (args.length !== 2 && (args.length !== 4 || args[2] !== '--previous')))
    throw new Error('Usage: node tools/export-game.mjs --out NEW_DIRECTORY [--previous PREVIOUS_EXPORT]');
  const manifest = exportGame(ROOT, path.resolve(args[1]), { previous: args[3] && path.resolve(args[3]), preview: true });
  console.log(JSON.stringify({ version: manifest.version, files: manifest.files.length,
    totalBytes: manifest.files.reduce((n, file) => n + file.bytes, 0),
    coreBytes: manifest.files.filter(file => file.core).reduce((n, file) => n + file.bytes, 0) }, null, 2));
}
