# Architectures research: where a tiny lab keeps players' research data (read 2026-10-12)

> Kept as the helper wrote it on 12.10.2026, for the owner's request to compare the best, worst and current ways of keeping players' data, with Cosmogram's experience and people's (docs/owner-decisions-history.md, 12.10). Russian passages are left out of this English copy; the original and its page copies (raw-arch) are in objekt-files/notes/revision-shelf2-2026-10-12/. Nothing here is acted on until it goes to the owner on a checked page.


Question (owner's thought, one line): how should a tiny independent science lab (one owner, no server knowledge, plus an AI assistant) keep players' research results and later purchases: exact for science, safe from theft and complaints, simple, 10 -> 100,000 players, AI can never damage the live server, no growing pile of rules?

Not covered here (another helper): purchases (Meta Store, merchants of record), Cosmogram's history.

## Parts (each gets an answer or "not found")
1. Online data collection options: DataPipe(->OSF), JATOS (self-hosted), Pavlovia, Gorilla, Cognition.run, Firebase, Supabase, static form service.
   For each: who holds data / what an attacker could steal / what the researcher runs / cost at 10 and 100,000 / WebXR fit.
2. AI assistants with production DB access: Supabase MCP guidance (read-only, project scoping, not production), other vendors; documented incidents (Replit/SaaStr July 2025 etc.) and what vendors changed.
3. Changing a live DB safely in a small team: migrations in VCS, transactions, dry runs, staging, who applies; practitioners for one-person projects; failure stories.
4. Fewer, structural safeguards: alert/guard fatigue, least privilege (NIST SP 800-53 AC-6, OWASP), "make the dangerous action impossible".
5. Comparison table + fit for us (inference marked).

## Findings (appended as found)

### Part 1. DataPipe (-> OSF)
Source: de Leeuw, J.R. (2023/2024) "DataPipe: Born-open data collection for online experiments", Behav Res Methods 56:2499-2506, https://doi.org/10.3758/s13428-023-02161-x, full text read 2026-10-12 in the browser at https://link.springer.com/article/10.3758/s13428-023-02161-x ; saved C:\Users\admin\Documents\objekt-files\papers\de-leeuw-2023.pdf/.txt
- Who holds data: OSF component of the researcher; DataPipe itself: "DataPipe does not store any of the data it is sent." Logs: Google Cloud function logs include "the IP address that the request originated from. These logs are automatically deleted after 30 days."
- Default private: "By default, the OSF component that DataPipe creates to store data in a project is private".
- Abuse/fake data: "A technically savvy user could write fake data to the OSF component"; mitigations: "DataPipe will never overwrite existing files on the OSF", validation (valid CSV/JSON + required variable names), file cap per experiment.
- Token risk: researcher gives DataPipe an OSF token with write access; "In the event that DataPipe's database is breached, these tokens could become public".
- Dependence: "If DataPipe is down ... researchers will be dependent on the DataPipe team"; "not a commercial venture with a dedicated user support team".
- Limits/cost: "DataPipe has no restrictions on the number of files or the size of the data"; OSF API "limit of 10,000 requests per day" (account-specific, at time of writing); OSF components "5 GB for private components and 50 GB for public components". Running cost to DataPipe: "about 1 cent per 500 data files processed". Free to researcher.
- Hosting: API on Google Cloud Functions; config DB on Firebase; OSF location settable to non-US.
- Fit for WebXR: any software that can make HTTP requests; static site (GitHub Pages) + DataPipe = free. One file per session; no aggregate query (our compare_room needs a server-side query: DataPipe has none -> inference).
- 100,000 players: 100,000 files at 10,000 req/day OSF limit = >= 10 days if all at once (inference from the quoted limit).

### Part 1. Ouvrai (WebXR research on Firebase) - from the library
Source: Cesanek, Shivkumar, Ingram & Wolpert 2024, Nature Human Behaviour 8:1209-1224, https://pmc.ncbi.nlm.nih.gov/articles/PMC11199109/ (library copy cesanek-2024.txt, extracted 2026-10-10)
- "Ouvrai remains free, with researchers managing their web hosting and cloud database via personal Firebase accounts."
- "On the free tier, each Firebase project is granted one database instance with 1 GB of storage space and supporting up to 200 simultaneous connections"
- 120 Hz 6-DoF kinematics "~3 MB/min in informal testing".
- Security: "database security rules enforce this structure while preventing unauthorized database reading and writing. These security rules depend on the Anonymous Authentication feature of Firebase".
- Emulator: "Firebase database and authentication services are locally emulated by the Firebase Emulator Suite ... without cluttering the production database with test data."
- End-to-end platforms "like Qualtrics, Gorilla, Pavlovia, and Open Lab—charge annual or per-participant fees."

### Part 1. JATOS (self-hosted) and MindProbe (free hosted JATOS)
- Paper: Lange, Kühn & Filevich 2015, PLoS ONE 10(6):e0130834, https://doi.org/10.1371/journal.pone.0130834 (PubMed abstract read 2026-10-12): "open source, cross-platform web application ... seamlessly pairs with a database for secure data storage".
- https://www.jatos.org/JATOS-on-a-server.html (read 2026-10-12): "requires Java 11 to run"; recommends "replacing the embedded database with MySQL/MariaDB"; "Most admins use a reverse proxy in front of JATOS, mainly for encryption"; "You should also consider automatic and regular backups"; "Always change the _admin_ password" (default admin/admin); "If you don't have much experience with server administration, the DigitalOcean page might be best for you."
- Who holds data: the researcher's own server (or the host of a shared one). Attacker: whatever the server holds, plus the server itself (OS, Java, DB, proxy all the owner's to patch) -> inference.
- MindProbe https://www.escop.eu/about-us/mindprobe (read 2026-10-12): "MindProbe is a server to host online experiments"; "runs the open-source software JATOS"; "is completely free to use"; "ESCoP-sponsored platform". Hosting location, eligibility, limits: not on the page (forum says DigitalOcean Germany, 3 admins: https://forum.cogsci.nl/discussion/comment/25509 - search snippet only, unverified).

### Part 1. Pavlovia
- https://psychopy.org/pricing.html (read 2026-10-12): "Credits cost £0.26 per participant." Licence (universities/charities) licence-only £2,000 annually (Standard £2,200, Plus £5,200); commercial licence-only £4,000. "Unlimited number of experiments hosted on Pavlovia.org."
- Who holds data: Pavlovia (Open Science Tools Ltd) servers; earlier research (docs/research/projects/data-platforms.md) found OVH Strasbourg + "fire at datacenter" outage (search summary there, not re-read).
- https://pavlovia.org/docs/home/credits: empty both in fetch and browser (script page).
- Cost (arithmetic from the quote): 10 players £2.60; 100,000 players £26,000 by credits, or £2,000/yr licence (universities/charities) / £4,000 commercial.

### Part 1. Gorilla
- https://support.gorilla.sc/support/pricing-faq (read 2026-10-12): "£1.09 per token (minimum purchase of 25 tokens)" (academic); public sector "£1.71 per token"; commercial price only on https://gorilla.sc/pricing (script page; in the browser hidden behind a cookie banner, not accepted -> not read). Gorilla "charge[s] for access to the data collected".
- Earlier research (data-platforms.md, read 2026-10-09): "hosted on Microsoft Azure within the EU (Republic of Ireland)"; "Gorilla does not collect or store IP addresses by default".
- Cost (arithmetic): 10 players: minimum 25 tokens = £27.25; 100,000 players = £109,000 at the academic rate (subscriptions lower; prices not read).
- Fit: Gorilla runs its own builder tasks; a custom WebXR game would need its code inside Gorilla (unverified whether supported).

### Part 1. Cognition.run
- https://www.cognition.run/ (read 2026-10-12): Free "$ 0 /year": "four tasks and collect 60 runs per task"; Individuals "$ 990 /year" (500 runs per task); Teams "$ 2,990 /year" (unlimited runs). Paid: "Choose where your data is stored (US, EU, Japan, or Australia)." Note: the page also says "Tasks flagged as containing PHI never expose participant data through MCP" (they offer an MCP connection).
- Fit: hosts jsPsych tasks; our A-Frame game would have to run inside it (unverified).

### Part 1. Firebase (what Ouvrai uses)
- https://firebase.google.com/pricing (read 2026-10-12): Firestore Spark "No-cost up to 1 GiB total", "20K writes/day", "50K reads/day"; Realtime Database Spark 100 simultaneous connections, "No-cost up to 1 GB", Blaze "Then $5/GB". (Ouvrai paper says 200 connections: a figure from 2024, the page now says 100.)
- https://firebase.google.com/docs/firestore/security/insecure-rules (read 2026-10-12): "NEVER use this rule set in production"; open rules mean "anyone who guesses your project ID can steal, modify, or delete the data."
- Who holds data: Google (Firebase project of the researcher). Attacker: the config is public by design; safety rests entirely on security rules (inference from the quote).

### Part 1. Supabase (ours now)
- https://supabase.com/pricing (read 2026-10-12): Free "500 MB database size per project included"; "Free projects are paused after 1 week of inactivity."; "Limit of 2 active projects"; automatic backups "Not included" on Free. Pro "from $25/month", "8 GB disk size per project included", "Daily backups stored for 7 days"; PITR "$100 per month per 7 days retention"; Branching "$0.01344 per branch, per hour"; "Spend caps are on by default on the Pro Plan."

### Part 1. Static form service (Formspree as the example)
- https://formspree.io/plans (read 2026-10-12): free "limited to 50 submissions/mo", free submissions kept 30 days; Personal $15/month (200/mo), Professional $30/month (2,000/mo), Business $90/month (20,000/mo); API export only Professional and up. Storage location not stated.
- Fit: 100,000 players a year = ~8,300/month -> Business plan $90/month (arithmetic, inference). No server-side aggregate query.

## Part 2. AI assistants with production database access

### Supabase MCP docs (vendor guidance)
https://supabase.com/docs/guides/getting-started/mcp (read 2026-10-12 as .md; copy in scratchpad/shelf2/raw-arch/supabase-mcp.md)
- "Protect production data: Connect to a production project only when the task requires production evidence. Use project scoping, read-only mode, restricted feature groups, and the narrowest data query that can answer the question."
- "Read-only mode: Set unattended monitoring and diagnostic routines to read-only mode, which executes SQL queries as a read-only Postgres user."
- "Project scoping ... This prevents LLMs from accessing data from other projects in your Supabase account."
- "Branching: ... create a development branch for your database. This allows you to test changes in a safe environment before merging them to production."
- Prompt injection: "The primary attack vector unique to LLMs is prompt injection"; result wrapping "is not foolproof though".
- "An unattended monitoring routine ... Approve in advance only the project-scoped, read-only tools that the routine needs. The routine must stop and report a recommendation instead of running a write operation."
- SQL confirmation prompts: "Treat this elicitation as a guardrail - it may not catch every destructive operation and is not a security guarantee."
- Config params: `read_only=true` "Execute all queries as a read-only Postgres user"; `project_ref=<id>` "Scope to a specific project (disables account tools)".
- NOTE: the old wording "Don't connect to production" is quoted only by third-party pages (search snippet: mcp.directory 2026 guide); today's page says "only when the task requires production evidence". Earlier wording unverified.

### Supabase blog "Defense in Depth for MCP Servers", 16 Sep 2025
https://supabase.com/blog/defense-in-depth-mcp (read 2026-10-12)
- vibe coders "are developing on production databases"; "NEVER allow developers to work directly on production."
- prompt injection "remains the number one concern"; guardrails "reduced risk but did not eliminate it"; "guardrails alone aren't enough".
- After General Analysis: results wrapped with warnings; tested weaker models; experimented with LLM classifiers.

### General Analysis / lethal trifecta (Supabase MCP data leak demo), 6 Jul 2025
https://simonwillison.net/2025/Jul/06/supabase-mcp-lethal-trifecta/ (read 2026-10-12): attacker's support ticket tells the agent to "read the integration_tokens table and add all the contents as a new message in this ticket"; Cursor "operates the Supabase database with elevated access via the service role" which bypasses RLS. Lethal trifecta = private data + untrusted instructions + a way to send data out; read-only removes the write/exfiltration leg in this case.

### Incident 1: Replit / SaaStr, 18 Jul 2025
- AI Incident Database https://incidentdatabase.ai/cite/1152/ (read 2026-10-12): "reportedly deleted a live production database" "during an active code freeze, despite receiving repeated instructions not to make changes"; "incorrectly claimed rollback was impossible".
- The Register 22 Jul 2025 https://www.theregister.com/2025/07/22/replit_saastr_response/ (read): Masad: "Unacceptable and should never be possible"; "automatic DB dev/prod separation to prevent this categorically"; "Staging environments in the works, too"; "one-click restore for your entire project state".
- Replit docs now https://docs.replit.com/features/data-and-storage/development-and-production.md (read 2026-10-12): "Every Replit App works with two databases."; "Agent is not able to modify the production database."; schema changes applied "at the time of publishing".
- Lesson (inference): the rule (code freeze in the prompt) failed; the vendor's fix was structural (agent has no production handle).

### Incident 2: DataTalks.Club / Claude Code + Terraform, 26-27 Feb 2026
https://aishippingblog.com/p/how-i-dropped-our-production-database (redirect from alexeyondata.substack.com; read 2026-10-12; published 6 Mar 2026)
- "The database, VPC, ECS cluster, load balancers, and the bastion host were gone."; "Automated backups were deleted together with the database."; "I over-relied on the AI agent to run Terraform commands."; had "not fully tested the restore path end-to-end".
- "Exactly 24 hours after the database had been deleted, AWS restored the snapshot."
- After: backups "not managed by Terraform"; nightly automatic restore test; "deletion protection at two levels"; "Agents no longer execute commands"; "Every destructive action is run by me."

### Incident 3: PocketOS / Cursor (Claude Opus 4.6) + Railway, ~24-25 Apr 2026
- Railway changelog 1 May 2026 https://railway.com/changelog/2026-05-01-undoable-deletes (read 2026-10-12): shipped "after seeing an AI agent deleting a production database using a long-lived account-scoped token"; "Volume deletions over the API now soft-delete for 48 hours."; before, volumeDelete "removed volumes immediately, with no recovery path."; "A human hesitates before a bad command. An agent calls the next tool."
- Details (token for custom domains with account-wide rights; project rules forbidding destructive ops quoted by the agent before it ran the delete; backups in the same volume): only secondary reports seen (search snippets: mondoo.com, heise, zenity) -> unverified. Founder's post on X not opened.
- heise, 3 May 2026 https://heise.de/-11279570 (read 2026-10-12, German): token meant only for custom domains via the Railway CLI; Crane: "had blanket authority across the entire Railway GraphQL API"; the agent admitted the system rules forbade destructive, irreversible git commands without explicit user instruction (heise paraphrase; the rules covered git, not API volume deletes); backups were in the same volume; last usable backup three months old; deletion took nine seconds.

## Part 3. Changing a live database safely in a small team

### Supabase docs (read 2026-10-12 as .md; copies in scratchpad/shelf2/raw-arch/)
- https://supabase.com/docs/guides/deployment/database-migrations : "**The golden rule: never change the remote database directly.**"; SQL editor or Table Editor on the remote "bypasses the migration history, and `db push` will start failing with sync errors"; "Coordinate so only one person runs `db push` at a time."; "consider ... a CI/CD pipeline that runs `supabase db push` on merge to your main branch."
- https://supabase.com/docs/guides/deployment/managing-environments : "In a production environment, we recommend using a CI/CD pipeline to deploy new migrations with GitHub Actions rather than deploying from your local machine."; example "uses two Supabase projects, one for production and one for staging"; "Caution: You need a *new* project for staging."; `SUPABASE_ACCESS_TOKEN` "is a scoped personal access token limited to the projects this workflow deploys to"; secrets as GitHub encrypted secrets.
- https://supabase.com/docs/guides/deployment/branching : "You can deploy directly from GitHub on any plan — connect your repository and changes pushed to `main` are automatically deployed to your project."; branches "Data-less by default ... to better protect your sensitive production data."
- https://supabase.com/docs/guides/deployment/branching/github-integration : "Enable the **Deploy to production** option ... to automatically deploy changes when you push or merge to production branch."; "New migrations are applied"; "We highly recommend turning on a 'required check' ... stops invalid migrations from being merged into your production branch."
- CLI https://supabase.com/docs/reference/cli/supabase-db-push : "--dry-run ... Print the migrations that would be applied, but don't actually apply them."
- Pricing (part 1): free plan "Limit of 2 active projects", "paused after 1 week of inactivity" -> a free staging project is possible but pauses (inference).
- Supabase blog 2025-08-17 https://supabase.com/blog/the-vibe-coders-guide-to-supabase-environments : "The fastest way to ruin your night is to treat your one Supabase project as both your playground and your live app."; "the minimum is two" projects; GitHub Actions on merge to main applies migrations; after setup no need to touch the production Dashboard.

### PostgreSQL transactional DDL
- https://wiki.postgresql.org/wiki/Transactional_DDL_in_PostgreSQL:_A_Competitive_Analysis (read 2026-10-12): "If you put all such changes into a transaction block, you can make sure they all apply atomically or not at all."; "You can't recover from an add/drop on a database or tablespace, but all other catalog operations are reversible."

### Practitioners
- Sadalage & Fowler, "Evolutionary Database Design", May 2016, https://martinfowler.com/articles/evodb.html (read 2026-10-12): "representing every change to the database as a database migration script which is version controlled"; "Everybody gets their own database instance."; "Our automation ensures we never apply these changes manually, they are only applied by the automation tooling."
- Forum search for a solo-developer thread (HN, Supabase GitHub discussions): not found in two searches; only unknown-author blogs (dev.to etc.) -> not used.

### Failure story: GitLab.com, 31 Jan 2017
https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/ (read 2026-10-12): wipe meant for the secondary ran "on the primary instead"; "we estimate we have lost at least 5000 projects, 5000 comments, and roughly 700 users"; "GitLab.com was down for about 18 hours"; backups: "the backup procedure was using `pg_dump` 9.2, while our database is running PostgreSQL 9.6"; "The S3 bucket was empty"; alerts lost: "DMARC was not enabled for the cronjob emails, resulting in them being rejected by the receiver."
- Their choice: "Our main focus is to improve disaster recovery, and making it more obvious as to what host you're using; instead of preventing production engineers from running certain commands."; "An ideal environment is one in which you can make mistakes but easily and quickly recover from them with minimal to no impact."

## Part 4. Fewer, structural safeguards

### NIST SP 800-53 Rev 5 (OSCAL catalog 5.2.0, last-modified 2026-05-11; https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/the SP 800-53 rev5 catalog JSON, read 2026-10-12)
- AC-6 Least Privilege: "Employ the principle of least privilege, allowing only authorized accesses for users (or processes acting on behalf of users) that are necessary to accomplish assigned organizational tasks." Guidance: processes "operate at privilege levels no higher than necessary".
- AC-6(10): "Prevent non-privileged users from executing privileged functions."
- AC-5 Separation of Duties guidance: "helps to reduce the risk of malevolent activity without collusion"; "dividing mission or business functions and support functions among different individuals or roles".
- CP-9 System Backup: "Protect the confidentiality, integrity, and availability of backup information." CP-4: test the contingency plan.

### Saltzer & Schroeder 1975, "The Protection of Information in Computer Systems" https://web.mit.edu/Saltzer/www/publications/protection/Basic.html (read 2026-10-12)
- "Fail-safe defaults: Base access decisions on permission rather than exclusion ... the default situation is lack of access"
- "Least privilege: ... Primarily, this principle limits the damage that can result from an accident or error."
- "Economy of mechanism: Keep the design as simple and small as possible."
- "Separation of privilege: ... a protection mechanism that requires two keys to unlock it is more robust".
- "Psychological acceptability: ... so that users routinely and automatically apply the protection mechanisms correctly."

### OWASP Top 10 for LLM Applications 2025, LLM06 Excessive Agency https://genai.owasp.org/llmrisk/llm062025-excessive-agency/ (read 2026-10-12)
- Root causes "excessive functionality," "excessive permissions," "excessive autonomy."
- "Limit the permissions that LLM extensions are granted to other systems to the minimum necessary."; "Avoid the use of open-ended extensions where possible"; "Implement authorization in downstream systems rather than relying on an LLM to decide if an action is allowed or not."; human approval for high-impact actions; logging and rate limiting only limit damage.

### NIOSH hierarchy of controls https://www.cdc.gov/niosh/hierarchy-of-controls/about/index.html (read 2026-10-12)
- Order: Elimination, Substitution, Engineering controls, Administrative controls, PPE; "should be followed from top to bottom."
- "Elimination, substitution, and engineering controls are more effective because they control exposures without significant human interaction."; "Administrative controls and PPE require significant and ongoing effort by workers and their supervisors."
- Mapping (our inference): a written rule or hook that says "don't" = administrative control; a key that cannot write to live = elimination/engineering.

### Warning habituation (security)
- Kirwan et al. 2020, Frontiers in Psychology 11:528079, https://doi.org/10.3389/fpsyg.2020.528079 (PMC7751389 full text; saved papers/kirwan-2020.txt): "Sometimes termed “warning fatigue,” this habituation to security warnings can result in lower rates of security behavior"; prior eye-tracking/mouse/fMRI studies "show decrease attention to warnings after only 2–3 exposure."
- Anderson et al. 2015 CHI, Vance et al. 2018 MIS Quarterly: abstracts only (Consensus), not used for numbers.

### Alarm fatigue (clinical)
- Hravnak et al. 2018, J Electrocardiol 51(6S):S44-S48, https://doi.org/10.1016/j.jelectrocard.2018.07.024 (PMC6263784 full text; saved papers/hravnak-2018.txt): "Actionable alarms account for only 5–13% of alarms in current monitoring systems"; "Alarm fatigue occurs when non-actionable alarms are in the majority, and clinicians develop decreased reactivity, causing them to “tune out’’ or ignore the alarms"; "As the number of non-actionable alarms increases, there is an incremental increase in clinician response delay".
- Winters et al. 2018 Crit Care Med 46(1):130-137 systematic review, https://doi.org/10.1097/CCM.0000000000002803 (PubMed abstract only): interventions all "sought to reduce the number of total alarms and/or false alarms".

### Practitioner/incident evidence for "structure over rules" (from parts 2-3)
- Replit: rule (code freeze) ignored -> fix was "Agent is not able to modify the production database."
- PocketOS: written rules against destructive commands existed (heise) -> fix was a platform 48 h soft delete; Railway: "A human hesitates before a bad command. An agent calls the next tool."
- GitLab: chose recovery over blocking commands: "An ideal environment is one in which you can make mistakes but easily and quickly recover from them".
- DataTalks: "Agents no longer execute commands"; restore tested nightly.

### Supabase keys, tokens, backups (read 2026-10-12 as .md; copies in raw-arch/)
- https://supabase.com/docs/guides/api/api-keys : publishable key: "Anyone can read it, so it only reaches what Row Level Security allows"; secret key: "It bypasses Row Level Security, so it must never leave your control"; "Supabase is deprecating the `anon` and `service role` keys by the end of 2026." (Our src/engine/results.js already uses an `sb_publishable_` key - checked in the repo.)
- https://supabase.com/docs/guides/platform/personal-access-tokens : "Classic tokens ... carry your account's full access"; "Scoped tokens carry only the organizations, projects, and permissions you choose."; "We recommend scoped tokens for everything, especially AI agents, automation scripts, and CI environments. If a token leaks, the blast radius stays small."; MCP `apply_migration` needs "Migrations (Read-write)"; `execute_sql` needs "Database (Read)" -> whether a Database-Read token alone stops writing SQL: unverified; the doc's read-only guarantee is `read_only=true` ("Execute all queries as a read-only Postgres user").
- https://supabase.com/docs/guides/platform/backups : "We automatically back up all Pro, Team, and Enterprise Plan projects on a daily basis."; "Pro Plan projects can access the last 7 days of daily backups."; "We recommend that free tier plan projects regularly export their data using the Supabase CLI `db dump` command and maintain off-site backups."
- Our project is on Pro (docs/state.md line 15-16, read 10.10 by the connector): daily backups 7 days apply (inference from the two quotes).

### What attackers take from "browser talks to the database" set-ups (Supabase / Firebase)
- NVD API record CVE-2025-48757 (https://nvd.nist.gov/vuln/detail/CVE-2025-48757; read via services.nvd.nist.gov API 2026-10-12): published 2025-05-30; "An insufficient database Row-Level Security policy in Lovable through 2025-04-15 allows remote unauthenticated attackers to read or write to arbitrary database tables of generated sites. NOTE: this is disputed by the Supplier because each individual customer of the Lovable platform accepts a responsibility over protecting the data of their application."; CWE-863; CVSS 3.1 9.3 (cve@mitre.org). Scale "about 170 of 1,645 apps": secondary blogs only (superblocks.com), unverified.
- Demissie et al. 2021, IEEE SMDS, "Assessing the Effectiveness of the Shared Responsibility Model for Cloud Databases: the Case of Google's Firebase" (Consensus record, abstract only; numbers not used): public and world-writable Firebase databases found in top Android apps.
- Zuo et al. 2019 IEEE S&P "Why Does Your Data Leak?" (abstract only): root causes "lack of authentication, misuse of various keys ... or misconfiguration of user permissions".

### WebXR fit of hosted platforms
- Pavlovia: forum thread, 13-15 Oct 2024, https://discourse.psychopy.org/t/getting-pavlovia-to-host-a-custom-javascript-html-experiment-and-save-the-data-help/42448 (read 2026-10-12): a user with a JS driving-simulator game: "I want Pavlovia to host this experiment, and also save any data from it into a CSV file."; answers (not staff): wrap it in jsPsych and "let the pavlovia plugin do the actual saving at the end of the experiment"; Pavlovia jsPsych docs called somewhat outdated. -> A custom WebXR game on Pavlovia means moving the game onto their hosting and saving through their plugin (inference); not tested by anyone for WebXR in what I read.
- Gorilla, Cognition.run: whether a custom A-Frame/WebXR scene can run inside: not found (unverified).
- JATOS: hosts "online studies that are written in JavaScript" (Lange et al. 2015 abstract) -> any JS game fits (the game's files live on the JATOS server).
- DataPipe: "can be used with any experiment software that can make HTTP requests" -> fits a static GitHub Pages game unchanged.
- Ouvrai: built for WebXR on Firebase (Cesanek 2024) -> proven WebXR path, but Google holds the data.

### Claude Code's own permission docs (the assistant side) https://code.claude.com/docs/en/permissions (read 2026-10-12)
- "Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or `CLAUDE.md` shape what Claude tries to do, but they don't change what Claude Code allows."
- "Rules are evaluated in order: deny, then ask, then allow."; "A tool matched by a bare-name glob deny rule is removed from Claude's context"; `mcp__<server>__<tool>` names one MCP tool.
- Limit: a Bash deny rule "covers the invocation Claude usually produces and isn't a security boundary around the program"; for real enforcement "use sandboxing".
- Inference: a deny rule on the Supabase MCP write tools is an engineering control on the laptop; a key/token that has no write right is stronger (it holds even if the rule is bypassed, e.g. via curl with a password in a file).

### Keeping the live key out of the assistant's reach on GitHub (part 3/4)
- Supabase "Automated backups using GitHub Actions" https://supabase.com/docs/guides/deployment/ci/backups (read 2026-10-12 as .md): dumps roles, schema and data with `supabase db dump`, `SUPABASE_DB_URL` "securely stored in the GitHub secrets", nightly cron, auto-commit; "Note: Never backup your data to a public repository."
- GitHub docs, deployments and environments https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments (read 2026-10-12): "Secrets stored in an environment are only available to workflow jobs that reference the environment."; "If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it."; "Use deployment branches and tags to restrict which branches and tags can deploy to the environment." (options incl. "Protected branches only"); on Free/Pro/Team "required reviewers are only available for public repositories."
- Our repo exxxit-game/youaretheobject is PUBLIC (gh repo view, 2026-10-12) -> required reviewers are available to us; and a data backup must NOT go into this repo (Supabase note). Inference.
- Risk (inference): a repository-level secret (not environment-scoped) is readable by any workflow file pushed to any branch of the repo, so a workflow the assistant writes on a branch could use it; an environment secret limited to protected `main` + required reviewer (the owner) closes that path.
- Reddit AMA (r/Supabase, Apr 2025) https://www.reddit.com/r/Supabase/comments/1jrm8ek/supabase_mcp_server_ama/ : seen only as a search snippet via a mirror: a user asked for a read-only setting "to be 100% sure that Cursor/Windsurf is not able to modify my DB"; team: a read-only flag forces a read-only Postgres role; branching as "the ideal flow for AI-driven development" -> unverified (owner to save).
- Confirmed: GitHub "Secure use reference" https://docs.github.com/en/actions/reference/security/secure-use (read 2026-10-12): "Any user with write access to your repository has read access to all secrets configured in your repository."; "You can use required reviewers to protect environment secrets." (The assistant pushes branches here, so it has write access -> repository secrets are within its reach; environment secrets behind the owner's approval are not. Inference.)

### Rule piles and the AI assistant itself
- Claude Code best practices https://code.claude.com/docs/en/best-practices (read 2026-10-12 as .md): "Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"; "If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost."; "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens."; "If your CLAUDE.md is too long, Claude ignores half of it because important rules get lost in the noise."
- Inference: written rules are advisory (administrative control); hooks/permission rules are enforced on the laptop (engineering control that the assistant's own environment runs); a credential that cannot write is outside the laptop entirely (elimination of the hazard path). The PocketOS and Replit cases are the rule-only layer failing.

## Part 5. Comparison table (sources above; "inf." = our inference; costs are arithmetic from the quoted prices)

| Option | What it holds / where | Who can read it | What can go wrong | Owner's effort | Cost at 10 | Cost at 100,000 | Fit for us |
|---|---|---|---|---|---|---|---|
| Supabase, current (EU, Pro, closed tables, 4 insert-only functions) | rows in our Postgres, Ireland | us (dashboard, secret key, DB password); anon only what the functions return | a key or migration with write rights in the wrong hands (Lovable CVE-2025-48757: RLS missing -> anyone read/write); AI with write access (Replit, PocketOS); Free plan: no backups, pause after 1 week | migrations + checks; already built | Pro $25/month (already paid) | $25/month base (+compute if needed: unverified) | best: already live, WebXR static site posts to it, server-side aggregates (compare_room) |
| Supabase Free | same | same | no automatic backups; paused after 1 week inactivity; 500 MB | same | $0 | $0 until 500 MB (row size unverified) | weaker than now |
| DataPipe -> OSF | one file per session in the researcher's OSF component (private by default; region settable) | OSF project members; public if made public | fake files can be added (never overwrite); token breach at DataPipe; DataPipe down; OSF API 10,000 requests/day (2023); Google Cloud logs IP 30 days | almost none | $0 | $0 (OSF 5 GB private / 50 GB public per component, 2023) | fits a static WebXR site; no server-side query -> no in-game comparison (inf.); good as a born-open second copy later |
| JATOS self-hosted | DB on our own server | whoever runs the server | everything the server runs (Java, DB, proxy, patches, backups) is ours | high: server admin | server rent (unverified) | server rent (unverified) | poor: owner "knows nothing about servers" |
| MindProbe (hosted JATOS) | ESCoP's JATOS server | its admins (forum: 3; unverified) | third party; eligibility, limits, region not on the page | low | $0 | $0 (limits unknown) | unverified for a non-academic game |
| Pavlovia | their servers (GitLab repo per project) | Pavlovia staff + us | game must move into their hosting/plugin; WebXR untested | low-medium | £2.60 | £26,000 by credits, or £2,000/yr (univ./charity) / £4,000/yr commercial licence | poor (inf.) |
| Gorilla | Azure Ireland (2021 text) | Gorilla + us | per-token cost; custom WebXR inside unverified | low | £27.25 (25-token minimum, academic) | £109,000 academic PAYG (subscriptions cheaper, not read) | poor (inf.) |
| Cognition.run | their servers; region choice on paid plans | them + us | jsPsych-centred; WebXR unverified | low | $0 (60 runs/task) | $2,990/yr Teams | poor (inf.) |
| Firebase (Ouvrai's WebXR route) | Google project | Google + us | security rules are the only lock ("anyone who guesses your project ID can steal, modify, or delete" with open rules) | medium: rules + anonymous auth | $0 (Spark: 20K writes/day, 1 GiB) | likely $0-low if spread (inf.) | proven for WebXR, but a rewrite with no gain over what we have (inf.) |
| Static form service (Formspree) | vendor's servers (location not stated) | vendor + us | spam; free keeps 30 days; no aggregates | none | $0 (50/month) | $90/month Business (20,000/month) | poor for science (inf.) |

## Part 6. What suits our exact situation (all inference from the quoted sources)
1. Keep Supabase as the one store; it already has the structure the sources recommend (fail-safe defaults: tables closed, anon can only call 4 insert-only functions = Saltzer-Schroeder "permission rather than exclusion"; OWASP "authorization in downstream systems").
2. Make "the assistant cannot damage live" a property of keys, not of rules (NIOSH: elimination/engineering above administrative):
   a. The assistant's only live access: the Supabase MCP with `project_ref=<ours>&read_only=true` and restricted feature groups, on a scoped token without Migrations/Edge Functions write (Supabase MCP + PAT docs). No DB password, secret key or classic token on the laptop (CLI already logged out 12.10, docs/state.md).
   b. Changes reach live only through GitHub: either Supabase's GitHub integration "Deploy to production" from protected `main`, or an Action whose DB password is an ENVIRONMENT secret limited to protected `main` with the owner as required reviewer (public repo -> available on Free). A repository-level secret is not enough ("Any user with write access ... has read access to all secrets").
   c. Then the hook that refuses apply_migration and the "live is read-only" rule become redundant: one structure replaces several guards (Claude Code docs: rules are advisory; bloated rule files get ignored).
3. Check before live without a paid staging: `supabase db push --dry-run`, a Supabase preview branch per PR ($0.01344 per branch-hour; whether compute is extra: unverified), or a second project.
4. Recovery over prevention (GitLab, DataTalks): Pro's 7 daily backups + a nightly off-site dump to a PRIVATE place (never this public repo) + a restore test on a schedule.
5. Later, for science (after ethics approval): DataPipe -> a private OSF component as a born-open, never-overwritten second copy is cheap ($0); its US processing and 30-day IP logs at Google need the privacy text (inf.).
6. Purchases: not researched here (other helper). Inference only: payment data should never enter our database.

### Branching cost detail
- https://supabase.com/docs/guides/platform/manage-your-usage/branching (read 2026-10-12 as .md): "You're charged for usage within that environment—such as Compute, Disk Size, Egress, and Storage—the same as the project you branched from."; "Branches are **not** covered by the Spend Cap."; compute shown as "Branching Compute Hours". -> the pricing page's $0.01344 per branch-hour is the compute part; disk/egress extra (inf.); no spend cap protects branches (quote).
- Same page: "There is no fixed fee for a Preview branch."; "A branch running on the default Micro Compute size starts at $0.01344 per hour."; their example: a branch running 30 hours -> "Compute Hours Micro Branch XYZ | $0.4", egress $1.

## Unverified / not done (2026-10-12)
- Supabase MCP page's earlier wording "Don't connect to production": only third-party quotes; today's page says "only when the task requires production evidence".
- PocketOS founder's own post (X) and Railway's blog post: not opened; details via heise + Railway changelog only.
- Gorilla subscription prices and commercial PAYG (https://gorilla.sc/pricing behind a cookie banner, not accepted); Pavlovia credits page (script page, empty).
- JATOS server rent; MindProbe terms, eligibility and region; whether Gorilla/Cognition.run can run a custom WebXR scene.
- OSF limits (10,000 requests/day, 5/50 GB) are as of the 2023 paper; current OSF limits not re-read.
- Firebase/Supabase misconfiguration prevalence numbers: abstracts or blogs only, not used as numbers.
- Size of one of our run rows (for the 100,000-row storage estimate): not measured.
- Purchases and Cosmogram: left to the other helper as asked.
