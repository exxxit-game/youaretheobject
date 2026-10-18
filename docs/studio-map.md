# Карта проекта: что связано и что подтверждено

## Текущее поручение: проверить процесс, 18 октября 2026

По позднейшему поручению владельца работа над комнатой приостановлена. Ни эта карта, ни зелёный тест не означают готовность всей игры. Точные новые результаты и версии: [журнал](progress.md).

| Звено | Подтверждено | Что ещё не подтверждено |
|---|---|---|
| Твои решения → задача | Решения остаются в owner-decisions и четырёх тематических rules; Codex читает их явно через AGENTS. Claude отключён | Прочитанное правило само не обеспечивает исполнение |
| Рабочие файлы → сохранённая версия | Работа в codex/trial-migration; исправления процесса сохранены и отправлены в710322f, игровой код прежний72a82fd | Несохранённые изменения не входят в прежний прогон GitHub |
| Команды → защита | После перезапуска PreToolUse реально остановил обход Git hooks и изолированную пробу записи через apply_patch; обычное чтение прошло. Тяжёлые тесты сами отказывают на ноутбуке | Это проверка двух путей вызова, не всех инструментов и не полная граница безопасности |
| Версия → тесты и обзор | CI39138469156 прошёл на710322f: тесты и новая проверка завершённого обзора. Замечания CodeRabbit прочитаны | Новый дефект разбора браузерной подсказки воспроизведён и исправлен локально. Исправление оси комнаты тоже местное. Дополнительное обязательное правило GitHub утверждено владельцем, но ещё не применено: у ключа нет прав, управление Chrome остановлено инструментом |
| Проверки → очки → твоя оценка | Восемь реальных завершённых записей независимых обзоров; был короткий запуск прежней сборки на Quest | Нет полного прохождения текущей пробы на Quest, длительного замера или твоей приёмки. Количество обзоров не отменяет их замечания и привязку к версии |
| Публикация | Сайт получает main, PR28 направлен в room-polish. В main ничего не опубликовано | Платная выдача через магазин и закрытый сервер ещё не реализована. Это отдельный этап до продажи |
| Знания → восстановление | Первоисточники в objekt-files, HTML — навигационный снимок; F: — местные резервные копии, Google Drive — облако | Из нового снимка F: восстановлены история710322f и685 файлов, все хеши совпали; облако, библиотека и база в эту проверку не входили |

Ветки — линии сохранения версий: **codex/trial-migration** — текущая работа; **room-polish** — место объединения после проверок; **main** — опубликованный сайт. Двенадцать старых **claude/** — история, а не работающий Claude. Их не удаляем без сравнения уникальных изменений. Старая папка на ноутбуке тоже сохранена; она не равна текущей рабочей копии.

Путь проверки: **источник и задача → изменение → сохранённая версия → тесты на GitHub + завершённый обзор → моя проверка той же сборки на Quest → твоя оценка игры**. После исправления повторяем затронутую проверку, а не весь аудит. Техническую проверку выполняет помощник; от владельца нужны ощущения и решения о продукте.

Для будущих платных комнат код и тесты могут храниться в закрытом GitHub, а игра проверяться на Quest без публичного сайта. GitHub Pages — отдельный способ размещения сайта с отдельными ограничениями. Сейчас репозиторий открыт: платные исходники и файлы нельзя помещать в другую его открытую ветку. Выбор закрытой инфраструктуры, её лимиты, доступ CodeRabbit и реальная проверка покупок требуют отдельного подтверждения перед платным этапом; новых расходов не сделано.

## Исторический срез ниже

Следующий подробный разбор относится к прежней базе 2a31874. Его числа и предложение следующей задачи устарели; они сохранены как история, а не как команда повторять аудит.

Evidence cut: 18 October 2026. This is a map of the existing project, not a new workflow or approval.
Verified default cwd: C:/Users/admin/.codex/worktrees/codex-trial-migration/objekt; branch codex/trial-migration;
HEAD **2a31874e0235dd1f7513696b6b1ede243454e6b1**, with preserved uncommitted code, configuration and documents.
A commit identifies the saved baseline, not all current bytes. The event-bridge fix is still uncommitted.

Later on 18 October: [the Quest/practice-review entry in progress](progress.md) supersedes the missing-practice
status below. One real practice review completed and a bounded current-export headset check passed; two findings
remain open, paper exact review remains absent, and no feature was accepted. The ledger below retains the map's original evidence cut.

Latest bounded readiness refresh (18 October, [progress](progress.md)): fresh working-tree npm test passed;
23 owner events and one matching real practice review are confirmed. Native doctor and a live node_repl call
were checked; Quest 3 is connected. No new VR session, current recovery proof or release clearance follows.

## How to use this map

Start at the link relevant to the task, follow its input and output, then check the evidence boundary before acting.
[ARCHITECTURE.md](../ARCHITECTURE.md) remains the file/layer inventory; [target architecture](target-architecture.md)
describes the future; [board](board.md) holds the owner's priority; [tandem](tandem.md) assigns responsibility.
This restores the former map's location, not its old operating claims. Its unchanged predecessor is
[the archived studio map](file:///C:/Users/admin/Documents/objekt-files/notes/archive/docs/studio-map.md), dated by its 13 October request.
That map's Claude roles, PR10 and two accepted corridor items are historical. Current feature records show three of seven.

Evidence labels below: **current** = inspected here; **recorded** = dated result/receipt read, not rerun;
**proposed** = an assistant's next step; **open** = no sufficient evidence in this bounded pass.
The owner decides goals, taste, money and acceptance; the assistant performs technical work. No new owner decision is inferred.

## Owner decisions carried into Codex, 18 October

The original decisions remain canonical; they were not lost with the change of assistant. [AGENTS.md](../AGENTS.md)
now names the sources for advice as well as implementation; Codex does not import Claude path rules automatically.

| Scope | Canonical source | Evidence boundary |
|---|---|---|
| Goal, responsibilities, priorities and communication | [Owner decisions](owner-decisions.md), [his accepted words](ten-circles.md), [tandem](tandem.md) | Preserve the owner's choices; a remembered setup is not proof it works |
| Game, architecture references, art, sound and controls | [Game decisions](../.claude/rules/game.md) | Accepted direction is distinct from implemented or headset-accepted features |
| Results, science, privacy, money and stores | [Data decisions](../.claude/rules/data.md) | The 12 October science decision supersedes the 10 October research note; separate science consent is still missing |
| Headset instructions, HUD and measurement | [Measure decisions](../.claude/rules/measures.md) | Retain worn-headset protections and actual measurement requirements |
| Tools, services and development setup | [Setup decisions](../.claude/rules/setup.md) | Later Codex choices supersede old Claude model/plugin operation; historical integrations are not activated |
| Exact accepted wording and why | [History pointer 1](owner-decisions-history.md), [history pointer 2](owner-decisions-history-2.md) | Private originals stay in the library; no private dialogue is copied into the public repository |

Assistant advice remains labelled in [technical decisions](decisions.md), including "Moved from his decisions".
Recovered choices do not imply that all their implementations are complete. The current [progress entry](progress.md)
records the source/code differences and the pending product choices about the form, without inventing owner approval.

## The connections

```text
Owner request + saved sources -> decision and room specification -> game and anonymous report
                                      |                              |
                                      v                              v
                             versioned code/export <------- consent and server contract
                                      |
                  tests + independent reviews -> assistant's look -> owner's look/acceptance
                                      |
                      permitted preview / separately approved release

Library originals + decisions + exact-version receipts -> dated export and backup -> recovery
```

The arrows describe dependencies, not a claim that every transition has succeeded.
The game sends results separately from downloading assets; making one route resilient does not repair the other.

| Link and purpose | Input -> output; neighboring dependencies | Foundation and implementation | Evidence and missing proof |
|---|---|---|---|
| **1. Intent and sources**: decide what belongs in the game | Owner request + source text -> bounded task, documented reason and measurable criterion; feeds scenes, rooms and tests | [Owner decisions](owner-decisions.md), [theme decisions](../.claude/rules/data.md), [technical reasons](decisions.md), [source index](sources.md), [library](library.md). Sources precede invention; owner words and assistant advice have separate homes | Current: those records are distinct. Recorded E5: 438 catalog records, 421 saved materials, 145 quote checks. A matching quotation is not proof of every scientific interpretation. No full-paper reread in this mapping task |
| **2. Game, scene and room**: one continuous VR visit | `src/main.js` selects a room -> `src/app/lab.js` and `src/app/stage.js` keep one scene/player -> room contract runs behind its door -> event log produces report/reveal | [Architecture](../ARCHITECTURE.md), [room contract](rooms.md), [room 01 specification](rooms/01-control.md). Static ES modules reduce runtime dependencies; app does not import a particular room; shared UI avoids duplicate consent/input logic. Corridor plan follows the owner's A1 choice and [building references](building-standards.md) | Current: one implemented room, 01-control; default selection still loads it. E1 tests the saved code, E4 covers an older short Quest launch. Room 01 is a retained lab, not the accepted first product room. Full current playthrough, sustained comfort and scientific review remain open |
| **3. Consent and data**: keep participation separate from transmission | Clipboard choice -> session record flag -> room log/analysis -> result/playtest/error RPC; comparison also passes the session gate. Server contract constrains what arrives; delivery availability affects whether it arrives | `src/app/consent.js`, `src/app/session.js`, `src/engine/results.js`, `supabase/migrations/`, `supabase/schemas/01-control-1.json`, [methodology](methodology.md), [data decisions](../.claude/rules/data.md). Unnamed result fields follow the data decisions; local handwriting retention is current code, whose future behavior remains under discussion | Current: preview marker/path, no consent or accelerated runs prevent session sends; result POST returns false on failure, with no durable result queue. E1 covers client/SQL contract tests. Recorded migrations/readbacks in state are dated claims, not a fresh live database check. Retry/deduplication, disaster recovery and the separately agreed science consent are not established by them |
| **4. Tests and independent review**: catch distinct classes of error | Saved version + tests + unchanged review fingerprints -> test receipts and review findings; feeds the permitted look and PR readiness | `package.json`, `.github/workflows/test.yml`, `tests/structure.test.mjs`, `tools/review-gate.mjs`, `tools/codex-events.mjs`, `tools/finish.mjs`. Tests constrain behavior; practice review checks the person's experience; paper review compares the room with the original; CodeRabbit reviews the PR | E1 confirms CI at HEAD. E2 confirms six owner callbacks but zero reviewer starts/completions. E3 finds no current exact practice or room paper record. A green skipped CodeRabbit check is not a review. Fixture tests, configured profiles and installed hooks cannot fill those gaps |
| **5. Preview, headset and acceptance**: test the version a person actually encounters | Gates + identified served files/export -> assistant's look -> owner's one visible task -> explicit acceptance; feeds `docs/features.json` | `tools/publish-preview.mjs`, `tools/quest-look.mjs`, `tools/headset.mjs`, [measure decisions](../.claude/rules/measures.md), [VR checklist](vr-checklist.md), [features](features.json). A preview suppresses statistics; headset protection and in-headset instructions preserve safe, understandable participation | E3 currently blocks even the assistant's practice look. E4 is a five-second launch/controller sample on older game code, not current acceptance or a 45-minute result. Three corridor items pass; the smoke repair is a separate fourth true feature, not a fourth accepted corridor item. No statuses changed here |
| **6. Versions and delivery**: load a coherent game and retain a working version on failure | Trial branch -> reviewed PR into room-polish; public export -> immutable pieces + bootstrap/worker -> browser cache. Main release needs separate owner approval and a proven publishing route | `tools/export-game.mjs`, `tools/public-files.mjs`, `src/delivery-boot.js`, `src/delivery-worker.js`, [cache measurements](research/game-cache.md), [delivery experiment](research/delivery-probe.md). Hashes identify pieces, candidate core installation is atomic, old objects support old tabs. Earlier two-source downloader is a separate experiment, not imported by the game | E1/E6 cover local fixtures and dated browser measurements. E7 records different development/public versions. Direct-source Pages publication does not deploy the generated cache. Current Quest/Safari restart/eviction, live publisher round trip and independent hosted origins remain open. Paid-room entitlement is an owner requirement, not implemented by the public cache |
| **7. Library and recovery**: preserve origins and reproduce a result | Papers, datasets, code and receipts -> indexed local library + synchronized cloud copy + dated F: snapshots -> restored files; supports every upstream claim | [Locations](state.md), `docs/library/papers.json`, [research index](research/README.md), existing [knowledge entry](file:///C:/Users/admin/Documents/objekt-files/00-start-here.html). Canonical records remain beside code or in the library; the HTML is a dated navigation export | E5 checks catalog/quotes and a Drive client snapshot. E8 is an actual F: restore receipt for 2,205 library files and two source copies. It predates later changes. Cloud sync is not an independent restore; credentials, live database and later additions are outside that proof |

## Evidence ledger: which version and what it proves

| ID | Version / artifact | Supported conclusion and boundary |
|---|---|---|
| E1 | Recorded [CI run 39034862486](https://github.com/exxxit-game/youaretheobject/actions/runs/39034862486), 17 October, HEAD 2a31874; [saved API receipt](file:///C:/Users/admin/Documents/objekt-files/notes/source-audit-2026-10-17/ci-2a31874.json) and [log](file:///C:/Users/admin/Documents/objekt-files/notes/source-audit-2026-10-17/ci-2a31874.txt) | npm test, LF/CRLF guard mutations 37/37 each and normal/playtest/corridor-exit/emulated-VR smoke passed. These are saved receipts read here; remote status was not re-queried. Subsequent dirty event-bridge code is not covered by this CI |
| E2 | Current `node tools/codex-events.mjs --status`, 18 October, dirty working tree at 2a31874 | Owner events 6; review starts/completed/rejected 0; no journal lock. The command explicitly does not measure native trust. Recorded 17 October live dispatch and 18 October native configuration evidence are in [progress](progress.md); no synthetic callback or probe reviewer used here |
| E3 | Current read-only `reviewOf`, `lookOf`, `paperOf`; practice fingerprint 9cfe549bc5c61d20ab9c10e8c380d18560aedafa28e8845231e02eb024a59705 | Practice exact/own-look false; 01-control paper exact false, own-look true. An older paper report may cover its named corrections for the assistant's look; it does not supply the missing exact publication review or practice review. A completed record still requires reading its findings |
| E4 | Recorded Quest check 16 October: b42f8a0, game code 435e6d2; [progress entry](progress.md), evidence directory named there | Served main.js hash matched, XR and both controllers visible, owner could press; about 90 fps in five seconds. Not a whole room, audio/locomotion pass or sustained performance proof. Later c791a8e lifecycle/session changes are outside that device check |
| E5 | Recorded 17 October knowledge checks in [progress](progress.md) and objekt-files/notes/knowledge-2026-10-17; code baseline 2a31874 with dirty documents | 438 records / 421 materials / 145 quote checks; Drive snapshot 2,368 items and zero pending/comparable-hash differences. Previously checked search/filter/mobile layout. No cloud restore or fresh scientific validation. This task only refreshes navigation and checks generated sources/links |
| E6 | Recorded exports at 802847f: A ca591878a42bd23af60762edaf149d26551572d1c920663b7f3211f7b5bd4b68, B 4eec6911ff3c0572b434abc91c8c73cc97c92f6150563bacaa6a9f54379856ac; [cache report](research/game-cache.md). Later audited export 67a1dd1b1abe433bc53d3f896be32fc2fdf735c25890176edd4db6e680072328 in [source audit](research/source-audit.md) | A first launch 4,378,482 object-body bytes, reload 0, repaired B 908; failure retained A, rollback reused pieces. Later export first launch 4,378,652, reload 0. Different manifests explain different totals; counters exclude headers/bootstrap/update checks. These are local browser proofs, not today's provider traffic or all-device behavior |
| E7 | Recorded 17 October [branch/site observation](file:///C:/Users/admin/Documents/objekt-files/notes/source-audit-2026-10-17/branch-map.json); later CI receipt E1 | Public main 26f0944/A-Frame 1.7.1; published preview main.js matched ff7a812/A-Frame 1.8.0; remote room-polish 435e6d2; primary 3084b40. Branch-map's remote trial 267bbba predates E1. These are dated observations, not fresh remote heads; only this chat's local 2a31874 was rechecked |
| E8 | Recorded [recovery receipt](file:///C:/Users/admin/Documents/objekt-files/notes/source-audit-2026-10-17/recovery.json), 17 October 12:26 UTC, trial c791a8e; F:/objekt-project-snapshots/2026-10-17T12-26-08Z and library snapshot 2026-10-17-004858 | 637 trial files and 616 primary files restored/hash-matched, plus all 2,205 saved library files. Not current 2a31874 recovery, ignored credentials/dependencies, cloud or database restoration |

## Concrete discrepancies and boundaries

These pairs identify where a reader can take the wrong next step. Historical entries are retained, not silently rewritten.

| Pair of records | Resolution supported by evidence | Remaining action |
|---|---|---|
| `docs/decisions.md`, "A player who leaves early chooses whether to learn what it was", and `docs/rooms.md` early-leaver wording vs `.claude/rules/data.md` ethics decision of 14 October and `src/app/left-early.js` | Current code clears old marks and only offers return; it does not offer early debrief. The later owner decision matches code. The old rationale/contract wording is stale | Correct those explanatory records in a scoped follow-up; this map does not reopen the decision or certify research ethics |
| Archived studio map: two accepted corridor items and Claude agents vs current `docs/features.json`, `docs/tandem.md` and 17-18 October progress | Three corridor items are accepted in the current list. Claude retired locally; old agent availability/automatic hooks cannot be assumed in Codex | Use current role and evidence records; keep archive as history |
| `docs/research/source-audit.md` earlier zero-event/wrong-chat/no-user-hooks observations vs later `docs/progress.md` and E2 | Those observations described an earlier stage. This chat's default cwd is correct; owner events now 6. Reviewer events remain 0 | Obtain real reviewer evidence during the necessary review, not more owner-message tests |
| `docs/research/game-cache.md` earlier room-paper-present statement vs its source-audit follow-up and E3 | Later room changes invalidate the exact paper fingerprint. Own-look compatibility and exact publication review are different checks | Review current files and read findings before relying on an exact gate |
| `docs/research/delivery-probe.md` initial "no ... persistent download cache" vs later game-cache report and `src/delivery-worker.js` | Initial inventory predates the implemented public cache. However `tools/delivery-download.mjs` two-source recovery is still separate | Do not advertise multi-provider production resilience; integrate/test only in its future bounded task |
| `docs/decisions.md` "No build step" vs `tools/export-game.mjs` and direct-source Pages observation E7 | Development uses plain static modules; publication now has an explicit export step. Merging to main does not itself activate that export | Validate a production export route before any release request; no release is authorized here |
| Owner-requested paid-room purchase checks and store distribution vs current public allowlist/cache | The requirement is preserved in data decisions; no entitlement backend or native store artifact is shown by these files | Keep paid assets out of public export. Platform/payment/provider research is a proposal/evidence source, not implementation or purchase approval |
| Owner's 21 October checkpoint vs the feature list's four true rows | Three corridor rows plus one smoke repair are not four headset acceptances; the list has no weekly acceptance count | At that checkpoint use dated owner acceptance evidence, not commits, true-row totals or this map |

## Historical proposal: establish the game's review prerequisite

**One bounded result:** a traceable independent review of the current game that permits the assistant's own headset check,
or a specific, evidenced list of findings that prevents it. This is not an instruction to start reviewers in this mapping chat.

Why first: E3 shows the immediate prerequisite is missing. Download-cache, room-flow and session changes have passed
saved automated checks, but have not passed the current independent experience/scientific checks. Buying hosting,
changing engine or repeating setup audits cannot substitute for this prerequisite. A necessary review also tests E2's missing event path.

Completion for the subsequent task:

1. Identify the saved source and dirty differences, preserve the existing bridge fix, and record the practice/room fingerprints.
2. Run the required scoped practice review and paper review of 01-control on the actual files and original source.
   Check real start/stop provenance and complete reports in the existing journals; no injected records or count-only probe.
3. Resolve each finding against source/behavior; necessary repairs get appropriate tests and current fingerprints.
   If a callback fails, preserve the actual error and repair that cause rather than weakening the gate.
4. Read the reports and show current `reviewOf`/`paperOf` results plus the exact tested version. Successful completion
   means valid current records with no unresolved blocking findings, not merely two increased counters.

The own headset look follows this result; the owner's look/acceptance follows the assistant's look. CodeRabbit/PR,
publication, long measurement, paid delivery and database changes remain separate work with their existing prerequisites.
No owner action is required to read this map. The next-task recommendation is the assistant's proposal, not recorded acceptance.

## Mapping scope and verification

Read existing maps, owner/theme decisions, the board/feature list, current shell/session/transport/early-exit code,
review APIs and saved CI/recovery receipts; followed the existing delivery/source-audit reports rather than redoing them.
No full repository audit, new scientific literature review, live service query, hardware session or game-code edit.
Local structure and whitespace checks apply to the final documentation; source/link/hash checks apply to the staged
knowledge export before replacing the existing entry. Detailed results and the next step are in [progress](progress.md).
