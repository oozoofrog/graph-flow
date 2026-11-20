# 0002 Derive the map from source records

Status: Accepted (2026-11-20, design review in PR #6)

## Context

Plans already name requirements. Submissions name changed files. Constraint records identify the evidence behind a lesson. These sources can disagree across revisions. A person can also see a connection that no source records. Bush describes how a reader connects items into a trail. [Bush](https://www.w3.org/History/1945/vbush/vbush7.shtml)

## Decision

Derive map nodes and explicit links from revision-specific source references. Store new authored material once. Store a reference to an existing source when it already contains the material. Derive reverse lookups and counts from these sources. [CEM-R1](../spec/co-evolution-map.md#cem-r1--rebuild-from-sources) · [CEM-R2](../spec/co-evolution-map.md#cem-r2--follow-a-term-in-either-direction)

## Alternatives considered

An independent graph database could support edits to copied plan facts. It would need a rule for conflicts with approved plans. A map limited to existing records would lose a person's new interpretation.

## Consequences

Rebuilds reproduce old trails while their sources remain available. A missing source leaves a visible gap. An old file path never silently starts pointing at new evidence. [ADR 0008](0008-keep-authored-material-in-project-documents.md) sets the location of authored material.

## Principles served

P3 reserves execution dependencies for named inputs. P6 favors mechanical joins. P12 preserves the source of a recorded result. [Principles](../../skills/graph-flow/references/principles.md)
