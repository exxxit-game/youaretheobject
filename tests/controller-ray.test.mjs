import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { answersScript } from '../tools/headset.mjs';

// No browser or rendering on the laptop. Exercise actual registered components,
// with a pose whose pointing axis differs from the held object's axis.
const components = {}, timers = new Map();
class Vector3 {
  set(x, y, z) { Object.assign(this, { x, y, z }); return this; }
  applyQuaternion(q) {
    const { x, y, z } = this;
    const ix = q.w * x + q.y * z - q.z * y, iy = q.w * y + q.z * x - q.x * z;
    const iz = q.w * z + q.x * y - q.y * x, iw = -q.x * x - q.y * y - q.z * z;
    return this.set(ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
      iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
      iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x);
  }
}
const context = { AFRAME: { registerComponent: (n, c) => { components[n] = c; } }, THREE: { Vector3 },
  setTimeout: (fn, ms) => { const id = {}; timers.set(id, { fn, ms }); return id; },
  clearTimeout: id => timers.delete(id) };
for (const name of ['controller-ray', 'controller-batch']) vm.runInNewContext(
  fs.readFileSync(new URL(`../src/engine/${name}.js`, import.meta.url), 'utf8'), context);
class Events {
  listeners = new Map();
  addEventListener(n, fn) { if (!this.listeners.has(n)) this.listeners.set(n, new Set()); this.listeners.get(n).add(fn); }
  removeEventListener(n, fn) { this.listeners.get(n)?.delete(fn); }
  emit(n) { for (const fn of this.listeners.get(n) || []) fn(); }
}
const scene = new Events(), el = new Events();
scene.renderer = { xr: { isPresenting: true } };
scene.xrSession = Object.assign(new Events(), { visibilityState: 'visible' });
const grip = {}, target = {}, source = { gripSpace: grip, targetRaySpace: target };
let pose = { transform: { position: { x: 0.01, y: -0.02, z: -0.05 },
  orientation: { x: -Math.sin(Math.PI / 9), y: 0, z: 0, w: Math.cos(Math.PI / 9) } } };
scene.frame = { getPose(a, b) { assert.equal(a, target); assert.equal(b, grip); return pose; } };
const data = { origin: { x: 0, y: 0, z: 0 }, direction: { x: 0, y: 0, z: -1 }, enabled: true };
el.sceneEl = scene;
let writes = 0;
el.components = { raycaster: { data }, 'tracked-controls': { controller: source, pose: {} } };
el.setAttribute = (name, key, value) => {
  assert.equal(name, 'raycaster'); writes++;
  if (typeof key === 'string') data[key] = value; else Object.assign(data, key);
};
const ray = Object.assign(Object.create(components['controller-ray']), { el }); ray.init(); ray.tick();
assert.deepEqual({ ...data.origin }, pose.transform.position);
assert.ok(Math.abs(data.direction.y + Math.sin(2 * Math.PI / 9)) < 1e-12);
assert.ok(Math.abs(data.direction.z + Math.cos(2 * Math.PI / 9)) < 1e-12);
ray.tick(); assert.equal(writes, 1, 'stable native ray does not rewrite attributes each frame');
data.direction = { x: 0, y: 0, z: -1 }; ray.tick();
assert.equal(writes, 2, 'late model correction cannot override the native ray');
const validPose = pose;
pose = null; ray.tick(); assert.equal(data.enabled, false, 'lost tracking cannot click with stale aim');
ray.tick(); assert.equal(writes, 3);
pose = validPose; ray.tick(); assert.equal(data.enabled, true);
el.components['tracked-controls'].pose = null; ray.tick();
assert.equal(data.enabled, false, 'relative pose alone cannot keep a stale absolute hand clickable');
el.components['tracked-controls'].pose = {}; ray.tick(); assert.equal(data.enabled, true);
scene.renderer.xr.isPresenting = false; const desktopWrites = writes; ray.tick();
assert.equal(writes, desktopWrites, 'desktop ray untouched');

// First model request fails, retries stop after 1+2+4 seconds; a resumed/reconnected
// controller may retry again. A successful model clears outstanding retry work.
el.getObject3D = () => null;
let loads = 0;
el.components['gltf-model'] = { model: null, update() { loads++; } };
const batch = Object.assign(Object.create(components['controller-batch']), { el }); batch.init();
let notices = 0; scene.addEventListener('controller-model-unavailable', () => notices++);
for (const delay of [1000, 2000, 4000]) {
  el.emit('model-error');
  assert.equal(timers.size, 1); const [id, t] = [...timers][0];
  assert.equal(t.ms, delay); timers.delete(id); t.fn();
}
el.emit('model-error'); assert.equal(timers.size, 0, 'no endless retry loop'); assert.equal(loads, 3);
assert.equal(notices, 1, 'exhausted retries report a visible in-game recovery choice');
scene.emit('enter-vr'); scene.xrSession.emit('visibilitychange'); assert.equal(loads, 4);
el.emit('model-error'); el.emit('controllerconnected'); assert.equal(loads, 5);
el.emit('controllermodelready'); assert.equal(batch.failed, false); assert.equal(batch.failures, 0);
el.emit('model-error'); assert.equal(timers.size, 1);
batch.remove(); assert.equal(timers.size, 0);
el.emit('model-error'); el.emit('controllerconnected'); assert.equal(loads, 5, 'removed component has no retry listeners');

// Service reply buttons must use their note's density, not distant wall defaults.
let place;
const note = { object3D: { visible: true }, components: { panel: { c: { width: 1432 }, data: { w: 1 } } },
  querySelectorAll: () => [], getObject3D: () => ({ material: { depthTest: true } }) };
await vm.runInNewContext(answersScript(['one']).replace('import(', 'load('), {
  document: { baseURI: 'http://example.test/', getElementById: () => note }, URL, window: {},
  load: async () => ({ createChoice(n, p) { assert.equal(n, note); place = p; return { show() {} }; } })
});
assert.equal(place.density, 1432); assert.equal(place.w, 0.7); assert.equal(place.h, 0.1);
console.log('controller ray: native pose without model, tracking loss, bounded model retry, reply density');
