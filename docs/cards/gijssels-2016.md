# gijssels-2016 — Your voice follows the avatar's pitch (speech accommodation to a virtual agent)

- paper: gijssels-2016.txt
- citation: Gijssels, Staum Casasanto, Jasmin, Hagoort & Casasanto (2016). Speech accommodation without priming: The case of pitch. Discourse Processes, 53(4), 233–251. (Author's copy from casasanto.com of the 2015 online-first version; page numbers below are that copy's, 1–19.)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 72 Radboud University community members (24 men), paid | "Seventy-two members of the Radboud University community (24 male) participated in exchange for payment." | 5 |
| Participants: language and age | Native Dutch speakers, 16–30 | "Participants were all native speakers of Dutch between the ages of 16 and 30" | 5 |
| Procedure: manipulation | Agent's recorded voice shifted 5% up or down (between groups) | "Participants in the High condition heard these recordings with an F0 raised by 5%, and those in the Low condition heard them lowered by 5%." | 6 |
| Procedure: scene | Virtual supermarket aisle | "The virtual supermarket consisted of a single long aisle with shelves on both sides, stocked with products" | 6 |
| Procedure: posture | Seated; driven along in a virtual golf cart | "Participants remained seated on a chair throughout the experiment." | 7 |
| Procedure: baseline speech | Alone first: describe four products | "we gave participants written instructions (via the HMD) to look at four products on the shelves in front of them" | 7 |
| Procedure: conversation | Agent asks 3–4 questions about each of six products | "stopping at six items (bananas, ketchup, light bulbs, toothpaste, cat food, and beer) to ask them three or four questions about each one" | 7 |
| Procedure: wizard | A hidden experimenter advanced the agent's scripted lines | "pressed a button to advance VIRTUO/A to the next utterance in his or her script" | 7 |
| Procedure: agent cannot understand | Scripted, no real understanding | "s/he did not have the ability to understand or flexibly respond to participants' utterances" | 7 |
| Procedure: after-measure | Alone again: describe the study for future participants | "a written prompt appeared on the screen thanking participants for their participation and asking them to describe the study for future participants" | 8 |
| Equipment | NVIS nVisor SX60 headset; microphone on the headset | "Participants' speech was recorded through a microphone suspended from the HMD." | 7 |
| Measure | Mean F0 per answer, hand-segmented in Praat | "All data were manually coded in the speech processing software Praat" | 8 |
| Duration | Not stated (4 baseline turns, 6 products × 3–4 questions, 1 after-turn) | "stopping at six items (bananas, ketchup, light bulbs, toothpaste, cat food, and beer) to ask them three or four questions about each one" | 7 |
| Baseline equal | No pitch difference between groups before the conversation | "Whereas in the Preconversation block participants' F0 did not differ between condition" | 9 |
| Main result | High group spoke 3.89 Hz higher than Low group during the conversation | "High condition had an F0 that was on average 3.89 Hz higher than the F0 of participants in the Low condition" | 10 |
| Main result: summary | Accommodation present, but did not grow during the conversation | "Participants accommodated to the virtual interlocutor, but accommodation did not increase in strength over the conversation" | 2 |
| Main result: turn by turn | Each answer's pitch tracked the agent's question pitch (about 0.5–0.6 Hz per Hz) | "For every change in Hz in VIRTUO/A's F0, participants F0 changed their F0 in the same direction by .5 Hz in the High condition" | 11 |
| Main result: no persistence | Gone as soon as the agent left | "Whereas participants had aligned during Conversation, this effect had disappeared during the Post-conversation measurement" | 12 |
| Main result: no build-up | Did not grow over the conversation | "we found no evidence for any dose dependence in either model" | 13 |
| Replication | Same pattern as the lab's earlier VR speech-rate study | "This pattern replicates findings from a previous VR study in which we found that participants accommodated to VIRTUO's speech rate from the start" | 16 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated; about 20–25 short spoken answers — probably 8–12 min. Fits.
- Task/tension: low to moderate — a chatty agent asks about everyday products; the player just answers aloud. The cover is natural.
- Within-person reveal: partly. The group effect (High vs Low) is between people and small (about 4 Hz, roughly 2% of a typical voice). But the turn-by-turn tracking is within person: the player's pitch per answer against the agent's pitch per question, and the drop back to baseline when the agent leaves, can be plotted for that player.
- Works if the player expects tricks: probably — pitch shifts of a few hertz are not consciously controlled; a player told the topic could still exaggerate or resist on purpose.
- Space tier: seated (chair, passive ride in a virtual cart).
- VR or mixed reality: VR matches the original (a virtual supermarket); mixed reality (an agent standing in the player's room) would be a new variant, plausible because the effect is social.
- Quest 3 feasibility: pitch (F0) can be estimated automatically from the microphone in the browser (autocorrelation), replacing the hand-coded Praat measure; the microphone is unverified on our headset and needs permission and a privacy rule (process locally, never send audio). The hidden "wizard" who advanced the agent's lines must be replaced by voice-activity detection (end of the player's answer → next question). Agent voices can be pitch-shifted in the browser.
- Replication: one experiment (n = 72) plus the same lab's speech-rate study (Staum Casasanto 2010); the turn-by-turn effect is strong, the group effect only just significant (the paper reports pMCMC = .04; the "=" sign is garbled in the .txt, so it is not quoted above). No independent replication was checked.
- Ethics: recording voice is personal data — analyse pitch on the device, store only numbers, ask consent; otherwise harmless.
- Verdict: room — a natural conversation with an automatic, within-person speech measure ("your voice moved with hers, then snapped back"), if the microphone works in the Quest browser and pitch tracking is reliable enough; the group effect alone is too small to show one player.
