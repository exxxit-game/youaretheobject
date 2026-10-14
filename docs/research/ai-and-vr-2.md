# AI and VR, part 2: the places the first search did not reach

Continues docs/research/ai-and-vr.md (owner's question 14.10.2026: has anyone already done what we do?). That file
and docs/research/stores-experiment-games*.md hold the earlier findings; nothing there is repeated here.
Written as found by the deep-research helper, session date 2026-10-14. Marks per item: date; kind (video, paper,
post, server); [read] = opened and read (the page, description, transcript or full text); [seen] = only in search
results, unverified. Non-English sources are given in English translation, the language named.

Parts (each gets an answer or "not found"):
1. YouTube: talks, devlogs, tutorials on building VR/WebXR games with AI coding agents (Claude Code, Cursor, Codex);
   any VR game of classic psychology experiments; the three videos left unopened by the first search
   (B6ljO1COte4, RLwS1Yo-JTs, ka_L3F8bh7E).
2. Bilibili (Chinese): the same, with Chinese queries.
3. J-STAGE (Japanese papers) and CNKI (Chinese papers): LLM agents developing VR/XR applications; psychology
   experiments delivered as VR games to the public.
4. r/ClaudeGameDev through Reddit's RSS: q=VR, WebXR, Quest, headset.
5. Discord: public servers where this work is discussed (WebXR, A-Frame, Flat2VR, ...), invite or info pages only.

## 1. YouTube

How read: each watch page downloaded and its own data read (title, channel, upload date, views, description with
chapters). Transcripts: YouTube refused both its caption file and its transcript endpoint ("Precondition check
failed") and a transcript mirror said YouTube blocks it, so no transcript was read; [read] below means the
description and chapter list, not the speech.

### 1a. The three videos the first search left unopened

- Mister VR (a Japanese channel), "The era has arrived when AI can make the world's best adult game. First, a
  VR game made only with AI is on the Quest store" (title translated from Japanese), 9 Sep 2026, 17 min, 114,203 views
  on 14.10; video [read: description]. https://www.youtube.com/watch?v=RLwS1Yo-JTs . Description (translated): "A VR
  game made with AI passed a review sent back 4 times and is on the Quest store". Chapters (translated): "from watching
  VR to making it"; "what I have made with AI alone: MR Othello, Solar System Explorer XR"; "NEON SIEGE born from one
  careless sentence"; "the trick of making with AI is noticing what feels wrong"; "the Quest store review, the fight
  with rejections"; "to Unity, which I had avoided: the VRChat world Starmirror Lake"; "starting an 'AI solo VR
  studio' of one person and AI". His site lists NEON SIEGE's stack as "Three.js, WebXR API, Cloudflare Pages, Workers
  KV" [read: https://mrvr.jp/]; the store page [read: https://www.meta.com/ja-jp/experiences/1198204933382775/]: NEON
  SIEGE, free, shooter, Quest 2/Pro/3/3S, Japanese and English, says nothing of AI. Closeness: the nearest found to our
  studio's form: one person and AI calling themselves a solo VR studio, a WebXR (Three.js) game passed through Meta's
  store review; differs: a shooter, no science; whether the AI wrote all the code and how it was tested is only in
  the speech, not read.
- Mister VR with Dorikin (@koh), "VR games and video editing all with AI! What happened after 2 months without VR
  videos [Claude Code]" (translated), 18 Jul 2025, 43 min, 10,653 views; video [read: description].
  https://www.youtube.com/watch?v=B6ljO1COte4 . Chapters (translated): "Claude Code planning mode"; "AI development on
  Windows in practice"; "how to publish a WebXR game made with AI"; "even in AI development the last 20% is hard".
  Closeness: the same person a year earlier, already building WebXR games with Claude Code; a talk, no process shown.
- Rich From HumAi, "AI Engineers Workshop in VR: Claude Code + Unity MCP Builds a Game Feature Live (Nexus Planet)",
  19 Jul 2026, 1 h 33 min, 210 views; video [read: description]. https://www.youtube.com/watch?v=ka_L3F8bh7E . A
  workshop held inside his own Quest collaboration app; chapters include "Live demo: Claude Code + Unity MCP updating
  the Brave Kind Heart quest", "Why context matters more than anything when working with agents", and asking "the agent
  live via the Meta Quest Developer Hub MCP". Closeness: a developer teaching agent workflows for Quest in Unity; no
  science.

### 1b. New videos found by YouTube's own search (14.10.2026)

Searched (YouTube's results page, read from its data): "Claude Code VR game Quest", "WebXR AI coding agent game",
"Immersive Web SDK Claude Code", "vibe coding VR game Meta Quest WebXR", "AI made my VR game Meta Horizon Store",
"Meta XR Operator agent test VR game"; for psychology: "VR game psychology experiments", "Milgram experiment VR",
"psychology experiment VR game Quest you are the test subject", "Asch conformity experiment virtual reality",
"bystander effect VR experiment game". Web search with site:youtube.com added little (its index misses most videos).

- Getting Things Dun, "We Built a Meta Quest VR Game in 35 Prompts Using AI + Meta XR Operator!", 14 Aug 2026, 15 min,
  400 views; video [read: description]. https://www.youtube.com/watch?v=i1_Z-NrhuaE . QuackShot VR in Unity: "We did
  not personally write the gameplay code or manually assemble the Unity project. Instead, we provided the vision,
  reviewed the results, shared playtest feedback"; the question was whether the AI could "test its own work"; XR
  Operator "revealed several important limitations that only became clear when we put the headset on ourselves".
  Closeness: the same split of roles as ours and the same finding (the headset shows what the agent's own test
  misses); differs: a one-day prototype, Unity, no science.
- Meta, "Meta XR Operator" (Unity docs), last updated 9 Sep 2026; documentation [read].
  https://developers.meta.com/horizon/documentation/unity/meta-xr-operator/ . "an OpenXR API layer that gives AI
  agents spatial context and control over a running Unity XR app": an MCP agent reads head and controller poses,
  sets buttons and triggers, performs hand gestures and captures images; on a physical Quest through ADB port
  forwarding, also in Meta XR Simulator; marked experimental. Closeness: Meta's own tool for the agent to check on
  the device, the step our studio does over USB; Unity only, nothing for a WebXR page. Taught on YouTube by immersive
  insiders, "Setup AI Agent for VR | Meta XR Operator", 5 Aug 2026 [read: description]
  https://www.youtube.com/watch?v=IASapZ8hzoE .
- immersive insiders, "Who can make VR Games better?", 8 Oct 2026, 9 min, 666 views; video [read: description].
  https://www.youtube.com/watch?v=7b4zuNcp9P8 . Claude Code (Opus) against OpenAI Codex on the same Unity VR darts
  game, three tasks, timings, costs and bugs; "That's a recorded experiment, not a benchmark". Closeness: a measured
  comparison of agents for VR work; no science, Unity.
- Dilmer Valecillos (Meta developer advocate), "How to Build Full VR/MR Games With Unity AI + Meta Agentic Tools!",
  3 May 2026, 17 min, 12,612 views; video [read: description]. https://www.youtube.com/watch?v=bWxIF903t_I . A VR/MR
  basketball game with Unity AI Assistant, Claude Code and Meta's MCP tools; plan file public
  (github.com/dilmerv/ArcadeHoopsMR_Plans). The first search knew this game only from Meta's blog (Arcade Hoops).
- onshoulders, "I Made 3 VR Games in 1 Hour Using AI (No Coding)", 15 May 2026, 13 min, 1,910 views [read:
  description]. https://www.youtube.com/watch?v=h2oUH6vuQ9s . Claude Opus 4.7 and a Quest 3: archery, hand-tracked
  drums, an AR shooter; ends with "Lessons Learned: Prompt Engineering for AI VR Dev". Closeness: a non-coder making
  small Quest pieces with Claude; no process, no science.
- Costa Yannakis, "I Built Anything I Wanted in VR, Just by Asking My Army of AI Agents", 4 Oct 2026, 44 views [read:
  description]. https://www.youtube.com/watch?v=Un_WH-iyfUg . Brick Office, open source (github.com/CostaYannakis/VROffice):
  Claude Code and Codex agents on the PC write "live mods" that hot-swap into a WebXR room on Quest 3 while the user
  stays in the headset. Closeness: agents building WebXR content seen live in the headset; a sandbox, no science.
- fx node, "Prototype subd modo inspired vr modeller VRDO. WebXR, vibe coded with claude sonnet. 5.5", 6 Oct 2026
  [read: description]: a WebXR modeller that runs "in quest browser with pass through", shared as a Claude
  artifact. https://www.youtube.com/watch?v=GpYw9b0RqoY . A tool, not a game.
- Dr.Drastic, "How well can Claude make a VR Game?", 21 Sep 2026, 6 min, 943 views [read: description, which says
  only "How well can AI in 2026 make a VR game?" and advertises an AI 3D-model service].
  https://www.youtube.com/watch?v=RyKSjJHnWBE .
- Platform news seen on the way: Meta's "Horizon Create" and "Horizon Studio", AI game makers announced at Meta
  Connect 2026 (Gamefromscratch, 26 Sep 2026, 69,113 views [read: description]: the games "will only ... appear on
  Facebook and Instagram") https://www.youtube.com/watch?v=m0bhcn38Q0s ; The XR Hustle, 27 Sep 2026 [read:
  description]: a Horizon Create waitlist, "an AI tool that builds VR games from text prompts, no coding required"
  https://www.youtube.com/watch?v=zXFqwViQt5k . Not opened at Meta (unverified beyond these descriptions).
- A Halo VR mod presented as AI-made: Jammyhero, "So AI Can Make VR Games Now...", 24 Jul 2026, 6,043 views [read:
  description: "Let's talk about the Halo AI Mod!", github.com/pancreations/Halo-MCC-VR]. https://www.youtube.com/watch?v=YCkQhdDh1eg .
  Another AI-written VR port, as GTA San Andreas and Quake in the first search.
- Psychology experiments: no video of a VR game whose rooms are classic experiments with the player as the subject.
  What appears are lab re-creations already known: Mel Slater, "Virtual Reprise of the Stanley Milgram Obedience
  Experiments" (YouTube upload 10 years ago, 3,630 views) https://www.youtube.com/watch?v=RjUNg3pkEag and his
  "Bystander Responses to a Violent Incident in an Immersive Virtual Environment" https://www.youtube.com/watch?v=m6kBQk0DCFM ;
  GET Lab, "VR Conformity" (10 years ago, 321 views) https://www.youtube.com/watch?v=LFBt-0NtvHg [all seen: titles in
  the results only]; the Theseus "Milgram Experiment" (flat, already in ai-and-vr.md). Not new to us.

## 2. Bilibili (Chinese)

How read: Bilibili's own video search (its web API, default ranking), 17 queries, 8-12 results each; written here in
English, run in Chinese where marked: Claude Code VR game (zh); AI programming VR game (zh); WebXR AI; Cursor VR
development Quest (zh); making a VR game with AI (zh); Vibe Coding VR; PICO TRAE spatial apps (zh); one sentence
generates a VR app (zh); Claude Code Quest development (zh); AI indie development, VR, released (zh); Codex VR game
(zh); for psychology: psychology experiment VR game (zh); VR psychology experiment experience (zh); Milgram
experiment VR (zh); rubber hand illusion VR (zh); classic psychology experiments, virtual reality, game (zh). Video
pages are blocked to plain downloads (HTTP 412); one was read in the browser pane.

- Yidun_Eden (the uploader's name, romanized from Chinese; 6,206 followers; profile line, translated: "using AI to turn ideas into reality"),
  "UE+AI made a VR game [released] but the reality......" (translated from Chinese), 31 Aug 2026, 1,281 views, marked
  by Bilibili "contains AI-generated content"; tags (translated): "I make games with AI", AI, game development, VR;
  video [read: the page in the browser pane; no description text; the speech not heard].
  https://www.bilibili.com/video/BV1x2tp67EF4/ . Closeness: a Chinese solo developer who released a VR game made
  with Unreal and AI and reports a disappointing outcome; which game, which AI and what went wrong are in the speech
  only (unverified). The page's side list shows many Chinese "made a game with AI, no code, on Steam" videos (e.g.
  "I made a game with AI and put it on Steam: how much did I spend?"), none of them VR.
- Deck_HQ, "Astro Bot: Rescue Mission VR performance test / a new standalone Meta Quest 3 mod" (translated), 5 Oct
  2026, 745 views [seen: search result]; its link is github.com/bigmak94/AstroQuest, by the same author as GalaxyQuest,
  which the first search read as "100% made by AI (Claude Opus 5.5 in Claude Code)". https://www.bilibili.com/video/BV1ZBHx6ZEq5/ .
  Closeness: Chinese VR channels now show AI-written Quest ports as ordinary mods (the same channel lists several
  new Quest mods in early October 2026); ports, no science.
- KodeDino, "What it is like to have your own AI game studio [Claude Code Game Studios]" (translated), 9 Apr 2026,
  4,066 views [seen: search result]. https://www.bilibili.com/video/BV1rAD6BgEUa/ . The 48-agent template the first
  search already found (Donchitos), tried by a Chinese creator; not VR.
- Voidmatrix, "[AI big comparison] 11 AIs make 33 games: who is the king of game development?" (translated), 2 Oct
  2026, 221,436 views [seen]. https://www.bilibili.com/video/BV1Riak68ECd/ . Flat games, not VR.
- Psychology: no Chinese video of a VR game built on classic experiments. Results are explanations of Milgram, the
  marshmallow test or the rubber hand illusion (flat videos), VR school labs for chemistry and physics (e.g. HiXR's
  "Smart Palace" middle-school VR lab, 29 Mar 2022), and a VR relaxation therapy demo (1 Dec 2024) [all seen].
- PICO's own AI path (TRAE IDE, PICO CLI) has no Bilibili video in these results.

## 3. J-STAGE (Japanese papers) and CNKI (Chinese papers)

### 3a. J-STAGE

How read: J-STAGE's own search (all its journals and proceedings), 14 queries, written here in English, run in
Japanese where marked (ja): "LLM VR development" (ja: 193 hits), "Claude Code", "coding agent VR" (ja: 0 hits),
"generative AI Unity VR content development" (ja: 32), "ChatGPT VR app development programming" (ja: 40), "LLM VR
scene generation" (ja: 1), "generative AI game development VR" (ja: 17), "AI agent game development automatic" (ja:
9), "WebXR" (22), "generative AI coding VRChat" (ja: 3), "LLM Unity code automatic generation" (ja: 10); for
psychology: "psychology experiment VR game" (ja: 37), "VR remote experiment at home head-mounted display" (ja: 1),
"social psychology VR replication" (ja: 30), "virtual reality psychology experiment general participants online"
(ja: 8); plus a web search with site:jstage.jst.go.jp. Article pages opened: 5.

- AI building VR: no J-STAGE paper found in which an LLM or a coding agent develops a VR/XR application or game.
  In the hits the LLM is inside the VR (a guide, an avatar, an NPC) or the paper is about code generation in general:
  - Hiratsuka, Tanaka, Yamazaki, Sakai, "Proposal of VR tourism guidance for regional cities by AI agents using
    large language models and databases" (title translated from Japanese), HOSPITALITY (Japan Hospitality Management
    Society) 35, 111-119, 31 Mar 2025, doi:10.57467/jashj.35.0_111; paper [read: article page; no abstract on it].
    https://www.jstage.jst.go.jp/article/jashj/35/0/35_111/_article/-char/ja . By its title the agent is the guide
    inside the VR, not its builder (the PDF not read).
  - Yasuda (Xooms) et al., "Content development with telepresence robots, XR and generative AI" (translated), JSME
    annual meeting 2024, F113-3, doi:10.1299/jsmemecj.2024.F113-3; paper [read: abstract page]. The abstract names
    "technologies such as XR (VR/AR/MR), image recognition, and machine learning" and a VR interface for driving
    telepresence robots; it does not say generative AI wrote the code.
    https://www.jstage.jst.go.jp/article/jsmemecj/2024/0/2024_F113-3/_article/-char/ja
  - "Layout generation agent using large language models" (translated), JSAI 2024, 2F4-GS-5-03 [seen: search
    snippet]: GPT-4V places objects one by one in a 3D virtual space to follow a user's instruction.
    https://www.jstage.jst.go.jp/article/pjsai/JSAI2024/0/JSAI2024_2F4GS503/_article/-char/ja
  - Journal of the Virtual Reality Society of Japan 30(2), June 2025, special issue "VR and AI", a round-table on how
    generative and dialogue AI will change VR research [seen: search snippet].
    https://www.jstage.jst.go.jp/article/jvrsj/30/2/30_8/_pdf
  - Imada, Yamaguchi, Tokita, "Development of 'The Commissure', a cervical spine surgery 3D teaching material
    learned through a web app" (translated), JSMVR 2026, published 16 Sep 2026 [read: article page; no abstract, no
    word of AI]. https://www.jstage.jst.go.jp/article/jsmvr/2026/0/2026_21/_article/-char/ja
- Psychology experiments in VR for the public: the nearest items, both from Kitazaki's group (Toyohashi University
  of Technology):
  - Ishimoto, Kato, Kitazaki, "Construction and validation of an experimental environment for body ownership in the
    virtual reality social network service VRChat" (translated), Japanese Journal of Psychonomic Science 40(2),
    121-134, 2022, doi:10.14947/psychono.40.21; paper [read: abstract]. "we constructed a laboratory in VRChat";
    full-body ownership with synchronous or 1 s delayed avatar movement, 5 min of ball reaching, then ratings;
    synchronous gave stronger ownership and agency; "the laboratory in the public VR social network enables us to
    manipulate experimental conditions". https://www.jstage.jst.go.jp/article/psychono/40/2/40_40.21/_article/-char/ja .
    Closeness: a classic illusion paradigm run inside a public VR world, as our rooms run in the Quest browser;
    differs: a lab study (whether the participants were VRChat's public is not on the page), no game, no reveal, no AI.
  - Watanabe, Ikeda, Kubota, Suganuma, Kitazaki, report of the Japanese Psychonomic Society's committee for
    "Experiment Packages for the Mind" (satellite symposium on science communication with children), Japanese
    Journal of Psychonomic Science 43(2), 150-160, 31 Mar 2025, doi:10.14947/psychono.43.25; report [read: abstract].
    Since 2012 the committee builds hands-on workshops and materials that let the public experience psychological
    phenomena; the symposium touched the metaverse and media art. https://www.jstage.jst.go.jp/article/psychono/43/2/43_43.25/_article/-char/ja .
    Closeness: the same aim of letting people live a psychology finding, as workshops; which experiments, and
    whether any is in VR, is not on the page.
  - Method papers seen, not opened: "VR audiovisual experiments: accuracy and precision of stimulus presentation in
    VR HMDs" (Japanese Journal of Psychonomic Science 41(1)); "cases of immersive HMDs in cognitive psychology
    experiments" (Brain and Neural Networks 23(3)); "an introduction to the literature on social attitudes in VR"
    (Cognitive Studies 26(4)). Lab methods, not public games.

