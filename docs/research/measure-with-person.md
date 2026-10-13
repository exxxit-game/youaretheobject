# Measuring with a person in the headset: what Meta's docs have the tester do

Question (14.10.2026): what a person wearing a Quest 3 does during a performance or comfort test, and what is
measured then, as against a headset lying on a stand. Scope of this pass: Meta's own documentation (item 1);
developer talks (item 2) and in-headset instructions (item 3) only where Meta's pages touch them.
Pages read with `metavr docs fetch` on 14.10.2026 unless marked.

## Findings

1. **What a person's head motion shows that a stand cannot.** Meta, "Missed frames and frame recovery",
   last_updated 2026-03-09 (Horizon OS, fits Quest 3 in 2026; the page is written for native/OpenXR apps, but the
   compositor it describes is the one the Quest Browser's WebXR frames go through, which the page does not say:
   unverified for the browser). https://developers.meta.com/horizon/documentation/native/android/os-missed-frames
   Sustained frame drops show to the user as judder, as flickering black regions at the edges of the view when the
   user turns the head far between the old frame and the new pose ("Black bars at the periphery"), and as more
   latency. Reprojection (TimeWarp) fixes rotation only: "TimeWarp does not correct for head translation".
   The page names the OVR Metrics Tool overlay (FPS, stale frames, GPU utilization) as the live check.
   It gives no tester protocol (no movements, no durations).
   For us: the person's job is to turn the head fast and lean/step while the HUD counts stale frames; black edges
   and judder are what he reports; a stand at rest cannot provoke them.

2. **Meta's performance test is a person playing through, not a still view.** Meta, "VRC.Quest.Performance.1",
   last_updated 2025-10-22 (the current store check; fits Quest 3 in 2026; it binds store apps, a WebXR page is
   not under VRCs, so for us it is a borrowed yardstick). https://developers.meta.com/horizon/resources/vrc-quest-performance-1
   "Steps to test": "Use the app for the length of the content or 45 minutes, whichever is shorter", then read the
   OVR Metrics Tool log's FPS graph for "extended periods of rendering rate below 60 fps". Allowed refresh rates for
   interactive apps 72/80/90/96/100/120 Hz; below-rate allowed during loading screens, full-screen fades, system
   menu overlays, streaming or recording. No head movements, no worst-case view, no duration per action are named.
   For us: the 45-minute stand run already matches the length; the person's session is the same graph, recorded
   while he actually uses the content (moves, points, opens the menu).

3. **How a non-engineer reads that run.** Meta, "OVR Metrics Tool - Best Practices for Non-Engineers"
   (no last_updated on the page: date unverified). https://developers.meta.com/horizon/documentation/unity/ts-ovr-best-practices
   Overlay on (Enable Persistent Overlay), stats preset Basic, not Advanced ("Advanced adds more overhead");
   record to CSV; play the level once after a fresh install before judging (shaders compile on the first run);
   note level loads; at 72 Hz "a couple seconds of a small ( > 65 fps) dip ... with a quick recovery" that is
   one-off is acceptable, cyclical dips are not; the overlay lags the picture by about one second, so a dip
   belongs to what was on screen a second earlier. Budgets: 13.9 ms at 72 Hz, 11.1 ms at 90 Hz, 8.3 ms at 120 Hz;
   App T over budget with FPS low = GPU-bound, under budget with FPS low = CPU-bound.
   For us: the person (or the machine log) marks each action's moment, and a dip is matched to the second before;
   the first run after a reload is a warm-up, not a measure.

4. **What Meta's playtest guide has the facilitator watch and do.** Meta, "Running a playtest",
   last_updated 2025-08-13 (fits 2026; a usability playtest guide, not a performance protocol).
   https://developers.meta.com/horizon/resources/playtest-facilitate-data-analysis
   Watch for "Any signs of discomfort": eye strain, nausea, fatigue; places where the tester cannot move forward.
   Start a new VR user in a calm place for the first 2-3 minutes; let him play freely, think aloud; answer a
   question with a question. No rating scale (no SSQ, no 0-10) is named on this page. Under 20 testers: no
   averages, count who succeeded or failed ("one fail out of five is significant").
   For us: this is the opposite of our scripted check: Meta's playtest is free play with a live facilitator; a
   scripted performance pass is a separate thing Meta's pages do not script step by step.

5. **Meta's playtest script: what the tester is told and when he is asked.** Meta, "VR Playtest Research Plan
   and Survey Writing", last_updated 2025-10-01 (fits 2026). https://developers.meta.com/horizon/resources/playtest-planning-survey-script
   Write the full script and practise it; tell the tester if the app is intense and that he "can take off the
   headset at any time if they are uncomfortable"; ask about a section soon after it, not later: "Stop them soon
   after the encounter, ask them the one or two questions and let them return to the app"; include a moment to
   adjust the origin point; moderate early builds so the facilitator can give verbal instructions when the tester
   is stuck. Survey areas listed: usability, UI text legibility, audio, features, bugs. No comfort scale is named;
   it points to Schell Games' "The Definitive Guide to Playtest Questions" (not read here).
   For us: instructions in Meta's model come from a live voice (a facilitator), and questions come right after
   each part, one or two at a time; nothing about timed on-screen steps.

6. **Meta's automation page: what runs without a person.** Meta, "VR App Testing Guide - Automation and
   Performance" (no last_updated on the page; it still names "Meta Quest and Quest 2" as current, so it is older:
   date unverified, its point not aged). https://developers.meta.com/horizon/resources/automation-performance-testing
   "Trigger events on device", for example "move character to Y position", and read performance over ADB during
   the event; set performance KPIs such as "time required for a specific interactions, UI response, navigation
   between scenes"; a spare headset can run tests overnight.
   For us: positions and scene changes can be scripted on the stand; what the stand cannot script is real head
   and hand motion, which is the person's part.

## Not found or not read (14.10.2026)

- No Meta page read here names a head-motion protocol (which turns, how fast, how long), a "worst-case view"
  procedure, or a comfort rating scale for testers. The searches for them returned the pages above and the
  PC-only "Guidelines for VR Performance Optimization" (Rift-era, nothing on tester motion).
- Not read, budget spent: "Testing and performance analysis" (documentation/unity/unity-perf), "Comfort"
  (design/comfort), "Locomotion comfort and usability" (design/locomotion-comfort-usability), "VR Playtesting
  Guide" (resources/playtest-guide). The Schell Games blog on Meta's site (blog/vr-playtest-best-practices-featuring-schell-games)
  returned an empty page through `metavr docs fetch`; a browser read may work.
- Item 2 (developer talks: Owlchemy GDC 2023, Connect talks, blogs; SSQ/MISC/FMS source papers) and item 3
  (how in-headset instructions are shown: until done vs timed, voice vs text) were not searched in this pass.
  SSQ (Kennedy 1993) and FMS as used by Gottsacker 2026 are already in docs/research/vr/03b-sickness.md.

## The plan for the redo of tools/measure.mjs (14.10, before any code; for the practice review)

What failed on 13.10 (docs/owner-decisions-history-2.md, the fourth window): each step showed 8 s and hid, he
stood still at spots, did not understand what to do («Я не понял, что надо делать»), and went into room 101 before
the step asked; he called it «хуйня тупая». Still spots are what the stand measures (tools/stand-measure.mjs).

The pattern, in three lines:
- Meta's performance check is a person using the app as a player would, the frame log read for long stretches
  below the bar (finding 2, VRC.Quest.Performance.1), not still views.
- Meta's playtest guide: the facilitator says each step and asks one or two questions soon after a section; the
  tester may take the headset off at any time (findings 4 and 5).
- His decision of 13.10: with him only what needs him, the head, the hands and how it feels; the rest on the stand.

What he does: one walk, about 5 minutes, told before in the chat and in the headset («одна прогулка, около
5 минут; стоять не нужно, играйте как обычно»). Each step's text stays in view until the game shows it is done,
then the next one replaces it with a short vibration:
1. The corridor's start as a player: sign, clipboard, consent, up to the doors (done: the doors are offered).
2. Look around the corridor, turning the head as quickly as is comfortable, then move with the sticks: a few
   teleports and turns (done: three moves of the player, locomotion's 'player-moved').
3. Press door 101 and go in (done: the room's procedure has begun).
4. Play the trials as usual for about a minute (done: 60 s into the trials).
5. ≡ on the left controller, «Выйти из опыта», confirm (done: back in the corridor).
Then in the chat, two questions (Meta's guide: one or two, soon after): was anything unpleasant, and where did
it jerk, if anywhere.

What the machine records the whole walk, no still windows: every frame, each late one with its time (the
headset's clock), its length, the place (as now), the head's turning speed at that frame, and whether the player
was aiming, moving, or had the menu open; the GPU's stages once a second for the whole walk (one
ovrgpuprofiler run); heat and memory at the start and the end; when each step's text was shown and removed, so
a late frame can be set against it. No OVR Metrics overlay and no Perfetto trace during the walk: both cost
frames, and the 13.10 overlay's dips are still unexplained (docs/board.md, «Исходная мерка»).
