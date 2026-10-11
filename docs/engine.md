# Engine (`src/engine/`)

Reusable parts. The engine never imports from `src/app/` or `src/rooms/`.

| File | What it gives a room |
|---|---|
| `panel.js` | Component `panel`: text drawn on a canvas, shrinks to fit. `write(blocks, opt)`; block = `{ t, size, color, weight, gap, spacing }`. `thick`: a sign's plate body behind the face, down to what it is fixed on; `decal`: a print lying on a surface (paper on cork), drawn over it by a depth offset |
| `ui/sheet.js`, `ui/sheet-page.js`, `ui/ink.js`, `ui/sheet-math.js` | `createSheet(scene, { inside })` (inside: the space's wall faces; the sheet is never read beyond them) → `choose(blocks, labels)`, `say(blocks)`, `fill(blocks, label, note, stamp)` (a form signed by hand: a field over every blank, the button once each has writing; with stamp `{ size, mark, draw }` a seal's place under the text, its mark printed, the seal pressed in stamp ink once signed, `draw(ctx, r)` returning its smallest letter as drawn; resolves with the strokes), `open()`, `el`, `close()`, `hang(pose, cover, light)`, `take(blocks)` (shows blocks while it waits; emits `taken` on the click), `back(blocks)` (a clipboard that waits on a hook, glides to the player on a click and back after the answers), `interrupt(blocks, labels)` and `resume()` (a question that cuts in on any page, then the page comes back; a page set meanwhile waits behind the question), `isAsking()`: the clipboard sheet 1 m in front of the player for everything to read or answer; it follows the player on `recentered` and `player-moved`; blocks have roles (`title`, `body`, `soft`; no text under 24 mm); a page that does not fit sets `data-overflow` |
| `ui/choice.js` | `createChoice(parent, place)` → `show(labels, onPick, top)` (returns the buttons' lowest edge), `hide()`: answer buttons on the scene or the sheet, laser or mouse; ready after 0.3 s (`data-ready`); on paper (`place.letter`) the letter is the page's and never shrinks, a long label wraps |
| `ui/scale.js` | `createScale(parent, place)` → `show({ labels, step, unit, doneLabel }, onDone)`: 0–100 rating scale |
| `glide.js` | Component `glide`: `go({ to, ctrl, rotation, ms, step })` moves an entity along a curve, easing in and out (`step(e)` each frame) (path rules: `glidePath` in `ui/sheet-math.js`) |
| `lightbox.js` | Component `lightbox` on a `panel`: a back-lit sign with one lamp per word; `show(words, style)`, `run(keys)` with a level per word, `lamp-cue` with the key's cue (`{ sound, hum, humS }`); patterns stay under the flash rule (`tests/glow.test.mjs`) |
| `surface.js`, `tile-math.js` | Component `surface`: block, linoleum, ceiling, cork, lens, wood; `glow` for a lamp's lens; tiles laid out per space (`space: cx cz lx lz`) by the trade rules, in the metres of the nearest group marked `data-frame` (a room wherever the corridor stands it) or the world's |
| `log.js` | `eventLog`: `reset()`, `begin()`, `end()`, `add(kind, value)`, `entries`. Accepts events only between `begin()` and `end()` |
| `locomotion.js`, `locomotion-math.js`, `vignette.js` | Component `locomotion` on the rig: thumbstick teleport (arc to the floor, release to go, click to cancel), 45° snap turn, 80 cm back step; or `move: smooth` (left stick walks at 1.4 m/s) and `turn: smooth`, with a vignette while moving smoothly; only inside its bounds; emits `player-moved` |
| `audio.js` | `unlock()` (call after a click), `getContext()`, `onUnlock(fn)` (the one rule: every sound and voice line asked for before the first gesture waits for it, never lost; with no audio at all the wait still ends) |
| `voice.js` | `loadVoice(lines, baseUrl)`, `speak(text)` → Promise, resolves when the line ends; a `voice-line` event on `window` as a line starts |
| `sfx.js` | `loadSounds`, `playSound(name, position, volume, loop)` → handle with `stop()`, `fade(volume, seconds)`; component `sound-listener` for spatial sound |
| `recenter.js`, `recenter-math.js` | Component `recenter`: puts the player at the table in VR, seated or standing, on the frame after the first tracked head pose (`placementStep`), never after a guessed delay |
| `grab-press.js`, `haptics.js` | Press `.grabbable` things with the hand; controller vibration |
| `blob-shadow.js` | Soft contact shadow under objects |
| `door.js` | `doorHTML({ x, room, corridor, latch, leaf, clickable, inside, sign })`: every doorway of the lab, one way (frame through the wall, stops, threshold, leaf, kick plate on the push side, round knobs; room-side hinges and closer when `inside`); either long wall (the room on the far side of `corridor`); `CHROME`: the one hardware finish |
| `fader.js` | Component `fader` on the camera: `to(opacity)` fades the view to black and back (moving between places without a jump); a newer fade settles the older one's promise |
| `reflect-env.js` | Component `reflect-env`: polished metal parts under it (metalness 0.5 or more) mirror the room round them: a small cube map taken from the object's middle a few times while the lights settle after load, then never again |
| `controller-batch.js` | Component `controller-batch` on a laser-controls entity: the controller model's parts drawn as one skinned mesh, each part its bone, colours in the vertices; A-Frame still moves and lights the hidden parts |
| `merge-static.js` | Component `merge-static`: after load, the opaque static parts under it that share a look become one mesh, their colours kept in its vertices, so parts differing only in colour are one draw call (`data-dynamic` and `.clickable` parts are left alone; decals merge only with decals; a swinging door leaf and the clipboard merge on themselves) |
| `decal.js` | Component `decal`: a thin thing (a plate, a strap, a label, a dial) keeps its thickness and is drawn over what it lies on by a depth offset (`DECAL_OFFSET`, also the panel's `decal`) |
| `shapes.js` | Components `rounded-box` and `lathe`: shapes A-Frame lacks |
| `cable.js` | Component `cable`: one smooth tube through a list of points |
| `laser-beam.js` | Component `laser-beam` on each controller: its ray is drawn only while it meets a visible target and not while the teleport arc aims, fading 0.25 s (Meta, Ray casting specs); `pressable(el, on)` puts a target in or out of what the rays answer |
| `away-meter.js` | `createAwayMeter(camEl, target, paused, degrees)`: seconds the head points away from a place |
| `prewarm.js` | Component `prewarm` on the scene: every material's shaders, every picture and shape readied before they are first seen: a moment after load, drawn once unseen into a one-pixel picture, and again on the first frame in a headset (multiview's shaders differ); `show` names hidden groups drawn for it too |
| `room-bounds.js` | Keeps the desktop camera inside the room (bounds as parameters); off only while a headset's session presents, since a computer's full screen is A-Frame's VR mode too |
| `results.js` | `sendResult`, `markPlayed` (through `src/app/session.js`), `compareRoom` (room 01 reads the aggregates for "you and others") |

Rules: components are tick-driven (CSS and `requestAnimationFrame` do not run
in a headset); anything the reveal reports must come from `eventLog`.
