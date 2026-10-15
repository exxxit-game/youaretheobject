# russo-2017 — The ball that forgot to fall (internal model of gravity when hitting a ball)

- paper: russo-2017.txt
- citation: Russo, Cesqui, La Scaleia, Ceccarelli, Maselli, Moscatelli, Zago, Lacquaniti & d'Avella (2017). Intercepting virtual balls approaching under different gravity conditions: evidence for spatial prediction. Journal of Neurophysiology, 118(4), 2421–2434. https://doi.org/10.1152/jn.00025.2017 (free full text, PMC5646193; PMC offers no PDF for this article, so the HTML is saved as russo-2017.html)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 29 consented, 25 analysed (13 men, 12 women, mean age 26) | "Overall, data from 25 individuals were used for the analyses (13 men and 12 women; 26 ± 8 yr, mean age ± SD" | Methods, Participants |
| Participants: selection | Right-handed, height 1.67–1.83 m only (so every point was reachable) | "Only right-handed participants with a height between 1.67 and 1.83 m were included in the study." | Methods, Participants |
| Equipment | Mini-CAVE (projection screens, shutter glasses, head tracking), not a headset | "Experiments were carried out in an immersive virtual environment [mini-CAVE, VRMedia, Pisa, Italy" | Methods, Apparatus |
| Equipment: racket | A 6 cm-radius plastic disc strapped to the palm, tracked by motion capture | "a handheld plastic racket (a thin disk of radius 0.06 m and weight 29 g) were tracked" | Methods, Apparatus |
| Space | Standing in place about 1 m from the front screen | "Participants stood in front of the mini-CAVE with the sternum near the edge of the horizontal screen" | Methods, Apparatus |
| Procedure | Hit a virtual ball launched from 6 m away with the racket; free to choose where and when | "asking 25 participants to intercept balls projected from a fixed location 6 m in front of them" | Abstract |
| Procedure: conditions | Ball with gravity (1g) or without (0g, straight line at constant speed); flight 0.6, 0.7 or 0.8 s; six end points | "three flight durations (T: 0.6, 0.7, and 0.8 s) and six via points" | Methods, Protocol |
| Procedure: trials | 360 trials, fully randomised | "Participants performed 360 trials (10 repetitions for each condition) in a fully randomized sequence." | Methods, Protocol |
| Procedure: no hint | Nothing told about where the balls would go | "No specific instructions were provided about the position of the via points or where to intercept the ball along its trajectory." | Methods, Protocol |
| Procedure: feedback | Hit ball sticks to the racket (green centre, red edge); tones for hit and miss | "hit balls remained attached to the virtual racket at the impact position for 2 s" | Methods, Protocol |
| Duration | Not stated (360 trials of under 1 s flight, plus 2 s feedback each, plus tests) | "Participants performed 360 trials (10 repetitions for each condition) in a fully randomized sequence." | Methods, Protocol |
| Measure | Hit or miss computed automatically from tracked racket and ball | "A ball was classified as “hit” when intercepted and “missed” otherwise." | Methods |
| Main result | More hits with gravity than without | "We found that participants often achieved a better performance with 1g than 0g balls." | Abstract |
| Main result: spread | 0g success from 0% to 85% across people (1g mostly above 50%, per the same sentence) | "in the 0g condition the success rates were much more broadly distributed, from 0% to 85%" | Results |
| Main result: where | Gravity-free balls hit the upper half of the racket: people aimed too low, as if the ball would drop | "interceptions tended to cluster on the upper half of the racket, indicating that participants aimed at a lower position than the actual 0g path" | Abstract |
| Main result: numbers | Mean impact 7.9 cm above racket centre for 0g vs 1.6 cm below for 1g | "0.079 ± 0.014 m (mean ± SE, n = 25) for 0g balls and −0.016 ± 0.007 m" | Results |
| Main result: time helps | The 1g advantage shrank for slower balls | "the difference in performance between 1g and 0g balls was modulated by flight duration, the difference being larger for faster balls" | Abstract |
| Replication | Same direction as earlier falling-ball studies (timing instead of place) | "In line with similar findings for the case of interception of balls falling along the vertical (McIntyre et al. 2001; Zago et al. 2004)" | Discussion |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: the original protocol is long (360 trials; total not stated, likely over 20 minutes). A game version needs far fewer trials (for example 60–80, half 0g) to fit 5–10 minutes; that is a shortened protocol, and the per-player difference will be noisier than the paper's.
- Task/tension: real and game-like: hit a fast ball with a paddle, with hit/miss feedback. The surprise is that a "simpler" ball (straight line, constant speed) is the harder one.
- Within-person reveal: strong. Every player gets both kinds of ball, so the game can show their own hit rate for falling vs non-falling balls and their impact points on the paddle: the gravity-free balls land on the top half because the hand went too low, "as if your hand knew balls must fall".
- Works if the player expects tricks: probably yes. Knowing that some balls do not fall does not remove a fast sensorimotor prediction at 0.6 s; but this is not tested in the paper, and the 1g advantage shrank with more time, so slow balls would weaken it.
- Space tier: standing (in place, arm's reach).
- VR or mixed reality: VR suits the original better. The original was a virtual room with a screen 6 m away; in mixed reality the launcher would sit behind the player's real wall in most rooms.
- Quest 3 feasibility: good. A controller replaces the strapped racket (head and hand tracking are native), and hit/miss and impact point on the paddle are computed automatically. The ball moves about 8–10 m/s, roughly 10 cm per frame at 90 Hz, so hits must be tested along the path between frames, not per frame. The paper selected players by height; a game would scale the end points to the player's height and reach. CAVE vs headset field of view and latency differ from the original.
- Replication: one study of 25 in this exact (approaching-ball, spatial) form; the underlying 1g advantage is the same direction as several earlier falling-ball studies by the same and other groups (McIntyre 2001, Zago 2004), and a 2023 Oculus Rift study from the same group (Delle Monache et al., Frontiers in Physiology; abstract checked, not carded) reports the same 1g advantage for balls falling from above.
- Ethics: none special; fast balls at the face should be avoided (the paper's end points were around the body, not the head).
- Verdict: room: short, automatic, deception-free, and every player sees their own gravity prediction in their hit rate and impact points; the trial count must be cut from 360, so pilot the per-player effect first.
