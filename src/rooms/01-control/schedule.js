import { PROTOCOL } from './protocol.js';

// Pure: builds what the punched tapes and the relay timer did in 1979 (p. 450).
// `rand` returns [0, 1); tests pass a seeded one, the room passes Math.random.

export function pickCondition(rand) {
  const names = Object.keys(PROTOCOL.conditions);
  return names[Math.floor(rand() * names.length)];
}

// One tape: `length` outcomes (true = green), in blocks of PROTOCOL.tapeBlock with
// exactly round(p × block) greens per block, shuffled inside each block.
export function makeTape(p, length, rand) {
  const block = PROTOCOL.tapeBlock;
  const greens = Math.round(p * block);
  const tape = [];
  while (tape.length < length) {
    const b = Array.from({ length: block }, (_, i) => i < greens);
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    tape.push(...b);
  }
  return tape.slice(0, length);
}

// Both tapes for a condition. Each is long enough for all trials, since a player
// may press on every trial or on none.
export function makeTapes(condition, rand) {
  const c = PROTOCOL.conditions[condition];
  return { press: makeTape(c.press, PROTOCOL.trials, rand), noPress: makeTape(c.noPress, PROTOCOL.trials, rand) };
}

// Intervals between trials: trials − 1 values in 0.1 s steps, all within
// [min, max], mean exactly `mean`. Skewed toward the minimum, since the paper
// gives a range of 10–25 s with a mean of 14 s.
export function makeIntervals(rand) {
  const { trials, intervalMinSecs: lo, intervalMaxSecs: hi, intervalMeanSecs: mean } = PROTOCOL;
  const n = trials - 1;
  // extra seconds above the minimum, exponential-shaped
  let extra = Array.from({ length: n }, () => -Math.log(1 - rand() * 0.999));
  const target = (mean - lo) * n;
  // scale so the sum hits the target, clamping to the maximum; a few rounds settle it
  for (let k = 0; k < 20; k++) {
    const sum = extra.reduce((a, b) => a + b, 0);
    extra = extra.map(e => Math.min(hi - lo, e * target / sum));
  }
  // round to tenths, then put the rounding remainder on values that have room
  const tenths = extra.map(e => Math.round(e * 10));
  let diff = Math.round(target * 10) - tenths.reduce((a, b) => a + b, 0);
  for (let i = 0; diff !== 0; i = (i + 1) % n) {
    const step = Math.sign(diff);
    const next = tenths[i] + step;
    if (next >= 0 && next <= (hi - lo) * 10) { tenths[i] = next; diff -= step; }
  }
  return tenths.map(t => (lo * 10 + t) / 10);
}

// Small seeded generator for tests and reproducible runs (mulberry32).
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
