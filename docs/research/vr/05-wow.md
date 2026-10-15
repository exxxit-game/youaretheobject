# 05 — How great VR creates "wow", presence and memorable first minutes

Researcher 5 of 6. Area: what the makers of great VR say they did (talks, postmortems, developer
commentary, interviews) and what research says about presence, body illusions, awe, curiosity,
attention guidance, onboarding and escape-room design. Last part: what fits rooms that recreate real
experiments without changing the science.

How to read an item:
**Technique / finding** — Source — verified — Key line — For us.

- "verified yes" = I opened the source in this session and read it (in full unless a scope is named).
  "via X" = I read it only through another source X that I did read. "no" = could not open.
- "Key line" is a close paraphrase with its location (node, section, page or timestamp), not a verbatim
  quote: copyright rules allow me at most one short verbatim quote per answer, so the wording is
  given by location for checking. The papers are saved in `C:\Users\admin\Documents\objekt-papers\`.
- Developer statements are what the makers report from playtests, not controlled studies; research
  items give sample sizes so their weight is visible.

What the project already holds (checked in `docs/decisions.md`, not repeated here): West 2015 (people
look around for the first 10 s), Meta comfort/looming/hand-UI guidance, Ball & Tronick 1971, the
world-fixed clipboard studies (Alexandrovsky 2020, Küntzer 2026, Regal 2019), locomotion sources.
Where my findings confirm or challenge those decisions, the "For us" line says so.

---

The findings are in four parts; the section numbers stay the same:

- `05a-presence-onboarding.md`: presence and plausibility; the first 60 seconds and onboarding (sections 1-2)
- `05b-attention-reveals.md`: guiding attention with sound, motion and light; diegetic UI; reveals and surprise; curiosity (sections 3-6)
- `05c-awe-body-comedy-pacing.md`: changes of scale and awe; the player's own body; characters and comedy; pacing (sections 7-10)
- `05d-puzzles-sharing-avoid.md`: escape-room design; sharing, spectators and replay; what to avoid (sections 11-13)

---

## 14. For us: what fits experiment rooms, and what would break the science

Rule of thumb from the sources: a technique is safe when it acts before the measure (briefing,
corridor), after it (reveal, debrief), or is part of the original procedure; it breaks the science
when it changes what the player perceives, attends to, feels or does during the measured phase.

Safe (outside the measure, or already in the original):
- Presence/Plausibility work on the lab itself (Slater 2009/2022): a credible 1979 lab is what makes
  people respond as real participants did.
- Background story and one goal before the room (Pausch 1996): the original study's instructions are
  that goal; give them, nothing extra.
- Settling time after each entrance (Unseld 2015; Rothe & Hußmann 2018): it only delays the start.
- Guess-then-reveal in the debrief (Loewenstein 1994; Kang 2009): ask after the measure is taken.
- Surprise rules for the reveal (Skolnick via Nicholson 2016): show the setup the player saw.
- Comedy and personality in the corridor and debrief (Schell 2015; Owlchemy).
- Spectator/share design (HL:A spectator HUD; Richie's Plank; Beat Saber).
- Diegetic guidance to the start point of a room (Story Studio podium; Rothe 2019).

Breaks or risks the science (inside the measured phase):
- Attention cues (sound, motion, light, look-triggers) aimed at the manipulated thing: they steer gaze
  (Rothe 2018/2019; HL:A Train Crash); fatal for any attention-dependent effect.
- Music or pacing tricks to "move players along" (HL:A Music): they change behaviour and arousal.
- Fake time pressure (HL:A Shotgun Gate 2) or hints (Nicholson 2015) unless the original had them.
- Scale or body changes not in the original (van der Hoort 2011; Banakou 2013): they alter size,
  distance and self-judgements.
- Asking how the player feels before measuring it (Slater 2022 on questionnaires).
- Narrator commentary that names a feeling (HL:A Alyx Reactions) — it would also act as a suggestion.
- Replays of the same room by the same player count as repeat exposures, with weaker responses
  (Meehan 2002) — data from replays must be marked as such.
- Passive haptics that the original did not have (Meehan 2002): they raise the response, so they are
  a change of procedure, however good they feel.

---

## Top 15 for our game (ranked)

1. **Design Plausibility, not just presence: the lab must react to the player, address them, and
   match what a 1979 lab visitor expects** (Slater 2009, 2022; Pausch 1996; Burdette 2015). PI comes
   with the headset; Psi is our job and does not recover once broken.
2. **One goal and a background story before the room; one task at a time inside** (Pausch 1996;
   HL:A Introduction/Greenhouse; Meta 2025).
3. **Let the first look land: settle 10–40 s after every entrance, then cue; open with one small,
   graspable "In"** (Unseld 2015; Burdette 2015; Rothe & Hußmann 2018; matches the project's 10 s start).
4. **Turn heads with a new, sharp sound from the source, then motion; never rely on a static or high
   light alone** (Rothe & Hußmann 2018; HL:A Train Crash, Citadel Vista; Pausch head-turn data). Direct
   check for the light-box sign.
5. **The wow is the player's own body and hands doing something real** (Owlchemy VoVR #315; Slater 2010;
   Superhot VoVR #483; HL:A gloves/reload). Our best first rooms (throws, floating arm) already fit.
6. **Guess-then-reveal: open an information gap, ask for a prediction, close it at once with the
   player's own data** (Loewenstein 1994; Kang 2009). Makes the finding remembered and shareable.
7. **Reveal by the four rules of surprise: unexpected, set up, plausible, obvious afterwards**
   (Skolnick via Nicholson 2016; HL:A elevator/roller-door framing).
8. **Every touchable thing responds with its own sound and behaviour; a small world, richly
   interactive** (Schell 2015; HL:A Physics Sounds, Russell Typing; Owlchemy).
9. **Separate facts from actions: give key information in calm, separate beats, never while the player
   is acting or startled** (HL:A Hideout Scene, Pacing, Reviver Foreshadowing; Unseld "moments").
10. **The narrator acknowledges, never dictates feelings; echo the player, redirect when stuck**
    (HL:A Alyx Reactions, Darkness Gate; Schell knife line).
11. **Diegetic-first guidance built from lab objects, with graduated help on request** (Rothe et al.
    2019; Fagerholt & Lorentzon 2009; Nicholson "Ask Why"; HL:A teleport feet).
12. **Design for the first time and for the watcher: first exposure is strongest; audiences who know
    more than the player enjoy it most** (Meehan 2002; HL:A Spectator HUD; Richie's Plank; Beat Saber).
13. **Comedy and personality live in the corridor and debrief, where they buy forgiveness** (Schell
    2015; Owlchemy VentureBeat; HL:A "Sustenance!").
14. **Vastness and scale for awe moments outside measured phases, with scale references in between**
    (Chirico 2017, 2018; HL:A Strider/Citadel; Astro Bot dual scales; van der Hoort 2011 as the
    warning).
15. **Align the player with a diegetic podium before each room; never move their body for them**
    (Ballantyne 2016; HL:A Character Choreography, Elevator Comfort).

## Core sources read or watched in full

Developers (written primary sources; no video watched — see Gaps):
1. Valve, Half-Life: Alyx developer commentary, full transcript (~120 nodes), via Combine OverWiki
   (Wayback 2024-12-15). Text kept at `scratchpad/dl05/hla.txt`.
2. Schell J., "Making Great VR: Six Lessons Learned From I Expect You To Die", Game Developer, 2015.
3. Schell J., Voices of VR #223, 2015 (transcript to ~00:16).
4. Reimer D. & Schwartz A. (Owlchemy), Voices of VR #315, 2016 (full transcript).
5. Reimer D. & Eiche A., "Owlchemy Labs Case Study: Lessons Learned from JOB to VACATION", Meta blog, 2019.
6. Unseld S., "5 Lessons Learned While Making Lost", Oculus Story Studio, 2015.
7. Burdette M., "The Swayze Effect", Oculus Story Studio, 2015.
8. Bible T., "Binaural Audio for Narrative VR", Oculus Story Studio, 2016.
9. Ballantyne J., "The Problem with Reality", Oculus Story Studio, 2016.
10. Lajeunesse F. & Raphaël P., Voices of VR #486, 2016 (full transcript).
11. Polyarc interview, PlayStation Blog, 2018 (Moss).
12. Doucet N., PlayStation Blog 2018 and Road to VR 2018 (Astro Bot).
13. Iwanicki P., Voices of VR #483, 2016 (Superhot VR, full transcript).
14. Ilavsky J. & Beck J., Voices of VR #644, 2018 (full transcript); Joynes J., PlayStation Blog 2019 (Beat Saber).
15. Meta Horizon, "Growth Insights: Building Competency in New User Onboarding", 2025 (via fetch summary).
16. UploadVR on Richie's Plank (2018); VentureBeat on Owlchemy (2017, via fetch summary); Owlchemy "Tomato Presence!" (via fetch summary).

Research (PDF + pdftotext text in `objekt-papers`; † = already in the folder, read again here):
17. Pausch et al., Disney's Aladdin, SIGGRAPH 1996 — `pausch-1996`.
18. Slater 2009, Phil. Trans. B — `slater-2009`.
19. Slater et al. 2022, Front. Virtual Real. — `slater-2022`.
20. Slater et al. 2010, PLoS ONE — `slater-2010`.
21. Petkova & Ehrsson 2008, PLoS ONE — `petkova-2008` † (results read).
22. Banakou et al. 2013, PNAS — `banakou-2013` † (abstract and results read).
23. van der Hoort et al. 2011, PLoS ONE — `vanderhoort-2011`.
24. Meehan et al. 2002, ACM TOG — `meehan-2002` † (haptics, frame rate, order effects read).
25. Chirico et al. 2016, Front. Psychol. — `chirico-2016`.
26. Chirico et al. 2017, Sci. Rep. — `chirico-2017`.
27. Chirico et al. 2018, Front. Psychol. — `chirico-2018` † (methods and results read).
28. Loewenstein 1994, Psychol. Bull. — `loewenstein-1994` (scanned; read page by page; the .txt is a note).
29. Kang et al. 2009, Psychol. Sci. — `kang-2009`.
30. Rothe & Hußmann 2018, AVR — `rothe-2018`.
31. Rothe, Buschek & Hußmann 2019, MTI — `rothe-2019`.
32. Nicholson 2015, escape-room survey — `nicholson-2015`.
33. Nicholson 2016, "Ask Why" — `nicholson-2016`.
34. Fagerholt & Lorentzon 2009, Chalmers thesis — `fagerholt-2009` (chapters 7–12).
35. Chen, Yan, Hu, Kao & Liang 2024, Proc. ACM CGIT — `chen-2024` (intro, related work, discussion).
36. Mateer 2017, J. Media Practice — `mateer-2017` (essay; low weight).

## Gaps

- **GDC talks were not watched.** YouTube caption and transcript endpoints refused automated access
  (proof-of-origin bot protection; I did not try to get around it) and GDC Vault has only overviews.
  Unwatched: Owlchemy "'Job Simulator' Postmortem" (GDC 2017, https://www.gdcvault.com/play/1024256),
  Owlchemy "Spatial Storytelling Lessons" (GDC 2017), Polyarc "Engaging VR Storytelling: A Moss
  Postmortem" (GDC 2019), Doucet "Making of ASTRO BOT Rescue Mission" (GDC 2019), Superhot GDC 2016,
  Skillman & Hackett "Three Years of Tilt Brush" (VRDC 2017). The owner could watch them, or a session
  with browser access could read the captions.
- **Tilt Brush**: no design source with substance found (the VRDC Q&A has none). Unverified.
- **Valve The Lab**: no primary written source read; only HL:A commentary mentions it (session length,
  throwing).
- **Closed or blocked papers (unverified, used only via others):** Chauvergne, Hachet & Prouzeau,
  "User Onboarding in Virtual Reality", CHI 2023 (HAL and ACM blocked by bot protection); Skarbez,
  Brooks & Whitton 2017 survey (closed; covered through Slater 2022); Keltner & Haidt 2003 (abstract
  only); Sheikh et al. 2016 BBC "Directing attention in 360-degree video" (IBC download failed);
  Nielsen et al. 2016 VRST (via Rothe 2019); Frommel et al. 2017 and Andersen et al. 2012 (via Chen
  2024); Berlyne 1954/1960 (via Loewenstein 1994).
- **Mixed reality (passthrough) wow**: not covered; no source on MR first minutes (e.g. Meta's
  First Encounters) was read.
- **"Time to wow" as a measured quantity**: no study found; only Pausch's 30-s "wow" observation and
  Meta's day-one time vs return data.
- **Sharing**: only developer anecdotes (Beat Saber, Richie's Plank, Owlchemy, Valve); no research on
  why people share VR moments.
- Most developer evidence is playtest observation; most research samples are small (n = 12–60) and
  often students; Rothe 2018 used 360° video on a 3-DoF Cardboard, not 6-DoF Quest.
