// Pure math for sheet.js: where the clipboard sheet appears and how big its letters
// look. Research (docs/decisions.md): read at about 1 m (Meta display guidance; rays are
// comfortable from 0.8 m), a little below the eyes, world-fixed once shown; letters at
// least the game's readable minimum, answer targets at least 2.5 degrees (Meta).
export const READ_DIST = 1.0;
// The clipboard, as a hardboard clipboard for US Letter paper is made (9 × 12-1/2 in, 1/8 in
// hardboard: school and office catalogs; the clip after a photo of one, Wikimedia Commons
// "Clipboard.jpg"), scaled so its Letter-shaped paper (PAPER) reads at 1 m: the
// board 1/4 in wider than the paper each side, 1-1/4 in above it for the clip and 1/4 in below;
// the clip's jaw 0.6 of the board's width over the paper's top edge, a raised middle with two
// rivets, and the ring it hangs by standing above the board. y up from the paper's centre, z out
// of the paper (metres).
// The paper: a US Letter page (LETTER, 8.5 × 11 in) 0.56 m wide, a real page as seen in the hand,
// kept at that angle at the reading distance.
export const LETTER = { w: 0.2159, h: 0.2794 };
export const PAPER = { w: 0.56, h: +(0.56 * 11 / 8.5).toFixed(4) };
// Colours of print and controls, inside Meta's limits for text, backgrounds and all UI (Meta,
// "Color": light no brighter than #DADADA, dark no darker than #1A1A1A; pure white and black strain
// the eyes in a headset). The paper is white offset paper as measured (FOGRA29: ISO 12647-2 paper
// type 4, unprinted, L* 95.71 a* 0.61 b* -2.32, D50), sRGB 242 242 247, dimmed in linear light to
// the light limit; ink and the buttons' text at the limits (docs/research/vr/08-paper.md).
export const LIGHT_LIMIT = '#dadada';
export const DARK_LIMIT = '#1a1a1a';
export const PAPER_BG = '#d6d6da';
export const INK = DARK_LIMIT;
export const INK_SOFT = '#4a453c';
export const BUTTON = { bg: '#1d2026', hover: '#343b47', text: LIGHT_LIMIT };
const IN = PAPER.w / 8.5;   // metres an inch at this scale
const HALF = PAPER.h / 2;
export const BOARD = { w: 9 * IN, top: HALF + 1.25 * IN, bottom: HALF + 0.25 * IN, d: 0.125 * IN, corner: 0.375 * IN };
export const CLIP = {
  jaw: { w: 0.6 * BOARD.w, h: 0.7 * IN, y: HALF, d: 0.005 },
  hump: { w: 0.27 * BOARD.w, h: 1.1 * IN, y: HALF + 0.75 * IN, d: 0.02 },
  ring: { r: 0.4 * IN, tube: 0.1 * IN, y: HALF + 1.5 * IN, z: 0.01 }
};
// how far the whole clipboard reaches: up to the ring's top, down to the board's foot, behind the
// paper to the board's back (the paper lies on the board's face, drawn over it as a decal), in
// front of it to the clip's hump; the wall checks use it
export const BOARD_REACH = { w: BOARD.w, top: CLIP.ring.y + CLIP.ring.r + CLIP.ring.tube, bottom: BOARD.bottom, back: BOARD.d, front: CLIP.hump.d };
// The height of the sheet's centre when it hangs by its ring on a peg of radius pegR at hookY: the
// peg sits at the top inside of the ring.
export const hangY = (hookY, pegR) => hookY - (CLIP.ring.r - CLIP.ring.tube - pegR) - CLIP.ring.y;
export const DROP_DEG = 12;
// The smallest letter on any paper, as font size at the reading distance: 24 dmm, Google's
// comfortably readable body text (McKenzie & Glazier 2017, docs/research/vr/03c-viewing-text.md), 1.375°.
// It sets the size of everything printed on a page, never the paper (docs/decisions.md, large print).
export const MIN_LETTER = 0.024;
export const MIN_TARGET_DEG = 2.5;
// The letter for a line read from `from` metres instead of from the hand (a page on its hook): the
// smallest letter's angle from there, in whole millimetres up, never under the line's own size m.
export const letterFrom = (m, from = READ_DIST) => Math.max(m, Math.ceil(MIN_LETTER * from / READ_DIST * 1000 - 1e-9) / 1000);
// How sharp a canvas must be to use the headset's display and no more: Quest 3 shows 25 pixels a
// degree (Meta, "Compare headsets"; Quest 3S 20, Quest 2 about 20.6), so a canvas read from d
// metres needs PPD / (d tan 1°) pixels a metre. The paper is read from READ_DIST.
export const PPD = 25;
export const pxPerM = (d) => PPD / (d * Math.tan(Math.PI / 180));
export const PAPER_DENSITY = pxPerM(READ_DIST);

// head: [x, y, z] eyes in world metres; yaw: the way the player faces (radians,
// three.js: 0 looks along -Z). Returns the sheet centre and its three.js rotation
// (order YXZ) so that its face points back at the eyes.
export function frontPose(head, yaw) {
  const d = DROP_DEG * Math.PI / 180;
  const ahead = [-Math.sin(yaw), -Math.cos(yaw)];
  const pos = [
    head[0] + READ_DIST * Math.cos(d) * ahead[0],
    head[1] - READ_DIST * Math.sin(d),
    head[2] + READ_DIST * Math.cos(d) * ahead[1]
  ];
  return { pos, yaw, pitch: -d };
}

// How big a letter of this size looks from this distance, in degrees of view.
export function letterDeg(sizeM, distM) {
  return 2 * Math.atan(sizeM / 2 / distM) * 180 / Math.PI;
}

// How the sheet travels between its hook and the reading spot, only after the player's
// click (motion is comfortable when the user starts it: Android XR motion guide). Never a
// straight line at the eyes (looming makes people dodge: Meta; an approach alarms, a miss
// path does not: Ball & Tronick 1971): it swings out sideways (away from the wall) and
// down, eases in and out (Meta's grab specs), and never comes nearer than NEAREST.
// SIDE, DROP and the time per metre are our choices, to be checked in the headset.
// out: how much further from the wall a swing may bend when its corners would touch a wall.
export const GLIDE = { side: 0.35, drop: 0.2, msPerM: 700, minMs: 1000, maxMs: 1800, nearest: 0.5, out: [0, 0.1, 0.2, 0.3, 0.45] };

// Where the sheet is read: frontPose, unless that spot is behind the wall the sheet hangs
// on (a player standing close to it) or past a wall of the space (a player near an end wall);
// then the nearest turn to either side that keeps it clear. A sheet behind a wall cannot be
// read, yet its buttons still take the laser through the wall.
// wall: { pos: [x, y, z] on the wall, away: [x, y, z] out of it }; inside: the space's wall
// faces { minX, maxX, minZ, maxZ }; board: { w, h, back, front } the clipboard's size and how
// far it reaches behind and in front of the paper, so every corner of it stays in, tilted and
// turned as it is read.
export const CLEAR = 0.15;   // metres from the sheet's centre to a wall in front of it
// Every corner keeps this far inside the wall faces: what hangs on a wall stands up to 35 mm
// proud of it (the cork board in its frame, src/app/lobby/scene.js) and two faces closer than
// 5 mm flicker (docs/vr-checklist.md).
export const EDGE_CLEAR = 0.04;
export function readingPose(head, yaw, wall, inside, board = null) {
  const fits = (p) => {
    if (wall && (p.pos[0] - wall.pos[0]) * wall.away[0] + (p.pos[2] - wall.pos[2]) * wall.away[2] < CLEAR) return false;
    return !inside || (within(inside, p.pos, CLEAR) && (!board || boardCorners(p, board).every((c) => within(inside, c, EDGE_CLEAR))));
  };
  for (let turn = 0; turn <= 180; turn += 5) {
    for (const s of turn ? [1, -1] : [1]) {
      const p = frontPose(head, yaw + s * turn * Math.PI / 180);
      if (fits(p)) return p;
    }
  }
  return frontPose(head, yaw);
}

// Whether a point [x, y, z] is at least m inside the wall faces.
export function within(inside, [x, , z], m) {
  return x >= inside.minX + m && x <= inside.maxX - m && z >= inside.minZ + m && z <= inside.maxZ - m;
}

// The eight corners of the board at pose { pos, pitch, yaw } (three.js order YXZ: pitch about its
// own x, then yaw about the vertical).
export function boardCorners({ pos, pitch, yaw }, { w, h = 0, top = h / 2, bottom = h / 2, back = 0, front = 0 }) {
  const cx = Math.cos(pitch), sx = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  const out = [];
  for (const x of [-w / 2, w / 2]) for (const y of [-bottom, top]) for (const z of [-back, front]) {
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    out.push([pos[0] + x * cy + z1 * sy, pos[1] + y1, pos[2] - x * sy + z1 * cy]);
  }
  return out;
}

// The space a trip may use: EDGE_CLEAR inside the walls, except at a wall the board rests near at
// either end of the trip (hanging on a board on that wall): it comes no nearer that wall than it
// rests there, so it leaves the board straight out instead of being held off it.
function tripSpace(inside, ends) {
  const xs = ends.map((c) => c[0]), zs = ends.map((c) => c[2]);
  return { minX: Math.min(inside.minX + EDGE_CLEAR, ...xs), maxX: Math.max(inside.maxX - EDGE_CLEAR, ...xs),
    minZ: Math.min(inside.minZ + EDGE_CLEAR, ...zs), maxZ: Math.max(inside.maxZ - EDGE_CLEAR, ...zs) };
}

// a, b: start and end [x, y, z]; away: the horizontal way out from the wall the sheet
// hangs on; head: the eyes; room (optional): { from, to: { pitch, yaw }, board, inside } to keep
// every corner of the board inside the walls all the way (tripPose, tripSpace).
// Returns the curve's control point and its duration in ms. The full swing is used unless it
// would bring the sheet nearer the eyes than both GLIDE.nearest and its own start and end; then a
// smaller one; a swing that would put a corner into a wall is pushed further out from the wall.
export function glidePath(a, b, away, head, room = null) {
  const dx = b[0] - a[0], dz = b[2] - a[2];
  const len = Math.hypot(dx, dz) || 1;
  let side = [-dz / len, dx / len];
  if (side[0] * away[0] + side[1] * away[2] < 0) side = [-side[0], -side[1]];
  const allowed = Math.min(GLIDE.nearest, dist3(a, head), dist3(b, head));
  const from = room && { pos: a, ...room.from }, to = room && { pos: b, ...room.to };
  const space = room && tripSpace(room.inside, [from, to].flatMap((p) => boardCorners(p, room.board)));
  const clear = (ctrl) => !room || Array.from({ length: 41 }, (_, i) => tripPose(from, ctrl, to, i / 40))
    .every((p) => boardCorners(p, room.board).every((c) => within(space, c, 0)));
  let best = null;
  search: for (const out of GLIDE.out) {
    for (const k of [1, 0.6, 0.3, 0]) {
      const ctrl = [
        (a[0] + b[0]) / 2 + side[0] * GLIDE.side * k + away[0] * out,
        (a[1] + b[1]) / 2 - GLIDE.drop,
        (a[2] + b[2]) / 2 + side[1] * GLIDE.side * k + away[2] * out
      ];
      let nearest = Infinity;
      for (let i = 0; i <= 40; i++) nearest = Math.min(nearest, dist3(curvePoint(a, ctrl, b, i / 40), head));
      const ok = clear(ctrl);
      if (!best || ok > best.ok || (ok === best.ok && nearest > best.nearest)) best = { ctrl, nearest, ok };
      if (ok && nearest >= allowed - 1e-9) { best = { ctrl, nearest, ok }; break search; }
    }
  }
  let length = 0;
  for (let i = 1, p = a; i <= 20; i++) {
    const q = curvePoint(a, best.ctrl, b, i / 20);
    length += dist3(p, q);
    p = q;
  }
  const ms = Math.min(GLIDE.maxMs, Math.max(GLIDE.minMs, length * GLIDE.msPerM));
  return { ctrl: best.ctrl, ms };
}

const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// A point on the curve a → b bent towards ctrl, at f from 0 to 1.
export function curvePoint(a, ctrl, b, f) {
  const u = 1 - f;
  return a.map((v, i) => u * u * v + 2 * u * f * ctrl[i] + f * f * b[i]);
}

// The pose along a trip at eased progress e: the curve for the place, the shorter way round for
// the turn, a straight blend for the tilt (the sheet never rolls). glide.js moves it by this.
export function tripPose(a, ctrl, b, e) {
  const turn = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw));
  return { pos: curvePoint(a.pos, ctrl, b.pos, e), pitch: a.pitch + (b.pitch - a.pitch) * e, yaw: a.yaw + turn * e };
}

// Slow start, slow stop.
export function easeInOut(f) {
  return f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
}
