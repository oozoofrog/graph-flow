# 0013 Attribute answers to device enrollments

Status: Accepted (2026-11-20, design review in PR #7)

## Context

Each install has one owner. The owner can lose a device and continue using another.
HMAC v3 identifies the existing run answer. It contains no device identifier. [Core](../../skills/graph-flow/scripts/graphflow/core.py)

Remote revocation needs a target selector because labels can repeat across devices.

## Decision

Assign each enrollment an install-scoped, non-reusable device ID. Keep the owner label separate from that identifier.
Use the local owner ceremony to list or revoke devices.
On the remote surface, require a user-verified read session to list active devices.
Show only owner labels, stable device IDs, and last verified use times.
From another active device, require a fresh assertion bound to the selected revocation target.
Keep enrollment initiation, recovery, and reactivation local. Preserve revoked device and credential IDs.
Record the device ID as unsigned attribution with the answer event, outside its signed payload.
For example, the event envelope can carry the device ID beside the existing actor metadata.
Use the existing run transaction writer for the event. One committed event then contains the answer and its attribution.
Identify it by project, run, decision ID, and event sequence. Use the event time as the acceptance time.
Serialize device revocation against final authorization through answer commit. Reject a submission when revocation commits first.
Read previous events without attribution as device unknown. Never infer a device from a label or network address.
[RA-R5](../spec/remote-approval.md#ra-r5--authenticate-each-answer) · [RA-R8](../spec/remote-approval.md#ra-r8--attribute-and-revoke-devices) · [RA-R10](../spec/remote-approval.md#ra-r10--fail-closed-and-recover-locally)

## Alternatives considered

Multiple owner accounts add membership and roles to an install with one owner.
Adding a signed device field changes HMAC v3. A separate log written after the answer can lose attribution during a crash.

## Consequences

The owner can revoke a lost enrollment without rotating the run signing key.
A synchronized or copied credential identifies one enrollment across its copies. Revocation disables all those copies.
Owners who need separate revocation enroll distinct credentials.
The device registry survives restart. The signed verifier ignores missing or edited attribution.
A same-account writer can falsify local attribution. It cannot establish physical device identity.

## Principles served

P6 makes revocation and answer linkage mechanical. P10 preserves one owner.
P12 supports tracing remote answers without changing verdicts. [Principles](../../skills/graph-flow/references/principles.md)
