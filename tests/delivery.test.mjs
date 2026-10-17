// Real loopback HTTP bodies; no mocked fetch and no external account or data writes.
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import { deliveryFiles, makePack, inventory } from '../tools/delivery-pack.mjs';
import { downloadPack, AccessDenied } from '../tools/delivery-download.mjs';

async function source(objects) {
  // Separate copies model separate origins. They still share this laptop/process.
  const local = new Map([...objects].map(([k, v]) => [k, Buffer.from(v)]));
  const state = { kind: 'ok', after: 0, calls: [], sentBytes: 0, cancelled: 0 };
  const server = http.createServer((req, res) => {
    const sha = /^\/objects\/([a-f0-9]{64})\.bin$/.exec(req.url)?.[1];
    const data = local.get(sha);
    state.calls.push(sha);
    const kind = state.calls.length > state.after ? state.kind : 'ok';
    res.on('close', () => { if (!res.writableEnded) state.cancelled++; });
    if (!data) { res.writeHead(404).end(); return; }
    if (/^status-/.test(kind)) { res.writeHead(Number(kind.slice(7))).end(); return; }
    if (kind === 'redirect') { res.writeHead(302, { Location: '/login' }).end(); return; }
    if (kind === 'stall-headers') return;
    if (kind === 'html') { res.writeHead(200, { 'Content-Type': 'text/html' }).end('<html>challenge</html>'); return; }
    res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    if (kind === 'stall-body' || kind === 'reset') {
      res.write(data.subarray(0, 64)); state.sentBytes += Math.min(64, data.length);
      if (kind === 'reset') setImmediate(() => res.destroy());
      return;
    }
    const body = Buffer.from(data);
    if (kind === 'corrupt') body[0] ^= 1;
    if (kind === 'short') { res.end(body.subarray(0, body.length - 1)); return; }
    if (kind === 'oversize') { res.end(Buffer.concat([body, Buffer.from([1])])); return; }
    state.sentBytes += body.length;
    res.end(body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    state, url: `http://127.0.0.1:${server.address().port}/`,
    close: () => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); })
  };
}

const entries = deliveryFiles(), full = makePack(entries), report = { inventory: inventory(entries, full.manifest), cases: [] };
const large = entries.reduce((a, b) => a.data.length > b.data.length ? a : b);
const sample = makePack([large]);
const allow = () => true;

async function runCase(name, pack, originals, work) {
  const a = await source(pack.objects), b = await source(pack.objects), cache = new Map();
  const verified = [];
  const options = {
    expectedVersion: pack.manifest.version, sources: [a.url, b.url], authorize: allow, cache,
    requestMs: 250, totalMs: 60000,
    onFile: (name, bytes) => {
      assert.deepEqual(Buffer.from(bytes), originals.find(f => f.path === name).data, 'Full file differs from the checkout');
      verified.push(name);
    }
  };
  const start = performance.now();
  try {
    const result = await work({ a, b, cache, options, verified, load: changes => downloadPack(pack.manifest, { ...options, ...changes }) });
    report.cases.push({ name, passed: true, elapsedMs: Math.round(performance.now() - start), ...result });
    console.log(`delivery: ${name}: PASS`);
  } finally { await a.close(); await b.close(); }
}

await runCase('every shipped file, complete and byte-identical', full, entries, async ({ load, b }) => {
  const stats = await load({ requestMs: 5000 });
  assert.equal(stats.files, entries.length);
  assert.equal(stats.verifiedBytes, report.inventory.bytes);
  assert.equal(b.state.calls.length, 0);
  return stats;
});

for (const kind of ['status-503', 'status-404', 'status-429', 'stall-headers', 'stall-body', 'reset', 'corrupt', 'short', 'oversize', 'html']) {
  await runCase(`mid-file ${kind}: retain verified parts`, sample, [large], async ({ a, b, load }) => {
    a.state.kind = kind; a.state.after = 2;
    const stats = await load();
    assert.equal(stats.files, 1);
    assert.equal(stats.failures.length, 1);
    assert.equal(a.state.calls.length, 3, 'Do not keep retrying the broken source');
    assert.ok(!a.state.calls.slice(0, 2).some(sha => b.state.calls.includes(sha)), 'Verified chunks were downloaded again');
    assert.equal(b.state.calls[0], a.state.calls[2], 'Resume must begin with the interrupted part');
    if (kind === 'stall-body' || kind === 'stall-headers') assert.ok(a.state.cancelled > 0, 'Hung request was not cancelled');
    if (kind === 'stall-body') assert.equal(stats.receivedBytes, large.data.length + 64, 'Only the incomplete part may repeat');
    return stats;
  });
}

await runCase('unreachable first source', sample, [large], async ({ a, load }) => {
  await a.close();
  const stats = await load();
  assert.equal(stats.files, 1); assert.equal(stats.failures.length, 1);
  return stats;
});

for (const kind of ['status-401', 'status-402', 'status-403', 'redirect']) {
  await runCase(`${kind}: never try the second source`, sample, [large], async ({ a, b, load, verified }) => {
    a.state.kind = kind; a.state.after = 2;
    await assert.rejects(load(), kind === 'redirect' ? /Redirect refused/ : AccessDenied);
    assert.equal(b.state.calls.length, 0, 'Access failure was bypassed through the backup');
    assert.deepEqual(verified, [], 'Incomplete file must not reach the application');
    return { refused: true, backupRequests: 0 };
  });
}

await runCase('both sources fail; retry uses previously verified parts', sample, [large], async ({ a, b, cache, load }) => {
  a.state.kind = 'stall-body'; a.state.after = 2; b.state.kind = 'status-503';
  await assert.rejects(load(), /Both sources failed/);
  assert.equal(cache.size, 2);
  a.state.kind = b.state.kind = 'ok'; a.state.calls = []; b.state.calls = [];
  const stats = await load();
  assert.equal(stats.reusedParts, 2);
  assert.equal(stats.receivedBytes, large.data.length - 2 * sample.manifest.chunkBytes);
  return stats;
});

await runCase('warm reuse, cache corruption, denial before cache', sample, [large], async ({ a, b, cache, load }) => {
  await load(); a.state.calls = []; b.state.calls = [];
  const warm = await load();
  assert.equal(warm.receivedBytes, 0); assert.deepEqual(warm.requests, [0, 0]);
  const first = sample.manifest.files[0].parts[0]; cache.get(first.sha256)[0] ^= 1;
  const repaired = await load(); assert.equal(repaired.receivedBytes, first.bytes);
  a.state.calls = []; b.state.calls = [];
  for (const authorize of [undefined, () => false, () => Promise.reject(new Error('unavailable')), () => new Promise(() => {})])
    await assert.rejects(load({ authorize }));
  assert.equal(a.state.calls.length + b.state.calls.length, 0);
  return { warmBytes: 0, repairedBytes: repaired.receivedBytes, deniedBeforeCache: true };
});

await runCase('new release reuses unchanged content only', sample, [large], async ({ load, cache }) => {
  await load();
  const data = Buffer.from(large.data); data[0] ^= 1;
  const next = makePack([{ path: large.path, data }]);
  assert.notEqual(next.manifest.version, sample.manifest.version);
  const a = await source(next.objects), b = await source(next.objects);
  try {
    const stats = await downloadPack(next.manifest, {
      expectedVersion: next.manifest.version, sources: [a.url, b.url], authorize: allow, cache,
      onFile: (_, got) => assert.deepEqual(Buffer.from(got), data)
    });
    assert.equal(stats.receivedBytes, next.manifest.chunkBytes, 'An update redownloaded unchanged parts');
    return stats;
  } finally { await a.close(); await b.close(); }
});

await runCase('changed manifest and wrong release rejected before transfer', sample, [large], async ({ options, a, b }) => {
  const changed = structuredClone(sample.manifest); changed.files[0].bytes++;
  await assert.rejects(downloadPack(changed, options), /manifest/);
  await assert.rejects(downloadPack(sample.manifest, { ...options, expectedVersion: 'wrong' }), /manifest/);
  assert.equal(a.state.calls.length + b.state.calls.length, 0);
  return { requests: 0 };
});

await runCase('pack deadline bounds both hanging sources', sample, [large], async ({ a, b, load }) => {
  a.state.kind = b.state.kind = 'stall-body';
  const start = performance.now();
  await assert.rejects(load({ requestMs: 500, totalMs: 120 }));
  assert.ok(performance.now() - start < 3000, 'Pack deadline did not bound the operation');
  return { refused: true };
});

const empty = makePack([{ path: 'empty.txt', data: Buffer.alloc(0) }]);
await runCase('empty file', empty, [{ path: 'empty.txt', data: Buffer.alloc(0) }], async ({ load }) => {
  const stats = await load(); assert.equal(stats.files, 1); assert.equal(stats.receivedBytes, 0); return stats;
});

if (process.env.DELIVERY_REPORT) fs.writeFileSync(process.env.DELIVERY_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(`delivery: ${report.cases.length} cases passed; ${report.inventory.bytes} bytes; version ${full.manifest.version}`);
