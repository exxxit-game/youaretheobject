// The shared audio context. Browsers start audio suspended until a user gesture,
// so call unlock() from a click or key handler before playing anything.
let ctx = null;
let unlocked = false;
const waiting = [];

export function unlock() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio available */ }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  unlocked = true;
  waiting.splice(0).forEach((fn) => fn());
}

// Runs fn once audio is unlocked: at once if it is, otherwise on the first unlock(), even when
// the device has no audio (fn finds no context then). The one rule for every sound asked for
// before the player's first gesture: it waits for it, never lost silently (sfx.js, voice.js).
export function onUnlock(fn) {
  if (unlocked) fn(); else waiting.push(fn);
}

// The shared audio context, or null before the first unlock().
export function getContext() { return ctx; }
