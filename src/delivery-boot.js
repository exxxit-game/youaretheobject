// The exporter uses this module in the small entry page and the verified game page.
// Development index.html stays direct; it does not register a persistent worker.
export async function startDelivery() {
  const root = new URL('../', import.meta.url);
  const worker = new URL('delivery-worker.js', root).href;
  const shell = document.documentElement.dataset.delivery === 'prepare';
  const status = document.getElementById('delivery-status');
  const retry = document.getElementById('delivery-retry');
  if (retry) retry.onclick = () => location.reload();
  const fallback = () => location.replace(new URL('uncached.html' + location.search + location.hash, root).href);
  if (!('serviceWorker' in navigator) || !window.isSecureContext) { if (shell) fallback(); return; }
  try {
    const registration = await navigator.serviceWorker.register(worker, { scope: root.href, updateViaCache: 'none' });
    if (!shell) return;
    if (navigator.serviceWorker.controller?.scriptURL === worker) { location.reload(); return; }
    // No clients.claim()/skipWaiting(): a running game must keep its own complete version.
    await new Promise((resolve, reject) => {
      const deadline = setTimeout(() => reject(new Error('Installation timed out')), 120000);
      const done = error => { clearTimeout(deadline); error ? reject(error) : resolve(); };
      function watch() {
        if (registration.active) { done(); return; }
        const candidate = registration.installing || registration.waiting;
        if (!candidate) { done(new Error('Installation unavailable')); return; }
        if (candidate.state === 'activated') done();
        else if (candidate.state === 'redundant') done(new Error('Installation failed'));
        else candidate.addEventListener('statechange', watch, { once: true });
      }
      watch();
    });
    location.reload();
  } catch (error) {
    console.warn('Game cache unavailable', error);
    if (!shell) return;
    if (status) status.textContent = status.dataset.failed;
    if (retry) retry.hidden = false;
    const plain = document.getElementById('delivery-plain');
    // An uncontrolled page can still play in a browser whose storage is unavailable.
    if (plain && !navigator.serviceWorker.controller) { plain.hidden = false; plain.onclick = fallback; }
  }
}
if (typeof document !== 'undefined' && document.documentElement.dataset.delivery) startDelivery();
