import { getContext } from '../../engine/audio.js';
import { pressable } from '../../engine/laser-beam.js';
import { LOBBY_T } from './texts.ru.js';

// The studio's poster on the experimenter's board (the exit sign's figure and the name EXXXIT) is
// the game's "leave" button: it already reads as the way out, and a participant may leave at any
// moment without penalty. Pointing at it brightens it; pressing asks on the clipboard, which cuts
// in on whatever page it shows and gives it back if the player stays. Leaving fades to black,
// ends VR and says how to come back. Nothing has been sent at this point: results go only at the
// end of a room, with consent.
// sheet: the corridor's clipboard (src/engine/ui/sheet.js). Returns off(): the poster stops
// answering (the player went through a door: the corridor stays in the scene behind the room,
// and the lasers reach through walls to anything clickable).
const HOVER_LIGHT = 0.75;   // how bright the dimmed print turns under the laser or mouse (our choice)

export function leaveButton(scene, sheet) {
  const poster = scene.querySelector('#notePoster');
  const tint = (v) => poster.getObject3D('mesh').material.color.setScalar(v);
  const rest = poster.getObject3D('mesh').material.color.r;
  const E = LOBBY_T.exit;
  let on = true;
  poster.addEventListener('mouseenter', () => { if (on) tint(HOVER_LIGHT); });
  poster.addEventListener('mouseleave', () => tint(rest));
  poster.addEventListener('click', async () => {
    if (!on) return;
    const pick = await sheet.interrupt([{ t: E.ask, role: 'title' }], [E.leave, E.stay]);
    if (pick === 0) { off(); leave(scene, E.done); } else if (pick === 1) sheet.resume();
  });
  function off() {
    on = false;
    pressable(poster, false);
    tint(rest);
  }
  return off;
}

async function leave(scene, done) {
  await scene.querySelector('#cam').components.fader.to(1);
  if (scene.is('vr-mode')) await scene.exitVR();
  getContext()?.suspend();
  scene.pause();
  const hint = document.querySelector('#hint');
  hint.textContent = done;
  hint.classList.add('show');
  document.documentElement.dataset.left = '1';
}
