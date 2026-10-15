// The studio's mark and name: the emergency exit sign with its doorway opening onto black space,
// and EXXXIT; only the sign's green and black. Nothing in it is drawn by hand: the doorway and the
// running figure are the official ISO 7010 E001 drawing (Yukio Ota's figure; the public-domain
// tracing in docs/art/ISO_7010_E001.svg, kept identical by tests/logo.test.mjs) and the green is the
// safety-sign green. Drawn with canvas paths, so it looks the same on every device, the headset
// included.
export const LOGO = {
  green: '#237f52',  // safe-condition green of safety signs (ISO 3864-4, RAL 6032)
  black: '#07080a'
};

// The sign in its own units: a 105.83 mm square, the doorway and figure in the drawing's layer
// coordinates.
const SIGN = { size: 105.83333, layer: [-65.616667, -71.966666] };
export const E001_PATH = 'm 148.169,80.709657 v 60.715533 c 6.31638,0.48241 10.5308,5.63536 10.5308,10.31517 v 2.4687 l -2.46869,-0.006 -8.06211,-0.0182 v 12.73893 l 6.08214,5.9854 h -40.12901 l -7.43227,-7.11934 h -9.238704 l 7.432844,7.11934 H 93.428076 l -6.08214,-5.98542 V 125.1738 h 10.66451 c 0.0833,5.9e-4 0.16247,0.004 0.24579,0.004 0.0556,0 0.0832,-0.007 0.13598,-0.008 0.0349,-5.8e-4 0.0686,-0.002 0.10294,-0.004 1.43847,-0.0274 1.750194,-0.28172 2.778784,-1.31031 l 6.24145,-7.37766 c 1.73064,3.78552 3.36138,7.00437 5.08475,10.65995 0.19459,0.37374 0.65441,1.21334 0.30951,1.86731 l -17.152864,34.63575 6.292634,-0.021 c 3.29001,0.0726 4.66137,-2.19803 5.81814,-4.23075 4.63991,-9.35178 9.30161,-18.69659 13.94909,-28.04895 l 0.87733,16.64253 c 0.22955,2.88042 2.17565,3.61243 4.72575,3.69137 l 28.81702,0.0659 c 0,-3.31243 -3.28192,-7.68712 -8.6265,-7.89482 0,0 -10.29203,0.11556 -15.67301,0.13711 -0.68225,0 -0.86922,-0.38098 -0.94846,-0.94845 -0.24993,-4.28189 -0.48763,-8.59103 -0.7533,-12.87205 -0.16632,-2.12536 -0.3528,-3.59821 -0.96949,-5.20708 -2.0106,-4.31016 -4.02228,-8.59953 -6.03491,-12.89424 l 7.36399,-0.0859 c 0.19342,-0.007 0.34356,0.0358 0.44435,0.20823 l 5.32998,9.33771 c 2.19819,4.00865 8.13833,1.08508 6.14813,-3.16681 l -6.53616,-10.93249 c -1.14949,-1.70937 -1.6747,-2.29896 -4.66145,-2.39188 0,0 -13.95626,-0.0222 -20.94497,-0.0222 v -5.8e-4 c -2.27014,-0.0504 -2.52919,0.66163 -3.61401,1.81782 -2.91625,3.5982 -6.10478,7.43502 -8.949664,10.7891 -0.3953,0.47396 -0.61745,0.67583 -1.55836,0.66796 -1.74231,-0.0292 -3.27034,0.002 -4.6188,0.0808 h -4.28821 V 80.709277 Z m -38.64915,8.33748 c -4.00109,0 -7.06757,3.07482 -7.06757,7.09658 0,4.029633 3.06678,7.103983 7.06757,7.103983 4.00049,0 7.07496,-3.07435 7.07496,-7.103983 0,-4.02205 -3.07447,-7.09658 -7.07496,-7.09658 z';

// The mark: a green square of side s at (x, y), black space in its doorway.
export function drawMark(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / SIGN.size, s / SIGN.size);
  ctx.fillStyle = LOGO.green;
  ctx.fillRect(0, 0, SIGN.size, SIGN.size);
  ctx.translate(...SIGN.layer);
  ctx.fillStyle = LOGO.black;
  ctx.fill(new Path2D(E001_PATH));
  ctx.restore();
}

// EXXXIT: every letter is straight strokes, so no font is needed. Widths in caps, strokes apart.
const WORD = 'EXXXIT';
const WIDTHS = { E: 0.56, X: 0.66, I: 0, T: 0.62 };
const STROKE = 0.17, GAP = 0.2;

export function wordWidth(cap) {
  return [...WORD].reduce((sum, ch) => sum + (WIDTHS[ch] + STROKE) * cap, 0) + GAP * cap * (WORD.length - 1);
}

// The name centred on cx with its top at y, capitals cap high. Returns the bottom of the word.
export function drawWordmark(ctx, cx, y, cap, color = LOGO.black) {
  ctx.save();
  ctx.translate(cx - wordWidth(cap) / 2, y);
  ctx.strokeStyle = color;
  strokeWord(ctx, cap);
  ctx.restore();
  return y + cap;
}

function strokeWord(ctx, cap) {
  const w = cap * STROKE;
  ctx.lineWidth = w;
  ctx.lineCap = 'butt';
  let x = 0;
  for (const ch of WORD) {
    const lw = (WIDTHS[ch] + STROKE) * cap;   // the letter's box, strokes included
    const l = x + w / 2, r = x + lw - w / 2, top = w / 2, bot = cap - w / 2, mid = cap / 2;
    ctx.beginPath();
    if (ch === 'E') {
      ctx.moveTo(l, 0); ctx.lineTo(l, cap);
      ctx.moveTo(l, top); ctx.lineTo(x + lw, top);
      ctx.moveTo(l, mid); ctx.lineTo(x + lw * 0.9, mid);
      ctx.moveTo(l, bot); ctx.lineTo(x + lw, bot);
      ctx.stroke();
    } else if (ch === 'I') {
      ctx.moveTo(l, 0); ctx.lineTo(l, cap);
      ctx.stroke();
    } else if (ch === 'T') {
      ctx.moveTo(x, top); ctx.lineTo(x + lw, top);
      ctx.moveTo(x + lw / 2, 0); ctx.lineTo(x + lw / 2, cap);
      ctx.stroke();
    } else {
      // X: diagonals run past the letter's box and are cut flat at its top and bottom
      ctx.save();
      ctx.rect(x - w, 0, lw + 2 * w, cap);
      ctx.clip();
      const over = cap * 0.1, slope = (r - l) / cap;
      ctx.beginPath();
      ctx.moveTo(l - over * slope, -over); ctx.lineTo(r + over * slope, cap + over);
      ctx.moveTo(r + over * slope, -over); ctx.lineTo(l - over * slope, cap + over);
      ctx.stroke();
      ctx.restore();
    }
    x += lw + GAP * cap;
  }
}
