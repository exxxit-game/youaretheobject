// What a page of the game asks of other sites, for the runs on GitHub (smoke.mjs, smoke-vr.mjs): the
// game takes nothing from other sites (.claude/rules/game.md), so a request to any host but
// the game's own and our results server is a failure. A-Frame's own advice for working without its CDN
// is to watch the requests the browser makes (A-Frame 1.8.0 docs, introduction/faq.md, "Can I use
// A-Frame offline or self hosted?"); this is that watch, made on every push.
import fs from 'node:fs';

// our results server, read where the game keeps it (src/engine/results.js)
const SERVER = new URL(fs.readFileSync(new URL('../src/engine/results.js', import.meta.url), 'utf8').match(/const ENDPOINT = '([^']+)'/)[1]).origin;

// Starts listening on a page; returns the list it fills: every request whose origin is neither the
// page's own (where the game is served) nor our server. data: and blob: never leave the page.
export function watchOutside(page, own) {
  const outside = [];
  const home = new URL(own).origin;
  page.on('request', (r) => {
    const url = r.url();
    if (/^(data|blob):/.test(url)) return;
    const origin = new URL(url).origin;
    if (origin !== home && origin !== SERVER) outside.push(url);
  });
  return outside;
}

// and every request made, to show that a file came from the game itself
export function watchAll(page) {
  const all = [];
  page.on('request', (r) => all.push(r.url()));
  return all;
}
