# The measured baseline (his word of 13.10: everything measured in detail from the start)

Every change that can cost frames, heat or memory is measured again the same way and compared with
this. Measured 13.10 (times local, UTC+3) on his Quest 3 over the USB cable, the game served by the laptop
(`node tools/quest-look.mjs open local`), commit c76a092 of claude/prodolzhenie-a37327 (controllers' models from
the game itself), he wearing the headset, OVR Metrics Tool's HUD on throughout (switched on at 12:12, never off).
Raw files: objekt-files/notes/headset/perf-2026-10-13/. Two fact-checks of 13.10 corrected the first version.

## How each number is taken
- `node tools/quest-look.mjs perf`: the frame rate and the slow frames over five seconds of the page's own
  frames, a frame slow when it takes over 1000/72 + 2 = 15.9 ms (tools/quest-look.mjs); draw calls and
  triangles are the last frame's (three.js resets its count every frame).
- `ovrgpuprofiler -r` on the headset, one sample a second (Meta, webxr-perf-tools: it lets you "determine whether
  an app is vertex or fragment bound"). Called with no list it printed all 47 metrics, while Meta's page says "Do
  not request more than 30 real-time metrics simultaneously": next time `--realtime="29,30"`, Meta's own call.
- `metavr perf capture --app com.oculus.browser --mode vr --duration 10000`, read by `metavr perf analyze-trace
  <session> --app com.oculus.browser` (Perfetto).
- Heat: `dumpsys thermalservice` (its current lines, not the cached ones it prints first) and `dumpsys battery`;
  memory: `metavr perf memory-snapshot --app com.oculus.browser`.
- Loading: the page's navigation timing (`performance.getEntriesByType('navigation')`), and the time from
  `quest-look vr` to VR.

## The numbers

| Moment (one five-second window each) | Frames | Slow frames (worst) | Draw calls, last frame | Triangles, last frame |
|---|---|---|---|---|
| Corridor, standing, first look (about 12:33) | 90 fps | 0 (13 ms) | 19 | 24 280 |
| Corridor, standing, just after entering VR again (about 12:36) | 89 fps | 3 (33 ms) | 28 | 25 048 |
| Corridor, looking along it at the doors, twice | 90 fps, 90 fps | 2 (26 ms), 0 (14 ms) | 21, 19 | 24 798, 15 858 |
| Room 101, standing | 90 fps | 1 (20 ms) | 29 | 60 594 |
| Room 101, turning the head | 90 fps | 0 (13 ms) | 18 | 27 560 |
| Room 101, after he was asked to walk out (the room's intro running, still inside) | 89 fps | 4 (23 ms) | 20 | 24 792 |

- GPU in the corridor (first look, Perfetto, 10 s): 6.19 ms a frame on average, 8.72 ms the highest of 40 samples,
  of 11.1 ms at 90 Hz; the page's main thread running 33.4 % of the time.
- GPU stages, share of shading time spent on fragments (pixels) and on vertices, and shaders busy:
  corridor (first look, 10 samples) fragments 95.7 % (94.9–96.8), vertices 4.3 % (3.2–5.1), busy 81.1 % (79.2–82.9);
  room 101 standing (5 samples) fragments 97.6 %, vertices 2.4 %, busy 82.9 % (82.8–83.0). These counters cover the
  whole GPU, the HUD included.
- The second Perfetto trace (`perf start` 12:36:35, `perf stop` 12:39:07) kept only its first 62 s, 12:36:37 to
  12:37:39: entering VR, the corridor and the way towards door 101, not the room. It held no GPU counters (cause
  not known), and its thread rows add up to about 156 %, so its shares are not valid.
- Loading from the laptop over the cable: the page's DOM ready at 1085 ms, loaded at 1180 ms; the scene loaded
  about 3.8 s after the open command; `quest-look vr` to VR: 1.25 s.
- Heat between 12:36:22 and 12:39:07 (2 min 45 s, starting warm, after an earlier time in VR at 12:32 to 12:34):
  SoC 50.5 °C to 55.1 °C, the NSP 50.3 °C to 54.5 °C, battery 35.0 °C to 37.0 °C; thermal status 0 at the start
  and the end; the headset's first throttling threshold is 89 °C.
- Memory at 12:39 of the browser's main process only (PID 10885; the page itself runs in its sandboxed process, not
  measured; graphics memory could not be read): resident 415 612 kB (procfs), proportional 224 563 kB (dumpsys
  meminfo); available on the headset 2 652 628 kB.
- Other sites asked by the page: none at the first look in VR (12:32), when the Quest 3 controllers' models came from
  vendor/aframe-assets; not checked over the full run nor in room 101.
- From the request to walk into room 101 (12:37:14) to the room's intro (about 12:37:53): about 40 s; the door
  passage itself was not timed.

## What it says (Quest 3, the HUD on)
- Of the GPU's shading time, 95–98 % went to pixels in both places, 2–5 % to the shapes: the cost of each pixel
  (materials, overdraw, resolution) is the first thing to measure on the weakest headset, ahead of triangles.
- Slow frames, by window: 3 just after entering VR, 2 then 0 in the corridor, 1 standing in the room, 0 turning, 4
  in the room's intro; one window each is too few for a pattern.

## Not measured yet (each needs its own run)
- A clean run, no hints in the headset and no profiler running, the page logging the time of every slow frame
  over the whole walk: he saw "very great dips" on the HUD's frame graph (13.10), and the windows above cannot
  say which were the game's and which were caused by the measuring itself (reopening the game, entering VR, the
  hints' text, ovrgpuprofiler and Perfetto running).
- Each window three times; the GPU stages with Meta's `--realtime="29,30"`; once with OVR Metrics' HUD off.
- The door passage frame by frame, with a 10-second `perf capture` across it; leaving the room for the corridor.
- The corridor's start (the sign, the clipboard, the consent) and room 101's run itself.
- Other sites over the whole run and in the room; the page's own process memory and graphics memory.
- Over the internet (the test copy) instead of the cable; on a Quest 2 (none here); a long run past 10 minutes,
  starting cold.
- OVR Metrics Tool wrote no file for the browser: no CapturedMetrics folder after a VR session following an
  ENABLE_CSV broadcast (the setting not read back), as a Meta forum post said (HUD only); its HUD showed in his
  headset.
