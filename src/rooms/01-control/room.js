import '../../engine/panel.js';
import '../../engine/sfx.js';
import '../../engine/blob-shadow.js';
import '../../engine/cable.js';
import '../../engine/surface.js';
import '../../engine/shapes.js';
import '../../engine/decal.js';
import '../../engine/merge-static.js';
import { eventLog } from '../../engine/log.js';
import { unlock, getContext } from '../../engine/audio.js';
import { loadSounds, playSound } from '../../engine/sfx.js';
import { loadVoice, speak, hush } from '../../engine/voice.js';
import { pulse } from '../../engine/haptics.js';
import { pressable } from '../../engine/laser-beam.js';
import { createChoice } from '../../engine/ui/choice.js';
import { createScale } from '../../engine/ui/scale.js';
import { createAwayMeter } from '../../engine/away-meter.js';
import { markStarted, markReached, watchExit } from '../../app/left-early.js';
import { ROOM1_NUMBER } from '../../app/lobby/plan.js';
import { createSession, SPEED, PLAYTEST } from '../../app/session.js';
import { askPlaytest } from '../../app/playtest.js';
import { playtestReport } from '../../app/playtest-report.js';
import { APP_T } from '../../app/texts.ru.js';
import { writePlaque } from '../../app/brand.js';
import { showHint } from '../../app/hint.js';
import { placeChair } from './chair.js';
import { PROTOCOL } from './protocol.js';
import { pickCondition, makeTapes, makeIntervals } from './schedule.js';
import { createTrials } from './trials.js';
import { createRun } from './flow.js';
import { askAll } from './questions.js';
import { analyse } from './report.js';
import { revealPages } from './reveal.js';
import { T } from './texts.ru.js';
import { VOICE_LINES } from './voice-lines.js';
import { SOUNDS } from './sound-list.js';

// Bump when a change makes new results not comparable with older ones.
const ROOM_ID = '01-control';
const ROOM_VERSION = 1;

const INK = '#f2efe8';
const $ = (s) => document.querySelector(s);
const screen = () => $('#screen').components.panel;
const flow = createRun(() => paused());   // this run, and pauses that stop while the room holds
const delay = (ms) => flow.delay(ms);
// Places in the room's own metres (scene.js); the corridor stands the room behind its door.
// Behind the player, where the door would be.
const DOOR = { x: 0.7, y: 1.0, z: 1.5 };
// The stand with the two lights: looking far away from it during the trials is
// counted for the playtest (where attention drifts).
const STAND = { x: 0, y: 1.02, z: -0.45 };
// Top edge of the wall screen (centre 1.86 m, height 1.0 m) and the gap left
// between a question and the buttons or scale under it.
const SCREEN_TOP = 2.36;
// Answer buttons stay above the screen's lower edge (with a small margin).
const SCREEN_LOW = SCREEN_TOP - 1.0 + 0.02;
const UNDER_TEXT = 0.05;

export { sceneHTML, DOORWAY } from './scene.js';
// What the corridor needs before its door (src/app/lab.js): the room, what a player who left it
// early learns, where they sit (at the table, facing it; on a computer the view tilted down toward
// it) and where the computer's camera may move.
export const ENTRY = {
  id: ROOM_ID, real: SPEED === 1, debrief: T.earlyDebrief, extra: PLAYTEST ? [APP_T.playtest.consent] : [],
  seat: { x: 0, z: 0.35, yaw: 0, pitch: -16 }, area: { minX: -1.4, maxX: 1.4, minZ: 0.3, maxZ: 1.55 }
};

let scene, root, choice, lowChoice, scale, shownScale, session, trials = null, meter = null, ambient = null;
// a point of the room in the world's metres, for what takes world places (sounds, the away meter)
const inWorld = ({ x, y, z }) => { const v = root.object3D.localToWorld(new THREE.Vector3(x, y, z)); return { x: v.x, y: v.y, z: v.z }; };
let seated = false;
let xrVisible = true;
// the room holds under the "you left" box (left-early.js) or the game's menu (hold), kept apart: one closing frees not the other
let heldByExit = false, heldByMenu = false, debriefed = false;
const paused = () => document.hidden || !xrVisible || heldByExit || heldByMenu;
// Real play only: test runs (?speed=N) leave no "left early" mark.
const REAL = SPEED === 1;

// Playtest measures: when each phase started, seconds looking away during the trials.
const phaseStart = {};
const phaseSecs = {};
let awaySecs = 0;
function phase(name) {
  const now = performance.now();
  for (const [k, t] of Object.entries(phaseStart)) if (phaseSecs[k] == null) phaseSecs[k] = (now - t) / 1000;
  if (name) phaseStart[name] = now;
}

// idle (consent) -> intro -> run -> questions -> done -> intro ...
// Mirrored on <html data-room-state> so tests can observe the flow.
let state = 'idle';
function setState(s) {
  state = s;
  document.documentElement.dataset.roomState = s;
  // the button answers only in the trials, so the ray marks it only then (src/engine/laser-beam.js)
  pressable($('#buttonCap'), s === 'run');
}

/* ---------- the experimenter: voice plus the same words on the screen ---------- */
function show(text, top = false) {
  screen().write([{ t: text, size: top ? 54 : 60, color: INK, weight: 500 }], { top });
}

// Shows the line and waits until it has been spoken (or read, without audio).
async function say(text, top = false) {
  const n = flow.id;
  show(text, top);
  if (SPEED > 1) { speak(text); await flow.within(delay(150), n); return; }
  const spoken = await flow.within(speak(text), n);
  await flow.within(delay(spoken ? 450 : 1500 + text.length * 55), n);
}

// Buttons under a text that fills the screen (pages, checks). top: from writeTop.
function pick(labels, top) {   // shown once the room no longer holds: no button comes up under a menu
  const n = flow.id; return flow.within(delay(0), n).then(() => flow.within(new Promise((resolve) => lowChoice.show(labels, resolve, top)), n));
}

// Shows a question at the top of the screen and returns where the answers may
// start (the top edge for the buttons or scale), below the last line of text.
// The same height is written on the screen element for the smoke test.
function ask(text) {
  speak(text);
  return writeTop([{ t: text, size: 54, color: INK, weight: 500 }]);
}

// Writes blocks from the top of the screen; returns the top edge for widgets below.
function writeTop(blocks, opt = {}) {
  const bottom = screen().write(blocks, { ...opt, top: true });
  $('#screen').dataset.textBottom = (SCREEN_TOP - bottom).toFixed(3);
  return SCREEN_TOP - bottom - UNDER_TEXT;
}

async function understood() {
  return (await pick([APP_T.understood, APP_T.repeat], ask(T.repeatQuestion))) === 0;
}

/* ---------- flow ---------- */
async function intro() {
  setState('intro');
  phase('intro');
  // As in the paper (pp. 451–452): instructions, a chance to ask; then the control
  // concept with the empty scale in view, and a chance to ask again.
  do {
    for (const line of T.instructions) await say(line);
  } while (!(await understood()));
  do {
    shownScale.show({ labels: T.questions.control.labels, step: PROTOCOL.scaleStep });
    for (const line of T.concept) await say(line, true);
    shownScale.hide();
  } while (!(await understood()));
  await say(T.leave);
  playSound('door', inWorld(DOOR), 0.8);
  screen().write([]);
  await flow.within(delay(4000 / SPEED));
}

async function runTrials() {
  setState('run');
  phase('run');
  const n = flow.id;
  meter = createAwayMeter($('#cam'), inWorld(STAND), paused);
  meter.start();
  eventLog.reset();
  eventLog.begin();
  const condition = pickCondition(Math.random);
  trials = createTrials({
    tapes: makeTapes(condition, Math.random),
    intervals: makeIntervals(Math.random),
    speed: SPEED,
    paused
  });
  await flow.within(trials.run(), n);
  trials = null;
  awaySecs = meter.stop(); meter = null;
  return condition;
}

async function questions() {
  setState('questions');
  phase('questions');
  playSound('door', inWorld(DOOR), 0.8);
  await flow.within(delay(1500 / SPEED));
  await say(T.back);
  // the experimenter rereads the part about control (p. 452)
  for (const line of T.concept.slice(1)) await say(line);
  await askAll({ ask, scale, choice });
}

async function reveal(condition) {
  setState('done');
  phase('reveal');
  eventLog.end();
  const r = analyse(eventLog.entries);
  await say(T.thanks);
  // test runs never ask the live server
  const others = await flow.within(session.compare());
  const pages = revealPages(r, condition, others);
  for (let i = 0; i < pages.length; i++) {
    // debriefed, and the result sent, as the truth is shown (p. 452); leaving before it: the short debrief, nothing sent
    if (i === Math.min(1, pages.length - 1)) { debriefed = true; if (REAL) markReached(ROOM_ID); session.finish({ condition, ...r, seated, speed: SPEED }); }
    const top = writeTop(pages[i], { pad: 2048 * 0.07 });
    const last = i === pages.length - 1 && !PLAYTEST;
    await pick([last ? APP_T.again : APP_T.next], top);
  }
  phase(null);
  if (PLAYTEST) await playtest(r);
}

// Playtest mode: five questions, then the answers with the run measures are sent.
async function playtest(r) {
  await say(APP_T.playtest.intro, true);
  const answers = await askPlaytest({ ask, scale, choice });
  session.finishPlaytest(playtestReport({ finished: true, secs: phaseSecs, away: awaySecs, presses: r.presses, voided: r.voided,
    seated, userAgent: navigator.userAgent }, answers));
  await pick([APP_T.again], ask(APP_T.playtest.thanks));
}

async function play(withRecording) {
  debriefed = false; session.begin(withRecording);
  if (REAL) markStarted(ROOM_ID);
  for (const k of Object.keys(phaseStart)) { delete phaseStart[k]; delete phaseSecs[k]; }
  await intro();
  const condition = await runTrials();
  await questions();
  await reveal(condition);
  play(withRecording);
}

/* ---------- the response button ---------- */
function pressButton(e) {
  if (state !== 'run' || !trials || heldByExit || heldByMenu) return;   // nothing counts under a menu
  trials.press();
  const cap = $('#buttonCap').object3D;
  cap.position.y = 0.001; setTimeout(() => { cap.position.y = 0.006; }, 120);
  if (e && e.detail && e.detail.cursorEl) pulse(e.detail.cursorEl, 0.6, 40);
}

/* ---------- the room behind its door, then the player in it ---------- */
// Room contract (docs/rooms.md): mount(root) once the room stands loaded behind its shut door (root:
// its group in the scene), enter(withRecording) once the player is in, at the table.
export function mount(r) {
  root = r;
  scene = root.sceneEl;
  session = createSession(ROOM_ID, ROOM_VERSION);
  session.watchIssues(() => ({ state, xr: !!scene.renderer?.xr?.isPresenting }));   // a computer's full screen is no headset
  loadVoice(VOICE_LINES, import.meta.url);
  loadSounds(SOUNDS, import.meta.url);
  // answer buttons under a short question at the top of the screen, in the room's own metres
  choice = createChoice(root, { y: 2.02, z: -1.555, w: 1.5, bottom: SCREEN_LOW });
  lowChoice = createChoice(root, { y: 1.48, z: -1.555, w: 0.9, h: 0.12, bottom: SCREEN_LOW });
  scale = createScale(root, { y: 1.78, z: -1.555 });
  shownScale = createScale(root, { y: 1.6, z: -1.555 });
  writePlaque($('#plaque').components.panel, { number: ROOM1_NUMBER });   // the same number as outside
  $('#buttonCap').addEventListener('click', pressButton);
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') pressButton(); });
  scene.addEventListener('enter-vr', () => {
    const s = scene.xrSession;
    if (s) s.addEventListener('visibilitychange', () => { xrVisible = s.visibilityState === 'visible'; });
  });
  scene.addEventListener('exit-vr', () => { xrVisible = true; seated = false; placeChair(false); });
  if (REAL) {
    watchExit(scene, { room: ROOM_ID, debrief: T.earlyDebrief, hold: (on) => { heldByExit = on; syncSound(); }, midRoom: running });
  }
  $('#rig').addEventListener('recentered', (e) => { seated = !!(e.detail && e.detail.seated); placeChair(seated); });
  setState('idle');
}

export function enter(withRecording) {
  unlock();
  document.title = T.pageTitle(ROOM1_NUMBER);
  showHint({ title: T.hint.title(ROOM1_NUMBER), body: T.hint.body });
  ambient = playSound('room', null, 0.12, true);
  play(withRecording);
}

// The game's menu is open (src/app/menu.js): the room holds as under the headset's own menu, a trial cut by it
// is not counted (trials.js voids a cut window), and the button waits.
export function hold(on) {
  heldByMenu = on;
  pressable($('#buttonCap'), !on && state === 'run');
  syncSound();
}
function syncSound() { const ctx = getContext(); if (ctx) (heldByMenu || heldByExit ? ctx.suspend() : ctx.resume()).catch(() => {}); }   // both off: sound
// Whether the player is inside a run, before the truth of its debrief is shown (reveal)
export const running = () => ['intro', 'run', 'questions'].includes(state) || (state === 'done' && !debriefed);

// The player leaves through the menu, before the fade to black: before the truth of the debrief nothing of the run
// is sent (reveal), and the room stands as before its first entry; leaving before it, nothing of the room is told (left-early.js).
export function leave() {
  flow.end();
  heldByExit = heldByMenu = false; syncSound(); document.querySelector('#left-early')?.remove();   // sound back; the left-VR box ends with the run
  trials?.stop(); trials = null; meter?.stop(); meter = null; hush(); ambient?.stop(); ambient = null;
  for (const w of [choice, lowChoice, scale, shownScale]) w.hide();
  screen().write([]);
  setState('idle');
}
