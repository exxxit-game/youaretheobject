import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { deliveryVerifier } from '../tools/verify-delivery.mjs';

const model = Buffer.alloc(1024 * 1024, 42), changed = Buffer.from(model); changed[50] = 43;
const expected = new Map([
  ['model.glb', { bytes: model, binary: true }],
  ['main.js', { bytes: Buffer.from('first\r\nsecond\r\n'), binary: false }]
]);
const servedFiles = new Map();
let data = model, status = 200, mode = 'negotiated-gzip', seen = [];
const strong = bytes => `"${createHash('sha256').update(bytes).digest('hex')}"`;
const server = http.createServer((req, res) => {
  const body = servedFiles.get(req.url) ?? (req.url === '/main.js' ? Buffer.from('first\nsecond\n') : data);
  const compressed = mode === 'negotiated-gzip' && req.headers['accept-encoding'] !== 'identity';
  const etag = mode === 'weak' || compressed ? 'W/' + strong(body) : strong(body);
  seen.push({ path: req.url, validator: req.headers['if-none-match'], encoding: req.headers['accept-encoding'] });
  if (mode === 'hang') { res.writeHead(200, { etag }); res.write('x'); return; }
  if (mode === 'redirect') { res.writeHead(302, { location: '/model.glb' }); res.end(); return; }
  if (mode === 'unsolicited304' || mode === 'wrong304') { res.writeHead(304, { etag: '"wrong"' }); res.end(); return; }
  if (status !== 200) { res.writeHead(status); res.end('error'); return; }
  if (req.headers['if-none-match'] === etag && mode !== 'noetag') { res.writeHead(304, { etag }); res.end(); return; }
  res.writeHead(200, mode === 'noetag' ? {} : { etag, ...(compressed ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}) });
  res.end(compressed ? gzipSync(body) : body);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
try {
  const verifier = deliveryVerifier(base, expected);
  assert.equal(await verifier.check('model.glb'), true);
  for (let n = 0; n < 11; n++) assert.equal(await verifier.check('model.glb'), true);
  assert.equal(verifier.stats.receivedBytes, model.length, '12 polls transfer the model only once');
  assert.equal(verifier.stats.notModified, 11);
  assert.equal(seen[0].encoding, 'identity', 'byte verification requests the representation with a strong validator');
  assert.equal(await verifier.check('main.js'), true, 'preserve text newline normalization');
  assert.equal(await verifier.check('main.js'), true);
  assert.notEqual(seen.at(-1).validator, seen[1].validator, 'validators belong to each file');

  data = changed;
  assert.equal(await verifier.check('model.glb'), false, 'changed server bytes are compared again');
  assert.equal(await verifier.check('model.glb'), false, '304 of an old/wrong file never marks a release ready');
  data = model;
  assert.equal(await verifier.check('model.glb'), true, 'deployment eventually reaches expected bytes');
  for (const error of [401, 403, 404, 503]) {
    status = error;
    assert.equal(await verifier.check('model.glb'), false, `${error} is never replaced by a previous success`);
  }
  status = 200; mode = 'wrong304';
  assert.equal(await verifier.check('model.glb'), false, 'contradictory 304 is not trusted');
  mode = 'unsolicited304';
  assert.equal(await deliveryVerifier(base, expected).check('model.glb'), false, 'first response must contain bytes');
  for (const missing of ['weak', 'noetag']) {
    mode = missing; seen = [];
    const noReuse = deliveryVerifier(base, expected);
    assert.equal(await noReuse.check('model.glb'), true);
    assert.equal(await noReuse.check('model.glb'), true);
    assert.equal(seen[1].validator, undefined, 'no strong validator means full verification');
    assert.equal(noReuse.stats.receivedBytes, 2 * model.length);
  }
  mode = 'redirect';
  assert.equal(await verifier.check('model.glb'), false, 'redirect does not stand for the requested file');
  mode = 'hang';
  assert.equal(await deliveryVerifier(base, expected, { timeoutMs: 100 }).check('model.glb'), false, 'body hangs are bounded');
  mode = ''; data = changed;
  const newRelease = deliveryVerifier(base, new Map([['model.glb', { bytes: changed, binary: true }]]));
  assert.equal(await newRelease.check('model.glb'), true, 'new release starts with its own byte comparison');
  assert.equal(newRelease.stats.notModified, 0);
  await assert.rejects(verifier.check('unknown.glb'), /outside/);
  // The published entry page and non-code assets must belong to the same frozen snapshot.
  const { publicationSnapshot } = await import('../tools/verify-delivery.mjs');
  assert.equal(typeof publicationSnapshot, 'function', 'publication must capture every staged file, including index.html');
  const staged = fs.mkdtempSync(path.join(os.tmpdir(), 'object-preview-verifier-'));
  try {
    fs.mkdirSync(path.join(staged, 'vendor'));
    const html = '<head>\n<meta name="robots" content="noindex, nofollow">\n<script>window.AFRAME_CDN_ROOT="local";</script></head>';
    fs.writeFileSync(path.join(staged, 'index.html'), html);
    fs.writeFileSync(path.join(staged, '.nojekyll'), '');
    fs.writeFileSync(path.join(staged, 'vendor', 'font.woff2'), Buffer.from([0x80, 0x00]));
    fs.writeFileSync(path.join(staged, 'vendor', 'config.json'), '{"version":2}');
    fs.writeFileSync(path.join(staged, 'vendor', 'voice.mp3'), Buffer.from([0x01, 0x02]));
    const snapshot = publicationSnapshot(staged);
    assert.deepEqual([...snapshot.keys()].sort(), ['.nojekyll', 'index.html', 'vendor/config.json', 'vendor/font.woff2', 'vendor/voice.mp3']);
    for (const [name, file] of snapshot) servedFiles.set('/' + name, file.bytes);
    const deployed = deliveryVerifier(base, snapshot);
    servedFiles.set('/index.html', Buffer.from('<head><script src="old.js"></script></head>'));
    assert.equal(await deployed.check('index.html'), false, 'stale entry page blocks a successful publication check');
    assert.equal(await deployed.check('index.html'), false, '304 of stale entry page is still a failure');
    servedFiles.set('/index.html', Buffer.from(html));
    // Edits while Pages is building must not change what counts as the published release.
    fs.writeFileSync(path.join(staged, 'index.html'), '<head>next unpublished work</head>');
    for (const name of snapshot.keys()) assert.equal(await deployed.check(name), true, name);
    servedFiles.set('/vendor/font.woff2', Buffer.from([0x81, 0x00]));
    assert.equal(await deployed.check('vendor/font.woff2'), false, 'fonts are compared as bytes, not lossy UTF-8');
    servedFiles.set('/vendor/config.json', Buffer.from('{"version":1}'));
    assert.equal(await deployed.check('vendor/config.json'), false, 'configuration is verified too');
  } finally {
    assert.equal(path.dirname(path.resolve(staged)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(staged).startsWith('object-preview-verifier-'));
    fs.rmSync(staged, { recursive: true, force: true });
  }
  console.log('delivery verification: conditional reuse, frozen full publication, stale entry page and binary assets passed');
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
