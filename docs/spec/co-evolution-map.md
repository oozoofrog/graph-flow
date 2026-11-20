# Co-evolution map

Status: Draft

## At a glance

This summary has no force. The requirements below govern.

| ID | In one line |
| --- | --- |
| CEM-R1 | The same sources always rebuild the same map. Missing sources show as gaps. |
| CEM-R2 | Every link can be followed in both directions, with its reason and source. |
| CEM-R3 | Only a verified in-run answer confirms an item. Agent proposals stay unconfirmed. |
| CEM-R4 | Every item has a plain explanation in the person's language. Korean copies track their English source. |
| CEM-R5 | Three questions let the person test their own understanding, with no score. |
| CEM-R6 | Learning, discussion, debate, and brainstorming use existing human slots. Out-of-run selections wait for the next run. |
| CEM-R7 | At risky gates, the person predicts later rework before seeing evidence. |
| CEM-R8 | The person can keep, rewrite, or drop each new constraint. |
| CEM-R9 | Summaries show what happened after approvals and how predictions held up. |
| CEM-R10 | A reviewer from another model family offers a counter-proposal before the split. |
| CEM-R11 | The map never authorizes work or changes signing. |
| CEM-R12 | The map keeps local access boundaries. |
| CEM-R13 | Agents can point out conflicts. The person confirms them. |
| CEM-R14 | `gf map check` fails on missing coverage and reports items it cannot verify here. |
| CEM-R15 | Agents can propose domain terms. The person confirms or rewrites the definition. |
| CEM-R16 | The person can open a topic at any time. Only the leader answers it, as quoted data. |

Decisions made by the person: OQ-1 to OQ-8 under [Decided questions](#decided-questions), and ADRs 0001–0011 and 0017 in the [ADR list](../adr/README.md).

## Purpose and scope

The person can follow an idea to the code that implements it. An agent can follow the same path back to the person's reason. Together they can question a choice, change a term, or test an expectation. Co-evolution means that both the tool and the person's practice can improve. [Engelbart](https://dougengelbart.org/content/view/116/)

Cognitive debt grows when the team loses its understanding of the system. Intent debt grows when the reasons for a choice disappear. The map gives the person a place to recover those reasons and challenge them. [Storey](https://arxiv.org/abs/2603.22106)

The first scope is one project and its local runs. Execution control, agent surveillance, automatic grades for people, and cross-project authorization are outside scope. Issue 3 supplies the future cross-run summary. Issue 5 supplies four proposed mechanisms. Build prediction, constraint review, and summary measures after issue 3. Collect their baseline before the counter-proposal trial. [Issue 3 and its summary proposal](https://github.com/oozoofrog/graph-flow/issues/3) · [Issue 5](https://github.com/oozoofrog/graph-flow/issues/5)

## Glossary

A **map node** is an addressable item. A **link** is a directed statement between two map nodes. A **trail** is a sequence of links a reader follows in either direction. A **source reference** identifies the project, source, item, and relevant revision or attempt. A **human slot** is an existing occasion for a decision, an approval, or run close. [Bush](https://www.w3.org/History/1945/vbush/vbush7.shtml)

| Map node type | Meaning |
| --- | --- |
| Thought | An idea or open question that its author chose to keep. |
| Instruction | A direction the person gave about the work. |
| Spec | A document that states expected behavior. |
| Requirement | One obligation with a stable ID in a spec or plan. |
| Domain term | A name and definition for one concept in a stated domain. |
| Plan | One recorded revision of the contract for a run. |
| Plan node | One unit in that plan with kind `work`, `review`, or `decision`. |
| Decision | An ADR or a run question with its recorded status and any answer. |
| Lesson | An insight with a reason and a condition for its next review. A planner constraint is one source. |
| File | A project-relative path at an identified revision or submission. |
| Commit | A Git change identified by its repository and full object ID. |
| Check | A named test with its criterion and any result for the selected attempt. |

A link reads from subject to object. These are all link types. A reason states why this particular pair belongs together.

| Link type | Subject → object | Meaning |
| --- | --- | --- |
| contains | Spec or Plan → Requirement, or Plan → Plan node | The source lists this member. |
| addresses | Plan node → Requirement | The plan assigns this obligation to the unit. |
| uses term | Any map node → Domain term | The concept helps explain the subject in this domain. |
| motivates | Thought, Instruction, Decision, or Lesson → any map node | The subject gives a reason for the object. |
| changes | Commit → File | The commit records a change at this path. |
| submits | Plan node → Commit or File | The submission names this commit or lists this file. |
| tests | Check → Plan node, Plan, or Requirement | The criterion examines a stated property of the object. |
| draws from | Lesson or Decision → any map node | The subject cites the object as a basis. |
| conflicts with | Any map node → any map node | The author states that both items cannot hold as written. |
| relates to | Any map node → any map node | The author explains a connection outside the other link types. |

**Example.** A person defines *original note* as the note that stays in the notebook after export. The requirement *Export preserves the original note* uses that term. The plan node *Write the export* addresses that requirement. It submits a commit that changes the exporter. A failed check can lead the person to ask whether attachments also belong to the original note.

## Sources and new records

| Information | Source and rule |
| --- | --- |
| Plan and work | Read the plan revision, `requirements`, `requirement`, and check definitions. Preserve plan IDs within their run. |
| Results and reasons | Use submissions, commits, check grades, review findings, decision context, answers, and scoped rejections. A declared path alone proves no change. |
| Lessons | Read constraint text, scope, `derived_from`, `review_when`, and status. A personal lesson has no planner effect. |
| Design | Read explicitly referenced specs, ADRs, and domain definitions at their cited revisions. |
| New authored material | Keep selected thoughts, instructions, definitions, personal lessons, and link revisions with their authors and source references. Reuse an existing source where possible. |
| New personal choices | Use existing decision answers for predictions, skips, ratifications, and explicit link confirmations. Store references to the relevant answer and item revision. |
| Derived output | Rebuild map nodes, links from explicit source relations, reverse lookups, and metrics. A generated index has no independent authority. |

A **derived link** repeats an explicit source relation. A mechanical join names its source field as its origin. An **authored link** records a person's interpretation or an agent's proposal. Text similarity and timing supply no derived link. A link that cites a missing revision retains its original source reference. [Records](../../skills/graph-flow/references/records.md) · [ADR 0002](../adr/0002-derive-the-map-from-source-records.md)

## Requirements

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

[RFC2119]: https://www.rfc-editor.org/rfc/rfc2119
[RFC8174]: https://www.rfc-editor.org/rfc/rfc8174

### CEM-R1 — Rebuild from sources

The map MUST reproduce the same map nodes and links from the same source revisions and authored records. It MUST label missing sources as unavailable.

Verify: Rebuild twice with duplicate local IDs in two runs. Compare typed endpoints and source references. Remove one source and check its label.

### CEM-R2 — Follow a term in either direction

The map MUST support every glossary type. It MUST let the reader follow any visible link in either direction and inspect its reason and source reference.

Verify: Use a fixture with every type. Follow the example from Domain term to File and back. Check both directions against the same link IDs. [ADR 0004](../adr/0004-use-the-domain-glossary-as-an-entry-point.md)

### CEM-R3 — Keep link provenance

The map MUST keep the link origin and confirmation history. The person MUST be able to create an authored link with a reason. An agent proposal MUST remain unconfirmed until the person explicitly confirms that link revision. The default trail MUST distinguish derived links, person-authored links, and confirmed agent proposals. Unconfirmed proposals MUST appear separately.

The map MUST derive person authorship and confirmation only from verified evidence for the exact item revision. Verified evidence is a verified in-run answer. A claim in a file is not evidence. The map MUST NOT treat an item as confirmed without verified evidence.
For a queued selection, the map MUST require the CEM-R6 issuer, purpose, evidence, and exact answer form.
It MUST retain the proposer and record a rejection in history outside the confirmed trail.
If the cited confirmation lacks its original verification context, the map MUST show the CEM-R14 status. A change to the reason or endpoints of a confirmed item MUST make it unconfirmed.

The map MUST withdraw an unconfirmed proposal when a source it cites changes in the selected project snapshot. The withdrawn proposal MUST stay in history. A replay of an earlier snapshot MUST show the status at that snapshot.

Verify: Create a person-authored link. Compare its label with a derived link and an agent proposal. Check that plan approval alone leaves the proposal unconfirmed. Confirm one proposal. Edit its reason and expect it to need confirmation again. Add a file that claims person authorship without evidence. Leave `gf map check` out of the plan and expect the unconfirmed label. Change a source that an unconfirmed proposal cites and expect the proposal in history. Replay the earlier snapshot and expect the original status. [ADR 0003](../adr/0003-keep-link-confirmation-with-the-person.md)

### CEM-R4 — Use the person's language

Every map node and link MUST have a plain-language label and explanation in the person's language. A missing explanation MUST have an explicit gap label. The Korean reading copy MUST identify its canonical English revision. It MUST preserve requirement IDs, link meanings, and obligation strength. It MUST record the SHA-256 hash of its English source. A repository test MUST fail when that hash differs from the current English source.

Verify: Inspect one example of each type in Korean. Compare ID sets mechanically. Have a bilingual reader compare obligations and link meanings. Change the English source and expect `scripts/tests/test_reading_copies.py` to fail. [ADR 0006](../adr/0006-keep-one-english-reference.md)

### CEM-R5 — Let the person test their understanding

Learning mode MUST offer the three questions below for a selected trail. The person MUST be able to mark a gap or skip the exercise without a score.

| Ability | Question for the person |
| --- | --- |
| Relate the solution to the world | Which real task does this part support? |
| Explain a choice | Why does this part work this way? |
| Respond to change | If the need changes, which part and check would you change first? |

Verify: In a human trial, ask the person to explain one trail in their own words. Record which questions they can answer or want to revisit. Separately test that all three prompts and the skip action exist. [Naur](https://gist.github.com/dpritchett/fd7115b6f556e40103ef)

### CEM-R6 — Fit co-work into existing human slots

Inside a run, each mode MUST use the human slot below. Skipping all four modes MUST leave required answers, blocking states, and verdicts identical to the baseline run.

| Mode | Existing human slot | Person and agent |
| --- | --- | --- |
| Learning | Human-check, lane-3, or hold question. Run close. | The person predicts a result. At close, the agent offers the three questions against the evidence. |
| Discussion | Plan approval or run close | The agent cites the reason for a requirement or lesson. The person can correct that reason in their own words. |
| Debate | Existing direction decision before the split. Without one, an optional comment at plan approval. | The reviewer presents an alternative and its strongest objection to the original split. The person chooses or gives another direction. |
| Brainstorming | Existing direction decision before the split, or plan approval | The person and agent offer possible approaches. The person can keep a thought without selecting it for the plan. |

Outside a run, the person's selection MUST queue a Git-backed item as `pending confirmation`.
The queue MUST pin project, item ID, repository-relative path, and Git commit and blob IDs.
It MUST store SHA-256 of the exact file bytes with that pin.
The queue MUST pin the selected Git blob even if the working file already differs. Selection MUST NOT create a run decision.

At the next run's plan approval or run close, the leader MUST present the queue with `gf map present`.
Graph-flow MUST issue one optional batch for the queued revisions at that slot.
Repeated presentation MUST reuse an existing open batch, including at run close. An empty queue MUST produce no decision.
The command MUST take no leader-authored text or item choices. Graph-flow MUST use a fixed template in the person's language.
It MUST read each pinned file verbatim from Git and display its content as inert evidence, including the reason.
The decision MUST use `issuer: map` and `purpose: map_confirmation`. Its `evidence` MUST bind the ordered item IDs, paths, Git references, and content hashes.
If the current file differs or disappears, the surface MUST mark that item `changed after selection`.
The answer path MUST recheck the current bytes and refuse confirmation of that revision. A new revision requires a new selection.
Unavailable pinned content MUST disable confirmation. CEM-R3 withdrawal still applies when a cited source changes.

The local dashboard and remote surface MUST offer confirm, keep pending, and reject for each revision.
The surfaces MUST NOT preselect confirmation. Both MUST build the answer text from the person's choices.
Use one ASCII line per evidence entry, in bound order. Join lines with LF and omit the final LF.
Each line contains an action, one space, the typed item ID, `@`, and the content hash.
Write the SHA-256 hash as 64 lowercase hexadecimal digits.
The actions are `confirm`, `pending`, and `reject`. For example, `confirm link:L12@<hash>` uses the full hash in place of `<hash>`.
Encode each ID component as UTF-8. Percent-encode all bytes outside ASCII letters, digits, hyphen, period, underscore, and tilde using uppercase hexadecimal.
Separate type and ID with one literal colon.
The map MUST accept only this form in a verified `answered` decision matching the issuer, purpose, and evidence above.
It MUST reject malformed text, missing or duplicate entries, extra entries, and mismatched hashes before applying any choice.
A confirm applies to that revision alone. A pending choice keeps it queued. A reject removes it from the queue and preserves its history.
The map MUST apply a verified answer idempotently.

The batch MUST NOT block readiness, verdicts, or run close.
At run close, graph-flow MUST record `decision.superseded` for each unanswered batch in the closing transaction.
Explicit skip and silence MUST leave eligible entries pending without a fabricated answer.
Run close MUST supersede unanswered batches before checking for blocking decisions.
If an answer races with close, the transaction MUST leave exactly one terminal decision state. [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md)

Verify: Queue three items. Check the template, pinned Git bytes, evidence, and canonical answer on both surfaces.
Confirm one, keep one pending, and reject one. Replay the answer and inspect history.
Edit a file after selection and again after display. Expect refusal for the changed revision.
Supply a free question, a duplicate line, and a wrong hash. Expect no confirmation.
Skip the batch at plan approval and close the run. Repeat with silence, a close-time batch, and a racing answer.
Inspect the supersede event for each unanswered batch. Expect no open decision after close.
Replay each co-work mode with and without participation. Compare required stops, verdicts, readiness, and final status.
Count voluntary answers separately. [ADR 0005](../adr/0005-use-existing-human-slots-for-co-work.md)

### CEM-R7 — Predict before evidence

The human answer surface MUST offer a prediction or a skip before it reveals evidence for an eligible gate. The prediction states whether the unit will later need rework. Rework is a recorded rejection, reopen, or rollback after this answer. The surface MUST retain the person's choice in the existing signed answer text without a change to the verdict or explanation.

An eligible gate is a human-check, lane-3, or hold question with a risk signal. A risk signal is a first attempt, a red check, or a recorded rollback for the same unit. Other gates show evidence at once. The person can reveal evidence immediately by skipping.

An answer without this interaction has no recorded prediction. The answer identifies the unit and attempt. Ordinary free text supplies no scored forecast. A grade-1 failure rejects work before any human question. A grade-1 result therefore cannot be a prediction target. [gate.py](../../skills/graph-flow/scripts/graphflow/gate.py)

Verify: Predict rework, predict no rework, skip, and use the ordinary terminal path in separate fixtures. Add a gate without a risk signal and expect no prediction prompt. Check the display order and answer text. Expect identical verdicts.

### CEM-R8 — Review each new constraint

The person MUST have an optional free question for each constraint that `gf learn add` records for a run. This includes a constraint that the leader adds after the final gate. Its options MUST cover keep, rewrite the reason in my words, and drop. An unanswered constraint MUST still apply within its scope and show an unratified label on the plan card.

The projected constraint shows `ratified_by` with the decision ID for keep or rewrite. A rewrite keeps the person's reason beside the original constraint. It leaves the approved command intact. A drop cites the decision in the existing retirement process. Changes apply to future plans. A signed answer for an earlier constraint revision remains historical.

Verify: Exercise all three choices and silence. Add a constraint after the final gate and expect its question. Compare the next plan card, constraint status, reason, and decision reference. Check that run close needs no reply and that no required stop appears. [leader.md §8–9](../../skills/graph-flow/references/leader.md)

### CEM-R9 — Show the person what happened after approval

The cross-run `gf summary` MUST report the measures below from source records. Per-run `gf trace --conformance` MUST report prediction calibration and the share of new constraints the person ratified.

| Measure | Counting rule |
| --- | --- |
| Later rework | Count approvals followed by a recorded rejection, reopen, or rollback for the same unit. Count each approval once. |
| Short waits | Count approvals with recorded ask-to-answer time below the threshold for their decision kind. Show each threshold in seconds. |
| Approval rate | For each kind, divide approvals by answered decisions with an approval outcome available. |
| Prediction calibration | For each forecast group (rework, no rework), show counts and the observed rework rate. Score a forecast after its run closes. Show units that are still open as pending. |
| Baseline and skips | Show accuracy minus the majority-outcome rate on the same scored cases. Report explicit skips per recorded prediction or skip. |
| Constraint ratification | Divide distinct constraints with keep or rewrite answers by all constraints that `gf learn add` recorded for the run. Show drops separately. |

Match each observation by project, run, unit, and applicable attempt. Separate later rework from any claim about its cause. Show numerator and denominator for rates. Show “unavailable” for an empty denominator or missing evidence. Label incomplete coverage and distinguish missing responses from explicit skips.

Approval timing describes the interval between records. It cannot establish attention or understanding.

Verify: Record four "no rework" forecasts. Reopen one of those units later. Expect zero improvement over baseline. Add a pending unit, a skip, and an older run without predictions. Check every count against a hand-counted event history.

### CEM-R10 — Compare splits before commitment

Debate mode applies to proposed lane-2 or lane-3 work. When a direction decision already precedes the split, debate mode MUST offer the counter-proposal in that decision. Otherwise it MAY show the counter-proposal at plan approval as an optional comment. It MUST NOT create a new question for debate. A reviewer from another model family MUST supply the alternative split and objection. Missing review capacity MUST leave the original decision available.

Give the direction question concrete options. Record the chosen option and associated plan nodes when the person chooses. Report the non-default choice rate and later rejection rate for those units. Omit untraceable choices from both denominators.

Verify: Check the reviewer family, options, objection, and sequence relative to the plan revision. Compare the choice and later rejections with the selected units. Test a plan without a direction decision and expect zero additional questions. Remove the slot or reviewer and compare required stops.

### CEM-R11 — Preserve execution and signing rules

Map content MUST NOT authorize execution or change gate evidence. The map MUST NOT introduce plan fields, execution node kinds, or dependencies. Map interactions MUST preserve the existing human answer path and HMAC v3 format. Agents MUST NOT write or prefill a person's answer, prediction, or ratification. The reader MUST NOT read `human.key`. It MUST take answer verification only from the existing verifier as a read-only result. An answer without a verified result MUST count as unverified.

Verify: Replay accepted, rejected, stale, and unsigned fixtures through the existing integrity checks. Compare signing vectors, verdicts, scoped returns, and readiness with the baseline. Tamper with one answer record. Make the verifier unavailable for another answer. Expect invalid evidence for the tampered answer. Expect `unverifiable here` for the unavailable verification context under CEM-R14.

### CEM-R12 — Preserve local access boundaries

Map access MUST respect the existing role and project scope of each source. The map reader MUST use the Python standard library and stay on loopback.
The separate remote surface MUST expose map decisions only under RA-R3 and RA-R7. [Remote scope](remote-approval.md#ra-r3--restrict-remote-reads-and-operations)

Verify: Test role-scoped reads, a foreign project, a path outside the root, and a private key path. Expect no disclosure through labels, links, or counts. Check imports and network destinations.

### CEM-R13 — Surface conflicts

An agent MAY propose a `conflicts with` link between two map nodes. The proposal MUST cite both source references and state the conflict in one sentence. The proposal MUST stay unconfirmed until the person confirms it. A confirmed conflict MUST show on both map nodes until the person resolves or withdraws it.

Verify: Use a fixture with a Thought and a Requirement that disagree. Propose the link and check both citations and the unconfirmed label. Confirm it and check the label on both map nodes. Resolve it and expect the label to go and the history to stay. [Luhmann](https://zettelkasten.de/communications-with-zettelkastens/) · [ADR 0003](../adr/0003-keep-link-confirmation-with-the-person.md)

### CEM-R14 — Turn confirmed links into checks

Confirmation is verifiable only on the person's install with the original key, run records, and bound project location.
Git carries the selected content and answer reference. It supplies no portable proof.

| Item or coverage result | Required behavior of `gf map check` |
| --- | --- |
| Pass | Each current plan requirement MUST have a derived or locally verified `tests` link from a check. |
| Failure | The check MUST name uncovered requirements, missing sources of verified links, and demonstrably invalid confirmation claims. |
| Unverifiable here | With a referenced confirmation outside its verification context, the check MUST report `unverifiable here` and name each affected item. |

A claim without an answer reference MUST fail. A free question, signed commit, altered signature, or answer for another revision MUST fail when examinable.
A fresh clone, CI, another machine, key repin, or project move can lack the original verification context.
Affected items MUST count as neither passes nor failures. Unconfirmed proposals MUST NOT establish coverage.
If coverage depends solely on unavailable confirmation evidence, the requirement MUST also show `unverifiable here`.
The check MUST still report every independent failure.
It MUST exit 1 for any failure, 6 for unavailable verification alone, and 0 for complete success.
Consumers MUST distinguish exit 6 from both success and a failed check. A plan MAY include the check.
The map MUST NOT add or change a check by itself.

Verify: Check complete coverage on the original install. Expect exit 0.
Remove coverage, leave only an agent proposal, or remove a verified link's source. Expect exit 1 with the affected ID.
Try a signed commit, a tampered answer, and a valid answer for another revision. Expect exit 1 with each affected ID.
Repeat the valid fixture in a fresh clone, in CI, and on another machine without the original key and records.
Repeat after key repin and after moving the project. Expect exit 6 and every affected ID. Expect no pass or failure for those items.
Add an independent uncovered requirement. Expect exit 1, its ID, and the unchanged list of unverifiable items.
[ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md) · [ADR 0009](../adr/0009-turn-confirmed-links-into-checks.md) · [Tan, transcript (machine-generated)](https://ai.engineer/api/code/reading-download/transcripts/lauren-tan.md)

### CEM-R15 — Propose term candidates

An agent MAY propose a Domain term candidate from code, specs, or conversation. The candidate MUST cite its source reference. It MUST stay unconfirmed until the person confirms it or rewrites its definition.

Verify: Propose a candidate from one source file. Check the citation and the unconfirmed label. Rewrite the definition as the person and check the new revision and its author. [ADR 0004](../adr/0004-use-the-domain-glossary-as-an-entry-point.md)

### CEM-R16 — Open a topic outside a run

The reader MUST let the person open a topic for discussion, debate, or brainstorming at any time. A topic MUST be a Thought with an open status. The reader MUST NOT start or message an agent. An agent MUST NOT read open topics unless it acts in a leader session. A worker brief MUST NOT include topic text. The leader MUST treat topic text as quoted data, not as instructions. The leader SHOULD answer each open topic with proposals and objections. It MUST answer each topic revision at most once. Each answer MUST stay unconfirmed until the person keeps it. A topic MUST NOT create a run decision or block a run.

Verify: Open a topic with no run. Check the open Thought and that no agent process starts. Add a leader answer and check its unconfirmed label. Read the map twice and expect one answer. Put an instruction-shaped topic in the map while a worker runs. Expect no change to the worker brief and no worker action. Start a run and compare required answers with the baseline. [ADR 0005](../adr/0005-use-existing-human-slots-for-co-work.md) · [ADR 0007](../adr/0007-show-trails-in-a-separate-local-reader.md)

## Security and invariants

The requirement numbers below use the CEM prefix.

| Requirements | Invariant and effect |
| --- | --- |
| R1–R3, R11 | P3, P6. Source joins are mechanical. Only an approved plan dependency can order work. |
| R4–R6, R10 | P5, P10. The baseline is plan approval plus planned decisions. A missing learning response leaves work ready. |
| R6–R10 | P10, P12. Trace still counts free answers and holds as unplanned. Report optional waits separately from required stops. |
| R1, R7, R9, R11 | P1, P7. Check grades retain their order. Signed personal text supplies no execution evidence. |
| R8, R9 | P11, P12. Accepted results can inform later plans. The person's own lesson has no effect on the current plan. |
| R3, R11 | P2, P4, P8, P9. Attempts, owned paths, scoped rejection, and lane approvals stay under plan and gate control. |
| R3, R11, R12 | P5, P9, P10. Agents use their own roles and never handle human keys or edit run records directly. |
| R13, R14 | P1, P6, P11. A conflict stays a proposal until the person confirms it. `gf map check` only reads. A plan opts in to it. |
| R15, R16 | P10. Agent answers and term candidates stay proposals. A topic adds no human stop to a run. |

Only plan and gate code issue binding approval requests. Only the person answers them. The current signature binds the answer to its question and evidence. It authenticates neither unsigned execution records nor a person's private thought process.

Same-account processes share operating-system access. Agents never set the human role or call the human answer command. Activity metadata supplies no personal text. New run events, if needed, use the existing transaction writer and documented event table. [Identity rules](../../skills/graph-flow/SKILL.md#human-identity) · [Dashboard](../../skills/graph-flow/references/dashboard.md) · [Principles](../../skills/graph-flow/references/principles.md)

The design adds no execution node, required answer, or blocking state. The counter-proposal trial compares one review boundary at a time. Run each task at least twice per variant. Compare flips, disagreement between repeats, elapsed time, required answers, optional waits, and review cost. [Design checklist](../design-sources.md)

## Decided questions

| ID | Decision (2026-11-20) | Record |
| --- | --- | --- |
| OQ-1 | A separate local reader opens trails. The dashboard takes answers. The remote surface also accepts eligible in-run decisions. | [ADR 0007](../adr/0007-show-trails-in-a-separate-local-reader.md) |
| OQ-2 | Authored thoughts, terms, and links live in Git-tracked project documents. | [ADR 0008](../adr/0008-keep-authored-material-in-project-documents.md) |
| OQ-3 | Only gates with a risk signal offer a prediction. | [CEM-R7](#cem-r7--predict-before-evidence) |
| OQ-4 | Each decision kind has its own short-wait threshold. | [CEM-R9](#cem-r9--show-the-person-what-happened-after-approval) |
| OQ-5 | Each authored item has its own file. | [ADR 0008](../adr/0008-keep-authored-material-in-project-documents.md) |
| OQ-6 | The earlier decision chose a signed commit. ADR 0017 replaced it (OQ-8). | [ADR 0010](../adr/0010-confirm-outside-a-run-with-a-signed-commit.md) |
| OQ-7 | An unconfirmed proposal is withdrawn when a source it cites changes. | [CEM-R3](#cem-r3--keep-link-provenance) |
| OQ-8 | Queue the selected revision. Confirm it through the map-issued batch at the next run’s plan approval or run close. | [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md) |

## Open questions

None.
