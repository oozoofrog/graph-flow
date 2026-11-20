# Remote approval surface

Status: Draft

## Purpose and scope

An owner away from the install can read a pending question, inspect its evidence, and answer from an enrolled device.
Each install serves one owner. Teams, remote user roles, multi-person accounts, shared approvals, and remote execution are outside scope.
The design covers plan approvals, gate questions, and eligible map confirmations. It does not expose the entire dashboard. [Issue 4](https://github.com/oozoofrog/graph-flow/issues/4)

## Threat model A

Agents share the owner's OS account and follow the agent rules. They can make mistakes or receive injected instructions.
Through supported agent interfaces, they cannot answer, enroll a device, revoke a device, or recover access.
The local owner ceremony trusts the same human-terminal rule as the local signer.
A hostile process under that account can read `human.key`, edit the registry, or replace the verifier.
It can bypass both the local signer policy and remote verification.
Isolating the signer and enrollment under a separate OS principal is future work outside this design. [Human identity](../../skills/graph-flow/SKILL.md#human-identity)

## Glossary

| Term | Meaning |
| --- | --- |
| Owner | The person who controls one graph-flow install and answers its questions. |
| Device | One enrollment with its own credential and revocable identifier. A device label does not identify physical hardware. |
| Owner factor | A WebAuthn passkey that requires user verification. |
| Enrollment | The procedure that associates a device credential with the owner of this install. |
| Local owner ceremony | An owner action on a local TTY with `GF_ROLE=human` and `GF_HUMAN_TERMINAL=1`. |
| Remote surface | The dedicated HTTPS interface for reading eligible questions and submitting answers. |
| Read session | A time-limited credential for reading eligible questions after the server verifies the owner factor. |
| Displayed identity | The existing decision ID, question hash, and artifact hashes for the decision the owner saw. |
| Answer challenge | A single-use server request for fresh owner factor verification against one displayed answer. |

## Sources and new records

| Information | Source and rule |
| --- | --- |
| Local dashboard | `serve` binds IPv4 loopback. The server checks the exact local Host. A fresh token in `server.json` grants local answer power. [Server](../../skills/graph-flow/scripts/graphflow/server.py) |
| Run decision | Read the registered project, run, issuer, decision, displayed identity, and eligible outcomes from the existing decision path. [State](../../skills/graph-flow/scripts/graphflow/state.py) · [Decisions](../../skills/graph-flow/scripts/graphflow/decisions.py) |
| Run answer | Keep `source: "dashboard"`, the existing answer event, and the frozen HMAC v3 binding. Gate code consumes verified evidence. [Core](../../skills/graph-flow/scripts/graphflow/core.py) · [Records](../../skills/graph-flow/references/records.md) |
| Remote setup | Store the opt-in, bind address, origin, relying party ID, and transport settings outside projects and runs. |
| Device registry | Keep the install ID, stable device ID, owner label, credential ID and public key, enrollment time, and revocation time. Preserve revoked IDs. |
| Read session and answer challenge | Track the device, purpose, expiry, and server instance. Record the immutable answer context for each answer challenge. |
| Attribution | Keep the device ID, acceptance time, and exact answer reference outside the signed payload. Keep factor secrets and session credentials out of attribution. |
| Map confirmation | Selection outside a run queues an item revision. Only a verified in-run answer can confirm it. [Map spec](co-evolution-map.md) · [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md) |

## Requirements

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

[RFC2119]: https://www.rfc-editor.org/rfc/rfc2119
[RFC8174]: https://www.rfc-editor.org/rfc/rfc8174

### RA-R1 — Require owner opt-in

New and upgraded installs MUST start with remote access off unless the owner previously enabled it.
Only the local owner ceremony MAY enable remote access.
Ordinary dashboard startup MUST preserve its loopback bind, token scope, and Host checks.
The remote module MUST use only the Python standard library under the current dependency rule. [ADR 0012](../adr/0012-keep-remote-access-opt-in.md)

Verify: Inspect listeners and imports for fresh, upgraded, and explicitly enabled fixtures. Open the ordinary dashboard in each fixture. Expect only the configured remote fixture to accept external requests.

### RA-R2 — Constrain the network boundary

The remote surface MUST use one configured HTTPS origin and one explicit bind address.
It MUST refuse wildcard binds, plaintext external traffic, and fallback to another interface.
Each request MUST have exactly one Host matching the configured authority.
Each remote mutation MUST use POST and carry exactly one Origin matching the configured origin.
Only an explicitly configured proxy MAY terminate external TLS under the protected backend conditions in ADR 0016. [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Test direct and proxy fixtures with matching and conflicting authorities. Reject missing, duplicate, null, or foreign Origin on mutations. Try plaintext, forged forwarding headers, wildcard binds, and a missing interface. Expect no private response or mutation.

### RA-R3 — Restrict remote reads and operations

The server MUST verify a fresh RA-R12 assertion from an active device before issuing a read session.
The remote surface MUST require a valid read session for question data, including titles, counts, and attachments.
It MUST expose only open plan approvals, gate-issued questions, and explicit in-run map confirmations with their referenced evidence.
Eligibility MUST come from source records. A free question’s wording MUST NOT grant approval authority.
It MUST enforce the existing file restrictions and exclude credentials, private records, and unrelated evidence.
Local tokens, network membership, chat, and proxy identity MUST grant no remote read or answer authority.
Private responses MUST disable caching. The remote surface MUST serve question content as data without executing it.
The remote surface MUST exclude local dashboard routes, key repinning, administrative actions, general run history, and execution controls. Device revocation under RA-R8 is the only remote administrative action. [ADR 0012](../adr/0012-keep-remote-access-opt-in.md)

Verify: Compare anonymous, local-token, and enrolled reads. Expire the read session and expect no question data. Request another question’s file, a private record, and an unregistered project. Check cache headers and render instruction-shaped text as inert content. Exercise local-only routes on the remote listener. Expect no disclosure or mutation.

### RA-R4 — Enroll through the local owner ceremony

Supported agent interfaces MUST NOT authorize answers, enrollment, revocation, or recovery.
First enrollment, additional enrollment, replacement, and recovery MUST start with the local owner ceremony.
The ceremony MUST work on any OS without administrator rights.
The ceremony MUST issue an unpredictable, single-use enrollment code that expires within five minutes.
The server MUST bind the code to one install, operation, and enrollment request.
On redemption, the server MUST atomically consume the code and bind that request to one candidate session.
The candidate device MUST register its new passkey and prove possession through a fresh WebAuthn assertion under RA-R12.
The local owner ceremony MUST require the owner to compare both credential fingerprints and approve the match before activation.
The request MUST expire with the code. The server MUST reject expiry, replay, and credential substitution before activation.
A missing or empty registry MUST NOT grant enrollment authority. [ADR 0015](../adr/0015-enroll-through-the-local-owner-ceremony.md)

Verify: Exercise first enrollment and recovery as an ordinary user on each supported OS. Omit each terminal condition separately.
Request all four operations through supported agent interfaces, including with instruction-shaped input. Expect refusal.
Try enrollment with only a local token or an empty or missing registry. Expect refusal.
Race two redemptions of one code. Expect one candidate session. Try redemption at expiry. Also try activation at expiry after timely redemption. Expect both to fail.
Substitute the public key or omit the possession proof or local approval. Expect no active device.
Complete the ceremony with a fresh code. Expect only the approved credential to become active.

### RA-R5 — Authenticate each answer

Each answer challenge MUST contain an unpredictable server nonce and use a purpose distinct from enrollment and read session creation.
After the owner finalizes the answer, the server MUST verify a fresh WebAuthn assertion with user verification under RA-R12.
The answer challenge MUST bind the install, device, read session, project, run, displayed identity, outcome, and exact answer text.
The server MUST enforce a finite expiry and consume each successful proof once across concurrent requests.
An expired read session MUST invalidate its answer challenges.
The server MUST keep session credentials and owner factor proofs out of URLs, logs, and run events.
A read session or previous answer proof MUST NOT authorize another answer. [ADR 0014](../adr/0014-verify-before-signing.md)

Verify: Vary each bound field individually. Clear the user verification flag and expect refusal. Advance a test clock past expiry. Race identical submissions and reuse the proof with another challenge. Expect one acceptance only for the original valid submission.

### RA-R6 — Preserve the run answer contract

Immediately before signing, the server MUST recheck device authorization and submit the displayed identity to the existing transactional answer path.
That path MUST reject stale, superseded, legacy, moved, changed, already answered, or key-mismatched decisions under its existing rules.
For identical signing inputs, remote and local dashboard answers MUST produce identical HMAC v3 bytes.
Only plan and gate code MAY issue binding run approvals. An answer MUST NOT execute work or issue a verdict. [ADR 0014](../adr/0014-verify-before-signing.md)

Verify: Compare fixed-key signature vectors and verifier results. Change evidence between display and submission. Race a local answer against a remote answer. Check each refusal fixture, event count, and subsequent gate result against the local baseline.

### RA-R7 — Limit map confirmation authority

An out-of-run selection MUST queue the exact item revision as `pending confirmation`.
At the next run’s plan approval or run close, the leader MUST present pending revisions in one optional free question.
The question MUST identify each revision and offer separate choices for each item.
The owner MUST be able to answer locally or through the remote surface.
Only a verified in-run answer that explicitly selects the exact revision MAY confirm that item.
Skipping the question MUST add no required answer, wait, or blocking state.
The map MUST reject general plan approval and signed Git commits as confirmation evidence. [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md)

Verify: Queue two revisions outside a run. Expect pending status and no decision until the next run.
Repeat at plan approval and run close, locally and remotely. Confirm one item and leave the other pending.
Change the confirmed revision and expect the new revision to remain unconfirmed. Try a signed commit and general plan approval alone.
Expect neither to confirm an item. Skip the batch and compare required stops and readiness with an empty queue.

### RA-R8 — Attribute and revoke devices

The install MUST restrict device listing to the local owner ceremony.
The owner MUST be able to revoke a device locally through that ceremony.
The owner MAY also revoke a device from another active device on the remote surface.
A remote revocation MUST require a fresh RA-R12 assertion bound to that revocation.
The remote surface MUST NOT enroll, recover, or reactivate a device.
An enrollment MUST belong to exactly one install. Revoked identifiers MUST NOT return to service.
After revocation commits, the server MUST reject that device’s reads, outstanding challenges, and new answers.
Each accepted remote answer MUST have exactly one durable attribution linked to its committed answer.
Recovery after interruption MUST preserve this relationship without attributing a local answer to a remote device.
The verifier MUST ignore attribution when deciding whether an answer is valid. [ADR 0013](../adr/0013-attribute-answers-to-device-enrollments.md)

Verify: Enroll two devices with identical labels. Try revocation through agent interfaces and through a read session alone. Expect refusal. Revoke one device from the other with a fresh assertion while the first device's answer waits. Expect the waiting answer to fail. Replay that revocation assertion and expect refusal. Try enrollment and reactivation on the remote surface and expect refusal. Interrupt writes at each durability boundary. Retry after restart and compare answer references, device IDs, and verification results.

### RA-R9 — Bound remote authentication attempts

Before expensive authentication work, the server MUST enforce finite limits per source, per known device, and across the install.
Limits MUST cover enrollment attempts, read session creation, and answer proofs.
Each limit MUST have a finite cooldown that survives restart and leaves local answering available.
Unauthenticated failures MUST NOT permanently revoke a device or disclose whether it exists. [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Configure a three-attempt limit and a 60-second cooldown for each limit in isolation. Vary sources and device identifiers. For each limit, submit three invalid attempts. Reject attempt four, including after restart. Advance the clock past cooldown and accept a valid proof.

### RA-R10 — Fail closed and recover locally

Disabling remote access or restarting the server MUST invalidate all read sessions, answer challenges, and pending enrollment requests.
Network or TLS failure MUST leave local answering available without accepting remote plaintext.
Recovery MUST use the local owner ceremony under RA-R4 and revoke the lost device before activating its replacement.
It MUST preserve prior answers, key pins, and device history.
After registry loss, the install MUST invalidate previous device authorizations and require local recovery before accepting remote answers. [ADR 0015](../adr/0015-enroll-through-the-local-owner-ceremony.md) · [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Disable and re-enable remote access. Restart with one pending request of each kind. Disconnect the route and use an expired certificate with a validating client. Remove the registry and attempt an old assertion. Expect refusal. Recover a lost device locally. Compare prior answers, key pins, and old credential rejection.

### RA-R11 — Preserve the question on a phone

The remote surface MUST show the question, reason, choices with consequences, history, verified facts, then files and detailed evidence.
Phone controls MUST keep each choice and consequence reachable without hiding evidence.
The surface MUST preserve existing reading gates, required correction text, and neutral choices.
Only explicit submission after owner factor verification MAY record the answer. [Dashboard question screens](../../skills/graph-flow/references/dashboard.md#question-screens-q1q6)

Verify: Inspect plan, hold, authorization, and missing-evidence fixtures at 320 and 390 CSS pixels. Check reading order, scrolling, focus, and enabled actions. Open evidence, cancel authentication, and navigate back. Expect no answer. Human exercise: read a long choice and its consequence on a phone.

### RA-R12 — Verify the passkey profile

The project MUST own the WebAuthn verifier and use only the Python standard library.
The verifier MUST accept only ES256 (COSE algorithm `-7`), with an EC2 public key on P-256 and SHA-256.
It MUST validate coordinate lengths, field bounds, curve membership, strict DER signature encoding, and ECDSA scalar bounds.
For registration and assertions, it MUST check the ceremony type, fresh challenge, exact HTTPS origin, and relying party ID hash.
The verifier MUST reject cross-origin ceremonies and require both user presence and user verification.
For assertions, the verifier MUST match the credential ID to the expected enrollment.
It MUST verify the signature over authenticator data concatenated with the SHA-256 digest of the original client data bytes.
Registration MUST accept only attestation format `none` with an empty attestation statement.
The verifier MUST reject every unsupported algorithm, attestation format, and unchecked extension in client or authenticator output.
The initial profile MUST request and accept no extensions.
The verifier MUST use constant-time comparisons for secret values, including session tokens and enrollment codes.

The CBOR parser MUST accept only definite-length maps, integers, byte strings, and text strings needed by this profile.
It MUST reject inputs above 16 KiB, nesting beyond four containers, maps above 16 entries, or strings above 4 KiB.
It MUST enforce bounds before allocation and reject duplicate keys, truncation, invalid text, and trailing bytes.

Verify: Accept valid registration and assertion fixtures. Change each checked value separately and expect refusal.
Try another algorithm, curve, attestation format, and client or authenticator extension. Reject each case.
Try a nonempty attestation statement with format `none`. Expect refusal.
Exercise each parser limit at its boundary and one unit above. Reject malformed DER, invalid points, and out-of-range scalars.
Inspect every secret comparison for a constant-time primitive such as `hmac.compare_digest`. [WebAuthn ceremonies](https://www.w3.org/TR/webauthn-3/#sctn-rp-operations) · [ADR 0014](../adr/0014-verify-before-signing.md)

### RA-R13 — Qualify the verifier before release

The project MUST validate the verifier against public WebAuthn registration and assertion vectors and Wycheproof P-256/SHA-256 ECDSA vectors.
The tests MUST cover valid, negative, and malformed cases. They MUST record vector revisions and expected results.
An independent cryptographic reviewer MUST review the exact verifier revision, including parsing, protocol checks, and secret comparisons.
A release MUST prevent remote answering until vector results pass and the independent review approves that revision. The project SHOULD request the review in a public issue when the verifier code exists. [ADR 0014](../adr/0014-verify-before-signing.md)

Verify: Replay the pinned vectors and compare each result with its expected profile outcome.
Try enabling remote answering with a failed vector, missing approval, and approval for another revision.
Expect refusal in each release fixture. Check that explicit opt-in still applies to a qualified revision.
[Public WebAuthn fixtures](https://github.com/Yubico/java-webauthn-server/blob/main/webauthn-server-core/src/test/scala/com/yubico/webauthn/RegistrationTestData.scala) · [Wycheproof DER vectors](https://github.com/C2SP/wycheproof/blob/main/testvectors_v1/ecdsa_secp256r1_sha256_test.json)

### RA-R14 — Guide certificate setup

The project MUST publish a certificate setup guide for the remote surface.
The guide MUST cover at least one private-network method and one public-domain method.
For each method, the guide MUST show how to obtain a browser-trusted certificate for the configured hostname.
It MUST show how to point the remote surface at the certificate and key, and how to check expiry.
It MUST show how to confirm from a phone that the origin opens without a certificate warning.
The guide MUST state that a self-signed certificate does not work on a typical phone without a trusted root.
A release MUST NOT enable remote answering without this guide. [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Follow each method in the guide on a clean fixture. Open the origin from a phone browser and expect no certificate warning. Register a passkey and answer one question. Repeat with a self-signed certificate and expect the documented failure. Check that a release without the guide refuses remote answering.

## Security and invariants

| Requirements | Principles and skill rules |
| --- | --- |
| RA-R1–RA-R4, RA-R9, RA-R10 | P5, P10. Owner setup controls remote reachability. Authentication refusals protect the existing human decision point. Agents keep their existing roles. |
| RA-R4–RA-R7, RA-R11 | P1, P6, P7, P9, P10. Mechanical checks enforce who can answer. Plan and gate code own binding questions, evidence order, and lane approvals. |
| RA-R6, RA-R7 | P2, P3, P4, P8. Answers preserve attempt limits, plan dependencies, owned paths, and scoped rejection. |
| RA-R6, RA-R8, RA-R10 | P11, P12. Existing verdicts and trace still drive learning and measurement. Device attribution supplies no gate or learning evidence. |
| RA-R12, RA-R13 | P6, P10. Verifier checks and release qualification protect owner authorization before the existing signer runs. |
| RA-R7, RA-R11 | P10. Only a decision or approval reaches the owner. Remote authentication adds no run question or required stop. |

Agents never change `GF_HOME`, set `GF_ROLE=human` or `GF_HUMAN_TERMINAL`, run `gf decide answer`, or use either dashboard API.
They never handle `human.key`, read `server.json`, or edit run files directly.
They never start or configure the remote surface. They never enroll or revoke devices or recover access. [Human identity](../../skills/graph-flow/SKILL.md#human-identity) · [Principles](../../skills/graph-flow/references/principles.md) · [Leader](../../skills/graph-flow/references/leader.md)

The design trusts the owner device, the verifier, and the local owner ceremony under threat model A.
A passkey authenticates the challenge. The owner relies on the displayed question and answer text when choosing what to sign.
Public exposure can reveal service availability or exhaust capacity. Revocation cannot retract evidence already displayed.

## Decided questions

| ID | Owner decision (2026-11-20) | Record |
| --- | --- | --- |
| OQ-1 | Use an ES256 WebAuthn passkey with user verification for each remote answer. The project owns the standard-library-only verifier. | [ADR 0014](../adr/0014-verify-before-signing.md) |
| OQ-2 | Use threat model A and the local owner ceremony. Pair a single-use enrollment code with proof of the new passkey. | [ADR 0015](../adr/0015-enroll-through-the-local-owner-ceremony.md) |
| OQ-3 | Ship direct TLS first. Add proxy support after its backend isolation and origin checks pass the same refusal fixtures. | [ADR 0016](../adr/0016-assign-tls-responsibility.md) |
| OQ-4 | Queue the selection. Confirm its exact revision through one optional free question in the next run. | [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md) |

## Open questions

None.
