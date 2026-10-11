# What the headset gives an experiment

The game runs in the Quest Browser (WebXR). Every capability below has a status:
**our headset** (checked on the owner's Quest 3), **Meta** (official Meta page), **press**
(reliable news, not Meta), **unverified**. Feature-level checks inside a session need a
button press in the headset: open `tools/xr-probe.html` (served by `npm run serve`) and
press the buttons; the result is read over USB. Last probe: 9 Oct 2026, Quest 3, browser 152: controllers, hands and body asked one task at a time in the headset (tools/xr-probe-input.html); all 20 tasks done in 1 min 50 s, none skipped.
Do not request the `layers` feature: with the normal base layer the session fails
("Can't use baseLayer with layers feature requested").

| Capability | Status | Source | What it gives an experiment | In the game |
|---|---|---|---|---|
| VR session (`immersive-vr`) | our headset: supported (Quest 3, browser 152) | CDP check | All current rooms | used: every place of the game |
| Both eyes in one pass (`OCULUS_multiview`) | our headset: on in the corridor, 10 Oct 2026 (A-Frame 1.8.0: `renderer.xr.isMultiview` true, the extension present) | `tools/quest-look.mjs eval`, in VR | Each draw call made once a frame, not once an eye | used: on since A-Frame 1.8.0 (src/app/stage.js) |
| Frame rate | our headset: 90 Hz in the corridor; offered 72, 80, 90, 120 (`supportedFrameRates`), 10 Oct 2026 | `tools/quest-look.mjs eval`, in VR | The frame budget is 11.1 ms at 90 Hz; 11 Oct 2026, both eyes in one pass: the game's own time 2.4-3.0 ms a frame of 11.1, the GPU 50-61 % busy (ovrgpuprofiler), so the GPU is nearer its limit (docs/research/engine-native.md, Measured) | used: the browser default, 90 Hz on Quest 3; decide by stage 3: whether Quest 2 runs at 72 (docs/research/engine-and-tools.md, Part 1) |
| Mixed reality, the real room seen through the cameras (`immersive-ar`) | our headset: supported | CDP check; [Meta](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | Experiments inside the player's own room | decide by stage 2: one session-shape probe before any room uses it (docs/research/revision-3-live-voice-mr.md, part 3) |
| Plane detection: walls, floor, tables | our headset: 57 planes with labels (wall, window, door, table, shelf, floor, ceiling, bed, wall art); 11.10 in mixed reality (tools/xr-room.html), two sessions: the same 57 planes each time, sizes and heights per plane (ceilings 2.6-2.7 m over their floors) | [Meta](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | Put the apparatus on the player's real table | decide by stage 2: with mixed reality, above |
| Persistent anchors (max 8 per site) | our headset: feature granted | same | Keep an object in the same real place between sessions | decide by stage 2: with mixed reality, above |
| Hit test on real surfaces through the depth sensor (Quest 3, browser 40.4, Oct 2025) | our headset: hit-test and depth-sensing granted; 11.10 in mixed reality: a hit on a real surface ahead at once; depth came gpu-optimized in both sessions though only the CPU path was asked | [UploadVR](https://www.uploadvr.com/quest-browser-depth-api-webxr-hit-testing-instant-placement/) | Place things on any real surface without a room scan | decide by stage 2: with mixed reality, above |
| Room mesh (`mesh-detection`) | our headset: 22 meshes, some labelled table; 11.10: the same 22 each time: three dense meshes, one a room (thousands of triangles), and 19 furniture boxes of 12 triangles | probe | Real furniture as part of the scene | decide by stage 2: with mixed reality, above |
| Hand tracking without controllers, 25 joints | our headset 9.10: both hands seen with all 25 joints posed once the controllers were put down (the headset switches on its own); 11.10 in mixed reality: both hands tracked as soon as the controllers were put down, wrist to fingertip measured | [Meta](https://developers.meta.com/horizon/documentation/web/webxr-hands/) | Body-ownership rooms with the player's own hand shape; grasping, pointing, gestures | decide by stage 2: hands drawn and a press with a finger; several looks of the hands shown to the owner first; A-Frame draws hands and gives pinch and grab, a finger press is ours to build (docs/research/engine-native.md, Hands) |
| Microphone (spoken answers) | our headset: permission granted, sound level read | [Babylon forum](https://forum.babylonjs.com/t/using-meta-quest-2-microphone-inside-of-webxr-game/38321) | Spoken explanations (choice blindness), voice timing; needs the player's permission and a privacy rule | decide by stage 2: the speech recognition, the owner's choice (docs/research/revision-3-live-voice-mr.md, D1) |
| Several live players at once | web standard (WebSocket/WebRTC); our Supabase has realtime | — | Experiments with real people instead of scripted agents (Asch, economic games, coordination) | decide before the first room with live players: one shared transport (docs/research/revision-3-live-voice-mr.md) |
| Statistics across players | built (anonymous results, sent only with the player's consent; privacy page `privacy.html`) | `src/app/session.js` | Between-group effects (anchoring, framing) become visible as "you vs others" | used: room 01's results, sent only with consent |
| Real walking inside the boundary | Meta: roomscale minimum 2 × 2 m, stationary 1 × 1 m; our headset: the browser reported 1.88 × 2.10 m, less than Meta's minimum (cause unknown) | [Meta](https://www.meta.com/help/quest/1190192431422476/) | Rooms by space tier (`docs/decisions.md`) | used: the base space 1.8 × 1.8 m every room is built for (docs/decisions.md, Rooms by play space) |
| Boundary size (`bounded-floor`) | our headset: works in VR and MR; owner's area 1.88 × 2.10 m; 11.10 in mixed reality: read once at the session start 1.2 × 1.2 m, read each frame 1.74 × 1.92 m | [Meta forum](https://communityforums.atmeta.com/discussions/dev-openxr/webxr-requesting-boundsgeometry-for-play-space-returns-empty-array-or-a-small-sq/1217563) | Offer large-space rooms only to players who have the space | decide by stage 2: reading the player's boundary at the start is not built (docs/decisions.md, Rooms by play space) |
| Controllers (Meta Quest Touch Plus) | our headset 9.10: profiles meta-quest-touch-plus down to generic-trigger-squeeze-thumbstick, mapping xr-standard, 13 buttons on the left, 12 on the right, 4 axes; pressed and read by the page: trigger 0, grip 1, stick press 3, A/X 4, B/Y 5, stick tilt on its axes; the left menu button (three stripes) is buttons[12] and did not end the session; touch sensors on most buttons; select and squeeze events on both | probe `input` | Which buttons a room can use, the menu button included (e.g. a pause) | used: laser pointers, the trigger and the grip (src/engine/grab-press.js) |
| Power from the owner's battery strap (BoboVR) | our headset 11.10, read over Wi-Fi with the cable out: the strap is a fast charger (AC, 9 V, up to 2.25 A, not weak), the laptop's USB a weak one (5 V, up to 0.9 A); the charge stayed level at 98 % for 40 s on the strap, and level again through three minutes of the game in VR over Wi-Fi; with its fan on, the CPU (56-58 °C), battery (37 °C) and camera sensors (32-36 °C) held steady for a minute (no fan-off minute to compare; the strap's own charge is not seen by the headset, only its lights) | `adb shell dumpsys battery` | Long sessions without the cable | used: untethered play and checks over Wi-Fi (tools/quest-wifi.mjs) |
| Spatial sound, controller vibration | our headset 9.10: a pulse on each controller on his own press, felt on both | `src/engine/sfx.js`, `src/engine/haptics.js` | Sounds from a place; touch confirmation | used: src/engine/sfx.js, src/engine/haptics.js |
| Eye tracking, face tracking | not on Quest 3: no such cameras | [Meta, Compare devices](https://developers.meta.com/horizon/resources/compare-devices/) (updated 2026-09-30): Meta Quest 3 "Head and hand tracking"; Meta VR Glasses "Head, hand, and eye tracking" | Not available: no gaze measures (head direction only) | not available: Quest 3 has none |
| Camera images (the passthrough cameras) | our headset 11.10: the browser lists a video input before any permission (`enumerateDevices`); Meta: a website may get "the real-time passthrough camera feed from the front of your headset" with the "Headset cameras" permission, plus "camera focal length, principal point, image dimensions and camera position"; "Only a single website can access camera data at any time"; through `getUserMedia`, not WebXR (`camera-access` not supported); size, rate and which camera: to probe with the owner, who grants the permission | [Meta Help, website permissions](https://www.meta.com/help/quest/1406582186767703/); [browser 40.1](https://developers.meta.com/horizon/downloads/package/browser/40.1/) (updated Aug 12, 2025): "Support for passthrough camera" | The player's real room as images (light, his hands, objects); nothing personal from the cameras may be recorded or sent | decide by stage 2: the probe with the owner first |
| Full-body tracking | our headset: `body-tracking` granted without flags (browser 152); 9.10: `frame.body` gives 83 joints, all 83 posed; 11.10 in mixed reality: all 83 posed, wrists apart measured with the arms spread | [Wikipedia: Quest Browser](https://en.wikipedia.org/wiki/Meta_Quest_Browser) | Posture and arm movement, once the output is checked | decide before a room that measures posture: none does yet |
| Desktop players (mouse, no headset) | built | `src/main.js` | Rooms that do not need the body can also run on a computer | used: src/main.js, mouse and keyboard |
| Force feedback, smell, heat | not available (the controllers vibrate: "TruTouch haptics", "1x voice coil motor", Compare devices) | [Meta, Compare devices](https://developers.meta.com/horizon/resources/compare-devices/) | Weight, smoke smell, fire heat cannot be real | not available |

## Read from the headset itself (11.10, over USB, nothing changed, no permission asked)
Documentation lags behind the headset, so what it holds is read from it: the system over adb
(`pm list features`, `dumpsys sensorservice`, `dumpsys media.camera`) and the browser over
`tools/quest-look.mjs eval`. Android 14 (build UP1A.231005.007.A1), Quest Browser 152.1.
- Cameras in the system's calibration: two colour cameras 2328 × 1748 (rolling shutter: the passthrough
  view), two tracking cameras 1280 × 1024 and two 640 × 480 (global shutter); no camera faces the eyes.
  The camera service shows 5 devices to apps. The browser lists one video input before permission.
- System features: hand tracking, user detection (worn or not), QR codes, a tracked stylus, passthrough
  capture; no eye or face tracking feature.
- Sensors the system lists: the headset's IMU (to 100 Hz for Android apps), a double-tap sensor, and an
  IAD sensor (the distance between the lenses, which the wheel sets).
- The browser gives a page: `getUserMedia` for the camera (permission "prompt") and the microphone
  (granted earlier), `Accelerometer`, `Gyroscope` and `DeviceMotionEvent`, WebGPU, `navigator.vibrate`;
  immersive-vr and immersive-ar supported. It does not give: speech recognition, speech synthesis
  (`speechSynthesis` is not defined: the game's voice stays recorded), an ambient light sensor, a choice of
  audio output (`setSinkId`). `getBattery` exists but returned no level. Still to probe in a session, with
  the owner wearing the headset: the camera's size, rate and which camera (he grants the permission), and the
  WebXR features (light estimation, hand joint radius, microgestures, frame timing).

## What mixed reality could add (ideas, to be checked against papers)
- **Closer to the original lab.** Many originals took place in a real room at a real
  table. In mixed reality the apparatus can stand on the player's own table, which may
  be closer to the original than a virtual booth.
- **A research question nobody has answered for these rooms.** In the smoke-alarm
  replication the real room gave 68% leaving alone and VR only 36%
  (Kinateder & Warren 2016, `docs/sources.md`). Whether mixed reality brings the effect
  back towards the real-room number is open; the game could measure it.
- **Changes in your own room.** Change-blindness and size illusions with virtual
  objects placed among the player's real furniture.
- **Limits.** Switching between VR and mixed reality means ending one session and
  starting another, which needs a button press; mixed reality shows the player's real
  room, so nothing personal from the cameras may be recorded or sent.
