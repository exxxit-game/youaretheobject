// Nothing private leaves this laptop: the commits about to go to GitHub must carry no key, token
// or password, and no address but the account's private one (GitHub's noreply), never the owner's
// own email. Run by git before every push (tools/hooks/pre-push; `git config core.hooksPath
// tools/hooks` once per clone), and by tools/publish-preview.mjs on the copy it
// pushes from a folder of its own (git runs no hook there). Prints what it found, never the secret.
// Usage: node tools/secrets.mjs [range]   (default: the commits not on GitHub yet)
//        node tools/secrets.mjs --staged  (what the next commit adds: the commit hook, tools/hooks)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const PRIVATE_EMAIL = '311935850+exxxit-game@users.noreply.github.com';
// addresses GitHub itself writes into merges made on its site
const GITHUB_EMAILS = ['noreply@github.com', PRIVATE_EMAIL];
// the shapes of keys and tokens; a key's own value is checked too where it is kept on this laptop
const PATTERNS = {
  'GitHub token': /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}/,
  'ElevenLabs key': /\bsk_[a-f0-9]{30,}/,
  'Supabase secret key': /\bsb_secret_[A-Za-z0-9_-]{10,}|service[_]role/,   // [_]: so the structure test's own secret check passes this file
  'AWS key': /\bAKIA[0-9A-Z]{16}\b/,
  'private key': /BEGIN [A-Z ]*PRIVATE KEY/
};
const KEY_FILES = [path.join(os.homedir(), '.elevenlabs-key.txt')];

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 28 }).trim();

// git hands GIT_DIR and its kin to a hook's children, and they win over the folder a command
// runs in: another repository is reached only without them
export const withoutGitVars = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));

// range: the commits to look at (git rev-list arguments); cwd: another repository they are in
export function check(range, cwd) {
  const opts = cwd ? { cwd, env: withoutGitVars() } : {};
  const git = (...args) => execFileSync('git', args, { ...opts, encoding: 'utf8', maxBuffer: 1 << 28 }).trim();
  const problems = [];
  const commits = git('rev-list', ...range.split(' ')).split('\n').filter(Boolean);
  for (const c of commits) {
    const bad = [...new Set(git('log', '-1', '--format=%ae%n%ce', c).split('\n'))].filter((e) => !GITHUB_EMAILS.includes(e));
    for (const e of bad) problems.push(`${c.slice(0, 7)}: an address that is not the private one (${e.replace(/^(.).*@/, '$1…@')})`);
  }
  if (!commits.length) return problems;
  const diff = git('log', '-p', '--no-color', '--format=commit %H', ...range.split(' '));
  for (const [name, re] of Object.entries(PATTERNS)) if (re.test(diff)) problems.push(`a ${name} in the commits`);
  for (const f of KEY_FILES) {
    const key = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : '';
    if (key.length > 8 && diff.includes(key)) problems.push(`the key kept in ${path.basename(f)} is in the commits`);
  }
  return problems;
}

// the lines the next commit adds (the commit hook), by the same shapes and the kept key's own
// value; the address is checked by configEmailOk below
export function checkStaged(cwd) {
  const opts = cwd ? { cwd, env: withoutGitVars() } : {};
  const diff = execFileSync('git', ['diff', '--cached', '--no-color', '-U0'], { ...opts, encoding: 'utf8', maxBuffer: 1 << 28 });
  const added = diff.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).join('\n');
  const problems = Object.entries(PATTERNS).filter(([, re]) => re.test(added)).map(([name]) => `a ${name} in the staged changes`);
  for (const f of KEY_FILES) {
    const key = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : '';
    if (key.length > 8 && added.includes(key)) problems.push(`the key kept in ${path.basename(f)} is in the staged changes`);
  }
  return problems;
}

export const notPushed =() => 'HEAD --not --remotes=origin';
export const configEmailOk = () => git('config', 'user.email') === PRIVATE_EMAIL;

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const problems = process.argv[2] === '--staged' ? checkStaged() : check(process.argv[2] || notPushed());
  if (!configEmailOk()) problems.unshift(`git's user.email is not the private address (${PRIVATE_EMAIL})`);
  for (const p of problems) console.log('STOP ', p);
  if (!problems.length) console.log('ok    nothing private in the commits');
  process.exitCode = problems.length ? 1 : 0;
}
