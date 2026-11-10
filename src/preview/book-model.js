import { BOOK_STAND } from './layout.js';
import { FONT } from '../engine/panel.js';
import { T } from './texts.ru.js';

// Original typographic cover, no publisher artwork. The stage is a provisional
// miniature, not a reproduction of an edition or a physical fire simulation.
export function bookModel(root) {
  const group = new THREE.Group();
  group.name = 'intro-book';
  group.position.set(BOOK_STAND.x, 0, BOOK_STAND.z);
  group.rotation.y = -Math.PI / 2;
  root.add(group);
  const cube = (parent, name, color, x, y, z, w, h, d) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
    mesh.name = name; mesh.position.set(x, y, z); parent.add(mesh);
    return mesh;
  };
  cube(group, 'stand', '#55504a', 0, 1.13, 0, BOOK_STAND.depth, 0.06, BOOK_STAND.width);
  cube(group, 'support', '#393733', 0, 0.56, -0.1, 0.08, 1.12, 0.08);
  cube(group, 'foot', '#393733', 0, 0.025, 0, 0.62, 0.05, 0.42);
  const intact = new THREE.Group(); intact.name = 'book-intact'; group.add(intact);
  cube(intact, 'pages', '#e1d9c8', 0, 1.35, 0, 0.26, 0.36, 0.05);
  cube(intact, 'back', '#263047', 0, 1.35, -0.032, 0.28, 0.38, 0.012);
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 704;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#263047'; ctx.fillRect(0, 0, 512, 704);
  ctx.fillStyle = '#f2ead7'; ctx.textAlign = 'left';
  ctx.font = `600 34px ${FONT}`; ctx.fillText(T.bookAuthor, 34, 74);
  ctx.font = `600 65px ${FONT}`; T.bookTitle.forEach((line, i) => ctx.fillText(line, 34, 270 + i * 82));
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  const cover = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.38),
    new THREE.MeshStandardMaterial({ map, roughness: 0.85 }));
  cover.name = 'book-cover';
  cover.position.set(0, 1.35, 0.032); intact.add(cover);
  const remains = new THREE.Group(); remains.name = 'book-remains'; group.add(remains);
  cube(remains, 'charred-book', '#27211c', 0, 1.18, 0, 0.26, 0.025, 0.32);
  for (let i = 0; i < 5; i++) {
    const scrap = cube(remains, 'ash', '#474039', (i - 2) * 0.045, 1.20,
      (i % 2 ? -1 : 1) * 0.06, 0.045, 0.008, 0.065);
    scrap.rotation.y = i * 0.61;
  }
  return {
    set(outcome, visible) {
      group.visible = visible && !!outcome;
      intact.visible = outcome !== 'burned'; remains.visible = outcome === 'burned';
      group.userData.outcome = outcome ?? 'unknown';
    }
  };
}
