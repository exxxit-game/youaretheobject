import { drawMark, drawWordmark, LOGO } from '../logo.js';
import { FONT } from '../../engine/panel.js';
import { LOBBY_T } from './texts.ru.js';
import { ROOM1_NUMBER } from './plan.js';
import { PAPER_BG } from '../../engine/ui/sheet-math.js';

// The two Letter sheets pinned beside the clipboard on the experimenter's board (scene.js). The
// hallways of psychology buildings are covered with flyers calling for participants, with
// tear-off strips at the bottom (Indiana University, Psychological and Brain Sciences): one of
// those, and the studio's poster. Both are print on paper: drawn unlit for legibility and
// dimmed to the corridor's print level (light, lobby.js).
const INK = '#26241f';
const TABS = { n: 7, h: 0.28, torn: [1, 4] };   // strips across the foot, long enough for their words; two already taken

export function pinNotices(poster, flyer, light) {
  drawPoster(poster);
  drawFlyer(flyer);
  for (const p of [poster, flyer]) {
    p.tex.needsUpdate = true;
    p.el.getObject3D('mesh').material.color.setScalar(light);
  }
}

// The studio's poster: all the sign's green, the mark over the name, centred on the sheet.
export function drawPoster({ ctx, c }) {
  const W = c.width, H = c.height, s = W * 0.72, cap = W * 0.13, gap = H * 0.08;
  ctx.fillStyle = LOGO.green;
  ctx.fillRect(0, 0, W, H);
  const top = (H - s - gap - cap) / 2;
  drawMark(ctx, (W - s) / 2, top, s);
  drawWordmark(ctx, W / 2, top + s + gap, cap);
}

// "Participants wanted", the joke in its last line ("you qualify" and "you are coming
// closer": nobody reads a flyer from across the corridor), and strips pointing to room 101.
function drawFlyer(panel) {
  const { ctx, c } = panel;
  const W = c.width, H = c.height, f = LOBBY_T.flyer;
  const tabsTop = H * (1 - TABS.h);
  panel.write([
    { t: f.title, size: 64, weight: 800, color: INK, spacing: 2 },
    { t: f.body, size: 40, weight: 500, color: INK, gap: 46 },
    { t: f.punch, size: 56, weight: 800, color: LOGO.green, gap: 54 }
  ], { bg: PAPER_BG, top: true, pad: W * 0.08, fit: false });
  // the strips: cut lines between them, the words along each, the taken ones gone
  const tw = W / TABS.n;
  ctx.strokeStyle = 'rgba(38,36,31,.55)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.moveTo(0, tabsTop); ctx.lineTo(W, tabsTop); ctx.stroke();
  for (let i = 1; i < TABS.n; i++) { ctx.beginPath(); ctx.moveTo(i * tw, tabsTop); ctx.lineTo(i * tw, H); ctx.stroke(); }
  ctx.setLineDash([]);
  // the words in full along each strip, below the line a strip tears at (so a torn one leaves
  // no piece of a letter); the letters shrink only if the words would not keep clear of the ends
  const tear = tabsTop + H * 0.02 + 8;
  const words = f.tab(ROOM1_NUMBER);
  let px = Math.round(tw * 0.42);
  ctx.font = `600 ${px}px ${FONT}`;
  const along = (H - tear) * 0.88;
  if (ctx.measureText(words).width > along) {
    px = Math.floor(px * along / ctx.measureText(words).width);
    ctx.font = `600 ${px}px ${FONT}`;
  }
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < TABS.n; i++) {
    ctx.save();
    ctx.translate((i + 0.5) * tw, (tear + H) / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(words, 0, 0);
    ctx.restore();
  }
  for (const i of TABS.torn) {
    // torn off below a ragged edge just under the fold, showing the cork behind
    const x0 = i * tw + 1, y0 = tear - 8;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(x0, H);
    ctx.lineTo(x0, y0 + 6);
    for (let k = 1; k <= 6; k++) ctx.lineTo(x0 + (tw - 2) * k / 6, y0 + (k % 2 ? -4 : 8));
    ctx.lineTo(x0 + tw - 2, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
