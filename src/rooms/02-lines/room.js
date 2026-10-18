import '../../engine/panel.js';
import '../../engine/blob-shadow.js';
import '../../engine/surface.js';
import '../../engine/shapes.js';
import '../../engine/decal.js';
import '../../engine/merge-static.js';
import { createChoice } from '../../engine/ui/choice.js';
import { createSession } from '../../app/session.js';
import { showHint } from '../../app/hint.js';
import { writePlaque } from '../../app/brand.js';
import { unlock, getContext } from '../../engine/audio.js';
import { loadVoice, speak, hush } from '../../engine/voice.js';
import { createTrial } from './flow.js';
import { drawStimulus } from './geometry.js';
import { createAdjustment } from './adjustment.js';
import { VOICE_LINES } from './voice-lines.js';
import { SOUNDS } from './sound-list.js';
import { ORIGINAL } from './original.js';
import { T } from './texts.ru.js';

export { sceneHTML, DOORWAY } from './scene.js';
export const ENTRY = { id: '02-lines', real: false, debrief: T.early, extra: [],
  seat: { x: 0, z: 0.35, yaw: 0, pitch: 0 }, area: { minX: -0.15, maxX: 0.15, minZ: 0.2, maxZ: 0.5 } };
const VERSION = 1;
const trial = createTrial();
let root, display, choice, adjust, session, assignedNumber, menuHeld = false, hidden = false;
let screen, caption, inspect = -1, resultPage = 0, now = 0, frame = 0;
const cleanup = [];
const listen = (target, type, fn) => { target?.addEventListener(type, fn); cleanup.push(() => target?.removeEventListener(type, fn)); };
const held = () => menuHeld || hidden;
const isHidden = () => document.hidden || !!(root?.sceneEl.xrSession && root.sceneEl.xrSession.visibilityState !== 'visible');
const state = () => { document.documentElement.dataset.roomState = trial.state; };
const paragraph = (p, text, size = 46) => p.write([{ t: text, size: p === caption ? 40 : size, color: '#dadada' }],
  { fit: false, ...(p === caption ? { pad: 12 } : {}) });

function say(text) { hush(); if (!held()) speak(text); }
function buttons(labels, action, top = 1.04) {
  const generation = trial.generation;
  choice.show(labels, i => {
    if (held() || trial.state === 'idle' || generation !== trial.generation) return;
    action(i);
  }, top);
}
function draw() {
  state(); choice.hide(); adjust.hide();
  if (trial.state === 'idle' || held()) return;
  const s = trial.state;
  if (s === 'adjust') {
    hush();
    const n = trial.index < 2 ? trial.index + 1 : trial.index - 1;
    paragraph(caption, T.progress(trial.current.practice, n, trial.current.practice ? 2 : 4), 36);
    drawStimulus(screen, trial.current.condition, trial.value);
    const at = trial.index, generation = trial.generation;
    adjust.show(); buttons([T.confirm], () => { if (trial.confirm(at, generation)) draw(); }, 0.82);
  } else if (s === 'ready') {
    paragraph(caption, T.title(assignedNumber), 36);
    const bottom = paragraph(screen, T.ready);
    buttons([T.measure, T.repeatPractice], i => { i ? trial.repeatPractice() : trial.measure(); draw(); }, 2.1 - bottom - 0.04);
    say(T.ready);
  } else if (s === 'feedback') {
    const bottom = paragraph(screen, T.interference);
    paragraph(caption, T.title(assignedNumber), 36);
    buttons(T.interferenceOptions, i => { trial.answer(i); draw(); }, 2.1 - bottom - 0.04);
    say(T.interference);
  } else if (s === 'done') {
    const rows = trial.report();
    display.dataset.resultPage = inspect >= 0 ? 'inspect' : String(resultPage);
    if (inspect >= 0) {
      paragraph(caption, T.inspectTitle, 36);
      drawStimulus(screen, rows[inspect].condition, rows[inspect].meanDeg, false);
      buttons([T.other, T.back], i => { inspect = i ? -1 : 1 - inspect; if (i) resultPage = 0; draw(); });
    } else {
      paragraph(caption, [T.resultTitle, T.explanation, T.sourceTitle][resultPage], 36);
      const bottom = resultPage === 2
        ? screen.write([{ t: T.source, size: 46 }, { t: T.citation, size: 42, gap: 20 }], { fit: false })
        : paragraph(screen, resultPage ? T.reveal : T.result(rows));
      if (resultPage < 2) buttons([T.next], () => { resultPage++; draw(); }, 2.1 - bottom - 0.04);
      else buttons([T.inspect, T.back, T.restart], i => {
        if (i === 2) enter(false);
        else { if (i === 1) resultPage = 0; else inspect = 0; draw(); }
      }, 2.1 - bottom - 0.04);
      if (resultPage) say(resultPage === 1 ? T.reveal : T.source); else hush();
    }
  } else {
    const text = T[s];
    paragraph(caption, T.title(assignedNumber), 36);
    const bottom = paragraph(screen, text);
    buttons([s === 'intro' ? T.start : T.next], () => { trial.next(); draw(); }, 2.1 - bottom - 0.04);
    say(text);
  }
}
function syncHold() {
  const on = held();
  if (!trial.pause(on)) return;
  if (on) { choice.hide(); adjust.hide(); hush(); }
  else draw();
  const ctx = getContext();
  if (ctx) (on ? ctx.suspend() : ctx.resume()).catch(() => {});
}
function alignHeight() {
  // All coordinates stay local when the same experiment is moved/rotated by the app.
  const v = new THREE.Vector3(); root.sceneEl.camera.getWorldPosition(v);
  root.object3D.worldToLocal(v); display.object3D.position.y = v.y - 1.6;
}
export function mount(r, assignment) {
  if (!assignment?.number) throw new Error('A trial needs an assigned display number');
  if (root) dispose();
  root = r; assignedNumber = String(assignment.number); display = root.querySelector('#linesDisplay');
  screen = root.querySelector('#linesScreen').components.panel;
  caption = root.querySelector('#linesCaption').components.panel;
  choice = createChoice(display, { y: 1.0, z: -1.54, w: 1.5, h: 0.12, bottom: 0.45 });
  adjust = createAdjustment(display, { y: 1.0, z: -1.54, getValue: () => trial.value,
    enabled: () => !held() && trial.state === 'adjust', change: value => {
      if (!trial.adjust(value)) return false;
      drawStimulus(screen, trial.current.condition, trial.value); return true;
    } });
  session = createSession(ENTRY.id, VERSION); loadVoice(VOICE_LINES, import.meta.url);
  // Empty sound list and qualitative-only original results are intentional for this trial.
  if (SOUNDS.length || ORIGINAL.expectedPoorOutwardEffect) throw new Error('Unexpected trial source configuration');
  writePlaque(root.querySelector('#plaque').components.panel, { number: assignedNumber });
  const visibility = () => { hidden = isHidden(); syncHold(); };
  listen(document, 'visibilitychange', visibility);
  listen(root.sceneEl.xrSession, 'visibilitychange', visibility);
  listen(root.sceneEl, 'enter-vr', () => { listen(root.sceneEl.xrSession, 'visibilitychange', visibility); });
  listen(root.sceneEl, 'exit-vr', () => { hidden = document.hidden; syncHold(); });
  listen(root.sceneEl.querySelector('#rig'), 'recentered', () => {
    if (trial.state === 'adjust') { trial.pause(true); trial.pause(held()); }
    alignHeight(); if (!held()) draw();
  });
  const tick = t => { trial.tick(now ? t - now : 0); now = t; frame = requestAnimationFrame(tick); };
  frame = requestAnimationFrame(tick); state();
}
export function enter() {
  unlock(); trial.begin(); menuHeld = false; hidden = isHidden(); trial.pause(held());
  session.begin(false); inspect = -1; resultPage = 0; delete display.dataset.resultPage; alignHeight();
  document.title = T.title(assignedNumber); showHint({ title: T.title(assignedNumber), body: T.hint }); draw();
}
export function hold(on) { menuHeld = on; syncHold(); }
export const running = () => !['idle', 'done'].includes(trial.state);
export function leave() {
  trial.leave(); hush(); choice.hide(); adjust.hide(); screen.write([]); caption.write([]); state();
}
// Optional disposal for a new building assignment; no stale controls/animation on remount.
export function dispose() { leave(); adjust.dispose(); cancelAnimationFrame(frame); cleanup.splice(0).forEach(fn => fn()); root = null; }
