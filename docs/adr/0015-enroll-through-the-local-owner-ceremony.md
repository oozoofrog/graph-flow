# 0015 Enroll through the local owner ceremony

Status: Accepted (2026-11-20, design review in PR #7)

## Context

The owner and agents share an OS account. Under threat model A, agents follow the rules even when task data contains injected instructions.
The human-terminal rule already reserves local signing for the owner. Agents never use that rule to impersonate the owner. [Human identity](../../skills/graph-flow/SKILL.md#human-identity) · [Terminal check](../../skills/graph-flow/scripts/graphflow/cli.py)

Comparing two displayed values allowed approval without entering anything from the candidate device.

## Decision

Use the local owner ceremony for first enrollment, additional devices, replacement, and recovery on POSIX hosts without administrator rights.
Require `GF_ROLE=human`, `GF_HUMAN_TERMINAL=1`, and a local TTY on standard input.
Agents never run the ceremony or read, relay, or redeem enrollment codes, reverse codes, or ceremony output.

1. Start the local owner ceremony and select the operation.
2. Read its single-use enrollment code. It contains at least 40 random bits and expires within five minutes.
3. Enter that code on the candidate device at the configured HTTPS origin.
4. The remote surface atomically consumes the code and reserves the request for one candidate session.
5. The candidate device registers a new passkey and proves possession with a fresh assertion.
6. The candidate device displays the reverse code derived from that request and proven credential under RA-R4.
7. Read the redemption time and client user agent in the ceremony terminal.
8. Type the candidate device's reverse code into that terminal before the original request expires.

The terminal never shows the expected reverse code. The reverse code has at least eight base32 characters and 40 bits of keyed output.
Activate exactly the credential bound to the successful comparison.
Charge redemption and reverse-code entry against the same install-wide enrollment budget. Discard expired, replayed, and substituted credentials.
Keep both codes out of logs, URLs, project files, and agent-visible output.
Revoke a lost device before activating its replacement. Preserve prior attribution and run key pins.
A missing registry never authorizes a device. Require local recovery after registry loss.
Keep opt-in local. Permit the minimal remote device list and targeted revocation under RA-R8.
[RA-R1](../spec/remote-approval.md#ra-r1--require-owner-opt-in) · [RA-R4](../spec/remote-approval.md#ra-r4--enroll-through-the-local-owner-ceremony) · [RA-R8](../spec/remote-approval.md#ra-r8--attribute-and-revoke-devices) · [RA-R10](../spec/remote-approval.md#ra-r10--fail-closed-and-recover-locally)

## Alternatives considered

Automatic first enrollment lets a remote visitor claim an empty install. A local dashboard token carries no enrollment authority.
A separate OS principal for both signing and enrollment could protect against hostile same-account writes. That hardening is future work.

## Consequences

The owner can recover locally after losing every enrolled device. The supported agent interfaces grant no authority to answer, enroll, revoke, or recover.
This protection matches the local signer. The shared account can read `human.key`.
A hostile process with that account can edit code or registry files and bypass the ceremony.

## Principles served

P6 makes the ceremony testable. P10 reserves administration for the owner and adds no required run question. [Principles](../../skills/graph-flow/references/principles.md)
