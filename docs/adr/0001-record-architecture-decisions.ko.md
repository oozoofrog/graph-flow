# 0001 아키텍처 결정을 기록한다

> 이 문서는 [0001-record-architecture-decisions.md](0001-record-architecture-decisions.md)의 한국어 읽기본입니다. 기준은 영어 원문입니다.
> 원문 해시: `sha256:7e61513910e5c9d189d8acfa5e3d320299f60c618742b466f5bcc72c1981bee7`. 영어 원문이 바뀌면 `scripts/tests/test_reading_copies.py`가 실패합니다.

상태: 승인됨(Accepted). 2026-11-20, PR #6 설계 검토.

## 배경

요구는 사람이 무엇을 기대할 수 있는지 적습니다. 그러나 유지보수하는 사람이 왜 한 구조를 골랐는지는 거의 설명하지 않습니다. Nygard는 작은 기록 하나로 그 선택을 남기는 방법을 설명합니다. [Nygard, *Documenting Architecture Decisions*](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

## 결정

아키텍처 선택 하나마다 번호가 붙은 ADR 하나를 둡니다. 받아들이기 전에 그 결과를 사람과 토론합니다. 요구가 이 선택에 기대는 곳마다 ADR과 명세를 서로 잇습니다. [ADR 절차](README.ko.md) · [명세 절차](../spec/README.ko.md)

## 검토한 대안

PR은 토론을 남기지만, 읽는 사람이 해당 스레드를 찾아야 합니다. 모든 대안을 명세에 넣으면 동작을 찾기가 어려워집니다.

## 결과

토론이 끝난 뒤에도 요구에서 그 이유까지 따라갈 수 있습니다. 새 ADR이 선택을 대체하면 작성자는 두 기록 사이의 연결을 관리합니다.

## 지키는 원칙

P7은 설계 이유와 구현이 동작한다는 증거를 구분합니다. P10은 설계 승인과 실행 승인을 따로 둡니다. [원칙](../../skills/graph-flow/references/principles.md)
