# The measured baseline (his word of 13.10: everything measured in detail from the start)

Every change that can cost frames, heat or memory is measured again the same way and compared with
this. Measured 13.10 on his Quest 3 over the USB cable, the game served by the laptop
(`node tools/quest-look.mjs open local`), commit c76a092 of claude/prodolzhenie-a37327 (controllers' models from
the game itself), he wearing the headset. Raw files: objekt-files/notes/headset/perf-2026-10-13/.

## How each number is taken
- Frames, slow frames, draw calls, triangles: `node tools/quest-look.mjs perf` (five seconds of the page's own
  frames; slow = slower than 72 Hz, Meta's Quest 2 floor).
- GPU work by stage: `ovrgpuprofiler -r` on the headset (Meta, webxr-perf-tools: "whether an app is vertex or
  fragment bound").
- GPU frame time and threads: `metavr perf capture --app com.oculus.browser --mode vr --duration 10000`, read by
  `metavr perf analyze-trace <session> --app com.oculus.browser` (Perfetto).
- Heat: `dumpsys thermalservice` and `dumpsys battery` at the start and the end; memory:
  `metavr perf memory-snapshot --app com.oculus.browser`.
- Loading: the page's navigation timing (`performance.getEntriesByType('navigation')`), and the time from
  `quest-look vr` to VR.

## The numbers

| Moment | Frames | Slow frames (worst) | Draw calls | Triangles | Other |
|---|---|---|---|---|---|
| Corridor, standing (first look) | 90 fps | 0 (13 ms) | 19 | 24 280 | GPU 6.19 ms a frame on average, 8.72 ms at most, of 11.1 ms (40 frames, Perfetto); fragments 96.8 % of shading time, vertices 3.2 %, shaders busy 82.9 % at 492 MHz; page main thread running 33 % |
| Corridor, standing, just after entering VR | 89 fps | 3 (33 ms) | 28 | 25 048 | the first seconds of VR |
| Corridor, looking along it at the doors | 90 fps | 2 (26 ms), then 0 (14 ms) | 21, then 19 | 24 798, then 15 858 | |
| Room 101, standing | 90 fps | 1 (20 ms) | 29 | 60 594 | fragments 97.6 % of shading time, vertices 2.4 % |
| Room 101, turning the head | 90 fps | 0 (13 ms) | 18 | 27 560 | |
| Room 101, after asked to walk out (still inside, the room's intro) | 89 fps | 4 (23 ms) | 20 | 24 792 | |
| The whole walk, 61.7 s | — | — | — | — | page main thread running 47.8 %, the browser's VR thread 22.2 %, its GPU thread 18.1 % (Perfetto, no GPU counters in a started-and-stopped trace) |

- Loading from the laptop over the cable: the page's DOM ready at 1085 ms, loaded at 1180 ms; the scene loaded
  about 3.8 s after the open command; `quest-look vr` to VR: 1.25 s.
- Heat over about 6 minutes worn: SoC 50.5 °C to 55.1 °C, the NSP 50.3 °C to 54.5 °C, battery 35.0 °C to
  37.0 °C; thermal status 0 throughout; the headset throttles from 89 °C (its own thresholds).
- Memory: the browser's main process 416 MB resident (225 MB proportional); 2.65 GB available on the headset.
- Other sites asked by the page in VR: none; the Quest 3 controllers' models came from vendor/aframe-assets.

## What it says
- The GPU spends almost all its time filling pixels, not on the shapes: savings for the weakest headset lie in
  what each pixel costs (materials, overdraw, resolution, foveation), not in triangles.
- Slow frames gather in the first seconds of VR and around moves between places; standing still they vanish.

## Not measured yet (each needs its own run)
- The door passage frame by frame (it took about 12 s; only the minute-long trace covered it, and a started-and-
  stopped trace carries no GPU counters: next time a 10-second `perf capture` across the passage).
- Leaving the room for the corridor (the room's intro was running; it was not left).
- The corridor's start (the sign, the clipboard, the consent) and room 101's run itself.
- Over the internet (the test copy) instead of the cable; on a Quest 2 (none here); a long run past 10 minutes.
- OVR Metrics Tool records no file for the browser: no CapturedMetrics folder after a VR session with its CSV
  switched on (as a Meta forum post said: HUD only); its HUD showed in his headset.
