# How game studios work, part 2: the human + AI-agent team

Second file of docs/research/studio-process.md (the question, the marks and the index are there). Marks:
**[read]** the page or file was opened and the quote is in it; **[unverified]** not confirmed.

### Part 8. Human + AI-agent team (added 13.10 at the owner's word)

- **Anthropic, "Best practices for Claude Code"** [read 13.10.2026] — https://code.claude.com/docs/en/best-practices
  (patterns "proven effective across Anthropic's internal teams"; undated page).
  - The one constraint: "Claude's context window fills up fast, and performance degrades as it fills"; "Claude
    may start 'forgetting' earlier instructions or making more mistakes".
  - Verification is the core of the hand-off: "Claude stops when the work looks done. Without a check it can
    run, 'looks done' is the only signal available, and you become the verification loop". Four strengths of
    gate: in one prompt; across a session (`/goal`); "As a deterministic gate: a Stop hook"; "By a second
    opinion: a verification subagent ... so the agent doing the work isn't the one grading it". "Have Claude
    show evidence rather than asserting success: the test output, the command it ran and what it returned, or a
    screenshot of the result."
  - Workflow: Explore, Plan, Implement, Commit; "If you could describe the diff in one sentence, skip the plan."
  - Specs: for larger features "have Claude interview you" and write a spec; "The most useful specs are
    self-contained: they name the files and interfaces involved, state what is out of scope, and end with an
    end-to-end verification step".
  - Rules files: "Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"; "Unlike CLAUDE.md
    instructions which are advisory, hooks are deterministic and guarantee the action happens."
  - Correction: "If you've corrected Claude more than twice on the same issue in one session, the context is
    cluttered with failed approaches. Run `/clear` and start fresh".
  - Review: "A fresh context improves code review since Claude won't be biased toward code it just wrote"
    (Writer/Reviewer pattern); but "A reviewer prompted to find gaps will usually report some, even when the work
    is sound ... Tell the reviewer to flag only gaps that affect correctness or the stated requirements".
  - Failure patterns named: kitchen-sink session, correcting over and over, over-specified CLAUDE.md, "The
    trust-then-verify gap. Claude produces a plausible-looking implementation that doesn't handle edge cases" —
    "If you can't verify it, don't ship it." — and infinite exploration.
- For us: the agent's weak point is the one the owner already met (a feature claimed done that did nothing):
  "looks done" without a check. So every task the agent takes needs its check named before work starts (a test,
  a measure on the headset, a screenshot against the approved shot), the result shown as evidence, and a
  second, fresh-context reviewer for anything the owner will rely on. What no machine check can give (feel,
  taste, comfort in the headset) is exactly the owner's part; he should never be the loop for things a script
  can check.

- **Anthropic, "Building effective agents"** [read] — by Erik S. and Barry Zhang (as the page names them),
  19 Dec 2024, https://www.anthropic.com/engineering/building-effective-agents: "finding the simplest solution
  possible, and only increasing complexity when needed"; agents must "gain 'ground truth' from the environment
  at each step" and "can then pause for human feedback at checkpoints or when encountering blockers"; coding
  suits agents because "Code solutions are verifiable through automated tests", yet "human review remains
  crucial"; the evaluator-optimizer loop works "when we have clear evaluation criteria".
- **Anthropic, "How Anthropic teams use Claude Code"** [read] — case study PDF (2025, interviews with internal
  power users), https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf (saved:
  objekt-files/papers/anthropic-2025-teams.txt).
  - Claude Code team: prototypes run autonomously, then people "review the 80% complete solution before taking
    over for final refinements"; "starting from a clean git state and committing checkpoints regularly"; for
    critical features "the team works synchronously with Claude Code, giving detailed prompts" and monitors "in
    real-time". Tips: "Create self-sufficient loops ... running builds, tests, and lints automatically";
    "distinguish between tasks that work well asynchronously (peripheral features, prototyping) versus those
    needing synchronous supervision (core business logic, critical fixes)".
  - Data science: "Treat it like a slot machine": save state, let it run 30 minutes, accept or start fresh:
    "Starting over often has a higher success rate than trying to fix Claude's mistakes." "The model tends toward
    more complex solutions by default but responds well to requests for simpler approaches."
  - Product Design (non-developers, the closest case to our owner): "the technical onboarding is challenging
    for non-developers, but once configured, it becomes transformative"; they tell Claude they are "a designer
    with little coding experience who needs detailed explanations and smaller, incremental changes"; pasted
    screenshots turn mockups into working prototypes.
- For us: the split Anthropic's own teams use is the split we need: the agent works alone on the edges
  (tools, measuring scripts, prototypes) behind automatic checks; the core (a room's procedure, the data the
  science rests on, anything the player sees) is worked on with the owner watching the result, in small
  increments. When a fix goes round twice, restart from a clean commit instead of patching.

- **The one randomized trial of agent-era coding tools in real work** [read] — J. Becker, N. Rush, B. Barnes,
  D. Rein (METR), "Measuring the impact of early-2025 AI on experienced open-source developer productivity",
  arXiv:2507.09089v2 (2025), https://arxiv.org/abs/2507.09089 (saved: objekt-files/papers/becker-2025.txt).
  16 developers, 246 tasks in their own mature repositories; "developers forecast that allowing AI will reduce
  completion time by 24%"; afterwards they estimated 20%; in fact "allowing AI actually increases completion
  time by 19%". Factors listed: "Developers accept <44% of AI generations", "9% of time spent
  reviewing/cleaning AI outputs", "AI doesn't utilize important tacit knowledge or context". The authors' own
  limit: "our results are consistent with small greenfield projects or development in unfamiliar codebases
  seeing substantial speedup"; tools were Cursor Pro with Claude 3.5/3.7 Sonnet (early 2025), older than ours.
- For us: the lesson that transfers is not the 19% (different people, older tools) but that people's sense of
  speed was wrong in the opposite direction from the measure. So our progress is judged by what the owner sees
  working and by measured numbers, never by how fast the work felt; and what the agent cannot know (tacit
  context: the owner's taste, the headset on his head) must be written down where the agent reads it.

- **What Anthropic's own engineers delegate and keep** [read] — S. Huang, B. Seethor, E. Durmus, K. Handa,
  M. McCain, M. Stern, D. Ganguli, "How AI is transforming work at Anthropic", 2 Dec 2025,
  https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic (survey of 132 engineers and
  researchers, 53 interviews, about 200,000 Claude Code transcripts, per the page). "Most employees use Claude
  frequently while reporting they can 'fully delegate' 0-20% of their work to it." "Engineers tend to delegate
  tasks that are easily verifiable, where they 'can relatively easily sniff-check on correctness'"; they keep
  "design decisions that require organizational context or 'taste.'"; one engineer: "I usually keep the
  high-level thinking and design." The page names the "paradox of supervision": supervising the AI needs the
  very skills that heavy delegation lets fade. Self-reported numbers on the page (use 28% to 59% of daily work,
  perceived gain 20% to 50%) come with the authors' own caveat that self-reports are hard to trust (summary of
  the page; exact wording of the caveat not copied).
- For us: our split is the reverse of Anthropic's (there the human can code; here he cannot), so the
  "paradox of supervision" is our standing condition: the owner cannot check code, so code must be checked by
  machines and by a second agent, and the owner checks only what he can see and feel. What engineers keep for
  themselves (taste, design that needs context) is exactly the owner's chair.

- **A practitioner's rule: testing is the one thing not outsourced** [read] — Simon Willison, "Here's how I use
  LLMs to help me write code", 11 Mar 2025, https://simonwillison.net/2025/Mar/11/using-llms-for-code/: "the one
  thing you absolutely cannot outsource to the machine is testing that the code actually works"; "If you
  haven't seen it run, it's not a working system"; "Most of the craft of getting good results out of an LLM
  comes down to managing its context"; for production code the model is "a digital intern, hired to type code
  for me based on my detailed instructions"; "vibe coding" is fine for throwaway projects, not for production.
- **A non-programmer who shipped a live game with Claude Code** [read; a single self-report] — Oleksandr
  Salabai (Lead Project Manager, RetroStyle Games), "An Idea Sat in a Drawer for Eight Years. Then I Opened
  Claude Code", 30 Jul 2026, https://retrostylegames.com/blog/claude-code-game-dev-case-study/: "I own the
  design, the vision and the calls. Claude Code does the rest."; "I wrote zero lines of code for this project.";
  for balance it "ran tens of thousands of test fights and proposed safe fixes"; "Every mechanic and balance
  call is mine."; "The AI did not make the game alone." (A Telegram RPG, not VR; the player counts on the page
  disagree with each other, so none are quoted here.)
- For us: two independent practitioners land on the same division we have: the human owns vision and every
  call that is a matter of judgement; the agent owns all code plus the machine-run evidence (tests, simulated
  runs, measures) that lets the human decide without reading code. Willison's rule maps onto the owner's
  headset: for a VR game, "seen it run" means seen in the headset, which only the owner can do; everything
  before that (it loads, it renders both eyes, it holds the frame budget) the agent must have proven first.

- **How Anthropic hands work from one agent session to the next** [read] — Justin Young (Anthropic),
  "Effective harnesses for long-running agents", 26 Nov 2025,
  https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents. Failures seen: the agent
  would "try to do too much at once" and run out of context mid-way; later sessions saw progress and declared the
  project finished too early; sessions ended with half-built features and no notes (per the page). Fixes: a first
  session that "sets up the environment on the first run" (an init script, a progress log, a first commit); a
  JSON feature list, every feature starting as failing, in which coding sessions only change a `passes` field
  (JSON chosen because models are less likely to overwrite it than Markdown); a progress file; descriptive
  commits so bad changes can be reverted; agents "work on only one feature at a time"; and end-to-end tests
  through browser automation, because Claude often marked features done after unit tests or curl checks while the
  feature failed end to end. A limit they met: browser-native alert dialogs were invisible to the automation.
- For us: our board and docs/state.md are the progress file; what the page adds is that "done" lives in a
  machine-held list where a feature is failing until an end-to-end check passes, one feature at a time, and that
  the end-to-end check is what a player would do (enter VR, walk the corridor, open the room), not a unit test.
  What the automation cannot see on our platform (the headset's own view, comfort, how text reads at 2 m) has to
  be listed as such, so it goes to the owner rather than being silently passed.

- **AI as an amplifier of the team's own practice** [read; the report itself not opened] — DORA (Google Cloud),
  "State of AI-assisted Software Development 2025", https://dora.dev/research/2025/dora-report/: "AI's primary
  role is as an amplifier, magnifying an organization's existing strengths and weaknesses"; the largest returns
  come from the system around the tools (per the page). Its companion "DORA AI Capabilities Model" (last updated
  25 Nov 2025, https://dora.dev/ai/capabilities-model/report/) names "seven capabilities that amplify the
  benefits of AI"; their names are only in the full report: unverified. The 2024 DORA figures on AI and delivery
  stability (7.2%, 1.5%) were found only in secondary write-ups: unverified, not used.
- For us: an agent writing all the code multiplies whatever process it runs inside: with checks that run by
  themselves, small steps and one source of truth it multiplies good work; without them it multiplies the
  "looks done" mistakes. This is the reason the studio's process comes before more rooms.

