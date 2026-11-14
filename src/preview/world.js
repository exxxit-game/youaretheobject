import { FLIGHT, FLIGHT_RAMP, PLAN, flightViewHeight } from './route.js';
import { GRID, jointOrigin } from '../engine/tile-math.js';
import { DOORS, ROOM } from './layout.js';

const { hall, left, right, landing, sill, handrail, halfRise, floorRise } = PLAN;
const mid = (a, b) => (a + b) / 2;
const material = (color, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });
const landingDepth = 0.24;
const fixtureHeight = 0.041;
const landingLampCentre = floorRise - landingDepth - fixtureHeight / 2;

// The dimensions are provisional. Keep the fixed landmarks from the footage: a short vestibule,
// two visible flights, a window at the half landing, dark bars and the pale edge of the flight.
export function buildWorld(root) {
  const plaster = material('#d8d7d2');
  const pale = material('#dad8cc');
  const concrete = material('#858583');
  const metal = material('#292a2a', 0.42);
  const trim = material('#3e3e3c');
  const door = material('#555451');
  const windowDark = material('#20272d', 0.27);
  const frame = material('#4c3b31');
  const pictureWidth = 0.42;
  const pictureShape = new THREE.PlaneGeometry(pictureWidth, pictureWidth * 1360 / 1024);
  const pictureMap = new THREE.TextureLoader().load(new URL('../../vendor/art/arcimboldo-vegetable-gardener.jpg', import.meta.url).href);
  pictureMap.colorSpace = THREE.SRGBColorSpace;
  pictureMap.anisotropy = 8;
  const pictureMaterial = new THREE.MeshStandardMaterial({ map: pictureMap, roughness: 1 });
  const lightFace = new THREE.MeshBasicMaterial({ color: '#f2eee3' });
  const boxes = new Map();
  const coveredSlabs = [];

  function box(x, y, z, w, h, d, mat, covered = false) {
    const transform = new THREE.Object3D();
    transform.position.set(x, y, z);
    transform.scale.set(w, h, d);
    if (covered) coveredSlabs.push(transform);
    else {
      if (!boxes.has(mat)) boxes.set(mat, []);
      boxes.get(mat).push(transform);
    }
    return transform;
  }

  function beam(a, b, width, depth, mat) {
    const from = new THREE.Vector3(...a);
    const to = new THREE.Vector3(...b);
    const along = to.clone().sub(from);
    const center = from.addScaledVector(along, 0.5);
    const mesh = box(center.x, center.y, center.z, width, along.length(), depth, mat);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), along.normalize());
  }

  function wallX(x0, x1, y0, y1, z, mat = plaster) {
    return box(mid(x0, x1), mid(y0, y1), z, x1 - x0, y1 - y0, 0.08, mat);
  }

  function lightAt(x, y, z, strength) {
    const light = new THREE.PointLight('#fff5de', strength, 3.1, 2);
    light.position.set(x, y - 0.13, z);
    root.add(light);
  }

  function lamp(x, y, z, strength) {
    box(x, y, z, 0.57, fixtureHeight, 0.12, lightFace);
    lightAt(x, y, z, strength);
  }

  const ambient = new THREE.HemisphereLight('#f2f1ee', '#57534b', 0.73);
  root.add(ambient);

  function floorMaterial() {
    const width = hall.maxX - hall.minX;
    const depth = hall.maxZ - hall.minZ;
    // Reuse the old corridor's balanced cuts and provisional tile size. Dimensions
    // from the owner's stairwell will replace the reference size after measurement.
    const tile = GRID.linoleum.tile;
    const originX = jointOrigin(mid(hall.minX, hall.maxX), width, tile);
    const originZ = jointOrigin(mid(hall.minZ, hall.maxZ), depth, tile);
    const scale = 128;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(depth * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(canvas.width / width, canvas.height / depth);
    ctx.translate(-hall.minX, -hall.minZ);
    ctx.fillStyle = '#4b4e4c';
    ctx.fillRect(hall.minX, hall.minZ, width, depth);
    const colors = ['#646565', '#686866', '#626362', '#6c6d6a'];
    for (let i = Math.floor((hall.minX - originX) / tile); originX + i * tile < hall.maxX; i++) {
      const x = originX + i * tile;
      for (let j = Math.floor((hall.minZ - originZ) / tile); originZ + j * tile < hall.maxZ; j++) {
        const z = originZ + j * tile;
        const light = x > -tile && x < tile && (i + j) % 2 === 0;
        ctx.fillStyle = light ? '#aaa9a1' : colors[Math.abs(i * 13 + j * 7 + i * j) % colors.length];
        ctx.fillRect(x + 0.001, z + 0.001, tile - 0.002, tile - 0.002);
      }
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return new THREE.MeshStandardMaterial({ map, roughness: 0.68 });
  }

  const floorShape = new THREE.PlaneGeometry(hall.maxX - hall.minX, hall.maxZ - hall.minZ);
  const floorFace = floorMaterial();

  function floor(y) {
    const mesh = new THREE.Mesh(floorShape, floorFace);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(mid(hall.minX, hall.maxX), y, hall.maxZ / 2);
    root.add(mesh);
  }

  function entryDoor(x, y, south) {
    const z = south ? hall.maxZ - 0.05 : 0.05, facing = south ? -1 : 1;
    box(x, y + 1.03, z, 0.94, 2.06, 0.042, trim);
    box(x, y + 1.02, z + facing * 0.03, 0.85, 2.01, 0.025, door);
    box(x + 0.28, y + 1.02, z + facing * 0.08, 0.105, 0.023, 0.05, metal);
  }

  function roomLevel(y, top) {
    const x = mid(ROOM.minX, ROOM.maxX), z = mid(ROOM.minZ, ROOM.maxZ);
    box(x, y - 0.065, z, ROOM.maxX - ROOM.minX, 0.13, ROOM.maxZ - ROOM.minZ, concrete);
    box(x, top, z, ROOM.maxX - ROOM.minX, 0.13, ROOM.maxZ - ROOM.minZ, plaster);
    wallX(ROOM.minX, ROOM.maxX, y, top, ROOM.maxZ);
    for (const edge of [ROOM.minX, ROOM.maxX]) box(edge, mid(y, top), z, 0.08, top - y, ROOM.maxZ - ROOM.minZ, plaster);
    lamp(x, top - 0.08, z, 2.2);
  }

  function hallSide(end, stairEdge, y, top) {
    const minX = Math.min(end, stairEdge), maxX = Math.max(end, stairEdge);
    const inward = Math.sign(stairEdge - end);
    const middle = mid(hall.minZ, hall.maxZ);
    wallX(minX, maxX, y, top, hall.minZ);
    wallX(minX, maxX, y, y + 0.085, hall.minZ + 0.045, trim);
    box(end, mid(y, top), middle, 0.08, top - y, hall.maxZ - hall.minZ, plaster);
    box(end + inward * 0.053, y + 1.58, middle, 0.026, 0.64, 0.50, frame);
    const picture = new THREE.Mesh(pictureShape, pictureMaterial);
    picture.name = 'end-picture';
    picture.position.set(end + inward * 0.067, y + 1.58, middle);
    picture.rotation.y = inward * Math.PI / 2;
    // Compare the two orientations in a single walk, as in the old lobby's first visit.
    if (inward < 0) picture.rotateZ(Math.PI);
    root.add(picture);
  }

  function hallLevel(y) {
    const top = y + floorRise - 0.13;
    floor(y);
    const a = ROOM.doorX - ROOM.doorWidth / 2, b = ROOM.doorX + ROOM.doorWidth / 2;
    wallX(hall.minX, a, y, top, hall.maxZ);
    wallX(b, hall.maxX, y, top, hall.maxZ);
    wallX(a, b, y + ROOM.doorHeight, top, hall.maxZ);
    roomLevel(y, top);
    hallSide(hall.minX, left.minX, y, top);
    hallSide(hall.maxX, right.maxX, y, top);
    const soffit = top - 0.065;
    const slabTop = y + floorRise;
    box(mid(hall.minX, hall.maxX), mid(soffit, slabTop), 0.9,
      hall.maxX - hall.minX, slabTop - soffit, 1.8, plaster, y < floorRise);
    for (const d of DOORS) if (!d.working) entryDoor(d.x, y, d.side === 'south');
    for (const x of [-5.6, -2.4, 1.7, 4.1]) lamp(x, top - 0.08, 0.9, 2.2);
    // A shallow beam and side pier reveal the stairwell after the turn.
    box(-3.22, y + 2.4, 0.9, 0.22, 0.43, 1.8, plaster);
    box(-3.22, y + 1.18, 0.07, 0.22, 2.36, 0.12, plaster);
  }

  for (const y of [-floorRise, 0, floorRise]) hallLevel(y);

  // Guard lights keep illumination periodic during a floor change. Their range is
  // shorter than two floors, so the three visible halls receive the same neighbours.
  for (const y of [-2 * floorRise, 2 * floorRise]) {
    for (const x of [-5.6, -2.4, 1.7, 4.1]) lightAt(x, y + floorRise - 0.21, 0.9, 2.2);
  }
  lightAt(0.55, -3 * floorRise + halfRise + landingLampCentre, landing.minZ + 0.32, 3.6);

  function flight(lane, y, startZ, direction, railX) {
    const zAt = distance => startZ + distance * direction;
    const width = lane.maxX - lane.minX;
    const center = mid(lane.minX, lane.maxX);
    for (const tread of FLIGHT) {
      const length = tread.to - tread.from;
      const top = y + tread.height;
      box(center, top - tread.depth / 2, zAt(mid(tread.from, tread.to)), width, tread.depth, length, concrete);
      box(railX, top - 0.119, zAt(mid(tread.from, tread.to)), 0.045, 0.24, length, pale);
      if (tread.height > 0) {
        box(center, top - 0.018, zAt(tread.from + 0.026), width, 0.033, 0.045, pale);
      }
      const posts = Math.ceil(length / 0.16);
      for (let i = 0; i < posts; i++) {
        const distance = tread.from + (i + 0.5) * length / posts;
        const postTop = y + flightViewHeight(distance) + 0.93;
        box(railX, mid(top, postTop), zAt(distance), 0.021, postTop - top, 0.021, metal);
      }
    }
    for (let i = 1; i < FLIGHT_RAMP.length; i++) {
      const from = FLIGHT_RAMP[i - 1];
      const to = FLIGHT_RAMP[i];
      const railPoint = (distance, offset) => [railX, y + flightViewHeight(distance) + offset, zAt(distance)];
      beam(railPoint(from, 0.93), railPoint(to, 0.93), handrail.width, handrail.depth, metal);
      beam(railPoint(from, 0.24), railPoint(to, 0.24), 0.026, 0.027, metal);
    }
  }

  const stairBottom = -2 * floorRise - 0.2;
  const stairTop = 3 * floorRise - 0.12;
  const zBack = landing.minZ;
  const rearWallFace = zBack - 0.02;
  for (const x of [-0.04, right.maxX + 0.04]) {
    box(x, mid(stairBottom, stairTop), rearWallFace / 2, 0.08, stairTop - stairBottom, -rearWallFace, plaster);
  }
  wallX(0, right.maxX, stairBottom, stairTop, rearWallFace - 0.04);
  box(right.maxX / 2, stairTop, rearWallFace / 2, right.maxX, 0.12, -rearWallFace, plaster);

  function windowAt(y) {
    const x = right.maxX / 2;
    box(x, y + 1.23, zBack - 0.011, 1.25, 1.7, 0.04, pale);
    box(x, y + 1.23, zBack + 0.018, 1.12, 1.57, 0.03, windowDark);
    box(x, y + 1.23, zBack + 0.04, 0.055, 1.61, 0.026, pale);
    box(x, y + 0.96, zBack + 0.04, 1.17, 0.058, 0.026, pale);
    box(sill.x, y + sill.y, sill.z, sill.width, sill.height, sill.depth, pale);
  }

  for (const y of [-2 * floorRise, -floorRise, 0, floorRise]) {
    const h = y + halfRise;
    const zFar = right.minZ;
    flight(right, y, right.maxZ, -1, right.minX);
    flight(left, h, left.minZ, 1, left.maxX);
    box(right.maxX / 2, h - landingDepth / 2, mid(rearWallFace, zFar), right.maxX, landingDepth, zFar - rearWallFace, concrete);
    windowAt(h);
    lamp(0.55, h + landingLampCentre, zBack + 0.32, 3.6);
  }

  // The repeated steps, rails and walls are fixed, so render each material in one batch.
  function addBoxes(geometry, mat, transforms) {
    const mesh = new THREE.InstancedMesh(geometry, mat, transforms.length);
    if (mat === door) mesh.name = 'fixed-door-leaves';
    transforms.forEach((transform, index) => {
      transform.updateMatrix();
      mesh.setMatrixAt(index, transform.matrix);
    });
    root.add(mesh);
  }
  const unit = new THREE.BoxGeometry(1, 1, 1);
  for (const [mat, transforms] of boxes) addBoxes(unit, mat, transforms);

  // The next hall's tile plane is already the top face of each covered slab.
  const slab = unit.clone();
  const top = slab.groups[2]; // +Y in BoxGeometry
  const indices = Array.from(slab.index.array);
  indices.splice(top.start, top.count);
  slab.setIndex(indices);
  slab.clearGroups();
  addBoxes(slab, plaster, coveredSlabs);
}
