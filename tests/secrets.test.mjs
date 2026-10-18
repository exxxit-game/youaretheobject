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
// test failing; the whole suite runs on GitHub); before a push, the secret check. Main, the live site, is held by
// its GitHub rule (a pull request with the test green, no bypass), not by a hook. Run where a shell is (GitHub's
// machines always; Git Bash here).
const hook = (name) => fileURLToPath(new URL(`../tools/hooks/${name}`, import.meta.url));
const commitHook = fs.readFileSync(hook('pre-commit'), 'utf8');
assert.doesNotMatch(commitHook, /&\s*$/m, 'quick tests must not run concurrently on the owner laptop');
assert.ok(/node tools\/secrets\.mjs --staged/.test(commitHook) && /node --check/.test(commitHook) && /package\.json/.test(commitHook),
  'the pre-commit hook must check the staged changes for secrets, parse the staged scripts and run the quick tests');
const pushHook = fs.readFileSync(hook('pre-push'), 'utf8');
assert.ok(/node tools\/secrets\.mjs "\$local_sha --not --remotes=origin"/.test(pushHook), 'the pre-push hook must check every pushed commit for secrets');
const probe = spawnSync('sh', [hook('pre-push')], { input: `refs/heads/x ${'0'.repeat(40)} refs/heads/x ${'1'.repeat(40)}\n`, encoding: 'utf8' });
if (probe.error) console.log('(no shell here: the hooks are run on GitHub)');
else assert.equal(probe.status, 0, `the pre-push hook stopped deleting a branch, which carries nothing to check:\n${probe.stdout}`);

// Git must parse the index, including commit -a's temporary index, not later working edits.
// Other guards have their own tests above; stub them only in this disposable syntax fixture.
{
  const fixture = repo({ 'package.json': '{"type":"module"}', 'script.js': 'export const x = 1;\n' }, PRIVATE_EMAIL);
  const git = (...args) => spawnSync('git', args, { cwd: fixture, env: withoutGitVars(), encoding: 'utf8', timeout: 30000 });
  const ok = (...args) => { const r = git(...args); assert.equal(r.status, 0, r.stderr + r.stdout); };
  const script = path.join(fixture, 'script.js');
  const commit = (...args) => git('-c', 'user.name=test', '-c', 'user.email=' + PRIVATE_EMAIL,
    '-c', 'commit.gpgsign=false', 'commit', '-qm', 'syntax fixture', ...args);
  try {
    fs.mkdirSync(path.join(fixture, 'hooks'));
    fs.mkdirSync(path.join(fixture, 'tools'));
    fs.writeFileSync(path.join(fixture, 'hooks/pre-commit'), commitHook, { mode: 0o755 });
    fs.writeFileSync(path.join(fixture, 'tools/secrets.mjs'), 'process.exit(0);');
    fs.writeFileSync(path.join(fixture, 'tools/claude-guard.mjs'), 'for await (const c of process.stdin) {}');
    ok('config', 'core.hooksPath', 'hooks');
    fs.writeFileSync(script, 'export const = ;\n');
    ok('add', 'script.js');
    fs.writeFileSync(script, 'export const x = 2;\n');
    const badIndex = commit();
    assert.notEqual(badIndex.status, 0, 'broken staged script passed because its working copy was fixed');
    assert.match(badIndex.stdout + badIndex.stderr, /does not parse/);
    ok('add', 'script.js');
    fs.writeFileSync(script, 'export const = ;\n');
    const goodIndex = commit();
    assert.equal(goodIndex.status, 0, 'valid staged module rejected for an unstaged edit: ' + goodIndex.stderr + goodIndex.stdout);
    const all = commit('-a');
    assert.notEqual(all.status, 0, 'commit -a ignored its temporary index');
    assert.match(all.stdout + all.stderr, /does not parse/);
  } finally { clean(fixture); }
}

assert.equal(fs.readFileSync(path.join(decoy, '.git', 'config'), 'utf8'), decoyConfig, 'a GIT_DIR from a hook reached a repository this test did not make');
delete process.env.GIT_DIR;
clean(decoy);

console.log('secrets ok: a token and a foreign address are stopped in any folder; the test copy is checked before its push; broken tests are guarded');
