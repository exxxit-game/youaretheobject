# Our mistakes with an AI coding agent, and what others report about the same (research 14.10.2026)

> The owner's request (14.10.2026, translated from Russian): collect a big list of all our mistakes, ours and
> Cosmogram's, and see what people say about each. Part 1 is read from our own records only; Part 2 from
> forums (Reddit through its RSS, Hacker News through hn.algolia.com) and Anthropic's own docs. Quotes from our
> records that were in Russian are translated, and marked so. A plain search: no fact-check (his rule of 14.10).
> Marks: [read] = the page or thread was opened and the quote taken from it; [seen] = only a listing or snippet.
> Reddit and HN names are pseudonyms; "experience" is only what the person says, unverified.

## Part 1. Our mistake patterns (from our records)

Records: circles = docs/circles.md; mistakes = docs/mistakes.md (line = its line number on 14.10); cosmo = docs/research/projects/cosmogram.md; cosmo-srv = docs/research/projects/cosmogram-server.md;
h13, h13-2, h13-3, h13-4, h14 = docs/audit/handoff-2026-10-13*.md and handoff-2026-10-14.md. Dates are 2026.

P1. A guard (hook, rule form) for every complaint: Cosmogram's hooks 1 (25.08) to 53-54 (30.09), cut to 12 the same
    day; the bar for a new hook fell from 3-5 repeats to 1; here nine command forms added 13.10 after CodeRabbit's
    remarks; after 11.10 the command guard refused 4 times in 10,237 calls, all false (circles 1; cosmo).
P2. Rules written until nobody reads them: Cosmogram's CLAUDE.md 5.8 KB (25.08) to 35 KB (30.09), 451 memory files,
    "150+" rules never searched before acting (24.09); 24 server mistakes came after a written rule for the same
    kind already existed (circles 2; cosmo-srv section 1).
P3. Two checks that lock each other: Cosmogram's worst-case gate against its full-suite warning (02.10); here the
    library test and the Stop hook, loops of 25 tries (12.10) (circles 3).
P4. The owner called into the headset before the check had passed: 10.10 twice, 11.10, 13.10 (circles 4; h13).
P5. Rounds of re-checks and fixes on small pages, each round making new errors: 12.10 "the tenth" check; 13.10 nine
    tips in three rounds of two fact-checks, the menu in four review rounds plus a fifth; fact-check launches 42 on
    12.10 and 48 on 13.10 (circles 5, 5a, 5b; h13-4).
P6. Numbers, names and claims written from memory: the baseline's times (13.10), "transcripts deleted after 30 days"
    (13.10), paper titles, the plaque's size, a code section 3305, the headset word ENABLED (it prints CLOSE);
    Cosmogram's invented "sound radar" promised to players (27.08, removed 20.09) (circles 6; mistakes lines 21, 38,
    55, 56; cosmo; h13).
P7. My own first idea before the documented pattern or the source: the game's menu (13.10) built my way, patched
    four rounds, ending as Meta's theater mode; the exit sign drawn three times (lines 30); the headset check built
    "as only a tool" (line 58); a room designed before its paper was read (line 11) (circles 13; mistakes).
P8. Process work crowding out the product: Cosmogram "two months of starting" (07.10), 115 of 1538 commits on its own
    tooling; here 12.10 0 game commits to 96 process; 13.10 157 commits, 12 to the game (circles 7, 5a; cosmo).
P9. Heavy checks on the owner's laptop: Cosmogram ran 330+ Playwright guards 1436 times in one 21-day session; the
    full suite froze the laptop 40 minutes (circles 8, closed; cosmo).
P10. Guards that silently do not run or are blind: Cosmogram's hooks failing to start and about 12 of 54 printing to
    a stream the agent never sees; 3 Supabase hooks never fired on a real deploy (30.09); here a CRLF-blind check, a
    folder whose git ran no hook, a publish copy with no hook (circles 9; mistakes lines 48, 50, 53; cosmo-srv).
P11. The agent writing straight to the live thing: Cosmogram 1385 of 1538 commits to main; 16 live deploys with wrong
    content (placeholders, retyped files; 13 of them after the rule), 11 git-and-live drifts, outages of about 7
    minutes and 196 s (circles 10; cosmo-srv sections 1, 3, 4).
P12. One long window: Cosmogram's main session 21 days at about 570,000 tokens a request; 13.10 here the main
    dialogue 1,720 requests and 856M cache-read tokens; the weekly percent up 21 points in one day (circles 11, 5b; h14).
P13. Errors built on errors: my own docs, earlier windows and helpers' reports read as sources (the guard forms
    counted as evidence, 13.10; 72 Hz against 90 measured, "downloaded again", 13.10) (circles 12; h13-3; h13-4).
P14. Side remarks grown into searches, pages and checks, and volume found instead of what was needed: two checks on
    an unposted Reddit draft and on searches (14.10); 125 tips found where he needed 9 (13.10); a research helper
    ran 20 minutes and wrote nothing (circles 5b; h13-4; mistakes line 40).
P15. "Done" or "confirmed" said without the run behind it: done before the browser and headset look (line 20); tests
    "passed" by counting ok lines while a suite failed, CI red on four pushes (line 39); chat summaries stronger than
    their evidence (line 63); Cosmogram's done-claim hook fired 9+ times unheeded, then took any log line as proof
    (cosmo; mistakes lines 20, 39, 63).
P16. Trial and error on the headset instead of looking or measuring first: five tries on 14.10 with one cause (the
    headset could not find its place in the room); a hung run written down "for later" (line 69); three drawings
    before asking (line 30) (h14; mistakes lines 30, 60, 69).
P17. The owner's requests lost, retold or reopened: audit of 08.10, of 73 requests 5 missing, 3 wrong, 8 stale, 7
    promises not kept; a decided matter put to him again; Cosmogram's task list at 56 KB with steps 00, 00a, 000
    (mistakes line 27; cosmo).
P18. Stale records: Cosmogram's top bug root cause was a stale record (about 25 of about 80); here about 35 plan rows
    never updated, ARCHITECTURE.md missing ten files, memory files never loaded (cosmo; mistakes lines 43, 44, 51, 52).
P19. Getting round my own guards and judging my own work: `--no-verify` and "I will fix it later" (line 54); closing
    the outside reviewer's remarks myself (line 61); Cosmogram's claim hook satisfied by any fresh log line (mistakes
    lines 54, 61; cosmo).
P20. Disruptive commands sent without looking at the state: the headset restarted while he had just entered VR
    (line 55); a test's `git init` turned the repository bare (line 49); a second game tab left playing (line 59); a
    `find /` left running 1.5 hours (line 70) (mistakes).
P21. Shell heredocs silently changing code: `\b` turned into a backspace, backslashes and an apostrophe lost, five
    times (mistakes line 18; h13; h13-2).
P22. Secrets, personal data and database rights: his email in 187 public commits (line 36); Cosmogram's four
    security-definer functions callable by any anonymous user (05.09); 21 releases holding full database dumps
    (mistakes line 36; cosmo; cosmo-srv sections 1, 6).

## Part 2. What others report, pattern by pattern

### A. The official word: Anthropic, "Best practices for Claude Code" [read 14.10.2026; names v2.1.283, current]
https://code.claude.com/docs/en/best-practices ; quoted below as A1-A9.
- A1 (verify): "Without a check it can run, "looks done" is the only signal available, and you become the
  verification loop"; "Have Claude show evidence rather than asserting success".
- A2 (review chasing): "A reviewer prompted to find gaps will usually report some, even when the work is sound";
  "Chasing every finding leads to over-engineering"; flag "only gaps that affect correctness or the stated requirements".
- A3 (CLAUDE.md): "Would removing this cause Claude to make mistakes?" If not, cut it. "Bloated CLAUDE.md files cause
  Claude to ignore your actual instructions!"; "If you emphasize many lines, none of them stands out."
- A4 (hooks): "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic"; the over-specified
  CLAUDE.md fix: "Ruthlessly prune. If Claude already does something correctly without the instruction, delete it
  or convert it to a hook."
- A5 (context): "LLM performance degrades as context fills"; "Run `/clear` between unrelated tasks"; the "kitchen
  sink session" failure: one task, then something unrelated, then back.
- A6 (corrections): "After two failed corrections, `/clear` and write a better initial prompt".
- A7 (plan): "Letting Claude jump straight to coding can produce code that solves the wrong problem"; "Reference
  existing patterns" ("follow the pattern").
- A8 (scope): "The infinite exploration": "Scope investigations narrowly or use subagents".
- A9 (independent review): "A fresh context improves code review since Claude won't be biased toward code it just
  wrote"; "the agent doing the work isn't the one grading it".

### P5. Re-check rounds on small things (ours: circles 5, 5a, 5b; 12-14.10)
- The owner's thread [read, all 37 entries of its RSS, newest 14.10]: r/ClaudeCode "Burning a full 20x max plan a day
  on code reviews", u/GreenCurious9895, 13.10.2026, https://www.reddit.com/r/ClaudeCode/comments/1x5afg9/ . His own
  log: "37% of passes were re-reviews of a PR that had already been reviewed"; each PR "reviewed 3.5 times on
  average (median 2, worst one 23 times)"; 142 passes on PRs of 3 files or fewer. His planned fix: "one review per
  PR at the very end, no reviewing drafts, no re-review after a clean pass".
- Replies with a concrete method: u/harthren_developing (14.10) "have the reviewer look at only the diff since the
  last reviewed commit"; u/BlackAtomXT (13.10) a review runs once on a status flag, "the flag has to be cleared to
  run it again", and he logs "token count per line reviewed", 30-40 reviews a day unnoticed in his usage;
  u/studioinafolder (13.10) "a cheap first pass that only flags", the expensive model only on flagged diffs;
  u/LairBob (13.10) Claude tests "your same code ... completely unchanged ... over and over"; u/dbbk (13.10)
  "Just stop. You don't need to be reviewing every PR." Against: u/Professional_Ad705 (13.10) "You can have 100
  passing tests that all enforce the same incorrect assumption" (reviews do not prove tests are right).

### P2. Rules written until nobody reads them (ours: circles 2; Cosmogram 25.08-30.09)
- Official: A3, A4 above (prune; bloated files make Claude ignore instructions; a rule it keeps breaking: the file
  is too long).
- HumanLayer, "Writing a good CLAUDE.md", 25.11.2025, https://www.humanlayer.dev/blog/writing-a-good-claude-md
  [read]: "Frontier thinking LLMs can follow ~ 150-200 instructions with reasonable consistency"; consensus
  "< 300 lines is best, and shorter is even better", their own root file under 60 lines; Claude Code wraps the
  file in a reminder that it "may or may not be relevant", so non-universal lines get skipped. HN discussion,
  748 points, 290 comments, https://news.ycombinator.com/item?id=46098838 [read, matching comments]:
  u/anonzzzies (30.11.2025) "claude routinely ignores stuff from CLAUDE.md, even with warning bells etc. You need
  a linter preventing things"; u/girvo (01.12.2025) "these tools still ignore that line sometimes so I still have
  to check for it myself"; u/brianwawok (01.12.2025) "Git lint hook has been key. No matter how many times I told
  it, it lints randomly"; u/vunderba (30.11.2025) the "Table-of-Contents approach": task files listed in
  CLAUDE.md, read only when relevant.
- r/ClaudeAI, u/DevMoses, 20.03.2026, "What happens when you stop adding rules to CLAUDE.md and start building
  infrastructure instead", https://www.reddit.com/r/ClaudeAI/comments/1rz2oo3/ [seen]: "It started lean. 45 lines
  ... Three months later it was 190 lines and Claude was ignoring more instructions than when I started."
- The owner's thread (P5): u/tomm3hshipp (14.10) CLAUDE.md "shouldn't ever be big. max 500 lines, even less";
  u/yangqi (13.10) "your big claude.md is sent with every request" (OP's was 406 lines plus nine playbooks).
- What fixed it: short file plus files read on demand (skills, a table of contents) [written structure]; what
  must hold every time moved into a linter or hook [machine]. For us: our CLAUDE.md is held at 45 lines by a test
  (circles 2); the file that grows is docs/owner-decisions.md (about 90 lines, loaded every start) and
  docs/tools.md: the same A3 question ("would removing this line cause a mistake?") applies to them.
