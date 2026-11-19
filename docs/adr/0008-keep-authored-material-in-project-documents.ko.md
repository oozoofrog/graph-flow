# 0008 사람이 쓴 내용은 프로젝트 문서에 둔다

> 이 문서는 [0008-keep-authored-material-in-project-documents.md](0008-keep-authored-material-in-project-documents.md)의 한국어 읽기본입니다. 기준은 영어 원문입니다.
> 원문 해시: `sha256:6fa162705c50fbfda57dc3bfd5bb2f1f1aac7bd529ce31eb50a51b4c36ae28a5`. 영어 원문이 바뀌면 `scripts/tests/test_reading_copies.py`가 실패합니다.

상태: 승인됨(Accepted). 2026-11-20에 사람이 OQ-2에서 이 선택지를 골랐습니다.

## 배경

사람은 생각, 도메인 용어, 연결을 씁니다. 에이전트는 연결과 충돌을 제안합니다. 이 내용은 실행과 실행 사이에도 남고 이력을 유지합니다. [ADR 0002](0002-derive-the-map-from-source-records.ko.md)

## 결정

작성한 내용은 Git으로 관리하는 프로젝트 문서에 글 파일로 둡니다. 작성한 항목마다 파일 하나를 둡니다(OQ-5). 이 파일의 변경은 다른 프로젝트 변경처럼 검토합니다. 에이전트의 제안은 미확인 항목으로 들어옵니다. 사람은 ADR 0003에 적힌 방식으로 항목을 확인합니다. [ADR 0003](0003-keep-link-confirmation-with-the-person.ko.md)

## 검토한 대안

비공개 로컬 기록은 개인 메모를 한 기기에만 둡니다. 따로 백업해야 하고 검토 이력이 남지 않습니다. Git과 로컬 기록으로 나누면 항목마다 어디에 둘지 정하는 규칙이 하나 더 생깁니다.

## 결과

Git이 생각, 용어, 연결마다 이력을 남깁니다. 에이전트는 작업 지시서에서 이 내용을 읽을 수 있습니다. 저장소에 접근할 수 있는 사람은 모두 이 내용을 읽을 수 있습니다. 이 파일에는 비밀이나 개인 정보를 쓰지 않습니다. 항목마다 파일 하나를 두면 변경이 작고 병합 충돌이 드뭅니다. 지도가 커질수록 파일 수도 늘어납니다. [ADR 0010](0010-confirm-outside-a-run-with-a-signed-commit.ko.md)이 실행 밖의 확인 방법을 정합니다.

## 지키는 원칙

P6은 프로그램이 비교할 수 있는 평범한 파일을 우선합니다. P11은 교훈을 다음 계획이 읽을 수 있는 곳에 둡니다. [원칙](../../skills/graph-flow/references/principles.md)
