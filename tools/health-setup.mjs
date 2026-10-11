// The setup around the code, read from what is really on this laptop, not from what a doc says it
// is: git signs privately and runs its guard hooks, main is protected on GitHub, every memory file
// is in the memory index, the plugins are the ones the owner decided, and the app's Claude Code is
// new enough for the hooks. Each of these was wrong once while every test passed: a setting shows
// only in use, so the health check reads them at every session start.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PRIVATE_EMAIL } from './secrets.mjs';

const result = (level, text) => ({ level, text });
const ok = (text) => result('ok', text);
const broken = (text) => result('broken', text);
const warning = (text) => result('warning', text);
const info = (text) => result('info', text);
// short timeouts: the health check runs inside the session-start hook, which has 15 s in all
const sh = (cmd, args, cwd, timeout = 5000) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout, windowsHide: true });
  return r.status === 0 ? (r.stdout || '').trim() : null;
};

// --- git: the private address and the guard hooks --------------------------------------------
export const HOOKS = ['pre-commit', 'pre-push'];
// git's hook setting is shared by every checkout and may be relative (to the checkout) or absolute
export function hooksProblems(hooksPath, root, exists = fs.existsSync) {
  if (!hooksPath) return ['git runs no guard hooks (core.hooksPath is not set): git config core.hooksPath tools/hooks'];
  const dir = path.isAbsolute(hooksPath) ? hooksPath : path.join(root, hooksPath);
  return HOOKS.filter((h) => !exists(path.join(dir, h))).map((h) => `the hooks folder git runs (${dir}) has no ${h}: bring the main folder up to date`);
}
export function checkGit(root) {
  const email = sh('git', ['config', 'user.email'], root);
  const out = [email === PRIVATE_EMAIL ? ok('git signs with the private address') : broken(`git signs with ${email || 'no address'}, not the private one: git config user.email ${PRIVATE_EMAIL}`)];
  const problems = hooksProblems(sh('git', ['config', 'core.hooksPath'], root), root);
  out.push(...(problems.length ? problems.map(broken) : [ok('git runs the guard hooks before each commit and push')]));
  return out;
}

// main is the live site: on GitHub it can be neither deleted nor rewritten (the ruleset "main is the
// live site"); a switch on GitHub leaves no trace in the code
export const MAIN_RULES = ['deletion', 'non_fast_forward'];
export function checkMainRules() {
  const rules = sh('gh', ['api', 'repos/exxxit-game/youaretheobject/rules/branches/main', '--jq', '[.[].type] | join(" ")']);
  if (rules === null) return [warning('could not read the rules of main on GitHub (no network, or gh not signed in)')];
  const missing = MAIN_RULES.filter((r) => !rules.split(' ').includes(r));
  return [missing.length ? broken(`main on GitHub can be ${missing.join(' and ')}: restore the ruleset "main is the live site"`) : ok('main can be neither deleted nor rewritten on GitHub')];
}

// --- my memory: a file the index does not name never loads ----------------------------------
export function memoryIndexProblems(indexText, files) {
  const named = [...indexText.matchAll(/\]\(([^)]+\.md)\)/g)].map((m) => m[1]);
  return [...files.filter((f) => !named.includes(f)).map((f) => `a memory file the index does not name: ${f}`),
    ...named.filter((f) => !files.includes(f)).map((f) => `the index names a missing ${f}`)];
}
export function checkMemory(mainDir) {
  const dir = path.join(os.homedir(), '.claude', 'projects', mainDir.replace(/[^A-Za-z0-9]/g, '-'), 'memory');
  const index = path.join(dir, 'MEMORY.md');
  if (!fs.existsSync(index)) return [warning(`no memory index at ${index}`)];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'MEMORY.md');
  const problems = memoryIndexProblems(fs.readFileSync(index, 'utf8'), files);
  return problems.length ? [broken(`memory: ${problems.join('; ')}: fix MEMORY.md`)] : [ok(`the memory index names all ${files.length} memory files`)];
}

// --- the plugins the owner decided (docs/owner-decisions.md) ---------------------------------
// on for every project: CodeRabbit (his 14-day trial; it replaced the PR review toolkit) and the
// TypeScript language server (his word, 9.10); any other plugin switched on in the user settings is one
// he did not decide
export const PLUGINS_ON = ['coderabbit@claude-plugins-official', 'typescript-lsp@claude-plugins-official'];
export function pluginProblems(enabled = {}) {
  const on = Object.entries(enabled).filter(([, v]) => v === true).map(([k]) => k);
  return [...PLUGINS_ON.filter((p) => !on.includes(p)).map((p) => `${p} is off, though decided on`),
    ...on.filter((p) => !PLUGINS_ON.includes(p)).map((p) => `${p} is on, though not decided`)];
}
export function checkPlugins(file = path.join(os.homedir(), '.claude', 'settings.json')) {
  let enabled;
  try { enabled = JSON.parse(fs.readFileSync(file, 'utf8')).enabledPlugins; } catch { return [warning(`could not read ${file}`)]; }
  const problems = pluginProblems(enabled);
  return problems.length ? [broken(`plugins: ${problems.join('; ')}: claude plugin enable|disable <name>`)] : [ok(`the plugins are the decided ones (${PLUGINS_ON.length} on)`)];
}

// --- the Claude Code inside the desktop app ---------------------------------------------------
// the prompt and agent hooks need 2.1.294 or later, and onFailure: block on the guards needs 2.1.295
// (Claude Code's hooks reference, onFailure; docs/state.md); the app keeps each version it
// downloaded in its own folder and runs the newest
export const MIN_VERSION = '2.1.295';
const parts = (v) => v.split('.').map(Number);
export const atLeast = (v, min) => { const a = parts(v), b = parts(min); for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]; return true; };
const byVersion = (a, b) => { const x = parts(a), y = parts(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; };
export const newest = (names) => names.filter((n) => /^\d+\.\d+\.\d+$/.test(n)).sort(byVersion).pop() || null;
export function checkAppVersion(dir = path.join(process.env.APPDATA || '', 'Claude', 'claude-code')) {
  if (!process.env.APPDATA || !fs.existsSync(dir)) return [info('the desktop app\'s Claude Code not found on this computer')];
  const v = newest(fs.readdirSync(dir));
  if (!v) return [warning(`no Claude Code version in ${dir}`)];
  return [atLeast(v, MIN_VERSION) ? ok(`the app's Claude Code ${v}`) : broken(`the app's Claude Code is ${v}, the hooks need ${MIN_VERSION}: Help → Check for Updates`)];
}

export function runSetup(root, mainDir) {
  return [...checkGit(root), ...checkMainRules(), ...(mainDir ? checkMemory(mainDir) : []), ...checkPlugins(), ...checkAppVersion()];
}
