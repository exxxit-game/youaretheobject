# Revision 1 of 5: delivery and the Meta Horizon Store

Tool revision for the owner, 10 Oct 2026: is the way the game reaches players (host, package, store, payments,
paperwork) the smartest choice now, while one corridor and one room exist, before ten floors of nine rooms are
built on it. Marks: **[read]** the page or file was opened and the quote is in it; **[skill]** the meta-vr plugin's
skill file (Meta's helper, not a Meta page); **[unverified]** not confirmed; **[mine]** my inference or estimate.
Meta pages were fetched with `metavr docs fetch` (their dates are the pages' own `last_updated`). Nothing was
installed or built; no Meta command that changes the machine was run.

## The answer in short
The route is right and Meta documents it end to end: our A-Frame site, packaged by Meta's Bubblewrap as an
immersive TWA, sold as floor add-ons through the Digital Goods API, hosted on GitHub Pages. Keep all four.
What must change now, while it is cheap: publish the site by a GitHub Actions workflow that ships only the game
files (today Pages also serves CLAUDE.md and docs/, and Jekyll drops `.well-known`); decide who can open a paid
floor before floor 2 exists; make the signing key once, with two backups; and try one real upload early, because
Meta's own Bubblewrap targets Android API 32 while new apps must target 34. Two board worries are settled by
Meta's pages: the age API exists for WebXR PWAs, and the comfort rating judges the default experience.

## 1. Host: GitHub Pages with our own domain
- **Now** (gh api and curl, 10 Oct) **[read]**: `"build_type":"legacy"`, `"source":{"branch":"main","path":"/"}`,
  `"cname":"youaretheobject.com"`, `"https_enforced":true`. The live site serves the whole branch: `/CLAUDE.md` and
  `/docs/roadmap.md` return 200; `/privacy.html` 404 (main is older than the branch); `/manifest.webmanifest` 404 (no
  manifest exists). Headers: `Cache-Control: max-age=600`. The test copy (tools/publish-preview.mjs) already ships
  only the PUBLIC list with `.nojekyll`. Game files today: vendor 1.7 MB, src 3.9 MB (du).
- **Meta's bar**: "Host your web experience", 2026-09-23, https://developers.meta.com/horizon/documentation/web/web-hosting/
  **[read]**: "Serve the site over HTTPS from a publicly accessible origin"; it names "**GitHub Pages** publishes the
  static build from a repository, using a GitHub Actions workflow" and Vercel (the skill `hz-store-pwa` assumes Vercel
  **[skill]**).
- **GitHub**: "GitHub Actions is now the recommended approach for deploying and automating GitHub Pages sites"
  (https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) **[read]**.
  Limits (https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) **[read]**: site "no
  larger than 1 GB"; "a *soft* bandwidth limit of 100 GB per month"; not for a site "primarily directed at either
  facilitating commercial transactions" (our payments run inside Meta's store, not on the site **[mine]**). The terms
  also say Pages is not "a free web hosting service to run your online business" and is meant "primarily as a showcase
  for personal and organizational projects" (https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features,
  read 10.10) **[read]**: the site that runs a paid game is that business, so Meta's checkout alone does not make Pages
  allowed **[not verified]**. Pages holds while every floor is free (testers, floor 1); before the first paid floor,
  GitHub's written yes or a host whose terms allow commercial use (the domain moves by a DNS change).
- **Verdict: keep the host, change how it publishes**: an Actions workflow that uploads only the game files (the same
  PUBLIC list as the test copy). Why: Meta names exactly this; it stops publishing notes; it is where `.well-known`
  and a manifest get served correctly (part 4). The domain, not the host, is what the Store app is tied to, so the
  host can still move later by a DNS change **[mine]**.
- **Cost**: now an hour; after five rooms the same hour, but every week until then the notes stay public.
  100 GB a month is about 18,000 full first loads of today's 5.6 MB **[mine, arithmetic]**: watch it as floors grow.
- **Owner**: changing how main publishes is a change to the live site: his word.

## 2. Package: Meta's Bubblewrap, immersive TWA
- **Meta** "Package a PWA for Meta Quest", 2026-07-22, https://developers.meta.com/horizon/documentation/web/pwa-packaging/
  **[read]**: verified with `@meta-quest/bubblewrap-cli` "version `1.24.1`", "Node.js 18 or later"; create the app in
  the Dashboard first ("The Meta Horizon Application ID is required if a WebXR PWA uses in-app purchases"); "Enable
  Horizon Billing only for a WebXR PWA that uses in-app purchases"; "Every update to an existing Store app must use the
  same package identifier". App mode: "`immersive` for an app that launches directly into WebXR".
- **Conflict to test first.** Meta blog, posted 2025-11-24, updated 2026-02-06,
  https://developers.meta.com/horizon/blog/meta-quest-apps-android-14-march-1 **[read]**: "now only apps created in the
  Developer Dashboard after March 1, 2026 will have this requirement" (target API 34). Meta's Bubblewrap template
  (github.com/meta-quest/bubblewrap, `packages/core/template_project/app/build.gradle`, pushed 2026-09-16) **[read]**:
  Quest builds get `targetSdkVersion 32`. Our app will be created after March 2026, so an upload may be refused
  **[unverified: PWAs may be treated differently; no upload tried]**.
- **Read again 10.10** **[read]**: the blog says "minSdkVersion will not be impacted and can still use API level 32" and
  "API level 34 will be enforced during binary upload"; it names no PWA or TWA. The template (path
  `bubblewrap/packages/core/template_project/app/build.gradle`) holds Quest builds at `compileSdkVersion 32` /
  `targetSdkVersion 32` and every other build at 36 / 35 with the same helper library, so the wrapper's own code
  already runs under newer rules elsewhere **[mine]**; the generated project is plain Gradle, so 34 is one line in it.
  What can be checked before the Dashboard and the real key: a build at 34 with a throwaway test key, sideloaded on
  the owner's Quest (needs JDK 17 and the Android SDK on the laptop: his word). Only Meta's upload check stays.
- **Open risk for Quest 2** **[read]**: github.com/meta-quest/bubblewrap/issues/24 (open since 2026-03-29, no reply):
  an `immersive` TWA on a Quest 2 (Android 14 firmware, Quest Browser 144) never renders, the loading dots stay, then
  "App name unavailable"; the same TWA in `2D` mode works. Quest 2 is the weakest headset the game keeps, and our
  checks run on a Quest 3, so this needs a Quest 2 or a fallback (a 2D launch into a page with an enter-VR button).
- **Who ships this way**: UploadVR, 7 Aug 2025, https://uploadvr.com/elysian-is-the-first-webxr-game-on-quests-horizon-store
  **[read]**: Elysian, "the first WebXR game" on the Store, packaged with "Google's Bubblewrap", "a fully free game".
  UploadVR, 26 Jun 2025, https://www.uploadvr.com/webxr-apps-on-quest-meta-horizon-store-can-now-use-in-app-payments/
  **[read]**: "WebXR apps packaged as PWAs on the Meta Horizon Store can now use in-app payments". A paid WebXR app
  with add-ons on the Store: **not found** (we may be among the first; the risk is real).
- **Verdict: keep.** No other route puts a web game in the Store with Meta's payments. **Cost**: the package is a
  thin shell; it does not grow with rooms. **Owner**: creates the app in the Dashboard (gets the App ID).

## 3. Start in VR; consent, start and privacy inside VR
- **Meta** "Getting Started with WebXR PWAs", 2026-07-22, https://developers.meta.com/horizon/documentation/web/pwa-webxr/
  **[read]**: "launching directly into immersive mode right after launch without a 2D landing page"; A-Frame code:
  `if (window.getDigitalGoodsService !== undefined)` then `scene.enterVR()` on `renderstart`; "clicking the PWA app icon
  is considered user action".
- **Now** (src/, read): no `getDigitalGoodsService` check yet; `enterVR` only in src/app/left-early.js. Consent is
  already a sheet in VR (src/app/consent.js); it names "youaretheobject.com/privacy" as text, no link. Pages serves the
  extensionless address (`object-preview/privacy` 200, curl).
- **Scope**: "In an `immersive` package, an out-of-scope link opens in Meta Quest Browser"; "Keep `start_url` within
  `scope`" ("Get started with PWA packaging", 2026-09-23, https://developers.meta.com/horizon/documentation/web/pwa-overview-gs/)
  **[read]**. Manifest: `scope` "/", privacy page inside it.
- **Verdict: add** Meta's snippet once in the app start, and keep every word of consent and start inside VR (already
  the design). **Cost**: now a few lines; after five rooms the same, unless a room grows its own 2D page (rule: none).

## 4. `/.well-known/assetlinks.json` returns 404
- **Cause 1** **[read]**: the file and folder do not exist in the repo. **Cause 2** **[read]**: the branch build runs
  Jekyll, and "By default, Jekyll doesn't build files or folders that: Start with `_`, `.`, or `#`" (GitHub, link in
  part 1). GitHub on `.nojekyll`: external builds "typically include a `.nojekyll` file" and then Pages "will detect the
  state that the branch does not need a build step"
  (https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
  **[read]**. So the board's ".nojekyll" is right for a branch build.
- **Trap on the Actions route** **[read]**: `actions/upload-pages-artifact` v4.0.0 (2025-08-14) "hidden files
  (specifically dotfiles) will not be included in the artifact"; v5.0.0 (2026-04-10) adds `include-hidden-files`
  (default `false`) (https://github.com/actions/upload-pages-artifact, README and releases). The workflow must set it
  to `true`, and a test must curl the file after each deploy.
- **Why it matters**: "An immersive PWA does not launch if this verification fails" (pwa-packaging) **[read]**. The file
  belongs at the origin root, so the test copy under `/object-preview/` cannot carry it **[mine]**: Store builds point at
  youaretheobject.com. One file can list several packages ("can authorize more than one Android package").
- **Verdict: add** (with part 1). **Cost**: minutes now; never grows.

## 5. Paid floors: Digital Goods API inside the Horizon TWA
- **Meta** "In-app purchases in WebXR PWAs", 2026-07-22, https://developers.meta.com/horizon/documentation/web/ps-iap/
  **[read]**: "Meta Horizon OS currently supports in-app purchases through the Digital Goods API only in WebXR PWAs.
  Subscriptions are not currently supported."; only when "installed from the Meta Horizon Store (including ALPHA and
  BETA channels)"; sideload test via `#enable-debug-for-store-billing` in the Browser's flags; flow:
  `getDigitalGoodsService('https://quest.meta.com/billing')`, `getDetails`, a `PaymentRequest`, `listPurchases()`;
  "There is no function to get a list of item IDs"; "Meta Horizon Store doesn't support purchase history"; and "This is
  a Platform SDK feature requiring Data Use Checkup".
- **Add-ons** "Setting Up Add-ons", 2026-09-28, https://developers.meta.com/horizon/resources/add-ons-setup/ **[read]**:
  a SKU "can only contain alphanumeric characters, periods, dashes, and underscores"; prices in USD, "automatically
  converted"; before payouts are set up "**Free** remains selectable, so you can create a free add-on and test the
  purchase flow". Test users buy "without using real money" ("Testing Add-ons",
  https://developers.meta.com/horizon/documentation/web/ps-iap-test/) **[read]**.
- **Who can open a paid floor.** The repo is public (`"visibility":"public"`) and Pages serves every file **[read]**;
  GitHub: on a free account "the repository must be public", and Pages sites "are publicly available on the internet,
  even if the repository for the site is private"
  (https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) **[read]**. A server
  check exists: "Verify item ownership", `POST https://graph.oculus.com/<app id>/verify_entitlement` with the app secret
  and a `user_id` (https://developers.meta.com/horizon/documentation/web/ps-iap-s2s/, 2025-04-15) **[read]**; the id comes
  from `getLoggedInUserId()`, a DUC feature (part 8).
- **Verdict: keep the API; decide the protection now** (owner decision D1). **Cost** **[mine]**: now the floor loader is
  written once for the chosen way; after five rooms on floor 2 it is moving their files and rewriting the loader.
  One durable add-on per floor; its SKU is hard-coded, so the names are fixed before floor 2 (e.g. `floor-02`).
- **Not verified**: a purchase in a real Horizon TWA (never tried); whether the installed app shares saved progress
  with the Quest Browser.

## 6. The signing key and its backup
- **Meta**: "keep the generated keystore file, alias, and passwords in a secure location. Every future update must use
  the same signing certificate" (pwa-packaging) **[read]**; "A lost keystore means a new app entry" **[skill]**; no
  key-recovery service found in Meta's pages **[not found]**.
- **Android** "Sign your app", updated 2026-03-06, https://developer.android.com/studio/publish/app-signing **[read]**: "if
  you lose your app's signing key, you lose the ability to update your app"; "You cannot regenerate a previously
  generated key"; "A validity period of 25 years or more is recommended".
- **Verdict: add, once, before the first upload**: made by the owner (his passwords), 25+ years, never in the repo, two
  copies in two places. **Cost**: lost after floors are sold = a new app; buyers stay on the old one **[mine]**.

## 7. Age group: 13+ or Mixed Ages
- **The board's worry is answered**: "If your WebXR PWA's target age group is Mixed Ages, then you are required to
  implement the Get Age Category API"; "`DigitalGoodsService.getUserAccountAgeCategory()` API is exclusive to WebXR PWAs
  running on Meta Horizon OS" (ps-iap) **[read]**. So Mixed Ages is open to us.
- **Meta** "Age group self-certification", 2026-04-02, https://developers.meta.com/horizon/resources/age-groups/ **[read]**:
  "This is mandatory for all apps"; groups "Teens and Adults (13+)", "Mixed Ages", "Children (under 13)"; Children
  apps "cannot ... use any Platform SDK features" (no paid floors); every group: "No ads", "No children under 10";
  changeable "at any time"; the DUC lists "User age group" as its own feature.
- **Verdict: 13+** fits our 18+ for recording and experiments with deception and debrief **[mine]**; Mixed Ages adds a
  call at every launch, a DUC item and children's-data law (the page points to the FTC COPPA FAQ). Owner decision D2.
  **Cost**: a Dashboard setting now or later.

## 8. Meta paperwork: data-use checkup, data-protection assessment, verification
- **DUC**, 2026-07-02, https://developers.meta.com/horizon/resources/publish-data-use/ **[read]**: "Apps that don't use
  these Platform SDK features do not need a DUC"; "Add-ons" need "User ID, User Profile, In-App Purchase"; provisional
  access in development, but "after you submit an app for review, any provisional access ... is revoked"; "If an app
  isn't recertified yearly, it is removed from the Meta Horizon Store"; "A DUC may only be submitted by someone with an
  admin role"; analytics only "if the data has been aggregated, and/or anonymized" (agrees with our rules).
- **DPA**, 2025-10-14, https://developers.meta.com/horizon/resources/publish-data-protection-assessment/ **[read]**: annual
  when Meta asks ("will be sent a link ... by a specific deadline"); "20 more business days" on request; answers cannot be
  edited after submit; asks for contracts with "service providers" (for us Supabase) and a description of security
  practices. Which apps get one: **[unverified]**.
- **Verification**, 2026-08-24, https://developers.meta.com/horizon/resources/publish-organization-verification/ and
  .../publish-organization-verification-admin/ **[read]**: needed to "publish or update apps" and for DUC
  recertification; admin path "typically completed within minutes" through "Persona Identities", with "A valid
  government-issued photo ID: the physical document, in hand" and a phone camera; the Meta account name and birth date
  must match the ID. Whether ALPHA uploads already need it: **[unverified]**.
- **Upload blocker**: "must first agree to our Developer Distribution Agreement", signed once by an org admin **[skill]**.
- **Verdict: add, in this order**: verification and the agreement (owner, minutes), the DUC when the floor-2 add-on
  exists, the DPA when Meta asks. Prepare now: Supabase's data terms and a one-page security note **[mine]**.

## 9. Comfort rating with an optional smooth mode
- Meta Quest Help, https://www.meta.com/help/quest/331713305046406/ **[read]**: "Note: When we assign a comfort rating,
  we're judging the default experience."; Comfortable experiences "generally avoid camera movement, player motion".
  App policies 5.1, 2026-03-10, https://developers.meta.com/horizon/policy/app-policies/ **[read]**: "You must assign your
  app one of three comfort ratings".
- **Verdict: Comfortable** with teleport and snap turn as defaults, smooth moving opt-in. Keep one rule: no room's
  default moves the camera by itself, or the whole app becomes Moderate **[mine]**.

## 10. VRC test plan
- "Meta Horizon Store requirements", 2026-08-19, https://developers.meta.com/horizon/resources/publish-quest-req/ **[read]**:
  the test plans are "the exact criteria we use", yet "slightly out of date"; lines for delivery: Packaging.2 "APK
  signature scheme v2" (required), Security.1 entitlement check "within 10 seconds" (recommended), Privacy.1-4
  (required, including "how the user may request that their user data ... can be deleted"), Privacy.5 "data protection
  checks", Publishing.1 "App website URL must link directly to a valid page".
- The CSV, https://developers.meta.com/horizon/test-plan/export/quest/csv/ **[read]**: 65 cases; none names PWA or
  browser; Security.1 expects "exit, display an error message, or enter a limited demo mode" (floor 1 is our demo);
  Publishing.1 "must not be hosted on another distribution platform"; Publishing.2 a way "to contact support".
- Tools (help text only, nothing run) **[read]**: `metavr vrc-local` "store-listing-check" (uses an outside model,
  `--model codex`) and "perf-check"; built for OpenXR APKs, on a TWA **[unverified]**. `metavr store share`: "Share a
  Quest build through one unlisted share link".
- **Verdict: add** a checklist file from the 65 rows, our headset checks (tools/quest-look.mjs) and one sideloaded TWA
  run per release. **Cost**: grows with rooms only for the per-room rows (pause, input, comfort).

## 11. Updates of the PWA in the Store
- "Release Channels", 2026-03-23, https://developers.meta.com/horizon/resources/publish-release-channels/ **[read]**:
  ALPHA, BETA, RC "invite only"; invites "by email, alias, or URL"; "The default user limit is 200"; "even alpha
  builds, must meet the release packaging requirements". "Updating a Published App", 2024-08-19,
  https://developers.meta.com/horizon/resources/publish-content-updating/ **[read]**: a new Production build "is
  automatically deployed to all users"; rollback needs a higher build number.
- Web fixes need no new APK: "the installed TWA picks them up on the next launch"; rebuild only for "id, name, icon,
  version, app mode" **[skill]**.
- **Consequence** **[mine]**: every channel opens the same site, so a push reaches testers and buyers at once; with
  `max-age=600` and unhashed module names a player who starts during a deploy can mix old and new files. Options in D3.

## 12. Other stores later (from docs/research/projects/distribution.md, read 9 Oct)
- PICO Store takes a PWA by URL ("developers can submit the URL through the PICO Developer Portal"); its payments for
  web apps: **not found**. SideQuest: "no plans to monetize content". Steam: needs a desktop wrapper rebuilt with OpenXR.
- Meta's own billing sample keeps "a platform-agnostic billing interface" (Horizon Billing sample, 2026-05-08,
  https://developers.meta.com/horizon/documentation/web/web-sample-horizon-billing/) **[read]**.
- **Verdict: add now only the seam**: purchases behind one small module, nothing Meta-specific in rooms. **Cost**: free now;
  after five rooms that call Meta's API directly, each must be changed.

## Decisions for the owner
- **D1. Who can open a paid floor.** (a) Honour system: paid floors on the public site, the app checks
  `listPurchases()`; free, no protection. (b) Source private, site public: a private repo, only game files pushed to
  a public site repo (as the test copy already is); hides notes and history, not the floors. (c) Our server gives a
  paid floor's files only after Meta's `verify_entitlement`; real protection, but our server then handles a Meta user id
  (DUC, DPA, privacy text), against "no account" in our data rules. My pick: (b) now, (c) only if copying is seen.
  **Withdrawn 12.10:** the pick (b) is no longer advised: it does not protect the floors, and a private repository on the free plan loses Actions minutes (2,000 a month against about 1,100 and 1,700 a day on 9 and 10.10), main's protection (Pro), environment secrets (Pro), free secret scanning, and required reviewers (Enterprise, in an organization). The advice now: the repository stays public; (a), then (c) only if copying is seen; D1 itself is still the owner's; the verdict above says decide now, and the summary at the top says before floor 2 exists. Sources, GitHub docs read 12.10: https://docs.github.com/en/get-started/learning-about-github/githubs-plans ("2,000 minutes per month" on Free; "Protected branches" in private repositories from Pro; Enterprise among "Organization and enterprise plans"); https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments (on Free, Pro and Team "required reviewers are only available for public repositories"; environment secrets in private repositories need "GitHub Pro, GitHub Team, or GitHub Enterprise"); https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning (public repositories scanned for free); the owner account is a user, not an organization (gh api).
  What (b) costs on GitHub's free plan (read 10.10) **[read]**: private repositories get "2,000 minutes per month" of
  Actions; Pro "3,000 GitHub Actions minutes per month" and "Protected branches" in private repositories
  (https://docs.github.com/en/get-started/learning-about-github/githubs-plans); minutes are "Free for public
  repositories" (https://github.com/pricing); a Linux 2-core minute "$0.006"
  (https://docs.github.com/en/billing/reference/actions-runner-pricing). Our runs on 9 and 10 Oct took about 1,100
  and 1,350 minutes a day (gh run list, wall time) **[measured]** (the 1,350 was counted before 10.10 ended; the whole day, re-measured 12.10: about 1,700).
- **D2. Age group.** 13+ (my pick) or Mixed Ages (10-12 allowed; age call each launch; children's-data law).
- **D3. Testers versus buyers.** (a) One site for every channel; (b) ALPHA builds open a `/next/` path on the same
  domain, Production opens `/`, a release copies `/next/` over (my pick, to be tried on a sideloaded build first).
- **D4. Where the key's two copies live.** (a) A password manager plus an encrypted file on Google Drive; (b) an
  encrypted USB stick plus Google Drive; (c) printed passwords in a safe plus one digital copy. He makes the key.

## What to do first
1. Owner, about 15 minutes: Org verification in the Dashboard (his ID and phone), sign the distribution agreement,
   "Create a new app" (gives the App ID). Payment details stay as on the board (payout question first).
2. Me, on his word for the live site: an Actions workflow publishing the PUBLIC list with `include-hidden-files: true`;
   `manifest.webmanifest` (`scope` "/", 512 px icon); `privacy.html` live; a check that curls assetlinks, manifest
   and privacy after each deploy; Meta's `enterVR` snippet behind `getDigitalGoodsService`.
3. Owner, 5 minutes: makes the keystore (one `keytool` line, his passwords), two copies (D4); gives me only the public
   SHA-256 fingerprint for assetlinks.json.
4. Me: build the TWA, sideload, confirm it launches straight into the corridor; then upload to ALPHA: this answers
   the API 34 question before anything is built on it.
5. A free test add-on `floor-02` bought by a test user in the ALPHA build: proves paid floors work before floor 2 exists.

## Not verified / not reached
A real upload (API 34), a real Digital Goods purchase, a TWA under vrc-local, which apps get a DPA, whether ALPHA needs
verification, shared storage between the installed app and the Quest Browser, PICO's web-app payments, Steam's rules.

## Selling outside the store
Free in every store, paid content bought on our own site, and what each store allows: docs/research/store-fees-own-sales.md.
