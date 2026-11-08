// Browser coverage of the real corridor page. Run on the GitHub runner, not the laptop.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';
import { ANCHORS } from '../src/preview/route.js';
import { T } from '../src/preview/texts.ru.js';

if (!process.env.CI) throw Error('Run this browser check in CI; no laptop browser installation is needed.');
const server = await startServer(0, '127.0.0.1');
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const failures = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => failures.push(e.message));
page.on('console', m => { if (m.type() === 'error') failures.push(m.text()); });
page.on('requestfailed', r => failures.push('request failed: ' + r.url()));
page.on('response', r => { if (r.status() >= 400) failures.push(r.status() + ': ' + r.url()); });
page.on('request', r => {
  if (!/^(data|blob):/.test(r.url()) && new URL(r.url()).origin !== base) failures.push('outside request: ' + r.url());
});
const pose = () => page.evaluate(() => {
  const c = document.querySelector('#preview-camera').object3D;
  return { x: c.position.x, y: c.position.y, z: c.position.z, yaw: c.rotation.y, pitch: c.rotation.x };
});
const settled = async () => {
  const samples = await page.evaluate(async () => {
    const samples = [];
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const c = document.querySelector('#preview-camera').object3D;
      samples.push([c.position.x,c.position.y,c.position.z,c.rotation.y,c.rotation.x]);
    }
    return samples;
  });
  samples[1].forEach((v,i) => assert.ok(Math.abs(v-samples[2][i]) < 1e-7, 'input must stop after release or focus loss'));
};
const moved = (axis, before) => page.waitForFunction(({ axis, before }) => {
  const c = document.querySelector('#preview-camera').object3D;
  const value = axis === 'yaw' ? c.rotation.y : axis === 'pitch' ? c.rotation.x : c.position[axis];
  return Math.abs(value-before) > 0.025;
}, { axis, before }, { timeout: 10000 });
try {
  await page.goto(base + '/src/preview/');
  await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded &&
    document.querySelector('#preview-world')?.object3D.children.length > 0);
  await page.getByRole('status').filter({ hasText: T.instruction }).waitFor();
  assert.equal(await page.title(), T.title);
  for (const id of ['top','below','start']) {
    await page.getByRole('button', { name: T.views[id], exact: true }).click();
    const p = await pose(), a = ANCHORS[id];
    assert.ok(Math.abs(p.x-a.x)<1e-6 && Math.abs(p.z-a.z)<1e-6, 'view button changes the actual camera anchor');
    assert.ok(Math.abs(p.yaw-a.yaw*Math.PI/180)<1e-6, 'view button changes actual yaw');
  }
  const oldHeight = (await pose()).y;
  await page.locator('#preview-eye').focus();
  await page.keyboard.press('End');
  assert.equal(await page.locator('#preview-eye').inputValue(), '1.9');
  assert.ok(Math.abs((await pose()).y-oldHeight-0.3)<1e-6, 'height control changes the real camera');
  await page.getByRole('button', { name: T.views.start, exact: true }).click();
  for (const [key,axis] of [['ArrowUp','x'],['ArrowLeft','yaw'],['KeyR','pitch'],['KeyF','pitch']]) {
    const before = (await pose())[axis];
    await page.keyboard.down(key);
    await moved(axis,before);
    await page.keyboard.up(key);
    await settled();
  }
  await page.getByRole('button', { name: T.views.start, exact: true }).click();
  let before = (await pose()).x;
  await page.keyboard.down('ArrowUp'); await moved('x',before);
  await page.locator('#preview-eye').focus(); await settled(); await page.keyboard.up('ArrowUp');
  await page.getByRole('button', { name: T.views.start, exact: true }).click();
  before = (await pose()).x;
  await page.keyboard.down('ArrowUp'); await moved('x',before);
  // Exercise the blur handler; this is not a physical window-focus or headset test.
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await settled(); await page.keyboard.up('ArrowUp');
  assert.deepEqual(failures, [], 'the corridor boots and responds without errors or outside requests');
  console.log('corridor smoke: boot, real view/height controls, keyboard and input clearing passed; walking route/Quest untested');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

