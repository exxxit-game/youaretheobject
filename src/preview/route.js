import { inside } from '../engine/locomotion-math.js';
import { HALL, ROOM, OPEN_LEAF } from './layout.js';

const steps = 8;
const rise = 0.18;
const going = 0.29;
const lowApproach = 0.22;
const halfRise = steps * rise;
const turnZ = -3.04;
const landing = { minX: 0, maxX: 2.68, minZ: -4.42, maxZ: turnZ };
const centre = landing.maxX / 2;
const innerLeft = centre - 0.08;
const innerRight = centre + 0.08;
const flightEdges = [0, ...Array.from({ length: steps }, (_, i) => lowApproach + i * going), -turnZ];
export const FLIGHT = flightEdges.slice(0, -1).map((from, i) => ({
  from, to: flightEdges[i + 1], height: i * rise, depth: i === 0 || i === steps ? 0.24 : 0.32
}));
const blendStart = lowApproach - going / 2;
const blendEnd = flightEdges.at(-2) + going / 2;
export const FLIGHT_RAMP = [0, blendStart, blendEnd, -turnZ];

export function flightViewHeight(distance) {
  return Math.max(0, Math.min(halfRise, (distance - blendStart) * rise / going));
}

function treadHeight(distance) {
  return FLIGHT.findLast(tread => distance >= tread.from - 1e-9)?.height ?? 0;
}

export const PLAN = {
  hall: HALL,
  right: { minX: innerRight, maxX: landing.maxX, minZ: turnZ, maxZ: 0 },
  left: { minX: 0, maxX: innerLeft, minZ: turnZ, maxZ: 0 },
  landing,
  sill: { x: landing.maxX / 2, z: landing.minZ + 0.079, y: 0.38, width: 1.38, depth: 0.24, height: 0.06 },
  extinguisher: { x: centre - 0.8, wall: HALL.maxZ - 0.04, halfWidth: 0.16, depth: 0.22 },
  handrail: { width: 0.055, depth: 0.054 },
  rise, halfRise, floorRise: 2 * halfRise
};

export const ANCHORS = {
  start: { x: -6.9, y: 0, z: 0.9, yaw: -90, pitch: 0 },
  turn: { x: 2.02, y: 0, z: 0.62, yaw: 0, pitch: 0 },
  overlap: { x: 0.98, y: PLAN.halfRise, z: -3.73, yaw: -152, pitch: -29 },
  top: { x: 0.62, y: PLAN.floorRise, z: 0.62, yaw: 36, pitch: -12 },
  below: { x: 2.02, y: -PLAN.floorRise, z: 0.62, yaw: -36, pitch: -12 }
};

export function upperNumber(search) {
  return new URLSearchParams(search).get('upper') === '8' ? '8' : '9';
}

export function floorNumber(floor, search) {
  return upperNumber(search) === '8' ? '8' : String(8 + floor);
}

const MARGIN = 0.14;
const MAX_STEP = 0.05;
const railHalfWidth = PLAN.handrail.width / 2;
const mount = PLAN.extinguisher;
const mountClearance = { minX: mount.x - mount.halfWidth - MARGIN, maxX: mount.x + mount.halfWidth + MARGIN,
  minZ: mount.wall - mount.depth - MARGIN, maxZ: HALL.maxZ };
const sill = PLAN.sill;
const sillMinX = sill.x - sill.width / 2 - MARGIN;
const sillMaxX = sill.x + sill.width / 2 + MARGIN;
const sillFront = sill.z + sill.depth / 2 + MARGIN;

// Keep coordinates small while retaining the visited floor. Rebase only after reaching
// a full hall, never on the half landing. Repeated geometry stays fixed (Epic, World
// Composition, origin shifting). The tracked VR head must later remain inside a rig.
export function recenter(position) {
  const floors = Math.round(position.y / PLAN.floorRise);
  if (position.z < MARGIN || floors === 0) return position;
  return { ...position, y: position.y - floors * PLAN.floorRise, floor: (position.floor ?? 0) + floors };
}

export function viewHeight(position) {
  const { x, y, z } = position;
  if (z <= turnZ || z >= 0) return y;
  const distance = x >= centre ? -z : z - turnZ;
  return y + flightViewHeight(distance) - treadHeight(distance);
}

function withinLane(x, lane, innerLeft = 0, innerRight = 0) {
  return x >= lane.minX + MARGIN + innerLeft && x <= lane.maxX - MARGIN - innerRight;
}

function hitsSill(from, x, z) {
  if (from.z >= sillFront && z >= sillFront) return false;

  if (from.z < sillFront && from.x > sillMinX && from.x < sillMaxX) {
    // A pose already in the sill margin can leave along a nearest edge, even in small steps.
    const left = from.x - sillMinX;
    const right = sillMaxX - from.x;
    const front = sillFront - from.z;
    const nearest = Math.min(left, right, front);
    return !((left === nearest && x < from.x) || (right === nearest && x > from.x) ||
      (front === nearest && z > from.z));
  }

  // Test the portion of the move behind the front edge. The back of the sill
  // extends past the walkable area, so only the front and side edges are reachable.
  let startX = from.x;
  let endX = x;
  if (from.z >= sillFront || z >= sillFront) {
    const atFront = from.x + (x - from.x) * (sillFront - from.z) / (z - from.z);
    if (from.z >= sillFront) startX = atFront;
    else endX = atFront;
  }
  return Math.max(startX, endX) > sillMinX && Math.min(startX, endX) < sillMaxX;
}

function floorHeight(x, z, previousY, doorOpen) {
  const { hall, right, left, landing, floorRise } = PLAN;
  const onRight = withinLane(x, right, railHalfWidth);
  const onLeft = withinLane(x, left, 0, railHalfWidth);
  let height;

  if (inside(x, z, mountClearance)) return null;

  if (doorOpen && inside(x, z, { minX: OPEN_LEAF.minX - MARGIN, maxX: OPEN_LEAF.maxX + MARGIN,
    minZ: OPEN_LEAF.minZ - MARGIN, maxZ: OPEN_LEAF.maxZ + MARGIN })) return null;

  if (doorOpen && z > hall.maxZ - MARGIN) {
    // A narrow overlapping passage joins the two areas (locomotion-math.js).
    // The rest of the dividing wall stays solid from either side.
    const passage = Math.abs(x - ROOM.doorX) <= ROOM.clearWidth / 2 - MARGIN;
    const room = { minX: ROOM.minX + MARGIN, maxX: ROOM.maxX - MARGIN,
      minZ: ROOM.minZ + MARGIN, maxZ: ROOM.maxZ - MARGIN };
    if (z <= room.minZ ? !passage : !inside(x, z, room)) return null;
    height = 0;
  } else if (z >= hall.minZ) {
    if (!withinLane(x, hall) || z > hall.maxZ - MARGIN) return null;
    if (!onRight && !onLeft && z < hall.minZ + MARGIN) return null;
    height = 0;
  } else if (z < turnZ) {
    if (!withinLane(x, landing) || z < landing.minZ + MARGIN) return null;
    if (!onRight && !onLeft && z > turnZ - MARGIN) return null;
    height = halfRise;
  } else {
    if (!onRight && !onLeft) return null;
    height = onRight ? treadHeight(-z) : treadHeight(z - turnZ) - halfRise;
  }
  return height + Math.round((previousY - height) / floorRise) * floorRise;
}

function step(position, x, z, doorOpen) {
  if (hitsSill(position, x, z)) return position;
  const y = floorHeight(x, z, position.y, doorOpen);
  return y !== null && Math.abs(y - position.y) <= rise + 1e-9
    ? recenter({ ...position, x, y, z, floor: position.floor ?? 0 }) : position;
}

export function walk(position, dx, dz, doorOpen = false) {
  const distance = Math.hypot(dx, dz);
  if (!Number.isFinite(distance) || distance === 0) return position;
  const count = Math.ceil(distance / MAX_STEP);
  dx /= count;
  dz /= count;
  for (let i = 0; i < count; i++) {
    const next = step(position, position.x + dx, position.z + dz, doorOpen);
    if (next !== position) {
      position = next;
    } else {
      position = step(position, position.x + dx, position.z, doorOpen);
      position = step(position, position.x, position.z + dz, doorOpen);
    }
  }
  return position;
}
