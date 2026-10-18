// Shared shell policy: Claude hooks exit 2; Codex adapts refusal() to JSON denial.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withoutGitVars } from './secrets.mjs';
import { ownText, ownerEntryApplies } from './owner-links.mjs';
import { scan, named, entries, write, lastReport, REVIEWER, REPORT_END, PAPER_REVIEWER, PAPER_END, roomScan, checkedRooms, endsWithBlock } from './review-gate.mjs';
import { split } from './board.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FEATURES = 'docs/features.json';
const mode = process.argv[2];
const input = mode ? await new Promise((done) => {
  let s = '';
  process.stdin.on('data', (c) => { s += c; }).on('end', () => done(s));
}) : '';
const event = mode === 'accepted' ? { cwd: process.cwd() } : (() => { try { return JSON.parse(input || '{}'); } catch { return {}; } })();
const stop = (why) => { process.stderr.write(`${why}\n`); process.exit(2); };
// Judge the event checkout, not the shell's original folder.
const HERE = (() => {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: event.cwd || ROOT, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ROOT; }
})();

// Resolve Claude @imports four hops deep; Codex must read referenced files explicitly.
export function imports(file, hops = 4) {
  let t = '';
  try { t = fs.readFileSync(file, 'utf8').replace(/^ {0,3}(`{3,}|~{3,})[^]*?^ {0,3}\1/gm, '').replace(/(`+)(?!`)[^]*?[^`]\1(?!`)/g, ''); } catch { return []; }
  const found = [...t.matchAll(/(?:^|\s)@((?:\\ |\S)+)/g)].map((m) => path.resolve(path.dirname(file), m[1].replace(/\\ /g, ' ')));
  return hops > 1 ? found.flatMap((f) => [f, ...imports(f, hops - 1)]) : found;
}

// Parse executed commands and substitutions, not quoted or heredoc data.
// Preserve PowerShell quoting and Windows path backslashes.
function commands(line, ps = false) {
  const out = [];
  let i = 0;
  const list = (end) => {
    let depth = 0, cmd, word, op, pending = [];
    const fresh = () => { cmd = { words: [], redirs: [], stdin: [] }; word = null; op = null; };
    const add = (s) => { word = (word ?? '') + s; };
    const endWord = () => {
      if (word === null) return;
      if (op === '<<' || op === '<<-') pending.push({ delim: word, strip: op === '<<-', cmd });
      else if (op === '<<<') cmd.stdin.push(word);
      else if (op) cmd.redirs.push({ op, target: word });
      else cmd.words.push(word);
      word = null; op = null;
    };
    const endCmd = () => { endWord(); if (cmd.words.length || cmd.redirs.length || cmd.stdin.length) out.push(cmd); fresh(); };
    // heredoc bodies start on the line after their operator and end at the delimiter's own line
    const bodies = () => {
      for (const h of pending) {
        const lines = [];
        while (i < line.length) {
          const eol = line.indexOf('\n', i) < 0 ? line.length : line.indexOf('\n', i);
          const l = line.slice(i, eol).replace(/\r$/, '');
          i = eol + 1;
          if ((h.strip ? l.replace(/^\t+/, '') : l) === h.delim) break;
          lines.push(l);
        }
        h.cmd.stdin.push(lines.join('\n'));
      }
      pending = [];
    };
    const nested = (close) => { list(close); add('$(...)'); };
    const quoted = (q) => {
      add('');
      while (i < line.length) {
        const c = line[i], n = line[i + 1];
        if (c === q && ps && n === q) { add(q); i += 2; continue; }
        if (c === q) { i++; return; }
        if (q === '"' && !ps && c === '\\' && '$`"\\\n'.includes(n)) { add(n === '\n' ? '' : n); i += 2; continue; }
        if (q === '"' && ps && c === '`') { add(n ?? ''); i += 2; continue; }
        if (q === '"' && c === '$' && n === '(') { i += 2; nested(')'); continue; }
        if (q === '"' && !ps && c === '`') { i++; nested('`'); continue; }
        add(c); i++;
      }
    };
    fresh();
    while (i < line.length) {
      const c = line[i], n = line[i + 1];
      if (c === end && (end !== ')' || depth === 0)) { i++; endCmd(); return; }
      if (c === ' ' || c === '\t' || c === '\r') { endWord(); i++; continue; }
      if (c === '\n') { endCmd(); i++; bodies(); continue; }
      if (c === ';' || c === '|' || (c === '&' && n !== '>')) { endCmd(); i += c !== ';' && n === c ? 2 : 1; continue; }
      if (c === '$' && n === '(') { i += 2; nested(')'); continue; }
      if (c === '$' && n === '{') { const e = line.indexOf('}', i); add(line.slice(i, e < 0 ? line.length : e + 1)); i = e < 0 ? line.length : e + 1; continue; }
      if (c === '(') { depth++; endCmd(); i++; continue; }
      if (c === ')') { if (depth) depth--; endCmd(); i++; continue; }
      if ((c === '{' && word === null) || c === '}') { endCmd(); i++; continue; }
      if (c === '#' && word === null) { while (i < line.length && line[i] !== '\n') i++; continue; }
      if (ps && c === '<' && n === '#' && word === null) { const e = line.indexOf('#>', i); i = e < 0 ? line.length : e + 2; continue; }
      if (c === '>' || c === '<' || c === '&') {
        // digits (or PowerShell's *) right before it name a stream, not a word
        if (word !== null && /^(\d+|\*)$/.test(word)) word = null; else endWord();
        if (n === '(') { i += 2; nested(')'); continue; }   // <( ) and >( ) run their commands
        const m = line.slice(i).match(/^(?:&>>?|<<<|<<-|<<|<>|<&|>>|>\||>&|<|>)/)[0];
        i += m.length; op = m;
        continue;
      }
      if (c === '"' || c === "'") { i++; quoted(c); continue; }
      if (ps && c === '@' && word === null && (n === "'" || n === '"') && /^[ \t]*\r?\n/.test(line.slice(i + 2))) {
        const from = line.indexOf('\n', i) + 1, e = line.indexOf(`\n${n}@`, from);
        add(line.slice(from, e < 0 ? line.length : e).replace(/\r$/, '')); i = e < 0 ? line.length : e + 3; continue;
      }
      if (!ps && c === '\\') { if (n === '\n') { i += 2; continue; } if (n !== undefined && /[\s"'\\;&|<>()$`{}#*?[\]~!]/.test(n)) { add(n); i += 2; continue; } }
      if (ps && c === '`') { i += n === '\r' && line[i + 2] === '\n' ? 3 : 2; if (n !== '\n' && n !== '\r') add(n ?? ''); continue; }
      if (!ps && c === '`') { i++; nested('`'); continue; }
      add(c); i++;
    }
    endCmd(); bodies();
  };
  list(null);
  return out;
}

// Each refusal names the guard it would switch off (CLAUDE.md "Cannot be undone", tools/hooks)
const WHY = {
  verify: 'skips the git hooks: no commit past the commit check, no push without the secret check',
  hooks: 'switches the git hooks off',
  browser: 'runs Playwright or Chromium, which run only on GitHub: the owner\'s laptop stays free',
  headset: 'restarts the headset or its browser past tools/quest-look.mjs, which first checks that the owner is not wearing it',
  record: 'writes the practice review record, which only Claude Code\'s hook writes when a reviewer run ends',
  recordEnv: 'points the headset tools at another practice review record',
  merge: 'merges into main, the live site: only the owner merges it, on GitHub',
  resolve: 'closes an outside reviewer\'s remark: only the reviewer closes its own, once its next review reads the fix; answer it and leave it open, so a remark never ends on my own word',
  graphqlFile: 'sends GitHub a GraphQL request from a file or stdin, which the guard cannot read for a merge into main: give the query inline (-f query=...)',
  library: 'deletes files of the papers library (Documents\\objekt-files) or moves them out of it; no git holds that folder, so a lost paper comes back only from the backup: leave it, or ask the owner',
};
// Protect all library path spellings; drive-root backups are separate copies.
const LIB = /(^|[\\/"'=])objekt-files([\\/"']|$)/i;
const BACKUP_ROOT = /(^|["'=])([a-z]:[\\/]+|\/[a-z]\/+)objekt-files([\\/"']|$)/i;
const inLib = (x = '') => LIB.test(x) && !BACKUP_ROOT.test(x);
const ABSOLUTE = /^([a-z]:|[\\/~$%])/i;
const DELETERS = /^(rm|del|erase|rd|rmdir|ri|remove-item|unlink|shred|truncate|clear-content|clc|clear-item|cli)$/;
const DELETE_CALL = /\b(?:unlink|rm|rmdir|rmtree|remove|removedirs|truncate)\w*\s*\(/;
const deletesLib = (code) => (LIB.test(code) && DELETE_CALL.test(code) ? WHY.library : null);
// a program by its name, in any path form the shells take
const base = (w = '') => w.replace(/^.*[\\/]/, '').toLowerCase().replace(/\.(exe|cmd|bat|ps1)$/, '');
const RECORD = /practice-reviews|OBJECT_REVIEW_RECORD/i;
// git takes any unambiguous start of a long option; --no-ver could also be --no-verbose
const NO_VERIFY = /^--no-veri(f|fy)?$/;
const hooksAt = (v = '') => v.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '').toLowerCase() === 'tools/hooks';
const playwright = (a) => a.some((v) => /^(@playwright\/test|playwright)(@\S*)?$/.test(v));
// Detect actual journal writes, not harmless references to its name.
const WRITE_CALL = /\b(?:writeFile|appendFile|createWriteStream|copyFile|cpSync|rename|unlink|truncate|rm|remove|write_text|write_bytes)\w*\s*\(|(?<!std(?:out|err)\.)\bwrite(?:Sync)?\s*\(|\bopen(?:Sync)?\s*\([^)]*['"][wa+]/;
const writesRecord = (c) => ((/practice-reviews|OBJECT_REVIEW_RECORD/i.test(c) && WRITE_CALL.test(c)) || (/review-gate/.test(c) && /\bwrite\s*\(/.test(c)) ? WHY.record : null);
// programs that run another command given after their own options (option: the ones taking a value)
const WRAPPERS = { env: /^-[uCS]$/, sudo: /^-[ugCDhpRrTt]$/, nohup: null, time: null, command: null, builtin: null, exec: /^-a$/, nice: /^-n$/, timeout: /^-[sk]$/, stdbuf: null, xargs: /^-[IiLlnPdEsa]$/ };
const KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'fi', 'do', 'done', 'while', 'until', '!', 'case', 'esac']);
const WRITERS = /^(tee|tee-object|rm|del|erase|rd|rmdir|ri|remove-item|unlink|shred|truncate|touch|mv|move|mi|move-item|ren|rename|rni|rename-item|set-content|sc|add-content|ac|clear-content|clc|out-file|new-item|ni|ln|install)$/;
const COPIERS = /^(cp|copy|cpi|copy-item|xcopy|robocopy|rsync|scp)$/;
const NODE_VALUE = /^(-r|--require|--import|--loader|--experimental-loader|-C|--conditions|--input-type|--env-file|--title|--inspect-port|--redirect-warnings)$/;

function git(a) {
  let k = 0;
  for (; k < a.length && a[k].startsWith('-'); k++) {
    if (/^(-C|--git-dir|--work-tree|--namespace|--super-prefix)$/.test(a[k])) k++;
    else if (/^--config-env=core\.hookspath=/i.test(a[k])) return WHY.hooks;
    else if (a[k] === '-c' || a[k] === '--config-env') {
      const [key, ...value] = (a[++k] ?? '').split('=');
      if (key.toLowerCase() === 'core.hookspath' && (a[k - 1] !== '-c' || !hooksAt(value.join('=')))) return WHY.hooks;
    }
  }
  const sub = a[k], rest = a.slice(k + 1);
  if (sub === 'push' && rest.some(x => /^--(all|mirror)$/.test(x) || /^(?:\+)?(?:[^:]*:)?(?:refs\/heads\/)?main$/.test(x))) return WHY.merge;
  for (let j = 0; j < rest.length && (sub === 'commit' || sub === 'push'); j++) {
    const x = rest[j];
    if (x === '--') break;
    if (NO_VERIFY.test(x)) return WHY.verify;
    if (sub === 'push') continue;
    if (/^--(message|file|reuse-message|reedit-message|fixup|squash|author|date|template|cleanup|trailer|pathspec-from-file)$/.test(x)) j++;
    // a cluster of short options: -n is the skip; m F C c t take the rest or the next word
    if (/^-[^-]/.test(x)) {
      for (let q = 1; q < x.length; q++) {
        if (x[q] === 'n') return WHY.verify;
        if ('mFCct'.includes(x[q])) { if (q === x.length - 1) j++; break; }
        if ('uS'.includes(x[q])) break;
      }
    }
  }
  if (sub === 'config') {
    const at = rest.findIndex((x) => x.toLowerCase() === 'core.hookspath');
    if (rest.some((x, j) => /^-?-?remove-section$/.test(x) && /^core$/i.test(rest[j + 1] ?? ''))) return WHY.hooks;
    if (at < 0 || rest.some((x) => /^(--get(-all|-regexp|-urlmatch)?|get|--list|-l|list)$/.test(x))) return null;
    if (rest.some((x) => /^(--unset(-all)?|unset)$/.test(x))) return WHY.hooks;
    if (rest[at + 1] !== undefined && !hooksAt(rest[at + 1])) return WHY.hooks;
  }
  return null;
}

// a command on the headset's own shell (adb shell) that restarts it or its browser
function restarts(w) {
  const p = base(w[0]), rest = w.slice(1).join(' ');
  if (p === 'su' && w.includes('-c')) return commands(w[w.indexOf('-c') + 1] ?? '').some((c) => restarts(c.words));
  return p === 'reboot' || ((p === 'am' || p === 'cmd') && w.includes('force-stop'))
    || (p === 'svc' && /^power (reboot|shutdown)/.test(rest)) || (p === 'setprop' && w[1] === 'sys.powerctl');
}

// Git environment overrides can bypass hooks; inspect values before splitting them.
function setsHooks(w, k) {
  const m = /^(\$?env:)?GIT_CONFIG_(KEY_\d+|PARAMETERS)(=|$)(.*)$/i.exec(w[k] ?? '');
  if (!m) return false;
  const next = w[k + 1] ?? '';
  const value = m[3] ? m[4] : next === '=' || /^-(value|v)$/i.test(next) ? w[k + 2] : next.replace(/^=/, '');
  if (/core\.hookspath/i.test(value ?? '')) return true;
  // PowerShell's named parameters come in any order: -Value core.hooksPath before -Path Env:GIT_CONFIG_KEY_0
  const named = w.findIndex((x) => /^-(value|v)$/i.test(x));
  return named >= 0 && /core\.hookspath/i.test(w[named + 1] ?? '');
}

function judge(words, stdin, ps, here = false) {
  const w = [...words];
  // variables set for the command, and the shell's own words before it
  while (w.length) {
    if (/^(\$env:)?OBJECT_REVIEW_RECORD(=|$)/i.test(w[0]) && (w[0].includes('=') || /^=/.test(w[1] ?? ''))) return WHY.recordEnv;
    if (setsHooks(w, 0)) return WHY.hooks;
    if (/^[A-Za-z_]\w*=/.test(w[0]) || KEYWORDS.has(w[0])) w.shift(); else break;
  }
  const p = base(w[0]), a = w.slice(1);
  if (!p) return null;
  if (/^(export|set|setx|declare|typeset|local|readonly|set-item|si)$/.test(p) && a.some((x) => /^(env:)?OBJECT_REVIEW_RECORD(=|$)/i.test(x))) return WHY.recordEnv;
  if (/^(export|set|setx|declare|typeset|local|readonly|set-item|si|new-item|ni)$/.test(p) && a.some((x, k) => setsHooks(a, k))) return WHY.hooks;
  if (Object.hasOwn(WRAPPERS, p)) {
    let k = 0;
    while (k < a.length && a[k].startsWith('-')) k += WRAPPERS[p]?.test(a[k]) ? 2 : 1;
    return judge(a.slice(k + (p === 'timeout' ? 1 : 0)), stdin, ps, here);
  }
  // shells handed a command as text, or fed one on their input
  if (/^(sh|bash|zsh|dash|ksh)$/.test(p)) {
    const c = a.findIndex((x) => /^-[a-z]*c[a-z]*$/.test(x));
    if (c >= 0) return refusal(a[c + 1] ?? '', false, here);
    if (!a.some((x) => !x.startsWith('-'))) return stdin.map((s) => refusal(s, false, here)).find(Boolean) ?? null;
  }
  if (/^(powershell|pwsh)$/.test(p)) { const c = a.findIndex((x) => /^-(c|command)$/i.test(x)); if (c >= 0) return refusal(a.slice(c + 1).join(' '), true, here); }
  if (p === 'cmd') { const c = a.findIndex((x) => /^\/[ck]$/i.test(x)); if (c >= 0) return refusal(a.slice(c + 1).join(' '), false, here); }
  if (p === 'invoke-expression' || p === 'iex') return refusal(a.join(' '), true, here);
  if (p === 'git') return git(a);
    // Only the owner merges; ignore gh global options.
  if (p === 'gh') {
    const g = [];
    // Option values may precede "pr merge".
    for (let k = 0; k < a.length; k++) { if (/^(-R|--repo|--hostname)$/.test(a[k])) k++; else if (!a[k].startsWith('-')) g.push(a[k]); }
    const pr = g.indexOf('pr');
    // REST/GraphQL forms we use; not a security sandbox (docs/research/restrictions.md).
    if ((pr >= 0 && g[pr + 1] === 'merge') || (g[0] === 'api' && g.some((x) => /(^|\/)(merges|pulls\/\d+\/merge)$/.test(x) || /\b(mergePullRequest|enablePullRequestAutoMerge)\b/.test(x)))) return WHY.merge;
    // a GraphQL body read from a file or stdin (-F x=@file; -f is raw text: gh api --help) or --input
    if (g[0] === 'api' && g.includes('graphql') && (/(^| )(-F ?|--field[ =])[\w-]+=@/.test(a.join(' ')) || a.includes('--input'))) return WHY.graphqlFile;
    // The reviewer, not this executor, resolves review threads.
    if (g[0] === 'api' && a.some((x) => /\b(resolveReviewThread|minimizeComment)\b/.test(x))) return WHY.resolve;
  }
  // the smoke test and Playwright: only on GitHub
  if (/^(npm|pnpm|yarn|bun)$/.test(p)) {
    const x = a.findIndex((v) => /^(exec|x|dlx)$/.test(v));
    if (a.includes('test:smoke') || (x >= 0 && playwright(a.slice(x + 1)))) return WHY.browser;
  }
  if ((/^(npx|pnpx|bunx)$/.test(p) && playwright(a)) || p === 'playwright') return WHY.browser;
  if (p === 'node') {
    let code = null, test = false, check = false;
    const files = [];
    for (let j = 0; j < a.length && code === null; j++) {
      const x = a[j];
      if (files.length && !test) break;
      if (!x.startsWith('-') || x === '-') { files.push(x); continue; }
      if (/^(-e|--eval|-p|--print|-pe)$/.test(x)) code = a[++j] ?? '';
      else if (/^--(eval|print)=/.test(x)) code = x.slice(x.indexOf('=') + 1);
      else if (NODE_VALUE.test(x)) j++;
      test ||= x === '--test';
      check ||= x === '--check' || x === '-c';
    }
    if (code !== null) return writesRecord(code) || deletesLib(code);
    if (!check && files.some((f) => /(^|[\\/])smoke\.mjs$/i.test(f) || /(^|[\\/])@?playwright([\\/]|$)/i.test(f))) return WHY.browser;
    if (!files.length || files[0] === '-') return writesRecord(stdin.join('\n')) || deletesLib(stdin.join('\n'));
  }
  if (/^(python3?|py|perl|ruby)$/.test(p)) {
    const c = a.findIndex((x) => /^-[A-Za-z]*[ce]$/.test(x));
    if (c >= 0 && writesRecord(a[c + 1] ?? '')) return WHY.record;
    if (c >= 0 && deletesLib(a[c + 1] ?? '')) return WHY.library;
  }
  // the headset restarted past the check that the owner is not wearing it
  if (p === 'adb') {
    let k = 0;
    while (k < a.length && a[k].startsWith('-')) k += /^-[stHPL]$/.test(a[k]) ? 2 : 1;
    if (a[k] === 'reboot') return WHY.headset;
    if (a[k] === 'shell' || a[k] === 'exec-out') {
      let s = k + 1;
      while (s < a.length && /^-[ntTx]$/.test(a[s])) s++;
      if ([a.slice(s).join(' '), ...stdin].some((d) => commands(d).some((c) => restarts(c.words)))) return WHY.headset;
    }
  }
  // the practice review record, written by Claude Code's hook alone
  if (WRITERS.test(p) && a.some((x) => RECORD.test(x))) return WHY.record;
  if ((p === 'sed' || p === 'perl') && a.some((x) => /^(-[a-zA-Z]*i|--in-place)/.test(x)) && a.some((x) => RECORD.test(x))) return WHY.record;
  if (p === 'dd' && a.some((x) => /^of=/.test(x) && RECORD.test(x))) return WHY.record;
  if (p === 'find' && a.some((x) => RECORD.test(x)) && a.some((x, j) => x === '-delete' || (/^-(exec|execdir|ok)$/.test(x) && WRITERS.test(base(a[j + 1]))))) return WHY.record;
  if (COPIERS.test(p)) {
    const to = a.findIndex((x) => /^(-destination|-t|--target-directory)$/i.test(x)), places = a.filter((x) => !x.startsWith('-'));
    if (RECORD.test(to >= 0 ? a[to + 1] ?? '' : places[places.length - 1] ?? '')) return WHY.record;
  }
  return library(p, a, here);
}

// Refuse library deletion, purging mirrors and outward moves, including relative paths.
function library(p, a, here) {
  const lib = (x = '') => inLib(x) || (here && !x.startsWith('-') && !ABSOLUTE.test(x));
  // cmd's one-letter switches (/Y, /S) are not places; a Unix path like /tmp is
  const places = a.filter((x) => !x.startsWith('-') && !/^\/[a-z]$/i.test(x));
  if (DELETERS.test(p) && places.some(lib)) return WHY.library;
  if (p === 'find' && places.some(lib) && a.some((x, j) => x === '-delete' || (/^-(exec|execdir|ok)$/.test(x) && DELETERS.test(base(a[j + 1]))))) return WHY.library;
  // a move loses nothing while it stays inside; out of the library it does
  if (/^(mv|move|mi|move-item)$/.test(p)) {
    const t = a.findIndex((x) => /^(-destination|-t|--target-directory)$/i.test(x));
    const to = t >= 0 ? a[t + 1] ?? '' : places[places.length - 1] ?? '';
    if (!lib(to) && places.filter((x) => x !== to).some(lib)) return WHY.library;
  }
  // robocopy: /MIR and /PURGE delete in the destination, /MOV and /MOVE take the source away
  if (p === 'robocopy') {
    const [from, to] = a.filter((x) => !x.startsWith('/'));
    if ((a.some((x) => /^\/(mir|purge)$/i.test(x)) && lib(to)) || (a.some((x) => /^\/mov(e)?$/i.test(x)) && lib(from))) return WHY.library;
  }
  if (p === 'rsync') {
    const to = places[places.length - 1] ?? '';
    if ((a.some((x) => /^--del(ete)?/.test(x)) && lib(to)) || (a.includes('--remove-source-files') && places.slice(0, -1).some(lib))) return WHY.library;
  }
  return null;
}

// Judge programs and arguments; naming a forbidden command in data remains allowed.
export function refusal(line, ps = false, here = false) {
  for (const c of commands(line, ps)) {
    if (c.redirs.some((r) => r.op.includes('>') && RECORD.test(r.target))) return WHY.record;
    const why = judge(c.words, c.stdin, ps, here);
    if (why) return why;
    // after a cd into the library the relative paths are in it; a cd elsewhere (or up) leaves it, and so
    // does a bare cd, which goes home
    if (/^(cd|chdir|pushd|set-location|sl|push-location)$/.test(base(c.words[0]))) {
      const to = c.words.slice(1).find((x) => !x.startsWith('-')) ?? '';
      here = inLib(to) || (here && to !== '' && !ABSOLUTE.test(to) && !to.startsWith('..'));
    }
  }
  return null;
}

// a start line is cut to EXTRA_LINE characters, so the start's length on the worst day is known
export const EXTRA_LINE = 350;
const clip = (line) => (line.length > EXTRA_LINE ? `${line.slice(0, EXTRA_LINE - 1)}…` : line);
// Surface failed GitHub runs; success, cancellation and skipping need no warning.
const NEEDS_LOOK = new Set(['failure', 'timed_out', 'startup_failure', 'action_required']);
export const ciLine = (run) => (NEEDS_LOOK.has(run?.conclusion)
  ? `GitHub's tests are RED on room-polish (${run.conclusion}: ${run.displayTitle}): ${run.url} (gh run view ${run.databaseId} --log-failed)` : null);

if (mode === 'pre') {
  const tool = String(event.tool_name || '');
  if (/^(Write|Edit|NotebookEdit)$/.test(tool) && RECORD.test(String(event.tool_input?.file_path || event.tool_input?.notebook_path || ''))) stop('REFUSED: the practice review record is written only by Claude Code\'s hook when a reviewer run ends; run the practice-reviewer agent instead.');
  // the shell keeps its folder between calls, so a session standing in the library is seen by its cwd
  const why = refusal(String(event.tool_input?.command || ''), tool === 'PowerShell', inLib(`${String(event.cwd || '').replace(/\\/g, '/')}/`));
  if (why) stop(`REFUSED: this command ${why}. Do the work so the guard passes instead.`);
  process.exit(0);
}

const LOG = path.join(os.homedir(), 'Documents', 'objekt-files', 'notes', 'owner-messages.md');
const gitHere = (...a) => { try { return execFileSync('git', a, { cwd: HERE, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };

// Only recent whole-message numbered acceptance bound to this checkout can change a feature.
if (mode === 'accepted') {
  const list = (f) => { try { return JSON.parse(f()).features; } catch { return null; } };
  const now = list(() => input), was = list(() => gitHere('show', `HEAD:${FEATURES}`)), n = was || now || [];
  const order = (l) => (l || []).map((f) => f.id).filter((id) => was?.some((f) => f.id === id) && now?.some((f) => f.id === id)).join();
  const yes = new Set();
  try {
    for (const m of fs.readFileSync(LOG, 'utf8').split('\n## ')) {
      if (!ownerEntryApplies(m.split('\n')[0], HERE)) continue;
      const said = m.slice(m.indexOf('\n') + 1);
      if (!(Date.parse(m.split(' ')[0]) > Date.now() - 108e5)) continue;
      if (/^\s*(не\s+принимаю[\s,.!и\d]*|стоп[\s.!]*)$/i.test(said)) yes.clear();
      else for (const k of said.match(/^\s*принимаю[\s,.!и\d]*$/i)?.[0].match(/\d+/g) || []) yes.add(n[k - 1]?.id);
    }
  } catch { /* no log */ }
  const moved = [...(now || []).filter((n) => n.passes && !was?.some((w) => w.id === n.id && w.passes)), ...(was || []).filter((w) => !now?.some((n) => n.id === w.id))];
  process.exit((!was && !input.trim()) || (now && order(now) === order(was) && moved.every((f) => yes.has(f.id))) ? 0 : 1);
}

// start: Claude Code adds this output to the context at startup, at resume and after each compaction.
if (mode === 'start') {
  const out = [];
  const branch = gitHere('rev-parse', '--abbrev-ref', 'HEAD');
  // Legacy Claude worktrees may be reused; inspect this copy first.
  if (gitHere('rev-parse', '--verify', '-q', 'room-polish') && gitHere('merge-base', '--is-ancestor', 'room-polish', 'HEAD') === null) {
    const behind = gitHere('rev-list', '--count', 'HEAD..room-polish');
    const own = gitHere('rev-list', '--count', 'room-polish..HEAD');
    if (own === '0' && gitHere('status', '--porcelain') === '' && gitHere('merge', '--ff-only', 'room-polish') !== null) {
      out.push(`This window's copy (${branch}) was ${behind} commits behind room-polish and is now brought up to it: CLAUDE.md and the files it imports loaded before that; read them again now.`);
    } else {
      out.push(`WARNING: this checkout (${branch}) lacks ${behind} commits of room-polish and has work of its own or unsaved changes: merge room-polish before anything else, then read CLAUDE.md and every file it imports again.`);
    }
  }
  // Surface the next feature, never a task overriding the owner's message.
  try {
    const next = JSON.parse(fs.readFileSync(path.join(HERE, FEATURES), 'utf8')).features.find((f) => !f.passes);
    out.push(next ? `Current feature (${FEATURES}): ${next.id}: ${next.what}` : `Every feature in ${FEATURES} passes.`);
  } catch { out.push(`WARNING: ${FEATURES} is missing or unreadable: the session has no list of features.`); }
  try {
    const runs = JSON.parse(execFileSync('gh', ['run', 'list', '--branch', 'room-polish', '--workflow', 'test.yml', '--limit', '1', '--json', 'conclusion,displayTitle,url,databaseId'], { cwd: HERE, encoding: 'utf8', timeout: 10000, windowsHide: true }));
    const red = ciLine(runs[0]);
    if (red) out.push(clip(red));
  } catch { /* GitHub out of reach: nothing to say */ }
  // his brake, once a window: a new session (source startup or fork), never a resume or a compaction, so no
  // record of ours is needed; the app may not show him the hook's line, so it comes to me to say first too
  let him = null;
  if (event.source === 'startup' || event.source === 'fork') {
    const day = (k) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - k); return d.toISOString(); };
    const { game, process: proc } = split(gitHere('log', '--all', '--no-merges', `--since=${day(1)}`, `--until=${day(0)}`, '--name-only', '--pretty=format:@@%h') || '');
    const at = (r) => { try { return JSON.parse(gitHere('show', `${r}:${FEATURES}`)).features; } catch { return null; } };
    let took = 0;
    for (const c of (gitHere('log', '--since=7.days', '--format=%H', '--', FEATURES) || '').split('\n').filter(Boolean)) {
      const was = at(`${c}^`) || [];
      took += (at(c) || []).filter((f) => f.passes && was.some((w) => w.id === f.id && w.passes === false)).length;
    }
    him = `За 7 дней ты принял вещей из списка: ${took}. Вчера коммитов: в игру ${game}, в процесс ${proc}.`;
    out.unshift(`Say to him first, word for word: «${him}»`);
  }
  process.stdout.write(JSON.stringify({ ...(him && { systemMessage: him }), hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: out.join('\n\n') } }));
  process.exit(0);
}

// Record complete reviewer reports with matching starts and fingerprints; otherwise record void.
if (mode === 'subagent-start' || mode === 'subagent-stop') {
  if (event.agent_type !== REVIEWER && event.agent_type !== PAPER_REVIEWER) process.exit(0);
  // a subagent here hands its report back through a tool call, not as its last text, so the
  // report is read from the transcript's last assistant entry: its text or its tool call's input.
  // Only the reviewer's own words count, never the caller's prompt, which names the block too.
  const reportOf = (end) => {
    const said = String(event.last_assistant_message || '');
    try { if (!endsWithBlock(said, end) && event.agent_transcript_path) return lastReport(event.agent_transcript_path); } catch { /* no transcript to read */ }
    return said;
  };
  // the paper check, room by room: a room counts when it did not change while it was read and the
  // report's last line lists it (tools/review-gate.mjs, requirePaper)
  if (event.agent_type === PAPER_REVIEWER) {
    const rooms = roomScan(HERE);
    if (mode === 'subagent-start') {
      write({ kind: 'paper-start', agent: event.agent_id, rooms: Object.fromEntries(Object.entries(rooms).map(([r, s]) => [r, s.print])), root: HERE });
      process.exit(0);
    }
    const start = entries().filter((e) => e.kind === 'paper-start' && e.agent === event.agent_id).pop();
    const report = reportOf(PAPER_END);
    const listed = endsWithBlock(report, PAPER_END) ? checkedRooms(report).filter((r) => rooms[r]) : [];
    if (!listed.length) write({ kind: 'void', agent: event.agent_id, why: 'its report did not reach its last line listing the rooms' });
    for (const room of listed) {
      const why = !start ? 'no start seen for this run' : start.rooms?.[room] !== rooms[room].print ? 'the room changed while it read it' : '';
      write(why ? { kind: 'void', agent: event.agent_id, room, why } : { kind: 'paper', agent: event.agent_id, room, ...rooms[room], named: named(report), root: HERE });
    }
    process.exit(0);
  }
  const { print, files } = scan(HERE);
  if (mode === 'subagent-start') {
    write({ kind: 'start', agent: event.agent_id, print, root: HERE });
    process.exit(0);
  }
  const start = entries().filter((e) => e.kind === 'start' && e.agent === event.agent_id).pop();
  const report = reportOf(REPORT_END);
  const why = !start ? 'no start seen for this run'
    : start.print !== print ? 'the files changed while it read them'
      : !endsWithBlock(report, REPORT_END) ? 'its report did not reach its last block' : '';
  write(why ? { kind: 'void', agent: event.agent_id, why } : { kind: 'review', agent: event.agent_id, print, files, named: named(report), root: HERE, transcript: event.agent_transcript_path || '' });
  process.exit(0);
}

// Keep exact owner messages outside the public repo; logging failure never blocks a message.
if (mode === 'prompt') {
  try {
    fs.mkdirSync(path.dirname(LOG), { recursive: true });
    const own = ownText(event.prompt || '');
    if (own) fs.appendFileSync(LOG, `\n## ${new Date().toISOString()} ${event.session_id || ''}\n${own.replace(/^## /gm, ' ## ')}\n`);
  } catch { /* a failed log must not stop his message */ }
  process.exit(0);
}
