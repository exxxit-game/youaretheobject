# AI and VR: who has already done what we do

The owner's question (14.10.2026): are we the first? Searched in many languages, written as found by the
deep-research helper, session date 2026-10-14. Marks per item: date; kind (paper, product, post, talk);
[read] = opened and read in full or the relevant part; [seen] = only in search results, unverified.
Non-English sources are quoted in English translation, with the original language named.

Parts of the question (each gets an answer or "not found"):
- A. AI agents as the developer of VR/XR/WebXR apps or games (people, non-programmers with AI, papers 2023-2026, posts).
- B. Psychology experiments re-created in VR and offered to the public as a game or at home (citizen science, online labs, remote VR study platforms, games whose rooms are classic experiments).
- C. AI (LLMs) used to design, build, run or analyse VR psychology experiments.
- D. Any project combining all three: AI building it, VR, real psychology experiments with the player as the subject.
- Languages: English, Chinese, Japanese, Korean, German, French, Spanish, Portuguese, Russian, Ukrainian, Polish, Italian, Turkish, Arabic, Hindi.
- Closest to us; Not found / not opened.

## A. AI agents as the developer of VR/XR/WebXR apps or games

Note (coordinator, 14.10): the owner's main question is A, AI in VR development; B-D are kept short. For each A item:
how the AI is used (writes all code or assists), whether it tests in the headset itself, what went wrong, the process.

### A1. People who built VR/WebXR apps or games with an AI coding agent (posts, products)

- Marcus Ferreira, "From Prompt to Headset: How I Built My Second VR Game with Claude", Medium, 1 Jul 2026; post [read in the browser pane]. https://medium.com/@pixelpreto/from-prompt-to-headset-how-i-built-my-second-vr-game-with-claude-76c401036907 . A UX designer (tags "UX Design"), Portuguese speaker, builds two small HTML/WebXR gaze games for a phone-in-a-box viewer ("MotoG9 Play into the visor of a Shinecon headset"). How AI is used: chat prompts, Claude writes the HTML; "a super simple prompt was made initially, and after testing the first results, I iterated". Headset testing: by him, advice "Test with the real device from the start. What works in the browser may not work inside the headset." What went wrong: not reported. Differs from us: a one-page toy, no agent loop, no science.
- "Claude World VR" by PicoLof, itch.io, date not shown; product [read]. https://picolof.itch.io/claude-world-vr . The page says "Built by Claude", tagged AI-assisted for Code, Graphics, Sounds and Text, made "in a single conversation with a person"; a WebXR art space for Quest 2/3 and Pico 4 Ultra. Process and testing not described.
- "VR Creative Sandbox: first testable prototype (WebXR for Quest 3S, desktop fallback)", GitHub PR #1 by mehdehemmanuel-maker, merged 28 Sep 2026; code/product [read]. https://github.com/mehdehemmanuel-maker/claude-code/pull/1 . Written by Claude Code (commits by the claude account, "Generated with Claude Code"; 15 commits, each a layer, each reporting tests, e.g. "99 tests passing"; an architecture audit in the PR). Headset: the agent tested only in Chromium with Meta's WebXR emulator ("verified in Chromium: controllers connect"); the headset left to the person: "This is the first build you can test in the headset"; performance "Not measured yet". Closest in method to us (human + Claude Code, WebXR, Quest, tests, audits), but no psychology and no headset measurement by the agent.

### A2. Platform makers who build VR with AI agents themselves (Meta)

- Meta, "IWSDK AI-assisted dev tooling", Horizon OS docs, last updated 2026-03-10; documentation [read]. https://developers.meta.com/horizon/documentation/web/iwsdk-ai-assisted-dev-tooling . Meta's own WebXR SDK (IWSDK, MIT, Three.js + ECS) ships an agent loop for Claude Code: the agent "connects to an MCP server running inside the Vite development server via stdio"; 32 MCP tools (session, device control, observation, scene inspection, ECS debugging) drive IWER, the headset emulator, so "no headset required"; a Quest is optional "for on-device testing"; a RAG server over the SDK, six Claude Code skills and a generated PROJECT_CLAUDE.md. Known trap named there: a missing LocomotionEnvironment is "the #1 cause of bugs". The agent tests in the emulator, not in the headset.
- Meta, "Accelerate VR Development with AI & Immersive Web SDK", Horizon developer blog, 8 Apr 2026; post [read]. https://developers.meta.com/horizon/blog/accelerate-vr-development-with-ai-and-immersive-web-sdk/ . Meta rebuilt its WebXR gardening app Project Flowerbed with the agent loop, "rebuilt from the ground up in only 15 hours", reusing old art; the AI "writes code, tests interactions, and fixes bugs alongside you"; lesson stated: closing the loop with validation is "essential for high-quality, reliable results". How it was tested on the device and what failed: not said.
- Meta, "What Unity Developers Learned About Building for Meta Quest at Unite Seoul 2026", blog, 22 Jul 2026; post [read]. https://developers.meta.com/horizon/blog/unite-seoul-2026-meta-quest/ . Two internal prototypes "built almost entirely through AI-assisted agentic workflows": Arcade Hoops "from idea to playable beta in two days", Neon Reach VR playable in one day, "ready in three days total". Loop: a prompt, the agent writes code, builds the scene and "validates the result inside XR Simulator", then human prompts and manual edits. Tools: Meta VR CLI, Unity MCP, Meta XR Operator; 32 open agent skills. Novel mechanics "still benefit from hands-on iteration". No failures reported (a vendor showcase).
- Meta's Unity tutorial series uses Claude Code in every example (Unity 6.3, Unity MCP; the agent "can read the scene, modify objects, run play mode, and inspect components") [seen in search only]: https://developers.meta.com/horizon/documentation/unity/unity-tutorial-ai-vr-setup/
- Note for judging closeness: since spring 2026 the maker of our headset itself presents "an AI agent writes and tests the VR app" as the normal path. In all Meta's examples the agent checks in an emulator or simulator; on-device testing is optional and done by a person. Our agent's measuring in the real headset over USB (tools/quest-look.mjs, metavr, OVR Metrics) goes further than these published loops; Meta's own metavr CLI and skills make it possible, so it is not unique in kind.

## B. Psychology experiments in VR offered to the public

- VERA (Virtual Experience Research Accelerator), Gottsacker, Bruder, ... Bailenson, Welch; arXiv:2609.26203, 4 Sep 2026; paper [read: library copy objekt-files/papers/gottsacker-2026.txt, sections I-IV]. A cloud research platform: a web app for study design plus a Unity plugin; the study is "published as a WebXR application and assigned a unique distribution URL"; participants are recruited through Prolific and play "on their own consumer HMD", unsupervised. The study is cybersickness (N=263), not a classic psychology experiment as a game. Its own positioning: closest relatives are RemoteLab (supervised remote sessions over video) and Ouvrai ("supports unsupervised WebXR studies but requires each research group to host its own backend"). No AI/LLM in its build or run is stated. Differs from us: a tool for researchers with paid recruited participants, not a public game; built in Unity by a lab team.

## C. AI (LLMs) used to design, build, run or analyse VR psychology experiments

## D. All three together

## Closest to us

## Not found / not opened
