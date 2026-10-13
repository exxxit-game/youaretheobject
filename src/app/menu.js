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
// B / Y does ("Back out, cancel", Meta's default mapping).
// While it is open the world goes dark around it, as Meta's theater mode darkens the surroundings of a
// panel (developers.meta.com/horizon/design/panels/): the corridor, the room (its widgets too) and the clipboard are
// not drawn (their lights stay, since a hidden light rebuilds every lit material), so no wall, stand or
// page can stand between it and the eyes, and it stands where Meta puts menus, 1 m away ("1 meter is a
// comfortable distance for menus", developers.meta.com/horizon/design/display/). The laser and the
// controllers stay drawn in front of it. While it is open the rays answer the menu alone (their target list is
// the menu's own, whatever the place turns on meanwhile), and the panel takes them, so nothing behind it answers.
// An item that cannot be undone asks once more, as the corridor's poster does (exit.js: the act first,
// staying second), its answers saying what happens (nngroup.com/articles/confirmation-dialog/); its
// buttons come a second later, so a hurried second press meets nothing (the delay browsers give a security
// prompt's buttons: Firefox, security.dialog_enable_delay, 1000 ms, bugzilla.mozilla.org/show_bug.cgi?id=916726).
const DIST = 1.0;            // metres in front of the eyes
const DROP = 0.1;            // its centre this far under the eyes, where a reading panel sits (our choice)
const W = 0.8, H = 0.7;      // the panel, metres
const DENSITY = pxPerM(DIST);
// the smallest letter at that distance; the menu's own text a size and a half and twice above it, as the
// lab's wall screen reads larger than its minimum (our choice)
const LETTER = letterFrom(0.024, DIST);
const CONFIRM_MS = 1000;
// what is not drawn while the menu is open: the corridor, its doors, the clipboard, everything of the room but its lights
const DARK = '#corridor, #doorway, .sheet, #roomPlace > :not([light])';
const RAYS = '.clickable', MENU_RAYS = '#menu .clickable';

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
  let darkened = [];  // what was drawn before the menu opened, drawn again when it closes
  let pending = 0;    // a confirmation's buttons on their way: a newer page or closing cancels them

  scene.addEventListener('menu-button', () => (open ? close() : show()));
  scene.addEventListener('menu-back', () => { if (open) close(); });

  function page(blocks, labels, onPick, later = 0) {
    choice.hide();
    const sizes = [Math.round(LETTER * 2 * DENSITY), Math.round(LETTER * 1.5 * DENSITY)];
    const bottom = panelEl.components.panel.write(blocks.map((t, i) => ({ t, size: sizes[i ? 1 : 0], weight: i ? 400 : 600, color: INK,
      gap: Math.round(LETTER * DENSITY) })), { top: true });
    const n = ++pending;
    setTimeout(() => { if (open && n === pending) choice.show(labels, onPick, H / 2 - bottom - 0.04); }, later);
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
    root.object3D.position.set(head.x - Math.sin(yaw) * DIST, head.y - DROP, head.z - Math.cos(yaw) * DIST);
    root.object3D.rotation.set(0, yaw, 0);
    darkened = [...document.querySelectorAll(DARK)].filter((el) => el.object3D.visible);
    for (const el of darkened) el.object3D.visible = false;
    rays(MENU_RAYS);
    pressable(panelEl, true);
    root.setAttribute('visible', true);
    place.hold?.(true);
    const items = typeof place.items === 'function' ? place.items() : place.items;
    page([APP_T.menu.title], [APP_T.menu.resume, ...items.map((i) => i.label)], (i) => (i ? choose(items[i - 1]) : close()));
  }

  // an item that asks first: its own yes, then staying (confirm.no), a second later
  function choose(item) {
    if (!item.confirm) return run(item);
    page([APP_T.menu.title, item.confirm.ask], [item.confirm.yes, item.confirm.no], (i) => (i ? close() : run(item)), CONFIRM_MS);
  }

  // the menu shuts and the place goes on as it was
  function close() {
    if (!open) return;
    shut();
    for (const el of darkened) el.object3D.visible = true;
    darkened = [];
    place?.hold?.(false);
  }

  // an item runs: it takes the world as the menu left it, dark, and the place it goes to shows what it needs
  // (a room left: the corridor's way back, lobby.js; the game ended)
  async function run(item) {
    shut();
    darkened = [];
    await item.run();
  }

  // every ray of the scene (the controllers' lasers, the mouse's cursor) aims at these targets
  function rays(objects) {
    for (const el of [scene, ...scene.querySelectorAll('[raycaster]')]) if (el.components.raycaster) el.setAttribute('raycaster', 'objects', objects);
  }

  function shut() {
    open = false;
    pending++;
    choice.hide();
    pressable(panelEl, false);
    rays(RAYS);
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
