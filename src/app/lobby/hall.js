// The elevator hall behind the middle of the corridor's south wall (plan.js, HALL and CARS), built
// on the Science and Engineering Offices' hall of 1968 (University of Illinois at Chicago Circle; the
// elevator lobby photographed on 25 January 1968, UIC Library Digital Collections, record 422713,
// docs/research/vr/12-whole-building.md): plain light walls and a plain ceiling, no grid; a light
// slot along the top of each side wall; each entrance in a dark metal frame whose returns line the
// opening's whole depth, the doors dark at its back, two panels; the up and down lantern arrows in
// the strike jamb's return near its top; the call station on the wall between two entrances.
// What the photo cannot give (sizes, heights) is named where it is set.
import { HALL, HALL_CENTRE, HALL_LENGTH, CARS, PLAN } from './plan.js';

const r = (v) => +v.toFixed(4);
const IN = 0.0254;
// The entrance: 3'6" x 7'0", centre-opening, as an office building's 3500 lb passenger cars of the
// time had them (the elevator schedule of the CIA's Langley office building, Syska & Hennessy, Aug.
// 1958: "CAR-HOISTWAY DOOR SIZE 3'-6" x 7'-0"", "CENTER OPNG.", "HALL INDICATION ... LANTERN",
// archive.org CIA-RDP78-04506A000200040007-5, the page looked at; Westinghouse's buyer's guide of 1956
// gives "center-opening for general purpose"; the 1968 photo shows two panels). The frame's face on
// the wall, about a twentieth of the opening in the photo: 2 in (our reading); its returns line the
// opening through the block wall, 0.2 m. The lantern's centre at least 72 in over the floor and its
// arrows at least 2 1/2 in (UFAS 4.10.4, 1984, after ANSI A117.1-1980), the call buttons centred at
// 42 in (UFAS 4.10.3); the faceplate's size is ours.
const E = {
  door: { w: r(42 * IN), h: r(84 * IN) },
  face: r(2 * IN),
  depth: 0.2,
  lantern: r(72 * IN),
  arrow: r(2.5 * IN),
  call: { y: r(42 * IN), w: 0.09, h: 0.2 }
};
E.opening = r(E.door.w + 2 * E.face);
E.top = r(E.door.h + E.face);
const HALL_SPACE = `space: ${HALL_CENTRE.x} ${HALL_CENTRE.z} ${r(HALL.maxX - HALL.minX)} ${HALL_LENGTH}`;
const PAINT = '#c9c8bd';          // the walls and ceiling: light, as in the photo (black and white: the tone is ours)
const DARK = '#1d1c1a';           // the frames and doors: dark metal, as in the photo
const FRAME = `color="${DARK}" material="metalness: .4; roughness: .5"`;
const BASE = '#2b2d29';           // the 4 in base, the corridor's (docs/building-standards.md)
// along a side wall (the x of its face) the pieces of wall between the entrances' openings, and
// the openings themselves: { z0, z1 } along z
const openings = (x) => CARS.filter((c) => c.x === x).map((c) => ({ z0: r(c.z - E.opening / 2), z1: r(c.z + E.opening / 2) }));
function runs(x) {
  const out = [];
  let at = HALL.minZ;
  for (const o of openings(x)) { out.push([at, o.z0]); at = o.z1; }
  out.push([at, HALL.maxZ]);
  return out;
}

// a side wall: the paint between the openings, over each opening up to the ceiling, and the base
function sideWall(x, ceil) {
  const facing = x === HALL.minX ? 1 : -1, turn = `rotation="0 ${facing * 90} 0"`;
  return runs(x).map(([a, b]) => `
    <a-plane ${turn} position="${x} ${r(ceil / 2)} ${r((a + b) / 2)}" width="${r(b - a)}" height="${ceil}" color="${PAINT}" material="roughness: .9"></a-plane>
    <a-box position="${r(x + facing * 0.0025)} 0.051 ${r((a + b) / 2)}" width="0.005" height="0.102" depth="${r(b - a)}" color="${BASE}"></a-box>`).join('') +
    openings(x).map(({ z0, z1 }) => `
    <a-plane ${turn} position="${x} ${r((E.top + ceil) / 2)} ${r((z0 + z1) / 2)}" width="${r(z1 - z0)}" height="${r(ceil - E.top)}" color="${PAINT}" material="roughness: .9"></a-plane>`).join('');
}

// One entrance: the frame's two jambs and head line the opening through the wall's depth (their
// faces on the wall are the frame's face), the two door panels at the back of it, the sill, and in
// the strike jamb's return the lantern's two arrows, up over down.
function entrance({ x, z, facing }) {
  const back = r(x - facing * E.depth);                    // the doors' face, at the back of the returns
  const mid = r(x - facing * E.depth / 2), w = E.opening, jamb = r((w - E.door.w) / 2);
  const jz = (s) => r(z + s * (w / 2 - jamb / 2));
  // the lantern in the return of the jamb farther from the corridor (the photo shows the arrows in the
  // return of one jamb; which one, toward the corridor or away from it, it does not show: ours), its
  // face 0.5 mm off the return, facing across the opening; each arrow 2 1/2 in high
  const side = 1, a = E.arrow / 2;
  const arrow = (up, y) => `
    <a-triangle position="${r(x - facing * E.depth * 0.5)} ${y} ${r(z + side * (E.door.w / 2 - 0.0005))}" rotation="0 ${side > 0 ? 180 : 0} 0"
      vertex-a="0 ${up ? a : -a} 0" vertex-b="${-a} ${up ? -a : a} 0" vertex-c="${a} ${up ? -a : a} 0" color="#e9e6dc" material="roughness: .6; side: double"></a-triangle>`;
  return `
    <a-box position="${mid} ${r(E.top / 2)} ${jz(-1)}" width="${E.depth}" height="${E.top}" depth="${jamb}" ${FRAME}></a-box>
    <a-box position="${mid} ${r(E.top / 2)} ${jz(1)}" width="${E.depth}" height="${E.top}" depth="${jamb}" ${FRAME}></a-box>
    <a-box position="${mid} ${r(E.door.h + (E.top - E.door.h) / 2)} ${z}" width="${E.depth}" height="${r(E.top - E.door.h)}" depth="${r(w - 2 * jamb)}" ${FRAME}></a-box>
    <a-box position="${r(back - facing * 0.015)} ${r(E.door.h / 2)} ${r(z - E.door.w / 4)}" width="0.03" height="${E.door.h}" depth="${r(E.door.w / 2 - 0.002)}" ${FRAME}></a-box>
    <a-box position="${r(back - facing * 0.015)} ${r(E.door.h / 2)} ${r(z + E.door.w / 4)}" width="0.03" height="${E.door.h}" depth="${r(E.door.w / 2 - 0.002)}" ${FRAME}></a-box>
    <a-box position="${r(x - facing * E.depth / 2)} 0.003 ${z}" width="${E.depth}" height="0.006" depth="${r(E.door.w)}" material="color: #9a9c9e; metalness: .6; roughness: .4"></a-box>${arrow(true, r(E.lantern + 0.04))}${arrow(false, r(E.lantern - 0.04))}`;
}

// the call station on the wall between a side's two entrances: a faceplate with an up and a down
// button (the hall's floor is the building's lowest the cars serve: the photo's floor is an upper one)
function callStation(x) {
  const facing = x === HALL.minX ? 1 : -1, zs = CARS.filter((c) => c.x === x).map((c) => c.z);
  const z = r((zs[0] + zs[1]) / 2), out = r(x + facing * 0.004);
  return `
    <a-box position="${out} ${E.call.y} ${z}" width="0.008" height="${E.call.h}" depth="${E.call.w}" material="color: #b9bcbe; metalness: .6; roughness: .35"></a-box>
    <a-cylinder position="${r(out + facing * 0.006)} ${r(E.call.y + 0.03)} ${z}" rotation="0 0 90" radius="0.0095" height="0.006" color="#e9e6dc"></a-cylinder>
    <a-cylinder position="${r(out + facing * 0.006)} ${r(E.call.y - 0.03)} ${z}" rotation="0 0 90" radius="0.0095" height="0.006" color="#e9e6dc"></a-cylinder>`;
}

// the light slot along the top of each side wall: a lamp's lens in a slot in the ceiling at the wall,
// lit as the corridor's troffers are (their glow, no light of its own: the corridor's lights)
const slot = (x) => `
    <a-plane position="${r(x + (x === HALL.minX ? 1 : -1) * 0.06)} ${r(2.5 - 0.004)} ${HALL_CENTRE.z}" rotation="90 0 0" width="0.1" height="${r(HALL_LENGTH - 0.2)}"
             material="color: #ffffff; emissive: #f2f6ff; emissiveIntensity: 0.95; roughness: 1" surface="kind: lens; glow: true"></a-plane>`;

// The hall's far end, on this floor the building's way in and out: a glass wall in dark metal
// framing with a pair of swinging doors, as the entrance of University Hall on the same campus was
// photographed on 3 May 1965 (UIC record 427827, docs/research/vr/12-whole-building.md): dark mullions,
// a glass wall from floor to ceiling, a swinging door beside the revolving one. The revolving door is
// left out: the wall is 3.0 m, and an exit door must swing (The BOCA Basic Building Code/1978, 613.1:
// "Revolving doors shall not be used as exitway doors"). Each leaf 3'0" x 7'0", as the corridor's doors
// (door.js); the framing 2 in, our reading of the photo; the glass dark, as glass looks from a lit
// room at night, a push bar across each leaf at the knobs' height (door.js). Opaque, so it merges
// with the rest of the hall into a few draw calls (merge-static.js).
const LEAF_W = 0.914, LEAF_H = 2.134, MULL = 0.05, PUSH = 1.024;
const GLASS = 'color="#0d1114" material="roughness: .12; metalness: 0"';
function exitWall(ceil) {
  const z = HALL.maxZ, mid = HALL_CENTRE.x, pair = 2 * LEAF_W + 3 * MULL;
  const x0 = r(mid - pair / 2), x1 = r(mid + pair / 2), head = r(LEAF_H + MULL);
  const bar = (x, w) => `<a-box position="${r(x)} ${r(ceil / 2)} ${r(z - MULL / 2)}" width="${r(w)}" height="${ceil}" depth="${MULL}" ${FRAME}></a-box>`;
  const rail = (x, w, y, h) => `<a-box position="${r(x)} ${r(y)} ${r(z - MULL / 2)}" width="${r(w)}" height="${r(h)}" depth="${MULL}" ${FRAME}></a-box>`;
  const pane = (xa, xb, ya, yb, dz = 0) => `<a-plane rotation="0 180 0" position="${r((xa + xb) / 2)} ${r((ya + yb) / 2)} ${r(z - MULL / 2 - dz)}" width="${r(xb - xa)}" height="${r(yb - ya)}" ${GLASS}></a-plane>`;
  const leaf = (xa) => {
    const xb = xa + LEAF_W, s = 0.06;   // a narrow stile, 2 3/8 in: our reading of the photo's doors
    return `
    <a-box position="${r(xa + s / 2)} ${r(LEAF_H / 2)} ${r(z - MULL / 2)}" width="${s}" height="${LEAF_H}" depth="0.045" ${FRAME}></a-box>
    <a-box position="${r(xb - s / 2)} ${r(LEAF_H / 2)} ${r(z - MULL / 2)}" width="${s}" height="${LEAF_H}" depth="0.045" ${FRAME}></a-box>
    <a-box position="${r((xa + xb) / 2)} ${r(LEAF_H - s / 2)} ${r(z - MULL / 2)}" width="${r(LEAF_W - 2 * s)}" height="${s}" depth="0.045" ${FRAME}></a-box>
    <a-box position="${r((xa + xb) / 2)} 0.1 ${r(z - MULL / 2)}" width="${r(LEAF_W - 2 * s)}" height="0.2" depth="0.045" ${FRAME}></a-box>
    ${pane(xa + s, xb - s, 0.2, LEAF_H - s, 0.004)}
    <a-box position="${r((xa + xb) / 2)} ${PUSH} ${r(z - MULL - 0.04)}" width="${r(LEAF_W - 2 * s - 0.04)}" height="0.03" depth="0.02" material="color: #cfd2d5; metalness: .5; roughness: .35"></a-box>`;
  };
  return `
    ${bar(HALL.minX + MULL / 2, MULL)}${bar(x0 + MULL / 2, MULL)}${bar(mid, MULL)}${bar(x1 - MULL / 2, MULL)}${bar(HALL.maxX - MULL / 2, MULL)}
    ${rail(mid, x1 - x0, head - MULL / 2, MULL)}${rail(mid, HALL.maxX - HALL.minX, MULL / 2, MULL)}${rail(mid, HALL.maxX - HALL.minX, ceil - MULL / 2, MULL)}
    ${pane(HALL.minX + MULL, x0, MULL, ceil - MULL)}${pane(x1, HALL.maxX - MULL, MULL, ceil - MULL)}${pane(x0 + MULL, x1 - MULL, head, ceil - MULL)}
    ${leaf(x0 + MULL)}${leaf(mid + MULL / 2)}`;
}

// The directories (directory.js): the main one by the way in, on the east wall between the last
// entrance and the glass wall; a floor directory on each side wall between the corridor and the
// first entrance, where one leaves a car, its arrows turned for the wall it is on (lobby.js writes
// them). Each in an aluminium frame on the wall: a body, its print on the body's face, a lip round
// it (as the corridor's cork board, scene.js). Their heights: the main board's from 41 to 74 in, inside
// the 38 to 85 in a 1969 lobby photo shows (Washington State University, Johnson Hall; our estimate
// from it), its middle at eye height; the floor directory's middle at 60 in, as the door signs'
// (brand.js). No glass over the felt: in a headset it would only mirror the light slots.
const ALU = 'material="color: #b9bcbf; metalness: .6; roughness: .35"';
// the two directories' faces (directory.js draws them): the main board 20 x 30 in; a floor
// directory's panels 2 x 14 in, an eighth of an inch apart (our reading: panels slid into one frame
// meet with a seam), the frame as tall as its panels
export const MAIN = { w: r(20 * IN), h: r(30 * IN) };
export const PANEL = { w: r(14 * IN), h: r(2 * IN), gap: r(0.125 * IN) };
const floorDirectorySize = (n) => ({ w: PANEL.w, h: r(n * PANEL.h + (n - 1) * PANEL.gap) });
const MAIN_FRAME = r(1.375 * IN), FLOOR_FRAME = r(0.5 * IN);
function framed(id, { x, z, y, w, h, lip, body, facing, bg }) {
  // facing: the way the print faces along x, out from the wall into the hall
  const face = r(x + facing * body), lipX = r(x + facing * (body + 0.006));
  const turn = `rotation="0 ${facing > 0 ? 90 : -90} 0"`, ow = r(w + 2 * lip), oh = r(h + 2 * lip);
  const bars = [[0, (h + lip) / 2, ow, lip], [0, -(h + lip) / 2, ow, lip], [-(w + lip) / 2, 0, lip, h], [(w + lip) / 2, 0, lip, h]];
  return `
    <a-box position="${r(x + facing * body / 2)} ${y} ${z}" width="${body}" height="${oh}" depth="${ow}" ${ALU}></a-box>${bars.map(([dz, dy, bw, bh]) => `
    <a-box position="${lipX} ${r(y + dy)} ${r(z + dz)}" width="0.012" height="${r(bh)}" depth="${r(bw)}" ${ALU}></a-box>`).join('')}
    <a-entity id="${id}" class="directory" data-dynamic panel="w: ${r(w)}; h: ${r(h)}; px: 1024; bg: ${bg}; decal: true" ${turn} position="${r(face + facing * 0.0005)} ${y} ${z}"></a-entity>`;
}
export function directoriesHTML() {
  const east = CARS.filter((c) => c.x === HALL.maxX).map((c) => c.z);
  const mainZ = r((Math.max(...east) + E.opening / 2 + HALL.maxZ - MULL) / 2);
  const floorZ = r((PLAN.south + PLAN.thick + Math.min(...east) - E.opening / 2) / 2);
  const fd = floorDirectorySize(FLOOR_LINES);
  return framed('dirMain', { x: HALL.maxX, z: mainZ, y: r(57.5 * IN), w: MAIN.w, h: MAIN.h, lip: MAIN_FRAME, body: 0.035, facing: -1, bg: '#141414' }) +
    [HALL.maxX, HALL.minX].map((x) => framed(x === HALL.maxX ? 'dirFloorEast' : 'dirFloorWest',
      { x, z: floorZ, y: r(60 * IN), w: fd.w, h: fd.h, lip: FLOOR_FRAME, body: 0.02, facing: x === HALL.maxX ? -1 : 1, bg: '#0c1424' })).join('');
}
// the floor directory's lines: the floor, the rooms, the stairs, the way out (texts.ru.js)
export const FLOOR_LINES = 4;

export function hallHTML(ceil) {
  return `
    <a-plane rotation="-90 0 0" position="${HALL_CENTRE.x} 0 ${HALL_CENTRE.z}" width="${r(HALL.maxX - HALL.minX)}" height="${HALL_LENGTH}" surface="kind: linoleum; ${HALL_SPACE}"></a-plane>
    <a-plane rotation="90 0 0" position="${HALL_CENTRE.x} ${ceil} ${HALL_CENTRE.z}" width="${r(HALL.maxX - HALL.minX)}" height="${HALL_LENGTH}" color="${PAINT}" material="roughness: .95"></a-plane>
    ${sideWall(HALL.minX, ceil)}
    ${sideWall(HALL.maxX, ceil)}
    ${exitWall(ceil)}
    ${CARS.map(entrance).join('')}
    ${callStation(HALL.minX)}${callStation(HALL.maxX)}
    ${slot(HALL.minX)}${slot(HALL.maxX)}
    ${directoriesHTML()}`;
}
