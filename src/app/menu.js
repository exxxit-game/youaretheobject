import '../engine/menu-button.js';
import '../engine/panel.js';
import { createChoice } from '../engine/ui/choice.js';
import { PAPER_BG, INK, pxPerM, letterFrom } from '../engine/ui/sheet-math.js';
import { pressable } from '../engine/laser-beam.js';
import { APP_T } from './texts.ru.js';

// The game's menu, opened and closed by the left controller's Menu button (≡) or Escape on a computer
// (src/engine/menu-button.js), as Meta asks of an app's own menu ("Bring up or dismiss a pause or in-app
// menu", developers.meta.com/horizon/design/controllers/). One menu for the whole game: where the player
// is says what it holds (lab.js sets it: the corridor, a room), and later items (settings) join the same
// list, so nothing is rebuilt for them. "Continue" stands first and is what the Menu button again or
// B / Y does ("Back out, cancel", Meta's default mapping). An item that cannot be undone asks once more,
// as the corridor's poster does (exit.js: the act first, staying second) and as a confirmation before an
// action that cannot be undone is usually asked, its answers saying what happens
// (nngroup.com/articles/confirmation-dialog/); the second press of a hurried double press lands on staying.
// A pause menu stands in the world where the player looked when it opened, as a panel in front of them. It
// is drawn as the world is, so the laser and the controllers stay in front of it; nothing may stand between
// it and the eyes either (a menu drawn over a nearer thing gives the eyes two depths at once: Meta,
// developers.meta.com/horizon/design/display/), so when a wall or the room's stand is nearer than its
// distance it comes closer, scaled down with the distance so it looks the same size and its letters keep
// their angle. While it is open the place holds (place.hold) and nothing else answers the rays.
// Its distance is our choice, inside the reach Meta gives panels; letters and buttons keep the reading
// rules of every page in the game at that distance (sheet-math.js: 24 mm at 1 m, buttons 2.5°).
const DIST = 1.2;            // metres in front of the eyes (our choice)
const DROP = 0.12;           // its centre this far under the eyes, where a reading panel sits (our choice)
const W = 0.8, H = 0.6;      // the panel, metres
const DENSITY = pxPerM(DIST);
// the smallest letter at that distance; the menu's own text a size and a half and twice above it, as the
// lab's wall screen reads larger than its minimum (our choice)
const LETTER = letterFrom(0.024, DIST);
const NEAREST = 0.45;        // the closest it comes (our choice: a page held at reading distance)
const CLEAR = 0.08;          // how far it stays in front of what would stand nearer (our choice)

// How far the panel can stand along the view before something drawn is nearer: rays from the eyes to its
// middle and four corners at DIST, against everything shown but the player and the menu itself
const ray = new THREE.Raycaster();
function freeDistance(scene, head, dirs, skip) {
  const shown = (o) => { for (let p = o; p; p = p.parent) { if (!p.visible || skip.includes(p)) return false; } return true; };
  let d = DIST;
  for (const dir of dirs) {
    const len = dir.length();
    ray.set(head, dir.clone().normalize());
    ray.far = len;
    const hit = ray.intersectObjects(scene.object3D.children, true).find((h) => h.object.isMesh && shown(h.object));
    // the corner on this ray stands at len scaled with the panel: it must stay CLEAR in front of the hit
    if (hit) d = Math.min(d, DIST * (hit.distance - CLEAR) / len);
  }
  return Math.max(NEAREST, Math.min(DIST, d));
}

export function createMenu(scene) {
  const root = document.createElement('a-entity');
  root.id = 'menu';
  root.setAttribute('visible', false);
  root.innerHTML = `<a-entity class="menu-panel" panel="w: ${W}; h: ${H}; px: ${Math.round(W * DENSITY)}; bg: ${PAPER_BG}"></a-entity>`;
  scene.appendChild(root);
  scene.setAttribute('menu-button', '');
  const panelEl = root.querySelector('.menu-panel');
  const choice = createChoice(root, { y: 0, z: 0.006, w: W * 0.75, h: 0.11, gap: 0.03, density: DENSITY });
  // { items: [{ label, confirm: { ask, yes, no }, run }] or a function giving them now, hold(on) }: where the player is
  let place = null;
  let open = false;
  let waiting = [];   // what the rays could reach before the menu opened, given back when it closes

  scene.addEventListener('menu-button', () => (open ? close() : show()));
  scene.addEventListener('menu-back', () => { if (open) close(); });

  function page(blocks, labels, onPick) {
    const sizes = [Math.round(LETTER * 2 * DENSITY), Math.round(LETTER * 1.5 * DENSITY)];
    const bottom = panelEl.components.panel.write(blocks.map((t, i) => ({ t, size: sizes[i ? 1 : 0], weight: i ? 400 : 600, color: INK,
      gap: Math.round(LETTER * DENSITY) })), { top: true });
    choice.show(labels, onPick, H / 2 - bottom - 0.04);
  }

  function show() {
    if (!place) return;   // between places (a door's passage) there is nothing to offer
    open = true;
    document.documentElement.dataset.menu = '1';
    // in front of the eyes, level, facing them, where they looked
    const head = new THREE.Vector3(), q = new THREE.Quaternion();
    scene.camera.getWorldPosition(head);
    scene.camera.getWorldQuaternion(q);
    const yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y;
    const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)), right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const at = (x, y) => fwd.clone().multiplyScalar(DIST).addScaledVector(right, x).add(new THREE.Vector3(0, y - DROP, 0));
    const skip = [root.object3D, document.querySelector('#rig')?.object3D].filter(Boolean);
    const d = freeDistance(scene, head, [at(0, 0), at(-W / 2, H / 2), at(W / 2, H / 2), at(-W / 2, -H / 2), at(W / 2, -H / 2)], skip);
    const k = d / DIST;
    root.object3D.position.set(head.x + fwd.x * d, head.y - DROP * k, head.z + fwd.z * d);
    root.object3D.rotation.set(0, yaw, 0);
    root.object3D.scale.setScalar(k);
    root.setAttribute('visible', true);
    waiting = [...scene.querySelectorAll('.clickable')].filter((el) => !root.contains(el));
    for (const el of waiting) pressable(el, false);
    place.hold?.(true);
    const items = typeof place.items === 'function' ? place.items() : place.items;
    page([APP_T.menu.title], [APP_T.menu.resume, ...items.map((i) => i.label)], (i) => (i ? choose(items[i - 1]) : close()));
  }

  // an item that asks first: its own yes, then staying (confirm.no)
  function choose(item) {
    if (!item.confirm) return run(item);
    page([APP_T.menu.title, item.confirm.ask], [item.confirm.yes, item.confirm.no], (i) => (i ? close() : run(item)));
  }

  // the menu shuts and the place goes on as it was
  function close() {
    if (!open) return;
    choice.hide();
    shut();
    for (const el of waiting) if (el.isConnected) pressable(el, true);
    waiting = [];
    place?.hold?.(false);
  }

  // an item runs: what waited behind the menu is not given back, the item decides what comes next (a room
  // left is reset, the game ended), so nothing answers in between
  async function run(item) {
    shut();
    waiting = [];
    await item.run();
  }

  function shut() {
    open = false;
    root.setAttribute('visible', false);
    delete document.documentElement.dataset.menu;
  }

  // where the player is now; null leaves the menu shut until the next place
  function set(next) {
    if (open) close();
    place = next;
  }

  return { set, isOpen: () => open };
}
