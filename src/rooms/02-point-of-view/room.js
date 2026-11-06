import '../../engine/panel.js';
import '../../engine/recenter.js';
import { eventLog } from '../../engine/log.js';
import { analyse } from './report.js';
import { sceneHTML } from './scene.js';
import { T } from './texts.ru.js';
import { ACTIONS, ANGLES, changeView, projection } from './view.js';

function screenControls(hint, act) {
  const title = document.createElement('b');
  title.textContent = T.title;
  hint.append(title, ' ', T.intro);
  hint.classList.add('view-hint', 'show');

  const controls = document.createElement('section');
  controls.id = 'view-controls';
  controls.setAttribute('aria-label', T.actionsLabel);
  const history = document.createElement('p');
  history.id = 'view-history';
  history.setAttribute('role', 'status');
  controls.append(history);

  const angleButtons = [];
  for (const action of ACTIONS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.viewAction = action;
    button.textContent = T.actions[action];
    button.addEventListener('click', () => act(action));
    if (Object.hasOwn(ANGLES, action)) angleButtons.push(button);
    controls.append(button);
  }

  document.body.append(controls);
  return { controls, history, angleButtons };
}

export async function mount() {
  document.title = T.title;
  document.documentElement.dataset.roomState = 'idle';
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('../../../css/point-of-view.css', import.meta.url);
  document.head.append(css);

  document.body.insertAdjacentHTML('beforeend', sceneHTML);
  const scene = document.querySelector('a-scene');
  if (!scene.hasLoaded) await new Promise(resolve => scene.addEventListener('loaded', resolve, { once: true }));

  const object = scene.querySelector('#view-object');
  const xr = scene.querySelector('#view-xr');
  const xrHistory = xr.querySelector('#view-xr-history').components.panel;
  const targets = [...xr.querySelectorAll('[data-view-action]')];
  const controllers = new Map([...scene.querySelectorAll('[data-view-hand]')]
    .map(el => [el.dataset.viewHand, el]));
  let session;
  const hint = document.getElementById('hint');
  const { controls, history, angleButtons } = screenControls(hint, act);

  function render(report) {
    const { position, rotation, scale } = projection(report.view);
    object.setAttribute('position', position);
    object.setAttribute('rotation', rotation);
    object.setAttribute('scale', scale);

    for (const button of angleButtons) {
      button.setAttribute('aria-pressed', ANGLES[button.dataset.viewAction] === report.view.turn);
    }
    const recent = report.recent.map(action => T.actions[action]).join(' → ');
    const lines = [T.view(report.view.turn), T.memory(report.frontSeen), T.history(report.count)];
    if (recent) lines.push(recent);
    history.textContent = lines.join(' · ');
    const xrLines = [T.xrIntro, lines.slice(0, 3).join(' · '), recent].filter(Boolean);
    xrHistory.write(xrLines.map(t => ({ t, size: 45, weight: 600, gap: 8 })), { pad: 36 });
  }

  function act(action) {
    if (action === 'restart') {
      eventLog.reset();
      eventLog.begin();
    } else {
      const view = changeView(analyse(eventLog.entries).view, action);
      eventLog.add(action, view);
    }
    render(analyse(eventLog.entries));
  }

  for (const target of targets) {
    const { viewAction } = target.dataset;
    target.querySelector('[panel]').components.panel.write([{ t: T.actions[viewAction], size: 42, weight: 700 }]);
    target.addEventListener('mouseenter', () => target.setAttribute('material', 'color', '#375d66'));
    target.addEventListener('mouseleave', () => target.setAttribute('material', 'color', '#23424b'));
  }

  function selectXR({ inputSource }) {
    // A-Frame 1.7.1 cursor clicks can fire on both rays for a single trigger press.
    const ray = controllers.get(inputSource.handedness)?.components.raycaster;
    const target = ray?.intersectedEls[0];
    if (target?.classList.contains('clickable')) act(target.dataset.viewAction);
  }

  function showXR(nextSession) {
    session?.removeEventListener('select', selectXR);
    session = nextSession;
    session?.addEventListener('select', selectXR);
    const active = Boolean(session);
    hint.hidden = active;
    controls.hidden = active;
    xr.setAttribute('visible', active);
    for (const target of targets) {
      target.classList.toggle('clickable', active);
      target.setAttribute('material', 'color', '#23424b');
    }
  }

  const currentVRSession = () => scene.is('vr-mode') ? scene.xrSession : undefined;
  scene.addEventListener('enter-vr', () => showXR(currentVRSession()));
  scene.addEventListener('exit-vr', () => showXR());
  showXR(currentVRSession());

  // The fullscreen fallback displays only the canvas and hides the screen controls.
  navigator.xr?.isSessionSupported('immersive-vr').then(supported => {
    if (supported) scene.setAttribute('xr-mode-ui', 'enabled', true);
  }, () => {});

  act('restart');
  document.documentElement.dataset.roomState = 'run';
}
