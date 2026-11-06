// Headless runs of the default room and the Point of View route.
// Needs Playwright + Chromium
// (heavy: run it in CI, not on a laptop).
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';

const server = await startServer(0);
const url = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();

const errors = [];
function watchErrors(page) {
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
}
watchErrors(page);

const ready = (page) => page.waitForFunction(() => {
  const scene = document.querySelector('a-scene');
  return scene?.renderStarted && document.documentElement.dataset.roomState === 'run';
}, null, { timeout: 30000 });

const readProjection = (page) => page.locator('#view-object').evaluate((el) => {
  const { position, quaternion, scale } = el.object3D;
  return { position: position.toArray(), rotation: quaternion.toArray(), scale: scale.toArray() };
});

const history = page => page.locator('#view-history').textContent();
const button = (page, action) => page.locator(`button[data-view-action="${action}"]`);

try {
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded, null, { timeout: 30000 });
  assert.equal(await page.evaluate(() => document.documentElement.dataset.roomState), 'idle');
  assert.equal(await page.evaluate(() => document.querySelectorAll('.clickable').length), 4);

  await page.keyboard.press('Space');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.roomState), 'intro');
  await page.waitForFunction(() => document.documentElement.dataset.roomState === 'run', null, { timeout: 15000 });
  console.log('default room smoke test: ok');

  const roomUrl = url + '?room=02-point-of-view';
  await page.goto(roomUrl);
  await ready(page);
  assert.match(await history(page), /Действий: 0/);
  const original = await readProjection(page);
  await button(page, 'turn').click();
  assert.notDeepEqual((await readProjection(page)).rotation, original.rotation);
  await button(page, 'scale').focus();
  await page.keyboard.press('Enter');
  assert.notDeepEqual((await readProjection(page)).scale, original.scale);
  await button(page, 'angle').click();
  assert.notDeepEqual((await readProjection(page)).position, original.position);
  await button(page, 'return').click();
  assert.deepEqual(await readProjection(page), original);
  assert.match(await history(page), /Первый вид восстановлен.*Действий: 4.*Поворот → Размер → Ракурс → Возврат/);

  // Check the in-scene UI wiring without requiring a physical headset in CI.
  const xr = page.locator('#view-xr');
  await xr.evaluate((el) => {
    el.sceneEl.addState('vr-mode');
    el.sceneEl.emit('enter-vr');
  });
  assert.equal(await page.locator('#view-controls').isVisible(), false);
  assert.equal(await xr.locator('.clickable').count(), 4);
  await xr.locator('[data-view-action="turn"]').evaluate(el => el.emit('click'));
  assert.notDeepEqual((await readProjection(page)).rotation, original.rotation);
  await xr.evaluate((el) => {
    el.sceneEl.removeState('vr-mode');
    el.sceneEl.emit('exit-vr');
  });
  assert.equal(await xr.locator('.clickable').count(), 0);
  assert.equal(await page.locator('#view-controls').isVisible(), true);
  assert.match(await history(page), /Действий: 5/);
  console.log('Point of View desktop and VR interface wiring: ok');

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  watchErrors(phone);
  await phone.goto(roomUrl);
  await ready(phone);
  await button(phone, 'angle').tap();
  assert.notDeepEqual((await readProjection(phone)).position, original.position);
  await button(phone, 'return').tap();
  assert.deepEqual(await readProjection(phone), original);
  assert.match(await history(phone), /Действий: 2/);
  console.log('Point of View mobile touch: ok');

  assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
  console.log('smoke test: ok');
} finally {
  await browser.close();
  server.close();
}
