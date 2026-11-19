# 0006 Keep one English reference and a Korean reading copy

Status: Proposed

## Context

The person has chosen English for the canonical documents and Korean for discussion. Agents and maintainers need a stable reference when they inspect the same obligation. Controlled technical English uses consistent terms. [ASD-STE100](https://www.asd-ste100.org/STE_faq.html)

## Decision

Write the canonical spec and ADRs in short technical English. Prepare the Korean reading copy after the English draft. Give the copy its source revision and corresponding IDs. Keep the same requirement strength in both languages. Use the person's language for map labels, explanations, options, and consequences. Preserve original terms and source text alongside translations when needed. [CEM-R4](../spec/co-evolution-map.md#cem-r4--use-the-persons-language)

## Alternatives considered

Two independent specifications would require a choice of authority whenever their meanings diverge. English alone would make Korean discussion depend on an improvised translation.

## Consequences

A Korean reader can dispute one requirement by ID. A change to the English source marks its older reading copy as stale. Translation requires a meaning check as well as an ID comparison. Missing text carries an explicit gap label.

## Principles served

P1 permits mechanical ID and revision checks. P10 supports informed decisions in the person's language. [Principles](../../skills/graph-flow/references/principles.md)
