# Room 01: Illusion of control (Alloy & Abramson 1979, Experiment 2)

Source read in full: Alloy, L. B., & Abramson, L. Y. (1979). Judgment of contingency
in depressed and nondepressed students: Sadder but wiser? *JEP: General, 108*(4),
441–485. Page numbers below are journal pages. Facts are also in `docs/sources.md`.
Every number here lives in code only in `src/rooms/01-control/protocol.js`, and
`tests/control-protocol.test.mjs` fails if it drifts from this file.

## What the participant does (original)
| Element | Original | Page |
|---|---|---|
| Apparatus | Black stand 23×23 cm, yellow and green light 5 cm from its top, facing the subject; black box 15.5×7.5×4 cm, spring button in the centre | 450 |
| Room | Seated so that the experimenter in the observation room of a two-room suite could observe him through a one-way mirror (Exp. 1, p. 450; Exp. 2 used the same apparatus and procedure, p. 458); alone during the 40 trials (p. 452) | 450, 452, 458 |
| Trial | Yellow light = start; press once within 3 s or do nothing; at the end of the 3 s the green light comes on or not | 451 |
| Trials | 40 | 451 |
| Intertrial interval | 10–25 s, mean 14 s | 451 |
| Outcome schedule | Two punched tapes: one read on press trials, one on no-press trials | 450 |
| Conditions (Exp. 2) | 25-25 or 75-75: green on 25% or 75% of trials, whether or not you press. Random assignment | 457–458 |
| Instructions | Learn how much control you have; 3 s rule; four possibilities; sample both responses; control concept explained | 451–452 |
| Experimenter | Leaves during the 40 trials; returns and rereads the control concept | 452 |
| Measures | Judgment of Control 0–100 step 5 (No / Intermediate / Complete Control); Reinforcement if press %; if not press %; Total reinforcement %. Order conflict in the paper: p. 450 lists Total second, p. 454 says it was completed last — we follow p. 454 | 449–451, 454 |
| Post-questionnaire | Certainty of the control judgment; evidence that convinced you; evidence that would have convinced you of the opposite; complex hypotheses used, and which | 450 |
| Money task | 10 more trials, 25 cents per green light | 452 |
| Debrief | Careful debriefing | 452 |

## Results to compare with (Table 5, p. 459; text p. 461)
Mean judged control (SD): non-depressed men 20.0 (26.7) in 25-25, 30.3 (12.8) in 75-75;
non-depressed women 7.5 (14.5) and 51.4 (29.8); depressed men 13.8 (12.7) and 21.2 (28.5);
depressed women 17.1 (23.7) and 13.1 (13.6). n = 8 per cell.
Said "zero control": 25-25 — 50% of both groups; 75-75 — 50% depressed, 6% non-depressed (p. 462).
Replication (Dev, Moore, Johnson & Garrett 2022, preregistered, Table 1): end-of-task control
in zero contingency — 25%: 27.64 (MTurk, n = 83) and 18.15 (students, n = 40); 75%: 34.23 (n = 77)
and 36.83 (n = 42); 242 people in these conditions (whole study: 246 + 136 in the text, 246 + 134 in
the abstract). Overestimation of control replicated; the 75% > 25% difference was significant only for
trial-level predictions, not for the end-of-task rating; the depression link did **not** replicate.

## Our room: deviations (each is said in the reveal or in docs only, as marked)
| # | Deviation | Why | Told to player |
|---|---|---|---|
| 1 | No depression screening (BDI/MAACL) | Health data; not needed for the main effect, and the depression link failed replication | Yes |
| 2 | Money task removed | No real money; null result in Exp. 2 (p. 460) | Yes |
| 3 | Instructions paraphrased in Russian; every element kept except the sentence that the knowledge will earn money later (the money task is removed). The authors attribute the sex difference to the strong emphasis on rational judgment in the instructions (p. 462); this sentence is part of that framing | Copyright; no money task | Partly (money) |
| 4 | The paper asks "Any questions?" three times (twice in the instructions, once after the control concept, p. 451–452); we ask twice: after the instructions and after the concept (shown with the empty scale), buttons "Понятно" / "Повторить" | No live experimenter | No (docs) |
| 5 | Experimenter is a recorded voice and a wall screen with the same text | VR; hearing access | No (docs) |
| 6 | Open evidence question → choices from the participants' reasons (relative efficacy, p. 455; tried sequences, frequent green, intuition, patterns, p. 461; "other"). The "opposite conclusion" question and the content of hypotheses are dropped | Typing in a headset | Choices: yes; dropped questions: docs only |
| 7 | Gender asked at the end, "prefer not to say" allowed | Main result differs by sex | — |
| 8 | Prior knowledge asked at the end ("did you know this experiment?") | Standard for online replications | — |
| 9 | Players are not Penn undergraduates of the 1970s, and they are not paid (the originals were paid volunteers, topped up to $2.50, pp. 457, 452) | — | Partly |
| 10 | No one-way mirror and no observation room built: the window in the left wall is closed with venetian blinds (AA-V-00200B, 1973: src/rooms/01-control/scene.js). Possible effect, not reported in the paper (it does not say whether subjects knew of the mirror): a mirror can signal that one may be watched, closed blinds the opposite | The owner's decision 11.10 ("No mirrors", docs/owner-decisions.md): in VR the player has no body, so a mirror shows him nothing; blinds his pick of three | Yes: the differences page («В оригинале экспериментатор мог наблюдать… Здесь зеркала нет: окно закрыто жалюзи», pp. 450, 458) |

## Not in the paper: our choices (owner may change)
| Item | Our value | Reason |
|---|---|---|
| Tape content | Blocks of 4 with exactly 1 (25%) or 3 (75%) green, shuffled within block | Keeps actual rate near nominal at any number of presses (p. 450 fn. 2: actual control "deviated only slightly or not at all") |
| Tape advance | A tape moves on only when its response happens | One reader per response (p. 450) |
| Interval distribution | 39 values, 0.1 s steps, all 10–25 s, mean exactly 14 s, skewed toward 10 | Only range and mean are given |
| Green light duration | 2 s | Not given |
| Yellow light | On for the 3 s window, then off | Not given |
| Press outside the window | Logged as "stray", no effect | Instruction: press once, right after yellow |
| Second press in a window | Logged, no effect | "once and only once" |
| Headset menu / tab hidden during a trial | Trial voided, tapes not moved, repeated after the player is back and a minimum interval (10 s) | A trial the player could not see is not a trial |
| Press arriving after 3 s | Stray, even if the timer tick is late | The 3 s rule |
| Certainty scale | 0–100 step 5 | Format not given |
| Order of the reason choices | Random per player, "other" last; the log keeps the option, not its position | Avoids a first-position advantage |
| Answer buttons | One common text size for all answers of a question | A smaller answer looks less important |

## Flow and states (`<html data-room-state>`)
`idle` (the corridor: welcome, consent) → `intro` (instructions, check; concept with the empty scale, check) → `run` (40 trials, experimenter out)
→ `questions` (experimenter back, concept reread, 4 scales, certainty, evidence, hypotheses, gender, prior knowledge)
→ `done` (reveal: what you did → the truth → original → replication → other players → differences).

## Data sent (only with consent, only at full speed; the privacy page is privacy.html)
The condition and the whole result of `src/rooms/01-control/report.js` (counts, percentages, actual
control, heuristics, discrepancies, voided and stray presses, every answer with its shown position),
plus seated, speed and first/repeat. No raw event times. The server whitelist must list these fields.
