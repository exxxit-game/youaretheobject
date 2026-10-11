// The lab: the app holds the scene, the player and the corridor for the whole visit, and the room
// stands behind its door (docs/rooms.md). As Meta's IWSDK keeps the player rig while levels are
// loaded and unloaded round it (developers.meta.com/vr/documentation/iwsdk/concepts/ecs/world/,
// loadLevel), and Unity keeps one scene loaded while others are added to it
// (docs.unity3d.com, LoadSceneMode.Additive); in A-Frame a place is a group of entities put into the
// scene (docs/introduction/javascript-events-dom-apis.md, appendChild) and hidden whole by its
// container's visibility (docs/components/visible.md: "container entities that contain an entire
// group of entities that you can flip on and off"). The room is put in before the scene loads, behind
// its shut door, and every material and texture is readied before the first frame, the room's hidden
// inside too, so nothing is built for the first time while the door opens: A-Frame warns that "when
// materials and textures are drawn for the first time, the browser will hang" and to "draw all
// materials and textures up front" (docs/introduction/best-practices.md); three.js compile() readies
// the shaders of every mesh, hidden ones included, and initTexture uploads a texture before its first
// draw (WebGLRenderer).
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

// Every material's shaders compiled, every picture and every shape on the GPU, before the player sees
// anything: the whole scene is drawn once, unseen, into a one-pixel picture, the room's hidden inside
// shown for it and nothing left out for being off the camera's view, so its shapes are uploaded too
// (A-Frame: "try to draw all materials and textures up front"). Measured on the laptop: the room's
// inside first drawn at the door took 36 ms, and a frame is 11 ms in the headset at 90 Hz.
function ready(scene) {
  const renderer = scene.renderer, inside = [...document.querySelectorAll('.room-interior')];
  renderer.compile(scene.object3D, scene.camera);
  scene.object3D.traverse((o) => {
    for (const m of [].concat(o.material || [])) {
      for (const key of ['map', 'emissiveMap', 'envMap']) if (m[key]) renderer.initTexture(m[key]);
    }
  });
  const culled = [];
  scene.object3D.traverse((o) => { if (o.frustumCulled) { culled.push(o); o.frustumCulled = false; } });
  const shown = inside.map((el) => el.object3D.visible);
  for (const el of inside) el.object3D.visible = true;
  const target = new THREE.WebGLRenderTarget(1, 1), was = renderer.getRenderTarget();
  renderer.setRenderTarget(target);
  renderer.render(scene.object3D, scene.camera);
  renderer.setRenderTarget(was);
  target.dispose();
  inside.forEach((el, i) => { el.object3D.visible = shown[i]; });
  for (const o of culled) o.frustumCulled = true;
}

// room: the room's module (the shell loads it, src/main.js): its markup, where its doorway is, what
// the corridor needs before its door (ENTRY), mount (it is in the scene) and enter (the player is in)
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
    // after the static parts are merged (merge-static, a moment after load): the merged meshes have
    // their own materials
    await new Promise((r) => setTimeout(r, 0));
    ready(scene);
    const { seat, area, ...entry } = room.ENTRY;
    const withRecording = await runLobby({ ...entry, seat: { ...seat, ...toCorridor(place, seat) }, area: areaToCorridor(place, area) });
    room.enter(withRecording);
  });
}
