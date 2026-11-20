# Feature specifications

Graph-flow uses **spec-anchored** Spec-Driven Development. The spec states the expected behavior before implementation. It stays with the feature when behavior changes. People can revise the code and checks directly. A short, maintained spec gives each change a stable point of reference. [Böckeler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

## Write and maintain a spec

1. Give the feature a unique uppercase prefix. Assign IDs in the form `<prefix>-R<number>`, starting at 1.
2. Keep each ID with its behavior. Allocate a new ID for a different obligation. Keep a reference to each retired ID.
3. State the purpose, limits, and domain terms. Place the standard BCP 14 paragraph before the requirements.
4. Give each ID an observable obligation. Add a `Verify:` line with an input and an expected result.
5. Prefer a check that a program can fail. Label any exercise that requires human judgment.
6. Link each architectural choice to its ADR. Link back from the ADR to the affected requirement IDs.
7. Keep unresolved choices under numbered open questions. Give each option a consequence.
8. Revise the spec and its checks in the same change when behavior changes. Record the SHA-256 hash of the English source in each Korean reading copy.

Use short sentences and one term per concept. Use uppercase requirement keywords only in requirements and the standard paragraph. [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) · [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) · [ASD-STE100](https://www.asd-ste100.org/STE_faq.html)

## Code follows the spec

1. Treat the spec as the statement of expected behavior. Code follows the spec.
2. When code and spec differ, fix the code by default.
3. Change the spec only when the code is right for one of these reasons:
   - **Agent limit:** an agent cannot build the behavior as stated, because of its capabilities or the rules that bind it.
   - **Code limit:** the language, platform, runtime, or existing system prevents the behavior as stated.
   - **Improvement:** the code gives better behavior than the spec states.
4. Name the reason and its evidence in the spec change. An agent proposes the change. The person accepts the spec revision.
5. Never leave a known difference unresolved. Until it is resolved, record a `conflicts with` link between the requirement and the code.

[ADR 0011](../adr/0011-code-follows-the-spec.md)

## Spec status

| Status | Meaning |
| --- | --- |
| Draft | The person and agents can discuss the proposed behavior. |
| Accepted | The person accepts this revision as the design reference. |
| Superseded | A named successor replaces this spec. The old IDs remain available. |
| Withdrawn | The person ends work on this spec without a successor. |

Spec acceptance records a design choice. Run approval still belongs to the plan and gate procedures.

## Link a plan to a spec

For each requirement in scope, copy its ID and obligation into the existing plan `requirements` list. Use the same ID in the implementing node's singular `requirement` field. Pin the spec revision in the planning brief. Split work only when the scope warrants a separate unit. A node with several obligations can cite additional IDs in its existing check titles.

For example, a plan can list `{"id":"CEM-R3","text":"The map MUST keep the link origin and confirmation history."}`. A work node can then carry `"requirement":"CEM-R3"`. Check titles cite obligations. Command results provide evidence. Verify the ID joins against the pinned spec. The existing plan validator checks plan structure. [Plan contract](../../skills/graph-flow/references/plan.md)

**Principles served.** P1 connects each obligation to a falsifiable check. P6 supports mechanical ID checks. P10 keeps document review outside run approval. [Principles](../../skills/graph-flow/references/principles.md)

[Co-evolution map](co-evolution-map.md) · [ADR process](../adr/README.md) · [ADR 0001](../adr/0001-record-architecture-decisions.md)
