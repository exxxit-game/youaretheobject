// The owner's automatic stop (tools/review-gate.mjs) both ways: the headset tools and the test copy
// refuse with no practice review of the current files, a review recorded by Claude Code's hook
// (tools/claude-guard.mjs, subagent-start and subagent-stop) lets them go, any change to what a
// person meets stops them again (the assistant's own look excepted, after a fix only of files the
// review named), and the assistant cannot write the record or point the tools at another one.
// Runs on a scratch checkout with its own record; nothing touches the headset.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint, reviewOf, lookOf, REPORT_END, PAPER_END, paperOf, checkedRooms, endsWithBlock, write } from '../tools/review-gate.mjs';
import { withoutGitVars } from '../tools/secrets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-gate-'));
const place = path.join(tmp, 'checkout');
const record = path.join(tmp, 'reviews.jsonl');
const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(place, rel)), { recursive: true }); fs.writeFileSync(path.join(place, rel), text); };
put('index.html', '<html></html>\n');
put('src/a.js', 'export const a = 1;\n');
put('tools/xr-probe.html', '<p>probe</p>\n');
put('docs/note.md', 'not met by anyone\n');
execFileSync('git', ['init', '-q'], { cwd: place, env: withoutGitVars() });

// the print: what a person meets, by content; line ends and files nobody meets do not count
const first = fingerprint(place);
put('src/a.js', 'export const a = 1;\r\n');
assert.equal(fingerprint(place), first, 'CRLF and LF give one print');
put('docs/note.md', 'changed\n');
assert.equal(fingerprint(place), first, 'a file nobody meets does not change the print');
put('src/a.js', 'export const a = 2;\n');
assert.notEqual(fingerprint(place), first, 'a changed game file changes the print');

// Claude Code hands its hook the event as JSON on stdin (code.claude.com/docs/en/hooks)
const hook = (mode, event) => spawnSync(process.execPath, [path.join(ROOT, 'tools/claude-guard.mjs'), mode],
  { cwd: ROOT, encoding: 'utf8', env: { ...withoutGitVars(), OBJECT_REVIEW_RECORD: record }, input: JSON.stringify({ cwd: place, ...event }) });
const review = (agent, { type = 'practice-reviewer', report = `Findings…\n${REPORT_END} none`, between } = {}) => {
  hook('subagent-start', { agent_id: agent, agent_type: type });
  if (between) between();
  hook('subagent-stop', { agent_id: agent, agent_type: type, last_assistant_message: report, agent_transcript_path: path.join(tmp, `${agent}.jsonl`) });
};

assert.equal(reviewOf(place, record), null, 'no review yet: the stop holds');
review('other-1', { type: 'paper-reviewer' });
assert.equal(reviewOf(place, record), null, 'another agent\'s run is no practice review');
review('cut-1', { report: 'Findings, then the run was cut short' });
assert.equal(reviewOf(place, record), null, 'a report that never reached its last block does not count');
review('cut-3', { report: `Findings.\n${REPORT_END} none\n\nMore findings, then the run was cut short` });
assert.equal(reviewOf(place, record), null, 'the block further up, then more prose: the run was cut short');
assert.ok(endsWithBlock(`x\n${REPORT_END}\n- https://a.b — the page\n`, REPORT_END), 'the block with its link lines is the last block');
assert.ok(!endsWithBlock(`x\n${REPORT_END} none\nthen more`, REPORT_END), 'more prose after the block: not the last block');
assert.ok(endsWithBlock('a (b\nROOMS CHECKED: 01-x', PAPER_END) && !endsWithBlock('x', '('), 'the marker is matched as text, never as a pattern');
review('moved-1', { between: () => put('src/a.js', 'export const a = 3;\n') });
assert.equal(reviewOf(place, record), null, 'files changed while it read them: no review');
// the report comes back through a tool call, so it is read from the transcript's last assistant
// entry; the caller's prompt names the block too and must not count
const transcript = (name, entries) => { const f = path.join(tmp, `${name}.jsonl`); fs.writeFileSync(f, entries.map((e) => JSON.stringify(e)).join('\n')); return f; };
const prompt = { type: 'user', message: { content: [{ type: 'text', text: `Review it and end with the ${REPORT_END} block` }] } };
const handback = (text) => ({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'SubagentHandback', input: { message: text } }] } });
const viaTranscript = (agent, entries) => {
  hook('subagent-start', { agent_id: agent, agent_type: 'practice-reviewer' });
  hook('subagent-stop', { agent_id: agent, agent_type: 'practice-reviewer', last_assistant_message: '', agent_transcript_path: transcript(agent, entries) });
};
viaTranscript('cut-2', [prompt, handback('Findings so far, then cut short')]);
assert.equal(reviewOf(place, record), null, 'the block named in the prompt is no report of the reviewer\'s');
viaTranscript('good-2', [prompt, handback(`Findings.\n${REPORT_END} none`)]);
assert.ok(reviewOf(place, record), 'a report handed back through a tool call counts');
put('src/a.js', 'export const a = 4;\n');
assert.equal(reviewOf(place, record), null, 'and a change after it stops the tools again');
review('good-1');
assert.ok(reviewOf(place, record), 'a whole practice review of these very files lets the tools go');
put('tools/xr-probe.html', '<p>probe, changed</p>\n');
assert.equal(reviewOf(place, record), null, 'the probe changed after the review: the stop holds again');
// the assistant's own look in the headset after fixing what a review found (quest-look vr): a change
// only to files the report named lets it go; the test copy still waits for a review of these files
review('fix-1', { report: `The answer button in src/a.js is too small to hit.\n${REPORT_END} none` });
put('src/a.js', 'export const a = 5;\n');
assert.equal(reviewOf(place, record), null, 'after the fix the test copy waits for a new review');
assert.ok(lookOf(place, record), 'a fix only of the files the review named lets the own look go');
put('index.html', '<html>changed</html>\n');
assert.equal(lookOf(place, record), null, 'a file the review did not name changed: the own look waits too');

// the paper check, room by room (requirePaper): a paper reviewer's run counts for the rooms its last
// line lists, each as it then stands
put('src/rooms/01-x/room.js', 'export const n = 1;\n');
put('src/rooms/02-y/room.js', 'export const n = 2;\n');
assert.deepEqual(checkedRooms(`x\n${PAPER_END} 01-x, 02-y\n\n`), ['01-x', '02-y'], 'the rooms the last line lists');
assert.deepEqual(checkedRooms(`x\n${PAPER_END} 01-x\nFindings so far, then cut short`), [], 'a rooms line further up, then cut short: no room counts');
assert.equal(paperOf(place, '01-x', {}, record), null, 'no paper check yet: the stop holds');
review('paper-cut', { type: 'paper-reviewer', report: 'Findings, then the run was cut short' });
assert.equal(paperOf(place, '01-x', {}, record), null, 'a report with no rooms line does not count');
review('paper-1', { type: 'paper-reviewer', report: `1. minor: src/rooms/01-x/room.js:1 says 1, the paper 2.\n${PAPER_END} 01-x` });
assert.ok(paperOf(place, '01-x', {}, record), 'a whole paper check of the room lets it go');
assert.equal(paperOf(place, '02-y', {}, record), null, 'a room the report did not list stays unchecked');
review('paper-2', { report: `Findings.\n${REPORT_END} none\n${PAPER_END} 02-y` });
assert.equal(paperOf(place, '02-y', {}, record), null, 'a practice reviewer\'s run is no paper check');
review('paper-moved', { type: 'paper-reviewer', report: `${PAPER_END} 02-y`, between: () => put('src/rooms/02-y/room.js', 'export const n = 3;\n') });
assert.equal(paperOf(place, '02-y', {}, record), null, 'the room changed while it was read: no check');
hook('subagent-start', { agent_id: 'paper-t', agent_type: 'paper-reviewer' });
hook('subagent-stop', { agent_id: 'paper-t', agent_type: 'paper-reviewer', last_assistant_message: '',
  agent_transcript_path: transcript('paper-t', [{ type: 'user', message: { content: [{ type: 'text', text: `End with ${PAPER_END} 02-y` }] } }, handback(`Findings.\n${PAPER_END} 02-y`)]) });
assert.ok(paperOf(place, '02-y', {}, record), 'a report handed back through a tool call counts for the room it lists');
put('src/rooms/01-x/room.js', 'export const n = 4;\n');
assert.equal(paperOf(place, '01-x', {}, record), null, 'a change to the room after its check stops the tools again');
assert.ok(paperOf(place, '01-x', { look: true }, record), 'the own look goes after a fix of a file the report named');
put('src/rooms/01-x/texts.ru.js', 'export const t = 1;\n');
assert.equal(paperOf(place, '01-x', { look: true }, record), null, 'a file the report did not name: the own look waits too');
hook('subagent-start', { agent_id: 'paper-cut-2', agent_type: 'paper-reviewer' });
hook('subagent-stop', { agent_id: 'paper-cut-2', agent_type: 'paper-reviewer', last_assistant_message: '',
  agent_transcript_path: transcript('paper-cut-2', [handback(`${PAPER_END} 01-x\nFindings so far, then cut short`)]) });
assert.equal(paperOf(place, '01-x', {}, record), null, 'a handed-back report whose rooms line is not its last: no check');

// the tools refuse before they touch the headset or GitHub (an empty record: no review exists); run
// with only node on the path, so a stop that ever broke could reach no adb, git or gh from here
const empty = path.join(tmp, 'empty.jsonl');
const bare = Object.fromEntries(Object.entries(withoutGitVars()).filter(([k]) => k.toUpperCase() !== 'PATH'));
bare.PATH = path.dirname(process.execPath);
for (const args of [['tools/quest-look.mjs', 'vr'], ['tools/quest-look.mjs', 'eval', "document.querySelector('a-scene').enterVR()"], ['tools/xr-probe-run.mjs', 'input'], ['tools/publish-preview.mjs', '--anyway']]) {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', env: { ...bare, OBJECT_REVIEW_RECORD: empty }, timeout: 20000 });
  assert.ok(r.status === 1 && r.stdout.includes('waits for the practice reviewer'), `${args.join(' ')} went ahead with no review:\n${r.stdout}${r.stderr}`);
}
// and with a practice review of these very files but no paper check of the room, the headset and the
// test copy still wait (the probe shows no room, so it does not)
const practiced = path.join(tmp, 'practiced.jsonl');
write({ kind: 'review', agent: 'test', print: fingerprint(ROOT) }, practiced);
for (const args of [['tools/quest-look.mjs', 'vr'], ['tools/publish-preview.mjs', '--anyway']]) {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', env: { ...bare, OBJECT_REVIEW_RECORD: practiced }, timeout: 20000 });
  assert.ok(r.status === 1 && r.stdout.includes('waits for the paper check of 01-control'), `${args.join(' ')} went ahead with no paper check:\n${r.stdout}${r.stderr}`);
}

// the assistant cannot write the record or point the tools at another one; reading and the tools pass
const pre = (tool_name, tool_input) => spawnSync(process.execPath, ['tools/claude-guard.mjs', 'pre'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ tool_name, tool_input, cwd: ROOT }) }).status === 2;
const at = 'C:\\Users\\x\\Documents\\objekt-files\\notes\\practice-reviews.jsonl';
assert.ok(pre('Write', { file_path: at, content: '{}' }), 'Write to the record refused');
assert.ok(pre('Edit', { file_path: at, old_string: 'a', new_string: 'b' }), 'Edit of the record refused');
for (const c of [`echo '{"kind":"review"}' >> ${at}`, `Add-Content -Path "${at}" -Value x`, `node -e "require('fs').appendFileSync('${at.replace(/\\/g, '/')}', 'x')"`,
  'OBJECT_REVIEW_RECORD=/tmp/fake.jsonl node tools/quest-look.mjs vr', "$env:OBJECT_REVIEW_RECORD='C:\\fake.jsonl'; node tools/publish-preview.mjs"]) {
  assert.ok(pre('Bash', { command: c }), `the guard let through: ${c}`);
}
assert.ok(!pre('Write', { file_path: path.join(ROOT, 'docs', 'x.md'), content: 'x' }), 'other files are written as before');
for (const c of ['node tools/quest-look.mjs vr', 'node tools/publish-preview.mjs', 'grep -n OBJECT_REVIEW_RECORD tools/review-gate.mjs']) {
  assert.ok(!pre('Bash', { command: c }), `the guard refused a command that writes no record: ${c}`);
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log('review gate: ok (the stop holds without a review, after a change, for other agents and cut reports; the own look goes after a fix of what the review named; the paper check holds the same way room by room; the record is the hook\'s alone)');
