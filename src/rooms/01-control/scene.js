// Scene of room 01: a small booth like the one in Alloy & Abramson (1979, p. 450):
// a table with a black stand (23×23 cm) holding a yellow and a green light 5 cm
// from its top, a black box (15.5×7.5×4 cm) with a spring button, and a one-way
// mirror to the observation room with the relay equipment. The experimenter leaves
// through the door and comes back (p. 452). The wall screen carries the words of the
// experimenter. Look: a university lab of 1979 (painted block walls, linoleum,
// acoustic ceiling, bakelite and chrome). Sizes in metres, the room's own: the corridor stands it
// behind its door (src/app/lab.js), which the corridor builds (src/app/lobby/scene.js).
import { SIGN, SIGN_PANEL } from '../../app/brand.js';
import { plaqueX } from '../../app/lobby/plan.js';

// the booth's walls' inside faces and its ceiling, 3.2 × 3.2 m round the origin: its tiles and
// blocks are laid from that space (and the tests read where an eye can be in it)
export const BOOTH = { minX: -1.6, maxX: 1.6, minZ: -1.6, maxZ: 1.6, ceiling: 2.5 };
const SPACE = `space: 0 0 ${BOOTH.maxX - BOOTH.minX} ${BOOTH.maxZ - BOOTH.minZ}`;
// the doorway: the middle of door 1's masonry opening (x 0.2 to 1.2) on the back wall's inside face,
// the corridor beyond it
export const DOORWAY = { x: 0.7, z: BOOTH.maxZ };

// Light: an ambient fill and one warm lamp under an enamel shade (room-light: dark while the player
// is in the corridor, src/app/lobby/lobby.js). The lamp alone lights the desk to its approved level:
// the corridor's lamp, which reached through the wall until the corridor was put out of the room,
// gave the desk an eighth of its light, so the lamp was raised from 2.2 to 2.55, where the light
// meter (tests/smoke.mjs) reads the desk as before (0.622 against 0.626) and the corridor floor stays
// under a fifth of it (docs/building-standards.md, S13).
export const sceneHTML = `
  <a-entity class="room-light" light="type: ambient; color: #c9cfd6; intensity: 0.55"></a-entity>
  <a-entity class="room-light" light="type: point; color: #ffe2b0; intensity: 2.55; distance: 0; decay: 0.6" position="0 2.13 -0.2"></a-entity>
  <!-- the observation room's lamp, off until the reveal (room.js); outside the room's inside, which
       is hidden while its door is shut: lights are turned down, never hidden (src/app/lobby/lobby.js) -->
  <a-entity id="obsLight" light="type: point; color: #dfe7ff; intensity: 0; distance: 0; decay: 1" position="-2.4 2.1 -0.3"></a-entity>
  <!-- everything up to the screen is static: merged after load into one mesh per look -->
  <a-entity class="room-interior" merge-static>
  <a-cylinder radius="0.05" height="0.02" position="0 2.49 -0.2" color="#d8d4c8"></a-cylinder>
  <a-entity cable="radius: 0.004; color: #e8e2d2; points: 0 2.48 -0.2, 0.004 2.40 -0.2, 0 2.30 -0.2, 0 2.28 -0.2"></a-entity>
  <a-entity position="0 2.12 -0.2">
    <a-entity lathe="points: 0.17 0, 0.16 0.012, 0.12 0.07, 0.07 0.12, 0.03 0.15, 0.016 0.16; color: #2f4a3a; roughness: 0.35"></a-entity>
    <a-entity lathe="points: 0.168 0.002, 0.158 0.013, 0.118 0.07, 0.068 0.119, 0.029 0.149, 0.015 0.159; side: back; color: #efe9dc; roughness: 0.5"></a-entity>
    <a-sphere radius="0.034" position="0 0.03 0" material="color: #fff3d6; emissive: #ffdca0; emissiveIntensity: 1.5"></a-sphere>
  </a-entity>

  <!-- floor and ceiling -->
  <a-plane rotation="-90 0 0" position="0 0 0" width="3.2" height="3.2" surface="kind: linoleum; ${SPACE}"></a-plane>
  <a-plane rotation="90 0 0" position="0 2.5 0" width="3.2" height="3.2" surface="kind: ceiling; ${SPACE}"></a-plane>

  <!-- walls: painted concrete block, a darker band below a wooden rail at 0.8 m (on a joint); the
       wall above the rail and the band below it lie in one plane and meet under the rail (one
       plane over the other flickers in a headset: docs/vr-checklist.md) -->
  <a-plane position="0 1.65 -1.6" width="3.2" height="1.7" surface="kind: block; tint: #8a9479; ${SPACE}"></a-plane>
  <!-- back wall (0.2 m block wall to the corridor) around door 1's masonry opening
       (x 0.2 to 1.2, up to 2.2 m: on the block module, so no block is cut beside it:
       NCMA TEK 05-12, tests/masonry.test.mjs) -->
  <a-plane rotation="0 180 0" position="-0.7 1.65 1.6" width="1.8" height="1.7" surface="kind: block; tint: #8a9479; ${SPACE}"></a-plane>
  <a-plane rotation="0 180 0" position="1.4 1.65 1.6" width="0.4" height="1.7" surface="kind: block; tint: #8a9479; ${SPACE}"></a-plane>
  <a-plane rotation="0 180 0" position="0.7 2.35 1.6" width="1.0" height="0.3" surface="kind: block; tint: #8a9479; ${SPACE}"></a-plane>
  <a-plane rotation="0 -90 0" position="1.6 1.65 0" width="3.2" height="1.7" surface="kind: block; tint: #858f74; ${SPACE}"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 1.65 -1.25" width="0.7" height="1.7" surface="kind: block; tint: #858f74; ${SPACE}"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 1.65 0.95" width="1.3" height="1.7" surface="kind: block; tint: #858f74; ${SPACE}"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 0.9 -0.3" width="1.2" height="0.2" surface="kind: block; tint: #858f74; ${SPACE}"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 2.15 -0.3" width="1.2" height="0.7" surface="kind: block; tint: #858f74; ${SPACE}"></a-plane>
  <a-plane position="0 0.4 -1.6" width="3.2" height="0.8" surface="kind: block; tint: #5d6650; ${SPACE}"></a-plane>
  <a-plane rotation="0 180 0" position="-0.7 0.4 1.6" width="1.8" height="0.8" surface="kind: block; tint: #5d6650; ${SPACE}"></a-plane>
  <a-plane rotation="0 180 0" position="1.4 0.4 1.6" width="0.4" height="0.8" surface="kind: block; tint: #5d6650; ${SPACE}"></a-plane>
  <a-plane rotation="0 -90 0" position="1.6 0.4 0" width="3.2" height="0.8" surface="kind: block; tint: #59624c; ${SPACE}"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 0.4 0" width="3.2" height="0.8" surface="kind: block; tint: #59624c; ${SPACE}"></a-plane>
  <a-box position="0 0.8 -1.594" width="3.2" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
  <a-box position="-0.7056 0.8 1.594" width="1.7888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
  <a-box position="1.4056 0.8 1.594" width="0.3888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
  <a-box position="1.594 0.8 0" width="0.012" height="0.025" depth="3.2" color="#4a3b2c"></a-box>
  <a-box position="-1.594 0.8 0" width="0.012" height="0.025" depth="3.2" color="#4a3b2c"></a-box>
  <!-- 4 in vinyl base (docs/building-standards.md); on the back wall it stops at the door frame -->
  <a-box position="0 0.051 -1.5975" width="3.2" height="0.102" depth="0.005" color="#2b2d29"></a-box>
  <a-box position="-0.7056 0.051 1.5975" width="1.7888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
  <a-box position="1.4056 0.051 1.5975" width="0.3888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
  <a-box position="1.5975 0.051 0" width="0.005" height="0.102" depth="3.2" color="#2b2d29"></a-box>
  <a-box position="-1.5975 0.051 0" width="0.005" height="0.102" depth="3.2" color="#2b2d29"></a-box>

  <!-- one-way mirror in the left wall, framed on all sides -->
  <a-plane id="glass" data-dynamic rotation="0 90 0" position="-1.595 1.4 -0.3" width="1.2" height="0.8" mirror-glass="on: room-entered"
           material="color: #c2c9cd; metalness: 1; roughness: .04; opacity: .94; transparent: true"></a-plane>
  <a-box position="-1.585 0.99 -0.3" width="0.05" height="0.03" depth="1.26" color="#2a2a2a"></a-box>
  <a-box position="-1.585 1.81 -0.3" width="0.05" height="0.03" depth="1.26" color="#2a2a2a"></a-box>
  <a-box position="-1.585 1.4 -0.915" width="0.05" height="0.85" depth="0.03" color="#2a2a2a"></a-box>
  <a-box position="-1.585 1.4 0.315" width="0.05" height="0.85" depth="0.03" color="#2a2a2a"></a-box>

  <!-- the room's number inside, on the wall at the latch side of door 1 (the door's room face is its
       pull side), and the light switch beside the door -->
  <a-entity id="plaque" class="on-wall door-sign" ${SIGN_PANEL} position="${plaqueX(0.7, SIGN.fromFrame + SIGN.w / 2)} ${SIGN.y} 1.594" rotation="0 180 0"></a-entity>
  <a-entity rounded-box="width: 0.08; height: 0.12; depth: 0.012; radius: 0.006; color: #d8d2c2; roughness: 0.5"
            class="on-wall" position="1.4 1.1 1.592"></a-entity>

  <!-- observation room: desk with relay equipment, chair, the observer -->
  <a-box position="-2.4 1.25 -0.3" width="1.6" height="2.5" depth="2.4" material="color: #4a4d52; side: back; roughness: 1"></a-box>
  <a-box position="-2.75 0.74 -0.3" width="0.6" height="0.04" depth="1.0" color="#5a4a3a"></a-box>
  <a-box position="-2.75 0.37 0.12" width="0.5" height="0.72" depth="0.04" color="#3a3029"></a-box>
  <a-box position="-2.75 0.37 -0.72" width="0.5" height="0.72" depth="0.04" color="#3a3029"></a-box>
  <a-entity rounded-box="width: 0.24; height: 0.18; depth: 0.3; radius: 0.01; color: #2d2f33" position="-2.66 0.85 -0.5"></a-entity>
  <a-entity rounded-box="width: 0.2; height: 0.12; depth: 0.22; radius: 0.01; color: #2d2f33" position="-2.66 0.82 -0.12"></a-entity>
  <a-sphere radius="0.008" position="-2.785 0.9 -0.58" material="color: #300; emissive: #ff5040; emissiveIntensity: 0.8"></a-sphere>
  <a-sphere radius="0.008" position="-2.785 0.9 -0.54" material="color: #030; emissive: #50ff60; emissiveIntensity: 0.8"></a-sphere>
  <a-sphere radius="0.008" position="-2.765 0.84 -0.08" material="color: #330; emissive: #ffd040; emissiveIntensity: 0.8"></a-sphere>
  <a-entity id="observer" data-dynamic visible="false" position="-3.0 0 -0.3" rotation="0 -90 0">
    <a-entity rounded-box="width: 0.38; height: 0.56; depth: 0.22; radius: 0.08; color: #141416; roughness: 1" position="0 0.8 0.02"></a-entity>
    <a-cylinder radius="0.045" height="0.08" position="0 1.1 0.03" color="#141416" roughness="1"></a-cylinder>
    <a-sphere radius="0.105" position="0 1.22 0.03" color="#141416" roughness="1"></a-sphere>
    <a-entity rounded-box="width: 0.32; height: 0.13; depth: 0.42; radius: 0.05; color: #141416; roughness: 1" position="0 0.53 -0.2"></a-entity>
    <a-entity rounded-box="width: 0.28; height: 0.45; depth: 0.11; radius: 0.05; color: #141416; roughness: 1" position="0 0.24 -0.38"></a-entity>
    <a-entity rounded-box="width: 0.08; height: 0.4; depth: 0.09; radius: 0.035; color: #141416; roughness: 1" position="0.22 0.83 -0.06" rotation="-35 0 0"></a-entity>
    <a-entity rounded-box="width: 0.08; height: 0.4; depth: 0.09; radius: 0.035; color: #141416; roughness: 1" position="-0.22 0.83 -0.06" rotation="-35 0 0"></a-entity>
  </a-entity>
  <a-box position="-3.0 0.45 -0.3" width="0.4" height="0.04" depth="0.4" color="#2e3238"></a-box>
  <a-box position="-3.19 0.72 -0.3" width="0.03" height="0.5" depth="0.4" color="#2e3238"></a-box>
  <a-cylinder radius="0.015" height="0.45" position="-2.84 0.22 -0.14" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-2.84 0.22 -0.46" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-3.16 0.22 -0.14" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-3.16 0.22 -0.46" color="#777"></a-cylinder>
  <!-- cable from the booth wall along the floor, up the desk's front edge, into the relay equipment -->
  <a-box position="-1.615 0.05 -0.6" width="0.03" height="0.08" depth="0.08" color="#2a2a2a"></a-box>
  <a-entity cable="radius: 0.007; points: -1.62 0.045 -0.6, -1.64 0.02 -0.6, -1.68 0.007 -0.6, -1.95 0.007 -0.62,
    -2.25 0.007 -0.63, -2.40 0.009 -0.61, -2.435 0.04 -0.6, -2.442 0.3 -0.595, -2.442 0.70 -0.59, -2.442 0.752 -0.585,
    -2.452 0.768 -0.58, -2.50 0.767 -0.575, -2.545 0.79 -0.57"></a-entity>

  </a-entity>

  <!-- experimenter screen -->
  <a-box class="room-interior" position="0 1.86 -1.585" width="2.12" height="1.12" depth="0.03" color="#1b1c1e"></a-box>
  <a-entity id="screen" class="room-interior" panel="w: 2.0; h: 1.0; px: 2048; ref: 1300; bg: #0e0f11" position="0 1.86 -1.565"></a-entity>

  <a-entity id="room" class="room-interior" merge-static>
    <a-entity blob-shadow="w: 1.3; h: 0.8; opacity: 0.5" position="0 0.003 -0.3"></a-entity>
    <!-- table: wooden top (surface at 0.84 m) on a metal frame -->
    <a-entity rounded-box="width: 1.0; height: 0.035; depth: 0.52; radius: 0.004; color: #ffffff; roughness: 0.55"
              surface="kind: wood; repeat: 1 1" position="0 0.8225 -0.3"></a-entity>
    <a-box position="0 0.77 -0.51" width="0.86" height="0.07" depth="0.02" material="color: #5b5e60; metalness: .5; roughness: .45"></a-box>
    <a-box position="0 0.77 -0.09" width="0.86" height="0.07" depth="0.02" material="color: #5b5e60; metalness: .5; roughness: .45"></a-box>
    <a-box position="-0.44 0.77 -0.3" width="0.02" height="0.07" depth="0.38" material="color: #5b5e60; metalness: .5; roughness: .45"></a-box>
    <a-box position="0.44 0.77 -0.3" width="0.02" height="0.07" depth="0.38" material="color: #5b5e60; metalness: .5; roughness: .45"></a-box>
    <a-cylinder radius="0.016" height="0.79" position="-0.45 0.407 -0.52" material="color: #8a8d90; metalness: .6; roughness: .35"></a-cylinder>
    <a-cylinder radius="0.016" height="0.79" position="0.45 0.407 -0.52" material="color: #8a8d90; metalness: .6; roughness: .35"></a-cylinder>
    <a-cylinder radius="0.016" height="0.79" position="-0.45 0.407 -0.08" material="color: #8a8d90; metalness: .6; roughness: .35"></a-cylinder>
    <a-cylinder radius="0.016" height="0.79" position="0.45 0.407 -0.08" material="color: #8a8d90; metalness: .6; roughness: .35"></a-cylinder>
    <a-cylinder radius="0.02" height="0.012" position="-0.45 0.006 -0.52" color="#1a1a1a"></a-cylinder>
    <a-cylinder radius="0.02" height="0.012" position="0.45 0.006 -0.52" color="#1a1a1a"></a-cylinder>
    <a-cylinder radius="0.02" height="0.012" position="-0.45 0.006 -0.08" color="#1a1a1a"></a-cylinder>
    <a-cylinder radius="0.02" height="0.012" position="0.45 0.006 -0.08" color="#1a1a1a"></a-cylinder>

    <!-- stand 23×23 cm, black bakelite, lights 5 cm from the top in chrome bezels, facing the player -->
    <a-entity blob-shadow="w: 0.3; h: 0.12; opacity: 0.45" position="0 0.8425 -0.46"></a-entity>
    <a-entity rounded-box="width: 0.23; height: 0.23; depth: 0.018; radius: 0.004; color: #0d0d0e; roughness: 0.45"
              position="0 0.955 -0.46"></a-entity>
    <a-entity rounded-box="width: 0.23; height: 0.012; depth: 0.09; radius: 0.003; color: #0d0d0e; roughness: 0.45"
              position="0 0.846 -0.475"></a-entity>
    <a-torus radius="0.019" radius-tubular="0.0035" position="-0.045 1.02 -0.4505" material="color: #c9ccce; metalness: .85; roughness: .2"></a-torus>
    <a-torus radius="0.019" radius-tubular="0.0035" position="0.045 1.02 -0.4505" material="color: #c9ccce; metalness: .85; roughness: .2"></a-torus>
    <a-sphere id="yellow" data-dynamic radius="0.016" position="-0.045 1.02 -0.448"
              material="color: #3a3310; emissive: #ffd23a; emissiveIntensity: 0; roughness: .25"></a-sphere>
    <a-sphere id="green" data-dynamic radius="0.016" position="0.045 1.02 -0.448"
              material="color: #0f2a12; emissive: #38ff5a; emissiveIntensity: 0; roughness: .25"></a-sphere>

    <!-- response box 15.5×7.5×4 cm, black bakelite with four screws, spring button in a chrome collar -->
    <a-entity blob-shadow="w: 0.2; h: 0.11; opacity: 0.45" position="0 0.8425 -0.16"></a-entity>
    <a-entity rounded-box="width: 0.155; height: 0.04; depth: 0.075; radius: 0.006; color: #0d0d0e; roughness: 0.45"
              position="0 0.86 -0.16"></a-entity>
    <a-cylinder decal radius="0.0035" height="0.002" position="-0.064 0.881 -0.187" material="color: #b8bbbd; metalness: .8; roughness: .3"></a-cylinder>
    <a-cylinder decal radius="0.0035" height="0.002" position="0.064 0.881 -0.187" material="color: #b8bbbd; metalness: .8; roughness: .3"></a-cylinder>
    <a-cylinder decal radius="0.0035" height="0.002" position="-0.064 0.881 -0.133" material="color: #b8bbbd; metalness: .8; roughness: .3"></a-cylinder>
    <a-cylinder decal radius="0.0035" height="0.002" position="0.064 0.881 -0.133" material="color: #b8bbbd; metalness: .8; roughness: .3"></a-cylinder>
    <a-cylinder decal radius="0.021" height="0.004" position="0 0.882 -0.16" material="color: #c9ccce; metalness: .85; roughness: .2"></a-cylinder>
    <a-entity id="button" data-dynamic position="0 0.88 -0.16">
      <a-cylinder id="buttonCap" class="clickable grabbable" radius="0.016" height="0.012" position="0 0.006 0"
                  material="color: #c9c5bb; roughness: .5"></a-cylinder>
    </a-entity>

    <!-- cables: box to stand lying on the table; from the stand over the back edge, hanging
         freely, onto the floor and along it to the wall socket (one radius above each surface) -->
    <a-entity cable="radius: 0.005; points: 0 0.852 -0.19, 0 0.846 -0.215, 0.006 0.845 -0.27,
      0.008 0.845 -0.34, 0.003 0.845 -0.40, 0 0.845 -0.44"></a-entity>
    <a-entity cable="radius: 0.006; points: 0 0.846 -0.50, 0 0.846 -0.535, 0 0.846 -0.556, 0 0.836 -0.568,
      0 0.80 -0.574, -0.01 0.55 -0.582, -0.03 0.25 -0.592, -0.06 0.06 -0.61, -0.11 0.008 -0.65,
      -0.30 0.006 -0.70, -0.75 0.006 -0.69, -1.20 0.006 -0.64, -1.46 0.006 -0.61, -1.55 0.012 -0.60,
      -1.575 0.045 -0.60"></a-entity>
    <a-box position="-1.585 0.05 -0.6" width="0.03" height="0.08" depth="0.08" color="#2a2a2a"></a-box>

    <!-- the subject's chair (in the paper the subject sat), facing the table: room.js puts it under a
         seated player and pushes it back behind a standing one (that is where it starts) -->
    <a-entity id="chair" data-dynamic position="0.1 0 0.95" rotation="0 -8 0">
      <a-entity rounded-box="width: 0.42; height: 0.05; depth: 0.42; radius: 0.02; color: #6a3b26; roughness: 0.5" position="0 0.46 0"></a-entity>
      <a-entity rounded-box="width: 0.4; height: 0.24; depth: 0.03; radius: 0.012; color: #6a3b26; roughness: 0.5" position="0 0.8 0.2"></a-entity>
      <a-cylinder radius="0.011" height="0.44" position="-0.18 0.22 -0.18" material="color: #a9acae; metalness: .8; roughness: .3"></a-cylinder>
      <a-cylinder radius="0.011" height="0.44" position="0.18 0.22 -0.18" material="color: #a9acae; metalness: .8; roughness: .3"></a-cylinder>
      <a-cylinder radius="0.011" height="0.44" position="-0.18 0.22 0.18" material="color: #a9acae; metalness: .8; roughness: .3"></a-cylinder>
      <a-cylinder radius="0.011" height="0.44" position="0.18 0.22 0.18" material="color: #a9acae; metalness: .8; roughness: .3"></a-cylinder>
      <a-cylinder radius="0.01" height="0.32" position="-0.17 0.62 0.2" material="color: #a9acae; metalness: .8; roughness: .3"></a-cylinder>
      <a-cylinder radius="0.01" height="0.32" position="0.17 0.62 0.2" material="color: #a9acae; metalness: .8; roughness: .3"></a-cylinder>
    </a-entity>
  </a-entity>
`;
