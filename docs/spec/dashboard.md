# Run dashboard

Status: Accepted (2026-11-21, owner design review in issue #11)

## At a glance

This summary has no force. The requirements below govern.

| ID | In one line |
| --- | --- |
| DASH-R1 | Each decision names its requester and identifies the owner by role. |
| DASH-R2 | The card opens with the decision and explains why it is due now. |
| DASH-R3 | Each answer names its effect on this work. |
| DASH-R4 | The card distinguishes required reading from optional detail. |
| DASH-R5 | Every open owner item has one card in the first view. |
| DASH-R6 | Progress opens a task list with status and assignee. |
| DASH-R7 | Status words agree across views. The graph explains its symbols. |
| DASH-R8 | A failed task leads to the reason and evidence from that attempt. |
| DASH-R9 | A structural change needs a reason, a decision and both outcomes. |
| DASH-R10 | The revision card shows its note, exact changes and collapsed remainder. |
| DASH-R11 | The leader relays the decision, reason and outcomes from the same note. |
| DASH-R12 | A signing control says what the owner signs. Inspection records no answer. |
| DASH-R13 | A disabled answer names the remaining action beside the control. |
| DASH-R14 | Both themes use readable type, spacing and restrained controls. |
| DASH-R15 | English and Korean cover every dashboard label. |
| DASH-R16 | Missing fields in old records have explicit labels. |
| DASH-R17 | The existing token, Host checks and signing path protect answers. |
| DASH-R18 | The redesign runs with the existing local dependencies. |
| DASH-R19 | The signature binds the displayed note. Later edits stay identifiable. |
| DASH-R20 | Plan reading takes place in the task list or the revision card. |
| DASH-R21 | Key recovery and leader repairs have distinct actions and counts. |
| DASH-R22 | The revision exposes changes to permissions, checks and attempt limits. |
| DASH-R23 | At 390 CSS pixels the owner can read and answer without the graph. |
| DASH-R24 | The public screen harness reproduces every verification fixture. |
| DASH-R25 | Each owner operation shows progress, result, failure and recovery. |
| DASH-R26 | Korean text reads as Korean and uses one term per concept. |

Design decisions — [ADR 0018](../adr/0018-put-waiting-items-first.md) · [ADR 0019](../adr/0019-use-a-document-style.md) · [ADR 0020](../adr/0020-require-a-plan-revision-note.md)

## Purpose and scope

The owner of an install opens a run to answer a specific request. The first screen lets the owner find that request, understand its consequences and identify the act of signing. The progress view shows who is working on each task. The log lets the owner trace a failure to the attempt that produced it. [Dashboard redesign](https://github.com/oozoofrog/graph-flow/issues/11) · [Revision approval](https://github.com/oozoofrog/graph-flow/issues/10)

This design covers the local dashboard and the plan contract for structural revisions. Phone layout and remote access belong to issue #4. The card’s reading order, evidence links and answer labels work independently of graph coordinates, hover and input device. A future phone layout can reuse them. This design adds no remote endpoint or human stop. [Remote approval](remote-approval.md) · [Issue #4](https://github.com/oozoofrog/graph-flow/issues/4)

## Domain terms

| Term | Meaning here |
| --- | --- |
| Owner | The person who controls this install and can sign its answers. |
| Leader | The actor that posts the plan and runs `gf gate`. |
| Requester | The actor that initiated this request. The requester can be a leader, worker, reviewer or owner. |
| Issuer | The program component recorded as issuing a binding decision, such as the plan or gate. |
| Task | A plan node, including a work, review or decision node. |
| Card | The My turn entry for one current action or one request that needs repair. |
| Waiting item | An action the owner can take now, including key recovery. Only a decision the owner can answer counts toward pending answers. Future and superseded requests stay outside both counts. |
| Free question | A request for information or direction. A reply returns to the requester. |
| Reading gate | The material the owner has to open before a particular answer becomes available. |
| Structural revision | A change to an existing plan that changes its structural identity under the plan contract. |
| Revision note | The leader’s four-part explanation for one structural revision. |
| Risk lane | The level of risk that determines which checks and approvals a task needs. |

The role and session already exist on event actors. Issue #3 supplies additional identity fields when available (`host`, `host_session`, `session_name`, `agent_kind`, `agent_model`). That work is paused. Requester attribution uses the initiating event even before those fields ship. [Issue #3](https://github.com/oozoofrog/graph-flow/issues/3) · [Plan contract](../../skills/graph-flow/references/plan.md#plan-approval)

## Verification fixtures

Use isolated records. An agent never operates the owner's dashboard. The implementation adds the scenarios below and their variants under `dev/screens/` (DASH-R24). The diagnosis capture supplies the starting cases A–E. Keep a pre-note copy of B for compatibility. C shows work in progress. E shows a completed run. Neither has a waiting item.

Use this table as the expected result for the per-kind checks in DASH-R1–R3 and DASH-R12–R13. In each row compare the requester, signed question, trigger, effects, choices and activation conditions with the fixture records. “Gate” identifies the issuer. For a gate request, also check the requester and the separate “Work by” line under DASH-R1.

| Input | Who asks and why now | Effects and controls to verify |
| --- | --- | --- |
| A · first plan | Leader on `plan.set`. Show the initial-approval reason (`planInitialReason` in both locales). | New starts wait. Approval permits eligible tasks to start. Open each task in the list. |
| B · revised plan and free question | Leader on the new `plan.set`. Separately, the actor on the page-size `decision.ask`. | The changed check affects the API task. The reply goes to the asker. Sign each offered reply or enter text. Apply the revision reading gate only to the plan. |
| D · `human_check` | Gate. The submitted guide needs a first-time reader. | A return leaves the guide for correction. Accept only after opening `guide.txt` or the evidence. |
| F · `hold` | Gate. An independent review failed on the bound submission. | Acceptance overrides the recorded failure. A return leaves the task blocked. Opening a file alone leaves acceptance disabled. Open the evidence disclosure. |
| G · `lane3` | Gate. The submitted task needs risk-lane 3 authorization. | Authorize the recorded result or send it back. Open a file or the evidence disclosure to authorize it. |
| H · `trajectory` | Gate. Corrections or rollbacks triggered review. The task has used its last attempt. | Acceptance permits further gate evaluation. A return requires a revised plan before another attempt. Open the recorded evidence. |
| I · planned authorization (purpose `node`) | Gate. The decision task is ready. Show its authored question and `context.why`. There is no worker submission. | Show `if_approved`, `if_rejected` and `undo` as authored. Identify dependents from records. Refusal keeps them blocked. Approval permits the gate to pass the decision task. Open the evidence disclosure. The refusal note is optional. |
| J · re-approval without a structural change | Use the re-posting leader for `project_moved`, legacy continuation or `replaced_unverifiable`. Use the initiating `human.repin` actor for `key_repinned`. | In four variants, show the recorded move, prior work, unverifiable predecessor or key change respectively. Sending back keeps new starts blocked. Approval permits eligible work to continue. Use DASH-R20. |
| K · nothing to judge | Gate. A review asks for acceptance with no evidence. | Say “There is nothing here to judge by”. Show send-back first. Acceptance stays secondary until the owner confirms acceptance without evidence. |

[Screen fixtures](../../dev/screens/README.md) · [Page tests](../../skills/graph-flow/tests/test_page.py) · [Browser tests](../../skills/graph-flow/tests/test_questions20_browser.py) · [Plan approval tests](../../skills/graph-flow/tests/test_plan_approval.py) · [Server tests](../../skills/graph-flow/tests/test_server.py)

## Changes to existing contracts

- DASH-R1, R2 and R19 conflict with the generic revision question and the plan screen's generated heading. Use the bound question and the initiating actor. [Plan issuer](../../skills/graph-flow/scripts/graphflow/cli.py#L119) · [Question renderer](../../skills/graph-flow/scripts/graphflow/page.js#L1735) · [Wording and later questions](../../skills/graph-flow/references/records.md#wording-and-later-questions)
- DASH-R5 and R21 replace the current inbox and count rule for work due now. Scheduled future responses keep their own count. [Dashboard counts](../../skills/graph-flow/references/dashboard.md#L460)
- DASH-R9 and R19 extend the plan-set input, event and approval binding. ADR 0020 specifies the run fields, structural identity exclusions and V1 validation boundary. DASH-R11 changes the leader's one-sentence relay for a structural revision. [Plan identity](../../skills/graph-flow/references/plan.md#L124) · [Run fields](../../skills/graph-flow/references/plan.md#L156) · [Leader guidance](../../skills/graph-flow/references/leader.md#L69)
- DASH-R12 retains the send-back-first and empty-evidence rules. The current plan screen conflicts with this order. The implementation updates signing labels, retains the accept-despite-failures cue and aligns the existing page tests. [Empty evidence](../../skills/graph-flow/references/dashboard.md#L427) · [Control order](../../skills/graph-flow/references/dashboard.md#L435) · [Held work](../../skills/graph-flow/references/dashboard.md#L441) · [Plan actions](../../skills/graph-flow/scripts/graphflow/page.js#L3117)
- DASH-R20 replaces the graph-viewport reading rule and its page assertions with explicit openings in the task list or card. DASH-R13 retains the other applicable gates. [Current reading gate](../../skills/graph-flow/scripts/graphflow/page.js#L2967) · [Page tests](../../skills/graph-flow/tests/test_page.py)

## Requirements

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

[RFC2119]: https://www.rfc-editor.org/rfc/rfc2119
[RFC8174]: https://www.rfc-editor.org/rfc/rfc8174

**Who asks, what is decided and why now**

### DASH-R1 — Identify the requester and the owner

For each decision the card MUST identify the requester by the role, task (when present) and session of the initiating actor. For plan approval it MUST use the actor on the matching `plan.set`, or on `human.repin` for a re-pin request. For a gate decision it MUST use the actor on the matching `gate.verdict` in the ask transaction. For a free question it MUST use the `decision.ask` actor. The card MUST identify the issuer separately when recorded. A gate card MUST show “Work by” from the worker session and assignment on the bound submission, or state that no submission applies. The card and log MUST agree on the requester and show recorded agent kind and model when available. Each missing identity field MUST use the label “Not recorded”. The respondent MUST appear by role as “Install owner”. The respondent label MUST NOT expose a personal name, email address or host name.

Verify: Compare A, B and the decision cases in D–K with the fixture table. Give B’s plan, B’s free question and D’s worker distinct sessions. Repeat B’s free question with a worker and a reviewer. Match each role, task and session to its initiating event in the log. Match D’s worker to its submission. In I expect “No submission”. Remove issue #3 fields and then the initiating session. Expect gaps only for missing fields and “Install owner” in every decision.

### DASH-R2 — State the question and its trigger

Each decision card MUST state the choice in one sentence and start with the exact `decision.ask.question` that the answer binds. If a recorded question needs more than one sentence, the card MUST retain it verbatim as the heading and put the one-sentence explanation below it. It MUST explain why an answer is due now from the recorded trigger, or state when the trigger is missing. A free question MUST precede any explanation of its authority.

Verify: Check every decision row in the fixture table. Compare the heading text to the bound question in both locales. Expect A’s localized `planInitialReason`, B’s rejection and changed API check, and D’s first-use question about the submitted guide. B’s page-size question precedes its reply explanation. In J, distinguish each recorded re-approval cause even when the plan identity stays the same.

### DASH-R3 — Explain each outcome

Beside each answer control the card MUST show the effect computed from records, including affected tasks, remaining blocks and attempt cost where applicable. It MUST identify who receives a free reply and state that the reply grants no approval. For a planned decision or human check, it MUST show each available authored context field (`why`, `if_approved`, `if_rejected`, `undo`) under an author label.

Verify: Compare the available controls and next effects for each decision row in the fixture table. For B, insert a note that promises immediate release of blocked work. Expect the actual blocks beside approval and send-back. For D expect a second attempt after return. At H’s limit expect the recorded budget and no further attempt under this plan. Give I distinct text in each context field and compare each displayed value with the bound evidence.

### DASH-R4 — Direct the owner to the evidence

Each card MUST name and link any available material needed to act. It MUST identify what the owner can leave unread. When there is no required reading, the card MUST say so.

Verify: D has separately labelled DOM sections for required reading and optional detail. The required section links to the guide and to the evidence disclosure as alternatives. B’s free question states that no reading is required. Follow each reading link and expect zero answer records.

**Waiting items, progress and history**

### DASH-R5 — Open on My turn

Opening a run without a destination MUST show My turn (내 차례) first. It MUST show one card per waiting item. Every owner-action count MUST equal the number of those cards in the same snapshot. With none waiting, it MUST state this first and give a short progress summary. A decision link MUST open its own item directly. Cards MUST appear in two groups. The first group holds the items that keep other work waiting: plan approval, a gate decision on a submitted task, a planned authorization that has waiting dependents, and key recovery. The second group holds all other cards. Within each group the card with the earliest recorded ask time MUST come first. DASH-R21 covers requests that need repair.

Verify: In B expect two visible owner-action cards with distinct decision IDs and a count of two. Superseded approval is absent. Answer the free question and refresh. One card and one owner action remain. C shows no action and ongoing work. E shows no action and the completed result. Open D’s decision link and expect its guide question. In B the free question is older than the plan approval. Expect the plan approval card first, then the free question.

### DASH-R6 — Show progress as a task list

Progress MUST open a list or table with one entry per task, its status and its recorded assignee. It MUST distinguish an unassigned task from a missing identity on an assignment. The graph and the log MUST open as separate views on request.

Verify: In C expect one row for each task, including the running screen task with its recorded assignment and the submitted API task awaiting review. Compare an unassigned task with an assignment lacking identity. Visit My turn, Progress, Graph and Log. Expect the task diagram only in Graph and the full event list only in Log.

### DASH-R7 — Explain graph and progress terms

The dashboard MUST use one term per state in each language across all views. Counts MUST name what they count, such as tasks or transfers. The graph MUST supply a legend for visible task states, edge meanings and time marks. A risk lane MUST be labelled as risk.

Verify: Compare C’s summary, task rows and graph at the same time. Expect the same term for each task state and totals that match the named population. Enumerate every rendered `data-relation`, task state class and replay mark in C. Each has a matching labelled legend entry. Lane 2 identifies risk level 2 in both languages.

### DASH-R8 — Trace a rejected attempt

From an affected task or its card the owner MUST be able to reach the recorded rejection, its revision, attempt, failed check and evidence. The dashboard MUST distinguish that history from the current attempt count.

Verify: In B follow the API task back to revision 1, attempt 1. Expect the failed empty-query check and its recorded result. Return to revision 2 and expect the revised check there. Expect the first attempt to retain its original criterion even if the current counter has reset.

**Structural plan revisions**

### DASH-R9 — Require a note for a structural revision

For each structural revision, `gf plan set <file> --note <json-file>` MUST take a fresh revision note with four nonblank strings: `reason`, `decision`, `if_approved` and `if_sent_back`. The decision MUST state the choice in one sentence. The transaction MUST record the supplied note in `plan.set.data.revision_note` and in the approval ask under DASH-R19. It MUST NOT inherit a previous revision's note or use run-level `context.why` as the note. Run context continues to describe the plan as a whole. The note MUST NOT affect structural identity. If input is missing or invalid, the command MUST identify the offending input and refuse before writing a revision or replacing an approval.

Verify: Change a check command in an approved plan. Omit the note, then omit, blank or mistype each part. Expect a nonzero exit, the input name and identical plan and event bytes. Supply the complete note and expect one new revision and its ask. Reuse the plan file with another structural change and no note. Expect refusal despite the previous note and existing context. Post a first plan without a note, approve it and repost it identically. Expect no new revision. Edit only its title and expect reuse of the verified approval.

### DASH-R10 — Read the note before the changes

For a structural revision the card MUST show the bound note first, labelled “Leader’s explanation”, with the signed question as its heading. Next it MUST show only the changed tasks and changed plan-level fields, with the unchanged remainder collapsed. Each change MUST name the field and show its old and new values or mark an addition or removal. For each changed task a separate “Recorded history” section MUST show its most recent returned attempt and failed check, or say “No returned attempt” when none is recorded. DASH-R3 governs the effects beside the controls. DASH-R22 identifies changes that raise risk.

Verify: In B expect the note, the API check’s old and new criteria, the added packaging task, then a closed disclosure for unchanged work. Under API history expect attempt 1 and the failed empty-query check even when the leader gives a different reason. For the added task expect “No returned attempt”. Remove the rejection in a variant and retain the note. Expect that same gap for the API task and the unchanged author text. Remove a task and change a run-level check in further variants. Expect the removed ID and both check values.

**Example note for fixture B**

| Part | What the owner reads |
| --- | --- |
| Decision | Approve checking error responses in the search API and adding a packaging task? |
| Reason | The gate returned API attempt 1 after the empty-query check failed. |
| If approved | The API task can start under the revised check once its other conditions are met. Packaging waits for the guide. |
| If sent back | New starts stay blocked. The leader revises the plan and brings it back for approval. |

### DASH-R11 — Relay the revision in chat

For a structural revision, the successful `plan set` result MUST return the revision, decision ID and all four stored note fields. When directing the owner to that approval, the leader MUST relay the same note and identify that revision and decision in chat. The signature MUST remain on the owner’s answer surface.

Verify: Compare B’s command result with its `plan.set` note and approval ask. Expect the same revision, decision ID and all four strings. Human judgment: use that result to relay the revision in chat. Check that the owner can find the decision, reason and both consequences without reading a restatement of the plan.

**Signing and reading gates**

### DASH-R12 — Name and order the signing controls

Every signing control MUST name signing and its outcome in both its visible and accessible labels. Equivalent actions MUST use the same words across decision kinds. Where available, controls MUST follow this visual, DOM and keyboard order: sign and send back (for a planned authorization, sign and refuse permission), sign and approve (or the kind’s affirmative), then inspect. A hold or recorded failure MUST use “Sign and accept despite failures” for acceptance. Each free-question option MUST say that it signs and sends that specific reply. Inspection MUST have a distinct label and record no answer.

Verify: Check each decision row in the fixture table in both locales. In A, B’s plan and J expect “Sign and send back”, “Sign and approve”, then “Inspect”. In D, F, G, H, I and K compare the negative, kind-specific affirmative and inspection in each order. F and a failed D variant use the risk qualifier. In B each option’s visible and accessible name contains “Sign and send” and its exact option text. Inspect each kind and expect zero answers. Submit a labelled option, then submit a valid approval in a separate fixture. Expect exactly one verified answer per submission, with outcome `answered` and the selected text for the option, or `approved` for approval.

### DASH-R13 — Explain and enforce each reading gate

Beside each disabled answer the card MUST name the outstanding condition and how to meet it, or explain why it cannot be met. The hint MUST update as each condition is met. The card MUST enforce every applicable condition in the table before enabling the specified answer. When a failure is recorded, only the evidence disclosure satisfies the evidence-reading condition. Merely listing material MUST NOT count as opening it. DASH-R20 defines plan-approval reading.

| Input and answer | Required action and adjacent hint | Verify on an unread fixture |
| --- | --- | --- |
| D, G, H, I · accept or authorize with evidence | Open the evidence disclosure or a listed file. If no file is available, name the disclosure alone. | In separate copies of D open each alternative. Each enables acceptance. In G, H and I check the source named in the fixture table. |
| F or any recorded failure · accept | Open the evidence disclosure. Name it beside acceptance. | Open only the file. Acceptance stays disabled. Open the disclosure and expect enabled acceptance. |
| K · accept with nothing to judge | Confirm explicitly in the empty-evidence checkbox. Name the missing evidence and the checkbox. | Wait for a refresh. Only ticking the box enables acceptance. Reopen the decision and expect it unchecked. |
| Send back with a required reason | Enter nonblank text describing the change. For a plan return, also open each changed entry if present. Refusing a planned authorization permits an empty note. | In B open all changed entries and enter spaces. Expect a reason prompt. Enter text and expect enabled send-back. In D repeat the text check. In I expect refusal to work with an empty note. |
| Free text reply | Enter a nonblank reply or choose a labelled signed option. | In B, spaces leave typed submission disabled with a write-first hint. Text enables it. An offered option supplies its own reply. |
| Decision changes during reading | Acknowledge the new decision and repeat its applicable reading. Name the change and remaining material. | Change D’s displayed evidence during reading. Expect disabled signing until acknowledgement and fresh reading. |
| Stale display at submission | Refresh and read the current request. | Submit the old `displayed` identity to `/api/answer`. Expect `stale_decision`, a reread hint and zero new answers. |

Verify: Start each row with fresh fixture state. Assert the adjacent hint and control state before and after each action. Apply the same checks to A, B and J using DASH-R20.

**Presentation and compatibility**

### DASH-R14 — Use a readable document style

The dashboard MUST offer light and dark modes. It MUST follow the operating system's colour-scheme setting and MUST NOT add a separate theme control. In both modes it MUST render Korean and Latin body text at 16 CSS px or larger with a contrast ratio of at least 4.5:1 against its background, including control hints. It MUST separate the question, evidence and actions with headings and spacing. It MUST use upright controls and plain backgrounds. Dashboard views MUST omit decorative grids, hazard stripes and mascot images. Technical telemetry MUST stay out of the default card and task summary.

Verify: Capture B and C with the browser's colour-scheme preference set to light and then to dark, in both languages. Expect the matching theme each time and no theme control. Check computed font sizes and foreground/background contrast for body text and hints. Expect horizontal button text and zero decorative mascot images, grids or stripes. Default summaries omit sampling notices and millisecond check durations. Human judgment: at normal zoom, read B’s question, reason and hint and C’s task status and assignee. Check Hangul glyphs and separation between sections.

### DASH-R15 — Supply both interface languages

Every dashboard label MUST have English and Korean text, including accessible names, legends, reading hints and missing-data messages. The dashboard MUST preserve the content of authored questions, notes and evidence.

Verify: Render A–K in each language with the same source records. Expect the same actions and destinations. Check every interface string key for nonblank values in both languages. Compare authored questions, note fields and file paths with their sources in both renders.

### DASH-R16 — Display older runs

The dashboard MUST load existing runs and MUST NOT modify existing record lines. It MAY append the supersession observations specified by the records contract for a moved project or changed evidence. For a past revision without a note, it MUST label the note as not recorded and show available changes and history. It MUST NOT present the original plan goal or a guessed identity as the missing reason or requester. [Supersession observations](../../skills/graph-flow/references/records.md#L523)

Verify: Open pre-note B at its original location with unchanged evidence and no issue #3 fields. Expect both cards, explicit gaps, the diff and the link to the rejection. Compare ledger bytes before and after. With a moved project or changed evidence expect the original lines as an identical prefix and only the specified supersession observations appended. Repeat a read and expect no duplicate observation.

### DASH-R17 — Keep local answer protections

The dashboard MUST keep the local server’s token and Host checks and the existing owner signing path. Viewing progress, history or a revision note MUST NOT authorize work or record an answer.

Verify: Use the isolated server tests. Submit to the answer endpoint without its token and expect 401. Repeat with a valid token and a rejected Host and expect 403. Expect no answer for either request. Navigate among fixture views and expect the decision still open.

### DASH-R18 — Keep the existing runtime

The dashboard MUST run with standard-library Python and plain HTML and JavaScript. It MUST NOT require a new runtime dependency. The optional graph MAY use the existing vendored three.js.

Verify: Render A–E in the isolated screen harness with third-party Python packages and external network requests disabled. Expect My turn, Progress, Graph and Log to work using only the shipped assets. Compare runtime imports and the vendor inventory with the existing distribution.

### DASH-R19 — Bind the displayed revision note

For structural approval the transaction MUST copy the four exact strings to `decision.ask.data.evidence.revision_note` and use its `decision` string as `question`. The card MUST display those strings verbatim in either locale. The displayed identity and v3 answer signature MUST bind this question and evidence. Editing the note of an open proposal MUST supersede its ask and issue a replacement before it can be signed. Repeating identical input MUST reuse the open ask. After a verified approval, a wording-only note edit MUST preserve the signature and append the edit as a later `plan.set` record linked to that approval. The dashboard and history MUST show the note copy from the signed ask beside its answer and label any subsequent text “Later edit”. A note edit alone MUST NOT require another signature.

Verify: In B compare the ask, card heading and displayed note field by field. Repost the same plan and note while the ask is open and expect the same decision ID. Edit only the reason while the ask is open. Submit the old displayed identity to the replacement ask and again against the superseded ask. Expect `stale_decision` and no answer. Sign the replacement and verify the v3 signature with its recorded question and evidence. Change only a copied note field in the verification input and expect verification to fail. Edit the approved note. Expect the same plan identity, one signed answer, the bound note from the answered ask in both views, and a separate later edit. Recompute the displayed question hash from the signed question, evidence and remaining identity inputs. Expect the value captured at signing.

### DASH-R20 — Read the plan without the graph

For first approval the owner MUST open every task once in the task list on My turn. For structural approval the owner MUST open the note and every changed entry, including plan-level changes. The card MUST allow the unchanged remainder to stay collapsed. For re-approval without a structural change, the owner MUST open each current task once. A legacy continuation MUST also require opening each recorded pre-approval submission and every file listed for it. Replacing an unverifiable plan MUST also require opening its run-level checks entry. For an older structural request without a note the card MUST show the missing-note notice and require opening the available changes. Reading gates MUST NOT depend on graph visibility, scrolling a card into view, or visiting Graph. The dashboard MUST track openings for the current displayed decision and identify the remaining entries beside approval.

Verify: Start A and B unread with Graph closed. In A open all but one task, then the last. The last task’s name clears and approval enables. In B, scrolling or opening only the note leaves both changes outstanding. Open the API change and the added task. Expect approval enabled with unchanged work still closed. Repeat in reverse to check that the unopened note alone blocks approval. In each J variant open the task list entries. In the legacy variant, open the submission and leave one of its listed files unread. Expect its name beside disabled approval until opened. In the replacement variant, expect the run checks to remain named until opened. In pre-note B open the available changes. None of these cases requires visiting Graph.

### DASH-R21 — Identify recovery and repair actions

My turn MUST show key recovery as one owner-action card. It MUST identify the local key check as the source and the install owner as the actor. It MUST explain the key mismatch, what remains blocked if deferred and the fresh plan approval required after recovery. Recovery MUST NOT count as a pending decision answer. An otherwise open request that refuses answers because of `legacy_decision`, `binding_changed` or `project_moved` MUST appear as a repair card naming the leader, the reason and the needed action. Such a card MUST NOT offer signing or count toward owner actions or pending answers. Once superseded, the old request MUST remain accessible in history.

Verify: In J with a key mismatch, expect one owner action and zero answerable decisions. Recover the fixture key and expect the fresh plan approval as one owner action and one pending answer. In separate fixtures show a legacy ask, changed submission binding and moved request awaiting replacement. Expect a leader repair card directing a fresh ask, gate rerun or plan re-post as applicable, no signing controls and zero counts. Follow the replaced request into history.

### DASH-R22 — Flag changes that raise risk

Beside the field diff the card MUST flag a lower risk lane, wider `owns`, a removed or changed `cmd` check, a removed review task, a removed `human` check and a higher `max_attempts`. If ownership expands to existing tests it MUST name the paths and explain that the worker gains permission to edit those tests.

Verify: Make one B variant per listed change, including separate command removal and command edit. Check the risk label and before/after values or removed ID. For a new test ownership path expect its exact name and permission warning. An unchanged control task has no risk flag.

### DASH-R23 — Keep My turn usable at narrow widths

At a viewport width of 390 CSS px, the card MUST show its question, reasons, answer controls and current gate hint without horizontal scrolling or opening Graph. Every answer control MUST be reachable by keyboard.

Verify: Render unread B at 390 × 844 CSS px in each locale. Check the page width and each named element’s bounds against the viewport with Graph closed. Tab through the enabled actions in DOM order, meet each gate by keyboard and reach every answer control. Repeat after opening the note and changes.

### DASH-R24 — Ship reproducible dashboard fixtures

The implementation MUST add A–K and their specified variants to the public fixture builder `dev/screens/build_fixtures.py`. It MUST register capture cases in `dev/screens/screens.json` and extend `dev/screens/capture.mjs` to collect screenshots, visible and accessible labels, DOM order, enabled states and gate hints. The repository instructions MUST describe how to reproduce the captures using only isolated fixtures.

Verify: From a clean checkout follow `dev/screens/README.md` with a temporary fixture root. Compare the manifest scenarios to the builder. Expect all A–K cases and named variants, with the specified captures and control observations available from repository inputs alone.

### DASH-R25 — Show the state of each owner operation

For each owner operation the dashboard MUST show its state beside the affected card. The operations are: answer a decision, open evidence, send back with a reason and open a run. While an operation is in progress, the card MUST name what is in progress, such as recording an answer, loading evidence or loading a run. Typed input MUST stay. When recorded, the card MUST show the recorded answer and its time, and the item MUST leave My turn. On failure, the card MUST name the failed operation and the reason from the server, keep the typed input and offer a retry that cannot record a second answer. When the dashboard does not respond, the page MUST say so and name the recovery command `graph-flow open`. Each state, selection and difference MUST have a cue other than colour, such as visible text, a labelled symbol or an outline pattern. An empty My turn MUST say that nothing waits and offer the progress view.

Verify: In B delay the answer endpoint in the harness. Expect a disabled control with the recording text and the typed reason retained. Let it succeed. Expect the recorded outcome beside the card and the card absent from My turn after refresh. Make the endpoint return `stale_decision`, then a server error. Expect the operation name, the reason, retained text and a retry. Retry after the server error and expect exactly one answer. Stop the server. Expect the notice and the command within one poll interval. Render A–E in greyscale. Expect each state, selection and change to remain identifiable by text or shape. In E expect the empty My turn statement and a link to the progress view.

### DASH-R26 — Write Korean interface text for Korean readers

Korean interface text MUST read as Korean product text, not as a word-for-word translation of the English string. A button MUST name the action that happens when the owner presses it. A heading MUST name its content or purpose. Guidance MUST use the polite 해요 style. Each concept MUST use one Korean term. A glossary shipped with the page strings MUST record these terms, for example 서명, 돌려보내기, 승인, 내 차례, 작업 and 위험도. Korean text MUST NOT state an effect, a permission or a verification that the records do not support.

Verify: Check every Korean string key against the glossary. Expect each glossary concept to use only its listed term, and no second term for the same concept. Check each Korean button string against the glossary's action forms. Human judgment: read the Korean strings of every fixture scenario aloud. Mark translated phrasing, a heading that names no content, or a claim that the records do not support. Expect no marks.

## Open questions

No open questions remain. The owner resolved OQ-1 (order of waiting cards) in DASH-R5 and OQ-2 (theme selection) in DASH-R14.
