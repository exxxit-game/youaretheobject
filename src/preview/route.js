const steps = 8;
const rise = 0.18;
const run = 0.38;
const halfRise = steps * rise;
const turnZ = -steps * run;

export const PLAN = {
  hall: { minX: -7.6, maxX: 5.3, minZ: 0, maxZ: 1.8 },
  right: { minX: 1.4, maxX: 2.68, minZ: turnZ, maxZ: 0 },
  left: { minX: 0, maxX: 1.24, minZ: turnZ, maxZ: 0 },
  landing: { minX: 0, maxX: 2.68, minZ: -4.42, maxZ: turnZ },
  steps, rise, run, halfRise, floorRise: 2 * halfRise
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

// Keep coordinates small while retaining the visited floor. Rebase only after reaching
// a full hall, never on the half landing. Repeated geometry stays fixed (Epic, World
// Composition, origin shifting). The tracked VR head must later remain inside a rig.
export function recenter(position) {
  const floors = Math.round(position.y / PLAN.floorRise);
  if (position.z < MARGIN || floors === 0) return position;
  return { ...position, y: position.y - floors * PLAN.floorRise, floor: (position.floor ?? 0) + floors };
}

function withinLane(x, lane) {
  return x >= lane.minX + MARGIN && x <= lane.maxX - MARGIN;
}

function floorHeight(x, z, previousY) {
  const { hall, right, left, landing, floorRise } = PLAN;
  const onRight = withinLane(x, right);
  const onLeft = withinLane(x, left);
  let height;

  if (z >= hall.minZ) {
    if (!withinLane(x, hall) || z > hall.maxZ - MARGIN) return null;
    if (!onRight && !onLeft && z < hall.minZ + MARGIN) return null;
    height = 0;
  } else if (z < turnZ) {
    if (!withinLane(x, landing) || z < landing.minZ + MARGIN) return null;
    if (!onRight && !onLeft && z > turnZ - MARGIN) return null;
    height = halfRise;
  } else {
    // Follow a slope through the steps. Each hall opens onto an ascent and a descent.
    if (!onRight && !onLeft) return null;
    height = z * rise / run * (onRight ? -1 : 1);
  }
  return height + Math.round((previousY - height) / floorRise) * floorRise;
}

function step(position, x, z) {
  const y = floorHeight(x, z, position.y);
  return y !== null && Math.abs(y - position.y) <= PLAN.rise
    ? recenter({ ...position, x, y, z, floor: position.floor ?? 0 }) : position;
}

export function walk(position, dx, dz) {
  const distance = Math.hypot(dx, dz);
  if (!Number.isFinite(distance) || distance === 0) return position;
  const count = Math.ceil(distance / MAX_STEP);
  dx /= count;
  dz /= count;
  for (let i = 0; i < count; i++) {
    const next = step(position, position.x + dx, position.z + dz);
    if (next !== position) {
      position = next;
    } else {
      position = step(position, position.x + dx, position.z);
      position = step(position, position.x, position.z + dz);
    }
  }
  return position;
}
