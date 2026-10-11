// The corridor and room 01 once in VR, on Meta's emulated headset (IWER, npm iwer, MIT: "With IWER,
// automated testing in WebXR becomes a breeze"; docs/research/revision-5-testing-process.md): the game
// enters an immersive session as on a Quest 3 with both eyes drawn; the clipboard on its hook is taken
// as a player takes it, the right controller aimed at it and its trigger pressed; and each place's
// worst view is held to its budget of draw calls a frame, both eyes (draw-calls.mjs).
// Headless Chromium has a WebXR of its own with no headset behind it, so IWER is installed over it
// (forceInstall) before A-Frame loads, as its guide says: "before any rendering or WebXR logic".
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { drawCalls, FRAME_BUDGET, QUEST2_FRAME } from './draw-calls.mjs';

const IWER = createRequire(import.meta.url).resolve('iwer/build/iwer.min.js');
// Each eye sees what a Quest 3 eye sees, 110 degrees across and 96 down (Meta, "Compare headsets":
// docs/research/vr/01-meta.md): IWER draws an eye 'fovy' high on half the canvas, so the page is as
// wide as two eyes of that shape (tan 55 / tan 48 = 1.286 an eye) and fovy is 96 degrees. Its own
// default, 90 degrees on half of any window, saw less than a headset and counted fewer calls.
const EYES = { width: 1852, height: 720 }, FOVY = 96;

// In the page: turns the right controller until its ray meets the hanging page. The ray leaves the
// controller at A-Frame's own angle (laser-controls), so it is read back and corrected, as a hand would.
async function aimRight() {
  const frames = (n) => new Promise((done) => { const next = () => (n-- > 0 ? requestAnimationFrame(next) : done()); next(); });
  const c = window.__xr.controllers.right;
  const laser = [...document.querySelectorAll('[laser-controls]')].find((e) => e.getAttribute('laser-controls').hand === 'right');
  const target = document.querySelector('.sheet .paper').object3D.getWorldPosition(new THREE.Vector3());
  const rigQ = document.querySelector('a-scene').camera.el.parentNode.object3D.getWorldQuaternion(new THREE.Quaternion());
  let angle = 180;
  for (let i = 0; i < 6 && angle > 0.2; i++) {
    await frames(3);
    const ray = laser.components.raycaster.raycaster.ray;
    const want = target.clone().sub(ray.origin).normalize();
    angle = THREE.MathUtils.radToDeg(ray.direction.angleTo(want));
    const turn = new THREE.Quaternion().setFromUnitVectors(ray.direction.clone().normalize(), want);
    const q = new THREE.Quaternion(c.quaternion.x, c.quaternion.y, c.quaternion.z, c.quaternion.w)
      .premultiply(rigQ.clone().invert().multiply(turn).multiply(rigQ));
    c.quaternion.set(q.x, q.y, q.z, q.w);
  }
  await frames(3);
  return { angle: +angle.toFixed(2), hit: laser.components.raycaster.intersectedEls.some((el) => el.closest('.sheet')) };
}

export async function playVR(browser, url, { corridor, room }) {
  const page = await browser.newPage({ viewport: EYES });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const frames = (n) => page.evaluate((k) => new Promise((done) => { const next = () => (k-- > 0 ? requestAnimationFrame(next) : done()); next(); }), n);
  const pick = async (i) => {
    await page.waitForFunction((n) => [...document.querySelectorAll('.answer')].some((e) => +e.dataset.index === n && e.dataset.ready), i, { timeout: 30000 });
    await page.evaluate((n) => [...document.querySelectorAll('.answer')].find((e) => +e.dataset.index === n).emit('click'), i);
  };
  try {
    await page.addInitScript({ path: IWER });
    await page.addInitScript((fovy) => {
      window.__xr = new IWER.XRDevice(IWER.metaQuest3);
      window.__xr.stereoEnabled = true;
      window.__xr.fovy = (fovy * Math.PI) / 180;
      window.__xr.installRuntime({ forceInstall: true });
    }, FOVY);
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded, null, { timeout: 30000 });
    await page.evaluate(() => document.querySelector('a-scene').enterVR());
    // a failed start says what the page saw: its errors and how far the session got
    await page.waitForFunction(() => {
      const xr = document.querySelector('a-scene').renderer.xr;
      return xr.isPresenting && xr.getCamera().cameras.length === 2;
    }, null, { timeout: 20000 }).catch(async (e) => {
      const seen = await page.evaluate(() => { const r = document.querySelector('a-scene').renderer; return { presenting: r.xr.isPresenting, cameras: r.xr.getCamera().cameras.length, frame: r.info.render.frame }; });
      throw new Error(`VR did not start: ${JSON.stringify(seen)}; page errors: ${errors.join(' | ') || 'none'} (${e.message})`);
    });
    // the sign starts on entering VR; then the clipboard waits on its hook
    await page.waitForFunction(() => document.querySelector('.sheet[data-take]'), null, { timeout: 60000 });
    const corridorCalls = await page.evaluate(drawCalls, corridor);
    assert.ok(corridorCalls.calls < FRAME_BUDGET.corridor, `the corridor's worst view draws ${corridorCalls.calls} calls a frame in VR (${JSON.stringify(corridorCalls)}), held under ${FRAME_BUDGET.corridor}`);
    // back where the player stands, then the page taken with the trigger
    await page.evaluate(() => { window.__xr.position.set(0, 1.6, 0); window.__xr.quaternion.set(0, 0, 0, 1); });
    await frames(4);
    // the ray shows only where it can act (src/engine/laser-beam.js; Meta, Ray casting specs): turned to
    // the floor it fades out, on the clipboard it shows, and while the stick aims the teleport arc it is off
    const beam = (shown, why) => page.waitForFunction((want) => {
      const laser = [...document.querySelectorAll('[laser-controls]')].find((e) => e.getAttribute('laser-controls').hand === 'right');
      const line = laser.getObject3D('line');
      return want ? !!line && line.material.visible && line.material.opacity > 0.5 : !line || !line.material.visible;
    }, shown, { timeout: 5000 }).catch(() => { throw new Error(`the right controller's ray ${why}`); });
    await page.evaluate(() => window.__xr.controllers.right.quaternion.set(-Math.SQRT1_2, 0, 0, Math.SQRT1_2));
    await beam(false, 'stays drawn while it points at the floor, where nothing can be pressed');
    const aim = await page.evaluate(aimRight);
    assert.ok(aim.hit, `the right controller's ray does not meet the clipboard (${JSON.stringify(aim)})`);
    await beam(true, 'is not drawn while it points at the clipboard');
    // the stick pushed forward aims a teleport; a click on the stick cancels it, so the player stays
    await page.evaluate(() => window.__xr.controllers.right.updateAxes('thumbstick', 0, -1));
    await beam(false, 'stays drawn beside the teleport arc');
    await page.evaluate(() => window.__xr.controllers.right.updateButtonValue('thumbstick', 1));
    await frames(4);
    await page.evaluate(() => { window.__xr.controllers.right.updateAxes('thumbstick', 0, 0); window.__xr.controllers.right.updateButtonValue('thumbstick', 0); });
    await beam(true, 'does not come back on the clipboard once the teleport is cancelled');
    await page.evaluate(() => window.__xr.controllers.right.updateButtonValue('trigger', 1));
    await frames(4);
    await page.evaluate(() => window.__xr.controllers.right.updateButtonValue('trigger', 0));
    await page.waitForFunction(() => document.querySelectorAll('.sheet .answer').length === 1, null, { timeout: 30000 });
    // the welcome, the form signed, the age, "start without recording", then door 1 and the room's two pages
    await pick(0);
    for (let k = 0; k < 2; k++) {
      await page.waitForFunction(() => document.querySelectorAll('.sheet .ink-field').length === 1 && !document.querySelector('.sheet .answer'), null, { timeout: 30000 });
      await page.evaluate(() => document.querySelectorAll('.ink-field').forEach((f) => f.components.ink.addStroke([[0.1, 0.6], [0.4, 0.3], [0.7, 0.6], [0.9, 0.4]])));
      await pick(0);
    }
    await pick(0);
    await pick(1);
    await page.waitForFunction(() => document.documentElement.dataset.lobby === 'door', null, { timeout: 30000 });
    await page.evaluate(() => document.querySelector('#door1 .clickable').emit('click'));
    for (let k = 0; k < 2; k++) {
      await page.waitForFunction(() => document.documentElement.dataset.roomState === 'intro' && document.querySelectorAll('.answer').length === 2, null, { timeout: 30000 });
      await pick(0);
      await page.waitForFunction(() => document.querySelectorAll('.answer').length === 0, null, { timeout: 30000 });
    }
    await page.waitForFunction(() => document.documentElement.dataset.roomState === 'run', null, { timeout: 60000 });
    const roomCalls = await page.evaluate(drawCalls, room);
    assert.ok(roomCalls.calls < FRAME_BUDGET.room, `the room's worst view draws ${roomCalls.calls} calls a frame in VR (${JSON.stringify(roomCalls)}), held under ${FRAME_BUDGET.room}`);
    assert.deepEqual(errors, [], `page errors in VR: ${errors.join(' | ')}`);
    return `draw calls a frame in VR, both eyes, worst view: corridor ${corridorCalls.calls}, room ${roomCalls.calls} (held under ${FRAME_BUDGET.corridor} and ${FRAME_BUDGET.room}; Quest 2 needs under ${QUEST2_FRAME}); the clipboard taken with the trigger`;
  } finally {
    await page.close();
  }
}
