// Counts the seconds the player's head points away from a place (more than
// `degrees` off), e.g. away from the apparatus during the trials: a plain
// measure of where attention drifts, without eye tracking.
const v = new THREE.Vector3();
const toTarget = new THREE.Vector3();
const head = new THREE.Vector3();

// camEl: the camera entity; target: {x, y, z}; paused(): time does not count.
export function createAwayMeter(camEl, target, paused, degrees = 45) {
  let away = 0;
  let timer = null;
  let last = 0;
  const limit = Math.cos((degrees * Math.PI) / 180);
  const t = new THREE.Vector3(target.x, target.y, target.z);
  return {
    start() {
      away = 0;
      last = performance.now();
      timer = setInterval(() => {
        const now = performance.now();
        const dt = (now - last) / 1000;
        last = now;
        if (paused()) return;
        const cam = camEl.object3D;
        cam.getWorldPosition(head);
        cam.getWorldDirection(v).negate(); // three.js cameras look down -Z
        toTarget.copy(t).sub(head).normalize();
        if (v.dot(toTarget) < limit) away += dt;
      }, 200);
    },
    stop() {
      clearInterval(timer);
      timer = null;
      return Math.round(away);
    }
  };
}
