export const ANGLES = Object.freeze({ start: 0, front: 90, end: 180 });
export const ACTIONS = [...Object.keys(ANGLES), 'scale', 'angle', 'restart'];
export const INITIAL_VIEW = Object.freeze({ turn: 0, scale: 0, angle: 0 });

const SCALES = [1, 1.25, 0.75];
const POSITIONS = [
  [0, 1.65, -2.65],
  [-0.18, 1.65, -2.05],
  [0.23, 1.65, -3.6]
];
const STEPS = { scale: SCALES.length, angle: POSITIONS.length };

export function changeView(view, action) {
  if (Object.hasOwn(ANGLES, action)) return { ...view, turn: ANGLES[action] };
  if (Object.hasOwn(STEPS, action)) return { ...view, [action]: (view[action] + 1) % STEPS[action] };
  throw new RangeError(`Unknown view action: ${action}`);
}

export function projection(view) {
  const [x, y, z] = POSITIONS[view.angle];
  const size = SCALES[view.scale];
  return {
    position: { x, y, z },
    // A half turn leaves the symmetric slab in the same pose as the starting edge.
    rotation: { x: 0, y: view.turn === ANGLES.front ? 0 : 90, z: 0 },
    scale: { x: size, y: size, z: size }
  };
}
