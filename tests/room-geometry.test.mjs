import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createGeometryCapture } from '../tools/xr-room-geometry.mjs';
import { saveGeometry } from '../tools/xr-room-save.mjs';

const transform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2.125, 0.75, -3.25, 1]);
const vertices = new Float32Array([0, 0, 0, 1.123456, 0, 0, 0, 0, 1]);
const indices = new Uint32Array([0, 1, 2]);
const mesh = () => ({ vertices, indices, meshSpace: {}, semanticLabel: 'floor', lastChangedTime: 1 });
const first = mesh(), second = mesh();
const plane = { planeSpace: {}, polygon: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }],
  semanticLabel: 'floor', orientation: 'horizontal', lastChangedTime: 1 };
let posed = true;
const frame = { detectedMeshes: new Set([first, second]), detectedPlanes: new Set([plane]),
  getPose: () => posed ? { transform: { matrix: transform } } : null };
const capture = createGeometryCapture('test-session');
const snapshot = capture(frame, {}, 150, 0);
assert.equal(snapshot.meshes.length, 2, 'equal labels and geometry remain separate objects');
assert.notEqual(snapshot.meshes[0].id, snapshot.meshes[1].id);
assert.deepEqual(snapshot.meshes[0].indices, [0, 1, 2], 'the floor triangles are retained');
assert.equal(snapshot.meshes[0].vertices[3], vertices[3], 'coordinates retain the browser precision');
assert.deepEqual(snapshot.planes[0].polygon[2], [0, 0, 1]);
assert.equal(snapshot.meshes[0].matrix[12], 2.125);
vertices[3] = 9;
transform[12] = 4;
const moved = capture(frame, {}, 200, 1);
assert.equal(moved.meshes[0].id, snapshot.meshes[0].id);
assert.equal(moved.meshes[0].matrix[12], 4, 'pose refreshes even when lastChangedTime stays the same');
assert.equal(snapshot.meshes[0].matrix[12], 2.125, 'the earlier matrix is an independent copy');
assert.notEqual(snapshot.meshes[0].vertices[3], vertices[3], 'later buffers cannot change the snapshot');
assert.equal(moved.referenceEpoch, 1);

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'room-geometry-'));
const target = path.join(temporary, 'room.json');
const partial = path.join(temporary, 'partial.json');
try {
  const saved = saveGeometry(snapshot, target);
  assert.equal(saved.triangles, 2);
  assert.ok(saved.bytes > 0);
  assert.deepEqual(JSON.parse(fs.readFileSync(target, 'utf8')), snapshot, 'the verified file contains the exact snapshot');
  assert.throws(() => saveGeometry(moved, target), /EEXIST/, 'a retry cannot overwrite the previous capture');
  assert.deepEqual(JSON.parse(fs.readFileSync(target, 'utf8')), snapshot);
  assert.throws(() => saveGeometry(null, path.join(temporary, 'empty.json')), /No geometry/);
  assert.equal(fs.existsSync(path.join(temporary, 'empty.json')), false);
  const write = fs.writeFileSync;
  try {
    fs.writeFileSync = (file, data, ...options) => {
      if (typeof file !== 'number') return write(file, data, ...options);
      write(file, data.slice(0, 12), ...options);
      throw new Error('simulated partial write');
    };
    assert.throws(() => saveGeometry(snapshot, partial), /simulated partial write/);
    assert.equal(fs.existsSync(partial), false, 'a failed write leaves no misleading partial capture');
  } finally { fs.writeFileSync = write; }
} finally {
  if (fs.existsSync(target)) fs.unlinkSync(target);
  if (fs.existsSync(partial)) fs.unlinkSync(partial);
  fs.rmdirSync(temporary);
}
posed = false;
const missing = capture(frame, {}, 250, 1);
assert.equal(missing.meshes.length, 0);
assert.equal(missing.skipped.length, 3, 'objects with missing poses are reported');
posed = true;
first.indices = new Uint32Array([0, 1, 9]);
assert.throws(() => capture(frame, {}, 300), /index outside/);
first.indices = indices;
first.vertices = new Float32Array([NaN, 0, 0]);
assert.throws(() => capture(frame, {}, 300), /non-finite/);
console.log('room geometry: copied meshes, poses, verified file, retry and invalid data pass');
