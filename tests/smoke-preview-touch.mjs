import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';
import { ROOM } from '../src/preview/layout.js';
import { T } from '../src/preview/texts.ru.js';

if (!process.env.CI) throw Error('Run the browser preview checks in CI.');
const server = await startServer(0, '127.0.0.1');
let browser;
try {
  browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({
    // Match phone layout while keeping software rendering small on the runner.
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 0.5
  });
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const path = '/src/preview/';
  await page.goto('http://127.0.0.1:' + server.address().port + path);
  await page.getByRole('status').filter({ hasText: T.touch.instruction }).waitFor({ timeout: 60000 });
  const session = await page.context().newCDPSession(page);
  const input = async (type, touchPoints) => {
    let timer;
    try {
      await Promise.race([
        session.send('Input.dispatchTouchEvent', { type, touchPoints }),
        new Promise((_, reject) => { timer = setTimeout(() => reject(Error(type + ' did not finish')), 12000); })
      ]);
    } finally {
      clearTimeout(timer);
    }
  };
  const point = async (selector, id) => {
    const { x, y, width, height } = await page.locator(selector).boundingBox();
    return { x: Math.round(x + width / 2), y: Math.round(y + height / 2), id };
  };
  const pose = () => page.locator('#preview-camera').evaluate(({ object3D: { position, rotation } }) => ({
    x: position.x, y: position.y, z: position.z, yaw: rotation.y, pitch: rotation.x
  }));
  const waitMoved = (key, from) => page.waitForFunction(({ key, from }) => {
    const camera = document.querySelector('#preview-camera').object3D;
    const next = key === 'yaw' ? camera.rotation.y : key === 'pitch' ? camera.rotation.x : camera.position[key];
    return Math.abs(next - from) > 0.025;
  }, { key, from }, { timeout: 15000 });
  const still = async () => {
    const stopped = await pose();
    const frame = await page.locator('a-scene').evaluate(scene => scene.renderer.info.render.frame);
    await page.waitForFunction(frame => document.querySelector('a-scene').renderer.info.render.frame >= frame + 2,
      frame, { timeout: 12000 });
    assert.deepEqual(await pose(), stopped, 'ended touch must not keep moving or looking');
  };
  const right = await point('#preview-touch [data-direction=right]', 1);
  const look = { x: 295, y: 380, id: 2 };
  const initial = await pose();
  await input('touchStart', [right, look]);
  await input('touchMove', [right, { ...look, x: look.x + 48, y: look.y + 24 }]);
  await waitMoved('yaw', initial.yaw);
  await waitMoved('pitch', initial.pitch);
  await waitMoved('x', initial.x);
  await input('touchMove', [{ ...right, x: right.x + 110 }, { ...look, x: look.x + 48, y: look.y + 24 }]);
  await input('touchEnd', []);
  await still();
  console.log('touch: two fingers, release outside and camera frame check passed');

  const beforeCancel = await pose();
  await input('touchStart', [right]);
  await waitMoved('x', beforeCancel.x);
  await input('touchCancel', []);
  await still();
  console.log('touch: cancel passed; approaching the working door');

  await page.getByRole('button', { name: T.views.door, exact: true }).tap();
  const forward = await point('#preview-touch [data-direction=forward]', 1);
  await input('touchStart', [forward]);
  try {
    await page.waitForFunction(target => document.querySelector('#preview-camera').object3D.position.x >= target,
      ROOM.doorX - 0.15, { timeout: 25000 });
  } finally {
    await input('touchEnd', []);
  }
  const byDoor = await pose();
  await page.getByRole('button', { name: T.touch.openDoor, exact: true }).tap();
  const stepInside = await point('#preview-touch [data-direction=right]', 1);
  await input('touchStart', [stepInside]);
  try {
    await page.getByRole('status').filter({ hasText: T.touch.room }).waitFor({ timeout: 25000 });
  } finally {
    await input('touchEnd', []);
  }
  await page.getByRole('button', { name: T.touch.returnDoor, exact: true }).tap();
  const returned = await pose();
  for (const key of Object.keys(byDoor)) {
    assert.ok(Math.abs(returned[key] - byDoor[key]) < 1e-6, 'touch return restores ' + key);
  }
  console.log('touch: door entry and return passed; rotating with a finger held');

  const beforeRotate = await pose();
  await input('touchStart', [stepInside]);
  await waitMoved('z', beforeRotate.z);
  try {
    await page.setViewportSize({ width: 568, height: 320 });
    await page.waitForFunction(() => matchMedia('(orientation: landscape)').matches);
    await still();
  } finally {
    await input('touchEnd', []);
  }
  await page.getByRole('button', { name: T.views.turn, exact: true }).tap();
  console.log('touch: landscape is active; checking look, door buttons and stairs');
  const landscapeLook = { x: 436, y: 120, id: 2 };
  const yaw = (await pose()).yaw;
  await input('touchStart', [landscapeLook]);
  await input('touchMove', [{ ...landscapeLook, x: landscapeLook.x + 10 }]);
  await waitMoved('yaw', yaw);
  await input('touchEnd', []);
  await page.getByRole('button', { name: T.views.door, exact: true }).tap();
  await page.getByRole('button', { name: T.touch.openDoor, exact: true }).tap();
  await page.getByRole('button', { name: T.touch.returnDoor, exact: true }).tap();
  await page.getByRole('button', { name: T.views.turn, exact: true }).tap();
  const beforeStair = await pose();
  const go = await point('#preview-touch [data-direction=forward]', 1);
  await input('touchStart', [go]);
  try {
    await waitMoved('y', beforeStair.y);
  } finally {
    await input('touchEnd', []);
  }
  await still();
  assert.deepEqual(errors, []);
  console.log('touch: cancel, door return and visible stair ascent passed in emulated Chromium');
} finally {
  try { await browser?.close(); }
  finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
