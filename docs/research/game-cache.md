# Versioned public game cache — 17 October 2026

Implemented locally on codex/trial-migration, based on d8540fc84a2bcdc4d1b842e2483124e971254fb2. No publication, payment, production write, review acceptance or platform certification is claimed.

## What is integrated

- tools/export-game.mjs prepares the real public allowlist; tools/publish-preview.mjs now uses that export after the existing review gates. Development index.html stays direct.
- A small entry page installs a worker containing a fixed manifest. SHA-256 addresses identify 256 KiB pieces. Every piece is checked before persistent storage or use; concurrent reads share a pending download.
- Core HTML, code, styles, fonts and A-Frame 1.8.0 must finish before a candidate installs. Controller models and audio are fetched on demand; single HTTP byte ranges fetch only needed pieces.
- An open game keeps its version. There is no forced takeover: the replacement waits until every tab controlled by the previous worker closes. Failed installation leaves the previous active version in place; verified pieces remain for retry.
- Browser storage keeps pieces referenced by the current and previous releases. The publisher retains validated old immutable objects on the server, so an old open tab can still request a previously unused model.
- Optional precompressed .bin.gz objects preserve transfer compression; unsupported browsers fetch raw pieces. Both raw gzip and HTTP Content-Encoding gzip were tested. Git attributes prevent newline conversion from corrupting text-looking pieces.
- Only listed public same-origin GET assets enter this cache. APIs, POST requests, other origins and Authorization requests pass through. This is not a paid-content authorization layer or integration of the earlier two-provider experiment.
- Browsers without worker support can use uncached.html. Initial storage failure offers retry and a plain-game fallback; that fallback does not provide atomic updates or persistent chunk reuse.

Export a new local directory with npm run delivery:export -- --out NEW_DIRECTORY. Add --previous PREVIOUS_EXPORT when retaining old objects. The exporter refuses an existing destination. Only public files are copied. The direct and chunked copies increase server storage, not the player's measured launch download.

## Actual browser proof

Codex in-app browser, local HTTP at 127.0.0.1:8795/object-preview/, real game and A-Frame 1.8.0. Chrome's attachment was unavailable; this is not a Chrome, Quest or Safari result. A and B differ only by a comment in src/main.js.

| Step | Additional game-object body bytes | Observed state |
|---|---:|---|
| First desktop launch A | 4,378,482 | Corridor visible; 143 pieces requested |
| Reload A | 0 | Same scene; no additional piece request |
| Candidate B with one piece returning 503 | 0 | A active; no waiting candidate; A still opens |
| Repair B | 908 | Only changed piece downloaded; A active, B waiting |
| Close A tab and open B | 0 | B activated; corridor visible |
| Roll back to A, close B tab and reopen | 0 | A activated; corridor visible |

These counters exclude HTTP headers, worker update-script checks and the small initial bootstrap. Zero means no game-object body was transferred, not no network activity. The first launch includes the recordings the current game preloads; it is not a complete playthrough or all controller models.

Release A: ca591878a42bd23af60762edaf149d26551572d1c920663b7f3211f7b5bd4b68.
Release B: 4eec6911ff3c0572b434abc91c8c73cc97c92f6150563bacaa6a9f54379856ac.
Export A: 164 files, 28,498,151 decoded bytes; required core 1,879,774 decoded bytes. Sizes depend on these exact exported bytes, including line endings.

Evidence in the chat artifact directory C:/Users/admin/.codex/visualizations/2026/10/16/01a14724-f3e6-7fb2-8ae4-b2f637fe4fc0:
- game-browser-compressed-evidence.json: all requests and seven saved worker-state checkpoints; SHA-256 bf48c13acf1f175fdc2c16973c662b6c6c766f896215667fb22beaa9b2d8f57d.
- game-cache-browser-summary.json and delivery-stage/v2/verify-browser-evidence.mjs: independent assertions against server records, including 144 unique successful pieces plus one intentional failed request.
- game-cache-final.png: final A scene after rollback; browser error log was empty.
- game-export-C and game-export-D: exact exports; browser-compressed-server.mjs in delivery-stage/v2 is the controlled failure fixture. Earlier uncompressed A/B evidence is supplementary, not the final-code measurement.

## Automated checks and limits

Full npm test passed on the final code, including the new worker/export tests and existing delivery verification. Shell-hook cases reported skipped on this local platform. Tests reconstruct every exported file, decompress every gzip piece, round-trip a real Git index with core.autocrlf=true, reject corrupt retained pieces and ensure metadata is not requested as a served file.
The worker fixture exercises core/lazy/range loading, worker restart with a retained cache and no network, failed and quota-blocked installation, changed-part update, rollback, corrupt cached/network pieces, oversized bodies, redirects and public-only interception. This VM restart is not a full real-browser shutdown/restart test.
The first structure check found a misplaced architecture-map entry; corrected before passing. The evidence checker initially expected eight saved checkpoints; the actual seven-step sequence was inspected and its assertion corrected. Neither issue was a runtime game failure.

Remaining: current-file practice review (read-only gate check returned absent; the room's paper review is present), real Codex callbacks (status still zero), publication/CI on this commit, Quest/Safari and browser restart/quota/eviction testing. No review records were written. Existing publisher gates remain.
The live publisher's clone/retain/push/Pages round trip has not run. CDN caching of mutable worker/bootstrap paths needs verification at publication. Public main/Gcore remains the previously observed 1.7.1 origin; no switch occurred here.
Server object history is retained without automatic pruning: set a release-retention policy before substantial growth. Browser cache may be evicted; a fresh profile, cleared storage or missing lazy asset can require another download. No full offline play, worldwide reach, protected paid floors or independent backup origin is established by this change.

Lifecycle and format references: [Service Workers specification](https://www.w3.org/TR/service-workers/), [updateViaCache](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/updateViaCache), [CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage), [DecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream), [Git attributes](https://git-scm.com/docs/gitattributes).

## Source audit follow-up, 17 October 2026

The measurements above belong to commit 802847f and its exact export manifests. The subsequent source audit found and fixed hidden-file export, incomplete review fingerprints, URL-dependent preview protection, active lazy-load quota failure and filesystem-link escapes. Source-audit details and test evidence: docs/research/source-audit.md. The old statement that the room paper gate is present does not apply after the room changes in this audit; fresh gates are required. No new live-provider measurement is claimed.
