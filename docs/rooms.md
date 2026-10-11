# Room contract

A room is a folder `src/rooms/NN-name/` and stands behind a door of the corridor. The app holds
the scene, the player (the rig, the camera, both controllers) and the corridor with every door for
the whole visit (`src/app/lab.js`, `src/app/stage.js`); the room is only what is behind its door.
`src/main.js` picks the room behind door 1 (`?room=`, default `01-control`), loads
`src/rooms/<id>/room.js` and starts the lab with it.

Required files (checked by `tests/structure.test.mjs`):
```
room.js         sceneHTML, DOORWAY, ENTRY, mount(root), enter(withRecording)
scene.js        export const sceneHTML, DOORWAY   A-Frame markup of the inside, in the room's own metres
report.js       export function analyse(log) → report   pure: no DOM, no texts
texts.ru.js     every word the player sees
voice-lines.js  every spoken line and its recording
sound-list.js   every sound effect and its prompt
docs/rooms/NN-name.md   the spec: original procedure with pages, deviations, our choices
```
A room built from a paper also has `protocol.js` (every number, with pages) and a
test that pins those numbers to the paper.

What room.js exports:
1. `sceneHTML`: the room's inside, no `<a-scene>`, no player, no door (`tests/structure.test.mjs`).
   It is built in the room's own metres and `DOORWAY` says where its door's opening is: the middle
   of the opening on the inside face of its wall, the corridor beyond it along +z. The app puts the
   markup into a group (`#roomPlace`, `data-frame`) that the corridor's plan stands behind the door
   (`roomPlace` in `src/app/lobby/plan.js`, `tests/plan.test.mjs`), before the scene loads, so it is
   merged and tiled with the corridor; gridded surfaces are laid from the room's own centre.
   Its masonry opening and every flat thing on its walls (class `on-wall`) sit on the block
   module, so no cut sliver of block shows (`tests/masonry.test.mjs`); door signs (class
   `door-sign`) are placed by the sign standard instead (`SIGN` in `src/app/brand.js`).
   Every light of the room that is on in its markup carries class `room-light`: lights pass
   through walls, so the corridor keeps them off until the door opens (corridors are much
   dimmer than rooms: docs/building-standards.md), and once the player is in, the corridor's are
   out: the room is lit by its own lamps alone. The room's inside (walls, furniture, screen)
   carries class `room-interior`: the corridor leaves it undrawn until the door opens (Meta: fewer
   than 200 draw calls a frame on Quest 3), and no light is inside it (lights are turned down,
   never hidden: a hidden light changes the count and three.js rebuilds every lit material).
2. `ENTRY`: what the corridor needs before its door, `{ id, real, debrief, extra, seat: { x, z,
   yaw, pitch }, area: { minX, maxX, minZ, maxZ } }`, the seat and the computer's walking area in
   the room's own metres (the app turns them into the corridor's).
3. `mount(root)`: the room stands loaded behind its shut door; `root` is its group. Widgets go
   into `root` (`createChoice(root, …)`), and what takes world places (sounds, the away meter)
   is turned from the room's metres by `root.object3D.localToWorld`. Mirror the flow on
   `<html data-room-state>` (`idle` = the player not yet in … `done` = reveal).
4. `enter(withRecording)`: the player is at the table, after the shared arrival (`runLobby` in
   `src/app/lobby/lobby.js`: the sign over the door, the clipboard taken from the board, welcome,
   left-early choice, consent, the door; the thumbsticks move the player in the corridor only).
   Show the room's computer hint with `showHint({ title, body })` (src/app/hint.js) and use the
   shared session (`src/app/session.js`) for first/repeat runs, test speed and sending.

Shared parts a room must not re-implement: arrival (corridor), consent, session, the clipboard
(`src/engine/ui/sheet.js`), answer buttons (`src/engine/ui/choice.js`), rating scales
(`src/engine/ui/scale.js`), voice, sound, doors (`src/engine/door.js`, built by the corridor),
door plaques (`writePlaque` in `src/app/brand.js`).

A door sign shows the room's number only, on the door's corridor face (`doorHTML({ sign })`) and on
the wall inside: the experiment's name would tell the player what is studied before they do it
(demand characteristics); the name comes in the reveal, and on the door once the room is done
(`tests/plaque.test.mjs`). The number comes from the corridor plan (`src/app/lobby/plan.js`):
the room imports it for its texts and its own sign; the lobby writes the corridor's signs and door 1's.

Add a room: read the paper in full first (CLAUDE.md: the paper read in full), write the spec, then
`protocol.js` and its test, then the rest. File names must not look like tracking
(see `tests/names.test.mjs`): ad blockers block them.
