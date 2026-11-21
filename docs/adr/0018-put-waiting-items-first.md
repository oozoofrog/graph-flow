# 0018 Put waiting items first

Status: Accepted (2026-11-21, owner design review in issue #11)

## Context

The owner opened a revised plan and could not tell who asked, what changed, or which control signed. In the fixture with a revised plan and a free question, the header counted two items. The to-do list showed one. On the other tab, the decision shared the screen with a node graph. [Issue #11 and owner decisions](https://github.com/oozoofrog/graph-flow/issues/11)

## Decision

Open a run on My turn. Show one card per owner action, including key recovery. Count those actions from the same set. A request that needs the leader to repair it has a separate card and contributes zero owner actions or pending answers. When it is empty, say so and summarize progress. Open direct decision links on the named item.

Start each card with the choice. Name the requester and the owner. Explain why the request is open, what each answer does, and what to read. Put signed send-back first, then signed approval or the kind’s affirmative answer, then inspection. Use each action’s signing label across decision kinds. The current plan screen puts approval first. Follow the documented send-back-first rule on that screen as well as on gate decisions. This keeps correction visible when the evidence is empty or includes a failure. Put each unmet reading condition beside the affected control. This gives the owner enough information to decide before signing. [DASH-R1](../spec/dashboard.md#dash-r1--identify-the-requester-and-the-owner) · [DASH-R2](../spec/dashboard.md#dash-r2--state-the-question-and-its-trigger) · [DASH-R3](../spec/dashboard.md#dash-r3--explain-each-outcome) · [DASH-R4](../spec/dashboard.md#dash-r4--direct-the-owner-to-the-evidence) · [DASH-R12](../spec/dashboard.md#dash-r12--name-and-order-the-signing-controls) · [DASH-R13](../spec/dashboard.md#dash-r13--explain-and-enforce-each-reading-gate)

Open Progress on a task list with status and assignee. Keep Graph and Log as separate destinations. Explain the diagram in a legend. Use the same terms for the same states. Keep the card usable without the graph so issue #4 can reuse it for a phone or remote view. [DASH-R5](../spec/dashboard.md#dash-r5--open-on-my-turn) · [DASH-R6](../spec/dashboard.md#dash-r6--show-progress-as-a-task-list) · [DASH-R7](../spec/dashboard.md#dash-r7--explain-graph-and-progress-terms) · [DASH-R8](../spec/dashboard.md#dash-r8--trace-a-rejected-attempt) · [Issue #4](https://github.com/oozoofrog/graph-flow/issues/4)

## Alternatives considered

A graph with a pinned approval lets a reader see dependencies immediately. A second open question can still escape attention. A combined inbox and log puts past decisions beside requests the owner can still answer. Both choices make the owner reconstruct the current workload.

## Consequences

The owner can reconcile the count with the visible work. Inspecting dependencies takes one navigation action. Separate views need common status terms and links back to the same attempt. Use the session of the initiating plan-set or gate event, and the ask actor for free questions. Key re-pin uses the recovery actor. Identify the worker separately from the bound submission. Issue #3 adds session and agent detail. A missing field remains visible as a gap. The public capture cases check repair counts and the card at 390 CSS px. [DASH-R21](../spec/dashboard.md#dash-r21--identify-recovery-and-repair-actions) · [DASH-R23](../spec/dashboard.md#dash-r23--keep-my-turn-usable-at-narrow-widths) · [Issue #3](https://github.com/oozoofrog/graph-flow/issues/3)

## Principles served

P6 gives the count and the cards one mechanical source. P10 keeps the existing human decisions and makes the act of signing explicit. P12 connects the next action to the actual state of the work. [Principles](../../skills/graph-flow/references/principles.md)
