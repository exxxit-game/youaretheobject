// WHY: RFC 9110 If-None-Match / 304 preserves a previous content comparison without
// retransmitting unchanged models on every publication poll. A changed release gets a new verifier.
export function deliveryVerifier(base, files, { timeoutMs = 10000 } = {}) {
  const known = new Map();
  const stats = { requests: 0, receivedBytes: 0, notModified: 0 };
  async function check(name) {
    const expected = files.get(name);
    if (!expected) throw new Error('File is outside the verification set');
    const previous = known.get(name);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    stats.requests++;
    try {
      const response = await fetch(new URL(name, base), {
        headers: previous ? { 'If-None-Match': previous.etag } : {},
        cache: 'no-cache', redirect: 'error', signal: controller.signal
      });
      const etag = response.headers.get('etag');
      if (response.status === 304) {
        stats.notModified++;
        // An unsolicited 304 or a contradictory validator proves nothing.
        return !!previous && (!etag || etag === previous.etag) && previous.matches;
      }
      if (response.status !== 200) return false;
      const chunks = []; let size = 0;
      for await (const chunk of response.body) {
        size += chunk.length; stats.receivedBytes += chunk.length;
        // Text may gain CRLF endings, but an unbounded error body must not exhaust memory.
        if (size > expected.bytes.length * 2 + 4096) return false;
        chunks.push(chunk);
      }
      const bytes = Buffer.concat(chunks);
      const matches = expected.binary ? bytes.equals(expected.bytes)
        : bytes.toString('utf8').replace(/\r\n/g, '\n') === expected.bytes.toString('utf8').replace(/\r\n/g, '\n');
      known.delete(name);
      // Only a strong validator represents unchanged bytes, including binary models.
      if (etag && /^"[^\r\n"]*"$/.test(etag)) known.set(name, { etag, matches });
      return matches;
    } catch { return false; }
    finally { clearTimeout(timer); controller.abort(); }
  }
  return { check, stats };
}
