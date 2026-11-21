# 0019 Use a document style for the dashboard

Status: Accepted (2026-11-21, owner design review in issue #11)

## Context

The decision fixture asks whether a first-time reader can follow a guide. Small grey text carries the reason and the conditions for approval. The display face makes Korean headings hard to read. Skewed buttons, background grids and striped cards draw attention away from the question. [Issue #11](https://github.com/oozoofrog/graph-flow/issues/11)

## Decision

Use a document layout in light and dark modes. Use a body face that covers Hangul and Latin text in both headings and explanations. Separate the decision, reason, evidence and controls with spacing. Use upright buttons and plain backgrounds. Omit decorative mascot images. Use at least 16 CSS px for body text and hints, with at least 4.5:1 text contrast in both themes. Reserve visual emphasis for the question, status and actions. Keep timing data and observation diagnostics in details. [DASH-R7](../spec/dashboard.md#dash-r7--explain-graph-and-progress-terms) · [DASH-R14](../spec/dashboard.md#dash-r14--use-a-readable-document-style) · [DASH-R15](../spec/dashboard.md#dash-r15--supply-both-interface-languages)

## Alternatives considered

Keeping the dark graph theme and enlarging the headings would improve title size. It would leave the body contrast, Korean type, dense grouping and decorative controls unresolved.

## Consequences

Readers can follow the same hierarchy in either theme and language. Both themes need capture review with real Korean and English content. A machine can check labels and layout bounds. A reader judges whether the type and spacing support the decision. The dashboard follows the operating system's theme setting (DASH-R14).

## Principles served

P10 gives the owner's question and signing control visual priority. P12 connects the decision to visible evidence and the next action. [Principles](../../skills/graph-flow/references/principles.md)
