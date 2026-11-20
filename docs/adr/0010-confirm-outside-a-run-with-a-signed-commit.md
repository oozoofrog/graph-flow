# 0010 Confirm outside a run with a signed commit

Status: Accepted (2026-11-20, the person chose this option for OQ-6)

## Context

The reader works when no run exists (ADR 0007). Authored items live in Git (ADR 0008). The signed human answer exists only inside a run. Agents commit to the same repositories as the person. [ADR 0003](0003-keep-link-confirmation-with-the-person.md)

## Decision

Outside a run, a commit signed with the person's own key confirms an item. The commit changes the item status to confirmed. `gf map check` verifies the signature against an allowed-signers list that the person keeps. Inside a run, the existing signed answer still confirms an item.

## Alternatives considered

A free question inside a run uses the existing signed path. It needs a run for each confirmation. A person-only terminal command works without a run. It adds a second human answer path that needs its own security review.

## Consequences

The answer signing format does not change. The person sets up a signing key once. Agent sessions never get access to that key. Use a key that needs a passphrase or a touch on each use. An agent commit that changes an item to confirmed fails `gf map check`. As of 2026-11-20 the person's global Git configuration signs no commits. A design review found that the trust root is not yet defined. Same-account agents could change a signer list or use a key without a passphrase. OQ-8 sets the trust root. Until then, no out-of-run signature confirms an item. [OQ-8](../spec/co-evolution-map.md#open-questions)

## Principles served

P6 makes confirmation a mechanical signature check. P10 keeps the person as the only confirmer. [Principles](../../skills/graph-flow/references/principles.md)
