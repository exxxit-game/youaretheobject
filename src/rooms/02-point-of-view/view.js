export const ACTIONS = ['turn', 'scale', 'angle', 'return'];
export const INITIAL_VIEW = Object.freeze({ turn: 0, scale: 0, angle: 0 });

const TURN_STEP = 30;
const SCALES = [1, 1.25, 0.75];
const POSITIONS = [
  [0, 1.65, -2.65],
  [-0.18, 1.65, -2.05],
  [0.23, 1.65, -3.6]
];
const STEPS = { turn: 360 / TURN_STEP, scale: SCALES.length, angle: POSITIONS.length };

export function changeView(view, action) {
  if (!ACTIONS.includes(action)) throw new RangeError(`Unknown view action: ${action}`);
  if (action === 'return') return INITIAL_VIEW;
  return { ...view, [action]: (view[action] + 1) % STEPS[action] };
}

export function projection(view) {
  const [x, y, z] = POSITIONS[view.angle];
  const size = SCALES[view.scale];
  return {
    position: { x, y, z },
    rotation: { x: 0, y: view.turn * TURN_STEP, z: 0 },
    scale: { x: size, y: size, z: size }
  };
}
