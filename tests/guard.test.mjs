// The guard Claude Code runs before each shell command (tools/claude-guard.mjs) is run here on real
// commands both ways: what it exists to stop must be refused in every form a shell writes it, and a
// command that only reads, searches or names those words (in quotes, a message, a heredoc) must
// pass, or the assistant learns to work around the guard. The guard reads the command as the shell
// does and judges each program by its arguments; refusal() is called directly, and a few commands
// go through the hook itself as Claude Code calls it.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refusal, ciLine, HEALTH_SHOWN, EXTRA_LINE } from '../tools/claude-guard.mjs';
import { onHead } from '../tools/headset.mjs';
import { BOARD, SHOWS, UNTIL, WAITS, top, split } from '../tools/board.mjs';
import { leftovers, LIMIT_MS } from '../tools/leftovers.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PS = 'PowerShell';
// [command, shell]: Bash unless named
const cases = (list) => list.map((c) => (Array.isArray(c) ? c : [c, 'Bash']));
const record = '~/Documents/objekt-files/notes/practice-reviews.jsonl';

const refused = cases([
  // the smoke test (Playwright and Chromium) started on the laptop
  'npm run test:smoke',
  'npm.cmd run test:smoke',
  'npm run-script test:smoke',
  'npm --silent run test:smoke',
  'cd x; npm run test:smoke',
  'if true; then npm run test:smoke; fi',
  'node tests/smoke.mjs',
  'node ./tests/smoke.mjs',
  'node tests\\smoke.mjs',
  'node tests\\\\smoke.mjs',
  'node.exe tests/smoke.mjs',
  '& node tests\\smoke.mjs',
  '& "C:\\Program Files\\nodejs\\node.exe" tests\\smoke.mjs',
  ['& "C:\\Program Files\\nodejs\\node.exe" tests\\smoke.mjs', PS],
  'cd tests && node smoke.mjs',
  '(cd tests && node smoke.mjs)',
  'cd x && node tests/smoke.mjs --speed 20',
  'OBJECT_X=1 node tests/smoke.mjs',
  'npx playwright test',
  'npx.cmd playwright install',
  'npx playwright --version',
  'npx -y @playwright/test test',
  'npm exec playwright test',
  'playwright codegen',
  'node node_modules/@playwright/test/cli.js test',
  // the git hooks skipped
  'git commit --no-verify -m x',
  'git push --no-verify origin x',
  'git -C . commit -qam x --no-verify',
  'git commit -am "paper; colours" --no-verify',
  'git commit -m "A & B" --no-verify',
  'git commit "--no-verify" -m x',
  "git commit '--no-verify' -m x",
  "git commit -m \"$(cat <<'EOF'\nmessage; with | marks\nEOF\n)\" --no-verify",
  'git commit --no-veri -m x',
  'git commit -n -m x',
  'git commit -am "a; b" -n',
  'git commit -qnm x',
  'echo $(git commit -n -m x)',
  'bash -c "git commit --no-verify -m x"',
  "sh <<'EOF'\ngit push --no-verify origin x\nEOF",
  ['git commit -m x; if ($?) { git push --no-verify }', PS],
  ['git commit -m x `\n  --no-verify', PS],
  'git -c core.hooksPath=/dev/null commit -m x',
  'git config core.hooksPath .git/hooks',
  'git config --unset core.hooksPath',
  'GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0=/dev/null git commit -m x',
  'export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0=/dev/null',
  "env GIT_CONFIG_PARAMETERS=\"'core.hooksPath'='/dev/null'\" git push origin x",
  ["$env:GIT_CONFIG_COUNT = 1; $env:GIT_CONFIG_KEY_0 = 'core.hooksPath'; $env:GIT_CONFIG_VALUE_0 = 'NUL'; git commit -m x", PS],
  ['Set-Item env:GIT_CONFIG_KEY_0 core.hooksPath', PS],
  ['Set-Item -Path Env:GIT_CONFIG_KEY_0 -Value core.hooksPath', PS],
  ['New-Item -Path Env:GIT_CONFIG_KEY_0 -V core.hooksPath', PS],
  ['Set-Item -Value core.hooksPath -Path Env:GIT_CONFIG_KEY_0', PS],
  // the headset or its browser restarted past the check that the owner is not wearing it
  'adb reboot',
  'adb -s 2G0YC5ZG reboot',
  'adb shell am force-stop com.oculus.browser',
  'adb shell "am force-stop com.oculus.browser"',
  'adb exec-out am force-stop com.oculus.browser',
  'adb shell reboot',
  'adb shell su -c reboot',
  'adb shell svc power reboot',
  // the practice review record, written only by Claude Code's hook
  `tee -a ${record}`,
  `cp /tmp/fake.jsonl ${record}`,
  `rm ${record}`,
  `sed -i 1d ${record}`,
  `cat <<'EOF' > ${record}\n{}\nEOF`,
  ['Get-Content x | Out-File $HOME\\Documents\\objekt-files\\notes\\practice-reviews.jsonl', PS],
  "node -e \"import('./tools/review-gate.mjs').then((m) => m.write({ kind: 'review' }))\"",
  'env OBJECT_REVIEW_RECORD=/tmp/x.jsonl node tools/quest-look.mjs vr',
  'export OBJECT_REVIEW_RECORD=/tmp/x.jsonl',
  // main merged on GitHub, past the push guard
  'gh pr merge 9 --merge',
  'gh pr merge --squash --auto',
  'gh pr -R exxxit-game/youaretheobject merge 9',
  'gh --repo exxxit-game/youaretheobject pr merge 9',
  ['gh.exe pr merge 9', PS],
  'gh --hostname github.com pr merge 9',
  "gh api graphql -f query='mutation { mergePullRequest(input: {pullRequestId: \"PR_x\"}) { clientMutationId } }'",
  "gh api graphql -f query='mutation { enablePullRequestAutoMerge(input: {pullRequestId: \"PR_x\"}) { clientMutationId } }'",
  'gh api graphql -F query=@merge.graphql',
  'gh api graphql --input body.json',
  'gh api graphql -F query=@-',
  'gh api -X PUT repos/exxxit-game/youaretheobject/pulls/9/merge',
  'gh api repos/exxxit-game/youaretheobject/merges -f base=main -f head=room-polish',
  "gh api graphql -f query='mutation{resolveReviewThread(input:{threadId:\"PRRT_x\"}){thread{isResolved}}}'",
  // the papers library, which no git holds, in every spelling of its path
  'rm -rf ~/Documents/objekt-files/papers/x.pdf',
  'rm /c/Users/admin/Documents/objekt-files/papers/x.pdf',
  ['Remove-Item -Recurse -Force "C:\\Users\\admin\\Documents\\objekt-files\\papers"', PS],
  ['Remove-Item "$env:USERPROFILE\\Documents\\objekt-files\\papers\\x.pdf"', PS],
  ['cmd /c del /q "%USERPROFILE%\\Documents\\objekt-files\\papers\\x.pdf"', PS],
  'cd ~/Documents/objekt-files && rm papers/x.pdf',
  ['Set-Location "C:\\Users\\admin\\Documents\\objekt-files"; Remove-Item papers\\x.pdf', PS],
  'bash -c "rm -r ../../../../../objekt-files/papers"',
  'find ~/Documents/objekt-files -name "*.tmp" -delete',
  'find "$HOME/Documents/objekt-files" -name "*.txt" -exec rm {} +',
  'mv ~/Documents/objekt-files/papers/x.pdf /tmp',
  ['Move-Item -Path "C:\\Users\\admin\\Documents\\objekt-files\\papers\\x.pdf" -Destination "C:\\Temp"', PS],
  ['robocopy "F:\\objekt-files" "C:\\Users\\admin\\Documents\\objekt-files" /MIR', PS],
  ['robocopy "C:\\Users\\admin\\Documents\\objekt-files" "D:\\elsewhere" /MOVE', PS],
  'rsync -a --delete /f/objekt-files/ ~/Documents/objekt-files/',
  "node -e \"require('fs').rmSync(require('os').homedir() + '/Documents/objekt-files/papers', { recursive: true })\"",
  "python -c \"import shutil, os; shutil.rmtree(os.path.expanduser('~/Documents/objekt-files/papers'))\"",
]);
for (const [c, shell] of refused) assert.ok(refusal(c, shell === PS), `the guard let through: ${c}`);
// a red last run of GitHub's tests is said at the start; a green one, one still running or none is not
assert.match(ciLine({ conclusion: 'failure', displayTitle: 'x', url: 'https://github.com/r/actions/runs/7', databaseId: 7 }), /RED on room-polish \(failure: x\): .+gh run view 7 --log-failed/);
assert.match(ciLine({ conclusion: 'timed_out', displayTitle: 'x', url: 'u', databaseId: 8 }), /RED on room-polish \(timed_out: x\)/, 'a run that timed out is said too');
for (const run of [{ conclusion: 'success' }, { conclusion: 'cancelled' }, { conclusion: '' }, undefined]) assert.equal(ciLine(run), null);

const allowed = cases([
  'grep -n camera tests/smoke.mjs',
  'gh pr view 9 --comments',
  'gh pr create --base main --head room-polish --title x --body y',
  'gh api repos/exxxit-game/youaretheobject/pulls/9/comments',
  "gh api graphql -f query='query { viewer { login } }'",
  'grep -n node tests/smoke.mjs',
  'sed -n 1,40p tests/smoke.mjs',
  'git log --oneline -- tests/smoke.mjs',
  'git diff tests/smoke.mjs',
  'grep -n -- "--no-verify" docs/mistakes.md',
  'grep -n test:smoke package.json',
  'node --check tests/smoke.mjs',
  'git commit -qm "the smoke test (npm run test:smoke) runs only on GitHub"',
  'git commit --amend --no-edit',
  'npm test',
  'node tests/guard.test.mjs',
  'node tools/quest-look.mjs reboot',
  'node tools/quest-look.mjs restart-browser',
  'adb devices',
  'adb shell dumpsys vrpowermanager',
  'echo "adb reboot" # npm run test:smoke',
  // searches, reads and messages that only name the guarded words
  'grep -rn "git commit" docs/',
  'cat docs/mistakes.md | grep -n "git commit"',
  'find . -name "*.md" | xargs grep -l "git commit"',
  'git log --format=commit -n 5',
  'git log | grep -- --no-verify',
  'git commit -m x && git log --oneline -n 3',
  ['Write-Host -NoNewline', PS],
  ['git commit -m x; Write-Host -NoNewline "done"', PS],
  ['git commit -m x; Get-Content f -Encoding utf8', PS],
  'git commit -m "sed -n prints a range"',
  'git commit -m "the guard refuses git commit --no-verify and -n"',
  ["git commit -m @'\nrefuses --no-verify, -n and sed -n\n'@", PS],
  "git commit -F - <<'EOF'\nnpm run test:smoke stays on GitHub; adb reboot is refused\nEOF",
  "cat > /tmp/t.mjs <<'EOF'\nrun('git commit --no-verify -m x');\nEOF",
  'git config core.hooksPath',
  'git config --get core.hooksPath',
  'git -c core.hooksPath=tools/hooks commit -m x',
  // the record read, never written
  `tail -5 ${record} 2>/dev/null`,
  `cat ${record} > /tmp/copy.jsonl`,
  `cp ${record} /tmp/copy.jsonl`,
  "node -e \"const fs = require('fs'); const rows = fs.readFileSync(require('os').homedir() + '/Documents/objekt-files/notes/practice-reviews.jsonl', 'utf8').split('\\n').filter(Boolean).map((l) => JSON.parse(l)); process.stdout.write(rows.length + '\\n')\"",
  'grep -n OBJECT_REVIEW_RECORD tools/review-gate.mjs',
  'grep -n "GIT_CONFIG_KEY_0=core.hooksPath" tests/guard.test.mjs',
  'GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=user.name GIT_CONFIG_VALUE_0=x git commit -m x',
  // the papers library read, added to and backed up
  'ls ~/Documents/objekt-files/papers',
  'cp ~/Downloads/x.pdf ~/Documents/objekt-files/papers/',
  'mv ~/Downloads/x.pdf ~/Documents/objekt-files/papers/',
  'mv ~/Documents/objekt-files/papers/a.pdf ~/Documents/objekt-files/papers/b.pdf',
  'pdftotext ~/Documents/objekt-files/papers/a.pdf ~/Documents/objekt-files/papers/a.txt',
  'cd ~/Documents/objekt-files && ls papers',
  'cd ~/Documents/objekt-files && cd /tmp && rm x.txt',
  ['robocopy "C:\\Users\\admin\\Documents\\objekt-files" "F:\\objekt-files" /MIR', PS],
  ['robocopy "F:\\objekt-files" "C:\\Users\\admin\\Documents\\objekt-files" /E', PS],
  'rm -rf /tmp/objekt-files-copy',
  'grep -rn "objekt-files" docs/ | head',
  'rm /tmp/x.txt',
]);
for (const [c, shell] of allowed) {
  const why = refusal(c, shell === PS);
  assert.ok(!why, `the guard refused a command that runs nothing it guards: ${c}\n${why}`);
}
// a shell already standing in the library: the hook sees it by the event's cwd
assert.ok(refusal('rm papers/x.pdf', false, true), 'a delete by a relative path inside the library went through');
assert.ok(!refusal('ls papers', false, true), 'a read inside the library was refused');
const inLibrary = spawnSync(process.execPath, ['tools/claude-guard.mjs', 'pre'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'rm papers/x.pdf' }, cwd: 'C:\\Users\\x\\Documents\\objekt-files' }) });
assert.equal(inLibrary.status, 2, 'the hook let a delete through in a shell standing in the library');

// the hook itself, as Claude Code calls it: the event as JSON on stdin, exit 2 refuses
const ask = (tool_name, command) => spawnSync(process.execPath, ['tools/claude-guard.mjs', 'pre'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ tool_name, tool_input: { command }, cwd: ROOT }) }).status;
assert.equal(ask('Bash', 'git commit -n -m x'), 2, 'the hook let a hook-skipping commit through');
assert.equal(ask(PS, 'npm run test:smoke'), 2, 'the hook let the smoke test run in PowerShell');
assert.equal(ask('Bash', 'grep -rn "git commit --no-verify" docs/'), 0, 'the hook refused a search');

// Helpers' commands left running (tools/leftovers.mjs): the tree as measured on the laptop 11.10, a
// command past its tool's time limit moved to the background under the session's bash, beside what
// is no command: the session's console host, an MCP server it keeps, the desktop app's own servers,
// and a process whose parent id was reused by the session after it began
{
  const T = 1791731000000, min = 60000;
  const snap = 'source /c/Users/admin/.claude/shell-snapshots/snapshot-bash-1.sh && eval';
  const tree = [
    { pid: 9492, ppid: 6600, name: 'claude.exe', start: T - 600 * min, cmd: String.raw`"C:\Program Files\WindowsApps\Claude_2\app\Claude.exe"` },
    { pid: 5864, ppid: 9492, name: 'claude.exe', start: T, cmd: String.raw`C:\Users\admin\AppData\Roaming\Claude\claude-code\2.1.295\d2e2\claude.exe --output-format stream-json` },
    { pid: 4100, ppid: 5864, name: 'conhost.exe', start: T, cmd: String.raw`\??\C:\WINDOWS\system32\conhost.exe 0x4` },
    { pid: 3916, ppid: 5864, name: 'bash.exe', start: T + 2 * min, cmd: String.raw`"C:\Program Files\Git\bin\bash.exe" -c "${snap} 'find / -name camera.md'"` },
    { pid: 5912, ppid: 3916, name: 'bash.exe', start: T + 2 * min, cmd: `bash.exe -c "${snap} 'find / -name camera.md'"` },
    { pid: 980, ppid: 5912, name: 'find.exe', start: T + 2 * min, cmd: 'find / -name camera.md' },
    // a tool shell whose command names an MCP server is still a command
    { pid: 3000, ppid: 5864, name: 'bash.exe', start: T + 2 * min, cmd: `bash.exe -c "${snap} 'grep -rn mcp /c'"` },
    { pid: 3001, ppid: 3000, name: 'grep.exe', start: T + 2 * min, cmd: 'grep -rn mcp /c' },
    { pid: 7000, ppid: 5864, name: 'cmd.exe', start: T, cmd: 'cmd.exe /d /s /c npx -y some-mcp-server' },
    { pid: 7001, ppid: 7000, name: 'node.exe', start: T, cmd: 'node some-mcp-server' },
    { pid: 10676, ppid: 9492, name: 'cmd.exe', start: T - 500 * min, cmd: 'cmd.exe /C npx.cmd -y metavr mcp server' },
    { pid: 8000, ppid: 9492, name: 'node.exe', start: T - 60 * min, cmd: 'node tools/serve.mjs' },
    { pid: 6000, ppid: 5864, name: 'node.exe', start: T - 30 * min, cmd: 'node older-than-its-parent-id' },
  ];
  const named = (now) => leftovers(tree, now).map((p) => p.pid).sort((a, b) => a - b);
  assert.deepEqual(named(T + 2 * min + LIMIT_MS - min), [], 'a command younger than the limit was named as left running');
  assert.deepEqual(named(T + 2 * min + LIMIT_MS + min), [980, 3001], 'a command left running under the session was not named, or something else was: its shells, the console host, a server, the app\'s own processes, a reused parent id');
  // the hook itself, given the list: the turn does not end while it runs
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'leftovers-'));
  fs.writeFileSync(path.join(dir, 'list.json'), JSON.stringify(tree.map((p) => ({ ...p, start: p.start - T + Date.now() - LIMIT_MS - 3 * min }))));
  const hook = spawnSync(process.execPath, ['tools/claude-guard.mjs', 'stop'], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, OBJECT_PROCESS_LIST: path.join(dir, 'list.json') }, input: JSON.stringify({ cwd: ROOT, stop_hook_active: false }) });
  const told = (() => { try { return JSON.parse(hook.stdout).hookSpecificOutput?.additionalContext || ''; } catch { return ''; } })();
  assert.ok(hook.status === 0 && /longer than 10 minutes[\s\S]*980 find\.exe, \d+ min$/m.test(told), `the stop hook let the turn end with a command left running:\n${hook.stdout}${hook.stderr}`);
  assert.ok(!hook.stdout.includes('camera.md'), 'the stop hook printed a command line, which can hold a key');
  fs.rmSync(dir, { recursive: true, force: true });
}

// The stop hook holds a turn on what a command can fix, every time; on what no command can fix (GitHub
// out of reach), it holds once and then, with stop_hook_active, lets the turn end with a warning. A
// repository of the test's own, one commit ahead of its own origin.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stop-'));
  const repo = path.join(dir, 'work'), origin = path.join(dir, 'origin.git');
  const git = (...a) => spawnSync('git', a, { cwd: repo, encoding: 'utf8', env: { ...process.env, GIT_DIR: undefined } });
  fs.mkdirSync(repo);
  spawnSync('git', ['init', '-q', '--bare', origin]);
  git('init', '-q'); git('config', 'user.email', 't@t'); git('config', 'user.name', 't'); git('config', 'core.hooksPath', '/dev/null');
  fs.writeFileSync(path.join(repo, 'a.txt'), 'a\n'); git('add', '.'); git('commit', '-qm', 'a');
  git('remote', 'add', 'origin', origin); git('push', '-q', '-u', 'origin', 'HEAD');
  fs.writeFileSync(path.join(repo, 'a.txt'), 'b\n'); git('commit', '-qam', 'b');
  fs.writeFileSync(path.join(dir, 'none.json'), '[]');
  const ask = (again, reachable, more = {}) => spawnSync(process.execPath, [path.join(ROOT, 'tools/claude-guard.mjs'), 'stop'], { cwd: repo, encoding: 'utf8',
    env: { ...process.env, OBJECT_PROCESS_LIST: path.join(dir, 'none.json'), OBJECT_GITHUB_REACHABLE: reachable ? '1' : '0', ...more }, input: JSON.stringify({ cwd: repo, stop_hook_active: again }) });
  const said = (r) => { try { return JSON.parse(r.stdout); } catch { return {}; } };
  const first = said(ask(false, false));
  assert.match(first.hookSpecificOutput?.additionalContext || '', /1 commits not on GitHub/, 'the first stop let an unpushed turn end');
  const second = ask(true, false);
  assert.ok(second.status === 0 && !said(second).hookSpecificOutput && /out of reach/.test(said(second).systemMessage || ''), `with GitHub out of reach the second stop still held the turn:\n${second.stdout}`);
  assert.match(said(ask(true, true)).hookSpecificOutput?.additionalContext || '', /not on GitHub/, 'with GitHub in reach the second stop let an unpushed turn end');
  fs.writeFileSync(path.join(repo, 'a.txt'), 'c\n');
  assert.match(said(ask(true, false)).hookSpecificOutput?.additionalContext || '', /work not saved/, 'unsaved work was let go: a commit is always possible');
  fs.rmSync(dir, { recursive: true, force: true });
}

// Every message the owner types is logged word for word, and nothing else is: the app's notices
// (helpers' reports, the pull request watcher) logged as his read as his words. A home of the
// test's own, so his real log is not touched.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'owner-log-'));
  const env = { ...process.env, HOME: dir, USERPROFILE: dir };
  const hook = (event) => spawnSync(process.execPath, ['tools/claude-guard.mjs', 'prompt'], { cwd: ROOT, encoding: 'utf8', env, input: JSON.stringify({ cwd: ROOT, ...event }) });
  const logged = () => { try { return fs.readFileSync(path.join(dir, 'Documents', 'objekt-files', 'notes', 'owner-messages.md'), 'utf8'); } catch { return ''; } };
  assert.equal(hook({ session_id: 'A', prompt: 'his message' }).status, 0, 'the prompt hook stopped his message');
  hook({ session_id: 'B', prompt: '<task-notification>a helper finished</task-notification>' });
  hook({ session_id: 'B', prompt: '<ci-monitor-event>53 new review comments</ci-monitor-event>' });
  hook({ session_id: 'B', prompt: '<system-reminder>\nYou are operating in a git worktree.\n</system-reminder>\n\n' });
  // a new window's first message: the app's worktree note, then his words (11.10)
  hook({ session_id: 'B', prompt: '<system-reminder>\nYou are operating in a git worktree.\n</system-reminder>\n\ncarry on here' });
  assert.match(logged(), /his message/, 'his message was not logged');
  assert.match(logged(), /carry on here/, 'his first message in a new window was not logged');
  assert.doesNotMatch(logged(), /review comments|a helper finished/, 'an app notice was logged as his words');
  fs.rmSync(dir, { recursive: true, force: true });
}

// The headset tools restart nothing while the owner wears the headset: the power service's dump
// says mounted with no override of ours (tools/headset.mjs). Dumps as the headset printed them.
const dump = (state, virtual) => `Virtual proximity state: ${virtual}\nisAutosleepDisabled: false\nState: ${state}\n`;
assert.ok(onHead(dump('HEADSET_MOUNTED', 'DISABLED')), 'worn by the owner reads as on his head');
assert.ok(!onHead(dump('HEADSET_MOUNTED', 'CLOSE')), 'our own "worn on" override is not a person');
assert.ok(!onHead(dump('HEADSET_UNMOUNTED', 'DISABLED')) && !onHead(dump('STANDBY', 'DISABLED')), 'off the head is free to restart');

// The owner's decisions reach every session at its start and after each compaction: CLAUDE.md imports
// them (Claude Code loads it then, whole); the start hook shows the board. A session that does not see
// them asks him again what he settled
const start = spawnSync(process.execPath, ['tools/claude-guard.mjs', 'start'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ source: 'startup', cwd: ROOT }) });
const boardTop = fs.readFileSync(path.join(ROOT, BOARD), 'utf8').split(/\r?\n/)[0];
const decisions = path.join(ROOT, 'docs/owner-decisions.md');
assert.ok(/^His decisions load with this file[^\n]*@docs\/owner-decisions\.md/m.test(fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8')),
  'CLAUDE.md no longer imports docs/owner-decisions.md: his decisions are not in front of the session');
assert.ok(fs.existsSync(decisions) && /^- The corridor is the reference/m.test(fs.readFileSync(decisions, 'utf8')),
  "the session does not show the owner's decisions: docs/owner-decisions.md is missing or lost its first decision");
assert.ok(start.stdout.includes(boardTop), `the start hook does not show the board:\n${start.stdout.slice(0, 400)}`);

// The top of the board at start: the head and the work now, what waits for him, the newest rows of
// the showings (new rows go on top); the rest of the board is read from the file
const board = (rows) => `# Board\n\nintro\n\n## Now\n- now\n\n${UNTIL}\n1. far\n\n${WAITS}\n1. a link\n\n${SHOWS}\n| a | b | c |\n|---|---|---|\n${rows.map((w) => `| ${w} | thing | pending |`).join('\n')}\n\n## Later\n- waits\n`;
const shown = top(board(['11.10', '10.10', '9.10', '8.10', '7.10', '6.10']));
assert.ok(shown.includes('- now') && shown.includes('1. a link') && shown.includes('| 7.10 |'), 'the top lost the work now, his asks or the newest showings');
assert.ok(!shown.includes('far') && !shown.includes('| 6.10 |') && !shown.includes('waits'), 'the top shows the whole board again');
// an older row reading like a newer one stays out: rows count by place
assert.equal((top(board(['11.10', '10.10', '9.10', '8.10', '7.10', '11.10'])).match(/\| 11\.10 \|/g) || []).length, 1, 'a repeated older row came back into the top');
// his brake: yesterday's commits split by what they touched, a commit touching both counted in both
assert.deepEqual(split('@@a\nsrc/x.js\n\n@@b\ntools/y.mjs\ndocs/z.md\n\n@@c\nsrc/a.js\ntests/b.mjs\n\n@@d\nREADME.md'), { game: 2, process: 2 }, 'commits to the game and to the process counted wrong');
assert.ok(/Yesterday's commits: \d+ touched the game, \d+ the process/.test(start.stdout), 'the start lost his brake line');
assert.ok(start.stdout.length < 10000, `the start hook prints ${start.stdout.length} characters: over 10,000 Claude Code keeps only a preview`);
// and on the worst day, not only on this machine: the top of the board and the session lines, then five
// health problems and the CodeRabbit and red-CI lines, each at its longest (GitHub's runner lacks the
// laptop's programs; a start that fit here went over there twice)
const end = start.stdout.indexOf(`(the rest of the board: ${BOARD})`);
const shownBoard = end + `(the rest of the board: ${BOARD})`.length;
const worstStart = shownBoard + 2 + (1 + HEALTH_SHOWN + 1) * (EXTRA_LINE + 1) + 2 * (EXTRA_LINE + 2);
assert.ok(end > 0 && worstStart < 10000, `on the worst day the start would print ${worstStart} characters (the board's top ${shownBoard}): shorten the board's top`);

console.log(`guard: ok (${refused.length} refused, ${allowed.length} allowed, the hook wired, the headset's wearer seen, his messages logged and only his, his decisions imported by CLAUDE.md, the board's top and his brake shown at start, commands left running named)`);
