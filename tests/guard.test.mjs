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
import { refusal, ciLine, EXTRA_LINE, imports } from '../tools/claude-guard.mjs';
import { onHead } from '../tools/headset.mjs';
import { split } from '../tools/board.mjs';
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
  // main merged on GitHub: only the owner merges into main
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
  'cd ~/Documents/objekt-files && cd && rm notes.txt',
  'cd ~/Documents/objekt-files && cd ~ && rm notes.txt',
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

// Helpers' commands left running (tools/leftovers.mjs): the tree as measured on the laptop, a
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

// The stop hook reminds once: unsaved work holds the turn the first time, and with stop_hook_active the
// turn ends, so it never loops; commits not yet on GitHub hold nothing (the copy is pushed at the end of
// a feature). A repository of the test's own, one commit ahead of its own origin.
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
  assert.ok(!said(ask(false, true)).hookSpecificOutput, 'a commit not yet on GitHub held the turn: the copy is pushed at the end of a feature');
  fs.writeFileSync(path.join(repo, 'a.txt'), 'c\n');
  assert.match(said(ask(false, true)).hookSpecificOutput?.additionalContext || '', /work not saved/, 'unsaved work was let go at the first stop: a commit is always possible');
  const second = ask(true, true);
  assert.ok(second.status === 0 && second.stdout.trim() === '', `the second stop held the turn again, which loops:\n${second.stdout}`);
  fs.rmSync(dir, { recursive: true, force: true });
}

// Every message the owner types is logged word for word, and nothing else is: the app's notices
// (helpers' reports, the pull request watcher) logged as his read as typed by him. A home of the
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
  // a new window's first message: the app's worktree note, then what he typed
  hook({ session_id: 'B', prompt: '<system-reminder>\nYou are operating in a git worktree.\n</system-reminder>\n\ncarry on here' });
  // notes between windows, a scheduled run and the brief one window gives another: a yes in them is not his
  hook({ session_id: 'B', prompt: '<system-reminder>\nLinked sessions now.\n</system-reminder>\n\n<side-sessions-event>Да. Their notes are above.</side-sessions-event>' });
  hook({ session_id: 'B', prompt: '<cross-session-message from="local_x">Да, merged</cross-session-message>' });
  hook({ session_id: 'B', prompt: '<scheduled-task name="monthly">an automated run</scheduled-task>' });
  hook({ session_id: 'B', prompt: '<system-reminder>\nLinked.\n</system-reminder>\n\nBackground (from the session that started this one):\nwhy\n\nTask:\nwhat' });
  assert.doesNotMatch(logged(), /Their notes|merged|automated run|Background \(from/, 'a note between windows, a scheduled run or a brief was logged as his words');
  // a pasted line that looks like an entry's heading must not become an entry of its own
  hook({ session_id: 'A', prompt: '## 2099-01-01T00:00:00.000Z X\nда' });
  assert.doesNotMatch(logged(), /^## 2099/m, 'a pasted heading in his message became an entry of the log');
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

// docs/owner-decisions.md reaches every session at its start and after each compaction: CLAUDE.md imports
// it (Claude Code loads CLAUDE.md then, whole). A session that does not see it asks him again what he settled
const start = spawnSync(process.execPath, ['tools/claude-guard.mjs', 'start'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ source: 'startup', cwd: ROOT }) });
const decisions = path.join(ROOT, 'docs/owner-decisions.md');
assert.ok(/^His decisions load with this file[^\n]*@docs\/owner-decisions\.md/m.test(fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8')),
  'CLAUDE.md no longer imports docs/owner-decisions.md: his decisions are not in front of the session');
// the decisions of one theme live in .claude/rules/, each loaded by its paths (code.claude.com/docs/en/memory,
// "Path-specific rules"): a file gone, or its paths header broken, and those decisions stop arriving
const themes = ['game', 'measures', 'data', 'setup'].map((t) => path.join(ROOT, '.claude', 'rules', `${t}.md`));
assert.ok(fs.existsSync(decisions) && /^- The rules read at start shortened/m.test(fs.readFileSync(decisions, 'utf8'))
  && themes.every((f) => fs.existsSync(f) && /^---\r?\npaths:\r?\n {2}- "/.test(fs.readFileSync(f, 'utf8'))),
  "the session does not show the owner's decisions: docs/owner-decisions.md lost its first decision, or a theme's file in .claude/rules is gone or lost its paths");
// the start names the one feature to work on (Anthropic's harness: "choose the highest-priority feature
// that's not yet done") and nothing to do first: each "first" or "before other work" printed there became
// the window's task before his message
const firstOpen = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/features.json'), 'utf8')).features.find((f) => !f.passes);
assert.ok(!firstOpen || start.stdout.includes(`Current feature (docs/features.json): ${firstOpen.id}`), `the start does not name the current feature:\n${start.stdout.slice(-600)}`);
assert.ok(!/first thing|before other work|say so to the owner first|tell the owner what is broken/i.test(start.stdout), 'the start tells the session what to do first again');
// his brake: yesterday's commits split by what they touched, a commit touching both counted in both
assert.deepEqual(split('@@a\nsrc/x.js\n\n@@b\ntools/y.mjs\ndocs/z.md\n\n@@c\nsrc/a.js\ntests/b.mjs\n\n@@d\nREADME.md'), { game: 2, process: 2 }, 'commits to the game and to the process counted wrong');
// the ten circles he approved arrive once, with CLAUDE.md, at every start and after every compaction, as
// he chose; the start never prints them, and his first message names them if they did not load
const circles = fs.readFileSync(path.join(ROOT, 'docs/ten-circles.md'), 'utf8').trim();
assert.ok(/^The ten circles[^\n]*@docs\/ten-circles\.md/m.test(fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8')), 'CLAUDE.md no longer imports the ten circles he approved');
assert.ok(!start.stdout.includes(circles), 'the start prints the ten circles again: a second copy beside CLAUDE.md');
assert.ok(start.stdout.length < 10000, `the start hook prints ${start.stdout.length} characters: over 10,000 Claude Code keeps only a preview`);
// and on the worst day, not only on this machine: the red-CI line and the branch warning at their longest
// (GitHub's runner sees no CI line; a start that fit here went over there twice)
const worstStart = start.stdout.length + 2 * (EXTRA_LINE + 2);
assert.ok(worstStart < 10000, `on the worst day the start would print ${worstStart} characters: over 10,000 Claude Code keeps only a preview`);

// CLAUDE.md's imports read as Claude Code reads them (code.claude.com/docs/en/memory): every name has a file
// behind it. "@docs/tandem.md." kept the tandem out of every window: the dot is caught. Last, so the older
// guards above see their own mistakes first (tools/prove-guards.mjs)
{
  const md = path.join(ROOT, 'CLAUDE.md');
  const gone = imports(md).filter((f) => !fs.existsSync(f));
  assert.deepEqual(gone, [], `CLAUDE.md imports a name with no file behind it, which loads nothing: ${gone.join(', ')}`);
  assert.ok(imports(md).some((f) => f.endsWith(path.join('docs', 'tandem.md'))), 'CLAUDE.md no longer imports docs/tandem.md');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imports-'));
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), 'Who errs: @docs/tandem.md. More.\nCode: `@not/this.md`, ``@nor/this.md``, a@mail.com\n```\n@nor/that.md\n```\n  ~~~\n  @nor/indented.md\n  ~~~\n');
  assert.deepEqual(imports(path.join(dir, 'CLAUDE.md')).map((f) => path.relative(dir, f).replace(/\\/g, '/')), ['docs/tandem.md.'], 'an import is not read as Claude Code reads it');
  fs.rmSync(dir, { recursive: true, force: true });
}

// The thermometer and his measure, from the record Claude Code's InstructionsLoaded hook writes: a file
// CLAUDE.md names that did not load, or loaded before the copy was brought up, is told to him once a
// window and to me at each message; his measure comes at a window's first message only. A home of its own.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loads-'));
  const env = { ...process.env, HOME: dir, USERPROFILE: dir };
  const run = (m, event) => spawnSync(process.execPath, ['tools/claude-guard.mjs', m], { cwd: ROOT, encoding: 'utf8', env, input: JSON.stringify({ cwd: ROOT, ...event }) });
  const out = (s, prompt = 'hi') => { try { return JSON.parse(run('prompt', { session_id: s, prompt }).stdout); } catch { return {}; } };
  const all = [path.join(ROOT, 'CLAUDE.md'), ...imports(path.join(ROOT, 'CLAUDE.md'))];
  const load = (s, files) => files.forEach((f) => run('loaded', { session_id: s, file_path: f, load_reason: 'session_start' }));
  assert.match(out('M').systemMessage || '', /^За 7 дней ты принял вещей из списка: \d+\. Вчера коммитов: в игру \d+, в процесс \d+\./, 'his measure was not shown at the first message');
  assert.doesNotMatch(out('M').systemMessage || '', /За 7 дней/, 'his measure came again in the same window');
  // the app may not show him the hook's line, so it comes to me to say first, word for word
  assert.match(out('N').hookSpecificOutput?.additionalContext || '', /^Say to him first, word for word: «За 7 дней ты принял вещей из списка: \d+\./, 'his measure was not handed to me to say to him');
  load('L', all.filter((f) => !f.endsWith('tandem.md')));
  const told = out('L');
  assert.match(told.systemMessage || '', /не загрузилось: docs\/tandem\.md/, 'a file CLAUDE.md names that did not load was not told to him');
  assert.match(told.hookSpecificOutput?.additionalContext || '', /Not loaded: docs\/tandem\.md/, 'a file that did not load was not told to me');
  // a window another window opens gets the same old copy again: the files are read again, no new window
  assert.doesNotMatch(told.systemMessage || '', /новое окно/, 'he was sent to open a new window');
  assert.doesNotMatch(out('L').systemMessage || '', /загрузилось/, 'he was told twice in one window');
  load('K', all);
  assert.doesNotMatch(JSON.stringify(out('K')), /Not loaded|загрузил/, 'a window with every file loaded was warned');
  load('C', all);
  fs.appendFileSync(path.join(dir, 'Documents', 'objekt-files', 'notes', 'instructions-loaded.jsonl'), `${JSON.stringify({ t: Date.now() + 1000, s: 'C', caughtUp: true })}\n`);
  assert.match(out('C').systemMessage || '', /загрузились до обновления копии/, 'files loaded before the copy was brought up were not told to him');
  // two catch-ups: a load between them predates the copy now in use, so the latest one counts
  const log = path.join(dir, 'Documents', 'objekt-files', 'notes', 'instructions-loaded.jsonl');
  for (const [t, more] of [[1000, null], [2000, { caughtUp: true }], [3000, null], [4000, { caughtUp: true }]]) {
    if (more) fs.appendFileSync(log, `${JSON.stringify({ t, s: 'D', ...more })}\n`);
    else for (const f of all) fs.appendFileSync(log, `${JSON.stringify({ t, s: 'D', f })}\n`);
  }
  assert.match(out('D').systemMessage || '', /загрузились до обновления копии/, 'a load between two catch-ups passed as current');
  fs.rmSync(dir, { recursive: true, force: true });
}

// A feature turns to passing only on his «да» in his log (CLAUDE.md step 5): the commit hook runs the gate, and the
// gate counts «да» and two words at most, said in the last 3 hours, with no «нет» or «стоп» after it. A home and a
// repository of its own, with a list where a and b are open and c passed.
{
  assert.match(fs.readFileSync(path.join(ROOT, 'tools/hooks/pre-commit'), 'utf8'), /^git show :docs\/features\.json 2>\/dev\/null \| node tools\/claude-guard\.mjs accepted\b/m, 'the commit hook does not hand the staged list to the gate on his «да»');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'accepted-')), repo = path.join(dir, 'repo');
  const env = { ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_'))), HOME: dir, USERPROFILE: dir };
  const g = (...a) => spawnSync('git', a, { cwd: repo, encoding: 'utf8', env });
  const list = (passes) => JSON.stringify({ features: Object.entries(passes).map(([id, p]) => ({ id, passes: p })) }, null, 1);
  fs.mkdirSync(path.join(repo, 'docs'), { recursive: true });
  spawnSync('git', ['init', '-q', repo]);
  fs.writeFileSync(path.join(repo, 'docs/features.json'), list({ a: false, b: false, c: true }));
  g('add', '.'); g('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'list');
  const log = path.join(dir, 'Documents', 'objekt-files', 'notes', 'owner-messages.md');
  fs.mkdirSync(path.dirname(log), { recursive: true });
  const said = (...m) => fs.writeFileSync(log, `# log\n${m.map(([h, t]) => `\n## ${new Date(Date.now() - h * 36e5).toISOString()} S\n${t}\n`).join('')}`);
  // the staged list comes on stdin, as the hook pipes it, run in the repository's own folder as git runs a hook
  const raw = (text) => spawnSync(process.execPath, [path.join(ROOT, 'tools/claude-guard.mjs'), 'accepted'], { cwd: repo, encoding: 'utf8', env, input: text }).status;
  const gate = (passes) => raw(list(passes));
  said();
  assert.equal(gate({ a: false, b: false, c: true }), 0, 'a commit with no feature turned to passing was stopped');
  assert.equal(gate({ a: true, b: false, c: true }), 1, 'a feature turned to passing with no «да» of his');
  assert.equal(gate({ a: false, c: true }), 1, 'a feature left the list with no «да» of his');
  assert.equal(raw(JSON.stringify({ cwd: repo })), 1, 'a staged list with no features in it passed');
  assert.equal(gate({ a: false, b: false }), 1, 'a passing feature left the list with no «да» of his');
  assert.equal(gate({ a: false, b: false, c: true, d: true }), 1, 'a new feature came in passing with no «да» of his');
  assert.equal(gate({ a: false, b: false, c: false }), 0, 'a passing feature turned back to open was stopped');
  // a list naming another folder is still compared with this repository's HEAD
  assert.equal(raw(JSON.stringify({ cwd: os.tmpdir(), ...JSON.parse(list({ a: true, b: false, c: true })) })), 1, 'a staged list chose the repository it is compared with');
  said([1, 'да, красиво']);
  assert.equal(gate({ a: true, b: false, c: true }), 0, 'his «да» an hour ago did not count');
  assert.equal(raw('{ broken'), 1, 'a broken staged list passed on his «да»');
  said([1, 'Да'], [0.5, 'нет, свет не тот']);
  assert.equal(gate({ a: true, b: false, c: true }), 1, 'a «да» he took back with «нет» counted');
  said([4, 'да']);
  assert.equal(gate({ a: true, b: false, c: true }), 1, 'a «да» four hours old counted');
  said([0.2, 'Да ну, это совсем не то, что я хотел']);
  assert.equal(gate({ a: true, b: false, c: true }), 1, 'a long message opening with «Да» counted as his yes');
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log(`guard: ok (${refused.length} refused, ${allowed.length} allowed, the hook wired, the headset's wearer seen, his messages logged and only his, his decisions imported by CLAUDE.md, every import found, the current feature shown at start, his measure and what did not load handed to me for him at his first message, a feature passing only on his «да» in his log, nothing to do first, commands left running named)`);
