// The A-Frame build the game ships (vendor/aframe-1.8.0.min.js) is npm aframe@1.8.0's
// dist/aframe-v1.8.0.min.js with its source-map line dropped and one call put back: after a scene is
// drawn, the textures deferred during a multiview frame are uploaded (textures.runDeferredUploads(), as
// in super-three 0.181; lost in 0.184, supermedium/three.js PR #25). Without it canvas text first drawn
// in VR stays black with multiview on (src/app/stage.js). A new A-Frame must be patched again.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const build = fs.readFileSync(new URL('../vendor/aframe-1.8.0.min.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.ok(html.includes('<script src="vendor/aframe-1.8.0.min.js"></script>'), 'the game page does not load vendor/aframe-1.8.0.min.js');
assert.ok(/three\.js r184|"184"/.test(build), 'the build is not A-Frame 1.8.0 with three.js r184');
assert.ok(build.includes('Tt.enabled&&Tt.isMultiview)ot.setDeferTextureUploads(!0)'), 'the multiview frame no longer defers texture uploads as expected');
assert.equal(build.split('t.onAfterRender(M,t,e),ot.runDeferredUploads(),_t.resetDefaultState()').length - 1, 1,
  'the deferred texture uploads are not run after the scene is drawn: multiview leaves new textures black');
assert.ok(/multiviewStereo: \$\{MULTIVIEW\}/.test(fs.readFileSync(new URL('../src/app/stage.js', import.meta.url), 'utf8')), 'multiview is not turned on');
console.log('vendor tests: ok');
