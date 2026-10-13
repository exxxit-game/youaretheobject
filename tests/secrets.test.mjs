// The guard that keeps keys and the owner's address off GitHub (tools/secrets.mjs) is run on
// real commits here: it must stop a planted token and a foreign address, in any folder it is
// pointed at, and the test copy's publisher must run it before its push (git runs no hook in
// the folder it pushes from).
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { check, checkStaged, PRIVATE_EMAIL, withoutGitVars } from '../tools/secrets.mjs';

// Run by the commit hook, this test gets the GIT_DIR git sets for hooks: its scratch repositories
// must never reach the real one through it (a "git init" there once turned it bare). So the test
// itself runs under a decoy GIT_DIR and checks the decoy is untouched at the end.
const repo = (files, email) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'secrets-test-'));
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text);
  const git = (...a) => execFileSync('git', a, { cwd: dir, env: withoutGitVars(), encoding: 'utf8' });
  git('init', '-q', '-b', 'main');
  git('add', '-A');
  git('-c', 'user.name=test', '-c', `user.email=${email}`, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'test');
  return dir;
};
const clean = (dir) => fs.rmSync(dir, { recursive: true, force: true });

const decoy = repo({ 'a.txt': 'a' }, PRIVATE_EMAIL);
const decoyConfig = fs.readFileSync(path.join(decoy, '.git', 'config'), 'utf8');
process.env.GIT_DIR = path.join(decoy, '.git');

// built here, not written out, so this file itself holds no token
const token = 'ghp' + '_' + 'a1B2'.repeat(9);

let dir = repo({ 'index.html': '<p>hello</p>' }, PRIVATE_EMAIL);
assert.deepEqual(check('HEAD', dir), [], 'a clean commit with the private address passes');
clean(dir);

dir = repo({ 'config.js': `export const KEY = '${token}';` }, PRIVATE_EMAIL);
assert.ok(check('HEAD', dir).some((p) => p.includes('GitHub token')), 'a token in the files is stopped');
clean(dir);

// what the next commit adds (the commit hook): a staged token stops it, a clean change passes
dir = repo({ 'index.html': '<p>hello</p>' }, PRIVATE_EMAIL);
const stage = (name, text) => { fs.writeFileSync(path.join(dir, name), text); execFileSync('git', ['add', '-A'], { cwd: dir, env: withoutGitVars(), stdio: 'pipe' }); };
stage('notes.md', 'nothing secret\n');
assert.deepEqual(checkStaged(dir), [], 'a clean staged change passes');
stage('config.js', `export const KEY = '${token}';\n`);
assert.ok(checkStaged(dir).some((p) => p.includes('GitHub token')), 'a staged token is stopped before the commit');
clean(dir);

dir = repo({ 'index.html': '<p>hello</p>' }, 'someone@example.com');
assert.ok(check('HEAD', dir).some((p) => p.includes('not the private one')), 'a commit with another address is stopped');
clean(dir);

// the publisher checks the copy before it pushes it
const publisher = fs.readFileSync(new URL('../tools/publish-preview.mjs', import.meta.url), 'utf8');
const checked = publisher.indexOf("check('HEAD', dir)"), pushed = publisher.indexOf("'push'");
assert.ok(checked > 0 && pushed > checked, 'tools/publish-preview.mjs must run check() on its copy before the push');

// the hooks: no commit past the quick check (a staged secret, a script that does not parse, a quick
// test failing; the whole suite runs on GitHub); a push to main (the live site) stops without
// OBJECT_LIVE=owner-said-yes, a deletion too. Run where a shell is (GitHub's machines always; Git Bash here).
const hook = (name) => fileURLToPath(new URL(`../tools/hooks/${name}`, import.meta.url));
const commitHook = fs.readFileSync(hook('pre-commit'), 'utf8');
assert.ok(/node tools\/secrets\.mjs --staged/.test(commitHook) && /node --check/.test(commitHook) && /package\.json/.test(commitHook),
  'the pre-commit hook must check the staged changes for secrets, parse the staged scripts and run the quick tests');
const push = (line, env = {}) => spawnSync('sh', [hook('pre-push')], { input: line + '\n', env: { ...process.env, OBJECT_LIVE: '', ...env }, encoding: 'utf8' });
const [one, zero] = ['1'.repeat(40), '0'.repeat(40)];
const probe = push(`refs/heads/main ${one} refs/heads/main ${one}`);
if (probe.error) console.log('(no shell here: the hooks are run on GitHub)');
else {
  assert.equal(probe.status, 1, 'a push to main without the owner\'s word must stop');
  assert.equal(push(`refs/heads/main ${zero} refs/heads/main ${one}`).status, 1, 'deleting main must stop');
}

assert.equal(fs.readFileSync(path.join(decoy, '.git', 'config'), 'utf8'), decoyConfig, 'a GIT_DIR from a hook reached a repository this test did not make');
delete process.env.GIT_DIR;
clean(decoy);

console.log('secrets ok: a token and a foreign address are stopped in any folder; the test copy is checked before its push; main and broken tests are guarded');
