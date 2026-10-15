// Where the corridor stands a room behind its door (src/app/lobby/plan.js, roomPlace): its doorway
// lands in the door's opening, its inside beyond the wall, never in the corridor, and the player
// facing into the room faces away from the door, on either long wall. Room 01 stands as built,
// so its approved look and every measure taken in it hold.
import assert from 'node:assert/strict';
import { PLAN, DOORS, ROOM1_DOOR, roomPlace, toCorridor, areaToCorridor } from '../src/app/lobby/plan.js';
import { DOORWAY, BOOTH } from '../src/rooms/01-control/scene.js';

const near = (a, b) => Math.abs(a - b) < 1e-9;
assert.deepEqual(roomPlace(ROOM1_DOOR, DOORWAY), { x: 0, z: 0, yaw: 0 }, 'room 01 does not stand as built behind door 101');

for (const door of DOORS.filter((d) => d.kind !== 'stairs')) {
  const at = roomPlace(door, DOORWAY), north = door.wall === 'north';
  const inDoor = toCorridor(at, DOORWAY);
  const face = north ? PLAN.north - PLAN.thick : PLAN.south + PLAN.thick;
  assert.ok(near(inDoor.x, door.x) && near(inDoor.z, face), `door ${door.number}: the doorway lands at ${inDoor.x} ${inDoor.z}, not in its opening`);
  // the far wall's middle, and the room's whole floor, lie beyond the door's wall
  const back = toCorridor(at, { x: 0, z: BOOTH.minZ });
  assert.ok(north ? back.z < face : back.z > face, `door ${door.number}: the room stands in the corridor`);
  const floor = areaToCorridor(at, BOOTH);
  assert.ok(floor.minX < floor.maxX && floor.minZ < floor.maxZ, `door ${door.number}: the room's floor turned inside out`);
  assert.ok(north ? floor.maxZ <= face + 1e-9 : floor.minZ >= face - 1e-9, `door ${door.number}: the room's floor reaches into the corridor`);
  // facing into the room (0: along the room's -z) is facing away from the door's wall
  const heading = toCorridor(at, { x: 0, z: 0, yaw: 0 }).yaw;
  assert.equal(heading, north ? 0 : 180, `door ${door.number}: a player facing the room's far wall faces ${heading}`);
}
console.log('plan tests: ok');
