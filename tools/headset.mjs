// The link to the owner's headset, shared by every tool that drives it: adb over the USB cable (or
// Wi-Fi, tools/quest-wifi.mjs), the laptop's server shown to the headset as its own
// localhost:3000 through the cable, and the browser's debug connection (CDP) to a page.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

// MSYS_NO_PATHCONV: Git Bash would otherwise turn adb's device paths into Windows paths
const run = (args) => execFileSync('adb', args, { encoding: 'utf8', env: { ...process.env, MSYS_NO_PATHCONV: '1' } }).trim();
// The headset can be listed twice, on its cable and over Wi-Fi (tools/quest-wifi.mjs), and adb then
// refuses every command that names no device ("more than one device/emulator"): the cable's serial
// (the one without an address) is named, unless ANDROID_SERIAL names one already.
let serial;
function device() {
  if (serial !== undefined) return serial;
  const listed = process.env.ANDROID_SERIAL ? [] : run(['devices']).split('\n').slice(1).map((l) => l.trim().split('\t'))
    .filter(([, state]) => state === 'device').map(([id]) => id);
  serial = listed.length > 1 ? (listed.find((id) => !id.includes(':')) || listed[0]) : null;
  return serial;
}
export const adb = (...args) => run(args[0] === 'devices' || !device() ? args : ['-s', device(), ...args]);
// What the headset shows, both eyes, as a PNG: Android's own screen capture of the headset
export const screencap = () => execFileSync('adb', [...(device() ? ['-s', device()] : []), 'exec-out', 'screencap', '-p'],
  { env: { ...process.env, MSYS_NO_PATHCONV: '1' }, maxBuffer: 64 * 1024 * 1024 });

// The laptop's server: the port the app's preview starts it on (.claude/launch.json), else the
// port of `npm run serve`.
export function localPort() {
  try {
    const launch = JSON.parse(fs.readFileSync(new URL('../.claude/launch.json', import.meta.url), 'utf8'));
    return launch.configurations.find((c) => c.name === 'objekt').port;
  } catch (e) { return 3000; }
}
export const HEADSET_URL = 'http://localhost:3000/';
export function serveToHeadset(port = localPort()) {
  adb('reverse', 'tcp:3000', `tcp:${port}`);
  return HEADSET_URL;
}

export function connected() {
  try { return adb('devices').split('\n').slice(1).some((l) => /\tdevice$/.test(l.trim())); } catch (e) { return false; }
}
export const awake = () => /mWakefulness=Awake/.test(adb('shell', 'dumpsys', 'power'));
export function battery() {
  const s = adb('shell', 'dumpsys', 'battery');
  return { level: Number(s.match(/level: (\d+)/)?.[1]), charging: /status: 2\b/.test(s) };
}
// Worn: the proximity sensor is overridden so the headset stays awake on a table; off gives it back.
export const worn = (on) => adb('shell', 'am', 'broadcast', '-a', `com.oculus.vrpowermanager.${on ? 'prox_close' : 'automation_disable'}`);
export function sleepNow() { worn(false); adb('shell', 'input', 'keyevent', 'KEYCODE_SLEEP'); }
// On a person's head: the power service reads the headset as mounted with no override of ours
// (`dumpsys vrpowermanager`: "Virtual proximity state: DISABLED"; our "worn on" reads CLOSE).
// Restarting the browser or the headset then throws the owner out of what he is doing, so those
// wait until he takes it off.
export const onHead = (powerDump) => /State: HEADSET_MOUNTED/.test(powerDump) && /Virtual proximity state: DISABLED/.test(powerDump);
export const wornByPerson = () => onHead(adb('shell', 'dumpsys', 'vrpowermanager'));
// The browser restarted, the game page opened again: a browser that has lost its link to the VR
// system answers every request to enter VR with NotSupportedError, whatever the page asks for.
export function restartBrowser(url) {
  adb('shell', 'am', 'force-stop', 'com.oculus.browser');
  adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', url, 'com.oculus.browser');
}
export function openUrl(url) {
  adb('shell', 'input', 'keyevent', 'KEYCODE_WAKEUP');
  adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', url, 'com.oculus.browser');
}

// The game opened in one tab only: two game tabs play two sets of sounds, so a room's hum from a tab
// left in its room is heard in the other tab's corridor. An open game tab (the test copy's or the
// laptop's) is pointed at the address and every other one closed; with none, the browser opens it.
// Closing them all first left the browser with no window, and the address it was given next did
// not load. A request the browser refuses stops the opening. Returns how many tabs were closed.
// the debug link to the browser, made anew each time: a browser restarted while the headset slept has a new
// socket, and an old forward kept pointing at the gone one
const forwardDevtools = () => { try { adb('forward', '--remove', 'tcp:9222'); } catch (e) { /* none yet */ } adb('forward', 'tcp:9222', 'localabstract:chrome_devtools_remote'); };
const DEVTOOLS = 'http://127.0.0.1:9222/json';
const devtools = async (what) => {
  const r = await fetch(`${DEVTOOLS}/${what}`);
  if (!r.ok) throw new Error(`the headset browser refused ${what}: ${r.status}`);
  return r;
};
// The browser keeps its debug link open only while it is in front: behind the headset's menu (its
// power button opens the quick menu) or another app it runs with none (seen on the Quest 3: no
// chrome_devtools_remote socket until it came to the front, then one at once). So a running browser
// that does not answer is brought to the front and asked again; it is brought by its launcher entry
// (MAIN/LAUNCHER, which the Quest 3 resolves to com.oculus.browser/.OculusLauncherActivity), never by
// the game's address, which could open a second game tab that, if the list still does not answer, no
// one closes
const BROWSER_LAUNCHER = 'com.oculus.browser/.OculusLauncherActivity';
const listAfterFront = async (ms = 15000) => {
  adb('shell', 'input', 'keyevent', 'KEYCODE_WAKEUP');
  adb('shell', 'am', 'start', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.LAUNCHER', '-n', BROWSER_LAUNCHER);
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 500))) {
    try { forwardDevtools(); return await fetch(`${DEVTOOLS}/list`); } catch (e) { /* not yet */ }
  }
  return null;
};
export async function openGame(url) {
  forwardDevtools();
  // a browser that is not running (it closes while the headset sleeps) has no debug link: it is
  // started on the address instead. A running one in the background is brought to the front; if it
  // still does not answer, the opening stops, since its other game tabs could not be closed
  let list;
  try { list = await fetch(`${DEVTOOLS}/list`); } catch (e) {
    let running = '';
    // pidof answers "none runs" with exit 1 and no output (seen on the Quest 3 for a package that does not run);
    // any other failure (the headset gone, adb's own error) is no "not running" to open the game on
    try { running = adb('shell', 'pidof', 'com.oculus.browser'); } catch (err) {
      const none = err.status === 1 && !String(err.stdout || '').trim() && !String(err.stderr || '').trim();
      if (!none) throw new Error(`the headset's browser could not be asked whether it runs: ${String(err.stderr || err.message).trim().slice(0, 120)}`);
    }
    if (!running) { openUrl(url); return 0; }
    list = await listAfterFront();
    if (!list) throw new Error('the headset browser runs but its tab list did not answer even in front: its game tabs cannot be closed first');
  }
  if (!list.ok) throw new Error(`the headset browser refused list: ${list.status}`);
  const game = (await list.json()).filter((t) => t.type === 'page' && /object-preview\/|localhost:3000/.test(t.url));
  if (!game.length) { openUrl(url); return 0; }
  for (const t of game.slice(1)) await devtools(`close/${t.id}`);
  await devtools(`activate/${game[0].id}`);
  const kept = await page({ test: (u) => u === game[0].url });
  if (!kept) throw new Error('the game tab kept open is gone');
  const r = await kept.send('Page.navigate', { url });
  kept.close();
  if (r.error || r.result?.errorText) throw new Error(`the game tab did not load ${url}: ${JSON.stringify(r.error || r.result)}`);
  return game.length - 1;
}

// A page in the headset's browser whose address matches: { tab, send, run(expression, gesture),
// errors, close }. A call the page never answers (the headset slept, the tab changed) reports so
// instead of leaving the tool waiting.
export async function page(match, { noAnswerMs = 120000 } = {}) {
  forwardDevtools();
  let tabs;
  try { tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json(); } catch (e) {
    throw new Error('the headset browser has no debug link: it is not running or not in front (the headset slept, or its menu or another app is in front); open the game first (quest-look open)');
  }
  const tab = tabs.find((t) => t.type === 'page' && match.test(t.url));
  if (!tab) return null;
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map(), errors = [];
  const failAll = (text) => { for (const f of pending.values()) f({ result: { exceptionDetails: { text } } }); pending.clear(); };
  ws.onclose = () => failAll('the connection to the page closed');
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  const send = (method, params = {}) => new Promise((r) => {
    const n = ++id;
    const timer = setTimeout(() => { if (pending.has(n)) { pending.delete(n); r({ result: { exceptionDetails: { text: `no answer in ${noAnswerMs / 1000} s` } } }); } }, noAnswerMs);
    pending.set(n, (d) => { clearTimeout(timer); r(d); });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  // gesture: the page treats the call as the user's own press (VR, MR and the microphone need one)
  const run = async (expression, gesture = true) => {
    const r = (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: gesture })).result;
    if (r?.exceptionDetails) return { error: 'page threw: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) };
    return r?.result?.value;
  };
  return { tab, send, run, errors, close: () => ws.close() };
}

// The owner's next step, inside the headset, so he does not take it off to read the chat (his
// practice, .claude/rules/measures.md). The input probe's panel and type as they were reviewed
// (tools/xr-probe-input.html, objekt-files/notes/archive/docs/audit/probe-review.md), cut to its two lines, and placed as Meta
// places captions: at the edge of the view, not over what he looks at ("at the top or bottom of their
// 40-degree field of view", developers.meta.com/horizon/design/accessibility), here 15 degrees above
// the horizon, since what he is asked to look at mostly stands lower (the extinguisher, the desk, the
// clipboard; placed 15 degrees under it, a note covered the extinguisher he was to look at); 1 m away, or nearer when a wall is closer, never under 0.5 m (Meta, design/display),
// scaled with its distance so the text keeps its size to the eye. Every new step buzzes both
// controllers, as the probe does, so he knows one came ("Provide sounds and haptic feedback").
// "say off" takes it away.
// Returns the expression to run in the game page (tools/quest-look.mjs say, tools/measure.mjs): one place, so
// every tool shows the note the same way, through its own debug link.
// Answers under the owner's note (noteScript draws it first): one button each, the game's own answer
// buttons (src/engine/ui/choice.js: the controller's ray or the mouse, lit under the ray), so a step
// in the headset is answered in the headset (his request: he cannot be in the headset and press the
// chat's buttons). The pick is kept in the page (window.__ownerAnswer) for the tool to read; a
// haptic pulse answers the press. His acceptance of a thing stays in the chat, his own channel: a
// press here passes through the tool's own link to the page.
export const answersScript = (labels) => `import(new URL('src/engine/ui/choice.js', document.baseURI).href).then(({ createChoice }) => {
    const note = document.getElementById('ownerNote'), labels = ${JSON.stringify(labels)};
    if (!note || !note.object3D.visible) return { error: 'no note shown to answer' };
    window.__ownerAnswer = null;
    const onTop = note.getObject3D('mesh').material.depthTest === false;
    const choice = createChoice(note, { x: 0, y: -0.25, z: 0.005, w: 0.7, h: 0.1, gap: 0.02 });
    choice.show(labels, (i) => {
      window.__ownerAnswer = labels[i];
      note.object3D.visible = false;
      for (const src of (note.sceneEl.xrSession && note.sceneEl.xrSession.inputSources) || []) {
        const h = src.gamepad && src.gamepad.hapticActuators && src.gamepad.hapticActuators[0];
        if (h && h.pulse) h.pulse(0.6, 80);
      }
    });
    // drawn over everything as the note is, when the note had to be
    if (onTop) for (const el of note.querySelectorAll('.answer')) el.addEventListener('loaded', () => el.object3D.traverse((o) => { if (o.material) { o.material.depthTest = false; o.renderOrder = 999; } }));
    return { answers: labels.length };
  })`;
export const noteScript = (main, small = '') => `new Promise((resolve) => {
    const s = document.querySelector('a-scene'), main = ${JSON.stringify(main)}, small = ${JSON.stringify(small)};
    let p = document.getElementById('ownerNote');
    if (main === 'off') { if (p) p.object3D.visible = false; resolve({ hidden: true }); return; }
    if (!p) {
      p = document.createElement('a-entity');
      p.id = 'ownerNote';
      p.setAttribute('panel', 'w: 1; h: 0.34; px: 1432; ref: 1024; bg: #1c1c1c');
      s.appendChild(p);
    }
    const show = () => {
      p.components.panel.write([
        { t: main, size: 54, weight: 500, color: '#dadada' },
        ...(small ? [{ t: small, size: 34, color: '#9a9a9a', gap: 30 }] : [])
      ]);
      // Where it stands, as the clipboard finds where it is read (src/engine/ui/sheet-math.js readingPose):
      // straight ahead first, then the nearest turn to either side up to 20 degrees (the panel spans about
      // 27 degrees each side of its centre, and Quest 3 sees 55: Meta's IWSDK keeps such UI within 30, "Compact
      // global UI that must remain discoverable", documentation/iwsdk/concepts/spatial-ui/hud), at 1 m or
      // nearer down to 0.5 m, the first place where no surface stands on the lines from the eye to the
      // panel's centre and four corners, nor 10 cm past them.
      // A hint cut by a wall or a thing in front of it could not be read in the headset. If nowhere is
      // clear, it stands 0.5 m ahead drawn over everything, so it is read all the same (Meta: captions "never
      // obstructed by spatial elements", design/accessibility), at the cost of a depth that contradicts the
      // wall's (design/display): the reply says so, and the next hint asks him to step back.
      const at = new THREE.Vector3(), ahead = new THREE.Vector3();
      s.camera.getWorldPosition(at); s.camera.getWorldDirection(ahead);
      ahead.y = 0;
      if (ahead.lengthSq() < 1e-4) ahead.set(0, 0, -1);
      ahead.normalize();
      p.object3D.visible = false;
      // what stands in the room: visible, and not the player's own rig (his controllers, their rays)
      const seen = (o) => { for (; o; o = o.parent) if (!o.visible || (o.el && o.el.id === 'rig')) return false; return true; };
      const ray = new THREE.Raycaster();
      const firstHit = (to) => {
        const v = to.clone().sub(at), len = v.length();
        ray.set(at, v.normalize()); ray.far = len + 0.1;
        return ray.intersectObjects(s.object3D.children, true).some((h) => h.object.isMesh && seen(h.object));
      };
      const UP = new THREE.Vector3(0, 1, 0), tilt = Math.PI / 12;
      const place = (yaw, d) => {
        const dir = ahead.clone().applyAxisAngle(UP, yaw).multiplyScalar(Math.cos(tilt)).setY(Math.sin(tilt));
        const centre = at.clone().addScaledVector(dir, d);
        const right = new THREE.Vector3().crossVectors(dir, UP).normalize(), up = new THREE.Vector3().crossVectors(right, dir).normalize();
        const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => centre.clone().addScaledVector(right, a * 0.5 * d).addScaledVector(up, b * 0.17 * d));
        return [centre, ...corners].some(firstHit) ? null : centre;
      };
      let spot = null, d = 1;
      search: for (const yaw of [0, 10, -10, 20, -20].map((g) => (g * Math.PI) / 180)) {
        for (const dist of [1, 0.85, 0.7, 0.5]) { const c = place(yaw, dist); if (c) { spot = c; d = dist; break search; } }
      }
      const onTop = !spot;
      if (onTop) { d = 0.5; spot = at.clone().addScaledVector(ahead.clone().multiplyScalar(Math.cos(tilt)).setY(Math.sin(tilt)), d); }
      p.object3D.traverse((o) => { if (o.material) { o.material.depthTest = !onTop; o.renderOrder = onTop ? 999 : 0; } });
      p.object3D.position.copy(spot);
      p.object3D.scale.setScalar(d);
      p.object3D.lookAt(at);
      p.object3D.visible = true;
      for (const src of (s.xrSession && s.xrSession.inputSources) || []) {
        const h = src.gamepad && src.gamepad.hapticActuators && src.gamepad.hapticActuators[0];
        if (h && h.pulse) h.pulse(0.6, 120);
      }
      resolve({ shown: main, vr: s.is('vr-mode'), metres: +d.toFixed(2), overEverything: onTop });
    };
    // a new entity's panel draws once A-Frame has run its init (its canvas exists), a frame or two later
    const ready = (n) => (p.components.panel && p.components.panel.c ? show() : n > 0 ? setTimeout(() => ready(n - 1), 50) : resolve({ error: 'the panel did not start' }));
    ready(60);
})`;
