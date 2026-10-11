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
import { MARK, unrelayed, sinceOwner } from '../tools/owner-links.mjs';
import { BOARD, SHOWS, YES, PENDING, shows, dayKey, plannedToday, stalled, saidYes } from '../tools/board.mjs';

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
]);
for (const [c, shell] of allowed) {
  const why = refusal(c, shell === PS);
  assert.ok(!why, `the guard refused a command that runs nothing it guards: ${c}\n${why}`);
}

// the hook itself, as Claude Code calls it: the event as JSON on stdin, exit 2 refuses
const ask = (tool_name, command) => spawnSync(process.execPath, ['tools/claude-guard.mjs', 'pre'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ tool_name, tool_input: { command }, cwd: ROOT }) }).status;
assert.equal(ask('Bash', 'git commit -n -m x'), 2, 'the hook let a hook-skipping commit through');
assert.equal(ask(PS, 'npm run test:smoke'), 2, 'the hook let the smoke test run in PowerShell');
assert.equal(ask('Bash', 'grep -rn "git commit --no-verify" docs/'), 0, 'the hook refused a search');

// One window at a time (tools/one-window.mjs): the window the owner last wrote in holds the work,
// another may not run commands or change files, and its turn ends without demands. A holder file and
// a home of the test's own, so neither the real holder nor his message log is touched.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'one-window-'));
  const env = { ...process.env, OBJECT_WINDOW: path.join(dir, 'window.json'), HOME: dir, USERPROFILE: dir };
  const hook = (mode, event) => spawnSync(process.execPath, ['tools/claude-guard.mjs', mode], { cwd: ROOT, encoding: 'utf8', env, input: JSON.stringify({ cwd: ROOT, ...event }) }).status;
  hook('prompt', { session_id: 'A', prompt: 'his message' });
  assert.equal(JSON.parse(fs.readFileSync(env.OBJECT_WINDOW, 'utf8')).session, 'A', 'the window he wrote in does not hold the work');
  assert.equal(hook('pre', { session_id: 'B', tool_name: 'Bash', tool_input: { command: 'ls' } }), 2, 'another window ran a command');
  assert.equal(hook('pre', { session_id: 'B', tool_name: 'Edit', tool_input: { file_path: 'x.js' } }), 2, 'another window changed a file');
  assert.equal(hook('pre', { session_id: 'A', tool_name: 'Bash', tool_input: { command: 'ls' } }), 0, 'the window he wrote in was stopped');
  assert.equal(hook('stop', { session_id: 'B' }), 0, 'a window without the work was asked to save or push');
  hook('prompt', { session_id: 'B', prompt: '<task-notification>a helper finished</task-notification>' });
  assert.equal(JSON.parse(fs.readFileSync(env.OBJECT_WINDOW, 'utf8')).session, 'A', 'a notice took the work, not his message');
  hook('prompt', { session_id: 'B', prompt: '<ci-monitor-event>53 new review comments</ci-monitor-event>' });
  assert.equal(JSON.parse(fs.readFileSync(env.OBJECT_WINDOW, 'utf8')).session, 'A', 'the pull request watcher took the work, not his message');
  hook('prompt', { session_id: 'B', prompt: '<system-reminder>\nYou are operating in a git worktree.\n</system-reminder>\n\n' });
  assert.equal(JSON.parse(fs.readFileSync(env.OBJECT_WINDOW, 'utf8')).session, 'A', 'a bare note took the work');
  // a new window's first message: the app's worktree note, then his words (11.10)
  hook('prompt', { session_id: 'B', prompt: '<system-reminder>\nYou are operating in a git worktree.\n</system-reminder>\n\ncarry on here' });
  assert.equal(hook('pre', { session_id: 'B', tool_name: 'Bash', tool_input: { command: 'ls' } }), 0, 'the work did not follow him to the window he wrote in');
  assert.match(fs.readFileSync(path.join(dir, 'Documents', 'objekt-files', 'notes', 'owner-messages.md'), 'utf8'), /carry on here/, 'his first message in a new window was not logged');
  assert.doesNotMatch(fs.readFileSync(path.join(dir, 'Documents', 'objekt-files', 'notes', 'owner-messages.md'), 'utf8'), /review comments/, 'the watcher\'s event was logged as his words');
  fs.rmSync(dir, { recursive: true, force: true });
}

// The headset tools restart nothing while the owner wears the headset: the power service's dump
// says mounted with no override of ours (tools/headset.mjs). Dumps as the headset printed them.
const dump = (state, virtual) => `Virtual proximity state: ${virtual}\nisAutosleepDisabled: false\nState: ${state}\n`;
assert.ok(onHead(dump('HEADSET_MOUNTED', 'DISABLED')), 'worn by the owner reads as on his head');
assert.ok(!onHead(dump('HEADSET_MOUNTED', 'CLOSE')), 'our own "worn on" override is not a person');
assert.ok(!onHead(dump('HEADSET_UNMOUNTED', 'DISABLED')) && !onHead(dump('STANDBY', 'DISABLED')), 'off the head is free to restart');

// Pages only the owner can open reach him: a link a research report lists after the mark must come
// up again later in the session record (raw text, JSON-escaped newlines as Claude Code writes them)
const report = `{"content":"found nothing open.\\n${MARK}\\n- https://archive.org/details/ubc1976 - section 3305\\n- https://shop.example.org/ubc.pdf.\\n\\nother text"}`;
assert.deepEqual(unrelayed(report).sort(), ['https://archive.org/details/ubc1976', 'https://shop.example.org/ubc.pdf'], 'both links are owed to the owner');
assert.deepEqual(unrelayed(report + '\n{"text":"open https://archive.org/details/ubc1976"}'), ['https://shop.example.org/ubc.pdf'], 'a link given to him is no longer owed');
assert.deepEqual(unrelayed(report + '\n{"text":"https://archive.org/details/ubc1976 and https://shop.example.org/ubc.pdf"}'), [], 'all given: the turn may end');
assert.deepEqual(unrelayed(`${MARK} none\\n\\nhttps://elsewhere.org/a`), [], 'a link after the block is not the owner\'s');
assert.deepEqual(unrelayed('no research today'), [], 'no mark, nothing owed');
// A report's block starts a line; a doc that names the mark in a sentence (docs/testing.md, read in a
// session) is not a report, and a local address further down was once held as owed to the owner
assert.deepEqual(unrelayed(`{"content":"    9\\t| claude-guard | left by a research agent after \`${MARK}\`, not reached him |\\n   20\\t| serve | http://localhost:3000 |"}`), [], 'the mark named in a sentence is no report');
assert.deepEqual(unrelayed(`{"content":"export const MARK = \\"${MARK}\\"; // see https://example.org/a"}`), [], 'the mark quoted in code is no report');
// The stop hook reads the record only from his last message on (a session's record grows to tens
// of MB): a helper's report or a notice is no message of his, in records with and without the mark
// Claude Code puts on what a person typed
const said = (text, origin) => ({ type: 'user', ...(origin ? { origin: { kind: origin } } : {}), ...(origin === 'peer' ? { isMeta: true } : {}), message: { role: 'user', content: text } });
const found = (url) => ({ type: 'assistant', message: { content: [{ type: 'text', text: `${MARK}\n- ${url}\n\n` }] } });
const recordFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'guard-test-')), 'session.jsonl');
for (const origin of ['human', null]) {
  // the pull request watcher's events come with no mark at all (11.10)
  const lines = [found('https://old.example.org/a'), said('carry on', origin), said(`a helper's report\n${MARK}\n- https://new.example.org/b\n\n`, 'peer'),
    said('<ci-monitor-event>13 new review comments</ci-monitor-event>', null),
    { type: 'user', message: { content: [{ type: 'tool_result', content: 'tool output' }] } }];
  fs.writeFileSync(recordFile, `${'{"type":"progress"}\n'.repeat(500)}${lines.map((l) => JSON.stringify(l)).join('\n')}\n`);
  for (const block of [1 << 20, 64]) {
    assert.deepEqual(unrelayed(sinceOwner(recordFile, block)), ['https://new.example.org/b'], `only links left since his last message are owed (${origin || 'no mark'}, blocks of ${block})`);
  }
}
fs.writeFileSync(recordFile, `${JSON.stringify(found('https://only.example.org/c'))}\n`);
assert.deepEqual(unrelayed(sinceOwner(recordFile, 16)), ['https://only.example.org/c'], 'a record he has not written in is read whole');
fs.rmSync(path.dirname(recordFile), { recursive: true, force: true });

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

// The board's table of showings: today's row is found in the owner's date form, and two answered rows in a
// row without his yes stop the side work; rows still waiting for his look do not count either way
const table = (rows) => `${SHOWS}\n| a | b | c |\n|---|---|---|\n${rows.map(([w, a]) => `| ${w} | thing | ${a} |`).join('\n')}\n`;
assert.equal(dayKey(new Date(2026, 9, 9)), '9.10', 'dates as the board writes them');
assert.ok(plannedToday(shows(table([['9.10', PENDING]])), '9.10') && !plannedToday(shows(table([['8.10', YES]])), '9.10'), 'a row for today is found, and only for today');
assert.ok(stalled(shows(table([['7.10', 'x'], ['8.10', 'y'], ['9.10', PENDING]]))), 'two answers without his yes stall the work');
assert.ok(!stalled(shows(table([['7.10', 'x'], ['8.10', YES], ['9.10', PENDING]])), { today: '9.10' }), 'a yes in the last two keeps the work going');
assert.ok(stalled(shows(table([['7.10', PENDING], ['8.10', PENDING]])), { today: '9.10' }), 'rows left waiting from earlier days count as sessions without his yes');
// a yes on the board counts only when his own message that day holds one
const log = (day, text) => `## 2026-10-${day}T12:00:00.000Z s\n${text}\n`;
assert.ok(saidYes(log('08', `${YES}, ok`), '8.10') && !saidYes(log('08', 'later maybe'), '8.10') && !saidYes(log('07', YES), '8.10'), 'his yes found only on its own day and as a word');
assert.ok(stalled(shows(table([['7.10', 'x'], ['8.10', YES], ['9.10', PENDING]])), { today: '9.10', log: log('08', 'no answer from him') }), 'a yes the assistant wrote without his word does not count');
assert.ok(!stalled(shows(table([['7.10', 'x'], ['8.10', YES], ['9.10', PENDING]])), { today: '9.10', log: log('08', YES) }), 'his own yes counts');
// the board quotes his answers: the word in angle quotes, capitalised, or after a note; a word that only contains its letters is no yes
for (const a of [`«${YES}»`, `«${YES[0].toUpperCase()}${YES.slice(1)}»`, `moved it; «${YES}»`]) assert.ok(!stalled(shows(table([['7.10', 'x'], ['8.10', a], ['9.10', PENDING]])), { today: '9.10', log: log('08', YES) }), `the answer ${a} is his yes`);
assert.ok(stalled(shows(table([['7.10', 'x'], ['8.10', `«${String.fromCharCode(0x43d, 0x430)}${YES}»`], ['9.10', PENDING]])), { today: '9.10' }), 'a word that only contains the letters is no yes');
assert.ok(start.stdout.length < 10000, `the start hook prints ${start.stdout.length} characters: over 10,000 Claude Code keeps only a preview`);
// and on the worst day, not only on this machine: the board and the session line, then five health
// problems and the CodeRabbit and red-CI lines, each at its longest (GitHub's runner lacks the
// laptop's programs; a start that fit here went over there twice)
const lastBoardLine = fs.readFileSync(path.join(ROOT, BOARD), 'utf8').trim().split(/\r?\n/).pop();
const shownBoard = start.stdout.slice(0, start.stdout.indexOf(lastBoardLine) + lastBoardLine.length).length;
const worstStart = shownBoard + 2 + (1 + HEALTH_SHOWN + 1) * (EXTRA_LINE + 1) + 2 * (EXTRA_LINE + 2);
assert.ok(worstStart < 10000, `on the worst day the start would print ${worstStart} characters (the board ${shownBoard}): shorten the board`);

console.log(`guard: ok (${refused.length} refused, ${allowed.length} allowed, the hook wired, the headset's wearer seen, links owed to the owner found since his last message, his decisions imported by CLAUDE.md, the board shown at start)`);
