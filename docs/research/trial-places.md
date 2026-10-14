# Trial places: where VR players can try one room first, then come to the game (sweep of 2026-10-14)

The owner's ask (board, 14.10): a trial room where VR players already are, headsets first, then PC and phones;
we give them something to try, we do not pull them away. Our game: a free browser WebXR game (A-Frame, Quest 3
first), also flat in a desktop or phone browser. Marks: [read] = the primary page opened and quoted on the date
given; [seen] = only a search result, a secondary report or a library note; "unverified" = not confirmed.

## Parts (each gets an answer or "not found")
1. Social VR platforms on Quest with a creator's own world: 1a VRChat, 1b Rec Room, 1c Meta Horizon Worlds,
   1d Resonite, 1e others current in 2026 (Roblox on Quest, Spatial, cluster, VIVERSE, Gorilla Tag maps, Hubs).
   For each: users on Quest (dated), build tool, outside server / data, outside link, written rules on promotion.
2. A trial of the WebXR game itself on Quest, no port: 2a Meta Horizon Store (PWA, Early Access, free),
   2b Quest Browser new-tab featuring, 2c SideQuest web listings, 2d WebXR directories and launchers in use
   (heyVR, VIVERSE, itch.io, others) with traffic evidence, 2e PICO (known).
3. Communities: 3a subreddits (rules on own projects, members), 3b Discord servers, 3c Telegram and other
   Russian- and Ukrainian-speaking VR groups, 3d YouTubers and streamers who cover free or WebXR VR games.
4. Per option: cost to us, what we learn (do people come over), risks; then the ranked short list.

## Already in the project (read 2026-10-14)
- Library: Rivu et al. 2021 (papers/rivu-2021.txt, arXiv 2102.11207): recruiting VR users "through Facebook,
  Reddit and platform-specific forums (e.g., Steam, Rec Room)"; "it took some time to ensure that we complied
  with the rules of each subgroup"; "many forums also make it mandatory for users to achieve a certain number of
  points"; "auto-moderators flag the posts as spam" when one link goes to several subforums. [read]
- Library: Mottelson et al. 2021 (papers/mottelson-2021.txt, doi 10.3389/frvir.2021.681482): "The vast majority of
  participants came from Reddit; specifically ... r/OculusQuest, r/oculus, r/sidequest, and r/virtualreality". [read]
- Library: Saffo et al. 2020 (CHI EA, "Crowdsourcing Virtual Reality Experiments Using VRChat", cited by Rivu 2021):
  "the ease of recruiting participants from within VRChat"; data collection "limited" because "each online platform
  reviews the content" (Rivu's summary of Saffo). [read in Rivu; Saffo's own text not in the library]
- docs/research/world-asia.md 2-VR-JP: Japanese experiments run wholly inside VRChat, recruited "in VRChat
  communities on X ..., Misskey and Discord, and also inside VRChat". [read earlier]
- docs/research/forums-store-money-2.md D2: James C. Kane's "In Tirol" "launched on the new tab page for every
  Quest 2, Pro, 3, and 3S browser" under "Best of the Immersive Web"; "tens of thousands of MAU"; how to apply: not
  found then. Meta "Early Access" is a developer toggle (2025-12-17). [read earlier]

## Findings

### 1a. VRChat
- Users: record "nearly 150,000" online at once at New Year 2025-26 (Central time zone peak 148886); "well over
  half the user base access VRChat in headset"; no Quest share given. UploadVR, 2026-01-01 (updated 2026-01-12),
  https://www.uploadvr.com/vrchat-nye-user-record/ [read 2026-10-14]. Quest-only monthly users: not found.
- Build tool: Unity with the VRChat SDK and Udon (the scripting the board already names); our A-Frame code does not
  run there [read: creators.vrchat.com/worlds/udon/ is the scripting home; no web engine is offered].
- Outside server: "By default, a VRCUrl can only be accessed if it is on VRChat's domain allowlist"; the VRCUrl
  constructor "can only be called at editor time" (creators.vrchat.com/worlds/udon/external-urls, last updated
  2024-06-04) [read 2026-10-14]. String loading only downloads text: "One string can be downloaded every five
  seconds"; trusted hosts listed: *.disbridge.com, *.github.io, gist.githubusercontent.com, pastebin.com,
  *.vrcdn.cloud (creators.vrchat.com/worlds/udon/string-loading/, last updated 2026-06-17) [read]. Sending data out:
  no API on either page; with URLs fixed at upload time a world cannot report a player's result to our server.
  So: no data collection in a VRChat trial (consistent with the board's advice "without data collection").
- Outside link: no documented way for an ordinary world to open a browser. Ask VRChat thread, 2024-02-03/04:
  "Opening links is usually quite limited, like the vket worlds have access to such a function"; workarounds
  offered: "a text field" to copy the URL and "a QR code" (https://ask.vrchat.com/t/getting-udon-in-unity-to-open-a-link-when-pressing-a-button/22702)
  [read; a forum answer, not VRChat's word; no newer SDK note adding a link API was found in a search, unverified].
- Rules (all [read] 2026-10-14):
  - Terms of Service, effective 2026-02-09 (https://hello.vrchat.com/legal): 13.2(g)(ii) forbids "making any
    unsolicited offer or advertisement to another User"; 12: "You may not use any part of the Platform for any
    commercial uses ... without entering into a separate written agreement with VRChat"; 8.10: identifying data may
    be collected only "with the User's consent, outside of the Platform".
  - Creator Guidelines, last updated 2026-10-06 (https://hello.vrchat.com/creator-guidelines): "You are responsible
    for your own content and any content you link to", naming "world portals, URLs"; "We do not permit the
    promotion, advertising, integration, or solicitation of unauthorized products or services" stands in the NFT,
    crypto and blockchain section.
  - Community Guidelines, last updated 2025-09-24 (https://hello.vrchat.com/community-guidelines): advertising bans
    name illegal products and "commercial gambling services"; nothing on self-promotion of a free game.
  - Reading: a free world that tells its own story and names its source game is not banned in words; pushing
    strangers ("unsolicited") is; a paid game later may count as "commercial uses" needing VRChat's written
    agreement. Unverified: how VRChat moderators treat a "made by / play the full game at" poster; ask VRChat
    support before building.
- Cost: a new Unity + Udon build of one room (procedure, texts, voice reused; code new). Learn: visits and
  favourites on the world page (VRChat shows them; not read here, unverified), plus arrivals on our site from a
  QR / short URL unique to the world. Risk: no data, no link button, the rules above, Quest's world size limits
  (not read).

### 1b. Rec Room: closed
- "closing its doors on June 1, 2026"; "we never quite figured out how to make Rec Room a sustainably profitable
  business"; "grew to 150 million users over the last decade". UploadVR, 2026-03-31,
  https://uploadvr.com/rec-room-to-shut-down-in-june [read 2026-10-14]. Not an option.

### 1c. Meta Horizon Worlds: VR kept only for existing worlds (2026-03-19)
- Bosworth: Meta will "keep Horizon Worlds working in VR for existing games"; "We're not bringing new games"; the
  VR app stays on Quest's store "for the foreseeable future", worlds not recommended by the OS or storefront; the
  new Horizon Engine (Horizon Studio) is for flatscreen, web and phones. UploadVR, 2026-03-19,
  https://www.uploadvr.com/meta-will-keep-horizon-worlds-vr-support-for-existing-games/ [read 2026-10-14].
- Build tool: the Desktop Editor (Windows, legacy Unity runtime, TypeScript scripting) [seen: Road to VR and Meta's
  GDC 2025 blog in search results; not opened]. Outside server, outside link, promotion rules: not read (dropped
  as an option once VR became existing-worlds-only). Users on Quest in 2026: not found.
- Verdict: a new VR trial world here has no future on the headset; skip.

### 1d. Resonite: PC VR only
- Steam page: "VR Support: SteamVR, Oculus SDK", "OS: Windows 10", "Free To Play"; no standalone Quest client
  (https://store.steampowered.com/app/2519830/Resonite/) [read 2026-10-14]; Quest owners reach it only through
  a PC (Link / Steam Link) [seen: wiki.resonite.com via search; the wiki page did not render].
- Users: about 150-250 concurrent on Steam in 2026, June 2026 average 170-206 [seen: tracker.gg, steambase.io,
  live-player-count.com in search; steambase returned HTTP 500]. ProtoFlux has HTTP GET and WebSocket nodes, so a
  world could talk to our server [seen: wiki.resonite.com ProtoFlux:GETString, WebSocket pages via search].
- Verdict: tiny audience, not on standalone Quest; skip.

### 1e-i. Roblox on Quest: links off the platform forbidden
- Community Standards (https://about.roblox.com/community-standards, read 2026-10-14 [read]): URLs may be shown
  only "through the Social Links feature" on game, group or user pages, for users who pass the age check and are at
  least 16; "Any other efforts to direct users off of Roblox to an external website or service are prohibited."
  Content with "calls to action for off-platform products or services" counts as Advertising and must follow the
  Advertising Standards; from 2026-05-04 ad integrations must be registered in advance.
- Users on Quest: Roblox's help page "Meta Quest FAQ" (over 50,000 VR experiences per a search summary) returned
  HTTP 403; no 2025-26 Quest number found [seen]. Build tool: Roblox Studio, Luau (common knowledge, not read here).
- Verdict: the trial room could not point to our game except through the game page's Social Links; the age mix of its
  Quest players was not read (our recording is 18+; unverified). Skip.

### 1e-ii. VIVERSE (HTC): our A-Frame build as it is, on the web, Quest browser included
- Engines: VIVERSE "supports most ThreeJS projects, as well as the many tools and frameworks that have been built on
  top of the library, such as React-Three-Fibre (R3F)nd AFRAME" [sic]; publishing by ZIP upload in VIVERSE Studio
  or the VIVERSE CLI (docs.viverse.com, text copy https://docs.viverse.com/llms-full.txt, read 2026-10-14 [read]).
  News post 2025-06-12 lists A-Frame among supported engines
  (https://news.viverse.com/post/viverse-webxr-creator-studio-engine-support) [read].
- Outside server: "developers may also provision and connect with their own servers/analytics on VIVERSE. This
  process does require manual approval by the VIVERSE team, but we are able to quickly approve these requests" [read,
  llms-full.txt section "Bringing Your Own Game Servers & Analytics"]. So our Supabase calls would need that approval.
- Review: "Moderation usually takes less than 48 hours"; content is "iframed by default", WebXR needs the
  `xr-spatial-tracking` permission requested at "Submit for Review" [read]. Uploads stay at preview URLs until
  reviewed.
- What we learn: Studio shows "the total number of views" and "views over 30 seconds" per world [read]. Money:
  "Viewership Compensation ... Up to $0.011 USD monthly per player" for Partner Program members [read].
- Users: no VIVERSE audience figure in its docs; it says only "Millions of users play video games in the browser
  each month" (general web, not VIVERSE) [read]. Not found: a dated VIVERSE MAU.
- Rules on pointing to our own site from a VIVERSE world: not found in the docs (unverified; the terms of use at
  https://www.viverse.com/terms-of-use were not opened).
- Cost: the same build, a second copy hosted by HTC (a fork of our deploy, its own review). Risk: small or unknown
  audience; our data then runs through HTC's iframe and needs their approval.

### 1e-iii. Others (seen only, not opened)
- cluster (Japan): a Quest app since 2021 (App Lab); Cluster Script has `callExternal`, a beta call to an outside
  server, at first limited to 1 kB and 5 calls a minute per item [seen: zenn.dev and moguravr.com via a Japanese
  search; 2020-2023 articles; 2026 state unverified]. Unity-based; audience mostly Japanese (unverified).
- Hubs (Mozilla's, now community-run), Spatial, Gorilla Tag custom maps: not researched within the limit.

### 2b. Quest Browser new-tab featuring: the way in is now found
- Meta "Browser new tab page", last_updated 2026-07-22,
  https://developers.meta.com/horizon/documentation/web/browser-new-tab/ [read 2026-10-14]: submit through "the
  public WebXR submission form" at https://fb.me/ntp; steps: initial quality bar, then QA, content and technical
  reviews, developer iteration, curation or rejection (resubmission allowed); an accepted title is "promoted to the
  top of the new tab page shelf for an initial four-week period", then ranked against other WebXR titles by monthly
  user traffic. Criteria: the URL links to one experience, not a landing page or collection; no plain tech demo;
  hand-tracked titles need a discoverable exit; general Quest VRC requirements apply. "Submission does not
  guarantee" featuring. Age 13+ wording appeared only in a search summary [seen].
- Evidence it brings players: "In Tirol" got "tens of thousands of MAU from more than 140 countries" "with
  little-to-no marketing" after its new-tab launch (Meta blog by J. C. Kane, 2025-08-27; forums-store-money-2.md D2
  [read earlier]). One title; not a promise.
- Cost: none beyond our live link (and a VRC-level polish). Learn: our own arrivals, with a `?from=ntp` tag on the
  submitted URL (our site; the tag is our idea, not Meta's). Risk: review time unknown; rotation after four weeks.

### 2a. Meta Horizon Store: a free PWA listing, Early Access possible (already researched)
- Packaging and the Store: docs/research/revision-1-store.md and projects/distribution.md [read earlier]. Early
  Access is a developer toggle: "You can enable Early Access during app submission"; "Disabling Early Access is an
  irreversible action" (Meta, last_updated 2025-12-17, https://developers.meta.com/horizon/resources/early-access/;
  quoted in forums-store-money-2.md) [read earlier]. Elysian, a free WebXR PWA, has been on the Store since
  2025-06-26 [read earlier]. Cost: the signed TWA build (Bubblewrap), the Store's review; same web code.
  Learn: Store installs plus our own arrivals. Risk: review effort now; Early Access cannot be undone.

### 2c. SideQuest's WebXR list: existed, current state unverified
- UploadVR (undated in the page text): SideQuest made "a beta version of a web page" listing web VR, at
  http://sdq.st/webxr [seen via search; not opened]. On 2026-10-14 sdq.st/webxr redirected to the SideQuest home
  page behind a cookie banner offering only "Customize" or "Accept All" (not accepted, so not read) [read: the
  redirect]. SideQuest audience: "more than two million monthly active users (as of May 2022)" (projects/
  distribution.md) [read earlier, stale]. Whether a WebXR URL can be listed today: unverified (FOR THE OWNER).

### 2d. WebXR directories and launchers
- heyVR (heyvr.io): free sign-up, build uploaded to heyVR, "Submit for Review", "we'll inform you of any issues";
  a Google Analytics tag allowed; a dashboard of "views, interactions, and user feedback", "Not all of these
  features are available as of yet" (https://docs.heyvr.io/developers/publish-your-game, read in the browser pane
  2026-10-14 [read]). Traffic: 30.8K visits a month, top country United States 34.23%, Russia 6.48% (Similarweb,
  page dated September 2026, https://www.similarweb.com/website/heyvr.io/) [read; a traffic estimate]. Cost: a
  copy of the build hosted by heyVR; whether our own server calls are allowed: not found.
- itch.io: 111 results under the WebXR tag on 2026-10-14 (https://itch.io/games/tag-webxr) [read]; an HTML5 page
  can embed or link our build (itch.io's own rules not read). Traffic for the tag: not found.
- VIVERSE: see 1e-ii (the only directory found that names A-Frame and allows our own server on approval).
- dmnshd.gg (founded 2026): "Every game on dmnshd.gg is designed, developed, and published in-house by the dmnshd
  team" (https://dmnshd.gg/developers) [read]. Not a channel for us.
- PICO Store: takes a PWA by URL (projects/distribution.md) [read earlier]; PICO is not sold in the US (forums-
  store-money-2.md) [read earlier].
