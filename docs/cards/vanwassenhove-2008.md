# vanwassenhove-2008 — The growing disc that lasts longer (looming time dilation)

- paper: vanwassenhove-2008.txt
- citation: van Wassenhove, Buonomano, Shimojo & Shams (2008). Distortions of subjective time perception within and across senses. PLoS ONE, 3(1), e1437. (CC BY)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants (Exp. 1, Loom) | 25 naive adults | "Twenty-five participants (16 females, mean age 20.6 years) took part in Experiment 1" | 10 |
| Participants (Exp. 2, 3) | 15 and 18 | "Fifteen participants (7 females, mean age 26.4 years) completed Experiment 2, and eighteen participants (8 females, mean age 20.7 years) completed Experiment 3." | 10 |
| Procedure: trial | Five stimuli in a row | "In all experiments, each trial consisted of a train of five stimuli." | 10 |
| Procedure: task | Is the 4th longer or shorter than the others? | "the fourth stimulus was always the target: participants judged whether the target was ``shorter'' or ``longer'' than all other stimuli in the trial" | 10 |
| Procedure: standards | All other stimuli 500 ms | "All auditory, visual or auditory-visual standard stimuli were 500 milliseconds in duration." | 10 |
| Procedure: looming disc | Grey disc grows from 2° to 5° (receding: shrinks) | "The looming and the receding visual signals consisted of a centered gray disk changing in size from 2 to 5 degrees" | 10 |
| Procedure: gaps | Random gaps of 750–950 ms | "The inter-stimulus intervals (ISI) were pseudorandomly chosen from 750 ms to 950 ms in steps of 20 ms." | 10 |
| Procedure: setup | Chin rest, 57 cm from a CRT | "Participants sat 57 cm away from the computer screen and stabilized their heads using a chin-rest." | 11 |
| Duration | About 1 hour, 448 trials (the "~" before 1 is lost in the text) | "The entire experiment lasted ,1 hour for a total of 448 trials" | 11 |
| Main result | A looming target among steady discs feels longer | "a looming disc embedded in a series of steady discs led to time dilation" | 1 |
| Main result: visual size | Large effect in vision | "d = 1.22 and g^ = 1.18 in the visual conditions" | 3 |
| Main result: predictable | Dilation although the target was always 4th and always looming | "These results establish that the subjective dilation of perceived duration occurs even when the target is predicted and expected." | 6 |
| Main result: receding | Shrinking target: no robust change | "the latter did not induce robust changes of duration." | 3 |
| Main result: reverse | Steady target among looming discs feels shorter (vision, not sound) | "looming standards lead to the compression of subjective duration of a steady visual and auditory-visual target but not of an auditory target." | 4 |
| Cross-senses | A looming picture stretches a tone's duration | "Visual inputs capture auditory duration with time dilation." | 6 |
| Replication | Replicates the oddball dilation of earlier studies | "our data show a robust dilation of subjective time which replicates prior studies that have used unpredictable targets [2]" | 7 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: the original took about an hour with 8 conditions. The visual Loom test plus its control is 2 conditions × 42 trials (6 durations × 7 repeats). At about 6 s per trial (five 0.5 s stimuli plus gaps) that is roughly 8–9 min.
- Task/tension: dry psychophysics: "was the fourth one longer or shorter?" with no story tension.
- Within-person reveal: yes. From the player's own answers the game can compute how long a growing disc must last to feel like a 500 ms steady disc. The visual effect was large (d = 1.22), so it should often show for one player. Then replay a growing and a steady disc of equal length side by side.
- Works if the player expects tricks: likely. The target was always 4th and always looming, and dilation still occurred. Knowing the purpose of the study was not tested.
- Space tier: seated (chin rest, screen at 57 cm).
- VR or mixed reality: VR suits the original better: a dim room and a black background. Passthrough would put the disc against the real room. VR could also make the disc truly approach in stereo depth, but that is a new stimulus (the original grew in 2D), so the 2D version should come first.
- Quest 3 feasibility: feasible. The disc should be head-locked to replace the chin rest. Durations must be whole frames: at 90 Hz, 480/500/520 ms ≈ 43/45/47 frames, so dropped frames must be logged and those trials discarded. Answers are two buttons, measured automatically, and the tone conditions are easy with Web Audio.
- Replication: the paper replicates the oddball dilation (Tse et al. 2004) even with predictable targets. Later work puts the oddball expansion nearer 10% than first reported and finds it robust mainly for looming or expanding stimuli. That agrees with this paper's null result for receding discs. My search found no failed replication of looming dilation.
- Ethics: none (no flashing).
- Verdict: interlude. It is short, seated and automatically measured, with a large visual effect and a personal number. It is too dry for a full room.
