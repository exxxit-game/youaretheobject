// The player of the stand's flow run: the corridor's start to room 101's end as a player goes it (the sign, the
// clipboard taken, the consent signed, "start without recording", door 101, the room's intro, its 40 trials, the
// questions, the reveal), for a headset nobody wears (tools/stand-measure.mjs flow) and for the browser pane on a
// computer. It runs inside the game's page, so it presses what a player presses the way tests/smoke.mjs does
// (the same elements, the same events) and needs no tool round trip between steps; each step's name and the
// page's own time go into window.__flow, which the measure reads with its samples and puts on every late frame.
// A person reads before pressing (readS, 2 s by default, divided by the game's ?speed like the game's own times)
// and presses the button in about half the trials, at a moment inside the 3 s window (Alloy & Abramson 1979, p.
// 451: press or not, within 3 s), so the room runs its real procedure, never a shortcut.
export function player({ readS = 2 } = {}) {
  const d = document.documentElement.dataset, $ = (q) => document.querySelector(q), $$ = (q) => [...document.querySelectorAll(q)];
  const speed = Number(new URLSearchParams(location.search).get('speed')) || 1;
  const f = window.__flow = { step: 'start', steps: [], error: null, done: false, presses: 0, windows: 0 };
  const now = () => Math.round(performance.timeOrigin + performance.now());
  const step = (name) => { f.step = name; f.steps.push([now(), name]); };
  const wait = (s) => new Promise((r) => setTimeout(r, (s * 1000) / speed));
  const until = (cond, maxS, what) => new Promise((ok, fail) => {
    const from = performance.now();
    const tick = setInterval(() => {
      let v = null; try { v = cond(); } catch (e) { v = null; }
      if (v) { clearInterval(tick); ok(v); } else if (performance.now() - from > maxS * 1000) { clearInterval(tick); fail(new Error(`${what}: not in ${maxS} s`)); }
    }, 100);
  });
  // a button takes a click once it is ready (choice.js ignores the first 0.3 s of a page); after the click the
  // page has moved on when that button is gone or no longer ready
  const pick = async (i, what) => {
    const ready = () => $$('.answer').find((e) => +e.dataset.index === i && e.dataset.ready);
    const b = await until(ready, 120, what);
    await wait(readS);
    b.emit('click');
    await until(() => !b.isConnected || !b.dataset.ready, 30, `${what}: the page to move on`).catch(() => null);
  };
  // a question: a scale is marked in its middle and then "done", a choice takes its first answer
  const answer = async (n) => {
    await until(() => $('.scale-bar') || $$('.answer').length > 1, 120, `question ${n}`);
    const bar = $('.scale-bar');
    if (bar) { await wait(readS); const p = new THREE.Vector3(); bar.object3D.getWorldPosition(p); bar.emit('click', { intersection: { point: p } }); }
    await pick(0, `question ${n}`);
  };
  const sign = () => $$('.ink-field').forEach((x) => x.components.ink.addStroke([[0.1, 0.6], [0.4, 0.3], [0.7, 0.6], [0.9, 0.4]]));

  (async () => {
    step('sign');
    const clip = await until(() => $('.sheet[data-take]'), 300, 'the clipboard offered');
    step('clipboard taken'); await wait(readS); clip.emit('click');
    step('welcome'); await pick(0, 'the welcome');
    for (const page of ['consent: name', 'consent: signature and seal']) {
      step(page); await until(() => $$('.sheet .ink-field').length === 1, 60, `${page}: its field`);
      await wait(readS); sign(); await pick(0, page);
    }
    step('consent: age'); await pick(0, 'the age');
    step('consent: without recording'); await pick(1, 'start without recording');
    step('corridor: the doors'); await until(() => d.lobby === 'door', 60, 'the doors');
    await wait(5);
    step('door 101 pressed'); $('#door1 .clickable').emit('click');
    await until(() => d.roomState === 'intro', 60, 'room 101');
    step('room: intro');
    for (const n of [1, 2]) { await until(() => d.roomState === 'intro' && $$('.answer').length === 2, 600, `understood ${n}`); await pick(0, `understood ${n}`); }
    await until(() => d.roomState === 'run', 300, 'the trials');
    step('room: trials');
    let lit = false;
    const presser = setInterval(() => {
      const on = $('#yellow').getAttribute('material').emissiveIntensity > 0;
      if (on && !lit) { f.windows++; if (Math.random() < 0.5) setTimeout(() => { f.presses++; $('#buttonCap').emit('click'); }, (300 + Math.random() * 1500) / speed); }
      lit = on;
    }, 20);
    // 40 trials of a 3 s window and up to 25 s between (protocol.js), with room to spare
    await until(() => d.roomState === 'questions', (40 * 28) / speed + 300, 'the questions').finally(() => clearInterval(presser));
    step('room: questions');
    for (let n = 1; n <= 10; n++) await answer(n);   // 5 scales and 5 choices (questions.js)
    await until(() => d.roomState === 'done', 300, 'the reveal');
    step('room: reveal');
    for (let n = 1; n <= 6; n++) await pick(0, `reveal page ${n}`);
    await until(() => d.roomState === 'intro', 120, 'the room again');
    step('end'); f.done = true;
  })().catch((e) => { f.error = `${f.step}: ${e.message}`; });
  return true;
}
