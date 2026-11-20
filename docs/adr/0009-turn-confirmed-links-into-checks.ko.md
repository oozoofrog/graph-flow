# 0009 확인된 연결을 검사로 만든다

> 이 문서는 [0009-turn-confirmed-links-into-checks.md](0009-turn-confirmed-links-into-checks.md)의 한국어 읽기본입니다. 기준은 영어 원문입니다.
> 원문 해시: `sha256:9d64104f12edf5f67ca26419b4a6c9b79755972b438d9e59b259354b86154eac`. 영어 원문이 바뀌면 `scripts/tests/test_reading_copies.py`가 실패합니다.

상태: 승인됨(Accepted). 2026-11-20, PR #6 설계 검토.

## 배경

요구와 그 검사 사이의 빈틈은 놓치기 쉽습니다. 글로 된 알림은 사람의 주의에 기댑니다. Tan은 이 방식을 이렇게 설명합니다: "every time we correct our agents, it turns into one of these deterministic checks"(에이전트를 바로잡을 때마다 그것이 결정론적 검사 하나가 된다). [Tan 발표 자막(기계 생성)](https://ai.engineer/api/code/reading-download/transcripts/lauren-tan.md)

## 결정

읽기만 하는 명령 `gf map check`를 더합니다. 현재 계획의 요구에 검사로부터 오는 `tests` 연결이 없으면 이 명령은 실패합니다. 확인된 연결이 사라진 출처를 인용해도 실패합니다. 계획은 이 명령을 통합 검사에 넣을 수 있습니다. 지도는 스스로 검사를 더하거나 바꾸지 않습니다. [CEM-R14](../spec/co-evolution-map.ko.md#cem-r14--확인된-연결을-검사로-만들기)

## 검토한 대안

검사 없이 빈틈만 보여 주면 사람이 알아차려야 합니다. 모든 계획에 자동으로 검사를 넣으면 사람의 선택 없이 계획이 바뀝니다.

## 결과

요구가 검사로 덮였는지가 의견이 아니라 검사 결과가 됩니다. 연결을 관리하는 일이 작업의 일부가 됩니다. 사람만 판정할 수 있는 요구에는 사람 검사로부터 오는 `tests` 연결이 필요합니다.

## 지키는 원칙

P1은 기대를 실패할 수 있는 검사로 바꿉니다. P6은 연결을 기계적으로 유지합니다. P11은 교훈이 스스로를 강제하게 합니다. [원칙](../../skills/graph-flow/references/principles.md)
