import { FONT } from '../../engine/panel.js';
import { BRAND, SIGN } from '../brand.js';

// The stairs' sign on their door (brand.js, NIU Type E): the stair symbol of the US Department of
// Transportation / AIGA set (1979, public domain; outline from Wikimedia Commons "Aiga stairs.svg",
// 443 × 367) 4 1/2 in high and centred, 1 in below the top, the word 3/4 in under it.
const SYMBOL = new Path2D('M 5.1155202,326.51723 L 82.86552,325.88694 C 82.86552,325.88694 83.24999,246.82981 83.68248,246.14887 L 162.36552,244.38694 L 163.36552,163.38694 C 163.36552,163.38694 241.60948,162.5144 242.52739,161.7526 C 243.60279,160.8601 244.04256,83.032984 245.44731,82.493934 L 323.86552,81.886944 L 323.86552,1.8869444 L 442.86552,1.8869444 C 442.86552,1.8869444 442.65456,42.753914 441.28373,43.279954 L 363.88847,43.886944 L 363.36552,123.38694 L 284.36552,124.38694 L 283.36552,204.38694 L 204.36552,205.38694 L 203.36552,285.38694 L 123.36552,286.38694 L 122.84309,367.88694 L 2.8655202,367.88694 C 2.8655202,367.88694 2.8755002,327.11753 5.1155202,326.51723 z');
const IN = 0.0254;

export function writeStairsSign(panel, word) {
  const { ctx, c } = panel;
  const m = c.width / SIGN.w;   // px a metre
  panel.write([], { bg: BRAND.plate });
  const s = 4.5 * IN * m / 367;
  ctx.save();
  ctx.translate((c.width - 443 * s) / 2, IN * m);
  ctx.scale(s, s);
  ctx.fillStyle = BRAND.accent;
  ctx.fill(SYMBOL);
  ctx.restore();
  ctx.font = `700 ${SIGN.letters}px ${FONT}`;
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = BRAND.accent;
  ctx.fillText(word, c.width / 2, 7.4 * IN * m);
  ctx.letterSpacing = '0px';
  panel.tex.needsUpdate = true;
}
