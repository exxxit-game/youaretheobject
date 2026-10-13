// Publishes the game files of this checkout to the owner's test copy for the headset:
// https://exxxit-game.github.io/object-preview/ (GitHub Pages of exxxit-game/object-preview).
// The headset opens it from a bookmark: no laptop, no cable, after any restart. Only what
// the page needs goes there (the PUBLIC list of tests/static-server.mjs): no notes, tests
// or history. Games on the test copy never send results (src/app/session.js, PREVIEW).
// The live site (main of exxxit-game/youaretheobject) is not touched: it changes on the owner's word.
// Usage: node tools/publish-preview.mjs [--anyway]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC } from '../tests/static-server.mjs';
import { check } from './secrets.mjs';
import { requireReview, requirePaper } from './review-gate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/exxxit-game/object-preview.git';
// the owner's automatic stop: he meets what is published here, so the practice reviewer must have
// seen these very files; no flag skips it
requireReview(ROOT, 'publishing the test copy');
requirePaper(ROOT, 'publishing the test copy');
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

// the copy is public and its commit shows the author's address: only the hidden GitHub one
const email = git(ROOT, 'config', 'user.email');
if (!email.endsWith('@users.noreply.github.com')) {
  console.log(`not published: the commit would show the address ${email}; set the hidden GitHub address first`);
  process.exit(1);
}
// A failing check on GitHub must not wait unseen while the owner tries the copy: the last
// finished run of the tests (.github/workflows/test.yml) has to have passed (needs the GitHub CLI,
// signed in); --anyway publishes all the same, saying so. The tests run on room-polish, where
// every session's commits go, not on the session branch.
try {
  const [run] = JSON.parse(execFileSync('gh', ['run', 'list', '--branch', 'room-polish', '--status', 'completed', '--limit', '1', '--json', 'headSha,conclusion,url'], { cwd: ROOT, encoding: 'utf8' }));
  if (run && run.conclusion !== 'success') {
    console.log(`the tests on GitHub ${run.conclusion} for ${run.headSha.slice(0, 7)}: ${run.url}`);
    if (!process.argv.includes('--anyway')) { console.log('not published: fix that first (or publish with --anyway)'); process.exit(1); }
  }
} catch (e) {
  console.log(`could not read the tests on GitHub: ${e.message.split('\n')[0]}`);
}
const sha = git(ROOT, 'rev-parse', '--short', 'HEAD');
const dirty = git(ROOT, 'status', '--porcelain', '--', ...PUBLIC.map(p => p.replace(/\/$/, '')));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'object-preview-'));
for (const p of PUBLIC) {
  const from = path.join(ROOT, p);
  if (fs.existsSync(from)) fs.cpSync(from, path.join(dir, p), { recursive: true });
}
fs.writeFileSync(path.join(dir, '.nojekyll'), ''); // serve files as they are
// search engines must not list the test copy
const index = path.join(dir, 'index.html');
fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">'));

git(dir, 'init', '-q', '-b', 'main');
git(dir, 'add', '-A');
git(dir, '-c', `user.name=${git(ROOT, 'config', 'user.name')}`, '-c', `user.email=${git(ROOT, 'config', 'user.email')}`,
  'commit', '-q', '-m', `Preview of ${sha}${dirty ? ' with uncommitted changes' : ''}`);
// the copy is pushed from this folder, where git runs no hook: the same check as before every push
const leaks = check('HEAD', dir);
if (leaks.length) {
  for (const p of leaks) console.log('STOP ', p);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('not published: something private is in the files');
  process.exit(1);
}
git(dir, 'push', '-q', '--force', REPO, 'main');
fs.rmSync(dir, { recursive: true, force: true });
console.log(`published ${sha}${dirty ? ' (+ uncommitted changes)' : ''}: https://exxxit-game.github.io/object-preview/`);

// GitHub Pages builds the copy after the push and now and then fails with no reason given
// ("Page build failed"); the old copy then stays online unnoticed. Wait for the build, ask for
// one rebuild if it fails, and say how it ended (needs the GitHub CLI, signed in).
const build = () => JSON.parse(execFileSync('gh', ['api', 'repos/exxxit-game/object-preview/pages/builds/latest'], { encoding: 'utf8' }));
const settled = async () => {
  for (let i = 0; i < 36; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const b = build();
    if (b.status === 'built' || b.status === 'errored') return b.status;
  }
  return 'still building';
};
// Right after a build the Pages servers can still hand out some old files beside the new ones
// (files are kept up to 10 minutes): a game whose modules come from two versions fails to start
// ("Failed to fetch dynamically imported module"). So "live" only once every script, page and
// style is served exactly as published; and every model the controllers take from the game itself
// (vendor/aframe-assets: a model still missing there leaves a player's hands empty), compared byte for byte.
const BASE = 'https://exxxit-game.github.io/object-preview/';
const pageFiles = PUBLIC.flatMap((p) => p.endsWith('/')
  ? fs.readdirSync(path.join(ROOT, p), { recursive: true }).map((f) => (p + f).replace(/\\/g, '/'))
  : [p]).filter((f) => /\.(js|html|css|glb)$/.test(f) && f !== 'index.html');   // index.html gets the noindex line
const served = async () => {
  let old = [];
  for (let i = 0; i < 12; i++) {
    old = [];
    for (let k = 0; k < pageFiles.length; k += 8) {
      await Promise.all(pageFiles.slice(k, k + 8).map(async (f) => {
        // a file that cannot be fetched (offline, DNS, TLS) counts as not yet served, never as a gh failure
        if (f.endsWith('.glb')) {
          const got = await fetch(BASE + f).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
          if (!got || !Buffer.from(got).equals(fs.readFileSync(path.join(ROOT, f)))) old.push(f);
          return;
        }
        const text = await fetch(BASE + f).then((r) => r.text()).catch(() => '');
        const mine = fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
        if (text.replace(/\r\n/g, '\n') !== mine) old.push(f);
      }));
    }
    if (!old.length) return 'built';
    await new Promise(r => setTimeout(r, 10000));
  }
  return `${old.length} files still served old: ${old.slice(0, 5).join(', ')}`;
};
try {
  let status = await settled();
  if (status === 'errored') {
    execFileSync('gh', ['api', '-X', 'POST', 'repos/exxxit-game/object-preview/pages/builds']);
    status = await settled();
  }
  if (status === 'built') status = await served();
  console.log(status === 'built' ? 'live: the build finished and every page file is served as published' : `NOT live: ${status}`);
  if (status !== 'built') process.exitCode = 1;
} catch (e) {
  console.log('could not read the Pages build (gh):', e.message.split('\n')[0]);
  process.exitCode = 1;   // an unchecked copy is never reported as live
}
