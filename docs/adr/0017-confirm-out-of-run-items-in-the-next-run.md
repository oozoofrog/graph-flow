# 0017 Confirm out-of-run items in the next run

Status: Accepted (2026-11-20, the person chose this option for map OQ-8 and remote OQ-4)

On acceptance, this record supersedes [ADR 0010](0010-confirm-outside-a-run-with-a-signed-commit.md).

## Context

The person can select an authored item while no run exists. The reader can store a proposal at its exact revision.
The existing human answer path verifies a signed decision inside a run. Plan approval and run close already provide human slots. [ADR 0005](0005-use-existing-human-slots-for-co-work.md)

## Decision

Queue each out-of-run selection as `pending confirmation` for its project and exact item revision.
At the next run’s plan approval or run close, the leader presents the pending revisions in one optional free question.
Show each item, revision, and reason. Offer confirm or leave pending for each item, with no preselected confirmations.
The person can answer locally or through the remote surface, or skip the entire question.

Include each item reference and revision in the question binding. Record each chosen item ID and revision in the existing signed answer text.
Confirm only exact revisions that the verified in-run answer selects. Preserve CEM-R3 withdrawal when a cited source changes.
A changed item needs confirmation for its new revision. A skip leaves eligible items pending and lets the run proceed. [CEM-R3](../spec/co-evolution-map.md#cem-r3--keep-link-provenance) · [CEM-R6](../spec/co-evolution-map.md#cem-r6--fit-co-work-into-existing-human-slots) · [RA-R7](../spec/remote-approval.md#ra-r7--limit-map-confirmation-authority)

## Alternatives considered

The signed commit in ADR 0010 needs a separate owner key and signer authorization. A standalone signing command adds another human answer path.
General plan approval records no choice for an individual item revision.

## Consequences

Without a later run, the revision remains pending. Selection creates no decision outside a run.
The map needs no Git signing key. The existing signer and HMAC v3 format serve both local and remote in-run answers.
A confirmed label without a verified in-run answer for the exact revision fails the map check. [CEM-R14](../spec/co-evolution-map.md#cem-r14--turn-confirmed-links-into-checks)

## Principles served

P6 makes revision matching mechanical. P10 allows one voluntary answer at an existing human slot without adding a required stop. [Principles](../../skills/graph-flow/references/principles.md)
