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
// B / Y does ("Back out, cancel", Meta's default mapping). A pause menu stands in the world where the
// player looked when it opened, as a panel in front of them; while it is open the place it covers holds
// (place.hold), and whatever else answers the ray waits (data-menu on the page, read by the doors).
// Its distance is our choice, inside the reach Meta gives panels; letters and buttons keep the reading
// rules of every page in the game at that distance (sheet-math.js: 24 mm at 1 m, buttons 2.5°).
const DIST = 1.2;            // metres in front of the eyes (our choice)
const DROP = 0.12;           // its centre this far under the eyes, where a reading panel sits (our choice)
const W = 0.8, H = 0.6;      // the panel, metres
const DENSITY = pxPerM(DIST);
// the smallest letter at that distance, and the menu's own a size and a half and twice above it, as the
// lab's wall screen reads larger than its minimum (our choice)
const LETTER = letterFrom(0.024, DIST);
const $ = (s) => document.querySelector(s);

export function createMenu(scene) {
  const root = document.createElement('a-entity');
  root.id = 'menu';
  root.setAttribute('visible', false);
  root.innerHTML = `<a-entity class="menu-panel" panel="w: ${W}; h: ${H}; px: ${Math.round(W * DENSITY)}; bg: ${PAPER_BG}"></a-entity>`;
  scene.appendChild(root);
  scene.setAttribute('menu-button', '');
  const choice = createChoice(root, { y: 0, z: 0.006, w: W * 0.75, h: 0.11, gap: 0.03, density: DENSITY });
  let place = null;   // { note, items: [{ label, run }], hold(on) } given by where the player is
  let open = false;
  // the rays answer only the menu while it is open: everything else they could reach (the room's buttons
  // behind the panel, a door) is taken out and given back when it closes
  let waiting = [];

  const toggle = () => (open ? close() : show());
  scene.addEventListener('menu-button', toggle);
  scene.addEventListener('menu-back', () => { if (open) close(); });

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
    const blocks = [{ t: APP_T.menu.title, size: Math.round(LETTER * 2 * DENSITY), weight: 600, color: INK }];
    if (place.note) blocks.push({ t: place.note, size: Math.round(LETTER * 1.5 * DENSITY), color: INK, gap: Math.round(LETTER * DENSITY) });
    const bottom = root.querySelector('.menu-panel').components.panel.write(blocks, { top: true });
    root.setAttribute('visible', true);
    waiting = [...scene.querySelectorAll('.clickable')].filter((el) => !root.contains(el));
    for (const el of waiting) pressable(el, false);
    place.hold?.(true);
    choice.show([APP_T.menu.resume, ...place.items.map((i) => i.label)], (i) => pick(i), H / 2 - bottom - 0.04);
  }

  function close() {
    if (!open) return;
    choice.hide();
    finish();
    place?.hold?.(false);
  }

  function finish() {
    open = false;
    root.setAttribute('visible', false);
    for (const el of waiting) if (el.isConnected) pressable(el, true);
    waiting = [];
    delete document.documentElement.dataset.menu;
  }

  async function pick(i) {
    if (i === 0) { finish(); place?.hold?.(false); return; }
    finish();
    await place.items[i - 1].run();
  }

  // where the player is now: { note, items, hold }; null closes the menu and leaves it shut
  function set(next) {
    if (open) close();
    place = next;
  }

  return { set, isOpen: () => open };
}

