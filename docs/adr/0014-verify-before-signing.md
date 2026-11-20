# 0014 Verify each remote answer before signing

Status: Accepted (2026-11-20, design review in PR #7)

## Context

The local dashboard passes the displayed identity to the existing answer transaction.
The transaction checks the question and evidence before signing. HMAC v3 already binds the outcome and exact answer text.
A read session alone gives no evidence that the owner chose the displayed answer. [Decisions](../../skills/graph-flow/scripts/graphflow/decisions.py) · [Core](../../skills/graph-flow/scripts/graphflow/core.py)

The review identified missing checks for discoverable credentials, counters, backup flags, and unsolicited extension output.

## Decision

Use a WebAuthn passkey with user verification for every remote answer.
After the owner selects an outcome, show the final choice and answer text.
Issue an answer challenge for the complete RA-R5 context. Discard the challenge after any edit.
Verify the fresh assertion against that stored context. Consume the challenge once across concurrent requests.
Recheck device authorization through the existing answer transaction's commit. If the transaction refuses, require a fresh challenge.
Keep the existing signer inputs, source, verifier, and gate rules. [RA-R5](../spec/remote-approval.md#ra-r5--authenticate-each-answer) · [RA-R6](../spec/remote-approval.md#ra-r6--preserve-the-run-answer-contract)

Use a project-owned verifier with only the Python standard library. Limit the first profile to ES256 on P-256.
Accept only the `none` attestation format with an empty statement.
One owner authorizes each enrollment. The verifier checks possession through a fresh assertion. Hardware provenance serves no authorization decision here.
Register discoverable credentials and request assertions without a credential list. Match the returned owner handle and credential ID.
Apply RA-R12 to credential uniqueness, counter handling, backup flags, origin checks, bounded parsing, and secret comparisons.
Request no extensions. Accept only the specified registration `credProtect` output and ignore its value for authorization.
Include real platform and roaming authenticator fixtures in release qualification.
Qualify the exact verifier revision against public vectors and obtain independent cryptographic review before release enablement. Request that review in a public issue when the verifier code exists. [RA-R12](../spec/remote-approval.md#ra-r12--verify-the-passkey-profile) · [RA-R13](../spec/remote-approval.md#ra-r13--qualify-the-verifier-before-release)

Use the same in-run answer path for an explicit map confirmation. [RA-R7](../spec/remote-approval.md#ra-r7--limit-map-confirmation-authority) · [ADR 0017](0017-confirm-out-of-run-items-in-the-next-run.md)

## Alternatives considered

Login-only verification lets a stolen read session answer another question. One-time passwords permit real-time relay.
An external cryptographic library requires a dependency exception. Changing HMAC v3 would affect existing verifiers without solving enrollment.

## Consequences

The owner verifies each answer on the enrolled device. The authenticator signs a challenge and relies on the browser to display the answer.
The network-facing process handles `human.key` when it calls the unchanged signer.
The project maintains security-critical parsing and signature verification. Remote answering requires review evidence for the shipped verifier.
An account that can read the local signing key can bypass the remote check.

## Principles served

P6 makes refusal and release checks testable. P7 and P9 preserve evidence and lane rules.
P10 reserves the answer for the owner. [Principles](../../skills/graph-flow/references/principles.md)
