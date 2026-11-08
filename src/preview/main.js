import { FONT } from '../engine/panel.js';
import { ANCHORS, PLAN, floorNumber, recenter, walk } from './route.js';
import { T } from './texts.ru.js';
import { buildWorld } from './world.js';

const STEP_SPEED = 1.5;
const TURN_SPEED = 1.65;
const TILT_SPEED = 1.15;
const PITCH_LIMIT = Math.PI * 0.47;
const CONTROL_KEYS = new Set([
  'KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'KeyR', 'KeyF', 'PageUp', 'PageDown'
]);
const scene = document.querySelector('a-scene');
const camera = document.querySelector('#preview-camera');
const hint = document.querySelector('#preview-hint');
const buttons = document.querySelector('#preview-views');
const eye = document.querySelector('#preview-eye');
const eyeValue = document.querySelector('#preview-eye-value');
const pressed = new Set();
let position = ANCHORS.start;
let eyeHeight = Number(eye.value);

document.title = T.title;
document.querySelector('#preview-title').textContent = T.title;
hint.textContent = T.loading;

function moveCamera() {
  camera.object3D.position.set(position.x, position.y + eyeHeight, position.z);
}

function place(anchor) {
  pressed.clear();
  position = recenter({ ...anchor, floor: anchor === ANCHORS.start ? 0 : position.floor ?? 0 });
  const yaw = THREE.MathUtils.degToRad(anchor.yaw);
  const pitch = THREE.MathUtils.degToRad(anchor.pitch);
  const look = camera.components['look-controls'];
  look.yawObject.rotation.y = yaw;
  look.pitchObject.rotation.x = pitch;
  camera.object3D.rotation.set(pitch, yaw, 0, 'YXZ');
  moveCamera();
  drawSigns();
}

function drawSigns() {
  const signs = document.querySelectorAll('[data-floor-offset]');
  signs.forEach(sign => {
    const offset = Number(sign.dataset.floorOffset);
    sign.object3D.position.set(-0.5, offset * PLAN.floorRise + 1.66, 0.055);
    const number = floorNumber((position.floor ?? 0) + offset, location.search);
    const panel = sign.components.panel;
    panel.ctx.font = `600 178px ${FONT}`;
    const size = Math.min(178, 178 * panel.c.width * 0.88 / panel.ctx.measureText(number).width);
    panel.write([{ t: number, size, weight: 600, color: '#2c2722' }]);
  });
}

function animate() {
  let last = performance.now();
  const look = camera.components['look-controls'];
  const held = (key, arrow) => Number(pressed.has(key) || pressed.has(arrow));
  function frame(now) {
    const seconds = Math.min((now - last) / 1000, 0.05);
    last = now;
    const turn = held('ArrowLeft') - held('ArrowRight');
    const tilt = held('KeyR', 'PageUp') - held('KeyF', 'PageDown');
    if (turn || tilt) {
      look.yawObject.rotation.y += turn * seconds * TURN_SPEED;
      if (tilt) {
        const pitch = look.pitchObject.rotation;
        pitch.x = THREE.MathUtils.clamp(pitch.x + tilt * seconds * TILT_SPEED, -PITCH_LIMIT, PITCH_LIMIT);
      }
      look.updateOrientation();
    }
    const front = held('KeyW', 'ArrowUp') - held('KeyS', 'ArrowDown');
    const right = held('KeyD') - held('KeyA');
    if (front || right) {
      const yaw = camera.object3D.rotation.y;
      const distance = seconds * STEP_SPEED / Math.hypot(front, right);
      const dx = (right * Math.cos(yaw) - front * Math.sin(yaw)) * distance;
      const dz = (-right * Math.sin(yaw) - front * Math.cos(yaw)) * distance;
      const previousFloor = position.floor;
      position = walk(position, dx, dz);
      if (position.floor !== previousFloor) drawSigns();
      moveCamera();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function controlKey(event) {
  if (CONTROL_KEYS.has(event.code)) return event.code;
  return event.key.length === 1 ? `Key${event.key.toUpperCase()}` : event.key;
}

function start() {
  buildWorld(document.querySelector('#preview-world').object3D);
  place(ANCHORS.start);
  for (const [id, anchor] of Object.entries(ANCHORS)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = T.views[id];
    button.addEventListener('click', () => place(anchor));
    buttons.append(button);
  }
  document.querySelector('#preview-eye-label').textContent = T.eyeLabel;
  function changeHeight() {
    eyeHeight = Number(eye.value);
    eyeValue.value = T.eyeValue(eyeHeight);
    eye.setAttribute('aria-valuetext', eyeValue.value);
    moveCamera();
  }
  eye.addEventListener('input', changeHeight);
  eye.addEventListener('focus', () => pressed.clear());
  changeHeight();
  addEventListener('keydown', event => {
    if (event.target === eye) return;
    const key = controlKey(event);
    if (!CONTROL_KEYS.has(key) || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    pressed.add(key);
  });
  addEventListener('keyup', event => pressed.delete(controlKey(event)));
  addEventListener('blur', () => pressed.clear());
  document.addEventListener('visibilitychange', () => pressed.clear());
  hint.textContent = T.instruction;
  animate();
}

async function ready() {
  try {
    // Match the main entry point: draw the numbered plates in the vendored font.
    const font = document.fonts.load('600 16px Inter', '0123456789-').catch(() => []);
    await Promise.race([font, new Promise(resolve => setTimeout(resolve, 6000))]);
    start();
  } catch (error) {
    hint.textContent = T.unavailable;
    console.error(error);
  }
}

if (scene.hasLoaded) ready();
else scene.addEventListener('loaded', ready, { once: true });
