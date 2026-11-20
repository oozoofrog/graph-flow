# Remote approval surface

Status: Draft

## At a glance

This summary has no force. The requirements below govern.

| ID | In one line |
| --- | --- |
| RA-R1 | Remote access is off until the owner turns it on locally. Agents cannot start it. |
| RA-R2 | One HTTPS origin and one address. No plaintext, no wildcard bind, connection and time limits. |
| RA-R3 | A verified session sees only open questions and their evidence. Revocation is the only remote admin action. |
| RA-R4 | Devices are enrolled at the local owner ceremony with a one-time code and a reverse code. |
| RA-R5 | Every answer needs a fresh passkey check bound to that exact answer. |
| RA-R6 | Remote answers use the existing signer and produce the same signature as local answers. |
| RA-R7 | Map confirmations use only the tool-issued map decision for exact revisions. |
| RA-R8 | Each remote answer records its device. The owner can list and revoke devices. |
| RA-R9 | Attempts are rate-limited without locking the owner out of local answering. |
| RA-R10 | Failures close the remote surface. Recovery happens locally. |
| RA-R11 | Phone screens keep the existing question reading order. |
| RA-R12 | The passkey verifier checks the full ES256 WebAuthn profile. |
| RA-R13 | Public test vectors and an independent review come before release. |
| RA-R14 | A certificate setup guide is a release condition. |

Decisions made by the owner: OQ-1 to OQ-4 under [Decided questions](#decided-questions), and ADRs 0012–0017 in the [ADR list](../adr/README.md).

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
| Owner | The person in the co-evolution map spec. The owner controls one install and answers its questions. |
| Device | One enrollment with its own credential and revocable identifier. A device label does not identify physical hardware. |
| Owner factor | A WebAuthn passkey that requires user verification. |
| Enrollment | The procedure that associates a device credential with the owner of this install. |
| Local owner ceremony | An owner action on a local TTY with `GF_ROLE=human` and `GF_HUMAN_TERMINAL=1`. |
| Remote surface | The HTTPS interface and its dedicated network-facing process, separate from `gf serve`. |
| Candidate session | A temporary association between one redeemed enrollment request and the browser registering one new credential. It grants no owner access. |
| Read session | A time-limited credential for reading eligible questions after the remote surface verifies the owner factor. |
| Displayed identity | The existing decision ID, question hash, and artifact hashes for the decision the owner saw. |
| Answer challenge | A single-use server request for fresh owner factor verification against one displayed answer. |

## Sources and new records

| Information | Source and rule |
| --- | --- |
| Local dashboard | `serve` binds IPv4 loopback. The server checks the exact local Host. A fresh token in `server.json` grants local answer power. [Server](../../skills/graph-flow/scripts/graphflow/server.py) |
| Run decision | Read the registered project, run, issuer, decision, displayed identity, and eligible outcomes from the existing decision path. [State](../../skills/graph-flow/scripts/graphflow/state.py) · [Decisions](../../skills/graph-flow/scripts/graphflow/decisions.py) |
| Run answer | Keep `source: "dashboard"`, the existing answer event, and the frozen HMAC v3 binding. Gate code consumes verified evidence. [Core](../../skills/graph-flow/scripts/graphflow/core.py) · [Records](../../skills/graph-flow/references/records.md) |
| Remote setup | Store the opt-in, bind address, origin, relying party ID, and transport settings outside projects and runs. |
| Device registry | Keep install ID, device ID, label, credential ID, public key, owner handle, counter, and backup flags. Record enrollment, last verified use, and revocation times. Retain revoked IDs. |
| Read session and answer challenge | Track the device, purpose, expiry, and server instance. Record the immutable answer context for each answer challenge. |
| Attribution | Keep the device ID, acceptance time, and exact answer reference outside the signed payload. Keep factor secrets and session credentials out of attribution. |
| Map confirmation | Selection outside a run queues an item revision. Only a verified in-run answer can confirm it. [Map spec](co-evolution-map.md) · [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md) |

## Requirements

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

[RFC2119]: https://www.rfc-editor.org/rfc/rfc2119
[RFC8174]: https://www.rfc-editor.org/rfc/rfc8174

### RA-R1 — Require owner opt-in

New and upgraded installs MUST keep remote access off unless the owner previously enabled it.
The remote surface MUST run in a process separate from `gf serve`.
The install MUST NOT enable or configure the remote surface outside the local owner ceremony.
Manual startup and restart MUST occur inside the local owner ceremony.
Unattended startup after reboot MUST use an OS service that the owner registers through that ceremony.
Agent-reachable commands, including `gf serve` and `--open` paths, MUST NOT start, configure, or restart the remote surface.
`gf open --stop` MUST stop only the local dashboard.
Local startup MUST preserve its loopback bind, token scope, and Host checks.
The remote surface MUST use only the Python standard library on a POSIX host.
Native Windows hosting is unsupported because the transaction store imports `fcntl`. [Store](../../skills/graph-flow/scripts/graphflow/store.py) · [ADR 0012](../adr/0012-keep-remote-access-opt-in.md)

Verify: Check fresh, upgraded, and previously enabled fixtures. Inspect imports, binds, and process IDs.
Exercise dashboard start, open, and stop with the remote process running and stopped.
Compare remote process identity, configuration, and availability before and after each command.
Simulate reboot with and without an owner-registered service. Expect unattended startup only with registration and enabled access.

### RA-R2 — Constrain the network boundary

The remote surface MUST use one configured HTTPS origin and one explicit bind address.
It MUST refuse wildcard binds, plaintext external traffic, and fallback to another interface.
Each request MUST have exactly one Host matching the configured authority.
Each remote mutation MUST use POST and carry exactly one Origin matching the configured origin.
A proxy MUST NOT terminate external TLS unless the owner configures the protected backend in ADR 0016.
The local dashboard MUST reject requests containing `Forwarded`, `Via`, or any header starting with `X-Forwarded-`.
It MUST check these headers before routing or token checks.
Header names MUST match case-insensitively, regardless of value or source. [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Test direct and proxy fixtures with matching and conflicting authorities.
Try absent, duplicate, null, and foreign origins on mutations. Test plaintext, wildcard binds, and interface loss.
Send each forwarding header to local read and answer routes with a valid local token.
Include mixed-case names and empty values. Expect refusal before disclosure or mutation.

### RA-R3 — Restrict remote reads and operations

The remote surface MUST require a fresh RA-R12 assertion from an active device before issuing a read session.
The remote surface MUST require a valid read session for every question title, count, attachment, and device list.
The remote surface MUST expose only open plan approvals, gate-issued questions, and tool-issued map confirmations with their referenced evidence.
For map confirmations it MUST require both `issuer: map` and `purpose: map_confirmation` from the decision record.
Free questions MUST remain ineligible regardless of wording, options, or claimed evidence.
The remote surface MUST enforce existing file restrictions and exclude credentials, private records, and unrelated evidence.
Local tokens, network membership, chat, and proxy identity MUST grant no remote authority.
Private responses MUST disable caching. Both answer surfaces MUST render question content as inert data.
The remote surface MUST exclude local dashboard routes, key repinning, general run history, and execution controls.
The remote surface MUST limit device management to the list and revocation in RA-R8.
Candidate sessions MUST expose only the enrollment exchange authorized by RA-R4. [ADR 0012](../adr/0012-keep-remote-access-opt-in.md)

Verify: Compare anonymous, local-token, expired-session, and enrolled reads.
Try a free question with matching map text and evidence. Vary the recorded issuer and purpose independently.
Request unrelated files, a private record, an unregistered project, and local-only routes. Expect no disclosure or mutation.
Check cache headers. Render instruction-shaped evidence as inert content.

### RA-R4 — Enroll through the local owner ceremony

Agent interfaces MUST NOT authorize answers, enrollment, revocation, or recovery.
First enrollment, additional enrollment, replacement, and recovery MUST start in the local owner ceremony without administrator rights.
The ceremony MUST issue a single-use enrollment code with at least 40 random bits from the OS generator.
The code and request MUST expire five minutes after issuance, including during activation.
The remote surface MUST bind the request to the install and operation.
Redemption MUST atomically consume the enrollment code and reserve the request for one candidate session.
The candidate device MUST register a new passkey and prove possession with a fresh RA-R12 assertion.
After proof, the candidate device MUST display a single-use reverse code of at least eight base32 characters.
The remote surface MUST generate a fresh 256-bit secret for the request.
It MUST derive the reverse code with HMAC-SHA-256 over the request ID, proven credential ID, and public key.
It MUST key this derivation with the request secret and encode the input fields unambiguously.
The reverse code MUST retain at least 40 bits of keyed hash output.
The terminal MUST show the redemption time and escaped client user agent as context.
It MUST neither show the expected reverse code nor echo input. The owner MUST type the candidate device's reverse code into that terminal.
Activation MUST verify the code against that request, session, and credential before expiry.
The ceremony MUST charge each redemption and reverse-code submission against the install-wide enrollment cap in RA-R9.
The remote surface MUST reject expiry, replay, and credential substitution.
A missing or empty registry MUST NOT grant enrollment authority. [ADR 0015](../adr/0015-enroll-through-the-local-owner-ceremony.md)

Verify: Exercise first use, addition, replacement, and recovery on supported hosts as an ordinary user.
Omit each terminal condition separately. Try an agent interface, a dashboard token, and an empty registry.
Race two redemptions. Expect one candidate session. Test expiry at redemption and at activation.
Check both displays. Try a wrong code, a second session's code, a substituted key, and missing proof.
Expect activation only after the owner enters the correct code for the proven credential.
Inspect logs and project files for either code.

### RA-R5 — Authenticate each answer

Each WebAuthn challenge MUST contain at least 256 random bits from the OS generator and expire within 120 seconds.
Each challenge MUST bind its distinct purpose and expire no later than any parent session or request.
After the owner finalizes the answer, the remote surface MUST verify a fresh WebAuthn assertion with user verification under RA-R12.
The answer challenge MUST bind the install, device, read session, project, run, displayed identity, outcome, and exact answer text.
The remote surface MUST consume each successful proof once across concurrent requests.
Read sessions MUST expire within 15 minutes of issuance without sliding renewal.
Session tokens and rate-limit cookies MUST contain at least 256 random bits from the OS generator.
Secret lookup MUST use keyed SHA-256 digests under a separate install secret and constant-time digest comparison.
The lookup rule covers enrollment codes, reverse codes, session tokens, challenge nonces, and rate-limit cookies.
Lookup tables MUST NOT retain their plaintext values.
An expired read session MUST invalidate its answer challenges.
The remote surface MUST keep session credentials and owner factor proofs out of URLs, logs, and run events.
A read session or previous answer proof MUST NOT authorize another answer. [ADR 0014](../adr/0014-verify-before-signing.md)

Verify: Vary each bound field individually. Clear the user verification flag and expect refusal. Advance a test clock past expiry. Race identical submissions and reuse the proof with another challenge. Expect one acceptance only for the original valid submission.

### RA-R6 — Preserve the run answer contract

Before signing, the remote surface MUST submit the displayed identity to the existing transactional answer path.
It MUST serialize its final authorization check and answer commit against revocation.
That path MUST reject stale, superseded, legacy, moved, changed, already answered, or key-mismatched decisions under its existing rules.
For identical signing inputs, remote and local dashboard answers MUST produce identical HMAC v3 bytes.
An issuer MUST NOT issue an execution approval unless it is plan or gate code. An answer MUST NOT execute work or issue a verdict. [ADR 0014](../adr/0014-verify-before-signing.md)

Verify: Compare fixed-key signature vectors and verifier results. Change evidence between display and submission. Race a local answer against a remote answer. Check each refusal fixture, event count, and subsequent gate result against the local baseline.

### RA-R7 — Limit map confirmation authority

Selection outside a run MUST pin the exact Git revision and SHA-256 content hash under CEM-R6.
At the next plan approval or run close, the leader MUST invoke `gf map present` once for the pending batch.
The command MUST accept no question, reason, item list, options, evidence, or answer text from the leader.
Graph-flow MUST build the question from the queue using a fixed template in the owner's language.
It MUST read each pinned file verbatim from Git and bind each item ID and content hash in `evidence`.
The decision MUST use `issuer: map` and `purpose: map_confirmation`. `gf decide ask` MUST remain free-only.
Both surfaces MUST offer confirm, keep pending, and reject for each item without preselecting confirmation.
They MUST build the exact answer text from the owner's selections using the grammar in CEM-R6.
The map MUST consume only that form from a verified in-run answer matching the decision and bound revisions.
When current bytes differ, each surface MUST mark the item `changed after selection` and refuse its confirmation.
The answer path MUST recheck the current bytes before accepting a confirmation.
Rejection MUST remain in history. Run close MUST supersede an unanswered batch under CEM-R6 without blocking work.
Map choices MUST NOT authorize plan or gate work. [CEM-R6](co-evolution-map.md#cem-r6--fit-co-work-into-existing-human-slots) · [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md)

Verify: Exercise each slot and each surface. Compare the displayed bytes, decision evidence, and exact answer for the same queue.
Try leader text, a free question, a general approval, and a signed commit. Expect no confirmation.
Change one file after display. Confirm an unchanged item and verify the changed item remains unconfirmed.
Reject one item and inspect history. Close an unanswered batch twice. Expect one supersede and no open decision.

### RA-R8 — Attribute and revoke devices

The owner MUST be able to list and revoke devices through the local owner ceremony.
A valid user-verified read session MUST permit remote listing of active devices for revocation.
The remote list MUST contain only owner labels, stable device IDs, and last verified use times.
Remote revocation MUST require another active device and a fresh RA-R12 assertion.
The assertion MUST bind the install, acting device, read session, target device ID, and revocation purpose.
The remote surface MUST NOT initiate enrollment, recovery, or reactivation.
Each enrollment MUST belong to one install. Revoked identifiers MUST NOT return to service.
Once revocation commits, the remote surface MUST reject that device's reads, outstanding challenges, and new answers.
Each accepted remote answer MUST have exactly one durable attribution linked to its committed answer.
Recovery after interruption MUST preserve that link without attributing a local answer to a device.
The verifier MUST ignore attribution when checking answer validity. [ADR 0013](../adr/0013-attribute-answers-to-device-enrollments.md)

Verify: Enroll two devices with identical labels. Check list fields with a valid session. Expire it and expect no list.
Try agent revocation, a read session alone, self-revocation, and a changed target. Expect refusal.
Revoke one device from the other while its answer waits. Expect refusal after revocation commits. Replay the revocation proof.
Interrupt each write boundary. Compare answer references, device IDs, and verification after restart.

### RA-R9 — Bound remote authentication attempts

The remote surface MUST admit at most 32 concurrent connections before allocating workers.
Worker threads MUST perform TLS handshakes with a five-second absolute deadline.
Each worker MUST finish reading HTTP headers within five seconds and the body within ten further seconds.
Excess or timed-out connections MUST close promptly. The remote surface MUST cap unconsumed challenges at 128 per install.
Before issuing challenges or verifying proofs, the remote surface MUST apply the following independent budgets per fixed 60-second window.

| Traffic class | Source budget | Device budget | Install budget |
| --- | ---: | ---: | ---: |
| Anonymous, including enrollment | 10 | — | 60 |
| Enrolled device cookie | 30 | 20 | 120 |
| All enrollment code attempts, including terminal entries | — | — | 10 across both classes |

These budgets limit admitted attempts, successful or unsuccessful. The remote surface MUST reject excess attempts until the window ends.
The remote surface MUST issue a random device cookie after verified enrollment or authenticated sign-in.
Session and rate-limit cookies MUST use `Secure`, `HttpOnly`, and `SameSite=Strict`.
A recognized cookie for an active device MUST select the enrolled class.
The cookie MUST grant no read, answer, or enrollment authority.
Missing, unknown, and revoked cookies MUST use the anonymous class. Claimed device IDs MUST NOT select budgets.
Exhausting one class MUST NOT consume the other class's budget.
The remote surface MUST persist counters and window deadlines across restart. Refused attempts MUST NOT extend the window.
Limits MUST cover enrollment, read sessions, answers, and revocations. Local answering MUST remain available.
Unauthenticated responses MUST NOT disclose device existence or permanently revoke a device. [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Fill all connection slots with stalled handshakes and partial headers. Check deadlines, worker counts, and local availability.
Exhaust anonymous limits from multiple sources. Use a valid cookie from the same source and complete verified sign-in.
Try the cookie alone and a guessed device ID. Expect no authority. Exercise each budget at its limit and one above.
Count wrong reverse codes across sources. Restart during cooldown. Retry at the window boundary.

### RA-R10 — Fail closed and recover locally

Disabling remote access or restarting the remote surface MUST invalidate all read sessions, answer challenges, and pending enrollment requests.
Network or TLS failure MUST leave local answering available without accepting remote plaintext.
Recovery MUST use the local owner ceremony under RA-R4 and revoke the lost device before activating its replacement.
It MUST preserve prior answers, key pins, and device history.
After registry loss, the install MUST invalidate previous device authorizations and require local recovery before accepting remote answers.
To retain the install identity, recovery MUST restore its credential ID history before accepting another enrollment. [ADR 0015](../adr/0015-enroll-through-the-local-owner-ceremony.md) · [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Disable and re-enable remote access. Restart with one pending request of each kind. Disconnect the route and use an expired certificate with a validating client. Remove the registry and attempt an old assertion. Expect refusal. Recover a lost device locally. Compare prior answers, key pins, and old credential rejection.

### RA-R11 — Preserve the question on a phone

The remote surface MUST show the question, reason, choices with consequences, history, verified facts, then files and detailed evidence.
Phone controls MUST keep each choice and consequence reachable without hiding evidence.
The remote surface MUST preserve existing reading gates, required correction text, and neutral choices.
The remote surface MUST NOT record the answer unless the owner explicitly submits it with fresh owner factor verification. [Dashboard question screens](../../skills/graph-flow/references/dashboard.md#question-screens-q1q6)

Verify: Inspect plan, hold, authorization, and missing-evidence fixtures at 320 and 390 CSS pixels. Check reading order, scrolling, focus, and enabled actions. Open evidence, cancel authentication, and navigate back. Expect no answer. In a human trial, read a long choice and its consequence on a phone.

### RA-R12 — Verify the passkey profile

The project MUST own the WebAuthn verifier and use only the Python standard library.
The configured relying party ID MUST equal the HTTPS origin's DNS hostname without its port.
Configuration MUST reject IP literals. Remote pages MUST send `Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY`.
Registration MUST request `residentKey: "required"` and `attestation: "none"`.
All assertions MUST use an empty `allowCredentials` list. Options MUST NOT reveal enrolled credential IDs.
Both ceremonies MUST request `userVerification: "required"`.
For each assertion, the verifier MUST match the returned user handle to the stored owner handle for that install.
It MUST match the credential ID to that owner and to the enrollment required by the operation.
Possession proof MUST match the credential reserved for that candidate session.
Unknown, revoked, and mismatched credentials MUST receive the same public refusal.

The verifier MUST accept only ES256 (COSE algorithm `-7`) with an EC2 public key on P-256 and SHA-256.
It MUST validate coordinate lengths, field bounds, curve membership, strict DER signature encoding, and ECDSA scalar bounds.
Both ceremonies MUST check type, fresh challenge, exact HTTPS origin, relying party ID hash, user presence, and user verification.
The verifier MUST reject `crossOrigin: true` and any occurrence of `topOrigin`.
Registration MUST require `fmt: none`, an empty attestation statement, and matching outer and attested credential IDs.
Credential IDs MUST contain 1–1023 bytes. Registration MUST enforce uniqueness across pending, active, and revoked credentials within the install.
The verifier MUST verify each assertion signature over authenticator data followed by SHA-256 of the original client data bytes.

Both ceremonies MUST reject backup state (BS) set without backup eligibility (BE).
Registration MUST store BE, BS, and the signature counter. Assertions MUST reject changes to BE.
When both counters are nonzero, the verifier MUST reject a received counter at or below the stored value.
The verifier MUST allow zero counters, including synced passkeys. It MUST retain the highest accepted counter.
It MUST serialize counter comparison and updates per credential. It MUST update BS and the counter only after successful verification.

The profile MUST request no extensions. It MUST reject nonempty client extension output.
The verifier MUST accept absent extension output.
For unsolicited authenticator output, it MUST accept only registration `credProtect` with integer value 1, 2, or 3.
It MUST ignore that value for authorization and reject every other unsolicited output.
The CBOR parser MUST accept only definite-length maps, integers, byte strings, and text strings needed by this profile.
It MUST reject inputs above 16 KiB, nesting beyond four containers, maps above 16 entries, or strings above 4 KiB.
It MUST enforce bounds before allocation and reject duplicate keys, truncation, invalid text, and trailing bytes.

WebAuthn Level 3 defines discoverability, assertion options, authenticator flags, and registration and assertion verification. [§5.4.6 Resident keys](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/#enum-residentKeyRequirement) · [§5.5 Assertion options](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/#dictionary-assertion-options) · [§6.1 Authenticator data](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/#sctn-authenticator-data) · [§7.1 Registration](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/#sctn-registering-a-new-credential) · [§7.2 Assertions](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/#sctn-verifying-assertion)

The exact-host rule, counter refusal, framing headers, and extension allowlist are project policies.
CTAP defines the registration values for `credProtect`. [CTAP 2.2 §12.1](https://fidoalliance.org/specs/fido-v2.2-ps-20250714/fido-client-to-authenticator-protocol-v2.2-ps-20250714.html)

Verify: Inspect options and response headers. Omit the handle, change it, and use an unknown or revoked ID.
Compare public status and body. Check both ID length boundaries and race duplicate registrations.
Exercise counter increase, equality, decrease, and zero transitions. Toggle BE and BS independently.
Inject `topOrigin` and vary origin, host, and flag checks independently. Test every cryptographic and parser boundary with positive and negative fixtures.
Reject malformed signatures, invalid points, nonempty attestation statements, unsupported algorithms, and disallowed extensions.
Inspect secret comparisons for a constant-time primitive such as `hmac.compare_digest`. [ADR 0014](../adr/0014-verify-before-signing.md)

### RA-R13 — Qualify the verifier before release

The project MUST validate the verifier against public WebAuthn registration and assertion vectors and Wycheproof P-256/SHA-256 ECDSA vectors.
Release qualification MUST replay real-device registration and assertion fixtures from platform and roaming authenticators.
These fixtures MUST cover absent extensions and unsolicited registration `credProtect` from a real device.
The project MUST record browser, OS, authenticator, observed output, and expected result for each capture.
Fixtures MUST cover valid, negative, and malformed cases. They MUST record vector revisions and expected results.
An independent cryptographic reviewer MUST review the exact verifier revision, including parsing, protocol checks, and secret comparisons.
A release MUST prevent remote answering until vectors and real-device fixtures pass and the independent review approves that revision. The project SHOULD request the review in a public issue when the verifier code exists. [ADR 0014](../adr/0014-verify-before-signing.md)

Verify: Replay the pinned vectors and compare each result with its expected profile outcome.
Try enabling remote answering with a failed vector, missing approval, and approval for another revision.
Expect refusal in each release fixture. Check that explicit opt-in still applies to a qualified revision.
[Public WebAuthn fixtures](https://github.com/Yubico/java-webauthn-server/blob/main/webauthn-server-core/src/test/scala/com/yubico/webauthn/RegistrationTestData.scala) · [Wycheproof DER vectors](https://github.com/C2SP/wycheproof/blob/main/testvectors_v1/ecdsa_secp256r1_sha256_test.json)

### RA-R14 — Guide certificate setup

The project MUST publish a certificate setup guide for the remote surface.
The guide MUST cover at least one private-network method and at least one public-domain method.
For each method, the guide MUST show how to obtain a browser-trusted certificate for the configured hostname.
It MUST show how to point the remote surface at the certificate and key, and how to check expiry.
It MUST show how to confirm from a phone that the origin opens without a certificate warning.
The guide MUST state that a self-signed certificate does not work on a typical phone without a trusted root.
For direct TLS, the remote surface MUST detect certificate or key file changes within 60 seconds, including atomic replacements.
It MUST load a valid matching pair atomically for new handshakes without a process restart.
On reload failure it MUST report the error locally. It MUST retain the previous pair while valid.
It MUST stop new handshakes when no valid pair remains.
Within 30 days of certificate expiry, `gf status` and the local dashboard MUST warn with hostname and expiry time.
Both views MUST report expiry and reload failure even when the remote surface stops accepting connections.
In proxy mode the proxy MUST reload changed external certificate files. Both local views MUST use the proxy's configured public certificate file for expiry reporting.
A release MUST NOT enable remote answering without this guide. [ADR 0016](../adr/0016-assign-tls-responsibility.md)

Verify: Follow each method in the guide on a clean fixture. Open the origin from a phone browser and expect no certificate warning. Register a passkey and answer one question. Repeat with a self-signed certificate and expect the documented failure. Check that a release without the guide refuses remote answering.
Replace the certificate and key while serving. Inspect the certificate on a new connection and compare process IDs.
Test a mismatched replacement and expiry of the previous pair. Check both local views at the 30-day boundary. In proxy mode, compare the served certificate with the configured public file.

## Security and invariants

| Requirements | Principles and skill rules |
| --- | --- |
| RA-R1–RA-R4, RA-R9, RA-R10 | P5, P10. Owner setup controls remote reachability. Authentication refusals protect the existing human decision point. Agents keep their existing roles. |
| RA-R4–RA-R7, RA-R11 | P1, P6, P7, P9, P10. Mechanical checks enforce who can answer. Plan and gate code control execution approvals. Map decisions bind only item revisions. |
| RA-R6, RA-R7 | P2, P3, P4, P8. Answers preserve attempt limits, plan dependencies, owned paths, and scoped rejection. |
| RA-R6, RA-R8, RA-R10 | P11, P12. Existing verdicts and trace still drive learning and measurement. Device attribution supplies no gate or learning evidence. |
| RA-R12–RA-R14 | P6, P10. Verifier checks, certificate checks, and release qualification protect owner authorization before signing. |
| RA-R7, RA-R11 | P10. Only a decision or approval reaches the owner. Remote authentication adds no run question or required stop. |

Agents never change `GF_HOME` or set `GF_ROLE=human` or `GF_HUMAN_TERMINAL`. They never run `gf decide answer` or use either dashboard API.
They never handle `human.key`, read `server.json`, or edit run files directly.
They never start, configure, or restart the remote surface. They never enroll or revoke devices or recover access.
Agents never read, relay, or redeem enrollment codes, reverse codes, or ceremony output. [Human identity](../../skills/graph-flow/SKILL.md#human-identity) · [Principles](../../skills/graph-flow/references/principles.md) · [Leader](../../skills/graph-flow/references/leader.md)

The design trusts the owner device, the verifier, and the local owner ceremony under threat model A.
A passkey authenticates the challenge. The owner relies on the displayed question and answer text when choosing what to sign.
Public exposure can reveal service availability or exhaust capacity. Revocation cannot retract evidence already displayed.

## Implementation obligations

Deliver these changes with the implementation under [ADR 0011](../adr/0011-code-follows-the-spec.md).

- Amend the network rule and answer-authority rules in `records.md`. Document the local owner paths and the verified remote owner path.
  Record the map issuer, canonical answer, supersede event, and unsigned attribution. [Records](../../skills/graph-flow/references/records.md)
- Amend the frozen signing note in `principles.md`. A new network-facing entry point calls the unchanged signer.
  The network-facing process now handles `human.key`. Document the resulting exposure under threat model A. [Principles](../../skills/graph-flow/references/principles.md)
- Add the agent prohibitions above to `SKILL.md` and `leader.md`, including both codes and all ceremony output.
  Document the leader's single presentation command and its lack of authoring inputs. [Skill](../../skills/graph-flow/SKILL.md#human-identity) · [Leader](../../skills/graph-flow/references/leader.md)
- The test harness MUST create a disposable install, OS home, project, and isolated `GF_HOME` before importing graph-flow or launching children.
  It MUST confine writes there and refuse the owner's real paths, including aliases, inherited configuration, and service registration.
  It MUST use fixture credentials, loopback transport, and a service double.
  Agents invoke this harness without overriding their install or receiving ceremony output.
  Verify that an unsafe path aborts before initialization. Use a protected sentinel install to check that no test reaches an external configuration or registry.

## Decided questions

| ID | Owner decision (2026-11-20) | Record |
| --- | --- | --- |
| OQ-1 | Use an ES256 WebAuthn passkey with user verification for each remote answer. The project owns the standard-library-only verifier. | [ADR 0014](../adr/0014-verify-before-signing.md) |
| OQ-2 | Use threat model A and the local owner ceremony. Require a single-use enrollment code, possession proof, and reverse-code entry. | [ADR 0015](../adr/0015-enroll-through-the-local-owner-ceremony.md) |
| OQ-3 | Ship direct TLS first. Add proxy support after its backend isolation and origin checks pass the same refusal fixtures. | [ADR 0016](../adr/0016-assign-tls-responsibility.md) |
| OQ-4 | Queue the selection. Use one optional tool-issued decision for the pinned revision in the next run. | [ADR 0017](../adr/0017-confirm-out-of-run-items-in-the-next-run.md) |

## Open questions

None.
