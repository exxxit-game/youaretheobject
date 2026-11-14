import { T } from './texts.ru.js';

const arrows = { forward: '↑', left: '←', back: '↓', right: '→' };
const lookSensitivity = 0.005;

export function mountTouchControls(canvas, pad, turn) {
  if (!navigator.maxTouchPoints || !window.PointerEvent) return;
  let move = null;
  let look = null;

  function clear() {
    const held = [move, look];
    move = null;
    look = null;
    for (const pointer of held) {
      if (pointer?.target.hasPointerCapture(pointer.id)) pointer.target.releasePointerCapture(pointer.id);
    }
  }

  function begin(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    return { id: event.pointerId, target: event.currentTarget, x: event.clientX, y: event.clientY };
  }

  function release(event) {
    if (move?.id === event.pointerId && move.target === event.currentTarget) move = null;
    if (look?.id === event.pointerId && look.target === event.currentTarget) look = null;
  }

  function watchRelease(element) {
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) element.addEventListener(type, release);
  }

  pad.setAttribute('aria-label', T.touchWalk);
  for (const [direction, arrow] of Object.entries(arrows)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.tabIndex = -1;
    button.dataset.direction = direction;
    button.textContent = arrow;
    button.setAttribute('aria-label', T.touchDirections[direction]);
    button.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && !move) move = { ...begin(event), direction };
    });
    watchRelease(button);
    pad.append(button);
  }

  canvas.classList.add('preview-touch-canvas');
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || look) return;
    const rect = canvas.getBoundingClientRect();
    if (event.clientX >= rect.left + rect.width / 2) look = begin(event);
  });
  canvas.addEventListener('pointermove', event => {
    if (look?.id !== event.pointerId) return;
    const dx = event.clientX - look.x;
    const dy = event.clientY - look.y;
    look.x = event.clientX;
    look.y = event.clientY;
    turn(-dx * lookSensitivity, -dy * lookSensitivity);
  });
  watchRelease(canvas);
  pad.hidden = false;

  return { clear, get direction() { return move?.direction; } };
}
