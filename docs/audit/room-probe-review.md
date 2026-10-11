# Practice review of the real-room probe (tools/xr-room.html), 11 Oct 2026, night

The owner asked to test, in one go, everything the headset can measure in his real room: walking, the furniture,
the room as the headset's triangles, the next room (docs/board.md). The probe was built and reviewed before he met it;
the review said not ready, so the run waits for these fixes. Read only; the reviewer's sources are named.

1. Going into the next room is unsafe as planned: controllers down, at night, door thresholds. Meta: "Avoid
   encouraging users to move outside of the boundary" (developers.meta.com/horizon/design/boundaryless-best-practices/);
   leaving the room gives no warning, only full passthrough, and avoid unlevel surfaces
   (…/design/mr-health-passthrough/); a dark room can lose 6DoF tracking (meta.com/help/quest/598701621088668). What the
   browser does in immersive-ar outside the boundary was never checked (docs/research/vr/04-mr.md). Fix: drop it, or a
   separate last step with the lights on in both rooms, no lines drawn, controllers in hand.
2. Walking along the walls leaves his boundary while the whole mesh, floor included, is drawn over a night-time view.
   Meta: no large virtual content on the floor that hides trip hazards; lower its opacity while the person moves
   (boundaryless page). Fix: no floor triangles, the lines faded while he walks, the room light on first.
3. The arms-apart measure is never recorded: /wrist/ matches four body joints (left-hand-wrist, left-hand-wrist-twist,
   right-hand-wrist, right-hand-wrist-twist: github.com/immersive-web/body-tracking). Fix: match the two names exactly.
4. With the controllers down no buzz marks a new step. Fix: a sound on every step.
5. The first thing he meets is the browser's request for his space data, which no step mentions
   (developers.meta.com/horizon/documentation/web/webxr-mixed-reality/). Fix: a step before, saying to allow it.
6. Pressing the start button again wipes the first run (window.__room replaced, localStorage overwritten); the old panel stays
   and the raycast list is never cleared. Fix: keep each run apart and clear both.
7. Started by a clicked button over the debug link, the run skips the check that he wears the headset and the review
   gate's VR pattern (tools/quest-look.mjs, tools/review-gate.mjs). Fix: tools/xr-room-run.mjs checks both first.
8. If depth comes as gpu-optimized, three.js draws a real-depth occluder each frame, so lines on real surfaces may
   flicker, and getDepthInformation reads only cpu-optimized depth (unverified in the headset).
9. The panel's distance (0.4-0.8 m) has no source; quest-look say keeps Meta's "never under 0.5 m" and 04-mr.md says
   about 1 m. Fix: the same rule as quest-look.
10. Minor: step 1 may wrap to four lines; the steps speak to him informally while the page itself is formal.

Checked and fine: iterating frame.body, getJointPose for the hands, the hit-test source asked before setSession, the
panel hidden until the first step, the plane and mesh fields.

Fixed 11 Oct, morning (with CodeRabbit's seven remarks on the same files): the next room taken out; walking kept inside his boundary with the light on; the floor measured but not drawn, the lines faded while he walks; the two wrist joints by name; a tone with every step; the space-data question named on the page; each run kept apart, a second press ignored while one runs; depth reported as the browser chose it; the panel 0.5-1 m as quest-look say; the runner checks that he wears the headset and the practice-review gate, stops when the session does not start, and makes its folder first. The run waits for a practice review of these files.

Second review, same morning: the floor is inside the room's one global mesh, so a triangle is drawn only when all its corners stand above 0.15 m; the panel fades with the lines while he walks; walking speed over the last second; the runner's gate in its exact mode (a review of these very files, as tools/xr-probe-run.mjs); he presses the start button himself; step 3 from where he stands, step 5 back to the middle of the zone first; Inter loaded before the first step; the tone resumed and its state kept; depth asked on the CPU path only.

Third review: the runner waits until the page's steps are there (A-Frame loads first, over Wi-Fi), turns the start button off on any early exit, and shows the last step if a run breaks midway; a plane with no place yet waits for a later frame; the face loaded for digits too.

After the first run (11 Oct): the session started on the cable and the link was lost mid-walk (docs/mistakes.md); the runner now checks Wi-Fi only and the strap's power first. The browser hands over a new object for a changed plane or mesh, so each was recorded several times and old outlines piled up: one record per thing now, and what the browser no longer reports leaves the picture. The browser gave depth to the GPU only, though the CPU path alone was asked for. The next run waits for a practice review of these files.

Rebuilt so a lost link cannot stop it: the page leads him through the steps on its own clock once the session starts and ends the session after the last one; the record stays in the headset; the runner only logs heat and reads the result at the end. A dry run on the laptop (window.__dryRun, fifty times faster) showed the six steps in order and on time.
