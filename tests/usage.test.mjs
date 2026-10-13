// tools/usage.mjs counts each API response once: Claude Code writes a line per content block, each with the
// response's message id and a copy of its usage, and only the last carries the final output count. A made-up
// two-line transcript in the shape of the laptop's own, plus the week's edge and the list-price weighting.
import assert from 'node:assert/strict';
import { readText, usd, weekStart, sum, runs } from '../tools/usage.mjs';

const usage = (output) => ({ input_tokens: 2, output_tokens: output, cache_creation_input_tokens: 1000, cache_read_input_tokens: 50000,
  cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 1000 } });
const line = (output, stop, at) => JSON.stringify({ type: 'assistant', timestamp: at, sessionId: 's1', isSidechain: false, requestId: 'req_1',
  message: { id: 'msg_1', model: 'claude-opus-5-5', stop_reason: stop, content: [{ type: 'text', text: 'hi' }], usage: usage(output) } });
const text = [line(8, null, '2026-10-13T07:00:00.000Z'), line(300, 'end_turn', '2026-10-13T07:00:05.000Z')].join('\n');

const acc = readText(text, { project: 'objekt' });
const list = [...acc.byId.values()];
assert.equal(list.length, 1, 'two lines of one message id are one response');
const [r] = list;
assert.deepEqual([r.input, r.write5m, r.write1h, r.read, r.output, r.final], [2, 0, 1000, 50000, 300, true], 'the final line\'s output, the cache split kept');
assert.equal(r.at, Date.parse('2026-10-13T07:00:00.000Z'), 'a response is placed at its first line');
// list price of Opus 5.5 per million: input 4, 1-hour cache write 8, cache read 0.2, output 20
assert.equal(usd(r).toFixed(6), ((2 * 4 + 1000 * 8 + 50000 * 0.2 + 300 * 20) / 1e6).toFixed(6));
const s = sum(list);
assert.deepEqual([s.n, s.write, s.open], [1, 1000, 0]);

// a response whose lines never reach the final count stays open: its output is a lower bound
const open = readText(line(8, null, '2026-10-13T08:00:00.000Z').replace('msg_1', 'msg_2'), {});
assert.equal(sum([...open.byId.values()]).open, 1);

// Claude Code's own notices (model <synthetic>) are no call to the model: kept only as limit notices
const notice = JSON.stringify({ type: 'assistant', timestamp: '2026-10-12T16:14:29.176Z', sessionId: 's1',
  message: { id: 'msg_3', model: '<synthetic>', content: [{ type: 'text', text: "You've hit your weekly limit · resets 9am (Europe/Chisinau)" }], usage: usage(0) } });
const n = readText(notice, {});
assert.deepEqual([n.byId.size, n.notices.length], [0, 1]);

// the week turns at Tuesday 06:00 UTC
assert.equal(weekStart(Date.parse('2026-10-13T05:59:59Z')), Date.parse('2026-10-06T06:00:00Z'));
assert.equal(weekStart(Date.parse('2026-10-13T06:00:00Z')), Date.parse('2026-10-13T06:00:00Z'));
// a fall in the weekly percent or a new week starts a new run of readings
const t = (h) => Date.parse('2026-10-08T00:00:00Z') + h * 36e5;
assert.deepEqual(runs([{ t: t(0), sd: 10 }, { t: t(1), sd: 20 }, { t: t(2), sd: 5 }, { t: t(130), sd: 7 }]).map((x) => x.length), [2, 1, 1]);
console.log('usage tests: ok');
