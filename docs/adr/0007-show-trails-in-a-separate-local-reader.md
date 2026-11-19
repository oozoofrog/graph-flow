# 0007 Show trails in a separate local reader

Status: Accepted (2026-11-20, the person chose this option for OQ-1)

## Context

The dashboard is the answer surface for a run. A trail can start from a thought or a term when no run exists. The person also wants to read trails while no decision waits. [CEM-R2](../spec/co-evolution-map.md#cem-r2--follow-a-term-in-either-direction)

## Decision

Provide a separate local reader for trails. The reader reads project documents and run records. It never writes run records and never answers a decision. When a trail reaches an open decision, the reader links to that decision on the dashboard.

## Alternatives considered

A dashboard view puts the trail beside the decision. It needs a run and a running server. A reader plus a dashboard view gives two surfaces to build and keep in step.

## Consequences

The person can explore the map between runs. Answers stay on one surface, so the signing path does not change. The reader is a second program to build and test. It uses the Python standard library and loopback access only. It never reads `human.key` or the server token. [CEM-R11](../spec/co-evolution-map.md#cem-r11--preserve-execution-and-signing-rules) · [CEM-R12](../spec/co-evolution-map.md#cem-r12--preserve-local-access-boundaries)

## Principles served

P10 keeps one answer surface for the person. P12 keeps the reader as a view, not a verdict. [Principles](../../skills/graph-flow/references/principles.md)
