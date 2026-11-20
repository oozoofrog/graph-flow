# 0015 Enroll through the local owner ceremony

Status: Proposed

## Context

The owner and agents share an OS account. Under threat model A, agents follow the rules even when task data contains injected instructions.
The human-terminal rule already reserves local signing for the owner. Agents never use that rule to impersonate the owner. [Human identity](../../skills/graph-flow/SKILL.md#human-identity) · [Terminal check](../../skills/graph-flow/scripts/graphflow/cli.py)

## Decision

Use the local owner ceremony for first enrollment, additional devices, replacement, and recovery. It works on any OS without administrator rights.
The terminal requires `GF_ROLE=human`, `GF_HUMAN_TERMINAL=1`, and a TTY on standard input. Agents never run the ceremony.

1. The owner starts the local owner ceremony and selects the operation.
2. The terminal displays a random, single-use enrollment code valid for at most five minutes.
3. The owner enters the code on the candidate device at the configured HTTPS origin.
4. The server consumes the code and reserves that request for the candidate session in one operation.
5. The device registers its new passkey and answers a fresh assertion challenge with that passkey.
6. The owner compares the credential fingerprint on both screens and approves the match in the terminal.
7. The server activates only the approved credential before the request expires.

Bind the request to the install, operation, candidate session, credential ID, and public key as each becomes available.
Keep the code out of logs, URLs, APIs that display codes, and project files.
For recovery, revoke the lost device before activating its replacement. Preserve historical attribution and run key pins.
A missing or empty registry never authorizes first use. After registry loss, invalidate old authorizations and repeat local recovery.
Keep opt-in, device listing, and revocation local. [RA-R1](../spec/remote-approval.md#ra-r1--require-owner-opt-in) · [RA-R4](../spec/remote-approval.md#ra-r4--enroll-through-the-local-owner-ceremony) · [RA-R8](../spec/remote-approval.md#ra-r8--attribute-and-revoke-devices) · [RA-R10](../spec/remote-approval.md#ra-r10--fail-closed-and-recover-locally)

## Alternatives considered

Automatic first enrollment lets a remote visitor claim an empty install. A local dashboard token carries no enrollment authority.
A separate OS principal for both signing and enrollment could protect against hostile same-account writes. That hardening is future work.

## Consequences

The owner can recover locally after losing every enrolled device. The supported agent interfaces grant no authority to answer, enroll, revoke, or recover.
This protection matches the local signer. The shared account can read `human.key`.
A hostile process with that account can edit code or registry files and bypass the ceremony.

## Principles served

P6 makes the ceremony testable. P10 reserves administration for the owner and adds no required run question. [Principles](../../skills/graph-flow/references/principles.md)
