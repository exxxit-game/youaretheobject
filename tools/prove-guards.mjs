// Proves every guard sees its mistake. A test that passes says only that nothing broke the rule
// OR that the test cannot see it; the way to tell them apart is to plant the mistake and watch the
// guard go red (mutation testing). Each case below plants exactly the mistake one guard exists
// for, in a throwaway clone of the last commit, runs that guard, and puts the clone back.
// Usage: node tools/prove-guards.mjs [--lf]   (default: the laptop's own checkout, CRLF lines
// where git converts them; --lf: plain LF, as on GitHub's runners). Exits 1 if any guard is blind.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRIVATE_EMAIL, withoutGitVars } from './secrets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LF = process.argv.includes('--lf');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prove-guards-'));
const env = withoutGitVars();
const git = (...a) => execFileSync('git', a, { cwd: dir, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
execFileSync('git', ['-c', `core.autocrlf=${LF ? 'false' : 'true'}`, 'clone', '-q', '--no-hardlinks', ROOT, dir], { env, stdio: 'ignore' });
git('config', 'core.autocrlf', LF ? 'false' : 'true');
git('config', 'user.email', PRIVATE_EMAIL);
git('config', 'user.name', 'prove-guards');
git('config', 'commit.gpgsign', 'false');

const at = (f) => path.join(dir, f);
const eol = (f) => (fs.readFileSync(at(f), 'utf8').includes('\r\n') ? '\r\n' : '\n');
const append = (f, text) => fs.appendFileSync(at(f), text.split('\n').join(eol(f)));
const swap = (f, from, to) => {
  const s = fs.readFileSync(at(f), 'utf8');
  if (!s.includes(from)) throw new Error(`${f} has no "${from}" to plant the mistake in`);
  fs.writeFileSync(at(f), s.replace(from, to));
};
const many = (n, text) => Array.from({ length: n }, () => text).join('\n');
const run = (cmd, args, extra = {}) => {
  const r = spawnSync(cmd, args, { cwd: dir, env: { ...env, ...extra }, encoding: 'utf8' });
  return { ok: r.status === 0, out: `${r.stdout}${r.stderr}` };
};
const test = (file) => () => run(process.execPath, [`tests/${file}`]);
// Claude Code hands its hook the event as JSON on stdin (code.claude.com/docs/en/hooks)
const askGuard = (mode, event) => {
  const r = spawnSync(process.execPath, ['tools/claude-guard.mjs', mode], { cwd: dir, env, encoding: 'utf8', input: JSON.stringify(event) });
  return { ok: r.status === 0, out: `${r.stdout}${r.stderr}` };
};
const structure = test('structure.test.mjs');
// player's words built from their codes: Russian letters belong only in the texts files
const ru = (...codes) => String.fromCharCode(...codes);
// The guards read every tool, this one too: a planted name written out here whole would count as
// "imported" or "in the code" and hide the mistake, so it is joined only when planted.
const PLANTED = ['plan', 'ted', 'zq'].join('');
// built from parts so this file holds no token of its own
const token = 'ghp' + '_' + 'Zx9Q'.repeat(9);

// [guard, the rule it keeps, the mistake planted, plant, run, words the failure must name]
const CASES = [
  ['structure 1', 'files about 300 lines', 'a code file over 300 lines', () => append('src/engine/ui/choice.js', `\n${many(300, '// x')}\n`), structure, 'files over 300 lines'],
  ['structure 1', 'files about 300 lines', 'a doc over 300 lines', () => append('docs/roadmap.md', `\n${many(300, 'x')}\n`), structure, 'docs over 300 lines'],
  ['structure 2', 'rooms apart from the engine', 'the engine imports the app', () => append('src/engine/sfx.js', "\nimport '../app/session.js';\n"), structure, 'imports ../app'],
  ['structure 3', 'player text in texts files', 'a Russian word in a tool', () => append('tools/make-sounds.mjs', `\n// ${ru(0x43f, 0x440, 0x438, 0x432, 0x435, 0x442)}\n`), structure, 'Russian outside'],
  ['structure 4', 'rooms apart from the engine', 'a room without a required file', () => fs.rmSync(at('src/rooms/01-control/sound-list.js')), structure, 'has no sound-list.js'],
  ['structure 5', 'docs/state.md cap', 'docs/state.md over 80 lines', () => append('docs/state.md', `\n${many(81, 'x')}\n`), structure, 'docs/state.md over'],
  ['structure 6', 'no dead code', 'a module nobody imports', () => fs.writeFileSync(at(`src/engine/${PLANTED}.js`), 'export const x = 1;\n'), structure, 'modules nobody imports'],
  ['structure 7', 'docs tell the truth', 'a doc names a file that does not exist', () => append('docs/roadmap.md', '\nSee `src/engine/nope.js`.\n'), structure, 'docs name files that do not exist'],
  ['structure 8', 'mistakes list', 'a mistake row with no guard', () => append('docs/mistakes.md', '\n| A planted mistake | care |\n'), structure, 'mistake without a guard'],
  ['structure 8', 'mistakes list', 'a mistake row naming words its test lacks', () => append('docs/mistakes.md', `\n| A planted mistake | \`tests/names.test.mjs\` "${PLANTED} words" |\n`), structure, 'mistake names words its test does not have'],
  ['structure 9', 'heredoc damage', 'a tool that no longer parses', () => append('tools/make-sounds.mjs', '\nconst = ;\n'), structure, 'syntax error'],
  ['structure 10', 'catalog current', 'the catalog edited by hand', () => append('docs/catalog.md', '\n| x | planted |\n'), structure, 'catalog'],
  ['structure 11', 'A-Frame play/pause', 'a component method play(x)', () => append('src/engine/fader.js', '\nconst planted = {\n  play(arg) { return arg; }\n};\n'), structure, 'play/pause'],
  ['structure 12', 'room lights', 'a room light without class room-light', () => swap('src/rooms/01-control/scene.js', '<!-- everything up to the screen is static', '<a-entity light="type: point; intensity: 1"></a-entity>\n  <!-- everything up to the screen is static'), structure, 'room-light'],
  ['structure 13', 'the game\'s name', 'the name translated in the player\'s text', () => append('src/app/texts.ru.js', `\n// ${ru(0xab, 0x41e, 0x431, 0x44a, 0x435, 0x43a, 0x442, 0xbb)}\n`), structure, 'translates the game'],
  ['structure 17', 'words in full', 'a word cut short', () => append('src/app/texts.ru.js', `\nexport const planted = '${ru(0x41a, 0x43e, 0x43c, 0x43d)}. 101';\n`), structure, 'cuts a word short'],
  ['structure 16', 'comments say why', 'a comment saying who asked', () => append('tools/make-sounds.mjs', `\n// the ${['own', 'er'].join('')} said so\n`), structure, 'tells history'],
  ['structure 16', 'comments say why', 'a comment with a date', () => append('tools/make-sounds.mjs', `\n// changed ${['2026', '10', '09'].join('-')}\n`), structure, 'tells history'],
  ['structure 18', 'heredoc damage', 'a control character in code', () => append('tools/make-sounds.mjs', '\n// a\bb\n'), structure, 'control character'],
  ['structure 19', 'no keys', 'a token in a doc', () => append('docs/roadmap.md', `\n${token}\n`), structure, 'secret key'],
  ['structure 15', 'room interior', 'a room with no room-interior part', () => { const f = 'src/rooms/01-control/scene.js'; fs.writeFileSync(at(f), fs.readFileSync(at(f), 'utf8').replaceAll('room-interior', 'room-planted')); }, structure, 'room-interior'],
  ['structure 15', 'room interior', 'a light hidden with the room\'s inside', () => swap('src/rooms/01-control/scene.js', '<a-entity id="room" class="room-interior" merge-static>', '<a-entity id="room" class="room-interior" merge-static>\n    <a-entity light="type: point; intensity: 0"></a-entity>'), structure, 'a light inside a room-interior part'],
  ['structure 15', 'the room behind its door', 'a room whose markup holds a door', () => swap('src/rooms/01-control/scene.js', '<!-- everything up to the screen is static', '<a-entity id="door1"></a-entity>\n  <!-- everything up to the screen is static'), structure, 'what the app holds'],
  ['structure 4', 'the room contract', 'a room.js that does not export enter', () => swap('src/rooms/01-control/room.js', 'export function enter(', 'function enter('), structure, 'does not export enter'],
  ['structure 14', 'the hidden address', 'git signing with a personal address', () => git('config', 'user.email', 'someone@example.com'), structure, 'would show the address'],
  ['structure 20', 'ARCHITECTURE.md map', 'a tool missing from the map', () => fs.writeFileSync(at('tools/planted.mjs'), 'export const x = 1;\n'), structure, 'missing from the map'],
  ['structure 21', 'styles in css', 'an inline style', () => swap('index.html', '</body>', '<div style="color: red"></div></body>'), structure, 'styles outside css'],
  ['structure 22', 'no forgotten doc', 'a doc nothing links to', () => fs.writeFileSync(at('docs/planted.md'), '# Planted\n'), structure, 'docs nothing links to'],
  ['structure 23', 'docs tell the truth', 'a doc names a constant the code lacks', () => append('docs/roadmap.md', `\n${PLANTED.toUpperCase()}_NAME\n`), structure, 'constants the code does not have'],
  ['pre-commit hook', 'tests before done', 'a commit of a script that does not parse', () => { git('config', 'core.hooksPath', 'tools/hooks'); append('tools/make-sounds.mjs', '\nconst = ;\n'); },
    () => run('git', ['commit', '-qam', 'planted']), 'tools/make-sounds.mjs does not parse'],
  ['pre-commit hook', 'tests before done', 'a commit while a quick test fails', () => { git('config', 'core.hooksPath', 'tools/hooks'); fs.writeFileSync(at('src/engine/tracker.js'), 'export const x = 1;\n'); append('docs/roadmap.md', '\nplanted\n'); },
    () => run('git', ['commit', '-qam', 'planted']), 'tests/names.test.mjs fails'],
  ['pre-commit hook', 'no keys', 'a commit with a token staged', () => { git('config', 'core.hooksPath', 'tools/hooks'); append('docs/roadmap.md', `\n${token}\n`); },
    () => run('git', ['commit', '-qam', 'planted']), 'something private is staged'],
  // tools banned by name are deny rules in the settings (Claude Code applies them; no hook to ask): the
  // mistake planted is the rule taken out, and the guard test is what sees it
  ['settings deny', 'tests before done', 'a connected tool may start a browser on the laptop', () => swap('.claude/settings.json', '"mcp__plugin_playwright*",', ''), test('guard.test.mjs'), 'mcp__plugin_playwright*'],
  ['settings deny', 'data: read only', 'a migration may be applied to the live database', () => swap('.claude/settings.json', '"mcp__*__apply_migration",', ''), test('guard.test.mjs'), 'mcp__*__apply_migration'],
  ['claude-guard pre', 'data: read only', 'a write hidden behind a read on the live database', () => {}, () => askGuard('pre', { tool_name: 'mcp__db__execute_sql', tool_input: { query: 'select 1; delete from app.runs' } }), 'REFUSED'],
  ['claude-guard pre', 'data: read only', 'a write called from a read on the live database', () => {}, () => askGuard('pre', { tool_name: 'mcp__db__execute_sql', tool_input: { query: "select public.submit_run('{}'::jsonb)" } }), 'REFUSED'],
  ['settings deny', 'main only on the owner\'s word', 'files may be pushed to GitHub past the push hook', () => swap('.claude/settings.json', '"mcp__*__push_files",', ''), test('guard.test.mjs'), 'mcp__*__push_files'],
  ['claude-guard start', 'the owner\'s decisions', 'a session starts without his decisions in front of it', () => fs.rmSync(at('docs/owner-decisions.md')), test('guard.test.mjs'), 'does not show the owner\'s decisions'],
  ['CLAUDE.md imports', 'the tandem', 'an import that loads nothing', () => swap('CLAUDE.md', '@docs/tandem.md', '@docs/tandem.md.'), test('guard.test.mjs'), 'no file behind it'],
];

const restore = () => {
  // a refused commit can leave git's lock behind; git's advice: remove a stale lock
  fs.rmSync(path.join(dir, '.git', 'index.lock'), { force: true });
  git('reset', '-q', '--hard');
  git('clean', '-qfdx', '-e', 'node_modules');
  git('config', 'user.email', PRIVATE_EMAIL);
  try { git('config', '--unset', 'core.hooksPath'); } catch { /* not set */ }
};

const rows = [];
const base = structure();
if (!base.ok) { console.log(`the clone fails before anything is planted:\n${base.out}`); process.exit(1); }
console.log(`clone of ${git('rev-parse', '--short', 'HEAD').trim()}, lines ${LF ? 'LF' : 'as this laptop checks out (CRLF)'}; structure test green before planting`);
for (const [guard, rule, mistake, plant, check, words] of CASES) {
  let caught, why;
  try {
    plant();
    const r = check();
    caught = !r.ok && r.out.includes(words);
    why = r.ok ? 'stayed green' : r.out.includes(words) ? '' : `red for another reason: ${r.out.trim().split('\n').find((l) => /Error|STOP|fail/i.test(l))?.slice(0, 120) || ''}`;
  } catch (e) { caught = false; why = `could not plant: ${e.message}`; }
  restore();
  rows.push({ guard, rule, mistake, caught, why });
  console.log(`${caught ? 'CAUGHT' : 'BLIND '}  ${guard.padEnd(16)} ${mistake}${why ? ` (${why})` : ''}`);
}
fs.rmSync(dir, { recursive: true, force: true });
const blind = rows.filter((r) => !r.caught);
console.log(blind.length ? `\n${blind.length} of ${rows.length} guards did not see their mistake` : `\nall ${rows.length} guards saw their mistake`);
process.exitCode = blind.length ? 1 : 0;
