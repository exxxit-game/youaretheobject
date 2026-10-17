// One run of the room, from its instructions to its debrief, and the way it ends early. Leaving through the
// game's menu (room.js leave) ends the run: every step of it still waiting (a line spoken, an answer, a pause,
// the trials) goes nowhere instead of going on in the corridor, and entering again starts a new run.
// The room's own pauses count only time the player could see, as the trials' clock does (trials.js wait):
// under the game's menu, the headset's own menu or a hidden page they stop, so nothing moves on behind a menu.
// paused(): whether the room holds now.
export function createRun(paused) {
  let id = 0;
  const timers = new Set();
  const never = () => new Promise(() => {});
  return {
    get id() { return id; },
    end() { id++; for (const timer of timers) clearInterval(timer); timers.clear(); },
    // p, once it settles, only for the run that was current when the step began (at)
    within(p, at = id) { return p.then((v) => (at === id ? v : never())); },
    delay(ms) {
      return new Promise((resolve) => {
        let left = ms, last = performance.now();
        const tick = setInterval(() => {
          const now = performance.now();
          if (!paused()) left -= now - last;
          last = now;
          if (left <= 0 && !paused()) { clearInterval(tick); timers.delete(tick); resolve(); }   // delay(0): until the room no longer holds
        }, 20);
        timers.add(tick);
      });
    }
  };
}
