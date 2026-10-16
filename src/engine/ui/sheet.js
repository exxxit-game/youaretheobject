import { readingPose, glidePath, BOARD, CLIP, BOARD_REACH } from './sheet-math.js';
import '../reflect-env.js';
import '../merge-static.js';
import { createPage, PAPER, PAPER_BG, DENSITY } from './sheet-page.js';
import '../glide.js';
import '../shapes.js';
import '../decal.js';

// The clipboard sheet: everything the player reads or answers, one thought per page.
// It is read 1 m in front of the player, a little below the eyes, and stays still
// (world-fixed) until it is closed; answers with the laser or the mouse. Why and the
// sources: docs/decisions.md, "Everything the player reads or answers is on a clipboard".
// It may hang on a hook in the room first (hang): the player clicks it (take), it glides
// to them, and after the last answer it glides back (back); docs/decisions.md, "The
// opening is calm".
// What a page shows and how (text, buttons, fields to write in): sheet-page.js.
const HARDBOARD = '#3b2a1e';      // dark brown pressed hardboard, as the clipboard in the photo
const HARDBOARD_HOVER = '#6e5038'; // the hanging clipboard brightens under the laser or mouse
// the clip: nickel-plated steel with a soft sheen, mirroring the room round it (reflect-env)
const METAL = 'color: #d4d7d9; metalness: 0.5; roughness: 0.45';

// inside: the wall faces of the space { minX, maxX, minZ, maxZ }, or a list of the spaces that open
// into each other (the corridor and its elevator hall); the sheet is never read beyond the faces of
// the space the head is in (sheet-math.js, readingPose).
export function createSheet(scene, { inside = null } = {}) {
  const spaces = inside && (Array.isArray(inside) ? inside : [inside]);
  const spaceAt = ([x, , z]) => spaces && (spaces.find((s) => x >= s.minX && x <= s.maxX && z >= s.minZ && z <= s.maxZ) || spaces[0]);
  const el = document.createElement('a-entity');
  el.classList.add('sheet');
  el.setAttribute('visible', false);
  el.setAttribute('glide', '');
  el.setAttribute('reflect-env', 'strength: 0.4');
  el.setAttribute('merge-static', '');   // the clip's five steel parts move with the board: one draw call
  el.innerHTML = `
    <a-entity class="board" decal="back: true" plate="width: ${BOARD.w}; height: ${BOARD.top + BOARD.bottom}; depth: ${BOARD.d}; corner: ${BOARD.corner}; color: ${HARDBOARD}; roughness: 0.55"
              position="0 ${(BOARD.top - BOARD.bottom) / 2} ${-BOARD.d / 2}"></a-entity>
    <a-entity class="paper" panel="w: ${PAPER.w}; h: ${PAPER.h}; px: ${Math.round(PAPER.w * DENSITY)}; bg: ${PAPER_BG}"></a-entity>
    <a-entity plate="width: ${CLIP.jaw.w}; height: ${CLIP.jaw.h}; depth: ${CLIP.jaw.d}; corner: 0.004; ${METAL}" position="0 ${CLIP.jaw.y} ${CLIP.jaw.d / 2 + 0.001}"></a-entity>
    <a-entity rounded-box="width: ${CLIP.hump.w}; height: ${CLIP.hump.h}; depth: ${CLIP.hump.d}; radius: 0.008; ${METAL}" position="0 ${CLIP.hump.y} ${CLIP.hump.d / 2}"></a-entity>
    <a-cylinder radius="0.005" height="0.003" rotation="90 0 0" position="${-0.3 * CLIP.hump.w} ${CLIP.hump.y - 0.012} ${CLIP.hump.d + 0.0015}" material="${METAL}"></a-cylinder>
    <a-cylinder radius="0.005" height="0.003" rotation="90 0 0" position="${0.3 * CLIP.hump.w} ${CLIP.hump.y - 0.012} ${CLIP.hump.d + 0.0015}" material="${METAL}"></a-cylinder>
    <a-entity loop="outer: ${CLIP.ring.r + CLIP.ring.tube}; hole: ${CLIP.ring.r - CLIP.ring.tube}; depth: 0.003; ${METAL}" position="0 ${CLIP.ring.y} ${CLIP.ring.z}"></a-entity>`;
  scene.appendChild(el);
  // An entity added to a running scene starts its components a moment later: pages wait.
  const paperEl = el.querySelector('.paper');
  const pg = createPage(el, paperEl), choice = pg.choice;
  const ready = new Promise((resolve) => {
    if (paperEl.hasLoaded) resolve(); else paperEl.addEventListener('loaded', resolve, { once: true });
  });
  const paper = () => paperEl.components.panel;
  const board = el.querySelector('.board');
  let isOpen = false;
  let page = { blocks: null, labels: null, onPick: null, form: false };   // what it shows, to come back to
  let waitingTake = false;
  // asking: a question has cut in and waits for its answer; saved: the page behind it, kept until
  // the sheet is back where it was (after the answer, during the trip back to the hook)
  let asking = false, saved = null;
  const busy = () => asking || !!saved;
  let home = null;   // { pos: [x, y, z], yaw, away: [x, y, z] } while it has a hook
  // The paper is drawn unlit so it reads well; on its hook it is dimmed to the light of the
  // room around it (or it would glow in a dim corridor), and brightens on the way to the player.
  let hookLight = 1;
  const tint = (v) => { const m = paperEl.getObject3D('mesh'); if (m) m.material.color.setScalar(v); };

  function front() {
    const cam = scene.camera;
    const head = new THREE.Vector3(), q = new THREE.Quaternion();
    cam.getWorldPosition(head);
    cam.getWorldQuaternion(q);
    const yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y;
    return readingPose(head.toArray(), yaw, home, spaceAt(head.toArray()), BOARD_REACH);
  }

  function eyes() {
    const head = new THREE.Vector3();
    scene.camera.getWorldPosition(head);
    return head.toArray();
  }

  function place() {
    const p = front();
    el.object3D.position.fromArray(p.pos);
    el.object3D.rotation.set(p.pitch, p.yaw, 0, 'YXZ');
  }
  // the player was placed again (VR entry, recenter, headset put back on) or moved with the
  // thumbsticks: follow them; a sheet on its way to them goes to their new place once it arrives.
  // At once: reading the camera's world place updates its parents' matrices first (three.js
  // getWorldPosition), so the rig's new place is already in it.
  let movedOnTheWay = false;
  const follow = () => {
    if (!isOpen) return;
    if (el.components.glide.trip) movedOnTheWay = true; else place();
  };
  scene.addEventListener('recentered', follow);
  scene.addEventListener('player-moved', follow);

  function glideTo(pos, rotation, step) {
    const o = el.object3D;
    o.rotation.reorder('YXZ');
    // every corner of the board stays off the walls all the way (the walls of the space the head is in)
    const head = eyes(), space = spaceAt(head);
    const room = space && { from: { pitch: o.rotation.x, yaw: o.rotation.y }, to: { pitch: rotation[0], yaw: rotation[1] }, board: BOARD_REACH, inside: space };
    const { ctrl, ms } = glidePath(o.position.toArray(), pos, home.away, head, room);
    return el.components.glide.go({ to: pos, ctrl, rotation, ms, step });
  }

  async function comeToPlayer() {
    const p = front();
    await glideTo(p.pos, [p.pitch, p.yaw, 0], (e) => tint(hookLight + (1 - hookLight) * e));
    if (movedOnTheWay) { movedOnTheWay = false; place(); }
  }

  // The sheet only ever comes from its hook: shown from nowhere it popped up in front of the eyes,
  // which frightens in VR (docs/mistakes.md; docs/decisions.md, "The opening is calm"). A room that
  // shows a page before hanging the sheet fails here, and the smoke test fails on the error.
  function open() {
    if (isOpen) return;
    if (!home) throw new Error('the clipboard has no hook: hang it (sheet.hang) before showing a page');
    isOpen = true;
    el.setAttribute('visible', true);
    el.dataset.open = '1';
    comeToPlayer();
  }

  function close() {
    choice.hide();
    pg.hideFields();
    isOpen = false;
    el.setAttribute('visible', false);
    delete el.dataset.open;
  }

  // Hangs the sheet on a hook showing a cover page (blocks as in write); light: how bright the
  // paper looks there (0..1), as lit as the room around the hook.
  async function hang(pose, cover, light = 1) {
    await ready;
    home = pose;
    hookLight = light;
    tint(light);
    el.object3D.position.fromArray(pose.pos);
    el.object3D.rotation.set(0, pose.yaw, 0, 'YXZ');
    el.setAttribute('visible', true);
    setPage({ blocks: cover });
  }

  // Lasers and the mouse keep a list of what they can hit; a class change on an entity
  // that is already in the scene does not update it.
  const refreshRays = () => { for (const r of [scene, ...scene.querySelectorAll('[raycaster]')]) r.components.raycaster?.refreshObjects(); };
  const clickable = (on) => {
    for (const part of [board, paperEl]) part.classList.toggle('clickable', on);
    refreshRays();
  };

  // Resolves once the player clicked the hanging sheet and it has reached them. blocks, if
  // given, are shown on it while it waits (what the voice says, for a player without sound).
  function take(blocks) {
    if (blocks) setPage({ blocks });
    if (!busy()) clickable(true);   // else resume() makes it so, once the question is gone
    waitingTake = true;
    const hover = (on) => board.setAttribute('plate', 'color', on ? HARDBOARD_HOVER : HARDBOARD);
    const enter = () => { if (!busy()) hover(true); }, leave = () => hover(false);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.dataset.take = '1';
    return new Promise((resolve) => {
      // a click on a question that cut in (interrupt) is not a take
      const onClick = async () => {
        if (busy()) return;
        el.removeEventListener('click', onClick);
        waitingTake = false;
        el.emit('taken', null, false);
        delete el.dataset.take;
        clickable(false);
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
        hover(false);
        isOpen = true;
        el.dataset.open = '1';
        await comeToPlayer();
        resolve();
      };
      el.addEventListener('click', onClick);
    });
  }

  // Back on its hook (after the last answer); blocks, if given, are shown there.
  async function back(blocks) {
    choice.hide();
    pg.hideFields();
    isOpen = false;
    delete el.dataset.open;
    await glideTo(home.pos, [0, home.yaw, 0], (e) => tint(1 - (1 - hookLight) * e));
    if (blocks) setPage({ blocks });
  }

  // Every page change goes through here. While a question has cut in (interrupt), the new page
  // is kept for resume() instead of being drawn over the question, and its answers wait with it.
  // Returns the top of the answer buttons, or null when kept.
  function setPage(next) {
    next = { labels: null, onPick: null, form: false, note: null, stamp: null, pressed: false, ...next };
    if (saved) { Object.assign(saved, next); return null; }
    page = next;
    const top = pg.show(page);
    refreshRays();
    return top;
  }

  // A question that cuts in on whatever the sheet shows (leaving the game): a hanging sheet
  // comes to the player first, a closed one opens. Resolves with the index picked; resume()
  // then shows the current page again (or one that came meanwhile) and puts the sheet back
  // where it was. Null while one is already asked.
  async function interrupt(blocks, labels) {
    await ready;
    if (busy()) return null;
    asking = true;
    // what waits for the answer stops answering the rays meanwhile (the door, the poster)
    el.emit('asking', true);
    while (el.components.glide.trip) await el.components.glide.trip.arrived;
    saved = { ...page, was: isOpen ? 'open' : home ? 'hanging' : 'closed' };
    if (saved.was === 'hanging') {
      clickable(false);
      isOpen = true;
      el.dataset.open = '1';
      await comeToPlayer();
    } else if (saved.was === 'closed') open();
    pg.hideFields();
    refreshRays();
    return new Promise((resolve) => pg.show({ blocks, labels, onPick: resolve }));
  }

  // A second question on a sheet already cut in on (interrupt), before resume() puts it back: a
  // follow-up to the answer just given. Null when no question has cut in.
  function next(blocks, labels) {
    if (!asking) return Promise.resolve(null);
    return new Promise((resolve) => pg.show({ blocks, labels, onPick: resolve }));
  }

  async function resume() {
    if (!saved) return;
    asking = false;   // answered: the game goes on (a door opens) while the sheet goes back
    el.emit('asking', false);
    choice.hide();
    if (saved.was === 'hanging') {
      isOpen = false;
      delete el.dataset.open;
      await glideTo(home.pos, [0, home.yaw, 0], (e) => tint(1 - (1 - hookLight) * e));
    }
    const p = saved;
    saved = null;
    setPage(p);
    if (p.was === 'hanging' && waitingTake) clickable(true);
    if (p.was === 'closed') close();
  }

  // A page to read (the voice may read it too); no buttons.
  async function say(blocks) {
    await ready;
    open();
    setPage({ blocks });
  }

  // A page with answers; resolves with the index of the one picked.
  async function choose(blocks, labels) {
    await ready;
    open();
    return new Promise((resolve) => setPage({ blocks, labels, onPick: resolve }));
  }

  // A form filled in by hand: every blank on the page (a run of underscores) takes ink from the
  // laser or the mouse (ink.js); note stands where the button will be until every blank has some
  // writing, then the button (label). A form that is certified (stamp, sheet-page.js) gets its
  // seal pressed at its place the moment it is signed. Resolves with the strokes, one list per
  // blank in page order ([[u, v], ...] from 0 to 1 across its field).
  async function fill(blocks, label, note, stamp = null) {
    await ready;
    open();
    return new Promise((resolve) => {
      const draw = () => {
        const done = pg.fields().length > 0 && pg.fields().every((f) => f.components.ink && f.components.ink.written());
        setPage({ blocks, note: done ? null : note, labels: done ? [label] : null, form: true, stamp, pressed: done,
          onPick: () => { const strokes = pg.fields().map((f) => f.components.ink.strokes); el.removeEventListener('inked', draw); pg.dropFields(); resolve(strokes); } });
      };
      draw();
      el.addEventListener('inked', draw);
    });
  }

  // whether a question has cut in (the caller holds other actions until it is answered)
  const isAsking = () => asking;

  return { el, open, close, say, choose, fill, hang, take, back, interrupt, next, resume, isAsking };
}
