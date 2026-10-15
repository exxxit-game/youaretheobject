# moharramipour-2022 — Cross your arms and the touches swap order (crossed-hands temporal order judgment)

- paper: moharramipour-2022.txt
- citation: Moharramipour, A. (2022). Neural basis of correct and inverted judgments in a crossed-hands tactile temporal order judgment task. Doctoral thesis, Graduate School of Frontier Biosciences, Osaka University (supervisor S. Kitazawa). Osaka University Knowledge Archive (OUKA), doi:10.18910/88182. Card uses Chapter 1 (behavioural task, 42 people).
- status: read
- text: English thesis from a Japanese university repository (Kitazawa lab, where the effect was found in 2001); pdftotext output.

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 42 volunteers, 23 men and 19 women, mean age 22.7 | "Forty-two volunteers (23 males and 19 females with an average age of 22.7" | 12 |
| Participants: retest | 24 of them came back 3–12 months later | "I asked 24 of the participants (17 males and 7 females) to come again and repeat the TOJ task" | 14 |
| Procedure | A brief vibration on the ring finger of each hand, one after the other | "By using mechanical vibrators, two brief successive tactile stimuli were delivered one to the ring finger of each hand." | 12 |
| Procedure: no vision, no sound | Eyes closed, white noise in earphones | "Participants closed their eyes and put on earphones that played white noise." | 12 |
| Procedure: posture | Hands on the desk, crossed or not, ring fingers 20 cm apart | "The distance between the ring fingers was kept at 20 cm in both of the postures." | 12 |
| Procedure: answer | Press the button under the hand that was touched second | "Participants were asked to judge the order of the stimuli by indicating which stimulus was delivered second." | 12 |
| Procedure: catch trials | Some trials touch the same hand twice | "both stimuli were delivered to the same hand (catch trial)" | 13 |
| Procedure: trials | 112 uncrossed trials, then 128 crossed trials | "the uncrossed session consisted of 112 trials (96 normal trials and 16 catch trials), and the crossed session consisted of 128 trials" | 14 |
| Procedure: intervals | Longer intervals (up to 900 ms) in the crossed session | "longer SOAs were included to properly sample the entire spectrum of performance" | 14 |
| Procedure: pace | 0.5–1.5 s between answer and next trial | "randomly assigned a value between 500 and 1500 ms" | 14 |
| Duration | Not stated; two sessions on one day with a 5–10 min break | "I conducted the experiment in two sessions on the same day with a short break (5~10 min) in between." | 13 |
| Main result: uncrossed | Order judged correctly above 100 ms | "In the uncrossed condition, the participants generally responded correctly when the SOA was greater than 100 ms" | 22 |
| Main result: crossed | Order often reversed even beyond 200 ms | "in the crossed condition, the participants often showed inverted judgment even with SOAs greater than 200 ms" | 22 |
| Main result: individual differences | Some reverse almost completely, others hardly | "the degree of judgment reversal varied considerably across the participants" | 22 |
| Main result: stable trait | Each person's reversal repeats months later (r = 0.95; the symbol is lost in the text) | "The reversal values of their first and second participations were highly correlated with each other ( = 0.95)" | 22 |
| Main result: sex | No significant sex difference | "the difference was not significant (Wilcoxon rank-sum test, p-value = 0.23)" | 22 |
| Replication | First found by Yamamoto & Kitazawa (2001); also Shore et al. (2002), cited in the thesis | "was discovered by Yamamoto S and S Kitazawa (2001) for the first time in 2001" | 1 |
| Top-down influence | The wording of the task changes the reversal | "One evidence for the top-down control is that the task instruction affects the judgment reversal (Badde S et al. 2016)." | 4 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated; 240 trials at roughly 2–3 s each is about 10–12 min, plus the break.
- Task/tension: "which hand buzzed second?" — trivial with hands apart, and suddenly backwards with arms crossed. The player feels their own perception fail.
- Within-person reveal: strong — the player's own curve for crossed vs uncrossed, with a "reversal value" from 0 to 1 that the thesis shows is stable in a person for months.
- Works if the player expects tricks: probably yes, because it is a perceptual error, but the thesis notes that task wording changes the reversal, so a knowing player may do somewhat better (unknown).
- Space tier: seated.
- VR or mixed reality: neither is needed by the original (eyes closed); in VR the screen goes black. Mixed reality only matters if the player should see their real arms.
- Quest 3 feasibility: the two controllers can vibrate in turn and their tracked positions confirm crossed / uncrossed automatically; answers by controller buttons. The open risk is timing: the original intervals go down to 15–30 ms, and the onset precision of controller vibration in the Quest Browser is unverified; the long-interval reversal (200–900 ms) is less sensitive. Vibration covers the whole controller in the palm, not a fingertip.
- Replication: a well-known effect (Yamamoto & Kitazawa 2001; Shore et al. 2002) reproduced here in 42 people, with high test–retest stability.
- Ethics: none special.
- Verdict: first-room candidate, if a test on the owner's headset shows controller vibration onsets are precise enough — seated, 10–15 min, automatic measures, and a strong personal reveal.
