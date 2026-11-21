# 0020 Require a note for structural plan revisions

Status: Accepted (2026-11-21, owner design review in issue #11)

## Context

A failed attempt exposed a mismatch between a worker's assignment and two existing schema tests. The next plan granted permission to edit those tests. A field diff could show the new paths. It could not explain why the owner should grant the permission or what sending the plan back would do. The original plan goal still described the first approval. [Issue #10](https://github.com/oozoofrog/graph-flow/issues/10)

## Decision

Take a fresh note as `gf plan set <file> --note <json-file>` for each structural revision. Validate the four strings before writing anything. In one transaction store the note on that revision’s `plan.set` event and copy it exactly to the approval ask’s `evidence.revision_note`. Use its decision sentence as the ask’s `question` and the card heading. The existing displayed identity and v3 signature already cover both question and evidence. This uses the rule for binding the text of later questions. [DASH-R9](../spec/dashboard.md#dash-r9--require-a-note-for-a-structural-revision) · [DASH-R19](../spec/dashboard.md#dash-r19--bind-the-displayed-revision-note) · [Wording and later questions](../../skills/graph-flow/references/records.md#wording-and-later-questions)

Keep the note outside plan identity. Supersede an open ask if the leader edits the note. After verified approval, keep the signed copy on the dashboard and in history. Link any wording-only amendment to that approval as a later edit. A subsequent structural revision takes its own note. Run-level `context.why` continues to explain the whole plan.

Show the leader’s explanation first. Then show the changed fields, their risks and the most recent returned attempt of each changed task. Use the recorded outcomes beside the answer controls. Return the revision, decision ID and note to the leader for the chat relay. [DASH-R3](../spec/dashboard.md#dash-r3--explain-each-outcome) · [DASH-R8](../spec/dashboard.md#dash-r8--trace-a-rejected-attempt) · [DASH-R10](../spec/dashboard.md#dash-r10--read-the-note-before-the-changes) · [DASH-R11](../spec/dashboard.md#dash-r11--relay-the-revision-in-chat) · [DASH-R22](../spec/dashboard.md#dash-r22--flag-changes-that-raise-risk)

Replace the graph-viewport reading gate. For first approval, open each task once in the list. For a structural revision, open the note and every changed entry. The unchanged remainder can stay collapsed. The graph is optional throughout. Opening a specific entry makes the reading action observable at any viewport size. Preserve the other answer conditions, including reading older submissions and their files when continuing a legacy run. [DASH-R13](../spec/dashboard.md#dash-r13--explain-and-enforce-each-reading-gate) · [DASH-R20](../spec/dashboard.md#dash-r20--read-the-plan-without-the-graph)

## Alternatives considered

Putting the reason in the plan file allows the next revision to inherit stale text. A diff identifies changed fields but cannot recover the leader’s reason. Chat alone loses the link to the signed question. Including note wording in plan identity would force a new signature for an editorial change. The viewport rule required reviewing unchanged tasks and forced the owner into Graph.

## Consequences

Update the run-fields list in the plan reference to identify the note as command input stored on the event. Keep the plan JSON schema and its exact list of structural-identity exclusions intact. Document that the note never enters the identity input. Keep V1 validation for unknown plan fields, including a misplaced `revision_note`. Document the additional transaction check for a missing, non-string or blank note part when the identity changes. Standalone validation of a plan file needs no revision history. [V1](../../skills/graph-flow/references/plan.md#L93) · [Structural identity](../../skills/graph-flow/references/plan.md#L124) · [Run fields](../../skills/graph-flow/references/plan.md#L156)

An incomplete proposal costs a local retry and adds zero owner answers. An edit to an open note invalidates the earlier display. A wording-only edit after approval adds a history entry and no signature. A first approval requires one opening per task. Each structural approval requires one opening per changed entry plus one for the note. Old records retain their original evidence and can show a missing-note notice. Update the CLI result, record reference, leader relay, dashboard and public fixture checks together. [DASH-R16](../spec/dashboard.md#dash-r16--display-older-runs) · [DASH-R24](../spec/dashboard.md#dash-r24--ship-reproducible-dashboard-fixtures)

## Principles served

P6 gives structural comparison and completeness checks to code. P7 separates the author's explanation from the recorded evidence. P10 justifies refusing a structural revision that lacks the information needed for the existing approval. [Principles](../../skills/graph-flow/references/principles.md)

See also — [ADR 0022 on the additional guide fields in the revision note](0022-require-a-low-context-guide-on-every-owner-request.md)
