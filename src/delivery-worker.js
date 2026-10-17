// Serialized into the exported worker with its immutable public manifest.
// No forced takeover: an update waits until every tab using the old game closes.
export function deliveryWorker(manifest) {
  const scope = self.registration.scope;
  const name = 'object-public-v1:' + scope;
  const objects = () => caches.open(name + ':parts');
  const metadata = () => caches.open(name + ':state');
  const key = hash => new URL('delivery/objects/' + hash + '.bin', scope).href;
  const files = new Map(manifest.files.map(file => [file.path, file]));
  const pending = new Map();
  const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
    .map(x => x.toString(16).padStart(2, '0')).join('');
  const valid = async (bytes, part) => bytes.byteLength === part.bytes && await digest(bytes) === part.sha256;

  async function readBounded(stream, limit) {
    const reader = stream.getReader(), chunks = []; let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > limit) throw new Error('Oversized part');
        chunks.push(value);
      }
    } finally { await reader.cancel().catch(() => {}); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes;
  }

  async function partBytes(part, required = false) {
    if (pending.has(part.sha256)) return pending.get(part.sha256);
    const task = (async () => {
      const cache = await objects(), url = key(part.sha256), stored = await cache.match(url);
      if (stored) {
        const bytes = await stored.arrayBuffer();
        if (await valid(bytes, part)) return bytes;
        await cache.delete(url);
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const compressed = part.gzipBytes && typeof DecompressionStream === 'function';
        const response = await fetch(url + (compressed ? '.gz' : ''), { credentials: 'omit', redirect: 'error', cache: 'no-cache', signal: controller.signal });
        if (response.status !== 200) throw new Error('Part unavailable: ' + response.status);
        let bytes = await readBounded(response.body, part.bytes);
        // Some hosts add Content-Encoding and fetch already decompresses the object.
        if (compressed && !await valid(bytes, part)) bytes = await readBounded(new Response(bytes).body.pipeThrough(new DecompressionStream('gzip')), part.bytes);
        if (!await valid(bytes, part)) throw new Error('Part integrity failed');
        try { await cache.put(url, new Response(bytes)); }
        catch (error) {
          // A candidate must persist its core; an active game's lazy asset may still play online.
          if (required) throw error;
          console.warn('Game asset verified but not cached', error);
        }
        return bytes.buffer;
      } finally { clearTimeout(timer); controller.abort(); }
    })();
    pending.set(part.sha256, task);
    try { return await task; } finally { pending.delete(part.sha256); }
  }

  const partsFor = files => new Map(files.flatMap(file => file.parts.map(part => [part.sha256, part])));
  self.addEventListener('install', event => event.waitUntil((async () => {
    // A failed candidate never activates. Already verified pieces survive a retry.
    const parts = [...partsFor(manifest.files.filter(file => file.core)).values()];
    for (let i = 0; i < parts.length; i += 4) await Promise.all(parts.slice(i, i + 4).map(part => partBytes(part, true)));
  })()));
  self.addEventListener('activate', event => event.waitUntil((async () => {
    const state = await metadata(), activeKey = new URL('delivery/active', scope).href;
    const old = await state.match(activeKey);
    const previous = old ? (await old.json()).current : null;
    await state.put(activeKey, new Response(JSON.stringify({ current: manifest, previous })));
    // Keep one rollback release and every part referenced by the current release.
    const keep = partsFor([...manifest.files, ...(previous?.files || [])]);
    const cache = await objects();
    for (const request of await cache.keys()) {
      const hash = /\/([a-f0-9]{64})\.bin$/.exec(request.url)?.[1];
      if (!keep.has(hash)) await cache.delete(request);
    }
  })().catch(error => console.warn('Game cache cleanup deferred', error))));

  function rangeFor(header, size) {
    if (!header) return [0, size - 1, false];
    const match = /^bytes=(\d*)-(\d*)$/.exec(header);
    if (!match || (!match[1] && !match[2])) return null;
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
    return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= end && start < size
      ? [start, end, true] : null;
  }
  async function serve(file, request) {
    const range = rangeFor(request.headers.get('Range'), file.bytes);
    if (!range) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + file.bytes } });
    const [start, end, partial] = range;
    const chunks = []; let offset = 0;
    for (const part of file.parts) {
      const last = offset + part.bytes - 1;
      if (last >= start && offset <= end) chunks.push({ part, from: Math.max(0, start - offset), to: Math.min(part.bytes, end - offset + 1) });
      offset += part.bytes;
    }
    let index = 0, canceled = false;
    const stream = new ReadableStream({
      async pull(controller) {
        if (index === chunks.length) { controller.close(); return; }
        const chunk = chunks[index++];
        try {
          const bytes = await partBytes(chunk.part);
          if (!canceled) controller.enqueue(new Uint8Array(bytes, chunk.from, chunk.to - chunk.from));
        } catch (error) { if (!canceled) controller.error(error); }
      },
      cancel() { canceled = true; }
    });
    const headers = { 'Content-Type': file.type, 'Content-Length': String(Math.max(0, end - start + 1)),
      'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'X-Object-Version': manifest.version };
    if (partial) headers['Content-Range'] = `bytes ${start}-${end}/${file.bytes}`;
    return new Response(stream, { status: partial ? 206 : 200, headers });
  }
  self.addEventListener('fetch', event => {
    const request = event.request, url = new URL(request.url);
    // API, payments, authenticated requests and other origins never enter this public cache.
    if (request.method !== 'GET' || request.headers.has('Authorization') || !url.href.startsWith(scope)) return;
    let path;
    try { path = decodeURIComponent(url.pathname.slice(new URL(scope).pathname.length)); } catch { return; }
    const file = files.get(path || 'index.html');
    if (file) event.respondWith(serve(file, request));
  });
  self.addEventListener('message', event => {
    if (event.data?.type === 'delivery-status') event.ports[0]?.postMessage({ version: manifest.version });
  });
}
