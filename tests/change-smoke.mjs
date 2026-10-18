import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { exportGame } from '../tools/export-game.mjs';
import { startServer } from './static-server.mjs';
import { assertBrowserHost } from './browser-host.mjs';
assertBrowserHost();

export async function playChange(browser) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'objekt-change-')), 'game');
  const manifest = exportGame(root, out, { preview: true });
  fs.copyFileSync(path.join(out, 'uncached.html'), path.join(out, 'index.html'));
  const server = await startServer(0, { root: out });
  const origin = `http://localhost:${server.address().port}`;
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  const images = process.env.OBJECT_LINES_EVIDENCE && path.join(process.env.OBJECT_LINES_EVIDENCE, 'change');
  const errors = [], outside = [], layouts = []; let shot = 0;
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && /WebGLProgram|Shader Error|VALIDATE_STATUS/.test(m.text())) errors.push(m.text()); });
  page.on('request', r => { if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) outside.push(r.url()); });
  const state = value => page.waitForFunction(value => document.documentElement.dataset.roomState === value, value);
  const capture = async label => {
    const issues = await page.evaluate(() => [...document.querySelectorAll('#changeDisplay [panel]')].flatMap(el => {
      const p = el.components.panel; if (!p || !Number.isFinite(p.smallest)) return [];
      const eye = new THREE.Vector3(), at = new THREE.Vector3(); el.sceneEl.camera.getWorldPosition(eye); el.object3D.getWorldPosition(at);
      const mm = p.smallest / p.c.width * p.data.w * 1000;
      const deg = 360 / Math.PI * Math.atan(mm / 2000 / at.distanceTo(eye));
      return p.overflow || deg < 1.35 ? [`${el.id || el.className}: overflow=${p.overflow}, letter=${deg}`] : [];
    }));
    layouts.push(...issues.map(i => `${label}: ${i}`));
    if (images) { fs.mkdirSync(images, { recursive: true }); await page.screenshot({ path: path.join(images, `${++shot}-${label}.png`) }); }
  };
  const pick = async (index = 0) => {
    const sel = `#changeDisplay .answer[data-index="${index}"][data-ready="1"]`;
    const button = await page.waitForSelector(sel, { state: 'attached' });
    const point = await page.$eval(sel, el => {
      const v = new THREE.Vector3(); el.object3D.getWorldPosition(v); v.project(el.sceneEl.camera);
      const r = el.sceneEl.canvas.getBoundingClientRect(); return { x: r.left + (v.x + 1) * r.width / 2, y: r.top + (1 - v.y) * r.height / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.waitForFunction(sel => document.querySelector('a-scene').components.raycaster.intersectedEls.includes(document.querySelector(sel)), sel);
    await page.mouse.click(point.x, point.y); await page.waitForFunction(el => !el.isConnected, button);
  };
  const transform = () => page.evaluate(() => {
    const world = document.querySelector('#changeWorld').object3D, cam = document.querySelector('a-scene').camera;
    return { x: world.scale.x, y: world.position.y, pitch: world.rotation.x, grain: cam.getObjectByName('changeGrain').visible };
  });
  try {
    await page.addInitScript({ path: createRequire(import.meta.url).resolve('iwer/build/iwer.min.js') });
    await page.addInitScript(() => { window.__xr = new IWER.XRDevice(IWER.metaQuest3); window.__xr.installRuntime({ forceInstall: true }); });
    await page.goto(`${origin}/?room=03-change&trial=1`, { waitUntil: 'networkidle' });
    await state('intro'); await capture('intro'); await pick(); await state('ready'); await capture('ready');
    await pick(1); await capture('weaker'); await pick(2); await pick(2); await capture('stronger');
    // Menu hold restores geometry, rejects a partial pair and requires a complete repeat.
    await pick(); await state('first');
    await page.evaluate(async () => { const r = await import('./src/rooms/03-change/room.js'); r.hold(true); r.hold(false); });
    await state('interrupted'); assert.deepEqual(await transform(), { x: 1, y: 0, pitch: 0, grain: false });
    await capture('interrupted');
    // Actual-pixel regression: an opaque mask loses to late transparent scene details.
    await page.evaluate(() => {
      const scene = document.querySelector('a-scene'), camera = scene.camera;
      const mask = camera.getObjectByName('changeBlack');
      const probe = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthTest: false, depthWrite: false }));
      probe.position.z = -0.3; probe.renderOrder = 9000; camera.add(probe);
      mask.material.transparent = false; mask.material.needsUpdate = true;
      window.__blankPixels = [];
      AFRAME.registerComponent('change-blank-probe', {
        tock() {
          if (document.documentElement.dataset.roomState !== 'blank' || window.__blankPixels.length >= 2) return;
          const gl = scene.renderer.getContext(), pixel = new Uint8Array(4);
          gl.readPixels(Math.floor(gl.drawingBufferWidth / 2), Math.floor(gl.drawingBufferHeight / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
          window.__blankPixels.push([...pixel]);
          mask.material.transparent = true; mask.material.needsUpdate = true;
          if (window.__blankPixels.length === 2) {
            camera.remove(probe); probe.geometry.dispose(); probe.material.dispose();
          }
        }
      });
      scene.setAttribute('change-blank-probe', '');
    });
    await pick();
    for (let index = 0; index < 6; index++) {
      if (index) { await state('ready'); await pick(); }
      await state('first'); const first = await transform(); await capture(`view-${index}-first`);
      await state('blank');
      assert.equal(await page.evaluate(() => document.querySelector('a-scene').camera.getObjectByName('changeBlack').visible), true);
      if (!index) {
        await page.waitForFunction(() => window.__blankPixels.length === 2);
        const pixels = await page.evaluate(() => window.__blankPixels);
        assert.ok(pixels[0].slice(0, 3).every(v => v > 240), 'old opaque mask leaks the transparent detail');
        assert.ok(pixels[1].slice(0, 3).every(v => v <= 1), 'corrected mask covers the transparent detail with actual black pixels');
        await capture('black');
      }
      await state('second'); const second = await transform(); await capture(`view-${index}-second`);
      assert.notDeepEqual(first, second, `aspect ${index} actually changes rendered state`);
      await state('answer'); await capture(`answer-${index}`); await pick();
      await state('feedback'); await capture(`feedback-${index}`);
      assert.deepEqual(await transform(), { x: 1, y: 0, pitch: 0, grain: false }); await pick();
    }
    await state('done'); await capture('done'); await pick(); await state('intro');
    await page.evaluate(() => document.querySelector('a-scene').enterVR());
    await page.waitForFunction(() => document.querySelector('a-scene').renderer.xr.isPresenting);
    await capture('xr-intro');
    const xrPick = async () => {
      await page.waitForSelector('#changeDisplay .answer[data-index="0"][data-ready="1"]', { state: 'attached' });
      await page.evaluate(() => document.querySelector('#changeDisplay .answer[data-index="0"]').emit('click'));
    };
    await xrPick(); await state('ready'); await xrPick();
    await page.waitForFunction(() => document.querySelector('a-scene').camera.getObjectByName('changeGrain').visible);
    await capture('xr-grain');
    await page.evaluate(async () => { const r = await import('./src/rooms/03-change/room.js'); r.hold(true); r.hold(false); });
    await state('interrupted'); assert.deepEqual(await transform(), { x: 1, y: 0, pitch: 0, grain: false });
    await page.evaluate(() => document.querySelector('a-scene').exitVR());
    assert.deepEqual(errors, []); assert.deepEqual(outside, []); assert.deepEqual(layouts, []);
    if (images) {
      fs.writeFileSync(path.join(images, 'checks.json'), JSON.stringify({ version: manifest.version, errors, outside, layouts, sixAspects: true }, null, 2));
      fs.cpSync(out, path.join(images, 'game'), { recursive: true });
    }
    console.log('change smoke: real clicks, all six rendered changes, pause/repeat, completion and XR intro pass');
  } finally { await page.close(); await new Promise(resolve => server.close(resolve)); }
}
