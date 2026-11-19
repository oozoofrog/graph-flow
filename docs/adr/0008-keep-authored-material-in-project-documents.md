# 0008 Keep authored material in project documents

Status: Accepted (2026-11-20, the person chose this option for OQ-2)

## Context

The person writes thoughts, domain terms, and links. Agents propose links and conflicts. This material stays between runs and keeps its history. [ADR 0002](0002-derive-the-map-from-source-records.md)

## Decision

Store authored material as text files in Git-tracked project documents. Review changes to these files like other project changes. An agent proposal enters as an unconfirmed item. The person confirms an item as ADR 0003 describes. [ADR 0003](0003-keep-link-confirmation-with-the-person.md)

## Alternatives considered

Private local records keep personal notes on one machine. They need a separate backup and give no review history. A split between Git and local records adds a rule for each item.

## Consequences

Git keeps the history of each thought, term, and link. Agents can read the material in their briefs. Everyone with access to the repository can read it. Do not write secrets or private personal data in these files. The file layout stays open in OQ-5. Confirmation outside a run stays open in OQ-6.

## Principles served

P6 favors plain files that a program can compare. P11 keeps lessons where the next plan can read them. [Principles](../../skills/graph-flow/references/principles.md)
