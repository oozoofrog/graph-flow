# Changelog

## Unreleased — 0.4.0-dev

- Graph Flow uses a dark-only dashboard and retires the light presentation. Graph cards identify work, state, risk and recent recorded activity in words and patterns. Relations name their live flow state on their own branches. The graph adds record-triggered motion with one pause and a static SVG path, an overlay detail drawer, a phone bottom sheet, and locally bundled OFL fonts.

- Graph Flow relation details show the relevant records, and work details link the full-width 3D scene to phase records and aligned category totals.

- Graph Flow records local activity metadata through Claude Code hooks and trusted, asynchronous Codex tool hooks. Sessions without tool observations retain their recorded attempt boundaries.

- Graph Flow adds a bundled three.js graph renderer with SVG fallback, dependency focus above dimmed edges, shared orthogonal routes, three zoom levels and a navigable minimap below the graph. Screen captures verify renderer parity, pixel ink, routing regressions, interaction geometry, fallback and motion.
- Graph Flow dashboard cards now distinguish kind and state without color across both map levels and the phone list. Review arrows follow target-to-reviewer order, line patterns distinguish gate states, and whole-result failures reflect the current recorded verdict.
- Graph Flow now verifies the shared renderer scene, stored relations, dependency order, grayscale cues, contrast, and phone action sizes in its tests and screen capture suite.

- Publish Graph Flow as its own Claude Code and Codex marketplace.

## Graph Flow [0.3.0] — 2026-11-18

0.3.0 was the last version distributed from `oozoofrog/oozoofrog-plugin`.

- Graph Flow: integration checks with declared producers run at each listed producer's own work gate at any effective lane once the other producers pass. Other work gates run them at effective lane 2 or 3 once all listed producers pass. The final gate always runs all integration and promoted checks. An undeclared integration check failure after passing node command and scope checks adds an advisory to check for a missing prerequisite. The dashboard displays skipped checks and conformance reports skip counts. CLI trace is limited to leaders and humans, and MCP trace is exposed only to leaders.

- Graph Flow: document the two design sources and add a maintainer checklist for orchestration changes.

- Graph Flow uses `gpt-6.2-sol` for scoped and daily Codex work and `gpt-6.2-astra` for large and security work. The OpenAI escalation ladder uses the same models.

- Graph Flow: keep the selected card's full opening explanation visible in the sticky desktop panel below the stacked plan question and choices.

- Graph Flow: show complete check titles on separate detail-card lines with current result symbols and text; capture 101 isolated dashboard scenes.

- Graph Flow: add advisory notices for literal later-owned paths in run checks and checks already passing before observed work. Show the notices on plans/nodes and count pre-work passes in conformance output without changing verdicts.

- Graph Flow: carry failed review findings into the next work brief, distinguish run-level and node check rejections in history, and name unplanned answer kinds on the P10 text line. Gate rules are unchanged.

- Graph Flow: every dashboard question uses choices with state-specific consequences, reasons, attempt/review history and current verification. Plan changes survive reloads; free questions can supply repeated `--option` answers. Existing reading and signing rules are unchanged.

- Graph Flow: capture 81 dashboard scenes, including maximum-length Korean text and selected cards of every kind on desktop and phone. Keep the phone diagram below its view toggle at full width, and verify the requested gray/glance variants with isolated processes.

- Graph Flow: show only whole text lines at graph viewport edges and reveal the first explanation when selecting below a long warning band. Align unverified-answer provenance, label workers/models, use review-specific activity, group panel headings with content, expose the existing evidence action clearly, and clarify legacy questions, handoffs and plan warnings.

- Graph Flow: unify unread card marks and Start reasons, use the same plan/final-card count, show neutral completed-reading notes, reserve scroll gutters, and name scrollable views truthfully when Fit reaches the readable minimum. Phone action bars summarize remaining cards with an expandable list.

- Graph Flow: selected cards start with their full summary (then goal or review/question fallback), pinned beneath the title in every mode. Cards wrap complete titles, summaries and check names at both levels; measured heights keep dependencies and plan order intact.

- Graph Flow panel scrolling: snap text to the body edge so earlier lines cannot peek above the first complete line.

- Graph Flow screen evidence: distinguish lower rows, unverified answer records, graph banners and completed on-page recovery; capture all 69 r18 scenes with relation/content assertions and the requested 29 grayscale/glance pairs.

- Graph Flow dashboard: name unread cards and their existing reading action; match change and relation lists to graph cards; localize contract changes; remove duplicate questions/checks; clarify counts, evidence, answer outcomes, failure scope and worker roles.

- Graph Flow dashboard: wrap toolbar counts, pin the selected title above the panel scroll area, keep phone layers opaque, reserve scroll gutters, measure card content, and retain the selected card after fit or level changes.

- Graph Flow screen fixtures: distinguish fit/default overviews, mid-flight runs and the problem inbox; use distinct Korean titles, capture expanded answers, and generate all requested grayscale/glance verification images.

- Graph Flow dashboard: align request/check/title counts, describe plan diffs and held reviews accurately, preserve readable warning/answer slots, explain existing Start/Continue locks, and remove overlapping panel/list headers. Correct superseded-decision targets without changing approval or gate rules.

- Graph Flow dashboard: preserve real dependency routes and stable card order in narrow/selected overview layouts; branching graphs scroll instead of using the compact chain router.

- `graph-flow` agent guidance: slim the entry skill, consolidate the human-identity rule, split the planner contract into `references/plan.md`, and move maintainer signatures/view models to `docs/implementation.md`. Relocate recovery guidance, document measured conformance and the deliberate plan-approval addition to P10, and keep answer-signing machinery frozen.

- `graph-flow`: status, trace, decision listings and dashboard reads retain available records and recovery advice when plan integrity or the event log fails. Dispatch guards and signing, key and move handling are unchanged.

- `graph-flow`: approved wording-only plan revisions retain consent and dispatch. Revision logs identify nodes whose wording feeds later human questions; existing gate questions still supersede and re-ask through the existing gate path. Structural identity exclusions are unchanged.

- `graph-flow`: add read-only human-answer/wait and failing-check measurements to `trace` and MCP, with P1–P12 observations via `trace --conformance`. Trivially successful command checks produce normalization notices; gate verdicts stay unchanged.

- `graph-flow` 0.3.0 release fixes: persist approval supersession after observed moves/evidence changes and every gate re-ask; protect only approvals still in force. Rejected decisions and exhausted holds can be revised, refused starts preserve state, edited submitted files re-ask without spending attempts, stale waits return recovery advice, and key recovery survives moves. Legacy plan consent remains valid after later result edits. The dashboard separates binding decisions from free questions, names all released downstream work, uses consistent state/check counts, gives plain permission refusals, and locks plan approval until graph cards have been seen. Reading fields, fit/clipping hints, answered-card tense and recovery text are corrected in both languages.

- `graph-flow` 0.3.0: every run waits for verified plan approval. Re-post a 0.2.1 run's current plan, read its retained results and approve it to continue without restarting unchanged submissions. Only the tool creates binding approvals, and answered decisions cannot release newly added or changed work. Every planned review must pass its own gate on the current submission, at every lane, before its target is accepted. A project move requires one new plan approval; old-location questions become stale and unconsumed approvals are asked again without consuming an attempt. Completed work remains accepted. Key recovery separately requests plan approval again.
  Plans reject unknown, inapplicable or retired constraints and invalid field types. The dashboard shows answered and future questions separately, plan-author notes, requirements, conditional review rules, and where whole-result checks also gate individual work. Free questions identify the asker and cannot accept or release work. Failed-review questions name the findings and their review. The light graph opens fitted, keeps its level and scale on selection and polling, and shares counts and state wording across graph, record, list and phone views. Approval is offered on the graph; changed or replaced plan cards must be opened first. Reading controls describe actual attachments, editable checks carry a warning mark, and durations include units. Keyboard access, reduced motion, strict CSP and the accessible list remain supported. Execution records remain unsigned; approval does not attest execution.

- `graph-flow` 0.2.1: `gf setup` installs the command as `graph-flow` as well as `gf`, because many shells already alias `gf` to `git fetch`; a foreign `gf` file is left alone while `graph-flow` is still installed, and the skill checks for `graph-flow` before offering setup and tells people to type `graph-flow`. The launcher ignores cache folders that are not version numbers when choosing the newest version. `gf status` with no run selected lists the project's runs with their status and open decisions, so a new session can pick one up. The expired-tab page and the answer notice now say what to do next: run `graph-flow open`, and tell a stopped leader session that you answered. The graph has fewer marks and a complete legend: text on a line only names what is handed over, review lines are dotted, attempts are written as words instead of pips, a card that came back says how often and which checks did not pass, and a card with an open decision shows the question and a button to answer it. The graph no longer shrinks below 75%; a wider graph scrolls and first shows the leftmost unfinished card. The `attemptPips` and `failedBadgeCount` exports are removed. The page opens on the graph again; “할 일과 기록” is the second tab.

- `graph-flow` 0.2.0: the dashboard opens on “할 일과 기록” (To do and log) instead of the node graph. It lists the decisions waiting for the person, the work in progress with its worker and session, and a record of what happened in time order, newest first, with one entry per attempt. An attempt entry opens to its real checks (title, result, command, exit code, duration, files touched outside its own, and the log on request), the worker's note, review findings and changed files. Filters show only the person's decisions or only what came back, and a table lists every task. The node graph moves to its own “그래프” (Graph) view; selecting a card there shows the node's attempts and checks in the side panel in place of the generic make/check/fix drawing. Counts appear once, in the header, which also names the project and run id. Finding an answered decision scrolls to its answer in the record, and finding a node shows that node's entries. Pressing an id copies `<id> · <title>` for the chat. `gf` now records the host's chat id as the session when `GF_SESSION` is unset (`T3CODE_THREAD_ID` as `t3:<id>`, else `CLAUDE_CODE_SESSION_ID` as `claude:<id>`). The view gains `run`, `project` and `timeline`; commands, exit codes and log paths, which the view used to leave out, now appear in `timeline`. The separate history view and its `innerLoopState` export are removed.

- `graph-flow` 0.1.1: add `gf open`, which opens the dashboard in the person's default browser and starts a detached `gf serve` when none is running, and `gf open --stop`, which stops it. Neither prints the address or the token, so an agent session may run them when the person asks to see or close the dashboard. Answering stays with the person: an agent session still never runs `gf serve`, reads `server.json` or `human.key`, sends requests to the dashboard, or operates its page. Add `gf setup`, which writes a `gf` command to `~/.local/bin` (or `--bin-dir`) that runs the newest installed version, refuses to replace a file it did not write, and reports the `export` line when the directory is not on PATH; `gf setup --remove` deletes it. The skill has the leader offer this once when `gf` is not on PATH and run it only after the person agrees. The dashboard now moves: a walking frog, glow and blinking pip on a running card, dashes flowing along open routes into it, a one-time pop when a card starts or finishes, a one-time shake when it is returned, and a pop and waving frog at completion. Motion repeats what text and colour already say and is off under `prefers-reduced-motion`. The decision view shows only recorded sections instead of repeating "Not recorded", says why sending is unavailable, and labels the way back as leaving unanswered; the history view names returned attempts as checks that did not pass. Agent messages and the dashboard now share references: the page shows each decision id with who asked and when, and each node id with its model and session; a find box takes either; `gf open --decision <id>` and `gf open --node <id>` open the browser on that item, and `gf decide ask` returns the command as `show`. The leader is told to quote the question, name the node by title and open the decision instead of citing an id alone.

- Add `graph-flow` 0.1.0 to both repository marketplaces using its existing Codex discovery metadata and MCP configuration alongside the existing Plugins. Document graph-based planning, per-node delegation and checks, human decisions, invocation, and the user-run `gf serve` dashboard. Add distribution contracts and isolated Python graph-flow tests to CI.
