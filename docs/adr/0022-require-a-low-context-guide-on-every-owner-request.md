# 0022 Require a low-context guide on every owner request

Status: Accepted (2026-11-21, owner design review in issue #11)

## Context

In the first My turn mockup, the revision card showed the failed test and the changed files. The worker’s separate question asked how to proceed. Reading either card required knowing why the worker had stopped. In the second mockup, the guide explained that the worker lacked permission to edit two tests, what granting that permission would allow, and how a reviewer could check the edits. The owner endorsed this reading order.

## Decision

Require the requesting agent to write a guide for someone unfamiliar with the run, code and project vocabulary. Put it after the question and requester lines. Explain what happened in at most five numbered steps, the decision in one sentence, the risk and any safeguard, the effect of each answer, and the requester’s recommendation with its reason. Label a rewrite with its author and retain the original question verbatim. Let the owner open a glossary definition beside an unfamiliar term. Put supporting records under “Check the details” so the owner can verify the guide. [DASH-R27](../spec/dashboard.md#dash-r27--explain-the-request-before-showing-the-records) · [DASH-R28](../spec/dashboard.md#dash-r28--define-unfamiliar-terms-in-place) · [ADR 0021](0021-show-the-requesters-recommendation-with-its-reason.md)

Require the guide at the point that supplies the request. Extend the revision note and bind its full contents to the existing signature. Use plan-level fields for first approval and check or decision context for gate requests. Validate those fields with the plan. Require a guide input on `gf decide ask` for free questions. Reuse the recorded question and answer effects where they supply guide parts. [DASH-R29](../spec/dashboard.md#dash-r29--require-the-guide-at-the-source-of-each-request) · [ADR 0020](0020-require-a-plan-revision-note.md)

## Alternatives considered

A renderer could list events and changed fields, but those records do not explain why the requester considers a risk worth taking. A chat explanation can get separated from the request. An optional guide would leave the owner to reconstruct the same background whenever the author skipped it.

## Consequences

Authors need to supply the context before the request reaches the owner. An incomplete new input fails at its source so its author can correct it without an extra owner answer. Older requests still show the original question and available evidence, with an explicit notice when the guide is missing. The visible guide adds reading space. The link to the answers shows what remains to read, and opening the underlying evidence still governs signing. [DASH-R13](../spec/dashboard.md#dash-r13--explain-and-enforce-each-reading-gate) · [DASH-R16](../spec/dashboard.md#dash-r16--display-older-runs) · [DASH-R20](../spec/dashboard.md#dash-r20--read-the-plan-without-the-graph)

## Principles served

P6 assigns completeness and signature checks to code. P7 keeps authored explanations distinct from recorded evidence. P10 justifies refusing an incomplete request before it consumes the owner’s time. The guide adds no decision or approval. [Principles](../../skills/graph-flow/references/principles.md)
