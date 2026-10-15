# AI and VR, part 4: J-STAGE, CNKI, r/ClaudeGameDev, Discord

Places 3 to 5 of the search indexed in docs/research/ai-and-vr-2.md.
Marks per item: date; kind (video, paper, post, server); [read] = opened and read (the page, description,
transcript or full text); [seen] = only in search results, unverified. Non-English sources are given in English
translation, the language named. Session date 2026-10-14, written as found by the deep-research helper.

## 3. J-STAGE (Japanese papers) and CNKI (Chinese papers)

### 3a. J-STAGE

How read: J-STAGE's own search (all its journals), 15 queries, most in Japanese (hits in brackets): LLM VR
development (193), Claude Code, coding agent VR (0), generative AI Unity VR content (32), ChatGPT VR app programming
(40), LLM VR scene generation (1), generative AI game development VR (17), AI agent game development (9), WebXR
(22), generative AI coding VRChat (3), LLM Unity code generation (10); psychology experiment VR game (37), VR remote
experiment at home (1), social psychology VR replication (30), VR psychology experiment online participants (8);
plus a web search with site:jstage.jst.go.jp. Article pages opened: 5.

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
    snippet; its page not opened]: GPT-4V places objects one by one in a 3D virtual space to follow a user's
    instruction.
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
  - Lab method papers seen, not opened: VR HMD stimulus accuracy (Japanese Journal of Psychonomic Science 41(1)),
    immersive HMDs in cognitive psychology (Brain and Neural Networks 23(3)), social attitudes in VR (Cognitive
    Studies 26(4)).

### 3b. CNKI

How read: kns.cnki.net does not answer from here (curl or the browser pane); the overseas site (oversea.cnki.net)
answered three subject searches in the browser pane, then showed a slider captcha ("drag the puzzle piece to
verify", Chinese), not solved, by rule. Two web searches with site:cnki.net reached only journal portal pages.

- "large language model, virtual reality, development" (subject search, in Chinese), 14.10.2026: 27 records (8
  journal papers, 17 theses, 1 conference paper) [seen: titles in the list]. https://oversea.cnki.net/kns8s/defaultresult/index?kw=%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%20%E8%99%9A%E6%8B%9F%E7%8E%B0%E5%AE%9E%20%E5%BC%80%E5%8F%91&language=EN .
  In all the LLM is a part inside the VR system, not its developer; e.g. Zhang Wenli, a campus fire drill system on
  LLMs and VR, master's thesis, 1 Jun 2025; Liu Haowei, natural-language-driven 3D model and indoor scene
  generation, master's thesis, 19 May 2025 (titles translated by CNKI's English pages).
- "agent, code generation, virtual reality" (in Chinese): no records. "large model, VR, development" (in Chinese):
  120 records, the first 20 read by title: LLMs in software engineering, teaching and industry; none about a model
  or agent building a VR app or game.
- Psychology: "virtual reality, classic psychology experiments" (in Chinese) returned no records, and the captcha
  came up on that page. The web search found only Chinese papers on VR and social interaction, VR games and
  teenagers' values, and gamified learning [seen], none a classic experiment offered to the public as a VR game.
- Not done for the captcha: AI programming plus VR games; VR replications of social psychology; Milgram in VR.

## 4. r/ClaudeGameDev (Reddit)

How read: Reddit's RSS with curl and a user agent, one request every 46 s (14.10.2026): subreddit searches q=VR,
WebXR, Quest, headset, psychology, experiment, XR, "Meta Quest", non-programmer (sorted new), the newest 100 posts
(they reach back only to 7 Oct 2026), and the replies of two threads. q=WebXR, q=psychology: 0 entries;
q=experiment: empty at first (likely the rate limit), retried below. The sub's about page answered with a non-JSON page
(subscriber count not read).

- u/Dinglemaniac, "I'm 3 weeks into a VR port of Outlaws (1997), running natively on Quest and PC VR", 13 Oct 2026;
  post [read, with its one reply]. https://www.reddit.com/r/ClaudeGameDev/comments/1x4ovm1/im_3_weeks_into_a_vr_port_of_outlaws_1997_running/ .
  A fan remake in Unreal 5 that reads the player's own copy of the game: "Claude writes basically all the code. I
  run one Claude session that plans and keeps a to-do board, and another that builds and tests with a couple of
  agents working in parallel. I play it in the headset and report bugs, and most come back fixed the same day."
  Testers gathered on a Discord. Closeness: the nearest process found in this search to ours (the agent writes all
  code, a planning session with a board, the human judges in the headset); differs: a port of an existing game,
  Unreal, no science, three weeks old.
- u/SuperV1234, "Quake VR: UNLEASHED | Release Trailer", 12 Oct 2026 [read: entry]. https://www.reddit.com/r/ClaudeGameDev/comments/1x3zvzm/quake_vr_unleashed_release_trailer/ .
  The same project the first search read on r/ClaudeAI; nothing new.
- u/Electrical_Chard3255, "Donkey Kong in VR", 28 Sep 2026; post [read, with 9 replies]. https://www.reddit.com/r/ClaudeGameDev/comments/1wsno0y/donkey_kong_in_vr/ .
  Asked how long it took: "It took an hour"; asked about publishing: "Sadley I cant release it as its essentially
  too close to Nintendo Donkey Kong. I could potentially put it on sidequest". Closeness: a one-hour VR remake by
  Claude; engine and testing not said.
- u/Any-Reputation8118, "Little VR experience made by Opus 5.5 in 2 hours", 26 Sep 2026 [read]: cross-posted from
  r/ClaudeAI, already in ai-and-vr.md (Godot with an MCP plugin, PCVR on Quest 3, MIT).
- The other hits are flat games built with Claude (a browser RTS, a browser ARPG changed after watching users play,
  a Three.js co-op RPG, a ZX Spectrum remake, a browser horror game; Aug-Oct 2026) [seen]; none names WebXR.
- q=experiment, retried later: 55 entries back to 3 Aug 2026, matched loosely (games described as "experimenting");
  filtered for psychology, science, research, study, participant: one science-education game (a biochemistry idle
  clicker, Godot, Claude and Gemini, 20 Sep 2026) and a non-coder's browser game "Prompt & Pray" ("I have a sales
  background and no coding experience", 8 Oct 2026) [seen: first lines]; no psychology experiment. Size of the sub:
  "we're already at 8k subscribers" (its founder u/jogalleciez, 2 Oct 2026, "only been a few months") [read].
  https://www.reddit.com/r/ClaudeGameDev/comments/1ww7xu4/we_just_hit_8k_subscribers_on_rclaudegamedev/
- Answer for this place: two VR projects new to us (Outlaws VR, Donkey Kong VR), both ports or remakes built with
  Claude; nothing on psychology experiments.

## 5. Discord (public servers, not joined)

Discord cannot be searched from outside. Listed below: servers where this work is discussed, each with its public
invite; member counts read 14.10.2026 from Discord's public invite information (discord.com/api/v10/invites/<code>
?with_counts=true: name, members, online, description; no account, nothing joined). Kind: server [read: invite info].

- WebXR, https://discord.gg/jJxvuW97c4 : 4,283 members, 395 online; "This server is dedicated to WebXR, a web standard
  that allows you to create immersive AR and VR experiences on the web!"; has an "#a-frame" channel (A-Frame's
  community page, https://aframe.io/community/ [read]). Closest to our stack (WebXR, A-Frame); the place for a
  WebXR question to people who build it.
- Supermedium, https://discord.gg/NPgArtG3Qz : 5,331 members, 290 online; the server of A-Frame's makers, with an
  "#aframe" channel (same A-Frame page). A-Frame's own Slack is, by that page, now of "limited history and little
  activity"; questions go to Stack Overflow's aframe tag and GitHub.
- Three.js, https://discord.gg/56GBJwAnUS (the invite in three.js's README [read]): 18,330 members, 1,862 online.
  The renderer under A-Frame.
- Claude (Anthropic's official server; www.anthropic.com/discord redirects to https://discord.com/invite/6PPFFzqPDZ
  [read: the redirect]): 130,390 members, 19,259 online. Where people who build with Claude Code meet; which channels
  it has for games or VR was not seen.
- Flat2VR Modding, https://discord.com/invite/ZFSCSDe (flat2vr.com redirects there [read: the redirect]): 166,574
  members, 28,279 online; "Discover and play hundreds of VR mods!". The VR-port community, where AI-written ports
  (Quake, GTA, Halo, Outlaws) would be shown; a separate commercial server, "Flat2VR Studios & Impact Inked", has a
  Discord listing page https://discord.com/servers/flat2vr-studios-impact-inked-1280938239997251585 [seen].
- XR Student Researchers, https://discord.gg/bRHTbT7BYN (from UCF's SREAL lab page, 2022, https://sreal.ucf.edu/?p=6298
  [seen]): 351 members, 29 online. XR research students; the page says members recruit participants for online
  studies. The nearest server found for VR studies with people; no server found for psychology experiments in VR as
  such.
- Mister VR's "VR Exploration Club" (name translated from Japanese), https://discord.gg/QTJF98jqMj (from his video
  in part 1a): 588 members, 113 online; a Japanese VR fans' and makers' community, by its description.
- OutlawsTheGame, https://discord.com/invite/VVA98hb (from the Outlaws VR post in part 4): 741 members, 80 online;
  the testers of that Claude-built VR port.
- Not found: an official Meta developer Discord (Meta's channels are its forums and docs; one web search found
  none), and a Discord of PICO or of IWSDK (IWSDK's README links none; checked through its raw README [read]).
