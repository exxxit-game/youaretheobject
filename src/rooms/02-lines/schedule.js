import { CONDITIONS, PROTOCOL as P } from './protocol.js';

export function makeSchedule(random = Math.random) {
  const draw = () => {
    const n = random();
    if (!Number.isFinite(n) || n < 0 || n >= 1) throw new Error('Invalid random draw');
    return n;
  };
  const block = (practice) => {
    const conditions = [...CONDITIONS];
    if (draw() < 0.5) conditions.reverse();
    return conditions.map(condition => ({ condition, practice,
      startDeg: P.startMinDeg + draw() * (P.startMaxDeg - P.startMinDeg) }));
  };
  return [...block(true), ...Array.from({ length: P.repetitions }, () => block(false)).flat()];
}
