// The lab's first floor to its end, the one source of every place in the corridor (the scene, the
// tests and the walking area read it; docs/art/corridor-plan.svg, plan B as variant A1). One straight corridor
// 1.8 m wide, rooms along its north wall, a room every 3.2 m (a bay: the width of room 01), so every
// door has the same wall around it. The building's core is modelled on the Science and Engineering
// Offices of the University of Illinois at Chicago Circle (13 stories, 1968; its floor plans and 1968
// photos: docs/research/vr/12-whole-building.md): in the middle of the
// south wall, facing room 101 (door 1), the elevator hall, one bay wide and two deep, two elevators on
// each side of it (a car with its shaft takes about one bay on that plan, so the core takes the middle
// three bays); a stair in each bay beyond it, so every floor has two stairs, remote from each other,
// and no dead end past 20 ft (The BOCA Basic Building Code/1978, 609.2, 607.3, 610.2). On this, the
// entrance floor, the hall leads out of the building. Rooms are numbered from the hall (university
// room numbering: Northwestern, Georgia Tech, Smithsonian guidelines); every door's latch is on the
// side toward it, and its sign is on the leaf (brand.js). Pure: no A-Frame, so tests read it in node.
import { hangY, BOARD_REACH } from '../../engine/ui/sheet-math.js';
import { EYE } from '../../engine/recenter-math.js';

export const PLAN = {
  from: -6.6, to: 8.0,          // the end walls' faces (x), a whole number of 0.2 m blocks
  north: 1.8, south: 3.6,       // the long walls' corridor faces (z); each wall 0.2 m thick
  thick: 0.2,
  bay: 3.2,
  entrance: 0.7,                // the elevator hall (south) and room 101 (north) face each other here
  opening: 1.0,                 // a masonry opening, door 3'0" in its 2 in frame
  bays: [-2, -1, 0, 1, 2],      // bay index along the corridor, 0 at the entrance
  stairs: [-2, 2],              // the south wall's bays with a stair behind them
  core: [-1, 0, 1],             // the south wall's bays the elevator core takes: the hall in 0, the cars beside it
  // the hall: as wide as its bay less a wall's thickness (its walls on the 0.2 m module), two bays deep
  hall: { w: 3.0, deep: 6.4 },
  floor: 1,                     // the hundreds of every room number on this floor
  // the experimenter's board left of room 101 (its edges on the block joints), and the
  // extinguisher opposite it
  // the clipboard hangs by its ring on a peg (hook: its height, peg: its radius), placed so the
  // clipboard lies on the cork with its ring below the frame; in depth, as framed cork boards are
  // made: an aluminium body on the wall (body), a lip round its front (border wide, lip deep), the
  // cork inside the lip, 1/4 in thick (S21) on the body and 3 mm below the lip's face
  board: { x: -0.8, y: 1.5, w: 1.6, h: 1.0, hook: 1.92, peg: 0.005, body: 0.03, border: 0.044, lip: 0.009, cork: 0.00635 },
  // opposite the board's west half: its middle, opposite the board's, is the hall's edge now
  extinguisher: -1.4
};

const round = (v) => Math.round(v * 1e4) / 1e4;

// the cork's face (z), what is pinned or hung on the board lies on
export const CORK_Z = round(PLAN.north + PLAN.board.body + PLAN.board.cork);
// the clipboard's home: hanging by its ring on the board's peg, its back on the cork (half a
// millimetre off it, the back face hidden)
export const SHEET_HOME = { pos: [PLAN.board.x, round(hangY(PLAN.board.hook, PLAN.board.peg)), round(CORK_Z + 0.0005 + BOARD_REACH.back)], yaw: 0, away: [0, 0, 1] };
// The player arrives facing door 1, the thing to do first. The corridor is a place to
// stand and walk: a seated player sees it from standing eye height (lift); a room whose
// original was seated puts its chair under them instead.
export const SPOT = { x: 0.7, z: 3.05, yaw: 0, lift: true };
// how far the clipboard on its hook is from the eyes at the arrival spot: its hook pages are read
// from there, so their lines are set for this distance (sheet-math.js, letterFrom)
export const HOOK_READ = round(Math.hypot(SPOT.x - SHEET_HOME.pos[0], EYE - SHEET_HOME.pos[1], SPOT.z - SHEET_HOME.pos[2]));
// the doors: north wall rooms in every bay; on the south wall the two stairs' doors (the hall is an
// opening, the cars' shafts plain wall)
const doors = [
  ...PLAN.bays.map((k) => ({ x: round(PLAN.entrance + k * PLAN.bay), k, wall: 'north', kind: k === 0 ? 'room1' : 'soon' })),
  ...PLAN.stairs.map((k) => ({ x: round(PLAN.entrance + k * PLAN.bay), k, wall: 'south', kind: 'stairs' }))
];
// Room numbers as on the plan drawing: 101 faces the elevator hall; from there odd numbers run to
// the left (west) and even ones to the right (east) of a player facing it, the north wall first,
// then the south, each away from the entrance. A plaque shows only its number until the room
// is done (brand.js).
const side = (sign) => doors.filter((d) => d.kind !== 'stairs' && Math.sign(d.k) === sign)
  .sort((a, b) => (a.wall === b.wall ? Math.abs(a.k) - Math.abs(b.k) : a.wall === 'north' ? -1 : 1));
const number = new Map([[doors.find((d) => d.kind === 'room1'), 1]]);
side(-1).forEach((d, i) => number.set(d, 3 + 2 * i));
side(1).forEach((d, i) => number.set(d, 2 + 2 * i));
export const DOORS = doors.map((d) => {
  const { k, ...door } = d;
  return number.has(d) ? { ...door, number: String(PLAN.floor * 100 + number.get(d)) } : door;
});
// the door whose room is built, and its number: the room writes it on its own side of the wall too
export const ROOM1_DOOR = DOORS.find((d) => d.kind === 'room1');
export const ROOM1_NUMBER = ROOM1_DOOR.number;

// Where a room stands behind its door. A room is built in its own metres (src/rooms/NN-name/scene.js)
// and says where its doorway is (DOORWAY): the middle of the opening on its wall's inside face, its
// corridor beyond it along +z. The corridor turns it so that +z faces the door's wall and moves it so
// the doorway lies in the door's opening: a room off the north wall stands as built, one off the
// south wall half turned. Its place: { x, z, yaw } in the corridor's metres, yaw in degrees.
export function roomPlace(door, doorway) {
  if (door.wall === 'north') return { x: round(door.x - doorway.x), z: round(PLAN.north - PLAN.thick - doorway.z), yaw: 0 };
  return { x: round(door.x + doorway.x), z: round(PLAN.south + PLAN.thick + doorway.z), yaw: 180 };
}
// a room's point (and a heading, degrees, 0 facing -z) in the corridor's metres
export function toCorridor(place, { x, z, yaw = 0 }) {
  const s = place.yaw ? -1 : 1;
  return { x: round(place.x + s * x), z: round(place.z + s * z), yaw: (yaw + place.yaw) % 360 };
}
// a room's rectangle { minX, maxX, minZ, maxZ } in the corridor's metres
export function areaToCorridor(place, area) {
  const a = toCorridor(place, { x: area.minX, z: area.minZ }), b = toCorridor(place, { x: area.maxX, z: area.maxZ });
  return { minX: Math.min(a.x, b.x), maxX: Math.max(a.x, b.x), minZ: Math.min(a.z, b.z), maxZ: Math.max(a.z, b.z) };
}

// along x, toward the entrance: the side of a door's latch (east for the middle doors)
export const toEntrance = (x) => (x < PLAN.entrance - 1e-6 ? 1 : x > PLAN.entrance + 1e-6 ? -1 : 1);
// a wall sign's centre beside a door's latch: half the opening, the frame's 11 mm beyond it, then
// the distance from the frame to the sign's centre
export const plaqueX = (x, fromFrame) => round(x + toEntrance(x) * (PLAN.opening / 2 + 0.0112 + fromFrame));

// the corridor's wall faces (for what must stay inside them) and its floor space for the grids
export const WALLS = { minX: PLAN.from, maxX: PLAN.to, minZ: PLAN.north, maxZ: PLAN.south };
export const CENTRE = { x: round((PLAN.from + PLAN.to) / 2), z: round((PLAN.north + PLAN.south) / 2) };
export const LENGTH = round(PLAN.to - PLAN.from);
export const WIDTH = round(PLAN.south - PLAN.north);
// where the head may go: 0.3 m from the long walls and ends, 0.25 m from the south wall
export const BOUNDS = { minX: round(PLAN.from + 0.3), maxX: round(PLAN.to - 0.3), minZ: round(PLAN.north + 0.3), maxZ: round(PLAN.south - 0.25) };

// The elevator hall's wall faces: its side walls run from the corridor's south face through the
// opening to its far wall, two bays beyond the wall's room side; and its floor space for the grids
export const HALL = {
  minX: round(PLAN.entrance - PLAN.hall.w / 2), maxX: round(PLAN.entrance + PLAN.hall.w / 2),
  minZ: PLAN.south, maxZ: round(PLAN.south + PLAN.thick + PLAN.hall.deep)
};
export const HALL_CENTRE = { x: round((HALL.minX + HALL.maxX) / 2), z: round((HALL.minZ + HALL.maxZ) / 2) };
export const HALL_LENGTH = round(HALL.maxZ - HALL.minZ);
// where the head may go in the hall: 0.3 m from its walls, and back into the corridor, so the two
// areas overlap and moving passes from one to the other
export const HALL_BOUNDS = { minX: round(HALL.minX + 0.3), maxX: round(HALL.maxX - 0.3), minZ: round(PLAN.north + 0.3), maxZ: round(HALL.maxZ - 0.3) };
export const AREAS = [BOUNDS, HALL_BOUNDS];
export const SPACES = [WALLS, HALL];
// The four cars' doors, two on each side wall of the hall, each in the middle of its car's bay
// (the 1968 plan: two cars stacked along each side of the hall, facing across it); facing: the
// way the door faces along x
export const CARS = [-1, 1].flatMap((side) => [0, 1].map((i) => ({
  x: side < 0 ? HALL.minX : HALL.maxX, z: round(PLAN.south + PLAN.thick + (i + 0.5) * PLAN.bay), facing: -side
})));

// the pieces of a long wall between its openings, [from, to] along x (the south wall's include the
// hall's)
export function wallRuns(wall) {
  const cuts = DOORS.filter((d) => d.wall === wall).map((d) => [d.x - PLAN.opening / 2, d.x + PLAN.opening / 2]);
  if (wall === 'south') cuts.push([HALL.minX, HALL.maxX]);
  cuts.sort((a, b) => a[0] - b[0]);
  const runs = [];
  let at = PLAN.from;
  for (const [a, b] of cuts) { runs.push([round(at), round(a)]); at = b; }
  runs.push([round(at), PLAN.to]);
  return runs.filter(([a, b]) => b - a > 1e-6);
}
