// Experimental transfer primitive, deliberately not imported by the game.
// WHY: Fetch streams + AbortController bound headers AND bodies (MDN AbortController.abort).
// SHA-256 checks use Web Crypto (MDN SubtleCrypto.digest); provider URLs stay outside the manifest.
const digest = async bytes => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
  .map(n => n.toString(16).padStart(2, '0')).join('');
const encode = value => new TextEncoder().encode(JSON.stringify(value));
export class AccessDenied extends Error {}
class FatalDelivery extends Error {}

export async function downloadPack(manifest, {
  expectedVersion, sources, authorize, cache = new Map(), requestMs = 5000, totalMs = 60000,
  onFile = () => {}, onAttempt = () => {}
}) {
  const { version, ...core } = manifest;
  if (!expectedVersion || version !== expectedVersion || await digest(encode(core)) !== version)
    throw new FatalDelivery('Untrusted or changed manifest');
  if (core.schema !== 1 || core.scope !== 'public-delivery-probe') throw new FatalDelivery('Unsupported manifest');
  if (!Array.isArray(sources) || sources.length !== 2 || sources[0] === sources[1]) throw new FatalDelivery('Two distinct sources required');
  if (![requestMs, totalMs].every(n => Number.isSafeInteger(n) && n > 0)) throw new FatalDelivery('Invalid deadline');
  const bases = sources.map(s => {
    const u = new URL(s);
    if (!(u.protocol === 'https:' || (u.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(u.hostname))) || u.username || u.password || u.search || u.hash)
      throw new FatalDelivery('Expected HTTPS base or loopback, without credentials');
    return u.href.endsWith('/') ? u.href : u.href + '/';
  });
  const stopAt = performance.now() + totalMs;
  const remaining = () => {
    const ms = Math.ceil(stopAt - performance.now());
    if (ms <= 0) throw new FatalDelivery('Pack deadline exceeded');
    return ms;
  };
  // This callback is only an integration seam: a local flag is NOT proof of a purchase.
  // Authorization must precede even warm-cache reuse. No endpoint fallback on denial.
  let authTimer;
  try {
    if (typeof authorize !== 'function' || await Promise.race([
      Promise.resolve().then(() => authorize()),
      new Promise((_, reject) => { authTimer = setTimeout(() => reject(new AccessDenied('Authorization unavailable')), Math.min(requestMs, remaining())); })
    ]) !== true) throw new AccessDenied('No access');
  } finally { clearTimeout(authTimer); }
  const stats = { files: 0, verifiedBytes: 0, receivedBytes: 0, requests: [0, 0], reusedParts: 0, failures: [] };
  let preferred = 0;
  for (const file of core.files) {
    remaining();
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0 || file.bytes > 32 * 1024 * 1024)
      throw new FatalDelivery('Probe file size outside limit');
    const output = new Uint8Array(file.bytes);
    let offset = 0;
    for (const part of file.parts) {
      remaining();
      if (!/^[a-f0-9]{64}$/.test(part.sha256) || !Number.isSafeInteger(part.bytes) || part.bytes < 1 || part.bytes > core.chunkBytes || offset + part.bytes > file.bytes)
        throw new FatalDelivery('Invalid part');
      let data = cache.get(part.sha256);
      if (data && (data.length !== part.bytes || await digest(data) !== part.sha256)) { cache.delete(part.sha256); data = undefined; }
      if (data) stats.reusedParts++;
      else {
        for (const source of [preferred, 1 - preferred]) {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), Math.min(requestMs, remaining()));
          stats.requests[source]++;
          onAttempt({ source, sha256: part.sha256 });
          try {
            const response = await fetch(`${bases[source]}objects/${part.sha256}.bin`, {
              signal: controller.signal, redirect: 'manual', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store'
            });
            if ([401, 402, 403].includes(response.status)) throw new AccessDenied(`Access refused (${response.status})`);
            if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) throw new FatalDelivery('Redirect refused');
            if (response.status !== 200) {
              if (response.status !== 404 && response.status !== 408 && response.status !== 429 && response.status < 500)
                throw new FatalDelivery(`Unexpected status (${response.status})`);
              throw new Error(`HTTP ${response.status}`);
            }
            if (response.headers.get('content-type')?.split(';')[0] !== 'application/octet-stream') throw new Error('Unexpected content type');
            const bytes = new Uint8Array(part.bytes), reader = response.body.getReader();
            let count = 0;
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              stats.receivedBytes += value.length;
              count += value.length;
              if (count > bytes.length) throw new Error('Oversized part');
              bytes.set(value, count - value.length);
            }
            if (count !== part.bytes || await digest(bytes) !== part.sha256) throw new Error('Part integrity mismatch');
            data = bytes;
            cache.set(part.sha256, data);
            preferred = source;
            break;
          } catch (e) {
            if (e instanceof AccessDenied || e instanceof FatalDelivery) throw e;
            // No URL/query strings or server-supplied messages in the journal.
            stats.failures.push({ source, sha256: part.sha256, reason: controller.signal.aborted ? 'timeout' : 'transfer-or-integrity' });
          } finally { clearTimeout(timer); controller.abort(); }
        }
        if (!data) throw new Error('Both sources failed; verified parts retained');
      }
      output.set(data, offset);
      offset += data.length;
    }
    if (offset !== file.bytes || await digest(output) !== file.sha256) throw new FatalDelivery('File integrity mismatch');
    remaining();
    onFile(file.path, output);
    stats.files++;
    stats.verifiedBytes += output.length;
  }
  return stats;
}
