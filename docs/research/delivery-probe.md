# Delivery probe: measured files and two-source recovery

17 October 2026. Base: codex/trial-migration, 267bbbace57ce38a17618cb721edb21b6e133fce.
Local transport experiment plus a public-file Gcore HTTPS probe. Initial code verified at 422f0bcfd89285eff955ab28467a903b726ff558; the gzip follow-up below resumes cc153c0. Final code commit is recorded in docs/progress.md. The game does not import the downloader; no floor is accepted or released.
Decision context: [store-fees-own-sales.md](store-fees-own-sales.md), [engine-native.md](engine-native.md).

## Measured inventory

`tools/delivery-pack.mjs` reuses the existing PUBLIC list from `tests/static-server.mjs`, also used by the preview publisher.
It reads actual bytes, refuses symlinks, records source HEAD and changes, and hashes every file and part.
The full current preview set is **161 files, 28,487,736 bytes** (28.49 decimal MB; 27.17 MiB).
Delivery files were unchanged from the base commit. This includes development probes, licenses, inspector and models for other devices.
It is NOT the traffic of one launch, a production export, decoded RAM, a floor split, or the hypothetical 500 MB future game.

| Group | Files | Bytes |
|---|---:|---:|
| Controller/hand assets and licenses | 22 | 22,203,952 |
| Room source, recordings and sounds | 42 | 2,912,714 |
| A-Frame patched local build | 1 | 1,323,381 |
| App source and recordings | 36 | 775,993 |
| Engine source | 38 | 169,696 |
| Inspector and licenses | 3 | 524,652 |
| Painting | 1 | 351,776 |
| Fonts and licenses | 6 | 120,045 |
| Pages, styles, shell, A-Frame notices and three probes | 12 | 105,527 |

Largest files: Valve Index models, 6,218,424 and 6,215,932 bytes; HP models, 2,394,660 and 2,393,240 bytes.
These are not all automatically needed on Quest; do not multiply the complete inventory by every visit as a measured bill.
Current shell, app and room use relative imports; voice/sound use module-relative URLs. No pack manager or persistent download cache was found.
A-Frame, controller models, inspector, four font binaries and art are vendored. `tests/vendor.test.mjs` verifies the patches and licensed models.
`index.html` overrides the A-Frame asset CDN; `src/app/stage.js` points the inspector locally.
The explicit external runtime service in authored game code is Supabase: results, playtest submission and comparison RPCs in `src/engine/results.js`.
Source inspection plus the existing external-request guard (`tests/outside.mjs`) is evidence of intent, not a fresh all-device network trace.
Code/doc links in vendor bundles do not themselves establish live requests. Full real-device request coverage remains an external check.

## Constraints carried into this experiment

- Preserve original asset formats and relative file names. A JSON transport manifest lists lengths, file SHA-256 and part SHA-256; it does not change game mechanics.
- Later release catalogues must separate base app, floors, language and device assets; include minimum compatible client/schema versions. Do not publish future paid code/assets through the broad preview allowlist.
- Immutable versions and a trusted manifest digest prevent mixing releases. The digest must arrive through a trusted bootstrap; hashes alone do not authenticate a hostile manifest.
- Endpoints belong in delivery configuration, not scientific data or asset formats. Replicas need independent stored bytes, not two CDNs fetching from one R2 origin.
- Paid rights must be verified on the server before issuing short-lived access to both providers. Protect origins and CDN cache hits. A local callback/flag is not a purchase system.
- 401/402/403 and redirects stop this probe. Expiry requires renewed authorization; no unpaid or expired access via the backup. Access is checked before warm-cache reuse too.
- Real browser storage, eviction, offline rights/refunds, .com/.top login and Supabase availability are separate work. Do not promise them from this probe.

Basis: Gregory, Game Engine Architecture, 4th ed., vol. 1, sections 7.2.2.1-3, pp. 468-472 (local full text): resource lifetime, dependencies, modular packages and original formats.
Existing code inspected first: preview allowlist/publisher, byte comparisons, vendor guards and request watcher. No existing resumable two-source loader was found.
Use browser primitives: [Fetch streams](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort), [Web Crypto digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).
Fixed-size objects avoid dependence on Range handling, content encoding and CDN-specific resume semantics. 256 KiB is a probe choice, not a device benchmark or settled production optimum.

## Reproduce and interpret

Run from the verified checkout:

```sh
npm run delivery:inventory
npm run test:delivery
node tools/delivery-pack.mjs --out ../delivery-export-new
```

The output directory must not exist. Export is local only: manifest.json, inventory.json and 244 immutable binary objects.
Object bytes total 28,487,736; pretty-printed manifest is 63,932 bytes. Version: cef933437d9686fafe489760cfc65b2419bd17710b697faa9bf01e1ed4f7e5f0.
Exact file bytes include checkout line endings; different line endings correctly create a different version. Do not repackage separately on each provider.
`tools/delivery-download.mjs` verifies a caller-pinned manifest, then each part and reconstructed file, retaining only verified parts.
Two loopback HTTP servers own separate byte copies; failed responses are aborted; the next part prefers the working source.
One attempt per source per part; default 5 seconds per request including body and 60 seconds per operation. Probe tests use shorter deadlines.
The in-memory cache is bounded by this test package, not persistent storage. Individual files are capped at 32 MiB. No 500 MB memory claim is made.

`tests/delivery.test.mjs`: 22 passing scenarios using real HTTP bodies, including the full inventory, unavailable source, 503/404/429, header/body hangs, reset, corruption, truncated/oversized bodies and HTML challenge.
Refusals: 401/402/403 and redirects never try the backup; missing/denied/unavailable authorization never reuses cache. Modified/unpinned manifests fail before transfer.
Both sources failing retains completed parts for a later attempt; a warm repeat downloads zero bytes. Corrupt cached parts are repaired.
Changing one byte in a large file creates another manifest but downloads only its changed 262,144-byte part.
Mid-file body hang: the 6,218,424-byte file completed with 6,218,488 received bytes; only the 64-byte unfinished prefix repeated.
Tests assert that the first two verified parts never appear in backup requests and that the hung request closes. This measures application bytes, not TCP/TLS overhead or an invoice.
The evidence JSON is saved outside the public repo in the current chat's visualization directory, alongside the local pack export.

## Proposed smallest real trial and full cost components

Do not upload the unapproved game revision yet. Use a non-game test pack or an owner-approved export, two separate private origins and provider test hostnames; no DNS cutover.
Bunny: one Standard storage region (Frankfurt), one Volume pull zone, no Optimizer/Shield paid extras, token protection and private origin. The unsaved form was prepared as uato-delivery-probe: default extra LA/NY/Singapore replicas removed, quoted storage reduced from USD 0.03 to USD 0.01/GB. No zone was created.
Gcore: one Standard PAYG object bucket in an available EU region, its own PAYG CDN resource, private origin authentication and secure CDN URLs. Do not point it at Bunny/R2.
Account check: owner Chrome successfully opened Bunny, Gcore and Cloudflare. Gcore storage onboarding reached payment-info-management: required billing address and card/PayPal/other method verification, with an unspecified small charge and refund. No payment details entered or confirmation submitted by the assistant. A free CDN allowance is not an activated free storage origin.
Assistant recommendation after the owner asked whether payment is worthwhile: use the free PAYG CDN allowance for a first full-transfer check on an already-public file before buying storage. The official PAYG announcement confirms no card or subscription is required to start. This shared-origin check can measure the CDN route, but cannot establish independent stored copies.
Before the subsequently authorized live setup below, browser attachment failed on the final overview check. That earlier attempt did not establish activation or transfer. The owner has not authorized a charge.
On both: identical versioned files, binary MIME for parts, HTTPS, CORS for the exact test page origin, no HTML challenge for asset requests, bounded cache lifetime for authorization and immutable content caching after authorization.
CDN cache-key/auth ordering, origin bypass, expired access and anonymous denial must be tested on BOTH services before any paid floor is uploaded. Do not expose keys in browser code or reports.
Proposed traffic budget: at most 20 complete passes per provider (571,033,360 bytes including manifest), one copy per origin for one month; no persistent logs/add-ons/backend/DNS purchase.

Published rates re-read on 17 October, not an invoice:

| Cost component | Trial arithmetic / unresolved account detail |
|---|---|
| [Bunny Volume](https://bunny.net/pricing/cdn/) | USD 0.005/GB: 20 passes approx. USD 0.002856 transfer |
| [Bunny Storage](https://bunny.net/pricing/storage/) | Single-region USD 0.01/GB-month: approx. USD 0.000286 for objects + manifest; API fees/transfer to own CDN advertised free |
| [Bunny minimum](https://bunny.net/faq/) | FAQ says USD 1/account/month with active zones; storage page also states USD 1 minimum. Confirm combined billing before purchase; reserve USD 2/month conservatively, not USD 1 per download |
| [Gcore PAYG CDN](https://gcore.com/developers/pay-as-you-go-cdn) | First 1 TB/month free; then EUR 0.01/GB through 500 TB. Trial fits free traffic if the account has that plan and allowance |
| [Gcore Standard storage](https://gcore.com/pricing/cloud?tab=id_object_storage) | Published EUR 0.04/GiB-month: approx. EUR 0.001064; 245 writes at EUR 0.03/10,000: EUR 0.000735. Own-CDN egress free; other egress EUR 0.02/GiB |
| Taxes, rounding, region and account minimums | Gcore explicitly varies by location and excludes VAT; account checkout/rounding/minimum payment remain to verify. Currency conversion is not guessed |

Provisional budget for the bounded trial: USD 2 plus under EUR 0.01 usage before tax, subject to actual account terms. Not an approved charge or a verified all-in invoice.
Gcore's temporary payment-method verification charge is additional cash flow with its amount undisclosed on the observed page. Obtain the amount/terms before treating the trial budget as ready for approval.
The existing Bunny balance is credit already in the account, not free ongoing hosting. New zones can consume it; auto-recharge must not be enabled without approval.
No extra DNS, certificates, payments, entitlement backend, research backend or production logging is bought in this trial. Those services have separate future costs; bandwidth rates alone are not the game's complete operating budget.

## Live CDN setup and repeated-download control

The owner authorized the free trial, then requested avoiding repeated downloads while accounting for future edits.
Verified account PAYG plan; created Gcore resource 1159463, cdn-probe.youaretheobject.top, target cl-gl5b557661.gcdn.co.
Origin and Host header: youaretheobject.com; origin pull changed to HTTPS. No DNS delegation, WAAP, Shielding, Image Stack, storage purchase or top-up.
Saved browser caching at 600 seconds; edge caching respects origin headers. Disabled Always Online (stale content on error), preserved query strings/Set-Cookie behavior, and added X-Robots-Tag: noindex, nofollow.
Mutable file names must not receive a year-long immutable policy. Browser freshness avoids network within its lifetime; after expiry an unchanged ETag can return 304 with no file body. Cache eviction/private browsing/hard reload can require another download.
Actual public main is still the older A-Frame 1.7.1 build. GET of its vendor/aframe-1.7.1.min.js returned 1,277,857 bytes, SHA-256 79fbf09427910d43063d99fef43de771a0f37e05f7e61eff2414e6e2b0f448e0; conditional GET returned 304 and zero body bytes.
After the owner signed in to Namecheap, added only CNAME cdn-probe -> cl-gl5b557661.gcdn.co; read back the saved row and authoritative DNS answer. Existing apex/www records stayed unchanged.
Free Let's Encrypt issuance completed; normal curl TLS verification succeeded, without bypasses. The portal recovered on continuation. HTTP-to-HTTPS redirect was saved, read back and verified as 301 to the same HTTPS path at 00:52 UTC.
At 2026-10-17T00:44:54.103Z, Gcore HTTPS returned 200 and 1,277,857 bytes with the exact reference SHA-256 above. Both conditional requests returned 304 and zero body; Cache: HIT, max-age=600 and noindex were present. A deliberately nonmatching validator returned 200 and the same complete file.
This bounded check transferred 3,833,571 body bytes in total: one reference and two CDN bodies. It did not modify origin content and therefore does not prove a live multi-file release update. Earlier 503 responses and the temporary certificate-save error were superseded by these successful checks; no paid service was activated.

Publication checks previously fetched every model/script/style on every retry (up to 12 complete rounds).

- tools/verify-delivery.mjs now retains a per-file strong ETag only after comparing the response bytes; a 304 reuses that comparison, including a previous mismatch. A new release starts a new verifier.
- Changed validators/content cause a fresh body comparison. 401/403/404/503, redirects, timeouts and an unsolicited/contradictory 304 never become a successful verification. Text CRLF normalization and binary byte equality are preserved.
- tools/publish-preview.mjs uses this verifier inside the existing bounded retry loop; publication/review gates are unchanged. It still checks every file each round, but does not redownload an unchanged body when a strong ETag is available.
- tests/verify-delivery.test.mjs uses a real HTTP server: 12 checks of a 1 MiB model transferred 1 MiB, with 11 empty 304 responses; changed releases, wrong/old content and errors also passed. npm test passed; shell-hook cases reported skipped locally. No live publication, CI or headset run for this change.

This fixes repeated verification traffic and configures ordinary browser HTTP caching; it is not an offline game installer, atomic multi-file release manager or paid-floor entitlement cache.
Future immutable files require content hashes in their URLs/manifests, old-version retention during active sessions, changed-file cache invalidation at publication, and a real update/rollback test before cutover. Paid content/API responses need separate authorization/cache rules; this public probe must not be used as their policy.
Evidence outside the repo: gcore-live-https.json, gcore-dns-record.jpg and gcore-cache-settings.jpg in this chat's visualization directory. Network tests use public files only; the test script now keeps a validator for the reference file too.
Basis: [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) and the observed provider UI/headers. 304 saves file bytes, not all request/header traffic; automatic Quest/Safari reuse remains to measure on those devices.

## Compression, verifier regression and browser follow-up

17 October, resumed cc153c0. Enabled Gzip for supported text MIME types; no paid Origin Shielding/Brotli or large-file slicing was enabled. Saved/read back redirect and Gzip.
The same public A-Frame file transferred 340,760 gzip bytes and decoded to the original 1,277,857 bytes and SHA-256: 73.33% less body traffic. Gzip responses retain Vary: Accept-Encoding, max-age=600 and a weak ETag; conditional GET returned 304/zero body.
A real HEAD comparison exposed a gap in the earlier publication verifier: both GitHub Pages and Gcore supply a weak ETag under fetch's default gzip negotiation. The original strong-validator-only implementation therefore downloaded every response again.
The new negotiated-gzip regression failed before the fix: 12 complete decoded model bodies instead of one. The verifier now requests Accept-Encoding: identity, retaining exact-byte checks and strong-validator reuse. Weak validators are still never trusted for byte equality. This only changes publication verification; player browsers retain compression.
Regression and full npm test passed; shell-hook cases explicitly skipped locally. A real Gcore check using the amended helper made 3 requests, received 1,277,857 body bytes total and reused 2 empty 304 responses. No publication, CI or headset test was run.

The separate local Chrome fixture uses two manifests, content-hash asset URLs, immutable asset caching, and candidate activation only after all hashes pass. It is not imported by the game. Independent server request logs and browser Resource Timing agree:

| Local fixture scenario | Observed result |
|---|---|
| First A | 1 MiB model and 20-byte rules received |
| Repeat A | No asset requests reach the server; cached bodies reused |
| B with its changed file unavailable | HTTP 503; A remains active |
| Recovered B | Shared model reused; only the new 28-byte rules received |
| Repeat B and rollback A | All asset bodies reused, no additional model request |

The server saw the model exactly once; manifest statuses were 200,304,200,304,304,200. This proves the fixture's update pattern, not a complete game release manager, browser restart survival or offline use.
Timing-Allow-Origin: http://127.0.0.1:8793 propagated by 01:09 UTC. Direct Chrome fetch then received 405,722 encoded bytes (1,277,857 decoded, pinned SHA-256); Resource Timing transferSize was 406,022 including its header allowance. Repeat fetch and a new tab after closing the first both returned transferSize 0 with the same nonzero body sizes and hash. This is browser cache reuse of the public 1.7.1 probe within its 600-second lifetime, not an entire game, browser restart or offline guarantee. Chrome and the earlier curl run received different compressed sizes; no common encoding/edge is assumed. The diagnostic header stays limited to the local test origin.
Artifacts in this chat's visualization directory: gcore-gzip-result.json, live-verifier-result.json, browser-cache-results.json, browser-cache-server.json, browser-cache-summary.json; reproducible fixture/check scripts are in delivery-stage/.
Measurement basis: [MDN Resource Timing](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/transferSize). Browser transferSize includes a header allowance; the body sizes above are kept separate.

## Entry-page and publication audit, 17 October

The owner noticed 1.7.1 in the probe while the game uses 1.8.0. Read-only public HTML and local source comparison at 01:11 UTC confirmed:

| Location | A-Frame loaded | AFRAME_CDN_ROOT set in entry page |
|---|---|---|
| Main youaretheobject.com, also the current Gcore origin | 1.7.1 | No |
| Published object-preview | 1.8.0 | No |
| Trial checkout cc153c0 | 1.8.0 | Yes, local vendor/aframe-assets |

The preview A-Frame 1.8.0 body matched the trial byte for byte: 1,323,381 bytes, SHA-256 0fd9768440300b116af76343ab9d7bfb4699758ed236bdcda5be56f316d3709f. The main branch staying older is a recorded owner decision, not evidence that the working game was downgraded. Missing AFRAME_CDN_ROOT in published preview leaves the library's external cdn.aframe.io default; actual controller requests on a headset were not measured. The trial and public preview are not the same release.

Confirmed publication hazards: index.html was excluded outright; fonts/audio/JSON were outside the extension filter; expected bytes were read from the working checkout after the push/build wait. That could falsely accept an old entry page or compare against later unpublished edits.
Fixed locally: capture every file from the prepared public directory after its noindex change and before Git metadata; verify that frozen snapshot, including binary fonts/audio. Review and publication gates remain intact. HTTP regression covers old entry page plus its 304, correct transformed page, later local edits, corrupt font bytes and old JSON. The amended verifier correctly rejected the real current public preview entry page against the prepared trial entry page, receiving only 521 bytes. Full npm test passed; no live publication/CI/headset claim.
Evidence: publication-version-audit.json, preview-entry.html, main-entry.html, browser-cache-summary.json and browser-cdn-cache-proof.jpg in this chat's visualization directory. Later portal reload stalled; saved settings had already been read back, and actual CDN headers/downloads confirmed their effect. No origin switch to preview was attempted.
Next: versioned game exports and update/rollback integration; publish a reviewed current preview through the existing gates, then exercise it on Quest/Safari. Ordinary HTTP caching and the local fixture do not yet satisfy the complete-game update requirement.

## 17 October continuation — integrated game cache

The earlier integration TODO is now completed locally: [versioned game cache](game-cache.md) records the actual game export, compressed changed-piece downloads, failed-update preservation and browser rollback. Public publication and platform acceptance remain pending; the earlier CDN measurement is still a separate experiment.

## External acceptance still required

Full downloads in target ISPs/countries; actual Quest/Safari Vision Pro CORS, memory, storage quota/eviction and frame behavior; TLS/DNS failure, real provider challenge and cache errors; origin privacy and expiring access; independent initial HTML/loader; durable resume after browser restart; account billing and spending stop.
Local HTTP has no real TLS, regional block, provider WAF or entitlement server. Tests do not establish worldwide access, real purchase restoration, gameplay, hook activation or owner acceptance.
Before merging/publishing, preserve the existing review and CI gates. No review record may be fabricated from these tests.
