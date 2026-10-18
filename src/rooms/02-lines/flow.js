import { makeSchedule } from './schedule.js';
import { DISPLAY as D } from './protocol.js';
import { analyse } from './report.js';

// Synchronous state changes: no old speech/timer promise can advance a new run.
export function createTrial(random = Math.random) {
  let state = 'idle', schedule = [], index = 0, value = 0, activeMs = 0, log = [], held = false, feedback = null, generation = 0;
  const current = () => schedule[index];
  const beginAdjustment = () => { value = current().startDeg; activeMs = 0; state = 'adjust'; };
  return {
    get state() { return state; }, get current() { return current(); }, get value() { return value; },
    get index() { return index; }, get held() { return held; }, get log() { return log.map(r => ({ ...r })); },
    get feedback() { return feedback; },
    get generation() { return generation; },
    begin() { generation++; schedule = makeSchedule(random); index = 0; log = []; held = false; feedback = null; state = 'intro'; },
    next() {
      if (held) return false;
      if (state === 'intro') state = 'instructions';
      else if (state === 'instructions') state = 'practice';
      else if (state === 'practice' || state === 'interrupted') beginAdjustment();
      else return false;
      return true;
    },
    adjust(n) {
      if (held || state !== 'adjust' || !Number.isFinite(n)) return false;
      value = Math.min(D.maxDeg, Math.max(D.minDeg, n)); return true;
    },
    tick(ms) { if (!held && state === 'adjust' && Number.isFinite(ms) && ms > 0) activeMs += ms; },
    confirm(expectedIndex, expectedGeneration) {
      if (held || state !== 'adjust' || expectedIndex !== index || expectedGeneration !== generation) return false;
      log.push({ ...current(), adjustedDeg: value, activeMs }); index++;
      if (index === 2) state = 'ready';
      else if (index === schedule.length) state = 'feedback';
      else beginAdjustment();
      return true;
    },
    measure() { if (held || state !== 'ready') return false; beginAdjustment(); return true; },
    repeatPractice() {
      if (held || state !== 'ready') return false;
      generation++; schedule = makeSchedule(random); index = 0; log = []; state = 'practice'; return true;
    },
    answer(n) {
      if (held || state !== 'feedback' || !Number.isInteger(n) || n < 0 || n > 3) return false;
      feedback = n; state = 'done'; return true;
    },
    pause(on) {
      if (held === on) return false;
      held = on;
      if (on) generation++;
      if (on && state === 'adjust') { value = current().startDeg; activeMs = 0; state = 'interrupted'; }
      return true;
    },
    report() { return state === 'done' ? analyse(log) : null; },
    leave() { generation++; state = 'idle'; log = []; held = false; }
  };
}
