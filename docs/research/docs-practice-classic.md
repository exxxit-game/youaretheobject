> Kept as the helper wrote it on 2026-10-14 for the comparison of our documents with how experienced teams keep theirs (the page for the owner: https://claude.ai/artifact/CC3VLWFAifPk3THwKCvGGf). Two fact-checks of that page found its errors; this file is the helper's evidence, not the page.

# How experienced software teams keep project documents — research notes

Opened 14 Oct 2026. Each claim: source, author, date, short quote (<15 words), URL, aged or not.
Anything not opened is marked "not verified".

## Parts (each gets an answer or "not found")
- A. Decision log: ADRs (Nygard 2011), adr.github.io, MADR, statuses/superseding, critiques (stale, too many)
- B. Architecture maps: matklad ARCHITECTURE.md (2021), arc42, C4, target-architecture docs
- C. Markdown board vs issue tracker: Kanban WIP limits
- D. Sources/cards/generated catalog: DRY / single source of truth (Pragmatic Programmer), "Do not edit by hand" generated files, Diataxis
- E. Testing/measurement docs: Google docguide (best practices, minimum viable docs, freshness), docs as code (Write the Docs)
- F. Archive of process history: deleting dead docs (Google), Keep a Changelog, blameless postmortems (Google SRE)
- G. Rules: no history in comments (Google "Timeless documentation"), version numbers in one manifest (package.json, lockfiles, Dependabot/Renovate), ISO 8601 dates, SemVer

## Local library check
- Paper library (objekt-files/papers, 702 files) grepped for ADR, Nygard, Diataxis, docs as code, matklad, Keep a Changelog, blameless postmortem: no hits. Not a research-paper topic.
- Repo notes already touching this: docs/research/studio-process-3.md (Nygard 2011 and Google docguide best practices, read 2026-10-12 or so), studio-process.md Part 7 (game postmortems). Re-opened below rather than copied.

## A. Decision log (ADRs)

- [read] Michael Nygard, "Documenting Architecture Decisions", Cognitect blog, 15 Nov 2011.
  https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions
  Good: "The whole document should be one or two pages long." Sections Title, Context, Decision, Status, Consequences.
  Reversals: "keep the old one around, but mark it as superseded". Records in repo, numbered, "Numbers will not be reused."
  Why: "Nobody ever reads large documents, either." After months of use rotating developers "appreciate the degree of context".
  Aged? Core point holds (15 years old, still the reference everyone cites); location doc/arch/adr-NNN.md is one convention among several.
- [read] adr.github.io (ADR GitHub org, page (c) 2026, no page date): "An Architectural Decision Record (ADR) captures a single AD and its rationale."
  "The collection of ADRs ... constitute its decision log." https://adr.github.io/
- [read] MADR 4.0.0, released 2024-09-17, https://adr.github.io/madr/ : status field
  "{proposed | rejected | accepted | deprecated | … | superseded by ADR-0123", date "{YYYY-MM-DD when the decision was last updated}",
  file per decision "NNNN-title-with-dashes.md"; Consequences and Confirmation optional ("Feel free to remove"). Current (2024 release).
- [read] Olaf Zimmermann, "How to create ADRs — and how not to", 3 Apr 2023 (page shows update 3 Sep 2026),
  https://www.ozimmer.ch/practices/2023/04/03/ADRCreation.html
  Good: "Select by priority and significance"; "Disclose your confidence level"; length: simple case "one presentation slide with few sentences is enough".
  Bad (anti-patterns): Free Lunch Coupon "No consequences are documented, or only consequences that seem to be harmless";
  Blueprint or Policy in Disguise: style "not that of a journal reporting activities and their outcome";
  Mega-ADR / Novel: "an entire Software Architecture Document (SAD) is squeezed into a single ADR"; "ADR logs should not turn into epics."
  Outdated ADRs: mark superseded or remove from log. Current (updated 2026).
- [read] Olaf Zimmermann, "How to review ADRs — and how not to", 5 Apr 2023 (updated 28 Aug 2026),
  https://www.ozimmer.ch/practices/2023/04/05/ADRReview.html : review checklist asks "Does the ADR define a validity period or review date?";
  anti-pattern Pass Through "Few, if any, comments are made". Current.
- [read] Martin Fowler, bliki "Architecture Decision Record", 24 Mar 2026, https://martinfowler.com/bliki/ArchitectureDecisionRecord.html
  "Keep the ADR short and to the point - typically a single page."
  "Once an ADR is accepted, it should never be reopened or changed" (supersede instead).
  Statuses proposed / accepted / superseded (with link). Monotonic numbers in file name, e.g. "0001-HTMX-for-active-web-pages"; store in doc/adr in the repo.
  Repo does not work for decisions spanning more than one code base. Current (2026).
- [read] Thoughtworks Technology Radar, "Lightweight Architecture Decision Records", first Nov 2016 (Trial), Adopt May 2018,
  https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records :
  store "in source control" "instead of a wiki or website" so they stay "in sync with the code itself". Blip no longer on current radar (it faded = became mainstream, not reversed; that reading is mine).
- [read] Christoph Kappel, "Learnings from using ADR in a real project", 18 Aug 2021,
  https://blog.unexist.dev/documentation/myself/2021/08/18/learnings-from-using-adr-in-a-real-project.html
  BAD: scope never agreed, "we never really found out and are having a wild mix now"; "it never got much buy in by the teams";
  one page with "40-50 records included, is quite difficult"; with "about 60" records they "had no means of verifying them".
  Lesson: keep scope, separate micro/macro architecture, make records checkable. Holds (2021, failure modes still reported).
- [abstract only, numbers not used] Ahmeti, Linder, Wohlrab, "Exploring the Adoption and Effectiveness of ADRs in Agile Software Development: An Action Research Study", womENcourage 2023,
  https://research.chalmers.se/en/publication/538920 : teams found ADRs useful; worries about "documenting too much or too little", placement, keeping docs up to date. Full text not opened.
- Consensus search: quota exhausted ("You've used all 30 searches this month"); no further paper search there.

## B. Architecture maps

- [read] matklad (Aleksey Kladov), "ARCHITECTURE.md", 6 Feb 2021, https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
  Good: bird's eye view + codemap ("where's the thing that does X?") + invariants, esp. absence of something; cross-cutting concerns section.
  "Keep it short: every recurring contributor will have to read it."
  Only "things that are unlikely to frequently change"; "Don't try to keep it synchronized with code"; "revisit it a couple of times a year".
  Name files/modules but do not link them (links go stale); readers use symbol search.
  Aged? Holds; written for 10k-200k line projects (ours is smaller, so even shorter fits).
- [read] Simon Brown, C4 model, https://c4model.com/ and https://c4model.com/diagrams (site (c) current; talk July 2019):
  "you don't need to use all 4 levels of diagram; only those that add value";
  "the system context and container diagrams are sufficient for most software development teams." Holds.
- [read] arc42 overview, https://arc42.org/overview ((c) 2003-2026, "Proven in practice since 2005"): 12 sections incl. 4 Solution Strategy, 5 Building Block View, 9 Architectural Decisions, 11 Risks & Technical Debt, 12 Glossary; "tailorable to your specific needs"; lighter "arc42 canvas" offered.
- [read] arc42 docs section 9, https://docs.arc42.org/section-9/ : record "Important, expensive, large scale or risky architecture decisions including rationales"; form: ADRs, or a "list or table, ordered by importance and consequences"; Tip 9-1 "Document only architecturally relevant decisions!"; "Avoid redundant texts. Refer to section 4". Holds.
- [read] Malte Ubl, "Design Docs at Google", 6 Jul 2020, https://www.industrialempathy.com/posts/design-docs-at-google/
  (bears on a target-architecture / "finished picture" doc) BAD: "In practice we humans are bad at updating documents";
  amendments pile up "more akin to the US constitution with a bunch of amendments"; docs "tend to get out of sync with reality over time".
  Good: "If the designed system hasn't shipped yet, then definitely update the doc." Mini design doc 1-3 pages for small changes. Holds.

## E (and cross-cutting). Google documentation guide

- [read, raw source] Google Style Guides, docguide "Documentation Best Practices", https://google.github.io/styleguide/docguide/best_practices.html
  (raw: github.com/google/styleguide gh-pages docguide/best_practices.md; last commit touching the file 2025-01-17, page itself undated)
  Minimum viable documentation: "A small set of fresh and accurate docs is better than a large assembly of "documentation" in various states of disrepair."
  "Docs work best when they are alive but frequently trimmed, like a bonsai tree".
  Update docs with code: "Change your documentation in the same CL as the code change".
  Delete dead docs: "Dead docs are bad. They misinform, they slow down"; "Default to delete or leave behind if migrating. Stragglers can always be recovered."
  Duplication is Evil: "Do not write your own guide to a common Google technology or process. Link to it instead."
  Docs kept elsewhere: "clearly point to those locations from your project directory" (README link).
  "Why" explanations belong in inline comments (method docs = contract). Holds.
- [read] Google docguide "Philosophy", https://google.github.io/styleguide/docguide/philosophy.html (undated):
  "Brief and utilitarian is better than long and exhaustive"; "Plain text not only suffices, it is superior"; "Incremental improvement is better than prolonged debate". Holds.
- [read] Google developer documentation style guide, "Timeless documentation", last updated 2024-10-15,
  https://developers.google.com/style/timeless-documentation
  "In general, document the current version of a product or feature."
  Avoid "now", "new", "currently", "latest", "soon", "as of this writing", "existing", "does not yet":
  they "can render such documentation inaccurate, outdated, or unmeaningful".
  If needed give a reference point with full date: "The January 14, 2021 release of BigQuery includes a new resource panel."
  Exceptions: time-stamped content (blog posts, release notes, press releases). Holds. (Bears on G: its own example carries the year.)
- [read, full chapter] Tom Manshreck, "Documentation", ch. 10 of Winters, Manshreck, Wright (eds.), *Software Engineering at Google*, O'Reilly, 2020;
  free online copy https://abseil.io/resources/swe-book/html/ch10.html
  BAD (what failed): the GooWiki: "Because there were no true owners for documents, many became obsolete."
  "7 to 10 documents ... on setting up Borg, our production compute environment, only a few of which seemed to be maintained".
  Footnote: "around 90% of the documents had no views or updates in the previous few months."
  GOOD (the fix): docs moved under source control with owners and canonical locations; "the documentation began to dramatically improve"; engineers feared review would lower quality, "But that wasn't the case."
  Canonical doc: "determine the primary source and consolidate ... (or deprecate the duplicates)."
  Freshness dates: metadata like "freshness: { owner: `username` reviewed: '2019-02-27' }", email reminder when untouched ~three months;
  "Last reviewed by..." byline increased adoption.
  Deprecating: "either remove it or identify it as obsolete (and, if available, indicate where to go for new information)."
  Discussion docs: once a shared doc becomes "a stable historical record", move it somewhere permanent with ownership and version control.
  Aged? Book 2020; practices hold; their tooling (go/ links, g3doc) is Google-internal.
- [read] Write the Docs, "Docs as Code" (Eric Holscher & the Write the Docs community; undated), https://www.writethedocs.org/guide/docs-as-code/
  "writing documentation with the same tools as code": issue trackers, Git, plain-text markup, code reviews, automated tests.
  "You can block merging of new features if they don't include documentation". Page names no drawbacks. Holds.
- [read] Daniele Procida, Diátaxis (https://diataxis.fr/ ; author per https://diataxis.fr/colophon/ "Diátaxis is the work of Daniele Procida"; developed over years, ideas from his Divio work 2014-2021; no page dates):
  four forms "tutorials, how-to guides, technical reference and explanation".
  BAD: "When these distinctions are allowed to blur, the different kinds of documentation bleed into each other." (https://diataxis.fr/map/)
  GOOD (https://diataxis.fr/how-to-use-diataxis/): no "empty structures for tutorials/howto guides/reference/explanation with nothing in them";
  "Use Diátaxis as a guide, not a plan"; "Work one step at a time"; ask "What single next action will produce an immediate improvement here?" Holds.
  Fit note (mine): our docs are mostly reference (sources, cards, state) and explanation (decisions, architecture); a board is neither, it is a work queue.

## D. Sources list, cards, generated catalog (single source of truth)

- [read] Andy Hunt & Dave Thomas, *The Pragmatic Programmer*, 20th Anniversary Edition, tips list on the publisher's site https://pragprog.com/tips/
  (page shows no year; the 20th anniversary edition year 2019 is from memory, unverified here)
  Tip 15 DRY: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."
  Tip 13 "Build Documentation In, Don't Bolt It On": "Documentation created separately from code is less likely to be correct and up to date."
  Tip 25 "Keep Knowledge in Plain Text": "Plain text won't become obsolete." Tip 28 "Always Use Version Control". Holds.
- [read] Bill Venners interview with Dave Thomas (and Andy Hunt), "Orthogonality and the DRY Principle", Artima, 10 Mar 2003, https://www.artima.com/intv/dry.html
  DRY is not only code: "A system's knowledge is far broader than just its code" (schemas, test plans, build, documentation).
  BAD: several representations "will most likely fall out of step with each other".
  GOOD: tools "let you have single, authoritative representations that then generate non-authoritative work products";
  build a generator only when it pays off. Holds (this is exactly the data-file -> generated catalog pattern).
- [read] Go command documentation, "Generate Go files by processing source", https://pkg.go.dev/cmd/go (current Go docs; go.dev/s/generatedcode redirects here):
  "To convey to humans and machine tools that code is generated, generated source should have a line" matching
  "^// Code generated .* DO NOT EDIT\.$" before the first non-comment text. Holds; same idea as our "Do not edit by hand" header.
- [read] GitHub Docs, "Customizing how changed files appear on GitHub",
  https://docs.github.com/en/repositories/working-with-files/managing-files/customizing-how-changed-files-appear-on-github :
  .gitattributes e.g. "search/index.json linguist-generated" -> file "hidden by default in diffs" and "ignored for the repository's language statistics". Current.

## C. Board in Markdown (WIP limits, backlog)

- [read] John Coleman, Daniel Vacanti et al., *The Kanban Guide*, v2025.5, updated 1 May 2025, https://kanbanguides.org/english/
  WIP = "The number of work items started but not finished."
  "Kanban system members must explicitly control the number of work items in a workflow from started to finished."
  Start an item "only when there is a clear signal that there is capacity to do so." Three practices: define and visualize workflow, actively manage items, improve workflow.
  (The Guide says "WIP control", not "WIP limits"; no Little's Law on the page.) Current.
- [read, via browser; WebFetch got only menus] Dan Radigan (Atlassian), "Working with WIP limits for kanban", undated, https://www.atlassian.com/agile/kanban/wip-limits
  GOOD: WIP limits "reduce the amount of work "nearly done""; "make blockers and bottlenecks visible"; "Ramping down on one issue and up on another isn't free".
  New teams: "Resist the temptation to arbitrarily adjust them at first." A consistent breach means the limit is too tight or the process inefficient.
  BAD (anti-patterns): "WIP limits are raised as needed so the team doesn't hit them anymore."; big "background task" masking idle time.
  No limit needed on Done. Holds.
  Fit (mine): our "waiting for the owner — at most three" is a WIP limit on the owner's queue; the anti-pattern to watch is quietly raising it.
- [read] Ryan Singer, *Shape Up* (Basecamp), ch. "Bets, Not Backlogs", https://basecamp.com/shapeup/2.1-chapter-07 (book year not on page; 2019 from memory, unverified)
  BAD (long backlogs): "Backlogs are a big weight we don't need to carry."; the pile makes "a feeling like we're always behind even though we're not."
  GOOD: no central backlog; people keep their own lists; "Really important ideas will come back to you." Holds; fits "thoughts ahead, one line each" kept short.

## F. Archive, change records, mistakes

- [read] Olivier Lacan, *Keep a Changelog* 1.1.0, https://keepachangelog.com/en/1.1.0/ (page's own changelog: latest 1.1.2, 2024-09-27)
  A changelog is "a curated, chronologically ordered list of notable changes for each version of a project"; changelogs are "for humans, not machines".
  Groups: Added, Changed, Deprecated, Removed, Fixed, Security; "Unreleased" section at top; latest version first; release date per version.
  BAD practices named: commit-log diffs as changelog (noise), ignoring deprecations, confusing regional dates, omitting changes.
  ISO 8601 is "the recommended date format for changelog entries" (largest to smallest unit, unambiguous). Holds.
  Fit (mine): our decisions.md is closer to an ADR log than a changelog; a game shown to players with versions might want a short changelog; process history is neither.
- [read] John Lunney & Sue Lueder, "Postmortem Culture: Learning from Failure", ch. 15 of *Site Reliability Engineering* (Google/O'Reilly, 2016; page (c) 2017),
  https://sre.google/sre-book/postmortem-culture/
  Postmortem = "a written record of an incident, its impact, the actions taken"; "writing a postmortem is not punishment";
  "an unreviewed postmortem might as well never have existed"; finalized ones go into a shared repository; triggers defined in advance. Holds.
- [read] Rogers, Suriar, Lueder, Deo, Sudhakar, "Postmortem Culture: Learning from Failure", ch. 10 of *The Site Reliability Workbook* (2018),
  https://sre.google/workbook/postmortem-culture/
  BAD: "Without a formal tracking process, action items from postmortems are often forgotten, resulting in outages."
  Treynor Sloss: "a postmortem without subsequent action is indistinguishable from no postmortem."
  "trying to change human behavior is less reliable than changing automated systems and processes."
  Bad example: equal priority on all action items, "little or no ownership", published four months late, "Animated language".
  GOOD: one owner per postmortem; action items get owner, tracking number, priority; searchable store (Requiem); reading clubs. Holds.
  Fit (mine): a two-person studio's "mistake" record works if each lesson becomes a check (test, rule) rather than a note asking the agent to behave.
- [read] Chris Beams, "How to Write a Git Commit Message", 31 Aug 2014, https://cbea.ms/git-commit/
  "A diff will tell you what changed, but only the commit message can properly tell you why."
  Rule 7: "Use the body to explain what and why vs. how". Holds. (Supports "history lives in git": the log is the archive of why.)

## G. Rules: no history in comments, versions, dates

- [read] Google Engineering Practices, "What to look for in a code review", https://google.github.io/eng-practices/review/reviewer/looking-for.html (undated)
  "Usually comments are useful when they explain why some code exists"; if unclear, "the code should be made simpler."
  "If the CL deletes or deprecates code, consider whether the documentation should also be deleted." Holds.
- [read] Linux kernel commit c6495aaa, Bryan Wu, 30 Apr 2008 (committed by Linus Torvalds),
  https://android-kvm.googlesource.com/linux/+/c6495aaabfaa8256c292c54b48ab081f4d86ad79
  "kallsyms: nuke all ChangeLog, this should be logged by git";
  "it was a mistake to add a Changelog in the first place"; "The 'Changelog' should be kept by the version control system, and not the source code itself."
  A real BAD-then-fixed case of history in a source file. Holds.
- GNU Coding Standards "Change Log Concepts" https://www.gnu.org/prep/standards/html_node/Change-Log-Concepts.html : connection refused, NOT VERIFIED.
- [read] npm Docs v11, "package-lock.json", https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json
  "describes the exact tree that was generated, such that subsequent installs are able to generate identical trees";
  "Describe a single representation of a dependency tree"; "This file is intended to be committed into source repositories". Current (npm 11).
- [read] Renovate docs, "Custom Manager Support using Regex", https://docs.renovatebot.com/modules/manager/regex/ (docs for Renovate 44.x)
  with customManagers/regex "you can configure Renovate so it finds dependencies that are not detected by its other built-in package managers";
  pattern: a marker comment "# renovate: datasource=github-tags depName=org/repo ..." next to the version; fields managerFilePatterns, matchStrings, depNameTemplate, datasourceTemplate. Current.
  Fit (mine): a vendored A-Frame with no package.json is invisible to standard bots; one marked version line can be watched.
- [read] GitHub Docs, "Dependabot supported ecosystems and repositories",
  https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories (first 100k of 149k chars read)
  works on repos with "a dependency manifest or lock file for one of the supported package managers"; vendoring only "For some package managers" (Bundler, Go modules per table).
  Page says nothing about versions in HTML script tags or vendored JS: Dependabot for that case NOT VERIFIED (absence on page, not a stated limit).
- [read] Tom Preston-Werner, Semantic Versioning 2.0.0, https://semver.org/
  MAJOR.MINOR.PATCH; "Once a versioned package has been released, the contents of that version MUST NOT be modified." Holds.
- [read] Go project commit 2b6eb11, Shenghou Ma, 6 Feb 2014, https://go.googlesource.com/go/+/2b6eb111e2c1f610a2acfa82dcbf4d43acc6dd8e
  "doc/install.html: get rid of explicit version number in docs." so the file need not be edited each release. GOOD case. Holds.
- [read] GnuCash developer list, Donald Allen and Derek Atkins, 28 Apr 2010, https://lists.gnucash.org/pipermail/gnucash-devel/2010-April/028253.html
  BAD: "Hard-coding the release number in multiple places and having a list of places to "fix" is doomed to fail."
  Failure mode: "Someone will add a new place where the release number lives and will forget to update the list."
  Counterpoint (Atkins): no way to keep it in one place across branches, website and docs, so a checklist. Holds as a description of the trade-off.
  Fit (mine): ~37 files naming "A-Frame 1.8.0" is the GnuCash case; the Go/Node fix is one source (vendor folder name or one manifest line) and other docs say "the pinned A-Frame (see X)", or a unit test that fails when any file names a different version.
- [read, via browser; WebFetch got 403] ISO, "ISO 8601 — Date and time format", https://www.iso.org/iso-8601-date-and-time-format.html (current editions ISO 8601-1:2019 and 8601-2:2019)
  "01/05/22 could mean January 5, 2022, or May 1, 2022"; "in a business context it can be very expensive";
  format "YYYY-MM-DD", order "year, month, day, hour, minutes, seconds". Holds.
  Fit (mine): "14.10" without a year is unambiguous only inside one year and one locale; ISO "2026-10-14" sorts as text and survives the year change. Keep a Changelog and MADR both use YYYY-MM-DD; Google SWE freshness metadata uses '2019-02-27'.

## E. Testing and measurement docs (performance baseline)

- [read] Brendan Gregg, "Active Benchmarking", last updated 20 Apr 2014, https://www.brendangregg.com/activebenchmarking.html
  BAD: "casual benchmarking: you benchmark A, but actually measure B, and conclude you've measured C."
  passive benchmarks are "commonly executed and then ignored until they have completed".
  GOOD: while it runs, "analyze the performance of all components involved using other tools"; be able to say what limits the result, with evidence. Holds.
- [read] Milica Mihajlija, "Performance budgets 101", web.dev, last updated 2018-11-05, https://web.dev/articles/performance-budgets-101
  "A performance budget is a set of limits imposed on metrics that affect site performance."; enforce in the build/CI (Lighthouse CI, bundlesize);
  Lighthouse scores: use "as guidelines". Point holds; its numbers (170 KB, TTI 5 s on 3G) are AGED (2018; TTI is no longer a Core Web Vital).
  Fit (mine): our "baseline measured the same way each time" matches; the stronger form is a limit that fails a check, not a number in a doc.

## A (continued)

- [read] Josef Blake, "When Should I Write an Architecture Decision Record", Spotify Engineering, 14 Apr 2020,
  https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record
  "An ADR should be written whenever a decision of significant impact is made."; small ones too: "Enough small decisions can compound into a future problem";
  backfill: "if a decision was made but it was never recorded, can it be a standard?"
  GOOD observed: "Future team members are able to read a history of decisions and quickly get up to speed."
  BAD before ADRs: during ownership changes "a lot of context/knowledge was lost". Holds.

## F (continued) — keeping the owner's full words off the public repo

- [read] GitHub Docs, "Removing sensitive data from a repository",
  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
  "You cannot remove sensitive data from other users' clones of your repository."; forks keep it; cached views by SHA;
  rewriting history changes hashes, "High risk of recontamination". Current.
  Fit (mine): supports our choice to keep the full history of the owner's words out of the public repo from the start: once pushed, it cannot be taken back.
- [read] UK Government Digital Service, *The GDS Way*, "Documenting architecture decisions", last reviewed 5 Mar 2026, review due 5 Sep 2026 (overdue on 14 Oct 2026),
  https://gds-way.digital.cabinet-office.gov.uk/standards/architecture-decisions.html
  Store "in version control so there is a record of what was changed, who by, and when". Nygard template.
  Superseded: "the old ADR must be clearly marked as “superseded”" with a link to the new one.
  Never-implemented decision may be edited; if any part was implemented, write a new ADR.
  "An ADR isn't a complete description of a software system or architecture." Other docs updated when an ADR is accepted. Current.
  (Side note: the page's own review date has lapsed, a live example of freshness dates needing someone to act.)
- [read] Netresearch, TYPO3 extension nr-llm 0.32 docs, "Architecture Decision Records", rendered 21 Aug 2026,
  https://docs.typo3.org/p/netresearch/nr-llm/0.32/en-us/Adr/Index.html
  "It is expected to become historically wrong; what it must never do is look current when it is not."
  "The link is written from both ends." (Supersedes/Superseded with date); "Tests/Unit/AdrLifecycleTest.php fails when only one end of an ADR-to-ADR link is written." Current.
  Fit (mine): a mechanical check like this suits an agent-written decisions.md: a unit test that every "superseded" names a live successor.
- [read] Renovate docs, "html" manager, https://docs.renovatebot.com/modules/manager/html/ : updates script/link tags pointing to cdnjs (and SRI hashes) in files matching /\.html?$/; datasource only cdnjs. Not useful for a vendored copy. Current.

## D (continued) — keeping generated files honest

- [read] templ docs, "CI/CD", https://templ.guide/developer-tools/cicd (undated, current): run the generator in CI then `git diff --exit-code`; the pipeline fails when "the generated files are not up-to-date". Holds.
- [read] OpenTitan (lowRISC) commit, Rupert Swarbrick, 27 Aug 2021, https://opensecura.googlesource.com/3p/lowrisc/opentitan/+/ff1f5170bdbafa8ab03e44e41705a749421688c3%5E%21
  BAD then fixed: "git diff doesn't report untracked files"; replaced by `git status --porcelain` in an is_clean helper. Holds.
  Fit (mine): our "Do not edit by hand" catalog/library is only safe if `npm test` regenerates and compares; a header alone does not stop an agent edit.

## B / E (continued) — lean documentation

- [read] Scott W. Ambler, "Core Practices for Lean/Agile Documentation", Agile Modeling, undated (site (c) 2002-2026; linked from Google docguide best practices),
  https://www.agilemodeling.com/essays/agileDocumentationBestPractices.htm
  "Document stable concepts, not speculative ideas" (bears on a target-architecture "finished picture" doc).
  "Update only when it hurts" (tension with Google's "same CL" rule: Ambler accepts a slightly stale doc until it costs something).
  Single Source Information: "record the information once where it enhances your work the most".
  "Prefer executable specifications over static documents" (tests both specify and validate).
  "overviews/roadmaps are generally preferred over detailed documentation"; comprehensive docs: "it increases your chance of failure". Holds.

## Not verified / not done
- GNU Coding Standards "Change Log Concepts": site refused connection (WebFetch and browser). Not verified.
- Atlassian WIP page: WebFetch returned menus only; read through the browser instead (done).
- Ahmeti et al. 2023 ADR action research: abstract only, no numbers taken.
- Dependabot and vendored JS / HTML script tags: the page is silent; "cannot" is NOT VERIFIED.
- Shape Up book year (2019) and Pragmatic Programmer 20th anniversary edition year (2019): from memory, pages do not state them.
- Consensus paper search quota exhausted for the month; no empirical study on doc practices opened in full.
- Nothing in the paper library (objekt-files/papers) on this topic.
