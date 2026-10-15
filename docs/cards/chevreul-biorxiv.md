# chevreul-biorxiv — The pendulum that swings by itself (Chevreul pendulum)

- paper: chevreul-biorxiv.txt
- citation: Cantergi, Awasthi & Friedman (2019). Moving by thoughts alone? Amount of finger movement and pendulum length determine success in the Chevreul Pendulum Illusion. bioRxiv preprint, doi:10.1101/841445 (not peer reviewed).
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 13 right-handed adults | "Thirteen right-hand dominant subjects (9 females), with normal or corrected vision took part in the study." | 4 |
| Procedure | Hold the pendulum and try to make it move without consciously moving the hand | "they held the pendulum and attempted to cause it to move (without consciously moving their hand)" | 5 |
| Procedure: conditions | 40 cm, then 20 cm, then 80 cm string | "This was performed with a 40 cm pendulum (as before), then with a pendulum half the length (20cm), and double the length (80cm)." | 5 |
| Procedure: no vision | Last attempt with 40 cm, eyes not on it | "in the sixth trial they repeated the attempt to move the 40cm pendulum, but without visual feedback" | 5 |
| Physical space | Standing at a marked spot, arm outstretched | "Subjects stood at a marked location, with their hand outstretched in front of them." | 5 |
| Equipment | Magnetic motion capture, 8 sensors on pendulum and arm | "A magnetic motion capture system (Polhemus Liberty), sampling at 240 Hz with 8 sensors" | 5 |
| Pendulum physics | Resonant frequencies 2.00 / 1.05 / 0.70 Hz | "The resonant frequencies for the 20cm, 40cm and 80cm pendulums were found to be 2.00 Hz, 1.05 Hz and 0.70 Hz respectively." | 5 |
| Duration | 2 min per recording, six recordings plus calibration; whole session not stated | "Each recording was for 120 seconds." | 5 |
| Measure | Success = big swing plus thumb rhythm near the pendulum's own frequency | "the thumb FFT showed its largest peak close (defined as less than 15%) to the resonant frequency of the pendulum" | 6 |
| Main result | Best: 40 cm with vision, 62% | "The success was greatest using the 40 cm pendulum with vision (62%)" | 6 |
| Main result: other conditions | 80 cm 46%, 20 cm 8%, no vision 31% | "lower success rates were achieved with the longer (46%) and shorter pendulums (8%), and when no visual feedback was allowed (31%)" | 6 |
| Main result: non-responders | 4 of 13 never succeeded | "Four subjects (31%) were unsuccessful in all tasks." | 6 |
| Mechanism | Hand rhythm matches the pendulum's resonant frequency | "the Chevreul pendulum illusion is produced when the fingers holding the pendulum generate an oscillating frequency close to the resonant frequency of the pendulum" | 2 |
| Who succeeds | People who move more anyway | "subjects that tended to move their fingers more were more successful in producing the illusion" | 2 |
| Body part | Mostly the shoulder | "For the successful trials, the shoulder contributed the most movement for 13 trials" | 8 |
| Earlier study | Easton & Shor (1976): 60 of 75 | "out of 75 subjects, only 60 were able to create the illusion" | 3 |
| Status | Preprint | "which was not certified by peer review" | 1 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: 2 min per attempt; two or three attempts plus the reveal, about 6–10 min.
- Task/tension: "make the pendulum swing by thought alone" — the player tries, and watches it start to swing.
- Within-person reveal: yes, strong — the tracked hand path, magnified and laid next to the pendulum's swing, shows the player's own arm (mostly the shoulder) drove it at the pendulum's rhythm.
- Works if the player expects tricks: probably — participants were told the goal (move it without consciously moving the hand), so it did not rely on naivety. But this paper measured movement only; it did not ask whether people felt they had moved it.
- Space tier: standing (in place, arm outstretched at a marked spot).
- Quest 3 feasibility: the swings are slow (about 0.7–2 per second), so headset hand or controller tracking should be enough to drive a simulated pendulum and record the measure automatically. Risks: no real weight — the player holds a controller or nothing, so the bob's pull is missing (no force feedback), and whether the illusion survives a weightless pendulum is untested; tracking jitter or smoothing must not itself swing or damp the virtual pendulum; the virtual string must keep real-scale physics (40 cm, about 1 swing per second).
- Replication: one small preprint (13 people) by one group, not peer reviewed; it cites an older study in which 60 of 75 people produced the illusion.
- Ethics: none special; no deception needed.
- Verdict: room — fits Quest 3 well (standing, 2-min attempts, automatic measure, own-hand reveal, works with informed players), but rests on a 13-person preprint, fails for about a third, and a weightless virtual pendulum is untested; needs a pilot first.
