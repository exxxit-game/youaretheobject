// Cretenoud et al. (2020), JOV 20(6):4. This trial uses the poor-context ML subset.
export const PROTOCOL = Object.freeze({
  referenceDeg: 15.6, referenceShiftDeg: 0.2, comparisonDownDeg: 2.1, // Appendix p. 14
  startMinDeg: 0, startMaxDeg: 21.5, finDeg: 3.5, // Appendix p. 14
  inwardLeftDeg: 77, inwardRightDeg: 74.5, outwardDeg: 102.2, // p. 14; Fig. 1 p. 4
  practicePerCondition: 1, repetitions: 2 // Procedure p. 3; no deadline
});
// Our display/input choices, NOT constants from the paper. No physical luminance calibration.
export const DISPLAY = Object.freeze({ distance: 1.915, width: 1.7, height: 1.0,
  speedDeg: 5, lineMetres: 0.003, minDeg: 0, maxDeg: 25 });
export const CONDITIONS = Object.freeze(['inward', 'outward']);
