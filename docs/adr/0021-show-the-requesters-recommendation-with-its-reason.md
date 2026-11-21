# 0021 Show the requester's recommendation with its reason

Status: Accepted (2026-11-21, owner design review in issue #11)

## Context

On My turn the owner can see several possible answers and still lack a reason to choose one. In the static mockup, a leader explained why it recommended granting a worker permission to edit two existing tests. The owner could weigh that argument against the recorded change in permissions. A recommendation attached to the signing button would obscure who made the judgment.

## Decision

Show the requesting agent’s preferred answer and reason together inside its attributed guide. Keep each answer button neutral. Changing the recommended answer does not change a button’s label, emphasis, selection or position. A stored recommendation with no reason is omitted. Gate requests carry no recommendation: their guide is written with the plan, before the result exists, so a recommendation there would read as a judgment of work nobody has seen. The owner chose this exception on 2026-11-21. [DASH-R30](../spec/dashboard.md#dash-r30--show-a-reasoned-recommendation-and-keep-the-answers-neutral) · [DASH-R12](../spec/dashboard.md#dash-r12--name-and-order-the-signing-controls)

At implementation time, revise the sentence on line 141 of the leader guidance that reads “The dashboard displays those choices and their consequences; do not mark one as recommended.” Permit the requester to identify one answer and explain why in the card text. Keep the prohibition on marking the options themselves. [Leader guidance](../../skills/graph-flow/references/leader.md#L141)

## Alternatives considered

Omitting all recommendations leaves the owner to reconstruct the requester’s judgment. A badge or preselected answer makes the suggestion visible at the signing control but gives it weight independent of its reason.

## Consequences

The requester has to justify its preference when writing the guide. The owner can inspect the records, choose another answer or type a reply when that option exists. Paired fixtures with opposite recommendations can detect a change in the answer controls. Assessing the quality of the reason takes human judgment. [Guide inputs](../spec/dashboard.md#dash-r29--require-the-guide-at-the-source-of-each-request)

## Principles served

P7 keeps the agent’s opinion attributable and independently checkable. P10 leaves the signed choice with the owner and adds no confirmation step. [Principles](../../skills/graph-flow/references/principles.md)
