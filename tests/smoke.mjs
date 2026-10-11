// Headless runs of the default room from consent to the last screen at 20× speed
// (?speed=20; such runs are never sent): once normally and once in playtest mode
// (?playtest=1, five playtest questions after the reveal). Checks that no button
// covers text, answers have one readable size, and the page logs no errors.
// Needs Playwright + Chromium (heavy: run it in CI, not on a laptop).
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';
import { nearFaces } from './near-faces.mjs';
import { playVR } from './smoke-vr.mjs';
import { WALLS, CEIL } from '../src/app/lobby/scene.js';
import { BOOTH, DOORWAY } from '../src/rooms/01-control/scene.js';
import { ROOM1_DOOR, roomPlace, toCorridor, areaToCorridor } from '../src/app/lobby/plan.js';
import { MIN_LETTER, READ_DIST, MIN_TARGET_DEG, letterDeg } from '../src/engine/ui/sheet-math.js';

// the reading rules, from the code that sets them: the smallest letter and the smallest target
const RULES = { minMm: MIN_LETTER * 1000, minDeg: letterDeg(MIN_LETTER, READ_DIST), targetDeg: MIN_TARGET_DEG };

const server = await startServer(0);
const base = `http://localhost:${server.address().port}/?speed=20`;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });

// where an eye can be: anywhere inside a place's walls, floor and ceiling (a headset walks freely),
// but not nearer to them than the camera's near plane (A-Frame's camera, 5 mm), inside which
// nothing is drawn: the back of a thing lying on a wall is never seen
const NEAR = 0.005;
const inside = (w, top) => [[w.minX + NEAR, NEAR, w.minZ + NEAR], [w.maxX - NEAR, top - NEAR, w.maxZ - NEAR]];
// room 01's walls and desk in the corridor's metres, where the corridor stands it (src/app/lobby/plan.js)
const PLACE = roomPlace(ROOM1_DOOR, DOORWAY), ROOM_WALLS = areaToCorridor(PLACE, BOOTH), DESK = toCorridor(PLACE, { x: 0.4, z: -0.3 });
const CORRIDOR = { eyes: [inside(WALLS, CEIL)] }, ROOM = { eyes: [inside(ROOM_WALLS, BOOTH.ceiling)] };

async function playRoom(url, playtest, { leave = false } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  const waitState = (s, timeout = 60000) =>
    page.waitForFunction((x) => document.documentElement.dataset.roomState === x, s, { timeout });
  // No button or scale may cover the text: the top edge of every widget must be below
  // the last line. On the clipboard sheet in its own metres (data-text-bottom of .sheet),
  // on the room's wall screen in world metres (#screen data-text-bottom).
  const overlaps = () => page.evaluate(() => {
    const sheet = document.querySelector('.sheet[data-open]');
    const p = new THREE.Vector3();
    return [...document.querySelectorAll('.answer, .scale-bar')].map((el) => {
      const onSheet = !!el.closest('.sheet');
      const bottom = Number((onSheet ? sheet : document.querySelector('#screen')).dataset.textBottom);
      if (onSheet) p.copy(el.object3D.position); else el.object3D.getWorldPosition(p);
      const top = p.y + el.getAttribute('panel').h / 2;
      return top > bottom + 0.001 ? `${el.className} top ${top.toFixed(3)} > text ${bottom}` : null;
    }).filter(Boolean);
  });
  // What a sheet page must satisfy (src/engine/ui/sheet-math.js; sources in docs/decisions.md):
  // nothing runs off the paper, every letter (text, answers, a seal's ring) at least the smallest
  // letter (24 mm at 1 m, 1.375° of view) and buttons at least 2.5° of view from the eyes, and up
  // to four answers in one column.
  const sheetProblems = () => page.evaluate(({ minMm, minDeg, targetDeg }) => {
    const sheet = document.querySelector('.sheet[data-open]');
    if (!sheet) return [];
    const eye = new THREE.Vector3(), p = new THREE.Vector3();
    document.querySelector('a-scene').camera.getWorldPosition(eye);
    const deg = (size, d) => 2 * Math.atan(size / 2 / d) * 180 / Math.PI;
    const answers = [...sheet.querySelectorAll('.answer')];
    const out = sheet.dataset.overflow ? ['the page does not fit the sheet'] : [];
    if (sheet.dataset.orphan) out.push('a blank to fill in stands on a line of its own');
    if (Number(sheet.dataset.letterMm) < minMm - 0.5) out.push(`text ${sheet.dataset.letterMm} mm, under ${minMm} mm`);
    if (sheet.dataset.stampLetterMm && Number(sheet.dataset.stampLetterMm) < minMm - 0.5) out.push(`the seal's letters ${sheet.dataset.stampLetterMm} mm, under ${minMm} mm`);
    for (const a of answers) {
      a.object3D.getWorldPosition(p);
      const d = p.distanceTo(eye);
      if (deg(a.dataset.letterMm / 1000, d) < minDeg - 0.03) out.push(`answer letters ${deg(a.dataset.letterMm / 1000, d).toFixed(2)}° < ${minDeg.toFixed(3)}°`);
      if (a.dataset.overflow) out.push(`answer "${a.dataset.index}" runs off its button`);
      if (deg(a.getAttribute('panel').h, d) < targetDeg) out.push(`button ${deg(a.getAttribute('panel').h, d).toFixed(2)}° < ${targetDeg}°`);
    }
    if (answers.length <= 4 && new Set(answers.map(a => a.object3D.position.x.toFixed(3))).size > 1) out.push('answers in two columns');
    return out;
  }, RULES);
  // A page on its hook is read from where the player stands: its lines for that distance
  // (sheet-page.js, data-far-letter-mm) at least the smallest letter's angle from the eyes.
  const hangProblems = () => page.evaluate(({ minDeg }) => {
    const sheet = document.querySelector('.sheet');
    if (!sheet || sheet.dataset.open) return ['the clipboard is not on its hook'];
    if (!sheet.dataset.farLetterMm) return ['the page on the hook has no lines set for its distance'];
    const eye = new THREE.Vector3(), p = new THREE.Vector3();
    document.querySelector('a-scene').camera.getWorldPosition(eye);
    sheet.object3D.getWorldPosition(p);
    const d = p.distanceTo(eye), deg = 2 * Math.atan(Number(sheet.dataset.farLetterMm) / 2000 / d) * 180 / Math.PI;
    return deg < minDeg - 0.03 ? [`the hook page's letters ${deg.toFixed(2)}° from ${d.toFixed(2)} m, under ${minDeg.toFixed(3)}°`] : [];
  }, RULES);
  // Light falling on a level white card at a point (a light meter): the card is drawn alone
  // from just above, and its linear brightness is read.
  const lightAt = (p) => page.evaluate(([x, y, z]) => {
    const sc = document.querySelector('a-scene'), r = sc.renderer;
    const rt = new THREE.WebGLRenderTarget(8, 8);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 }));
    card.rotation.x = -Math.PI / 2;
    card.position.set(x, y, z);
    sc.object3D.add(card);
    const cam = new THREE.PerspectiveCamera(10, 1, 0.01, 2);
    cam.position.set(x, y + 0.3, z);
    cam.lookAt(x, y, z);
    sc.object3D.updateMatrixWorld(true);
    r.setRenderTarget(rt);
    r.render(sc.object3D, cam);
    const px = new Uint8Array(4 * 64);
    r.readRenderTargetPixels(rt, 0, 0, 8, 8, px);
    r.setRenderTarget(null);
    sc.object3D.remove(card);
    let sum = 0;
    for (let i = 0; i < 64; i++) sum += (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
    return sum / 64;
  }, p);
  // clicks the answer button with this index, waiting until it exists
  const pick = async (i) => {
    // buttons accept a click once they are ready (choice.js ignores the first 0.3 s)
    await page.waitForFunction((n) => [...document.querySelectorAll('.answer')].some(e => +e.dataset.index === n && e.dataset.ready), i, { timeout: 30000 });
    assert.deepEqual(await overlaps(), [], 'a button covers the text');
    assert.deepEqual(await sheetProblems(), [], 'a sheet page breaks the reading rules');
    // all answers of a question share one readable text size
    const sizes = await page.evaluate(() => [...new Set([...document.querySelectorAll('.answer')].map(e => Number(e.dataset.size)))]);
    assert.equal(sizes.length, 1, `answer sizes differ: ${sizes}`);
    const onWall = await page.evaluate(() => !document.querySelector('.answer').closest('.sheet'));
    if (onWall) assert.ok(sizes[0] >= 30, `answer text too small: ${sizes[0]}px`);
    await page.evaluate((n) => [...document.querySelectorAll('.answer')].find(e => +e.dataset.index === n).emit('click'), i);
  };
  // The studio's poster cuts in with "leave?" on the clipboard (src/app/lobby/exit.js); "stay" gives
  // back the page that was there, with its answers, on its hook or in front (sheet.js resume).
  const sheetState = () => page.evaluate(() => {
    const s = document.querySelector('.sheet');
    return { take: !!s.dataset.take, open: !!s.dataset.open, answers: s.querySelectorAll('.answer').length, text: s.dataset.textBottom };
  });
  const askLeave = async () => {
    await page.evaluate(() => document.querySelector('#notePoster').emit('click'));
    await page.waitForFunction(() => document.querySelector('.sheet[data-open]') && document.querySelectorAll('.sheet .answer').length === 2, null, { timeout: 30000 });
  };
  const exitThenStay = async () => {
    const before = await sheetState();
    await askLeave();
    await pick(1);
    await page.waitForFunction((b) => {
      const s = document.querySelector('.sheet');
      return !!s.dataset.take === b.take && !!s.dataset.open === b.open && s.querySelectorAll('.answer').length === b.answers && s.dataset.textBottom === b.text;
    }, before, { timeout: 30000 });
  };
  // The consent form is signed by hand: a field over the name's and the signature's blanks, listed
  // for the mouse and the lasers, and no button until both have writing (src/engine/ui/ink.js).
  // the form's two pages: the name, then the signature, which brings the lab's seal
  const signPage = async (sealed) => {
    await page.waitForFunction(() => document.querySelectorAll('.sheet .ink-field').length === 1, null, { timeout: 30000 });
    assert.equal(await page.evaluate(() => document.querySelectorAll('.sheet .answer').length), 0, 'the form moves on before it is signed');
    const listed = await page.evaluate(() => {
      const rc = document.querySelector('a-scene').components.raycaster;
      return [...document.querySelectorAll('.ink-field')].every((f) => rc.objects.some((o) => { for (let x = o; x; x = x.parent) if (x.el === f) return true; return false; }));
    });
    assert.ok(listed, 'the fields to sign are not listed for the mouse and the lasers');
    assert.equal(await page.evaluate(() => !!document.querySelector('.sheet').dataset.stampTop), sealed, sealed ? 'no place for the seal by the signature' : 'a seal on the name page');
    assert.ok(await page.evaluate(() => !document.querySelector('.sheet').dataset.stamped), 'the seal is pressed before the form is signed');
    await page.evaluate(() => document.querySelectorAll('.ink-field').forEach((f) => f.components.ink.addStroke([[0.1, 0.6], [0.4, 0.3], [0.7, 0.6], [0.9, 0.4]])));
    if (sealed) {
      // pressed once signed, and never over the hand signature (GOST R 7.0.97-2025, 5.24)
      const s = await page.evaluate(() => {
        const sheet = document.querySelector('.sheet'), f = sheet.querySelector('.ink-field');
        return { stamped: sheet.dataset.stamped, top: Number(sheet.dataset.stampTop), field: f.object3D.position.y - f.components.ink.data.h / 2 };
      });
      assert.equal(s.stamped, '1', 'the seal is not pressed once the form is signed');
      assert.ok(s.top <= s.field, `the seal reaches into the signature's field (${s.top} above ${s.field.toFixed(3)})`);
    }
    assert.deepEqual(await page.evaluate(nearFaces, CORRIDOR), [], 'faces that flicker on the signed form');
    await pick(0);
  };
  const signForm = async () => { await signPage(false); await signPage(true); };
  // answers one question: a scale (click its middle, then "done") or a choice
  const answer = async () => {
    await page.waitForFunction(() => document.querySelector('.scale-bar') || document.querySelectorAll('.answer').length > 1, null, { timeout: 30000 });
    if (await page.evaluate(() => !!document.querySelector('.scale-bar'))) {
      assert.deepEqual(await overlaps(), [], 'the scale covers the text');
      await page.evaluate(() => {
        const bar = document.querySelector('.scale-bar');
        const p = new THREE.Vector3(); bar.object3D.getWorldPosition(p);
        bar.emit('click', { intersection: { point: p } });
      });
    }
    await pick(0);
    await page.waitForTimeout(100);
  };

  try {
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded, null, { timeout: 30000 });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.roomState), 'idle');
    // on a computer the sign starts at the player's first press, when its sounds can play
    // (src/app/lobby/sign.js, arrivalStep): a real key press, as a player's
    await page.keyboard.press('Space');
    // the poster pressed while the sign still plays: the clipboard's "take me" page comes
    // while the question is open and waits behind it; "stay" puts it on its hook, ready
    await page.waitForFunction(() => document.querySelector('.sheet')?.getAttribute('visible'), null, { timeout: 30000 });
    if (!playtest && !leave) {
      await askLeave();
      await page.waitForFunction(() => document.querySelector('.sheet[data-take]'), null, { timeout: 60000 });
      assert.equal(await page.evaluate(() => document.querySelectorAll('.sheet .answer').length), 2, 'the leave question was drawn over');
      await pick(1);
      await page.waitForFunction(() => {
        const s = document.querySelector('.sheet');
        return s.dataset.take && !s.dataset.open && !s.querySelector('.answer') && s.querySelector('.paper').classList.contains('clickable');
      }, null, { timeout: 30000 });
    }
    // corridor: the sign plays, then the clipboard is taken from the board and welcomes
    await page.waitForFunction(() => document.querySelector('.sheet[data-take]'), null, { timeout: 60000 });
    assert.deepEqual(await hangProblems(), [], 'the "take me" page on the hook is too small to read from the arrival spot');
    const corridorLight = await lightAt([0.6, 0.01, 2.7]);   // the corridor floor, door shut
    // no two faces that face one way under 5 mm apart (they flicker in a headset: near-faces.mjs)
    assert.deepEqual(await page.evaluate(nearFaces, CORRIDOR), [], 'faces that flicker in the corridor');
    if (leave) {
      // "leave" fades out, ends the game and says how to come back
      await askLeave();
      await pick(0);
      await page.waitForFunction(() => document.documentElement.dataset.left === '1' && document.querySelector('#hint.show'), null, { timeout: 30000 });
      assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
      return;
    }
    if (!playtest) await exitThenStay();   // the clipboard waits on its hook to be taken
    await page.evaluate(() => document.querySelector('.sheet[data-take]').emit('click'));
    // ending b leaves only "you" lit; taking the clipboard brings the whole name back
    if (url.includes('sign=b')) {
      await page.waitForFunction(() => document.querySelector('#signFace').components.lightbox.levels.slice(0, 4).every(l => l >= 0.9), null, { timeout: 10000 });
    }
    if (!playtest) {                     // the welcome page, in front of the player
      await page.waitForFunction(() => document.querySelectorAll('.sheet .answer').length === 1, null, { timeout: 30000 });
      await exitThenStay();
    }
    await pick(0);                       // "next" after the welcome
    await signForm();                    // consent page 1, the form: signed by hand, then "next"
    if (playtest) await pick(0);         // the playtest note, a page of its own
    if (playtest) {
      await pick(1);                     // the age: "no" leads to a page of its own,
      await pick(0);                     // which starts without recording
    } else {
      await pick(0);                     // the age: "yes"
      await pick(1);                     // last consent page: start without recording
    }
    // the door to room 1 opens when pointed at
    await page.waitForFunction(() => document.documentElement.dataset.lobby === 'door', null, { timeout: 30000 });
    assert.deepEqual(await hangProblems(), [], 'the "choose a door" page on the hook is too small to read from the arrival spot');
    if (!playtest) {
      // under the leave question door 1 stays shut; after "stay" it opens
      await askLeave();
      await page.evaluate(() => document.querySelector('#door1 .clickable').emit('click'));
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.lobby), 'door', 'door 1 opened under the leave question');
      await pick(1);
      await page.waitForFunction(() => !document.querySelector('.sheet[data-open]'), null, { timeout: 30000 });
    }
    await page.evaluate(() => document.querySelector('#door1 .clickable').emit('click'));
    // through the door the poster stops answering (the lasers reach it through the walls)
    assert.equal(await page.evaluate(() => document.querySelector('#notePoster').classList.contains('clickable')), false, 'the poster still answers from the room');
    // In the room the corridor is not drawn and its lights are out, the room lit by its own lamps
    // (src/app/lobby/lobby.js); door 1 behind the player and the room's button before the trials do
    // nothing, so the ray does not mark them (src/engine/laser-beam.js)
    await page.waitForFunction(() => document.documentElement.dataset.roomState === 'intro', null, { timeout: 30000 });
    assert.deepEqual(await page.evaluate(() => ({
      corridor: document.querySelector('#corridor').object3D.visible,
      lit: [...document.querySelectorAll('.corridor-light')].filter((el) => Number(el.getAttribute('light').intensity) > 0).map((el) => el.id),
      answers: [...document.querySelectorAll('#door1 .clickable, #buttonCap.clickable')].length
    })), { corridor: false, lit: [], answers: 0 }, 'from the room the corridor is still drawn or lit, or door 1 or the button answers when it does nothing');
    // A computer's full screen is A-Frame's VR mode too (its enterVR adds the state without a
    // headset): the camera walked out through the walls in it (docs/mistakes.md). The camera is put
    // past the back wall, as the keys took it, and room-bounds must bring it back (wasd-controls
    // itself would not move it on a slow frame, so the keys alone could prove nothing here)
    const backZ = await page.evaluate(async (wall) => {
      const sc = document.querySelector('a-scene'), cam = document.querySelector('#cam').object3D, p = new THREE.Vector3();
      const seat = cam.position.clone();
      sc.addState('vr-mode');
      cam.parent.updateMatrixWorld();
      cam.position.copy(cam.parent.worldToLocal(new THREE.Vector3(0, cam.position.y, wall + 3)));
      await new Promise((r) => setTimeout(r, 500));
      cam.getWorldPosition(p);
      sc.removeState('vr-mode');
      cam.position.copy(seat);
      return p.z;
    }, ROOM_WALLS.maxZ);
    assert.ok(backZ < ROOM_WALLS.maxZ, `on a computer's full screen the camera stayed at z ${backZ.toFixed(2)}, past the room's back wall`);
    // "understood" twice: after the instructions and after the control concept
    for (let i = 0; i < 2; i++) {
      await page.waitForFunction(() => document.documentElement.dataset.roomState === 'intro' &&
        document.querySelectorAll('.answer').length === 2, null, { timeout: 30000 });
      await pick(0);
      await page.waitForFunction(() => document.querySelectorAll('.answer').length === 0, null, { timeout: 30000 });
    }
    await waitState('run');
    assert.deepEqual(await page.evaluate(nearFaces, ROOM), [], 'faces that flicker in the room');
    // Corridors under 10 fc, desks 50 fc (docs/building-standards.md, S13): the corridor
    // floor gets at most a fifth of the light on the room's desk, and is not left dark (the
    // 0.1 floor is our choice, so the corridor stays visible).
    const ratio = corridorLight / await lightAt([DESK.x, 0.846, DESK.z]);
    assert.ok(ratio <= 0.2 && ratio >= 0.1, `corridor floor / room desk light = ${ratio.toFixed(3)} (0.1–0.2)`);
    // press during about every other yellow light
    await page.evaluate(() => {
      window.__presser = setInterval(() => {
        const on = document.querySelector('#yellow').getAttribute('material').emissiveIntensity > 0;
        if (on && Math.random() < 0.1) document.querySelector('#buttonCap').emit('click');
      }, 20);
    });
    await waitState('questions', 120000);
    await page.evaluate(() => clearInterval(window.__presser));
    for (let k = 0; k < 10; k++) await answer(); // 5 scales + 5 choices (questions.js)
    await waitState('done');
    for (let i = 0; i < 6; i++) await pick(0);   // reveal pages
    if (playtest) {
      for (let k = 0; k < 5; k++) await answer(); // playtest questions
      await pick(0);                              // thanks → play again
    }
    await waitState('intro');
    assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
  } finally {
    await page.close();
  }
}

try {
  await playRoom(base, false);
  console.log('smoke test: ok (normal)');
  await playRoom(`${base}&playtest=1&sign=b`, true);
  console.log('smoke test: ok (playtest)');
  await playRoom(base, false, { leave: true });
  console.log('smoke test: ok (leave from the corridor)');
  // the weakest headset's budget, both eyes on the real XR path (draw-calls.mjs, smoke-vr.mjs)
  console.log(await playVR(browser, base, { corridor: CORRIDOR, room: ROOM }));
  console.log('smoke test: ok (VR)');
} finally {
  await browser.close();
  server.close();
}
