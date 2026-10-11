import { readStick, arc, inside, snapTurn, teleport, backStep, slide, smoothTurnDeg, vignetteLevel, MOVE, VIGNETTE } from './locomotion-math.js';
import { createVignette } from './vignette.js';

// Moving with the thumbsticks in VR, the way Meta's locomotion guidance sets as the default: a
// stick pushed forward shows an arc to the floor, letting it go moves the player there, a click on
// the stick cancels; a stick to the side turns them by 45° at once; a quick pull back steps them back.
// Only the walkable area is a target, so walls are never crossed. The player may choose smooth
// moving instead (move: smooth: the left stick walks, the right one turns) and smooth turning
// (turn: smooth); while they move smoothly a vignette narrows the view. The arithmetic is in
// locomotion-math.js. Put on the camera rig; the hands are its laser-controls children. After a
// move the rig emits 'player-moved' (a clipboard in front of the player follows) and recenter
// keeps the new place.
// <a-entity id="rig" locomotion="minX: -3.1; maxX: 2.7; minZ: 2.1; maxZ: 3.35; move: teleport; turn: snap">
const CANCELLED = '#8a8a8a';   // an arc that lands nowhere
// A frame longer than this (the session was hidden, a stall) moves smoothly no further than this
// would: a jump is what smooth moving is chosen to avoid. Our choice: about three frames at 72 Hz.
const MAX_STEP_MS = 40;

AFRAME.registerComponent('locomotion', {
  schema: {
    minX: { default: -1 }, maxX: { default: 1 },
    minZ: { default: -1 }, maxZ: { default: 1 },
    color: { default: '#f0c96a' },  // the pointing rays' colour
    move: { default: 'teleport', oneOf: ['teleport', 'smooth'] },
    turn: { default: 'snap', oneOf: ['snap', 'smooth'] },
    vignette: { default: true }
  },

  init() {
    this.sticks = new Map();
    this.aimHand = null;
    this.target = null;
    this.slideStick = [0, 0];
    this.turnX = 0;
    this.moving = false;
    this.vignetteLevel = 0;
    this.vignette = createVignette(this.el.sceneEl.camera, VIGNETTE.minFovDeg);
    this.onStick = this.onStick.bind(this);
    this.onPress = this.onPress.bind(this);
    this.hands = [...this.el.querySelectorAll('[laser-controls]')];
    for (const h of this.hands) {
      h.addEventListener('thumbstickmoved', this.onStick);
      h.addEventListener('thumbstickdown', this.onPress);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 64), 3));
    this.line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: this.data.color }));
    this.line.frustumCulled = false;
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.2, 40).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: this.data.color }));
    this.ring.position.y = 0.005;   // just above the floor tiles
    this.line.visible = this.ring.visible = false;
    this.line.userData.player = this.ring.userData.player = true;   // never in a picture taken once (reflect-env.js)
    this.el.sceneEl.object3D.add(this.line, this.ring);
    // leaving VR (or taking the headset off) drops an aim and any held stick, so nothing stale
    // moves the player on return, and a smooth move then does not end with the desktop pose
    this.onExit = () => { this.stopAim(this.aimHand); this.slideStick = [0, 0]; this.turnX = 0; this.moving = false; };
    this.el.sceneEl.addEventListener('exit-vr', this.onExit);
    this.p = new THREE.Vector3();
    this.d = new THREE.Vector3();
    this.q = new THREE.Quaternion();
    this.e = new THREE.Euler();   // reused: the yaw is read every frame while sliding, and garbage costs frames on Quest 2
  },

  remove() {
    for (const h of this.hands) {
      h.removeEventListener('thumbstickmoved', this.onStick);
      h.removeEventListener('thumbstickdown', this.onPress);
    }
    this.el.sceneEl.removeEventListener('exit-vr', this.onExit);
    this.el.sceneEl.object3D.remove(this.line, this.ring);
    for (const o of [this.line, this.ring]) { o.geometry.dispose(); o.material.dispose(); }
    this.vignette.dispose();
  },

  onStick(e) {
    const hand = e.currentTarget, { x, y } = e.detail;
    // smooth moving: the left stick walks (Meta's controller map), read every frame in tick
    if (this.data.move === 'smooth' && hand.components['laser-controls'].data.hand === 'left') { this.slideStick = [x, y]; return; }
    if (this.data.turn === 'smooth' && hand !== this.aimHand) this.turnX = x;
    const { state, action } = readStick(this.sticks.get(hand), x, y);
    this.sticks.set(hand, state);
    if (!action || !this.el.sceneEl.is('vr-mode')) return;
    const teleports = this.data.move === 'teleport';
    if (action === 'aim') { if (teleports) this.aimHand = hand; return; }
    if (action === 'release') {
      if (hand === this.aimHand && this.target) this.go(teleport(this.rig(), this.head(), this.target));
      this.stopAim(hand);
      return;
    }
    if (this.aimHand) return;
    if (action === 'back') { if (teleports) this.go(teleport(this.rig(), this.head(), backStep(this.head(), this.headYaw(), this.data))); return; }
    if (this.data.turn === 'snap') this.go(snapTurn(this.rig(), this.head(), action === 'turn-left' ? MOVE.snapDeg : -MOVE.snapDeg));
  },

  // a click on the aiming stick cancels the teleport
  onPress(e) { this.stopAim(e.currentTarget); },

  stopAim(hand) {
    if (hand !== this.aimHand) return;
    this.aimHand = null;
    this.target = null;
    this.line.visible = this.ring.visible = false;
  },

  tick(t, dt) {
    if (this.aimHand) this.drawArc();
    let speed = 0, rate = 0;
    if (dt && this.el.sceneEl.is('vr-mode')) {
      const s = Math.min(dt, MAX_STEP_MS) / 1000;
      if (this.data.move === 'smooth') {
        const head = this.head(), to = slide(head, this.headYaw(), this.slideStick[0], this.slideStick[1], s, this.data);
        if (to) { speed = Math.hypot(to[0] - head[0], to[1] - head[1]) / s; this.place(teleport(this.rig(), head, to)); }
      }
      const deg = this.data.turn === 'smooth' && !this.aimHand ? smoothTurnDeg(this.turnX, s) : 0;
      if (deg) { rate = deg / s; this.place(snapTurn(this.rig(), this.head(), deg)); }
    }
    const moving = speed > 0 || rate !== 0;
    if (this.moving && !moving) this.settle();
    this.moving = moving;
    // the vignette eases in and out (about a tenth of a second) instead of snapping
    const target = this.data.vignette ? vignetteLevel(speed, rate) : 0;
    this.vignetteLevel += (target - this.vignetteLevel) * (1 - Math.exp(-10 * (dt || 0) / 1000));
    this.vignette.set(this.vignetteLevel);
  },

  // the arc leaves the hand along its pointing ray, as the laser does
  drawArc() {
    const hand = this.aimHand.object3D, ray = this.aimHand.components.raycaster;
    hand.updateMatrixWorld();
    this.p.copy(ray ? ray.data.origin : { x: 0, y: 0, z: 0 }).applyMatrix4(hand.matrixWorld);
    this.d.copy(ray ? ray.data.direction : { x: 0, y: 0, z: -1 }).applyQuaternion(hand.getWorldQuaternion(this.q)).normalize();
    const { points, hit } = arc(this.p.toArray(), this.d.toArray());
    const pos = this.line.geometry.attributes.position, n = Math.min(points.length, pos.count);
    for (let i = 0; i < n; i++) pos.setXYZ(i, ...points[i]);
    pos.needsUpdate = true;
    this.line.geometry.setDrawRange(0, n);
    this.target = hit && inside(hit[0], hit[2], this.data) ? [hit[0], hit[2]] : null;
    this.line.material.color.set(this.target ? this.data.color : CANCELLED);
    this.line.visible = true;
    this.ring.visible = !!this.target;
    if (this.target) this.ring.position.set(this.target[0], this.ring.position.y, this.target[1]);
  },

  rig() {
    const o = this.el.object3D;
    return { x: o.position.x, z: o.position.z, yaw: o.rotation.y };
  },

  head() {
    this.el.sceneEl.camera.getWorldPosition(this.p);
    return [this.p.x, this.p.z];
  },

  headYaw() {
    this.el.sceneEl.camera.getWorldQuaternion(this.q);
    return this.e.setFromQuaternion(this.q, 'YXZ').y;
  },

  // a move in one step (teleport, snap turn, back step)
  go(r) {
    this.place(r);
    this.settle();
  },

  place(r) {
    const o = this.el.object3D;
    o.position.x = r.x;
    o.position.z = r.z;
    o.rotation.y = r.yaw;
    o.updateMatrixWorld(true);
  },

  // after a move ends: a later recenter (the player sits down or stands up) keeps them here, facing this way
  settle() {
    const [x, z] = this.head();
    if (this.el.components.recenter) this.el.setAttribute('recenter', { x, z, yaw: THREE.MathUtils.radToDeg(this.headYaw()) });
    this.el.emit('player-moved');
  }
});
