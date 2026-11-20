# 0016 Assign TLS responsibility to the configured endpoint

Status: Accepted (2026-11-20, design review in PR #7)

## Context

A private route controls reachability. Accidental public routing can expose the same endpoint.
The owner needs a stable HTTPS origin and relying party ID for passkey verification. The local dashboard accepts only its own loopback Host.
Python exposes server-side TLS contexts and certificate loading. [Dashboard](../../skills/graph-flow/references/dashboard.md) · [Python SSL contexts](https://docs.python.org/3/library/ssl.html#ssl-contexts)

An incomplete handshake can occupy the accept loop. Renewal also needs a way to replace the serving certificate.

## Decision

Configure one external HTTPS origin with an explicit authority and one owner-selected interface address.
Reject wildcard addresses, including IPv4 and IPv6 wildcards. Never rebind automatically when that interface disappears.
Use one of these transport arrangements. Ship direct TLS first (OQ-3). Add the proxy after it passes the same refusal fixtures. A published certificate setup guide is a release condition (RA-R14).

| Arrangement | Responsibility |
| --- | --- |
| Direct TLS | The owner supplies and renews the certificate and key. The remote surface serves HTTPS on the selected address. |
| Reverse proxy | The owner configures the proxy’s HTTPS endpoint and certificate. It forwards only remote routes to a dedicated loopback backend over mutually authenticated TLS. |

In proxy mode, pin the authorized proxy client credential and verify the backend certificate at the proxy.
Keep the proxy credential outside the shared account. Never route the ordinary dashboard through that proxy.
Require the configured external Host and Origin at the application. Forward the external Host explicitly.
Discard client-supplied forwarding headers. Determine backend access from the authenticated connection.
Keep source limits at the proxy for actual client addresses. Apply device and install limits at the application in both arrangements.
Use source limits at the remote surface for direct connections. Never derive authority from a claimed forwarding address.
Reject forwarding headers at the local dashboard even when its Host and token match.
Cap accepted connections at 32. Perform TLS handshakes in workers with a five-second deadline.
Apply a separate five-second header deadline and a ten-second body deadline.
Use separate anonymous and enrolled budgets under RA-R9. A random device cookie selects the enrolled budget and carries no authority.
Expire read sessions within 15 minutes. Keep them out of URLs.
For direct TLS, reload changed certificate or key files within 60 seconds without restarting the process.
Keep the previous valid pair after a failed reload. Stop new handshakes at expiry without a valid replacement.
Show reload errors and the 30-day expiry warning in `gf status` and the local dashboard.
The proxy operator handles external reload and supplies its public certificate file for local expiry reporting.
A validating client checks hostname and expiry. A failed handshake offers no HTTP fallback.
[RA-R2](../spec/remote-approval.md#ra-r2--constrain-the-network-boundary) · [RA-R3](../spec/remote-approval.md#ra-r3--restrict-remote-reads-and-operations) · [RA-R9](../spec/remote-approval.md#ra-r9--bound-remote-authentication-attempts) · [RA-R10](../spec/remote-approval.md#ra-r10--fail-closed-and-recover-locally)

## Alternatives considered

Plain HTTP on a private network leaves confidentiality dependent on that network and prevents a normal remote WebAuthn secure context.
Trusting proxy headers on a plaintext loopback backend allows local callers to impersonate the proxy.
Requiring one network provider excludes owners with other private routes.

## Consequences

Direct TLS needs certificate provisioning. A proxy adds another trusted component and a second certificate relationship.
An expired certificate, unreachable interface, or stopped proxy leaves the local dashboard available.
If the endpoint becomes publicly reachable, session authentication and per-answer verification still apply.
Limits can delay legitimate remote requests during an attack. They do not guarantee availability.
A validating browser protects its connection to the TLS endpoint. A compromised terminating proxy can see or alter the page.

## Principles served

P5 limits remote disclosure. P6 ties refusals to transport, authority, and bounded counters.
P10 keeps local answers available during remote lockout or transport failure. [Principles](../../skills/graph-flow/references/principles.md)
