# VR checklist (walk through for every room)

Sources: Meta comfort, accessibility (VRC), performance guidelines, W3C WebXR,
A-Frame docs. Status for room 01 in brackets.

## Comfort
- No camera motion the player did not make; recenter only on VR entry, headset reset and the headset put back on. [recenter.js, all three]
- Moving: teleport and snap turn by default, smooth moving (no acceleration, with a vignette) offered in settings, changed live and kept (Meta locomotion guidance). [corridor: teleport, 45° snap turn, back step (src/engine/locomotion.js); smooth moving and the settings: next]
- Stable frame rate: 72 Hz = 13.7 ms, 90 Hz = 11.1 ms per frame; check the heaviest moment and Quest 2. [72 fps on Quest 3; Quest 2 not checked]
- Everything reachable from one position, seated or standing; no forced turn over 90°. [seated rooms lift the eyes to 1.6 m (src/engine/recenter.js); the corridor is stood or walked]
- Floor: `local-floor`, with a fallback for `local`. [not checked on Quest 2]

## Posture, space and arrival (decide before building, from how other games do it)
- For every place: the player's real posture (seated or standing), the play space (stationary or roomscale), what the place needs (the corridor is for standing and walking; a room is seated only if its original was), and how the player passes between places. [corridor: standing and walking; a seated player sees it from standing eye height (recenter lift); played seated by the owner 08.10]
- A seated player always has a seat under them; nobody floats over the floor. [room: chair; corridor: lifted to standing eye height]
- Re-align the player when the headset is put back on (session hidden → visible) and on the Meta-button reset; not after the system menu (visible-blurred → visible). [done: recenter.js]
- The player arrives facing the first thing to do, with nothing important behind or split left and right. [corridor: facing door 1 and its sign, the board to the left]

## Scene build quality (walk before the owner sees it)
- Tiles symmetric on every surface: whole tiles or equal cuts at both ends, centred on that surface. [done: tests/tiles.test.mjs; blocks on the module beside openings and flat things: tests/masonry.test.mjs]
- No two surfaces in the same place (they flicker): keep faces at least 5 mm apart, and fill the gap so nothing floats: a sign is a plate as thick as the gap (panel `thick`); a print lying on something is a decal drawn over it (panel `decal`). [done: base and frames apart, signs and sheets; thin plates, prints and shadows as decals (src/engine/decal.js); flat faces scanned by tests/near-faces.mjs in the smoke test in the corridor, on the signed form and in the room; curved prints go by the decal rule alone]
- No gaps into emptiness: openings are closed or show a finished space. [done: door, frame and threshold to the standards]
- No text crammed with its buttons: one thought per sheet, buttons never pushed onto a frame. [done: the clipboard, one thought per sheet (tests/smoke.mjs)]

## Interaction
- Targets at least 2.5–3° of view; panels at 1–1.5 m. [clipboard at 1 m, buttons 4°: tests/smoke.mjs]
- Feedback on every press: visual + sound + haptic pulse. [haptic: added]
- Playable with one hand; hand tracking optional. [one hand ok; hands not checked]

## Text and UI
- World-locked text, never head-locked. [done]
- Contrast at least 4.5:1, heavy weights, no thin fonts. [done]
- Flashing only within WCAG 2.3.1: at most 3 flashes a second, no saturated red. [the sign's starter flicker: tests/glow.test.mjs; counter flash: brief colour change]

## Audio
- Unlock audio on a user gesture. [done: the first press anywhere, the listener set first thing in the corridor (src/app/lobby/lobby.js); one rule: every sound or voice line asked for before it waits for it, never lost (src/engine/audio.js onUnlock; tests/voice.test.mjs)]
- Subtitles for all speech, or playable without sound. [every spoken line is also on the screen]

## WebXR pitfalls
- `requestSession` only from a real user gesture: the player presses VR (the headset tools send theirs over the debug link as the user's: tools/quest-look.mjs vr).
- Pause timed events when the session is `visible-blurred`/`hidden` (system menu) or the tab is hidden. [done: points wait while paused]
- After failed session requests Quest Browser may refuse new ones until restarted: `adb shell am force-stop com.oculus.browser`.

## Accessibility
- Never rely on colour alone (red/green is the most confused pair). [room 01's yellow and green lights: unchecked]

## Files and loading
- No served file name that looks like tracking: ad blockers block it and the room never loads. [tests/names.test.mjs]
