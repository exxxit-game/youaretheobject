import assert from 'node:assert/strict';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { deliveryVerifier } from '../tools/verify-delivery.mjs';

const model = Buffer.alloc(1024 * 1024, 42), changed = Buffer.from(model); changed[50] = 43;
const expected = new Map([
  ['model.glb', { bytes: model, binary: true }],
  ['main.js', { bytes: Buffer.from('first\r\nsecond\r\n'), binary: false }]
]);
let data = model, status = 200, mode = '', seen = [];
const strong = bytes => `"${createHash('sha256').update(bytes).digest('hex')}"`;
const server = http.createServer((req, res) => {
  const body = req.url === '/main.js' ? Buffer.from('first\nsecond\n') : data;
  const etag = mode === 'weak' ? 'W/' + strong(body) : strong(body);
  seen.push({ path: req.url, validator: req.headers['if-none-match'] });
  if (mode === 'hang') { res.writeHead(200, { etag }); res.write('x'); return; }
  if (mode === 'redirect') { res.writeHead(302, { location: '/model.glb' }); res.end(); return; }
  if (mode === 'unsolicited304' || mode === 'wrong304') { res.writeHead(304, { etag: '"wrong"' }); res.end(); return; }
  if (status !== 200) { res.writeHead(status); res.end('error'); return; }
  if (req.headers['if-none-match'] === etag && mode !== 'noetag') { res.writeHead(304, { etag }); res.end(); return; }
  res.writeHead(200, mode === 'noetag' ? {} : { etag }); res.end(body);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
try {
  const verifier = deliveryVerifier(base, expected);
  assert.equal(await verifier.check('model.glb'), true);
  for (let n = 0; n < 11; n++) assert.equal(await verifier.check('model.glb'), true);
  assert.equal(verifier.stats.receivedBytes, model.length, '12 polls transfer the model only once');
  assert.equal(verifier.stats.notModified, 11);
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
  console.log('delivery verification: 12 polls, one model body; update/error/304 isolation checks passed');
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
