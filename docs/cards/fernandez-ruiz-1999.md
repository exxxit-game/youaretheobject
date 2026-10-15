# fernandez-ruiz-1999 — The throw that missed after the glasses came off (prism adaptation and aftereffect)

- paper: fernandez-ruiz-1999.txt
- citation: Fernández-Ruiz & Díaz (1999). Prism adaptation and aftereffect: specifying the properties of a procedural memory system. Learning & Memory, 6(1), 47–53. Universidad Nacional Autónoma de México. Text: PMC311278 (HTML full text saved as fernandez-ruiz-1999.html; the PMC and publisher PDFs refuse scripted download).
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 100 healthy adults, 10 groups of 10 | "A total of 100 unpaid healthy adult volunteers with no history of neurological injury was divided into 10 groups of 10 subjects each." | Materials and Methods |
| Procedure: lenses | Prism lenses shift the whole view sideways; 10, 20 or 30 prism diopters | "Subjects viewed the target binocularly through 10-, 20-, or 30-diopter Fresnel 3M Press-on plastic lenses" | Procedure |
| Procedure: target | Clay balls thrown at a 10 × 10 cm cross at shoulder height, 2 m away | "centered at shoulder level 2 m in front of them" | Procedure |
| Procedure: space | Thrower stands still; head free | "The subjects stood without changing their foot position during performance of the task, the head was unrestrained" | Procedure |
| Procedure: before | 25 throws without prisms | "A baseline throwing performance was obtained by having the subjects throw 25 balls at the target before they donned prisms (PRE condition)." | General design |
| Procedure: after | 25 throws after the prisms are removed; the aftereffect is the miss to the other side | "After removing the prisms, the subjects threw 25 more balls with the same arm and in the same way as before (POS condition)." | General design |
| Procedure: origin | Throwing method taken from Martin et al. 1996 | "In these experiments we followed the throwing technique described by Martin et al. (1996a,b)." | Procedure |
| Duration | Not stated for the session; 25 throws take under a minute (Experiment 1: 25 before, 25 with, 25 after) | "the new motor memory was achieved in seconds, as throwing 25 balls takes <1 min" | Discussion |
| Main result: what drives it | The aftereffect grows with the number of throws while wearing prisms, not with the time worn | "the adaptation process is dependent on the number of interactions between the visual and motor system, and not on the time spent wearing the prisms" | Abstract |
| Main result: how few throws | Three throws already give a robust aftereffect | "as few as three interactions between the visual and the motor systems can produce robust aftereffects" | Discussion |
| Main result: no throws, no effect | Wearing the prisms 2 min without throwing gave no aftereffect | "Statistical analysis revealed a significant difference between PRE versus POS (P < 0.05) for all groups except the one that threw 0 balls" | Results |
| Main result: link | Bigger adaptation, bigger aftereffect (r = −0.978 across 8 groups) | "there was a linear correlation (r = −0.978, P < 0.001) between adaptation" | Results |
| Measure: speed of adapting | Stronger prisms need more throws to adapt (30 diopters: 12.2; 20: 9; 10: 6) | "was 12.2, the 20-diopters group reached it at 9, and the 10-diopters group did it at the sixth throw" | Results |
| Awareness (cited study) | Telling people about the prisms reduced adaptation (Jakobson & Goodale 1989, cited) | "making subjects aware of the visual displacement by providing them with explicit information about the prisms led to reduced levels of adaptation" | Discussion |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: about 3–5 minutes for 25 + 25 + 25 throws; the paper says 25 throws take under a minute.
- Task/tension: a simple, playful aim game (hit the cross); the tension is the sudden miss when the view is shifted and the second sudden miss, to the other side, when it is restored.
- Within-person reveal: strong — the player's own hits plotted throw by throw: on target, then off, then back, then off to the opposite side after the shift is removed. Nobody else's data is needed.
- Works if the player expects tricks: largely yes; adaptation and aftereffect are sensorimotor. The paper cites a study where explicit information about the prisms reduced (did not abolish) adaptation, so the room should not announce the shift in advance; the size of the aftereffect for players who guess it is unknown.
- Space tier: standing (the thrower does not move the feet; the 2 m to the target is in the virtual scene, not in the room).
- VR or mixed reality: VR suits the original better. Prisms shift everything the eyes see, including the hand; in VR the whole rendered view can be rotated sideways around the head. In mixed reality the real room and the real hand come from passthrough, which a web game cannot shift (no camera frames), so only virtual objects would move — a different, partial conflict.
- Quest 3 feasibility: good. Throwing with a controller (release on trigger) or with hand tracking; the shift is a yaw rotation of the rendered scene. Converting prism diopters to an angle uses the standard definition (1 diopter = 1 cm at 1 m, so 30 diopters ≈ 17°) — this conversion is ours, not the paper's. Hit positions are logged automatically. Throwing physics of virtual balls must feel natural, otherwise misses come from the physics, not from the shift; this needs a pilot.
- Replication: the effect has been known since Helmholtz; this paper repeats the Martin et al. (1996) throwing protocol with 100 people in 10 groups, and the same Mexican lab has used it in many later studies (listed in the 2025 review by Reynoso-Cruz, Galvez & Fernandez-Ruiz, eNeurobiología 16(41), not carded).
- Ethics: none special; brief disorientation; keep the player inside the stationary boundary and warn before the throw phase.
- Verdict: first-room candidate — short, standing, automatic, robust, works on suspicious players, and the player sees the effect in their own throws.
