# 0012 Keep remote access opt-in

Status: Accepted (2026-11-20, design review in PR #7)

## Context

The dashboard binds loopback and checks the local Host before it checks the dashboard token.
That token grants answer power on the local dashboard. An owner away from the install needs access to pending decisions.
The records contract currently permits network access only for the loopback dashboard. [Server](../../skills/graph-flow/scripts/graphflow/server.py) · [Records](../../skills/graph-flow/references/records.md)

Ordinary dashboard commands could start a configured service. A forwarding proxy could expose the local token interface.

## Decision

Add one inbound network exception for the owner-enabled remote surface.
Run it in a dedicated POSIX process with its own origin, authentication policy, and route allowlist.
Use the Python standard library. The local owner ceremony controls start, configuration, restart, and OS service registration.
After reboot, an enabled service registered through that ceremony can restart the process unattended.
No agent-reachable command starts, configures, or restarts it. This includes `gf serve` and all `--open` paths.
`gf open --stop` affects only the local dashboard.
Keep local token and Host checks. Reject local requests carrying `Forwarded`, `Via`, or any `X-Forwarded-*` header.
Expose eligible questions, their evidence, and the limited device operations in RA-R8.
Keep the project browser, key repinning, and setup local.
Update the network and answer rules in the records contract with the implementation under ADR 0011.
[RA-R1](../spec/remote-approval.md#ra-r1--require-owner-opt-in) · [RA-R3](../spec/remote-approval.md#ra-r3--restrict-remote-reads-and-operations)

## Alternatives considered

Forwarding the existing dashboard also forwards a token-authorized answer path and general project reads.
A read-only view supports inspection but leaves an owner away from the install unable to answer.
Binding the entire dashboard to a private network makes network membership part of the approval boundary.

## Consequences

A disabled install opens no new listener. A configured install has another interface to test and maintain.
The remote surface needs no provider account, hosted relay, or outbound discovery.
The local dashboard still trusts its local token. A forwarder that strips identifying headers can still expose the local dashboard.

## Principles served

P5 limits disclosure to the question under review. P10 lets the owner answer at the existing decision point.
P6 makes route scope and credential separation mechanically testable. [Principles](../../skills/graph-flow/references/principles.md)
