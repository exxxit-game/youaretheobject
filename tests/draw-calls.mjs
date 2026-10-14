// How many draw calls one frame of a place costs in VR, at its worst view, counted on the real XR path:
// the smoke test puts on Meta's emulated headset (IWER, tests/smoke-vr.mjs) with both eyes drawn, each
// on its own: the emulator has no OCULUS_multiview, which the headset's browser has and the game turns
// on (src/app/stage.js), so in the headset each call is made once a frame. Quest 2, the
// weakest headset whose budget the game keeps (.claude/rules/game.md), wants fewer than 100 a frame
// (Meta, device optimization comparison: docs/research/vr/01-meta.md).
// The corridor is under it since parts that differ only in colour are merged (merge-static.js) and each
// controller is drawn as one mesh (controller-batch.js); room 101 since the corridor behind its shut door
// is no longer drawn from inside it (src/app/lobby/lobby.js: 144 calls before, 92 after).
// A budget kept only in memory grew unseen, so the smoke test measures it on every push.
// Runs in the page (the smoke test passes it to page.evaluate): self-contained, it uses only the
// page's THREE, document and the emulated headset (window.__xr). eyes: boxes [[x0, y0, z0], [x1, y1,
// z1]] where an eye can be; the views stand at their middle and at the middle of each half along the
// longer side, at standing eye height (1.6 m, or the box's top), looking every 45 degrees round,
// level. The worst view's calls are counted by the nearest entity with an id that holds each drawn
// mesh (by): where the next cut is (Meta's order: measure first, then merge:
// docs/research/revision-4-graphics.md).
export const QUEST2_FRAME = 100;
export const FRAME_BUDGET = { corridor: QUEST2_FRAME, room: QUEST2_FRAME };
export async function drawCalls({ eyes: boxes } = {}) {
  if (!boxes || !boxes.length) throw new Error('drawCalls: where an eye can be is not given');
  const sceneEl = document.querySelector('a-scene'), renderer = sceneEl.renderer, xr = window.__xr;
  if (!xr || !renderer.xr.isPresenting) throw new Error('drawCalls: not in VR on the emulated headset');
  // the next frame the headset draws of the scene: its calls, and by whom (renderer.info resets on each render).
  // A loop that stopped drawing would leave the wrapper in place and the smoke test waiting for ever:
  // after FRAME_WAIT the wrapper comes off and the measure fails
  const FRAME_WAIT = 10000;
  const nextFrame = (by) => new Promise((done, fail) => {
    const render = renderer.render, draw = renderer.renderBufferDirect;
    const timer = setTimeout(() => { renderer.render = render; renderer.renderBufferDirect = draw; fail(new Error(`drawCalls: no frame drawn in ${FRAME_WAIT} ms`)); }, FRAME_WAIT);
    renderer.render = function (scene, camera) {
      if (scene !== sceneEl.object3D) return render.call(this, scene, camera);
      clearTimeout(timer);
      renderer.render = render;
      if (by) {
        renderer.renderBufferDirect = function (cam, sc, geometry, material, object, group) {
          let p = object;
          while (p && !(p.el && p.el.id)) p = p.parent;
          const key = p ? p.el.id : 'scene';
          by[key] = (by[key] || 0) + 1;
          return draw.call(this, cam, sc, geometry, material, object, group);
        };
      }
      try { render.call(this, scene, camera); } finally { renderer.renderBufferDirect = draw; }
      done(renderer.info.render.calls);
    };
  });
  // the headset's pose is in the rig's space: the eye at a world point, turned to a world heading
  const rig = sceneEl.camera.el.parentNode.object3D;
  const pose = new THREE.Matrix4(), pos = new THREE.Vector3(), rot = new THREE.Quaternion(), scale = new THREE.Vector3();
  const look = async (at, deg, by) => {
    rig.updateMatrixWorld(true);
    pose.compose(new THREE.Vector3(...at), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (deg * Math.PI) / 180), new THREE.Vector3(1, 1, 1));
    pose.premultiply(new THREE.Matrix4().copy(rig.matrixWorld).invert()).decompose(pos, rot, scale);
    xr.position.set(pos.x, pos.y, pos.z);
    xr.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    await nextFrame();   // the frame in flight may hold the old pose
    return nextFrame(by);
  };
  let worst = { calls: 0 }, from = null;
  for (const [[x0, y0, z0], [x1, y1, z1]] of boxes) {
    const y = Math.min(1.6, y1), along = x1 - x0 >= z1 - z0;
    const spots = [0.25, 0.5, 0.75].map((k) => (along ? [x0 + k * (x1 - x0), y, (z0 + z1) / 2] : [(x0 + x1) / 2, y, z0 + k * (z1 - z0)]));
    for (const at of spots) {
      for (let deg = 0; deg < 360; deg += 45) {
        const calls = await look(at, deg);
        if (calls > worst.calls) { worst = { calls, at: at.map((v) => +v.toFixed(2)), deg }; from = at; }
      }
    }
  }
  if (!from) return worst;
  const by = {};
  await look(from, worst.deg, by);
  return { ...worst, by };
}
