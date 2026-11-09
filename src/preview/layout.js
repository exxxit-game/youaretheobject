import { LEAF } from '../engine/door.js';

// Topology from the owner's sketch, not a measured survey. Door construction reuses
// engine/door.js; only the first south door has a room in this technical slice.
export const HALL = { minX: -7.6, maxX: 5.3, minZ: 0, maxZ: 1.8 };
export const ROOM = {
  minX: -7.6, maxX: -5.4, minZ: HALL.maxZ, maxZ: 4.7,
  doorX: -6.5, doorWidth: 1, doorHeight: 2.21,
  clearWidth: 0.88 // Clear of the stops and open leaf in engine/door.js.
};
export const DOORS = [
  ...[-6.5, -3.8, -1.1, 4.1].map((x, i) => ({ id: `south-${i}`, x, side: 'south', working: i === 0 })),
  ...[-6.5, -3.8, -1.3, 4.1].map((x, i) => ({ id: `north-${i}`, x, side: 'north', working: false }))
];
// The south leaf at +90 degrees, including the knob's 0.0587 m projection.
// Keep geometry and collision derived from the same old door construction.
export const OPEN_LEAF = {
  minX: ROOM.doorX + LEAF.w / 2 - LEAF.t - 0.06,
  maxX: ROOM.doorX + LEAF.w / 2 + 0.06,
  minZ: ROOM.minZ + 0.09, maxZ: ROOM.minZ + 0.09 + LEAF.w
};

export function nearDoor(p) {
  return Math.abs(p.y) < 0.05 && p.z <= HALL.maxZ && p.z >= 0.14 &&
    Math.hypot(p.x - ROOM.doorX, p.z - HALL.maxZ) <= 1.2;
}
export const inRoom = p => p.z > ROOM.minZ + 0.14 &&
  p.x >= ROOM.minX && p.x <= ROOM.maxX && p.z <= ROOM.maxZ;

export const BOOK_STAND = {
  x: ROOM.maxX - 0.43, z: ROOM.minZ + 1.9, width: 0.48, depth: 0.68
};

export function beginVisit(position, yaw, pitch) {
  if (!nearDoor(position) || !Number.isFinite(yaw) || !Number.isFinite(pitch)) return null;
  return { position: { ...position }, yaw, pitch };
}
export const returnVisit = visit => visit && ({ position: { ...visit.position }, yaw: visit.yaw, pitch: visit.pitch });
