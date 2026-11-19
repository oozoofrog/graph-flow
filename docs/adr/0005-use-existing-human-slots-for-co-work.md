# 0005 Use existing human slots for co-work

Status: Proposed

## Context

Plan approval already requires the person's attention. Human checks and holds already show a question and evidence. Exposure alone gives little evidence that the person can explain a choice. Naur describes three abilities a person can exercise. Issue 5 identifies occasions to exercise them. [Naur](https://gist.github.com/dpritchett/fd7115b6f556e40103ef) · [Issue 5](https://github.com/oozoofrog/graph-flow/issues/5)

## Decision

Use existing human slots for learning, discussion, debate, and brainstorming. Keep predictions, personal explanations, and link choices voluntary. Use the existing signed answer text for the person's explicit choices. Display optional free constraint questions at close without waiting for answers. Keep all learning data outside gate computation. [CEM-R5 through CEM-R10](../spec/co-evolution-map.md#cem-r5--let-the-person-test-their-understanding)

## Alternatives considered

A compulsory quiz would make run completion depend on a score. A separate conversation for each lesson would add a wait and separate the question from its evidence.

## Consequences

A person can skip an exercise and still answer the original question. The summary reports missing responses and skips separately. Counter-proposals need a reviewer from another model family. Give that reviewer only the goals, candidate split, and constraints. Compare the cost and later rejections before wider use. [Design checklist](../design-sources.md)

## Principles served

P5 limits the reviewer's context. P7 protects gate evidence. P10 protects the stop budget. P11 and P12 connect lessons with observable outcomes. [Principles](../../skills/graph-flow/references/principles.md)
