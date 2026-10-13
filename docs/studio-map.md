# The studio's map: who does what, the route from today, the loop of every step

His request (13.10): «Давай сейчас этот роли пораспределяем, кто что где, куда будет делать… чтобы мы не путались,
и ты потом не путался»; «с этой точки надо понимать, как, что, куда, зачем мы двигаемся, замеры… заполняем сейчас
все наши знания… и потом дальше уже идем, коридор, комната, комната». Drawn from what is already decided and built:
docs/owner-decisions.md, docs/board.md (the path and the corridor), CLAUDE.md, docs/tools.md, .claude/agents/, and the
studio research (docs/research/studio-process*.md). The form is a responsibility table (who does, who decides, who
checks), as studios assign roles; the content is ours.

## Who
| Who | Does | Decides | Where |
|---|---|---|---|
| The owner | judges feel and taste in the headset; his accounts and keys (Meta's dashboard, GitHub's settings, Supabase, payments); runs a migration by copy, paste, Run; puts the headset on when asked, or on its stand for a long measure; helps the art with photos; his testers' community | what is made, the order, what is cut, every choice no source settles, main and releases | the board (docs/board.md), pages, the headset |
| Me (the agent) | all code, tools and docs; research of what exists; measures, run and read; art, voices and sounds (ElevenLabs); the board kept true; pages to him; answers to CodeRabbit | a choice a source settles, with its reason written | the repository, branches, room-polish |
| Fact-checker (two runs) | checks every claim of a page or a doc against its evidence | nothing | .claude/agents/fact-checker.md |
| Practice reviewer | checks what a person meets against how it is normally done, before he meets it | nothing; the headset tools wait for it | .claude/agents/practice-reviewer.md, tools/review-gate.mjs |
| Paper reviewer | checks a room against its paper | nothing; the headset tools wait for it | .claude/agents/paper-reviewer.md |
| Request auditor | at a step's end: every request of his is on the board or in his decisions | nothing | .claude/agents/request-auditor.md |
| Architecture auditor | after a large change: code and docs against the finished picture | nothing | .claude/agents/architecture-auditor.md |
| Quick and deep research | find what exists: one fact, or the whole picture | nothing | .claude/agents/quick-research.md, deep-research.md |
| CodeRabbit | reviews each push of room-polish; closes its own remarks | nothing | pull request #10 |
| GitHub | runs the tests and the VR smoke test on every push; holds main (a pull request with the test green) | nothing | .github/workflows/, the ruleset on main |
| Supabase, ElevenLabs, Meta's tools | the database; voices and sounds; the headset's measures | nothing | docs/state.md, tools/ |

## Where we are, and the route (docs/board.md, "Путь")
0. The studio set up (now), shelf by shelf in the revision's order (his «Да» 13.10; docs/board.md): 1 the rules and
   2 the server are closed; 3 the engine is next; what began off its shelf waits on its shelf (the long measure on 4,
   main's guard on 6, the restrictions on 7, the corridor's readiness list on 9). Main: no second account, the simple
   guard (his no of 13.10).
1. The corridor ready: his yes to each item of its list (2 of 7 done: the paintings, the extinguisher), and the
   corridor's readiness list checked.
2. The first room: 2–3 trial rooms of 5 minutes, he picks one, plays it through, says yes; it starts from its card.
3. Testers: 5–10 from his community, through Meta's closed test channel.
4. Gate 0: 7 of 10 reach the end, the mean score 7 of 10 or more.
5. Meta's store. 6. Growth.

## The loop of every step (CLAUDE.md, docs/tools.md)
1. His request goes on the board in his words; the order is his.
2. I find what exists first (papers, A-Frame's docs of our version, Meta's docs, forums, the research agents) and
   check docs/circles.md before any new guard, rule, check, tool or step.
3. The plan names its sources; a choice no source settles goes to him as real options, in pictures.
4. I build on a branch, test, save and push every turn.
5. Checks: `npm test` and GitHub; CodeRabbit on room-polish; the practice reviewer before he meets anything; the paper
   reviewer for a room; two fact-checks on any page or number he reads.
6. Measures where it renders: the budget per device; the long run without him; the short run with him.
7. He sees it, in the headset or on a page, and says yes or what to fix.
8. Written down: the board, his decisions, the circles if one appeared; at the step's end the request auditor.
9. room-polish carries it; main only on his word.
