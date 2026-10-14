import { APP_T } from './texts.ru.js';

// A player who leaves before the end learns nothing of the room: to learn what it was, he plays it to its end
// (docs/owner-decisions.md, the ethics line: one who did not finish has nothing to learn, and a shared headset must
// not hand the next player the answer).
const key = (room) => `object.left.${room}`;
// No mark is kept for the next visit; both calls only clear the mark an older version left.
const clear = (room) => { try { localStorage.removeItem(key(room)); } catch (e) { /* private mode */ } };
export const markStarted = clear;
export const markReached = clear;

// Leaving VR in the middle of a room: a page box offers to go back into it. hold(true|false) lets the room pause
// its trials while the box is open.
export function watchExit(scene, { midRoom, hold }) {
  const L = APP_T.leftEarly;
  const button = (label, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  };
  scene.addEventListener('exit-vr', () => {
    if (!midRoom() || document.querySelector('#left-early')) return;
    hold(true);
    const box = document.createElement('div');
    box.id = 'left-early';
    const lead = document.createElement('p');
    lead.textContent = L.now;
    // Without a headset (VR cannot be entered again) the room simply goes on on the screen.
    const back = button(L.back, () => {
      box.remove();
      hold(false);
      if (AFRAME.utils.device.checkHeadsetConnected()) Promise.resolve(scene.enterVR()).catch(() => {});
    });
    box.append(lead, back);
    document.body.append(box);
  });
}
