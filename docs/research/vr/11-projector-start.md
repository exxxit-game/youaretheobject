# 11. A projector at the start: how others open with an in-world briefing

Question (the owner, 12.10.2026): a small projector in the corridor shows a short film that talks
to the player (why we are here, how rare the chance of being alive is); it starts only on a clear
confirmation; it may shine on the notice board, and the clipboard, the exit poster and the flyer
appear there only when the film ends. Does a projector fit, where, and how have others solved it?
Builds on `05a-presence-onboarding.md`, `05b-attention-reveals.md`, `03c-viewing-text.md` and
`07-corridor-1979.md`; what those already hold is cited, not repeated.

The corridor today (read from the code, 12.10): corridor 1.8 m wide, ceiling 2.5 m
(`scene.js` CEIL); the player arrives at x 0.7, z 3.05 facing door 1 (`plan.js` SPOT); the light
box over door 1 is the first thing seen (`sign.js`); the board is 1.6 × 1.0 m, centre 1.5 m high,
at x −0.8 on the same north wall, so its centre is 1.5 m to the left of the arrival line and
about 1.25 m in front: about 50° to the left of straight ahead (from `plan.js`, computed). The
exit poster on the board is the game's leave button: "a participant may leave at any moment
without penalty" (`exit.js`).

Marks: **full** = the source was opened and the relevant part read; **summary** = read only
through a fetch tool's summary or a search result; **unverified** = not confirmed.

## Parts of the question (each gets an answer or "not found")

1. Shipped VR openings: I Expect You To Die, Job Simulator, Half-Life: Alyx, The Lab, Vacation
   Simulator, Superhot VR, The Room VR, Thief Simulator VR, Moss, Red Matter, Lone Echo, The
   Walking Dead: Saints & Sinners, museum and art VR, Oculus Story Studio, Meta Horizon guidance.
   For each: trigger (timer, action, gaze); briefing and tutorial merged or separate; skip or
   replay; where the screen sits relative to the start view.
2. Comfort and placement of an in-world screen or video: distance, size, height, angle, text.
3. Things that appear only after an event: how games avoid pop-in; plausibility breaks; real
   mechanisms (a screen rolling up to show what is behind it).
4. The period: 16 mm and Carousel projectors on AV carts, ceiling mounts in 1979, pull-down
   screens (Da-Lite, Draper), TV monitors on carts; product photos and sizes; NFPA 101 / OSHA on
   exit signs being always visible.
5. Starting on a clear confirmation without extra actions: switch, gaze, voice prompt, "settled"
   detection; evidence on missed starts and forced waiting.
6. Options for the owner.

## Findings

### Part 3. Things that appear after an event (research first)

- **Objects that break physical laws break Plausibility, and telling people in advance did not
  help.** Brubach et al. 2022 (IEEE TVCG, doi:10.1109/tvcg.2022.3150496), as reported in Slater
  et al. 2022 (doi:10.3389/frvir.2022.914392; library `slater-2022.txt`, section "Place Illusion
  and Plausibility", full): cubes that floated scored lower on every plausibility item than cubes
  that obeyed physics; being told beforehand of weightlessness had "no effect"; "39/40 chose the
  normal cube behaviour" as more plausible. Brubach itself not read (only through Slater).
  For us: a clipboard that fades in on the cork is the floating cube; something real has to
  bring it (a screen that rolls up, a person who pins it, a drawer).
- **A break in Plausibility usually does not recover; a break in Place Illusion does** (Slater
  2009, already in 05a §1). Slater 2009 adds (library `slater-2009.txt`, full): "when Psi breaks,
  it is unlikely to recover".

### Part 1. Shipped VR openings (as found)

- **I Expect You To Die (Schell Games, 2016): the menu is the agent's office, and a mission is
  briefed by a film reel the player puts into a desk projector, then started.** Way Too Many
  Games review, 22 Jun 2017, https://waytoomany.games/2017/06/22/not-so-new-game-review-i-expect-you-to-die-psvr/
  (summary): "Insert the movie reels into your projector and it will give you a summary of the
  mission before you hit start"; narrated by the supervisor "in a James Bond 'Q' fashion".
  Gaming Trend PSVR review (summary), https://gamingtrend.com/reviews/you-seem-to-have-this-nasty-habit-of-surviving-i-expect-you-to-die-psvr-review/:
  the player loads "the next film can into the projector after placing the other one into a
  nearby film rack"; the opening credits are praised ("don't skip them", so they can be skipped).
  Trigger: the player's action (reel into projector). Briefing and mission: separate (summary,
  then start). Replay: a reel can be put in again (inferred, unverified). Screen position relative
  to the start view: unverified. Seated play throughout (search result, unverified on a primary).

### Part 4. The period: how a US college showed film and slides around 1970–79

Main source: Ely D.P. et al., *Instructional Hardware: A Guide to Architectural Requirements*,
Educational Facilities Laboratories, EFL-TR-5, April 1970, ERIC ED043959,
https://files.eric.ed.gov/fulltext/ED043959.pdf (library `ely-1970.txt`; chapter III read in
full, the rest searched). A planning guide for school and college buildings, nine years before
our 1979.

- **Front projection from a cart at the back was the normal way.** "This is the conventional way
  in which film is projected and is currently the most widely used projection system. The
  projectors are usually set up on stands or mobile carts behind the audience" (§III.H, p. 43).
- **16 mm was everywhere.** "A 16mm motion picture projector can be found in almost every school
  in the United States" (§III.D); 8 mm was spreading; other film sizes "unusual".
- **A short film that starts on one button and stops itself existed: the film-loop cartridge.**
  "The teacher presses the start button, and the projector automatically shuts off at the end of
  the film but is ready for the next teacher to use"; single-concept films "may run for only one
  or two minutes", usually on 8 mm (§III.E). Some projectors had "built-in rear projection
  screens" (§III.D). For us: a one-press, self-ending film is a 1970s object, not a game device.
- **Screens rolled away when not in use, by hand or by motor.** "They may be rolled out of the way
  either manually or electrically when not in use"; finishes: matte, beaded, lenticular,
  metallized; matte for a wide viewing angle (§III.H, p. 43).
- **Classroom screens were square: "40" X 40", 48" X 48", 60" X 60", 70" X 70""** (1.02, 1.22,
  1.52, 1.78 m); large-group 6' to 10' square. Optimum width W = room depth / 6 (§III.H).
- **Viewing distances (Fig. III-2, "rule-of-thumb viewing criteria"): films and slides minimum 2W,
  maximum 6–10W; projected TV 4W to 12W.** Read from the figure's table: "FILMS,SLIDES 2W 6-10 W";
  "PROJECTED TV 4W 12W".
- **The lectern controlled "Room lights … Screen … 16mm sound movie projector; self-threading
  (off-on-reverse) … 35mm slide projector; automatic (off-on-advance-reverse)"** (§III.I): a
  1970 room could lower its screen and start its projector from one panel.
- **TV in rooms: monitors on carts or fixed high.** Group monitors "23 in. and 25 in."; "the size
  of the monitor in inches is equal to the approximate number of viewers"; monitors "permanently
  mounted to the wall, floor, or ceiling in 'yoke mounts'" or "mounted onto a mobile unit"
  (§IV, p. 58).
- **Video projectors on the ceiling existed in 1970, but as large-room equipment.** A TV
  projector "can be mounted on a mobile cart or celing [sic] mounted", the ceiling suiting
  "dual-unit" models with "the optical head portion mounted at the ceiling"; pictures "4 1/2 by
  6 ft up to 9 by 12 ft"; front TV projection needs the light at the screen under 1 fc (§IV,
  pp. 58–59). For us: a ceiling video projector in a 1979 corridor would be out of place; a
  rented or carted film or slide projector is the period's habit.
- **A screen hung over the tack board was standard classroom fit-out.** Pennsylvania Department
  of Education, *Worksheets for Planning Media Facilities*, ed. E.A. George, ERIC ED081201 (early
  1970s; ERIC record year 1973), https://files.eric.ed.gov/fulltext/ED081201.pdf (classroom
  checklist read in full): "Matte wall screen installed at eye level, 70" x 70" minimum";
  "Keystone eliminator"; "Tack boards: Eye level, cork and felt"; "Maps and charts. Mounting rails
  installed above chalk boards or tack boards". Glossary: a keystone eliminator lets "a projection
  screen to be tilted at an angle perpendicular to the beam of light from the projector".
- **The wall/ceiling spring-roller screen, as its maker tells it to be worked (Da-Lite Model B,
  instruction book DL-0250, 2013 edition; copy in objekt-files `notes/projector-start-2026-10-12/da-lite-2013-modelb.txt`, full),**
  https://www.markertek.com/Attachments/Manuals/DA-Lite/74648-Manual.pdf:
  mounts "on a wall, map rail, suspended from ceiling or extension brackets"; "Mount the screen so
  that bottom of picture surface, when fully extended, will be above the heads of viewers"; to
  lower: "Pull screen down all the way. HESITATE - then allow screen to retract VERY SLOWLY until
  it locks in place"; to raise: "Pull down on the pull bail, then raise quickly, as a window shade.
  Keep control of the picture surface. Do not allow it to roll uncontrolled into the case or damage
  will result." Brackets hold it 6 in (No. 6), 10 or 14 in (No. 11), 10–24 in (No. 23) off the
  wall; a "Tilt Lock … holds back bottom of screen in tilted position to eliminate keystoning".
  The CSR version (DL-0280, copy `notes/projector-start-2026-10-12/da-lite-2013-csr.txt`,
  https://inquirecontent2.ingrammicro.com/User-Manual/1040982952.pdf): "release quickly. The
  screen will retract gently into the case", speed set by a knob. For us: a plain 1979 spring
  roller goes up only with a hand on it (the slow controlled return is a later feature, its date
  unverified); a screen that rolls up by itself needs a motor (an "Electrol"-type electric screen)
  or a person.
- **The Kodak Carousel's own controls** (Kodak, *Carousel Slide Projector* operating manual,
  models 4200–5600, undated later edition, https://www.theatrecrafts.com/archive/documents/carousel_user_manual.pdf,
  text read; its lens and distance chart is a picture on a page missing from this copy): a
  "Power/Fan/Lamp" slide switch; "Press the forward button on the projector or the remote control
  to project the first slide"; a timer "for slide changes from 3 to 22 seconds" (Missouri Western
  State University's guide to the Ektagraphic III,
  https://intranet.missouriwestern.edu/imc/wp-content/uploads/sites/18/2019/05/SlideProjector.pdf,
  full); a cabled remote with forward, reverse and focus. For us: a slide show runs by itself on
  the timer once the lamp is on and the first slide is called; the player's one act is the switch.
- **A narrated slide show that runs a whole cycle on one press was a 1970s product.** US patent
  4,080,637, "Synchronized tape slide projector control system", filed 7 Jun 1976, granted 21 Mar
  1978 (Chase, Pappas, Wilson), https://patents.google.com/patent/US4080637A/en (summary): it
  "requires only a single push of the start button to initiate a complete cycle of operation",
  which "ends with turning off of the projectors". Cue tones on the tape advanced the Carousel;
  one 1984 Sono-Mag Carousel tape deck manual lists a cue "1 KHz" (search result only,
  https://www.worldradiohistory.com/Archive-Catalogs/Miscellaneous-Manufacturers/Sono-Mag-250-Carrousel-1984-Rev.pdf,
  unverified). For us: the "slide-tape" show (Carousel + cassette deck, one start button, stops
  itself) is the period's form for a recorded talk with pictures; it fits a voice over still
  pictures better than a 16 mm film would.
