import '../engine/panel.js';
import { ANCHORS, PLAN, floorNumber, recenter, viewHeight, walk } from './route.js';
import { T } from './texts.ru.js';
import { buildWorld } from './world.js';
import { ROOM, nearDoor, inRoom, beginVisit, returnVisit } from './layout.js';
import { doorHTML } from '../engine/door.js';
import { extinguisher } from '../app/lobby/extinguisher.js';
import { paintExtinguisherLabel, paintGauge } from '../app/lobby/extinguisher-label.js';
import '../engine/shapes.js';
import '../engine/cable.js';
import '../engine/decal.js';
import '../engine/merge-static.js';
import '../engine/reflect-env.js';

const STEP_SPEED = 1.5;
const TURN_SPEED = 1.65;
const TILT_SPEED = 1.15;
const PITCH_LIMIT = Math.PI * 0.47;
const CONTROL_KEYS = new Set([
  'KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'KeyR', 'KeyF', 'PageUp', 'PageDown', 'KeyE'
]);
const scene = document.querySelector('a-scene');
const camera = document.querySelector('#preview-camera');
const hint = document.querySelector('#preview-hint');
const buttons = document.querySelector('#preview-views');
const eye = document.querySelector('#preview-eye');
const eyeValue = document.querySelector('#preview-eye-value');
const doorButton = document.querySelector('#preview-door-action');
const pressed = new Set();
let position = ANCHORS.start;
let eyeHeight = Number(eye.value);
let visit = null, leaf;

hint.textContent = T.loading;

function moveCamera() {
  camera.object3D.position.set(position.x, viewHeight(position) + eyeHeight, position.z);
}

function applyPose(anchor) {
  pressed.clear();
  const look = camera.components['look-controls'];
  look.yawObject.rotation.y = anchor.yaw;
  look.pitchObject.rotation.x = anchor.pitch;
  camera.object3D.rotation.set(anchor.pitch, anchor.yaw, 0, 'YXZ');
  moveCamera();
  drawSigns();
}

function place(anchor) {
  visit = null;
  position = recenter({ ...anchor, floor: anchor === ANCHORS.start ? 0 : position.floor ?? 0 });
  applyPose({ yaw: THREE.MathUtils.degToRad(anchor.yaw), pitch: THREE.MathUtils.degToRad(anchor.pitch) });
}

function useDoor() {
  if (visit) {
    const restored = returnVisit(visit);
    visit = null;
    position = restored.position;
    applyPose(restored);
  } else {
    visit = beginVisit(position, camera.object3D.rotation.y, camera.object3D.rotation.x);
    pressed.clear();
  }
  updateDoor();
}

function updateDoor() {
  const angle = visit ? Math.PI / 2 : 0;
  const hidden = !visit && !nearDoor(position);
  const label = visit ? T.returnDoor : T.openDoor;
  const text = visit ? (inRoom(position) ? T.room : T.doorOpen) : T.instruction;
  if (leaf.object3D.rotation.y !== angle) leaf.object3D.rotation.y = angle;
  if (doorButton.hidden !== hidden) doorButton.hidden = hidden;
  if (doorButton.textContent !== label) doorButton.textContent = label;
  if (hint.textContent !== text) hint.textContent = text;
}

function drawSigns() {
  const signs = document.querySelectorAll('[data-floor-offset]');
  signs.forEach(sign => {
    const offset = Number(sign.dataset.floorOffset);
    const x = (PLAN.left.minX + PLAN.right.maxX) / 2;
    sign.object3D.position.set(x, offset * PLAN.floorRise + 1.66, PLAN.hall.maxZ - 0.055);
    sign.object3D.rotation.y = Math.PI;
    const number = floorNumber((position.floor ?? 0) + offset, location.search);
    sign.dataset.number = number;
    const panel = sign.components.panel;
    panel.write([
      { t: document.title, size: 106, weight: 700 },
      { t: T.floorLabel(number), size: 68, weight: 600, gap: 16 }
    ]);
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
      position = walk(position, dx, dz, !!visit);
      if (position.floor !== previousFloor) { visit = null; drawSigns(); }
      moveCamera();
    }
    updateDoor();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function controlKey(event) {
  if (CONTROL_KEYS.has(event.code)) return event.code;
  return event.key.length === 1 ? `Key${event.key.toUpperCase()}` : event.key;
}

function mountExtinguisher(world, height) {
  const holder = document.createElement('template');
  const { x, wall } = PLAN.extinguisher;
  holder.innerHTML = extinguisher(x, wall);
  const model = holder.content.firstElementChild;
  const label = model.querySelector('#extLabel'), gauge = model.querySelector('#extGauge');
  label.removeAttribute('id');
  gauge.removeAttribute('id');
  label.dataset.part = 'extinguisher-label';
  gauge.dataset.part = 'extinguisher-gauge';
  model.setAttribute('position', `0 ${height} 0`);
  // Limit the initial reflection work for three copies of the static shell.
  model.setAttribute('reflect-env', 'size: 64; times: 1');
  model.addEventListener('loaded', () => {
    paintExtinguisherLabel(label);
    paintGauge(gauge);
  }, { once: true });
  world.append(model);
}

function start() {
  const world = document.querySelector('#preview-world');
  buildWorld(world.object3D);
  for (const offset of [-1, 0, 1]) {
    const frame = document.createElement('a-entity');
    frame.id = `preview-door-frame-${offset}`;
    frame.setAttribute('position', `0 ${offset * PLAN.floorRise} 0`);
    frame.setAttribute('merge-static', '');
    frame.innerHTML = doorHTML({ x: ROOM.doorX, room: ROOM.minZ + 0.1, corridor: ROOM.minZ - 0.1,
      leaf: `id="preview-door-leaf-${offset}" data-dynamic`, inside: true });
    world.append(frame);
    mountExtinguisher(world, offset * PLAN.floorRise);
  }
  leaf = document.querySelector('#preview-door-leaf-0');
  place(ANCHORS.start);
  doorButton.addEventListener('click', useDoor);
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
    if (event.key === 'Escape' && visit) { event.preventDefault(); useDoor(); return; }
    if (event.target === eye) return;
    const key = controlKey(event);
    if (key === 'KeyE' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!event.repeat && (visit || nearDoor(position))) useDoor();
      return;
    }
    if (!CONTROL_KEYS.has(key) || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    if (!event.repeat) pressed.add(key);
  });
  addEventListener('keyup', event => pressed.delete(controlKey(event)));
  addEventListener('blur', () => pressed.clear());
  document.addEventListener('visibilitychange', () => pressed.clear());
  hint.textContent = T.instruction;
  animate();
}

async function ready() {
  try {
    // Load the Latin title and Cyrillic wall lettering before drawing their textures.
    const font = Promise.all([
      document.fonts.load('700 16px Inter', `${document.title} ${T.floorLabel('0123456789-')}`),
      document.fonts.load('600 16px Inter', T.floorLabel('0123456789-')),
      document.fonts.load('500 16px Inter', T.floorLabel('0123456789-'))
    ]).catch(() => []);
    await Promise.race([font, new Promise(resolve => setTimeout(resolve, 6000))]);
    start();
  } catch (error) {
    hint.textContent = T.unavailable;
    console.error(error);
  }
}

if (scene.hasLoaded) ready();
else scene.addEventListener('loaded', ready, { once: true });
