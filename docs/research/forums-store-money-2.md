# Forums: shipping a WebXR PWA to stores, paid content, payouts outside the US (sweep of 2026-10-11) (part 2)

Part 1: [forums-store-money.md](forums-store-money.md).

### 1. Target API 34 (Meta's forum announcements, read in the browser pane 2026-10-11)
- T1. Meta forum, h.taylor (Community Manager), "30-day Reminder: Android 14 Targeting Required Starting March 1",
  "8 months ago" (~2026-02), snippet: "Set your targetSdkVersion to API level 34 Your minSdkVersion can remain at API
  level 32 Existing published apps will continue to work without changes New binary uploads after March 1 w...";
  earlier "Update | Meta Horizon Apps Must Target Android 14 Starting March 1", "10 months ago": "all new binary uploads
  for new or existing Meta Horizon apps will be required to target Android 14 (API level 34)".
  (search page https://communityforums.atmeta.com/search?q=targetSdkVersion%2034 ; the list on
  https://communityforums.atmeta.com/discussions/News_and_Announcements/a-new-strategy-for-meta-horizon-in-2026/1366781).
  (c) with Meta's blog as updated 2026-02-06 ("only apps created in the Developer Dashboard after March 1, 2026"),
  but both agree for a NEW app like ours. A PWA-specific report of an upload refused for target 32: NOT FOUND.
  Plan: revision-1-store.md part 2 "conflict to test first" stands: patch the generated Gradle to 34 and try one upload
  early.
- T2. Meta forum, h.taylor, "A new strategy for Meta Horizon in 2026", "7 months ago" (~2026-03): "VR is focused on
  third-party apps and games"; "We're updating the Meta Horizon Store so developers' VR content takes center stage";
  "Better discovery and monetization tools are coming". Same link as above. Vendor statement, no numbers. Also listed:
  "Horizon Feed being replaced by Navigator starting in v85" (~2026-02). Plan: discoverability rules on the Store are
  changing in 2026; re-read the Store's discovery pages before our listing (revision-1-store.md part 12).
- T3. The old Meta developer forum is "archived and read-only"; the new Developer Forum relaunched 2025-09-23 in the
  same site (search result text, https://communityforums.atmeta.com/discussions/news-and-announcements/developer-forum-relaunch-scheduled-for-september-23/1344176 ,
  not opened). Plan: none.
- O4. PICO: MIXED, 2025-04-24: solo developers "can now independently release their" XR apps, paid ones included,
  "entirely online via the Pico Developer Console"; no revenue share, regions or payouts named.
  https://mixed-news.com/en/picos-new-platform-policy-makes-life-easier-for-independent-xr-developers/ . Kane (S2,
  2025-06): PICO is "not available in the U.S.". A first-hand report of a WebXR PWA put on the PICO Store by its own
  developer (not heyVR, whose listing PICO announced itself): NOT FOUND (English, Chinese, Japanese searches). PICO's
  own PWA submission page did not render earlier (store-fees-own-sales.md 1.2). Plan: PICO stays "later, unverified";
  a solo paid listing is allowed since 2025-04, the fee is still unknown.
- Meta's Feedback Center search (https://developers.meta.com/horizon/feedback/vr/search/?q=PWA) asks to sign in: not
  read (FOR THE OWNER only if wanted; the one public PWA investigation is in forums-aframe-quest.md P2).
- O5. Steam via a wrapper: a shipped WebXR game on Steam through Electron/NW.js: NOT FOUND (one search; a 2022
  Babylon.js thread only asks, https://forum.babylonjs.com/t/vr-webxr-game-with-steamvr-oculus-integration/28353 ,
  not opened). SteamVR regression for WebXR: ValveSoftware/openvr issue 1784 "WEBXR broken, SteamVR 2.0.8",
  2023-11-01, still OPEN, 7 comments (gh, read 2026-10-11) https://github.com/ValveSoftware/openvr/issues/1784 .
- O6. Steam Frame (Valve's 2026 headset): saphid, "Chromium with WebXR for the Steam Frame", repo created 2026-09-26:
  "The Chromium that SteamOS offers (Flathub) can't do this. Websites see `navigator.xr`, but
  `isSessionSupported("immersive-vr")` returns `false`"; "Upstream Chromium only wires up its OpenXR backend on Windows
  and Android"; his own unofficial build reaches 72 fps on a simple scene (SteamOS 0.3.0, SteamVR 2.17.10, Chromium 156).
  https://github.com/saphid/chromium-webxr-steam-frame . (b) one person, very fresh. Plan: store-fees-own-sales.md 1.3
  (Steam Frame APK upload): a WebXR site does not open in VR on the Frame's stock browser today; whether our TWA APK would
  is unknown (the TWA needs a WebXR browser on the device): the Steam route stays "not now".

### 5. Meta payout setup in practice (Meta forum, browser pane, 2026-10-11)
- P1. "I can't change the payout account info data.", Twin_Software_Studio, dev-dashboard board, "1 year ago" (~2025):
  "only the address and phone number can be changed. I want to change the business type from individual to company."
  No reply shown. https://communityforums.atmeta.com/discussions/dev-dashboard/i-cant-change-the-payout-account-info-data-/1256725
- P2. Forum search "payout bank tax" (24 results) lists the same pattern from others: "Filling out payout taxes ... How
  can I change from business to individuals" (JonBova, ~2025, solved); "Change tax country from USA to India – portal
  error ... cannot delete or update the existing US account" (~2025); "Can't update payout account info" (SylGames,
  ~2025, solved; per search-result text a support ticket was closed with "we provide support for Meta Store products and
  services only"); "Payout Account Tax Id Verification Error ... "Tax ID verification is temporarily unavailable"" (~2023).
  https://communityforums.atmeta.com/search?q=payout%20bank%20tax ; SylGames thread
  https://communityforums.atmeta.com/discussions/Creator_Discussion/cant-update-payout-account-info/1323002 (not opened).
  (a) several people, 2023-2025 (some are Horizon Worlds creators, not app developers). Plan: confirms
  meta-payout-ukraine-2.md part 5's reading ("Tax details cannot be changed ... register FOP first, then type the same
  name and RNOKPP"): choose individual vs FOP before the first form; a wrong entry may need Meta staff to fix by hand.
- P3. "Dev Dashboard - Unable to add payout account", Slixton (Canada), "3 years ago" (~2023, STALE), solved, 9 comments
  (replies did not load): "We need to add payout information before we can setup IAP assets".
  https://communityforums.atmeta.com/discussions/dev-dashboard/dev-dashboard---unable-to-add-payout-account/1075427 .
  (c) with Meta's add-ons page of 2026-09-28 ("Free remains selectable, so you can create a free add-on and test the
  purchase flow" before payouts, quoted in revision-1-store.md part 5). Plan: the owner's parking of payouts until
  the first paid floor is consistent with the 2026 rule; testing with free add-ons needs no bank details.

### 4. Discoverability (solo shipper, 2025)
- D2. James C. Kane, "In Tirol" (solo, PlayCanvas, made in three months, commissioned by Viverse per Voices of VR #1615),
  Meta developer blog, 2025-08-27 (written by Kane): it "launched on the new tab page for every Quest 2, Pro, 3, and 3S
  browser" under "Best of the Immersive Web", "with little-to-no marketing"; it receives "tens of thousands of MAU from
  more than 140 countries"; Escape Artist "reached more than 1 million players"; WebXR needs "better tools for
  monetization". https://developers.meta.com/horizon/blog/go-behind-the-scenes-james-c-kane-the-road-to-in-tirol/ .
  Not a Store PWA (web link). With S1/S2: (a) the same channel (Quest Browser new tab featuring) named three times by
  the same author over 2024-2025, plus Elysian's 103K MAU on the web. Plan: revision-1-store.md part 12 and the board's
  "install first": for players, the biggest door found for a free WebXR game on Quest is Meta's Browser featuring
  ("Best of the Immersive Web"), not the Store listing; how to apply for it: not found (ask Meta's web team; unverified).
  The Store listing still matters for paid floors (Meta's payments only work in the installed TWA).
- P4. "W-8BEN Form Upload Stuck – Unable to Submit Payout Information", purple.cyborg, dev-dashboard, "1 year ago"
  (~2025), solved (answer not shown): "When I upload the W-8BEN tax form, it keeps loading indefinitely"; "several other
  developers I know are experiencing the same problem"; "it is preventing me from releasing my paid app".
  https://communityforums.atmeta.com/discussions/dev-dashboard/w-8ben-form-upload-stuck-%E2%80%93-unable-to-submit-payout-information/1299231 .
  (b) one report claiming others. Plan: the payout form can block a paid release for days: fill it well before the first
  paid floor goes live (meta-payout-ukraine-2.md "For the owner").
- P5. Meta's own "Manage your financial account", dated 2026-05-13 (official, for the rule behind P1-P4): name mismatch
  between bank account and developer account: "This is the most common cause of rejected payouts"; other causes: TIN
  not matching, bad IBAN/SWIFT/routing, wrong account type; tax information: "Changes after the fact are not possible"
  (changing the tax type needs a new account). https://developers.meta.com/horizon/resources/publish-account-management-bank-tax/ .
  Plan: meta-payout-ukraine-2.md part 5 holds; add the four rejection causes to its checklist (Latin name identical on
  the bank account and in Meta; SWIFT/IBAN from the bank app; RNOKPP as TIN).

### 1. How many people use Meta's packager (a measure, npm API, read 2026-10-11)
- N1. `@meta-quest/bubblewrap-cli`: only version 1.24.1, first published 2026-05-05 (registry "created"); downloads
  722 in the year to 2026-10-10 and 329 in the month 2026-09-11..2026-10-10; Google's `@bubblewrap/cli`: 61,346 in the
  same month. https://api.npmjs.org/downloads/point/last-year/@meta-quest/bubblewrap-cli ;
  https://registry.npmjs.org/@meta-quest/bubblewrap-cli . The npm package came after Kokke's January note that the fork
  could not be run with npx (I1): that complaint is settled. Plan: revision-1-store.md part 2: very few people walk
  this path (hundreds of installs a month, CI included): expect to meet bugs first and to report them ourselves; pin
  1.24.1.
- N2. Meta's own agent skill (meta-quest/agentic-tools, hz-store-pwa/references/troubleshooting.md, last commit
  2026-09-24; Meta-authored, not a shipper): "2D app stuck on a loading screen" when `horizonOSAppMode` is "immersive" on
  a 2D app; TWA "will not launch" = Digital Asset Links failed; manifest "must be `application/manifest+json`"; the DDA
  not signed is "the most common first-time blocker" at upload; "Keystore reachable on the public host" when generated
  inside the deployable web tree. https://github.com/meta-quest/agentic-tools/blob/main/skills/hz-store-pwa/references/troubleshooting.md .
  Plan: revision-1-store.md parts 1, 4, 6: our repo is public and Pages serves the branch: the keystore must be made
  outside the repo (never under the site folder) and a test should curl that it 404s; check the manifest's content type
  on Pages; the owner signs the DDA in the Dashboard before the first upload.
- Android XR / Galaxy XR via a TWA on Google Play: a practitioner report: NOT FOUND (one search 2026-10-11).
- D3. A measure: Elysian's Store listing, read in the browser pane 2026-10-11 (US view):
  https://www.meta.com/experiences/elysian/9682662301753288/ : "Early Access", age "3+", "Release date June 26, 2025",
  "Version 4", "Space required 7.62 MB", developer "EliXR Games", and "No reviews are currently available for Elysian."
  (Search-result text of other locales showed 0 or 1 review: inconsistent.) Beside it, native titles show hundreds of
  reviews (e.g. "Hellsweeper VR 4.4 (438)"). So the best-known WebXR game has close to no Store reviews ~15 months after
  listing, while its web version had 103K MAU (D1). (b) one title; why (Early Access shelf, free, no marketing) is
  unverified. Plan: revision-1-store.md part 12 and the board: do not expect the Store listing alone to bring testers or
  buyers; whether a PWA is placed in "Early Access" by Meta or by the developer: unverified (check in the Dashboard).
  Settled by Meta's "Early Access" page, last_updated 2025-12-17: "You can enable Early Access during app submission"
  (a developer toggle); "Disabling Early Access is an irreversible action"; "Apps with Early Access are discoverable and
  searchable in Store"; disabling it "may" make an app eligible for New Releases.
  https://developers.meta.com/horizon/resources/early-access/ . Plan: revision-1-store.md: Early Access is our choice,
  one-way; leaving it on means no "New Releases" slot: decide at the first public release, not at the test channel.

### 1. Endless loading and updates: two teams' own notes (GitHub, read 2026-10-11)
- E1. iamj8chi/nes360 (an A-Frame WebXR game, "a-text", "vr-mode-ui", hosted nes360.vercel.app; TWA sideloaded, no
  Store listing stated), CLAUDE.md §9, last commit 2026-08-28, in Spanish. Quotes (translated where marked): with
  `horizonOSAppMode: "immersive"`, if the page does not request the session at once "no se dibuja un solo frame" and the
  player stays "para siempre en la pantalla de carga de Horizon OS, aunque el audio suene"; "a real bug ... Quest 3S y
  Quest 2"; fix: a component that calls `enterVR()` on `renderstart` "solo dentro del APK"; the Enter VR button of
  `vr-mode-ui` "nunca es visible" in immersive mode. Updates: "arreglos de la web se publican redeployando, sin
  reconstruir ni reinstalar el APK", but with a service worker "el primer arranque todavía sirve el HTML viejo"; clearing
  needs Settings > Apps > Clear data/cache: "Reinstalar el APK no alcanza — el TWA usa el storage del Quest Browser".
  Debug only via `adb logcat` + `chrome://inspect#devices`.
  https://github.com/iamj8chi/nes360/blob/main/CLAUDE.md . (b) one team, A-Frame like ours.
  Plan: revision-1-store.md part 3 (Meta's renderstart snippet) is confirmed by a second A-Frame user who hit the
  endless load without it on Quest 3S and Quest 2; part 11 (updates of the PWA): a service worker delays every fix by one
  launch: either no precaching of index.html or a visible "update ready" step; tell testers "close fully and relaunch".
- E2. my-pwa-apps/VRCLUB-2 docs/QUEST.md (pushed 2026-10-11, a "Quest distribution candidate", not yet uploaded):
  chose a 2D launch: "Do not configure `horizonOSAppMode: immersive`: that mode needs an auto-entry/in-world setup
  workflow"; "Do not assume a subdirectory deployment or GitHub Pages will establish the origin-root association";
  "Digital Asset Links must be served at the origin root, even if the app is deployed under `/nocturne/`"; "A 2D
  wrapper's WebXR permissions/return behaviour is a real-device release gate"; sells VR access by a server-verified
  Stripe purchase in the web build. https://github.com/my-pwa-apps/VRCLUB-2/blob/main/docs/QUEST.md . (b) one team,
  untested on the Store. Plan: matches revision-1-store.md part 4 (assetlinks at the root; our domain, not the
  /object-preview/ path); the 2D-launch fallback (F2) is what a second team picked on purpose.

### 5/6. itch.io tax form in practice (STALE, 2022)
- X1. itch.io forum "W8BEN-I is complete but still subject to 30% tax", opened 2022-06-22 (poster in Russia), 44
  replies; leafo (itch.io admin): "30% is the default withholding rate if the system is not able to match your
  information to a tax treaty"; the poster "did not provide a tax number"; "you must provide a tax identification number
  during the tax interview"; typical payout "10-12 days after opening the request"; later replies report waits of
  26-65 days. https://itch.io/t/2185827/w8ben-i-is-complete-but-still-subject-to-30-tax . (a) several in the thread.
  Plan: meta-payout-ukraine-2.md part 2 (TIN and US forms): the foreign TIN (RNOKPP) on the W-8BEN is what gets the
  treaty rate on any US store; without it, 30% is withheld (same mechanism on itch and, by Meta's financial page,
  on Meta).

### 3. Data Use Checkup (DUC) in practice (needed for purchases in a PWA, per Meta's ps-iap page)
- C1. Meta forum search "data use checkup rejected" = "106 Results" (https://communityforums.atmeta.com/search?q=data%20use%20checkup%20rejected ,
  read 2026-10-11). Recent: "My Data Use Checkup keeps getting denied for seemingly no reason.", TIgervol14Games, "1 month
  ago" (~2026-09): "My DUC keeps getting denied with no word from meta, and they are saying in support that its
  "Copyright"" (thread not opened). Older (2021-2024, STALE): "Data Checkup Stuck in Review" (9 comments), "Data Use
  Checkup ... should not be locked if you cancel a submission", "How do I unlock the In Review status of Data Use
  Checkup?", "Can't submit Data Use Checkup recertification ... list all data processors". With I1 (Kokke: DUC
  "rejected", still "required, even for test users"): (a) several over five years. Plan: revision-1-store.md part 8:
  the DUC is the slowest, least predictable gate before paid floors: submit it early, ask only for what we use
  (purchases; user id only if the ownership check needs it), list data processors (our database host) ready for
  the recertification question.

### 1b. Meta investigation, re-read 2026-10-11 (browser pane; redirects to developers.meta.com/vr/support/investigations/...)
- B1. "Oculus Browser Crashes on WebXR PWA Launch": "Investigating", "1 submission", "Created 16 days ago", 0 votes;
  "intermittently crashes when launching a WebXR Progressive Web App (PWA) built and packaged using Bubblewrap, resulting
  in an infinite loading screen that requires a headset reboot"; "the app opening successfully most of the time";
  titles are "summarized by AI from Meta". https://developers.meta.com/horizon/feedback/vr/investigations/1492297682953432/ .
  Unchanged since forums-aframe-quest.md P2. Plan: as F2.
- B2. Store review delays (STALE, pre-2024, search page only): "No response from Store Submission Team in 162 days"
  (GaimItg, ~2023); "How long is the review process for WebXR submissions?" (~2020, about the old Browser listing, 0
  replies). https://communityforums.atmeta.com/search?q=WebXR%20store%20submission . A 2025-2026 report of review time
  for a PWA: NOT FOUND. Plan: none beyond "upload early".

## Parts: status at the end (2026-10-11, ~30 searches, ~68 page reads)
1. Packaging path and failures: answered (F2, G1, E1, E2, N1, N2, T1, B1, I1). Japanese first-hand reports: not found.
2. Release channels: Meta's rules (R1); practice only pre-2024 (R2); 2026 practice not found.
3. IAP in a WebXR PWA: no developer reports revenue from Meta's IAP in a PWA (not found); setup trouble (I1, C1);
   subscriptions not possible (G2, I3).
4. Discoverability: web numbers (D1, D2, S2), Store listing measure (D3), Meta's 2026 Store changes (T2).
5. Payouts/taxes Ukraine: no first-hand Meta payout to Ukraine (not found, again); Steam analogue (U1, U3); Meta forum
   payout-form trouble (P1-P5); itch tax form (X1).
6. Other stores: itch (O1), heyVR (O2), VIVERSE (O3), PICO (O4), Steam wrapper and Steam Frame (O5, O6); Android XR via
   Play: not found.

## Not read / not reached
- Meta forum thread "Browser version 150 breaks WebXR Immersive PWA" (KasperSaxionXR): the search page shows it, the
  thread link is not exposed to the page-text tool (public, not owner-locked). Search:
  https://communityforums.atmeta.com/search?q=bubblewrap
- PICO blog "webxr-pico-heyvr": blank in fetch and browser pane: https://www.picoxr.com/global/blog/webxr-pico-heyvr
- Meta Feedback Center search for PWA investigations: asks to sign in:
  https://developers.meta.com/horizon/feedback/vr/search/?q=PWA
- Replies of the solved Meta forum payout threads (SylGames 1323002, Slixton 1075427 replies, purple.cyborg 1299231
  answer): did not load.
- Henry Allen's shipped PWA (bubblewrap issue 2): title not identified.

