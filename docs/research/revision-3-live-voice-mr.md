# Tool revision, area 3 of 5: live players, voice, mixed reality, spatial audio

Research for the owner's tool revision (10 Oct 2026): for each tool or choice, what we use now, the best option,
keep / change / add, why, cost now versus after five rooms, and what only the owner decides. Marks: **[read]** the
page or code was opened and the quote is in it; **[code]** read in source; **[unverified]** not confirmed on a
primary page. Meta pages through `metavr docs` where it had them. Prices are our arithmetic on prices read.

## The short answer

| Tool or choice | Now | Best option | Verdict | Now vs after five rooms |
|---|---|---|---|---|
| Live transport for decisions | none (Supabase Pro for results only) | Supabase Realtime + Postgres functions as referee | **add** (no new vendor) | now: one engine module, one migration pattern; later: five rooms' own sync code rewritten |
| Bodies and voice between players | none | WebRTC peer-to-peer, Cloudflare relay (or LiveKit) | **add later**, only for rooms that need it | cheap either way if decisions and bodies are kept apart from the start |
| networked-aframe, Colyseus, Croquet, Photon, Normcore, PartyKit | none | not adopted | **no** | each is a second server or a cheating hole (1b) |
| Partner when nobody is online | none | earlier real players' recorded choices, said openly | **add, design rule** | now: store every decision replayable; later: old data cannot be replayed |
| Speech recognition | none | on-device Whisper for short answers, if the headset runs it | **owner decides** (D1) | now: one probe; later: consent, privacy page and data rules all hang on it |
| Browser speech APIs | not used | stay unused | **keep** | none |
| Voice lines (ElevenLabs "Daniel", eleven_v3) | tools/make-voice.mjs | same | **keep**; fix `scribe_v1` in check-voice | none; v4 exists, re-recording would change the voice |
| Mixed reality | A-Frame 1.7.1, probe done (04-mr.md) | same; one AR-session probe | **keep**, decide the session shape now | now: one probe; later: every room's entry re-tested |
| Spatial audio | Web Audio panner, HRTF (sfx.js) | same | **keep**; place the voice at its source in rooms | none |

## The parts (each answered below or marked "not found")

1. Live players: 1a now; 1b transports (Supabase Realtime, WebRTC with signalling, Colyseus, Croquet/Multisynq,
   PartyKit/Durable Objects, Photon, Normcore, Meta's own), networked-aframe; 1d latency per experiment; 1e
   matchmaking with few players, bots or recorded partners; 1f cheating; 1g cost at 100 and 10,000 players.
2. Speech: 2a-2b the browser's own APIs; 2c on-device Whisper; 2d-2e cloud and privacy; 2f the voice we use now.
3. Mixed reality in the Quest Browser, Quest 2 vs 3/3S. 4. Spatial audio. 5. Decisions and first steps.

### 1a. What we use now [code, read]

- No live-player code: a grep of src/ for realtime, websocket, webrtc, networked finds nothing. The only server is
  Supabase Pro (eu-west-1 Ireland), insert-only `submit_run` / `submit_playtest` (docs/state.md: "insert-only for
  anon, verified"). Nothing is sunk: the choice is free today.

### 1d. Latency the experiments need (papers in our library) [read]

- **Economic games: seconds, not milliseconds.** Herrmann et al. 2008 (papers/herrmann-2008.txt l.962): "You will
  have 90 seconds in the first two periods and 60 seconds in the remaining periods"; decisions "made
  simultaneously" (l.34); Fehr & Gächter 2002 (l.12): "All the punishment decisions were also made simultaneously."
  What matters is that nobody sees others' choices first: a server must hold them until all are in.
- **Conformity (Mori & Arai 2010): turn-based and spoken.** papers/mori-arai-2010.txt l.34: "I will call upon each
  of you in turn to announce your judgments"; l.39: "Each trial took approximately 30 seconds"; groups of four. A
  faithful live version needs voice between players (part 2 meets part 1 here).
- **The mirror game is the one hard case.** Noy et al. 2011 (papers/noy-2011.txt l.34): "synchronized to less than
  40 ms". Out of reach over the internet; objekt-files/notes/archive/docs/ideas/multiplayer-voice.md §3 already plans it on one local network.
- **Disconnects cost more than delay.** Hawkins et al. 2020 (papers/hawkins-2020.txt l.67): games ended "due to
  server error or network disconnection (40 in free matching and 33 in cued)". A dropout rule and a reconnect path
  come first.

### 1b. Transports [read]

- **Supabase Realtime (already paid for).** Limits (https://supabase.com/docs/guides/realtime/limits): connections
  Pro 500, "Pro (no spend cap)" 10,000; messages per second Pro 500; over a limit it refuses or disconnects, and
  "supabase-js reconnects automatically once throughput drops". Price
  (https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages): "Each broadcast message counts as
  one message sent plus one message per subscribed client"; Pro includes 5 million, then "$2.50 per 1 million
  messages"; peak connections: Pro includes 500, then "$10 per 1,000 peak connections" (.../realtime-peak-connections).
  Speed (https://supabase.com/docs/guides/realtime/benchmarks): broadcast median 6 ms, p95 28 ms, p99 213 ms; from
  the database median 46 ms (server side; the player's trip to Ireland comes on top, unmeasured). Referee
  (https://supabase.com/docs/guides/realtime/broadcast): "`realtime.send()` inserts a message" from the database,
  so a Postgres function can hold sealed choices and announce them when all are in; private channels, but "private
  topics accept only authenticated clients" (our players are anonymous: anonymous sign-in needed, **unverified**
  for our project). Carries no audio.
- **A country can cut the server.** TechCrunch, 27 Feb 2026
  (https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/):
  "The blocking order was issued on February 24"; supabase.co unreachable on three Indian providers. Russia: no
  report found (searched in Russian). Results and live rooms hang on one domain.
- **networked-aframe.** GitHub API (10 Oct): 1,206 stars, last push 2026-10-03, release 0.14.3 (2026-03-30). README
  (https://github.com/networked-aframe/networked-aframe): example loads A-Frame 1.8.0; WebSocket adapters "No
  audio/video"; the native "webrtc" adapter has "No current maintainer"; "The owner of an entity is responsible for
  syncing its component data" (no server-held state); needs its own Node server. Made for shared avatars, not
  sealed decisions; 1.7.1 support **unverified**.
- **PartyKit / Cloudflare Durable Objects.** Cloudflare, 5 Apr 2024 (https://blog.cloudflare.com/cloudflare-acquires-partykit):
  "an open source platform for deploying real-time, collaborative, multiplayer applications". Pricing
  (https://developers.cloudflare.com/durable-objects/platform/pricing/): "minimum $5/mo usage"; "1 million / month,
  + $0.15/million" requests; incoming WebSocket messages billed 20:1, outgoing free; hibernating objects "are not
  billed for duration". Good and cheap, but a second platform and language runtime beside Supabase.
- **Colyseus.** MIT, 7,355 stars, pushed 2026-10-09 (GitHub API); https://colyseus.io/pricing/: "Self-host on your own
  servers", Cloud "Starting at $15/mo". Server-held rooms, but one more server to run.
- **Croquet / Multisynq.** croquet/croquet README: "build real-time multiuser apps without writing server-side
  code", synced by a "reflector server" on "Multisynq's global DePIN network" with an API key; multisynq-client is
  archived (GitHub API, last push 2025-08-25). Every client computes all state, so sealed choices would sit in each
  player's memory (our inference): wrong for economic games.
- **Photon Realtime** (https://www.photonengine.com/realtime/pricing): free 20 CCU, development only; "100 CCU
  (launch) $95 one-time, valid 12 months"; 500 CCU $95/month. The page does not mention its JavaScript SDK.
- **Normcore** (https://docs.normcore.io/platforms): "supports all platforms supported by Unity 2020 LTS and newer";
  web means Unity "WebGL". Not usable from A-Frame.
- **Meta's own for WebXR: not found.** Meta's Group Presence (meta-vr skill hz-platform-sdk) is for "Meta VR
  Android applications", Kotlin; `metavr docs search` for WebXR multiplayer returns only Unity/Unreal samples
  (Shared Spaces uses "Photon Realtime"); Meta's browser specification page names none.
- **Voice relay.** Cloudflare Realtime (https://developers.cloudflare.com/realtime/sfu/pricing/): "The first 1,000 GB
  each month is free", then "$0.05 per GB of egress". LiveKit: Apache-2.0, 21,355 stars (GitHub API); price page
  not read.

### 1e. When nobody is online [read]

- March 2019, CESifo WP 7926 (https://www.ifo.de/DocDL/cesifo1_wp7926.pdf, full text read; journal version 2021,
  doi 10.1016/j.joep.2021.102426, paywalled): across 90 studies "humans act more selfishly and more rational in the
  presence of computer players". He excludes "papers that use deception" and lists the honest alternative of
  telling participants "they are matched with subjects from a previous session" (Shapiro 2009; Cox et al. 2017).
- For us (our reading): a hidden bot breaks the economists' norm and "no invented mechanics"; a labelled bot changes
  behaviour. The clean fallback: "you play against the recorded choices of earlier real players", said openly. So
  every multi-player room stores each decision with its context in a replayable form from its first build, and
  forms a live group only when enough players wait (owner: D2).

### 1f. Cheating: who holds the truth (our reasoning on the pages above)

- A browser client is open to its player. Sealed choices must sit on a server: a Postgres function with
  `realtime.send()`, a Durable Object, or a Colyseus room; not Croquet, not networked-aframe's owner model. Our
  `submit_run` (insert-only, field whitelist) is already this pattern.

### 1g. Cost at 100 and 10,000 players a month (our arithmetic; assumptions marked)

| Design | Supabase Pro (have) | Durable Objects | Peer-to-peer WebRTC |
|---|---|---|---|
| Decisions only (4 players, 10 periods, ~3 sends a period: ~160 messages a player) | 100: 16 k, 0 $; 10,000: 1.6 M, inside 5 M, 0 $ | 5 $ minimum | needs signalling anyway; 0 $ |
| Bodies streamed (head + hands, 20 Hz, 4 players, 10 min: ~48 k messages a player) | 100: 4.8 M, 0 $; 10,000: 480 M, ~1,190 $ | 10,000: ~6 M requests, ~1 $ | 0 $ server |
| Voice (4 players, 10 min, 32 kbit/s assumed: ~7 MB a player) | cannot carry it | cannot carry it | 10,000: ~72 GB, inside Cloudflare's free 1,000 GB |

- Peak connections: 10,000 a month is far below 500 at once except at scheduled events (the largest room in
  objekt-files/notes/archive/docs/ideas/multiplayer-voice.md is 14 at once). The rule: decisions through the server, bodies peer-to-peer.

### 2a-2b. The browser's own speech in the Quest Browser

- **Recognition: reported missing; no Meta page names it.** Meta forum (archived), M. Mainguy, about 2024: the API
  "doesn't seem to be exposed on meta quest2" (read in the browser pane,
  https://communityforums.atmeta.com/discussions/dev-quest/speechrecognition-in-webxr/1168273; no reply). Meta's
  "Browser specifications" (2026-07-21, https://developers.meta.com/horizon/documentation/web/browser-specs/) names no
  speech API and says "Do not use the user-agent string for feature detection"; the last ten release notes (42.0
  to 152.1, https://developers.meta.com/horizon/documentation/web/browser-release-notes/) never mention speech.
  Browser 152 on our Quest 3: **unverified** (one console line settles it).
- **Synthesis: our own observation only.** src/engine/voice.js: "Quest Browser has no speech synthesis at all"
  (commit a41845d, 7 Oct; no probe log). **Unverified**; irrelevant while recorded lines are kept.

### 2c. On-device Whisper [read]

- Radford et al. 2022, arXiv 2212.04356 (https://arxiv.org/abs/2212.04356, PDF read), Table 13 "WER (%) on Fleurs":
  | Model | Russian WER % | English WER % | 8-bit download (encoder + decoder) |
  |---|---|---|---|
  | tiny | 31.1 | 12.4 | 10.1 + 30.7 MB |
  | base | 20.5 | 8.9 | 23.2 + 53.7 MB |
  | small | 11.4 | 6.1 | 92.3 + 156.8 MB |
  | large-v2 | 5.6 | 4.2 | (too large for a headset) |
  Sizes: Hugging Face API, onnx-community/whisper-* (10 Oct). Table 11 (Common Voice 9), Russian: base 28.8, small
  15.0. Columns read from rotated headers (checked against Polish 5.4, Portuguese 4.3): a fact-checker should
  re-read. Meaning: base gets about one Russian word in five wrong; fine for "yes / no / a number", weak for coding
  free explanations (choice blindness, two phones).
- WebGPU in the Quest Browser is "Experimental" (146.0, 21 Apr 2026: "Experimental WebGPU and WebXR depth
  projection support"; 152.1: "Experimental WebGPU composition layers") [read]. Whether a page gets a GPU adapter by
  default, and how fast base runs on a Quest 2 or 3 beside the scene: **unverified**, no report found.

### 2d-2e. Cloud speech-to-text and the privacy of voice [read]

- **ElevenLabs.** https://elevenlabs.io/docs/models: Scribe v2 "designed for accurate transcription across 90+
  languages"; deprecated table: `scribe_v1` "First generation speech recognition (outclassed by v2 models)",
  replacement `scribe_v2`. **tools/check-voice.mjs still asks for `scribe_v1`** (no removal date given). No WER figure.
- **Retention** (https://elevenlabs.io/docs/resources/zero-retention-mode): retention is on by default, data kept "to
  improve services"; deleted items "can remain in backups for up to 30 days"; no-retention mode is for "Enterprise
  customers". Player voice sent there is stored by a US company.
- **Law (our docs).** own-experiments-now-2.md 4c: GDPR biometric only when processed "for the purpose of uniquely
  identifying"; 152-FZ Art. 18(5): Russian citizens' data not to be collected into databases abroad.
  objekt-files/notes/archive/docs/ideas/multiplayer-voice.md: "Only numbers leave it, never audio or transcripts". A cloud recogniser breaks
  that rule; an on-device one keeps it.
- **Russian provider (Yandex SpeechKit):** its price page redirected to aistudio.yandex.ru, which refused the
  connection: **not read** (owner link below).

### 2f. The voice we use now (tools/make-voice.mjs) [code, read]

- Stock voice "Daniel" ("ElevenLabs stock voice"), model `eleven_v3`, stability 1, lines evened to -18 LUFS.
- Licence (https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform): "The
  free plan does not include a commercial license"; "All paid plans include a commercial license, provided you're
  not using Beta Services"; "Content created outside of a paid subscription (before or after) cannot be used
  commercially." Every shipped line must be made under a paid plan; the account's plan: **unverified** (owner).
  Separate terms for stock voices: none found (**unverified**).
- https://elevenlabs.io/docs/models: "Eleven v3 is our previous generation speech synthesis model"; flagship now
  `eleven_v4`; v3 not deprecated, nothing marked beta. Keep v3 (a new model changes the voice).

### 3. Mixed reality in the Quest Browser [read]

- docs/research/vr/04-mr.md (8 Oct, read in full) stands: passthrough, planes, 8 persistent anchors per site, hit
  test without a room scan, mesh, depth, hands; never camera pixels inside WebXR; headset cameras only through a
  separate getUserMedia permission; all granted on our headset (docs/headset-capabilities.md). A-Frame gaps listed
  there (AR button off by default, `real-world-meshing` makes planes required, depth needs a hand-added init).
- **Quest 2 is the weaker MR device.** Meta, "Mixed Reality Support in Browser"
  (https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/, metavr): "Passthrough is in color on
  the Meta Quest Pro and grayscale on Meta Quest 2." Meta Help (https://www.meta.com/help/quest/1406582186767703/):
  "Mesh data is only available on Quest 3 and Quest 3S headsets"; "Depth data is only available on Meta Quest 3 and
  Quest 3S headsets." Hit test and headset cameras on Quest 2: **unverified**.
- **Depth must be optional.** IWSDK Ch. 15 (last_updated 2026-09-04): "Setting `required` to `true` prevents the
  immersive session from starting when the device cannot provide depth data". Ch. 14 (2026-07-22): environment
  raycast "does not require room scanning".
- **Since 8 Oct:** browser 152.1 (2 Oct) adds only "Experimental WebGPU composition layers"; nothing for MR.
- **The choice that shapes every room** (04-mr.md, conflict 2): one `immersive-ar` session can show the corridor
  fully virtual and fade to the real room, no second session or button press; whether the boundary still guards a
  VR scene inside an AR session, and its frame cost, is unprobed. Decided now: one probe. After five rooms: every
  room's entry re-tested.

### 4. Spatial audio [code, read]

- **Now:** src/engine/sfx.js places effects with the Web Audio panner, "HRTF panning", inverse distance, listener on
  the head each frame; src/engine/voice.js plays the voice unplaced. Meta (01-meta.md §5): sounds "authored as
  monophonic (single channel) sources"; "Apps should support 3D audio spatialization, although it is not required".
- **A-Frame's `sound`** (https://github.com/aframevr/aframe/blob/v1.7.1/docs/components/sound.md): `positional`
  true, `distanceModel` "inverse"; no panning model named. Ours is equal or better.
- **Resonance Audio (web):** GitHub API `archived: true`, last push 2022-03-08; npm 1.0.0 of 2017-11-08. Frozen: no.
- **Omnitone** (https://github.com/GoogleChrome/omnitone): "ambisonic decoding and binaural rendering written in Web
  Audio API"; npm 2.0.0 on 2026-09-30, live. It plays recorded sound fields and sends "interactive panning" to
  Resonance: only for a recorded 360-degree ambience, if a room ever needs one.
- **Fix in our code, not a tool:** where the experimenter stands or a loudspeaker speaks, the voice should come from
  there (01-meta.md §5, our summary of Meta's "Immersive sound": avoid head-locked stereo); the corridor's automatic announcement can stay unplaced.

## Decisions for the owner (real options; nothing here is settled by a source)

- **D1. Who recognises the player's speech?** (a) on the headset: Whisper base (~77 MB, Russian WER 20.5 %) or
  small (~249 MB, 11.4 %), no audio leaves, only if the probe shows it runs; (b) ElevenLabs Scribe v2: our account,
  best accuracy (no figure published), audio stored in the US by default; (c) a Russian provider (Yandex SpeechKit),
  data in Russia, price not read; (d) no free speech: answers chosen on the sheet, the microphone only for timing
  and loudness measured on the headset.
- **D2. How live rooms meet:** (a) drop-in: match whoever waits, else earlier players' recorded choices, said
  openly; (b) scheduled events (his Telegram community at a set hour); (c) both.
- **D3. Voice between live players:** (a) only in rooms whose original spoke aloud (Mori & Arai, Hawkins, Reddish),
  never recorded; (b) never: answers relayed as text or sound cues.
- **D4. MR on Quest 2:** (a) MR rooms in grayscale passthrough without depth or mesh; (b) a VR version of each MR
  room on Quest 2; (c) MR rooms only on Quest 3/3S.
- **D5. A fact only he can give:** which ElevenLabs plan the account is on (licence of every shipped line).

## What to do first

1. One headset session, on his word: in the game page's console, `'SpeechRecognition' in window`,
   `'webkitSpeechRecognition' in window`, `speechSynthesis.getVoices()`, `navigator.gpu` and its adapter,
   `RTCPeerConnection`; enter the corridor in an `immersive-ar` session opaque (boundary shown? frame time?).
   Timing Whisper base on the headset needs a ~77 MB model download: only on his word.
2. Before the first live room: a room declares what it needs (decisions / bodies / voice) and its fallback
   (recorded partners); one engine module over Supabase Realtime with Postgres functions as referee; decisions
   stored replayable. This is the step that is cheap now and dear after five rooms.
3. Small repair: tools/check-voice.mjs `scribe_v1` to `scribe_v2` (deprecated model).

## Unverified, said plainly

- Speech recognition and synthesis on browser 152; WebGPU adapter by default; Whisper speed on Quest 2/3.
- Supabase anonymous sign-in for private channels; reachability of supabase.co from Russia; trip time to Ireland.
- networked-aframe on A-Frame 1.7.1; Photon's JavaScript SDK; LiveKit prices; Yandex prices and retention.
- Hit test and headset cameras on Quest 2; the boundary and frame cost of VR inside an AR session.
- Whisper table columns (rotated headers): re-read by the fact-checker. The 32 kbit/s voice rate is an assumption.
- Not saved to the library (the caller asked for no downloads): radford-2022 and march-2019 texts are only in this
  session's scratchpad.

## Pages only the owner can open

- https://elevenlabs.io/app/subscription (login): which plan the account is on (D5).
- https://aistudio.yandex.ru/docs/en/speechkit/pricing (refused our connection): SpeechKit recognition price per 15 s
  and whether audio is logged or used for training (only if D1 (c) is considered).
- https://doi.org/10.1016/j.joep.2021.102426 (paywall, optional): March 2021, the 162-study version of 1e.

## Checked by the owner (10.10)
- ElevenLabs plan: Starter ($6 a month, "Current plan" on his subscription page), which lists "Commercial License for
  Speech and Music"; the Free plan has it struck through. Lines made while the account was on Free carry no commercial
  licence. He took Starter from the start, before any line was recorded ("I took it at once, as soon as we started", his words, 10.10, our translation): every shipped line is covered, nothing to re-record.
- Yandex SpeechKit prices (page text pasted by the owner from https://aistudio.yandex.ru/docs/en/speechkit/pricing ):
  streaming and synchronous recognition "$0.0013327867" per "15-second segment of a single-channel audio file",
  "Shorter segments are rounded up (1 second becomes 15 seconds)"; dollar prices apply to customers of "Iron Hive doo
  Beograd (Serbia) or Direct Cursus Technology L.L.C. (Dubai)", rouble prices to "Yandex.Cloud LLC". By our arithmetic
  20 short answers a room (each billed as 15 s) cost about $0.027 a player, about $270 for 10,000 players. The page
  says nothing on whether audio is logged, and whether an owner in Ukraine may contract a Yandex company at all is
  not checked: both before any choice of Yandex.
