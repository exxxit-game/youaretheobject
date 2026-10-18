// A rendered phase starts its clock only after its presentation is acknowledged.
// A delayed frame never consumes the next phase's exposure time.
export function createPairedView({ viewMs, blankMs }, clock = () => performance.now()) {
  if (![viewMs, blankMs].every(n => Number.isFinite(n) && n > 0)) {
    throw new Error('Paired views require explicit positive exposure durations');
  }
  let state = 'idle', token = 0, held = false, onset = null, last = null;
  let sample = null, phases = [], result = null;
  const active = () => ['first', 'blank', 'second', 'answer'].includes(state);
  const advance = next => { state = next; token++; onset = null; };
  const time = () => {
    const now = clock();
    if (!Number.isFinite(now) || (last !== null && now < last)) {
      throw new Error('Paired views require a finite monotonic clock');
    }
    last = now; return now;
  };
  const clear = () => { sample = null; phases = []; result = null; onset = null; };
  return {
    get state() { return state; },
    get token() { return token; },
    get held() { return held; },
    get current() { return sample ? { ...sample } : null; },
    get result() { return result ? { ...result, phases: result.phases.map(p => ({ ...p })) } : null; },
    begin(trial) {
      if (held || active()) return false;
      if (!trial || typeof trial.id !== 'string' || !trial.id ||
          !['first', 'second'].includes(trial.alteredView)) {
        throw new Error('A pair requires an explicit identity and altered-view order');
      }
      clear(); sample = Object.freeze({ id: trial.id, alteredView: trial.alteredView });
      advance('first'); return true;
    },
    present(expectedToken) {
      if (held || !active() || expectedToken !== token || onset !== null) return false;
      onset = time(); return true;
    },
    tick() {
      if (held || !active() || onset === null || state === 'answer') return false;
      const now = time(), duration = state === 'blank' ? blankMs : viewMs;
      if (now - onset < duration) return false;
      phases.push({ phase: state, onset, end: now });
      advance({ first: 'blank', blank: 'second', second: 'answer' }[state]);
      return true;
    },
    answer(value, expectedToken) {
      if (held || state !== 'answer' || onset === null || expectedToken !== token ||
          !['same', 'different'].includes(value)) return false;
      result = { ...sample, answer: value, responseMs: time() - onset,
        phases: phases.map(p => ({ ...p })) };
      advance('done'); return true;
    },
    hold(on) {
      if (typeof on !== 'boolean') throw new Error('Hold must be boolean');
      if (held === on) return false;
      held = on;
      if (on && active()) { clear(); advance('interrupted'); }
      return true;
    },
    leave() { clear(); held = false; advance('idle'); }
  };
}
