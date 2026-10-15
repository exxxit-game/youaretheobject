// The arithmetic of moving with the thumbsticks (src/engine/locomotion.js), pure so it is tested
// in node (tests/locomotion.test.mjs). Values follow Meta's locomotion guidance (docs/decisions.md):
// teleport and snap turn by default, snap 45° (design/locomotion-user-preferences), a quick pull back
// steps back 80 cm (design/locomotion-input-maps). A stick fires past 0.8, the turn threshold of
// Meta's Immersive Web SDK (packages/core/src/locomotion); re-arming under 0.5 is our choice, a
// margin so a stick held near the threshold does not fire twice. Angles in radians, three.js yaw:
// 0 looks along -Z, positive turns to the left.

export const STICK = { fire: 0.8, rearm: 0.5 };
export const MOVE = { snapDeg: 45, backStep: 0.8 };
// The teleport arc: a thrown point (metres, seconds). At 45° from the hand it reaches about 4.5 m,
// most of the corridor; aimed higher than about 60° it is still in the air when the time runs out
// and offers no target, as teleport arcs do.
export const ARC = { speed: 6, gravity: 9.8, step: 0.025, maxT: 1.2 };

// One stick: given its last state and its position (x right, y down, -1..1), what it asks for:
// 'turn-left' | 'turn-right' | 'aim' (forward: show the arc) | 'release' (let go: go there) |
// 'back' | null. Each push fires once and must come back before it fires again; a diagonal push
// does what its larger part says, never both a turn and a step.
export function readStick(state = { turn: true, back: true, aiming: false }, x, y) {
  const next = { ...state };
  let action = null;
  if (next.aiming) {
    // a release rolled sideways or flicked back must not also turn or step: both wait for centre
    if (y > -STICK.rearm) { next.aiming = false; next.turn = false; next.back = false; action = 'release'; }
  } else if (y <= -STICK.fire) {
    next.aiming = true; action = 'aim';
  } else if (Math.abs(x) >= STICK.fire && Math.abs(x) >= y && next.turn) {
    next.turn = false; action = x < 0 ? 'turn-left' : 'turn-right';
  } else if (y >= STICK.fire && y > Math.abs(x) && next.back) {
    next.back = false; action = 'back';
  }
  if (Math.abs(x) < STICK.rearm) next.turn = true;
  if (y < STICK.rearm) next.back = true;
  return { state: next, action };
}

// The arc from the hand along its pointing direction (unit vector): its points and where it meets
// the floor (y = 0), or hit null when it does not come down in time.
export function arc(origin, dir) {
  const points = [origin.slice()];
  let prev = origin;
  for (let t = ARC.step; t <= ARC.maxT + 1e-9; t += ARC.step) {
    const p = [
      origin[0] + dir[0] * ARC.speed * t,
      origin[1] + dir[1] * ARC.speed * t - ARC.gravity * t * t / 2,
      origin[2] + dir[2] * ARC.speed * t
    ];
    if (p[1] <= 0) {
      const f = prev[1] / (prev[1] - p[1]);
      const hit = [prev[0] + (p[0] - prev[0]) * f, 0, prev[2] + (p[2] - prev[2]) * f];
      points.push(hit);
      return { points, hit };
    }
    points.push(p);
    prev = p;
  }
  return { points, hit: null };
}

// The walkable area: one rectangle { minX, maxX, minZ, maxZ }, or a list of them that overlap where
// one place opens into the next (the corridor and its elevator hall), so moving passes between them.
const areasOf = (b) => (Array.isArray(b) ? b : [b]);
// rectangles written "minX maxX minZ maxZ", a comma between them (a component's attribute), and
// back: areasText(areasFrom(t)) gives the same rectangles
export const areasFrom = (text) => text.split(',').map((r) => r.trim().split(/\s+/).map(Number))
  .filter((v) => v.length === 4 && v.every(Number.isFinite)).map(([minX, maxX, minZ, maxZ]) => ({ minX, maxX, minZ, maxZ }));
export const areasText = (areas) => areas.map((a) => `${a.minX} ${a.maxX} ${a.minZ} ${a.maxZ}`).join(', ');
// Whether a head position (x, z) is inside the walkable area.
export function inside(x, z, b) {
  return areasOf(b).some((a) => x >= a.minX && x <= a.maxX && z >= a.minZ && z <= a.maxZ);
}

// The rig after turning by deg around the head (its world x, z), so the head stays where it is.
export function snapTurn(rig, head, deg) {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const dx = rig.x - head[0], dz = rig.z - head[1];
  return { x: head[0] + dx * c + dz * s, z: head[1] - dx * s + dz * c, yaw: rig.yaw + a };
}

// The rig after a teleport that puts the head (world x, z) over the target (world x, z).
export function teleport(rig, head, target) {
  return { x: rig.x + target[0] - head[0], z: rig.z + target[1] - head[1], yaw: rig.yaw };
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// where a move from the head toward p ends: at p when p is in the area, else at p stopped at the
// edge of the rectangle the head is in
export function keep(head, p, b) {
  if (inside(p[0], p[1], b)) return p;
  const a = areasOf(b).find((r) => inside(head[0], head[1], r)) || areasOf(b)[0];
  return [clamp(p[0], a.minX, a.maxX), clamp(p[1], a.minZ, a.maxZ)];
}

// Where a back step puts the head: MOVE.backStep behind it, stopped at the edge of the area.
export function backStep(head, yaw, b) {
  return keep(head, [head[0] + Math.sin(yaw) * MOVE.backStep, head[1] + Math.cos(yaw) * MOVE.backStep], b);
}

// Smooth moving, offered beside teleport (Meta: let the player choose). Walking pace, about
// 3 mph (Meta locomotion comfort), reached at once and kept: speed changes sicken more than a
// steady speed (Bonato et al. 2008), so any push past the dead zone moves at that one speed.
// The turn rate is the default of Meta's Immersive Web SDK; the dead zone its stick's.
export const SMOOTH = { speed: 1.4, deadzone: 0.2, turnDegPerS: 180 };

// Where smooth moving takes the head in dt seconds: along the stick (x right, y down = back)
// as seen from where the head looks, stopped at the edge of the area; null while the stick rests.
export function slide(head, yaw, x, y, dt, b) {
  const m = Math.hypot(x, y);
  if (m < SMOOTH.deadzone) return null;
  const k = SMOOTH.speed * dt / m;
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  return keep(head, [head[0] + (rx * x - fx * y) * k, head[1] + (rz * x - fz * y) * k], b);
}

// The turn smooth turning makes in dt seconds, in degrees (stick right turns right); 0 at rest.
export function smoothTurnDeg(x, dt) {
  return Math.abs(x) < SMOOTH.deadzone ? 0 : -Math.sign(x) * SMOOTH.turnDegPerS * dt;
}

// How far the view is narrowed while moving smoothly, 0..1: fully at walking pace or at
// 180°/s of turning, where Al Zayer et al. (CHI 2019) restricted it fully (to about 50° of a
// 100° view), after Fernandes & Feiner (2016), and it lowered sickness.
export const VIGNETTE = { fullAtSpeed: 1.4, fullAtDegPerS: 180, minFovDeg: 50 };
export function vignetteLevel(speed, degPerS) {
  return Math.min(1, Math.max(speed / VIGNETTE.fullAtSpeed, Math.abs(degPerS) / VIGNETTE.fullAtDegPerS));
}
