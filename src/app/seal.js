// The lab's seal: its name round the ring, two stars at the foot (the bite of the snake), and in the
// middle its sign, a snake wound round a globe, the snake's head raised over the globe's top. Engraved
// manner: outlines, a lattice of diamond scales, shadow in fine strokes. The head and the forked
// tongue follow the plate "Lachesis" engraved by Heath (Wellcome Collection V0021239, public domain).
// Drawn with canvas paths in one ink, so it can be printed or stamped in any colour. Its
// proportions are those of the approved drawing (docs/rooms/corridor-shots/seal.png); the outer
// ring's stroke reaches 2% past the radius.
// Letters on the ring are RING_LETTER of the seal's radius: a seal shown to be read is drawn at
// sealRadius(the smallest letter that reads), never smaller (text inside a picture keeps the body
// text's size: UKAAF G003, Creating clear print and large print documents, 2012, p. 15).
export const RING_LETTER = 0.115;
export const sealRadius = (letter) => letter / RING_LETTER;
// The ring's face: Oswald, a bold sans fit for a stamp (thin serifs do not print; docs/decisions.md);
// declared in css/fonts.css and waited for before a room starts (src/main.js)
const FACE = '600';
const FAMILY = 'Oswald, "Arial Narrow", sans-serif';
const LIGHT = [-Math.SQRT1_2, -Math.SQRT1_2];               // towards the light: upper left, as the globe is lit

const RING = { at: 0.835, span: 1.52 * Math.PI };          // the name's middle line and its arc
const GLOBE = { r: 0.43, tilt: 0.3 };
const COIL = { n: 360, turns: 1.3, lift: 1.06, lon: 2.5, lat0: -0.78, lat1: 1.42 };
const NECK = [[-0.346, -0.225], [-0.48, -0.45], [-0.3, -0.63], [-0.11, -0.565]];   // its centre line, in R
const HEAD = 0.2;                                           // the head's length, in R

// ctx is translated to the seal's centre; R its outer radius. ring: the name round it. Returns
// the font size of the ring's letters as drawn, in ctx units.
export function drawSeal(ctx, R, { ring, ink, paper }) {
  const g = ctx, r = R * GLOBE.r, w = R * 0.011;
  g.save();
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = ink; g.fillStyle = ink;
  drawRings(g, R, ring);
  const coil = coilPoints(r);
  drawCoil(g, coil, false, r, w, ink, paper);   // the coil's far side, behind the globe
  drawNeck(g, R, w, ink, paper);                // rises from behind the globe
  drawGlobe(g, r, w, ink, paper);
  drawCoil(g, coil, true, r, w, ink, paper);
  g.restore();
  return R * RING_LETTER;
}

function drawRings(g, R, ring) {
  for (const [at, line] of [[1, 0.04], [0.93, 0.012], [0.74, 0.016]]) {
    g.lineWidth = R * line; g.beginPath(); g.arc(0, 0, R * at, 0, 7); g.stroke();
  }
  g.font = `${FACE} ${R * RING_LETTER}px ${FAMILY}`; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  // set as text along a line is set (SVG textPath): each letter starts where the face's advances and
  // kerning put it, the arc's spare length shared out evenly as letter spacing, centred at the top;
  // the capitals centred on the ring's middle line (CSS Inline 3: centre text visually between the
  // cap height and the alphabetic baseline)
  g.fontKerning = 'normal';
  const letters = [...ring], rad = R * RING.at, room = RING.span * rad;
  const at = letters.map((_, i) => g.measureText(letters.slice(0, i).join('')).width).concat(g.measureText(ring).width);
  const spare = (room - at[letters.length]) / letters.length, base = rad - g.measureText('H').actualBoundingBoxAscent / 2;
  letters.forEach((ch, i) => {
    // its midpoint: where the line has reached after it (kerning included) less half its own width
    const mid = -room / 2 + at[i + 1] - g.measureText(ch).width / 2 + spare * (i + 0.5);
    g.save(); g.rotate(mid / rad); g.fillText(ch, 0, -base); g.restore();
  });
  for (const a of [Math.PI - 0.16, Math.PI + 0.16]) {
    g.save(); g.rotate(a); g.translate(0, -R * RING.at); g.beginPath();
    for (let k = 0; k < 10; k++) { const s = k % 2 ? R * 0.022 : R * 0.05, b = k * Math.PI / 5; g.lineTo(Math.sin(b) * s, -Math.cos(b) * s); }
    g.closePath(); g.fill(); g.restore();
  }
}

// The globe: hatched on its shadow side, its graticule seen from a little above.
function drawGlobe(g, r, w, ink, paper) {
  g.fillStyle = paper; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip();
  g.strokeStyle = ink; g.lineWidth = w * 0.5;
  for (let k = -r * 2.2; k < r * 2.2; k += r * 0.045) { g.beginPath(); g.moveTo(k - r * 1.2, -r * 1.2); g.lineTo(k + r * 1.2, r * 1.2); g.stroke(); }
  g.fillStyle = paper; g.beginPath(); g.arc(-r * 0.2, -r * 0.18, r, 0, 7); g.fill();   // the lit side stays clean
  g.restore();
  g.strokeStyle = ink; g.lineWidth = w * 1.6; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  g.lineWidth = w * 0.7;
  for (const f of [0.3, 0.62, 0.88]) { g.beginPath(); g.ellipse(0, 0, r * f, r, 0, 0, 7); g.stroke(); }
  g.beginPath(); g.moveTo(0, -r); g.lineTo(0, r); g.stroke();
  for (const lat of [-0.9, -0.5, 0, 0.5, 0.9]) {
    const y = -r * Math.sin(lat) * Math.cos(GLOBE.tilt), half = r * Math.cos(lat);
    g.beginPath(); g.ellipse(0, y, half, half * Math.sin(GLOBE.tilt), 0, 0, Math.PI); g.stroke();
  }
}

// The coil: a helix just off the globe, thickest in the middle, a point at the tail. z > 0 faces us.
function coilPoints(r) {
  const { n, turns, lift, lon, lat0, lat1 } = COIL, rr = r * lift, t0 = GLOBE.tilt, pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = t * turns * 2 * Math.PI + lon, lat = lat0 + lat1 * t;
    const x = rr * Math.cos(lat) * Math.sin(a), y = -rr * Math.sin(lat), z = rr * Math.cos(lat) * Math.cos(a);
    const swell = Math.max(0, Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.92 + 0.1));
    const neck = t > 0.9 ? 1 - (t - 0.9) * 3.2 : 1;
    pts.push({ x, y: y * Math.cos(t0) - z * Math.sin(t0), z: y * Math.sin(t0) + z * Math.cos(t0), w: r * (0.012 + 0.2 * swell * neck) });
  }
  return withNormals(pts);
}

function withNormals(pts) {
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    p.nx = -dy / l; p.ny = dx / l; p.tx = dx / l; p.ty = dy / l;
  });
  return pts;
}

// A side of a band: point i moved s half-widths off its centre line.
const edge = (pts, i, s) => [pts[i].x + s * pts[i].nx * pts[i].w / 2, pts[i].y + s * pts[i].ny * pts[i].w / 2];
const trace = (g, ps) => ps.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)));

// A stretch of body: paper inside, diamond scales across it, the shadow strokes on one side
// (shade: true on the side turned from the light, false for none), then its two outlines.
function drawBand(g, pts, idx, { w, ink, paper, thin, shade, shadeStep }) {
  const L = idx.map((i) => edge(pts, i, 1)), Rr = idx.map((i) => edge(pts, i, -1));
  const shape = () => { g.beginPath(); trace(g, L); for (let k = Rr.length - 1; k >= 0; k--) g.lineTo(...Rr[k]); g.closePath(); };
  g.fillStyle = paper; shape(); g.fill();
  g.save(); shape(); g.clip();
  g.strokeStyle = ink; g.lineWidth = w * 0.45;
  // the lattice is laid along the whole body (every fifth point of it), each stretch drawing every
  // diamond that reaches into it, so where the coil passes behind the globe and comes out again its
  // diamonds run on unbroken
  const first = idx[0], last = idx[idx.length - 1];
  for (let i = Math.ceil((first - 5) / 5) * 5; i <= last; i += 5) {
    const a = Math.max(0, i), b = Math.min(pts.length - 1, i + 5);
    if (pts[a].w < thin || a === b) continue;
    g.beginPath();
    g.moveTo(...edge(pts, a, 0.95)); g.lineTo(...edge(pts, b, -0.95));
    g.moveTo(...edge(pts, a, -0.95)); g.lineTo(...edge(pts, b, 0.95));
    g.stroke();
  }
  // the shadow on the side turned from the light, which falls from the upper left as on the globe;
  // the side is judged over a short stretch, so it does not flicker from edge to edge where the body
  // turns side-on to the light
  g.lineWidth = w * 0.5;
  const lit = (k) => { let sum = 0; for (let m = Math.max(0, k - 6); m <= Math.min(idx.length - 1, k + 6); m++) sum += pts[idx[m]].nx * LIGHT[0] + pts[idx[m]].ny * LIGHT[1]; return sum; };
  for (let k = 0; shade && k < idx.length; k += shadeStep) {
    const i = idx[k];
    if (pts[i].w < thin) continue;
    const away = lit(k) > 0 ? -1 : 1;
    g.beginPath(); g.moveTo(...edge(pts, i, away)); g.lineTo(...edge(pts, i, away * 0.55)); g.stroke();
  }
  g.restore();
  g.strokeStyle = ink; g.lineWidth = w * 1.4;
  for (const side of [L, Rr]) { g.beginPath(); trace(g, side); g.stroke(); }
}

// The coil's runs on one side of the globe (front: facing us), each with the point before and after.
function drawCoil(g, pts, front, r, w, ink, paper) {
  let run = null;
  const runs = [];
  pts.forEach((p, i) => {
    if ((p.z >= 0) === front) { if (!run) { run = i ? [i - 1] : []; runs.push(run); } run.push(i); }
    else if (run) { run.push(i); run = null; }
  });
  for (const idx of runs) drawBand(g, pts, idx, { w, ink, paper, thin: r * 0.03, shade: front, shadeStep: 2 });
}

// The neck rising from behind the globe, and the head at its end.
function drawNeck(g, R, w, ink, paper) {
  const m = 80, pts = [];
  for (let i = 0; i <= m; i++) {
    const t = i / m, s = 1 - t;
    const [x, y] = [0, 1].map((k) => s * s * s * NECK[0][k] + 3 * s * s * t * NECK[1][k] + 3 * s * t * t * NECK[2][k] + t * t * t * NECK[3][k]);
    pts.push({ x: x * R, y: y * R, w: R * (0.085 - 0.03 * t) });
  }
  withNormals(pts);
  drawBand(g, pts, pts.map((_, i) => i), { w, ink, paper, thin: 0, shade: true, shadeStep: 2 });
  drawHead(g, pts[m], R, w, ink, paper);
}

// The head in profile, after Heath: u along it from the neck (0) to the snout (1), v across it,
// negative toward the crown; in head lengths.
function drawHead(g, end, R, w, ink, paper) {
  const L = R * HEAD, dir = [end.tx, end.ty], nrm = [-dir[1], dir[0]], turn = Math.atan2(dir[1], dir[0]);
  const bx = end.x - dir[0] * R * 0.01, by = end.y - dir[1] * R * 0.01;
  const H = (u, v) => [bx + dir[0] * u * L + nrm[0] * v * L, by + dir[1] * u * L + nrm[1] * v * L];
  // a smooth line through points: straight ends, curves through midpoints
  const smooth = (uv) => {
    const p = uv.map(([u, v]) => H(u, v));
    g.beginPath(); g.moveTo(...p[0]);
    for (let i = 1; i < p.length - 1; i++) g.quadraticCurveTo(...p[i], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
    g.lineTo(...p[p.length - 1]);
  };
  const outline = [[0, -0.14], [0, -0.14], [0.2, -0.24], [0.45, -0.27], [0.62, -0.25], [0.8, -0.2], [0.93, -0.13], [1, -0.06],
    [1, -0.02], [0.97, 0.04], [0.8, 0.09], [0.55, 0.15], [0.3, 0.22], [0.12, 0.2], [0, 0.13], [0, -0.14]];
  drawTongue(g, H, w, ink);
  g.fillStyle = paper; smooth(outline); g.fill();
  g.save(); smooth(outline); g.clip(); g.strokeStyle = ink; g.lineWidth = w * 0.4;
  // long oval scales in rows along the head, as Heath cuts them, their closed edge toward the neck as
  // tiles overlap, staggered row to row, above the mouth
  // and none over the eye, which must read
  const eyeAt = H(0.68, -0.1);
  for (let row = 0, v = -0.22; v < 0; v += 0.085, row++) {
    for (let u = 0.08 + (row % 2) * 0.055; u < 0.88; u += 0.11) {
      const c = H(u, v);
      if (Math.hypot(c[0] - eyeAt[0], c[1] - eyeAt[1]) < L * 0.14) continue;
      g.beginPath(); g.ellipse(c[0], c[1], L * 0.055, L * 0.032, turn, Math.PI - 1.4, Math.PI + 1.4); g.stroke();
    }
  }
  g.lineWidth = w * 0.5;
  for (let u = 0.02; u < 0.9; u += 0.035) { g.beginPath(); g.moveTo(...H(u, 0.24)); g.lineTo(...H(u, 0.1)); g.stroke(); }   // under the jaw
  g.restore();
  g.lineWidth = w * 1.4; g.strokeStyle = ink; smooth(outline); g.stroke();
  g.lineWidth = w * 0.9; smooth([[0.98, 0], [0.75, 0.05], [0.5, 0.08], [0.3, 0.12]]); g.stroke();   // the mouth
  g.lineWidth = w * 0.45;
  for (let u = 0.35; u < 0.95; u += 0.07) { g.beginPath(); g.moveTo(...H(u, 0.1 - u * 0.09)); g.lineTo(...H(u + 0.02, 0.03 - u * 0.06)); g.stroke(); }   // lip scales
  const eye = H(0.68, -0.1);
  g.lineWidth = w * 1.1; smooth([[0.52, -0.2], [0.66, -0.23], [0.82, -0.18]]); g.stroke();   // the brow
  g.fillStyle = paper; g.beginPath(); g.arc(eye[0], eye[1], L * 0.075, 0, 7); g.fill(); g.lineWidth = w * 0.9; g.stroke();
  g.fillStyle = ink; g.beginPath(); g.arc(eye[0], eye[1], L * 0.035, 0, 7); g.fill();   // the round pupil, as Heath's
  const nostril = H(0.93, -0.08); g.beginPath(); g.arc(nostril[0], nostril[1], L * 0.018, 0, 7); g.fill();
  const pit = H(0.83, -0.04); g.beginPath(); g.arc(pit[0], pit[1], L * 0.022, 0, 7); g.stroke();
}

// The tongue as Heath draws it: a short stem out of the mouth, then two long fine tines that part
// and thin to points.
function drawTongue(g, H, w, ink) {
  const tine = (uv, w0, w1) => {
    const p = uv.map(([u, v]) => H(u, v)), n = 24, c = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, s = 1 - t;
      c.push([s * s * p[0][0] + 2 * s * t * p[1][0] + t * t * p[2][0], s * s * p[0][1] + 2 * s * t * p[1][1] + t * t * p[2][1]]);
    }
    const side = (sg) => c.map((q, i) => {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const half = (w0 + (w1 - w0) * i / n) / 2;
      return [q[0] - sg * dy / l * half, q[1] + sg * dx / l * half];
    });
    g.fillStyle = ink; g.beginPath(); trace(g, [...side(1), ...side(-1).reverse()]); g.closePath(); g.fill();
  };
  tine([[0.98, -0.03], [1.12, -0.035], [1.25, -0.045]], w * 0.9, w * 0.8);
  tine([[1.24, -0.045], [1.5, -0.08], [1.76, -0.2]], w * 0.8, w * 0.15);
  tine([[1.24, -0.045], [1.52, -0.01], [1.8, -0.03]], w * 0.8, w * 0.15);
}
