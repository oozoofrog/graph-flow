# Graph Flow

[English](README.md)

Graph Flow는 여러 단계의 작업을 계획·분담·검증하고 다른 세션에서 이어갈 수
있게 돕는 Claude Code와 Codex 플러그인입니다. 작업의 의존 관계와 세션 배정,
검사 결과, 시도, 사람의 결정을 그래프로 기록합니다. 로컬 브라우저 대시보드에서
진행 상황을 확인하고 계획을 승인하거나 결정에 답할 수 있습니다.

## 설치

Graph Flow는 macOS만 지원합니다. `PATH`에서 실행할 수 있는 Python 3과 Git이
필요합니다. 두 호스트 모두 스킬과 MCP 서버를 설치합니다. Workflow 실행에는
호스트의 Workflow 도구가 필요합니다.

**Claude Code**

```sh
claude plugin marketplace add oozoofrog/graph-flow
claude plugin install graph-flow@graph-flow
```

**Codex**

```sh
codex plugin marketplace add oozoofrog/graph-flow
codex plugin add graph-flow@graph-flow
```

로컬 체크아웃 설치와 검증 방법은 [설치 가이드](docs/plugin-installation.md#graph-flow)를
참고하세요.

## 빠른 시작

1. Git 프로젝트에서 새 세션을 열고 Codex에서는 `$graph-flow`, Claude Code에서는
   `/graph-flow:graph-flow`를 호출하세요. 예를 들어 “이 작업을 검사 가능한
   노드로 나누고 세션별로 배정해 진행 상황을 기록해 주세요”라고 요청하세요.
2. 대시보드에서 계획을 읽고 승인하거나 변경 사항을 적어 돌려보내세요.
   결정이 필요하거나 작업이 끝나면 브라우저가 다시 열립니다. 리더 세션이
   멈췄다면 대시보드에서 답한 뒤 채팅으로 알려 주세요.
3. 에이전트에게 대시보드를 열거나 닫아 달라고 요청할 수 있습니다.
   처음 제안하는 `gf setup`을 실행하면 `~/.local/bin`에 `graph-flow`와
   `gf`를 만듭니다. 이후 터미널에서 `graph-flow open`, `graph-flow serve`,
   `graph-flow open --stop`을 쓸 수 있습니다. 셸에 `gf` 별칭이 있다면
   `graph-flow`를 쓰세요. `gf setup --remove`로 이 두 명령을 지울 수 있습니다.

0.2.1 실행을 계속하려면 기존 계획을 다시 올려 승인하세요. 변경하지 않은
제출 결과는 그대로 이어갈 수 있습니다. `GF_NO_OPEN=1`로 브라우저 자동 실행을
끄더라도 계획 승인은 필요합니다.

## 로컬 기록과 개인정보

그래프 아래 시간바에서 지난 실행 기록을 살펴보거나 재생할 수 있습니다.
**시공간**은 작업과 전달이 이어진 흐름을 보여 주고, **옆에서**는 시작과 종료,
대기 시간을 읽기 쉽게 보여 줍니다. 과거 기록을 본 뒤 현재 질문에 답하려면
**지금**을 선택하세요.

프로젝트의 `.graph-flow/`에 계획, 세션과 배정 기록, 사람의 답변, 변경 파일명,
명령 검사 출력을 저장합니다. 민감한 기록은 버전 관리에서 제외하세요. 대시보드는
루프백에서만 접속할 수 있습니다. 프로젝트 목록, 대시보드 토큰과 승인 서명 키는
`${GF_HOME:-$HOME/.graph-flow}`에 저장합니다.
[기록 형식](skills/graph-flow/references/records.md)을 참고하세요.

0.4.0-dev에서는 Claude Code와 로컬 Codex 세션의 비동기 훅이 진행 중인 실행의
`activity.jsonl`에 활동 메타데이터를 기록합니다. Codex에서는 훅을 신뢰하도록
설정해야 합니다. 도구 이름, 시각, 제공되는 경우 실행 시간, 세션 ID와 시도
정보를 저장합니다. 프롬프트, 도구 인자와 응답, 명령 문자열, 경로는 이 활동
로그에 기록하지 않습니다. 대시보드의 그래프 카드와 작업 상세 화면에서 활동을
볼 수 있습니다. 관측이 없는 세션은 기록된 시작, 검사, 제출을 표시합니다.
[활동 기록 형식](skills/graph-flow/references/records.md#local-activity-observations)을 참고하세요.

## 개발

저장소 루트에서 다음 명령을 실행하세요. Python 3.12, Node 24, Google Chrome,
ffmpeg가 필요합니다.

```sh
python3.12 -I -S -B -m unittest discover -s skills/graph-flow/tests
python3.12 -I -S -B -m unittest discover -s scripts/tests
python3.12 -I -S -B -m unittest discover -s dev/eval/tests -t dev/eval
```

첫 번째 스위트에는 헤드리스 Chrome 테스트가 포함됩니다. `CHROME_BIN`으로
Chrome 실행 파일을 지정할 수 있습니다. [화면 캡처](dev/screens/README.md),
[평가 작업](dev/eval/README.md), [설계 자료](docs/design-sources.md)를 참고하세요.

대시보드에 포함된 렌더러와 글꼴은 [제3자 라이선스](docs/third-party-notices.md)를 참고하세요.
