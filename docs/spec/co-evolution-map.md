# Co-evolution map

Status: Draft

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

Verify: Create a person-authored link. Compare its label with a derived link and an agent proposal. Check that plan approval alone leaves the proposal unconfirmed. Confirm one proposal. Edit its reason. Expect the new revision to require confirmation. [ADR 0003](../adr/0003-keep-link-confirmation-with-the-person.md)

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
| Debate | Existing direction decision before the split | The reviewer presents an alternative and its strongest objection to the original split. The person chooses or gives another direction. |
| Brainstorming | Existing direction decision before the split, or plan approval | The person and agent offer possible approaches. The person can keep a thought without selecting it for the plan. |

Verify: Replay each mode with the same underlying decision and evidence. Repeat with the mode skipped. Compare required answer counts, readiness, and final status. Count voluntary free answers separately. [ADR 0005](../adr/0005-use-existing-human-slots-for-co-work.md)

### CEM-R7 — Predict before evidence

The human answer surface MUST offer a prediction or a skip before it reveals evidence for an eligible gate. It MUST retain the person's choice in the existing signed answer text without changing their verdict or explanation.

An eligible gate is a human-check, lane-3, or hold question with a named prediction target and a risk signal. A risk signal is a first attempt, a red check, or a recorded rollback for the same unit. Other gates show evidence at once. The person can reveal evidence immediately by skipping.

An answer without this interaction has no recorded prediction. The answer identifies the forecast target and attempt. Ordinary free text supplies no scored forecast.

Verify: Predict failure, skip, and use the ordinary terminal path in separate fixtures. Add a gate without a risk signal and expect no prediction prompt. Check the display order and answer text. Expect identical verdicts. Exclude late guesses and absent predictions from accuracy.

### CEM-R8 — Review a constraint at run close

At run close the person MUST have an optional free question for each new constraint. Its options MUST cover keep, rewrite the reason in my words, and drop. An unanswered constraint MUST still apply within its scope and show an unratified label on the plan card.

The projected constraint shows `ratified_by` with the decision ID for keep or rewrite. A rewrite keeps the person's reason beside the original constraint. It leaves the approved command intact. A drop cites the decision in the existing retirement process. Changes apply to future plans. A signed answer for an earlier constraint revision remains historical.

Verify: Exercise all three choices and silence. Compare the next plan card, constraint status, reason, and decision reference. Check that run close needs no reply.

### CEM-R9 — Show the person what happened after approval

The cross-run `gf summary` MUST report the measures below from source records. Per-run `gf trace --conformance` MUST report prediction calibration and the share of new constraints the person ratified.

| Measure | Counting rule |
| --- | --- |
| Later rework | Count approvals followed by a recorded rejection, reopen, or rollback for the same unit. Count each approval once. |
| Short waits | Count approvals with recorded ask-to-answer time below the threshold for their decision kind. Show each threshold in seconds. |
| Approval rate | For each kind, divide approvals by answered decisions with an approval outcome available. |
| Prediction calibration | For scored pass and fail forecasts, show counts and observed pass rates in each group. Use only the corresponding grade-1 result. |
| Baseline and skips | Show accuracy minus the majority-outcome rate on the same scored cases. Report explicit skips per recorded prediction or skip. |
| Constraint ratification | Divide distinct new constraints with keep or rewrite answers by all new constraints at close. Show drops separately. |

Match each observation by project, run, unit, and applicable attempt. Separate later rework from any claim about its cause. Show numerator and denominator for rates. Show “unavailable” for an empty denominator or missing evidence. Label incomplete coverage and distinguish missing responses from explicit skips.

Approval timing describes the interval between records. It cannot establish attention or understanding.

Verify: Score three passes and one failure with four pass forecasts. Expect zero improvement over baseline. Add a skip and an older run without predictions. Check every count against a hand-counted event history.

### CEM-R10 — Compare splits before commitment

Debate mode applies to proposed lane-2 or lane-3 work. It MUST offer a counter-proposal in an existing direction decision before the split. A reviewer from another model family MUST supply the alternative split and objection. Missing review capacity MUST leave the original decision available.

Use a free direction question with concrete options. If the split needs no direction decision, show the alternative at plan approval as an optional comment. Record the chosen option and associated plan nodes when the person chooses. Report the non-default choice rate and later rejection rate for those units. Omit untraceable choices from both denominators.

Verify: Check the reviewer family, options, objection, and sequence relative to the plan revision. Compare the choice and later rejections with the selected units. Remove the slot or reviewer and compare required stops.

### CEM-R11 — Preserve execution and signing rules

Map content MUST NOT authorize execution or change gate evidence. The map MUST NOT introduce plan fields, execution node kinds, or dependencies. Map interactions MUST preserve the existing human answer path and HMAC v3 format. Agents MUST NOT write or prefill a person's answer, prediction, or ratification.

Verify: Replay accepted, rejected, stale, and unsigned fixtures through the existing integrity checks. Compare signing vectors, verdicts, scoped returns, and readiness with the baseline.

### CEM-R12 — Preserve local access boundaries

Map access MUST respect the existing role and project scope of each source. The runtime MUST use the Python standard library and limit network access to the existing loopback boundary.

Verify: Test role-scoped reads, a foreign project, a path outside the root, and a private key path. Expect no disclosure through labels, links, or counts. Check imports and network destinations.

### CEM-R13 — Surface conflicts

An agent MAY propose a `conflicts with` link between two map nodes. The proposal MUST cite both source references and state the conflict in one sentence. The proposal MUST stay unconfirmed until the person confirms it. A confirmed conflict MUST show on both map nodes until the person resolves or withdraws it.

Verify: Use a fixture with a Thought and a Requirement that disagree. Propose the link and check both citations and the unconfirmed label. Confirm it and check the label on both map nodes. Resolve it and expect the label to go and the history to stay. [Luhmann](https://zettelkasten.de/communications-with-zettelkastens/) · [ADR 0003](../adr/0003-keep-link-confirmation-with-the-person.md)

### CEM-R14 — Turn confirmed links into checks

`gf map check` MUST exit non-zero when a requirement in the current plan has no `tests` link from a check. It MUST also exit non-zero when a confirmed link cites a missing source. It MUST exit non-zero when an item confirmed outside a run lacks a valid signature from the allowed-signers list. A plan MAY add `gf map check` to its integration checks. The map MUST NOT add or change a check by itself.

Verify: Run `gf map check` on a plan with full coverage and expect exit 0. Remove one `tests` link and expect a non-zero exit that names the requirement. Remove one cited source and expect a non-zero exit that names the link. Confirm an item in an unsigned commit and expect a non-zero exit. [ADR 0010](../adr/0010-confirm-outside-a-run-with-a-signed-commit.md) [ADR 0009](../adr/0009-turn-confirmed-links-into-checks.md) · [Tan, transcript (machine-generated)](https://ai.engineer/api/code/reading-download/transcripts/lauren-tan.md)

### CEM-R15 — Propose term candidates

An agent MAY propose a Domain term candidate from code, specs, or conversation. The candidate MUST cite its source reference. It MUST stay unconfirmed until the person confirms it or rewrites its definition.

Verify: Propose a candidate from one source file. Check the citation and the unconfirmed label. Rewrite the definition as the person and check the new revision and its author. [ADR 0004](../adr/0004-use-the-domain-glossary-as-an-entry-point.md)

### CEM-R16 — Open a topic outside a run

The reader MUST let the person open a topic for discussion, debate, or brainstorming at any time. A topic MUST be a Thought with an open status. The reader MUST NOT start or message an agent. An agent session that reads the map SHOULD answer each open topic with proposals and objections. Each answer MUST stay unconfirmed until the person keeps it. A topic MUST NOT create a run decision or block a run.

Verify: Open a topic with no run. Check the open Thought and that no agent process starts. Add an agent answer and check its unconfirmed label. Start a run and compare required answers with the baseline. [ADR 0005](../adr/0005-use-existing-human-slots-for-co-work.md) · [ADR 0007](../adr/0007-show-trails-in-a-separate-local-reader.md)

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
| OQ-1 | A separate local reader opens trails. Answers stay on the dashboard. | [ADR 0007](../adr/0007-show-trails-in-a-separate-local-reader.md) |
| OQ-2 | Authored thoughts, terms, and links live in Git-tracked project documents. | [ADR 0008](../adr/0008-keep-authored-material-in-project-documents.md) |
| OQ-3 | Only gates with a risk signal offer a prediction. | [CEM-R7](#cem-r7--predict-before-evidence) |
| OQ-4 | Each decision kind has its own short-wait threshold. | [CEM-R9](#cem-r9--show-the-person-what-happened-after-approval) |
| OQ-5 | Each authored item has its own file. | [ADR 0008](../adr/0008-keep-authored-material-in-project-documents.md) |
| OQ-6 | A commit signed with the person's own key confirms an item outside a run. | [ADR 0010](../adr/0010-confirm-outside-a-run-with-a-signed-commit.md) |

## Open questions

| ID | Question | Options and consequences |
| --- | --- | --- |
| OQ-7 | What happens to old unconfirmed proposals? | Fold after a set age: the list stays short, and old ideas are hidden. Keep all visible: nothing is lost, and the list grows. Withdraw when a cited source changes: stale proposals go, and the agent must propose again. |
