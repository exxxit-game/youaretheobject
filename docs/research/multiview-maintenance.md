# Multiview maintenance: the shipped A-Frame build

8 November 2026. The owner's developer notification led to this source check.
This is engine maintenance for the approved corridor, not a change of its purpose.

## Actual versions and the offered candidate

The game, preview and probes load vendor/aframe-1.8.0.min.js. It contains A-Frame
1.8.0 and Three r184 (super-three 0.184.0). Its previous local patch restored one
post-render texture flush. The exact previous build is in commit97c2234:
SHA-256 0fd9768440300b116af76343ab9d7bfb4699758ed236bdcda5be56f316d3709f.

[Vincent's comment](https://github.com/supermedium/three.js/issues/27#issuecomment-6654289546)
offers A-Frame022bcc5f6eef09ff60d3f2110604c78cae0cd5b1 with
Three a4ff869e214577e8f9cb971441dd0754310e5dcd for testing. The offered package
path uses ESM and an external Three import. An npm override alone does not change
Three inside our existing monolithic browser file. Registry metadata checked on
8 November still gives aframe1.8.0 with super-three0.184.0 and super-three latest0.185.0.

The r187 candidate also contains a DataTexture deferral exception that is still
disputed in [A-Frame5863](https://github.com/aframevr/aframe/issues/5863#issuecomment-6528175919).
[Vincent's response](https://github.com/aframevr/aframe/issues/5863#issuecomment-6653990690)
promises further examples/tests. The whole branch is not treated as an accepted
release or proof that this project works on Quest.

## Three bounded backports

1. [Texture lifecycle9561820](https://github.com/vincentfretin/three.js/commit/95618201ed4b4a1586b76d5ada699c3cde218911):
   reset deferral, then flush after the multiview draw. Our old flush temporarily
   disabled deferral and restored its previous true value. Later ordinary uploads
   could remain queued. Move the flush from the global render tail into that
   multiview branch, matching upstream; ordinary nested renders must not drain it.
2. [Matrix parameter9c6b6fc](https://github.com/vincentfretin/three.js/commit/9c6b6fc958b4388c5e981f8edae8ea00df9ec705):
   rename getIBLVolumeRefraction's parameter and both uses to viewMat. The global
   viewMatrix macro must still select the eye matrix at the call site. The two
   newer common transform functions from r187 do not exist in our r184 build and
   are not added. This conditional path needs transmission; its use in our current
   app was not found, which does not make the library defect absent.
3. [Extension ordere97db70](https://github.com/vincentfretin/three.js/commit/e97db70dfb94d34815ae6370f2c4795e1af9e2fc):
   keep material extension directives before the multiview layout token, without
   duplicating them. Current app use of the optional multi-draw/clip-cull paths
   was not found. No DataTexture exception or unrelated r187 change is imported.

tools/multiview-vendor.mjs applies only to the exact prior SHA and can reverse all
edits. `node tools/multiview-vendor.mjs --check` verifies the current file;
`node tools/multiview-vendor.mjs --apply` is the explicit, idempotent patch action.
Unknown versions fail rather than receiving guessed replacements. Reversing the
backports, removing the former flush and restoring the source-map line reproduces
the official npm dist:1323403 bytes, SHA-256
40d5a4d63c67d8c50842bf3c36a06995cad712d0675c8e5d2eb4dbae38b7481f.
Original notices and controller/inspector assets remain covered by vendor.test.mjs.

## What the checks establish

tests/vendor-multiview.test.mjs runs the shipped texture helper and render branch
with controlled uploads. The old build uploads its queued texture but retains
deferral; the patched build also allows a later ordinary update. The shader checks
cover both matrix uses, optional extension order and an unchanged zero-extension
prefix. They do not emulate a GPU or prove human-visible binocular correctness.

The separate CI shader step compiles ordinary WebGL2 grammar controls using the
actual shipped signature/prefix, with old-code negative controls. It replaces the
native multiview extension/layout with an ordinary layout solely to isolate the
grammar rule. It does not test OCULUS_multiview, stereo view indices or performance.
Preview and original room smoke remain separate required steps. Fresh source
requires fresh checks; earlier CI results remain attached to their earlier SHA.

## Native Quest verification still required

The IWER harness does not reproduce OCULUS_multiview. Before headset work, prepare
the exact candidate, independent practice review and the existing probe route.
Verify that native multiview is actually active, then create and update canvas
text/ink after VR starts; inspect both eyes, GL/shader logs and render timing.
Check exit to ordinary rendering and another XR entry. Exercise transmission and
supported multi-draw materials separately; unsupported extensions are unverified,
not passing cases. Compare with multiview disabled as a control.

Do not ask the owner to capture a whole stairwell to establish this engine fix.
This is a stationary rendering check. A source patch, hash, software-rendered CI
or a developer's report does not establish a successful native Quest result.

The catalogue entry corridor-multiview-maintenance reaches this note and the
current map holds upstream snapshots, registry metadata, versioned results and
open limitations. The original bundle can be restored from commit97c2234 through
normal Git review; no extra repository copy is needed.
