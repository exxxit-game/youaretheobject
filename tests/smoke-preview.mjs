// Browser coverage of the real corridor page. Run on the GitHub runner, not the laptop.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';
import { ANCHORS } from '../src/preview/route.js';
import { ROOM } from '../src/preview/layout.js';
import { T } from '../src/preview/texts.ru.js';
import { DEAL_KEY } from '../src/preview/deal-state.js';

if (!process.env.CI) throw Error('Run this browser check in CI; no laptop browser installation is needed.');
let server, browser, page, base;
const failures = [];
const pose = () => page.evaluate(() => {
  const c = document.querySelector('#preview-camera').object3D;
  return { x: c.position.x, y: c.position.y, z: c.position.z, yaw: c.rotation.y, pitch: c.rotation.x };
});
const settled = async () => {
  const handle = await page.waitForFunction(() => {
    const c = document.querySelector('#preview-camera').object3D;
    const samples = window.__corridorSamples ||= [];
    samples.push([c.position.x,c.position.y,c.position.z,c.rotation.y,c.rotation.x]);
    return samples.length === 3 ? samples : false;
  }, null, { polling:'raf', timeout:60000 });
  const samples = await handle.jsonValue(); await handle.dispose();
  await page.evaluate(() => { delete window.__corridorSamples; });
  samples[1].forEach((v,i) => assert.ok(Math.abs(v-samples[2][i]) < 1e-7, 'input must stop after release or focus loss'));
};
const moved = (axis, before) => page.waitForFunction(({ axis, before }) => {
  const c = document.querySelector('#preview-camera').object3D;
  const value = axis === 'yaw' ? c.rotation.y : axis === 'pitch' ? c.rotation.x : c.position[axis];
  return Math.abs(value-before) > 0.025;
}, { axis, before }, { timeout: 30000 });
const motionState = () => page.evaluate(() => {
  const scene = document.querySelector('a-scene'), c = document.querySelector('#preview-camera').object3D;
  return { at:performance.now(), renderedFrame:scene.renderer?.info?.render?.frame ?? null,
    x:c.position.x,y:c.position.y,z:c.position.z,yaw:c.rotation.y,pitch:c.rotation.x,
    visible:document.visibilityState,focus:document.activeElement?.id,
    hint:document.querySelector('#preview-hint').textContent };
});
const walkAxis = async (key, axis, target) => {
  const before = (await pose())[axis], direction = Math.sign(target - before);
  if (Math.abs(target - before) < 0.03) return;
  const start = await motionState();
  await page.keyboard.down(key);
  try {
    await page.waitForFunction(({axis,target,direction}) => {
      const p = document.querySelector('#preview-camera').object3D.position;
      return (p[axis] - target) * direction >= 0;
    }, {axis,target,direction}, {polling:'raf', timeout:60000});
  } catch (error) {
    console.error('corridor motion failure',JSON.stringify({key,axis,target,start,
      end:await motionState().catch(e=>({error:e.message}))}));
    throw error;
  } finally { await page.keyboard.up(key); }
  await settled();
  assert.ok(Math.abs((await pose())[axis] - target) < 0.24, 'keyboard walk reaches its intended area');
};
const shownFloor = () => page.locator('#preview-lower-sign').getAttribute('data-number');
const samePose = (a,b) => Object.keys(a).forEach(k => assert.ok(Math.abs(a[k]-b[k])<1e-6, 'return preserves '+k));
try {
  server = await startServer(0, '127.0.0.1');
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  // Software rendering covers the full camera route at reduced raster density.
  // Keep CSS layout/FOV; this is not a readability or hardware-performance test.
  // https://playwright.dev/docs/api/class-browser#browser-new-page-option-device-scale-factor
  page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor:0.25 });
  page.setDefaultTimeout(60000); page.setDefaultNavigationTimeout(60000);
  page.on('pageerror', e => failures.push(e.message));
  page.on('console', m => { if (m.type() === 'error') failures.push(m.text()); });
  page.on('requestfailed', r => failures.push('request failed: ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) failures.push(r.status() + ': ' + r.url()); });
  page.on('request', r => {
    if (!/^(data|blob):/.test(r.url()) && new URL(r.url()).origin !== base) failures.push('outside request: ' + r.url());
  });
  console.log('corridor smoke: opening preview');
  await page.goto(base + '/src/preview/');
  await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded &&
    document.querySelector('#preview-world')?.object3D.children.length > 0, null, {timeout:120000});
  await page.getByRole('status').filter({ hasText: T.instruction }).waitFor();
  console.log('corridor smoke: software route raster (not hardware FPS)',await page.evaluate(() => {
    const canvas=document.querySelector('a-scene').canvas;
    return {width:canvas.width,height:canvas.height,cssWidth:innerWidth,cssHeight:innerHeight,dpr:devicePixelRatio};
  }));
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
    console.log('corridor smoke: checking '+key);
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
  await page.getByRole('button', { name:T.views.start, exact:true }).click();
  await walkAxis('ArrowUp','x',ROOM.doorX - 0.05);
  let beforeDoor = await pose();
  // Synthetic Russian-key regression; not a claim of a physical keyboard-layout test.
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown',
    {code:'KeyE',key:String.fromCodePoint(0x443),bubbles:true})));
  await page.getByRole('button',{name:T.returnDoor,exact:true}).waitFor();
  await walkAxis('KeyD','z',ROOM.minZ+1.4);
  await page.getByRole('status').filter({hasText:T.room}).waitFor();
  const book = () => page.evaluate(() => {
    const group = document.querySelector('#preview-world').object3D.getObjectByName('intro-book');
    return { outcome:group.userData.outcome, intact:group.getObjectByName('book-intact').visible,
      remains:group.getObjectByName('book-remains').visible };
  });
  await page.getByRole('button',{name:T.inspectBook,exact:true}).click();
  await settled();
  assert.equal(await page.evaluate(() => {
    const el = document.querySelector('#preview-camera'), cam = el.getObject3D('camera');
    const cover = document.querySelector('#preview-world').object3D.getObjectByName('book-cover');
    const center = cover.getWorldPosition(new THREE.Vector3()).project(cam);
    return Math.abs(center.x)<1 && Math.abs(center.y)<1 && Math.abs(center.z)<1;
  }), true, 'inspect view places the actual book cover in the camera frustum');
  const optionBoxes = await page.locator('#preview-deal .preview-buttons button').evaluateAll(nodes =>
    nodes.map(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height})));
  assert.ok(optionBoxes.every(box=>Math.abs(box.width-optionBoxes[0].width)<1 && Math.abs(box.height-optionBoxes[0].height)<1), 'deal choices have equal-size targets');
  const enterBook = async () => {
    await page.getByRole('button', {name:T.views.start,exact:true}).click();
    await walkAxis('ArrowUp','x',ROOM.doorX-0.05);
    beforeDoor = await pose();
    await page.getByRole('button',{name:T.openDoor,exact:true}).click();
    await walkAxis('KeyD','z',ROOM.minZ+1.4);
    await page.locator('#preview-deal').waitFor();
  };
  await page.getByRole('button',{name:T.bargain,exact:true}).click();
  await page.getByRole('status').filter({hasText:T.offer(250)}).waitFor();
  await page.getByRole('button',{name:T.returnDoor,exact:true}).click();
  // Outside inputs cannot accept, and an unanswered exit preserves the quote.
  await page.locator('#preview-deal-accept').dispatchEvent('click');
  await enterBook();
  await page.getByRole('status').filter({hasText:T.offer(250)}).waitFor();
  await page.getByRole('button',{name:T.refuse,exact:true}).click();
  await page.getByRole('status').filter({hasText:T.refused}).waitFor();
  assert.deepEqual(await book(),{outcome:'refused',intact:true,remains:false});
  await page.getByRole('button',{name:T.returnDoor,exact:true}).click();
  await enterBook();
  await page.getByRole('status').filter({hasText:T.refused}).waitFor();
  assert.equal(await page.locator('#preview-balance').textContent(),T.balance(0));
  // Fresh isolated test attempt; this is not an in-game restart feature.
  await page.evaluate(key=>localStorage.removeItem(key),DEAL_KEY);
  await page.reload();
  await page.getByRole('status').filter({hasText:T.instruction}).waitFor();
  await enterBook();
  for (const amount of [250,500,1000]) {
    await page.getByRole('button',{name:T.bargain,exact:true}).click();
    await page.getByRole('status').filter({hasText:T.offer(amount)}).waitFor();
  }
  assert.equal(await page.getByRole('button',{name:T.lastOffer,exact:true}).isDisabled(),true);
  await page.getByRole('button',{name:T.accept(1000),exact:true}).click();
  await page.getByRole('status').filter({hasText:T.burned(1000)}).waitFor();
  assert.deepEqual(await book(),{outcome:'burned',intact:false,remains:true});
  await page.locator('#preview-deal-accept').dispatchEvent('click');
  assert.equal(await page.locator('#preview-balance').textContent(),T.balance(1000));
  await page.reload();
  await page.getByRole('status').filter({hasText:T.instruction}).waitFor();
  await enterBook();
  await page.getByRole('status').filter({hasText:T.burned(1000)}).waitFor();
  assert.deepEqual(await book(),{outcome:'burned',intact:false,remains:true});
  assert.equal(await page.locator('#preview-balance').textContent(),T.balance(1000));
  // Returning while a movement key remains held must not restart on its auto-repeat.
  const roomX = (await pose()).x;
  await page.keyboard.down('KeyW'); await moved('x',roomX);
  await page.keyboard.press('Escape');
  await page.keyboard.down('KeyW'); await settled(); await page.keyboard.up('KeyW');
  samePose(await pose(),beforeDoor);
  assert.equal(await shownFloor(),'8');
  await page.getByRole('button',{name:T.openDoor,exact:true}).waitFor();

  console.log('corridor smoke: walking the stairs, not selecting a floor anchor');
  await walkAxis('ArrowUp','x',ANCHORS.turn.x);
  await walkAxis('KeyA','z',ANCHORS.overlap.z);
  await walkAxis('ArrowDown','x',ANCHORS.top.x);
  await walkAxis('KeyD','z',ANCHORS.top.z);
  assert.equal(await shownFloor(),'9','actual ascent changes the visible floor sign');
  await walkAxis('ArrowDown','x',ROOM.doorX - 0.05);
  const upperDoor = await pose();
  await page.keyboard.press('KeyE');
  await page.getByRole('button',{name:T.returnDoor,exact:true}).waitFor();
  await walkAxis('KeyD','z',ROOM.minZ+1.4);
  await page.getByRole('status').filter({hasText:T.room}).waitFor();
  await page.getByRole('status').filter({hasText:T.burned(1000)}).waitFor();
  assert.equal(await page.locator('#preview-balance').textContent(),T.balance(1000), 'another floor cannot pay the same episode again');
  await page.getByRole('button',{name:T.returnDoor,exact:true}).click();
  await settled(); samePose(await pose(),upperDoor);
  assert.equal(await shownFloor(),'9','room return does not reset the floor to the origin');
  await walkAxis('ArrowUp','x',ANCHORS.top.x);
  await walkAxis('KeyA','z',ANCHORS.overlap.z);
  await walkAxis('ArrowUp','x',ANCHORS.turn.x);
  await walkAxis('KeyD','z',ANCHORS.turn.z);
  assert.equal(await shownFloor(),'8','walking back returns to the original floor');
  assert.deepEqual(failures, [], 'the corridor boots and responds without errors or outside requests');
  console.log('corridor smoke: boot, controls, book/refusal/bargain/payment/return/reload, held-input stop and walked ascent/descent pass; Quest untested');
} finally {
  try { await browser?.close(); }
  finally { if(server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } }
}

