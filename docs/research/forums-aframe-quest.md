# Forums sweep: A-Frame / WebXR on Quest (practitioners' experience)

> Kept as the research agent wrote it on 11.10.2026 for the revision (docs/audit/revision.md, shelf 5): English forums, issues and blogs, weighed by the author's visible experience.
> Each point still has to be checked against our code and A-Frame 1.8.0 before anything changes; the first pass of that is on the revision page.


Started 2026-10-11. Every point: practice/pitfall, who (forum + thread), date, link, count of independent threads, official backing.
Marks: (a) agreed by several, (b) one report, (c) contradicted. "STALE?" = older than A-Frame 1.4 / 2023.

## Parts (each gets an answer or "not found")
1. Frame rate on Quest Browser
   1.1 draw calls  1.2 GC in tick  1.3 texture size / KTX2  1.4 text (A-Frame text/MSDF, troika, canvas)
   1.5 shadows  1.6 transparency  1.7 multiview  1.8 fixed foveation  1.9 framebufferScaleFactor  1.10 72/90/120 Hz
2. Bugs and gotchas A-Frame 1.6-1.8 + Quest Browser (browser updates, session features, audio unlock, desktop VR/fullscreen)
3. Debugging on headset: chrome://inspect over USB, IWER, metavr CLI, OVR Metrics Tool, Perfetto, stats
4. Interaction: hand tracking (pinch, poke), controller rays, grabbing (super-hands vs own), haptics
5. Comfort and locomotion (snap turn, vignette, teleport) beyond Meta's guidelines
6. Shipping: PWA to Meta Horizon Store (Bubblewrap), what went wrong

Sources to sweep: Stack Overflow, discourse.threejs.org, github aframevr/aframe issues, Reddit (r/WebXR, r/aframe, r/threejs, r/OculusQuest, r/vrdev), communityforums.atmeta.com, HN / dev blogs.

## Access log (blocked pages)

## Findings

### GitHub aframevr/aframe (read through api.github.com; 77 issues/PRs mention "quest" since 2023-01-01)

G1. [2] Browser/OS update caused unstable fps in immersive mode on Quest 2/3 in A-Frame 1.6.0 AND in Meta's own WebXR First Steps; playing a sound temporarily stabilised it ("audio unlock performance" bug). Fixed by Quest Browser 36.0.
 - Issue #5598 "1.6.0 Oculus Browser performance regression", matteogara, 2024-10-29. https://github.com/aframevr/aframe/issues/5598
 - matteogara: "Oculus browser / Quest 3: < 80fps (unstable)" vs "Wolvic / Quest 3: 90fps (stable)"; measured with OVR Metrics and aframe-fps-counter-component.
 - mrxz 2024-11-01: "don't fire the gun as that produces a sound effect which temporarily resolve the issue."
 - signorpipo 2024-11-01: "Thanks for reminding me about the audio \"unlock performance\" bug"
 - cabanier (Meta browser team) 2024-11-01: "it's 100% us"; 2024-11-11: "Version 36.0 went out to 100% today and should have a fix"; mrxz confirmed 2024-11-12.
 - Count: 1 thread, 4 people (reporter, mrxz, signorpipo, Meta engineer). Lesson: a fps drop can come from the browser/OS, not our code; compare with Wolvic and with Meta's First Steps sample before blaming the scene. Class (a) for "browser-side regressions happen"; the specific bug is fixed (2024).

G2. [2] A-Frame 1.7.0 regression on Quest 2: after exitVR the page showed an empty scene; cause in the supermedium three.js fork (r173), fixed on master 2025-02-28. Maintainer: "I had tested this on emulator. I should have tested on device."
 - Issue #5678 "Bug on exitVR (quest 2)", Roxcsas, 2025-02-25. https://github.com/aframevr/aframe/issues/5678
 - Lesson: emulator passing is not device passing (maintainer's own words). Check whether the fix is in 1.7.1/1.8.0: unverified here (fixed on master 2025-02-28; 1.7.1 released later - check release notes).

G3. [2] Meta Immersive Web Emulator (IWER/extension 1.5.0) broke with three.js r173+ in Chrome/Edge 147: "Failed to construct 'XRWebGLBinding'". Workaround: pin super-three 0.172.0 in an importmap; real fix in the emulator.
 - Issue #5816, jackdigitalinsight, 2026-04-19; vincentfretin 2026-04-20: "The real issue is in immersive web emulator"; links meta-quest/immersive-web-emulator issues 79 and 80. https://github.com/aframevr/aframe/issues/5816
 - Count: 1 A-Frame thread + 2 emulator issues + three.js #31432 (not opened yet). Relevant: our GitHub test uses IWER.

G4. [2] Quest 3: when hand-tracking + tracked-sources are requested, a Touch controller can move from inputSources to trackedSources; A-Frame then fires controllerdisconnected and freezes the model. Maintainer: A-Frame does not request tracked-sources by default, so this is a feature gap.
 - Issue #5856, Harisimo, 2026-09-23 (open). https://github.com/aframevr/aframe/issues/5856
 - mrxz 2026-09-24: "Out of the box the `tracked-sources` feature isn't requested when creating the XR session."
 - Lesson: do not add 'tracked-sources' to optionalFeatures unless the code handles it. Class (b).

G5. [2] Report of "session.requestAnimationFrame is not a function" on re-entering XR: maintainer could not reproduce on Quest 3 and called the report (apparently automated) inaccurate.
 - Issue #5845, 2026-06-30. https://github.com/aframevr/aframe/issues/5845 ; mrxz: "I'm unable to reproduce the issue on a Quest 3 using the given example". Class (c): contradicted.

G6. [1] SpaceWarp (Application SpaceWarp) for WebXR: open PR adds renderer flag spaceWarp + multiviewStereo; needs motion-vector materials in a three fork; renders the app at half fps.
 - PR #5795, KooIaIa, 2026-03-24 (open). https://github.com/aframevr/aframe/pull/5795 ; mrxz: "With how long Space Warp has been available on Quest, it's long overdue for A-Frame to have built-in support." Not in 1.8.0 (open PR). Class (b), experimental.

G7. [1.7 multiview + 1.4 canvas text] With renderer multiviewStereo, any texture upload in the middle of a frame (after rendering started) is discarded: content rendered after a mid-frame texture upload becomes invisible. A-Frame's three fork defers texture uploads to the end of render, which works only if the frame is drawn with ONE renderer.render() call. Relevant to us: canvas-panel texture updates must happen before render (e.g. in tick), and no extra render passes.
 - Issue #5260 "Text not rendering in VR mode", comments 2024-01-31/02-01. https://github.com/aframevr/aframe/issues/5260
 - coderofsalvation (Quest 2): "When removing `multiviewStereo` it works as expected."
 - mrxz 2024-02-01: "With multiview you're not allowed to perform any texture operations once rendering has started."; the fork's workaround "works for as long as a single frame is rendered with a single `renderer.render(...)` call."
 - mrxz could not reproduce with a plain a-text + multiview on Quest 2/3. Count: 1 thread, 2 people + A-Frame docs quoted in thread (renderer docs). Class (b) with docs backing.

G8. [1.6 transparency/post-processing, 1.8 foveation] Post-processing on Quest is very expensive and breaks fixed foveation: Meta's browser engineer measured a bloom example at 17 fps on Quest 2 with many resolves per frame; "Ideally, there would only be 2 resolves and there would be code to maintain foveation."
 - PR #5648 "Post-Process example", cabanier 2025-02-04. https://github.com/aframevr/aframe/pull/5648
 - CodyJasonBennett same day: tweak the bloom kernel, upsample, or reduce target framerate. Class (a) within the thread (Meta engineer + three.js contributor agree it is costly). For us: no post-processing.

G9. [4 pinch] A-Frame 1.5.0 changed hand-tracking-controls pinch thresholds: one pinch fired several pinchstarted/pinchended events (Quest Pro, reproduced on Quest 3 and Quest 1). Fix PR #5609 "Use simple pinch end threshold avoiding repeated pinch starts" (2024-11-14, merged - in 1.7.0? unverified).
 - Issue #5505, zakaton, 2024-04-03 (still open). https://github.com/aframevr/aframe/issues/5505 ; mrxz: "the end threshold should never dip below the start threshold"; dmarcos: the change addressed objects staying grabbed after release ("stickiness").
 - e10mu 2024-07-14 Quest 1: "sometines 1 hit, sometimes 2 or 3 hits at once". Count: 1 thread, 4 people. Class (a). Lesson: debounce pinch events in own code even on 1.8.

G10. [2 audio] Autoplay policy is "one of the top 5 most asked questions ever" (dmarcos, A-Frame maintainer); A-Frame has no built-in unlock; the user must start audio by a gesture.
 - Issue #5216 "Handle video / audio auto play", 2023-01-12 (open). https://github.com/aframevr/aframe/issues/5216 . Class (b) from the maintainer; docs FAQ backs it (aframe.io FAQ "why does my video not play", linked in thread).

### Meta Community Forums (communityforums.atmeta.com) - WebFetch gets HTTP 403; read in own browser tab, no login needed
Note: the WebXR Development board says "This forum is archived and read-only. To submit a forum post, please visit our new Developer Forum." (seen 2026-10-11 on thread 1306221).

M1. [2 + 4 haptics] After OS v2.1 (Quest Browser v2.1.1034) WebXR haptics went to the wrong controller (right -> left vibrates; left -> none) in an A-Frame game; Wolvic fine. Meta's investigation: "Completed", 2 similar submissions, "An update has shipped and is now live 3/9/26".
 - Forum: "Browser WebXR controller vibration bug after updating to OS v2.1", yvoostylez, ~2026-03 ("7 months ago" on 2026-10-11). https://communityforums.atmeta.com/discussions/OtherTroubleshooting/browser-webxr-controller-vibration-bug-after-updating-to-os-v2-1/1368669 ; quote: "When the right controller should vibrate, the left one does"
 - Meta investigation page (official): https://developers.meta.com/horizon/feedback/vr/investigations/938861405320634/ ; "This issue is browser-specific, as the same WebXR applications work correctly in the Wolvic browser."
 - Count: 1 forum thread + Meta's page counting 2 similar submissions. Class (a) (Meta confirmed). Lesson: keep haptics optional; test after each Quest OS update; Wolvic as a control.

M2. [2] Quest Browser update stopped a LAN-served (self-signed https) hand-tracking page (Vuer) from loading; Wolvic loaded it but showed controllers instead of hands. No reply (archived).
 - "[WebXR Hand Tracking] Quest 3 Browser Update Breaks Vuer Integration? Page Unresponsive....", RebeL_717, ~2025 ("1 year ago"). https://communityforums.atmeta.com/discussions/WebXRDevelopment/webxr-hand-tracking-quest-3-browser-update-breaks-vuer-integration%EF%BC%9F-page-unrespo/1306221 . Class (b), unresolved; low relevance (we serve from GitHub Pages over real https).

## Who the sources are (checked 2026-10-11 by GitHub contributor lists / commit counts via api.github.com, not by reputation)
Ranking asked by the owner: (a) shipped a WebXR title on the Store or known WebXR title, (b) maintainer/core contributor of A-Frame, three.js, aframe-extras, IWER/IWSDK, (c) Meta Quest Browser / WebXR team; anonymous one-offs last.
- dmarcos (Diego Marcos): A-Frame contributor #3 by commits (1375) in aframevr/aframe; closes and fixes issues (#5678 fix commit). [b]
- mrxz (Noeri Huisman): A-Frame contributor #6 (85 commits); 20 commits in mrdoob/three.js (latest 2025-07-22 "WebGLRenderer: Support MRT for 2d array textures"). [b]
- vincentfretin: A-Frame contributor #5 (167); aframe-extras contributor #2 (139). [b]
- cabanier (Rik Cabanier): 70 commits in mrdoob/three.js (latest 2026-08-20); 1 commit in facebook/immersive-web-sdk; in #5598 he speaks for the Quest Browser: "The Quest browser team investigated this issue ... We're working on a fix", "it's 100% us". [c] + [b three.js]
- CodyJasonBennett: 46 commits in mrdoob/three.js (latest 2025-09-10). [b three.js]
- felixtrz: top contributor of meta-quest/immersive-web-emulator (84) and facebook/immersive-web-sdk (214). [b IWER/IWSDK]
- donmccurdy: aframe-extras #1 (566), A-Frame #7 (83). [b]
- signorpipo, matteogara, yvoostylez, Harisimo, coderofsalvation, zakaton, e10mu: practitioners, role not checked = rank last unless a title is named.

Official backing for G7/G8 (A-Frame 1.8.0 docs, local copy objekt-files/docs-engine/aframe-1.8.0/docs/components/renderer.md):
 - foveationLevel default 1 ("from 0 (min) to 1 (max)"), "can be set dynamically"; multiviewStereo default false: "Performance improvement for applications that are CPU limited and draw count bound ... discards the frame buffer if there are other texture operations during rendering."
 - highRefreshRate default false; table says Quest 2 default 72 Hz, high 90 Hz (no row for Quest 3 / 120 Hz in the doc).

### discourse.threejs.org (read via its public JSON, /t/<id>.json)

D1. [1.4 canvas text] A CanvasTexture redrawn by window.requestAnimationFrame freezes once the immersive session starts on Quest 2; redrawing inside the renderer's XR loop (setAnimationLoop) works. Live working examples of 2D-canvas labels updated in XR on Quest 2 given.
 - "Animated <canvas> > canvasTexture > dont work in WebXr, why?", LagenceCree, 2025-04-24. https://discourse.threejs.org/t/animated-canvas-canvastexture-dont-work-in-webxr-why/81587
 - Reporter's own conclusion 2025-04-25: "a part of my previous function was relyng with… requestanimationFrame". PavelBoytchev (author of the virtual-robotics demos) shows canvas labels updating in XR.
 - manthrax claims the animation loop "gets called twice. Once for each eye" - unverified, not checked against three.js source; treat as doubtful.
 - Lesson for A-Frame: update canvas panels in a component tick (runs in the XR frame), never in window.requestAnimationFrame or setInterval-driven redraws expecting a frame. Class (b) + the reporter confirms; MDN/WebXR spec background, not opened.

D2. [1.8 foveation] three.js sets foveation to maximum by default (1.0); on Quest 2/3 a user saw a visible darker/blurrier square edge over ~80% of the frame; setFoveation(0) removed it, below ~0.34 it vanished.
 - "WebXR, Oculus Browser, Semitransparent dark square(s) overlay?", sylwesterdigital, 2023-11-14. https://discourse.threejs.org/t/webxr-oculus-browser-semitransparent-dark-square-s-overlay/58146
 - PavelBoytchev quotes three.js source "// Set default foveation to maximum. let foveation = 1.0;" and MDN: FFR is "less [useful] for high-contrast ones such as text". A-Frame 1.8 docs: foveationLevel default 1 (same). Class (b) with docs backing. Lesson for us (text on panels): try foveationLevel lower (e.g. 0.3-0.5) and look at panel edges in the headset - exact value unverified.

D3. [1.7 multiview] three.js upstream has no OCULUS_multiview (2025-03): a developer hand-merged it into his own three fork because supersampling to fight aliasing on Quest cost frame rate. A-Frame ships multiview via its own three fork (renderer multiviewStereo).
 - "OCULUS_multiview extension support added to three for Quest performance", danrossi, 2025-03-27, no replies. https://discourse.threejs.org/t/oculus-multiview-extension-support-added-to-three-for-quest-performance/80202 . Class (b).

D4. [2] Native media/quad layers + WebGPU multiview: video textures flash with WebGPURenderer multiview; layered demos crashed/froze the Quest 2 browser for another user. Low relevance (we use no video layers).
 - "PlaneGeometry projection in WebXR has focus issues on Quest 2/3", danrossi / PavelBoytchev, 2025-10-30..11-03. https://discourse.threejs.org/t/planegeometry-projection-in-webxr-has-focus-issues-on-quest-2-3/87821 . Class (b).

### Reddit: BLOCKED for me
- api (www.reddit.com/.../search.json) returns an HTML block page to curl; the browser pane refuses: "https://old.reddit.com is not allowed due to safety restrictions" and the same for reddit.com (2026-10-11). Web search did not surface Reddit threads either. Reddit = not read; goes to the owner list.

### Dev blogs and other engine forums
B1. [1 + 4] dmnshd (studio; founder says shipped WebXR games since 2018; titles Shed Racer, Geobeat, Barista Express; uses three.js, Wonderland Engine, IWSDK - not A-Frame; no Store release stated). Rank: practitioner who ships browser VR games (no Horizon Store title confirmed).
 - "Behind the Scenes: How We Build WebXR Games at dmnshd", 2026-05-08. https://dmnshd.gg/blog/behind-the-scenes-building-webxr-games ; "On Meta Quest, we also disable certain post-processing effects (like bloom) during VR sessions."; also lower shadow map resolution; "comfort always trumps graphics". Agrees with G8.
 - "Hand Tracking in WebXR...", 2026-06-10. https://dmnshd.gg/blog/webxr-hand-tracking ; two thresholds for pinch (start tighter, release looser) to stop flicker - same lesson as G9 (A-Frame #5505); "Holding an arm out at chest height gets exhausting within a minute or two." Hand tracking must be requested as a session feature. Numbers for thresholds not given.
 - Count with G9: 2 independent sources on pinch hysteresis. Class (a).
 - (WebFetch summaries of the pages; quotes as returned by the fetch tool.)

B2. [6] PlayCanvas forum "[SOLVED] WebXR to Meta Quest Store?", khaelou, 2026-02-27/28. https://forum.playcanvas.com/t/solved-webxr-to-meta-quest-store/41966
 - "Instead of Cordova, I used Meta's Bubblewrap to create a valid TWA (Trusted Web Activty) from my PWA", side-loaded on Quest 3S via MQDH, with Meta's snippet "to bypass WebXR's user interaction mandate". No Store review outcome reported. Class (b), not a shipped title.
 - Official: Meta PWA docs say a click on the PWA icon counts as the user action for a WebXR session; A-Frame example checks window.getDigitalGoodsService then scene.enterVR() (from search snippet of https://developers.meta.com/horizon/documentation/web/pwa-webxr/ - page not opened yet).

### Stack Overflow (api.stackexchange.com, tags aframe/webxr, since 2022-01-01): thin; most hits 2022 = STALE?, few answered. Nothing for "performance" in either tag since 2022.
S1. [1.4 canvas] window.requestAnimationFrame does not fire while a WebXR session runs on Quest, so a canvas drawn by a library that uses it (pdf.js) updates only once in VR; fix: render without rAF (pdf.js intent "print").
 - "A-Frame + pdf.js: unable to update canvas texture twice, in VR mode only", answer by Piotr Adam Milewski (rep 14705, frequent A-Frame answerer), 2022-03-04, accepted. https://stackoverflow.com/questions/71344700 ; "requestAnimationFrame doesn't fire when WebXR is engaged". STALE? (2022) but re-confirmed 2025 by D1. Count: 2 independent threads. Class (a).
S2. [1.6 extra passes] Rendering to a RenderTarget during VR caused flicker in A-Frame; fix: set renderer.xr.enabled=false (and shadowMap.autoUpdate=false) around the off-screen render, then restore (Mugen87's advice quoted).
 - "A-Frame - rendering to a RenderTarget causes screen flickering, in VR mode only", answer by Synn, 2022-03-17, accepted. https://stackoverflow.com/questions/71491372 . STALE? (2022). Class (b). Ties to G7: with multiview, extra render passes break.
S3. Unanswered: "A-Frame: what to do when WebGL context lost on Oculus Quest browser (in VR)", 2022-03-19. https://stackoverflow.com/questions/71535280 - not found: no answer.

D5. [1.4 text + 1.9 framebufferScaleFactor] Canvas-texture UI on Quest 3 looked blurry; troika SDF text "created jarring shimmer effects at a distance and weren't actually much sharper"; fix: renderer.xr.setFramebufferScaleFactor(1.35) - "XRWebGLLayer.getNativeFramebufferScaleFactor() reported a value of 1, which turned out to be wrong."
 - "VR Web Applications, Font rendering issues, bitmap vs. SDF", HorstW, 2026-08-16 (no replies). https://discourse.threejs.org/t/vr-web-applications-font-rendering-issues-bitmap-vs-sdf/93545
 - Who: builds a three.js canvas-UI framework; reference app "Veer Index" (companion app to a novel), earlier a Splunk VR demo; no Store title. Rank: practitioner, one report. Class (b).
 - Cost not measured by him: a 1.35 scale renders ~1.82x the pixels (1.35^2) - GPU cost on Quest 2/3S unverified. A-Frame 1.8 docs (local copy) have no framebufferScaleFactor setting (grep: none); it would go through sceneEl.renderer.xr.setFramebufferScaleFactor before the session - unverified for A-Frame.
 - Directly relevant to us (text drawn on canvas panels).

### Debugging tools (topic 3)
T1. [3] OVR Metrics Tool cannot record CSV for Browser/WebXR (HUD only). Meta forum, "OVR Metrics Tool: No CSV Recordings for WebXR Application", drizzle.575836, ~2025 ("1 year ago"); reply by adekker marked as solution: "CSV recording is currently not supported for Browser (including webXR), but something our teams have flagged for exploration." https://communityforums.atmeta.com/discussions/WebXRDevelopment/ovr-metrics-tool-no-csv-recordings-for-webxr-application/1271550 . adekker's role at Meta: unverified (speaks for "our teams"). Class (b).
 - G1 shows OVR Metrics HUD + aframe-fps-counter-component used together by a practitioner (2024).
 - Official: Meta "WebXR perf tools" page lists OVR Metrics HUD and ovrgpuprofiler (from search snippet; page not opened): https://developers.meta.com/horizon/documentation/web/webxr-perf-tools/
T2. [1.10] 120 Hz on Quest 3 (Unity, 2023, STALE? and not WebXR): a dev saw only 72/80/90 offered on Quest 3. https://communityforums.atmeta.com/discussions/dev-quest/120hz-support-brokenmissing-on-quest-3/1108973 . Low relevance; A-Frame highRefreshRate table stops at 90 Hz (docs). WebXR 120 Hz on Quest 3 via supportedFrameRates: not found in forums.

### Audio (topic 2)
A1. [2 audio] On Quest 3 Browser the audio engine can be unlocked by the same click as "Enter VR"; a beginner's sound stayed silent because his own unlock code was wrong, Babylon's maintained engine unlocked on the Enter VR press. Before the fix the page showed a muted-speaker icon top-left that had to be clicked.
 - Babylon.js forum "No sound in my little XR test?", educa, 2025-09-22..25. https://forum.babylonjs.com/t/no-sound-in-my-little-xr-test/60607
 - docEdub (Babylon.js audio engine developer - role from Deltakosh's cc; not verified by contributor list) 2025-09-24: "When the \"enter vr\" button is pressed, the audio engine unlocks and the sound plays as exepected." Class (b) for Quest specifics; agrees with A-Frame #5216 (gesture needed). For A-Frame: resume THREE's AudioContext inside the Enter VR click (or any click) - A-Frame has no automatic unlock (G10).
 - Related G1: playing a sound once changed Quest Browser perf in 2024 (fixed in browser 36.0).

### Shipping (topic 6)
P1. [6] Meta forum "Submission Process for PWAs", MCHoff, ~2025 ("1 year ago"), no reply, archived: PWA checkbox missing for the account owner; PWA distribution said to be limited to developers with apps already on the Store. https://communityforums.atmeta.com/discussions/WebXRDevelopment/submission-process-for-pwas/1260455 . Class (b), unresolved. Current rules: Meta's pwa-packaging page (updated July 2026 per search snippet; not opened by me) https://developers.meta.com/horizon/documentation/web/pwa-packaging/
P2. [6] Meta investigation (official) "Oculus Browser Crashes on WebXR PWA Launch": "intermittently crashes when launching a WebXR Progressive Web App (PWA) built and packaged using Bubblewrap, resulting in an infinite loading screen that requires a headset reboot"; status "Investigating", 1 submission, created ~2026-09-25 ("16 days ago" on 2026-10-11). https://developers.meta.com/horizon/feedback/vr/investigations/1492297682953432/ . Class (b), open.
P3. [6] Shipped title: Elysian (WebXR wave shooter), "the first WebXR game on Quest's Horizon Store", by Felix Z (works at Meta Reality Labs), packaged as a PWA with Bubblewrap, free, web version stays at elysian.fun; "tiny 8MB download that installs almost instantly". UploadVR, 2025-08-07. https://www.uploadvr.com/elysian-is-the-first-webxr-game-on-quests-horizon-store/ (news article, not a forum; engine not named there). Identity link "Felix Z" = GitHub felixtrz (top contributor of IWER and IWSDK): plausible, unverified.
P4. [6] Meta forum "Uploading PWA (Progressive Web Apps) builds to the Meta Store", jandev, ~2023 ("3 years ago", STALE?): ovr upload error "Application XXXXXXX is not configured as a progressive web application"; guide said an app must already be on the Store; no answer. https://communityforums.atmeta.com/discussions/dev-quest/uploading-pwa-progressive-web-apps-builds-to-the-meta-store/998690 . With P1: 2 threads where the PWA option was missing on the dashboard (2023, ~2025). Class (a) for "the PWA path was gated/confusing"; current state per Meta's pwa-packaging page (July 2026) unverified by me.

### IWER / Immersive Web Emulator (topic 3) - github.com/meta-quest/immersive-web-emulator
E1. [3] Chrome 147 (2026-04) added native WebXR Layers; three.js then takes the layers path and the Immersive Web Emulator extension (1.5 and 2.0) fails: "Failed to construct 'XRWebGLBinding': parameter 1 is not of type 'XRSession'". The fix exists in the IWER runtime (commit ab062f3) but the extension build lagged; workarounds: Chrome flag "WebXR Layers" = Disabled + restart, or mrxz's rebuilt extension v2.2.0, or pin three r172.
 - Issue #79 "Failed to construct 'WRWebGLBinding'", saori-eth, 2026-04-17 (open). https://github.com/meta-quest/immersive-web-emulator/issues/79 ; mrxz 2026-04-18: "The IWER, however, does not support WebXR layers"; then "the required changes have already been made in IWER ... all that would be needed is a new build of the extension".
 - Issue #80, jjunk1989, 2026-04-18 (open): fix = chrome://flags "WebXR Layers" Disable, restart. https://github.com/meta-quest/immersive-web-emulator/issues/80 ; Utopiah 2026-06-01: "Same for AFrame. Works well with 1.4.x but not with 1.7.x which relies on ThreeJS 173." hybridherbst: "right now the emulator is unusable without adjusting Chrome flags".
 - Count: 3 threads (IWE #79, #80, A-Frame #5816), 6+ people. Class (a). Relevant to our GitHub test with IWER: check which IWER version the test uses (runtime with the fix vs extension). mrxz = A-Frame contributor (see list).

### Interaction and locomotion (topics 4-5): c-frame repos
I1. [4 grabbing] Since A-Frame 1.5.0 the engine has its own `grabbable` component (hand-tracking-grab-controls + obb-collider), which clashes with super-hands' `grabbable`; the super-hands repo had to document how to use it "with aframe 1.5.0 and onward"; users rename super-hands' to `graspable`.
 - PR #244 "Add instruction to use superhands with aframe 1.5.0 and onward", jinglechen2287, 2025-01-26, merged by vincentfretin: "How to get Superhands to work with the A-Frame 1.5.0 and onward has been undocumented." https://github.com/c-frame/aframe-super-hands-component/pull/244
 - Issue #240 "Replacing super-hands' \"grabbable\" to \"graspable\"", 2024-05-26: workaround = re-register as 'graspable'. https://github.com/c-frame/aframe-super-hands-component/issues/240
 - Repo activity since 2025: mostly dependabot bumps; one Ammo.js PR (2025-10). Count: 2 threads. Class (a). Official: A-Frame 1.8 docs have hand-tracking-grab-controls and obb-collider pages. Lesson: for a few grab interactions, own code or A-Frame's built-ins avoid the name clash; super-hands is low-maintenance.
I2. [5 locomotion] aframe-extras movement-controls on Quest 3: a reported loss of thumbstick movement after A-Frame 1.5->1.6 was the user's own setup ("something was wrong with my aframe1.6 implementation"); vincentfretin: worked on Quest 3 with aframe 1.6.0 + aframe-extras 7.5.2 (AdaRoseCannon's aframe-xr-boilerplate).
 - Issue #454, holo05, 2024-12-23. https://github.com/c-frame/aframe-extras/issues/454 . Class (c) for the bug claim (withdrawn by reporter).
I3. [5 room-scale] With room-scale walking the camera leaves the rig's centre, so navmesh clamping fails (you can walk through walls without using the stick); fixed in aframe-extras 7.7.0 (2026-04-01) - movement-controls now clamps the camera's room-scale position in VR.
 - PR #464 "Room-scale movement synchronization", KickSuch, 2025-12-10..2026-04-01. https://github.com/c-frame/aframe-extras/pull/464 ; vincentfretin: "I released 7.7.0 with the changes." He tested in a 2 m² space on Quest 3; same idea as aframe-blink-controls PR #27 (teleport). Class (a) (contributor + maintainer agree). Relevant: our base tier is roomscale 1.8x1.8 m.

### Babylon.js forum (other engine, same browser) - draw calls, GC, picking
F1. [1.1 draw calls + 1.2 GC + 4 rays] Babylon.js WebXR maintainer RaananW: expensive part on CPU is controller ray picking against big pickable meshes ("it will iterate the entire array to find the picked point"; quick test: point the rays at the sky); and "we are rendering twice. once for each eye" (2026-04-27). Practitioners: "it's draw calls that are the real killer not the mesh size" (Si_Barrick 2026-03-18); "make sure your render loops arent allocating a lot of objects that need to be GCed" and "there is one draw call per material, heavy use of texture atlases seems to be a must" (64jcl, 2026-03-23 / 04-27).
 - "Trying to improve performance WebXR VR", max.t, 2026-03-13 (Pico 4 standalone). https://forum.babylonjs.com/t/trying-to-improve-performance-webxr-vr/62782
 - "Need tips on performance improvements in WebXR VR", 64jcl, 2026-04-26 (PCVR). https://forum.babylonjs.com/t/need-tips-on-performance-improvements-in-webxr-vr/63271
 - Weight: RaananW = Babylon.js core (role from the forum's own cc by Cedric; not checked by contributor list). Others: hobby devs on PCVR/Pico, not Quest Browser - low weight. Count for "draw calls/materials dominate": 2 forum people + Meta docs (search snippet: "1000 individual triangles as unique draw calls would likely cause an app to run below 72 fps", https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/ - not opened by me). Class (a) but mostly not Quest-specific.
 - A-Frame equivalents (official, local docs 1.8.0): raycaster `objects` "If not specified, all entities will be tested" and `interval` "Higher number is better for performance" (components/raycaster.md); best-practices.md "Minimizing Garbage Collection": "For VR, garbage collection may cause dropped" frames; "In component tick handlers, be frugal on creating new objects."

### Browser/OS updates that broke WebXR (topic 2), Meta forums
M3. [2] Quest 3S OS v2.5 (2026-07-08, build 3594280027800610): a WebGL WebXR client (NVIDIA CloudXR.js) failed at render-context init; same URLs fine on desktop Chrome; Wolvic on the same headset also failed ("may point to an OS-level graphics/WebXR runtime change"). No Meta answer visible.
 - New Developer Forum (Questions & Discussions, tag WEBXR): "Quest 3S v2.5 update broke WebXR/WebGL: render init fails in Browser (regression)", pinkcrocodilepink, ~2026-07 ("3 months ago"). https://communityforums.atmeta.com/discussions/Questions_Discussions/quest-3s-v2-5-update-broke-webxrwebgl-render-init-fails-in-browser-regression/1377532 . Class (b), unresolved; not A-Frame.
M4. [2] "Meta Quest browser shows a black screen for some webxr apps in latest patch", ayyteeee, ~2024 ("2 years ago"): the official immersive-web room-scale sample stopped working after a browser update; no replies. https://communityforums.atmeta.com/discussions/dev-quest/meta-quest-browser-shows-a-black-screen-for-some-webxr-apps-in-latest-patch/1224303 . Class (b).
 - Pattern across G1, G2, M1, M2, M3, M4 (6 threads, 2024-2026): a Quest OS/Browser update breaks something that worked; the check used each time is the same page in Wolvic and/or Meta's own samples. Class (a) for the pattern. [Checked 11.10: G2 (#5678) was A-Frame's own bug after its bump to three r173, and M3 a system update, so the pattern holds on five threads: four browser updates, one system update.]
Note on the forum itself: the old boards (WebXRDevelopment, dev-quest) are archived read-only; new posts go to "Questions & Discussions" with tags (WEBXR, IMMERSIVE WEB SDK). The forum's search page returned "No results found" in my tab for "webxr quest browser" (script-built); browsing it needs a person.

### Hands and controllers together (topic 4), A-Frame issues; fix-in-release checked with the GitHub compare API (2026-10-11)
Release dates (api releases): v1.5.0 2023-11-14, v1.6.0 2024-05-23, v1.7.0 2025-02-20, v1.7.1 2025-04-01, v1.8.0 2026-06-24.
H1. [4] Switching hands <-> controllers on Quest made hand or controller models vanish (rays still tracked); "The problem resolves itself on Quest when going in and out of the Oculus menu." Cause: race in meta-touch-controls visibility toggling; vincentfretin fixed it 2025-12-15 (closing commit 420b1e8) - that commit IS in v1.8.0 (compare: behind 92, ahead 0). Also fixed the same in handy-controls release 3.1.13.
 - Issue #5757, KooIaIa, 2025-09-01; electrum-bowie: "Not having correct controller rendering is a huge problem". https://github.com/aframevr/aframe/issues/5757 . Count: 3 people + vincentfretin saw it with handy-controls. Class (a). For us on 1.8.0: fixed.
H2. [4] A-Frame 1.6.0: oculus-touch-controls + hand-tracking-controls on one entity hid the controller at start (hand-tracking-controls hides its entity until hands appear); dmarcos "improved controller switching across the board" on master 2024-10-25 (=> 1.7.0). Meta's runtime: non-primary inputs move from inputSources to trackedSources (quoted from Discord by dmarcos).
 - Issue #5584, smeybi, 2024-10-15. https://github.com/aframevr/aframe/issues/5584 ; mrxz bisected to commit "Hide hand tracking controls entity when there's no hand tracking available". Lesson: put hand-tracking-controls and meta-touch-controls on separate entities (as in #5757's repro). Class (a).
 - A-Frame has a Discord (dmarcos 2024-10-21: "Some info from Discord"); no public archive found.
G2 update: exitVR fix commit 2cca58c is after v1.7.0 and inside v1.7.1 (compare: behind 36) => fixed in 1.7.1 and 1.8.0.
G9 update: pinch fix PR #5609 merged 2024-11-18 => in 1.7.0+ (fixed pinch-end threshold larger than pinch-start; mrxz: "Main goal is to get the pinching behaviour in a reliable and working state again").

### Hacker News: not found. Algolia HN API (stories since 2023, >5 comments) for "webxr quest", "a-frame vr", "webxr game": only a black-hole WebXR Show HN (2026-07-23, https://news.ycombinator.com/item?id=49021270) with no Quest performance content, and "The future of VR is web based" (2024-02-16, 7 comments, not opened).

### Maintainer's own dev log (mrxz = Noeri Huisman, fern.solutions; A-Frame contributor #6)
N1. [1.8 foveation + MSAA] On Quest 3, fixed foveated rendering applies only to the WebXR default framebuffer (XRWebGLLayer.framebuffer); an engine that renders to its own back buffer (PlayCanvas with MSAA) loses FFR: PlayCanvas warns "Fixed Foveation is ignored. Disable anti-aliasing for it to be effective". Fix: WebXR Layers foveateBoundTexture + WEBGL_multisampled_render_to_texture; ~60 MiB GPU memory saved ("theoretically saving ~67MiB (~60MiB savings were observed)"); "Enabling FFR shows the real performance gain." Target: "maintaining 90 FPS is real challenge".
 - "Foveated rendering and MSAA in PlayCanvas", Noeri Huisman, 2026-04-15. https://fern.solutions/dev-logs/2026-playcanvas-webxr/ (WebFetch summary; charts are images, no absolute ms).
 - Agrees with G8 (cabanier: keep foveation, avoid extra resolves) and D2. Count: 3 sources that anything drawn off the XR framebuffer (post-processing, own back buffer) loses foveation and costs bandwidth. Class (a). For A-Frame/three: rendering straight to the XR framebuffer keeps FFR - A-Frame-specific measurement not found.
N2. [5 comfort] mrxz's aframe-locomotion: smooth locomotion, snap turning "with optional fade transitions", "Vignette when moving"; teleport not implemented; last push 2024-06-03, 0 open issues. https://github.com/mrxz/aframe-locomotion ; blog https://fern.solutions/dev-logs/aframe-adventures-01/ (not opened). Teleport options: aframe-blink-controls (jure; referenced by vincentfretin in aframe-extras #464). Forum reports on comfort beyond Meta's guidelines: not found (Reddit unreadable).

D6. [1.4 canvas text, not VR-specific] After three r152->r165 (color management) canvas text looked grey/blurrier; fixed by setting the canvas texture's colorSpace to THREE.LinearSRGBColorSpace instead of SRGBColorSpace. "After Migration Canvas Text More Blurry", Ataberk_Demirtas, 2024-06-07..08-01. https://discourse.threejs.org/t/after-migration-canvas-text-more-blurry/66540 . Class (b), one report, desktop. Other blur thread (2025-01-08, https://discourse.threejs.org/t/canvastexture-is-blurry-meanwhile-the-origin-canvas-is-not/76171): LinearFilter "get little better", unresolved.

## Parts with nothing found in forums (2026-10-11)
- 1.3 KTX2 on Quest: no practitioner thread since 2023 (A-Frame issues about KTX2 are 2021-2022 feature work; three.js forum KTX2 threads are loader errors). Not found.
- 1.5 shadows: only dmnshd (B1) "reduce shadow map resolution"; no Quest measurements found.
- 1.6 transparency (sortTransparentObjects / overdraw): no Quest practitioner thread found; A-Frame docs only.
- 1.10 72/90/120 Hz in WebXR on Quest 3: no WebXR forum thread found (only a 2023 Unity thread T2). A-Frame docs: highRefreshRate 72->90 on Quest 2.
- 1.7 multiview measured gain in A-Frame: not found (Meta's Unity docs claim ~half the draw-call CPU; not A-Frame).
- 3 metavr CLI / Perfetto for WebXR: no forum thread found.
- 4 poke interaction in A-Frame: no thread found.
- 5 comfort beyond Meta's guidelines: Reddit unreadable; nothing else found.
- Reddit (all five subreddits): blocked for me.
- A-Frame Slack/Discord archive: none public found (Discord exists per #5584).

## Summary by agreement
(a) agreed by several (2+ independent threads or maintainer + reporter):
 - Quest OS/Browser updates break working WebXR pages; check against Wolvic / Meta samples (G1, G2, M1, M3, M4).
 - window.requestAnimationFrame stops in an immersive session; update canvas textures in the XR frame (tick) (S1, D1).
 - Multiview: no texture uploads mid-frame, one render() per frame (G7 + A-Frame docs).
 - Post-processing / own back buffer kills foveation and costs a lot on Quest (G8, N1, B1).
 - Pinch needs hysteresis (end threshold > start); fixed in A-Frame 1.7.0 (G9, B1).
 - Hand<->controller switching: models vanished; fixed in 1.8.0 (H1, H2).
 - super-hands clashes with A-Frame's own `grabbable` since 1.5.0 (I1).
 - Immersive Web Emulator broken by Chrome 147 WebXR Layers + three r173 (E1, G3).
 - Room-scale + navmesh needs aframe-extras 7.7.0 (I3).
 - Draw calls / materials dominate CPU (F1 + Meta docs) - mostly non-Quest reporters.
(b) one person's report: D5 (framebuffer scale 1.35 for crisp canvas text on Quest 3; troika shimmer), D2 (default foveation 1 makes a visible edge square), T1 (OVR Metrics no CSV for WebXR), A1 (audio unlock on Enter VR), P2 (Bubblewrap PWA launch crash, open), M2, D6, S2, G4, G6.
(c) contradicted: G5 (re-enter XR rAF error, maintainer could not reproduce), I2 (thumbstick regression withdrawn by reporter), D1's side claim that the loop runs twice per frame (unverified, doubtful).

P5. [6, official, cited by B2] Meta "Getting Started with WebXR PWAs" (last updated 2026-07-22): A-Frame landing page listener: if window.getDigitalGoodsService !== undefined (inside a PWA), call scene.enterVR() when scene.hasLoaded or on 'renderstart'; FAQ: "clicking the PWA app icon is considered user action to create a WebXR session for PWAs." https://developers.meta.com/horizon/documentation/web/pwa-webxr/ (WebFetch summary). The VRC Quest.Performance.3 startup-time point is NOT on this page (it came from a search summary; source unverified).

## Access log
- communityforums.atmeta.com: WebFetch -> HTTP 403; readable in own browser tab without login (archived boards read-only; new "Questions & Discussions"). Its search page gave "No results found" (script-built).
- reddit.com / old.reddit.com: blocked (browser pane: "not allowed due to safety restrictions"; JSON API returns a block page).
- GitHub, discourse.threejs.org, forum.babylonjs.com, Stack Exchange, HN Algolia: read through their public APIs.
