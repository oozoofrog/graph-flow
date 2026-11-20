# Architecture decision records

An architecture decision record (ADR) explains one choice that future maintainers need to understand. Record the reason while the alternatives are still clear. Use Nygard's format with two local sections. [Michael Nygard, *Documenting Architecture Decisions*](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

## Write a record

1. Take the next unused number above the highest ADR number. Use at least four digits.
2. Name the file `NNNN-short-title.md`. Keep the number when the title changes. Never reuse a number.
3. Use the title as the first heading. Put the status on the next text line.
4. Write the sections below. Link the affected spec requirements and any sources.
5. Submit the proposal for discussion. The person records acceptance or rejection in the design review.
6. Preserve the rationale after acceptance. To replace the decision, write a new ADR.
7. After acceptance of the replacement, mark the earlier ADR as Superseded. Link both records.

| Part | Content |
| --- | --- |
| Title | Number and one architectural choice |
| Status | One value from the status table |
| Context | The problem and the forces that affect it |
| Decision | The choice and its rationale |
| Alternatives considered | A viable alternative and the reason for setting it aside |
| Consequences | The benefit, cost, and limits |
| Principles served | Relevant P1–P12 numbers and their effect |

| Status | Meaning |
| --- | --- |
| Proposed | The choice awaits the person's decision. |
| Accepted | The person adopts the choice. |
| Superseded | An accepted ADR replaces the choice. |
| Rejected | The person declines the proposal. Its rationale remains available. |

**Principles served.** P7 keeps rationale distinct from execution evidence. P10 preserves the person's authority over consequential choices. [Principles](../../skills/graph-flow/references/principles.md)

## Records

- [0001 Record architecture decisions](0001-record-architecture-decisions.md)
- [0002 Derive the map from source records](0002-derive-the-map-from-source-records.md)
- [0003 Keep link confirmation with the person](0003-keep-link-confirmation-with-the-person.md)
- [0004 Use the domain glossary as an entry point](0004-use-the-domain-glossary-as-an-entry-point.md)
- [0005 Use existing human slots for co-work](0005-use-existing-human-slots-for-co-work.md)
- [0006 Keep one English reference and a Korean reading copy](0006-keep-one-english-reference.md)
- [0007 Show trails in a separate local reader](0007-show-trails-in-a-separate-local-reader.md)
- [0008 Keep authored material in project documents](0008-keep-authored-material-in-project-documents.md)
- [0009 Turn confirmed links into checks](0009-turn-confirmed-links-into-checks.md)
- [0010 Confirm outside a run with a signed commit](0010-confirm-outside-a-run-with-a-signed-commit.md)
- [0011 Code follows the spec](0011-code-follows-the-spec.md)
- [0012 Keep remote access opt-in](0012-keep-remote-access-opt-in.md)
- [0013 Attribute answers to device enrollments](0013-attribute-answers-to-device-enrollments.md)
- [0014 Verify each remote answer before signing](0014-verify-before-signing.md)
- [0015 Enroll through the local owner ceremony](0015-anchor-enrollment-outside-the-shared-account.md)
- [0016 Assign TLS responsibility to the configured endpoint](0016-assign-tls-responsibility.md)
- [0017 Confirm out-of-run items in the next run](0017-confirm-out-of-run-items-in-the-next-run.md)
