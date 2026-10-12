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

Split in three files (each under 300 lines): this one (Part 1, Part 5, the options),
`11a-projector-period.md` (Part 4, the period: screens, projectors, the exit rule) and
`11b-projector-screen.md` (Part 2, placement and size; Part 3, things that appear).

## Findings

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
- **Moss (Polyarc, 2018): the player is "the Reader" before a book, and a narrator reads; the
  pages turn between scenes.** Contaldi L., DualShockers review, 28 Jul 2018,
  https://www.dualshockers.com/moss-review-psvr-ps4-oculus-vive/ (summary): "The entirety of Moss
  is told out of the perspective of a storybook, with a narrator providing voiceover". That the
  game opens in a library with the book laid out in front of the player, and that page sounds mark
  scene changes: search summaries of other reviews only, unverified. Trigger and skip: not found.
- **Not reached in this pass (no source opened): Vacation Simulator, The Room VR: A Dark Matter,
  Thief Simulator VR, The Walking Dead: Saints & Sinners, museum and art VR pieces.** Oculus Story
  Studio's lessons (the antechamber "podium", 40 s of settling, the Swayze effect) are already in
  05a §1–2 and are used below.

**Pattern across the openings found:** every briefing that uses a screen or a machine is started
by the player's own act on a real object (IEYTD: reel into projector; SUPERHOT: disk into drive,
headset off the ceiling; HL:A: the player starts the call; The Lab: pick up the globe); briefings
by a character run on the story's clock (Lone Echo, Red Matter, Job Simulator). Valve moved its
screen briefing out of the first view and away from the first lessons; Red Matter and Lone Echo
fold the tutorial into a task; none found plays a film at the player before he has done anything.

## Part 5. Starting on a clear confirmation without extra actions

What each way of starting costs, from the sources found here and in 05a/05b:

| Way to start | For it | Against it | Sources |
|---|---|---|---|
| The player switches the projector on (one press on a real switch) | Unmissable: he did it, so he is looking; the period's own act (the Carousel's "Power/Fan/Lamp" switch, the loop projector's "start button", the slide-tape patent's "single push"); every screen briefing found starts this way | One more act before the corridor's task; the switch must be found (the first-minute view is narrow: 90% never looked beyond 75°, Pausch 1996, 05a) | 11a; IEYTD, SUPERHOT, HL:A above |
| Looking at it (head direction held) | No hands; our engine already has look events (`opening.js`) | Quest 3 has no eye tracking, so "look" is head direction; dwell selection's "Midas Touch" is that "users unintentionally select onscreen objects by gazing upon them" (Mohan et al., ISMAR-Adjunct 2018, doi:10.1109/ISMAR-Adjunct.2018.00039, abstract only); a look is not a "clear confirmation" | Consensus search 12.10; 05b §3 |
| Timer plus look trigger | Starts early if he looks, starts anyway if not: Valve's "common trick" | Can start a talking film while he is still learning the controls, the collision Valve moved its call to avoid | HL:A "Shotgun Gate 2", "Greenhouse" |
| A voice prompt ("press the switch to begin") | Several channels at once (Meta's onboarding blog, 05a) | Our corridor's voice is serious and the welcome exists; a prompt before the film is a second briefing; an announcer telling where to press is the non-diegetic cue the guidance research rates lower for presence (Rothe 2019, 05b) | 05a, 05b |
| The game detects he is settled (stood still, looked round) | No act at all; matches the current silent arrival and the sign's start rule (`sign.js` arrivalStep) | Not a confirmation; settling took about 40 s in Lost (Unseld 2015, 05a) and 30 s to 30 min on Alyx's balcony; a film starting on a guess is the "starts by itself unnoticed" the owner rejected | 05a; HL:A |

Evidence on missed starts and forced waiting: viewers of Lost missed the opening gazing at the
moon, and the opening was lengthened by a minute (Burdette 2015, 05a); it is "difficult to guide
the viewer at the beginning of a new scene" (Rothe & Hußmann 2018, 05a); in Alyx "some players
spend 30 seconds on the opening balcony, and others 30 minutes" (above); "the more we include,
the more chance there is that a player misses something important" (HL:A "Introduction"). On
forced waiting no VR study was found in this pass (gap); Gaming Trend's "don't skip them" shows
IEYTD's opening credits can be skipped.
