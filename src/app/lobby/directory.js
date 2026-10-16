import { FONT } from '../../engine/panel.js';
import { CAP } from '../brand.js';
import { MAIN, PANEL } from './hall.js';

// The building's two kinds of directory, each where the period put it (docs/research/vr/
// 10-floor-directory.md, 1a; a 1979 signage report for a federal hospital: "only one main directory
// (a framed vinyl-covered board with changeable letters)" at the entrance, and at the elevators and
// stairs of each floor frames that "permit directional sign panels to be inserted or removed").
const IN = 0.0254;

// The main directory at the entrance: white changeable letters on black grooved felt in an aluminium
// frame, 20 x 30 in, a heading underlined, floor headings in 1 in letters and the lines under them
// indented in 3/4 in (the Rubberline catalog of about 1965: "Style C, 20" x 30"" with "1", 3/4" and
// 1/2" letters, its sample set out "2ND FLOOR", "3RD FLOOR"; black felt the standard: Nelson-Harkins,
// 1960; its size in hall.js). The felt's grooves on 1/4 in centres (modern catalogs, the period's not found).
const FELT = '#141414', GROOVE = '#1e1e1e', LETTER = '#ecebe4';

// size: a capital's height in inches; ctx's font for it
const font = (m, inches, weight = 700) => `${weight} ${Math.floor(inches * IN * m / CAP)}px ${FONT}`;

// t: { head, sub, floors: [{ floor, lines: [...] }] }
export function writeMainDirectory(panel, t) {
  const { ctx, c } = panel, m = c.width / MAIN.w;   // px a metre
  ctx.fillStyle = FELT;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = GROOVE;
  for (let y = 0; y < c.height; y += 0.25 * IN * m) ctx.fillRect(0, Math.round(y), c.width, Math.max(1, Math.round(0.03 * IN * m)));
  ctx.fillStyle = LETTER;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  let y = 2.2 * IN * m;
  ctx.font = font(m, 1);
  ctx.letterSpacing = `${0.12 * IN * m}px`;
  ctx.fillText(t.head, c.width / 2, y);
  const hw = ctx.measureText(t.head).width;
  ctx.fillRect((c.width - hw) / 2, y + 0.25 * IN * m, hw, 0.12 * IN * m);
  y += 1.9 * IN * m;
  ctx.font = font(m, 0.75);
  ctx.fillText(t.sub, c.width / 2, y);
  ctx.textAlign = 'left';
  ctx.letterSpacing = `${0.05 * IN * m}px`;
  for (const f of t.floors) {
    y += 2.5 * IN * m;
    ctx.font = font(m, 1);
    ctx.fillText(f.floor, 1.5 * IN * m, y);
    ctx.font = font(m, 0.75);
    for (const line of f.lines) { y += 1.5 * IN * m; ctx.fillText(line, 3 * IN * m, y); }
  }
  ctx.letterSpacing = '0px';
  panel.tex.needsUpdate = true;
}

// A floor directory at the elevators: a frame of 2 x 14 in panels, white on blue, flat on the wall,
// one panel a line, an arrow where the way turns (the 1979 report's Appendix F: a 22 x 14 in frame
// of 2 x 14 in panels, "Blue/White"; its letters "Helvetica Medium Point ... capital and lower case":
// the game's face at its medium weight); the frame as tall as its panels (hall.js).
const BLUE = '#1f3a6e', GAP = '#0c1424';

// an arrow pointing left (dir -1) or right (+1), its tip at x, the height of a capital h
function arrow(ctx, x, y, h, dir) {
  const w = h * 1.1, t = h * 0.2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - dir * h * 0.55, y - h / 2);
  ctx.lineTo(x - dir * h * 0.55, y - t / 2);
  ctx.lineTo(x - dir * w, y - t / 2);
  ctx.lineTo(x - dir * w, y + t / 2);
  ctx.lineTo(x - dir * h * 0.55, y + t / 2);
  ctx.lineTo(x - dir * h * 0.55, y + h / 2);
  ctx.closePath();
  ctx.fill();
}

// lines: [{ t, arrow: -1 | 1 | 0 }], the first the floor's name (no arrow); arrow -1: a left arrow
// before the words, +1: a right arrow after them; the words 1 in high, as a 2 in panel holds them,
// smaller only where a line would not fit the panel's width
export function writeFloorDirectory(panel, lines) {
  const { ctx, c } = panel, m = c.width / PANEL.w;
  ctx.fillStyle = GAP;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.textBaseline = 'middle';
  const cap = 1 * IN * m, pad = 0.6 * IN * m;
  lines.forEach(({ t, arrow: dir = 0 }, i) => {
    const top = i * (PANEL.h + PANEL.gap) * m, mid = top + PANEL.h * m / 2;
    ctx.fillStyle = BLUE;
    ctx.fillRect(0, Math.round(top), c.width, Math.round(PANEL.h * m));
    ctx.fillStyle = LETTER;
    ctx.letterSpacing = `${0.05 * IN * m}px`;
    ctx.font = font(m, 1, 500);
    const room = c.width - 2 * pad - (dir ? cap * 1.5 : 0), wide = ctx.measureText(t).width;
    if (wide > room) ctx.font = font(m, room / wide, 500);
    if (dir < 0) { arrow(ctx, pad, mid, cap, -1); ctx.textAlign = 'left'; ctx.fillText(t, pad + cap * 1.5, mid); }
    else if (dir > 0) { arrow(ctx, c.width - pad, mid, cap, 1); ctx.textAlign = 'right'; ctx.fillText(t, c.width - pad - cap * 1.5, mid); }
    else { ctx.textAlign = 'center'; ctx.fillText(t, c.width / 2, mid); }
  });
  ctx.letterSpacing = '0px';
  panel.tex.needsUpdate = true;
}
