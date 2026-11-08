import { PLAN } from './route.js';
import { GRID, jointOrigin } from '../engine/tile-math.js';
import { DOORS, ROOM } from './layout.js';

const { hall, left, right, landing, steps, rise, run, halfRise, floorRise } = PLAN;
const mid = (a, b) => (a + b) / 2;
const material = (color, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });

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
  const lightFace = new THREE.MeshBasicMaterial({ color: '#f2eee3' });
  const boxes = new Map();

  function box(x, y, z, w, h, d, mat) {
    const transform = new THREE.Object3D();
    transform.position.set(x, y, z);
    transform.scale.set(w, h, d);
    if (!boxes.has(mat)) boxes.set(mat, []);
    boxes.get(mat).push(transform);
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
    box(x, y, z, 0.57, 0.041, 0.12, lightFace);
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

  function hallLevel(y) {
    const top = y + floorRise - 0.13;
    floor(y);
    const a = ROOM.doorX - ROOM.doorWidth / 2, b = ROOM.doorX + ROOM.doorWidth / 2;
    wallX(hall.minX, a, y, top, hall.maxZ);
    wallX(b, hall.maxX, y, top, hall.maxZ);
    wallX(a, b, y + ROOM.doorHeight, top, hall.maxZ);
    roomLevel(y, top);
    wallX(hall.minX, 0, y, top, 0);
    wallX(right.maxX, hall.maxX, y, top, 0);
    wallX(hall.minX, 0, y, y + 0.085, 0.045, trim);
    wallX(right.maxX, hall.maxX, y, y + 0.085, 0.045, trim);
    box(hall.minX, mid(y, top), 0.9, 0.08, top - y, 1.8, plaster);
    box(hall.maxX, mid(y, top), 0.9, 0.08, top - y, 1.8, plaster);
    box(mid(hall.minX, hall.maxX), top, 0.9, hall.maxX - hall.minX, 0.13, 1.8, plaster);
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
  lightAt(0.55, -3 * floorRise + halfRise + 2.1, landing.minZ + 0.32, 3.6);

  function flight(lane, y, from, to, railX) {
    const direction = Math.sign(to - from);
    const width = lane.maxX - lane.minX;
    const center = mid(lane.minX, lane.maxX);
    beam([center, y - 0.13, from], [center, y + halfRise - 0.13, to], width, 0.16, plaster);
    for (let i = 0; i < steps; i++) {
      const z = from + (i + 0.5) * run * direction;
      const top = y + (i + 1) * rise;
      box(center, top - 0.16, z, width, 0.32, run, concrete);
      box(railX, top - 0.139, z, 0.045, 0.28, run, pale);
      box(center, top - 0.018, z - direction * (run / 2 - 0.026),
        width, 0.033, 0.045, pale);
      box(railX, top + 0.41, z, 0.021, 0.9, 0.021, metal);
      const nextZ = z + 0.12 * direction;
      box(railX, top + 0.425, nextZ, 0.018, 0.88, 0.018, metal);
    }
    beam([railX, y + 0.93, from], [railX, y + halfRise + 0.93, to], 0.055, 0.054, metal);
    beam([railX, y + 0.24, from], [railX, y + halfRise + 0.24, to], 0.026, 0.027, metal);
  }

  const stairBottom = -2 * floorRise - 0.2;
  const stairTop = 3 * floorRise - 0.12;
  const zBack = landing.minZ;
  for (const x of [-0.04, right.maxX + 0.04]) {
    box(x, mid(stairBottom, stairTop), zBack / 2, 0.08, stairTop - stairBottom, -zBack, plaster);
  }
  wallX(0, right.maxX, stairBottom, stairTop, zBack - 0.06);
  box(right.maxX / 2, stairTop, zBack / 2, right.maxX, 0.12, -zBack, plaster);

  function windowAt(y) {
    const x = right.maxX / 2;
    box(x, y + 1.23, zBack - 0.011, 1.25, 1.7, 0.04, pale);
    box(x, y + 1.23, zBack + 0.018, 1.12, 1.57, 0.03, windowDark);
    box(x, y + 1.23, zBack + 0.04, 0.055, 1.61, 0.026, pale);
    box(x, y + 0.96, zBack + 0.04, 1.17, 0.058, 0.026, pale);
    box(x, y + 0.38, zBack + 0.079, 1.38, 0.06, 0.24, pale);
  }

  for (const y of [-2 * floorRise, -floorRise, 0, floorRise]) {
    const h = y + halfRise;
    const zFar = right.minZ;
    flight(right, y, right.maxZ, zFar, right.minX);
    flight(left, h, left.minZ, left.maxZ, left.maxX);
    box(right.maxX / 2, h - 0.12, mid(zBack, zFar), right.maxX, 0.24, zFar - zBack, concrete);
    windowAt(h);
    lamp(0.55, h + 2.1, zBack + 0.32, 3.6);
  }

  // The repeated steps, rails and walls are fixed, so render each material in one batch.
  const unit = new THREE.BoxGeometry(1, 1, 1);
  for (const [mat, transforms] of boxes) {
    const mesh = new THREE.InstancedMesh(unit, mat, transforms.length);
    transforms.forEach((transform, index) => {
      transform.updateMatrix();
      mesh.setMatrixAt(index, transform.matrix);
    });
    root.add(mesh);
  }
}
