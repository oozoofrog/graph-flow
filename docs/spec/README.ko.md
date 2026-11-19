# 기능 명세 (한국어 읽기본)

> 이 문서는 [README.md](README.md)의 한국어 읽기본입니다. 기준은 영어 원문입니다.
> 원문 해시: `sha256:54af28d6e8ca0e1124ac28b879b170925c7182d5ffc48b8d1ffa44cbcefb7afd`. 영어 원문이 바뀌면 `scripts/tests/test_reading_copies.py`가 실패합니다.

graph-flow는 **명세 고정형(spec-anchored)** 명세 주도 개발을 씁니다. 명세는 구현 전에 기대하는 동작을 적습니다. 동작이 바뀌어도 명세는 그 기능과 함께 남습니다. 사람은 코드와 검사를 직접 고칠 수 있습니다. 짧고 관리되는 명세는 변경마다 안정된 기준점을 줍니다. [Böckeler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

## 명세 쓰기와 관리

1. 기능마다 고유한 대문자 접두어를 붙입니다. ID는 `<접두어>-R<번호>` 형식으로 1부터 붙입니다.
2. ID는 그 동작과 함께 유지합니다. 다른 의무에는 새 ID를 붙입니다. 폐기한 ID도 참조를 남깁니다.
3. 목적, 한계, 도메인 용어를 적습니다. 요구 앞에 BCP 14 표준 문단을 둡니다.
4. ID마다 관찰할 수 있는 의무를 적습니다. 입력과 기대 결과가 있는 `Verify:` 줄을 더합니다.
5. 프로그램이 실패시킬 수 있는 검사를 우선합니다. 사람의 판단이 필요한 연습은 그렇게 표시합니다.
6. 아키텍처 선택마다 ADR을 연결합니다. ADR에서도 관련 요구 ID로 되돌아오는 연결을 둡니다.
7. 정하지 못한 선택은 번호 붙은 열린 질문에 둡니다. 선택지마다 결과를 적습니다.
8. 동작이 바뀌면 명세와 검사를 같은 변경에서 고칩니다. 한국어 읽기본마다 영어 원문의 SHA-256 해시를 적습니다.

짧은 문장과 개념 하나에 용어 하나를 씁니다. 대문자 의무 키워드는 요구와 표준 문단에만 씁니다. [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) · [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) · [ASD-STE100](https://www.asd-ste100.org/STE_faq.html)

## 명세 상태

| 상태 | 뜻 |
| --- | --- |
| 초안 (Draft) | 사람과 에이전트가 제안된 동작을 토론합니다. |
| 승인됨 (Accepted) | 사람이 이 버전을 설계 기준으로 받아들였습니다. |
| 대체됨 (Superseded) | 이름이 밝혀진 후속 명세가 이 명세를 대체합니다. 이전 ID는 계속 찾을 수 있습니다. |
| 철회됨 (Withdrawn) | 사람이 후속 명세 없이 이 명세의 작업을 끝냈습니다. |

명세 승인은 설계 선택을 기록합니다. 실행 승인은 계속 계획 절차와 게이트 절차가 맡습니다.

## 계획과 명세 잇기

범위 안의 요구마다 ID와 의무를 기존 계획의 `requirements` 목록에 옮깁니다. 구현하는 노드의 단수 필드 `requirement`에 같은 ID를 씁니다. 계획 지시서에 명세 버전을 고정해 적습니다. 범위가 따로 단위를 둘 만할 때만 작업을 나눕니다. 의무가 여러 개인 노드는 검사 제목에 다른 ID를 함께 적을 수 있습니다.

예를 들어 계획은 `{"id":"CEM-R3","text":"The map MUST keep the link origin and confirmation history."}`를 적을 수 있습니다. 작업 노드는 `"requirement":"CEM-R3"`을 가질 수 있습니다. 검사 제목은 의무를 인용하고, 명령 결과는 증거가 됩니다. 고정한 명세 버전에 대해 ID 연결을 확인합니다. 기존 계획 검사기가 계획 구조를 확인합니다. [Plan contract](../../skills/graph-flow/references/plan.md)

**지키는 원칙.** P1은 의무마다 실패할 수 있는 검사를 잇습니다. P6은 기계적인 ID 검사를 돕습니다. P10은 문서 검토를 실행 승인과 따로 둡니다. [원칙](../../skills/graph-flow/references/principles.md)

[공진화 지도](co-evolution-map.ko.md) · [ADR 절차](../adr/README.ko.md) · [ADR 0001](../adr/0001-record-architecture-decisions.ko.md)
