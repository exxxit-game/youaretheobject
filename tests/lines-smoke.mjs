import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { exportGame } from '../tools/export-game.mjs';
import { startServer } from './static-server.mjs';
import { assertBrowserHost } from './browser-host.mjs';

assertBrowserHost();

export async function playLines(browser) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'objekt-lines-preview-')), 'game');
  const manifest = exportGame(root, out, { preview: true });
  // Serve the export's existing uncached fallback as the entry: this check is gameplay,
  // not the separate immutable-delivery/cache check. Static server allows public source paths only.
  fs.copyFileSync(path.join(out, 'uncached.html'), path.join(out, 'index.html'));
  const server = await startServer(0, { root: out });
  const origin = `http://localhost:${server.address().port}`;
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  const errors = [], outside = [], images = process.env.OBJECT_LINES_EVIDENCE;
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) outside.push(r.url()); });
  let shot = 0;
  const capture = async label => {
    const problems = await page.evaluate(() => {
      const eye = new THREE.Vector3(); document.querySelector('a-scene').camera.getWorldPosition(eye);
      return [...document.querySelectorAll('#linesDisplay [panel]')].flatMap(el => {
        if (el.id === 'linesScreen' && ['adjust'].includes(document.documentElement.dataset.roomState)
          || el.id === 'linesScreen' && document.querySelector('#linesDisplay').dataset.resultPage === 'inspect') return [];
        const p = el.components.panel;
        if (!p || !Number.isFinite(p.smallest)) return [];
        const at = new THREE.Vector3(); el.object3D.getWorldPosition(at);
        const mm = p.smallest / p.c.width * p.data.w * 1000;
        const deg = 360 / Math.PI * Math.atan(mm / 2000 / at.distanceTo(eye));
        return p.overflow || deg < 1.35 ? [`${el.id || el.className}: overflow=${p.overflow}, font=${deg.toFixed(2)}deg`] : [];
      });
    });
    assert.deepEqual(problems, [], `${label}: text fits at readable size`);
    if (!images) return;
    fs.mkdirSync(images, { recursive: true });
    await page.screenshot({ path: path.join(images, `${++shot}-${label}.png`) });
  };
  const state = s => page.waitForFunction(s => document.documentElement.dataset.roomState === s, s);
  const pick = async (i = 0, scope = '#linesDisplay') => {
    const sel = `${scope} .answer[data-index="${i}"][data-ready="1"]`;
    const button = await page.waitForSelector(sel, { state: 'attached' });
    // Real desktop click through A-Frame's cursor, not a synthetic answer event.
    const point = await page.$eval(sel, el => {
      const sc = el.sceneEl, v = new THREE.Vector3(); el.object3D.getWorldPosition(v); v.project(sc.camera);
      const r = sc.canvas.getBoundingClientRect(); return { x: r.left + (v.x + 1) * r.width / 2, y: r.top + (1 - v.y) * r.height / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.waitForFunction(sel => document.querySelector('a-scene').components.raycaster.intersectedEls.includes(document.querySelector(sel)), sel);
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(el => !el.isConnected, button);
  };
  try {
    await page.goto(`${origin}/?room=02-lines&trial=1&speed=20`, { waitUntil: 'networkidle' });
    await state('intro'); await capture('intro');
    await pick(); await state('instructions'); await capture('instructions');
    await pick(); await state('practice'); await capture('practice');
    await pick(); await state('adjust');
    const before = await page.$eval('#linesScreen', el => el.components.panel.c.toDataURL());
    await page.keyboard.down('ArrowUp'); await page.waitForTimeout(250); await page.keyboard.up('ArrowUp');
    const after = await page.$eval('#linesScreen', el => el.components.panel.c.toDataURL());
    assert.notEqual(after, before, 'keyboard changes the visible comparison line'); await capture('adjust');
    // Pause interrupts, cannot silently record a partly observed adjustment.
    await page.keyboard.press('Escape'); await page.waitForFunction(() => document.documentElement.dataset.menu);
    await capture('menu'); await page.keyboard.press('Escape'); await state('interrupted'); await capture('interrupted');
    await pick(); await state('adjust'); await pick(); await state('adjust'); await pick(); await state('ready');
    await capture('ready'); await pick(); await state('adjust');
    for (let i = 0; i < 4; i++) { await pick(); if (i < 3) await state('adjust'); }
    await state('feedback'); await capture('feedback'); await pick(); await state('done'); await capture('results');
    await pick(); await capture('reveal'); await pick(); await capture('source');
    await pick(); await capture('inspect'); await pick(1);
    assert.equal(await page.$eval('#linesDisplay', el => el.dataset.resultPage), '0');
    await pick(); await pick(); await pick(2); await state('intro');
    // Cancelling reset keeps the run; stopping needs an explicit second choice.
    await page.keyboard.press('Escape'); await pick(1, '#menu'); await pick(1, '#menu'); await state('intro');
    await page.evaluate(() => { document.querySelector('#cam').object3D.position.y = 1.05; });
    await page.keyboard.press('Escape'); await pick(2, '#menu'); await pick(0, '#menu'); await state('idle');
    const stopY = await page.$eval('#trialStopped', el => el.object3D.position.y);
    assert.ok(Math.abs(stopY + 0.55) < 0.001, 'stop UI follows seated eye height');
    await pick(0, '#trialStopped'); await state('intro');
    // Same module, different assignment; no protocol/identity/folder copy.
    const relocated = await page.evaluate(async () => {
      const r = await import('./src/rooms/02-lines/room.js'); const root = document.querySelector('#roomPlace');
      r.dispose(); root.setAttribute('position', '4 0 -2'); root.setAttribute('rotation', '0 180 0');
      r.mount(root, { number: '205' }); r.enter(false);
      const seat = new THREE.Vector3(0, 0, 0.35); root.object3D.updateWorldMatrix(true, false); root.object3D.localToWorld(seat);
      const rig = document.querySelector('#rig'); rig.object3D.position.copy(seat); rig.object3D.rotation.y = Math.PI;
      rig.emit('recentered');
      return { id: r.ENTRY.id, title: document.title, state: document.documentElement.dataset.roomState };
    });
    assert.deepEqual(relocated, { id: '02-lines', title: '\u041f\u0440\u043e\u0431\u0430 \u00b7 205', state: 'intro' });
    await pick(); await state('instructions'); await pick(); await pick(); await state('adjust');
    await capture('relocated-adjust'); await pick(); await pick(); await state('ready');
    assert.deepEqual(errors, []); assert.deepEqual(outside, [], 'no requests leave the preview origin');
    const receipt = { exportedVersion: manifest.version, uncachedEntrypoint: true, output: out,
      checks: ['real mouse clicks', 'keyboard adjustment', 'pause', 'complete flow', 'reveal pages', 'restart confirmation', 'seated stop', 'relocated 205 practice'], errors, outside };
    if (images) fs.writeFileSync(path.join(images, 'browser.json'), JSON.stringify(receipt, null, 2));
    console.log('lines browser: ok', JSON.stringify(receipt));
  } catch (error) {
    if (images) { fs.mkdirSync(images, { recursive: true }); await page.screenshot({ path: path.join(images, 'failure.png') }).catch(() => {}); }
    console.error('lines browser failure', { errors, body: (await page.locator('body').textContent()).slice(0, 800), state: await page.getAttribute('html', 'data-room-state') });
    throw error;
  } finally { await page.close(); server.close(); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader', `--log-file=${path.join(os.tmpdir(), 'objekt-lines-chromium.log')}`] });
  try { await playLines(browser); } finally { await browser.close(); }
}
