# 05 — Wow, presence and first minutes: guiding attention with sound, motion and light; diegetic UI; reveals and surprise; curiosity (sections 3-6)

Part of `05-wow.md`, which says how to read each item and lists the sources read in full and the gaps.

## 3. Guiding attention with sound, motion and light

- **A new sound makes people look for its source even when it is off-screen; movement guides too;
  static light did not; a flickering lamp placed high, without sound, went unnoticed** — Rothe &
  Hußmann 2018 — verified yes — Key line (summary): sound itself mattered more than its direction; a
  moving light cone changed viewing direction, a non-moving light did not; higher objects drew less
  attention (stated as a plausible assumption) — For us: the light-box sign is high over door 1 and
  flickers: its starter clicks and hum are what will turn heads, so they must play from the sign and
  before the first flash.

- **Taxonomy of guidance: diegetic/non-diegetic, visual/auditory/haptic, on/off-screen,
  world/screen-referenced, direct/indirect, subtle/overt, voluntary/forced. Diegetic cues gave higher
  presence; forced rotation lowered it; fade-to-black disturbed, desaturation did nothing** — Rothe S.,
  Buschek D., Hußmann H., "Guidance in Cinematic Virtual Reality — Taxonomy, Research Status and
  Challenges", Multimodal Technol. Interact. 3(1):19, 2019, doi:10.3390/mti3010019 — verified yes (full);
  Nielsen et al. VRST 2016 and Danieau et al. 2017 only via this review — Key line (Table 4, §5.2):
  diegetic = high presence but story-dependent; non-diegetic = noticeable but disrupting — For us: guide
  with things that belong in a 1979 lab (a phone rings, a lamp buzzes, a door clicks); keep arrows for
  emergencies.

- **When the big moment matters, a transient sound beats a rumble; lead the eye stage by stage** — HL:A
  node "Train Crash" (Alireza Razmpoosh) — verified yes — Key line: players often missed the crash;
  a rumble was too subtle, a transient explosion sound reliably drew attention to the smokestack —
  For us: the cue that starts each room's key event should be short and sharp, from the event's place.

- **Timer plus look-trigger: if the player looks early, start the moment; if not, start it after a
  short delay anyway** — HL:A node "Shotgun Gate 2" (Dan Ginsburg) — verified yes — Key line: a common
  trick for moments the player should see but that cannot wait forever — For us: fits our engine's
  look events; useful for the sign and for reveal moments, never for the measured phase (see §11).

- **Music can tell players the world changed and they should move on; recurring musical patterns kept
  a goal in mind over hours** — HL:A nodes "Music" and "Substation Sounds" (Mike Morasky) — verified yes —
  Key line: with simple action music fewer playtesters forgot their quest or got lost in the laundry
  props — For us: music changes behaviour; allowed in the corridor and debrief, not during a measure.

- **Sound gives presence and attention: binaural, per-source placement (Henry had 3 mono sources:
  mouth, hands, feet), one attenuation curve so loudness reads as distance; too many spatial sounds
  overwhelm** — Bible T., "Binaural Audio for Narrative VR", Oculus Story Studio blog, 31 May 2016
  (archived …/story-studio/blog/binaural-audio-for-narrative-vr/) — verified yes (full) — Key line:
  sounds that turn with your head immediately break presence — For us: the voice should come from a
  place (a speaker grille, the experimenter's position), not from inside the head.

- **Content of the sound matters more than its localisation; music carries emotion but must survive
  unpredictable durations** — Pausch et al. 1996, "Sound" — verified yes — Key line: careful choice of
  ambient sounds and music mattered more than localisation details — For us: invest in a believable
  room tone for the 1979 lab before fine HRTF work.

- **Every interaction needs its own correct sound; generic sounds are noticed in VR** — HL:A nodes
  "Russell Typing" (Sara Charhon) and "Physics Sounds" (Alden Kroll); Schell 2015 Lesson Three —
  verified yes — Key line: Valve built ~2,000 object-specific sounds for 160+ objects; Schell: expect
  to double sound work in VR — For us: clipboard, door, switch, chair each need their own sounds.

- **Peripheral vision is motion- and flicker-sensitive; subtle flicker guidance is unreliable in HMDs
  (frame rate, field of view); overt cues raise recall** — Rothe et al. 2019, §2.2 and §5.4 — verified
  yes — Key line: tuned subtle cues were either not subtle or did not work — For us: do not build
  "invisible" gaze tricks; use plain diegetic cues.

- **People follow where others look or point; dead zones push the eye elsewhere; difference in colour,
  scale, motion or visibility singles out the target** — Mateer J., "Directing for Cinematic Virtual
  Reality", J. Media Practice 18(1):14–25, 2017, doi:10.1080/14682753.2017.1305838 (accepted version
  https://eprints.whiterose.ac.uk/116714/) — verified yes (full; an argued essay, not a study) — Key
  line: film techniques of differentiation and passive cueing should carry over — For us: low-weight
  source; use only alongside the tested cues above.

## 4. Diegetic UI and signifiers

- **UI design space: non-diegetic, meta-perception, meta-representation, geometric, diegetic, and
  signifiers; a fully diegetic UI is not automatically more immersive** — Fagerholt E., Lorentzon M.,
  "Beyond the HUD: User Interfaces for Increased Player Immersion in FPS Games", MSc thesis, Chalmers,
  2009, https://publications.lib.chalmers.se/records/fulltext/111921.pdf — verified yes (chapters 7–12;
  guidelines rest on small user tests, 5 players each, authors call them unverified) — Key line (§10.1):
  diegetic is a strong tool but other categories have their own advantages — For us: the clipboard is
  a good diegetic choice; do not force everything into props when a plain cue serves better.

- **Signifiers and affordance amplifiers: make the interactive thing move or stand out (a curtain
  swaying marks the one open window), suppress look-alikes; offer escalating help on request** —
  Fagerholt & Lorentzon 2009, §10.3 (Design Examples 2 and 3) — verified yes — Key line: in Mirror's
  Edge tests players preferred no guidance but sometimes got stuck; help should grow in detail only when
  asked — For us: the clipboard on its hook and the door to go through should be the only things that
  "invite"; other doors read as closed.

- **Make movement diegetic: holographic feet as the teleport target, footsteps after a teleport;
  players then described "walking", not "teleporting"** — HL:A node "Teleporting & Immersion" (Owen
  Macindoe) — verified yes — Key line: footstep audio changed how players recounted their movement —
  For us: our teleport arc could end in feet and play steps; cheap, and it supports Plausibility.

- **Even the menu can be a world object: Job Simulator's exit is a burrito you eat; a briefcase is the
  menu** — Schwartz A. in Voices of VR #315, 2016,
  https://voicesofvr.com/315-job-simulator-and-the-magic-of-hand-presence/ — verified yes (full
  transcript) — Key line (00:16:40): you open the briefcase and take two bites of the "exit" burrito —
  For us: confirms the project's EXXXIT exit door as the "leave" button.

- **Ask "why is this here?" of every object; tie each challenge to setting, world or characters, not to
  "escape-room logic"** — Nicholson S., "Ask Why: Creating a Better Player Experience Through
  Environmental Storytelling and Consistency in Escape Room Design", Meaningful Play 2016,
  https://scottnicholson.com/pubs/askwhy.pdf — verified yes (full) — Key line: a laser maze in an
  Egyptian pyramid breaks immersion; anachronisms do too — For us: every corridor object needs a 1979
  lab reason; players treat every visible object as meaningful.

- **Screen-relative HUDs are something VR is bad at** — Schell 2015, Lesson Two — verified yes — Key
  line: list of things VR is bad at includes screen-relative HUD interfaces — For us: no head-locked
  text, as the project already decided.

## 5. Reveal moments and surprise

- **A good surprise has four parts: it is unexpected, it was set up beforehand, it is not highly
  unlikely, and it makes sense afterwards** — Nicholson 2016, "Adding Surprises and Emergent
  Narratives" (citing Skolnick 2014) — verified yes (Skolnick via Nicholson) — Key line: surprise should
  be used sparingly and must fit the genre — For us: the "how it was done" reveal should point back to
  things the player already saw (the setup), so it lands as "of course!" not "cheat".

- **Awe design: a set path that ends in an unexpected view (a waterfall hidden behind trees, a panorama
  behind peaks)** — Chirico A., Ferrise F., Cordella L., Gaggioli A., "Designing Awe in Virtual
  Reality: An Experimental Study", Front. Psychol. 8:2351, 2018, doi:10.3389/fpsyg.2017.02351 (in folder)
  — verified yes (methods and results) — Key line: Mountains gave the highest awe (median 6 of 7) vs a
  closed meadow (median 3), n=36, 3 min each; but "need for accommodation" (the surprise part) did not
  differ between scenes — For us: hiding-then-revealing is a documented design, but its surprise
  component was not shown to work in that study; vastness was.

- **Elevators are one of the few ways to direct the view in VR: use them like a crane shot for a
  reveal, slowly, with the cabin always in view for comfort** — HL:A node "Elevator Comfort" (Colby
  Sieber) — verified yes — Key line: obstruction was added until part of the elevator was always in
  the field of view — For us: if a reveal needs motion, move the player in a cabin-like frame, slowly.

- **Put the player where they must look: a two-handed roller door fixes position, facing and hands;
  the designers know the exact moment the view opens** — HL:A node "Gauss Canon" (Claire Hummel) —
  verified yes — Key line: it occupies both hands so they know the player isn't teleporting or doing
  anything else — For us: a physical action that frames the view (open a lid, lift a screen) is a
  clean way to time a reveal without forcing the camera.

- **Introduce new threats at a distance and without duress; telegraph to lower tension when something
  new must be understood** — HL:A nodes "Combine Sighting" (Kelly Thornton) and "Reviver
  Foreshadowing" (Joe van den Heuvel) — verified yes — Key line: in intense situations players fail to
  notice or retain critical information — For us: the reveal/debrief must be calm; do not explain the
  science while the player is still startled.

- **Mystery ads that reveal the product only at the end produce better later brand recognition** —
  Loewenstein G., "The Psychology of Curiosity: A Review and Reinterpretation", Psychol. Bull.
  116(1):75–98, 1994 (footnote 1, citing Fazio et al. 1992) — verified yes (full; scanned PDF read page
  by page) — Key line: footnote 1 — For us: withholding the explanation until after the experience is
  supported, not only by ethics practice.

## 6. Curiosity as the engine (information gap)

- **Curiosity is a felt gap between what one knows and wants to know; it needs some prior knowledge
  ("prime the pump"); a question, an unresolved sequence, a violated expectation, someone else knowing,
  or a forgotten fact all open the gap** — Loewenstein 1994, "An Integrative Interpretation" and
  "Involuntary Curiosity" — verified yes — Key line (p. 91): five situational triggers of curiosity —
  For us: each room should open one specific gap early ("what will happen to your arm?") and close it
  in the reveal.

- **Guessing plus feedback increases curiosity; insight problems raise more curiosity than incremental
  ones; satisfaction often disappoints; curiosity fades fast when attention moves elsewhere** —
  Loewenstein 1994, "Guessing and Feedback" and "Curiosity's Combination of Intensity, Transience…" —
  verified yes — Key line (p. 91–92): guess-then-feedback raised curiosity in Loewenstein et al. 1992 —
  For us: ask the player to guess before the reveal; deliver the reveal immediately, before
  distraction; make the explanation itself a small "aha", not a lecture.

- **Curiosity peaks when confidence is ~50%; wrong guesses followed by the answer, under high curiosity,
  are remembered better 1–2 weeks later; people pay time/tokens for answers they are curious about** —
  Kang M.J., Hsu M., Krajbich I.M., Loewenstein G., McClure S.M., Wang J.T., Camerer C.F., "The Wick in
  the Candle of Learning", Psychol. Sci. 20(8):963–973, 2009, doi:10.1111/j.1467-9280.2009.02402.x —
  verified yes (full; small samples: 19 fMRI, 12 returned for recall, 30 behavioural) — Key line: peak
  curiosity at confidence 0.45–0.55 for three quarters of subjects; subjects waited 3.7 s longer per SD of
  curiosity — For us: a debrief question the player can only half-answer ("how far do you think you
  threw?") before showing their own data makes the finding memorable and shareable.
