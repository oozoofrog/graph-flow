# 0011 Code follows the spec

Status: Accepted (2026-11-20, stated by the person in PR #6 design review)

## Context

Code and spec can drift apart during implementation. A known difference that stays unresolved creates intent debt: nobody can say which one states the intended behavior. Sometimes the spec is wrong and the code is right. A design review found one case: CEM-R7 asked for a prediction of a grade-1 result, but the gate rejects a grade-1 failure before any human question. [gate.py](../../skills/graph-flow/scripts/graphflow/gate.py) · [Storey](https://arxiv.org/abs/2603.22106)

## Decision

Code follows the spec. When code and spec differ, fix the code by default. Change the spec only when the code is right for one of three reasons:

| Reason | Meaning |
| --- | --- |
| Agent limit | An agent cannot build the behavior as stated, because of its capabilities or the rules that bind it. |
| Code limit | The language, platform, runtime, or existing system prevents the behavior as stated. |
| Improvement | The code gives better behavior than the spec states. |

The spec change names the reason and its evidence. An agent proposes the spec change as an unconfirmed item. The person accepts the spec revision. Never leave a known difference unresolved. Until the change resolves it, record a `conflicts with` link between the requirement and the code. [Spec process](../spec/README.md#code-follows-the-spec) · [ADR 0003](0003-keep-link-confirmation-with-the-person.md)

## Alternatives considered

Code as the only truth makes the spec a summary that nobody trusts. Spec as the only truth forces agents to build behavior that the system cannot support or that is worse. A silent fix in either direction loses the reason.

## Consequences

Each difference ends in one direction with a recorded reason. The spec becomes a record of how the person's understanding changed, not only a target. Spec changes add review work for the person. This rule becomes graph-flow principle P13 when the map is implemented.

## Principles served

P1 keeps each obligation tied to a check. P7 keeps a reason separate from evidence. P11 turns a discovery during implementation into a lasting rule. P12 keeps the spec revision as a record of the result. [Principles](../../skills/graph-flow/references/principles.md)
