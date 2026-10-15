// Any light that changes in the game stays under the flash rule for photosensitive
// players (WCAG 2.3.1, Three Flashes or Below Threshold): no more than three flashes in
// any one-second period. A flash is a pair of opposing changes of 10% or more where the
// darker level is below 0.80. In a headset the light can fill much of the view, so the
// small-area exception is not used (Jordan & Vanderheiden 2024).
import assert from 'node:assert/strict';
import { arrivalStep, settleArrival, SIGN_WORDS, SIGN_ENDINGS, SIGN_ANSWER, SIGN_ENDING_DEFAULT, SIGN_ROUND, SIGN_TRIES, SIGN_LIT_AT, ARRIVAL, SIGN_AT, facesSign, pickEnding } from '../src/app/lobby/sign.js';

// keys: [t, level]
function maxFlashesPerSecond(keys) {
  const changes = [];
  for (let i = 1; i < keys.length; i++) {
    const [t, to] = keys[i], from = keys[i - 1][1];
    if (Math.abs(to - from) >= 0.1 && Math.min(to, from) < 0.8) changes.push(t);
  }
  let worst = 0;
  for (const start of changes) {
    const inWindow = changes.filter(t => t >= start && t < start + 1).length;
    worst = Math.max(worst, Math.floor(inWindow / 2));
  }
  return worst;
}
// the counter itself: four quick on-off flashes in a second must fail
assert.equal(maxFlashesPerSecond([[0, 0], [0.1, 1], [0.2, 0], [0.3, 1], [0.4, 0], [0.5, 1], [0.6, 0], [0.7, 1], [0.8, 0]]), 4);

// Every ending of the sign's play (and ending b's answer): times rise, one level per word,
// every word and the whole sign (its mean light, weighted by letters) under the flash rule.
const letters = SIGN_WORDS.join('').length;
const reads = (keys, time) => {
  let k = 0;
  while (k + 1 < keys.length && keys[k + 1][0] <= time) k++;
  return SIGN_WORDS.filter((w, i) => keys[k][1][i] >= 0.9).join('');
};
assert.ok(SIGN_ENDING_DEFAULT in SIGN_ENDINGS, 'the default ending exists');
// one ending per visit, in a round: the first visit gets the first, every ending comes round,
// and ?sign= forces one
assert.ok(SIGN_ROUND.every(e => e in SIGN_ENDINGS) && new Set(SIGN_ROUND).size === SIGN_ROUND.length, 'the round names real endings once each');
assert.equal(pickEnding(0, null), SIGN_ROUND[0], 'first visit');
assert.deepEqual(SIGN_ROUND.map((e, i) => pickEnding(i, null)), SIGN_ROUND, 'each visit the next ending');
assert.equal(pickEnding(SIGN_ROUND.length, null), SIGN_ROUND[0], 'and round again');
assert.equal(pickEnding(5, 'c'), 'c', '?sign= forces an ending');
assert.equal(pickEnding(NaN, 'zz'), SIGN_ROUND[0], 'a broken count or name falls back to the first');
for (const odd of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) assert.equal(pickEnding(1, odd), SIGN_ROUND[1], `?sign=${odd} is not an ending`);
for (const [name, play] of [...Object.entries(SIGN_ENDINGS), ['b answer', SIGN_ANSWER]]) {
  assert.ok(play.every(([t, l], i) => l.length === SIGN_WORDS.length && (i === 0 || t >= play[i - 1][0])), `${name}: keys in time order, one level per word`);
  const tracks = [
    ...SIGN_WORDS.map((w, i) => [w, play.map(([t, l]) => [t, l[i]])]),
    ['whole sign', play.map(([t, l]) => [t, l.reduce((sum, v, i) => sum + v * SIGN_WORDS[i].length, 0) / letters])]
  ];
  for (const [word, keys] of tracks) {
    const f = maxFlashesPerSecond(keys);
    assert.ok(f <= 3, `${name}, ${word}: ${f} flashes in one second (at most 3)`);
  }
}

// What the sign says along the way: the site's address, then the name without ".com", then
// "you object", each held long enough to read twice; endings a and c end on the name, b on
// "you" until the player takes the clipboard, when its answer brings the name back.
for (const [name, play] of Object.entries(SIGN_ENDINGS)) {
  const said = [], longest = {};
  for (let i = 0, prev = '', since = 0; ; i++) {
    const t = i * 0.05, now = reads(play, t);
    if (now !== prev || t > play.at(-1)[0]) { longest[prev] = Math.max(longest[prev] || 0, t - since); prev = now; since = t; }
    if (now && now !== said.at(-1)) said.push(now);
    if (t > play.at(-1)[0]) break;
  }
  for (const step of ['youaretheobject.com', 'youaretheobject', 'youobject']) {
    assert.ok(said.includes(step), `${name}: the sign never reads "${step}" (reads: ${said.join(' → ')})`);
    assert.ok(longest[step] >= 2.5, `${name}: "${step}" shows at most ${(longest[step] || 0).toFixed(1)} s at a time`);
  }
  assert.equal(said.at(-1), name === 'b' ? 'you' : 'youaretheobject', `${name}: how the sign ends`);
}
assert.equal(reads(SIGN_ANSWER, SIGN_ANSWER.at(-1)[0]), 'youaretheobject', 'ending b: the name comes back when the clipboard is taken');
assert.ok(SIGN_LIT_AT > SIGN_TRIES.at(-1)[1], 'the hum starts once the sign is lit');
// the hum starts on the lamps' own clock: in every ending the first hum cue is at SIGN_LIT_AT,
// at full level, and the whole sign is lit then
for (const [name, play] of Object.entries(SIGN_ENDINGS)) {
  const first = play.find((k) => k[2] && k[2].hum !== undefined);
  assert.ok(first && first[0] === SIGN_LIT_AT && first[2].hum === 1, `${name}: the hum's first cue is not when the sign is lit`);
  assert.ok(first[1].every((v) => v === 1), `${name}: the hum starts before every word is lit`);
}

// The arrival is not rushed (docs/mistakes.md): the sign stays dark for the first 10 s in
// VR (West 2015), every starter try heats the tube 0.5–2 s before its kick (DIAL), and the
// sign shines alone before the voice.
assert.ok(ARRIVAL.orientS >= 10, 'the sign must wait at least 10 s after entering VR');
// The rule itself, run: in the headset's browser a press on the flat page never starts the sign,
// only VR does, after the wait; a computer starts it on the first press. Never at load: the
// browser plays no sound before a press, so the sign's clicks were lost, or, held for the press,
// went off all at once.
const quest = { headset: true, questBrowser: true }, pcVr = { headset: true, questBrowser: false }, pc = { headset: false, questBrowser: false };
assert.deepEqual(['load', 'flat-press', 'enter-vr'].map((m) => arrivalStep(quest, m)), ['wait', 'wait', 'settle'], 'Quest: only VR starts the sign');
assert.deepEqual(['load', 'flat-press'].map((m) => arrivalStep(pcVr, m)), ['wait', 'now'], 'a computer with a VR runtime: a press on the flat page');
assert.deepEqual(['load', 'flat-press'].map((m) => arrivalStep(pc, m)), ['wait', 'now'], 'a computer without VR: the first press');
for (const d of [quest, pcVr, pc]) assert.notEqual(arrivalStep(d, 'load'), 'now', 'nothing that sounds starts before the first press');
// and the wait, timed with a fake clock: even a player facing the sign from the start waits orientS
{
  let clock = 0;
  await settleArrival(async (s) => { clock += s; }, () => true);
  assert.ok(clock >= 10, `the sign started ${clock} s after entering VR, under 10 s`);
  clock = 0;
  await settleArrival(async (s) => { clock += s; }, () => false);
  assert.ok(clock <= ARRIVAL.orientS + ARRIVAL.lookWaitS + 0.5, 'a player who never faces it is not kept waiting past lookWaitS');
}
assert.ok(ARRIVAL.litPauseS > 0, 'the lit sign must shine alone before the voice and the sheet');
assert.equal(SIGN_TRIES.length, 3, 'three starter tries');
for (const [heat, kick] of SIGN_TRIES) assert.ok(kick - heat >= 0.5 && kick - heat <= 2, `a starter try heats ${(kick - heat).toFixed(2)} s (0.5–2 s)`);

// facing: from the arrival spot the sign is ahead (-Z); turned around or to the side it is not
const eye = [0.7, 1.6, 3.05];
assert.ok(facesSign(eye, [0, 0, -1]), 'facing the door faces the sign');
assert.ok(facesSign(eye, [0, -0.5, -0.86]), 'looking down at the door still counts');
assert.ok(!facesSign(eye, [0, 0, 1]), 'back to the door');
assert.ok(!facesSign(eye, [-1, 0, 0]), 'facing along the corridor');
assert.ok(SIGN_AT.y > eye[1], 'the sign hangs above the eyes');
console.log('glow tests: ok');
