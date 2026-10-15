import { getContext, onUnlock } from './audio.js';

// Recorded sound effects that come from a place in the room (HRTF panning), with
// the listener following the player's head, in a headset and on desktop.
const raw = new Map();      // name -> Promise<ArrayBuffer | null>
const decoded = new Map();  // name -> Promise<AudioBuffer | null>

// list: [{ name, file }]; file is resolved against baseUrl (the room module URL).
export function loadSounds(list, baseUrl) {
  for (const { name, file } of list) {
    raw.set(name, fetch(new URL(file, baseUrl)).then(r => (r.ok ? r.arrayBuffer() : null)).catch(() => null));
  }
}

function buffer(ctx, name) {
  if (!raw.has(name)) return Promise.resolve(null);
  if (!decoded.has(name)) {
    decoded.set(name, raw.get(name).then(b => (b ? ctx.decodeAudioData(b.slice(0)) : null)).catch(() => null));
  }
  return decoded.get(name);
}

function setPannerPosition(panner, p) {
  if (panner.positionX) { panner.positionX.value = p.x; panner.positionY.value = p.y; panner.positionZ.value = p.z; }
  else panner.setPosition(p.x, p.y, p.z);
}

// Plays a sound at a world position {x, y, z} in metres, or everywhere when pos is
// null. Returns a handle with stop() and fade(volume, seconds) (a straight ramp, e.g. a
// hum dying with its lamps). Asked for before the player's first gesture, it waits for it
// (audio.js, onUnlock); stopped before it starts, it never starts.
export function playSound(name, pos, volume = 1, loop = false) {
  let target = volume, stopped = false;
  const handle = { stop() { stopped = true; }, fade(v) { target = v; } };
  onUnlock(() => {
    const ctx = getContext();
    if (ctx && !stopped) start(ctx, handle, name, pos, loop, () => target, () => stopped);
  });
  return handle;
}

function start(ctx, handle, name, pos, loop, target, stopped) {
  buffer(ctx, name).then((buf) => {
    if (!buf || stopped()) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = loop;
    const gain = ctx.createGain();
    gain.gain.value = target();   // a fade asked for while it waited is its level now
    handle.fade = (v, seconds = 0) => {
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(v, t + Math.max(0.01, seconds));
    };
    src.connect(gain);
    if (pos) {
      const panner = ctx.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 0.6;
      setPannerPosition(panner, pos);
      gain.connect(panner).connect(ctx.destination);
    } else {
      gain.connect(ctx.destination);
    }
    src.start();
    handle.stop = () => { try { src.stop(); } catch (e) { /* already stopped */ } };
  });
}

// Put on <a-scene>: keeps the audio listener at the player's head every frame.
AFRAME.registerComponent('sound-listener', {
  init() {
    this.p = new THREE.Vector3();
    this.q = new THREE.Quaternion();
    this.f = new THREE.Vector3();
    this.u = new THREE.Vector3();
  },
  tick() {
    const ctx = getContext();
    const cam = this.el.camera;
    if (!ctx || !cam) return;
    cam.getWorldPosition(this.p);
    cam.getWorldQuaternion(this.q);
    this.f.set(0, 0, -1).applyQuaternion(this.q);
    this.u.set(0, 1, 0).applyQuaternion(this.q);
    const l = ctx.listener;
    if (l.positionX) {
      l.positionX.value = this.p.x; l.positionY.value = this.p.y; l.positionZ.value = this.p.z;
      l.forwardX.value = this.f.x; l.forwardY.value = this.f.y; l.forwardZ.value = this.f.z;
      l.upX.value = this.u.x; l.upY.value = this.u.y; l.upZ.value = this.u.z;
    } else {
      l.setPosition(this.p.x, this.p.y, this.p.z);
      l.setOrientation(this.f.x, this.f.y, this.f.z, this.u.x, this.u.y, this.u.z);
    }
  }
});
