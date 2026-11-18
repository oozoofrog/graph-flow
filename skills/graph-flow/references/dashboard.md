# Dashboard HTTP API

Execution records (check results, submissions and merge results) are unsigned and can be falsified by anything with file access. Editing the project directly bypasses the tool. Signed approval protects the particular question, context, approved plan, submission and evidence hashes within the recorded project/run location; it does not prove execution or prevent direct edits.

This is the contract for `graphflow/server.py`, its `page.html` and `page.js`, and an optional host-side pane. State, readiness, decisions and trace use the formats in [records.md](records.md), sections 5, 7 and 9. The dashboard is the human answer surface described by P10 in [principles.md](principles.md).

## Process and access

A person starts the independent process with `graph-flow serve`. `serve(host="127.0.0.1", port=0)` accepts only `127.0.0.1` and `localhost`; any other host raises `GFError("bad_host", ..., 2)` before binding or creating a key. Both accepted names bind IPv4 `127.0.0.1`; port 0 selects an available port. Startup does not create `human.key`; the first human answer does. Startup creates a fresh `secrets.token_urlsafe(32)` token, and publishes `$GF_HOME/server.json` under `$GF_HOME/.lock`, with atomic replacement and mode 0600:

```json
{"url": "http://127.0.0.1:12345/?t=TOKEN", "port": 12345, "token": "TOKEN", "pid": 1234, "started": "2026-11-15T09:30:00Z"}
```

Stdout contains one JSON line, `{"ok": true, "url": "http://127.0.0.1:12345/?t=TOKEN", "port": 12345}`. The process serves until interrupted, closes its listener on shutdown, and removes `server.json` under the same lock only if the record still names its PID. It does not follow an agent session's lifetime. `make_server(port=0)` returns `(httpd, token)` without blocking or publishing a record; its caller owns serving, shutdown and close.

Every route, including the page and unknown routes, requires the Host check below. Only GET `/static/<name>` skips token authentication. An unauthenticated GET `/` returns the static 401 recovery page described below; all run data and other routes require a token:

- Exactly one `Host` header, either `127.0.0.1:<bound port>` or `localhost:<bound port>`. A missing, duplicate or foreign Host returns HTTP 403, code `bad_host`.
- For GET, `X-GF-Token: <token>` or query parameter `t=<token>`. An existing header takes precedence over the query. The token is checked with `hmac.compare_digest`.
- For POST, the token must be in `X-GF-Token`; a query token does not authorize a write. Missing, wrong or duplicate tokens return HTTP 401, code `unauthorized`.

Authenticate before dispatching (except the public static GET route described below). Authenticated methods other than GET and POST return HTTP 405, code `method_not_allowed`; HEAD has no response body. JSON responses always include `Cache-Control: no-store`. The page and evidence also carry `no-store`. Responses include `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`; access logging is disabled so it cannot record token URLs. No CORS access is granted.

POST bodies must be UTF-8 JSON objects with one nonnegative `Content-Length`, no `Transfer-Encoding`, and a size of at most 65,536 bytes (64 KB). Over-limit bodies return HTTP 413, code `body_too_large`. Invalid framing, empty bodies, malformed UTF-8/JSON, and JSON values other than objects return HTTP 400, code `bad_body`.

The server uses `http.server.ThreadingHTTPServer`. Files are the source of state: each request reads current records; no decision or state cache is kept. GET uses the existing transaction snapshot, which can persist observed decision supersession after a move or changed evidence. It does not run checks or execute recorded commands. POST writes only through `decisions.answer` or the confirmed human-only key recovery path `decisions.repin`; other process writes are the dashboard’s own `server.json` and lock handling.

## Who the token stands for

An answer posted with the token is recorded as the person's decision. The token, `server.json` and `human.key` are readable by every process of the same OS user, so roles are a cooperative rule and not a security boundary between a person and an agent on the same account. The rule: opening the dashboard is separate from answering on it. A person may run `gf serve` and open the printed address, or run `gf open`. An agent session opens the dashboard automatically at plan approval, a waiting decision, and completion, using the creating command’s `--open`, or runs `gf open` when the person asks to see it, and `gf open --stop` when the person asks to close it; neither prints an address or a token. An agent session never runs `gf serve` or reads `server.json`; follow the [human identity rule](../SKILL.md#human-identity). An agent that needs a decision records it with `gf decide ask` and waits.

## Opening without the address

`gf open` opens the dashboard in the person's default browser. `open_dashboard()` reads `server.json`; the recorded dashboard counts as running only when its PID exists and GET `/api/projects` with the recorded token returns 200 on the recorded port. Otherwise it starts `gf serve` as a detached process in its own session, with no standard streams, and waits up to 10 seconds for a record that answers. It then passes the recorded URL to `webbrowser.open`.

The result is `{"ok": true, "opened": true, "started": <bool>, "port": <port>, "message": "Dashboard opened in the browser."}`; `started` says whether this call started the process. No output or error message contains the URL or the token. A dashboard that does not answer in time fails with `dashboard_unavailable`, and a browser that does not open with `no_browser`, both exit 5.

A dashboard started this way keeps running after the calling session ends. `gf open --stop` stops the recorded dashboard when it answers: it sends SIGTERM to the recorded PID and removes `server.json` under `$GF_HOME/.lock` if the record still names that PID. The result is `{"ok": true, "stopped": <bool>, "message": ...}`; `stopped` is false when no dashboard answers. Both forms are limited to the leader and human roles and need no run.

## GET /

Returns `text/html; charset=utf-8`, loading `page.html` beside `server.py`. If the file is absent, a minimal HTML page says "The page is not installed."

Every response creates a fresh random nonce, replaces every literal `__NONCE__` in the file with that nonce, and sets this Content-Security-Policy (the same nonce for script and style):

```text
default-src 'none'; script-src 'nonce-<nonce>' 'self'; style-src 'nonce-<nonce>'; connect-src 'self'; font-src 'self'; img-src 'self' data: blob:; base-uri 'none'; form-action 'none'
```

The page puts `nonce="__NONCE__"` on its style, import map and entry module. The import map resolves `three` to the loopback server. It stores the startup query token in this tab's `sessionStorage`, under `graph-flow-token:<port>`, removes `t` with `history.replaceState`, and sends `X-GF-Token` on every API request. When `t` is absent it reads the stored token. Storage is scoped by origin and the key by port. All record text uses `textContent`. The policy permits nonce-authorized markup and same-origin modules. CSSOM/element.style changes position and scale the DOM cards and SVG routes.

Reload recovery briefly puts a token-bearing URL in browser history before `replaceState` removes it, just as opening the printed address does.

An unauthenticated GET `/` returns HTTP 401 with `text/html; charset=utf-8`, `no-store`, and the same referrer, content-type and frame security headers. This small static page contains no token or run data and does not read projects or runs. Its fresh-nonce CSP is `default-src 'none'; script-src 'nonce-<nonce>'; base-uri 'none'; form-action 'none'`. Its only script reads the same session storage key and navigates to `/?t=<encoded token>` if a stored token exists and the URL has no `t`. Otherwise it says to open the address printed by `gf serve` (Korean or English). Checking for an existing `t` prevents an expired token from causing a redirect loop. If storage is unavailable, reopen the printed address. Unauthenticated requests to every other route remain JSON 401 responses; a bad Host still returns 403 before recovery.

## GET /static/<name>

The exact, case-sensitive `STATIC_TYPES` allowlist includes `page.js`, `graph-webgl.js`, `activity-webgl.js`, the four existing `assets/frog-*.png` files, and the individual vendored files in the [three.js manifest](../scripts/graphflow/vendor/three/manifest.json) and [font manifest](../scripts/graphflow/vendor/fonts/manifest.json). JavaScript uses `text/javascript; charset=utf-8`, manifests use JSON, licences use plain text, fonts use `font/ttf`, and artwork uses `image/png`. The page CSP permits fonts only from its loopback origin. GET requires the same Host check and permits unauthenticated static imports. Unknown names, dot segments, percent-encoded names/separators, and traversal under `/static/` return 404 without decoding or normalizing the requested path. Static responses include `no-store` and the usual security headers. POST and other methods retain authentication.

## GET /api/projects

Enumerates every project root in `$GF_HOME/registry.json`. Project order follows the registry; runs are sorted by ID. An absent registry yields an empty list.

```json
{"projects": [{"root": "/absolute/project", "name": "project", "runs": [{"id": "export", "status": "open", "nodes": 2, "passed": 1, "open_decisions": 1, "last_event": "2026-11-15T09:30:00Z"}]}]}
```

`status` is derived `run.status`; `nodes` and `passed` count current plan nodes; `open_decisions` counts open, non-stale decisions. `last_event` is the last readable event's timestamp, or null for an empty log. A run with no plan has zero nodes. A deleted or unreadable project gets an `error` string on its project entry; an unreadable run gets an `error` on its run entry (retaining its `id`). These conditions never turn the whole response into a 500 or discard other projects.

## GET /api/queue

Returns every open, non-stale decision from every readable run of every registered project, oldest `decision.ask` timestamp first. Equal timestamps retain project/run enumeration and decision sequence order. Deleted projects and unreadable runs are skipped; `/api/projects` reports their errors.

```json
{"queue": [{"project": "/absolute/project", "run": "export", "id": "d14", "node": "build", "kind": "authorization", "purpose": "lane3", "question": "Approve lane3 for build?", "asked": "2026-11-15T09:30:00Z", "evidence": {"command": ["python3 -B test.py"], "files": ["app.py"], "checks": {}}, "node_state": {"status": "awaiting_approval", "attempts": 1, "lane": 3, "effective_lane": 3}, "checks": [{"check": "unit", "phase": "gate", "result": "passed", "exit_code": 0, "command": "python3 -B test.py", "log": "evidence/build/unit/a1-1234abcd.log"}], "changed_files": ["app.py"]}]}
```

`evidence` is the decision's evidence snapshot; `node_state`, `checks` and `changed_files` come from current derived node state. `checks` contains the latest gate-phase and loop-phase result for each check in the node's current attempt, in check order with gate before loop. Each row has all six keys shown; unavailable values such as a scope check's command or log are null. `changed_files` comes from the node's current submission, or is empty when there is none. A decision with `node: null` has null values for all four `node_state` fields and empty `checks` and `changed_files`. Answered and stale decisions are excluded on the next request, without restarting the process. This evidence is what the person reads before approving.

## GET /api/run?project=<root>&run=<id>

Returns `{"plan": <stored normalized plan or null>, "state": <derived state>, "ready": [<node IDs>], "trace": <trace result>, "view": <presentation view>}` for one run. The `view` shape is defined in [maintainer view schema](../../../docs/implementation.md#12-dashboard-presentation-view). It includes readable decision `verified`/`unverified` lists and `worker_note`, and node `inputs`/`outputs` derived from edges. Per-attempt work summaries appear in `view.nodes[].activity` when the records include an attempt. The page draws from `view`. Check logs are fetched from `/api/evidence` only when the person presses a log button or opens a decision's details disclosure. The state, readiness, trace and view are read under that run's lock. Readiness uses `graph.available` (empty while plan approval waits); trace uses `trace.trace`.

The `project` string must exactly match a registered absolute root (HTTP 404, `unknown_project`, otherwise). The run ID must fully match `[a-z0-9][a-z0-9._-]{0,63}`, resolve inside the project's runs directory and exist with an event log (HTTP 404, `unknown_run`, otherwise). These addressing rules also apply to evidence and answer endpoints. URL-encode query values, especially roots and log paths.

## GET /api/evidence?project=<root>&run=<id>&path=<relative path>

Returns one evidence log as `text/plain; charset=utf-8`. `path` is relative to the **run directory**, matching recorded check logs, for example `evidence/build/unit/a1-1234abcd.log`.

Absolute paths, paths resolving outside this run's `evidence/`, and symlinks escaping that directory return HTTP 403, `forbidden_path`. An evidence directory that itself resolves outside the run is also forbidden. The target must be a regular file; missing files, directories and other nonregular files return HTTP 404, `unknown_evidence`.

At most 204,800 response bytes (200 KB) are returned. Content is decoded as UTF-8 with replacement for malformed sequences. Oversized responses end with `\n[truncated]\n`, included in the byte limit, and never split a UTF-8 character. This route serves only regular files reached through the run's `evidence/` directory; a path that resolves outside it is refused. A hard link placed inside `evidence/` is served like any other file there, so the guarantee is only as strong as who can write to that directory.

## GET /api/file?project=<root>&run=<id>&decision=<decision id>&path=<project-relative path>

Authenticated, Host-checked, read-only text reader for the files a person must review. The decision must exist in the selected run, be open and not stale. Its allowlist is exactly the node's **current** submission `changed_files` plus the decision evidence `files`; neither ownership nor arbitrary project files authorize access. `view.decisions[].files` provides deduplicated `{name, path}` choices. The basename is the file button; secondary paths and hashes stay inside a details disclosure.

The path must be relative, contain no `..` component, NUL or backslash, and enter neither `.git` nor `.graph-flow`. After resolving symlinks it must remain inside the project and outside those directories. The resolved path is opened through directory descriptors with no-follow checks on each component, refusing a symlink substituted between validation and opening. `human.key`, `server.json`, `registry.json`, their symlink aliases, and hard links to the current dashboard's private records are refused. Absolute paths and unlisted spellings (even equivalent spellings) return 403 `forbidden_path`. An unknown decision in this run returns 404 `unknown_decision`; answered or stale decisions return 403 `unavailable_decision`.

The target must be a regular UTF-8 text file without NUL bytes. Missing, nonregular, binary or malformed UTF-8 files return 404 `unknown_file`. The whole stream is validated, including bytes beyond the display cap. At most 204,800 response bytes are returned, with the evidence route's `\n[truncated]\n` marker included in that limit and no split UTF-8 character. Responses use `text/plain; charset=utf-8`, `nosniff`, and `no-store`; failures use the existing JSON error shape. Reads never execute file content or recorded commands.

The decision view loads each file on demand into a scrollable, paper-coloured plain-text reader using `textContent`. Markdown and HTML remain literal text. A successful file load satisfies the UI reading gate only for hard-to-undo authorizations without failures. When `failed` is non-empty or `purpose` is `hold`, only opening the evidence details disclosure satisfies the gate; reading a worker-chosen file does not. Requests retain the decision session's captured project/run/id, and late results cannot change another session or a later file selection.

## POST /api/answer

The five text fields are required strings containing valid Unicode (HTTP 400, `bad_input`, otherwise). `displayed` is also required: it is the exact `{id, question_hash, artifact_hashes}` identity returned with the decision the page displayed. Missing or mismatched identities return HTTP 409 `stale_decision`; a changed banner disables its actions until the person acknowledges the changed plan.

```json
{"project": "/absolute/project", "run": "export", "id": "d14", "outcome": "approved", "answer": "Publish this version.", "displayed": {"id":"d14", "question_hash":"<displayed hash>", "artifact_hashes":{}}}
```

After resolving the registered run, the server calls:

```python
decisions.answer(run_dir, id, outcome, answer, "dashboard",
                 {"role": "human", "node": None, "session": "dashboard"}, displayed)
```

Success is HTTP 200: `{"ok": true, "decision": <answer data>}`. The answer data contains `id`, `outcome`, `answer`, `source: "dashboard"`, and `sig`. The event is signed with `human.key` and derived state verifies the signature. Answering does not run a gate, start a node, or accept a submission: the leader's next gate consumes the answer and changes readiness according to the normal rules.

Kinds `review` and `authorization` accept `approved`, `rejected`, `revision_requested`; kinds `direction` and `information` accept only `answered`. Empty answer text is allowed except for sending back/rejecting a plan approval. Unknown fields are ignored. The decision layer serializes concurrent answers, validates current bindings and refuses a second answer.

## POST /api/key/repin

The key-mismatch banner offers a disclosure explaining that this computer will create a fresh signing key and require approval again. Its confirmation button sends exactly `{project, run, displayed, confirm: true}`; `displayed` is the `view.recovery_identity` it showed. This route requires the same token and Host protections as answers, plus this server's exact `Origin` and `Sec-Fetch-Site: same-origin`. It accepts no role field, has no agent/MCP entry point, and calls the human recovery path only after verifying the displayed identity under the run lock. Stale confirmations cannot rotate the key. A new key also makes other runs pinned to the previous key require recovery. The person's existing terminal recovery command remains available. A damaged plan cannot be repaired safely by the page: the leader must post its intended plan again, then the person approves it.

## Errors

Errors are JSON objects: `{"ok": false, "code": "<slug>", "message": "<description>"}` with `Cache-Control: no-store`, except the unauthenticated GET `/` recovery page above.

| HTTP status | Codes / meaning |
| --- | --- |
| 400 | `bad_body`, `bad_input`, `bad_outcome`, and other `GFError` input failures |
| 401 | `unauthorized`: token absent or invalid |
| 403 | `bad_host`, `forbidden_path`, `unavailable_decision` |
| 404 | `unknown_project`, `unknown_run`, `unknown_evidence`, `unknown_file`, `unknown_decision`, `not_found` |
| 405 | `method_not_allowed` |
| 409 | `stale_decision`, `already_answered`, `unknown_decision` from answering |
| 413 | `body_too_large` |
| 500 | `internal`: unexpected exception; generic message, no traceback or exception text |

When an answer returns 409, reload the queue and current run before offering another answer. Authentication failures take precedence over route and body errors. Unsupported GET/POST routes return 404 after authorization (POST also validates its JSON body). Methods other than GET/POST are refused after authorization.

## Dashboard and demo

The page defaults to the most recently active readable open run, offers a picker for multiple runs (each option names the run; the header identifies its project), and polls about every two seconds while visible. Korean and English copy follows `view.language`, computed from the plan; browser language is only the no-run fallback. Direction/information decisions use their API-supported `answered` action and require text; review/authorization decisions offer a purpose-specific affirmative action or send back (required reason).

The page has two views and the decision reading view. “그래프” / “Graph”, the node map described below, is what opens. The other, “할 일과 기록” / “To do and log”, is one tab away. The header names the project and run id, the plan title, and one line of counts: work in progress and finished out of total. A decision strip directly above the graph gives the number of open questions once and shows every full question, its copyable decision id and node id, its node title when bound, and a one-click reading button. It includes unbound decisions and disappears when there are none.

The to-do and log view reads top to bottom:

1. **Your turn.** One card per open decision, with its id, who asked, when, the node title, the question (or purpose in plain words when no authored question exists), and the button that opens the reading view. With no open decision it says so.
2. **In progress now.** One line per node that has started and is neither finished nor waiting for the person: title, node id, status, attempt, worker model (explicitly labelled “Model”), session and start time. A running node has a solid play mark. The section is omitted when the run is complete, or when nothing is in progress and the person has decisions to answer.
3. **What happened.** `view.timeline`, newest first. Each attempt is one entry that moves to the time of its latest event; questions, answers, reopenings, the final check and recorded lessons are entries of their own. An attempt entry opens to its real checks: title, passed or failed, who ran it (worker or the leader's gate), the command, exit code and duration, files touched outside the node's own, and a button that loads the check's log through `/api/evidence`. It also shows why it came back when no failed check says so, review findings, the worker's note, low-confidence items and changed files. The current returned attempt is open without a click; earlier attempts are quieter and collapsed in the log. Three filters narrow the list: all, the person's decisions, and what came back.
4. **Tasks as a table**, closed by default: task and id, status, worker, attempts used, and what it still waits for. A task's name shows only that task's entries in the record.
5. **Lessons**, closed by default and present only when some are recorded.

Log entries use quiet borders without a separate colour code. Every entry states its event or outcome in words; answers say whether the person accepted the result, requested changes, rejected it, or answered a question. Dates are day-group headings and all timestamps use aligned 24-hour `HH:mm` text in IBM Plex Mono with tabular numbers. The phone log has no horizontal scroll; only the task table scrolls sideways inside its own box.

The graph uses ordinary screen-aligned DOM cards and labels, a three.js orthographic WebGL2 edge layer, and the existing accessible HTML list. It starts with SVG and loads the bundled renderer on demand when a diagram with edges is visible. SVG also handles unsupported WebGL2, creation failure, context loss and `renderer=svg`.

The dashboard uses one dark control-room treatment across the graph, log,
decision and reading surfaces. Cyan identifies structure, magenta identifies
current work and selection, yellow identifies a needed answer, and red
identifies a failure or return. Completed work uses quiet ink. Scanlines and
the vignette sit beneath the stage grid, shadows belong to traces and plate
backs, and text has no glow. Forced colors uses system colors and SVG paths,
with textures and glow removed. The high-contrast preference also removes textures and decorative glow. The visual references are [Blade Runner 2049
screen graphics](https://territorystudio.com/project/blade-runner-2049/) and
[Territory's account of designing the screens](https://www.pushing-pixels.org/2018/09/27/the-art-and-craft-of-screen-graphics-interview-with-daniel-hojlund.html).
The contrast and non-color requirements follow [WCAG text
contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
[non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
and [use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

Text uses IBM Plex Sans KR, data uses IBM Plex Mono, and titles of at least
16 CSS px use Do Hyeon. Chakra Petch is used for short English control labels.
The full OFL-1.1 faces and licence texts are shipped with
[hashes and upstream paths](../scripts/graphflow/vendor/fonts/manifest.json).
The browser uses system faces if it cannot load the local fonts.

Cards identify work, review, decision and the overall result using words and
distinct chamfered silhouettes. The corner cut increases with the effective
risk level, alongside its written level. The state glyph directly precedes its
word. The filled diamond ◆ and diagonal hazard rim belong to a bound, open
answer. A stalled attempt uses ◴, a broken quiet rim, muted ink and elapsed
idle minutes. An open answer displays elapsed minutes from its recorded ask.
Second and later attempts show their ordinal. The overall result has no risk
label because it has no recorded lane. Existing plan reading and near-card
evidence retain their original checks, questions, and result wording.

The layout uses longest-path layers, reserving space in intervening layers
for long relations. Neighbor sweeps and track ordering control crossings.
Matching relations can share fan-in or fan-out shafts, and individual
branches retain their own marker, route identity and word tag. Reviews run
from target to reviewer. The filled triangle, open chevron and double chevron
distinguish handoff, decision dependency and review. Tags report the existing
flow state in words. Reviews and decision dependencies carry a kind prefix.
The trace is solid for delivery and use, dashed for waiting or out of turn,
short-dashed for a block, and long-short for a return. Gate words and record
references remain available in the detail and edge lists.

Fit chooses Detail or Compact at the readable scale floor of 6/7. Manual
zoom reaches 70%, where the title, strip, category rows and edge tags may
drop while the kind and state remain readable. Larger maps scroll and offer
a minimap with pointer and arrow-key navigation. Zoom can anchor to the
pointer, and the viewport also accepts +, −, 0 and arrow keys. Native Tab
follows dependency and wrapped-row order. Phone starts in the list and
offers the diagram toggle. Phone cards clip naturally while scrolling. Selection opens a drawer over the right stage
edge, or a phone bottom sheet, without reserving a graph column. Close and
Escape return focus to the originating card or relation. The plan reading
requirements and decision actions retain their existing rules.

### Work activity at a glance

The strip uses the current attempt's chronologically anchored phases.
A dot represents a recorded call at its start, or at its recorded end when
only that endpoint exists. An open observed call supplies the current
category word and strip head. Up to three rows sort original category
totals by measured time, with category name, patterned bar and duration.
A phase whose category is outside the three rows and the current word
keeps a quiet segment, and the drawer retains its category and details.
Unobserved attempts show their explicit observation status and whatever
check or submit boundaries prove. They produce no call dots or head.
Thinking intervals retain the inferred label and require surrounding
observations. The elapsed time for an open answer comes from its ask
record, independent of the activity ledger.

The work or review drawer retains the ordered phases by attempt, reported
durations and counts, tool names, errors, attribution and origin. Its
three.js phase solids and corresponding native controls remain available
on desktop, with explicit 3.6-second playback. Phone, forced SVG and
WebGL loss retain the list and totals. The playback starts on request.

### Live graph motion

The first snapshot paints static. Fresh call records pop a dot and grow the
strip, state changes pop their glyph, and pass, return or session
communication starts sweep a ring once. A return also makes one brief
change to the plate back. Fresh verified transfer records send a token
along the route, filling it behind the token, and a recorded return sends
a reverse token. Up to four transfers can paint concurrently. Delivered
edges can drift toward a running target after a live update and stop when
the target stalls. A newly bound answer pulses three times in its first
three seconds and once every 12 seconds after that. These two effects are
the only graph loops. One graph control pauses the live channels and
drawer playback. Reduced motion, hidden documents, forced colors and SVG
suppress graph motion. The [WCAG pause](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html),
[flash](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
and [interaction motion](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
criteria inform these bounds, and [Tversky et al.](https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf)
informs the event-to-motion mapping.

The relation route retains a 24 CSS px pointer corridor. The flat graph,
phone list and accessible list share relation identity. A shared shaft can
open a branch chooser. The drawer presents the direction, relation, item,
gate and flow records with their IDs and times. These presentation changes
serve P1, P3 and P6 and preserve the P10 human-stop baseline.

### Graph visualization verification

These checks implement Graph Flow principles P1, P3 and P6 by testing the data mapping and presentation in code. They preserve the P10 baseline of plan approval and planned decisions. The checks run in the normal graph-flow test suite and screen capture harness.

| ID | Rationale and source | Checked against | Failing test or assertion |
| --- | --- | --- | --- |
| P1 | Restated for the card kind silhouette and adjacent kind word. | Stored and derived kinds against clip polygons and card words. The former 16px icon-size invariant is retired. | `assertGraphRecords`, `assertInstrument` G2/G3 |
| P2 | Restated for separate direction, relation and current flow words. Traces now follow flow state. | Recorded needs and review targets against branch marks, paths, tag prefix, gate words and selected panel. | `assertGraphRecords`, `assertInstrument` G1 |
| P3 | Internal invariant. Cards use the current record and history retains previous outcomes and their recorded attribution. | Final verdict, historical return actor, and attempt records against the current card and retained history. | `test_p3_current_record_and_retry_history`, `test_p3_current_final_uses_latest_valid_verdict`, graph-record captures P3 |
| P4 | Internal invariant. Every card and relation has a stored or explicitly derived source. | Stored node IDs and relations plus the whole-result derivation against the scene, including an empty run and missing endpoints. | `test_p4_scene_has_no_cards_or_edges_without_records`, `assertGraphRecords` P4 |
| M1 | Dependency order follows longest-path layers. | Scene endpoints and layers, including native Tab across a wrapped row. | `LayoutTests.check_graph`, `graph-wrapped-order` |
| M2 | Route and card separation is an internal invariant. | Dense, long, parallel and wrapped routes against pinned crossing, bend and length ratchets. | `LayoutTests.check_graph`, the capture route ratchet |
| M3 | Internal invariant. Each reading scale presents the same inventory so a zoom change preserves the work it depicts. | Record and scene ID multisets against diagram, phone and accessible list IDs and rendered toolbar counts, including zero cards and duplicate titles. | `assertGraphRecords` M3 |
| M4 | Internal invariant. Identical layout inputs reproduce the ranks and positions. | Two scene constructions from the same input and layout options. | `LayoutTests.check_graph` M4 |
| Psi1 | Restated for the instrument glyph and word vocabulary, including stalled ◴ and submitted ↥. | All card states, glyph adjacency and grayscale glyph differences. | `test_psi1_psi4_state_glyphs_and_words_cover_the_vocabulary`, `compareGrayGlyphs`, G1 |
| Psi2 | WCAG 2.2 SC 1.4.3 and 1.4.11. The light and expanded-legend cases are retired with the light presentation and page legend. | Effective dark card plates and route contrast, including focused, returned and stalled states. | `assertAppearance`, G5 |
| Psi3 | Reachable targets preserve access to graph actions (WCAG 2.2 SC 2.5.8). The text and phone target floors are internal invariants for the dashboard. | Actual 390px list, diagram and choice-control hit boxes against the dashboard floors, and computed font size multiplied by the stage scale. | `assertAppearance` Psi3, `graph-minimum-zoom-phone` Psi3 |
| Psi4 | A distinct glyph and hazard rim identify an urgent answer. | Bound answers against the filled diamond and hazard rim. | `test_psi1_psi4_state_glyphs_and_words_cover_the_vocabulary`, `assertInstrument` G3 |
| R1 | Internal invariant. Both backends present the same relation inventory, shared shafts and branch markers. | Shaft and marker IDs, relation, gate, visibility and projected geometry against the scene within 0.5 CSS px. Layout checks independently cover every relation with its associated shafts and marker. | `assertRendererParity` |
| R2 | Internal invariant. Visible geometry produces canvas ink along route segments and leaves card interiors clear. | Readback of the WebGL framebuffer in test mode, along visible projected routes and qualifying shaft lengths, and inside cards. | `assertGraphInk` |
| R3 | Internal invariant. Text and edges share a coordinate transform so interaction preserves registration. | Screen-aligned labels, actual DOM rectangles and projected edge endpoints after pan, zoom, resize and level change within 0.5 CSS px. | `assertRegistration`, `assertAppearance` |
| R4 | Retired. | | |
| R5 | Focus facilitates inspection of recorded dependencies. Apply the 3:1 non-text floor to focused and dimmed marks (WCAG 2.2 SC 1.4.11). | Card outlines against the recorded dependency closure, stroke emphasis, focused halos and ink above context, and computed contrast including WebGL strokes. | `assertAppearance`, `assertDependencyFocus` |
| R6 | Restated for readable kind and state words at far zoom. | Kind, state, title and risk cues by reading level. | `assertGraphRecords` |
| R7 | Internal invariant. Renderer failure preserves access to the same graph and current selection. | The Stage A assertions and R1/R3 under forced SVG, plus simulated WebGL loss with a selected card. | `assertRendererParity`, `assertRegistration`, `exerciseGraph` R7 |
| R8 | Restated for the single event clock and one global pause. The former computed loop and idle-frame numbers are retired. | Cold baseline, pause, reduced motion, flash cadence and settled state. | `assertMotion`, G6 |
| R9 | Restated for the written effective lane and monotone cut. Counted bars and their size floor are retired. | Lane word and clip depth, minimap markers, keyboard access and clearance. | `assertInstrument`, `captureLaneCards`, `assertMinimap`, `assertMinimapClear` |
| A1 | Internal invariant. Persist and serve only catalogued activity metadata. | A documented hook payload with secret-looking arguments, transcript path and tool output against the log, CLI, MCP and authenticated run response. | `test_a1_hook_secret_never_reaches_ledger_cli_mcp_or_served_view` |
| A2 | Internal invariant. An ambiguous observation stays at run level. | Exact session and directory matches, one running attempt and ties against attribution outputs. | `test_a2_attribution_priority_and_ties` |
| A3 | Internal invariant. Observation must succeed or fail silently outside tool execution. | Packaged asynchronous hook command and script under missing run, malformed payload and simulated disk exhaustion. | `test_a3_missing_run_malformed_payload_and_full_disk`, distribution hook test |
| A4 | Internal invariant. Condensation preserves call counts, ordering and measured duration. | Generated and fixture observations against uncapped and capped deterministic output. | `test_a4_generated_and_fixture_condensation` |
| A5 | Internal invariant. The scene and list are projections of the phase records. | IDs, categories, shape tokens, order, duration-derived lengths and flags against the list and read-only scene description. Framebuffer ink is required in each projected solid's bounds. Fallback and loss retain the same list. | `assertWorkSummary`, activity context-loss capture |
| A6 | Internal invariant. Only a bounded interval can describe inferred thinking. | Disjoint observed starts and ends against gaps and the inferred label and pattern. | `test_a6_only_bounded_gaps_and_repeating_and_stalled`, `assertWorkSummary` |
| A7 | Restated for observed category words, labelled patterns and explicit stalls. The previous 16px activity icons are retired. | Graph and phone observation status, current words and answer priority. | `assertInstrument` G1–G4 |
| A8 | Restated for explicit drawer playback and the shared pause. Automatic first-play and graph rail cadence are retired. | Playback with 1, 10 and 12 phases, idle frame counts, reduced motion, keyboard pause and camera preservation. | `assertWorkSummary`, `checkPlayback`, G6 |
| A9 | Shapes offer a non-color channel (WCAG 2.2 SC 1.4.1). The 10% raster margin is an internal invariant. | 64×64 grayscale silhouettes, pairwise symmetric difference divided by the union. This rendering check provides no evidence of human recognition. | `assertWorkSummary` silhouette readback |
| A10 | Internal invariant. A host without observations still has verifiable boundary evidence. | Start, checks and submit events across boundary-only attempts and the explicit unobserved label. | `test_a10_boundary_only_and_unreadable`, `assertWorkSummary` |
| F1 | Restated for the record-time DOM strip shared by both backends. The bottom-rail width and SVG/WebGL ink checks are retired with that rail. | Phase order and time positions, call dots, and in-card pattern names. | `test_f1_activity_strip_preserves_order_timing_and_bounds`, `assertInstrument` |
| F2 | Non-color flow marks follow WCAG 2.2 SC 1.4.1. The correspondence to records is an internal invariant. | All record-derived flow states and frontier, delivering event and time, and six distinct drawn marks. | `assertFlowRecords` |
| F3 | Restated for the urgent diamond and exclusive hazard stripes. The prior raster tier-area and zero-motion thresholds are retired. | Answer and other states in a mixed fixture. | `assertInstrument` G3, G5, G6 |
| F4 | Restated for event-derived motion and deterministic timing. The 2.4s rail oscillation, 12 fps cap and fixed 1s dot are retired. | Clock-stepped events, pause, baseline and delivery fill. | `test_g6_deterministic_event_clock_and_loop_inventory`, `recordCalls`, `recordAnswer`, `verifyHandoffPulse` |
| F5 | A 24 CSS px route corridor supports WCAG 2.2 SC 2.5.8. Relation membership and provenance are internal invariants. | Native pointer and keyboard selection, shared-segment chooser, selected endpoints and exact record references under both renderers. | `assertEdgeSelection` |
| F6 | Internal invariant. Phase controls, tool totals, category totals and solids agree with the condensed view. | Tool sums, chart inputs, keyboard selection in both directions and final-frame raster bounds of at least 24 CSS px. | `assertWorkSummary`, `test_a4_generated_and_fixture_condensation` |
| F7 | Internal invariant. Flow and activity detail serve allowlisted metadata. | A1 secret arguments, transcript path, result and error fields against phase and edge surfaces. | `test_a1_hook_secret_never_reaches_ledger_cli_mcp_or_served_view`, `assertWorkSummary`, `assertEdgeSelection` |
| F8 | The Codex hook contract defines session, turn and invocation IDs. Unknown input handling is an internal invariant. [Codex hook schemas](https://learn.chatgpt.com/docs/hooks) | Documented start/end payloads, unchanged activity schema and event bytes, and malformed shapes through the packaged hook. | `test_f8_documented_codex_calls_share_the_activity_schema` |
| G1 | No global key is needed. | Adjacent glyph and word, matching local strip patterns and rows, and one state-word tag per logical edge. | `assertInstrument` |
| G2 | Card facts come from records. | Both locales, kind, state, effective lane, ordinal, current category, idle and pending minutes, descending time rows. | `assertInstrument`, `test_f1_activity_strip_preserves_order_timing_and_bounds` |
| G3 | Shape and wear convey kind, risk and a needed answer. | Polygon tokens, cut size and the hazard attribute against plan and open answers. | `assertInstrument`, `captureLaneCards` |
| G4 | Calls appear at their recorded times. | Current-attempt call IDs, future calls, boundary-only and unreadable activity. | `assertInstrument`, `test_f1_activity_strip_preserves_order_timing_and_bounds` |
| G5 | The four roles and text contrast are invariant in the dark theme. | Computed colors, effective plate backgrounds, glyphs, strokes and flat text, including selected, stalled, returned and awaiting states. | `assertAppearance` |
| G6 | Only fresh events start motion. | Injected timestamps for the motion inventory, lifetime, pause, reduced motion, baseline and flash cadence. | `test_g6_deterministic_event_clock_and_loop_inventory`, `recordCalls`, `verifyHandoffPulse`, `recordAnswer` |
| G7 | Labels have separate positions on individual branches. | Scene and DOM rectangles for cards and relation tags, including dense routes and shared trunks. | `assertInstrument` |


The ratchet data lives in `tests/fixtures/routing_ratchets.json`. The measured quantities are strict shaft intersections, logical bends, summed Manhattan route length in stage CSS pixels, and drawn shaft segments with each shared piece counted once.

The grayscale assertion crops the glyph by its DOM bounds, scales each crop to 24×24 pixels using nearest-neighbor sampling, and thresholds gray values below 128. Each pair must differ in at least 5% of mask pixels. This is a rendering regression check. It provides no evidence of human recognition speed.

Border contrast exemptions cover the default and unused card outlines, passed, submitted, working, held, awaiting-answer, returned and failed-result card borders, sent-back and changed borders, the preapproval note border, and chip outlines. They are redundant with a state glyph, visible state or badge text, or the continuous card or chip surface. The selection outline is checked against the surrounding surface. The route underlay is a background separation mark. The visible route, arrowhead and kind and state marks are checked.

The decision view shows only what was recorded. Beside the question, a prominent notice explicitly says when no files are recorded and when the current attempt has no check results. When a review or authorization has neither files nor current-attempt checks, the main notice says “There is nothing here to judge by”. Send-back appears first. Acceptance stays secondary and disabled until the person explicitly checks that they choose to accept without a file or check result. This confirmation belongs to the decision session, survives polling, resets on reopening, and cannot bypass the existing reading gate. Server rules are unchanged. On phones, a neutrally titled history disclosure precedes the answer controls; opening it exposes all recorded attempts, check details and log buttons. Its open state and loaded logs survive polling. Its second column shows the node’s attempt history directly from `view.timeline`, with earlier returns, failed expectations, current checks, worker notes and changed files expanded without a click. Missing current check results are explicitly described as missing, never inferred from an earlier attempt. An open decision overrides the current attempt’s running/submitted wording, but earlier returned and passed attempts retain their recorded outcomes. The worker note, the effects of each choice, the reason the person is asked, verified and unverified items, and the file reader each appear only when the decision carries them; when neither these nor any attempt history exists, one line says that only the question was recorded. An empty field is never drawn as a filled section. While a direction or information answer is empty, its send button is disabled and the status line says to write an answer first. Review/authorization decisions explain the disabled send-back button with “Describe what to fix to send it back”. Disabled controls are flat, pale, readable, and use a not-allowed cursor; the nearby hint explains the missing input or confirmation. There is exactly one “Go back without answering” action. In the record, a returned attempt names the checks that did not pass, so a check title is not read as a statement that it holds.

Every reference an agent session can say is visible on the page, and every entry says where it came from. Decision ids (“Decision d18” / “결정 d18”) and node ids (“Work build” / “일 build”) are shown as distinct labelled chips on decision cards, record entries, in-progress lines, the task table and graph cards. Pressing a chip copies `<id> · <title>` to paste into the chat. Entries show readable roles (“Leader session”, “Worker session”, “Reviewer session”) and session names; raw effort values such as `high` are omitted. An untitled `scope` check is described as checking that only assigned files changed. The number of decisions appears once in the graph banner; neither the header nor the picker repeats it. The session is `GF_SESSION` when the person or leader set it; otherwise `gf` records the host's own chat id, `t3:<thread id>` from `T3CODE_THREAD_ID` or `claude:<session id>` from `CLAUDE_CODE_SESSION_ID`, shown as “T3 스레드 <first eight characters>” or “Claude 세션 <first eight characters>”. Times use the same 24-hour format everywhere; the log supplies day headings. The find box takes a decision id, a node id or part of a node title: an open decision opens its reading view, an answered decision scrolls to and outlines its answer in the record, and a node is selected in the graph with its attempts in the side panel. It searches the current run and says so when nothing matches. Its placeholder uses the first available decision id from that run, otherwise a neutral decision-id/work-name hint.

`gf open --decision <id>` and `gf open --node <id>` add a fragment, `#project=<root>&run=<id>&decision=<id>&node=<id>`, to the address they open. The fragment is not sent to the server. The page reads it on load and on `hashchange`, removes it from the address, switches to that run, waits for the run's view, and then acts as the find box does. Both options need `--run` or `GF_RUN`; with a run and neither option the page only switches to that run. Run changes also clear the retired panel scroll callback before redrawing, so a selected card cannot leave the previous run’s title behind. The view carries `answered` (id, node, node title, question, outcome, answer, stale) for closed decisions, `asked` and `asked_by` on each open decision, `worker`, `session` and `started` on each node, and `run`, `project` and `timeline` for the header and the record.

Selecting a work or review card adds a blue outline without changing dimensions and opens the separate desktop detail column. The question, decision reference and primary reading action lead when a decision is open. Work title, worker, status and attempt summaries follow. Current and earlier attempts are explicitly labelled; expandable checks retain commands, logs, notes, files and findings. Another disclosure contains handoffs and the node contract. The panel scrolls independently without filler at its end. Completed runs have one calm completion statement and, when recorded files exist, a results action leading to their locations in the panel. Selecting the same card, Escape or the close button clears selection; close returns focus to the card.

Decisions open from the strip or a bound card. The authored question is the largest text on the screen; the work title is secondary. Neither top tab claims to be selected during a decision. Leaving returns to the originating view. Before reading, the first file (or required evidence disclosure) is the only primary action. Once the reading gate is met, acceptance becomes primary. With no files or current checks, send-back is primary and acceptance requires the explicit empty-evidence checkbox. Send-back precedes acceptance on every review/authorization screen, including plan consent. Each answer has a short factual consequence and its own disabled reason next to it. The question has only a keyboard focus underline, the worker note is explicitly labelled, and the reason for asking appears immediately below the question. Check titles lead; the small monospace command is labelled “Command run”. File prose uses the proportional UI face; only code-like extensions use monospace. The next-attempt caption is shown only when the node has a recorded attempt and remaining budget; it does not claim to start work. The recorded choice context remains in evidence details. Both desktop history and the phone disclosure label “Current attempt” and “Earlier attempt”, including seconds in timestamps and attempt numbers. Equal timestamps also show record sequence numbers. Check outcomes are stated once, without repeating “passed/failed” or the checker role on every check.

`page.js` exports the DOM-free language, decision, state, fitting and layout helpers, including `layeredLayout` and `roundedRoute`. Layout returns card rectangles, layers, flow order, routes/ports, optional label rectangles, terminal ids and bounds. `tests/test_layout.py` checks chains, diamonds, five-way fan-out/in, a three-layer span, duplicate relations, a sanitized plan-only fixture from the real scratch ro run, dense layers, and a 60-node chain. It tests every segment against every card, collinear overlap outside declared trunks, unique branch markers and target ports, deterministic output, layer width equality, and unchanged geometry under selection, status, decision and viewport changes.

An open decision captures `(project, run, decision id)` and every answer and evidence request uses that target. Each draft belongs to that captured target. Any run change, including automatic replacement when a run disappears, closes the decision and discards its draft. A refresh that removes the decision does the same. While an answer POST is in flight, the run picker is disabled and refreshes and navigation cannot close that decision; the real response is always reported. Late results cannot re-render a different run. A plain notice explains the closure, and callbacks from an earlier view cannot act on a new or reopened decision.

Every decision card, reading view and HTML list entry shows the node title and the authored question, or a plain description of its `purpose` when that question is absent (allowed values and normalization are in [maintainer view schema](../../../docs/implementation.md#12-dashboard-presentation-view)). Only a question exactly matching the gate-generated form for its recorded purpose and node is replaced by that description; authored questions are preserved. Unknown purposes use neutral wording and a neutral decision action. When `has_evidence` is true or the reading gate requires it, the reading view shows a visible reminder and a button opening the details. Otherwise the empty details disclosure is omitted. A required disclosure always contains the recorded question/purpose and any failure/context facts; the raw-evidence loader appears only when `has_evidence` is true, so an empty loader is never offered. The reading view, decision card and HTML list show a pale rust “Did not pass” block for current failed checks and matching failed-review findings. The reading block comes before the verified list. Trajectory decisions list only recorded causes in plain words. Any recorded file or evidence also requires opening the file or details before acceptance. Held work and any decision with failures use “그래도 받아들이기” / “Accept anyway”. These decisions and authorizations (`lane3` or `authorization` purpose, or `authorization` kind) disable the affirmative action until the reading gate is satisfied. With any failures or `hold` purpose, only opening that decision's evidence details disclosure unlocks it. For authorizations without failures, either opening evidence details or successfully loading a listed file counts. Neither executes commands. This UI reading gate supplements the signed-answer API; it is not an additional server authorization rule.

`page.js` exports `createDecisionController`, which owns each bound target, draft, evidence-details-open state, successful-file-open state, explicit empty-evidence confirmation and busy state, and exposes open, close, refresh, openDetails, openFile, confirmBlind, canSubmit, buildRequest and onResult. All map, panel and list entry points use it. Importing the module without a DOM does not start the UI. `tests/test_page.py` drives the controller with Node when available and reports a clear skip when Node is absent; the existing static scans remain in place. Refresh updates the surrounding decision content in place without replacing the textarea or action buttons, preserving focus, caret and composition.

From the repository root, this one line creates a fresh isolated demo project and starts its server (choose fresh paths if these already exist):

```sh
python3 -B -c 'import sys; sys.path.insert(0,"plugins/graph-flow/skills/graph-flow/tests"); from test_page import build_demo_run; build_demo_run("/tmp/gf-demo-home", "/tmp/gf-demo-project"); from graphflow.server import serve; serve()'
```

Open the printed URL. `build_demo_run(gf_home, project_dir)` is importable from `tests/test_page.py`, returns the run directory, and sets `GF_HOME` for the current process. It initializes git only in the supplied fresh demo project; the plugin checkout is untouched. It uses real library calls for two passed nodes, one returned and running on its second attempt, one submitted with a contextual human question and uncertainty, two not started, Korean presentation fields, a readable submitted `guide.txt`, and a recorded lesson. To restart that existing demo without recreating it:

```sh
GF_HOME=/tmp/gf-demo-home python3 -B plugins/graph-flow/skills/graph-flow/scripts/gf serve
```

## Plan review

Before initial approval the graph cards all say “시작 전”. The compact desktop banner contains the plan question, one line of nonzero counts, and equal-width Start and Send back actions with one-line consequences. Run-level goal, integration checks, frozen promoted checks and constraints live in the final “전체 결과 검사” card, connected after every terminal task, and in its independently scrolling selection panel. On phones it is the last flow item. Counts everywhere use the same function; scheduled counts include decision nodes, human checks and lane-3 gates, excluding plan approval, unforeseen questions and retries.

Selecting a task shows actual instructions, owned files, inputs, outputs, then each check title and labelled command; review cards also show their lens. Check commands serve as titles when no title was recorded. Cards show delivery, check count and first check, and scheduled-question marks. Long check text is one line on the card and complete in the panel. The cards and route tags supply their own words. All data comes from run records. After send-back the banner retains the person's text and the graph is dimmed under “돌려보낸 계획” until a replacement arrives. Mid-run plans preserve actual completed/running statuses.

Plan consent uses the signed `/api/answer` path, bound to structural identity, random run nonce and pinned key. It does not use the attachment-reading gate because the reviewed artifact is the plan itself; all other reading gates remain. Polling preserves view, selection, scroll, focus and the plan-change draft. Plan decision deep links open this banner. Superseded decisions link to the current question. Unverified answers are labelled as unverified records everywhere and never attributed as the person's consent.

Unfinished older runs show that one approval is required to continue; the leader first posts the current plan with `gf plan set`. A lost or rotated key has its own heading and exact human-terminal recovery command (`GF_ROLE=human GF_HUMAN_TERMINAL=1 graph-flow --run .graph-flow/runs/<run-name> key repin`), with no actionable decision. Re-pinning is recorded and requires a fresh approval. An unverifiable plan asks the leader to replace it with `gf plan set <file>`; the replacement marks all work changed and needs approval, without requiring an unavailable original. The replacement is identified in both banner and record.

`--open` only requests a browser and cannot answer. `GF_NO_OPEN=1` suppresses every browser entry point, including explicit open, which reports suppression. The browser mechanism's current-window reuse does not guarantee tab reuse.

This protects against mistakes and drift, not against an agent that deliberately forges on the same OS account. Such an agent can impersonate the human terminal or rewrite the log and key fingerprint; a genuine security boundary requires a separate identity or external signing authority.

The accepted same-account limits and human recovery are documented in [records.md](records.md#approval-integrity-and-same-account-limits).

Long single chains wrap in compact view. The toolbar names the current level and scale, keeps both level controls available, and offers the complete ordered plan list. Problem banners and the My turn inbox persist on every tab. Failed checks start with “통과 못 함” / “Did not pass” before the authored title. Key recovery explains uncertainty, offers a copyable project-relative terminal command, and requires one fresh approval.


### Approval and reading states in 0.3

Agent questions are free direction/information requests. The tool authors approvals and identifies the exact submitted evidence; failed reviews appear in the gate-owned hold. Plan questions say when they occur, especially post-submission human checks and lane-3 acceptance. Decision nodes that release other work show acceptance and send-back consequences. Information/direction questions never show a send-back action.

If attachment bytes change, the entire decision surface becomes a waiting message with no answer controls. If an open plan changes, the page names both decision ids, shows changed fields before/after, lists added/removed cards, and unlocks start only after each change is opened. The change list remains readable after unlocking. Retained 0.2.1 submissions must be opened and their files read before continuing. Key recovery names its global effect, links to records, and labels the replacement approval as tool-generated, with a key-change explanation rather than a plan-change explanation.

A title counts as visible only when its whole title rectangle lies inside the graph viewport. Every other title belongs to exactly one direction chip. Counts include the final result card explicitly. Panning snaps titles at rest. Cursor zoom preserves the anchor within the scroll range. Polling preserves the position. The selection drawer overlays the stage and preserves its position. The former selection column and legend space are retired. Tracks and ports have at least 20 CSS pixels of separation at 100 percent. Planned check titles describe expectations, while executed checks carry result words and symbols. State words and glyphs distinguish work, checks, human answers and failures within the fixed palette.

Executable-file notes are informational static plan analysis: an owned command/script/build file or a working directory overlapping owned files is marked. Reading an owned data file with grep/test does not mean executing it. Shell indirection, generated commands and symlink targets cannot be resolved from a plan alone; the marker is not a sandbox or security classification. Full execution inputs and raw contract references remain available under details.


### Screenshot consistency (round 17)

Branching overview graphs retain the layered dependency routes at every width; only genuine single chains use compact wrapping. A narrow viewport scrolls instead of merging tracks into an apparent chain. Card ordering depends on the plan, never the current selection. Toolbar title counts measure the title text rectangle, and explicitly include the extra whole-result card. The header and attention strip count the same actionable decisions, including free questions; plan decision steps and scheduled responses use separate names.

Changed-plan previews name added/removed checks and changed commands or timeouts. Owned execution-file notices use the same explanation in the banner and panel. Verification lists include implicit scope checks. Superseded links target the matching current gate decision, and `replaces_refused` identifies an earlier refused decision when present. Hold acceptance describes evaluating the remaining gate conditions. No signing, key recovery, gate or reading requirements change: Start/Continue explains accumulated card reading and each existing lock beside the button.

### Full text and the first sentence

Selecting any card opens its title and a pinned, fully wrapped explanation before status, warnings or records: `summary`, then `goal`, then the review target/lens or decision question. The whole-result card describes the final check. Decision-card selection opens this panel; its existing answer button opens the decision form. Detail cards wrap complete summaries and check names, with a count for additional checks. Mid-zoom cards retain the whole title and a semantic state mark. Measure the wrapped content before laying out dependencies; card order remains a function of the plan. Do not restore ellipses or fixed line clamps.

Reading feedback uses one pending-card set for card marks and Start reasons. Completed reading distinguishes plan cards from the final check and mentions off-screen cards only when present. Fit keeps the 12px text floor; when the compact graph still needs scrolling its button says so. Counts use whole rendered title bounds inside scrollbar gutters. Unverified answers show their recorded source and failed signature verification without identifying the author. Worker/model labels, review activity and panel section context remain explicit. The phone action bar uses a count and an expandable list; the existing evidence-opening action is a secondary button beside the reading notice.


### Question screens (Q1–Q6)

All decision kinds use the same reading order: the concrete question; “왜 묻나요”; choices with a consequence for each; “지금까지 있었던 일”; “지금 확인된 것”; files and detailed evidence. Phone choices stay visible at the bottom with their consequences. No choice is recommended. Required correction text appears after choosing to send back; permission refusal keeps its existing optional-text behavior. Inspecting evidence is a non-binding choice and preserves the existing file/detail reading conditions. Plan approval still requires reading the graph cards, changed items and any legacy submissions.

Display-only `facts` are recomputed from events: attempts and their limit, findings linked to each submission, current reviews, directly releasable work and work still waiting for other inputs. These fields do not enter the signed identity. Re-approval compares frozen plans on a fresh page as well as during polling. A negative answer keeps dependents waiting; remaining attempts can be started by the coordinator, and exhausted attempts explicitly explain the plan-revision cost.

Free questions may supply `gf decide ask --kind information --question "누구를 위한 안내인가요?" --option "처음 쓰는 사람" --option "이미 써 본 사람"`. Each choice sends its text through the existing `answered` outcome. Older questions without options offer writing an answer or leaving the question open; neither invents an answer or changes a gate verdict.

Detail cards show up to three automatic checks on separate complete lines, each with a text and symbol result (passed, failed, not run), followed by the remaining count. Plan screens show advisory circular-run and pre-work-pass notices; node cards show recorded pre-work-pass counts. These displays do not change gating.
