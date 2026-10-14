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
