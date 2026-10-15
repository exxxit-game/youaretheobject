import { createChoice } from './choice.js';
import { MIN_LETTER, PAPER, PAPER_BG, INK, INK_SOFT, letterFrom, PAPER_DENSITY } from './sheet-math.js';
import { FONT } from '../panel.js';
import './ink.js';

// The page of the clipboard (sheet.js): its text in roles, the answer buttons under it, and on a
// form a field over every blank (a run of underscores) to write in by hand (ink.js). Text never
// shrinks to fit: a page that does not fit sets data-overflow, which the smoke test treats as an
// error (split the text into pages instead). Reading comes first: no role is smaller than
// MIN_LETTER (sheet-math.js), and the smoke test fails a page drawn smaller (data-letter-mm). The
// page is a large-print document (docs/decisions.md): what is printed on it, a seal included, is
// sized from that letter, never from the paper.
export { PAPER, PAPER_BG };
export const DENSITY = PAPER_DENSITY;   // canvas px per metre: as sharp as the display from 1 m (sheet-math.js)
export const MARGIN = 0.04;
export const UNDER_TEXT = 0.03;
const BUTTON_H = 0.07;            // about 4 degrees at 1 m (Meta: targets at least 2.5)
const GAP = 0.025;
// Text roles: font size in metres at 1 m and ink, in the game's sans (FONT: a sans with a high
// x-height, as Meta asks for text in VR). A line given `from` (metres) is read from there, not from
// the hand: a page on its hook, read from where the player stands; it grows to the smallest
// letter's angle from that distance (letterFrom).
const ROLES = {
  title: { m: 0.044, color: INK, weight: 700 },
  body: { m: 0.028, color: INK, weight: 500 },
  soft: { m: MIN_LETTER, color: INK_SOFT, weight: 500 }
};
// A field to write in: the blank's width, from a letter's height above its line (people write
// above the line) to a third of one below it.
const FIELD = { above: 1.0, below: 0.35, side: 0.3 };
// A stamp's ink: violet, one of the standard stamp-pad inks (Trodat's range; stamp makers' common
// colours); its shade, strength and the hand's slight turn as in the approved picture of its place
// (docs/rooms/corridor-shots/seal-place.png, the right one, B); laid over the paper as ink is.
const STAMP = { ink: [92, 60, 150], alpha: 0.82, turn: -0.12 };

// el: the sheet entity; paperEl: its paper (a panel)
export function createPage(el, paperEl) {
  const paper = () => paperEl.components.panel;
  const choice = createChoice(el, {
    x: 0, y: 0, z: 0.005, w: PAPER.w - 2 * MARGIN, h: BUTTON_H, gap: GAP,
    bottom: -PAPER.h / 2 + MARGIN, density: DENSITY, letter: ROLES.body.m
  });
  let fields = [];
  const pressedInk = new WeakMap();   // a stamp's drawing turned to ink, made once

  // blocks: [{ t, role: 'title' | 'body' | 'soft', gap, from }]; returns the local y of the text's
  // bottom edge (the sheet's centre is 0).
  function paint(blocks) {
    const panel = paper();
    const bottom = panel.write(blocks.map((b, i) => {
      const r = ROLES[b.role || 'body'];
      return { t: b.t, size: letterFrom(r.m, b.from) * DENSITY, color: r.color, weight: r.weight,
        gap: (b.gap ?? (i ? 0.012 : 0)) * DENSITY };
    }), { top: true, fit: false, align: 'left', pad: MARGIN * DENSITY, bg: PAPER_BG });
    el.dataset.letterMm = (panel.smallest / DENSITY * 1000).toFixed(1);   // as drawn
    // the smallest of the lines read from afar, for the smoke test's check from the player's eyes
    const far = blocks.filter((b) => b.from).map((b) => letterFrom(ROLES[b.role || 'body'].m, b.from));
    if (far.length) el.dataset.farLetterMm = (Math.min(...far) * 1000).toFixed(1); else delete el.dataset.farLetterMm;
    const textBottom = PAPER.h / 2 - bottom;
    el.dataset.textBottom = textBottom.toFixed(3);
    if (panel.overflow) el.dataset.overflow = '1'; else delete el.dataset.overflow;
    if (panel.orphan) el.dataset.orphan = '1'; else delete el.dataset.orphan;
    return textBottom;
  }

  // The fields over the page's blanks, made once for a form and kept while it is shown (its ink
  // stays when the page is drawn again, or after a question cut in).
  function showFields() {
    if (!fields.length) {
      const W = paper().c.width, H = paper().c.height;
      fields = paper().blanks.map((b) => {
        const x0 = b.x0 - FIELD.side * b.size, x1 = b.x1 + FIELD.side * b.size;
        const y0 = b.y - FIELD.above * b.size, y1 = b.y + b.size + FIELD.below * b.size;
        const f = document.createElement('a-entity');
        f.classList.add('clickable', 'ink-field');
        f.setAttribute('ink', `w: ${((x1 - x0) / DENSITY).toFixed(4)}; h: ${((y1 - y0) / DENSITY).toFixed(4)}; px: ${DENSITY}`);
        f.setAttribute('position', `${(((x0 + x1) / 2 - W / 2) / DENSITY).toFixed(4)} ${((H / 2 - (y0 + y1) / 2) / DENSITY).toFixed(4)} 0.002`);
        el.appendChild(f);
        return f;
      });
    }
    for (const f of fields) { f.setAttribute('visible', true); f.classList.add('clickable'); }
    return fields;
  }
  function hideFields() {
    for (const f of fields) { f.components.ink?.up(); f.setAttribute('visible', false); f.classList.remove('clickable'); }
  }
  function dropFields() { fields.forEach((f) => f.remove()); fields = []; }

  // A form's place for the seal (an office seal goes by the signature, on a free place, never over
  // the hand signature: GOST R 7.0.97-2025, 5.24): a square of stamp.size from top down, its mark
  // printed in the middle; once the form is signed (pressed) the seal is pressed over it, a little
  // turned, as a hand stamps. stamp: { size (m), mark, draw(ctx, r) }: draw paints the seal in
  // black, outer radius r, ctx at its centre, and returns the font size of its smallest letter.
  function stampPlace(top, stamp, pressed) {
    const panel = paper(), g = panel.ctx, soft = ROLES.soft;
    const cx = panel.c.width / 2, cy = (PAPER.h / 2 - top + stamp.size / 2) * DENSITY;
    g.save();
    g.font = `${soft.weight} ${soft.m * DENSITY}px ${FONT}`;
    g.fillStyle = soft.color; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(stamp.mark, cx, cy);
    if (pressed) {
      const ink = inkOf(stamp);
      g.translate(cx, cy); g.rotate(STAMP.turn); g.globalCompositeOperation = 'multiply';
      g.drawImage(ink, -ink.width / 2, -ink.height / 2);
    }
    g.restore();
    panel.tex.needsUpdate = true;
    el.dataset.stampLetterMm = (inkOf(stamp).letter / DENSITY * 1000).toFixed(1);
    el.dataset.stampTop = top.toFixed(3);
    if (pressed) el.dataset.stamped = '1'; else delete el.dataset.stamped;
  }

  // the seal drawn in black on white, its black turned to stamp ink and its white to clear paper;
  // the canvas leaves room round the radius for the outer ring's stroke
  function inkOf(stamp) {
    if (pressedInk.has(stamp)) return pressedInk.get(stamp);
    const d = Math.round(stamp.size * DENSITY), n = Math.ceil(d * 1.06), c = document.createElement('canvas');
    c.width = c.height = n;
    const s = c.getContext('2d');
    s.fillStyle = '#fff'; s.fillRect(0, 0, n, n);
    s.translate(n / 2, n / 2);
    c.letter = stamp.draw(s, d / 2);
    const im = s.getImageData(0, 0, n, n), px = im.data, [r, gr, b] = STAMP.ink;
    for (let i = 0; i < px.length; i += 4) {
      const a = 1 - px[i] / 255;
      px[i] = r; px[i + 1] = gr; px[i + 2] = b; px[i + 3] = 255 * a * STAMP.alpha;
    }
    s.putImageData(im, 0, 0);
    pressedInk.set(stamp, c);
    return c;
  }
  function clearStamp() { for (const k of ['stampLetterMm', 'stampTop', 'stamped']) delete el.dataset[k]; }

  // Draws a page: the text, on a form its fields and its seal's place (stamp; pressed once signed),
  // then the buttons (labels, onPick), or a note where they will be. Returns the top edge of the
  // buttons.
  function show({ blocks, labels = null, onPick = null, form = false, note = null, stamp = null, pressed = false }) {
    blocks = blocks || [];
    let top = paint(blocks) - UNDER_TEXT;
    if (stamp) {
      // the note waits under the seal's place, where the button will be
      if (note) paint([...blocks, { t: note, role: 'soft', gap: stamp.size + 2 * UNDER_TEXT }]);
      stampPlace(top, stamp, pressed);
      top -= stamp.size + UNDER_TEXT;
      if (top < -PAPER.h / 2 + MARGIN) el.dataset.overflow = '1';
    } else {
      clearStamp();
      if (note) top = paint([...blocks, { t: note, role: 'soft', gap: UNDER_TEXT }]) - UNDER_TEXT;
    }
    if (labels) {
      if (choice.show(labels, onPick, top) < -PAPER.h / 2 + MARGIN - 1e-6) el.dataset.overflow = '1';
    } else choice.hide();
    if (form) showFields(); else hideFields();
    return top;
  }

  return { paint, show, choice, fields: () => fields, hideFields, dropFields };
}
