# Point of View

Open `/?room=02-point-of-view` from the same base URL as the original room.
The shell still opens room 01 without a room parameter. This geometry exercise
has no score, timer, or research claim. It goes from `idle` (loading) to `run`
as soon as the controls are ready.

| Action | Effect |
|---|---|
| 0°, 90°, 180° | Choose an orientation of the symmetric slab |
| Size | Cycle between original, larger and smaller sizes |
| Viewpoint | Move the slab closer and left, farther and right, then back to center |
| Restart | Restore the initial scene and clear the trial history and memory |

The slab presents the same geometry at 0° and 180° and turns face-on at 90°.
Go to 180° directly in one trial, then restart and go via 90° in a second
trial. At the same head position, size and viewpoint setting the final slab
looks the same in both trials. Memory reads 0 in the direct trial and 1 in
the second because the 90° view was opened. This bit describes the action
history. Changing the view back to 0° leaves it set.

The viewpoint changes the slab's depth and offset. In VR, normal head tracking
is active and the camera receives no artificial motion.

Use the buttons with mouse, touch or keyboard. In immersive VR, aim
either controller's laser at the matching panel and press the trigger. The
room shows the action count and the four most recent actions of the current
trial. Restarting or reloading clears the sequence. The room keeps this
sequence in page memory only.

## Test and publish

- From this branch run `npm run serve` and open
  `http://localhost:3000/?room=02-point-of-view` for a desktop preview.
- For a headset preview on the project's test host, serve `index.html`,
  `css/`, `src/` and `vendor/` under a dedicated HTTPS subdirectory.
  Use the full directory URL with a trailing slash and `?room=02-point-of-view`.
  In Quest Browser, select VR and compare the two trials from the same head
  position. Aim both controllers at different buttons and confirm that each
  trigger selects only the button under its own ray.
