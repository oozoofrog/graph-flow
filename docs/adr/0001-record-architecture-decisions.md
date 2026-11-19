# 0001 Record architecture decisions

Status: Proposed

## Context

A requirement describes what the person can expect. It rarely explains why a maintainer chose one architecture over another. Nygard describes how a small record can preserve that choice. [Nygard, *Documenting Architecture Decisions*](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

## Decision

Keep one numbered ADR per architectural choice. Discuss its consequences with the person before acceptance. Link the ADR to the spec wherever a requirement depends on that choice. [ADR process](README.md) · [Spec process](../spec/README.md)

## Alternatives considered

A pull request preserves the discussion, but a reader needs to find the relevant thread. Putting every alternative in the spec would make the behavior harder to find.

## Consequences

The reader can trace a requirement to its rationale after the discussion ends. The author maintains a pair of links when a new ADR replaces a choice.

## Principles served

P7 distinguishes a design rationale from evidence that the implementation works. P10 keeps design acceptance separate from run authorization. [Principles](../../skills/graph-flow/references/principles.md)
