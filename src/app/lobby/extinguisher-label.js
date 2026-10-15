import { FONT } from '../../engine/panel.js';
import { LOBBY_T } from './texts.ru.js';

// The extinguisher's label, laid out as on a 1972 General WS-900 (a seller's photo of one): a tall
// silver label with a thin dark rule round it, an oval mark at the top, the agent under it, a blue
// band with how to operate it, the small print below. The maker's own name is left out of the
// oval (it is a trade mark); the words are ours (texts.ru.js). Drawn on a canvas wrapped round the
// label's piece of the shell (extinguisher.js, #extLabel), u running left to right as seen from the front.
const W = 420, H = 690;
// drawn at twice these pixels: at 420 across the label's 15 cm (2717 px/m) its print blurred closer than
// 53 cm at the headset's 25 px a degree (src/engine/ui/sheet-math.js), so a player leaning in to read it
// saw it soften; twice the texels keep it sharp to about 26 cm, where the small print is big enough
const SHARP = 2;
// printed in dark blue on the silver, the rule and the small print too (photo 4 of the 1970 one)
const SILVER = '#d9dcdd', RULE = '#1f3466', BLUE = '#2b4c94', INK = '#1c2f5e', GREY = '#33497a';

export function paintExtinguisherLabel(el) {
  const t = LOBBY_T.extinguisher;
  const c = document.createElement('canvas');
  c.width = W * SHARP; c.height = H * SHARP;
  const x = c.getContext('2d');
  x.scale(SHARP, SHARP);
  x.fillStyle = SILVER; x.fillRect(0, 0, W, H);
  x.strokeStyle = RULE; x.lineWidth = 5; x.strokeRect(12, 12, W - 24, H - 24);
  // the oval mark
  x.lineWidth = 6; x.beginPath(); x.ellipse(W / 2, 92, 150, 44, 0, 0, Math.PI * 2); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK;
  x.font = `700 46px ${FONT}`; x.fillText(t.agent, W / 2, 94);
  x.font = `600 24px ${FONT}`; x.fillText(t.name, W / 2, 168);
  // how to operate, white on the blue band: 14% of the label's height on the 1970 one (photo 4), 18% here,
  // as tight as its four lines allow at the size they are read at (readability first: .claude/rules/game.md)
  x.fillStyle = BLUE; x.fillRect(12, 196, W - 24, 124);
  x.fillStyle = '#ffffff';
  x.font = `700 20px ${FONT}`; x.fillText(t.operate, W / 2, 214);
  x.font = `700 24px ${FONT}`;
  t.steps.forEach((s, i) => x.fillText(s, W / 2, 243 + i * 27));
  // the small print
  x.fillStyle = GREY; x.textAlign = 'left'; x.font = `500 17px ${FONT}`;
  t.small.forEach((s, i) => x.fillText(s, 34, 352 + i * 30));
  const tex = new AFRAME.THREE.CanvasTexture(c);
  tex.colorSpace = AFRAME.THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = el.getObject3D('mesh');
  mesh.material.map = tex;
  mesh.material.color.set('#ffffff');
  mesh.material.needsUpdate = true;
}

// The gauge's dial, as on the 1970 WS-900 (the listing's photos 5 and 8): dark blue; a red band near
// the rim from the top wedge's one side round the bottom to its other, a gold ring outside it,
// RECHARGE along the band on the left and OVERCHARGED on the right, a small cream tab on it at the bottom; at the top a pale cream
// wedge from the rim to the hub (the right range) with RANGE and 100 in it; 0 on the left and 200 on
// the right, each with a dot; a small cream pointer at the rim upper left; a brass hub; no needle
// shows. Drawn on the dial's disc (extinguisher.js, #extGauge).
const DIAL = 256, NAVY = '#1d2f5c', RED = '#c0242a', CREAM = '#ece3b2', WHITE = '#f2f0ea', HUB = '#b8952f';
// the scale's angle (canvas angles: 0 to the right, clockwise) for a reading: 0 at the left, 100 at the
// top, 200 at the right
const reading = (v) => Math.PI + (v / 200) * Math.PI;
// the band's inner and outer radius (about a fifth of the radius wide, photos 5 and 8), a gold ring
// round it to the rim, and the wedge's edges as readings
const BAND = [0.74, 0.92], WEDGE = [80, 120], GOLD = '#a8862c';
function along(x, text, m, r, from, to) {
  const chars = [...text], step = (to - from) / chars.length;
  chars.forEach((ch, i) => {
    const a = from + step * (i + 0.5);
    x.save(); x.translate(m + Math.cos(a) * r, m + Math.sin(a) * r); x.rotate(a + Math.PI / 2); x.fillText(ch, 0, 0); x.restore();
  });
}
export function paintGauge(el) {
  const t = LOBBY_T.extinguisher.gauge, c = document.createElement('canvas');
  c.width = c.height = DIAL;
  const x = c.getContext('2d'), m = DIAL / 2;
  x.fillStyle = GOLD; x.beginPath(); x.arc(m, m, m, 0, Math.PI * 2); x.fill();
  x.fillStyle = NAVY; x.beginPath(); x.arc(m, m, BAND[1] * m, 0, Math.PI * 2); x.fill();
  const [inner, outer] = BAND.map((k) => k * m), mid = (inner + outer) / 2, at = (a, r) => [m + Math.cos(a) * r, m + Math.sin(a) * r];
  x.lineWidth = outer - inner; x.strokeStyle = RED;
  x.beginPath(); x.arc(m, m, mid, reading(WEDGE[1]), reading(WEDGE[0]) + 2 * Math.PI); x.stroke();
  x.fillStyle = CREAM; x.beginPath(); x.moveTo(m, m); x.arc(m, m, outer, reading(WEDGE[0]), reading(WEDGE[1])); x.closePath(); x.fill();
  // the tab across the band at the bottom, and the pointer at the rim upper left
  const tab = Math.PI / 2, w = 0.05;
  x.beginPath(); [at(tab - w, inner), at(tab - w, outer), at(tab + w, outer), at(tab + w, inner)].forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.closePath(); x.fill();
  const tip = reading(58);
  x.beginPath(); [at(tip - 0.13, outer), at(tip + 0.13, outer), at(tip, m * 0.6)].forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.closePath(); x.fill();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = WHITE; x.font = `700 ${DIAL * 0.045}px ${FONT}`;
  along(x, t.low, m, mid, reading(-40), reading(48));
  along(x, t.high, m, mid, reading(132), reading(235));
  // the numbers and their dots in the blue, clear of the band; 100 and RANGE in the wedge
  x.fillStyle = CREAM; x.font = `700 ${DIAL * 0.09}px ${FONT}`;
  x.fillText('0', m * 0.5, m); x.fillText('200', m * 1.42, m * 1.04);
  for (const [px, py] of [[m * 0.36, m * 0.95], [m * 1.66, m * 1.05]]) { x.beginPath(); x.arc(px, py, DIAL * 0.017, 0, Math.PI * 2); x.fill(); }
  x.fillStyle = NAVY; x.fillText('100', m, m * 0.45);
  x.beginPath(); x.arc(m, m * 0.3, DIAL * 0.015, 0, Math.PI * 2); x.fill();
  x.font = `700 ${DIAL * 0.05}px ${FONT}`; x.fillText(t.range, m, m * 0.17);
  x.fillStyle = HUB; x.beginPath(); x.arc(m, m, DIAL * 0.045, 0, Math.PI * 2); x.fill();
  const tex = new AFRAME.THREE.CanvasTexture(c);
  tex.colorSpace = AFRAME.THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = el.getObject3D('mesh');
  mesh.material.map = tex;
  mesh.material.color.set('#ffffff');
  mesh.material.needsUpdate = true;
}
