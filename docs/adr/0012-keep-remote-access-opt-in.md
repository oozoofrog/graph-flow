# 0012 Keep remote access opt-in

Status: Proposed

## Context

The dashboard binds loopback and checks the local Host before it checks the dashboard token.
That token grants answer power on the local dashboard. An owner away from the install needs access to pending decisions.
The records contract currently permits network access only for the loopback dashboard. [Server](../../skills/graph-flow/scripts/graphflow/server.py) · [Records](../../skills/graph-flow/references/records.md)

## Decision

Keep local startup and authorization intact. Add one network exception for an explicitly enabled, inbound remote surface.
Give that surface a separate listener, origin, authentication policy, and route allowlist.
Expose the eligible question and its referenced evidence. Keep the project browser, key repinning, and administration local.
Restrict opt-in to the local owner ceremony. Agent startup and project configuration cannot enable the listener. Use the Python standard library under the existing dependency rule.
Acceptance of this proposal would require a corresponding update to the network rule in the records contract.
[RA-R1](../spec/remote-approval.md#ra-r1--require-owner-opt-in) · [RA-R3](../spec/remote-approval.md#ra-r3--restrict-remote-reads-and-operations)

## Alternatives considered

Forwarding the existing dashboard also forwards a token-authorized answer path and general project reads.
A read-only view supports inspection but leaves an owner away from the install unable to answer.
Binding the entire dashboard to a private network makes network membership part of the approval boundary.

## Consequences

A disabled install opens no new listener. A configured install has another interface to test and maintain.
The remote module needs no provider account, hosted relay, or outbound discovery.
The local dashboard still trusts its local token. An owner who publishes that dashboard separately exposes its existing authority.

## Principles served

P5 limits disclosure to the question under review. P10 lets the owner answer at the existing decision point.
P6 makes route scope and credential separation mechanically testable. [Principles](../../skills/graph-flow/references/principles.md)
