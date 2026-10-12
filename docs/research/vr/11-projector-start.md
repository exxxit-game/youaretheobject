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
- **Sound of the roller and the projector: recordings exist; their licence is personal and
  educational only.** BBC Sound Effects archive (searched through its own API, 12.10):
  "Household: Roller Blind, lowered and raised" 07027123 (6.4 s) and 07027124 (5.1 s); "Local
  Train, ratchet-type window blind raised & lowered" 07033162 (12.1 s); "16mm RCA cine projector.
  Start, run, stop" 07004204 (348.9 s); "Film running out on 16 mm projector. (24 f.p.s.)" 07076045
  (15.8 s). The site says its effects are for "your own personal/educational projects, or licence
  them for use" (https://sound-effects.bbcrewind.co.uk/licensing): a paid game needs the paid
  licence. No recording of a projection screen itself and none of a Carousel was found there.
- **How fast a screen rolls up: not found.** No maker's figure for a 1970s spring roller or an
  electric screen's travel speed was found (two searches); the BBC roller-blind takes (lowered and
  raised in 5–6 s in all) are the nearest measure, unverified as a screen's speed.
- **A period photo: "1975 Classroom", Eastern Oregon University, 11 Dec 1975**,
  https://library-archives.eou.edu/items/show/18599 (record and photo opened; CC BY-NC-ND 3.0 US,
  so a reference for shape, not for use in the game). The record names "an overhead projector,
  and a pull-down screen" and a bulletin board. Seen in the photo: the screen's case sits at the
  ceiling line of a lay-in tile ceiling with 2 × 4 ft troffers (like our corridor's), the white
  surface has a black border, a pull cord hangs from its bottom bar, and the screen hangs beside,
  not over, the framed bulletin board.
- **Throw across our corridor is too short for 16 mm with its standard lens.** ACOFS (Australian
  Council of Film Societies), *Film Society Handbook*, ch. 3 "Technical aspects – film", Dec 2009,
  https://acofs.org.au/Film%20Screening%20Handbook/Ch3%20technical%20film.pdf (chapter read):
  "the projection distance equals 5.20 times the width of the image" for the "standard 2 inch
  (50mm) lens"; 1 1/2 in: "3.98 x width"; "Throw (m) = Focal length (mm) x width (m) / 9.65".
  Our corridor is 1.8 m wall to wall, so a cart against the south wall throws about 1.5 m: with
  the 2 in lens the picture is 1.5 / 5.2 = 0.29 m wide, with 1 1/2 in 0.38 m (computed from the
  handbook's ratios). A 1.0–1.2 m picture on the board needs 5–6 m of throw: along the corridor,
  not across it. A slide projector with a short lens throws wider (its aperture is wider than
  16 mm's), but no Kodak lens table was read: **unverified**.
- **A cart across the corridor puts the player in the beam.** The arrival spot (z 3.05) lies
  between the south wall and the board (z 1.8): a projector behind the player throws his shadow
  on the screen (geometry from `plan.js`). Da-Lite's rule is the reverse case of the same fact:
  the picture's bottom "above the heads of viewers". A projector hung high and tilted down (the
  owner's idea) keeps the beam over the head; the period answer to the tilt is the keystone
  eliminator above.
- **Exit signs and corridors (US workplace rule, today's text, which keeps the 1970s content in
  new numbering).** OSHA 29 CFR 1910.37, https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.37
  (opened in the browser pane; history line "39 FR 23502, June 27, 1974 … 67 FR 67963, Nov. 7,
  2002"): (a)(3) "Exit routes must be free and unobstructed. No materials or equipment may be
  placed, either permanently or temporarily, within the exit route"; (b)(2) "Each exit must be
  clearly visible and marked by a sign reading 'Exit.'"; (b)(4) "the line-of-sight to an exit sign
  must clearly be visible at all times"; (b)(6) lit to "at least five foot-candles (54 lux)".
  The pre-2002 numbering was 1910.37(q): a 1973 OSHA letter quotes (q)(6) "Every exit sign shall
  be suitably illuminated by a reliable light source giving a value of not less than five foot
  candles" (search result only; https://osha.prod.pace.dol.gov/laws-regs/standardinterpretations/1973-02-27
  returned 403). For us: (1) a code EXIT sign may never be hidden or appear later; the "exit" on
  our board is the game's leave poster (`exit.js`), not a code sign, so the rule does not bind it,
  but our own rule does: a participant may leave "at any moment" (`exit.js`, owner's ethics
  line). Hiding the leave poster behind the screen during the film breaks that; it needs another
  way out in view while the film runs. (2) A projector cart left standing in a 1.8 m corridor is
  "equipment … within the exit route": a ceiling- or wall-hung projector, or one in a doorway or
  alcove, is the lawful place.
- **Half-Life: Alyx (Valve, 2020): the briefing is a video call on an in-world screen that the
  player starts; it was moved twice, away from the first view and away from the tutorial.**
  Developer commentary, node "Greenhouse" (Chris Emond), transcript at
  https://combineoverwiki.net/wiki/Developer_commentary/Half-Life:_Alyx (Wayback snapshot
  15 Dec 2024, opened in the browser pane, nodes Introduction, Greenhouse, Refuge, Olga read in
  full): first in the refuge, but "players were often too engrossed in interacting with all the
  detail in the room to pay attention"; then on the starting balcony, where "it distracted from
  the establishing shot" and "came at a time when players were still figuring out core game
  elements"; "That collision made simple things hard, like when to show the player a movement
  tooltip if they immediately started the video call"; final place: the greenhouse, "an area with
  a slightly obscured vista and fewer interactable objects", after players are "past the initial
  gameplay moments". Trigger: the player's action ("started the video call"). Briefing and
  tutorial: deliberately separated in space and time. Skip/replay: not stated. Screen: not in the
  first view; in its own small room after the first one. Node "Shotgun Gate 2" (Dan Ginsburg):
  "The combination of a timer and a look trigger is a common trick" (already in 05b).
- **Job Simulator (Owlchemy Labs, 2016): the hub is a "job museum" run by robots "which resemble
  a floating CRT computer monitor with faces"; in each job a robot supervisor gives the
  instructions; even a setting is a world object: "a panel near the ground level of the museum
  kiosk behind which is a switch"** (Giant Bomb wiki, https://giantbomb.com/wiki/Games/Job_Simulator_The_2050_Archives,
  opened in the browser pane, full). The briefing is a character with a screen for a face, talking
  as the player works: briefing and tutorial merged. Trigger, skip and screen position at the
  first view: not stated there (how a job is picked: a cartridge, per a trophy guide's search
  snippet only, unverified). The exit is a burrito (05b §4).
- **SUPERHOT VR (SUPERHOT Team, 2016): two physical acts start a level, both in the room the
  player stands in: a 3.5 in disk into a drive, then a headset pulled down from the ceiling.**
  Price D., "Getting Superhot in VR", FutureFive NZ, 12 Jul 2017,
  https://futurefive.co.nz/story/getting-superhot-vr (summary): "a room full of old knocked
  together computers", "prompting you to insert an old 3.5-inch disc into a drive", "You then
  pull down a VR-like headpiece from the ceiling and enter the game". Trigger: the player's action.
  Briefing: text on the old computer's screen in front of the player (unverified in detail).
  Skip/replay: not stated. A Steam thread notes a disk could not be put down once grabbed
  (https://steamcommunity.com/app/617830/discussions/0/1290691308577147758, search result only).
- **Red Matter (Vertical Robot, 2018): the boss briefs the astronaut at the start, and the
  tutorial is folded into a suit check.** Mogura VR (Japanese), 17 Sep 2019,
  https://www.moguravr.com/?p=108660 (summary): 「ゲーム開始後、…「コードネーム：Epsilon」は、
  上司からミッションのブリーフィングを受けます。」 ("after the game starts, Epsilon receives a
  mission briefing from the boss"); 「宇宙服のチェックを兼ねたチュートリアルが行われます」 ("a
  tutorial that doubles as a spacesuit check"). Briefing first, then the tutorial disguised as a
  task. Trigger, medium of the briefing, skip: not stated (unverified).
- **Lone Echo (Ready At Dawn, 2017): a character briefs and teaches at once: the player, a robot,
  "booting up" in a room with the captain; systems come online one by one, each with a small
  task.** Amwake D., "Lone Echo", The VR Grid, 5 Feb 2018, https://www.thevrgrid.com/?p=66864
  (summary): "This bootup sequence is used as a mini tutorial that has you slowly "rebooting"
  different systems as needed", "providing you with a small task to accomplish using the new
  concept/tool"; listed drawback: "Tutorial feels a little forced". Trigger: the character
  (timed by the story). Briefing and tutorial: merged. Skip: not stated.
- **The Lab (Valve, 2016): a hub where each experience is entered by picking up its object.**
  Wikipedia, https://en.wikipedia.org/wiki/The_Lab_(video_game) (summary): "The player enters
  each of the respective minigames by picking up the named snowglobe". A search summary adds an
  announcer voice and a "Face-Mounted Portal Sphere" held near the head (Combine OverWiki, refused
  connection; unverified). Trigger: the player's action. Briefing and tutorial: not described.
