// The lab: the app holds the scene, the player and the corridor for the whole visit, and the room
// stands behind its door (docs/rooms.md). As Meta's IWSDK keeps the player rig while levels are
// loaded and unloaded round it (developers.meta.com/vr/documentation/iwsdk/concepts/ecs/world/,
// loadLevel), and Unity keeps one scene loaded while others are added to it
// (docs.unity3d.com, LoadSceneMode.Additive); in A-Frame a place is a group of entities put into the
// scene (docs/introduction/javascript-events-dom-apis.md, appendChild) and hidden whole by its
// container's visibility (docs/components/visible.md: "container entities that contain an entire
// group of entities that you can flip on and off"). The room is put in before the scene loads, behind
// its shut door: what is added later is built and first drawn in the middle of play, and A-Frame
// warns that a first switch to new content drops frames (docs/introduction/best-practices.md).
import '../engine/panel.js';
import '../engine/recenter.js';
import '../engine/room-bounds.js';
import '../engine/sfx.js';
import '../engine/grab-press.js';
import '../engine/controller-batch.js';
import '../engine/surface.js';
import '../engine/shapes.js';
import '../engine/cable.js';
import '../engine/merge-static.js';
import { stageHTML } from './stage.js';
import { corridorHTML, runLobby } from './lobby/lobby.js';
import { ROOM1_DOOR, roomPlace, toCorridor, areaToCorridor } from './lobby/plan.js';

// room: the room's module (the shell loads it, src/main.js): its markup, where its doorway is, what
// the corridor needs before its door (ARRIVAL), mount (it is in the scene) and enter (the player is in)
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
    const { seat, area, ...arrival } = room.ARRIVAL;
    const withRecording = await runLobby({ ...arrival, seat: { ...seat, ...toCorridor(place, seat) }, area: areaToCorridor(place, area) });
    room.enter(withRecording);
  });
}
