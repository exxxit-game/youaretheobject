import { askConsent } from '../consent.js';
import { askAfterLeaving, leftBefore } from '../left-early.js';
import { writePlaque } from '../brand.js';
import { APP_T } from '../texts.ru.js';
import { loadVoice, speak } from '../../engine/voice.js';
import { unlock } from '../../engine/audio.js';
import { createSheet } from '../../engine/ui/sheet.js';
import { loadSounds } from '../../engine/sfx.js';
import '../../engine/fader.js';
import '../../engine/locomotion.js';
import { pressable } from '../../engine/laser-beam.js';
import '../../engine/reflect-env.js';
import '../../engine/moulding.js';
import '../../engine/shapes.js';
import '../../engine/decal.js';
import { LOBBY_T } from './texts.ru.js';
import { VOICE_LINES } from './voice-lines.js';
import { SOUNDS } from './sound-list.js';
import { signOn, signAnswer, visitsSoFar } from './opening.js';
import { pinNotices } from './board.js';
import { writeStairsSign } from './stairs-sign.js';
import { paintExtinguisherLabel, paintGauge } from './extinguisher-label.js';
import { showHint } from '../hint.js';
import { leaveButton } from './exit.js';
import { WALLS, printTurn } from './scene.js';
import { BOUNDS as AREA, SHEET_HOME, SPOT, HOOK_READ } from './plan.js';

export { corridorHTML } from './scene.js';

// The arrival before the first room: the player stands in the lab corridor facing door 1;
// the sign over it comes on and plays (opening.js), the player takes the clipboard from
// the board, it welcomes them and asks the consent, and the player points at door 1. The door opens, the view fades, and the player is at the
// table (on the chair when seated). See docs/decisions.md, "The arrival".
// an area { minX, maxX, minZ, maxZ } as room-bounds and locomotion take it
const bounds = (a) => `minX: ${a.minX}; maxX: ${a.maxX}; minZ: ${a.minZ}; maxZ: ${a.maxZ}`;
// The clipboard hangs on the experimenter's board left of door 1, its back 1 cm off the cork
// (faces at least 5 mm apart, or they flicker) and the peg (scene.js) through its clip, facing
// the corridor: the only stretch of wall wide enough for it.
// Print on the corridor walls (the clipboard's paper on its hook, the plaques and notices) is
// drawn unlit for legibility; dimmed to this so it does not glow in the dim corridor (chosen
// by eye in rendered frames; the clipboard brightens for reading on its way to the player).
const WALL_PRINT_LIGHT = 0.45;
// Light as in the trade reference (docs/building-standards.md, S13: under 10 fc in corridors,
// 50 fc at desks): the corridor floor gets at most a fifth of the light on the room's desk
// (tests/smoke.mjs measures it). The engine's lights pass through walls, so the room's own
// lights (class room-light) stay off while its door is shut and come up as it opens, and the
// corridor's (class corridor-light) go out once the player is in: the room is lit by its own
// lamps alone, no light from nowhere (docs/owner-decisions.md).
const DOOR_MS = 700;
// How much of the room's light shows while its door opens (our choice, to be checked in the
// headset): enough to see a lit room through the opening, little enough that the corridor
// only brightens about one and a half times before the fade to black.
const DOOR_PEEK = 0.25;
const $ = (s) => document.querySelector(s);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

loadVoice(VOICE_LINES, import.meta.url);
loadSounds(SOUNDS, import.meta.url);

// Puts the player at a spot facing a direction, kept inside an area (room-bounds, world metres): in
// a headset through the recenter component; on a computer the rig, at the origin, is turned to face
// the direction (A-Frame turns the view with the camera rig: components/camera.md) and the camera
// goes to the spot. A computer's full screen is A-Frame's VR mode too (its enterVR sets "vr-mode"
// without a headset), so a headset is told by its session presenting.
function placePlayer({ x, z, yaw, pitch = 0, lift = false }, area) {
  const rig = $('#rig'), cam = $('#cam');
  rig.setAttribute('recenter', { x, z, yaw, lift });
  cam.setAttribute('room-bounds', bounds(area));
  if (rig.sceneEl.renderer.xr.isPresenting) { rig.components.recenter.apply(); return; }
  rig.object3D.position.set(0, 0, 0);
  rig.object3D.rotation.y = THREE.MathUtils.degToRad(yaw);
  rig.object3D.updateMatrixWorld();
  const at = rig.object3D.worldToLocal(new THREE.Vector3(x, 0, z));
  cam.object3D.position.set(at.x, cam.object3D.position.y, at.z);
  // the mouse's own turn and tilt start afresh, so the place's direction is the view's (look-controls
  // has no setting for them; its yaw and pitch objects are what it turns)
  const look = cam.components['look-controls'];
  if (!look || !look.pitchObject) return;
  look.yawObject.rotation.y = 0;
  look.pitchObject.rotation.x = THREE.MathUtils.degToRad(pitch);
}

// How the player moves: teleport and snap turn by default (Meta's comfort defaults);
// ?move=smooth and ?turn=smooth switch to the other choices for checks.
function comfort() {
  const q = new URLSearchParams(location.search);
  return `move: ${q.get('move') === 'smooth' ? 'smooth' : 'teleport'}; turn: ${q.get('turn') === 'smooth' ? 'smooth' : 'snap'}`;
}

// Audio may only start after the player's first gesture (a click, a key, entering VR).
function onFirstGesture(fn) {
  let done = false;
  const go = () => { if (done) return; done = true; unlock(); fn(); };
  window.addEventListener('pointerdown', go, { once: true });
  window.addEventListener('keydown', go, { once: true });
  $('a-scene').addEventListener('enter-vr', go, { once: true });
  // a press made while the page was still loading is that gesture too: the browser keeps it (sticky
  // activation), and Chrome lets sound start "at some time after the user interacted with the page"
  // (developer.chrome.com/blog/autoplay)
  if (navigator.userActivation && navigator.userActivation.hasBeenActive) go();
}

// What is drawn and lit while the player is in the corridor. Returns { peek(ms), enter() }: peek
// brings the room's lights up to DOOR_PEEK of their own while the door opens (the room shows
// through the opening, and the corridor brightens only a little, as from light out of a door);
// enter, called under the fade to black, turns to the room alone.
// What a wall hides is not drawn: every part drawn costs frame time in the headset (Meta: fewer
// than 200 draw calls a frame on Quest 3; cull what walls hide). The room's inside (class
// room-interior) is hidden while its door is shut and appears as the door starts to open; once the
// player is in, the corridor (its group, and the clipboard on its board) is hidden and its lights
// go out. Lights are turned down, never hidden: a hidden light changes how many lights there are,
// and three.js then rebuilds every lit material in the middle of play.
function lightCorridor(sheet) {
  const room = [...document.querySelectorAll('.room-light')].map((el) => [el, el.getAttribute('light').intensity]);
  const inside = [...document.querySelectorAll('.room-interior')];
  const set = (el, v) => el.setAttribute('light', 'intensity', v);
  for (const [el] of room) set(el, 0);
  for (const el of inside) el.object3D.visible = false;
  return {
    peek: (ms) => {
      for (const el of inside) el.object3D.visible = true;
      for (const [el, v] of room) el.setAttribute('animation__light', { property: 'light.intensity', to: v * DOOR_PEEK, dur: ms, easing: 'easeInOutQuad' });
    },
    enter: () => {
      for (const [el, v] of room) { el.removeAttribute('animation__light'); set(el, v); }
      for (const el of document.querySelectorAll('.corridor-light')) set(el, 0);
      $('#corridor').object3D.visible = false;
      sheet.el.object3D.visible = false;
    }
  };
}

// The end walls' picture (scene.js): which end shows it upside down changes with each visit, a detail
// that rewards playing again, as the game is made to be replayed to be understood
// (docs/owner-decisions.md); seen at a slant it stays as sharp as the game's other
// textures (panel.js: anisotropy 8).
function hangPrints(visits) {
  document.querySelectorAll('.end-print').forEach((el, i) => {
    el.setAttribute('rotation', { ...el.getAttribute('rotation'), z: printTurn(i, visits) });
    const sharpen = () => { const map = el.getObject3D('mesh')?.material.map; if (map) { map.anisotropy = 8; map.needsUpdate = true; } };
    sharpen();
    el.addEventListener('materialtextureloaded', sharpen);
  });
}

// room: { id, debrief, seat: { x, z, yaw }, area: { minX, maxX, minZ, maxZ }, extra, real }, its
// seat and area in the corridor's metres (src/app/lab.js)
// Resolves with true when the player chose to start with recording, once inside the room.
export async function runLobby(room) {
  const scene = $('a-scene');
  // first, before anything waits: a press of the VR button while the clipboard is still being
  // hung would otherwise be missed, and every sound would wait for the next one
  onFirstGesture(() => {});
  const sheet = createSheet(scene, { inside: WALLS });
  // door 1 answers only once the clipboard says to choose it: before, the ray would mark it as
  // something to press that does nothing (src/engine/laser-beam.js)
  const leaf = $('#door1 .door-leaf');
  pressable(leaf, false);
  const light = lightCorridor(sheet);
  placePlayer(SPOT, AREA);
  document.title = LOBBY_T.title;   // the corridor is no room yet; the room names the page once entered
  showHint(LOBBY_T.hint);
  $('#rig').setAttribute('locomotion', `${bounds(AREA)}; ${comfort()}`);   // the corridor is walked with the thumbsticks too
  // every room's plaque shows its number from the plan; the stairs' sign its symbol and word
  for (const el of document.querySelectorAll('.room-plaque')) writePlaque(el.components.panel, { number: el.dataset.number });
  writeStairsSign($('#plaqueStairs').components.panel, LOBBY_T.stairs);
  for (const el of document.querySelectorAll('#plaqueStairs, .room-plaque')) el.getObject3D('mesh').material.color.setScalar(WALL_PRINT_LIGHT);
  pinNotices($('#notePoster').components.panel, $('#noteFlyer').components.panel, WALL_PRINT_LIGHT);
  hangPrints(visitsSoFar());
  paintExtinguisherLabel($('#extLabel'));
  paintGauge($('#extGauge'));
  const cover = [{ t: LOBBY_T.participant, role: 'body' }];
  await sheet.hang(SHEET_HOME, cover, WALL_PRINT_LIGHT);
  const exitOff = leaveButton(scene, sheet);   // the studio's poster on the board

  // 0. the sign comes on and plays; 1. the voice points to the clipboard on the board, the
  // player takes it, and it welcomes them: the promise first, read aloud
  await signOn(scene);
  speak(LOBBY_T.takeSheet);
  sheet.el.addEventListener('taken', signAnswer, { once: true });
  await sheet.take([...cover, { t: LOBBY_T.takeSheet, role: 'body', gap: 0.04, from: HOOK_READ }]);
  unlock();
  const spoken = speak(LOBBY_T.welcome.join(' '));
  await sheet.choose([
    ...cover,
    ...LOBBY_T.welcome.map((t, i) => ({ t, role: 'body', gap: i ? 0.012 : 0.025 }))
  ], [APP_T.next]);

  // 2. a player who left the room early last time chooses: start again or learn what it was
  if (room.real && leftBefore(room.id)) {
    await askAfterLeaving(sheet, { room: room.id, debrief: room.debrief });
  }

  // 3. consent, once, before the door
  const withRecording = await askConsent(sheet, { extra: room.extra });

  // 4. the clipboard goes back to its hook and says what to do; door 1 opens the room
  await sheet.back([...cover, { t: LOBBY_T.chooseDoor, role: 'title', gap: 0.04, from: HOOK_READ }]);
  await spoken;
  speak(LOBBY_T.chooseDoor);
  const door = $('#door1');
  // while the leave question is open the door waits for its answer, and the ray does not mark it
  // (Meta: the ray is off where "it would conflict with another interaction")
  const onAsk = (e) => pressable(leaf, !e.detail);
  pressable(leaf, !sheet.isAsking());
  sheet.el.addEventListener('asking', onAsk);
  document.documentElement.dataset.lobby = 'door';
  await new Promise((resolve) => {
    const onDoor = () => { if (sheet.isAsking()) return; leaf.removeEventListener('click', onDoor); resolve(); };
    leaf.addEventListener('click', onDoor);
  });
  sheet.el.removeEventListener('asking', onAsk);
  pressable(leaf, false);
  delete document.documentElement.dataset.lobby;
  exitOff();   // rooms are left another way (left-early.js)

  door.setAttribute('animation', { property: 'rotation', to: '0 95 0', dur: DOOR_MS, easing: 'easeInOutQuad' }); // into the room
  light.peek(DOOR_MS);
  await delay(500);
  await $('#cam').components.fader.to(1);
  light.enter();
  $('#rig').removeAttribute('locomotion');   // the room is played where the original was
  placePlayer(room.seat, room.area);
  door.removeAttribute('animation');
  door.setAttribute('rotation', '0 0 0');
  await delay(250);
  await $('#cam').components.fader.to(0);
  return withRecording;
}
