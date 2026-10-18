// Drori et al., JCM 9:1627, Methods 2.6.1 p. 5. No missing staircase defaults.
export const PROTOCOL = Object.freeze({ viewMs: 2000, blankMs: 1000,
  staircasesPerAspect: 4, staircaseCount: 24, trainingMaximum: 26 });
export const ASPECTS = Object.freeze(['grain', 'roll', 'stretch', 'narrow', 'grow', 'shrink']);
// Engineering values for an adjustable viewing preview, not the author's settings.
export const PREVIEW = Object.freeze({ levels: Object.freeze([0.25, 0.5, 1]),
  initialLevel: 1, widthDelta: 0.4, pitchDegrees: 8, heightFraction: 0.12, grainOpacity: 0.45 });
