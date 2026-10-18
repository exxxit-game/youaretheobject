import '../../engine/panel.js';
import '../../engine/surface.js';
import '../../engine/shapes.js';
import '../../engine/merge-static.js';
import { createChoice } from '../../engine/ui/choice.js';
import { writePlaque } from '../../app/brand.js';
import { PREVIEW } from '../../app/session.js';
import { showHint } from '../../app/hint.js';
import { unlock } from '../../engine/audio.js';
import { loadVoice, speak, hush } from '../../engine/voice.js';
import { createPreview } from './flow.js';
import { createEffects } from './effects.js';
import { BOOTH } from './scene.js';
import { VOICE_LINES } from './voice-lines.js';
import { SOUNDS } from './sound-list.js';
import { ORIGINAL } from './original.js';
import { T } from './texts.ru.js';
export { sceneHTML, DOORWAY } from './scene.js';
export const ENTRY = { id: '03-change', real: false, debrief: T.early, extra: [],
  seat: { x: 0, z: 0.35, yaw: 0, pitch: 0 }, area: { minX: -0.15, maxX: 0.15, minZ: 0.2, maxZ: 0.5 } };
const trial = createPreview();
let root, display, screen, caption, choice, effects, assignedNumber, menuHeld = false, hidden = false;
const cleanup = [];
const listen = (target, name, fn) => {
  if (!target) return; target.addEventListener(name, fn); cleanup.push(() => target.removeEventListener(name, fn));
};
const isHidden = () => document.hidden || (!!root.sceneEl.xrSession && root.sceneEl.xrSession.visibilityState !== 'visible');
const held = () => menuHeld || hidden;
const state = () => { document.documentElement.dataset.roomState = trial.state; };
const paragraph = (panel, text, size = 46) => panel.write([{ t: text, size }], { fit: false });
function buttons(labels, fn, top) {
  const generation = trial.generation;
  choice.show(labels, index => { if (!held() && generation === trial.generation) fn(index); }, top);
}
function draw() {
  state(); choice.hide(); hush(); effects.reset();
  const s = trial.state, showing = ['first', 'blank', 'second'].includes(s);
  display.object3D.visible = !held() && !showing && s !== 'idle';
  if (held() || s === 'idle') return;
  if (s === 'blank') { effects.blank(); return; }
  if (s === 'first' || s === 'second') {
    if (trial.altered) effects.apply(trial.aspect, trial.strength);
    return;
  }
  paragraph(caption, s === 'done' ? T.title(assignedNumber) : T.progress(trial.index + 1), 36);
  let text, labels, act;
  if (s === 'intro') {
    text = T.intro + '\n\n' + T.note; labels = [T.start];
    act = () => { trial.next(); draw(); };
  } else if (s === 'ready') {
    text = T.ready + '\n\n' + T.level[trial.level]; labels = [T.show, T.weaker, T.stronger];
    act = i => { i === 0 ? trial.start() : trial.adjust(i === 1 ? -1 : 1); draw(); };
  } else if (s === 'answer') {
    text = T.question; const order = trial.order, token = trial.token;
    labels = order.map(key => T[key]); act = i => { if (trial.answer(order[i], token)) draw(); };
  } else if (s === 'feedback') {
    text = T.names[trial.aspect] + '\n\n' + T.feedback + '\n\n' + T.level[trial.level];
    labels = [T.next, T.repeat, T.weaker, T.stronger];
    act = i => { if (i === 0) trial.next(); else if (i === 1) trial.start(); else trial.adjust(i === 2 ? -1 : 1); draw(); };
  } else if (s === 'interrupted') {
    text = T.interrupted; labels = [T.repeat]; act = () => { trial.start(); draw(); };
  } else {
    text = T.done; labels = [T.restart]; act = () => enter();
  }
  const bottom = paragraph(screen, text);
  buttons(labels, act, 2.1 - bottom - 0.04);
  if (s === 'intro') {
    const generation = trial.generation;
    speak(T.intro).then(() => {
      if (generation === trial.generation && trial.state === 'intro' && !held()) speak(T.note);
    });
  } else if (['ready', 'interrupted', 'done'].includes(s)) speak(T[s]);
}
function syncHold() { if (trial.hold(held())) draw(); }
function alignHeight() {
  const eye = new THREE.Vector3(); root.sceneEl.camera.getWorldPosition(eye); root.object3D.worldToLocal(eye);
  display.object3D.position.y = eye.y - 1.6;
}
AFRAME.registerComponent('change-frame', {
  tick(t) {
    if (this.el !== root) return;
    effects.tick(t); if (trial.tick()) draw();
  },
  tock() { if (this.el === root && !held()) trial.present(); }
});
export function mount(r, assignment) {
  if (!PREVIEW) throw new Error('Viewing preview requires a marked preview export');
  if (!assignment?.number) throw new Error('Viewing preview needs an assigned display number');
  if (root) dispose(); root = r; assignedNumber = String(assignment.number);
  display = root.querySelector('#changeDisplay'); screen = root.querySelector('#changeScreen').components.panel;
  caption = root.querySelector('#changeCaption').components.panel;
  choice = createChoice(display, { y: 1, z: -1.54, w: 1.5, h: 0.12, bottom: 0.45 });
  effects = createEffects(root.querySelector('#changeWorld'), root.sceneEl.camera, BOOTH.ceiling);
  if (SOUNDS.length || ORIGINAL.exactStopRuleKnown) throw new Error('Unexpected preview configuration');
  writePlaque(root.querySelector('#plaque').components.panel, { number: assignedNumber });
  loadVoice(VOICE_LINES, import.meta.url);
  const visibility = () => { hidden = isHidden(); syncHold(); };
  listen(document, 'visibilitychange', visibility);
  listen(root.sceneEl.xrSession, 'visibilitychange', visibility);
  listen(root.sceneEl, 'enter-vr', () => { listen(root.sceneEl.xrSession, 'visibilitychange', visibility); visibility(); });
  listen(root.sceneEl, 'exit-vr', () => { hidden = document.hidden; trial.hold(true); trial.hold(held()); draw(); });
  listen(root.sceneEl.querySelector('#rig'), 'recentered', () => {
    trial.hold(true); trial.hold(held()); alignHeight(); draw();
  });
  root.setAttribute('change-frame', ''); state();
}
export function enter() {
  unlock(); trial.begin(); menuHeld = false; hidden = isHidden(); trial.hold(held()); alignHeight();
  document.title = T.title(assignedNumber); showHint({ title: T.title(assignedNumber), body: T.hint }); draw();
}
export function hold(on) { menuHeld = on; syncHold(); }
export const running = () => !['idle', 'done'].includes(trial.state);
export function leave() { trial.leave(); hush(); choice.hide(); effects.reset(); display.object3D.visible = false; state(); }
export function dispose() {
  leave(); root.removeAttribute('change-frame'); effects.dispose(); cleanup.splice(0).forEach(fn => fn()); root = null;
}
