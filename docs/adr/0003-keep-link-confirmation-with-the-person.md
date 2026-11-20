# 0003 Keep link confirmation with the person

Status: Accepted (2026-11-20, design review in PR #6)

## Context

An agent can see a possible connection between a thought and a file. Only the person knows whether it expresses their intent. Examining possible connections can prompt a person to revisit earlier ideas. [Matuschak](https://notes.andymatuschak.org/Evergreen_notes_should_be_densely_linked)

## Decision

Label each authored link with its author, role, endpoints, reason, and revision. Show an agent proposal as unconfirmed. Record the person's explicit selection of that revision in an existing human answer.

Retain the agent as proposer and the person as confirmer. Show person-authored links as such. Mark a derived link with its source relation. [CEM-R3](../spec/co-evolution-map.md#cem-r3--keep-link-provenance)

## Alternatives considered

Automatic confirmation would save a gesture but assign the agent's interpretation to the person. Requiring a new decision for every link would interrupt work.

## Consequences

Plan approval alone confirms no link. Changing an endpoint or reason produces a new revision. Declined and withdrawn links remain in history outside the confirmed trail. Replaying an answer repeats no change. A stale or unverifiable answer supplies no current confirmation. Only a deliberate selection of a specific proposal counts. An unconfirmed proposal is withdrawn when a source it cites changes (OQ-7).

## Principles served

P6 supports exact revision matching. P7 preserves provenance. P10 keeps confirmation voluntary inside an existing human slot. [Principles](../../skills/graph-flow/references/principles.md)
