# 0004 Use the domain glossary as an entry point

Status: Accepted (2026-11-20, design review in PR #6)

## Context

A person often remembers the name of a real task before they remember a file path. Evans describes a shared language for the domain model. A definition gives both participants a way to ask whether they mean the same thing. [Evans](https://www.domainlanguage.com/ddd/reference/) Tan reports that a user-facing feature map "gives you some shared vocabulary" for people and agents. [Tan, transcript (machine-generated)](https://ai.engineer/api/code/reading-download/transcripts/lauren-tan.md)

## Decision

Make each Domain term a map node with a definition, domain, and stable identity. Start a trail from a Domain term or from any other map node. Show incoming “uses term” links at the definition. Preserve the term identity across a name change that keeps its meaning. An agent can propose a Domain term candidate from code or conversation. The candidate stays unconfirmed until the person confirms or rewrites its definition. [CEM-R15](../spec/co-evolution-map.md#cem-r15--propose-term-candidates) [CEM-R2](../spec/co-evolution-map.md#cem-r2--follow-a-term-in-either-direction)

## Alternatives considered

A file tree places source paths first and omits the person's vocabulary. A text tag can group results but gives no account of its meaning.

## Consequences

One definition can lead to a requirement, its plan node, and a submitted file. Two domains can use the same name for different concepts. A change in meaning needs a distinct definition revision. A reader can still start from an unfamiliar file and recover its domain context.

## Principles served

P3 keeps conceptual links outside the execution graph. P6 supports exact term lookups. P11 makes lessons discoverable through their domain terms. [Principles](../../skills/graph-flow/references/principles.md)
