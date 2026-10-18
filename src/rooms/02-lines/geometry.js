import { PROTOCOL as P, DISPLAY as D } from './protocol.js';

export const metres = degrees => 2 * D.distance * Math.tan(degrees * Math.PI / 360);
// Planar geometry, Appendix p. 14 and Figure 1 p. 4. Angles measured from vertical.
export function segments(condition, adjustedDeg, fins = true) {
  if (!['inward', 'outward'].includes(condition) || !Number.isFinite(adjustedDeg)
    || adjustedDeg < D.minDeg || adjustedDeg > D.maxDeg) throw new Error('Invalid stimulus');
  const x = -D.width / 4 - metres(P.referenceShiftDeg);
  const h = metres(P.referenceDeg), comparison = metres(adjustedDeg);
  const down = -metres(P.comparisonDownDeg), right = D.width / 4;
  const lines = [{ a: [x, -h / 2], b: [x, h / 2], colour: '#ffff00' },
    { a: [right, down - comparison / 2], b: [right, down + comparison / 2], colour: '#ffff00' }];
  if (fins) for (const end of [-1, 1]) for (const side of [-1, 1]) {
    const angle = condition === 'outward' ? P.outwardDeg : side < 0 ? P.inwardLeftDeg : P.inwardRightDeg;
    const rad = angle * Math.PI / 180, length = metres(P.finDeg), y = end * h / 2;
    lines.push({ a: [x, y], b: [x + side * length * Math.sin(rad), y - end * length * Math.cos(rad)], colour: '#ffffff' });
  }
  return lines;
}

export function drawStimulus(panel, condition, adjustedDeg, fins = true) {
  const { ctx, c } = panel;
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, c.width, c.height);
  const point = ([x, y]) => [c.width * (0.5 + x / D.width), c.height * (0.5 - y / D.height)];
  ctx.lineWidth = D.lineMetres * c.width / D.width; ctx.lineCap = 'butt';
  for (const line of segments(condition, adjustedDeg, fins)) {
    ctx.strokeStyle = line.colour; ctx.beginPath(); ctx.moveTo(...point(line.a)); ctx.lineTo(...point(line.b)); ctx.stroke();
  }
  panel.tex.needsUpdate = true;
}
