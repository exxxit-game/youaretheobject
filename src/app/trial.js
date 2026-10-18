import { stageHTML } from './stage.js';
import { PREVIEW } from './session.js';
import { createMenu } from './menu.js';
import { createChoice } from '../engine/ui/choice.js';
import { TRIAL_T } from './texts.ru.js';

// Owner-only preview: start at the experiment instead of replaying arrival/consent.
// Only a marked preview export can take this path. The trial receives recording=false.
export async function startTrial(room, { number, x = 0, z = 0, yaw = 0 }) {
  if (!PREVIEW) throw new Error('Direct trials require a preview export');
  document.body.insertAdjacentHTML('beforeend', stageHTML(`<a-entity id="roomPlace" data-frame position="${x} 0 ${z}" rotation="0 ${yaw} 0">${room.sceneHTML}</a-entity>`));
  const scene = document.querySelector('a-scene');
  if (!scene.hasLoaded) await new Promise(resolve => scene.addEventListener('loaded', resolve, { once: true }));
  const root = scene.querySelector('#roomPlace'), rig = scene.querySelector('#rig'), cam = scene.querySelector('#cam');
  const seat = new THREE.Vector3(room.ENTRY.seat.x, 0, room.ENTRY.seat.z);
  root.object3D.updateWorldMatrix(true, false); root.object3D.localToWorld(seat);
  rig.setAttribute('position', `${seat.x} 0 ${seat.z}`); rig.setAttribute('rotation', `0 ${yaw} 0`);
  rig.setAttribute('recenter', { x: seat.x, z: seat.z, yaw, lift: false });
  cam.removeAttribute('wasd-controls'); cam.removeAttribute('room-bounds');
  room.mount(root, { number });
  const menu = createMenu(scene);
  const stopGroup = document.createElement('a-entity'); stopGroup.id = 'trialStopped'; root.appendChild(stopGroup);
  const alignStop = () => {
    const eye = new THREE.Vector3(); scene.camera.getWorldPosition(eye); root.object3D.worldToLocal(eye);
    stopGroup.object3D.position.y = eye.y - 1.6;
  };
  rig.addEventListener('recentered', alignStop);
  const returnChoice = createChoice(stopGroup, { y: 1.1, z: -1.54, w: 1.4 });
  const stopped = document.createElement('a-entity');
  stopped.setAttribute('panel', 'w: 1.7; h: 0.6; px: 1536; ref: 1300');
  stopped.setAttribute('position', '0 1.6 -1.53'); stopped.setAttribute('visible', false); stopGroup.appendChild(stopped);
  const again = () => { menu.unveil(); room.hold(false); stopped.setAttribute('visible', false); returnChoice.hide(); room.leave(); room.enter(false); };
  menu.set({ hold: on => room.hold(on), items: [
    { label: TRIAL_T.restart, confirm: { ask: TRIAL_T.restartAsk, yes: TRIAL_T.restart, no: TRIAL_T.keep }, run: again },
    { label: TRIAL_T.stop, confirm: { ask: TRIAL_T.stopAsk, yes: TRIAL_T.stop, no: TRIAL_T.keep }, run: () => {
      menu.unveil(); room.hold(false); room.leave(); stopped.setAttribute('visible', true);
      alignStop();
      stopped.components.panel.write([{ t: TRIAL_T.stopped, size: 44 }]);
      returnChoice.show([TRIAL_T.start], again);
    } }
  ] });
  room.enter(false);
}
