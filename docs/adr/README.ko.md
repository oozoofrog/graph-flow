# 아키텍처 결정 기록 (한국어 읽기본)

> 이 문서는 [README.md](README.md)의 한국어 읽기본입니다. 기준은 영어 원문입니다.
> 원문 해시: `sha256:10b39a30e98b069c14362f9d2ea3617dded4360c2e3cc6ee2994561ba9dca672`. 영어 원문이 바뀌면 `scripts/tests/test_reading_copies.py`가 실패합니다.

아키텍처 결정 기록(ADR)은 나중에 유지보수할 사람이 이해해야 할 선택 하나를 설명합니다. 대안이 아직 분명할 때 이유를 기록합니다. Nygard의 형식에 이 저장소의 항목 두 개를 더해 씁니다. [Michael Nygard, *Documenting Architecture Decisions*](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

## 기록 쓰기

1. 가장 큰 ADR 번호 다음의 쓰지 않은 번호를 씁니다. 번호는 네 자리 이상입니다.
2. 파일 이름은 `NNNN-short-title.md`로 합니다. 제목이 바뀌어도 번호는 그대로 둡니다. 번호는 다시 쓰지 않습니다.
3. 첫 제목에 제목을 쓰고, 다음 줄에 상태를 씁니다.
4. 아래 항목을 씁니다. 관련된 명세 요구와 출처를 연결합니다.
5. 제안을 토론에 올립니다. 사람이 설계 검토에서 승인이나 거절을 기록합니다.
6. 승인한 뒤에도 이유는 그대로 둡니다. 결정을 바꾸려면 새 ADR을 씁니다.
7. 대체하는 ADR이 승인되면 이전 ADR을 Superseded로 표시합니다. 두 기록을 서로 연결합니다.

| 항목 | 내용 |
| --- | --- |
| 제목 | 번호와 아키텍처 선택 하나 |
| 상태 | 아래 상태 표의 값 하나 |
| 배경 | 문제와 그 문제에 작용하는 힘 |
| 결정 | 선택과 그 이유 |
| 검토한 대안 | 실현 가능한 대안과 그것을 고르지 않은 이유 |
| 결과 | 이점, 비용, 한계 |
| 지키는 원칙 | 관련된 P1–P12 번호와 그 효과 |

| 상태 | 뜻 |
| --- | --- |
| 제안됨 (Proposed) | 사람의 결정을 기다립니다. |
| 승인됨 (Accepted) | 사람이 이 선택을 받아들였습니다. |
| 대체됨 (Superseded) | 승인된 다른 ADR이 이 선택을 대체합니다. |
| 거절됨 (Rejected) | 사람이 제안을 거절했습니다. 이유는 남아 있습니다. |

**지키는 원칙.** P7은 이유를 실행 증거와 구분합니다. P10은 중요한 선택에 대한 사람의 권한을 지킵니다. [원칙](../../skills/graph-flow/references/principles.md)

## 기록 목록

| 번호 | 제목 | 상태 |
| --- | --- | --- |
| 0001 | [아키텍처 결정을 기록한다](0001-record-architecture-decisions.ko.md) | 승인됨 |
| 0002 | [지도를 출처 기록에서 만든다](0002-derive-the-map-from-source-records.ko.md) | 승인됨 |
| 0003 | [연결의 확인은 사람이 한다](0003-keep-link-confirmation-with-the-person.ko.md) | 승인됨 |
| 0004 | [도메인 용어집을 지도의 입구로 쓴다](0004-use-the-domain-glossary-as-an-entry-point.ko.md) | 승인됨 |
| 0005 | [함께하는 방식은 기존 사람 단계를 쓴다](0005-use-existing-human-slots-for-co-work.ko.md) | 승인됨 |
| 0006 | [영어 원문 하나와 한국어 읽기본을 둔다](0006-keep-one-english-reference.ko.md) | 승인됨 |
| 0007 | [경로는 별도 로컬 뷰어에서 보여 준다](0007-show-trails-in-a-separate-local-reader.ko.md) | 승인됨 |
| 0008 | [사람이 쓴 내용은 프로젝트 문서에 둔다](0008-keep-authored-material-in-project-documents.ko.md) | 승인됨 |
| 0009 | [확인된 연결을 검사로 만든다](0009-turn-confirmed-links-into-checks.ko.md) | 승인됨 |
| 0010 | [실행 밖에서는 서명된 커밋으로 확인한다](0010-confirm-outside-a-run-with-a-signed-commit.ko.md) | 대체됨 |
| 0011 | [코드는 스펙을 따른다](0011-code-follows-the-spec.ko.md) | 승인됨 |
| 0012 | [원격 접근은 소유자가 켤 때만 허용한다](0012-keep-remote-access-opt-in.ko.md) | 승인됨 |
| 0013 | [답변을 기기 등록 단위로 기록한다](0013-attribute-answers-to-device-enrollments.ko.md) | 승인됨 |
| 0014 | [서명 전에 원격 답변마다 검증한다](0014-verify-before-signing.ko.md) | 승인됨 |
| 0015 | [로컬 소유자 절차로 등록한다](0015-enroll-through-the-local-owner-ceremony.ko.md) | 승인됨 |
| 0016 | [TLS 책임을 설정된 엔드포인트에 맡긴다](0016-assign-tls-responsibility.ko.md) | 승인됨 |
| 0017 | [실행 밖 항목은 다음 실행에서 확인한다](0017-confirm-out-of-run-items-in-the-next-run.ko.md) | 승인됨 |
