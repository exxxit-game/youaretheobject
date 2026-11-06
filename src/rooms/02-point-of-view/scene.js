import { ACTIONS } from './view.js';

const buttons = ACTIONS.map((action, i) => `
  <a-plane data-view-action="${action}" position="${i % 2 ? 0.44 : -0.44} ${i < 2 ? 1.05 : 0.81} -2.45"
           width="0.82" height="0.19" material="shader: flat; color: #23424b">
    <a-entity position="0 0 0.003" panel="w: 0.80; h: 0.18; px: 512"></a-entity>
  </a-plane>`).join('');

export const sceneHTML = `<a-scene renderer="antialias: true; colorManagement: true"
    background="color: #102229" loading-screen="enabled: false"
    xr-mode-ui="enabled: true; XRMode: vr">
  <a-entity recenter="x: 0; z: 0">
    <a-entity camera look-controls="mouseEnabled: false; touchEnabled: false; magicWindowTrackingEnabled: false"
              position="0 1.6 0"></a-entity>
    <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 6; lineColor: #85e3ce"></a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 6; lineColor: #85e3ce"></a-entity>
  </a-entity>

  <a-plane rotation="-90 0 0" width="30" height="30" material="shader: flat; color: #192e36"></a-plane>
  <a-entity light="type: ambient; intensity: 0.9"></a-entity>
  <a-entity light="type: directional; intensity: 2.2" position="-3 5 4"></a-entity>

  <a-entity id="view-object">
    <a-tetrahedron id="view-shape" radius="0.46" material="shader: standard; color: #66cfb7; roughness: 0.85"></a-tetrahedron>
  </a-entity>

  <a-entity id="view-xr" visible="false">
    <a-entity id="view-xr-history" position="0 2.4 -2.65" panel="w: 2; h: 0.48; px: 1024; bg: #14282f"></a-entity>
    ${buttons}
  </a-entity>
</a-scene>`;
