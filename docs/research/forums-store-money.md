# Forums: shipping a WebXR PWA to stores, paid content, payouts outside the US (sweep of 2026-10-11)

> Kept as the helper wrote it on 11.10.2026 for the revision (objekt-files/notes/archive/docs/audit/revision.md): developers who shipped to the Horizon Store and other stores, purchases and payouts (shelf 14). Russian and Ukrainian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked and shown to the owner.


For the revision's shelf 14 ("Money, store, law"). Practitioners' reports, not rules. Every point: link, date,
short quote, weight: (a) several independent people, (b) one person, (c) contradicted. Pre-2024 = possibly stale.
Each point ends with "Plan:" = what it means for our files (docs/research/revision-1-store.md, store-fees-own-sales.md,
meta-payout-ukraine.md, meta-payout-ukraine-2.md, docs/board.md). Library: grep of papers/*.txt and docs/cards for
"horizon store|bubblewrap|trusted web activity|app lab": nothing relevant (one paper mentions an app store in passing).
Already covered in docs/research/forums-aframe-quest.md (P1-P4) and forums-other-languages.md (JA-8, JA-13): not repeated
unless new detail found.

## Parts (each gets an answer or "not found")
1. PWA/TWA packaging path 2025-2026; what got apps rejected or stuck (endless loading, manifest, assetlinks, permissions, target API)
   1a. Meta developer forum threads (communityforums.atmeta.com)
   1b. Meta bug/investigation pages
   1c. GitHub issues: meta-quest/bubblewrap, GoogleChromeLabs/bubblewrap (Quest-related)
   1d. Teams that shipped WebXR titles to the Horizon Store: who, which title, what they wrote
2. Release channels in practice (ALPHA/BETA, testers by email, invite links)
3. In-app purchases for a web app on the Horizon Store: what works, fees, who ships it
4. Discoverability: did people find the game (numbers)
5. Payouts and taxes for a solo dev in Ukraine or nearby (Meta, Payoneer, FOP, W-8BEN) - Ukrainian/Russian sources
6. Other stores for the same build: PICO (PWA), Steam via wrappers, itch.io, own site - what each took
   6a. PICO developer forum / PICO WebXR PWA reports
   6b. Steam wrappers (Electron/NW.js/Tauri) for WebXR
   6c. itch.io for WebXR
   6d. own site sales

## Findings (appended as found)

### 1a. Meta developer forum (communityforums.atmeta.com; WebFetch and curl get 403, read in the browser pane)
- F1. The whole forum holds ONE thread on Bubblewrap: forum search "bubblewrap" = "1 Result"
  (https://communityforums.atmeta.com/search?q=bubblewrap, read 2026-10-11). Search "PWA" = "18 Results", most 2-4 years old.
  Weight: a measure, not a report. Plan: the Meta forum is not where WebXR shippers talk; revision-1-store.md should not
  count on it for help; Meta's investigations page and GitHub issues are the channels.
- F2. "Browser version 150 breaks WebXR Immersive PWA", KasperSaxionXR, board Questions and Discussions, "1 month ago"
  (~Sept 2026), 53 views, 0 comments. Snippet (search page, the thread itself not opened: its link is not exposed in the
  page text): "The current browser: 150.0.0.39.30.1038228660 breaks an immersive PWA packaged with Meta's Bubblewrap fork."
  (https://communityforums.atmeta.com/search?q=Browser%20version%20150%20breaks%20WebXR%20Immersive%20PWA). (b) one
  person (an XR lab account, Saxion = a Dutch university, by name only), unanswered. With the open Meta investigation
  (forums-aframe-quest.md P2, ~2026-09-25) and bubblewrap issue 24 (Quest 2): three separate reports in 2026 that an
  immersive TWA can fail to start. Plan: revision-1-store.md part 2 "open risk" grows from Quest 2 only to any browser
  update; the 2D-launch fallback (a page with an enter-VR button) is worth keeping ready.
- F3. Older PWA threads (pre-2024, STALE): "Cannot create a PWA application", arnolem, "4 years ago", 13 comments;
  "Not able to upload a build to the app - PWA", velidd, 4 years ago: "APK has no main activity defined in the manifest";
  "ovr-platform-util create-pwa doesn't output the apk", 4 years ago (same search page). The ovr-platform-util route is
  the old one, replaced by Bubblewrap. Plan: none (stale path).

### 1c. GitHub issues, meta-quest/bubblewrap (gh issue list, all states, read 2026-10-11: only 3 issues exist: 2, 24, 25)
- G1. Issue 25, textoo, 2026-06-09, open, 0 comments: "It is currently impossible to expose the Meta Horizon Platform
  SDK to a PWA's JavaScript context from a Bubblewrap-packaged app running on Meta Quest, because `com.oculus.browser`
  does not implement `CustomTabsService`"; lists as blocked `Users.getLoggedInUser()`, leaderboards, achievements,
  `IAP.getViewerPurchases()`; "Quest's TWA implementation does not fall back to `WebViewFallbackActivity`".
  https://github.com/meta-quest/bubblewrap/issues/25 . (b) one team, Quest 3. Note: this is about bridging the native
  Android Platform SDK; Meta's own web pages document a Digital Goods API path for purchases (revision-1-store.md part 5),
  so purchases themselves are not shown blocked; leaderboards/achievements for a PWA: no web route named in the issue.
  Plan: revision-1-store.md part 5 relies on `getLoggedInUserId()` for the server ownership check: verify on a real
  build that it exists in the TWA before writing the floor loader around it (unverified both ways).
- G2. Issue 2, Henry Allen (hmallen99), 2025-09-24, open: "We have an immersive PWA that has shipped on the quest store.
  We want to offer subscriptions for paid features"; "+1 - Subscriptions would make a big difference for us too"
  (den-mko, 2025-11-12). https://github.com/meta-quest/bubblewrap/issues/2 . (a) two teams; matches Meta's doc
  "Subscriptions are not currently supported". Plan: our durable per-floor add-ons fit; no subscription model
  (store-fees-own-sales.md: the 15% subscription rate after month 4 is not reachable for a PWA).
  Who: den-mko = Denis Mikhaylenko, GitHub company "Stemmy" (gh api users/den-mko); Henry Allen: no title named in the
  issue (gh api: no company); the shipped PWA is unidentified.

### 1d / 4. Teams that shipped WebXR titles; discoverability
- S1. Paradowski (agency), "Escape Artist" (Wonderland Engine, free on the web at esc.art, not a Store PWA). Voices of VR
  #1614, published 2025-08-02, recorded 2024-03-12 (STALE-ish), James C. Kane (technical director): the Quest Browser's
  new tab page is seen by "hundreds of thousands of people ... every day" and "they are featuring community content on
  that page"; AJ: "there's like not a lot of monetization ways". https://voicesofvr.com/?p=15405 . (b) one team.
  Plan: discoverability for a web title on Quest came from Meta featuring it in the Browser, not from a store; worth a
  line in revision-1-store.md part 12 (ask Meta's Browser team for a feature at launch of the free floor; unverified that
  this programme still exists in 2026).
- S2. Same Kane, Voices of VR #1615, recorded 2025-06-11 at AWE, published 2025-08-02: Escape Artist "had a million
  players in 2024"; web "monetization has been an issue to this point"; Meta "opening up PWA publishing through their app
  store" but "you're still having to go through the app store"; PICO "pretty proactive about WebXR" but "not available
  in the U.S."; Kane "went solo in November" and joined Viverse (HTC) as "creator in residence"; Viverse creator programme:
  "You own all the IP ... Vyverse is just a publishing contract". Revenue share not discussed.
  https://voicesofvr.com/1615-viverses-webxr-publishing-strategy-with-james-c-kane-in-tirol-game/ . (b) one person, but
  the most experienced WebXR shipper found. Plan: a free web game can reach 1M players on Quest through the browser;
  the money is the hard part: store-fees-own-sales.md should list Viverse as a candidate channel (terms not read: unverified).
- S3. Meta blog "Reach New Audiences by bringing your 2D Apps to the Meta Horizon Store", 2024-09-25: "WebXR apps are
  also available via the Quest browser or on the Meta Horizon Store as a packaged PWA", pointing to "Elysian and Escape
  Artist"; "over 60% of Meta Quest users now using the browser and 2D panels on Meta Quest 3".
  https://developers.meta.com/vr/blog/building-2d-apps-on-the-meta-horizon-store/ . Vendor claim, not a shipper.

### 3. In-app purchases in a WebXR PWA (practice)
- I1. Timmy Kokke ("Sorskoot", GitHub bio "Senior XR Solutions Architect ... WebXR"), blog draft "TWA On Quest", dated
  2026-01-07, last commit 2026-03-24 ("cleaning and updating"), Wonderland Engine project + Meta's Bubblewrap, sideloaded
  with MQDH and a Dashboard test user. https://github.com/sorskoot/sorskoot-website/blob/main/content/blog/drafts/2026-01-07-TWA-on-Quest.md
  (read via gh api). Quotes: Meta's fork "moved the code to a subfolder which causes npx to now work with it directly"
  (he made his own npm packages); used Node 21.7.3; purchase call gave "Unable to download payment manifest
  "https://quest.meta.com/billing". HTTP 404 Not Found."; `getDetails` gave "Uncaught OperationError:
  clientAppUnavailable"; "My app does not have the 'Data Use Checkup' cleared. But, according to the documentation a
  test user should not need this"; his DUC request "was rejected"; after a new Dashboard app the items showed, but
  "the "data use checkup" is still required, even for test users"; `getLoggedInUserId()` "returns '5'" for both his test
  and his main user ("Seems odd"). Unpublished draft, no resolution written. (b) one experienced person.
  Plan: revision-1-store.md part 5 and part 8: the Data Use Checkup is on the critical path even for testing purchases
  (do it first, expect a rejection round); sideloaded testing of purchases may fail with the 404 manifest error, so
  test purchases through the ALPHA channel; do not build the floor ownership check on `getLoggedInUserId()` until a real
  build returns a real id (it returned a constant here).
- I2. Wonderland Engine's UpSDK, package provider-digital-goods README (repo pushed 2026-03-05): "The digital goods API
  is only available when the app is running from an APK. In it runs from the browser, requesting the service will throw
  an error: `Uncaught OperationError: unsupported context`." The same provider lists Google (play.google.com/billing)
  and Microsoft (store.microsoft.com/billing) billing URLs.
  https://github.com/WonderlandEngine/upsdk/blob/main/packages/provider-digital-goods/README.md . (b) one engine vendor.
  Plan: one paid-floor code path can serve Meta, Google Play and the Microsoft Store by changing only the billing URL
  (store-fees-own-sales.md 1.4, 1.8); in the plain browser the call fails, so the web version needs its own branch
  (own-site sales or "free in browser").
- I3. patraldo-dev (Cloudflare/SvelteKit WebXR side project "ambientx-webxr"), session archive dated 2026-07-24: built
  Payment Request + server verification (`verify_entitlement`, `viewer_purchases`, `consume_entitlement`); "Meta doesn't
  support subscriptions for WebXR PWAs ... Tiers are sold as 30-day durable passes with server-side expiration tracking."
  https://github.com/patraldo-dev/03-digital-pp/blob/main/conversations/2026-07-24-meta-iap-membership-cost-controls-security.md .
  Low weight: written with an AI, no live Store purchase reported. Plan: none (we sell durable floors, no expiry).

### 4. Discoverability (more)
- D1. Felix Zhang (Elysian): Polys profile: Elysian had "a monthly active user base of over 103,000 as of December 31,
  2023" (web only then; the Store listing came 2025-08); he "developed the Immersive Web Emulator" at Meta Reality Labs.
  https://thepolys.com/profile/felix-zhang/ (undated award profile, ~2024). (b) one title. Confirms the Elysian author
  = the IWER author (forums-aframe-quest.md P3 called it "plausible, unverified"). Plan: the best-known WebXR game reached
  its players on the web first; the Store was "a secondary distribution channel" (UploadVR 2025-08-07). For
  revision-1-store.md part 12: the web link is the main door, the Store listing the second.

### 2. Release channels in practice
- R1. Meta's own page "Add users to a release channel", last updated 2026-04-29 (official, for the rules):
  "The Channel User Limit is set to 200 by default" (raisable to 2,500; the page says that switch is permanent and affects
  future Data Use Checkups); "Users must be at least 18 years of age to be invited to private channels"; "The invite URL
  page will be disabled 90 days after your latest build upload date to the given channel".
  https://developers.meta.com/horizon/resources/publish-release-channels-add-users/ . Plan: board's 5-10 Telegram testers
  fit the default 200; every tester must be 18+ (matches our 18+ recording rule); upload a build at least every 90 days
  or the invite link dies; never switch on the 2,500 limit casually (it is permanent and touches the DUC).
- R2. Practice: ThoughtfishConny (MHCP partner), Meta forum, "3 years ago" (~2023, STALE): invitees "receive the invite
  and can accept it, and the app will be shown in their Preview App. However, they can not install it ... (it is saying
  "Whooops... Something went wrong")"; "Throwing them out of the User list for the Release Channel and reinviting them
  usually solves the issue". https://communityforums.atmeta.com/discussions/dev-quest/bug-inviting-external-people-to-the-release-channels-for-my-meta-quest-2-app-doe/1079543
  (read in browser pane). Search results list more threads of the same kind (2018-2023: "Channel users not getting
  invitations", "Alpha Channel Apps not showing on tester devices", "users not getting opt in email"): (a) several,
  but all pre-2024 and not opened by me except this one. The page also says: "This forum is archived and read-only. To
  submit a forum post, please visit our new Developer Forum." Plan: board's tester step: prepare a one-line fix for
  testers ("remove and re-invite", or send the invite URL instead of email); 2026 state unverified.
- R3. "Channel invite limits before launch", kapehorn.meta, Meta forum, "6 months ago" (~2026-04), 1 comment; snippet:
  "...000 users. Is there any way to: Increase this limit? Add more channels? Invite more users before launch?"
  (search page https://communityforums.atmeta.com/search?q=Channel%20invite%20limits%20before%20launch; thread not opened).
  (b). Plan: irrelevant at our 5-10 testers.

### 5. Payouts and taxes, Ukraine (Ukrainian/Russian sources)
- U0. A first-hand report of a Meta Horizon Store (Oculus) payout to Ukraine: NOT FOUND again (searches uk + ru,
  2026-10-11; same result as meta-payout-ukraine-2.md part 4). Nearest analogue is Steam.
- U1. GameDev DOU, "(Russian or Ukrainian text: see the source) Steam (Russian or Ukrainian text: see the source) Ruslan Kumekov (writer,
  quotes developers): "10% — withholding tax (Russian or Ukrainian text: see the source) W-8BEN"
  (wrong form = 30%); "(Russian or Ukrainian text: see the source) Sole Proprietorship. (Russian or Ukrainian text: see the source) VISA (Russian or Ukrainian text: see the source) Mastercard) (Russian or Ukrainian text: see the source) Monobank — (Russian or Ukrainian text: see the source) payouts by SWIFT (details from Privat24 or Monobank); "(Russian or Ukrainian text: see the source) % (Russian or Ukrainian text: see the source) +1% (Russian or Ukrainian text: see the source) % (Russian or Ukrainian text: see the source) https://gamedev.dou.ua/articles/steam-game-release-guide/ . (a) a compiled
  guide from several Ukrainian developers (Steam, not Meta). Plan: meta-payout-ukraine-2.md part 5 matches it (W-8BEN,
  10%; FOP 5% + 1% levy; individual 18% + levy, 5% levy there); new
  practical items for the payout step: an English bank statement for address checks, a USD account in his own Latin
  name, the SWIFT details from the bank app before filling Meta's form.
- U2. Same guide, visibility (Steam, not VR): "(Russian or Ukrainian text: see the source) %
  (Russian or Ukrainian text: see the source) Steam (Russian or Ukrainian text: see the source) $100" (citing Gamalytic). Same link. Plan: store-fees-own-sales.md 1.3 (Steam):
  a Steam listing alone does not bring players.
- U3. GameDev DOU news, 2022-03-18 (STALE): Steam blocked payouts to some Ukrainian banks (Raiffeisen, Ukrsibbank;
  some Privat and mono clients too); Valve: its bank needs "(Russian or Ukrainian text: see the source) https://gamedev.dou.ua/news/steam-blocks-payments-to-ukrainians/ ; resolution 2022-04-21 is in
  meta-payout-ukraine-2.md part 4 (mezha.ua). Plan: before Meta's first payout, have a second bank ready (the owner's
  bank choice), and expect Meta's bank may ask for an intermediary bank (unverified for Meta).
- U4. GameDev DOU "(Russian or Ukrainian text: see the source) Payoneer, (Russian or Ukrainian text: see the source) opened 2024-04-30 (Natali, Playvalve): no first-hand store payout;
  replies split on whether money left on Payoneer is FOP income (Serge Loboda 2024-04-30: does not have to be withdrawn;
  (Russian or Ukrainian text: see the source) the tax office may tax it as PIT). https://gamedev.dou.ua/forums/topic/48566/ . (c)
  contradicted. Plan: if Payoneer is ever used, withdraw everything to the FOP account (the cautious reading).

### 3/4/6. Money from WebXR games in practice (the strongest shipper report found)
- M1. Florian Isikci (founder, dmnshd; co-founder of Construct Arcade, "the first WebXR game platform", now shut; titles
  Archery Evolution: Time Trials, Hoverfit, Geobeat), "My Lessons in Monetizing WebXR Games", 2026-05-25.
  https://dmnshd.gg/blog/webxr-monetization . Numbers (his): Construct Arcade about $300 of IAP revenue over five years
  with "multiple millions of users"; Archery Evolution 2.5M plays (2022-2026); dmnshd.gg shop, two months old: one $9.99
  sale, 0 MRR; display ads "did make money" (peaks over 5,000 views a day); in-scene ads (Borellion) "made a profitable
  business". Quotes: "entering card details inside a headset is miserable, so you end up sending people to their phone
  with a QR code"; "Every extra step in that chain costs you buyers"; "on a free browser game, willingness to pay is just
  lower to begin with, as players come in for free and expect it to be free"; "Meta now lets you publish WebXR content
  to the Horizon Store as PWAs" (no own Store result given); Geobeat "just launched on YouTube Playables"; Viverse named
  as an option, no terms. Advice: keep two other channels alive; own the audience (Discord); publish everywhere.
  (b) one team, but the most numbers found; no Horizon Store sales figure.
  Plan: board "first floor free then paid packs" and store-fees-own-sales.md 2 (own-site sales via a merchant of record):
  card entry in the headset is the known weak point: our own-site checkout should hand off to the phone (QR) or sell
  in Meta's store where payment is one click; expect low conversion from free web players. Viverse and YouTube
  Playables are two more web channels not in store-fees-own-sales.md.

### 1 (Japanese). First-hand Japanese reports of a WebXR PWA on the Horizon Store (review, rejection): NOT FOUND
  (two Japanese searches 2026-10-11; only Meta's ja docs and Mogura VR's news of the IAP change). Same as
  forums-other-languages.md JA-13.

### 6. Other stores for the same build
- O1. itch.io: the WebXR iframe block was fixed in 2020 (STALE but settled): issue "WebXR games do not function
  correctly because of xr-spatial-tracking feature policy", msub2, 2020-10-25; bferguson3: "Access to the feature "xr"
  is disallowed by feature policy"; leafo (itch.io) 2020-10-26: "I've added `xr-spatial-tracking` to the allow list";
  De-Panther: "Thanks. It works :)". https://github.com/itchio/itch.io/issues/1117 . (a) three people + itch's owner.
  Plan: store-fees-own-sales.md 1.7 stands (HTML5 games on itch take donations only, so the free floor can sit there as
  a playable page; paid floors cannot be sold as a browser game there); Quest-in-itch iframe not tested by me.
- O2. heyVR.io (WebXR game portal, "the first Web App to be launched on the PICO Store" per PICO's own blog, undated:
  https://www.picoxr.com/global/blog/explore-heyvr-pico-store, browser pane). heyVR docs: the developer uploads a zip
  build that heyVR hosts and serves "inside an iframe element"; builds "will be reviewed by the administrators"; the
  dashboard will show "in-game sales (coming soon)" (https://docs.heyvr.io/en/developers ;
  https://docs.heyvr.io/en/developers/how-it-works , read 2026-10-11). Fee: not found. (b) vendor docs.
  Plan: heyVR means a second copy of our files on their host (our privacy/consent and data paths would run inside their
  iframe): a later option, not "the same build"; PICO reached through heyVR without our own PICO listing.
- O3. HTC VIVERSE Partner Program (vendor page, undated, "© 2026 HTC CORPORATION"): "pays $2 per 1K unique plays to
  approved creators" (play of at least 30 seconds; repeat plays up to $12 per 1,000 viewers per 30 days); cash out at
  "$50 USD", processed on the 5th; creators 18+, "non-restricted country" (list not shown); payout method and tax forms
  not stated. https://create.viverse.com/partner . With S2 (Kane, a solo WebXR developer, became Viverse's "creator in
  residence") and M1 (Isikci names Viverse). Practitioner payout reports from Viverse: not found.
  Plan: store-fees-own-sales.md 1.8 can replace "search snippets only" for VIVERSE with this page; at $2 per 1,000
  plays a free floor earns little (1M plays = $2,000-12,000 by their table); Ukraine eligibility unverified.


Continued in [forums-store-money-2.md](forums-store-money-2.md).
