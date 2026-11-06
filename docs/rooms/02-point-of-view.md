# Point of View

Open `/?room=02-point-of-view` from the same base URL as the original room.
The shell still opens room 01 without a room parameter. This is an open-ended
geometry exercise with no task, score, timer, or research claim. It goes from
`idle` (loading) to `run` as soon as the controls are ready.

| Action | Effect |
|---|---|
| Turn | Rotate the tetrahedron by 30 degrees |
| Size | Cycle between original, larger and smaller sizes |
| Viewpoint | Move the tetrahedron closer and left, farther and right, then back to center |
| Return | Restore the original position, size and orientation in one step |

The viewpoint changes the figure's depth and offset in the scene while the
camera stays put. In VR, normal head tracking is active. Compare the first and
restored projections from the same head position and direction. The restore
button changes the figure only.

Use the four buttons with mouse, touch or keyboard. In immersive VR, aim
either controller's laser at the matching panel and press the trigger. The
room shows the action count and the four most recent actions, including
returns. The full action sequence is held in memory for the life of the page.
It is cleared on reload and is never sent or written to storage.

## Test and publish

- From this branch run `npm run serve` and open
  `http://localhost:3000/?room=02-point-of-view` for a desktop preview.
- For a headset preview, export `index.html`, `css/`, `src/` and `vendor/`
  from the room branch into a ZIP. Keep `index.html` at the archive root.
  Upload the ZIP to a separate HTTPS static site, such as a new
  [Cloudflare Pages Direct Upload project](https://developers.cloudflare.com/pages/get-started/direct-upload/).
  Open its HTTPS address with `?room=02-point-of-view` in Quest Browser.
  Select VR, try each control and compare the restored view with the first
  view. Check that the count and recent actions remain.
