import { ASPECTS, PREVIEW as P } from './protocol.js';

export function effectTransform(aspect, strength, height) {
  if (!ASPECTS.includes(aspect) || !Number.isFinite(strength) || strength < 0 || strength > 1 ||
      !Number.isFinite(height) || height <= 0) throw new Error('Invalid preview transform');
  const value = { scaleX: 1, pitch: 0, offsetY: 0, grain: 0 };
  if (aspect === 'stretch') value.scaleX += P.widthDelta * strength;
  if (aspect === 'narrow') value.scaleX -= P.widthDelta * strength;
  // Supplement p. 1: negative Unity local X rotation; Z reflection reverses its sign in three.js.
  if (aspect === 'roll') value.pitch = P.pitchDegrees * strength * Math.PI / 180;
  // Move the environment instead of overwriting the tracked head pose.
  if (aspect === 'grow') value.offsetY = -height * P.heightFraction * strength;
  if (aspect === 'shrink') value.offsetY = height * P.heightFraction * strength;
  if (aspect === 'grain') value.grain = P.grainOpacity * strength;
  return Object.freeze(value);
}
