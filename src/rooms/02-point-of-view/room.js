import '../../engine/panel.js';
import '../../engine/recenter.js';
import { eventLog } from '../../engine/log.js';
import { analyse } from './report.js';
import { sceneHTML } from './scene.js';
import { T } from './texts.ru.js';
import { ACTIONS, changeView, projection } from './view.js';

function orientShape(shape) {
  const mesh = shape.getObject3D('mesh');
  // Start face-on so the depth becomes apparent as the object turns.
  const normal = new THREE.Vector3().fromBufferAttribute(mesh.geometry.getAttribute('normal'), 0);
  mesh.quaternion.setFromUnitVectors(normal.normalize(), new THREE.Vector3(0, 0, 1));
  mesh.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color: '#d4fff2' })
  ));
}

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

  for (const action of ACTIONS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.viewAction = action;
    button.textContent = T.actions[action];
    button.addEventListener('click', () => act(action));
    controls.append(button);
  }

  document.body.append(controls);
  return { controls, history };
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
  orientShape(scene.querySelector('#view-shape'));
  const xr = scene.querySelector('#view-xr');
  const xrHistory = xr.querySelector('#view-xr-history').components.panel;
  const targets = [...xr.querySelectorAll('[data-view-action]')];
  const hint = document.getElementById('hint');
  const { controls, history } = screenControls(hint, act);

  function render(report) {
    const { position, rotation, scale } = projection(report.view);
    object.setAttribute('position', position);
    object.setAttribute('rotation', rotation);
    object.setAttribute('scale', scale);

    const last = report.recent[report.recent.length - 1];
    const status = last === 'return' ? T.returned : last ? '' : T.initial;
    const recent = report.recent.map(action => T.steps[action]).join(' → ');
    const lines = [status, T.history(report.count), recent].filter(Boolean);
    history.textContent = lines.join(' · ');
    xrHistory.write(lines.map(t => ({ t, size: 48, weight: 600, gap: 8 })));
  }

  function act(action) {
    const view = changeView(analyse(eventLog.entries).view, action);
    eventLog.add(action, view);
    render(analyse(eventLog.entries));
  }

  for (const target of targets) {
    const { viewAction } = target.dataset;
    target.querySelector('[panel]').components.panel.write([{ t: T.actions[viewAction], size: 42, weight: 700 }]);
    target.addEventListener('click', () => { if (scene.is('vr-mode')) act(viewAction); });
    target.addEventListener('mouseenter', () => target.setAttribute('material', 'color', '#375d66'));
    target.addEventListener('mouseleave', () => target.setAttribute('material', 'color', '#23424b'));
  }

  function showXR(active) {
    hint.hidden = active;
    controls.hidden = active;
    xr.setAttribute('visible', active);
    for (const target of targets) {
      target.classList.toggle('clickable', active);
      target.setAttribute('material', 'color', '#23424b');
    }
  }

  scene.addEventListener('enter-vr', () => showXR(scene.is('vr-mode')));
  scene.addEventListener('exit-vr', () => showXR(false));
  showXR(scene.is('vr-mode'));

  eventLog.reset();
  eventLog.begin();
  render(analyse(eventLog.entries));
  document.documentElement.dataset.roomState = 'run';
}
