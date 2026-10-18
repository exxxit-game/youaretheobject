// Reuse the approved booth without importing the first trial's apparatus or procedure.
import { sceneHTML as approvedBooth, DOORWAY, BOOTH } from '../02-lines/scene.js';
export { DOORWAY, BOOTH };
const at = approvedBooth.indexOf('<a-entity id="linesDisplay"');
if (at < 0) throw new Error('Approved booth boundary missing');
export const sceneHTML = `<a-entity id="changeWorld">${approvedBooth.slice(0, at)}</a-entity>
  <a-entity id="changeDisplay" class="room-interior">
    <a-entity id="changeScreen" panel="w: 1.7; h: 1; px: 2048; ref: 1300; bg: #191919" position="0 1.6 -1.565"></a-entity>
    <a-entity id="changeCaption" panel="w: 1.7; h: 0.18; px: 1536; ref: 1300; bg: #191919" position="0 2.22 -1.56"></a-entity>
  </a-entity>`;
