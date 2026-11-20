# 0017 Confirm out-of-run items in the next run

Status: Accepted (2026-11-20, the person chose this option for map OQ-8 and remote OQ-4)

This record supersedes [ADR 0010](0010-confirm-outside-a-run-with-a-signed-commit.md).

## Context

The person can select an authored item while no run exists. The reader can store a proposal at its exact revision.
The existing human answer path verifies a signed decision inside a run. Plan approval and run close already provide human slots. [ADR 0005](0005-use-existing-human-slots-for-co-work.md)

A leader-authored free question could describe different content from the selected revision.

## Decision

Pin the selected file's exact Git revision and SHA-256 content hash in the project queue.
At the next plan approval or run close, the leader runs `gf map present`. The leader supplies no text.
Graph-flow reads the pinned file verbatim from Git and uses a fixed template in the person's language.
Issue the decision with `issuer: map` and `purpose: map_confirmation`. Bind the item IDs and content hashes in `evidence`.
Keep `gf decide ask` free-only. The new purpose is a field value in the existing HMAC v3 format.
On each surface, offer confirm, keep pending, and reject for every item. Leave confirmation unselected.
Mark a changed file `changed after selection`. Refuse confirmation even if the change occurs after display.
The surface constructs canonical answer lines for the selected actions and exact revisions under CEM-R6.
The map reads only that form from the verified decision. Keep rejected revisions in history.
At run close, record a supersede for any unanswered batch and leave its eligible revisions pending.
Skipping adds no waiting state or required answer. A change to a cited source still withdraws an unconfirmed proposal.
[CEM-R3](../spec/co-evolution-map.md#cem-r3--keep-link-provenance) · [CEM-R6](../spec/co-evolution-map.md#cem-r6--fit-co-work-into-existing-human-slots) · [RA-R7](../spec/remote-approval.md#ra-r7--limit-map-confirmation-authority)

## Alternatives considered

The signed commit in ADR 0010 needs a separate owner key and signer authorization. A standalone signing command adds another human answer path.
General plan approval records no choice for an individual item revision.

## Consequences

Without a later run, the revision remains pending. Selection creates no decision outside a run.
The map needs no Git signing key. The existing signer and HMAC v3 format serve both local and remote in-run answers.
Verification needs the original install key, run records, and project location.
Name each affected item as `unverifiable here` when that context is unavailable.
A demonstrably invalid claim fails the map check. [CEM-R14](../spec/co-evolution-map.md#cem-r14--turn-confirmed-links-into-checks)

## Principles served

P6 makes revision matching mechanical. P10 allows one voluntary answer at an existing human slot without adding a required stop. [Principles](../../skills/graph-flow/references/principles.md)
