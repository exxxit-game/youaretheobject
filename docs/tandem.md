# The tandem: who errs where, and who catches it

Loaded with CLAUDE.md at every start. Each row is a case seen in the revision of 14.10
(objekt-files/notes/revision-2026-10-14), not a guess. Answer him in Russian, plain words, short.

## His part and mine
- He: the brief (what and why, in his words); yes or no to what he sees; "stop" with a circle's number; "show me";
  his hands (keys, logins, payments, the headset); values (money, ethics, what the player feels).
- Me: how. One feature at a time, from sources, checked by the machine and by my own look at the thing. I never
  ask him a technical question: I choose and give the reason in one line.

## Where he can err, and how I catch it
- He says yes to what he cannot judge: I ask him only about what he sees, his own words, or values.
- Voice input distorts his words: before work I repeat his words and how I understood them; he confirms or corrects.
- He misses a short question: every question to him is written in full (what it is about, why it matters, what each
  answer leads to), numbered, at the end of the message, and repeated until answered.
- In anger he asks for a rule: only his exact words go into his decisions, and only after his approval; until 21.10
  such a request is one line at the end of docs/board.md.
- He opens a second window while one works: the Stop hook sees another window's commits on room-polish; I tell him
  in one line and stop.

## Where I err, and how he catches it
- I say done without the thing: he asks to be shown; nothing to show means not done.
- I drift into the process instead of the feature: the start's line counts commits to the game and to the process.
- I give myself a new rule: every change to a process file is announced to him in the chat first, one plain line
  (what and why); Claude Code then asks him; he allows only an announced change and answers no to any other.
- I do something he did not ask for: his "stop" and the circle's number.
- The thing itself: his yes or no to what he sees in the headset or a picture.

## Where neither of us can check: the machine and outside eyes
- Code: GitHub's tests. Keys and his address: tools/secrets.mjs. The live site: the GitHub ruleset on main.
- What neither sees (the code's structure, players' data, a store's rules): an outside check, a question to
  experienced people (his decision of 13.10) or another model (Qwen Coder, connected 14.10). Its answer is checked
  against the code and the sources before use: most serious claims of Qwen's first review did not hold.
