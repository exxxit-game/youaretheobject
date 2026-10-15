// The studio's mark is built from real things, never drawn by hand (docs/mistakes.md): the
// doorway and the running figure are the official ISO 7010 E001 drawing, point for point, and the
// only shape in the mark; on the poster nothing is drawn over the mark. Checked on what is drawn
// (a canvas that records every call), not on the source text.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

globalThis.AFRAME = { registerComponent() {} };          // board.js pulls in the panel component
globalThis.Path2D = class { constructor(d) { this.d = d; } };
const { E001_PATH, LOGO, drawMark } = await import('../src/app/logo.js');
const { drawPoster } = await import('../src/app/lobby/board.js');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const official = fs.readFileSync(path.join(ROOT, 'docs/art/ISO_7010_E001.svg'), 'utf8').match(/ d="([^"]+)"/)[1];
assert.equal(E001_PATH, official, 'the figure and doorway are the official E001 drawing');

// A 2D context that keeps the transform and records every drawing call in canvas pixels.
function recorder() {
  let m = [1, 0, 0, 1, 0, 0];
  const stack = [], ops = [], state = {};
  const at = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const own = {
    save: () => stack.push(m.slice()),
    restore: () => { m = stack.pop(); },
    translate: (x, y) => { m[4] += m[0] * x + m[2] * y; m[5] += m[1] * x + m[3] * y; },
    scale: (x, y) => { m[0] *= x; m[1] *= x; m[2] *= y; m[3] *= y; }
  };
  const ctx = new Proxy(state, {
    get: (t, k) => own[k] || (k in t ? t[k] : (...args) => ops.push({ op: k, args, fill: t.fillStyle, pts: points(k, args) }))
  });
  function points(op, a) {
    if (op === 'fillRect' || op === 'rect') return [at(a[0], a[1]), at(a[0] + a[2], a[1] + a[3])];
    if (op === 'moveTo' || op === 'lineTo') return [at(a[0], a[1])];
    return [];
  }
  return { ctx, ops };
}

// the mark alone: one green square, then the official shape filled black, nothing else
{
  const { ctx, ops } = recorder();
  drawMark(ctx, 10, 20, 100);
  assert.deepEqual(ops.map(o => o.op), ['fillRect', 'fill'], 'the mark is a square and one shape');
  assert.equal(ops[0].fill, LOGO.green);
  assert.deepEqual(ops[0].pts, [[10, 20], [110, 120]], 'the square fills the mark');
  assert.equal(ops[1].fill, LOGO.black);
  assert.equal(ops[1].args.length, 1, 'the default fill rule, as in the drawing');
  assert.equal(ops[1].args[0].d, official, 'the shape is the official drawing');
}

// the poster: a green sheet, the mark, then only the name's strokes, all below the mark
{
  const { ctx, ops } = recorder();
  const c = { width: 640, height: 905 };
  drawPoster({ ctx, c });
  assert.equal(ops[0].op, 'fillRect');
  assert.equal(ops[0].fill, LOGO.green);
  assert.deepEqual(ops[0].pts, [[0, 0], [640, 905]], 'the whole sheet is the sign\'s green');
  assert.deepEqual(ops.slice(1, 3).map(o => o.op), ['fillRect', 'fill'], 'then the mark');
  const markBottom = ops[1].pts[1][1];
  const rest = ops.slice(3);
  assert.ok(rest.length > 0, 'the name is drawn');
  assert.ok(rest.every(o => ['beginPath', 'moveTo', 'lineTo', 'stroke', 'rect', 'clip'].includes(o.op)), `only strokes after the mark: ${[...new Set(rest.map(o => o.op))]}`);
  assert.ok(rest.every(o => o.pts.every(([, y]) => y >= markBottom)), 'nothing is drawn over the mark');
}
console.log('logo tests: ok');
