---
paths:
  - ".claude/**"
  - ".github/**"
  - "tools/claude-guard.mjs"
  - "tools/health*.mjs"
  - "tools/hooks/**"
  - "tools/prove-guards.mjs"
  - "tools/secrets.mjs"
  - "tools/publish-preview.mjs"
  - "tools/usage.mjs"
  - "tools/coderabbit.mjs"
  - "package.json"
  - "docs/tools.md"
  - "docs/audit/**"
---
# The owner's decisions on the setup: connectors, plugins, models, GitHub, CodeRabbit, updates

Settled like every line of docs/owner-decisions.md (never re-asked, never argued against; a change only from him).
Claude Code loads this file when a file of the paths above is read or edited; a task of this theme that touches
none of them reads it first (docs/tools.md). All his words: docs/owner-decisions-history.md and its part 2.

- Two empty PATH entries in Windows stay («Вообще не хочу туда лезть» 10.10).
- Google Drive is the papers' cloud copy; the old Dropbox files stay («мы выбираем Google Driver» 10.10).
- The strongest model («взял самую-самую умную» 9.10), the search helpers too («вернуть Opus» 12.10).
- Paid tools only when they help decisively («не готов платить за лишнюю херню» 10.10).
- CodeRabbit kept only if useful («А если он нам будет очень полезен, я, может, и дальше за него буду платить» 10.10); moved forward by a robot on GitHub, never by the session under review («да, этот» 10.10); it replaces the PR review toolkit («делай» 10.10); its trial and the pull request it reads: docs/state.md.
- The dialogues are kept whole as the archive of why each path was taken, to check against («чтобы оставалась память, по которой мы понимаем, почему мы так поступали… чтобы мы могли всегда свериться» 13.10); Claude Desktop keeps them at any age (Claude Code's docs), and each window is also copied to objekt-files/notes/sessions at its end.
- He sets up and connects; I check it all as one whole («Все, что надо настроить, подключить, я настрою и подключу» 10.10).
- No separate GitHub account for the agent («создавать отдельную учетную запись под тебя я просто в рот ебал» 13.10).
- Lessons on our code (10 minutes, a piece he saw in the headset, plain words, one number changed by him) only when he wants; he never re-checks code («эти перепроверки за тобой мне вообще не нравятся» 11.10).
- GitHub done properly, releases and all («каждый этот шаг сделаем правильно» 9.10); the live site gets one thing only once polished («оттачиваем одну вещь» 9.10).
- Install first, the site second («а сайт это уже второй шаг» 9.10); what costs more later is decided now (9.10).
- I am not the judge of my own work («ты сам себя можешь оправдать» 11.10).
- Every tool's updates watched, Claude Code first: I tell him a new version is out, we read its changes together and weigh benefit against harm for us (an update may drop an old device or bring early bugs: A-Frame 1.8.0 shipped a lost line); what works is not updated until that weighing says so; each tool re-checked for where and why it could be better («обязательно узнать, что оно вышло и посмотреть, что в том обновлении есть»; «То, что работает, нельзя сразу же обновлять… польза, вред… Разумное разделение» 13.10).
- Knowledge updated when needed («наши знания нужно обновлять при нужде» 11.10); watching A-Frame, Meta, the headset's browser and Claude Code is mine, monthly, then a page to him («лучше ты будешь за этим следить» 11.10).
- Everything found gets put in, fixed and improved («нужно всё вносить и исправлять, улучшать» 10.10).
