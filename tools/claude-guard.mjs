// Guards on the assistant itself, run by Claude Code (.claude/settings.json), not by its memory:
// a rule written as text is skipped under load, a hook is not. Exit 2 stops the action and tells
// the assistant why (code.claude.com/docs/en/hooks: PreToolUse exit 2 blocks the tool call). The Stop
// hook keeps the turn going with additionalContext, the hooks reference's way for a hook "working as
// designed" (shown as Stop hook feedback, not as an error); Claude Code ends the turn anyway after 8
// continuations in a row with no tool call between them.
// Bans only where a mistake cannot be undone or costs the owner time; judgments by word lists were
// taken out by his yes to the process review of 11.10 (docs/owner-decisions.md): they held words, not
// claims, and stopped correct work more often than wrong.
//   pre:  a shell command that skips the git hooks or runs Playwright on the laptop is refused, and
//         so are a connected browser tool, any write to the live database and any write of mine to
//         the practice review record
//   subagent-start, subagent-stop: a practice reviewer's run is recorded for the owner's automatic
//         stop before VR in the headset and the test copy (tools/review-gate.mjs)
//   stop: a turn does not end while work is unsaved or not on GitHub, or the main folder lacks it,
//         or a command has run under Claude Code longer than ten minutes (tools/leftovers.mjs)
//   start, prompt: the top of the board comes back at start and after every compaction, with
//         yesterday's commits to the game and to the process (his brake); every owner message is logged
// Imported with no mode (tests/guard.test.mjs), it only defines refusal() and readOnlySql().
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withoutGitVars } from './secrets.mjs';
import { typedText } from './owner-links.mjs';
import { scan, named, entries, write, lastReport, REVIEWER, REPORT_END } from './review-gate.mjs';
import { BOARD, top, split } from './board.mjs';
import { leftoverLine } from './leftovers.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECISIONS = 'docs/owner-decisions.md';
const mode = process.argv[2];
const input = mode ? await new Promise((done) => {
  let s = '';
  process.stdin.on('data', (c) => { s += c; }).on('end', () => done(s));
}) : '';
const event = (() => { try { return JSON.parse(input || '{}'); } catch { return {}; } })();
const stop = (why) => { process.stderr.write(`${why}\n`); process.exit(2); };
// The checkout the session works in: Claude Code runs this script from the folder the session was
// opened in (the main folder), while the work sits in the session's own worktree, named by the
// event's cwd. Checked there, or the guard would judge the main folder instead of the work.
const HERE = (() => {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: event.cwd || ROOT, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ROOT; }
})();

// A command line read the way the shell reads it (POSIX sh; PowerShell where it differs: backtick
// escapes, '' inside single quotes, @'...'@ here-strings): the simple commands it runs, split on
// ; & && || | ( ) { } and newlines, each with its words (quotes removed), its redirections and
// the text fed to it (heredoc bodies, here-strings). Separators inside quotes or heredoc bodies
// split nothing, so text that only names a command is no command; $(...) and `...` do run, so
// their commands are listed too. A backslash before a letter stays (a Windows path).
export function commands(line, ps = false) {
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
  commitN: '"git commit -n" skips the git hooks',
  hooks: 'switches the git hooks off',
  browser: 'runs Playwright or Chromium, which run only on GitHub: the owner\'s laptop stays free',
  headset: 'restarts the headset or its browser past tools/quest-look.mjs, which first checks that the owner is not wearing it',
  record: 'writes the practice review record, which only Claude Code\'s hook writes when a reviewer run ends',
  recordEnv: 'points the headset tools at another practice review record',
  merge: 'merges into main, the live site, on GitHub, past the push guard: main changes only by a push with the owner\'s word (OBJECT_LIVE=owner-said-yes)',
  resolve: 'closes an outside reviewer\'s remark: only the reviewer closes its own, once its next review reads the fix; answer it and leave it open, so a remark never ends on my own word',
  graphqlFile: 'sends GitHub a GraphQL request from a file or stdin, which the guard cannot read for a merge into main: give the query inline (-f query=...)',
};
// a program by its name, in any path form the shells take
const base = (w = '') => w.replace(/^.*[\\/]/, '').toLowerCase().replace(/\.(exe|cmd|bat|ps1)$/, '');
const RECORD = /practice-reviews|OBJECT_REVIEW_RECORD/i;
// git takes any unambiguous start of a long option; --no-ver could also be --no-verbose
const NO_VERIFY = /^--no-veri(f|fy)?$/;
const hooksAt = (v = '') => v.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '').toLowerCase() === 'tools/hooks';
const playwright = (a) => a.some((v) => /^(@playwright\/test|playwright)(@\S*)?$/.test(v));
// code handed to an interpreter that writes the record (or calls review-gate.mjs's write())
const WRITE_CALL = /\b(?:writeFile|appendFile|createWriteStream|copyFile|cpSync|rename|unlink|truncate|rm|remove|write_text|write_bytes)\w*\s*\(|(?<!std(?:out|err)\.)\bwrite(?:Sync)?\s*\(|\bopen(?:Sync)?\s*\([^)]*['"][wa+]/;
const writesRecord = (code) => (/practice-reviews|review-gate|OBJECT_REVIEW_RECORD/i.test(code) && WRITE_CALL.test(code) ? WHY.record : null);
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
  for (let j = 0; j < rest.length && (sub === 'commit' || sub === 'push'); j++) {
    const x = rest[j];
    if (x === '--') break;
    if (NO_VERIFY.test(x)) return WHY.verify;
    if (sub === 'push') continue;
    if (/^--(message|file|reuse-message|reedit-message|fixup|squash|author|date|template|cleanup|trailer|pathspec-from-file)$/.test(x)) j++;
    // a cluster of short options: -n is the skip; m F C c t take the rest or the next word
    if (/^-[^-]/.test(x)) {
      for (let q = 1; q < x.length; q++) {
        if (x[q] === 'n') return WHY.commitN;
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

// git reads config from the environment too (git-config(1), ENVIRONMENT: GIT_CONFIG_KEY_<n> with
// GIT_CONFIG_VALUE_<n>, and GIT_CONFIG_PARAMETERS), so core.hooksPath set there skips the hooks as -c does;
// the value follows the name's "=", or is the next word (PowerShell's "= value", set-item and setx),
// or the word after PowerShell's named -Value (-V)
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

function judge(words, stdin, ps) {
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
    return judge(a.slice(k + (p === 'timeout' ? 1 : 0)), stdin, ps);
  }
  // shells handed a command as text, or fed one on their input
  if (/^(sh|bash|zsh|dash|ksh)$/.test(p)) {
    const c = a.findIndex((x) => /^-[a-z]*c[a-z]*$/.test(x));
    if (c >= 0) return refusal(a[c + 1] ?? '', false);
    if (!a.some((x) => !x.startsWith('-'))) return stdin.map((s) => refusal(s, false)).find(Boolean) ?? null;
  }
  if (/^(powershell|pwsh)$/.test(p)) { const c = a.findIndex((x) => /^-(c|command)$/i.test(x)); if (c >= 0) return refusal(a.slice(c + 1).join(' '), true); }
  if (p === 'cmd') { const c = a.findIndex((x) => /^\/[ck]$/i.test(x)); if (c >= 0) return refusal(a.slice(c + 1).join(' '), false); }
  if (p === 'invoke-expression' || p === 'iex') return refusal(a.join(' '), true);
  if (p === 'git') return git(a);
  // a merge on GitHub skips the push guard; gh's own options may stand before or between its command
  // words (gh pr -R owner/repo merge), so they are set aside before the words are read
  if (p === 'gh') {
    const g = [];
    // an option's separate value would read as a command word, so "pr merge" is looked for anywhere
    for (let k = 0; k < a.length; k++) { if (/^(-R|--repo|--hostname)$/.test(a[k])) k++; else if (!a[k].startsWith('-')) g.push(a[k]); }
    const pr = g.indexOf('pr');
    // through the REST paths or the GraphQL mutations (a query given as -f query=...)
    if ((pr >= 0 && g[pr + 1] === 'merge') || (g[0] === 'api' && g.some((x) => /(^|\/)(merges|pulls\/\d+\/merge)$/.test(x) || /\b(mergePullRequest|enablePullRequestAutoMerge)\b/.test(x)))) return WHY.merge;
    // a GraphQL body the guard cannot read: a field read from a file or stdin (-F query=@file, gh's
    // "@" form) or the whole request from --input; our own calls give the query inline
    if (g[0] === 'api' && g.includes('graphql') && (a.some((x) => /^[\w-]+=@/.test(x)) || a.includes('--input'))) return WHY.graphqlFile;
    // the session under review does not close the remarks on its own work: it answers, and the
    // reviewer closes what it sees fixed in its next review
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
    if (code !== null) return writesRecord(code);
    if (!check && files.some((f) => /(^|[\\/])smoke\.mjs$/i.test(f) || /(^|[\\/])@?playwright([\\/]|$)/i.test(f))) return WHY.browser;
    if (!files.length || files[0] === '-') return writesRecord(stdin.join('\n'));
  }
  if (/^(python3?|py|perl|ruby)$/.test(p)) {
    const c = a.findIndex((x) => /^-[A-Za-z]*[ce]$/.test(x));
    if (c >= 0 && writesRecord(a[c + 1] ?? '')) return WHY.record;
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
  return null;
}

// Why this command line may not run, or null: each command it runs is judged by its program and
// arguments, never by words that only stand in it. tests/guard.test.mjs runs both ways.
export function refusal(line, ps = false) {
  for (const c of commands(line, ps)) {
    if (c.redirs.some((r) => r.op.includes('>') && RECORD.test(r.target))) return WHY.record;
    const why = judge(c.words, c.stdin, ps);
    if (why) return why;
  }
  return null;
}
const RECORD_FILE = /practice-reviews/i;

// Connected tools that do what a refused command would: a browser started on the laptop, and
// writes to the live database (the owner: the assistant's access to the server is read only;
// changes go through supabase/migrations on his word). Names are matched across connectors.
const BROWSER_TOOLS = /^mcp__plugin_(playwright|chrome-devtools)/;
const DB_WRITES = /__(apply_migration|deploy_edge_function|pause_project|restore_project|create_project|delete_branch|merge_branch|reset_branch|rebase_branch|confirm_cost)$/;
// The GitHub connector writes to the repository directly, past the push hook that guards main
// and checks for secrets: work reaches GitHub only through git push.
const GITHUB_WRITES = /__(push_files|create_or_update_file|delete_file|merge_pull_request|update_pull_request_branch|create_repository|fork_repository)$/;
// A SELECT still writes when it calls a function that writes: ours (submit_* add rows) and the
// built-ins and extensions that change the server, sequences, settings, files or the outside world.
const SQL_WRITE_CALLS = /(\b(submit_\w+|nextval|setval|set_config|pg_terminate_backend|pg_cancel_backend|pg_reload_conf|pg_rotate_logfile|pg_switch_wal|pg_promote|pg_notify|pg_advisory\w*|pg_stat_reset\w*|pg_create_\w+|pg_drop_\w+|pg_replication_\w+|pg_file_\w+|lo_\w+|dblink\w*|http\w*)\s*\(|\b(vault|net|pgmq)\.\w+|\bcron\.\w+\s*\()/i;
// a query that only reads: one statement, starting with a read, naming no write. Text in quotes is a
// value, not a command: a privilege check names 'INSERT' or 'submit_run(jsonb)' and only reads (four
// such reads were refused); reading the cron schedule's table is a read, calling cron's functions is not
const unquoted = (q) => String(q).replace(/'(?:[^']|'')*'/g, "''");
export const readOnlySql = (raw) => {
  const q = unquoted(raw);
  return /^\s*(select|with|explain|show)\b/i.test(q) && !/;\s*\S/.test(q)
    && !/\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|call|do|merge|vacuum|comment|set|reset|lock|refresh|reindex|cluster|import|security)\b/i.test(q)
    && !SQL_WRITE_CALLS.test(q);
};

// GitHub's own tests on room-polish (the smoke test runs only there): ten red runs in a row went
// unseen while work went on, so the start says a red last run (gh run list --json: one run or none)
// the start's lines after the board, each cut to EXTRA_LINE characters, the health check to
// HEALTH_SHOWN problems: so the start's length on the worst day is known (tests/guard.test.mjs)
export const HEALTH_SHOWN = 5, EXTRA_LINE = 350;
const clip = (line) => (line.length > EXTRA_LINE ? `${line.slice(0, EXTRA_LINE - 1)}…` : line);
// conclusions that need a look (GitHub's run conclusions): a failure, a run that timed out, never
// started or waits for an approval; a success, a skip or a cancel is quiet
const NEEDS_LOOK = new Set(['failure', 'timed_out', 'startup_failure', 'action_required']);
export const ciLine = (run) => (NEEDS_LOOK.has(run?.conclusion)
  ? `GitHub's tests are RED on room-polish (${run.conclusion}: ${run.displayTitle}): ${run.url}: read why before other work (gh run view ${run.databaseId} --log-failed)` : null);

if (mode === 'pre') {
  const tool = String(event.tool_name || '');
  if (BROWSER_TOOLS.test(tool)) stop('REFUSED: this tool starts a browser on the laptop; Playwright and Chromium run only on GitHub (use the browser pane for a look).');
  if (DB_WRITES.test(tool)) stop('REFUSED: the live database is read-only for the assistant; a change goes into supabase/migrations and reaches the server only on the owner\'s word.');
  if (GITHUB_WRITES.test(tool)) stop('REFUSED: this connector writes to GitHub past the push hook (main only on the owner\'s word, the secret check); commit and git push instead.');
  if (/__execute_sql$/.test(tool) && !readOnlySql(String(event.tool_input?.query || ''))) stop('REFUSED: only a single read-only query (SELECT) may run on the live database.');
  if (/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(tool) && RECORD_FILE.test(String(event.tool_input?.file_path || event.tool_input?.notebook_path || ''))) stop('REFUSED: the practice review record is written only by Claude Code\'s hook when a reviewer run ends; run the practice-reviewer agent instead.');
  const why = refusal(String(event.tool_input?.command || ''), tool === 'PowerShell');
  if (why) stop(`REFUSED: this command ${why}. Do the work so the guard passes instead.`);
  process.exit(0);
}

const gitHere = (...a) => { try { return execFileSync('git', a, { cwd: HERE, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };

// start: at startup, resume and after every compaction Claude Code adds this output to the
// context, so the state and the queue come back without anyone remembering to read them, and a
// checkout made from the old live branch is named before work starts on it.
if (mode === 'start') {
  const out = [`Session ${event.source || 'start'}: the top of the board (${BOARD}) is below; the board is the work; the owner's decisions come with CLAUDE.md. First thing: if its showings table has no row for today, add what he will see today and tell him in your first line. docs/state.md says where things are.`];
  // his brake: yesterday's commits to the game and to the process, counted by git, not by me
  const day = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00`;
  const today = new Date(), yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const log = gitHere('log', '--all', '--no-merges', `--since=${day(yesterday)}`, `--until=${day(today)}`, '--name-only', '--pretty=format:@@%h');
  if (log !== null) {
    const { game, process: proc } = split(log);
    out.push(`Yesterday's commits: ${game} touched the game, ${proc} the process.${proc > game ? ' The process took more than the game: say so to the owner first.' : ''}`);
  }
  const branch = gitHere('rev-parse', '--abbrev-ref', 'HEAD');
  if (gitHere('rev-parse', '--verify', '-q', 'room-polish') && gitHere('merge-base', '--is-ancestor', 'room-polish', 'HEAD') === null) {
    out.push(`WARNING: this checkout (${branch}) lacks the latest work on room-polish; it was probably made from the old live branch. If it has no commits of its own, reset it to room-polish; otherwise merge room-polish. Say so to the owner.`);
  }
  // The owner's decisions are imported by CLAUDE.md, which Claude Code loads at every start and
  // re-reads after every compaction without the 10,000-character cap on hook output; printed here
  // they had to be trimmed to fit. Only if the import is gone are they printed here as before.
  let claudeMd = '';
  try { claudeMd = fs.readFileSync(path.join(HERE, 'CLAUDE.md'), 'utf8'); } catch { /* checked below */ }
  if (!claudeMd.includes(`@${DECISIONS}`)) {
    try { out.push(fs.readFileSync(path.join(HERE, DECISIONS), 'utf8').trim()); } catch { out.push(`WARNING: ${DECISIONS} is missing here: the owner's decisions are not in front of this session.`); }
  }
  // the top of the board (board.mjs): Claude Code keeps a hook's output whole only up to 10,000
  // characters (hooks docs), which tests/guard.test.mjs holds it to
  try {
    out.push(top(fs.readFileSync(path.join(HERE, BOARD), 'utf8')));
  } catch { out.push(`WARNING: ${BOARD} is missing here: this checkout is not the project's current work.`); }
  // the health check, so a program, the library backup or a guard copy that broke silently is named at
  // the start (it takes about 2 s; a hung check must not hold the session up)
  try {
    const health = execFileSync(process.execPath, [path.join(HERE, 'tools', 'health.mjs')], { cwd: HERE, encoding: 'utf8', timeout: 15000 }).trim();
    // at most five problem lines: a machine missing many programs (GitHub's runner) printed so many
    // that the start passed Claude Code's 10,000 characters and the board was no longer whole
    const [head, ...rest] = health.split('\n'), more = rest.length - HEALTH_SHOWN;
    out.push(/broken|warning/.test(health) ? `Health check (tools/health.mjs), tell the owner what is broken:\n${[head, ...rest.slice(0, HEALTH_SHOWN)].map(clip).join('\n')}${more > 0 ? `\n…and ${more} more: node tools/health.mjs` : ''}` : clip(head));
  } catch { out.push('WARNING: the health check (tools/health.mjs) did not finish: run it by hand.'); }
  // the outside reviewer's open remarks on the pull request into `reviewed`, read before other work
  try {
    const remarks = execFileSync(process.execPath, [path.join(HERE, 'tools', 'coderabbit.mjs')], { cwd: HERE, encoding: 'utf8', timeout: 10000 }).trim();
    if (remarks) out.push(clip(remarks));
  } catch { /* GitHub out of reach: nothing to say */ }
  try {
    const runs = JSON.parse(execFileSync('gh', ['run', 'list', '--branch', 'room-polish', '--workflow', 'test.yml', '--limit', '1', '--json', 'conclusion,displayTitle,url,databaseId'], { cwd: HERE, encoding: 'utf8', timeout: 10000, windowsHide: true }));
    const red = ciLine(runs[0]);
    if (red) out.push(clip(red));
  } catch { /* GitHub out of reach: nothing to say */ }
  process.stdout.write(`${out.join('\n\n')}\n`);
  process.exit(0);
}

// subagent-start, subagent-stop: a practice reviewer's run is recorded for the owner's automatic stop
// (tools/review-gate.mjs) by this hook, not by the assistant. It counts only when the files a person
// meets did not change while it read them and its report reached its last block. Never blocks.
if (mode === 'subagent-start' || mode === 'subagent-stop') {
  if (event.agent_type !== REVIEWER) process.exit(0);
  const { print, files } = scan(HERE);
  if (mode === 'subagent-start') {
    write({ kind: 'start', agent: event.agent_id, print, root: HERE });
    process.exit(0);
  }
  const start = entries().filter((e) => e.kind === 'start' && e.agent === event.agent_id).pop();
  // a subagent here hands its report back through a tool call, not as its last text, so the
  // report is read from the transcript's last assistant entry: its text or its tool call's input.
  // Only the reviewer's own words count, never the caller's prompt, which names the block too.
  const ends = (text) => new RegExp(`(^|\\n|\\\\n)${REPORT_END}`).test(text);
  let report = String(event.last_assistant_message || '');
  try { if (!ends(report) && event.agent_transcript_path) report = lastReport(event.agent_transcript_path); } catch { /* no transcript to read */ }
  const why = !start ? 'no start seen for this run'
    : start.print !== print ? 'the files changed while it read them'
      : !ends(report) ? 'its report did not reach its last block' : '';
  write(why ? { kind: 'void', agent: event.agent_id, why } : { kind: 'review', agent: event.agent_id, print, files, named: named(report), root: HERE, transcript: event.agent_transcript_path || '' });
  process.exit(0);
}

// prompt: every message the owner sends is appended, word for word, to a log on the laptop,
// outside the public repository, so no request is lost to a compaction (the request auditor
// reads it). It never blocks the message.
if (mode === 'prompt') {
  try {
    const log = path.join(os.homedir(), 'Documents', 'objekt-files', 'notes', 'owner-messages.md');
    fs.mkdirSync(path.dirname(log), { recursive: true });
    // turns the app delivers that he did not type (helpers' reports, background notices, reminders,
    // the pull request watcher, the artifact view): logged as his, they read as his words
    const said = String(event.prompt || '');
    if (typedText(said)) fs.appendFileSync(log, `\n## ${new Date().toISOString()} ${event.session_id || ''}\n${said}\n`);
  } catch { /* a failed log must not stop his message */ }
  process.exit(0);
}

if (mode === 'stop') {
  // problems a command of mine can fix hold the turn every time; those no command can fix (GitHub out
  // of reach when the power cut took the router, the process list unreadable) hold it once and then let
  // it end with a warning: the hooks reference asks a Stop hook to check stop_hook_active "to avoid
  // blocking on a condition that will never resolve"
  const again = event.stop_hook_active === true;
  const problems = [], unfixable = [];
  const reachable = () => {
    if (process.env.OBJECT_GITHUB_REACHABLE) return process.env.OBJECT_GITHUB_REACHABLE !== '0';
    try { execFileSync('git', ['ls-remote', '--exit-code', 'origin', 'HEAD'], { cwd: HERE, env: withoutGitVars(), stdio: 'ignore', timeout: 15000 }); return true; } catch { return false; }
  };
  const dirty = gitHere('status', '--porcelain');
  if (dirty) problems.push(`work not saved (power is cut daily):\n${dirty}`);
  const ahead = gitHere('rev-list', '--count', '@{u}..HEAD');
  const unpushed = ahead === null ? 'this branch has no copy on GitHub: push it' : Number(ahead) ? `${ahead} commits not on GitHub: push the working branch` : null;
  if (unpushed) (again && !reachable() ? unfixable : problems).push(again ? `${unpushed} (GitHub is out of reach: push when it is back)` : unpushed);
  // the next window's checkout is made from the main folder's HEAD, room-polish (.claude/settings.json
  // worktree.baseRef head): work pushed on this branch alone is missing from the next session, and a
  // written rule to bring it over at the end of a step does not hold when a session ends mid-step
  if (gitHere('rev-parse', '--verify', '-q', 'room-polish') && gitHere('merge-base', '--is-ancestor', 'HEAD', 'room-polish') === null) {
    const branch = gitHere('rev-parse', '--abbrev-ref', 'HEAD');
    // another window's commits on room-polish make the fast-forward fail; both windows write the
    // board's showing and current lines, and a conflict resolved to one side loses the owner's words
    const theirs = gitHere('merge-base', '--is-ancestor', 'room-polish', 'HEAD') === null ? gitHere('rev-list', '--count', 'HEAD..room-polish') : null;
    const first = theirs ? `room-polish has ${theirs} commits of another window: first here run git merge room-polish, keeping both sides of every conflict in docs/board.md (the owner's words), then ` : '';
    // room-polish itself goes to GitHub at the end of a step, not every turn: CodeRabbit reads the pull
    // request from it, its plan reads 10 pushes an hour, and pushes every few minutes kept it from
    // finishing any review from 15:28 to 20:53 UTC on 11.10
    problems.push(`the main folder (room-polish, where the next window starts) lacks ${gitHere('rev-list', '--count', 'room-polish..HEAD')} commits of this branch: ${first}in it run git merge --ff-only ${branch} (push room-polish to GitHub at the end of a step, not every turn)`);
  }
  // a helper's command left running (the owner's yes, 11.10): seen at every turn's end, not by my memory
  const left = leftoverLine();
  if (left) (again && /could not list the processes/.test(left) ? unfixable : problems).push(left);
  // npm test is not run here: it runs before "done" and on GitHub, and the commit hook's quick check
  // before every commit; running the whole suite again cost 12-56 s a turn
  if (problems.length) {
    const why = `NOT DONE. Before this turn ends:\n- ${[...problems, ...unfixable].join('\n- ')}`;
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'Stop', additionalContext: why } }));
    process.exit(0);
  }
  if (unfixable.length) process.stdout.write(JSON.stringify({ systemMessage: `The turn ends with what no command fixes now:\n- ${unfixable.join('\n- ')}` }));
  process.exit(0);
}
