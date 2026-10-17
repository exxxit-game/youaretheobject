// Actual serialized worker logic, real HTTP parts, isolated Cache API and lifecycle events.
import assert from 'node:assert/strict';
import http from 'node:http';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { deliveryWorker } from '../src/delivery-worker.js';
import { makePack, hash } from '../tools/delivery-pack.mjs';
import { isCore } from '../tools/export-game.mjs';

class Cache {
  data = new Map();
  key(request) { return typeof request === 'string' ? request : request.url; }
  async match(request) { return this.data.get(this.key(request))?.clone(); }
  async put(request, response) { if (this.blocked && this.key(request).endsWith(this.blocked+'.bin')) throw Error('Quota exceeded'); this.data.set(this.key(request), response.clone()); }
  async delete(request) { return this.data.delete(this.key(request)); }
  async keys() { return [...this.data.keys()].map(url => new Request(url)); }
}
const stores = new Map();
const storage = { async open(name) { if (!stores.has(name)) stores.set(name, new Cache()); return stores.get(name); } };
const model = Buffer.alloc(800000);
for (let i = 0; i < model.length; i++) model[i] = (i * 7 + Math.floor(i / 262144)) % 251;
function release(label) {
  const pack = makePack([{ path: 'index.html', data: Buffer.from('<html>' + label + '</html>') },
    { path: 'src/main.js', data: Buffer.from('shared code') }, { path: 'vendor/controller.glb', data: model }]);
  const manifest = { ...pack.manifest, files: pack.manifest.files.map(file => ({ ...file, core: isCore(file.path), type: file.path.endsWith('.html') ? 'text/html' : 'application/octet-stream' })) };
  return { manifest, objects: pack.objects };
}
const a = release('A'), b = release('B'), all = new Map([...a.objects, ...b.objects]);
let bad = '', mode = '', calls = [], offline = false, wireGzip = false;
const server = http.createServer((req, res) => {
  const sha = req.url.match(/\/([a-f0-9]{64})\.bin(?:\.gz)?$/)?.[1]; calls.push(sha);
  const data = all.get(sha);
  if (offline || !data || (sha === bad && mode === 'missing')) { res.writeHead(503).end(); return; }
  if (sha === bad && mode === 'redirect') { res.writeHead(302, { Location: '/challenge' }).end(); return; }
  const body = req.url.endsWith('.gz') ? gzipSync(data) : Buffer.from(data);
  if(wireGzip && req.url.endsWith('.gz'))res.setHeader('Content-Encoding','gzip');
  if (sha === bad && mode === 'corrupt') body[0] ^= 1;
  if (sha === bad && mode === 'oversize') { res.end(Buffer.concat([body, Buffer.from('x')])); return; }
  res.end(body);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/object-preview/`;
function worker(manifest, compressed = false) {
  const handlers = {};
  vm.runInNewContext(`(${deliveryWorker.toString()})(manifest)`, {
    manifest, self: { registration: { scope: base }, addEventListener: (type, fn) => { handlers[type] = fn; } },
    caches: storage, crypto: webcrypto, fetch, URL, Response, Request, ReadableStream,
    AbortController, setTimeout, clearTimeout, console, ...(compressed ? { DecompressionStream } : {})
  });
  return {
    lifecycle(type) { let task; handlers[type]({ waitUntil(promise) { task = promise; } }); return task; },
    request(path = '', options) { let response; handlers.fetch({ request: new Request(new URL(path, base), options), respondWith(promise) { response = promise; } }); return response; }
  };
}
try {
  const first = worker(a.manifest);
  await first.lifecycle('install'); await first.lifecycle('activate');
  assert.equal(calls.length, 2, 'initial install fetches only core, not controller models');
  assert.equal(await (await first.request()).text(), '<html>A</html>');
  assert.equal((await first.request()).headers.get('X-Object-Version'), a.manifest.version);
  assert.equal(calls.length, 2, 'core and repeated entry page are read from persistent parts');
  assert.equal(first.request('api/results', { method: 'POST', body: 'private' }), undefined);
  assert.equal(first.request('index.html', { headers: { Authorization: 'Bearer test' } }), undefined);
  assert.equal(first.request('https://example.test/index.html'), undefined);
  const lazy = a.manifest.files.find(f => f.path.endsWith('.glb'));
  const before = calls.length;
  const partial = await first.request(lazy.path, { headers: { Range: 'bytes=100-199' } });
  assert.equal(partial.status, 206); assert.equal(partial.headers.get('Content-Range'), 'bytes 100-199/800000');
  assert.deepEqual(Buffer.from(await partial.arrayBuffer()), model.subarray(100,200));
  assert.equal(calls.length - before, 1, 'range downloads only its needed chunk');
  assert.deepEqual(Buffer.from(await (await first.request(lazy.path)).arrayBuffer()), model);
  const loaded = calls.length;
  offline = true;
  assert.deepEqual(Buffer.from(await (await worker(a.manifest).request(lazy.path)).arrayBuffer()), model, 'new worker instance reuses persistent cache offline');
  assert.equal(calls.length, loaded);
  assert.equal((await first.request(lazy.path, { headers: { Range: 'bytes=999999-' } })).status, 416);
  const suffix = await first.request(lazy.path, { headers: { Range: 'bytes=-7' } });
  assert.deepEqual(Buffer.from(await suffix.arrayBuffer()), model.subarray(-7));
  offline = false;
  bad = b.manifest.files[0].parts[0].sha256; mode = 'missing';
  await assert.rejects(worker(b.manifest).lifecycle('install'), /503/);
  assert.equal(await (await first.request()).text(), '<html>A</html>', 'failed candidate leaves active A intact');
  mode = '';
  const quotaCache = await storage.open('object-public-v1:' + base + ':parts'); quotaCache.blocked = bad;
  await assert.rejects(worker(b.manifest).lifecycle('install'), /Quota/);
  assert.equal(await (await first.request()).text(), '<html>A</html>', 'quota failure cannot replace active A');
  quotaCache.blocked = '';
  const start = calls.length;
  const next = worker(b.manifest); await next.lifecycle('install');
  assert.deepEqual(calls.slice(start), [bad], 'new release transfers only its changed part');
  assert.equal(await (await first.request()).text(), '<html>A</html>', 'installing B never switches an existing A client');
  await next.lifecycle('activate');
  assert.equal(await (await next.request()).text(), '<html>B</html>');
  const rollbackAt = calls.length;
  const rollback = worker(a.manifest); await rollback.lifecycle('install'); await rollback.lifecycle('activate');
  assert.equal(calls.length, rollbackAt, 'rollback uses retained, verified parts');
  const cache = await storage.open('object-public-v1:' + base + ':parts');
  const part = lazy.parts[0], url = new URL('delivery/objects/' + part.sha256 + '.bin', base).href;
  await cache.put(url, new Response('corrupted cache'));
  assert.deepEqual(Buffer.from(await (await rollback.request(lazy.path)).arrayBuffer()), model);
  assert.equal(calls.at(-1), part.sha256, 'corrupt stored part is replaced');
  for (const failure of ['corrupt','oversize','redirect']) {
    await cache.delete(url); bad = part.sha256; mode = failure;
    await assert.rejects(async () => (await rollback.request(lazy.path)).arrayBuffer(), /integrity|Oversized|fetch failed/);
    assert.equal(await cache.match(url), undefined, 'bad response is never cached');
  }
  mode = ''; bad = '';
  assert.deepEqual(Buffer.from(await (await rollback.request(lazy.path)).arrayBuffer()), model);
  assert.equal(hash(model), lazy.sha256);
  const zipped = { ...a.manifest, files:a.manifest.files.map(file=>({...file,parts:file.parts.map(part=>({...part,gzipBytes:gzipSync(all.get(part.sha256)).length}))})) };
  for(const hostDecodes of [false,true]) {
    wireGzip=hostDecodes;
    for(const part of lazy.parts)await cache.delete(new URL('delivery/objects/'+part.sha256+'.bin',base).href);
    assert.deepEqual(Buffer.from(await (await worker(zipped,true).request(lazy.path)).arrayBuffer()),model,'gzip object preserves bytes whether fetch or the worker decompresses');
  }
  console.log('game worker: core/lazy/range, restart, failed update, changed-part update, rollback, corruption and public-only cache passed');
} finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
