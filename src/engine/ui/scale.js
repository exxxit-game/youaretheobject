import { createChoice } from './choice.js';
import { FONT } from '../panel.js';
import { BUTTON, DARK_LIMIT } from './sheet-math.js';

// A 0–max rating scale (max 100 by default), like the paper scales of a questionnaire:
// marked every `step`, three labels (left, middle, right). Point and click on the
// bar to place the mark; "done" confirms. Works with the laser and the mouse.
// colours inside Meta's limits, as the buttons' (sheet-math.js): the bar at the dark limit, the
// mark's amber dimmed to the light limit
const BAR_BG = DARK_LIMIT;
const INK = BUTTON.text;
const SOFT = '#9a968d';
const MARK = '#dab760';
// The wall scale everything is drawn for: a 1.7 m bar, 2048 px wide, labels 54 px high.
const WALL_W = 1.7, WALL_PX = 2048, WALL_LETTER = 54 * WALL_W / WALL_PX;

// parent: the scene or any entity (the sheet); place in the parent's metres:
// { x, y (bar centre), z, w, h (bar height), letter (label height, metres),
//   density (canvas px per metre), done: { w, h, below } for the "done" button }
export function createScale(parent, place) {
  const { x = 0, y, z, w = WALL_W, h = 0.3, letter = WALL_LETTER, density = WALL_PX / WALL_W } = place;
  const doneAt = { w: 0.5, h: 0.11, below: 0.25, ...(place.done || {}) };
  const done = createChoice(parent, { x, y: y - doneAt.below, z, w: doneAt.w, h: doneAt.h, density: place.density });
  // every size below was drawn for the wall scale; k keeps the same real size elsewhere
  const px = Math.round(w * density);
  const k = (letter / WALL_LETTER) * (px / w) / (WALL_PX / WALL_W);
  let bar = null;

  function draw(labels, step, value, unit, max = 100) {
    const panel = bar && bar.components.panel;
    if (!panel || !panel.c) return; // not drawn yet (see choice.js)
    const { ctx, c } = panel;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BAR_BG;
    ctx.fillRect(0, 0, W, H);
    const left = W * 0.05, right = W * 0.95, lineY = H * 0.4;
    const xOf = (v) => left + (right - left) * v / max;
    ctx.strokeStyle = SOFT;
    ctx.lineWidth = 3 * k;
    ctx.beginPath(); ctx.moveTo(left, lineY); ctx.lineTo(right, lineY); ctx.stroke();
    ctx.fillStyle = SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const every = max / 10; // a number under every tenth of the scale
    for (let v = 0; v <= max; v += step) {
      const big = v % (max / 2) === 0;
      ctx.fillRect(xOf(v) - 1.5 * k, lineY - (big ? 22 : 12) * k, 3 * k, (big ? 44 : 24) * k);
      if (v % every === 0) { ctx.font = `500 ${44 * k}px ${FONT}`; ctx.fillText(String(v), xOf(v), lineY + 26 * k); }
    }
    ctx.fillStyle = INK;
    ctx.font = `600 ${54 * k}px ${FONT}`;
    [[0, 'left'], [max / 2, 'center'], [max, 'right']].forEach(([v, align], i) => {
      if (!labels[i]) return;
      ctx.textAlign = align;
      ctx.fillText(labels[i], align === 'left' ? left : align === 'right' ? right : xOf(max / 2), H * 0.05);
    });
    if (value != null) {
      ctx.fillStyle = MARK;
      ctx.beginPath(); ctx.arc(xOf(value), lineY, 16 * k, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'center';
      ctx.font = `700 ${64 * k}px ${FONT}`;
      ctx.fillText(value + (unit || ''), xOf(value), H * 0.74);
    }
    panel.tex.needsUpdate = true;
  }

  function hide() {
    done.hide();
    if (bar) { bar.remove(); bar = null; }
  }

  // opt: { labels: [left, middle, right], step, max (default 100), unit, doneLabel }. onDone(value) once.
  // Without onDone the scale is only shown, not answered (to explain it first).
  // top (optional): the top edge of the bar, to start below a question.
  function show(opt, onDone, top) {
    hide();
    const yc = top == null ? y : top - h / 2;
    let value = null;
    bar = document.createElement('a-entity');
    bar.setAttribute('panel', `w: ${w}; h: ${h}; px: ${px}`);
    bar.setAttribute('position', `${x} ${yc} ${z}`);
    const max = opt.max || 100;
    bar.addEventListener('loaded', () => draw(opt.labels, opt.step, value, opt.unit, max));
    parent.appendChild(bar);
    if (!onDone) return;
    bar.classList.add('clickable', 'scale-bar');
    bar.addEventListener('click', (e) => {
      const point = e.detail && e.detail.intersection && e.detail.intersection.point;
      if (!point) return;
      const local = bar.object3D.worldToLocal(point.clone());
      // the drawn line runs from 5% to 95% of the bar width
      const frac = (local.x / w + 0.5 - 0.05) / 0.9;
      value = Math.max(0, Math.min(max, Math.round(frac * max / opt.step) * opt.step));
      draw(opt.labels, opt.step, value, opt.unit, max);
      done.show([opt.doneLabel], () => { const v = value; hide(); onDone(v); }, yc - doneAt.below + doneAt.h / 2);
    });
  }

  return { show, hide };
}
