import { PROTOCOL } from './protocol.js';
import { eventLog } from '../../engine/log.js';
import { playSound } from '../../engine/sfx.js';

// The 40 trials (Alloy & Abramson 1979, p. 451): yellow light on → 3 s to press
// once or not → at the end of the 3 s the green light comes on or not, read from
// the press tape or the no-press tape (p. 450) → interval → next trial.
// Every completed trial is written to the event log; report.js reads only that.

const $ = (s) => document.querySelector(s);

function lamp(id, on) {
  $(id).setAttribute('material', 'emissiveIntensity', on ? 2.2 : 0);
}

// the press sounds from the button itself, wherever the corridor stands the room
function buttonAt() {
  const v = $('#buttonCap').object3D.getWorldPosition(new THREE.Vector3());
  return { x: v.x, y: v.y, z: v.z };
}

// opt: { tapes, intervals, speed, paused() }. Resolves after the last trial.
// press() is called by the room when the button is pressed.
export function createTrials({ tapes, intervals, speed, paused }) {
  const ms = (secs) => (secs * 1000) / speed;
  let win = null;      // { n, pressed, t0, rt } while the yellow light is on
  let stopped = false;
  const pos = { press: 0, noPress: 0 };

  // Waits `secs` of time the player could see: the clock stops while paused.
  function wait(secs) {
    return new Promise((resolve) => {
      let left = ms(secs);
      let last = performance.now();
      const tick = setInterval(() => {
        const now = performance.now();
        if (!paused()) left -= now - last;
        last = now;
        if (left <= 0 || stopped) { clearInterval(tick); resolve(); }
      }, 20);
    });
  }

  function untilVisible() {
    return new Promise((resolve) => {
      const tick = setInterval(() => { if (!paused() || stopped) { clearInterval(tick); resolve(); } }, 50);
    });
  }

  // One trial window. Resolves true when completed, false when voided by a pause.
  function windowOf(n) {
    return new Promise((resolve) => {
      win = { n, pressed: false, t0: performance.now() };
      lamp('#yellow', true);
      const tick = setInterval(() => {
        if (paused()) {
          clearInterval(tick);
          lamp('#yellow', false);
          win = null;
          eventLog.add('void', n);
          resolve(false);
        } else if (stopped) {
          clearInterval(tick);
          lamp('#yellow', false);
          win = null;
          resolve(false);
        } else if (performance.now() - win.t0 >= ms(PROTOCOL.windowSecs)) {
          clearInterval(tick);
          lamp('#yellow', false);
          resolve(true);
        }
      }, 10);
    });
  }

  async function run() {
    for (let n = 1; n <= PROTOCOL.trials && !stopped; n++) {
      await untilVisible();
      if (stopped) return;
      if (!(await windowOf(n))) {
        if (stopped) return;
        // the repeated trial must not start the moment the player is back
        await untilVisible();
        await wait(PROTOCOL.intervalMinSecs);
        n--;
        continue;
      }
      const press = win.pressed;
      const tape = press ? 'press' : 'noPress';
      const green = tapes[tape][pos[tape]++];
      const rt = press ? Math.round(win.rt) / 1000 : null;
      win = null;
      eventLog.add('trial', { n, press, green, rt });
      if (green) {
        lamp('#green', true);
        wait(PROTOCOL.greenSecs).then(() => lamp('#green', false));
      }
      if (n < PROTOCOL.trials) await wait(intervals[n - 1]);
      else await wait(PROTOCOL.greenSecs);
    }
  }

  // Only the first press inside the window counts ("once and only once", p. 451).
  function press() {
    playSound('button', buttonAt(), 0.7);
    if (!win || performance.now() - win.t0 > ms(PROTOCOL.windowSecs)) { eventLog.add('stray'); return; }
    if (win.pressed) { eventLog.add('extra', win.n); return; }
    win.pressed = true;
    win.rt = (performance.now() - win.t0) * speed;
  }

  function stop() {
    stopped = true;
    lamp('#yellow', false);
    lamp('#green', false);
  }

  return { run, press, stop };
}
