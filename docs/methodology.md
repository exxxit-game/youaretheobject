# Methodology for empirical research rooms

Scope: empirical recreations and proposed research, including the existing room 01.
Running a recreation does not establish a successful replication. The table records
that laboratory's method and earlier research proposals, not universal requirements
for science demonstrations, models, philosophy or fiction. Those use the evidence
appropriate to [their room type](research/corridor-room-plan.md). Research collection
still requires its own method, ethics review and consent; no sample plan is approved here.

| Practice | Why | In the game |
|---|---|---|
| **Standardized protocol** (Brandt et al. 2014, Replication Recipe) | Differences in results must not come from differences in procedure | Same recorded instruction and timings for everyone; `ROOM_VERSION` in every stored result; a table of every deviation from the original (below) |
| **Preregistration** (OSF; Simons 2014, Registered Replication Reports) | Hypotheses, outcome, sample, exclusions and analysis fixed before data | Before data counts as science: publish on OSF the operational definition of the outcome, sample size, exclusion rules, analysis script |
| **Funnel debriefing / suspicion probe** (Blackhart et al. 2012) | People hide suspicion and prior knowledge; it changes results | After the session and before the reveal: general to specific questions ("what was studied?", "anything odd?", "did you know this experiment?"); suspicion is analysed as a moderator, excluded only by a preregistered rule |
| **Technical quality / exclusions** (Meade & Craig 2012) | Hidden tabs, very short sessions and repeat players distort data | A player's run stores first vs repeat run, seated or standing, and how many trials a pause voided (`voided`, src/rooms/01-control/report.js); a tester's run also stores session length, time away and device (migration 0009). A player's pause durations and session length are not sent (row "Raw data" below) |
| **Random assignment, recorded** | The condition must come from a generator, not a choice | Condition drawn at start (block randomization), stored with the result, as the original study assigned its conditions at random (Alloy & Abramson 1979, Exp. 2, pp. 457–458) |
| **Raw data + derived measures, data dictionary** (FAIR, Wilkinson et al. 2016; APA JARS) | Others must be able to re-analyse | A player's run sends only the derived report, checked against the room's schema (migration 0009); a tester's run sends a separate derived playtest report with its own field and range checks (submit_playtest, same migration). Neither sends the raw event stream, since traces can identify a person and pull in three laws (docs/research/revision-2-data.md, "What is sent"). Publish the codebook and the analysis script |
| **Sample size** (Brandt et al. 2014: about 2.5× the original; Simonsohn 2015 "small telescopes") | Replications need more participants than the original | At least 160 analysed participants for room 01 (2.5 × the original 64, Exp. 2: 8 per cell); pilot data (5–10) used only for debugging, never analysed |
| **VR reporting** (Kennedy et al. 1993 SSQ) | Reviewers expect sickness, presence and hardware | A player's run does not carry device, browser or frame rate (a tester's run carries the device, a problem report the device and browser); optional short sickness check |

## Deviations from the original
An empirical recreation lists deviations from its paper; proposed research discloses
them in its debrief and preregistration:
room 01 in `docs/rooms/01-control.md`.

Sources: Brandt et al. 2014 (Replication Recipe); Simons 2014; Blackhart et al. 2012
(doi:10.3758/s13428-011-0132-6); Meade & Craig 2012; Wilkinson et al. 2016 (FAIR);
Appelbaum et al. 2018 (APA JARS); Simonsohn 2015; Kennedy et al. 1993 (SSQ).
