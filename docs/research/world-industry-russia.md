# Games industry research practice, and Russian-language science on VR and online experiments

Every claim has its link and a short quote from the page read. Russian quotes are translated, marked
"(our translation)". "Unverified" = seen only as a search snippet. Not repeated here: Portal commentary,
Sea Hero Quest, Lumsden 2016, Friehs 2020, Russian ethics committees and the MSU/MSUPE/HSE VR labs
(see docs/research/science-reach.md, field-labs-2.md part 12, study-methods-1.md).

## Parts (each gets an answer or "not found")
A. Games industry
- A1 GUR community: GRUX, IGDA Games User Research SIG (what they share in public)
- A2 Book "Games User Research" (Drachen, Mirza-Babaei, Nacke, eds., 2018)
- A3 Book "The Gamer's Brain" (Hodent)
- A4 Studio labs: Valve, Microsoft/Xbox, Ubisoft, Riot, EA (talks, papers)
- A5 VR studios' playtesting: Meta, Owlchemy, others
- A6 Home vs lab, keeping players natural, bias, novelty, repeat players
- A7 Telemetry and consent
- A8 Narrators, humour, pacing, tutorials (beyond the Portal commentary already read)
- A9 Games that are psychology experiments or teach it: Stanley Parable, Hellblade, Please Don't Touch Anything,
  serious games; reviewers' and players' words
B. Russian-language science
- B1 VR psychology experiments in Russian journals
- B2 Online experiments at scale in Russia
- B3 Replications of classic studies in Russia
- B4 Data quality in online Russian samples
- B5 Game-based assessment in Russia
- B6 How Russian participants respond (suspicion, seriousness)
- B7 Platforms and panels: Anketolog, Testograf, Yandex Toloka; their data quality
C. What to copy, ranked

---

## Findings

### A4 Valve (Ambinder, GDC 2009, "Valve's Approach to Playtesting: The Application of Empiricism"), all 68 slides read, saved objekt-papers/ambinder-2009.txt
https://cdn.fastly.steamstatic.com/apps/valve/2009/GDC2009_ValvesApproachToPlaytesting.pdf
- Playtests framed as experiments: "Game designs are hypotheses", "Playtests are experiments", then "Repeat"; the
  goal is "Fun", "DEFINITELY not focus testing".
- Direct observation is built to "Simulate at-home experience"; its weak points: "Presence of observers can bias
  results", "Salient event can slant interpretation". Its strong point: "Importance of what people do - not what they say".
- Think-aloud ("Unprompted and uncorrected"): can "Interfere with gameplay/create an artificial experience" and is
  "Inaccurate and biased".
- Interviews: "Group biases (anchoring, social pressure, saliency, etc.)" and "People don't know why they do what
  they do" (the Nisbett-Wilson point, stated by a studio). Their order: "Survey; Individual Q&A; Group Q&A; Be cautious".
- Surveys: forced choice, 1-7 ratings; "Validate responses (repetitive questions)"; "Get less biased responses".
- Telemetry: "Deaths, level times, friendly fire"; heatmaps; "Averages hide extreme examples", "Can see 'illusory' patterns".
- Design experiments: "Compare two or more conditions - Collect data - Verify hypothesis".
- Body measures (heart rate, skin conductance, eye tracking, face video, EEG, EMG): "Involuntary", "Objective - can't
  be faked", but "Intrusive", "Artificial experience", "Requires experimental control".
- After launch: "Playtesting continues after we ship - Gameplay stats - Forum responses - Fan feedback".
- Lesson for us: behaviour over self-report; the questionnaire before any talk; repeat a question to check it;
  observers and body sensors make play artificial (our headset already logs head and hands with no extra sensor).
- Not in the deck: how Valve recruits, pays or re-uses testers (the "Kleenex tester" phrase): unverified.

### A6 Studio playtests at home: Remedy (Finland), the studio's own public page
https://remedygames.com/playtesting-at-remedy (read via WebFetch)
- Home by default: "all our playtests are organized fully remotely, which is why we make sure you can participate from home".
- Play as usual: "Ideally, you would play similarly to how you play in your free time"; "we won't ask you to find bugs";
  they ask for "brutally honest feedback".
- Consent: "The consent form is to make sure you know what you agreed to"; it "gives us permission to gather data
  from your playthrough"; "You can withdraw from the test at any point". Leaving the list removes sign-up data and
  playtest data. Plus an NDA. No pay mentioned; no limit on repeat participation stated (not found).

### A6 Remote GUR: Steve Bromley, "Remote games user research" (updated 24 Aug 2021)
https://gamesuserresearch.com/remote-games-user-research/ (read via WebFetch)
- Gains: "allows us to overcome our geographical bias"; unmoderated studies "can allow us to see many more players
  than we could observe linearly".
- Losses: unmoderated, "it's not possible to ask questions in reaction to the behaviour you are seeing"; "the risk of
  leaks is increased when we can't keep an eye on everything that our participants are doing".
- Natural behaviour, data quality and think-aloud at home: not discussed on this page (not found).

### A2 "Games User Research" (Drachen, Mirza-Babaei, Nacke, eds., OUP 2018): contents read, chapters paywalled
https://academic.oup.com/book/26677 (table of contents read via WebFetch; no chapter marked free or open access)
- The book says of itself: "Games User Research forms an integral component of the development of any kind of
  interactive entertainment."
- Chapters that answer our questions directly (text not read: unverified what they say):
  - 22 "'Play as if you were at home': dealing with biases and test validity" (Guillaume Louvel), from p. 393.
  - 30 "A short guide to user testing for simulation sickness in Virtual Reality" (Ben Lewis-Evans).
  - 12 "The think-aloud protocol" (Tom Knoll); 13 RITE (Michael C. Medlock); 11 observing players (Mirweis Sangin).
  - 9 "Surveys in Games User Research" (Bruhlmann and Mekler, pp. 141-162; FHNW record has no file:
    https://irf.fhnw.ch/entities/publication/abb2533e-4bef-4216-b7cf-7b06a6a9afa1).
  - 16 biometrics (Nacke); 17 "Developing actionable biometric insights for production teams" (Chalfoun and Dankoff).
  - 23 "Dissecting the Dragon: GUR for Dragon Age: Inquisition" (James Berg) - the EA/BioWare case.
  - 26 mobile games in context (Schirra and White); 28 Gamer motivation profiling (Yee and Ducheneaut).
- These go to the owner (OUP login or library).

### A3 Celia Hodent (Epic; author of "The Gamer's Brain"): her own GDC 2016 talk transcript
https://celiahodent.com/gamers-brain-ux-onboarding/ (published 22 Mar 2016, read via WebFetch). The book itself
(http://thegamersbrain.com/) was not read: unverified beyond its topic list.
- Teach at the moment of use: "When you teach the player something when they can actually do it, it gives context";
  text alone "has no context or meaning"; "learning-by-doing is recognized as being one of the most efficient ways".
- Load limit: "3 items to process at the same time is THE MAXIMUM when in learning mode"; "During onboarding,
  minding the cognitive load is critical".
- Memory: "developers cannot rely too heavily on the players' memory".
- What players say vs do, in her UX tests: "most participants reply that objectives are clear but then they have
  difficulties explaining what they are" - so she asks players to explain the goal, not whether it was clear.
- Advice: "Avoid punishing states during onboarding"; "Always make sure that your players get the _why_ for what
  you ask them to do"; destroy "all false affordances".
- Lesson for us: the host gives at most three new things per step, at the moment the hand can do them; a check
  after the briefing asks the player to say or show the task (not "was it clear?").

### A4 Microsoft Game Studios / Xbox Playtest group (as reported by Jorgensen 2004, full text read, saved objekt-papers/jorgensen-2004.txt)
https://ocw.metu.edu.tr/pluginfile.php/2513/mod_resource/content/0/ceit706_2/10/p393-jorgensen.pdf (NordiCHI 2004, pp. 393-396)
- "Established in 2000 and employing a handful of game developers, psychologists and HCI specialists, the Playtest
  group has tested more than 70 games with more than 10.000 participants"; method "RITE: Rapid Iterative Testing and
  Evaluation based on short cycles".
- A wording fix found by testing: players read "AI level" as "Altitude level", "Anti aircraft" and so on; renamed
  "Enemy level", which "remedied the problem completely".
- The Sims: interface "went through 11 iterations with about 100 playtesters where the developers sat down and
  watched players' mistakes and misconceptions".
- Games vs software: games are "almost exclusively voluntary"; the aim is "easy to learn, but difficult to master".
- The source chapter, Pagulayan et al., "User-centered design in games" (HCI Handbook, Erlbaum, pp. 883-906): not read
  (a draft sits on Academia.edu behind a login: https://www.academia.edu/32909519/User_centered_Game_Design).
- Microsoft's later retrospective (Pagulayan, Steury, Fulton, Romero 2018, "Designing for fun: User-testing case
  studies", Funology 2, Springer; https://www.microsoft.com/en-us/research/?p=588829, intro only): before them,
  playtesting meant "bringing in your best friends to play your unfinished game in return for some pizza"; customer
  input was a "focus test" "driven from marketing". Body of the chapter: paywalled (Springer), not read.
- Halo 3 (Wired, Thompson 2007, "Halo 3: How Microsoft Labs Invented a New Science of Play"): pop-up engagement
  ratings every few minutes and death heatmaps are reported only in secondary summaries: unverified (the article
  and NPR transcript https://www.npr.org/transcripts/14649338 timed out).

### A5 Meta's own VR playtest guide ("Playtest facilitation + data analysis")
https://developers.meta.com/horizon/resources/playtest-facilitate-data-analysis/ (read via WebFetch)
- The moderator: "Be calm, casual, and never critical"; "Avoid corralling them into the path you had intended";
  "let them think for themselves"; "always avoid interruption, and get comfortable with long pauses".
- Room: "Limit the number of people in the room, and let the tester know if more people enter."
- New VR users: "start a newer VR player in a calm environment"; watch for "Any signs of discomfort" (eye strain,
  nausea, fatigue).
- Consent first: NDA or "any other legal consent forms prior to kicking off your test"; "This step cannot be overstated."
- Think-aloud is asked for: "encourage testers to think aloud as they play your app".
- Small numbers: "Don't use averages if you have a sample size below 20"; under 25 testers say "some" and "most";
  "one fail out of five is significant".
- Repeat vs fresh testers: not covered (not found).

### A5 Schell Games' VR playtests (Meta developer blog, 13 Jul 2020, Alexis Miller and Tera Nguyen)
https://developers.meta.com/horizon/blog/vr-playtest-best-practices-featuring-schell-games/ (read via WebFetch)
- At home on own headset is the natural case: "the player is in their home with their own headset, so they are
  playing in their natural environment". Screened first for hardware and for being able to cast the headset.
- Questions only at the end, to keep the headset on: "They only have to answer questions when they're done playing,
  so there isn't a lot of lifting their headset up and down".
- Stuck players: "don't just give them the answer"; "limit developer talking during the playtest".
- Comfort asked directly: "Did you feel any discomfort, physical or otherwise?"
- Repeat testers are re-used on purpose for later builds via a development release channel.
- Privacy when casting: remind them "to turn off push notifications"; risk of casting "publicly to the tester's
  Facebook page".
- Lesson for us: our rooms already run in the player's own home; ask questions after the measured part, in one block,
  in the headset; ask about discomfort every time; keep the host silent when the player is stuck at the measured moment.

### A8 Portal 2 developer commentary (Valve, 2011; in-game commentary, fan transcript read)
https://theportalwiki.com/wiki/Portal_2_developer_commentary (read via WebFetch; speaker and map given)
- A pause for the player before the voice: "there is a two second beat for you to laugh or yell before GLaDOS speaks"
  (Chet Faliszek, co-op writing); "we broke up the story beats into smaller sections so players don't become
  impatient" (same).
- A hostile voice too early tires players: "Playtests revealed, though, that it was a bit grueling getting
  brow-beaten by GLaDOS this early in the game" (Elan Ruskin, Laser Intro).
- The voice pulls the eyes away from the task: "players were focused on what Wheatley was doing and would often get
  hit by a crusher they weren't looking at" (Kutta Srinivasan, Finale 4).
- Players will not stand and listen: "we either had to ditch all the dialogue or figure out a reason for the player
  to stand around for five minutes" (Erik Robson, Jailbreak).
- Fatigue: "playtesters were getting fatigued at solving so many complex test chambers in a row" (Marcus Egan).
- Difficulty: "If it's too hard then players feel stupid instead of smart" (Eric Tams).
- Humour tested on players: "smooth jazz was funny to all ages, genders and cultures" (Mike Morasky).
- What players cannot report: "Playtesters also weren't able to report the grid's properties" (Bronwen Grimes).
- Lesson for us: leave a ~2 s gap after an event before the host speaks; split host lines into short pieces; the host
  must not speak or move while the player's eyes are needed for the measured stimulus; a scolding host early costs
  goodwill (our host is on the player's side, which fits).

### A5 Owlchemy Labs (Job Simulator): Meta's interview, 22 Feb 2017, Alex Schwartz
https://developers.meta.com/horizon/blog/developer-perspectives-job-simulator (read via WebFetch)
- "observing users actually playing the game in person is our best resource for generating data"; they test with
  "users who have never tried VR before"; "By reducing interaction abstractions - no more pressing B to crouch, or A
  to jump - we found that everyone ... had the ability to easily and intuitively play".
- Humour, the robot characters, pacing: not covered on this page (not found). GDC 2017 talk "Spatial Storytelling
  Lessons from Job Simulator and Rick and Morty VR" (Schwartz, Reimer) not read (GDC Vault).

### A9 Hellblade: Senua's Sacrifice (Ninja Theory, 2017): clinical advisers and the reception
https://hearingthevoice.org/2017/08/18/response-roundup-to-hellblade-senuas-sacrifice/ (Hearing the Voice, Durham,
18 Aug 2017, read via WebFetch)
- The research team was "consulting on the design of Senua's voice-hearing experiences", with "support from the
  Wellcome Trust"; the game was made "in collaboration with" Prof Paul Fletcher (Cambridge) and "a number of experts by
  experience". No numbers or method on that page.
- Critics: Forbes "probably the most realistic portrayal of mental illness I've yet seen in a video game"; Eurogamer
  "a superb exploration of mental illness told with poise and poignancy"; Metacritic 82%. No player or voice-hearer data
  and no criticism on that page (not found).
- Search summaries (unverified): a Wellcome grant of about $395,000; two years of talks with voice-hearers; binaural
  audio so voices sit behind the player's head.
- Lesson for us: a recreated inner experience earns trust when the people who live it are consulted and named, and the
  science partner is public; in reviews, "realistic" was the praise.

### A9 The Stanley Parable (Galactic Cafe, 2011/2013): a narrator who gives orders
https://blogs.tuni.fi/playlab/game-research-highlights/how-the-stanley-parable-questions-freedom-in-interactive-narratives/
(Erika Makela, PlayLab! Magazine, Tampere University, 30 Apr 2020, summarising Sarian, "Paradox and Pedagogy in The
Stanley Parable", Games and Culture, doi:10.1177/1555412018765550; read via WebFetch)
- The game exposes "the implicitly didactic voice that lies behind many choices"; "Rebelling against the narrator is
  a part of the game and thus not actual rebellion"; disobeying "triggers different dialogue depending on the game state
  and how much the player has annoyed the narrator".
- No player data: no study found of how often players obey or disobey the narrator (not found in one search).
- Lesson for us: a narrator who reacts to every disobedience makes testing him the game; a measured moment must not
  give the player a visible "obey or rebel" choice unless that choice is what is measured.

### A9 Please, Don't Touch Anything (Four Quarters; VR version on the Meta store)
https://www.meta.com/en-gb/experiences/please-dont-touch-anything/2706567592751319/ (read via WebFetch)
- The premise is a forbidden button: "an ominous red button with the simple instruction to not touch anything!";
  "over 30 unique puzzle endings"; tagline "Go ahead, press the button. You know you want to." Rating 3.8 from about
  1.5K ratings, $9.99.
- It turns a forbidding instruction into the game's lure: a ready-made example that "do not touch" invites touching
  when the player knows it is a game (design evidence only; no study).

### A9/A7 A game that is the experiment: Bad News (Roozenbeek & van der Linden 2019), full text read, saved objekt-papers/roozenbeek-2019.txt
https://www.nature.com/articles/s41599-019-0279-9 (Palgrave Communications 5:65, doi:10.1057/s41599-019-0279-9)
- Consent inside the game, after it has started: "A few minutes into the game, we asked players if they wanted to
  participate in a scientific study. After players gave informed consent, we collected N = 43,687 responses over the
  three-month period ... which included n = 14,266 completed paired pre-post responses" (about 1 in 3 completed).
- Short on purpose: "participants answered 6 questions in total ... 2 of which were control questions"; longer scales
  "would have significantly interfered with people's willingness to play the game".
- Demand check built in: real-news control items; if players were just pleasing the experimenter "participants might
  have simply rated all items as less reliable, but this is not what we observed" (control change d = 0.03-0.04 vs
  fake items d = 0.30-0.36).
- Recruitment by press release picked up by the BBC; sample "skewed toward males (75%)", 18-29 47%.
- Privacy: "we also did not record any personally identifying information from participants (including IP addresses
  or location) to adhere to ... GDPR"; duplicates removed by a session ID. Ethics: Cambridge PRE.2018.007.
- Limits they state: no randomised control group (judged unfair to deny half the visitors the game); self-selected
  opt-in sample.
- Lesson for us: consent can be asked a few minutes in, once the player is engaged; keep in-game questions to a handful;
  add a "control" item that should not move, to catch players who answer what they think we want.

### A1 GRUX community (IGDA Games Research and User Experience SIG)
https://igda.org/sigs/grux/ (read via WebFetch)
- Aim: "aims to improve games by improving the state of games user research and user experience work"; works by
  "community and information sharing" (Discord, yearly summits in North America and Europe with "200+ attendees", a GDC
  roundtable). Members must "use their real name"; professionals and academics only.
- No public methods, consent or ethics guide on the SIG page (not found); grux.org/grux-sig/ redirects to a 404.
- Practical meaning: GUR knowledge is shared in talks and a members' Discord, not in open guides; the open written
  sources are the OUP book (paywalled), Meta's guide, and studio pages above.


Part B (Russian-language science), the ranked list of what to copy, open items and pages for the owner:
[world-industry-russia-2.md](world-industry-russia-2.md).
