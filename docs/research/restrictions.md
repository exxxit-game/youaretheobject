# Restrictions on the agent: how they should work (analysis of 13.10.2026)

The owner's request (13.10, his words on docs/board.md): restrictions upon restrictions pile up and get in the way;
think through how it should work, from Anthropic's advice, people's experience and what we did in Cosmogram; measure
it against a million players of every country and age, over the long run. The evidence, kept beside this file:
- [restrictions-sources.md](restrictions-sources.md): Anthropic's docs and posts, GitHub's, practitioners (English,
  Russian), general engineering (alarm fatigue, Google SRE, Reason 2000, Hollnagel 2015), each with its date and fit.
- [restrictions-inventory.md](restrictions-inventory.md): every restriction we have (45 rows) and how often each fired
  in 475 transcripts (08.10–13.10), with real catches against friction.
- Cosmogram (exxxit-game/cosmogram-app, read 13.10): its hooks and rules over time, from its git history.
- The owner's 910 messages (objekt-files/notes/owner-messages.md, 09.10–13.10): what he asks to protect, what he
  calls friction.
How each of us is built, and the circles we keep coming back to: [docs/circles.md](../circles.md).

## What the sources share (each line backed in restrictions-sources.md)

1. A rule in text is a request; a limit that must hold is mechanical (a hook, a permission rule, a server rule).
   Anthropic: "Put guardrails in hooks"; "a request, not a guarantee" (features overview).
2. Block hard only what cannot be undone or leaks a secret; log or warn the rest (Crosley: "Two classes get hard
   blocks"; auto mode's defaults: force push, production deploys, irreversible deletion).
3. Too many blocks or prompts get ignored or switched off: Anthropic's users approve "93% of permission prompts";
   "After the tenth approval you're clicking through" (best practices); alarm fatigue grows with "a dose-response"
   (Hravnak 2018); "you will turn it off inside a day" (abrarqasim.com).
4. A client-side guard stops slips; the real boundary sits where the agent cannot reach it: the server, the agent's
   own identity, a sandbox. "[A Bash rule] isn't a security boundary around the program" (permissions docs); "a
   determined one can slip any string heuristic" (McMillan); "give the agent its own identity … with write access
   only" (charles-337); GitHub's own agent "can only push to that branch", and its requester cannot approve its pull
   request (GitHub docs). Issue #61953 shows the arms race a client guard invites: rule, hook, workaround, hook,
   "(next circumvention TBD)".
5. Make it undoable rather than guarded: commit often, revert easily (Anthropic teams; DORA 2025: AI's benefits
   "depend on respondents' frequency of version control commits"; Reason 2000: build systems that "tolerate the
   occurrence of errors").
6. Add a guard after a real failure; remove what never fires (features overview: "You don't need to configure
   everything up front"; Shankar; Google SRE: "Every page should be actionable"; abrarqasim: "delete the ones that
   never fired"). Swatting each failure "one by one" is the person approach (Reason 2000).
7. Gate at commit, push or stop, not in the middle of work, and give a gate a fuse (Shankar: "Blocking an agent
   mid-plan confuses or even frustrates it"; Claude Code overrides a Stop hook after eight blocks in a row).

Not found: an Anthropic text against the number of hooks as such; a before/after write-up of removing hooks.

## What we have (restrictions-inventory.md)

45 restrictions: 18 block an action, 4 demand an action before a turn ends, 4 gate what the owner meets, 10 check at
commit, push or on GitHub, 7 are text rules, 2 are start lines and a log. Since the process review of 11.10:
- The command guard refused 4 times in 10,237 calls, every one false (0 real catches). The variants added after
  CodeRabbit's remarks never fired.
- The Stop hook held 39 times in 301 runs: 6 real (my own unsaved work), 10 mechanical (bring room-polish up, one
  command each), 23 from one pair of checks that lock each other: a helper saves a paper outside the repository, the
  library test then fails every commit, and the Stop hook holds every turn for the unsaved work.
- Commit and push checks stopped 31 times: 11 for doc upkeep, 9 the library test (7 while helpers were adding
  papers), 5 the start-message size, 5 secret matches (4 false), 1 real (the vendored inspector's line ends).
- Gates before the owner: one real catch (a browser restart refused while he wore the headset, 13.10); the review
  gate fired after he had been called to the headset, twice.
- Claude Code's own classifier refused both pushes to main that had his word (11.10).

The decisive fact (read from GitHub 13.10): the ruleset on main requires a pull request and the `test` check, and
**0 approvals**; the token the agent works with has **admin** rights. So "main only on his word" rests on our
client-side guard alone, which can be bypassed by forms it does not know, and the agent's credential could change
the ruleset itself. This is why every new CodeRabbit remark found another form to add.

Cosmogram went the same way: hooks 1 (25.08) → 53 (30.09), then cut to 12 the same day ("раздутые правила, хуки и
записи сами мешали работе", commit 569191c); CLAUDE.md 5.8 → 35 KB → 8 KB; some hooks never ran (the hook shell had
no bash or node), and reminders written to stderr never reached the agent. What held there: hard denies on
irreversible actions (no incident), heavy checks on GitHub instead of the laptop, one dispatcher for all hooks.

## The measure: a million players, the long run

What a million players changes is what can be lost: the live site, the players' data, the keys. Locks that hold
these are server-side and scale with nothing (GitHub's ruleset, the database's roles, the keys kept off the laptop).
A guard that parses command text grows with every new command form and every new tool, never stops a determined
path, and costs every call. So the long-run shape is: few locks, outside the agent's reach, at the points of no
return; everything else undoable and visible.

## Proposal

The principle (the sources above, and his rule of 11.10 already in docs/owner-decisions.md): a lock only where a
mistake cannot be undone or costs his time; the lock where it cannot be bypassed; a new lock only after a real
incident, and it replaces something; a lock that has not fired in a month is weighed for removal; gates at commit,
push or stop.

The one choice that is his, main:
- A. The agent gets its own GitHub identity (a second, machine account) with write access, not admin; main's ruleset
  requires one approval; his "Approve" click on the pull request is his word, then it merges. The merge refusals in
  tools/claude-guard.mjs and the OBJECT_LIVE step of the pre-push hook go; the classifier's refusals of approved
  pushes go with them (nothing is pushed to main). Cost: his clicks once (the account, an invitation, a token for
  the laptop) and one click per release. Holds against any command form and any future tool.
- B. As now, but the variants that chase command forms go (those added 13.10 and the GIT_CONFIG_GLOBAL/SYSTEM ones);
  `gh pr merge` and the pre-push step stay. Cost: none; the credential stays admin.
- C. As now.
Recommended: A (sources 4 and the measure); B if a second account is not wanted.

What follows from his rule without a new choice (each removes or narrows; none adds):
1. The library test leaves the commit check (it reads a folder no commit changes); it stays in `npm test`, on GitHub
   and at session start. Ends 23 of the 29 "not saved" holds.
2. The Stop hook brings room-polish up itself (`git merge --ff-only`, undoable) instead of asking for it.
3. The review-record refusal blocks writes to the record's path only, not code that names it (6 firings, all false).
4. The papers-library refusal matches the library's real path only (its one firing was a stray folder elsewhere).
5. A CodeRabbit remark that finds another way round a client-side guard is answered with principle 4, not with a new
   form; a slip it finds is fixed.
6. docs/mistakes.md no longer asks a guard for each mistake: a recurring mistake goes to docs/circles.md with what
   breaks its circle, which may be a design change, a lock moved to the server, or a guard removed.

## Fits the owner's recorded words (docs/owner-decisions.md and its history)

Protected as he asked: main (only on his word), the live database (his hand), his keys, the players' results, check
quality (two fact-checks; the reviewer closes its own remarks). Removed as he asked: what obstructs and does not
catch. His push-guard «Оставить как есть» (11.10) and the main lock «Звучит логично. Да.» (12.10) are kept or
replaced only by his choice of A, B or C.
