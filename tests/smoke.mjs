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
  assert.match(await history(page), /Вид: 0°.*Память: 0.*Действий: 0/);
  const original = await readProjection(page);
  await button(page, 'end').click();
  assert.deepEqual(await readProjection(page), original);
  assert.match(await history(page), /Вид: 180°.*Память: 0.*Действий: 1/);
  assert.equal(await button(page, 'end').getAttribute('aria-pressed'), 'true');

  await button(page, 'restart').click();
  await button(page, 'front').focus();
  await page.keyboard.press('Enter');
  assert.notDeepEqual((await readProjection(page)).rotation, original.rotation);
  await button(page, 'end').click();
  assert.deepEqual(await readProjection(page), original);
  assert.match(await history(page), /Вид: 180°.*Память: 1.*Действий: 2.*90° → 180°/);

  await button(page, 'scale').click();
  assert.notDeepEqual((await readProjection(page)).scale, original.scale);
  await button(page, 'angle').click();
  assert.notDeepEqual((await readProjection(page)).position, original.position);
  await button(page, 'restart').click();
  assert.deepEqual(await readProjection(page), original);
  assert.match(await history(page), /Вид: 0°.*Память: 0.*Действий: 0/);

  // Route synthetic selections to the originating ray without a headset in CI.
  const xr = page.locator('#view-xr');
  await xr.evaluate((el) => {
    el.sceneEl.xrSession = new EventTarget();
    el.sceneEl.addState('vr-mode');
    el.sceneEl.emit('enter-vr');
  });
  assert.equal(await page.locator('#view-controls').isVisible(), false);
  assert.equal(await xr.locator('.clickable').count(), 6);
  await xr.evaluate((el) => {
    const left = el.sceneEl.querySelector('[data-view-hand="left"]').components.raycaster;
    const right = el.sceneEl.querySelector('[data-view-hand="right"]').components.raycaster;
    left.intersectedEls = [];
    right.intersectedEls = [el.querySelector('[data-view-action="front"]')];
    const select = new Event('select');
    select.inputSource = { handedness: 'left' };
    el.sceneEl.xrSession.dispatchEvent(select);
  });
  assert.match(await history(page), /Память: 0.*Действий: 0/);
  await xr.evaluate((el) => {
    const left = el.sceneEl.querySelector('[data-view-hand="left"]').components.raycaster;
    const right = el.sceneEl.querySelector('[data-view-hand="right"]').components.raycaster;
    left.intersectedEls = [el.querySelector('[data-view-action="end"]')];
    right.intersectedEls = [el.querySelector('[data-view-action="front"]')];
    const select = new Event('select');
    select.inputSource = { handedness: 'right' };
    el.sceneEl.xrSession.dispatchEvent(select);
    select.inputSource = { handedness: 'left' };
    el.sceneEl.xrSession.dispatchEvent(select);
  });
  assert.deepEqual(await readProjection(page), original);
  await xr.evaluate((el) => {
    el.sceneEl.removeState('vr-mode');
    el.sceneEl.emit('exit-vr');
  });
  assert.equal(await xr.locator('.clickable').count(), 0);
  assert.equal(await page.locator('#view-controls').isVisible(), true);
  assert.match(await history(page), /Вид: 180°.*Память: 1.*Действий: 2.*90° → 180°/);
  console.log('Point of View desktop and VR interface wiring: ok');

  const phone = await browser.newPage({ viewport: { width: 375, height: 568 }, isMobile: true, hasTouch: true });
  watchErrors(phone);
  await phone.goto(roomUrl);
  await ready(phone);
  await button(phone, 'end').tap();
  assert.deepEqual(await readProjection(phone), original);
  assert.match(await history(phone), /Память: 0/);
  await button(phone, 'restart').tap();
  await button(phone, 'front').tap();
  assert.notDeepEqual(await readProjection(phone), original);
  await button(phone, 'end').tap();
  assert.deepEqual(await readProjection(phone), original);
  assert.match(await history(phone), /Память: 1.*Действий: 2/);
  console.log('Point of View mobile touch: ok');

  assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
  console.log('smoke test: ok');
} finally {
  await browser.close();
  server.close();
}
