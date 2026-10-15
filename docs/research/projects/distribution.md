# Where the game can be installed or played, worldwide

Research for "You are the object", 9 Oct 2026, on the owner's question: install first, the site
second, every platform in the world. Our game is a WebXR web app; the question per platform is
whether the same code can be installed, listed or sold there, and what it needs. Marks:
**[read]** the page was opened and the quote is in it; **[snippet]** seen only in a search summary;
**[unverified]** not confirmed. Gathered by eleven narrow research runs and the built-in browser
(the Pico blog, which a plain fetch returned blank).

## The platforms

| Platform | How our web game gets there | Paid | State |
|---|---|---|---|
| Meta Horizon Store (Quest) | wrapped as a signed APK (a Trusted Web Activity) with Meta's `@meta-quest/bubblewrap-cli`, `horizonOSAppMode: "immersive"`, uploaded with `ovr-platform-util`; web fixes reach the installed app on its next launch, the APK is rebuilt only for its id, name, icon, version or mode | in-app purchases through the installed app (Digital Goods API, a real Horizon app id) | **[read]** Meta's own guide, the meta-vr plugin's skill `hz-store-pwa`: "package as a signed Meta VR APK with `@meta-quest/bubblewrap-cli`"; "Web-only fixes need only a Vercel redeploy — the installed TWA picks them up on the next launch" |
| Quest Browser new-tab page | a WebXR site submitted through Meta's form (fb.me/ntp) | no | **[read]** "it is promoted to the top of the new tab page shelf for an initial four-week period" (developers.meta.com/horizon/documentation/web/browser-new-tab/, updated 2026-07-22) |
| PICO Store (worldwide, incl. Japan, Korea) | the site as a PWA (a web app manifest), its URL submitted through the PICO Developer Portal, reviewed, then listed; no APK | not stated | **[read]** "developers can submit the URL through the PICO Developer Portal… Once approved, the PWA will be published in the PICO Store, accessible to users worldwide" (picoxr.com/sg/blog/webxr-pico-heyvr); store terms: "Registration of your account shall be subject to our approval" (developer.picoxr.com/terms/) |
| SideQuest (Quest, sideloading) | an APK; a WebXR list existed in 2020 | sells nothing itself, takes no cut; paid sales go through Meta | **[read]** "no plans to monetize content"; "more than two million monthly active users (as of May 2022)" (mixed-news.com); listing terms behind a login **[unverified]** |
| heyVR.io (WebXR store) | a zip of the web build, free developer account, review, no exclusivity | "in-game content sales and advertisements"; sales tracking "(coming soon)" | **[read]** docs.heyvr.io/developers/publish-your-game; developer.playcanvas.com hosting-heyvr |
| HTC VIVERSE (web XR platform) | a zip of the WebXR project through VIVERSE Studio | a Partner Program paying by views and time, non-exclusive | **[snippet]** news.viverse.com; businesswire 12 Jun 2025 |
| HTC Viveport | PC and Mobile (APK) titles; web apps not found | — | **[unverified]**, alive in 2026 not confirmed |
| itch.io | a zip with `index.html`, played in the browser in an iframe; WebXR tag, 109 games | browser games take donations only; a price needs a download | **[read]** "Currently all HTML5 games on itch.io are set up to only take payments as donations"; default share 10 % (itch.io/docs/creators); whether its iframe lets VR start today **[unverified]** |
| Steam (PC VR) | no shipped WebXR game confirmed; Electron needs a rebuild with OpenXR, Tauri reported to work | Steam Direct | **[read]** Babylon.js forum 2024: "you must recompile Electron linking the OpenXR runtime library"; Steam's own terms not searched |
| Google Android XR (Galaxy XR) | Chrome runs WebXR; the Play route for a web app (TWA) not documented | — | **[read]** "Chrome on Android XR supports WebXR" (developer.android.com/develop/xr/web, 2026-08-31); immersive-vr not named **[unverified]** |
| Apple Vision Pro | Safari runs WebXR immersive-vr since visionOS 2; the App Store refuses a repackaged website | web only | **[read]** "Safari 18.0 for visionOS 2 adds support for immersive-vr sessions with WebXR" (webkit.org); guideline 4.2: "beyond a repackaged website" |
| VR arcades and clubs | each game licensed per venue; SpringboardVR (now with SynthesisVR, Deploy Reality) takes games by application and pays per minute | per minute | **[read]** Meta commercial terms 5.2: operators "separately obtain any necessary permissions or licenses"; springboardvr.com "pay-per-minute commercial licensing"; Meta stopped selling Horizon managed services on 20 Feb 2026 |
| Web portals (CrazyGames, Poki, Newgrounds) | HTML5 games; VR not mentioned on their pages | ads (CrazyGames), 50/50 on players Poki brings, web exclusivity asked | **[read]** docs.crazygames.com, developers.poki.com |
| Russia and CIS | no store found that takes VR games; Yandex Games: phones, desktops, TVs, payments only through its SDK; RuStore: Android phones, a company or a registered sole proprietor needed from 1 Feb 2026 | — | **[read]** yandex.com/dev/games requirements (2026-08-18); RuStore **[snippet]** |
| Japan, Korea | the PICO Store and Apple; Japanese publishers (MyDearest) help third parties; Korean U+VR and STOVE VR status unknown | — | **[read]** picoxr.com/jp "PICOストア"; uploadvr.com MyDearest; Korea **[unverified]** |
| China (mainland) | the PICO China store: an approved organisation account, the real identity and a Chinese company code "if any", a Chinese privacy policy, games tied to real-name checks and the anti-addiction system; a separate overseas PICO store; iQIYI's Qiyu stalled in 2023 | — | **[read]** developer-cn.picoxr.com/en/terms (V1.3, 2024-11-05): "需依法接入实名认证、防沉迷系统"; news.pedaily.cn 2023-08-06; web apps there **[unverified]** |

## What to decide now, while it is cheap

- **One domain for good.** A TWA (Meta) and a PWA (Pico) are tied to the site's domain (Meta: Digital
  Asset Links at `/.well-known/assetlinks.json`), so youaretheobject.com stays the game's address.
- **The signing key.** Meta's guide: "The signing key is permanent — every update must reuse the same
  keystore"; a lost key means a new app entry. It is made once, kept off the site, backed up.
- **A web app manifest and icons** on the site: both stores need them.
- **Payments inside the installed app**, not in the browser (the Quest Browser has no purchases; the
  installed TWA has the Digital Goods API): the paid floors are built on that.
- **One headset is many people** (clubs): data and consent are per person, not per device (plan 4.2).
- **Install first, the site second** is the owner's choice (9.10); the same code serves both.

Not yet asked: Steam's own requirements; Pico's review rules for web apps (behind its console);
SideQuest's listing guide (login); whether China's PICO store takes web apps or demands a game licence.
