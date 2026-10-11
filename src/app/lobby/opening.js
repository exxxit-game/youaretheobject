import { playSound } from '../../engine/sfx.js';
import { onUnlock } from '../../engine/audio.js';
import { SOUND_GAIN } from './sound-list.js';
import { SPEED } from '../session.js';
import '../../engine/lightbox.js';
import { arrivalStep, settleArrival, SIGN_WORDS, SIGN_STYLE, SIGN_ENDINGS, SIGN_ANSWER, SIGN_AT, ARRIVAL, facesSign, pickEnding } from './sign.js';

// The first moments in the corridor, before any text: the light box over door 1 waits
// until the player has looked around, then starts and plays with the game's name
// (src/app/lobby/sign.js says why). Its starter clicks and its hum come from the sign.
const $ = (s) => document.querySelector(s);
const delay = (s) => new Promise((r) => setTimeout(r, s * 1000 / SPEED));
// Which ending this visit gets: the count of earlier visits lives only on this device (like
// the first-run mark); ?sign=a|b|c forces one for checks.
const VISITS_KEY = 'object.signVisits';
const forced = new URLSearchParams(location.search).get('sign');
let ending = null;
// how many earlier visits this device has seen (the end walls' prints read it too, lobby.js)
export function visitsSoFar() {
  try { return Number(localStorage.getItem(VISITS_KEY)) || 0; } catch (e) { return 0; }
}
function nextEnding() {
  const visits = visitsSoFar();
  try { if (!forced) localStorage.setItem(VISITS_KEY, String(visits + 1)); } catch (e) { /* private mode */ }
  return pickEnding(visits, forced);
}
const fast = (keys) => keys.map(([t, levels, cue]) => [t / SPEED, levels, cue]);
let hum = null;
let humAsked = false;
let humLevel = 1;   // the hum's share of its full level; the cues change it

// Resolves when the sign's play is over and the voice and the clipboard may follow.
export function signOn(scene) {
  const face = $('#signFace');
  const box = face.components.lightbox;
  box.show(SIGN_WORDS, SIGN_STYLE);
  face.addEventListener('lamp-cue', (e) => {
    const cue = e.detail;
    if (cue.sound) playSound(cue.sound, SIGN_AT, SOUND_GAIN[cue.sound]);
    if (cue.hum === undefined) return;
    humLevel = cue.hum;
    if (hum) hum.fade(humLevel * SOUND_GAIN['sign-hum'], (cue.humS || 0) / SPEED);
    // the first hum cue (the sign fully lit) starts it; should sound still be locked then, it
    // starts once it may play (onUnlock), at the level of the latest cue
    else if (!humAsked) { humAsked = true; onUnlock(() => { hum = playSound('sign-hum', SIGN_AT, humLevel * SOUND_GAIN['sign-hum'], true); }); }
  });
  return arrival(scene)
    .then(() => {
      // when the sign starts, for the checks (the smoke test, the headset tools)
      document.documentElement.dataset.signStart = String(Math.round(performance.now()));
      ending = nextEnding();
      return box.run(fast(SIGN_ENDINGS[ending]));
    })
    .then(() => (inVR(scene) ? delay(ARRIVAL.litPauseS) : null));
}

// Called when the player takes the clipboard: in ending b the whole name comes back.
export function signAnswer() {
  if (ending === 'b') $('#signFace').components.lightbox.run(fast(SIGN_ANSWER));
}

// In a headset: its session presents. A computer's full screen is A-Frame's VR mode too (its
// enterVR sets "vr-mode" and sends enter-vr without a headset), and is played as a screen; in a
// headset the session presents before enter-vr is sent (A-Frame enters once setSession resolves).
const inVR = (scene) => scene.renderer.xr.isPresenting;

// When the sign may start: the rule is arrivalStep (sign.js), the wait in VR settleArrival.
// The VR button lies outside the view, so pressing it is no press on the 3D view.
function arrival(scene) {
  const device = { headset: AFRAME.utils.device.checkHeadsetConnected(), questBrowser: AFRAME.utils.device.isOculusBrowser() };
  if (arrivalStep(device, 'load') === 'now') return Promise.resolve();
  return new Promise((resolve) => {
    const flat = () => { if (!inVR(scene) && arrivalStep(device, 'flat-press') === 'now') resolve(); };
    window.addEventListener('keydown', flat);
    scene.canvas.addEventListener('pointerdown', flat);
    const inside = () => settleArrival(delay, () => faces(scene)).then(resolve);
    const entered = () => { if (!inVR(scene)) return; scene.removeEventListener('enter-vr', entered); inside(); };
    if (inVR(scene)) inside(); else scene.addEventListener('enter-vr', entered);
  });
}

// whether the player's head now faces the sign
function faces(scene) {
  const head = scene.camera.el.object3D;
  const p = new THREE.Vector3(), q = new THREE.Quaternion();
  head.getWorldPosition(p);
  const f = new THREE.Vector3(0, 0, -1).applyQuaternion(head.getWorldQuaternion(q));
  return facesSign(p.toArray(), f.toArray());
}
