// What every place of the game stands on: the scene, how it is drawn, and the player (the rig with
// the camera and both controllers). The app holds it for the whole visit; the corridor and the rooms
// behind its doors are put into it (src/app/lab.js).
// The rig stands at the origin; the corridor turns it to face a place (src/app/lobby/lobby.js), and
// leaving a headset's session puts it back here (recenter.js).
// prewarm: everything drawn once before it is first seen, the room behind its shut door too
// (src/engine/prewarm.js).

// No fixed foveated rendering (A-Frame's default is the most): it draws the view away from the lens
// centre at a lower resolution, and Meta warns that "high-contrast or text-heavy scenes may make the
// foveation artifacts more obvious" (developers.meta.com/horizon/documentation/web/webxr-ffr); with
// it the door numbers looked blurred in the owner's headset and turned sharp without it.
// Multiview: both eyes drawn in one pass, so each draw call is made once a frame, not once an eye (Meta:
// "Only CPU-bound experiences will benefit", "a CPU usage reduction of 25% - 50%"; Meta's IWSDK turns it
// on by default: docs/research/engine-and-tools.md). A-Frame 1.8.0 passes the flag, but its three.js lost
// the call that uploads the textures deferred during a multiview frame, so canvas text first drawn in VR
// stayed black; vendor/aframe-1.8.0.min.js has it put back where super-three 0.181 has it
// (supermedium/three.js PR #25; tests/vendor.test.mjs). Without OCULUS_multiview each eye draws as before.
// ?multiview=0 turns it off, so the headset's measure can compare (tools/quest-look.mjs perf).
const MULTIVIEW = new URLSearchParams(globalThis.location?.search || '').get('multiview') !== '0';
const LASER = 'raycaster="objects: .clickable; far: 8; lineColor: #f0c96a; lineOpacity: .6" grab-press controller-batch';

// inside: the markup of the places, put in before the scene loads, so their static parts are merged
// and their tiles laid with everything else
export const stageHTML = (inside) => `<a-scene prewarm="show: .room-interior" renderer="antialias: true; colorManagement: true; foveationLevel: 0; multiviewStereo: ${MULTIVIEW}" background="color: #0b0b0d"
         cursor="rayOrigin: mouse" raycaster="objects: .clickable; far: 8"
         vr-mode-ui="enabled: true" loading-screen="enabled: false" xr-mode-ui="enabled: true">
  <a-entity id="rig" position="0 0 0" recenter>
    <a-entity id="cam" camera fader look-controls="pointerLockEnabled: false" wasd-controls="acceleration: 12" position="0 1.6 0" room-bounds></a-entity>
    <a-entity laser-controls="hand: left" ${LASER}></a-entity>
    <a-entity laser-controls="hand: right" ${LASER}></a-entity>
  </a-entity>
  ${inside}
</a-scene>`;
