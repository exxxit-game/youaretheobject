// The lab: the app holds the scene, the player and the corridor for the whole visit, and the room
// stands behind its door (docs/rooms.md). As Meta's IWSDK keeps the player rig while levels are
// loaded and unloaded round it (developers.meta.com/vr/documentation/iwsdk/concepts/ecs/world/,
// loadLevel), and Unity keeps one scene loaded while others are added to it
// (docs.unity3d.com, LoadSceneMode.Additive); in A-Frame a place is a group of entities put into the
// scene (docs/introduction/javascript-events-dom-apis.md, appendChild) and hidden whole by its
// container's visibility (docs/components/visible.md: "container entities that contain an entire
// group of entities that you can flip on and off"). The room is put in before the scene loads, behind
// its shut door, and the scene's prewarm draws it once with everything else, unseen, after load and on
// the first frame in a headset, so nothing is built for the first time while the door opens
// (src/engine/prewarm.js; on the laptop the room's first draw at the door took 36 ms, 4 ms after,
// and a frame is 11 ms in the headset at 90 Hz).
import '../engine/panel.js';
import '../engine/recenter.js';
import '../engine/room-bounds.js';
import '../engine/sfx.js';
import '../engine/grab-press.js';
import '../engine/controller-batch.js';
import '../engine/laser-beam.js';
import '../engine/surface.js';
import '../engine/shapes.js';
import '../engine/cable.js';
import '../engine/merge-static.js';
import '../engine/prewarm.js';
import { stageHTML } from './stage.js';
import { corridorHTML, runLobby } from './lobby/lobby.js';
import { leave as leaveGame } from './lobby/exit.js';
import { LOBBY_T } from './lobby/texts.ru.js';
import { getContext } from '../engine/audio.js';
import { createMenu } from './menu.js';
import { APP_T } from './texts.ru.js';
import { ROOM1_DOOR, roomPlace, toCorridor, areaToCorridor } from './lobby/plan.js';

// room: the room's module (the shell loads it, src/main.js): its markup, where its doorway is, what
// the corridor needs before its door (ENTRY), mount (it is in the scene), enter (the player is in),
// hold (the game's menu is open) and leave (the player left it through the menu)
export function start(room) {
  const place = roomPlace(ROOM1_DOOR, room.DOORWAY);
  // the room's own metres (data-frame): its tiles are laid from its own centre (surface.js)
  const behind = `<a-entity id="roomPlace" data-frame position="${place.x} 0 ${place.z}" rotation="0 ${place.yaw} 0">${room.sceneHTML}</a-entity>`;
  document.body.insertAdjacentHTML('beforeend', stageHTML(corridorHTML + behind));
  const scene = document.querySelector('a-scene');
  scene.setAttribute('sound-listener', '');
  const loaded = scene.hasLoaded ? Promise.resolve() : new Promise((r) => scene.addEventListener('loaded', r, { once: true }));
  // a failure anywhere before the room's flow takes over reaches the shell, which shows it
  return loaded.then(async () => {
    room.mount(document.querySelector('#roomPlace'));
    // the game's menu (menu.js): in the corridor it offers to stop taking part, as the poster does; in
    // the room, to leave it: under the fade the room ends its run, the player is back in the corridor,
    // and door 1 takes them in again (lobby.js, back)
    const menu = createMenu(scene);
    const M = APP_T.menu, E = LOBBY_T.exit;
    // in the corridor the voice and sounds wait under the menu (the room holds its own: room.js hold)
    const sound = (on) => { const ctx = getContext(); if (ctx) (on ? ctx.suspend() : ctx.resume()).catch(() => {}); };
    const corridor = { hold: sound, items: [{ label: M.leaveGame, confirm: { ask: E.ask, yes: E.leave }, run: () => { sound(false); return leaveGame(scene); } }] };
    menu.set(corridor);
    const { seat, area, ...entry } = room.ENTRY;
    const { withRecording, back } = await runLobby({ ...entry, seat: { ...seat, ...toCorridor(place, seat) }, area: areaToCorridor(place, area) });
    // inside a run, leaving asks first (the run is lost); after its debrief the run is kept, and the way out
    // is only back to the corridor
    const inRoom = { hold: (on) => room.hold(on), items: () => (room.running()
      ? [{ label: M.leaveRoom, confirm: { ask: M.leaveRoomAsk, yes: M.leaveRoomYes }, run: () => leaveRoom(true) }]
      : [{ label: M.toCorridor, run: () => leaveRoom(false) }]) };
    async function leaveRoom(early) {
      menu.set(null);
      room.leave();   // first, under the menu: nothing of the run answers during the fade
      await scene.querySelector('#cam').components.fader.to(1);
      menu.set(corridor);
      await back(early);
      menu.set(inRoom);
      room.enter(withRecording);
    }
    menu.set(inRoom);
    room.enter(withRecording);
  });
}
