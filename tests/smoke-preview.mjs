// Browser coverage of the real corridor page. Run on the GitHub runner, not the laptop.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';
import { ANCHORS, PLAN } from '../src/preview/route.js';
import { ROOM } from '../src/preview/layout.js';
import { T } from '../src/preview/texts.ru.js';

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
  const floorHits = await page.evaluate(({ floorRise }) => {
    const world = document.querySelector('#preview-world').object3D;
    return [-floorRise, 0, floorRise].map(y => {
      const ray = new THREE.Raycaster(new THREE.Vector3(-2.27, y + 0.1, 0.91), new THREE.Vector3(0, -1, 0), 0, 0.12);
      return ray.intersectObjects(world.children).length;
    });
  }, { floorRise: PLAN.floorRise });
  assert.deepEqual(floorHits, [1, 1, 1], 'each tiled hall has one visible surface at walking height');
  await page.waitForFunction(() => document.querySelector('#preview-world').object3D.children
    .some(object => object.name === 'end-picture' && object.material.map.image?.naturalWidth === 1024));
  const hallViews = await page.evaluate(({ hall, left, right }) => {
    const world = document.querySelector('#preview-world').object3D;
    const z = (hall.minZ + hall.maxZ) / 2;
    const centre = (left.minX + right.maxX) / 2;
    const cast = (from, to) => {
      const direction = to.clone().sub(from);
      return new THREE.Raycaster(from, direction.clone().normalize(), 0, direction.length() + 0.002);
    };
    const sign = document.querySelector('#preview-lower-sign');
    const signFace = sign.getObject3D('mesh');
    const ends = [hall.minX, hall.maxX].map(x => cast(new THREE.Vector3(centre, 1.57, z),
      new THREE.Vector3(x, 1.57, z)).intersectObjects(world.children)[0]?.object);
    return {
      ends: ends.map(end => end?.name),
      pictureUp: ends.map(end => end && Math.round(new THREE.Vector3(0, 1, 0).applyQuaternion(end.quaternion).y)),
      samePicture: Boolean(ends[0]?.material?.map) && ends[0].material.map === ends[1]?.material?.map,
      mouths: [left, right].map(lane => {
        const x = (lane.minX + lane.maxX) / 2;
        return cast(new THREE.Vector3(x, 1.6, z), new THREE.Vector3(x, 1.6, -0.12))
          .intersectObjects(world.children).length;
      }),
      sign: [left.minX - 1.5, right.maxX + 1.5].map(x => {
        const ray = cast(new THREE.Vector3(x, 1.6, z), sign.object3D.position);
        return ray.intersectObjects([...world.children, signFace])[0]?.object === signFace;
      }),
      signFits: !sign.components.panel.overflow
    };
  }, { hall: PLAN.hall, left: PLAN.left, right: PLAN.right });
  assert.deepEqual(hallViews.ends, ['end-picture', 'end-picture'], 'the pictures face into the hall');
  assert.deepEqual(hallViews.pictureUp, [1, -1], 'the east picture turns the same subject upside down');
  assert.equal(hallViews.samePicture, true, 'both ends use the same source texture');
  assert.deepEqual(hallViews.mouths, [0, 0], 'both stair mouths remain open');
  assert.deepEqual(hallViews.sign, [true, true], 'the central sign faces both approaches');
  assert.equal(hallViews.signFits, true, 'the name and floor fit on the shared sign');
  await page.waitForFunction(() => {
    const objects = [...document.querySelectorAll('#preview-world > .extinguisher')];
    return objects.length === 3 && objects.every(model => ['label', 'gauge'].every(part =>
      model.querySelector(`[data-part="extinguisher-${part}"]`).getObject3D('mesh')?.material.map));
  });
  const mountBounds = await page.locator('#preview-world > .extinguisher').evaluateAll(models => models.map(model => {
    const bounds = new THREE.Box3().setFromObject(model.object3D, true);
    return { min: bounds.min.toArray(), max: bounds.max.toArray() };
  }));
  const mount = PLAN.extinguisher;
  for (const [i, { min, max }] of mountBounds.entries()) {
    assert.ok(min[0] >= mount.x - mount.halfWidth && max[0] <= mount.x + mount.halfWidth);
    assert.ok(min[2] >= mount.wall - mount.depth && Math.abs(max[2] - mount.wall) < 0.005,
      'the mounted model fits its clearance and meets the wall');
    assert.ok(Math.abs(min[1] - (i - 1) * PLAN.floorRise - 0.853) < 0.01,
      'each copy keeps its original mounting height');
  }
  console.log('corridor smoke: software route raster (not hardware FPS)',await page.evaluate(() => {
    const canvas=document.querySelector('a-scene').canvas;
    return {width:canvas.width,height:canvas.height,cssWidth:innerWidth,cssHeight:innerHeight,dpr:devicePixelRatio};
  }));
  assert.equal(await page.title(), 'You are the object');
  assert.equal(await page.getByRole('heading', { name: 'You are the object' }).count(), 1);
  const initial = await pose();
  assert.ok(Math.abs(initial.x - ANCHORS.start.x) < 1e-6 && Math.abs(initial.z - ANCHORS.start.z) < 1e-6);
  assert.ok(Math.abs(initial.yaw - Math.PI) < 1e-6, 'initial view faces the shared sign');
  await page.waitForFunction(() => document.querySelector('#preview-door-leaf-0')?.hasLoaded);
  const visibleLayout = await page.evaluate(({ hall, left, right, floorRise, doorX }) => {
    const scene = document.querySelector('a-scene');
    const world = document.querySelector('#preview-world').object3D;
    scene.object3D.updateMatrixWorld(true);
    const ray = new THREE.Raycaster();
    const visibleHit = objects => ray.intersectObjects(objects, true).find(hit => {
      for (let object = hit.object; object; object = object.parent) {
        if (!object.visible) return false;
      }
      return true;
    });
    const sign = document.querySelector('#preview-lower-sign').getObject3D('mesh');
    ray.setFromCamera(new THREE.Vector2(0, 0), scene.camera);
    const facesSign = visibleHit([world, sign])?.object === sign;
    const leaves = world.getObjectByName('fixed-door-leaves');
    const working = document.querySelector('#preview-door-leaf-0').object3D;
    const middleZ = (hall.minZ + hall.maxZ) / 2;
    const castToWall = (x, y, south) => {
      ray.set(new THREE.Vector3(x, y, middleZ), new THREE.Vector3(0, 0, south ? 1 : -1));
      ray.far = (hall.maxZ - hall.minZ) / 2 + 0.1;
      return visibleHit([world]);
    };
    const tally = { leftNorth: 0, leftSouth: 0, rightNorth: 0, rightSouth: 0, outsideWings: 0 };
    const addDoor = (x, south) => {
      const side = south ? 'South' : 'North';
      const group = x < left.minX ? 'left' + side : x > right.maxX ? 'right' + side : 'outsideWings';
      tally[group]++;
    };
    const matrix = new THREE.Matrix4();
    let fixedOnFloor = 0;
    for (let i = 0; i < leaves.count; i++) {
      leaves.getMatrixAt(i, matrix);
      const centre = new THREE.Vector3().setFromMatrixPosition(matrix.premultiply(leaves.matrixWorld));
      if (centre.y < 0 || centre.y >= floorRise) continue;
      fixedOnFloor++;
      const south = centre.z > middleZ;
      const hit = castToWall(centre.x, centre.y, south);
      if (hit?.object === leaves && hit.instanceId === i) addDoor(centre.x, south);
    }
    let workingVisible = false;
    for (let object = castToWall(doorX, 1.1, true)?.object; object; object = object.parent) {
      if (object === working) {
        addDoor(doorX, true);
        workingVisible = true;
        break;
      }
    }
    return { tally, fixedOnFloor, workingVisible, facesSign };
  }, { hall: PLAN.hall, left: PLAN.left, right: PLAN.right, floorRise: PLAN.floorRise, doorX: ROOM.doorX });
  assert.equal(visibleLayout.facesSign, true, 'first camera ray hits the shared sign');
  assert.equal(visibleLayout.fixedOnFloor, 7, 'the current floor has seven fixed leaves');
  assert.equal(visibleLayout.workingVisible, true, 'the eighth leaf is visible from the hall');
  assert.deepEqual(visibleLayout.tally, { leftNorth: 2, leftSouth: 2, rightNorth: 2, rightSouth: 2, outsideWings: 0 },
    'each corridor wing has two visible leaves on each wall');
  const walkX = async x => walkAxis(x > (await pose()).x ? 'KeyA' : 'KeyD', 'x', x);
  const hallStart = await motionState();
  await walkX(PLAN.hall.minX + 0.4);
  await walkX(PLAN.hall.maxX - 0.4);
  const stairStart = await motionState();
  console.log('corridor smoke: both ends reached', { ms: Math.round(stairStart.at - hallStart.at) });
  const crossLanding = async (firstLane, secondLane) => {
    await walkX(firstLane);
    await walkAxis('ArrowDown', 'z', ANCHORS.overlap.z);
    await walkX(secondLane);
    await walkAxis('ArrowUp', 'z', ANCHORS.start.z);
  };
  await crossLanding(ANCHORS.turn.x, ANCHORS.top.x);
  assert.equal(await shownFloor(), '9');
  await crossLanding(ANCHORS.top.x, ANCHORS.turn.x);
  assert.equal(await shownFloor(), '8');
  await crossLanding(ANCHORS.top.x, ANCHORS.turn.x);
  assert.equal(await shownFloor(), '7');
  await crossLanding(ANCHORS.turn.x, ANCHORS.top.x);
  assert.equal(await shownFloor(), '8');
  await walkX(ANCHORS.start.x);
  const stairFinish = await motionState();
  console.log('corridor smoke: ascended, descended and returned', {
    ms: Math.round(stairFinish.at - stairStart.at),
    frames: stairFinish.renderedFrame - stairStart.renderedFrame
  });
  for (const id of ['top','below','door','start']) {
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
  await page.getByRole('button', { name: T.views.door, exact: true }).click();
  for (const [key,axis] of [['ArrowUp','x'],['ArrowLeft','yaw'],['KeyR','pitch'],['KeyF','pitch']]) {
    console.log('corridor smoke: checking '+key);
    const before = (await pose())[axis];
    await page.keyboard.down(key);
    await moved(axis,before);
    await page.keyboard.up(key);
    await settled();
  }
  await page.getByRole('button', { name: T.views.door, exact: true }).click();
  let before = (await pose()).x;
  await page.keyboard.down('ArrowUp'); await moved('x',before);
  await page.locator('#preview-eye').focus(); await settled(); await page.keyboard.up('ArrowUp');
  await page.getByRole('button', { name: T.views.door, exact: true }).click();
  before = (await pose()).x;
  await page.keyboard.down('ArrowUp'); await moved('x',before);
  // Exercise the blur handler; this is not a physical window-focus or headset test.
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await settled(); await page.keyboard.up('ArrowUp');
  await page.getByRole('button', { name:T.views.door, exact:true }).click();
  await walkAxis('ArrowUp','x',ROOM.doorX - 0.05);
  const beforeDoor = await pose();
  // Synthetic Russian-key regression; not a claim of a physical keyboard-layout test.
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown',
    {code:'KeyE',key:String.fromCodePoint(0x443),bubbles:true})));
  await page.getByRole('button',{name:T.returnDoor,exact:true}).waitFor();
  await walkAxis('KeyD','z',ROOM.minZ+1.4);
  await page.getByRole('status').filter({hasText:T.room}).waitFor();
  assert.equal(await page.locator('#preview-deal, #preview-balance, a[href="./book.html"]').count(), 0,
    'entering the room does not restore the canceled scene');
  // Returning while a movement key remains held must not restart on its auto-repeat.
  const roomX = (await pose()).x;
  await page.keyboard.down('KeyW'); await moved('x',roomX);
  await page.keyboard.press('Escape');
  await page.keyboard.down('KeyW'); await settled(); await page.keyboard.up('KeyW');
  samePose(await pose(),beforeDoor);
  assert.equal(await shownFloor(),'8');
  await page.getByRole('button',{name:T.openDoor,exact:true}).waitFor();

  console.log('corridor smoke: room return and held input pass; walking to the first half landing and back');
  await page.getByRole('button', { name: T.views.door, exact: true }).click();
  const lowerPose = await pose();
  await walkAxis('ArrowUp', 'x', ANCHORS.turn.x);
  await walkAxis('KeyA', 'z', ANCHORS.overlap.z);
  assert.ok(Math.abs((await pose()).y - lowerPose.y - PLAN.halfRise) < 1e-6,
    'walking reaches the half landing above the starting floor');
  assert.equal(await shownFloor(), '8', 'the half landing keeps the starting floor number');
  await walkAxis('KeyD', 'z', lowerPose.z);
  await walkAxis('ArrowDown', 'x', lowerPose.x);
  const returned = await pose();
  assert.ok(Math.abs(returned.x - lowerPose.x) < 0.24 && Math.abs(returned.z - lowerPose.z) < 0.24,
    'the reverse walk reaches the starting area');
  assert.ok(Math.abs(returned.y - lowerPose.y) < 1e-6, 'the reverse walk returns to the starting height');
  assert.equal(await shownFloor(), '8');

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
  await page.getByRole('button',{name:T.returnDoor,exact:true}).click();
  await settled(); samePose(await pose(),upperDoor);
  assert.equal(await shownFloor(),'9','room return does not reset the floor to the origin');
  await walkAxis('ArrowUp','x',ANCHORS.top.x);
  await walkAxis('KeyA','z',ANCHORS.overlap.z);
  await walkAxis('ArrowUp','x',ANCHORS.turn.x);
  await walkAxis('KeyD','z',ANCHORS.turn.z);
  assert.equal(await shownFloor(),'8','walking back returns to the original floor');
  assert.deepEqual(failures, [], 'the corridor boots and responds without errors or outside requests');
  console.log('corridor smoke: boot, controls, room return, held-input stop, half-landing return and full-floor walk pass; Quest untested');
} finally {
  try { await browser?.close(); }
  finally { if(server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } }
}

