// The A-Frame build the game ships (vendor/aframe-1.8.0.min.js) is npm aframe@1.8.0's
// dist/aframe-v1.8.0.min.js with its source-map line dropped and one call put back: after a scene is
// drawn, the textures deferred during a multiview frame are uploaded (textures.runDeferredUploads(), as
// in super-three 0.181; lost in 0.184, supermedium/three.js PR #25). Without it canvas text first drawn
// in VR stays black with multiview on (src/app/stage.js). A new A-Frame must be patched again.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const build = fs.readFileSync(new URL('../vendor/aframe-1.8.0.min.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.ok(html.includes('<script src="vendor/aframe-1.8.0.min.js"></script>'), 'the game page does not load vendor/aframe-1.8.0.min.js');
assert.ok(/three\.js r184|"184"/.test(build), 'the build is not A-Frame 1.8.0 with three.js r184');
assert.ok(build.includes('Tt.enabled&&Tt.isMultiview)ot.setDeferTextureUploads(!0)'), 'the multiview frame no longer defers texture uploads as expected');
assert.equal(build.split('t.onAfterRender(M,t,e),ot.runDeferredUploads(),_t.resetDefaultState()').length - 1, 1,
  'the deferred texture uploads are not run after the scene is drawn: multiview leaves new textures black');
// and nothing else differs: the put-back call taken out again and the source-map line given back, the
// build is byte for byte the official file (SHA-256 and size from jsDelivr's index of npm aframe@1.8.0,
// data.jsdelivr.com/v1/packages/npm/aframe@1.8.0, /dist/aframe-v1.8.0.min.js)
const PUT_BACK = 'ot.runDeferredUploads(),', at = build.indexOf('t.onAfterRender(M,t,e),' + PUT_BACK) + 't.onAfterRender(M,t,e),'.length;
const official = build.slice(0, at) + build.slice(at + PUT_BACK.length) + '\n//# sourceMappingURL=aframe-v1.8.0.min.js.map';
assert.equal(Buffer.byteLength(official), 1323403, 'the A-Frame build differs from the official one in more than the put-back call');
assert.equal(crypto.createHash('sha256').update(official).digest('hex'), '40d5a4d63c67d8c50842bf3c36a06995cad712d0675c8e5d2eb4dbae38b7481f',
  'the A-Frame build differs from npm aframe@1.8.0\'s dist/aframe-v1.8.0.min.js in more than the put-back call');
const stage = fs.readFileSync(new URL('../src/app/stage.js', import.meta.url), 'utf8');
assert.ok(/multiviewStereo: \$\{MULTIVIEW\}/.test(stage), 'multiview is not turned on');

// Nothing from other sites (.claude/rules/game.md). A-Frame asks its CDN root for the controllers'
// models; the page sets that root to our copy before A-Frame loads (A-Frame 1.8.0 docs, faq.md, "Can I use
// A-Frame offline or self hosted?").
const root = html.indexOf("<script>window.AFRAME_CDN_ROOT = './vendor/aframe-assets/';</script>");
assert.ok(root > 0 && root < html.indexOf('<script src="vendor/aframe-1.8.0.min.js">'), 'the page does not set AFRAME_CDN_ROOT to vendor/aframe-assets/ before A-Frame loads');
assert.ok(build.includes('window.AFRAME_CDN_ROOT||"https://cdn.aframe.io/"'), 'this A-Frame no longer reads AFRAME_CDN_ROOT');
// and so does every other page that loads A-Frame (the headset probes in tools/), from its own folder
for (const f of fs.readdirSync(new URL('../tools/', import.meta.url)).filter((n) => n.endsWith('.html'))) {
  const page = fs.readFileSync(new URL(`../tools/${f}`, import.meta.url), 'utf8'), loads = page.indexOf('<script src="../vendor/aframe-1.8.0.min.js">');
  if (loads < 0) continue;
  const set = page.indexOf("<script>window.AFRAME_CDN_ROOT = '../vendor/aframe-assets/';</script>");
  assert.ok(set > 0 && set < loads, `tools/${f} loads A-Frame without AFRAME_CDN_ROOT set to vendor/aframe-assets/ first`);
  for (const scene of page.match(/<a-scene\b[^>]*>/g) || []) assert.ok(scene.includes('inspector="url: ../vendor/aframe-inspector/aframe-inspector-1.8.0.min.js"'), `tools/${f}: its scene's inspector would load from unpkg.com`);
}
// Every model A-Frame 1.8.0 names for these controllers and hands, byte for byte its licensed origin (SHA-256):
// WebXR Input Profiles' assets, MIT (controllers/LICENSE.md), and A-Frame's hands, MIT (controllers/hands/LICENSE).
// The models of the HTC Vive, Vive Focus, Windows Mixed Reality, Magic Leap One, Oculus Go and the first Touch
// controllers carry no licence and are not shipped: on those headsets no controller is drawn, only the ray
// (A-Frame 1.8.0's laser-controls makes it on controllerconnected, model or not; src/components/laser-controls.js),
// aimed without the model's correction, until every headset takes its model through three.js's loader
// (.claude/rules/game.md, docs/board.md): not to be published before it.
const MODELS = {
  'meta/quest-touch-plus-left.glb': '41a35b80221398d37029cbfaa9e39084ccd43e0206be72a5e8460f52e7882cb4',
  'meta/quest-touch-plus-right.glb': '5126d638fb1d03e05d16d8eec3b31b9588df88eaa8b42cc21b857fac3bd44916',
  'meta/quest-touch-pro-left.glb': '5f64ff585815292bd7e35ac0db67e269cd10dd9f215f8a5f14b29de4c83819f9',
  'meta/quest-touch-pro-right.glb': 'de508862ac1460814b9236441982dfe2611ac5b1002d48503186e35a09d38272',
  'oculus/oculus-touch-controller-v3-left.glb': '5a3015792dac074b31607e63eeb75743eac479540a36739e5f94b65335a7f88a',
  'oculus/oculus-touch-controller-v3-right.glb': '18a2e651328b684d3aeeef9f16c083af1eea9c1f98f78f9da94960432c8a021b',
  'hp/mixed-reality/left.glb': '7c0c1f6576e51d977e1874b8a772657341d2a145f383f2f5407bd72bdff8112f',
  'hp/mixed-reality/right.glb': 'a3b2796735429497039f0313ed22e8c2f52f78000eff8a4e3e382cae0c68a7e0',
  'pico/pico4/left.glb': '0a0cc5101dcc192e30007db6fdcf7bd1a04b2c08bd7c05add8608138f30adb53',
  'pico/pico4/right.glb': '5b5e334bd9b4ea764e88ddf9ed37183e7d56d01d8493bd50273d9dfae8cc5460',
  'valve/index/valve-index-left.glb': '845de49bdd4511ddf72e10846c7290dc2d48d0c30218e700017f486a5dcfece2',
  'valve/index/valve-index-right.glb': '9b0d2606ea6856958fcef98d8d119a550cb061fc31cde4c17fb1fa2251b6db81',
  'oculus-hands/v4/left.glb': 'bc67783144944ea1cda54d9247885825ea5fb9d4651469fe7d00be517a5c2b87',
  'oculus-hands/v4/right.glb': '291790c14f7f88a7f9bd35330c47392ed8e8d395ae6728f4bb7089f1bc1f2b96',
  'hands/leftHand.glb': 'ba546175cb4d4ea7910259702ef2c23a244a754cb4c876a024c963be8a100c6b',
  'hands/rightHand.glb': '7e7dfbe70e4fbbc415b874ce7a462fc2a31522da512c1f79722ba0b55dfcc875',
  'hands/leftHandLow.glb': '182a4c81b0657764652d78637940ac1a733bd7c18a14ac74c1264acda9740d06',
  'hands/rightHandLow.glb': '37db25d00b987345cf56dcb0826f30d2c53f349981264964d096d4ec49e47c88',
  'hands/leftHandHigh.glb': '34fc636bb6525136ff37c1158ee28eb7af65a4cf376ee7fe670ae22b44d03990',
  'hands/rightHandHigh.glb': '279aefb07d677d4a999c4ceb1e7a8a0fa3630ccd35e9bbe7f7e0937c9bf12856'
};
const ASSETS = new URL('../vendor/aframe-assets/controllers/', import.meta.url);
const shipped = fs.readdirSync(ASSETS, { recursive: true }).map((f) => String(f).replace(/\\/g, '/')).filter((f) => f.endsWith('.glb'));
assert.deepEqual(shipped.sort(), Object.keys(MODELS).sort(), 'vendor/aframe-assets holds other models than the list');
for (const [file, sum] of Object.entries(MODELS)) {
  const glb = fs.readFileSync(new URL(file, ASSETS));
  assert.equal(crypto.createHash('sha256').update(glb).digest('hex'), sum, `${file} is not its licensed origin`);
  // a Draco, meshopt or Basis extension would send A-Frame to another host for its decoder; a uri, for a file
  const gltf = JSON.parse(glb.toString('utf8', 20, 20 + glb.readUInt32LE(12)));
  assert.deepEqual(gltf.extensionsUsed || [], [], `${file} needs a decoder from another site`);
  assert.ok([...(gltf.images || []), ...(gltf.buffers || [])].every((x) => !x.uri), `${file} loads a file of its own`);
}
for (const licence of ['LICENSE.md', 'hands/LICENSE']) assert.match(fs.readFileSync(new URL(licence, ASSETS), 'utf8'), /MIT License/, `${licence} is missing`);
// MIT asks that the notices go with every copy: the A-Frame build's, its own and every bundled package's
// (gathered from npm by its package-lock.json), and the inspector's, which its first line points to
const licences = fs.readFileSync(new URL('../vendor/aframe-1.8.0.LICENSES.txt', import.meta.url), 'utf8');
for (const pkg of ['aframe@1.8.0', 'super-three@0.184.0', 'super-animejs@3.1.0', 'stats-gl@3.6.0', 'debug@4.4.0', 'buffer@6.0.3', 'load-bmfont@1.4.2', 'deep-assign@2.0.0', 'three-bmfont-text'])
  assert.ok(licences.includes(`==== ${pkg}`), `vendor/aframe-1.8.0.LICENSES.txt lacks ${pkg}`);
// the inspector every scene gets loads from our copy of npm aframe-inspector@1.8.0's build (its README's
// inspector="url: ..."), never from unpkg.com
const inspector = stage.match(/const INSPECTOR = '([^']+)';/)?.[1];
assert.ok(inspector && stage.includes('<a-scene inspector="url: ${INSPECTOR}"'), 'the scene does not point the inspector at our copy');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(`../${inspector}`, import.meta.url))).digest('hex'),
  '5fd4a5f1ceec8bd3aa139be272ffa5e6ccc9e83cf3dfa27df11e9ca76cb3b3b1', 'the inspector is not npm aframe-inspector@1.8.0\'s dist/aframe-inspector.min.js');
const notices = fs.readFileSync(new URL('../vendor/aframe-inspector/aframe-inspector.min.js.LICENSE.txt', import.meta.url), 'utf8');
assert.ok(/Font Awesome Free 6\.7\.2/.test(notices) && /@license React/.test(notices), 'the inspector\'s licence notices (aframe-inspector.min.js.LICENSE.txt, from the same npm package) are missing');
console.log(`vendor tests: ok (${shipped.length} models and the inspector from the game itself)`);
