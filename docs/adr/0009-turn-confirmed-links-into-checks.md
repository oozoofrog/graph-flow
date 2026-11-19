# 0009 Turn confirmed links into checks

Status: Proposed

## Context

A gap between a requirement and its check is easy to miss. A reminder in prose depends on attention. Tan describes this practice: "every time we correct our agents, it turns into one of these deterministic checks". [Tan, transcript (machine-generated)](https://ai.engineer/api/code/reading-download/transcripts/lauren-tan.md)

## Decision

Add a read-only command, `gf map check`. It fails when a requirement in the current plan has no `tests` link from a check. It also fails when a confirmed link cites a missing source. A plan can add the command to its integration checks. The map never adds or changes a check by itself. [CEM-R14](../spec/co-evolution-map.md#cem-r14--turn-confirmed-links-into-checks)

## Alternatives considered

A visible gap with no check depends on the person to notice it. An automatic check in every plan would change plans without the person's choice.

## Consequences

Requirement coverage becomes a check result, not an opinion. Link maintenance becomes part of the work. A requirement that only a person can judge needs a `tests` link from a human check.

## Principles served

P1 turns an expectation into a check that can fail. P6 keeps the join mechanical. P11 makes a lesson enforce itself. [Principles](../../skills/graph-flow/references/principles.md)
