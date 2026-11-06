import { ACTIONS } from './view.js';

const buttons = ACTIONS.map((action, i) => `
  <a-plane data-view-action="${action}" position="${(i % 3 - 1) * 0.65} ${i < 3 ? 1.03 : 0.8} -2.45"
           width="0.62" height="0.19" material="shader: flat; color: #23424b">
    <a-entity position="0 0 0.003" panel="w: 0.60; h: 0.18; px: 512"></a-entity>
  </a-plane>`).join('');

export const sceneHTML = `<a-scene renderer="antialias: true; colorManagement: true"
    background="color: #102229" loading-screen="enabled: false"
    xr-mode-ui="enabled: false; XRMode: vr">
  <a-entity recenter="x: 0; z: 0">
    <a-entity camera look-controls="mouseEnabled: false; touchEnabled: false; magicWindowTrackingEnabled: false"
              position="0 1.6 0"></a-entity>
    <a-entity data-view-hand="left" laser-controls="hand: left" raycaster="objects: .clickable; far: 6; lineColor: #85e3ce"></a-entity>
    <a-entity data-view-hand="right" laser-controls="hand: right" raycaster="objects: .clickable; far: 6; lineColor: #85e3ce"></a-entity>
  </a-entity>

  <a-plane rotation="-90 0 0" width="30" height="30" material="shader: flat; color: #192e36"></a-plane>
  <a-entity id="view-object">
    <a-box width="0.88" height="0.7" depth="0.012" material="shader: flat; color: #66cfb7"></a-box>
  </a-entity>

  <a-entity id="view-xr" visible="false">
    <a-entity id="view-xr-history" position="0 2.48 -2.65" panel="w: 2; h: 0.62; px: 1024; bg: #14282f"></a-entity>
    ${buttons}
  </a-entity>
</a-scene>`;
