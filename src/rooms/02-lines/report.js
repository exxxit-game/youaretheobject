import { CONDITIONS, PROTOCOL as P, DISPLAY } from './protocol.js';
import { metres } from './geometry.js';

// p. 3: average both adjustments, subtract reference, divide by reference.
export function analyse(log) {
  if (!Array.isArray(log)) throw new Error('Missing adjustments');
  for (const row of log) {
    if (!CONDITIONS.includes(row.condition) || typeof row.practice !== 'boolean'
      || !Number.isFinite(row.adjustedDeg) || row.adjustedDeg < DISPLAY.minDeg || row.adjustedDeg > DISPLAY.maxDeg
      || !Number.isFinite(row.activeMs) || row.activeMs < 0) throw new Error('Invalid adjustment');
  }
  const measured = log.filter(row => !row.practice);
  if (measured.length !== CONDITIONS.length * P.repetitions) throw new Error('Incomplete trial');
  return CONDITIONS.map(condition => {
    const rows = measured.filter(row => row.condition === condition);
    if (rows.length !== P.repetitions) throw new Error('Unbalanced trial');
    const meanMetres = rows.reduce((n, row) => n + metres(row.adjustedDeg), 0) / rows.length;
    const meanDeg = 360 / Math.PI * Math.atan(meanMetres / (2 * DISPLAY.distance));
    const reference = metres(P.referenceDeg);
    return { condition, meanDeg, meanMetres, bias: (meanMetres - reference) / reference,
      limited: rows.some(row => row.adjustedDeg === DISPLAY.minDeg || row.adjustedDeg === DISPLAY.maxDeg),
      activeMs: rows.reduce((n, row) => n + row.activeMs, 0) };
  });
}
