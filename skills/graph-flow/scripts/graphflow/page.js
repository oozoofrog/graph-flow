// UI_STRINGS_START
const STRINGS = {
  "ko": {
    "cardKind_work": "일",
    "cardKind_review": "검토",
    "cardKind_decision": "결정",
    "cardKind_goal": "전체 결과",
    "cardState_notStarted": "시작 전",
    "cardState_running": "진행 중",
    "cardState_reviewing": "검토 중",
    "cardState_retrying": "다시 진행 중",
    "cardState_submitted": "확인 대기",
    "cardState_passed": "끝남",
    "cardState_awaiting": "답이 필요함",
    "cardState_returned": "되돌아옴",
    "cardState_stalled": "활동 없음",
    "tag_delivered": "넘어감",
    "tag_frontier": "쓰이는 중",
    "tag_waiting": "기다리는 중",
    "tag_unreachable": "차례 전",
    "tag_blocked": "답 대기",
    "tag_returned": "되돌아옴",
    "cardSession": "세션 소통",
    "cardChecks": "검사·제출",
    "cardThinking": "생각(추정)",
    "cardMinute": "{n}분",
    "cardMinutes": "{n}분",
    "cardSeconds": "{n}초",
    "cardAttempt": "{n}번째",
    "cardLane": "단계 {n}",
    "cardWaiting": "· {age}째",
    "cardNow": "지금 {category}",
    "cardUnobserved": "세부 활동 관측 안 됨",
    "cardUnreadable": "활동 기록을 읽을 수 없음",
    "activityNameTool": "도구",
    "activityNameSkill": "스킬",
    "activityNameMcp": "MCP",
    "activityNameSession": "세션 간 소통",
    "activityNameGf": "Graph Flow",
    "activityNameOther": "기타 작업",
    "activityNameStalled": "최근 활동 없음",
    "activityNameRepeating": "실패 반복",
    "activityBoundedGap": "직전 공백(생각한 시간으로 추정)",
    "workActivity": "작업 요약",
    "activityAttempt": "{n}번째 시도",
    "activityEmpty": "아직 기록된 작업이 없어요.",
    "activityUnobserved": "이 세션에서 세부 활동이 관측되지 않았어요.",
    "activityUnreadable": "활동 기록을 읽을 수 없어요.",
    "activityCount": "{n}회",
    "activityKnown": "도구 {d}종",
    "activityDurationUnknown": "걸린 시간 미확인",
    "activitySomeUnknown": "일부 시간 미확인",
    "activityErrors": "관측된 오류 {n}회",
    "activityReplay": "다시 재생",
    "activityPause": "일시 정지",
    "activityResume": "이어서 재생",
    "graphPause": "그래프 움직임 멈추기",
    "graphResume": "그래프 움직임 재개",
    "activityAttentionCount": "활동 확인 필요 {n}개",
    "activityTime": "시간",
    "activityCalls": "호출",
    "activityTotals": "활동별 합계",
    "activityTotalDuration": "합계 {time}",
    "activityLongest": "최장 {time}",
    "activityStarted": "시작 {time}",
    "activityEnded": "종료 {time}",
    "activityVia_session": "세션 일치",
    "activityVia_cwd": "작업 디렉터리 일치",
    "activityVia_single": "실행 중인 시도가 하나",
    "activityVia_unattributed": "작업에 연결되지 않음",
    "activityOrigin_observed": "관측됨",
    "activityOrigin_inferred": "추정",
    "activityOrigin_mixed": "관측과 추정",
    "activityOrigin_boundary": "실행 기록",
    "flowDelivered": "전달됨",
    "flowProgress": "진행 중",
    "flowWaiting": "전달 대기",
    "flowBlocked": "막힘",
    "flowUnreachable": "선행 작업 대기",
    "flowReturned": "수정 요청으로 돌아감",
    "flowCounts": "전달 {delivered} · 진행 중 {progress} · 대기 {waiting} · 막힘 {blocked}",
    "edgeChoose": "관계 선택",
    "edgeGate": "게이트",
    "edgeFlow": "흐름",
    "edgeArtifact": "전달 항목",
    "edgeGateRecord": "게이트 근거",
    "edgeFlowRecord": "흐름 근거",
    "edgeDeliveryRecord": "전달 기록",
    "edgeReturnRecord": "수정 요청 기록",
    "edgeGateFlowRecord": "게이트·흐름 근거",
    "edgeGateReturnRecord": "게이트·수정 요청 근거",
    "edgeRecordSubmission": "제출",
    "edgeRecordReview": "검토 제출",
    "edgeRecordCheck": "검사",
    "edgeRecordVerdict": "게이트 판정",
    "edgeRecordDecision": "결정",
    "edgeRecordStart": "작업 시작",
    "edgeVerdictHold": "보류",
    "edgeVerdictReplan": "계획 수정 필요",
    "edgeVerdictUnverified": "확인 대기",
    "activityRead": "읽기 및 검색 {n}회",
    "activityTool": "도구 사용 {n}회",
    "activitySkill": "스킬 실행 {n}회",
    "activityMcp": "MCP 호출 {n}회",
    "activitySession": "다른 세션과 소통 {n}회",
    "activityGf": "Graph Flow 명령 {n}회",
    "activityOther": "기타 작업 {n}회",
    "activityThinking": "생각한 시간(추정)",
    "activityIncludesInferred": "추정 구간 포함",
    "activityStart": "시도 시작",
    "activityCheck": "검사 {n}회",
    "activitySubmit": "결과 제출",
    "activityMore": "그 외 {n}단계",
    "flow": "전체 흐름",
    "chooseRun": "흐름 고르기",
    "skip": "내용으로 건너뛰기",
    "listView": "그래프를 목록으로 보기",
    "nodes": "하는 일",
    "relationList": "관계 목록",
    "timePlay": "▶ 재생",
    "timePause": "Ⅱ 일시 정지",
    "timeSpeed": "재생 속도",
    "timeLive": "지금",
    "timePast": "과거 기록을 보고 있어요",
    "timeLinear": "실제 시간 간격",
    "timeScrub": "실행 시점",
    "timeUnits": "일,시간,분,초,밀리초",
    "timeZero": "0초",
    "timeReturned": "되돌려 보냄",
    "timeRevision": "계획 개정 {n}",
    "timeHuman": "사람의 답을 기다림 · {duration}",
    "timeBreak": "줄인 시간 간격 · {duration}",
    "timeFailed": "과거 기록을 불러오지 못했어요",
    "spaceView": "시공간",
    "spaceSide": "옆에서",
    "spaceViews": "그래프 보기 방식",
    "spaceWebGL": "시공간 뷰를 보려면 WebGL 2가 필요해요",
    "spaceViewed": "보고 있는 시점",
    "spaceVerify": "확인 대기",
    "spaceHuman": "사람의 답을 기다림",
    "spaceUnobserved": "작업 중 관측 없음",
    "spaceHandoff": "전달",
    "spaceVerdict": "판정",
    "spaceCheck": "검사",
    "spaceTransferWait": "{duration} 기다림",
    "spaceTransferGroup": "전달 {n}건 · 최대 {duration} 기다림",
    "spaceActivityCount": "{name} {n}회",
    "spaceAsked": "질문을 올림",
    "spaceAnswered": "답변을 받음",
    "spaceNotToScale": "높이를 실제보다 크게 표시",
    "spaceRecords": "시간순 기록",
    "handoffs": "주고받는 것",
    "yourTurn": "내가 할 일",
    "choiceEffects": "고르면 생기는 일",
    "nothing": "필요해지면 여기에 나타나요.",
    "needsYou": "내가 할 일",
    "done": "끝남",
    "doing": "하는 중",
    "waiting": "앞 일을 기다림",
    "needs_you": "내가 할 일",
    "returned": "고치러 돌아옴",
    "received": "받는 것",
    "outputs": "넘기는 것",
    "noHandoffs": "기록된 주고받기가 없어요.",
    "delivered": "받았어요",
    "notDelivered": "아직 기다려요",
    "from": "보낸 곳",
    "to": "받는 곳",
    "noReason": "돌아온 까닭이 따로 기록되지 않았어요.",
    "attempt": "{n}번째 시도 · 최대 {max}번",
    "notStarted": "시작 전이에요",
    "passed": "끝났어요",
    "running": "만들고 있어요",
    "retrying": "고치고 있어요",
    "submitted": "검토를 기다려요",
    "verificationPending": "확인이 더 필요해요",
    "failedFinal": "전체 검사 실패",
    "awaiting": "내 답을 기다리는 일",
    "held": "다음 방향을 기다려요",
    "exhausted": "다음 계획이 필요해요",
    "noAction": "지금은 하실 일이 없어요. 세 번 안에 통과하지 못하면 알려 드릴게요.",
    "read": "읽고 결정하기",
    "why": "왜 내가 봐야 하나요",
    "verified": "이미 확인된 것",
    "unverified": "아직 확인 안 된 것",
    "workerNote": "작업 담당자 메모",
    "notRecorded": "따로 기록되지 않았어요.",
    "questionOnly": "이 질문에는 설명, 근거, 읽을 파일이 없어요.",
    "writeFirst": "답을 적으면 보낼 수 있어요.",
    "leaveUnanswered": "답하지 않고 돌아가기",
    "aboutWork": "일의 상세 내용",
    "decisionRef": "결정 {id}",
    "askedBy": "물어본 곳: {who}",
    "workedBy": "작업 담당자: {who}",
    "find": "찾기",
    "findHint": "결정·질문 번호 또는 일 이름",
    "findNone": "“{text}”에 맞는 결정, 질문, 일이 없어요. 다른 흐름이면 위에서 바꿔 주세요.",
    "jumpNoRun": "이 주소가 가리키는 흐름을 찾지 못했어요.",
    "roleLeader": "진행 담당자",
    "roleWorker": "작업 담당자",
    "roleReviewer": "검토 담당자",
    "ifApproved": "이대로 하면",
    "ifRejected": "돌려보내면",
    "undo": "나중에 바꾸려면",
    "approve": "통과",
    "sendBack": "돌려보내기",
    "answer": "답 보내기",
    "answerLabel": "답을 적어 주세요",
    "backReason": "돌려보낼 때는 고칠 곳을 적어 주세요",
    "required": "고칠 곳을 먼저 적어 주세요.",
    "sending": "보내고 있어요…",
    "answerFailed": "답을 보내지 못했어요. 연결을 확인하고 다시 해 주세요.",
    "stale": "이미 답했거나 일이 바뀌었어요. 최신 흐름을 다시 읽어 주세요.",
    "answered": "답을 보냈어요. 진행 담당자가 다음 확인 때 반영해요. 세션이 멈춰 있으면 채팅에서 “답했어요”라고 알려 주세요.",
    "details": "자세한 근거 보기",
    "loadEvidence": "근거 읽기",
    "noEvidence": "읽을 근거 기록이 없어요.",
    "evidenceFailed": "근거를 읽지 못했어요. 다시 해 주세요.",
    "noProjects": "등록된 프로젝트가 없어요. 프로젝트에서 새 흐름을 시작한 뒤 다시 연결해 주세요.",
    "noRun": "아직 흐름이 없어요. 프로젝트에서 새 흐름을 시작한 뒤 다시 연결해 주세요.",
    "noPlan": "아직 계획이 없어요. 이 흐름에 계획을 넣으면 여기에 나타나요.",
    "unreadable": "이 흐름을 읽지 못했어요. 기록을 확인하거나 다른 흐름을 골라 주세요.",
    "lost": "연결이 끊겼어요. 서버가 켜져 있는지 확인한 뒤 다시 연결해 주세요.",
    "unauthorized": "이 창의 연결 정보가 없거나 바뀌었어요. 진행 담당자에게 대시보드를 다시 열어 달라고 해 주세요.",
    "retry": "다시 연결",
    "loading": "흐름을 읽고 있어요…",
    "lessons": "배운 것",
    "noLessons": "아직 기록된 배움이 없어요.",
    "complete": "모든 일이 끝났어요",
    "unnamed": "이 일",
    "handoff": "넘길 결과",
    "overview": "진행 중 {doing} · 끝남 {done}/{total}",
    "runOption": "{run}",
    "purposeReview": "사람이 직접 살펴봐야 하는 결과를 받아들일지 정해 주세요.",
    "purposeAuthorization": "이 일을 허락할지 정해 주세요.",
    "purposeTrajectory": "평소와 다르게 진행된 일을 받아들일지 정해 주세요.",
    "purposeHold": "멈춰 둔 일을 어떻게 이어 갈지 정해 주세요.",
    "purposeDirection": "다음에 어느 방향으로 갈지 알려 주세요.",
    "purposeInformation": "계속하는 데 필요한 정보를 알려 주세요.",
    "purposeNeutral": "내용을 읽고 어떻게 할지 정해 주세요.",
    "allow": "허락하기",
    "accept": "받아들이기",
    "continue": "계속하기",
    "confirmChoice": "결정 보내기",
    "evidenceReminder": "결정하기 전에 읽어야 할 근거가 기록되어 있어요.",
    "decisionClosed": "이 결정은 더 이상 열려 있지 않아요. 적던 답은 지웠어요.",
    "runChanged": "흐름이 바뀌어서 답변 창을 닫고 적던 답을 지웠어요.",
    "brand": "작업 흐름",
    "failed": "통과하지 못한 것",
    "acceptAnyway": "그래도 받아들이기",
    "used_all_attempts": "세 번의 시도를 모두 썼어요.",
    "timed_out": "정해진 시간을 넘겼어요.",
    "left_its_files": "맡은 파일의 범위를 벗어났어요.",
    "untitledFailure": "설명이 없는 확인 하나가 통과하지 못했어요.",
    "readThis": "이 파일을 읽어 주세요",
    "openFile": "파일 읽기",
    "fileFailed": "지금은 읽을 수 있는 글 파일이 아니에요. 흐름을 새로 읽고 다시 해 주세요.",
    "noFiles": "이 결정에는 읽을 파일이 기록되지 않았어요.",
    "goal": "목표",
    "work": "작업",
    "review": "검토",
    "decision": "결정",
    "handsOver": "넘겨줌",
    "reviews": "검토 담당",
    "waitsForDecision": "결정을 기다림",
    "towardGoal": "목표로",
    "reviewSentence": "{target}을(를) {lens}의 눈으로 검토해요",
    "checksMore": "검사 {n}개 더",
    "fit": "화면에 맞추기",
    "zoomIn": "크게 보기",
    "zoomOut": "작게 보기",
    "mapHelp": "끌어서 이동 · + − 확대 · 0 맞추기",
    "firstPass": "시도 1회",
    "finishedAttempts": "시도 {n}회",
    "lineLegend": "실선 → 넘겼어요 · 파선 ⇢ 아직 기다려요 · 점선 ↶ 검토해요",
    "unusedAttempts": "최대 {max}번 시도할 수 있어요",
    "home": "할 일과 기록",
    "graph": "그래프",
    "nothingTitle": "지금은 답할 일이 없어요",
    "doingNow": "지금 하는 중",
    "idle": "지금 진행 중인 일이 없어요. 진행 담당자가 다음 일을 시작하면 여기에 나타나요.",
    "log": "일어난 일",
    "logEmpty": "아직 기록된 일이 없어요.",
    "filterEmpty": "여기에 해당하는 기록이 없어요.",
    "filterAll": "전체",
    "filterMine": "내가 할 일",
    "filterReturned": "고치러 돌아옴",
    "onlyNode": "“{title}”의 기록만 보는 중",
    "showAll": "전체 보기",
    "evStarted": "실행 기록을 만들었어요",
    "evPlanned": "계획을 올렸어요",
    "evWording": "문구를 바꿨어요 · {rev}번째 계획 · 이전 계획 승인은 유지돼요",
    "evQuestionWording": "질문에 쓰일 문구가 바뀌었어요 · {nodes}",
    "evReplanned": "계획을 바꿨어요 · {rev}번째 계획",
    "evRunning": "{n}번째 시도 중",
    "evSubmitted": "{n}번째 시도 제출 · 검사를 기다려요",
    "evPassed": "{n}번째 시도 통과",
    "evReturned": "{n}번째 시도 · 고치러 돌아옴",
    "evReplan": "{n}번째 시도 · 고치러 돌아옴 · 새 계획이 필요해요",
    "evNeedsYou": "{n}번째 시도 · 내가 할 일",
    "evHeld": "{n}번째 시도 · 멈춰 두었어요",
    "evReopened": "다시 열었어요",
    "evAsked": "질문",
    "evAnswered": "질문에 답했어요",
    "evFinalPassed": "전체 결과 확인 통과",
    "evFinalFailed": "전체 결과 확인 실패",
    "evLearned": "배운 것을 기록했어요",
    "checksPassed": "자동 검사 {n}개 통과",
    "checksFailed": "✕ {n}번째 시도에서 “{names}” 확인이 통과하지 못했어요",
    "rowDetails": "검사와 메모 보기",
    "checkPassed": "통과",
    "checkFailed": "실패",
    "checkTimedOut": "시간 초과",
    "exitCode": "명령 반환값 {n}",
    "seconds": "{n}초",
    "gateRun": "진행 담당자가 확인했어요",
    "workerRun": "작업 담당자가 확인했어요",
    "outside": "맡은 파일 밖을 건드림: {files}",
    "changedFiles": "바뀐 파일",
    "unsure": "확신이 낮은 부분",
    "findings": "검토 의견",
    "reason": "되돌린 까닭",
    "showLog": "로그 보기",
    "hideLog": "로그 접기",
    "logFailed": "로그를 읽지 못했어요.",
    "tasks": "일 {n}개 표로 보기",
    "colTask": "일",
    "colStatus": "상태",
    "colWorker": "맡은 곳",
    "colTries": "시도",
    "colWaits": "기다리는 것",
    "showInLog": "이 일의 기록 보기",
    "lessonsCount": "배운 것 {n}개",
    "copied": "복사했어요: {text}",
    "copyFailed": "복사하지 못했어요. 직접 적어 주세요: {text}",
    "copyHint": "눌러서 채팅에 붙여넣을 말을 복사",
    "roleHuman": "나",
    "sessionT3": "담당 대화",
    "sessionClaude": "담당 대화",
    "sessionDashboard": "대시보드",
    "selectHint": "일을 누르면 그 일의 시도와 검사 결과가 여기에 나와요.",
    "attemptsOf": "시도와 검사",
    "runOptionNeeds": "{run}",
    "since": "{time}부터",
    "returnTimes": "이전에 {n}번 돌아왔어요",
    "allDone": "이 흐름이 끝났어요",
    "answerHere": "결정 {id} · 읽고 결정하기",
    "lineOpen": "넘겨줬어요",
    "lineClosed": "아직 넘기지 않았어요",
    "lineWaiting": "내가 할 일을 기다려요",
    "lineReturned": "전달을 기다려요",
    "lineReview": "검토해요",
    "tries": "시도 {n}/{max}",
    "closeDetails": "자세한 내용 닫기",
    "mapDirection": "왼쪽에서 오른쪽으로",
    "checkMet": "✓ {title}",
    "workingHere": "작업 담당자가 진행 중이에요",
    "offLeft": "← 왼쪽",
    "offRight": "오른쪽 →",
    "offTop": "↑ 위쪽",
    "offBottom": "↓ 아래쪽",
    "offCount": "{direction} {n}개",
    "visibleCards": "{summary} · 카드 {n}개가 보여요",
    "graphEdges": "화면 밖의 일로 이동해요",
    "history": "이 일의 시도와 검사 기록",
    "currentAttempt": "지금 시도",
    "earlierAttempt": "이전 시도",
    "gateReview": "답하기 전에 이 결정의 기록을 확인해 주세요.",
    "noAttemptChecks": "이 시도의 검사 결과는 아직 기록되지 않았어요.",
    "previousReason": "이전에 돌아온 까닭: {reason}",
    "offWorking": " · 진행 중 {n}개",
    "offNeeds": " · 내가 할 일 {n}",
    "workerDetails": "작업 담당자 · 받는 것 · 넘기는 것",
    "attemptRecord": "{n}번째 시도의 검사와 메모",
    "earlierFailure": "✕ {n}번째 시도에서 “{reason}” 확인이 통과하지 못했어요",
    "findDecisionHint": "{id} 또는 일 이름",
    "scopeCheck": "맡은 파일만 고쳤는지",
    "noCurrentChecks": "지금 시도의 검사 결과도 아직 없어요.",
    "revisionHint": "고칠 곳을 적으면 보낼 수 있어요",
    "nodeRef": "일 {id}",
    "answeredApproval": "결과를 받아들이기로 답했어요",
    "answeredRevision": "고쳐 달라고 답했어요",
    "answeredRejection": "받아들이지 않기로 답했어요",
    "lineSampleOpen": "전달 완료",
    "lineSampleClosed": "전달 전",
    "lineSampleWaiting": "답변 대기",
    "lineSampleReturned": "반려됨",
    "attemptShort": "{n}번째 시도",
    "earlierHistory": "이전 시도 기록",
    "failureUnknownAttempt": "✕ 기록된 시도에서 “{names}” 확인이 통과하지 못했어요",
    "modelName": "모델: {model}",
    "blindApproval": "채팅에서 에이전트 세션에 결과를 보여 달라고 하거나, 고칠 곳을 적어 돌려보내 주세요.",
    "showDiagram": "선으로 된 그래프 보기",
    "showFlowList": "읽기 쉬운 목록 보기",
    "mapDown": "위에서 아래로",
    "pastReturn": "이전 시도 {n}번 · 고치러 돌아옴",
    "nothingToJudge": "판단할 자료가 없어요",
    "nothingToJudgeBody": "읽을 파일도, 지금 시도의 검사 결과도 없어요. 결과를 보여 달라고 돌려보내거나 채팅에서 다시 물어봐 주세요.",
    "confirmBlind": "파일과 검사 결과 없이 받아들일게요",
    "blindHint": "자료 없이 받아들이려면 확인 상자를 선택해 주세요.",
    "acceptBlind": "자료 없이 받아들이기",
    "minZoom": "최소 배율이에요",
    "readGateHint": "파일이나 근거를 먼저 열어 주세요",
    "approveEffect": "받아들이기로 한 답이 진행 담당자에게 전달돼요",
    "revisionEffect": "고칠 곳이 진행 담당자에게 전달돼요",
    "answerEffect": "답이 진행 담당자에게 전달돼요",
    "retryEffect": "다음은 최대 {max}번 중 {n}번째 시도예요",
    "decisionWork": "관련 일 · {title}",
    "fitAll": "전체 보기",
    "readScale": "읽기 크기",
    "planSummary": "일 {work}개 · 검토 {review}개 · 결정 단계 {decision}개",
    "planStart": "시작",
    "planStartEffect": "진행 담당자가 계획의 일을 시작해요.",
    "planBackEffect": "고칠 내용을 진행 담당자에게 보내요.",
    "planSentBack": "계획을 돌려보냈어요",
    "planWaiting": "계획을 확인해 주세요",
    "planSentNote": "내가 보낸 내용",
    "planWaitingRevision": "진행 담당자가 고친 새 계획을 기다리고 있어요.",
    "planChecks": "자동 검사와 내 확인",
    "plannedCommand": "실행할 명령",
    "planDeliverables": "만들 결과",
    "evSuperseded": "새 계획으로 바뀌었어요",
    "purposePlan": "시작하기 전에 계획을 확인해 주세요.",
    "untitledCheck": "설명이 아직 없는 검사예요",
    "ranCommand": "실행한 명령",
    "returnedBy": "{whoSubject} 돌려보냈어요 · {reason} — 통과하지 못했어요",
    "returnedShort": "{reason} · {whoSubject} 돌려보냈어요",
    "returnLeader": "리더",
    "returnReviewer": "검토자",
    "recordOrder": "같은 시각의 {n}번째 기록",
    "results": "결과 보기",
    "resultLocations": "결과 파일",
    "checkingKey": "◷ 검사받는 중",
    "reviewKey": "⌕ 검토 작업",
    "returnedKey": "↩ 고치러 돌아옴",
    "pendingKey": "○ 시작 전",
    "planChecklist": "자동 검사 {checks}개 · 예정된 내 응답 {decisions}개",
    "planReturned": "돌려보낸 계획",
    "planUnverified": "계획 답의 서명을 확인할 수 없어요",
    "planUnverifiedHelp": "이 답으로는 일을 시작할 수 없어요. 진행 담당자가 계획을 다시 올리면 새 결정에 답해 주세요.",
    "planKeyMismatch": "승인을 확인할 수 없어요. 키 분실·교체, 프로젝트 이동, 기록 변조 중 무엇 때문인지는 알 수 없어요.",
    "planTampered": "계획 파일이 기록과 달라요",
    "planTamperedHelp": "진행 담당자가 계획을 다시 올려야 해요. 새 계획이 올라오면 읽고 시작해 주세요.",
    "planGoal": "실제 지시",
    "planOwns": "맡은 파일",
    "planNeeds": "받는 것",
    "planReads": "읽을 자료",
    "planIntegration": "전체 결과 확인",
    "planPromoted": "이 계획에 포함된 고정 검사",
    "planQuestions": "예정된 내 응답 {decisions}개 · 어디에서 물을까요?",
    "planCardChecks": "자동 검사 {n}개 · {first}",
    "planCardDelivery": "결과 · {files}",
    "planCardQuestion": "내 응답 {n}개 · {question}",
    "noPlannedChecks": "별도 검사가 없어요",
    "supersededNotice": "이전 결정 {old} 대신 현재 결정 {new}에 답해 주세요.",
    "supersededLink": "현재 결정 {id} 보기",
    "checkNotMet": "통과 못 함 · {title}",
    "lineKinds": "선의 뜻",
    "stateKinds": "일의 상태",
    "markKinds": "표시",
    "fromTab": "{tab}에서 온 결정이에요",
    "backToTab": "← {tab}로 돌아가기",
    "endedAttempt": "완료된 시도",
    "commandScope": "제한 시간 · {seconds}초",
    "checkPrompt": "사람에게 물을 내용",
    "checkHost": "확인 도구 · {tool} / 기대 결과 · {expect}",
    "planItems": "일·검토·결정 카드 {n}개",
    "answeredPlan": "이 계획대로 시작하기로 답했어요",
    "exitSuccess": "성공",
    "exitFailure": "실패 · 종료 코드 {n}",
    "planKeyHeading": "확인 키가 바뀌었어요",
    "oldRunApproval": "이전 실행이에요. 진행 담당자가 계획을 다시 올리면 읽고 계속할 수 있어요.",
    "planMissing": "진행 담당자가 계획을 올리기를 기다려요",
    "planMissingHelp": "진행 담당자가 현재 계획을 올리면 읽고 계속할 수 있어요.",
    "planReplaced": "확인할 수 없던 계획을 교체했어요. 모든 일을 다시 확인해 주세요.",
    "unverifiedAnswer": "확인되지 않은 답 · 승인으로 인정되지 않아요",
    "unverifiedAuthor": "답의 서명을 확인할 수 없어요",
    "planLens": "검토 관점",
    "planOutputs": "넘기는 것",
    "runChecksTitle": "전체 결과 확인",
    "runChecksAfter": "모든 일을 마친 뒤 합친 결과가 계획의 통과 조건을 만족하는지 확인해요",
    "runChecksGoal": "계획의 목표",
    "runConstraints": "지켜야 할 조건",
    "countWork": "일 {n}개",
    "countReview": "검토 {n}개",
    "countDecision": "결정 단계 {n}개",
    "countChecks": "자동 검사 {n}개",
    "countQuestions": "자유 질문 {n}개",
    "questionsMark": "? 여기서 물어요",
    "citesCheck": "인용한 파일과 줄이 실제로 있는지",
    "humanCheck": "사람이 결과를 확인해요",
    "hostCheck": "실행 환경에서 확인해요",
    "evRepinned": "확인 키를 새로 만들었어요. 계획을 한 번 더 승인해 주세요.",
    "overviewLevel": "간략 보기",
    "detailLevel": "상세 보기",
    "readableFit": "읽을 수 있는 크기",
    "overviewHelp": "제목만 보여요. 자세한 내용은 카드를 눌러 주세요.",
    "planContinue": "계속",
    "planContinueQuestion": "이 계획대로 계속할까요?",
    "planContinueEffect": "이미 한 일은 유지하고 이어서 진행해요.",
    "warning": "⚠ 진행이 멈춰 있어요",
    "keyRecoveryAfter": "예상하지 못한 변화라면 진행 담당자와 기록부터 확인해 주세요.",
    "copyCommand": "명령 복사",
    "copiedCommand": "복사했어요",
    "projectMoved": "프로젝트 위치가 달라졌어요",
    "projectMovedHelp": "프로젝트나 실행 폴더를 옮기거나 이름을 바꾸면 승인이 무효가 돼요. 진행 담당자가 현재 계획을 다시 올리면 한 번 더 승인해 주세요.",
    "workRecorded": "진행한 작업 기록이 있어요. 새 실행은 승인을 확인할 때까지 멈춰요.",
    "noWorkRecorded": "아직 실행한 작업 기록이 없어요. 승인 전에는 시작하지 않아요.",
    "planOpen": "계획 읽기",
    "futureDelivery": "{who}에서 받아요",
    "visiblePlan": "계획 카드 {total}개{result} · {n}개 제목이 보여요",
    "visibleFarCards": "계획 카드 {total}개{result} · 카드 {n}개가 보여요",
    "minimap": "그래프 미니맵",
    "riskLane": "위험 단계 {n}",
    "riskLegend": "위험 단계",
    "visibleResult": " + 전체 결과 확인 {n}개",
    "listAll": "목록으로 모두 읽기",
    "questionsForNode": "내게 물을 내용",
    "findingsOutput": "검토 의견",
    "approvalOutput": "결정 내용",
    "sessionOther": "작업 대화",
    "runNumber": "실행 {n}",
    "runResultSummary": "결과 · {files}",
    "approvedCommit": "확인할 커밋",
    "evidenceHashes": "파일 확인값 자세히 보기",
    "returnedActor": "{whoSubject} 돌려보냈어요",
    "planChanged": "계획이 바뀌었어요 — 다시 확인해 주세요",
    "decisionChanged": "결정 내용이나 근거가 바뀌었어요 — 다시 확인해 주세요",
    "acknowledgeChange": "바뀐 내용을 확인했어요",
    "changed": "바뀜",
    "added": "추가됨",
    "removed": "빠짐",
    "checkCwd": "검사를 실행할 폴더 · {value}",
    "checkTimeout": "시간 제한 · {value}초",
    "checkEnvironment": "환경 · 실행한 프로세스의 환경을 이어받아요",
    "checkShell": "셸 · {value}",
    "executionContract": "실행 조건 전체",
    "planBehaviour": "검사 단계 {lane} · 최대 {max}번 시도",
    "planIsolation": "작업 공간 · 배정할 때 공유 폴더 또는 별도 작업 폴더를 골라요",
    "planMerge": "커밋한 결과는 프로젝트에 병합한 뒤 통과시켜요",
    "planReviewers": "검토 담당 일 · {value}",
    "evidenceChanged": "결정을 요청한 뒤 파일이나 근거가 바뀌었어요. 이 결정에는 답할 수 없어요.",
    "legacyDecision": "이전 버전의 결정이에요. 진행 담당자가 검사를 다시 요청하면 새 결정이 나타나요.",
    "preapprovalSubmitted": "승인 전에 제출됨",
    "preapprovalExplanation": "계획을 읽기 전에 제출된 결과가 있어요 · 계속하면 이어서 검사해요",
    "keyRecover": "확인 키를 새로 만들어요",
    "keyConfirm": "이 컴퓨터에 새 확인 키를 만들어요. 열려 있는 모든 실행에서 계획 승인을 다시 받아요. 이미 실행한 일은 되돌리지 않아요. 승인 없이 새 일을 시작하는 기능은 아니에요.",
    "keyConfirmAction": "확인 키를 새로 만들어요",
    "attemptResult": "{n}번째 시도 · {result}",
    "decisionTab": "{tab}에서 연 결정",
    "reviewCorrection": "검토 의견을 고쳐야 해요",
    "reviewWaiting": "고친 검토 의견을 기다려요",
    "answerChannel": "답한 곳: {source}",
    "attemptPassed": "통과",
    "attemptReturned": "고치러 돌아옴",
    "reviewCorrectionShort": "검토자가 의견을 고쳐요",
    "reviewWaitingShort": "검토자 답을 기다려요",
    "waitForNewQuestion": "진행 담당자가 다시 물어볼 때까지 기다려 주세요.",
    "keyRepinned": "확인 키를 새로 만들었어요. 계획을 읽고 {action}을 눌러 주세요.",
    "oldResults": "승인 전에 제출된 결과예요. 모두 읽고 계속하면 다음 단계에서 검사해요.",
    "whenAfterWork": "일을 마친 뒤, 받아들이기 전에 물어요.",
    "whenDecision": "앞선 일이 끝난 뒤, 다음 일을 시작하기 전에 물어요.",
    "decisionAccept": "허락하면 다음 일이 차례로 시작될 수 있어요: {tasks}.",
    "decisionReject": "허락하지 않으면 계획을 고쳐서 다시 받을 때까지 다음 일을 시작하지 않아요.",
    "ownCheck": "이 검사는 이 일이 직접 쓰는 파일을 실행해요.",
    "plannedCheck": "검사 항목 · {title}",
    "planChangeIds": "결정 {old}에서 {newParticle} 바뀌었어요. 바뀐 항목을 모두 열어 주세요.",
    "beforeAfter": "이전 → 이후",
    "changesRead": "바뀐 항목을 모두 읽었어요.",
    "roleTool": "작업 흐름 프로그램",
    "checkDetails": "실행 설정 자세히",
    "repeatedSteps": "일 {n}개가 같은 검사 형식이에요. 각 일의 이름과 파일을 확인해 주세요.",
    "field_run": "실행 명령",
    "field_cwd": "실행 폴더",
    "field_timeout_s": "제한 시간",
    "field_goal": "할 일",
    "field_title": "이름",
    "field_owns": "맡은 파일",
    "field_question": "물을 내용",
    "field_prompt": "물을 내용",
    "field_lens": "검토 관점",
    "field_needs": "앞선 일",
    "field_lane": "검사 단계",
    "scopeCheckResult": "맡은 파일만 고쳤어요",
    "citesCheckResult": "인용한 파일과 줄이 있어요",
    "sourceTerminal": "터미널",
    "sourceDashboard": "대시보드",
    "oldRunReposted": "이전 실행의 결과를 읽고 계속할 수 있어요.",
    "keyQuestionReplaced": "확인 키를 새로 만들어 이 질문을 교체했어요.",
    "evidenceQuestionReplaced": "근거가 바뀌어 이 질문을 교체했어요.",
    "planChangesRead": "결정 {old}에서 {newParticle} 바뀌었어요. 바뀐 항목을 모두 확인했어요.",
    "authorNote": "계획에 적힌 설명",
    "freeQuestion": "이 질문의 답은 작업의 통과 여부를 바꾸지 않아요.",
    "freeEffect": "답은 질문한 쪽에게 전달돼요. 이 답만으로는 아무것도 통과되지 않아요.",
    "answeredQuestion": "답한 결정 · {question} · {outcome} · {answer}",
    "whenTrajectory": "수정이 세 번 이상이거나 시간 초과, 범위 이탈, 되돌림이 있으면 결과를 받기 전에 물어요.",
    "crossFamily": "결과를 받기 전에 작업한 쪽과 다른 모델 계열의 검토가 필요해요.",
    "alsoNodeChecks": "이 검사는 {tasks}의 결과를 받을 때와 전체 결과를 확인할 때 실행돼요.",
    "conditionalNodeChecks": "전체 결과를 확인할 때는 모든 검사를 실행해요. 개별 작업은 2·3단계이거나 검사에 필요한 작업으로 지정된 경우에도 검사해요.",
    "checkRequiresPassed": "이 검사에 필요한 작업은 {tasks}이에요. 개별 작업을 검사할 때는 지금 확인하는 작업을 제외한 나머지 필수 작업이 먼저 통과해야 해요.",
    "checkSkipped": "아직 통과하지 않은 작업이 있어 이번 게이트에서 건너뛰었어요 ({tasks}).",
    "requirements": "요청한 내용",
    "viewPlan": "계획 보기",
    "ownCheckMark": "⚠ 검사 파일도 수정 가능",
    "ownCheckEffect": "작업 담당자가 검사 실행에 쓰이는 파일도 바꿀 수 있어요.",
    "holdExact": "통과하지 못한 검사·검토 의견 {n}개가 있어요: {items}. 그래도 받아들일까요?",
    "holdAccept": "{failed}을 받아들여요. 진행 담당자가 남은 통과 조건을 확인해요.",
    "holdReject": "이 결과는 통과하지 않아요. 작업 담당자가 내용을 고쳐야 해요.",
    "returnTrace": "↩ {n}번",
    "inputsReady": "앞선 일은 끝났어요 · 시작을 기다려요",
    "commandDefault": "검사 명령이 성공해요",
    "whos_notStarted": "작업 담당자가 시작해요",
    "whos_running": "작업 담당자가 만들고 있어요",
    "whos_retrying": "작업 담당자가 고치고 있어요",
    "whos_submitted": "진행 담당자가 검사와 검토를 확인해요",
    "whos_verificationPending": "진행 담당자가 남은 검사를 확인해요",
    "whos_failedFinal": "진행 담당자가 실패한 전체 검사를 확인해요",
    "whos_passed": "이 일은 끝났어요",
    "whos_awaiting": "내 답을 기다려요",
    "whos_returned": "작업 담당자가 고쳐요",
    "whos_exhausted": "진행 담당자가 계획을 고쳐요",
    "whos_held": "진행 담당자가 남은 확인을 진행해요",
    "whos_preapprovalSubmitted": "계획 승인 뒤 진행 담당자가 확인해요",
    "durationSeconds": "{value}초",
    "visibleTitles": "{n}개 제목이 보여요",
    "moreDetails": "자세히 보기",
    "holdReviewExact": "검토 일의 의견 {n}개가 통과하지 못했어요: {items}. 그래도 받아들일까요?",
    "questionRef": "질문 {id}",
    "freeRead": "읽고 답하기",
    "evDecisionAsked": "결정 요청",
    "questionClosed": "이 질문은 닫혔어요. 최신 내용을 읽어 주세요.",
    "questionsAnswered": "여기서 답한 내용",
    "newPlanDecision": "새 결정 {new}을 확인해 주세요. 바뀐 항목을 모두 열어 주세요.",
    "newPlanRead": "새 결정 {new}의 바뀐 항목을 모두 확인했어요.",
    "planRevisionState": "계획을 고치기를 기다려요",
    "whos_planRevisionState": "진행 담당자가 계획을 고쳐요",
    "refuse": "허락하지 않기",
    "optionalNote": "덧붙일 말이 있으면 적어 주세요",
    "fileUnread": "열기 · {file}",
    "fileRead": "✓ 읽었어요 · {file}",
    "ownCheckCount": "검사 실행 파일을 맡은 일 {n}개",
    "planGraphReason": "그래프의 모든 카드를 읽은 뒤 {action}할 수 있어요. 목록이나 상세 창을 닫고 흐름을 살펴봐 주세요.",
    "planRemainingReason": "아직 읽지 않은 카드: {names}. 카드 전체가 보이도록 스크롤해 주세요.",
    "checkProgress": "자동 검사 {total}개 중 {passed}개 통과",
    "humanCheckCount": "{n}개는 내가 확인",
    "executionSettings": "시도 횟수와 실행 방식",
    "nodeReference": "일 번호 보기",
    "commitDetails": "제출한 버전 보기",
    "filePath": "파일 위치 보기",
    "freeTab": "{tab}에서 연 질문",
    "freeAnswerHere": "질문 {id} · 읽고 답하기",
    "decisionOnly": "이 결정에는 설명, 근거, 읽을 파일이 없어요.",
    "countPlannedDecision": "예정된 내 응답 {n}개",
    "freeChanged": "질문 내용이나 근거가 바뀌었어요 — 다시 읽어 주세요",
    "keyDecisionReplaced": "확인 키를 새로 만들어 이 결정을 교체했어요.",
    "evidenceDecisionReplaced": "근거가 바뀌어 이 결정을 교체했어요.",
    "freeEvidenceChanged": "질문한 뒤 파일이나 근거가 바뀌었어요. 이 질문에는 답할 수 없어요.",
    "answeredPermission": "허락하기로 답했어요",
    "onlyFinalChecks": "이 검사는 전체 결과를 확인할 때 실행돼요.",
    "permissionNoEvidence": "허락할 내용을 확인할 자료가 없어요. 허락하지 않거나 채팅에서 진행 담당자에게 자료를 요청할 수 있어요.",
    "permissionConfirmBlind": "자료 없이 이 일을 허락할게요",
    "permissionAcceptBlind": "자료 없이 허락하기",
    "permissionBlindHint": "자료 없이 허락하려면 확인 상자를 선택해 주세요.",
    "pendingResponses": "지금 답할 요청 {n}개",
    "yourTurnCount": "내가 할 일 {n}개",
    "authorWhy": "작성자가 적은 이유",
    "scopeBody": "변경한 파일이 이 일에 맡긴 범위 안에 있는지 검사해요.",
    "graphReadDone": "계획 카드 {n}개와 전체 결과 확인 1개를 모두 읽었어요.",
    "changesReadReason": "아직 읽지 않은 카드: {names}. 카드나 변경 항목을 펼쳐 읽어 주세요.",
    "oldReadReason": "이전 제출물과 파일을 모두 읽고 계속해 주세요.",
    "diffAdded": "{value} 추가",
    "diffRemoved": "{value} 삭제",
    "diffEmpty": "값 없음",
    "field_checks": "검사",
    "replacesRefused": "내가 허락하지 않은 결정 {id} 대신 새로 묻는 내용이에요.",
    "answerGiven": "내가 보낸 답 · {answer}",
    "answerExpand": "보낸 답 모두 보기",
    "planItemsTable": "일·검토·결정 카드 {n}개 표로 보기",
    "detailsSummary": "판단 근거",
    "freeAnswerEffect": "답을 진행 담당자에게 전달해요.",
    "offFinal": "전체 결과 확인 1개",
    "genericOutput": "결과",
    "plannedHumanCheck": "내가 확인할 내용 · {title}",
    "cardUnread": "아직 읽지 않음",
    "cardOpenNeeded": "아직 읽지 않음",
    "planUnverifiedSource": "{source}에서 온 답이에요. 서명을 확인할 수 없어요. 결정 {id} · {question}",
    "sourceUnknown": "출처가 기록되지 않은 곳",
    "evidenceTextOnly": "읽을 파일은 없어요. 자세한 근거를 열어 설명과 기록을 확인해 주세요.",
    "failedReviews": "통과하지 못한 검토 의견",
    "failedChecks": "실패한 검사 결과",
    "failedBoth": "실패한 검사 결과와 통과하지 못한 검토 의견",
    "replacesReturned": "내가 돌려보낸 결정 {id} 대신 새로 묻는 내용이에요.",
    "answerOutcome": "{outcome} · 내 답: {answer}",
    "includedIn": "{title}에 포함돼요",
    "planArtifacts": "만드는 결과",
    "diffOther": "설정",
    "diffYes": "사용해요",
    "diffNo": "사용하지 않아요",
    "checkType_cmd": "명령 검사",
    "checkType_scope": "작업 범위 검사",
    "checkType_cites": "인용 근거 검사",
    "checkType_host": "도구 결과 검사",
    "checkType_human": "사람 확인",
    "field_summary": "요약",
    "field_context": "설명",
    "field_type": "검사 종류",
    "field_kind": "일의 종류",
    "field_grade": "작업 규모",
    "field_max_attempts": "최대 시도 횟수",
    "field_effective_lane": "적용 검사 단계",
    "field_isolation": "작업 공간",
    "field_merge": "결과 합치기",
    "field_outputs": "만드는 결과",
    "field_reads": "읽을 자료",
    "field_target": "검토할 일",
    "field_decision_kind": "응답 종류",
    "field_requirement": "요청한 내용",
    "field_requirements": "요청한 내용",
    "field_constraints": "적용 지침",
    "field_text": "내용",
    "field_status": "적용 상태",
    "field_scope": "적용 범위",
    "field_paths": "파일 경로",
    "field_tags": "분류",
    "field_derived_from": "근거가 된 기록",
    "field_review_when": "다시 확인할 때",
    "field_created": "기록 시각",
    "field_from_constraint": "근거 지침",
    "field_added": "추가한 이유",
    "field_tool": "실행 도구",
    "field_expect": "기대하는 결과",
    "field_from": "앞선 일",
    "field_artifact": "주고받는 결과",
    "field_label": "연결 이름",
    "field_integration_checks": "전체 결과 검사",
    "field_promoted_checks": "전체에 적용할 검사",
    "field_why": "확인이 필요한 이유",
    "field_if_approved": "받아들이면",
    "field_if_rejected": "돌려보내면",
    "field_undo": "되돌리는 방법",
    "field_node": "관련 일",
    "field_run_id": "관련 실행",
    "grade_bulk": "반복 작업",
    "grade_scoped": "작은 작업",
    "grade_daily": "일반 작업",
    "grade_large": "큰 작업",
    "grade_security": "보안 작업",
    "constraint_active": "적용 중",
    "constraint_promoted": "전체 검사에 반영",
    "decisionKind_review": "결과 확인",
    "decisionKind_authorization": "허락",
    "decisionKind_direction": "방향 선택",
    "decisionKind_information": "정보 응답",
    "field_shell": "실행 셸",
    "field_environment": "실행 환경",
    "field_attempt": "시도 횟수",
    "field_evidence": "근거 파일",
    "otherRun": "다른 실행의 기록",
    "readOffscreen": " 지금 화면 밖의 카드도 포함해요.",
    "scrollView": "전체 보기 · 스크롤",
    "scrollViewHelp": "글자 크기를 유지했어요. 화면 밖의 카드는 스크롤해서 볼 수 있어요.",
    "remainingCount": "읽을 카드 {n}개가 남았어요.",
    "seeRemaining": "남은 카드 보기",
    "remainingMore": "외 {n}개",
    "unassigned": "아직 배정되지 않았어요",
    "sessionLabel": "세션: {id}",
    "reviewing": "검토하고 있어요",
    "whos_reviewing": "작업 담당자가 검토하고 있어요",
    "unverifiedSource": "{source}에서 온 답이에요. 서명을 확인할 수 없어요.",
    "oldVersionDetails": "이전 실행의 버전: 0.2.1",
    "oldReasked": "이전 실행에서 제출한 결과를 현재 계획에 맞춰 다시 묻는 질문이에요.",
    "oldQuestion": "이전 실행에서 제출한 결과를 받아들일까요?",
    "readEvidenceHint": "자세한 근거를 먼저 열어 주세요.",
    "reviewInput": "검토할 결과",
    "reviewLenses": "검토 관점",
    "ownCheckCards": "{names}: 작업 담당자가 검사 실행에 쓰이는 파일도 바꿀 수 있어요.",
    "qWhy": "왜 묻나요",
    "qChoices": "골라 주세요",
    "qHistory": "지금까지 있었던 일",
    "qVerified": "지금 확인된 것",
    "qTrajectory": "「{title}」 일이 {n}번 만에 제출됐어요. 여러 번 고친 이 결과를 써도 될까요?",
    "qLane3": "「{title}」 결과를 사용하는 일을 허락할까요?",
    "qReplan": "계획이 바뀌었어요. 바뀐 계획대로 계속할까요?",
    "qWhyTrajectory": "세 번 이상 시도했거나, 시간·작업 범위를 넘겼거나 되돌린 일은 사람이 기록을 확인해요.",
    "qWhyPlan": "무엇을 만들고 언제 확인받을지 사람이 정해요.",
    "qWhyHold": "검사나 검토가 통과하지 못해서 사람이 다음 방향을 정해요.",
    "qWhyPermission": "이 일을 허락할지는 사람이 정해야 해요.",
    "qWhyHuman": "자동 검사로 확인할 수 없는 부분을 사람이 살펴봐요.",
    "qWhyFree": "진행 담당자가 필요한 답을 아직 몰라서 물어요.",
    "qWhyReasked": "지난 질문 뒤 내용이나 근거가 바뀌어서 다시 확인해요.",
    "qNext": "남은 확인이 끝나면 {tasks} 일을 시작할 수 있어요.",
    "qFinal": "남은 조건을 확인한 뒤 전체 결과 확인으로 이어져요.",
    "qBlocked": " {tasks} 일은 다른 앞 일이 끝나기를 기다려요.",
    "qExhausted": "이 일은 시도 {max}번을 다 써서, 진행 담당자가 계획을 고쳐 다시 승인을 받아야 해요.",
    "qReturn": "진행 담당자가 고칠 곳을 전달하고 {n}번째 시도를 시작할 수 있어요.",
    "qNoPermission": "진행 담당자가 질문과 계획을 고쳐 다시 올릴 때까지 {tasks} 일이 기다려요.",
    "qPlanNo": "계획을 고쳐 다시 승인받을 때까지 새 일은 시작하지 않아요.",
    "qInspect": "먼저 살펴보기",
    "qInspectEffect": "근거를 열어요. 답은 보내지 않아요.",
    "qPlanInspect": "계획 카드와 바뀐 내용을 읽어요. 답은 보내지 않아요.",
    "qWrite": "답 직접 적기",
    "qLater": "나중에 답하기",
    "qLaterEffect": "질문을 열어 둬요. 이 답을 기다리는 일은 그대로 기다려요.",
    "qAnswerEffect": "고른 답을 진행 담당자에게 보내요. 작업 통과 여부는 바뀌지 않아요.",
    "qNoHistory": "앞선 시도 기록이 없어요.",
    "qNoChecks": "이번 제출에 통과한 자동 검사 기록이 없어요.",
    "qHumanLeft": "사람이 확인할 부분: {question}",
    "qHumanAuto": "자동으로 확인한 것: {items}",
    "qReviewResult": "검토 「{title}」: {result}",
    "qAttempt": "{n}번째 시도 · {state}",
    "qPlanHistory": "계획에 일 {n}개가 있어요. 아래 카드에서 하는 일과 검사 내용을 읽을 수 있어요.",
    "qReaskedHistory": "앞선 질문의 내용이나 근거가 바뀌어 새 질문으로 올라왔어요.",
    "qPlanChecks": "계획의 형식과 연결 관계를 확인했어요. 작업 결과 검사는 아직 별도로 확인해야 해요.",
    "qUnknown": "아직 확인 안 된 것: {items}",
    "qAwaitReview": "검토 기록을 진행 담당자가 아직 확인하지 않았어요.",
    "qPlanStart": "시작하기",
    "qPlanChanged": "「{title}」: {fields} 내용을 바꿨어요.",
    "qPlanAdded": "「{title}」 일을 더했어요.",
    "qPlanRemoved": "「{title}」 일을 뺐어요.",
    "qWait": " {tasks} 일은 기다려요.",
    "qSeveral": "{tasks} 등 {n}개",
    "qSeverity_high": "큰 문제",
    "qSeverity_medium": "고칠 문제",
    "qSeverity_low": "참고할 점",
    "qRunFailed": "전체 검사에서 통과하지 못했어요: {title}",
    "qNodeFailed": "이 일의 검사에서 통과하지 못했어요: {title}",
    "qNotice": "참고해 주세요",
    "qCircular": "「{gate}」 일을 확인할 때 쓰는 「{check}」 검사가 뒤의 「{later}」 일이 만들 파일을 가리켜요.",
    "qBeforeWork": "「{title}」 검사는 {n}번째 시도의 작업 전에 이미 통과했어요.",
    "qBeforeWorkCount": "작업 전에 이미 통과한 검사 {n}개가 있어요."
  },
  "en": {
    "cardKind_work": "Work",
    "cardKind_review": "Review",
    "cardKind_decision": "Decision",
    "cardKind_goal": "Overall result",
    "cardState_notStarted": "Not started",
    "cardState_running": "Running",
    "cardState_reviewing": "Reviewing",
    "cardState_retrying": "Retrying",
    "cardState_submitted": "Awaiting check",
    "cardState_passed": "Done",
    "cardState_awaiting": "Needs your answer",
    "cardState_returned": "Returned",
    "cardState_stalled": "No activity",
    "tag_delivered": "Delivered",
    "tag_frontier": "In use",
    "tag_waiting": "Waiting",
    "tag_unreachable": "Not yet",
    "tag_blocked": "Answer pending",
    "tag_returned": "Returned",
    "cardSession": "Session messages",
    "cardChecks": "Checks and submission",
    "cardThinking": "Thinking (inferred)",
    "cardMinute": "{n} min",
    "cardMinutes": "{n} mins",
    "cardSeconds": "{n} s",
    "cardAttempt": "Attempt {n}",
    "cardLane": "Level {n}",
    "cardWaiting": "· {age} waiting",
    "cardNow": "Now: {category}",
    "cardUnobserved": "Activity not observed",
    "cardUnreadable": "Activity unreadable",
    "activityNameTool": "Tools",
    "activityNameSkill": "Skills",
    "activityNameMcp": "MCP",
    "activityNameSession": "Session communication",
    "activityNameGf": "Graph Flow",
    "activityNameOther": "Other work",
    "activityNameStalled": "No recent activity",
    "activityNameRepeating": "Repeated failures",
    "activityBoundedGap": "Previous gap (thinking inferred)",
    "workActivity": "Work summary",
    "activityAttempt": "Attempt {n}",
    "activityEmpty": "No recorded work yet.",
    "activityUnobserved": "No fine-grained activity observed for this session.",
    "activityUnreadable": "Activity log unreadable.",
    "activityCount": "Calls: {n}",
    "activityKnown": "Distinct tools: {d}",
    "activityDurationUnknown": "Duration unknown",
    "activitySomeUnknown": "Some durations unknown",
    "activityErrors": "Observed errors: {n}",
    "activityReplay": "Replay",
    "activityPause": "Pause",
    "activityResume": "Resume",
    "graphPause": "Pause graph motion",
    "graphResume": "Resume graph motion",
    "activityAttentionCount": "{n} need activity attention",
    "activityTime": "Time",
    "activityCalls": "Calls",
    "activityTotals": "Totals by activity",
    "activityTotalDuration": "Total {time}",
    "activityLongest": "Longest {time}",
    "activityStarted": "Started {time}",
    "activityEnded": "Ended {time}",
    "activityVia_session": "Session match",
    "activityVia_cwd": "Working-directory match",
    "activityVia_single": "Only running attempt",
    "activityVia_unattributed": "Unattributed",
    "activityOrigin_observed": "Observed",
    "activityOrigin_inferred": "Inferred",
    "activityOrigin_mixed": "Observed and inferred",
    "activityOrigin_boundary": "Run record",
    "flowDelivered": "Delivered",
    "flowProgress": "In progress",
    "flowWaiting": "Waiting for source",
    "flowBlocked": "Blocked",
    "flowUnreachable": "Not yet reachable",
    "flowReturned": "Returned for rework",
    "flowCounts": "Delivered {delivered} · In progress {progress} · Waiting {waiting} · Blocked {blocked}",
    "edgeChoose": "Choose a relation",
    "edgeGate": "Gate",
    "edgeFlow": "Flow",
    "edgeArtifact": "Handoff item",
    "edgeGateRecord": "Gate record",
    "edgeFlowRecord": "Flow record",
    "edgeDeliveryRecord": "Delivery record",
    "edgeReturnRecord": "Return record",
    "edgeGateFlowRecord": "Gate and flow record",
    "edgeGateReturnRecord": "Gate and return record",
    "edgeRecordSubmission": "Submission",
    "edgeRecordReview": "Review submission",
    "edgeRecordCheck": "Check",
    "edgeRecordVerdict": "Gate verdict",
    "edgeRecordDecision": "Decision",
    "edgeRecordStart": "Work started",
    "edgeVerdictHold": "Held",
    "edgeVerdictReplan": "Plan revision needed",
    "edgeVerdictUnverified": "Awaiting verification",
    "activityRead": "Reads and searches: {n}",
    "activityTool": "Tool calls: {n}",
    "activitySkill": "Skill calls: {n}",
    "activityMcp": "MCP calls: {n}",
    "activitySession": "Session exchanges: {n}",
    "activityGf": "Graph Flow commands: {n}",
    "activityOther": "Other calls: {n}",
    "activityThinking": "Thinking (inferred)",
    "activityIncludesInferred": "Includes inferred time",
    "activityStart": "Attempt started",
    "activityCheck": "Checks run: {n}",
    "activitySubmit": "Work submitted",
    "activityMore": "{n} more steps",
    "flow": "Whole flow",
    "chooseRun": "Choose a flow",
    "skip": "Skip to content",
    "listView": "Read the graph as a list",
    "nodes": "The work",
    "relationList": "Relations",
    "timePlay": "▶ Play",
    "timePause": "Ⅱ Pause",
    "timeSpeed": "Playback speed",
    "timeLive": "Live",
    "timePast": "Viewing past records",
    "timeLinear": "True time scale",
    "timeScrub": "Time in the run",
    "timeUnits": " d, h, min, s, ms",
    "timeZero": "0 s",
    "timeReturned": "Sent back",
    "timeRevision": "Plan revised · {n}",
    "timeHuman": "Wait for a human answer · {duration}",
    "timeBreak": "Shortened time gap · {duration}",
    "timeFailed": "Past records could not be loaded",
    "spaceView": "Space-time",
    "spaceSide": "Side view",
    "spaceViews": "Graph views",
    "spaceWebGL": "The space-time view requires WebGL 2",
    "spaceViewed": "Viewed time",
    "spaceVerify": "Awaiting verification",
    "spaceHuman": "Waiting for a human answer",
    "spaceUnobserved": "Unobserved work",
    "spaceHandoff": "Handoff",
    "spaceVerdict": "Verdict",
    "spaceCheck": "Check",
    "spaceTransferWait": "Waited {duration}",
    "spaceTransferGroup": "{n} transfers · up to {duration} waiting",
    "spaceActivityCount": "{name} ×{n}",
    "spaceAsked": "Question asked",
    "spaceAnswered": "Answer recorded",
    "spaceNotToScale": "Height exaggerated",
    "spaceRecords": "Records in time order",
    "handoffs": "What is handed over",
    "yourTurn": "Your turn",
    "choiceEffects": "What each choice does",
    "nothing": "It will appear here when something does.",
    "needsYou": "Your turn",
    "done": "Done",
    "doing": "In progress",
    "waiting": "Waiting to begin",
    "needs_you": "Your turn",
    "returned": "Returned for changes",
    "received": "Receives",
    "outputs": "Hands over",
    "noHandoffs": "No handoff is recorded.",
    "delivered": "Delivered",
    "notDelivered": "Not delivered yet",
    "from": "From",
    "to": "To",
    "noReason": "No readable reason was recorded.",
    "attempt": "Attempt {n} · up to {max}",
    "notStarted": "Not started",
    "passed": "Finished",
    "running": "Making it",
    "retrying": "Redoing work that came back",
    "submitted": "Waiting for review",
    "verificationPending": "Verification pending",
    "failedFinal": "Final check failed",
    "awaiting": "Work awaiting my answer",
    "held": "Waiting for the next direction",
    "exhausted": "Needs a new plan",
    "noAction": "Nothing to do here now. You’ll be told if three attempts are not enough.",
    "read": "Read and decide",
    "why": "Why you are needed",
    "verified": "Already verified",
    "unverified": "Not yet verified",
    "workerNote": "Worker note",
    "notRecorded": "Not recorded.",
    "questionOnly": "This question has no explanation, evidence, or attached files.",
    "writeFirst": "Write an answer to send it.",
    "leaveUnanswered": "Go back without answering",
    "aboutWork": "Work details",
    "decisionRef": "Decision {id}",
    "askedBy": "Asked by: {who}",
    "workedBy": "Worker: {who}",
    "find": "Find",
    "findHint": "Decision, question, or step name",
    "findNone": "No decision, question, or step matches “{text}”. Select another flow if needed.",
    "jumpNoRun": "The flow this address points to was not found.",
    "roleLeader": "Coordinator",
    "roleWorker": "Worker",
    "roleReviewer": "Reviewer",
    "ifApproved": "If you proceed",
    "ifRejected": "If sent back",
    "undo": "How to undo",
    "approve": "Approve",
    "sendBack": "Send back",
    "answer": "Send answer",
    "answerLabel": "Write your answer",
    "backReason": "To send it back, describe what needs changing",
    "required": "Please describe what needs changing first.",
    "sending": "Sending…",
    "answerFailed": "Your answer could not be sent. Check the connection and try again.",
    "stale": "This question was answered or changed. Read the refreshed flow.",
    "answered": "Answer sent. The leader session applies it at its next check. If that session has stopped, tell it in the chat that you answered.",
    "details": "Details and raw evidence",
    "loadEvidence": "Read evidence",
    "noEvidence": "No evidence log is recorded.",
    "evidenceFailed": "The evidence could not be read. Please try again.",
    "noProjects": "No project is registered. Start a flow in your project, then reconnect.",
    "noRun": "There is no run yet. Start a flow in your project, then reconnect.",
    "noPlan": "This flow has no plan yet. Add a plan and it will appear here.",
    "unreadable": "This flow cannot be read. Check its records or choose another flow.",
    "lost": "Connection lost. Check that the server is running, then reconnect.",
    "unauthorized": "This window’s key is missing or changed. Run graph-flow open, or ask your agent session to open the dashboard.",
    "retry": "Reconnect",
    "loading": "Reading the flow…",
    "lessons": "What we learned",
    "noLessons": "No lessons recorded yet.",
    "complete": "Everything is done",
    "unnamed": "This task",
    "handoff": "Handoff",
    "overview": "In progress {doing} · Finished {done}/{total}",
    "runOption": "{run}",
    "purposeReview": "Decide whether to accept a result that needs a human look.",
    "purposeAuthorization": "Choose whether to permit this work.",
    "purposeTrajectory": "Decide whether to accept work with an unclean path.",
    "purposeHold": "Decide how to continue work that was put on hold.",
    "purposeDirection": "Tell us which direction to take next.",
    "purposeInformation": "Provide the information needed to continue.",
    "purposeNeutral": "Read the details and decide what to do.",
    "allow": "Allow",
    "accept": "Accept",
    "continue": "Continue",
    "confirmChoice": "Send decision",
    "evidenceReminder": "There is recorded evidence to read before deciding.",
    "decisionClosed": "This decision is no longer open. Your draft was discarded.",
    "runChanged": "The flow changed. The answer form and draft were closed.",
    "brand": "Work flow",
    "failed": "Did not pass",
    "acceptAnyway": "Accept anyway",
    "used_all_attempts": "All three attempts were used.",
    "timed_out": "A check exceeded its time limit.",
    "left_its_files": "Work went beyond its assigned files.",
    "untitledFailure": "A check without a description did not pass.",
    "readThis": "Read this",
    "openFile": "Open file",
    "fileFailed": "This file is no longer available as readable text. Refresh the flow and try again.",
    "noFiles": "No files to read are recorded for this decision.",
    "goal": "Goal",
    "work": "Work",
    "review": "Review",
    "decision": "Decision",
    "handsOver": "hands over",
    "reviews": "reviewed by",
    "waitsForDecision": "waits for a decision",
    "towardGoal": "toward the goal",
    "reviewSentence": "Review {target} through the lens of {lens}.",
    "checksMore": "{n} more checks",
    "fit": "Fit to view",
    "zoomIn": "Zoom in",
    "zoomOut": "Zoom out",
    "mapHelp": "Drag to move · + − zoom · 0 fit",
    "firstPass": "1 attempt",
    "finishedAttempts": "{n} attempts",
    "lineLegend": "Solid → delivered · dashed ⇢ waiting · dotted ↶ review",
    "unusedAttempts": "Up to {max} attempts available",
    "home": "To do and log",
    "graph": "Graph",
    "nothingTitle": "Nothing needs your answer",
    "doingNow": "In progress now",
    "idle": "Nothing is in progress. Work appears here when the leader session starts the next task.",
    "log": "What happened",
    "logEmpty": "Nothing has been recorded yet.",
    "filterEmpty": "No entries match.",
    "filterAll": "All",
    "filterMine": "Your turn",
    "filterReturned": "Returned for changes",
    "onlyNode": "Showing only “{title}”",
    "showAll": "Show all",
    "evStarted": "The run record was created",
    "evPlanned": "Plan posted",
    "evWording": "Wording updated · plan {rev} · earlier plan approval still stands",
    "evQuestionWording": "Wording used in a question changed · {nodes}",
    "evReplanned": "Plan changed · revision {rev}",
    "evRunning": "attempt {n} in progress",
    "evSubmitted": "attempt {n} submitted · waiting to be checked",
    "evPassed": "attempt {n} passed",
    "evReturned": "Attempt {n} · Returned for changes",
    "evReplan": "Attempt {n} · Returned for changes · A revised plan is needed",
    "evNeedsYou": "Attempt {n} · Your turn",
    "evHeld": "attempt {n} · put on hold",
    "evReopened": "reopened",
    "evAsked": "asked",
    "evAnswered": "Answered the question",
    "evFinalPassed": "Whole-result check passed",
    "evFinalFailed": "Whole-result check failed",
    "evLearned": "A lesson was recorded",
    "checksPassed": "{n} automated checks passed",
    "checksFailed": "✕ In attempt {n}, “{names}” did not pass",
    "rowDetails": "Checks and notes",
    "checkPassed": "passed",
    "checkFailed": "failed",
    "checkTimedOut": "timed out",
    "exitCode": "Command return value {n}",
    "seconds": "{n}s",
    "gateRun": "checked by the leader session",
    "workerRun": "checked by the worker session",
    "outside": "touched files outside its own: {files}",
    "changedFiles": "Changed files",
    "unsure": "Low confidence",
    "findings": "Review findings",
    "reason": "Why it came back",
    "showLog": "Show log",
    "hideLog": "Hide log",
    "logFailed": "The log could not be read.",
    "tasks": "{n} tasks as a table",
    "colTask": "Task",
    "colStatus": "Status",
    "colWorker": "Worked by",
    "colTries": "Attempts",
    "colWaits": "Waiting for",
    "showInLog": "Show this task's entries",
    "lessonsCount": "{n} lessons",
    "copied": "Copied: {text}",
    "copyFailed": "Could not copy. Type it instead: {text}",
    "copyHint": "Copy the words to paste into the chat",
    "roleHuman": "you",
    "sessionT3": "Linked conversation",
    "sessionClaude": "Linked conversation",
    "sessionDashboard": "dashboard",
    "selectHint": "Select a task to see its attempts and check results here.",
    "attemptsOf": "Attempts and checks",
    "runOptionNeeds": "{run}",
    "since": "since {time}",
    "returnTimes": "Came back {n} times before",
    "allDone": "This flow is complete",
    "answerHere": "Decision {id} · Read and decide",
    "lineOpen": "handed over",
    "lineClosed": "not handed over yet",
    "lineWaiting": "Waiting for your turn",
    "lineReturned": "Waiting for handoff",
    "lineReview": "reviews",
    "tries": "attempt {n}/{max}",
    "closeDetails": "Close details",
    "mapDirection": "Left to right",
    "checkMet": "✓ {title}",
    "workingHere": "Worker session in progress",
    "offLeft": "← Left",
    "offRight": "Right →",
    "offTop": "↑ Above",
    "offBottom": "↓ Below",
    "offCount": "{direction}: {n}",
    "visibleCards": "{summary} · Visible: {n}",
    "graphEdges": "Go to work beyond this view",
    "history": "Attempts and checks for this work",
    "currentAttempt": "Current attempt",
    "earlierAttempt": "Earlier attempt",
    "gateReview": "Review this decision’s record before answering.",
    "noAttemptChecks": "No check results are recorded for this attempt yet.",
    "previousReason": "Earlier return reason: {reason}",
    "offWorking": " · {n} in progress",
    "offNeeds": " · Your turn {n}",
    "workerDetails": "Worker · inputs · outputs",
    "attemptRecord": "Checks and notes for attempt {n}",
    "earlierFailure": "✕ In attempt {n}, “{reason}” did not pass",
    "findDecisionHint": "{id} or work name",
    "scopeCheck": "whether only assigned files changed",
    "noCurrentChecks": "There are no check results for the current attempt yet.",
    "revisionHint": "Describe what to fix to send it back",
    "nodeRef": "Work {id}",
    "answeredApproval": "Answered: accept the result",
    "answeredRevision": "Answered: request changes",
    "answeredRejection": "Answered: reject the result",
    "lineSampleOpen": "Delivered",
    "lineSampleClosed": "Pending",
    "lineSampleWaiting": "Awaiting answer",
    "lineSampleReturned": "Returned",
    "attemptShort": "Attempt {n}",
    "earlierHistory": "Earlier attempt history",
    "failureUnknownAttempt": "✕ In the recorded attempt, “{names}” did not pass",
    "modelName": "Model: {model}",
    "blindApproval": "Ask the agent session in chat to show the result, or send it back with a note about what to change.",
    "showDiagram": "Show diagram",
    "showFlowList": "Show readable list",
    "mapDown": "Top to bottom",
    "pastReturn": "Earlier attempt {n} returned",
    "nothingToJudge": "There is nothing here to judge by",
    "nothingToJudgeBody": "No file or current check result is recorded. Send it back to request the result, or ask the agent session in chat.",
    "confirmBlind": "I choose to accept without a file or check result",
    "blindHint": "Tick the confirmation box to accept without evidence.",
    "acceptBlind": "Accept without evidence",
    "minZoom": "Minimum zoom",
    "readGateHint": "Open a file or the evidence first",
    "approveEffect": "Your acceptance is sent to the leader session",
    "revisionEffect": "Your requested changes are sent to the leader session",
    "answerEffect": "Your answer is sent to the leader session",
    "retryEffect": "The next attempt is {n} of {max}",
    "decisionWork": "About · {title}",
    "fitAll": "Fit all",
    "readScale": "Readable size",
    "planSummary": "Work: {work} · Reviews: {review} · Decision steps: {decision}",
    "planStart": "Start",
    "planStartEffect": "The coordinator starts the planned work.",
    "planBackEffect": "Send the requested changes to the coordinator.",
    "planSentBack": "The plan was sent back",
    "planWaiting": "Review the plan",
    "planSentNote": "Your requested changes",
    "planWaitingRevision": "Waiting for the coordinator to post a revised plan.",
    "planChecks": "Automated checks and your review",
    "plannedCommand": "Planned command",
    "planDeliverables": "Deliverables",
    "evSuperseded": "Replaced by a new plan",
    "purposePlan": "Review the plan before work starts.",
    "untitledCheck": "A check without a description",
    "ranCommand": "Command run",
    "returnedBy": "Returned by {who} · {reason} — did not pass",
    "returnedShort": "{reason} · Sent back by {who}",
    "returnLeader": "Leader",
    "returnReviewer": "Reviewer",
    "recordOrder": "Record {n} at this time",
    "results": "View results",
    "resultLocations": "Result files",
    "checkingKey": "◷ Being checked",
    "reviewKey": "⌕ Review work",
    "returnedKey": "↩ Returned for changes",
    "pendingKey": "○ Not started",
    "planChecklist": "{checks} automated checks · {decisions} planned responses",
    "planReturned": "Returned plan",
    "planUnverified": "The plan answer signature could not be verified",
    "planUnverifiedHelp": "This answer cannot start work. Ask the coordinator to post the plan again, then answer the new decision.",
    "planKeyMismatch": "Approval cannot be verified. This could be a lost/replaced key, a moved project, or altered records; we cannot tell which.",
    "planTampered": "The plan file differs from its record",
    "planTamperedHelp": "The coordinator must repost the plan. Read it and press Start when it arrives.",
    "planGoal": "Actual instruction",
    "planOwns": "Owned files",
    "planNeeds": "Inputs",
    "planReads": "Materials to read",
    "planIntegration": "Whole-result checks",
    "planPromoted": "Fixed checks in this plan",
    "planQuestions": "Planned responses: {decisions} · where?",
    "planCardChecks": "{n} automated checks · {first}",
    "planCardDelivery": "Delivers · {files}",
    "planCardQuestion": "Responses: {n} · {question}",
    "noPlannedChecks": "No separate checks",
    "supersededNotice": "Answer current decision {new}, which replaces decision {old}.",
    "supersededLink": "Read current decision {id}",
    "checkNotMet": "Did not pass · {title}",
    "lineKinds": "Lines",
    "stateKinds": "Task states",
    "markKinds": "Marks",
    "fromTab": "Decision from {tab}",
    "backToTab": "← Back to {tab}",
    "endedAttempt": "Completed attempt",
    "commandScope": "Time limit · {seconds}s",
    "checkPrompt": "Question for you",
    "checkHost": "Tool · {tool} / Expected result · {expect}",
    "planItems": "{n} task, review and decision cards",
    "answeredPlan": "Agreed to start with this plan",
    "exitSuccess": "Succeeded",
    "exitFailure": "Failed · exit code {n}",
    "planKeyHeading": "The verification key has changed",
    "oldRunApproval": "This is an earlier run. Read and continue after the coordinator posts its plan again.",
    "planMissing": "Waiting for the coordinator to post the plan",
    "planMissingHelp": "Read and continue once the coordinator posts the current plan.",
    "planReplaced": "An unverifiable plan was replaced. Review all work again.",
    "unverifiedAnswer": "Unverified answer · does not count as approval",
    "unverifiedAuthor": "The answer signature could not be verified",
    "planLens": "Review lens",
    "planOutputs": "Outputs",
    "runChecksTitle": "Check the whole result",
    "runChecksAfter": "After all work is finished, check that the combined result meets the plan’s requirements.",
    "runChecksGoal": "Plan goal",
    "runConstraints": "Constraints",
    "countWork": "Work: {n}",
    "countReview": "Reviews: {n}",
    "countDecision": "Decision steps: {n}",
    "countChecks": "{n} automated checks",
    "countQuestions": "Free questions: {n}",
    "questionsMark": "? A question here",
    "citesCheck": "whether cited files and lines exist",
    "humanCheck": "A person checks the result",
    "hostCheck": "Check in the execution environment",
    "evRepinned": "A new verification key was created. Please approve the plan again.",
    "overviewLevel": "Compact",
    "detailLevel": "Show details",
    "readableFit": "Readable size",
    "overviewHelp": "Titles only. Select a card for details.",
    "planContinue": "Continue",
    "planContinueQuestion": "Continue with this plan?",
    "planContinueEffect": "Keep completed work and continue.",
    "warning": "⚠ Work is paused",
    "keyRecoveryAfter": "If this change was unexpected, check the record with the coordinator first.",
    "copyCommand": "Copy command",
    "copiedCommand": "Copied",
    "projectMoved": "Project location changed",
    "projectMovedHelp": "Moving or renaming a project or run folder invalidates approvals. Ask the coordinator to re-post the current plan, then approve once more.",
    "workRecorded": "Work is recorded. New execution waits until approval is verified.",
    "noWorkRecorded": "No work has been recorded. Execution waits for approval.",
    "planOpen": "Read plan",
    "futureDelivery": "To be received by {who}",
    "visiblePlan": "{total} plan cards{result} · {n} titles visible",
    "visibleFarCards": "{total} plan cards{result} · {n} cards visible",
    "minimap": "Graph minimap",
    "riskLane": "Risk level {n}",
    "riskLegend": "Risk level",
    "visibleResult": " + {n} whole-result card",
    "listAll": "Read the complete list",
    "questionsForNode": "For your response",
    "findingsOutput": "Review notes",
    "approvalOutput": "Decision",
    "sessionOther": "Work conversation",
    "runNumber": "Run {n}",
    "runResultSummary": "Results · {files}",
    "approvedCommit": "Commit to approve",
    "evidenceHashes": "File verification details",
    "returnedActor": "Sent back by {who}",
    "planChanged": "The plan changed — please review it again",
    "decisionChanged": "The decision or evidence changed — read it again",
    "acknowledgeChange": "I reviewed the changes",
    "changed": "Changed",
    "added": "Added",
    "removed": "Removed",
    "checkCwd": "Run check in · {value}",
    "checkTimeout": "Time limit · {value} seconds",
    "checkEnvironment": "Environment · inherited from the invoking process",
    "checkShell": "Shell · {value}",
    "executionContract": "Full execution contract",
    "planBehaviour": "Lane {lane} · at most {max} attempts",
    "planIsolation": "Workspace · shared tree or Git worktree, selected at assignment",
    "planMerge": "Committed results must be merged into the project before passing",
    "planReviewers": "Review tasks · {value}",
    "evidenceChanged": "Files or evidence changed after this decision was requested. You cannot answer it.",
    "legacyDecision": "This decision is from an older version. Running the gate requests it again.",
    "preapprovalSubmitted": "Submitted before approval",
    "preapprovalExplanation": "Results were submitted before plan review · Continue resumes checking",
    "keyRecover": "Make a new verification key",
    "keyConfirm": "Creates a new key on this computer. Every open run needs plan approval again. It does not undo completed actions.",
    "keyConfirmAction": "Make a new verification key",
    "attemptResult": "Attempt {n} · {result}",
    "decisionTab": "Decision opened from {tab}",
    "reviewCorrection": "Review findings need correction",
    "reviewWaiting": "Waiting for corrected review findings",
    "answerChannel": "Answered from: {source}",
    "attemptPassed": "Passed",
    "attemptReturned": "Returned for changes",
    "reviewCorrectionShort": "Reviewer corrects findings",
    "reviewWaitingShort": "Waiting for reviewer corrections",
    "waitForNewQuestion": "Please wait for the leader to ask again.",
    "keyRepinned": "The approval key was replaced. Read the plan, then press {action}.",
    "oldResults": "These results were submitted before approval. Read each result; continuing allows them to be checked next.",
    "whenAfterWork": "Asked after the work is submitted, before accepting it.",
    "whenDecision": "Asked after prerequisites finish, before dependent work starts.",
    "decisionAccept": "Permitting this releases these steps in order: {tasks}.",
    "decisionReject": "If you decline, downstream work waits until a revised plan is received.",
    "ownCheck": "This check runs files this task may write.",
    "plannedCheck": "Check expectation · {title}",
    "planChangeIds": "Decision {old} was replaced by {new}. Open each change.",
    "beforeAfter": "Before → after",
    "changesRead": "All changed items have been opened.",
    "roleTool": "Workflow app",
    "checkDetails": "Execution details",
    "repeatedSteps": "{n} tasks share a check format. Review each task name and its files.",
    "field_run": "Command",
    "field_cwd": "Working directory",
    "field_timeout_s": "Timeout",
    "field_goal": "Instructions",
    "field_title": "Title",
    "field_owns": "Owned files",
    "field_question": "Prompt",
    "field_prompt": "Prompt",
    "field_lens": "Review lens",
    "field_needs": "Prerequisites",
    "field_lane": "Gate lane",
    "scopeCheckResult": "Only assigned files changed",
    "citesCheckResult": "Cited files and lines exist",
    "sourceTerminal": "Terminal",
    "sourceDashboard": "Dashboard",
    "oldRunReposted": "Read the results from the earlier run before continuing.",
    "keyQuestionReplaced": "A new verification key replaced this question.",
    "evidenceQuestionReplaced": "Changed evidence replaced this question.",
    "planChangesRead": "Decision {old} was replaced by {new}. All changes read.",
    "authorNote": "Plan author’s note",
    "freeQuestion": "This answer does not change whether the work passes.",
    "freeEffect": "The answer goes to the asker. This answer alone accepts or releases nothing.",
    "answeredQuestion": "Answered decision · {question} · {outcome} · {answer}",
    "whenTrajectory": "Asked before acceptance after three attempts, a timeout, a scope violation, or a rollback.",
    "crossFamily": "Acceptance requires a review from a different model family than the worker.",
    "alsoNodeChecks": "These checks run when accepting {tasks} and when checking the whole result.",
    "conditionalNodeChecks": "The final gate runs all these checks. Lane 2 and 3 work gates and listed producers' own work gates can also run them.",
    "checkRequiresPassed": "This check requires {tasks}. At a work gate, every listed task besides the current one must have passed.",
    "checkSkipped": "Skipped at this gate while waiting for {tasks} to pass.",
    "requirements": "Requirements",
    "viewPlan": "View plan",
    "ownCheckMark": "⚠ Check file can also change",
    "ownCheckEffect": "The worker can also change files used to run the check.",
    "holdExact": "{n} checks or review findings did not pass: {items}. Accept anyway?",
    "holdAccept": "Accept {failed}. The coordinator checks the remaining conditions.",
    "holdReject": "This result does not pass. The coordinator must arrange corrections.",
    "returnTrace": "↩ {n} returns",
    "inputsReady": "Inputs are delivered · waiting to start",
    "commandDefault": "The check command succeeds",
    "whos_notStarted": "The worker starts next",
    "whos_running": "The worker is producing the result",
    "whos_retrying": "The worker is correcting the result",
    "whos_submitted": "The coordinator checks results and reviews",
    "whos_verificationPending": "The coordinator checks what is still unverified",
    "whos_failedFinal": "The coordinator checks the failed final checks",
    "whos_passed": "This piece is finished",
    "whos_awaiting": "Waiting for your answer",
    "whos_returned": "The worker corrects it next",
    "whos_exhausted": "The coordinator revises the plan",
    "whos_held": "The coordinator resolves remaining checks",
    "whos_preapprovalSubmitted": "The coordinator checks it after plan approval",
    "durationSeconds": "{value} seconds",
    "visibleTitles": "{n} titles visible",
    "moreDetails": "Details",
    "holdReviewExact": "Review tasks reported {n} findings that did not pass: {items}. Accept anyway?",
    "questionRef": "Question {id}",
    "freeRead": "Read and answer",
    "evDecisionAsked": "Decision requested",
    "questionClosed": "This question is closed. Read the current question.",
    "questionsAnswered": "Answers given here",
    "newPlanDecision": "Read new decision {new}. Open each change.",
    "newPlanRead": "All changes for new decision {new} have been read.",
    "planRevisionState": "Waiting for a revised plan",
    "whos_planRevisionState": "The coordinator revises the plan",
    "refuse": "Do not permit",
    "optionalNote": "Add a note if you wish",
    "fileUnread": "Open · {file}",
    "fileRead": "✓ Read · {file}",
    "ownCheckCount": "Tasks owning check execution files: {n}",
    "planGraphReason": "Read every graph card before you {action}. Close the list or detail overlay and inspect the flow.",
    "planRemainingReason": "Unread cards: {names}. Scroll to show each whole card.",
    "checkProgress": "{passed} of {total} automated checks passed",
    "humanCheckCount": "{n} for you to review",
    "executionSettings": "Attempts and execution",
    "nodeReference": "Step reference",
    "commitDetails": "Submitted version",
    "filePath": "File location",
    "freeTab": "Question opened from {tab}",
    "freeAnswerHere": "Question {id} · Read and answer",
    "decisionOnly": "This decision has no explanation, evidence, or attached files.",
    "countPlannedDecision": "Planned responses: {n}",
    "freeChanged": "The question or evidence changed — read it again",
    "keyDecisionReplaced": "A new verification key replaced this decision.",
    "evidenceDecisionReplaced": "Changed evidence replaced this decision.",
    "freeEvidenceChanged": "Files or evidence changed after this question. You cannot answer it.",
    "answeredPermission": "Answered: allow this work",
    "onlyFinalChecks": "These checks run when checking the whole result.",
    "permissionNoEvidence": "There is no material to inspect. You can refuse permission or ask the coordinator for material in chat.",
    "permissionConfirmBlind": "I will allow this work without evidence",
    "permissionAcceptBlind": "Allow without evidence",
    "permissionBlindHint": "Tick the confirmation box to allow without evidence.",
    "pendingResponses": "Requests awaiting your answer: {n}",
    "yourTurnCount": "Your turn: {n}",
    "authorWhy": "Author’s reason",
    "scopeBody": "Checks that changed files stay within this task’s assigned paths.",
    "graphReadDone": "Read all {n} plan cards and the 1 whole-result card.",
    "changesReadReason": "Unread cards: {names}. Open each card or change entry to read it.",
    "oldReadReason": "Read each earlier submission and its files before continuing.",
    "diffAdded": "Added {value}",
    "diffRemoved": "Removed {value}",
    "diffEmpty": "No value",
    "field_checks": "Checks",
    "replacesRefused": "This replaces decision {id}, which you did not allow.",
    "answerGiven": "Your answer · {answer}",
    "answerExpand": "Read the full answer",
    "planItemsTable": "Table of {n} task, review and decision cards",
    "detailsSummary": "Decision evidence",
    "freeAnswerEffect": "Send your answer to the coordinator.",
    "offFinal": "1 whole-result card",
    "genericOutput": "result",
    "plannedHumanCheck": "Your review question · {title}",
    "cardUnread": "Unread",
    "cardOpenNeeded": "Unread",
    "planUnverifiedSource": "This answer came from {source}. Its signature could not be verified. Decision {id} · {question}",
    "sourceUnknown": "an unrecorded source",
    "evidenceTextOnly": "There is no file. Open the evidence to read the explanation and records.",
    "failedReviews": "the review findings that did not pass",
    "failedChecks": "the failed check results",
    "failedBoth": "the failed check results and review findings",
    "replacesReturned": "This replaces decision {id}, which you sent back.",
    "answerOutcome": "{outcome} · Your answer: {answer}",
    "includedIn": "Included in {title}",
    "planArtifacts": "Produced artifacts",
    "diffOther": "Setting",
    "diffYes": "Enabled",
    "diffNo": "Disabled",
    "checkType_cmd": "Command check",
    "checkType_scope": "Scope check",
    "checkType_cites": "Citation check",
    "checkType_host": "Tool result check",
    "checkType_human": "Human review",
    "field_summary": "Summary",
    "field_context": "Explanation",
    "field_type": "Check type",
    "field_kind": "Task kind",
    "field_grade": "Task size",
    "field_max_attempts": "Maximum attempts",
    "field_effective_lane": "Effective check level",
    "field_isolation": "Workspace",
    "field_merge": "Merge policy",
    "field_outputs": "Produced artifacts",
    "field_reads": "Materials to read",
    "field_target": "Review target",
    "field_decision_kind": "Response kind",
    "field_requirement": "Requirement",
    "field_requirements": "Requirements",
    "field_constraints": "Constraints",
    "field_text": "Content",
    "field_status": "Applicability",
    "field_scope": "Scope",
    "field_paths": "File paths",
    "field_tags": "Tags",
    "field_derived_from": "Source record",
    "field_review_when": "Review timing",
    "field_created": "Recorded at",
    "field_from_constraint": "Source constraint",
    "field_added": "Reason added",
    "field_tool": "Tool",
    "field_expect": "Expected result",
    "field_from": "Preceding task",
    "field_artifact": "Artifact",
    "field_label": "Connection label",
    "field_integration_checks": "Whole-result checks",
    "field_promoted_checks": "Checks applied to all work",
    "field_why": "Reason for review",
    "field_if_approved": "If accepted",
    "field_if_rejected": "If sent back",
    "field_undo": "How to undo",
    "field_node": "Related task",
    "field_run_id": "Related run",
    "grade_bulk": "Repetitive work",
    "grade_scoped": "Small work",
    "grade_daily": "Everyday work",
    "grade_large": "Large work",
    "grade_security": "Security work",
    "constraint_active": "Active",
    "constraint_promoted": "Applied to whole-result checks",
    "decisionKind_review": "Review",
    "decisionKind_authorization": "Permission",
    "decisionKind_direction": "Direction",
    "decisionKind_information": "Information",
    "field_shell": "Shell",
    "field_environment": "Environment",
    "field_attempt": "Attempt",
    "field_evidence": "Evidence file",
    "otherRun": "A record from another run",
    "readOffscreen": " This includes cards now outside the viewport.",
    "scrollView": "Whole graph · scroll",
    "scrollViewHelp": "Text stays readable. Scroll to see cards outside the viewport.",
    "remainingCount": "{n} cards left to read.",
    "seeRemaining": "Show remaining cards",
    "remainingMore": "and {n} more",
    "unassigned": "Not assigned yet",
    "sessionLabel": "Session: {id}",
    "reviewing": "Reviewing",
    "whos_reviewing": "The worker is reviewing",
    "unverifiedSource": "This answer came from {source}. Its signature could not be verified.",
    "oldVersionDetails": "Earlier run version: 0.2.1",
    "oldReasked": "This question asks again about a result from the earlier run under the current plan.",
    "oldQuestion": "Accept the result submitted in the earlier run?",
    "readEvidenceHint": "Open the detailed evidence first.",
    "reviewInput": "Result to review",
    "reviewLenses": "Review lenses",
    "ownCheckCards": "{names}: the worker can also change files used to run these checks.",
    "qWhy": "Why ask you",
    "qChoices": "Choose an option",
    "qHistory": "What happened so far",
    "qVerified": "What is verified now",
    "qTrajectory": "“{title}” was submitted after {n} attempts. Use this revised result?",
    "qLane3": "Allow use of the result of “{title}”?",
    "qReplan": "The plan changed. Continue with the revised plan?",
    "qWhyTrajectory": "A person reviews three or more attempts, timeouts, scope violations or rollbacks.",
    "qWhyPlan": "You decide the scope and when your review is needed.",
    "qWhyHold": "A check or review failed, so a person decides how to proceed.",
    "qWhyPermission": "Only a person can permit this work.",
    "qWhyHuman": "A person reviews what automatic checks cannot establish.",
    "qWhyFree": "The coordinator needs information they do not yet have.",
    "qWhyReasked": "The question or evidence changed since the previous request.",
    "qNext": "After the remaining checks, these steps can start: {tasks}.",
    "qFinal": "The remaining conditions are checked before checking the whole result.",
    "qBlocked": " {tasks} still wait for other prerequisites.",
    "qExhausted": "All {max} attempts are used. The coordinator must revise the plan and obtain approval again.",
    "qReturn": "The coordinator can pass on the corrections and start attempt {n}.",
    "qNoPermission": "{tasks} wait until the coordinator revises and reposts the question and plan.",
    "qPlanNo": "New work waits for a revised plan and approval.",
    "qInspect": "Inspect first",
    "qInspectEffect": "Open the evidence without sending an answer.",
    "qPlanInspect": "Read the plan cards and changes without sending an answer.",
    "qWrite": "Write an answer",
    "qLater": "Answer later",
    "qLaterEffect": "Leave the question open; work waiting for this answer continues to wait.",
    "qAnswerEffect": "Send the chosen answer to the coordinator; acceptance is unchanged.",
    "qNoHistory": "There are no earlier attempt records.",
    "qNoChecks": "No passing automatic checks are recorded for this submission.",
    "qHumanLeft": "For you to review: {question}",
    "qHumanAuto": "Automatically checked: {items}",
    "qReviewResult": "Review “{title}”: {result}",
    "qAttempt": "Attempt {n} · {state}",
    "qPlanHistory": "The plan has {n} steps. Read their work and checks in the cards below.",
    "qReaskedHistory": "A new question replaces the earlier question after its wording or evidence changed.",
    "qPlanChecks": "Plan structure and dependencies were checked. Work results still need separate checks.",
    "qUnknown": "Not verified yet: {items}",
    "qAwaitReview": "The coordinator has not accepted the review record yet.",
    "qPlanStart": "Start",
    "qPlanChanged": "“{title}”: changed {fields}.",
    "qPlanAdded": "Added “{title}”.",
    "qPlanRemoved": "Removed “{title}”.",
    "qWait": " {tasks} remain blocked.",
    "qSeveral": "{tasks} and others ({n} total)",
    "qSeverity_high": "High severity",
    "qSeverity_medium": "Medium severity",
    "qSeverity_low": "Low severity",
    "qRunFailed": "Run-level check failed: {title}",
    "qNodeFailed": "This step’s own check failed: {title}",
    "qNotice": "Please note",
    "qCircular": "Check “{check}” at “{gate}” references files produced later by “{later}”.",
    "qBeforeWork": "“{title}” passed before observed work on attempt {n}.",
    "qBeforeWorkCount": "{n} checks passed before observed work."
  }
};
// UI_STRINGS_END

export function contractDiff(before,after,path='') {
  if(JSON.stringify(before)===JSON.stringify(after))return [];
  if(Array.isArray(before)||Array.isArray(after)) {
    const keyed=items=>Object.fromEntries((items||[]).map((v,i)=>[v?.id??i,v]));
    return contractDiff(keyed(before),keyed(after),path);
  }
  if(before && after && typeof before==='object' && typeof after==='object') {
    const fields=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(k=>!['id','schema_version'].includes(k)).flatMap(k=>contractDiff(before[k],after[k],path?path+'.'+k:k));
    return (after.type||before.type)?fields.map(f=>({...f,check:after.type?after:before})):fields;
  }
  if((before && typeof before==='object')||(after && typeof after==='object')) {
    const value=before||after;
    if(value.type && (value.run || value.prompt || value.id))return [{field:path,before:before??null,after:after??null}];
    return contractDiff(before||{},after||{},path);
  }
  return [{field:path,before:before??null,after:after??null}];
}
export function actionableDecisions(data, unavailable=[]) {
  if(data.plan_error||data.key_mismatch||data.location_mismatch)return [];
  return (data.decisions||[]).filter(d=>!unavailable.includes(d.id)&&!(data.stale_decisions||[]).some(s=>s.id===d.id));
}
export function titleVisibility(rect,width,height) {
  return !offscreenDirection(rect,width,height);
}
export function checkTypeName(check,language='en') {
  const words=STRINGS[language];return check.title&&check.title!==check.id?check.title:words['checkType_'+check.type]||words.field_checks;
}
export function contractNames(data) {
  const items=[...(data.nodes||[]),...(data.run_contract?.requirements||[]),...(data.run_contract?.constraints||[])];
  return {...Object.fromEntries(items.map(n=>[n.id,n.title||n.text||n.goal])),sourceRun:{id:data.run,title:data.title}};
}
export function contractDiffText(field,language='en',names={}) {
  const words=STRINGS[language],parts=field.field.split('.');
  const group=parts.findIndex(k=>['checks','integration_checks','promoted_checks'].includes(k));
  const labelParts=group<0?parts.map(k=>parts.includes('derived_from')&&k==='run'?'run_id':k):[...parts.slice(0,group+1),...(field.check?[checkTypeName(field.check,language)]:[]),...parts.slice(group+2)];
  const name=labelParts.filter(k=>!/^\d+$/.test(k)).map(k=>words['field_'+k]||names[k]||(field.check&&k===checkTypeName(field.check,language)?k:words.diffOther)).join(' · ');
  return name+' · '+durationDiff(field,language,names);
}
export function releasedNodes(nodes,id) {
  const reached=new Set([id]);let changed=true;
  while(changed){changed=false;for(const n of nodes)if(!reached.has(n.id)&&(n.needs?.some(x=>reached.has(x.from))||n.target&&reached.has(n.target))){reached.add(n.id);changed=true;}}
  return nodes.filter(n=>n.id!==id&&reached.has(n.id));
}
export function stateCounts(nodes,decisions){const counts={};for(const n of nodes){const key=displayState(n,decisions);counts[key]=(counts[key]||0)+1;}return counts;}
export function sameRun(a, b) { return a?.project === b?.project && a?.run === b?.run; }
export function purposeWording(purpose, language = 'en') {
  const keys = {plan_approval:'purposePlan', human_check:'purposeReview', review:'purposeReview', lane3:'purposeAuthorization', authorization:'purposeAuthorization', trajectory:'purposeTrajectory', hold:'purposeHold', direction:'purposeDirection', information:'purposeInformation'};
  const key = Object.hasOwn(keys, purpose) ? keys[purpose] : 'purposeNeutral';
  return STRINGS[language][key];
}
export function purposeAction(purpose, language = 'en', failed = []) {
  if (purpose === 'hold' || failed.length) return STRINGS[language].acceptAnyway;
  const keys = {plan_approval:'planStart', lane3:'allow', authorization:'allow', human_check:'accept', review:'accept', trajectory:'accept', hold:'continue'};
  return STRINGS[language][Object.hasOwn(keys, purpose) ? keys[purpose] : 'confirmChoice'];
}
export function decisionHasEvidence(view, decision) {
  const node=view?.nodes?.find(n=>n.id===decision.node);
  return !!(decision.files?.length || decision.has_evidence || decision.failed?.length || decision.verified?.length || decision.unverified?.length || decision.worker_note || Object.values(decision.context||{}).some(Boolean) || Object.values(decision.author_context||{}).some(Boolean) || (!decision.free && view?.timeline?.some(r=>r.kind==='attempt'&&r.node===decision.node&&r.attempt===node?.attempts&&r.checks?.length)));
}
export function nothingToJudge(view, decision) {
  return decision.purpose !== 'plan_approval' && !decision.free && !['direction','information'].includes(decision.kind) && !decisionHasEvidence(view,decision);
}
export function canApprove(session) {
  if (session?.purpose === 'plan_approval') return true;
  if(session?.decision?.free)return true;
  if (session?.nothingToJudge) return !!session.blindConfirmed;
  return !!session && (!(session.purpose === 'lane3' || session.purpose === 'authorization' ||
    session.kind === 'authorization' || session.purpose === 'hold' || session.failed?.length || session.decision?.files?.length || session.decision?.has_evidence) || session.detailsOpened || (!(session.purpose === 'hold' || session.failed?.length) && session.fileOpened));
}
export function decisionQuestion(d, language="en") {
  const w=STRINGS[language], f=d.facts||{}, format=(key,args)=>w[key].replace(/\{(\w+)\}/g,(_,k)=>args[k]??'');
  if(d.purpose==='plan_approval')return f.reapproval?w.qReplan:f.continuing?w.planContinueQuestion:d.question||w.planQuestion;
  if(!d.free&&d.purpose==='trajectory'&&f.attempts)return format('qTrajectory',{title:d.node_title,n:f.attempts});
  if(!d.free&&d.purpose==='lane3'&&d.node_title)return format('qLane3',{title:d.node_title});
  if(d.node&&d.purpose==='hold'&&!d.free&&d.failed?.length)return format(d.failed_reviews===d.failed.length?'holdReviewExact':'holdExact',{n:d.failed.length,items:d.failed.join('; ')});
  const generated = `Approve ${d.record_purpose ?? d.purpose} for ${d.node}?`;
  const made = ['human_check', 'trajectory', 'lane3'].includes(d.record_purpose ?? d.purpose);
  return made && d.node && d.question === generated ? '' : d.question;
}
export function decisionCopy(d, language='en') {
  const w=STRINGS[language],f=d.facts||{},format=(key,args={})=>w[key].replace(/\{(\w+)\}/g,(_,k)=>args[k]??'');
  const names=items=>{const values=items||[],tasks=values.slice(0,2).map(n=>'「'+n+'」').join(', ');return values.length>2?format('qSeveral',{tasks,n:values.length}):tasks;},tasks=names(f.releases);
  const why=d.free?'qWhyFree':f.reasked&&d.purpose!=='plan_approval'?'qWhyReasked':({plan_approval:'qWhyPlan',trajectory:'qWhyTrajectory',hold:'qWhyHold',lane3:'qWhyPermission',authorization:'qWhyPermission'})[d.purpose]||'qWhyHuman';
  const yes=(tasks?format('qNext',{tasks}):w.qFinal)+(f.blocked?.length?format('qBlocked',{tasks:names(f.blocked)}):'');
  const no=d.purpose==='plan_approval'?w.qPlanNo:f.attempts>=f.max_attempts?format('qExhausted',{max:f.max_attempts}):f.attempts?format('qReturn',{n:f.attempts+1}):format('qNoPermission',{tasks:tasks||d.node_title||w.work});
  return {why:w[why],yes:d.free?w.qAnswerEffect:d.purpose==='hold'?format('holdAccept',{failed:w[d.failed_reviews?(d.failed.length>d.failed_reviews?'failedBoth':'failedReviews'):'failedChecks']})+' '+yes:yes,no:d.free?w.qLaterEffect:no+(tasks&&d.purpose!=='plan_approval'?format('qWait',{tasks}):'')};
}
export function renderCheckInputs(parent,check,language,create) {
  let more;
  for(const [key,value] of Object.entries(checkExecutionFields(check,language))) {
    const row=create(key==='run'?'pre':'p',value,key==='run'?'planned-command':'check-input');
    row.dataset.input=key;if(key==='run'){row.setAttribute('aria-label',STRINGS[language].plannedCommand);parent.append(row);}else{if(!more){more=create('details',undefined,'execution-details');more.append(create('summary',STRINGS[language].checkDetails));parent.append(more);}more.append(row);}
  }
}
export function checkExecutionFields(c,language='en') {
  const words=STRINGS[language], format=(key,value)=>words[key].replace('{value}',String(value));
  return {run:c.run ?? c.command,cwd:format('checkCwd',c.cwd),timeout_s:format('checkTimeout',c.timeout_s),
    environment:words.checkEnvironment,shell:format('checkShell',c.shell)};
}
export function uniqueChecks(checks) {
  const seen=new Set();return checks.filter(c=>{if(c.type!=='cmd')return true;const key=JSON.stringify([c.run||c.command,c.cwd,c.timeout_s,c.shell,c.environment,c.requires_passed]);if(seen.has(key))return false;seen.add(key);return true;});
}
export function createDecisionController() {
  let session = null, view = null, chosen = null;
  const requests = new WeakMap();
  const current = () => !!session && view?.decisions.some(d => d.id === session.target.id);
  const update = d => { const empty = nothingToJudge(view, d); if (empty !== session.nothingToJudge) session.blindConfirmed = false; session.nothingToJudge = empty; session.decision = d; session.purpose = d.purpose; session.kind = d.kind; session.failed = d.failed || []; };
  const controller = {
    get session() { return session; },
    get requiresDetails() { return !!session && !canApprove({...session, nothingToJudge:false, detailsOpened:false, fileOpened:false}); },
    open(id) {
      if (session?.busy) return null;
      const decision = view?.decisions.find(d => d.id === id);
      if (!decision || !chosen) return null;
      if (!session || !sameRun(session.target, chosen) || session.target.id !== id) {
        session = {target:Object.freeze({project:chosen.project, run:chosen.run, id}), draft:'', detailsOpened:false, fileOpened:false, busy:false};
      }
      if(!session.changed)update(decision); return session;
    },
    close() {
      if (session?.busy) return false;
      session = null; return true;
    },
    refresh(nextView, nextChosen) {
      // Keep the submitting view and its target until the response is reported.
      if (session?.busy) return '';
      view = nextView; chosen = nextChosen;
      if (!session) return '';
      const reason = !sameRun(session.target, chosen) ? 'runChanged' : !current() ? (session.decision.free?'questionClosed':'decisionClosed') : '';
      if (reason) session = null;
      else { const next=view.decisions.find(d => d.id === session.target.id);
        if(JSON.stringify(next.identity)!==JSON.stringify(session.decision.identity)){session.changed=true;session.nextDecision=next;}
        else update(next);
      }
      return reason;
    },
    acknowledge() { if(session?.changed){session.changed=false;session.detailsOpened=false;session.fileOpened=false;session.blindConfirmed=false;update(session.nextDecision);} },
    setDraft(text) { if (session && !session.busy) session.draft = text; },
    openDetails() { if (current()) session.detailsOpened = true; },
    openFile() { if (current()) session.fileOpened = true; },
    confirmBlind(value) { if (current()) session.blindConfirmed = !!value; },
    canSubmit(outcome, text = session?.draft || '') {
      if (!current() || session.busy || session.changed) return false;
      const question = ['direction','information'].includes(session.kind);
      if (question ? outcome !== 'answered' : !['approved','revision_requested','rejected'].includes(outcome)) return false;
      return outcome === 'approved' ? canApprove(session) : outcome === 'rejected' && session.decision.record_purpose === 'node' ? true : !!text.trim();
    },
    buildRequest(outcome, text = session?.draft || '') {
      if (!controller.canSubmit(outcome, text)) return null;
      session.draft = text; session.busy = true;
      const request = {...session.target, outcome, answer:text.trim(), displayed:session.decision.identity};
      requests.set(request, session); return request;
    },
    onResult(request, error = null) {
      const matches = !!session && session === requests.get(request) && session.busy;
      requests.delete(request);
      const notice = !error ? 'answered' : error.status === 409 ? 'stale' : 'answerFailed';
      if (matches) {
        session.busy = false;
        if (!error || error.status === 409) session = null;
      }
      return {notice, close:matches && !session, refresh:sameRun(request, chosen)};
    }
  };
  return controller;
}

export function viewLanguage(view, browser = 'en') {
  return view ? view.language === 'ko' ? 'ko' : 'en' : browser.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}
export function cometCount(node) { return (node.laps || []).filter(lap => lap === 'returned').length; }
// Both levels use at least 14px text; 6/7 keeps it at least 12px on screen.
export const MIN_FIT_SCALE = 6 / 7;
const MIN_MAP_SCALE = .7;
const graphDetail = (level,scale) => level==='detail'?'near':scale<MIN_FIT_SCALE?'far':'mid';
export function edgeRelationLabel(edge, language = 'en') {
  const words = STRINGS[language];
  if (edge.relation === 'toward_goal') return words.towardGoal;
  const name=({reviews:words.reviews,waits_for_decision:words.waitsForDecision})[edge.relation] || words.handsOver;
  return name + (edge.label ? ': ' + edge.label : '');
}
const GATE_LABELS = {open:'lineSampleOpen', closed:'lineSampleClosed', waiting_for_you:'lineSampleWaiting', returned:'lineSampleReturned'};
const FLOW_LABELS = {delivered:'flowDelivered',frontier:'flowProgress',waiting:'flowWaiting',blocked:'flowBlocked',
  unreachable:'flowUnreachable',returned:'flowReturned'};
export const FLOW_MARKS = {
  unreachable: [[[-3,0],[0,-3],[3,0],[0,3],[-3,0]]],
  waiting: [[[-7,0],[-2,0]],[[2,0],[7,0]]],
  delivered: [[[-9,0],[9,0]]],
  frontier: [[[-10,-2],[10,-2]],[[-10,2],[10,2]]],
  blocked: [[[-3,-4],[-3,4]],[[3,-4],[3,4]]],
  returned: [[[-1,-4],[-7,0],[-1,4]],[[7,-4],[1,0],[7,4]]],
};
const toneForFlow = (cue) => cue==='returned'?'failure':cue==='frontier'?'live':
  cue==='unreachable'||cue==='waiting'?'quiet':'structure';
export const cardStateWord = (state, language) => STRINGS[language]['cardState_'+state] || stateWords(state,language).name;
const runningCard = state => ['running','reviewing','retrying'].includes(state);
const clamp = n => Math.max(0,Math.min(1,n));

export function edgeTag(edge, language = 'en') {
  const cue = flowCue(edge.flow) || (edge.gate==='open'?'delivered':'unreachable');
  const kind = {reviews:'review',waits_for_decision:'decision'}[edge.relation];
  return {cue, text:[kind && STRINGS[language]['cardKind_'+kind], STRINGS[language]['tag_'+cue]].filter(Boolean).join(' '),
    tone:toneForFlow(cue)};
}

function graphAttempt(node) {
  return node.activity?.findLast(attempt => attempt.attempt == null || attempt.attempt===node.attempts);
}

export function cardFacts(node, decisions, now, language = 'en') {
  const kind=node.kind || 'work';
  const attempt=graphAttempt(node);
  const recordedState=displayState(node,decisions);
  const state=runningCard(recordedState)&&attempt?.stalled?'stalled':recordedState;
  const observed=attempt?.status==='observed';
  const ask=decisions.filter(d=>d.node===node.id).map(d=>Date.parse(d.asked))
    .filter(at=>Number.isFinite(at)&&at<=now).sort((a,b)=>b-a)[0];
  const stamp=call=>call.start_ms??call.end_ms;
  const calls=observed ? (attempt.calls||[]).filter(call=>stamp(call)<=now)
    .sort((a,b)=>stamp(a)-stamp(b)||a.id.localeCompare(b.id)) : [];
  const active=runningCard(state) ? calls.findLast(c=>c.start_ms!=null && (c.end_ms==null||c.end_ms>now)) : null;
  const totals=Object.entries(attempt?.totals||{}).filter(([,total])=>total.count||total.duration_ms)
    .sort(([a,x],[b,y])=>y.duration_ms-x.duration_ms||a.localeCompare(b)).slice(0,3)
    .map(([category,total])=>({category,duration:total.duration_ms}));
  return {kind,state,word:cardStateWord(state,language),kindWord:STRINGS[language]['cardKind_'+kind],
    attempt:node.attempts>1?node.attempts:null,lane:(node.effective_lane??node.lane)||null,
    now:active?.category||null,activeCall:active?.id||null,calls,totals,ask,
    unread:attempt&&!observed?attempt.status:null,
    age:state==='awaiting'&&ask!=null?Math.floor((now-ask)/60000):
      state==='stalled'&&attempt?.last_ms!=null?Math.max(0,Math.floor((now-attempt.last_ms)/60000)):null};
}
const flowCue = flow => flow?.frontier ? 'frontier' : flow?.state;
const edgeKey = edge => JSON.stringify([edge.from,edge.to,edge.relation,edge.label||'']);
const RELATION_MARKS = {
  hands_over:{paths:[[[0,0],[10,5],[0,10]]], fill:true},
  waits_for_decision:{paths:[[[1,1],[9,5],[1,9]]], fill:false},
  reviews:{paths:[[[1,1],[5,5],[1,9]],[[5,1],[9,5],[5,9]]], fill:false},
};
// A handoff chip names the delivered item.
export function edgeChipText(edge) {
  return (edge.relation || 'hands_over') === 'hands_over' && edge.label ? edge.label : '';
}
export const STATE_VOCABULARY = Object.fromEntries(['notStarted','running','reviewing','retrying','submitted','passed','awaiting','returned','exhausted','held','preapprovalSubmitted','planRevisionState','verificationPending','failedFinal'].map(state=>[state,{name:state,whoseMove:'whos_'+state}]));
export function stateWords(state, language='en') {
  const entry=STATE_VOCABULARY[state] || STATE_VOCABULARY.notStarted;
  return {name:STRINGS[language][entry.name],whoseMove:STRINGS[language][entry.whoseMove]};
}
export function particle(value, pair='이/가') {
  const text=String(value), last=text.at(-1)||'', digit='영일이삼사오육칠팔구';
  const char=/[0-9]/.test(last)?digit[Number(last)]:last, code=char.charCodeAt(0)-0xac00;
  const final=code>=0&&code<11172?code%28: /[bcdfghjklmnpqrstvwxyz]/i.test(char)?1:0;
  const [closed,open]=pair.split('/'); return text+(final && !(pair==='으로/로'&&final===8)?closed:open);
}
export function durationDiff(field, language='en', names={}) {
  const words=STRINGS[language],key=field.field.split('.').at(-1);
  const format=value=>{
    if(value==null||value==='')return words.diffEmpty;
    if(typeof value==='object')return [checkTypeName(value,language),value.run||value.command,value.timeout_s!=null?words.field_timeout_s+' '+words.durationSeconds.replace('{value}',value.timeout_s):'',value.prompt,value.tool?words.field_tool+' '+value.tool:'',value.expect?words.field_expect+' '+value.expect:''].filter(Boolean).join(' · ');
    if(key==='run'&&field.field.split('.').includes('derived_from'))return names.sourceRun?.id===value?names.sourceRun.title:words.otherRun;
    if(key==='timeout_s')return words.durationSeconds.replace('{value}',value);
    if(key==='type')return words['checkType_'+value]||words.field_checks;
    if(key==='kind')return words[value]||words.diffOther;
    if(key==='grade')return words['grade_'+value]||words.diffOther;
    if(key==='decision_kind')return words['decisionKind_'+value]||words.diffOther;
    if(key==='status')return words['constraint_'+value]||words.diffOther;
    if(key==='environment')return words.checkEnvironment;
    if(key==='isolation')return words.planIsolation;
    if(key==='merge')return words.planMerge;
    if(['from','target','requirement','from_constraint','node'].includes(key))return names[value]||words.notRecorded;
    if(typeof value==='boolean')return words[value?'diffYes':'diffNo'];
    return String(value);
  };
  if(field.before==null)return words.diffAdded.replace('{value}',format(field.after));
  if(field.after==null)return words.diffRemoved.replace('{value}',format(field.before));
  return format(field.before)+' → '+format(field.after);
}
export function displayState(node, decisions = []) {
  if(node.plan_revision_wait)return 'planRevisionState';
  if(node.preapproval_submission)return 'preapprovalSubmitted';
  if (decisions.some(d => d.node === node.id)) return 'awaiting';
  if (node.status === 'passed' || node.answered) return 'passed';
  if (node.status === 'running') return node.kind==='review'?'reviewing':node.attempts > 1 ? 'retrying' : 'running';
  if (node.runLevel && node.status === 'failed') return 'failedFinal';
  if (node.status === 'submitted') return 'submitted';
  if (node.status === 'unverified') return 'verificationPending';
  if (['replan','exhausted'].includes(node.status)) return 'exhausted';
  if (node.status === 'rejected') return 'returned';
  if (['held','awaiting_approval'].includes(node.status)) return 'held';
  return 'notStarted';
}
export function statusGlyph(state) {
  return {planRevisionState:'↻',preapprovalSubmitted:'⇥', passed:'✓', reviewing:'⌕', running:'▶', retrying:'↪', submitted:'↥', awaiting:'◆', returned:'↩', stalled:'◴', notStarted:'○', exhausted:'!', held:'Ⅱ', verificationPending:'…', failedFinal:'✕'}[state];
}
export function commandTitle(check) {
  const command = check.command || check.run;
  return !!command && (!check.title || check.title === check.id || check.title === command || [STRINGS.ko.commandDefault, STRINGS.en.commandDefault].includes(check.title));
}
export function snapTitleOffset(position,size,maximum,titles){
  const intervals=titles.flatMap(([a,b])=>[[a,b],[a-size,b-size]]).sort((a,b)=>a[0]-b[0]);
  const merged=[];
  for(const [a,b] of intervals){const last=merged.at(-1);if(last&&a<last[1]-.01)last[1]=Math.max(last[1],b);else merged.push([a,b]);}
  const hit=merged.find(([a,b])=>position>a+.01&&position<b-.01);if(!hit)return position;
  const candidates=hit.filter(v=>v>=0&&v<=maximum);
  return candidates.sort((a,b)=>Math.abs(a-position)-Math.abs(b-position))[0]??position;
}
export function checkTitle(check, language = 'en') {
  if(!check.title&&['scope','cites'].includes(check.type||check.id)&&check.result==='passed')return STRINGS[language][(check.type||check.id)+'CheckResult'];
  return commandTitle(check) ? check.command || check.run : check.title && check.title !== check.id ? check.title : check.command || check.run || check.prompt || STRINGS[language][{scope:'scopeCheck',cites:'citesCheck',human:'humanCheck',host:'hostCheck'}[check.type || check.id]] || check.id;
}
export function checkWording(check, language = 'en', attempt = check.attempt) {
  const key = check.result === 'passed' ? 'checkMet' : 'checkNotMet';
  return STRINGS[language][key].replace('{title}', checkTitle(check, language)).replace('{names}', checkTitle(check, language)).replace('{n}', attempt);
}
// Every clipped card belongs to one nearest boundary, including diagonal corners.
export function offscreenDirection(rect, width, height) {
  const outside = [['offLeft',-rect.x-rect.width],['offRight',rect.x-width],['offTop',-rect.y-rect.height],['offBottom',rect.y-height]].filter(([,gap])=>gap>=0);
  if(outside.length)return outside.sort((a,b)=>a[1]-b[1])[0][0];
  const gaps = [['offLeft', -rect.x], ['offRight', rect.x + rect.width - width], ['offTop', -rect.y], ['offBottom', rect.y + rect.height - height]].filter(([,gap]) => gap > .5);
  return gaps.sort((a,b) => a[1]-b[1])[0]?.[0] || null;
}
export function intersectsViewport(rect, width, height) {
  return rect.x < width && rect.y < height && rect.x + rect.width > 0 && rect.y + rect.height > 0;
}
const textWidth = (text, wide, narrow) => Array.from(text || '').reduce((sum, c) => sum + (c.charCodeAt(0) > 0x2e80 ? wide : narrow), 0);
export function overviewMarkText(marks) {
  const text=marks.join(' · ');
  return textWidth(text,14,8)>134 ? marks.map(mark=>Array.from(mark)[0]).join(' · ') : text;
}
export function fitScale(bounds, width, height, mobile = false) {
  const available = Math.min(width / bounds.width, height / bounds.height);
  return Math.max(MIN_FIT_SCALE, Math.min(1, available));
}
// A fixed level is used for selection resizing; only opening and Fit choose a richer level.
export function fitGraph(layouts, width, height, fixedLevel = null) {
  for (const level of fixedLevel ? [fixedLevel] : ['detail', 'overview']) {
    const layout = layouts[level], scale = fitScale(layout.bounds, width, height);
    const fits = layout.bounds.width * scale <= width && layout.bounds.height * scale <= height;
    if (fits || level === (fixedLevel || 'overview')) return {level, scale, fits};
  }
}
export function zoomLevel(level, scale, amount) {
  const next = scale + amount;
  if (level === 'overview' && next > 1) return {level:'detail', scale:1};
  if (level === 'detail' && next < MIN_FIT_SCALE) return {level:'overview', scale:1};
  const minimum = level === 'overview' ? MIN_MAP_SCALE : MIN_FIT_SCALE;
  return {level, scale:Math.max(minimum, Math.min(level === 'overview' ? 1 : 1.6, next))};
}
// Preserve the nearest card's local point when its layout changes size.
export function mapAnchor(before, after, point) {
  const rects = before.cards || before.cardRects;
  const distance = r => Math.hypot(Math.max(r.x-point.x,0,point.x-r.x-r.width), Math.max(r.y-point.y,0,point.y-r.y-r.height));
  const rect = [...rects].sort((a,b)=>distance(a)-distance(b))[0];
  if (!rect || !after.positions[rect.id]) return point;
  const next = after.positions[rect.id];
  return {x:next.x+(point.x-rect.x)*next.width/rect.width, y:next.y+(point.y-rect.y)*next.height/rect.height};
}
export function planCounts(counts = {}, language = 'en', details = false) {
  const keys = [['work','countWork'],['review','countReview'],['decision','countDecision']];
  if (details) keys.push(['checks','countChecks'],['decisions','countPlannedDecision']);
  return keys.filter(([key]) => counts[key] > 0).map(([key,word]) => STRINGS[language][word].replace('{n}',counts[key])).join(' · ');
}
export function nodeSentence(node, nodes = [], language = 'en') {
  if(node.runLevel)return STRINGS[language].runChecksAfter;
  if(node.summary || node.goal)return node.summary || node.goal;
  if(node.kind==='review')return STRINGS[language].reviewSentence.replace('{target}',nodes.find(n=>n.id===node.target)?.title || node.target || '').replace('{lens}',Array.isArray(node.lens)?node.lens.join(' · '):node.lens || STRINGS[language].review);
  return node.question || node.contract?.question || '';
}
export function planFlow(data, language = 'en') {
  if (!data.nodes.length || data.plan_error) return data;
  const id = '_run_checks', strings = STRINGS[language];
  const checks = [...(data.integration_checks || []), ...(data.promoted_checks || [])];
  const node = {id, kind:'goal', title:strings.runChecksTitle, summary:strings.runChecksAfter,
    goal:data.goal, runLevel:true, plan_revision_wait:data.nodes.some(n=>n.plan_revision_wait), status:data.complete?'passed':data.final_result==='failed'?'failed':data.final_result==='unverified'?'unverified':'pending', attempts:0,
    owns:[], needs:[], reads:[], declared_outputs:[], inputs:[], outputs:[], deliverables:[],
    planned_checks:checks, returned_reasons:[], laps:[]};
  const terminal = data.nodes.filter(n => !data.edges.some(e => e.from === n.id));
  const edges=[...data.edges,...terminal.map(n=>({
    from:n.id,to:id,relation:'hands_over',label:'',gate:n.status==='passed'?'open':'closed',delivered:n.status==='passed',
    ...(data.goal_flows?.[n.id] ? {flow:data.goal_flows[n.id]} : {}),runLevel:true}))];
  const nodes=[...data.nodes,node].map(n=>({...n,inputs:[],outputs:[]})),byId=new Map(nodes.map(n=>[n.id,n]));
  for(const edge of edges) {
    const from=byId.get(edge.from),to=byId.get(edge.to);if(!from||!to)continue;
    to.inputs.push({...edge,other_id:from.id,other_title:from.title});
    from.outputs.push({...edge,other_id:to.id,other_title:to.title});
  }
  return {...data,nodes,edges};
}

export function fitStart(layout, width, height, scale, nodes = [], plan = true) {
  if (layout.bounds.width*scale<=width && layout.bounds.height*scale<=height) return {left:0,top:0};
  const id = !plan && layout.order.find(id => nodes.some(n => n.id === id && !n.runLevel && n.status !== 'passed' && !n.answered));
  const first=layout.positions[id || layout.order[0]];
  return first?{left:Math.max(0,first.x*scale-28),top:Math.max(0,first.y*scale-28)}:{left:0,top:0};
}

export function crossingCount(routes, positions) {
  const cross = (a,b,c) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  let count=0;
  routes.forEach((e,i) => routes.slice(i+1).forEach(f => {
    const a=positions[e.from],b=positions[e.to],c=positions[f.from],d=positions[f.to];
    if(a&&b&&c&&d&&new Set([e.from,e.to,f.from,f.to]).size===4&&cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)count++;
  }));
  return count;
}
export function detailCardHeight(node) {
  const facts=(node.deliverables?.length?1:0)+(node.planned_checks?.length?1:0)+(node.runLevel?1:0);
  return 112+facts*27+(node.planned_checks?.some(c=>c.runs_own_files)?32:0)+(node.kind==='decision'?32:0)+(node.kind==='review'||node.reviewers?.length?28:0)+(node.planned_checks?.some(c=>c.type==='human')||node.kind==='decision'?27:0);
}
function simplifyRoute(points) {
  const distinct=points.filter((p,i)=>!i||p.x!==points[i-1].x||p.y!==points[i-1].y);
  return distinct.filter((p,i,a)=>!i||i===a.length-1||
    !((a[i-1].x===p.x&&p.x===a[i+1].x)||(a[i-1].y===p.y&&p.y===a[i+1].y)));
}

// Assign one track to each eligible fan or individual relation in this channel.
function routeChannel(channel,vertices,routes,right,next,inset,shared) {
  const pieces=channel.map(link=>{
    const {from,to,route}=link;
    return {route,a:{v:vertices.get(from)},b:{v:vertices.get(to)}};
  });
  const grouped=new Map(), tracks=[];
  const far=shared==='a'?'b':'a';
  for(const piece of pieces) {
    const r=routes[piece.route];
    let track;
    if(shared&&!piece.a.v.dummy&&!piece.b.v.dummy) {
      const key=JSON.stringify([piece[shared].v.id,r.relation||'hands_over',r.gateState,r.label||'']);
      track=grouped.get(key);
      if(track?.pieces.some(other=>other[far].v===piece[far].v))track=null;
      if(!grouped.has(key))grouped.set(key,track={pieces:[],shared});
    }
    if(!track)track={pieces:[],shared:null};
    if(!track.pieces.length)tracks.push(track);
    track.pieces.push(piece);
    piece.track=track;
  }

  const center=v=>v.y+v.height/2;
  const ports={a:new Map(),b:new Map()};
  for(const side of ['a','b']) {
    const other=side==='a'?'b':'a';
    for(const p of pieces){
      const end=p[side], cardPorts=ports[side].get(end.v)||[];
      ports[side].set(end.v,cardPorts);
      let port=side===p.track.shared?cardPorts.find(port=>port.track===p.track):null;
      if(!port){port={track:p.track,v:end.v,side,count:0,toward:0};cardPorts.push(port);}
      port.count++;
      port.toward+=center(p[other].v);
      end.port=port;
    }
    for(const [v,list] of ports[side]){
      list.sort((a,b)=>a.toward/a.count-b.toward/b.count);
      list.forEach((port,i)=>{
        port.y=v.port??(v.y+v.height*(i+1)/(list.length+1));
      });
    }
  }
  // Leads may share an ordinate only for a straight connection or a common port.
  const all=['a','b'].flatMap(side=>[...ports[side].values()].flat());
  const limits=port=>{
    if(port.v.dummy)return [port.y,port.y];
    const list=ports[port.side].get(port.v),i=list.indexOf(port);
    const low=i?list[i-1].y+14:port.v.y+12;
    const high=i+1<list.length?list[i+1].y-14:port.v.y+port.v.height-12;
    return [low,high];
  };
  const available=(ideal,low,high,occupied)=>{
    for(let d=0;d<=Math.ceil(high-low)*2;d++){
      const y=ideal+(d%2?1:-1)*Math.ceil(d/2);
      if(y>=low&&y<=high&&occupied.every(port=>Math.abs(port.y-y)>=1))return y;
    }
  };
  // Fixed dummy leads take precedence. Move a colliding real port locally without changing port order.
  const placed=all.filter(p=>p.v.dummy);
  for(const port of all.filter(p=>!p.v.dummy)){
    port.y=available(port.y,...limits(port),placed)??port.y;
    placed.push(port);
  }
  for(const track of tracks){
    const aligned=[...track.pieces].sort((p,q)=>Math.abs(p.a.port.y-p.b.port.y)-Math.abs(q.a.port.y-q.b.port.y));
    for(const {a,b} of aligned){
      const [al,ah]=limits(a.port),[bl,bh]=limits(b.port);
      const low=Math.max(al,bl),high=Math.min(ah,bh);
      const ideal=Math.max(low,Math.min(high,(a.port.y+b.port.y)/2));
      const y=available(ideal,low,high,all.filter(p=>p!==a.port&&p!==b.port));
      if(y===undefined)continue;
      a.port.y=b.port.y=y;
      break;
    }
  }
  const ordered=(a,b)=>a.y-b.y;
  for(const track of tracks) {
    track.a=[...new Set(track.pieces.map(p=>p.a.port))].sort(ordered);
    track.b=[...new Set(track.pieces.map(p=>p.b.port))].sort(ordered);
    const ys=[...track.a,...track.b].map(p=>p.y);
    track.low=Math.min(...ys);track.high=Math.max(...ys);
  }
  // For fixed ports, a pair's crossing cost depends only on which track is on the left.
  const inside=(track,port)=>port.y>track.low&&port.y<track.high;
  const costs=new Map(tracks.map(a=>[a,new Map(tracks.map(b=>[b,
    b.a.filter(p=>inside(a,p)).length+a.b.filter(p=>inside(b,p)).length]))]));
  tracks.sort((a,b)=>(a.b[0].y-a.a[0].y)-(b.b[0].y-b.a[0].y)||a.pieces[0].route-b.pieces[0].route);
  for(let sweep=0;sweep<4;sweep++)for(const track of [...tracks]) {
    const index=tracks.indexOf(track);
    let best=index,delta=0,bestDelta=0;
    for(let j=index-1;j>=0;j--){
      const other=tracks[j];delta+=costs.get(track).get(other)-costs.get(other).get(track);
      if(delta<bestDelta){best=j;bestDelta=delta;}
    }
    delta=0;
    for(let j=index+1;j<tracks.length;j++){
      const other=tracks[j];delta+=costs.get(other).get(track)-costs.get(track).get(other);
      if(delta<bestDelta){best=j;bestDelta=delta;}
    }
    if(best!==index){tracks.splice(index,1);tracks.splice(best,0,track);}
  }
  let crossings=0,bends=0,runs=0,length=0;
  tracks.forEach((track,i)=>{
    track.x=right+inset+(next-right-inset*2)*(i+1)/(tracks.length+1);
    for(const other of tracks.slice(i+1))crossings+=costs.get(track).get(other);
    runs+=track.a.length+track.b.length+(track.high!==track.low?1:-1);
    for(const p of track.pieces) {
      const a={x:right,y:p.a.port.y},b={x:next,y:p.b.port.y};
      p.points=simplifyRoute([a,{x:track.x,y:a.y},{x:track.x,y:b.y},b]);
      if(a.y!==b.y)bends+=2;
      length+=next-right+Math.abs(a.y-b.y);
    }
  });
  return {tracks:tracks.map(({x,shared,pieces})=>({x,shared,pieces:pieces.map(({route,points})=>({route,points}))})),crossings,bends,runs,length};
}

export function layeredLayout(nodes, edges, decisions = [], sort = true, options = {}) {
  const overview = options.level === 'overview', portGap = 20, inset = overview ? 12 : 26;
  const byId = new Map(nodes.map(n => [n.id, n])), vertices = new Map(), links = [];
  const routes = edges.filter(e => byId.has(e.from) && byId.has(e.to)).map((e,index) => {
    return {...e,index,text:overview||options.instrument?'':edgeChipText({...e,label:e.displayLabel ?? e.label}),chip:null,gateState:e.gate || 'closed'};
  });
  const parents = id => routes.filter(e => e.to === id).map(e => e.from);
  const depths = new Map();
  const depth = (id, seen = new Set()) => {
    if (depths.has(id)) return depths.get(id);
    if (seen.has(id)) return 0;
    const next = new Set(seen); next.add(id);
    const d = Math.max(0,...parents(id).filter(p => !next.has(p)).map(p => depth(p,next)+1));
    depths.set(id,d); return d;
  };
  const layers = [];
  for (const n of nodes) {
    const d = depth(n.id); vertices.set(n.id,{id:n.id,layer:d,node:n}); (layers[d] ||= []).push(n.id);
  }
  // A long edge occupies a real slot in every intervening layer, not an outside detour.
  for (const r of routes) {
    r.chain = [r.from];
    for (let d=depth(r.from)+1; d<depth(r.to); d++) {
      const id = `\u0000${r.index}:${d}`; vertices.set(id,{id,layer:d,dummy:true,route:r.index}); layers[d].push(id); r.chain.push(id);
    }
    r.chain.push(r.to); r.skip = r.chain.length>2;
    r.chain.slice(1).forEach((id,i) => links.push({from:r.chain[i],to:id,route:r.index}));
  }
  const rank = () => new Map(layers.flatMap(ids => ids.map((id,i) => [id,i])));
  const crossings = () => {
    const ranks=rank(); let count=0;
    links.forEach((a,i)=>links.slice(i+1).forEach(b=>{
      if(vertices.get(a.from).layer===vertices.get(b.from).layer && (ranks.get(a.from)-ranks.get(b.from))*(ranks.get(a.to)-ranks.get(b.to))<0)count++;
    })); return count;
  };
  let best=layers.map(ids=>[...ids]),bestCost=crossings();
  if(sort)for(let sweep=0;sweep<12;sweep++) {
    const order=layers.map((_,i)=>i);if(sweep%2)order.reverse();
    for(const d of order) {
      const ranks=rank(), score=id=>{
        const near=links.filter(e=>sweep%2?e.from===id:e.to===id).map(e=>ranks.get(sweep%2?e.to:e.from));
        return near.length?near.reduce((a,b)=>a+b,0)/near.length:ranks.get(id);
      };
      layers[d].sort((a,b)=>score(a)-score(b)||ranks.get(a)-ranks.get(b));
    }
    const cost=crossings();if(cost<bestCost){bestCost=cost;best=layers.map(ids=>[...ids]);}
  }
  layers.splice(0,layers.length,...best);
  if(sort)for(let sweep=0;sweep<4;sweep++) {
    for(const ids of layers)for(let i=1;i<ids.length;i++) {
      [ids[i-1],ids[i]]=[ids[i],ids[i-1]];
      const cost=crossings();
      if(cost<bestCost)bestCost=cost;
      else [ids[i-1],ids[i]]=[ids[i],ids[i-1]];
    }
  }
  const widths=layers.map(ids=>overview?Math.min(options.maxCardWidth ?? Infinity,options.instrument?208:156):Math.min(options.maxCardWidth ?? Infinity,Math.max(264,...ids.filter(id=>byId.has(id)).map(id=>Math.max((byId.get(id).summary||byId.get(id).goal||'').length>180?480:0,Math.min(280,Math.ceil(textWidth(byId.get(id).title,18,9))+40))))));
  for(const v of vertices.values()) {
    v.width=widths[v.layer];
    const degree=Math.max(links.filter(e=>e.from===v.id).length,links.filter(e=>e.to===v.id).length);
    const portHeight=40+portGap*(degree+2*Math.max(0,degree-3));
    v.height=overview ? (v.dummy ? 28 : Math.max(v.node?.planned_checks?.some(c=>c.runs_own_files)?104:80,portHeight)) : v.dummy?44:Math.max(detailCardHeight(v.node),portHeight)+Math.max(0,Math.ceil(textWidth(v.node.title,18,9)/(v.width-40))-1)*26;
  }
  for(const v of vertices.values())if(!v.dummy && options.measure)v.height=Math.max(v.height,options.measure(v.node,v.width));
  const gap=overview?16:18,margin=20;
  const total=ids=>ids.reduce((s,id)=>s+vertices.get(id).height,0)+Math.max(0,ids.length-1)*gap;
  const tallest=Math.max(0,...layers.map(total));
  for(const ids of layers){let y=margin+(tallest-total(ids))/2;for(const id of ids){vertices.get(id).y=y;y+=vertices.get(id).height+gap;}}
  // Align connected rows while keeping the chosen order and each dummy's clearance.
  if(sort)for(let sweep=0;sweep<7;sweep++) {
    const order=layers.map((_,d)=>d);if(sweep%2)order.reverse();
    for(const d of order) {
      const ids=layers[d];let floor=margin;
      for(const id of ids){const v=vertices.get(id),near=links.filter(e=>sweep%2?e.from===id:e.to===id).map(e=>vertices.get(sweep%2?e.to:e.from));
        // The whole-result card can align to direct predecessors while long routes use the dummy slots.
        const direct=overview&&options.instrument&&v.node?.runLevel&&near.length===2?near.filter(n=>!n.dummy):[];
        const anchors=direct.length?direct:near;
        const centre=anchors.length?anchors.reduce((s,n)=>s+n.y+n.height/2,0)/anchors.length:v.y+v.height/2;
        v.y=Math.max(floor,centre-v.height/2);floor=v.y+v.height+gap;
      }
      let ceiling=margin+tallest;
      for(const id of [...ids].reverse()){const v=vertices.get(id);v.y=Math.min(v.y,ceiling-v.height);ceiling=v.y-gap;}
    }
  }
  const channels=layers.slice(1).map((_,d)=>links.filter(e=>vertices.get(e.from).layer===d));
  let x=margin;
  layers.forEach((ids,d)=>{for(const id of ids)vertices.get(id).x=x;x+=widths[d]+Math.max(overview?56:108,inset*2+((channels[d]?.length||0)+1)*20);});
  // A dummy keeps its ordinate across both channels and clears every real card in its layer.
  const dummyPorts=layers.map(()=>[]);
  for(const ids of layers)for(const id of ids){
    const v=vertices.get(id);
    if(!v.dummy)continue;
    const left=dummyPorts[v.layer-1], right=dummyPorts[v.layer], center=v.y+v.height/2;
    const taken=[...left,...right];
    v.port=center;
    while(taken.some(y=>Math.abs(v.port-y)<1))v.port++;
    left.push(v.port);right.push(v.port);
  }
  const bundles=[];
  channels.forEach((channel,d)=>{
    const right=vertices.get(layers[d][0]).x+widths[d],next=vertices.get(layers[d+1][0]).x;
    const candidates=[null,'a','b'].map(shared=>routeChannel(channel,vertices,routes,right,next,inset,shared));
    const {tracks}=candidates.sort((a,b)=>a.crossings-b.crossings||a.runs-b.runs||a.bends-b.bends||a.length-b.length)[0];
    for(const track of tracks) {
      if(track.pieces.length>1)bundles.push(track);
      for(const p of track.pieces) {
        const r=routes[p.route];
        (r.parts ||= []).push(p.points);
      }
    }
  });
  for(const r of routes){
    r.points=simplifyRoute(r.parts?.flat()||[]);
    r.start=r.points[0];r.end=r.points.at(-1);
    delete r.parts;
  }
  const positions=Object.fromEntries([...vertices].filter(([,v])=>!v.dummy).map(([id,v])=>[id,{x:v.x,y:v.y,width:v.width,height:v.height,depth:v.layer,layer:v.layer}]));
  const cardRects=Object.entries(positions).map(([id,p])=>({id,...p})),chips=[];
  const overlaps=(a,b)=>a.x<b.x+b.width+8&&a.x+a.width+8>b.x&&a.y<b.y+b.height+8&&a.y+a.height+8>b.y;
  for(const r of routes){
    if(!r.text)continue;
    const width=Math.ceil(textWidth(r.text,14,7.5))+20,height=26;
    const segments=r.points.slice(1).map((b,i)=>[r.points[i],b]).filter(([a,b])=>a.y===b.y&&b.x-a.x>width+8).sort((a,b)=>(b[1].x-b[0].x)-(a[1].x-a[0].x));
    for(const [a,b] of segments){const chip={x:(a.x+b.x-width)/2,y:a.y-height/2,width,height,first:r.index,key:String(r.index)};
      if(cardRects.some(c=>overlaps(chip,c))||chips.some(c=>overlaps(chip,c)))continue;
      const blocked=routes.some(other=>other!==r&&other.points.slice(1).some((q,i)=>{const p=other.points[i];return Math.max(p.x,q.x)>chip.x-4&&Math.min(p.x,q.x)<chip.x+width+4&&Math.max(p.y,q.y)>chip.y-4&&Math.min(p.y,q.y)<chip.y+height+4;}));
      if(!blocked){r.chip=chip;chips.push(chip);break;}
    }
  }
  if(overview && options.wrapLongChains && layers.length>8 && layers.every(ids=>ids.length===1 && byId.has(ids[0]))) {
    const columns=7, step=widths[0]+56, rowHeight=Math.max(80,...Object.values(positions).map(p=>p.height))+40;
    layers.forEach((ids,i)=>{Object.assign(positions[ids[0]],{x:margin+(i%columns)*step,y:margin+Math.floor(i/columns)*rowHeight});});
    for(const r of routes){const a=positions[r.from],b=positions[r.to],start={x:a.x+a.width,y:a.y+a.height/2},end={x:b.x,y:b.y+b.height/2};
      r.start=start;r.end=end;r.chip=null;
      r.points=a.y===b.y?[start,end]:[start,{x:start.x+18,y:start.y},{x:start.x+18,y:b.y-24},{x:b.x-12,y:b.y-24},{x:b.x-12,y:end.y},end];}
    cardRects.splice(0,cardRects.length,...Object.entries(positions).map(([id,p])=>({id,...p})));
    return {positions,layers:layers.map(ids=>ids.filter(id=>byId.has(id))),order:layers.flat(),routes,chips:[],cardRects,
      terminals:nodes.filter(n=>!routes.some(r=>r.from===n.id)).map(n=>n.id),
      bounds:{width:Math.max(...cardRects.map(p=>p.x+p.width))+margin+20,height:Math.max(...cardRects.map(p=>p.y+p.height))+margin},vertical:false};
  }
  return {positions,layers:layers.map(ids=>ids.filter(id=>byId.has(id))),order:layers.flat().filter(id=>byId.has(id)),routes,chips,cardRects,
    terminals:nodes.filter(n=>!routes.some(r=>r.from===n.id)).map(n=>n.id),
    bounds:{width:Math.max(100,...cardRects.map(p=>p.x+p.width+margin)),height:tallest+margin*2},vertical:false,bundles};
}

export function compactOverview(layout,width) {
  // Only a genuine single chain may use the compact row router.
  if(layout.routes.length!==layout.order.length-1 || layout.order.some(id=>layout.routes.filter(r=>r.from===id).length>1 || layout.routes.filter(r=>r.to===id).length>1))return layout;
  if(layout.bounds.width*MIN_FIT_SCALE<=width)return layout;
  const margin=20,gap=36,cardWidth=layout.cardRects[0]?.width||156,columns=Math.max(1,Math.floor((width/MIN_FIT_SCALE-margin*2+gap)/(cardWidth+gap)));
  const height=Math.max(80,...layout.cardRects.map(r=>r.height)),rowHeight=height+36;
  const positions={};layout.order.forEach((id,i)=>{positions[id]={...layout.positions[id],x:margin+(i%columns)*(cardWidth+gap),y:margin+Math.floor(i/columns)*rowHeight,width:cardWidth,height};});
  const routes=layout.routes.map((r,i)=>{
    const a=positions[r.from],b=positions[r.to],start={x:a.x+a.width,y:a.y+a.height/2},end={x:b.x,y:b.y+b.height/2};
    const lead=8+(i%4)*3;
    const points=a.y===b.y&&b.x===a.x+cardWidth+gap?[start,end]:[start,{x:start.x+lead,y:start.y},{x:start.x+lead,y:a.y+a.height+24},{x:end.x-lead,y:a.y+a.height+24},{x:end.x-lead,y:end.y},end];
    return {...r,start,end,points,chip:null};
  });
  const cardRects=layout.order.map(id=>({id,...positions[id]}));
  return {...layout,positions,routes,chips:[],cardRects,bounds:{width:Math.max(...cardRects.map(r=>r.x+r.width))+margin,height:Math.max(...cardRects.map(r=>r.y+r.height))+margin}};
}

function sceneStrokes(edges,bundles) {
  const strokes=[],markers=[],byId=new Map(edges.map(edge=>[edge.id,edge]));
  const bundled=new Set(bundles.flatMap(track=>track.pieces.map(p=>String(p.route))));
  const add=(points,members,bundle,distance=0)=>{
    if(points.length<2)return;
    strokes.push({id:String(strokes.length),points,members,bundle,distance,gate:byId.get(members[0]).style.gate});
  };
  const mark=(points,members)=>{
    const [a,b]=points.slice(-2);
    if(a.x===b.x&&a.y===b.y)return;
    markers.push({id:String(markers.length),points:[a,b],members,relation:byId.get(members[0]).style.relation});
  };
  for(const edge of edges)if(edge.points.length>=2&&!bundled.has(edge.id)){
    add(edge.points,[edge.id],edge.id);
    mark(edge.points,[edge.id]);
  }
  for(const {x,shared,pieces} of bundles){
    const members=pieces.map(p=>String(p.route)),bundle=members[0];
    const startSide=shared==='a';
    const port=pieces[0].points.at(startSide?0:-1),hub={x,y:port.y};
    const lead=Math.abs(x-port.x);
    add([port,hub],members,bundle);
    if(!startSide)mark([hub,port],members);
    const branches=pieces.map(({route,points})=>({id:String(route),end:points.at(startSide?-1:0)}));
    for(const direction of [-1,1]){
      const side=branches.filter(({end})=>Math.sign(end.y-hub.y)===direction)
        .sort((a,b)=>direction*(a.end.y-b.end.y));
      let last=hub;
      for(const [i,{end}] of side.entries()){
        const joint={x,y:end.y};
        add([last,joint],side.slice(i).map(branch=>branch.id),bundle,lead+Math.abs(last.y-hub.y));
        last=joint;
      }
    }
    for(const {id,end} of branches){
      const joint={x,y:end.y};
      add([joint,end],[id],bundle,lead+Math.abs(end.y-hub.y));
      mark(startSide?[joint,end]:[end,joint],[id]);
    }
  }
  return {strokes,markers};
}

function sceneFlowMarks(edges, strokes, cards) {
  const parts=new Map();
  for(const {points,members} of strokes){
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);
      if(!length)continue;
      for(const id of members){
        if(!parts.has(id))parts.set(id,[]);
        parts.get(id).push({a,b,length,count:members.length});
      }
    }
  }
  return edges.flatMap(edge=>{
    const cue=flowCue(edge.flow), segments=parts.get(edge.id);
    if(!cue||!segments)return [];
    segments.sort((a,b)=>a.count-b.count||b.length-a.length);
    for(const offset of [-8,8,-5,5,0])for(const {a,b,length} of segments){
      const middle={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      const forward=edge.points.findIndex((p,i,points)=>{
        if(!i)return false;
        const q=points[i-1];
        return p.x===q.x && p.x===middle.x && (p.y-middle.y)*(q.y-middle.y)<0 ||
          p.y===q.y && p.y===middle.y && (p.x-middle.x)*(q.x-middle.x)<0;
      });
      const direction=forward>0 ? edge.points[forward] : b;
      const dx=Math.sign(direction.x-middle.x),dy=Math.sign(direction.y-middle.y);
      const span=Math.min(1,length/24);
      const paths=FLOW_MARKS[cue].map(path=>path.map(([x,y])=>({
        x:middle.x+x*span*dx-(y+offset)*dy,y:middle.y+x*span*dy+(y+offset)*dx,
      })));
      const points=paths.flat(), xs=points.map(p=>p.x), ys=points.map(p=>p.y);
      const left=Math.min(...xs)-2, right=Math.max(...xs)+2, top=Math.min(...ys)-2, bottom=Math.max(...ys)+2;
      if(!cards.some(r=>left<r.x+r.width&&right>r.x&&top<r.y+r.height&&bottom>r.y))
        return [{id:edge.id,cue,paths}];
    }
    return [];
  });
}

export function pointAlongRoute(points, progress) {
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y));
  let distance=lengths.reduce((sum,length)=>sum+length,0)*progress;
  for(const [i,length] of lengths.entries()){
    if(length>0&&distance<=length){
      const a=points[i],b=points[i+1],fraction=distance/length;
      return {x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction};
    }
    distance-=length;
  }
  return points.at(-1);
}

const MOTION_DURATIONS = {dot:180,strip:220,glyph:280,pass:620,return:620,
  flicker:320,session:700};
const motionEase = t => t*t*(3-2*t);

export function createGraphMotion() {
  let baseline=null, effects=new Map(), halos=new Map(), drifting=new Set();
  const add=(kind,id,record,time,duration=MOTION_DURATIONS[kind],extra={})=>{
    effects.set(JSON.stringify([kind,id,record]),{kind,id,record,time,duration,...extra});
  };
  function observe(scene,time,enabled,reset=false) {
    if(reset){effects.clear();halos.clear();drifting.clear();baseline=null;}
    const previous=baseline;
    baseline=scene;
    if(!scene||!previous)return;
    for(const id of halos.keys())if(scene.positions[id]?.state!=='awaiting')halos.delete(id);
    const eligible=new Set(scene.edges.filter(edge=>edge.targetRunning&&edge.flow?.state==='delivered').map(edge=>edge.key));
    for(const key of drifting)if(!eligible.has(key))drifting.delete(key);
    if(!enabled)return;
    frame(time,true);
    const dirty=new Set();
    for(const card of scene.cards){
      const old=previous.positions[card.id];
      if(!old)continue;
      const {facts}=card;
      if(card.state!==old.state){
        const record=card.state+':'+card.recordedAttempt;
        add('glyph',card.id,record,time);
        if(card.state==='passed')add('pass',card.id,record,time);
        if(card.state==='returned'||card.state==='failedFinal'){
          add('return',card.id,record,time);
          add('flicker',card.id,record,time);
        }
        if(card.state==='awaiting'&&facts.ask!=null)halos.set(card.id,{time,record:facts.ask});
        dirty.add(card.id);
      }
      if(card.state==='awaiting'&&facts.ask!=null&&facts.ask!==old.facts.ask)
        halos.set(card.id,{time,record:facts.ask});
      if(card.state!=='awaiting')halos.delete(card.id);
      const prior=new Set(old.facts.calls.map(call=>call.id));
      const dots=facts.calls.filter(call=>!prior.has(call.id));
      for(const call of dots){
        add('dot',card.id,call.id,time);
        if(call.category==='session'&&call.start_ms!=null)add('session',card.id,call.id,time);
      }
      if(facts.activeCall && old.facts.activeCall!==facts.activeCall && !dots.some(call=>call.id===facts.activeCall) &&
        !old.attemptHistory.some(attempt=>attempt.calls?.some(call=>call.id===facts.activeCall&&call.start_ms!=null)) &&
        facts.now==='session')
        add('session',card.id,facts.activeCall,time);
      if(dots.length||old.recordedAttempt!==card.recordedAttempt||
        JSON.stringify(old.attemptHistory)!==JSON.stringify(card.attemptHistory)){
        const record=dots.at(-1)?.id || facts.activeCall || facts.calls.at(-1)?.id || card.recordedAttempt;
        if(card.strip)add('strip',card.id,record,time,undefined,{before:old.strip});
        if(dots.length)dirty.add(card.id);
      }
    }
    const oldEdges=new Map(previous.edges.map(edge=>[edge.key,edge]));
    let travelling=[...effects.values()].filter(e=>e.kind==='handoff'||e.kind==='reverse').length;
    for(const edge of scene.edges){
      const old=oldEdges.get(edge.key);
      if(!old)continue;
      const delivery=edge.flow?.delivery, returned=edge.flow?.state==='returned'&&edge.flow.record;
      const forward=delivery && delivery.seq!==old.flow?.delivery?.seq;
      const reverse=returned && (old.flow?.state!=='returned'||returned.seq!==old.flow?.record?.seq);
      if((forward||reverse)&&travelling<4){
        const length=edge.points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-edge.points[i].x,p.y-edge.points[i].y),0);
        add(reverse?'reverse':'handoff',edge.key,(reverse?returned:delivery).seq,time,
          Math.max(400,Math.min(1000,length*2.5)));
        travelling++;
      }
      if(!edge.targetRunning||edge.flow?.state!=='delivered')drifting.delete(edge.key);
      else if(!old.targetRunning||forward||dirty.has(edge.to))drifting.add(edge.key);
    }
  }
  function frame(time,enabled) {
    if(!enabled)return [];
    const result=[];
    for(const [key,event] of effects){
      if(time>=event.time+event.duration){effects.delete(key);continue;}
      result.push({...event,progress:clamp((time-event.time)/event.duration)});
    }
    for(const [id,{time:start,record}] of halos){
      const elapsed=Math.max(0,time-start);
      const phase=elapsed<3000?elapsed%1000:(elapsed%12000);
      const progress=clamp(phase/650);
      result.push({kind:'halo',id,record,loop:true,progress,strength:Math.sin(Math.PI*progress)**2});
    }
    for(const id of drifting)result.push({kind:'drift',id,loop:true,progress:(time%1000)/1000,distance:time*.038});
    return result;
  }
  return {observe,frame,settle(){effects.clear();},active:()=>!!(effects.size||halos.size||drifting.size)};
}

export function pickGraphEdges(scene, point, scale) {
  // The hit corridor is 24 CSS pixels wide independently of the stage scale.
  let nearest = null;
  const tolerance = 12/scale;
  for (const stroke of scene.strokes) {
    for(let i=1;i<stroke.points.length;i++){
      const a=stroke.points[i-1],b=stroke.points[i],dx=b.x-a.x,dy=b.y-a.y;
      const length=dx*dx+dy*dy;
      if(!length)continue;
      const t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/length));
      const x=a.x+t*dx,y=a.y+t*dy,distance=Math.hypot(point.x-x,point.y-y);
      if(distance>tolerance)continue;
      const closer=!nearest||distance<nearest.distance-1e-6;
      if(closer)nearest={distance,x,y,vertical:dx===0,members:[...stroke.members]};
      else if(Math.abs(distance-nearest.distance)<=1e-6&&x===nearest.x&&y===nearest.y&&(dx===0)===nearest.vertical){
        for(const id of stroke.members)if(!nearest.members.includes(id))nearest.members.push(id);
      }
    }
  }
  return nearest?.members || [];
}

// Geometry is already measured in stage CSS pixels. Renderers share this data, not DOM or layout internals.
export function routeTags(edges, strokes, cards, bounds, language) {
  const height=20;
  const occupied=[...cards];
  const overlaps=(a,b,pad)=>a.x<b.x+b.width+pad&&a.x+a.width+pad>b.x&&
    a.y<b.y+b.height+pad&&a.y+a.height+pad>b.y;
  const segments=new Map(edges.map(edge=>[edge.id,[]]));
  for(const stroke of strokes){
    if(stroke.members.length!==1)continue;
    const parts=segments.get(stroke.members[0]);
    stroke.points.slice(1).forEach((b,i)=>{
      const a=stroke.points[i];
      if(a.x!==b.x || a.y!==b.y)parts.push({a,b,branch:stroke.id,length:Math.hypot(b.x-a.x,b.y-a.y)});
    });
  }
  // Place the most constrained branches first. A tag may sit alongside its own trace.
  const sorted=[...edges].sort((a,b)=>Math.max(0,...segments.get(a.id).map(s=>s.length))-
    Math.max(0,...segments.get(b.id).map(s=>s.length)));
  return sorted.flatMap(edge=>{
    const tag=edgeTag(edge,language),width=Math.ceil(textWidth(tag.text,13,8))+14;
    const parts=segments.get(edge.id).sort((a,b)=>b.length-a.length);
    for(const offset of [0,-14,14,-26,26,-38,38,-50,50,-64,64,-78,78,'start','end']){
      for(const {a,b,branch} of parts)for(const fraction of [.5,.35,.65,.2,.8,.05,.95]){
        const x=a.x+(b.x-a.x)*fraction, y=a.y+(b.y-a.y)*fraction;
        const vertical=a.x===b.x;
        const rect={x:x-width/2,y:y-height/2,width,height};
        if(typeof offset==='number')rect[vertical?'x':'y']+=offset;
        else rect[vertical?'x':'y']=offset==='start'?0:vertical?bounds.width-width:bounds.height-height;
        if(rect.x<0||rect.y<0||rect.x+width>bounds.width||rect.y+height>bounds.height)continue;
        if(occupied.some(other=>overlaps(rect,other,typeof offset==='number'?1:0)))continue;
        occupied.push(rect);
        return [{id:edge.id,...tag,...rect,branch,anchor:{x,y}}];
      }
    }
    return [];
  });
}

export function activityStrip(attempt, facts, now) {
  if(!attempt?.phases?.length)return null;
  const phases=attempt.phases.filter(phase=>phase.start_ms!=null&&phase.start_ms<=now)
    .sort((a,b)=>a.start_ms-b.start_ms);
  if(!phases.length)return null;
  const start=attempt.status==='observed'?phases[0].start_ms:Math.min(attempt.started_ms??now,phases[0].start_ms);
  const end=Math.max(start+1,Math.min(now,attempt.last_ms??now),facts.now?now:start);
  // An open attempt has spare rail for the next observation, including polls with a long open call.
  const length=Math.max(1000,(end-start)*(facts.now?1.25:1));
  const position=stamp=>clamp((stamp-start)/length);
  const known=new Set([...facts.totals.map(total=>total.category),facts.now]);
  const segments=phases.map(phase=>{
    const open=facts.now===phase.category && phase.id===attempt.current && phase.end_ms==null;
    const stop=Math.min(now,open?now:phase.end_ms??phase.start_ms+phase.duration_ms);
    return {id:phase.id,category:phase.category,pattern:known.has(phase.category)?phase.category:null,
      left:Math.min(.982,position(phase.start_ms)),width:Math.max(.018,position(stop)-position(phase.start_ms))};
  });
  return {segments,dots:facts.calls.map(call=>({id:call.id,left:position(call.start_ms??call.end_ms)})),
    head:facts.now?position(now):null};
}

function graphMotionCard(node, decisions, now, language) {
  const facts=cardFacts(node,decisions,now,language);
  const attempt=graphAttempt(node);
  return {id:node.id,kind:facts.kind,state:facts.state,lane:facts.lane,facts,
    attemptHistory:node.activity||[],recordedAttempt:node.attempts||0,strip:activityStrip(attempt,facts,now)};
}

export function createGraphScene(nodes, layout, decisions, level, now = 0, language = 'en') {
  const byId = new Map(nodes.map(node => [node.id, node]));
  const cards = layout.order.map((id, order) => {
    const {x, y, width, height, layer} = layout.positions[id];
    const card=graphMotionCard(byId.get(id),decisions,now,language);
    const tier=card.state==='awaiting'?1:card.state==='stalled'||graphAttempt(byId.get(id))?.repeating?2:card.strip?3:null;
    return {...card,tier,level,x,y,width,height,layer,order};
  });
  const positions = Object.fromEntries(cards.map(card => [card.id, card]));
  const edges = layout.routes.map(route => ({
    id:String(route.index), from:route.from, to:route.to, direction:'source-to-target',
    relation:route.relation, gate:route.gate, label:route.label || '', points:route.points, flow:route.flow,
    style:{gate:route.gateState, relation:route.relation || 'hands_over'},
    chip:route.chip, text:route.text, key:edgeKey(route),
    targetRunning:runningCard(positions[route.to]?.state),
    transfer:route.flow?.delivery || (route.flow?.state==='returned'?route.flow.record:null)
  }));
  const {strokes,markers}=sceneStrokes(edges,layout.bundles||[]);
  for(const stroke of strokes){
    const tags=stroke.members.map(id=>edgeTag(edges[Number(id)],language));
    stroke.tone=tags.every(tag=>tag.tone===tags[0].tone)?tags[0].tone:'structure';
    stroke.trace=tags.every(tag=>['delivered','frontier'].includes(tag.cue))?'open':
      tags.every(tag=>tag.cue==='blocked')?'waiting_for_you':tags.every(tag=>tag.cue==='returned')?'returned':'closed';
  }
  for(const marker of markers){
    const tones=marker.members.map(id=>edgeTag(edges[Number(id)],language).tone);
    marker.tone=tones.every(tone=>tone===tones[0])?tones[0]:'structure';
  }
  return {level, now, bounds:layout.bounds, cards, edges, strokes, markers,
    tags:routeTags(edges,strokes,cards,layout.bounds,language), flowMarks:sceneFlowMarks(edges,strokes,cards),
    positions, order:cards.map(card => card.id), chips:layout.chips};
}

function graphInkOrder(scene,focusId,focus) {
  const weight=members=>members.some(id=>focus?.edges.has(id))?'path':focusId?'context':'normal';
  const bundles=new Map();
  for(const stroke of scene.strokes)if(!bundles.has(stroke.bundle))bundles.set(stroke.bundle,bundles.size*2);
  const markerOrder=bundles.size*2, foreground=markerOrder+1;
  const strokes=new Map(scene.strokes.map(({id,members,bundle})=>{
    const emphasis=weight(members), base=emphasis==='path'?foreground:bundles.get(bundle);
    return [id,{weight:emphasis,base,ink:base+1}];
  }));
  const markers=new Map(scene.markers.map(({id,members})=>{
    const emphasis=weight(members);
    return [id,{weight:emphasis,ink:emphasis==='path'?foreground+2:markerOrder}];
  }));
  return {strokes,markers};
}

export function dependencyFocus(scene, id) {
  const cards = new Set(), edges = new Set();
  if (!id || !Object.hasOwn(scene.positions,id)) return {cards,edges};
  cards.add(id);
  for (const [start,end] of [['from','to'],['to','from']]) {
    const pending = [id], visited = new Set(pending);
    while (pending.length) {
      const current = pending.pop();
      for (const edge of scene.edges) {
        if (edge.to === '_run_checks' || edge[start] !== current) continue;
        edges.add(edge.id);
        const next = edge[end];
        if (visited.has(next)) continue;
        visited.add(next);
        cards.add(next);
        pending.push(next);
      }
    }
  }
  return {cards,edges};
}

export function roundedRoute(points, radius = 5) {
  const pts=points.filter((p,i)=>!i||p.x!==points[i-1].x||p.y!==points[i-1].y);
  if(!pts.length)return '';
  let path=`M${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<pts.length-1;i++){
    const a=pts[i-1],b=pts[i],c=pts[i+1],before=Math.hypot(b.x-a.x,b.y-a.y),after=Math.hypot(c.x-b.x,c.y-b.y),r=Math.min(radius,before/2,after/2);
    if(!r||(a.x===b.x&&b.x===c.x)||(a.y===b.y&&b.y===c.y)){path+=` L${b.x} ${b.y}`;continue;}
    path+=` L${b.x+(a.x-b.x)*r/before} ${b.y+(a.y-b.y)*r/before} Q${b.x} ${b.y} ${b.x+(c.x-b.x)*r/after} ${b.y+(c.y-b.y)*r/after}`;
  }
  const end=pts.at(-1);return path+` L${end.x} ${end.y}`;
}

export function activityCues(node) {
  const attempt = node.activity?.at(-1);
  if (node.status !== 'running' || !attempt) return [];
  return [attempt.cue || attempt.latest, attempt.stalled && 'stalled', attempt.repeating && 'repeating'].filter(Boolean);
}

if (typeof document !== 'undefined') {
let language = viewLanguage(null, navigator.language);
const t = (key, values = {}) => Object.entries({...values,...(values.new?{newParticle:particle(values.new,'으로/로')}:{}),...(values.who?{whoSubject:particle(values.who)}:{})}).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), STRINGS[language][key]);
const $ = id => document.getElementById(id);
const el = (tag, text, cls) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; };
const button = (text, action, cls) => { const b = el('button', text, cls); b.type = 'button'; b.addEventListener('click', action); return b; };
const clear = e => e.replaceChildren();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const startup = new URL(location.href);
const tokenKey = 'graph-flow-token:' + location.port;
let token = startup.searchParams.get('t') || '';
try {
  if (!startup.searchParams.has('t')) token = sessionStorage.getItem(tokenKey) || '';
  if (token) sessionStorage.setItem(tokenKey, token);
} catch { /* Storage may be unavailable; the printed address still works. */ }
startup.searchParams.delete('t');
history.replaceState(null, '', startup.pathname + startup.search + startup.hash);
function translate() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
  document.querySelector('nav').setAttribute('aria-label', t('chooseRun'));
  $('find-text').placeholder = t('findHint');
  $('map').setAttribute('aria-label', t('graph'));
  document.querySelectorAll('[data-i18n-label]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.i18nLabel)));
}
translate();
let chosen = null, projects = [], view = null, fingerprint = '', ageFingerprint = '', mode = 'flow', selected = null;
let selectedEdge = null, edgeChoices = [], edgeOrigin = null;
let timeBar, timeBarModule, liveView, timeCut;
const isPast = () => !!timeBar?.describe().past;
function flowNode(id) { return planFlow(view,language).nodes.find(n => n.id === id); }
let queuedRefresh = false;
let timer = 0, loading = false, generation = 0, renderer = null;
const decisionController = createDecisionController();
let decisionUI = null, decisionNotice = '', cameFrom = 'flow';

async function api(path, body, text = false) {
  if (body && isPast()) throw new Error(t("timePast"));
  const response = await fetch(path, {method: body ? 'POST' : 'GET', headers: {'X-GF-Token': token, ...(body ? {'Content-Type':'application/json'} : {})}, ...(body ? {body:JSON.stringify(body)} : {})});
  if (!response.ok) { const err = new Error('request'); err.status = response.status; try{err.code=(await response.json()).code;}catch{} throw err; }
  return text ? response.text() : response.json();
}
function query(route, extra = {}, target = chosen) { return route + '?' + new URLSearchParams({project:target.project, run:target.run, ...extra}); }
let replacementDecision = null;
function notice(key, retry = false) { const box = $('notice'); clear(box); box.hidden = !key; if (key) box.append(el('span', STRINGS[language][key] === undefined ? key : t(key))); if (retry) box.append(button(t('retry'), () => refresh(true))); if(key && replacementDecision && !planBlocked())box.append(button(t('supersededLink',{id:replacementDecision}),()=>openDecision(replacementDecision),'primary')); }
function title(node) { return node && node.title && node.title !== node.id ? node.title : t('unnamed'); }
function otherTitle(value) { return view.nodes.some(n => n.id === value && n.title === value) ? t('unnamed') : value || t('unnamed'); }
// Legacy plans may have only an artifact path; keep that technical fallback out of normal views.
function outputLabel(value) { return ({findings:t('findingsOutput'),approval:t('approvalOutput')})[value] || value; }
function label(value) { value=outputLabel(value); return !value || /[\/\\]|\.[a-z0-9]{1,8}$/.test(value) || view.nodes.some(n => n.id === value) ? t('handoff') : value; }
function relationText(edge) { return edgeRelationLabel({...edge,label:edge.label?label(edge.label):''},language); }
function question(d) { return view.legacy&&d.purpose==='human_check'&&!/[?？]$/.test(d.question||'')?t('oldQuestion'):decisionQuestion(d, language); }
function decisionTitle(d) { return title(view.nodes.find(n => n.id === d.node)); }
// The same words an agent session uses for this decision, so either side can find the other.
function sessionName(session) {
  const host = /^(t3|claude):(.+)$/.exec(session || '');
  if (host) return t(host[1] === 't3' ? 'sessionT3' : 'sessionClaude', {id:host[2].slice(0, 8)});
  return session === 'dashboard' ? t('sessionDashboard') : session ? t('sessionOther') : '';
}
function who(actor) {
  const role = {leader:'roleLeader', worker:'roleWorker', reviewer:'roleReviewer', human:'roleHuman', tool:'roleTool'}[actor?.role];
  return [...new Set([role ? t(role) : sessionName(actor?.session)].filter(Boolean))].join(' · ');
}
// The log groups dates separately so every timestamp has the same width.
function clock(stamp, seconds = false) {
  const time = stamp ? new Date(stamp) : null; if (!time || isNaN(time)) return '';
  return time.toLocaleTimeString(language, {hour:'2-digit', minute:'2-digit', ...(seconds?{second:'2-digit'}:{}), hour12:false});
}
// An id the agent also says. Pressing it copies the words to paste back into the chat.
function refChip(id, say, decision = false, free = false) {
  const chip = button(t(free ? 'questionRef' : decision ? 'decisionRef' : 'nodeRef', {id}), async event => {
    event.stopPropagation();
    // Said once; the next refresh puts back whatever the page has to report.
    try { await navigator.clipboard.writeText(say); notice(t('copied', {text:say})); } catch { notice(t('copyFailed', {text:say})); }
  }, 'ref' + (free ? ' question-ref' : decision ? ' decision-ref' : ''));
  chip.title = t('copyHint'); chip.setAttribute('aria-label', `${id}. ${t('copyHint')}`); return chip;
}
function workedBy(n) { return n.worker?.model?t('modelName',{model:n.worker.model}):n.session?t('sessionLabel',{id:n.session}):t('unassigned'); }
function decisionHeading(parent, d, tag) {
  const reference = el('p', undefined, 'ref-line'); reference.append(refChip(d.id, `${d.id} · ${decisionTitle(d)}`, true, d.free));

  const asker = who(d.asked_by?{role:d.asked_by.role}:null);
  const origin=asker?t('askedBy',{who:asker}):'';
  if(origin)reference.append(el('span',origin));
  if(d.free)parent.append(el('p',t('freeQuestion',{who:who(d.asked_by)}),'free-question'),el('p',t('freeEffect')));
  parent.append(reference, el('p', t('decisionWork',{title:decisionTitle(d)}), 'decision-work'));
  parent.append(el(tag, question(d) || purposeWording(d.purpose,language), 'decision-question'));
  if(view.legacy&&!d.free)parent.append(el('p',t('oldReasked'),'legacy-question'));
  if(d.review_lenses?.length)parent.append(el('p',t('reviewLenses')+' · '+d.review_lenses.join(' · '),'review-lenses'));
  if (!d.free && d.purpose === 'trajectory') textList(parent, (d.trajectory_reasons || []).map(key => t(key)));
}
function needs(node) { return view.decisions.some(d => d.node === node.id); }
function status(node) { return stateWords(displayState(node,view.decisions),language).name; }
function attempts(node) { if(['decision','goal'].includes(node.kind))return ''; return t(node.attempts?'attempt':'unusedAttempts', {n:node.attempts||0,max:node.max_attempts||3}); }
function card(heading, body, paper = false) { const c = el('div', undefined, 'card' + (paper ? ' paper' : '')); c.append(el('p', heading, 'eyebrow')); if (body) c.append(el('p', body)); return c; }
function textList(parent, items, empty = 'notRecorded') { const list = el('ul'); if (!items.length) list.append(el('li', t(empty))); else items.forEach(text => list.append(el('li', text))); parent.append(list); }
function wording(text, tag = 'span') {
  const root=el(tag), split=text.indexOf('✕');
  if(split<0)root.textContent=text;
  else {if(split)root.append(el('span',text.slice(0,split)));root.append(el('span','✕','failure-mark'),el('span',text.slice(split+1)));}
  return root;
}
function failedBlock(parent, d) {
  if (!d.failed?.length) return;
  const failed = card(t('failed')); failed.classList.add('failed');
  textList(failed, d.failed.map(text => text === STRINGS.en.untitledFailure ? t('untitledFailure') : checkWording({title:text,result:'failed'}, language, view.nodes.find(n=>n.id===d.node)?.attempts))); parent.append(failed);
}
function decisionCard(d) {
  const c = el('div', undefined, 'card paper'); decisionHeading(c, d, 'h3'); failedBlock(c, d); if (d.context.why) c.append(el('p', d.context.why));
  c.append(button(t(d.free?'freeRead':'read'), () => openDecision(d.id), d.free?'':'primary')); return c;
}
function handoffsCard(key, rows, direction) {
  const c = card(t(key)); const list = el('ul');
  if (!rows.length) c.append(el('p', t('noHandoffs')));
  for (const row of rows) list.append(el('li', `${label(row.label)} · ${t(direction)} ${otherTitle(row.other_title)} · ${t(row.delivered ? 'delivered' : 'notDelivered')}`));
  c.append(list); return c;
}
function contractDetails(parent,contract) {
  const details=el('details');details.append(el('summary',t('executionContract')),el('pre',JSON.stringify(contract,null,2)));parent.append(details);
}
function plannedChecks(parent, checks) {
  const list = el('ul', undefined, 'checks planned-checks');
  for (const c of checks || []) {
    const item = el('li'); if(!commandTitle(c))item.append(el('strong',t(c.type==='human'?'plannedHumanCheck':'plannedCheck',{title:checkTitle(c,language)}))); if(c.type==='scope')item.append(el('p',t('scopeBody'))); if(c.runs_own_files)item.append(el('p',t('ownCheckMark'),'own-check-note'),el('p',t('ownCheckEffect')));
    if ((!c.type || c.type === 'cmd') && c.command) {
      renderCheckInputs(item,c,language,el);
    }
    if (c.type === 'human') item.append(el('p',t('whenAfterWork')+(c.prompt&&c.prompt!==checkTitle(c,language)?' '+c.prompt:'')));
    if (c.type === 'host') item.append(el('p', t('checkHost', c)));
    if (c.requires_passed?.length) item.append(el('p', t('checkRequiresPassed', {tasks:taskNames(c.requires_passed)})));
    list.append(item);
  }
  if (!list.children.length) list.append(el('li', t('noPlannedChecks')));
  parent.append(list);
}
function authorNote(parent,context) {
  if(!Object.values(context||{}).some(Boolean))return;
  const note=card(t('authorNote'));for(const [key,value] of Object.entries(context))if(value)note.append(el('p',t({why:'authorWhy',if_approved:'ifApproved',if_rejected:'ifRejected',undo:'undo'}[key])+' · '+value));parent.append(note);
}
function plannedQuestion(q) {
  return q.answered?t('answeredQuestion',{...q,outcome:t(q.outcome==='approved'?(q.kind==='authorization'?'answeredPermission':'answeredApproval'):q.outcome==='answered'?'evAnswered':'answeredRevision'),answer:q.answer||''}):t(q.when==='node'?'whenDecision':q.when==='trajectory'?'whenTrajectory':'whenAfterWork')+' '+q.question;
}
function edgeAttributes(edge) {
  return {'data-from':edge.from, 'data-to':edge.to, 'data-relation':edge.relation,
    'data-gate':edge.gate, 'data-label':edge.label || ''};
}
function markRelation(element, edge) {
  for (const [name,value] of Object.entries(edgeAttributes(edge))) element.setAttribute(name,value);
  return element;
}
function gateText(edge) { return t(GATE_LABELS[edge.gate] || GATE_LABELS.closed); }
function flowText(edge) { return t(FLOW_LABELS[flowCue(edge.flow)] || FLOW_LABELS.unreachable); }
function relationFacts(parent,node) {
  for(const [key,rows,direction] of [['planNeeds',node.inputs||[],'from'],['planOutputs',node.outputs||[],'to']]){
    parent.append(el('h3',t(key)));
    const list=el('ul');list.dataset.relations=direction;
    for(const row of rows){
      const text=row.runLevel&&direction==='to'?t('includedIn',{title:row.other_title}):t(direction)+' '+otherTitle(row.other_title);
      const item=markRelation(el('li',[text,relationText(row),gateText(row)].join(' · ')),row);
      item.dataset.otherNode=row.other_id;list.append(item);
    }
    if(!rows.length)list.append(el('li',t('noHandoffs')));parent.append(list);
  }
}
function planNotices(parent, notices) {
  if(!notices?.length)return;
  const box=el('section',undefined,'plan-notices');box.append(el('h3',t('qNotice')));
  for(const n of notices)box.append(el('p',n.code==='circular_run_check'?t('qCircular',{gate:n.gate_title,check:n.title,later:n.later_title}):t('qBeforeWork',{title:n.title,n:n.attempt})));
  parent.append(box);
}
function taskNames(ids) {
  return ids.map(id=>view.nodes.find(n=>n.id===id)?.title || id).join(', ');
}
function runCheckSchedule(checks) {
  const work = view.nodes.filter(n=>n.kind==='work');
  const tasks = work.filter(n=>n.lane>=2).map(title);
  const declared = checks.filter(c=>c.requires_passed?.length);
  const producerGate = declared.some(c=>work.some(n=>c.requires_passed.includes(n.id)));
  return el('p', t(!tasks.length&&!producerGate?'onlyFinalChecks':declared.length?'conditionalNodeChecks':'alsoNodeChecks', {tasks:tasks.join(', ')}));
}
function runFacts(parent) {
  planNotices(parent,view.notices);
  relationFacts(parent,flowNode('_run_checks'));
  contractDetails(parent,view.run_contract);
  if(view.summary)parent.append(el('p',view.summary));authorNote(parent,view.context);
  if(view.requirements?.length){parent.append(el('h3',t('requirements')));textList(parent,view.requirements.map(r=>r.id+' · '+r.text));}
  const runChecks = uniqueChecks([...(view.integration_checks||[]),...(view.promoted_checks||[])]);
  if(runChecks.length)parent.append(runCheckSchedule(runChecks));
  parent.append(el('h3',t('runChecksGoal')),el('p',view.goal));
  for (const [key, checks] of [['planIntegration',runChecks]]) {
    if (checks?.length) { parent.append(el('h3',t(key))); plannedChecks(parent,checks); }
  }
  if (view.constraints?.length) { parent.append(el('h3',t('runConstraints'))); textList(parent,view.constraints); }
  if (view.planned_questions?.length) {
    parent.append(el('h3',t('planQuestions',view.plan_counts)));
    for (const q of view.planned_questions) { const row=el('p'); row.append(button(otherTitle(flowNode(q.node)?.title),()=>selectNode(q.node),'link'),el('span',' · '+plannedQuestion(q))); parent.append(row); }
  }
}
function groupFacts(parent,start=0) {
  let group=null;
  for(const child of [...parent.children].slice(start)){
    if(child.tagName.toLowerCase()==='h3'){group=el('section',undefined,'fact-section');parent.insertBefore(group,child);}
    if(group)group.append(child);
  }
}
function planFacts(parent, node) {
  planNotices(parent,node.notices);
  const start=parent.children.length;
  if (node.runLevel) { runFacts(parent); groupFacts(parent,start); return; }
  if(node.goal && node.goal!==title(node))parent.append(el('h3', t('planGoal')), el('p', node.goal));
  authorNote(parent,node.context);if(node.requirement)parent.append(el('h3',t('requirements')),el('p',node.requirement));
  const questions=(view.planned_questions||[]).filter(q=>q.node===node.id);
  if(questions.length){parent.append(el('h3',t(questions.every(q=>q.answered)?'questionsAnswered':'questionsForNode')));textList(parent,questions.map(q=>plannedQuestion(q)));}
  if(!questions.some(q=>q.answered)&&node.kind==='decision' && ['review','authorization'].includes(node.contract.decision_kind)){parent.append(el('p',t('decisionAccept',{tasks:dependentTitles(node.id)})),el('p',t('decisionReject')));}
  renderPlanDiff(parent,node.id);
  parent.append(el('h3', t('planOwns'))); textList(parent,node.owns || []);
  relationFacts(parent,node);
  if(node.reads?.length){parent.append(el('h3',t('planReads')));textList(parent,node.reads);}
  const artifacts=(node.declared_outputs||[]).filter(value=>!node.outputs?.some(row=>row.label===value));
  if(artifacts.length){parent.append(el('h3',t('planArtifacts')));textList(parent,artifacts.map(value=>value===t('genericOutput')?(node.owns?.join(', ')||t('handoff')):outputLabel(value)));}
  const checks=(node.planned_checks||[]).filter(c=>c.type!=='human'||!questions.length);
  if(checks.length){parent.append(el('h3',t('planChecks')));plannedChecks(parent,checks);}
  if(node.kind==='work'&&node.lane>=2){
    parent.append(el('p',t('crossFamily')));
    const runChecks = [...(view.integration_checks||[]),...(view.promoted_checks||[])];
    if(runChecks.length){parent.append(runCheckSchedule(runChecks));plannedChecks(parent,runChecks);}
  }
  if (node.lens) parent.append(el('h3',t('planLens')),el('p',Array.isArray(node.lens)?node.lens.join(' · '):node.lens));
  if(node.kind!=='decision'){const settings=el('details');settings.append(el('summary',t('executionSettings')),el('p',t('planBehaviour',{lane:node.lane,max:node.max_attempts})),el('p',t('planIsolation')),el('p',t('planMerge')));parent.append(settings);}
  if(node.reviewers?.length)parent.append(el('p',t('planReviewers',{value:node.reviewers.map(id=>otherTitle(flowNode(id)?.title||id)).join(', ')})));
  contractDetails(parent,node.contract);groupFacts(parent,start);
}
function planBlocked() { if(!view)return false; const a=view.plan_approval; return !!(view.plan_error || view.key_mismatch || view.location_mismatch || a && !(a.status==='answered' && a.verified && a.outcome==='approved')); }
function problemTitle() { const a=view.plan_approval; return t(view.location_mismatch?'projectMoved':view.key_mismatch?'planKeyHeading':view.plan_error?'planTampered':!a?.id?'planMissing':a.status==='answered'&&!a.verified?'planUnverified':a.status==='open'?(view.has_work?'planContinueQuestion':'planWaiting'):'planSentBack'); }
function returnActor(node) {
  const roles={leader:'returnLeader',reviewer:'returnReviewer',worker:'roleWorker',human:'roleHuman',tool:'roleTool'};
  const role=node.returned_by?.role;
  return Object.hasOwn(roles,role) ? t('returnedActor',{who:t(roles[role])}) : '';
}
function returnedLine(n) {
  const row=[...view.timeline].reverse().find(r=>r.node===n.id&&r.kind==='attempt'&&r.attempt===n.attempts);
  const failure=row?.checks?.find(c=>c.result==='failed');
  return checkWording(failure || {title:n.returned_reason || t('noReason'),result:'failed'},language);
}
let planBanner = null, planSeen=null, planChanges=null, planChangeIds=null;
const planRead = new Set();
const graphRead = new Set(),graphReadSpans=new Map();let graphReadIdentity='';
function unreadCards() {
  return planFlow(view,language).nodes.filter(n=>!graphRead.has(n.id)||planChanges?.some(c=>c.id===n.id&&!planRead.has(c.id)));
}
function graphReadDone() {
  const phone=matchMedia('(max-width:760px)').matches,viewport=phone?{left:0,top:0,right:innerWidth,bottom:innerHeight-(document.querySelector('.plan-actions')?.offsetHeight||0)}:mapViewportRect();
  const outside=viewport&&[...document.querySelectorAll(phone?'#phone-flow .node-card':'#map .node-card')].some(e=>{const r=e.getBoundingClientRect();return r.left<viewport.left||r.right>viewport.right||r.top<viewport.top||r.bottom>viewport.bottom;});
  return t('graphReadDone',{n:view.nodes.length})+(outside?t('readOffscreen'):'');
}
function graphReadReason() {
  if(mode!=='flow'||$('accessible').open||(matchMedia('(max-width:760px)').matches&&selected))return t('planGraphReason',{action:t(view.has_work?'planContinue':'planStart')});
  const remaining=unreadCards();
  return remaining.length?t(remaining.some(n=>planChanges?.some(c=>c.id===n.id&&!planRead.has(c.id)))?'changesReadReason':'planRemainingReason',{names:remaining.map(title).join(', ')}):'';
}
function recordGraphRead() {
  if(isPast()||!view||!planBlocked()||mode!=='flow'||$('accessible').open||(matchMedia('(max-width:760px)').matches&&selected))return;
  const identity=JSON.stringify(view.plan_approval?.identity);
  if(identity!==graphReadIdentity){graphRead.clear();graphReadSpans.clear();graphReadIdentity=identity;}
  const phone=matchMedia('(max-width:760px)').matches&&!$('flow').classList.contains('phone-diagram');
  if(!phone&&$('map').dataset.lod==='far')return;
  const viewport=phone?{left:0,top:0,right:innerWidth,bottom:innerHeight-(document.querySelector('.plan-actions')?.offsetHeight||0)}:mapViewportRect();
  if(!viewport)return;
  const top=Math.max(viewport.top,document.querySelector('#attention.plan-banner')?.getBoundingClientRect().bottom||0);
  for(const card of document.querySelectorAll(phone?'#phone-flow .node-card':'#map .node-card')){
    const r=card.getBoundingClientRect();
    if(r.width&&r.height&&r.left>=viewport.left-.5&&r.right<=viewport.right+.5&&r.bottom>top&&r.top<viewport.bottom){
      const spans=[...(graphReadSpans.get(card.dataset.node)||[]),[Math.max(0,(top-r.top)/r.height),Math.min(1,(viewport.bottom-r.top)/r.height)]].sort((a,b)=>a[0]-b[0]),merged=[];
      for(const span of spans){const last=merged.at(-1);if(last&&span[0]<=last[1]+.002)last[1]=Math.max(last[1],span[1]);else merged.push(span);}
      graphReadSpans.set(card.dataset.node,merged);
      if(merged.some(([a,b])=>a<=.002&&b>=.998))graphRead.add(card.dataset.node);
    }
  }
  updateUnreadMarks();planBanner?.update?.();
}
function updateUnreadMarks(){
  const remaining=new Set(!isPast()&&planBlocked()?unreadCards().map(n=>n.id):[]);
  for(const card of document.querySelectorAll('.node-card')){
    const unread=remaining.has(card.dataset.node);
    let mark=card.querySelector('.unread-mark');
    if(unread){if(!mark){mark=el('p',undefined,'unread-mark');card.append(mark);}mark.textContent=t('cardUnread');}
    else mark?.remove();
  }
}
addEventListener('scroll',recordGraphRead,{passive:true});
$('accessible').addEventListener('toggle',()=>{planBanner?.update?.();recordGraphRead();});
function dependentTitles(id){return releasedNodes(view.nodes,id).map(title).join(', ') || t('runChecksTitle');}
function diffText(field){return contractDiffText(field,language,contractNames(view));}
function renderPlanDiff(parent,id){
  const change=planChanges?.find(c=>c.id===id);if(!change)return;
  const box=el('section',undefined,'plan-diff');box.append(el('h3',t('beforeAfter')));
  for(const field of change.fields||[])box.append(el('p',diffText(field)));parent.append(box);
}
function unreadPlanChanges(){return !!planChanges?.some(c=>!planRead.has(c.id));}
function readPlanChange(id){if(isPast())return;planRead.add(id);updateUnreadMarks();planBanner?.update?.();}


function planAttention(box) {
  const approval = view.plan_approval;
  const blocked = !isPast() && planBlocked();
  if (!blocked) { planBanner = null; return false; }
  box.hidden = false; box.classList.add('plan-banner');
  const key = JSON.stringify([mode, chosen, approval?.id, approval?.status, approval?.verified, approval?.outcome, approval?.answer, view.plan_error, view.key_mismatch, view.location_mismatch, view.has_work, approval?.identity, planChanges]);
  if (planBanner?.key === key && box.firstElementChild) {
    box.querySelector('.plan-summary').textContent = planCounts(view.plan_counts,language,true);
    return true;
  }
  clear(box);
  const unverified = approval?.status === 'answered' && !approval.verified;
  const heading = el('h2', view.location_mismatch ? t('projectMoved') : view.key_mismatch ? t('planKeyHeading') : view.plan_error ? t('planTampered') : !approval?.id ? t('planMissing') : unverified ? t('planUnverified') : approval.status === 'open' ? decisionQuestion({...approval,purpose:'plan_approval',facts:{...approval.facts,continuing:view.has_work}},language) : t('planSentBack'));
  heading.id = 'plan-question'; box.setAttribute('aria-labelledby', heading.id);
  box.append(heading, el('p', planCounts(view.plan_counts,language,true), 'plan-summary'));
  planBanner = {key};
  const problem=view.plan_error || view.key_mismatch || view.location_mismatch || unverified;
  box.classList.toggle('problem',!!problem);
  if(problem){heading.prepend(el('span',t('warning'),'problem-word'));box.append(el('p',t(view.has_work?'workRecorded':'noWorkRecorded'),'plan-notice'));}
  if(view.location_mismatch){box.append(el('p',t('projectMovedHelp')));return true;}
  if (view.key_mismatch) {
    box.append(el('p',t('planKeyMismatch')),el('p',t('keyRecoveryAfter')),button(t('log'),()=>{showMode('home');home();$('home').scrollIntoView({block:'start'});},'link'));
    const recovery=el('details',undefined,'key-recovery');recovery.append(el('summary',t('keyRecover')),el('p',t('keyConfirm')));
    const displayed=structuredClone(view.recovery_identity),message=el('p');
    recovery.append(button(t('keyConfirmAction'),async event=>{
      const target=event.currentTarget;target.disabled=true;
      try{await api('/api/key/repin',{...chosen,displayed,confirm:true});planBanner=null;await refresh(true);}
      catch(error){message.textContent=t(error.code==='stale_decision'?'decisionChanged':'connectionFailed');target.disabled=false;}
    },'primary'),message);box.append(recovery);return true;
  }
  if (!approval?.id && !view.plan_error) { box.append(el('p',t(view.legacy?'oldRunApproval':'planMissingHelp')));if(view.legacy){const version=el('details');version.append(el('summary',t('moreDetails')),el('p',t('oldVersionDetails')));box.append(version);} return true; }
  if (view.plan_error || unverified) {
    if(unverified)box.append(el('p',t('planUnverifiedSource',{source:t(approval.source==='terminal'?'sourceTerminal':approval.source==='dashboard'?'sourceDashboard':'sourceUnknown'),id:approval.id,question:approval.question})));
    box.append(el('p', t(view.plan_error ? 'planTamperedHelp' : 'planUnverifiedHelp')));
    if (view.key_mismatch) box.append(el('p', t('planKeyMismatch')));
    return true;
  }
  if (approval.status !== 'open') {
    const note=el('div',undefined,'plan-return-note');
    note.append(el('p',t('planSentNote'),'eyebrow'),el('p',approval.answer || ''));
    box.append(note,el('p',t('planWaitingRevision'),'muted plan-waiting'));
    return true;
  }
  if(mode!=='flow'){box.append(button(t('viewPlan'),showGraph,'primary'));return true;}
  const ownChecks=view.nodes.flatMap(n=>n.planned_checks||[]).filter(c=>c.runs_own_files).length;if(ownChecks)box.append(el('p',t('ownCheckCards',{names:view.nodes.filter(n=>n.planned_checks?.some(c=>c.runs_own_files)).map(title).join(', ')}),'own-check-note'));
  if (view.legacy) {box.append(el('p',t('oldRunReposted'),'plan-notice'));const version=el('details');version.append(el('summary',t('moreDetails')),el('p',t('oldVersionDetails')));box.append(version);}
  const oldResults=view.legacy?view.nodes.filter(n=>n.preapproval_submission):[];
  if(oldResults.length){
    const list=el('div',undefined,'old-results');list.append(el('p',t('oldResults')));
    for(const n of oldResults){const details=el('details');details.append(el('summary',title(n)));
      for(const row of view.timeline.filter(r=>r.kind==='attempt'&&r.node===n.id))details.append(logRow(row,false,true));
      const required=n.submitted_files||[],read=new Set();
      const mark=()=>{if(required.every(path=>read.has(path)))planRead.add('result:'+n.id);planBanner?.update?.();};
      for(const path of required){const output=el('pre',undefined,'file-reader');output.hidden=true;details.append(button(path,async()=>{try{output.textContent=await api(query('/api/file',{decision:approval.id,path}),null,true);output.hidden=false;read.add(path);decisionController.openFile();mark();}catch{output.textContent=t('fileFailed');output.hidden=false;}}),output);}
      details.addEventListener('toggle',()=>{if(details.open)mark();});list.append(details);}
    box.append(list);
  }
  if(approval.reason==='key_repinned')box.append(el('p',t('keyRepinned',{action:t(view.has_work?'planContinue':'planStart')}),'plan-notice'));
  if (view.replaced_unverifiable) box.append(el('p',t('planReplaced'),'plan-notice'));
  if(planChanges){
    box.append(el('p',t(planChangeIds?.old?'planChangeIds':'newPlanDecision',planChangeIds||{}),'change-notice'));
    const changes=el('div',undefined,'plan-change-list');
    for(const change of planChanges){const item=el('details');item.append(el('summary',t(change.kind)+' · '+change.title));renderPlanDiff(item,change.id);item.addEventListener('toggle',()=>{if(item.open)readPlanChange(change.id);});changes.append(item);}
    box.append(changes);
  }
  const session = decisionController.open(approval.id);
  const actions = el('div', undefined, 'plan-actions'), start = button(t(view.has_work?'planContinue':'planStart'), () => send('approved'), 'primary');
  const startGroup = el('div'), graphReason=el('p',undefined,'action-hint'); startGroup.append(start,graphReason, el('p', t(view.has_work?'planContinueEffect':'planStartEffect'), 'muted'));
  const remainingList=el('ul'),remainingDetails=el('details',undefined,'remaining-cards'),remainingButton=el('summary',t('seeRemaining'));remainingDetails.append(remainingButton,remainingList);startGroup.append(remainingDetails);
  const backGroup = el('div'), changes = el('details',undefined,'plan-change-form'), label = el('label', t('backReason')), input = el('textarea');
  input.id = 'plan-changes'; label.htmlFor = input.id; input.rows = 2; input.value = session?.draft || '';
  const back = button(t('sendBack'), () => send('revision_requested'));back.dataset.outcome='revision_requested';start.dataset.outcome='approved';
  const message = el('p', undefined, 'muted'); message.setAttribute('role', 'status');
  const update = () => { const changed=box.querySelector('.change-notice');if(changed)changed.textContent=t(planChangeIds?.old?(unreadPlanChanges()?'planChangeIds':'planChangesRead'):(unreadPlanChanges()?'newPlanDecision':'newPlanRead'),planChangeIds||{}); const reason=graphReadReason() || (unreadPlanChanges()?t('changesReadReason',{names:planChanges.filter(c=>!planRead.has(c.id)).map(c=>c.title).join(', ')}):'') || (!oldResults.every(n=>planRead.has('result:'+n.id))?t('oldReadReason'):'');const remaining=unreadCards(),phone=matchMedia('(max-width:760px)').matches;
    graphReason.textContent=reason?(phone&&remaining.length>2?t('remainingCount',{n:remaining.length})+' '+remaining.slice(0,2).filter(n=>title(n).length<=12).map(title).join(', '):reason):graphReadDone();
    graphReason.classList.toggle('read-done',!reason);remainingButton.hidden=!reason||remaining.length<=2||!phone;
    remainingList.replaceChildren(...remaining.map(n=>el('li',title(n))));graphReason.hidden=false;start.disabled = !!reason || !decisionController.canSubmit('approved'); back.disabled = unreadPlanChanges() || !decisionController.canSubmit('revision_requested'); input.disabled = !!session?.busy; $('picker').disabled = !!session?.busy; };
  planBanner.update=()=>{update();document.body.style.setProperty('--plan-actions-height',(actions.offsetHeight+24)+'px');};
  input.addEventListener('input', () => { decisionController.setDraft(input.value); update(); });
  async function send(outcome) {
    if(unreadPlanChanges() || outcome==='approved'&&!!graphReadReason() || outcome==='approved'&&!oldResults.every(n=>planRead.has('result:'+n.id)))return;
    const request = decisionController.buildRequest(outcome, input.value); if (!request) return;
    update(); let error = null;
    try { await api('/api/answer', request); } catch (e) { error = e; }
    const result = decisionController.onResult(request, error);
    message.textContent = t(result.notice); update();
    if (result.refresh) refresh(true);
  }
  changes.append(el('summary',t('sendBack')), label, input, back); backGroup.append(changes, el('p', t('planBackEffect'), 'muted'));
  const d={...approval,purpose:'plan_approval'},copy=decisionCopy(d,language);
  heading.dataset.questionBlock='question';
  const why=card(t('qWhy'),copy.why);why.dataset.questionBlock='why';box.insertBefore(why,box.children[1]);
  startGroup.querySelector('.muted').textContent=copy.yes;backGroup.querySelector('.muted').textContent=copy.no;
  startGroup.querySelector('.muted').classList.add('action-effect');startGroup.insertBefore(startGroup.querySelector('.muted'),graphReason);backGroup.querySelector('.muted').classList.add('action-effect');
  const inspect=el('div');inspect.append(button(t('qInspect'),()=>{const target=$('phone-flow').getBoundingClientRect().width?$('phone-flow'):$('map');target.scrollIntoView({block:'start'});}),el('p',t('qPlanInspect'),'action-effect'));
  actions.dataset.questionBlock='choices';actions.append(el('h3',t('qChoices')),startGroup,backGroup,inspect);
  const summary=changes.querySelector('summary');summary.textContent='';summary.append(button(t('sendBack'),()=>{changes.open=!changes.open;}));
  box.insertBefore(actions,box.children[2]);
  const history=el('section');history.dataset.questionBlock='history';history.append(el('h3',t('qHistory')),el('p',t('qPlanHistory',{n:view.nodes.length})));
  const changeEvidence=[...box.children].filter(item=>item.classList.contains('plan-change-list')||item.classList.contains('change-notice'));
  for(const change of view.plan_changes||[])history.append(el('p',t(change.kind==='added'?'qPlanAdded':change.kind==='removed'?'qPlanRemoved':'qPlanChanged',{title:change.title,fields:change.fields.map(f=>STRINGS[language]['field_'+f]||t('diffOther')).join(', ')})));
  const verified=el('section');verified.dataset.questionBlock='verified';verified.append(el('h3',t('qVerified')),el('p',t('qPlanChecks')));
  box.append(history,verified,...changeEvidence,message);planNotices(box,view.notices);heading.append(refChip(approval.id,approval.question,true));update();
  return true;
}
function attention() {
  const planBox = $('attention');
  if (planAttention(planBox)) return;
  planBox.classList.remove('plan-banner','problem'); planBox.removeAttribute('aria-labelledby');
  const box = $('attention'); clear(box); box.hidden = !view.decisions.length;
  if(isPast()) {
    for(const decision of view.decisions) box.append(el('p',question(decision)||purposeWording(decision.purpose,language)));
    return;
  }
  box.setAttribute('aria-label', t('yourTurn'));
  if (box.hidden) return;
  const heading = el('div', undefined, 'attention-heading');
  heading.append(el('span', t('yourTurn')), el('strong', String(actionableDecisions(view,unavailableDecisions).length)));
  const items = el('div', undefined, 'attention-items');
  for (const d of actionableDecisions(view,unavailableDecisions)) {
    const item = el('div', undefined, 'attention-item'), text = el('div'), reference = el('div', undefined, 'ref-line');
    reference.append(refChip(d.id, `${d.id} · ${d.node_title || question(d)}`, true, d.free));
    if (d.node_title) reference.append(el('span', d.node_title));
    if(d.free)text.append(el('p',t('freeQuestion',{who:who(d.asked_by)}),'free-question'),el('p',t('freeEffect')));
    text.append(reference, el('p', question(d) || purposeWording(d.purpose, language)));
    item.append(text, button(t(d.free?'freeRead':'read'), () => openDecision(d.id), d.free?'':'primary')); items.append(item);
  }
  box.append(heading, items);
}
const ACTIVITY_LABELS = {
  read:'activityRead', tool:'activityTool', skill:'activitySkill', mcp:'activityMcp', session:'activitySession',
  gf:'activityGf', other:'activityOther', thinking:'activityThinking', start:'activityStart',
  check:'activityCheck', submit:'activitySubmit', more:'activityMore',
};
let workSummary;
function createWorkSummary() {
  const section = el('section',undefined,'work-summary');
  const heading = el('h3',t('workActivity'));
  heading.id = 'work-summary-heading';
  section.setAttribute('aria-labelledby',heading.id);
  const canvas = el('canvas',undefined,'work-canvas');
  canvas.setAttribute('aria-hidden','true');
  const visual = el('div',undefined,'work-visual'), labels = el('div',undefined,'work-solid-labels');
  visual.append(canvas,labels);
  const globallyPaused=()=>document.body.classList.contains('graph-paused');
  const replay = button(t('activityReplay'),()=>{if(!globallyPaused())scene?.play();},'small');
  const pause = button(t('activityPause'),()=> {
    if(globallyPaused())return;
    if(scene.describe().playing) scene.pause();
    else scene.play(false);
  },'small');
  replay.id = 'activity-replay';
  pause.id = 'activity-pause';
  const controls = el('div',undefined,'work-controls');
  controls.append(replay,pause);
  const header = el('div',undefined,'work-heading');
  header.append(heading,controls);
  const list = el('div',undefined,'work-attempts');
  section.append(header,visual,list);
  controls.hidden = visual.hidden = canvas.hidden = true;
  const phone = matchMedia('(max-width:760px)');
  const forceSVG = startup.searchParams.get('renderer') === 'svg';
  const capture = startup.searchParams.get('graphTest') === '1';
  let scene, loading, disposed, unavailable, signature, activities = [], visible = true, active = null;
  const rowsById=new Map(), labelsById=new Map();
  Object.defineProperty(section,'activityScene',{get:()=>scene?.describe() || null});
  if(capture)Object.defineProperty(section,'activitySilhouettes',{get:()=>scene?.silhouettes()});

  function motion() {
    if(globallyPaused())scene?.pause();
    scene?.mode(reduced.matches || globallyPaused());
    controls.hidden = !scene || reduced.matches || globallyPaused();
  }
  function highlight(id) {
    active = id;
    for(const [key, row] of rowsById){
      const value=String(id===key);
      row.setAttribute('aria-pressed',value);
      labelsById.get(key)?.setAttribute('aria-pressed',value);
    }
    scene?.select(active);
  }
  function sync() {
    const hasPhases = activities.some(attempt=>attempt.phases.length);
    if(phone.matches || !hasPhases) {
      scene?.pause();
      controls.hidden = visual.hidden = canvas.hidden = true;
      return;
    }
    if(scene){
      visual.hidden = canvas.hidden = false;
      controls.hidden = reduced.matches || globallyPaused();
      return;
    }
    if(loading || unavailable || forceSVG || matchMedia('(forced-colors: active)').matches || !visible || typeof WebGL2RenderingContext === 'undefined')return;
    loading = import('./activity-webgl.js').then(({createActivityScene})=>{
      if(disposed || phone.matches || !activities.some(attempt=>attempt.phases.length) || !visible)return;
      const scroller = section.closest('.panel-body');
      const scroll = scroller?.scrollTop;
      visual.hidden = canvas.hidden = false;
      scene = createActivityScene(canvas,{attempts:activities,reduced:reduced.matches||globallyPaused(),autoplay:false,capture,
        onState:(playing,canPause)=>{
          pause.textContent = t(playing || !canPause ? 'activityPause' : 'activityResume');
          pause.disabled = !canPause;
        },
        onLoss:()=>{scene = null; unavailable = true; controls.hidden = visual.hidden = canvas.hidden = true;},
      });
      if(!scene){unavailable = true;visual.hidden = canvas.hidden = true;return;}
      scene.select(active);
      pause.disabled = !scene.describe().playing;
      controls.hidden = reduced.matches || globallyPaused();
      if(scroller)scroller.scrollTop = scroll;
    }).catch(()=>{
      scene?.dispose();
      scene = null; unavailable = true; controls.hidden = visual.hidden = canvas.hidden = true;
    }).finally(()=>{loading = null;});
  }

  function render(data) {
    const next = JSON.stringify([language,data]);
    if(signature === next)return;
    signature = next;
    activities = data;
    heading.textContent = t('workActivity');
    replay.textContent = t('activityReplay');
    const duration = new Intl.NumberFormat(language,{style:'unit',unit:'second',unitDisplay:'short',maximumFractionDigits:2});
    const milliseconds = new Intl.NumberFormat(language,{style:'unit',unit:'millisecond',unitDisplay:'short'});
    const formatDuration = ms => ms < 1000 ? milliseconds.format(ms) : duration.format(ms/1000);
    const time = new Intl.DateTimeFormat(language,{hour:'2-digit',minute:'2-digit',second:'2-digit',fractionalSecondDigits:3,hour12:false});
    const focused = document.activeElement?.id;
    clear(list);clear(labels);rowsById.clear();labelsById.clear();
    if(!data.length)list.append(el('p',t('activityEmpty'),'muted'));
    for(const attempt of data){
      const group = el('section',undefined,'work-attempt');
      group.dataset.attempt = attempt.attempt;
      if(data.length>1)group.append(el('h4',t('activityAttempt',{n:attempt.attempt})));
      if(attempt.status!=='observed'){
        const status = el('p',t(attempt.status==='unreadable'?'activityUnreadable':'activityUnobserved'),'muted');
        status.dataset.activityStatus = attempt.status;
        group.append(status);
      }
      const rows = el('ol',undefined,'work-phases');
      for(const phase of attempt.phases){
        const row = el('li',undefined,'work-phase');
        const id = attempt.attempt + ':' + phase.id;
        Object.assign(row.dataset,{phase:id,category:phase.category,count:phase.count,duration:phase.duration_ms,
          distinct:phase.distinct,errors:phase.errors,inferred:phase.inferred});
        const mark=ACTIVITY_MARKS[phase.category][0];
        const glyph = el('span',mark,'work-glyph');
        glyph.setAttribute('aria-hidden','true');
        const title = t(ACTIVITY_LABELS[phase.label],{n:phase.label==='more'?phase.steps:phase.count});
        const text = el('span',title,'work-label');
        const facts = [];
        if(phase.label==='more'&&phase.count)facts.push(t('activityCount',{n:phase.count}));
        if(phase.distinct)facts.push(t('activityKnown',{d:phase.distinct}));
        if(!['start','submit'].includes(phase.label)&&(phase.unknown!==phase.count||!phase.count)){
          facts.push(t('activityTotalDuration',{time:formatDuration(phase.duration_ms)}));
        }
        if(phase.longest_ms!=null)facts.push(t('activityLongest',{time:formatDuration(phase.longest_ms)}));
        if(phase.unknown)facts.push(t(phase.unknown===phase.count?'activityDurationUnknown':'activitySomeUnknown'));
        if(phase.count)facts.push(t('activityErrors',{n:phase.errors}));
        if(phase.stalled)facts.push(activityName('stalled'));
        if(phase.repeating)facts.push(activityName('repeating'));
        if(phase.includes_inferred&&!phase.inferred)facts.push(t('activityIncludesInferred'));
        if(phase.origin)facts.push(t(`activityOrigin_${phase.origin}`));
        for(const via of phase.via||[])facts.push(t(`activityVia_${via}`));
        if(phase.detail_start_ms!=null)facts.push(t('activityStarted',{time:time.format(phase.detail_start_ms)}));
        if(phase.end_ms!=null)facts.push(t('activityEnded',{time:time.format(phase.end_ms)}));
        const names=Object.entries(phase.tools||phase.checks||{}).map(([name,count])=>name+' × '+count).join(' · ');
        const accessibleName = [activityName(phase.category),title,names,...facts].filter(Boolean).join(' · ');
        row.setAttribute('aria-label',accessibleName);
        const rowButton=button('',()=>highlight(id),'work-phase-button');
        rowButton.id='work-phase-'+id;
        rowButton.append(glyph,text);
        if(names)rowButton.append(el('small',names,'work-facts work-tools'));
        rowButton.append(el('small',facts.join(' · '),'work-facts'));
        row.append(rowButton);
        const solid=button(mark,()=>highlight(id),'work-solid-label');
        solid.id='work-solid-'+id;solid.dataset.solid=id;
        solid.setAttribute('aria-label',accessibleName);
        solid.setAttribute('aria-controls',rowButton.id);
        labels.append(solid);
        rowsById.set(id,rowButton);labelsById.set(id,solid);
        rows.append(row);
      }
      const totals=Object.entries(attempt.totals||{});
      if(totals.length){
        const chart=el('div',undefined,'work-totals');
        chart.setAttribute('role','group');chart.setAttribute('aria-label',t('activityTotals'));
        chart.append(el('strong',t('activityTotals')),el('strong',t('activityTime')),el('strong',t('activityCalls')));
        const maxDuration=Math.max(1,...totals.map(([,total])=>total.duration_ms));
        const maxCalls=Math.max(1,...totals.map(([,total])=>total.count));
        for(const [category,total] of totals){
          const name=activityName(category);
          const caption=el('span',ACTIVITY_MARKS[category][0]+' '+name);
          chart.append(caption);
          for(const [key,max,value,metric] of [
            ['duration_ms',maxDuration,formatDuration(total.duration_ms),'activityTime'],
            ['count',maxCalls,String(total.count),'activityCalls'],
          ]){
            const cell=el('span',value),bar=el('meter');
            bar.max=max;bar.value=total[key];bar.dataset.total=key;bar.dataset.category=category;
            bar.setAttribute('aria-label',name+' · '+t(metric));
            cell.prepend(bar);chart.append(cell);
          }
        }
        group.append(chart);
      }
      group.append(rows);
      list.append(group);
    }
    scene?.update(data);
    highlight(rowsById.has(active)?active:null);
    if (focused) $(focused)?.focus({preventScroll:true});
    sync();
  }
  const onPhone = () => sync();
  reduced.addEventListener('change',motion);
  phone.addEventListener('change',onPhone);
  return {section,render,globalMotion:motion,visible(value){visible=value;if(!visible)scene?.pause();else sync();},dispose(){
    disposed = true; scene?.dispose();
    reduced.removeEventListener?.('change',motion);
    phone.removeEventListener?.('change',onPhone);
  }};
}

let panelFingerprint='',panelNode=null;
const PANEL_TEXT = 'p,li,summary,h3,pre';
function panelBody(shell) {
  const body=el('div',undefined,'panel-body');
  const clip=()=>{
    const leaves=[...body.querySelectorAll(PANEL_TEXT)].filter(text=>{
      if(text.querySelector(PANEL_TEXT))return false;
      const closed=text.closest('details:not([open])');
      return !closed || (text.closest('summary')?.parentElement===closed && !closed.parentElement.closest('details:not([open])'));
    });
    wholeTextLines(leaves,body.getBoundingClientRect(),1);
  };
  shell.onscroll=clip;
  body.addEventListener('scroll',clip,{passive:true});
  body.addEventListener('toggle',clip,true);
  return body;
}
function edgeDirection(edge, flow) {
  return title(flow.nodes.find(node=>node.id===edge.from))+' → '+title(flow.nodes.find(node=>node.id===edge.to));
}

function recordReference(labelKey, record) {
  const kind={
    'node.start':'edgeRecordStart','node.submit':'edgeRecordSubmission','review.submit':'edgeRecordReview',
    'check.result':'edgeRecordCheck','check.red':'edgeRecordCheck','gate.verdict':'edgeRecordVerdict',
    'decision.ask':'edgeRecordDecision','decision.answer':'edgeRecordDecision',
  }[record.kind];
  const caption=t(kind)+' '+record.id;
  const row=el('p',undefined,'ref-line edge-record');
  row.dataset.recordRole=labelKey;row.dataset.recordId=record.id;row.dataset.recordSeq=record.seq;
  const chip=refChip(record.id,caption,kind==='edgeRecordDecision');
  chip.textContent=caption;
  row.append(el('span',t(labelKey)),chip);
  if(record.time){
    const time=el('time',clock(record.time,true));time.dateTime=record.time;row.append(time);
  }
  const verdict={pass:'checkPassed',reject:'lineSampleReturned',replan:'edgeVerdictReplan',
    hold:'edgeVerdictHold',needs_approval:'lineSampleWaiting',unverified:'edgeVerdictUnverified'}[record.verdict];
  const outcome={approved:'answeredApproval',rejected:'answeredRejection',revision_requested:'answeredRevision',answered:'evAnswered'}[record.outcome];
  for(const text of [record.check,verdict&&t(verdict),record.rule,outcome&&t(outcome)])if(text)row.append(el('span',text));
  return row;
}

function openDrawer(shell){
  const entering=shell.hidden;
  shell.hidden=false;$('flow').classList.add('has-selection');
  if(entering && !reduced.matches && !document.body.classList.contains('graph-paused')){
    const phone=matchMedia('(max-width:760px)').matches;
    shell.animate?.([{transform:phone?'translateY(100%)':'translateX(100%)'},{transform:'none'}],
      {duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
}

function edgePanel(shell, flow, edges) {
  const edge=selectedEdge ? edges[0] : null;
  const signature=JSON.stringify([selectedEdge,edges,edges.map(item=>edgeDirection(item,flow)),language]);
  if(signature===panelFingerprint)return;
  panelFingerprint=signature;panelNode=null;
  clear(shell);
  delete shell.dataset.node;
  shell.dataset.edge=edge ? edgeKey(edge) : '';
  shell.dataset.trunk=String(!edge);
  openDrawer(shell);
  const name=edge ? edgeDirection(edge,flow) : t('edgeChoose');
  shell.setAttribute('aria-label',name);
  const close=button('×',()=>closeEdge(true),'panel-close');close.setAttribute('aria-label',t('closeDetails'));
  const intro=el('div',undefined,'panel-intro');
  intro.append(el('strong',name));
  if(edge)intro.append(el('p',edgeRelationLabel({...edge,label:''},language),'node-sentence'));
  const bar=el('div',undefined,'panel-bar');bar.append(intro,close);
  const body=panelBody(shell);
  shell.append(bar,body);
  if(!edge){
    const choices=el('ul',undefined,'edge-choices');
    for(const item of edges){
      const row=el('li'),key=edgeKey(item);
      const pick=button(edgeDirection(item,flow)+' · '+edgeRelationLabel({...item,label:''},language),()=>selectEdge(key,edgeOrigin));
      pick.dataset.edgeKey=key;row.append(pick);choices.append(row);
    }
    body.append(choices);
    return;
  }
  const state=el('dl',undefined,'edge-states');
  state.append(el('dt',t('edgeGate')),el('dd',gateText(edge)),el('dt',t('edgeFlow')),el('dd',flowText(edge)));
  if(edge.label)state.append(el('dt',t('edgeArtifact')),el('dd',label(edge.label)));
  body.append(state);
  const {record,delivery,gate_record:gate} = edge.flow || {};
  const sameRecord=gate && record && gate.seq===record.seq;
  if(gate&&!sameRecord)body.append(recordReference('edgeGateRecord',gate));
  if(record){
    const role=edge.flow.state==='returned'?
      (sameRecord?'edgeGateReturnRecord':'edgeReturnRecord'):(sameRecord?'edgeGateFlowRecord':'edgeFlowRecord');
    body.append(recordReference(role,record));
  }
  if(delivery && delivery.seq!==record?.seq)body.append(recordReference('edgeDeliveryRecord',delivery));
}

function panel() {
  const shell = $('panel');
  const node = flowNode(selected);
  const {activity, ...details} = node || {};
  const showSummary = !planBlocked() && ['work','review'].includes(node?.kind);
  if(workSummary && (!showSummary || panelNode!==selected)){
    workSummary.dispose();
    workSummary = null;
  }
  if(selectedEdge || edgeChoices.length){
    const flow=planFlow(view,language);
    const keys=new Set(selectedEdge?[selectedEdge]:edgeChoices);
    const edges=flow.edges.filter(edge=>keys.has(edgeKey(edge)));
    if(edges.length){edgePanel(shell,flow,edges);return;}
  }
  delete shell.dataset.edge;
  delete shell.dataset.trunk;
  const signature=JSON.stringify([isPast(),selected,details,view.decisions.filter(d=>d.node===selected),view.timeline.filter(r=>r.node===selected)]);
  if(signature===panelFingerprint){
    workSummary?.render(activity || []);
    return;
  }
  panelFingerprint=signature;
  const scroll=selected===panelNode?(shell.querySelector('.panel-body')?.scrollTop||0):0;
  panelNode=selected;
  clear(shell);
  if(node)openDrawer(shell);else{shell.hidden=true;$('flow').classList.remove('has-selection');}
  if (!node) {shell.onscroll=null;return;}
  const p=panelBody(shell);
  shell.dataset.node=node.id;
  shell.setAttribute('aria-label', title(node));
  const close = button('×',closeNode,'panel-close');close.setAttribute('aria-label',t('closeDetails'));
  const reference = el('p', undefined, 'ref-line'); reference.append(refChip(node.id, `${node.id} · ${title(node)}`));
  if(workedBy(node))reference.append(el('span',t('workedBy',{who:workedBy(node)})));
  const referenceDetails=el('details');referenceDetails.append(el('summary',t('nodeReference')),reference);
  const panelBar=el('div',undefined,'panel-bar'),intro=el('div',undefined,'panel-intro'); intro.append(el('strong',title(node)),el('p',nodeSentence(node,view.nodes,language),'node-sentence')); panelBar.append(intro,close); shell.append(panelBar,p);
  for (const d of view.decisions.filter(d => d.node === node.id)) {
    const ask = card(t('yourTurn'), question(d) || purposeWording(d.purpose, language), true);
    if(!isPast())ask.append(refChip(d.id, `${d.id} · ${title(node)}`, true, d.free),button(t('read'),()=>openDecision(d.id),'primary'));
    p.append(ask);
  }
  if(showSummary){
    workSummary ||= createWorkSummary();
    p.append(workSummary.section);
    workSummary.render(activity || []);
  }
  p.append(el('p', status(node), 'panel-status '+cardTone(node)));

  if(node.waiting_for_review_correction)p.append(el('p',t('reviewWaiting')));
  if(node.review_needs_correction)p.append(el('p',t('reviewCorrection')));
  if (node.runLevel || view.plan_approval && !(view.plan_approval.verified && view.plan_approval.outcome === 'approved')) {
    planFacts(p, node); if(!node.runLevel)p.append(referenceDetails); p.scrollTop=scroll; return;
  }
  if (displayState(node,view.decisions)==='returned') {
    const actor=returnActor(node);
    p.append(el('p',[returnedLine(node),actor].filter(Boolean).join(' · ')));
  }
  p.append(referenceDetails, el('p', attempts(node)));
  const rows = view.timeline.filter(r => r.node === node.id && r.kind === 'attempt').sort((a,b)=>b.seq-a.seq);
  if (rows.length) p.append(el('p', t('attemptsOf'), 'eyebrow'));
  const list = el('ol', undefined, 'panel-history');
  let earlier=false;
  for (const r of rows) {
    const item = el('li'); item.className=r.attempt===node.attempts?'current-history':'earlier-history'; if(r.attempt===node.attempts || !earlier)item.append(el('strong',view.complete?t('attemptShort',{n:r.attempt}):attemptHeading(r,r.attempt!==node.attempts)));if(r.attempt!==node.attempts)earlier=true;if(r.attempt!==node.attempts)item.append(wording(rowSentence(r),'p'));
    const extra=el('details');extra.open=!!rowOpen.get('panel:'+r.id);extra.addEventListener('toggle',()=>rowOpen.set('panel:'+r.id,extra.open)); extra.append(el('summary',t('attemptRecord',{n:r.attempt})));
    extra.append(attemptChecks(r));
    for(const [key,values] of [['workerNote',r.notes?[r.notes]:[]],['changedFiles',r.files||[]],['findings',r.findings||[]],['unsure',r.unsure||[]]])if(values.length){extra.append(el('p',t(key),'eyebrow'));textList(extra,values);}
    if(r.checks.length||r.skipped_checks?.length||r.notes||r.files?.length||r.findings?.length||r.unsure?.length)item.append(extra);
    list.append(item);
  }
  p.append(list);
  const more=el('details');more.open=!!rowOpen.get('panel:'+node.id);more.addEventListener('toggle',()=>rowOpen.set('panel:'+node.id,more.open));more.append(el('summary',t('workerDetails')));
  more.append(el('h3',t('roleWorker')),el('p',workedBy(node)));groupFacts(more,1);planFacts(more, node);

  if(view.complete){const files=[...new Set(rows.flatMap(r=>r.state==='passed'?r.files||[]:[]))];if(files.length){p.append(el('h3',t('resultLocations')));textList(p,files);}}
  p.append(more,button(t('showInLog'),()=>showNode(node.id),'small'));
  p.scrollTop=scroll;


}
// One entry of the record. An attempt carries its real checks; the rest are single sentences.
const rowOpen = new Map(), logShown = new Map();
function attemptHeading(r,earlier){return view.complete?t('attemptResult',{n:r.attempt,result:stateWords(displayState({status:r.state==='returned'?'rejected':r.state}),language).name}):t(earlier?'earlierAttempt':'currentAttempt');}
function rowSentence(r) {
  const n = r.attempt || 1;
  if (r.kind === 'superseded') return t(r.reason==='key_repinned'?(r.purpose==='free'?'keyQuestionReplaced':'keyDecisionReplaced'):r.reason==='evidence_changed'?(r.purpose==='free'?'evidenceQuestionReplaced':'evidenceDecisionReplaced'):'evSuperseded');
  if (r.kind === 'started') return t('evStarted');
  if (r.kind === 'repinned') return t(r.verified?'evRepinned':'unverifiedAnswer');
  if (r.kind === 'planned' && r.replaced_unverifiable) return t('planReplaced');
  if (r.kind === 'planned' && r.wording_only) return t('evWording',{rev:r.revision}) + (r.question_wording_changed?.length ? ' · ' + t('evQuestionWording',{nodes:r.question_wording_changed.map(n=>n.title).join(', ')}) : '');
  if (r.kind === 'planned') return (r.replaced_unverifiable ? t('planReplaced') : r.revision > 1 ? t('evReplanned', {rev:r.revision}) : t('evPlanned')) + ' · ' + (r.counts ? planCounts(r.counts,language) : t('planItems',{n:r.count}));
  if (r.kind === 'final') return r.result === 'passed' ? t('evFinalPassed') : [t('evFinalFailed'), ...(r.failed || [])].join(' · ');
  if (r.kind === 'learned') return `${t('evLearned')} · ${r.text}`;
  if (r.kind === 'reopened') return [t('evReopened'), r.reason].filter(Boolean).join(' · ');
  if (r.kind === 'asked') return [t(r.purpose==='free'?'evAsked':'evDecisionAsked'), r.question].filter(Boolean).join(' · ');
  if (r.kind === 'answered' && !r.verified) return t('unverifiedSource',{source:t(r.source==='terminal'?'sourceTerminal':r.source==='dashboard'?'sourceDashboard':'sourceUnknown')});
  if (r.kind === 'answered' && r.purpose === 'plan_approval' && r.outcome === 'approved') return [t('answeredPlan'),r.answer].filter(Boolean).join(' · ');
  if (r.kind === 'answered') return [t(({approved:'answeredApproval', revision_requested:'answeredRevision', rejected:'answeredRejection'})[r.outcome] || 'evAnswered'), r.answer].filter(Boolean).join(' · ');
  const failed = (r.checks || []).filter(c => c.result === 'failed').map(c => checkTitle(c, language)), passed = (r.checks || []).filter(c => c.result === 'passed').length;
  const current = view.nodes.find(node => node.id === r.node && node.attempts === r.attempt);
  if(current?.preapproval_submission)return stateWords('preapprovalSubmitted',language).name+' · '+t('preapprovalExplanation');
  const checks=current?.planned_checks||[],total=Math.max((r.checks||[]).length,checks.filter(c=>c.type!=='human').length),human=checks.filter(c=>c.type==='human').length;
  const outcome = total && r.state !== 'running' ? t('checkProgress',{total,passed})+(human?' · '+t('humanCheckCount',{n:human}):'') : '';
  const stateKey=displayState({status:({returned:'rejected',needs_you:'awaiting_approval'}[r.state]||r.state),attempts:n},current&&needs(current)&&!['returned','replan','passed'].includes(r.state)?[{node:undefined}]:[]);
  return [current?.kind==='review'&&r.state==='running'?t('reviewing'):stateWords(stateKey,language).name,outcome,returnActor(r)].filter(Boolean).join(' · ');
}
function rowTone(r) {
  const current=view.nodes.find(n=>n.id===r.node && n.attempts===r.attempt);
  if(current && needs(current) && !['returned','replan','passed'].includes(r.state))return 'mine';
  if (r.kind === 'asked' || r.kind === 'answered' || r.state === 'needs_you') return 'mine';
  if (r.kind === 'reopened' || r.state === 'returned' || r.state === 'replan' || (r.kind === 'final' && r.result !== 'passed')) return 'returned';
  if (r.state === 'passed' || (r.kind === 'final' && r.result === 'passed')) return 'passed';
  return r.state === 'running' || r.state === 'submitted' ? 'running' : '';
}
function checkLine(c, attempt) {
  const item = el('li', undefined, c.result === 'failed' ? 'check-failed' : '');
  const result = c.timed_out ? t('checkTimedOut') : t(c.result === 'failed' ? 'checkFailed' : 'checkPassed');
  item.append(wording(checkWording(c, language, attempt),commandTitle(c)?'code':'strong'));
  if(c.timed_out)item.append(el('span', ' · '+result));
  if ((!c.type || c.type === 'cmd') && c.command) { const run = el('p', undefined, 'muted'); run.append(el('span', t('ranCommand')+': '), el('code', c.command), el('span', [c.exit_code === null || c.exit_code === undefined ? '' : ' → ' + t(c.exit_code === 0 ? 'exitSuccess' : 'exitFailure', {n:c.exit_code}), typeof c.duration_ms === 'number' ? t('seconds', {n:(c.duration_ms / 1000).toFixed(2)}) : ''].filter(Boolean).join(' · '))); item.append(run); }
  if (c.violations?.length) item.append(el('p', t('outside', {files:c.violations.join(', ')})));
  if (c.log) {
    const output = el('pre'); output.hidden = true; output.tabIndex = 0;
    const show = text => { output.textContent = text; output.hidden = false; toggle.textContent = t('hideLog'); };
    const target = chosen, toggle = button(t('showLog'), async () => {
      if (!output.hidden) { output.hidden = true; toggle.textContent = t('showLog'); logShown.delete(c.log); return; }
      try { const text = await api(query('/api/evidence', {path:c.log}, target), null, true); if (sameRun(target, chosen)) logShown.set(c.log, text); show(text); } catch { show(t('logFailed')); }
    }, 'small');
    item.append(toggle, output); if (logShown.has(c.log)) show(logShown.get(c.log));
  }
  return item;
}
function attemptChecks(row) {
  const list = el('ul', undefined, 'checks');
  for (const check of row.checks) list.append(checkLine(check, row.attempt));
  for (const check of row.skipped_checks || []) {
    const item = el('li', undefined, 'check-skipped');
    item.append(el('strong', check.title || check.check),
      el('p', t('checkSkipped', {tasks:taskNames(check.pending_nodes)})));
    list.append(item);
  }
  return list;
}
function logRow(r, anchor = true, inline = false) {
  const isEarlier=r.kind==='attempt' && view.timeline.some(row=>row.kind==='attempt'&&row.node===r.node&&row.seq>r.seq);
  const item = el('li', undefined, rowTone(r)+(isEarlier?' earlier-history':' current-history')); if (anchor) item.id = r.id;
  const head = el('div', undefined, 'row-head'), text = el('span', undefined, 'row-text');
  const stamp=el('span', clock(r.ts, true), 'row-time');
  if(view.timeline.filter(row=>row.ts===r.ts).length>1)stamp.title=t('recordOrder',{n:view.timeline.filter(row=>row.ts===r.ts).findIndex(row=>row.id===r.id)+1});
  head.append(stamp);
  if (r.decision) text.append(refChip(r.decision, `${r.decision} · ${r.node_title || r.question}`, true, r.purpose==='free'));
  if (r.node) text.append(el('strong', title({id:r.node, title:r.node_title})));
  text.append(wording(rowSentence(r))); head.append(text);
  const by = [['answered','repinned'].includes(r.kind) && !r.verified ? '' : r.kind==='attempt'?t('roleWorker'):who(r.by), r.kind === 'attempt' && r.worker?.model&&![STRINGS.ko.roleWorker,STRINGS.ko.roleLeader,STRINGS.en.roleWorker,STRINGS.en.roleLeader].includes(r.worker.model) ? t('modelName',{model:r.worker.model}) : ''].filter(Boolean).join(' · ');
  if (by) head.append(el('span', by, 'row-who'));

  item.append(head);
  if (r.kind !== 'attempt') return item;
  const extra = [['reason', r.reason && !r.checks.some(c => c.result === 'failed') ? [r.reason] : []], ['findings', r.findings || []], ['workerNote', r.notes ? [r.notes] : []], ['unsure', r.unsure || []], ['changedFiles', r.files || []]].filter(([, values]) => values.length);
  if (!r.checks.length && !r.skipped_checks?.length && !extra.length) return item;
  const details = el(inline ? 'div' : 'details'); details.open = rowOpen.has(r.id) ? rowOpen.get(r.id) : !isEarlier && (r.state === 'returned' || r.state === 'replan');
  details.addEventListener('toggle', () => rowOpen.set(r.id, details.open));
  if (!inline) details.append(el('summary', t('rowDetails')));
  if (r.checks.length || r.skipped_checks?.length) details.append(attemptChecks(r));
  for (const [key, values] of extra) { details.append(el('p', t(key), 'eyebrow')); textList(details, values); }
  item.append(details); return item;
}
function logList(rows, empty, anchor = true) {
  const list = el('ol', undefined, 'log');
  if (!rows.length) list.append(el('li', t(empty)));
  let day='';
  [...rows].sort((a, b) => b.seq - a.seq).forEach(r => {
    const date = r.ts ? new Date(r.ts).toLocaleDateString(language, {year:'numeric',month:'long',day:'numeric'}) : '';
    if(date && date!==day){const heading=el('li',undefined,'log-day');heading.append(el('h3',date));list.append(heading);day=date;}
    list.append(logRow(r, anchor));
  });
  return list;
}
let logFilter = 'all', logNode = null, found = null, mark = null;
function home() {
  const box = $('home'); clear(box);
  const pending=actionableDecisions(view,unavailableDecisions).filter(d=>d.purpose!=='plan_approval');
  const blocked=planBlocked(),inbox = el('section'); inbox.append(el('h2', t(pending.length||blocked ? 'needsYou' : 'nothingTitle')));

  pending.forEach(d => inbox.append(decisionCard(d)));
  if (!pending.length&&!blocked) inbox.append(el('p', t('nothing'), 'muted'));
  if(pending.length || !blocked && !view.complete)box.append(inbox);
  if (!view.complete) {
    const now = el('section'), list = el('ul', undefined, 'now'); now.append(el('h2', t('doingNow')));
    const active = view.nodes.filter(n => !needs(n) && !['passed','pending','ready','blocked'].includes(n.status) && n.attempts);
    for (const n of active) {
      const item = el('li'); if (n.status === 'running') item.append(walker());
      item.append(el('strong', title(n)), el('span', `${status(n)} · ${attempts(n)}`));
      const by = [workedBy(n), clock(n.started) ? t('since', {time:clock(n.started)}) : ''].filter(Boolean).join(' · '); if (by) item.append(el('span', by, 'row-who'));
      list.append(item);
    }
    now.append(active.length ? list : el('p', t('idle'), 'muted')); if (active.length || !view.decisions.length) box.append(now);
  }
  const log = el('section'); log.id = 'log'; log.append(el('h2', t('log')));
  const filters = el('div', undefined, 'filters');
  for (const [key, name] of [['all','filterAll'],['mine','filterMine'],['returned','filterReturned']]) { const b = button(t(name), () => { logFilter = key; home(); }, 'small'); b.setAttribute('aria-pressed', String(logFilter === key)); filters.append(b); }
  const only = view.nodes.find(n => n.id === logNode);
  if (only) filters.append(el('span', t('onlyNode', {title:title(only)})), button(t('showAll'), () => { logNode = null; home(); }, 'small'));
  const rows = view.timeline.filter(r => (!only || r.node === only.id) && (logFilter === 'all' || rowTone(r) === (logFilter === 'mine' ? 'mine' : 'returned')));
  log.append(filters, logList(rows, view.timeline.length ? 'filterEmpty' : 'logEmpty')); box.append(log);
  const tasks = el('details'); tasks.id = 'tasks'; tasks.open = !!rowOpen.get('tasks'); tasks.addEventListener('toggle', () => rowOpen.set('tasks', tasks.open));
  tasks.append(el('summary', t('planItemsTable', {n:view.nodes.length})));
  const wrap = el('div', undefined, 'table-wrap'), table = el('table', undefined, 'tasks'), heads = el('tr');
  ['colTask','colStatus','colWorker','colTries','colWaits'].forEach(key => { const th = el('th', t(key)); th.scope = 'col'; heads.append(th); }); table.append(heads);
  for (const n of view.nodes) {
    const line = el('tr'), name = el('td'); name.append(button(title(n), () => showNode(n.id), 'link'));
    const waits = n.inputs.filter(i => !i.delivered).map(i => otherTitle(i.other_title));
    line.append(name, el('td', status(n)), el('td', workedBy(n)), el('td', `${n.attempts || 0}/${n.max_attempts || 3}`), el('td', [...new Set(waits)].join(', '))); table.append(line);
  }
  wrap.append(table); tasks.append(wrap); box.append(tasks);
  if (view.lessons.length) { const lessons = el('details'); lessons.open = !!rowOpen.get('lessons'); lessons.addEventListener('toggle', () => rowOpen.set('lessons', lessons.open)); lessons.append(el('summary', t('lessonsCount', {n:view.lessons.length}))); textList(lessons, view.lessons.map(l => l.node_title ? `${otherTitle(l.node_title)} · ${l.text}` : l.text)); box.append(lessons); }
  const marked = document.getElementById(mark || ''); if (marked) marked.classList.add('found');
  if (found) { const target = document.getElementById(found); found = null; if (target) target.scrollIntoView({block:target.id === 'log' ? 'start' : 'center', behavior:reduced.matches||document.body.classList.contains('graph-paused') ? 'auto' : 'smooth'}); }
}
// Show one task's entries in the record, where the agent's words about it can be matched by time.
function showNode(id) { if (!showMode('home')) return; logNode = id; logFilter = 'all'; mark = null; found = 'log'; home(); }
function wholePhoneCards() {
  if(!matchMedia('(max-width:760px)').matches || $('flow').hidden)return;
  for(const card of $('phone-flow').querySelectorAll('.node-card')) {
    const rect=card.getBoundingClientRect();
    card.style.visibility='visible';
  }
}
addEventListener('scroll',wholePhoneCards,{passive:true});
addEventListener('resize',wholePhoneCards);
function accessible() {
  $('accessible').hidden=!!view.plan_error;
  clear($('node-list')); clear($('edge-list')); clear($('decision-list'));
  const flow=planFlow(view,language);
  const work=flow.nodes.filter(n=>!n.runLevel);
  const templates=work.map(n=>JSON.stringify((n.planned_checks||[]).map(c=>[c.type,c.title,(c.command||'').split(n.owns?.[0]||'\u0000').join('{file}')] )));
  const repeated=work.length>20&&new Set(templates).size===1;
  if(repeated){const note=el('li',t('repeatedSteps',{n:work.length}),'repeated-note');note.style.counterIncrement='list-item 0';$('node-list').append(note);}
  const order = layeredLayout(flow.nodes,flow.edges,flow.decisions).order;
  [...flow.nodes].sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id)).forEach(n => { const item = el('li', undefined, 'card'); item.dataset.node=n.id; item.append(button(title(n), () => selectNode(n.id)), el('p', status(n))); if(!n.runLevel)item.append(el('p', attempts(n), 'muted')); if(planBlocked()){if(flow.nodes.length>20){const more=el('details');more.open=$('node-list').children.length===(repeated?1:0);more.append(el('summary',t('moreDetails')));planFacts(more,n);item.append(more);}else planFacts(item,n);} else item.append(el('p', n.runLevel?view.goal:n.summary)); if (n.returned_reasons.length) textList(item, n.returned_reasons.flatMap((reasons,i)=>reasons.map(reason=>t('earlierFailure',{n:i+1,reason}))), 'noReason'); $('node-list').append(item); });
  function edgeButton(edge, cls) {
    const key=edgeKey(edge);
    const b=button([edgeDirection(edge,flow),relationText(edge),gateText(edge),edgeTag(edge,language).text].filter(Boolean).join(' · '),
      event=>selectEdge(key,event.currentTarget),cls);
    b.dataset.edgeKey=key;b.setAttribute('aria-pressed',String(selectedEdge===key));
    return b;
  }
  for(const edge of flow.edges){
    const row=markRelation(el('li'),edge);
    row.append(edgeButton(edge));$('edge-list').append(row);
  }
  view.decisions.forEach(d => { const item = el('li'); decisionHeading(item, d, 'h3'); failedBlock(item, d); if (d.context.why) item.append(el('p', d.context.why)); $('decision-list').append(item); });
  if (!view.decisions.length) $('decision-list').append(el('li', t('nothingTitle')));
  const listHeading=$('accessible').querySelector('h2');if(listHeading)listHeading.textContent=planCounts(view.plan_counts,language);
  const phone=$('phone-flow');
  clear(phone);
  for(const id of order){
    const n=flow.nodes.find(n=>n.id===id),item=el('li');item.append(nodeCard(n,n.id===selected,'detail',displayState(n,view.decisions)));
    const edges=flow.edges.filter(e=>e.from===id);
    for(const e of edges)item.append(markRelation(edgeButton(e,'phone-handoff'),e));
    phone.append(item);
  }
  wholePhoneCards();setTimeout(recordGraphRead,0);
}
function showMode(next) {
  if (next !== 'decision' && (mode === 'decision' || next === 'home') && !discardDecision()) return false;
  if(next==='home' && isPast())timeBar.returnLive();
  mode = next; if(view&&planBlocked())planAttention($('attention')); $('attention').hidden = (isPast()||!planBlocked()) && (next!=='flow' || !view?.decisions.length); $('home').hidden = next !== 'home'; $('flow').hidden = next !== 'flow'; $('decision').hidden = next !== 'decision'; $('accessible').hidden = next !== 'flow' || !!view?.plan_error;
  workSummary?.visible(next === 'flow');
  $('home-tab').setAttribute('aria-pressed', String(next === 'home')); $('flow-tab').setAttribute('aria-pressed', String(next === 'flow'));
  // The map can only measure its cards while it is on screen.
  if (renderer && next === 'flow' && view) renderer.update(view, selected); wholePhoneCards(); return true;
}
function discardDecision() {
  if (!decisionController.close()) return false;
  decisionUI = null; planBanner = null; clear($('decision')); return true;
}
function closeInvalidDecision(run, decisions, nextView = {decisions}) {
  const old=decisionController.session?.target.id;
  if(planChanges && old===planChangeIds?.old){decisionController.close();decisionController.refresh(nextView,run);decisionNotice='';notice('');return false;}
  let reason = decisionController.refresh(nextView, run);
  const stale=nextView.stale_decisions?.find(d=>d.id===old);
  if(stale && reason){if(stale.reason==='evidence_changed' && mode==='decision'){showChangedDecision();return true;}reason='legacyDecision';}
  if (!reason) return false;
  if (mode === 'decision') leaveDecision(); decisionNotice = reason; notice(decisionNotice); return true;
}
function showChangedDecision(){const changed=decisionController.session?.decision,free=!!changed?.free;unavailableDecisions.push(decisionController.session?.target.id);updateSubtitle();decisionController.close();decisionUI=null;const box=$('decision');clear(box);box.classList.add('decision-changed');box.append(el('p',t('decisionRef',{id:changed.id})+' · '+decisionTitle(changed)),el('p',question(changed)),el('h2',t(free?'freeEvidenceChanged':'evidenceChanged')),el('p',t('waitForNewQuestion'),'change-notice'),button(t('backToTab',{tab:t('graph')}),showGraph));$('picker').disabled=false;}
function goHome() { if (showMode('home') && view) home(); }
function showGraph() { if (!showMode('flow')) return; attention(); panel(); }
function refreshEdgeSelection() {
  panel();
  for(const b of document.querySelectorAll('#edge-list button, #phone-flow .phone-handoff')){
    b.setAttribute('aria-pressed',String(b.dataset.edgeKey===selectedEdge));
  }
  for(const card of $('phone-flow').querySelectorAll('.node-card')){
    const expanded=card.dataset.node===selected;
    card.classList.toggle('expanded',expanded);
    card.querySelector('.node-header').setAttribute('aria-expanded',String(expanded));
  }
  renderer?.select(selected);
}
function closeEdge(returnFocus) {
  const source=edgeOrigin,key=selectedEdge;
  selectedEdge=null;edgeChoices=[];edgeOrigin=null;
  refreshEdgeSelection();
  if(returnFocus){
    const replacement=[...document.querySelectorAll('#edge-list button, #phone-flow .phone-handoff')]
      .find(b=>b.dataset.edgeKey===key&&b.getBoundingClientRect().width);
    (source?.isConnected ? source : replacement || $('map').querySelector('.map-viewport'))?.focus({preventScroll:true});
  }
}
function selectEdge(key, origin) {
  if(mode!=='flow'&&!showMode('flow'))return;
  if(selectedEdge===key){closeEdge(false);return;}
  const fromChooser=edgeChoices.length>0 && $('panel').contains(document.activeElement);
  selected=null;selectedEdge=key;edgeChoices=[];edgeOrigin=origin;
  refreshEdgeSelection();
  if(fromChooser)$('panel').querySelector('.panel-close')?.focus({preventScroll:true});
}
function chooseEdge(keys, origin) {
  selected=selectedEdge=null;edgeChoices=keys;edgeOrigin=origin;
  refreshEdgeSelection();
  $('panel').querySelector('.edge-choices button')?.focus({preventScroll:true});
}
function closeNode(){
  const id=selected;
  selectNode(id);
  const card=[...document.querySelectorAll('.node-card')].find(element=>element.dataset.node===id&&
    element.getBoundingClientRect().width&&element.parentElement?.style.visibility!=='hidden');
  card?.querySelector('.node-header')?.focus({preventScroll:true});
}
function selectNode(id) {
  if (!showMode('flow')) return;
  selected = selected === id ? null : id;
  selectedEdge=null;edgeChoices=[];edgeOrigin=null;
  refreshEdgeSelection();
  if(selected)readPlanChange(selected);
  planBanner?.update?.();
  if(selected&&!matchMedia('(max-width:760px)').matches){
    const reveal=()=>{
      if(selected!==id||$('panel').hidden)return;
      const r=$('panel').querySelector('.panel-intro').getBoundingClientRect();
      if(r.top<0||r.bottom>innerHeight)
        window.scrollBy(0,r.top<0?r.top-12:r.bottom-innerHeight+12);
    };
    reveal();
    document.fonts?.ready.then(reveal);
    const opening=$('panel').getAnimations?.()||[];
    if(opening.length)Promise.allSettled(opening.map(animation=>animation.finished)).then(reveal);
  }
}
function focusHeading(heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
function openDecision(id, focus = true) {
  if(isPast())return;
  replacementDecision=null; decisionNotice=''; notice('');
  if (view.decisions.find(d => d.id === id)?.purpose === 'plan_approval') {
    showGraph(); attention(); if (focus) $('plan-question')?.focus({preventScroll:true}); return;
  }
  const session = decisionController.open(id); if (!session) return;
  const current = () => decisionController.session === session;
  const d = session.decision;
  if (decisionUI?.session === session) { decisionUI.update(); return; }
  decisionNotice = ''; notice('');
  if (mode !== 'decision') cameFrom = mode;
  showMode('decision'); const box = $('decision'); clear(box);box.classList.remove('decision-changed');
  const reading = card(t('yourTurn'), null, true); reading.firstElementChild.remove(); reading.classList.add('reading');
  const backButton=button(t('backToTab',{tab:t(cameFrom==='home'?'home':'graph')}),leaveDecision,'link'); reading.append(backButton);
  const introduction = el('div'); reading.append(introduction);
  const report = el('div', undefined, 'worker-report'), note = el('div', undefined, 'speech');
  report.append(el('p',t('workerNote'),'eyebrow'),note);
  const isQuestion = ['direction','information'].includes(d.kind), permission = d.record_purpose==='node'&&d.kind==='authorization';
  const answerLabel = el('label', t(isQuestion ? 'answerLabel' : permission ? 'optionalNote' : 'backReason')); answerLabel.htmlFor = 'answer-text';
  const input = el('textarea'); input.id = 'answer-text'; input.required = true; input.value = session.draft;
  const answerForm=el('div',undefined,'answer-form');answerForm.hidden=true;answerForm.append(answerLabel,input);
  input.addEventListener('input', () => { if (current()) { decisionController.setDraft(input.value); updateActions(); } });
  const message = el('p'); message.id = 'answer-message'; message.setAttribute('role','status'); reading.append(message);
  const blindBox=el('label',undefined,'blind-confirm');
  const blindCheck=el('input');blindCheck.type='checkbox';blindCheck.id='blind-confirm';
  blindBox.append(blindCheck,el('span',t(permission?'permissionConfirmBlind':'confirmBlind')));reading.append(blindBox);
  blindCheck.addEventListener('change',()=>{decisionController.confirmBlind(blindCheck.checked);updateActions();});
  const actions = el('section'); actions.id = 'answer-actions'; actions.dataset.questionBlock='choices'; actions.append(el('h3',t('qChoices')));
  const updateActions = () => {
    actions.querySelectorAll('button[data-outcome]').forEach(b => { b.disabled = !current() || session.busy || (b.dataset.outcome==='approved' && !decisionController.canSubmit(b.dataset.outcome, input.value)); });
    for(const b of actions.querySelectorAll('button[data-outcome]')) {
      const kind=b.dataset.outcome,hint=actions.querySelector(`[data-hint=${kind}]`);
      hint.textContent=!b.disabled?'':session.busy?t('sending'):kind==='approved'?(session.nothingToJudge&&!session.blindConfirmed?t(permission?'permissionBlindHint':'blindHint'):t(session.failed.length||session.purpose==='hold'||!session.decision.files?.length?'readEvidenceHint':'readGateHint')):t(isQuestion?'writeFirst':'revisionHint');
      hint.hidden=!hint.textContent;
    }
    const read=canApprove(session),empty=session.nothingToJudge;

    const fileButtons=[...fileChoices.querySelectorAll('button')];
    const fileCanUnlock=!session.failed.length&&session.purpose!=='hold';
    fileButtons.forEach(b=>{b.classList.remove('primary');b.classList.toggle('file-opened',b.dataset.opened==='true');});
    details.querySelector('summary').classList.remove('primary');
    backButton.disabled = !!decisionController.session?.busy;
    blindCheck.disabled = !!session.busy;
    if (current() && !session.busy) message.textContent = '';
    // Say why sending is unavailable instead of leaving a silent disabled button.
    // The action's own hint is the single explanation for a disabled button.
    input.disabled = !current() || session.busy; $('picker').disabled = !!decisionController.session?.busy;
  };
  const send = async outcome => {
    if (!current()) return;
    const request = decisionController.buildRequest(outcome, input.value);
    if (!request) { if (!input.value.trim() && outcome !== 'approved') { message.textContent = t('required'); input.focus(); } return; }
    updateActions(); message.textContent = t('sending');
    let error = null;
    try { await api('/api/answer', request); } catch (failure) { error = failure; }
    const result = decisionController.onResult(request, error);
    if (result.close && mode === 'decision') leaveDecision();
    decisionNotice = result.notice; notice(decisionNotice);
    if (current()) { message.textContent = t(result.notice); updateActions(); }
    $('picker').disabled = !!decisionController.session?.busy;
    if (result.refresh) refresh(true);
  };
  let approveButton, revisionButton;
  const actionButton = (outcome, text, cls = '') => {
    const b = button(text, () => { if(outcome==='approved'||outcome==='rejected'){send(outcome);return;}answerForm.hidden=false;session.chosenOutcome=outcome;input.focus(); }, cls); b.dataset.outcome = outcome;
    const row=el('div',undefined,'answer-action'),copy=el('div'),effect=el('p',undefined,'action-effect'),hint=el('p',undefined,'action-hint');
    effect.dataset.effect=outcome;hint.dataset.hint=outcome;hint.id='hint-'+outcome;b.setAttribute('aria-describedby',hint.id);
    effect.id='effect-'+outcome;b.setAttribute('aria-describedby',effect.id+' '+hint.id);copy.append(effect,hint);row.append(b,copy);actions.append(row);return b;
  };
  if (isQuestion) {
    for(const option of d.facts?.options||[]){if(!option.label||!option.answer)continue;const row=el('div',undefined,'answer-action');row.append(button(option.label,()=>{decisionController.setDraft(option.answer);input.value=option.answer;send('answered');}),el('p','「'+option.answer+'」 · '+t('qAnswerEffect'),'action-effect'));actions.append(row);}
    if(!d.facts?.options?.length)actionButton('answered',t('qWrite'));
    const later=el('div',undefined,'answer-action');later.append(button(t('qLater'),leaveDecision),el('p',t('qLaterEffect'),'action-effect'));actions.append(later);
  } else { revisionButton=actionButton(permission?'rejected':'revision_requested',t(permission?'refuse':'sendBack'));approveButton=actionButton('approved',''); }
  answerForm.append(button(t('answer'),()=>send(session.chosenOutcome||'answered')));
  reading.append(actions,answerForm);

  const right = el('div'), surrounding = el('section'), history = el('section', undefined, 'decision-history');history.dataset.questionBlock='history';surrounding.dataset.questionBlock='verified';reading.append(history,surrounding,report);
  const files = card(t('readThis'), null, true), fileChoices = el('div', undefined, 'file-choices'), reader = el('pre', undefined, 'file-reader');
  reader.hidden = true; reader.tabIndex = 0; reader.setAttribute('aria-label',t('readThis'));
  const fileStatus = el('p'); fileStatus.setAttribute('role','status');
  files.append(fileChoices, fileStatus, reader); right.prepend(files);
  let fileFingerprint = '', fileRequest = 0;
  const updateFiles = decision => {
    const signature = JSON.stringify(decision.files || []); if (signature === fileFingerprint) return;
    fileFingerprint = signature; fileRequest++; clear(fileChoices); reader.hidden = true;
    fileStatus.textContent = decision.files?.length ? '' : t('noFiles');
    for (const file of decision.files || []) {
      const entry = el('div'); entry.append(button(t('fileUnread',{file:file.name}), async event => {
        if (!current()) return;
        const fileButton=event.currentTarget; const request = ++fileRequest; fileStatus.textContent = t('loading'); reader.hidden = true;
        try {
          const text = await api(query('/api/file', {decision:session.target.id,path:file.path}, session.target), null, true);
          if (!current() || request !== fileRequest) return;
          reader.classList.toggle('code-file', /\.(?:py|js|ts|jsx|tsx|json|css|html|sh|swift|rs|go|c|h|cpp|yaml|yml|toml|xml)$/i.test(file.path));
          reader.textContent = text; reader.hidden = false; fileStatus.textContent = ''; reader.setAttribute('aria-label',file.name);
          fileButton.dataset.opened='true';fileButton.textContent=t('fileRead',{file:file.name});decisionController.openFile(); updateActions();
        } catch(error) { if (current() && request === fileRequest) {if(error.code==='evidence_changed'){showChangedDecision();}else{fileStatus.textContent=t('fileFailed');session.fileOpened=false;updateActions();}} }
      })); if(file.path!==file.name){const path=el('details');path.append(el('summary',t('filePath')),el('small',file.path,'file-path'));entry.append(path);} fileChoices.append(entry);
    }
  };
  const details = el('details', undefined, 'evidence'); details.append(el('summary', t('details'))); const raw = el('pre');
  details.open = session.detailsOpened;
  const markDetailsOpened = () => { if (current() && details.open) { decisionController.openDetails(); updateActions(); } };
  details.addEventListener('toggle', markDetailsOpened);
  const evidenceButton=button(t('qInspect'),()=>{details.open=true;markDetailsOpened();details.scrollIntoView({block:'nearest'});},'evidence-action');const inspectRow=el('div',undefined,'answer-action inspect-option');inspectRow.append(evidenceButton,el('p',t('qInspectEffect'),'action-effect'));actions.append(inspectRow);
  const reminder = el('p', t('evidenceReminder')); reminder.hidden=true;
  right.prepend(reminder);
  const gateFacts = el('div'); details.append(gateFacts);
  const loadEvidence = button(t('loadEvidence'), async () => {
    if (!current()) return;
    raw.textContent = t('loading');
    try {
      const payload = await api(query('/api/run', {}, session.target));
      if (!current()) return;
      const decision = payload.state.decisions[session.target.id];
      // Raw records stay inside this deliberately opened disclosure.
      const evidence = decision ? decision.evidence : null; const paths = new Set();
      const collect = value => { if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') { if (typeof value.log === 'string') paths.add(value.log); Object.values(value).forEach(collect); } };
      collect(evidence);
      const logs = await Promise.all([...paths].map(path => api(query('/api/evidence', {path}, session.target), null, true)));
      if (!current()) return;
      raw.textContent = (evidence ? JSON.stringify(evidence, null, 2) : t('noEvidence')) + (logs.length ? '\n\n' + logs.join('\n\n') : '\n' + t('noEvidence'));
    } catch { if (current()) raw.textContent = t('evidenceFailed'); }
  }); details.append(loadEvidence, raw); right.append(details);right.dataset.questionBlock='evidence';reading.append(right);box.append(reading);
  const update = () => {
    const decision = session.decision;
    inspectRow.hidden=!decisionHasEvidence(view,decision);
    clear(introduction);
    if(session.changed){introduction.append(el('p',t(decision.free?'freeChanged':'decisionChanged'),'change-notice'),button(t('acknowledgeChange'),()=>{decisionController.acknowledge();update();}));}
    const q=el('section');q.dataset.questionBlock='question';const heading=el('h2',question(decision)||purposeWording(decision.purpose,language),'decision-question');heading.id='decision-title';q.append(heading);introduction.append(q);
    const why=card(t('qWhy'),decisionCopy(decision,language).why);why.dataset.questionBlock='why';introduction.append(why);
    const node = view.nodes.find(n => n.id === decision.node);
    if(decision.replaces_refused)introduction.append(el('p',t(decision.replaces_outcome==='rejected'?'replacesRefused':'replacesReturned',{id:decision.replaces_refused}),'change-notice'));
    updateFiles(decision);
    if(decision.commit){const commit=el('details');commit.append(el('summary',t('commitDetails')),el('p',t('approvedCommit')+' · '+decision.commit,'muted'));right.append(commit);}
    if(decision.files?.length&&Object.keys(decision.artifact_hashes||{}).length){const hashes=el('details');hashes.append(el('summary',t('evidenceHashes')),el('pre',Object.entries(decision.artifact_hashes).map(([path,hash])=>path+' · '+(hash||'—')).join('\n')));right.append(hashes);}
    clear(history);
    const rows = node && !decision.free ? view.timeline.filter(r => r.node === node.id && r.kind === 'attempt') : [];
    const missing=el('div',undefined,'missing-records');
    const nothingToInspect=session.nothingToJudge;
    reading.classList.toggle('no-evidence',nothingToInspect);
    blindBox.hidden=!nothingToInspect;blindCheck.checked=!!session.blindConfirmed;
    if(nothingToInspect) {
      missing.append(el('h3',t('nothingToJudge')),el('p',t(permission?'permissionNoEvidence':'nothingToJudgeBody')));
    } else if(!decision.free) {
      if (!decision.files?.length) missing.append(el('p',t(decisionHasEvidence(view,decision)?'evidenceTextOnly':'noFiles')));
      if (!rows.some(r=>r.attempt===node?.attempts && r.checks?.length)) missing.append(el('p',t('noCurrentChecks')));
    }
    right.querySelector('.missing-records')?.remove();if(missing.children.length)right.append(missing);
    history.hidden=false;history.append(el('h3',t('qHistory')));
    if(decision.facts?.reasked)history.append(el('p',t('qReaskedHistory')));
    const attempts=decision.free?[]:decision.facts?.history||[];
    if(!decision.facts&&rows.length){for(const row of rows)history.append(logRow(row,false,true));}
    else if(!attempts.length)history.append(el('p',t('qNoHistory')));
    for(const row of attempts){
      const item=el('div',undefined,'attempt-fact');item.append(el('p',t('qAttempt',{n:row.attempt,state:t(({reject:'attemptReturned',replan:'exhausted',pass:'attemptPassed',needs_approval:'awaiting',hold:'held',submitted:'submitted',running:'running'})[row.state]||'notRecorded')})));
      if(row.rejection_checks?.length){for(const check of row.rejection_checks)item.append(el('p',t(check.origin==='run'?'qRunFailed':'qNodeFailed',{title:check.title})));}
      else for(const reason of row.reasons||[])item.append(el('p',t('checkFailed')+' · '+reason));
      for(const review of row.reviews||[]){item.append(el('p',t('qReviewResult',{title:review.title,result:t(review.verdict==='pass'?'checkPassed':'checkFailed')})));for(const f of review.findings||[])item.append(el('p',[f.severity?t(({high:'qSeverity_high',medium:'qSeverity_medium',low:'qSeverity_low'})[f.severity]||'notRecorded'):null,f.file&&(f.file+':'+(f.line||'')),f.text,f.evidence].filter(Boolean).join(' · ')));}
      history.append(item);
    }
    if(decision.purpose==='human_check'){history.append(el('p',t('qHumanAuto',{items:(decision.verified||[]).map(value=>['scope','cites'].includes(value)?checkTitle({type:value,result:'passed'},language):value).join('; ')||t('qNoChecks')})),el('p',t('qHumanLeft',{question:question(decision)})));}
    clear(gateFacts); gateFacts.append(el('p', t(decision.free?'freeAnswerEffect':'gateReview')), el('p', question(decision) || purposeWording(decision.purpose, language)));
    failedBlock(gateFacts, decision);authorNote(gateFacts,decision.author_context);
    if(node&&!decision.free){plannedChecks(gateFacts,node.planned_checks);contractDetails(gateFacts,node.contract);}
    for(const [key,name] of [['if_approved','ifApproved'],['if_rejected','ifRejected'],['undo','undo']])if((key!=='if_rejected'||!isQuestion)&&decision.context[key])gateFacts.append(el('p',t(name)+': '+decision.context[key]));
    if (decision.context.why) gateFacts.append(el('p', decision.context.why));
    details.hidden = !decisionHasEvidence(view,decision);details.classList.toggle('evidence',!decision.free);
    loadEvidence.hidden = !decision.has_evidence;
    note.textContent = decision.worker_note || ''; report.hidden = !decision.worker_note;
    clear(surrounding);surrounding.append(el('h3',t('qVerified')));
    if(decision.free)surrounding.append(el('p',t('freeQuestion')),el('p',t('freeEffect')));
    if(view.legacy&&!decision.free)history.append(el('p',t('oldReasked')));
    if(decision.review_lenses?.length)history.append(el('p',t('reviewLenses')+' · '+decision.review_lenses.join(' · '),'review-lenses'));
    failedBlock(surrounding,decision);
    textList(surrounding,(decision.verified||[]).map(value=>'✓ '+(['scope','cites'].includes(value)?checkTitle({type:value,result:'passed'},language):value)),'qNoChecks');
    for(const r of decision.facts?.reviews||[]){surrounding.append(el('p',t('qReviewResult',{title:r.title,result:t(r.verdict==='pass'?'checkPassed':'checkFailed')})));if(!r.accepted)surrounding.append(el('p',t('qAwaitReview')));}
    if(decision.unverified?.length)surrounding.append(el('p',t('qUnknown',{items:decision.unverified.map(value=>['scope','cites'].includes(value)?checkTitle({type:value},language):value).join('; ')})));
    files.hidden=!decision.files?.length;
    if(approveButton)approveButton.textContent=nothingToInspect?t(permission?'permissionAcceptBlind':'acceptBlind'):purposeAction(decision.purpose,language,decision.failed);
    const copy=decisionCopy(decision,language);
    for(const effect of actions.querySelectorAll('[data-effect]'))effect.textContent=effect.dataset.effect==='approved'?copy.yes:effect.dataset.effect==='answered'?t('qAnswerEffect'):copy.no;
    updateActions();
  };
  decisionUI = {session, update}; update(); if (focus) focusHeading(introduction.querySelector('h2'));
}
function leaveDecision() { if (cameFrom === 'home') goHome(); else showGraph(); }
let pendingJump = null;
function readFragment() {
  const target = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
  if (!target.decision && !target.node && !target.run) return;
  history.replaceState(null, '', location.pathname + location.search);
  pendingJump = target;
  if (target.project && target.run && !decisionController.session?.busy) setChosen({project:target.project, run:target.run});
  refresh(true);
}
function jump(target) {
  if (target.run && !(chosen && chosen.run === target.run && (!target.project || chosen.project === target.project))) { decisionNotice = t('jumpNoRun'); notice(decisionNotice); return false; }
  const miss = text => { decisionNotice = t('findNone', {text}); notice(decisionNotice); return false; };
  if (target.decision) {
    const id = target.decision.toLowerCase();
    const old=view.superseded?.find(d=>d.id===id);
    if(old?.replacement) { replacementDecision=old.replacement; decisionNotice=t('supersededNotice',{old:id,new:old.replacement}); showMode('home'); home(); notice(decisionNotice); return true; }
    const stale=view.stale_decisions?.find(d=>d.id===id);
    if(stale){decisionNotice=t(stale.reason==='legacy_decision'?'legacyDecision':stale.purpose==='free'?'freeEvidenceChanged':'evidenceChanged');showMode('home');home();notice(decisionNotice);return true;}
    if (view.decisions.some(d => d.id === id)) { openDecision(id); return true; }
    const row = [...view.timeline].reverse().find(r => r.decision === id); if (!row) return miss(target.decision);
    decisionNotice = ''; notice(''); if (!showMode('home')) return false;
    logNode = null; logFilter = 'all'; found = mark = row.id; home(); return true;
  }
  if (target.node) {
    const text = target.node.toLowerCase();
    const nodes=planFlow(view,language).nodes;
    const node = nodes.find(n => n.id.toLowerCase() === text) || nodes.find(n => (n.title || '').toLowerCase().includes(text));
    if (!node) return miss(target.node);
    decisionNotice = ''; notice(''); selected = null; selectNode(node.id); return true;
  }
  return true;
}
function find(text) {
  text = text.trim(); if (!text || !view) return false;
  return /^d\d+$/i.test(text) ? jump({decision:text}) : jump({node:text});
}
const unavailableDecisions=[];
function updateSubtitle(){
  const pending=actionableDecisions(view,unavailableDecisions);
  const states=Object.entries(stateCounts(planFlow(view,language).nodes,pending)).filter(([key])=>key!=='awaiting').map(([key,n])=>stateWords(key,language).name+' '+n).join(' · ');
  $('subtitle').textContent=view.plan_error?'':view.complete?t('complete'):[isPast()?null:t('yourTurnCount',{n:pending.length}),states].filter(Boolean).join(' · ');
}
function applyView(next) {
  if (decisionController.session?.busy) return;
  if(next.plan_approval?.status==='open'){
    const identity=JSON.stringify(next.plan_approval.identity);
    if(planSeen && planSeen.identity!==identity){
      const before=new Map(planSeen.nodes.map(n=>[n.id,n])),after=new Map(next.nodes.map(n=>[n.id,n]));
      planChanges=[];planRead.clear();planChangeIds={old:planSeen.id,new:next.plan_approval.id};
      for(const n of next.nodes)if(!before.has(n.id)||JSON.stringify(n.contract)!==JSON.stringify(before.get(n.id).contract))planChanges.push({id:n.id,title:n.title,kind:before.has(n.id)?'changed':'added',fields:contractDiff(before.get(n.id)?.contract||{},n.contract)});
      for(const n of planSeen.nodes)if(!after.has(n.id))planChanges.push({id:n.id,title:n.title,kind:'removed',fields:contractDiff(n.contract,{})});
      const runDiff=contractDiff(planSeen.contract,next.run_contract);
      if(runDiff.length)planChanges.push({id:'_run_checks',title:STRINGS[viewLanguage(next,navigator.language)].runChecksTitle,kind:'changed',fields:runDiff});if(!planChanges.length)planChanges=null;
    }
    if(next.replaced_unverifiable && (!planSeen || planSeen.identity!==identity)){planRead.clear();planChanges=[...next.nodes.map(n=>({id:n.id,title:n.title,kind:'changed',fields:[]})),{id:'_run_checks',title:STRINGS[viewLanguage(next,navigator.language)].runChecksTitle,kind:'changed',fields:[]}];planChangeIds={old:null,new:next.plan_approval.id};}
    planSeen={identity,id:next.plan_approval.id,nodes:next.nodes,contract:next.run_contract};
  }
  closeInvalidDecision(chosen, next.decisions, next);
  const {observed_at_ms: stamp,...recorded}=next;
  const ages=next.decisions.filter(d=>d.node&&d.asked).map(d=>Math.floor((stamp-Date.parse(d.asked))/60000));
  for(const node of next.nodes){
    const attempt=graphAttempt(node);
    if(attempt?.stalled)ages.push(Math.floor((stamp-attempt.last_ms)/60000));
  }
  const nextFingerprint=JSON.stringify(recorded),nextAgeFingerprint=JSON.stringify(ages);
  if(nextFingerprint===fingerprint&&(mode!=='flow'||nextAgeFingerprint===ageFingerprint))return;
  const languageChanged=language!==viewLanguage(next,navigator.language);
  language = viewLanguage(next, navigator.language); translate();
  if(languageChanged && projects.length)chooseRuns({projects});
  fingerprint = nextFingerprint; ageFingerprint=nextAgeFingerprint;
  renderView(next);
}

function renderView(next) {
  const active=document.activeElement,focusId=active?.id,focusLabel=active?.getAttribute?.('aria-label');
  const focusHeader=active?.className==='node-header',phoneFocus=!!active?.closest?.('#phone-flow'),focusNode=active?.closest?.('[data-node]')?.dataset.node;
  const pageScroll=typeof scrollY==='number'?{left:scrollX,top:scrollY}:null;
  view = {...next,nodes:next.nodes.map(n=>({...n,plan_revision_wait:next.plan_approval?.status==='answered'&&
    ['rejected','revision_requested'].includes(next.plan_approval.outcome)}))};
  const flow=planFlow(view,language), keys=new Set(flow.edges.map(edgeKey));
  if(!flow.nodes.some(n=>n.id===selected))selected=null;
  if(!keys.has(selectedEdge))selectedEdge=null;
  edgeChoices=edgeChoices.filter(key=>keys.has(key));
  if(!view.nodes.some(n=>n.id===logNode))logNode=null;
  const firstDecision=view.decisions[0]?.id || view.timeline.find(r=>r.decision)?.decision;
  $('find-text').placeholder=firstDecision?t('findDecisionHint',{id:firstDecision}):t('findHint');
  $('title').textContent = view.title || t('brand'); $('where').textContent = '';
  const sent = view.plan_approval?.verified && ['rejected','revision_requested'].includes(view.plan_approval.outcome);
  $('flow').classList.toggle('sent-plan',!!sent); $('flow').classList.toggle('plan-unavailable',!!view.plan_error);
  updateSubtitle();
  if(view.complete){const resultNode=[...view.nodes].reverse().find(n=>n.kind==='work'&&view.timeline.some(r=>r.node===n.id&&r.files?.length));if(resultNode){const files=[...new Set(view.timeline.filter(r=>r.node===resultNode.id).flatMap(r=>r.files||[]))];$('subtitle').append(button(t('results'),()=>selectNode(resultNode.id),'primary result-action'),el('span',t('runResultSummary',{files:files.join(', ')}),'result-summary'));}}
  accessible(); attention(); panel(); if(!isPast())home(); showMode(mode);
  if (mode === 'decision' && decisionController.session) openDecision(decisionController.session.target.id, false);
  if(active && active.isConnected===false){
    const scope=phoneFocus?$('phone-flow'):document;
    const replacement=focusId?$(focusId):[...scope.querySelectorAll('button,summary')].find(e=>(focusHeader?e.className==='node-header':focusLabel?e.getAttribute('aria-label')===focusLabel:e.textContent===active.textContent)&&(!focusNode||e.closest('[data-node]')?.dataset.node===focusNode));
    replacement?.focus({preventScroll:true});
  }
  if(pageScroll && typeof scrollTo==='function')scrollTo(pageScroll);
}
function setChosen(next) {
  if (decisionController.session?.busy || sameRun(chosen, next)) return;
  closeInvalidDecision(next, []); chosen = next; generation++; resetView(); logNode = null; logFilter = 'all'; found = mark = null; rowOpen.clear(); logShown.clear(); showMode('flow');
}
function chooseRuns(data) {
  projects = data.projects;
  const runs = projects.flatMap(p => (p.runs || []).map((r, i) => ({...r, project:p.root, projectName:p.name, number:i + 1})));
  runs.sort((a,b) => Number(b.status === 'open') - Number(a.status === 'open') || (b.last_event || '').localeCompare(a.last_event || ''));
  if (!chosen || !runs.some(r => r.project === chosen.project && r.id === chosen.run)) { const first = runs.find(r => !r.error) || runs[0]; setChosen(first ? {project:first.project,run:first.id} : null); }
  const picker = $('picker'); picker.disabled = !!decisionController.session?.busy; clear(picker);
  runs.forEach((r, i) => { const option = el('option', r.title || t('runNumber',{n:r.number})); option.value = String(i); option.dataset.run=r.id; option.selected = !!chosen && r.project === chosen.project && r.id === chosen.run; picker.append(option); });
  $('picker-label').hidden = runs.length < 2;
  picker.onchange = () => { if (decisionController.session?.busy) return; const r = runs[Number(picker.value)]; setChosen({project:r.project,run:r.id}); refresh(true); };
  return runs.find(r => chosen && r.project === chosen.project && r.id === chosen.run);
}
async function refresh(force = false) {
  if (document.hidden) return;
  if (decisionController.session?.busy) { schedule(); return; }
  if (loading) { queuedRefresh = queuedRefresh || force; return; }
  loading = true; const currentGeneration = generation;
  try {
    const projectData = await api('/api/projects');
    if (currentGeneration !== generation || document.hidden || decisionController.session?.busy) return;
    const available = chooseRuns(projectData);
    if (currentGeneration !== generation) { queuedRefresh = true; return; }
    if (!projects.length) { resetView(); notice(decisionNotice || 'noProjects'); return; }
    if (!chosen) { resetView(); notice(decisionNotice || (projects.some(p => p.error) ? 'unreadable' : 'noRun')); return; }
    if (available && available.error) { resetView(); notice(decisionNotice || 'unreadable', true); return; }
    const data = await api(query('/api/run',{history:'index'})); if (currentGeneration !== generation || document.hidden || decisionController.session?.busy) return;
    liveView=data.view;
    if(!isPast()){
      notice(decisionNotice || (data.view.plan_error ? '' : !data.plan ? 'noPlan' : ''));
      applyView(liveView);
    }
    if(data.history)await receiveTimeIndex(data.history,currentGeneration);
    if (pendingJump && view && !decisionController.session?.busy) { const target = pendingJump; pendingJump = null; jump(target); }
  } catch (error) { if (currentGeneration === generation) notice(error.status === 401 ? 'unauthorized' : error.status === 400 || error.status === 404 || error.status === 500 ? 'unreadable' : 'lost', true); }
  finally { loading = false; if (queuedRefresh) { queuedRefresh = false; refresh(true); } else schedule(); }
}
async function receiveTimeIndex(index, snapshotGeneration) {
  const root=$('time-bar');
  if(!root)return;
  if(!timeBar){
    timeBarModule ||= import('./history.js');
    const [{createTimeBar},{createSpaceView}]=await Promise.all([timeBarModule,import('./spacetime.js')]);
    if(snapshotGeneration!==generation)return;
    timeBar ||= createTimeBar({root,t,duration:historyDuration,stamp:historyStamp,
      load:()=>api(query('/api/history')),
      display:(next, reset)=>{
        if(reset)renderer?.resetMotion();
        renderView(next);
        if(reset)renderer?.baselineMotion();
      },
      live:()=>{
        if(!liveView)return;
        renderer?.resetMotion();fingerprint='';applyView(liveView);renderer?.baselineMotion();
      },
      cut:next=>{timeCut=next;renderer?.timeCut?.();},
      clock:()=>graphTestClock?.time??performance.now(),
      deterministic:()=>graphTestClock?.time!=null});
    timeBar.setMotion(next=>renderer?.observeReplay(next));
    renderer?.enableSpace(createSpaceView);
  }
  timeBar.update(index);
}

let historyClock, historyClockLanguage;
function historyStamp(at) {
  if(historyClockLanguage!==language){
    historyClockLanguage=language;
    historyClock=new Intl.DateTimeFormat(language,{
      month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,
    });
  }
  return historyClock.format(at);
}

function historyDuration(ms, exact = false) {
  const units=t('timeUnits').split(',');
  const steps=[86_400_000,3_600_000,60_000,1_000,1];
  let remaining=Math.max(0,Math.round(ms));
  const words=(remaining>=1000&&!exact?steps.slice(0,-1):steps).flatMap((step,i)=>{
    const count=Math.floor(remaining/step);remaining%=step;
    return count?[count+units[i]]:[];
  });
  return words.join(' ')||t('timeZero');
}
function resetView() { timeBar?.reset();timeCut=liveView=null;renderer?.resetSpace();workSummary?.dispose();workSummary=null;planSeen=null;planChanges=null;planRead.clear(); $('panel').onscroll=null; $('panel').hidden=true; $('flow').classList.remove('has-selection'); panelFingerprint=''; panelNode=null; language = viewLanguage(null, navigator.language); translate(); closeInvalidDecision(chosen, []); view = null; selected = selectedEdge = edgeOrigin = null; edgeChoices=[]; fingerprint = ''; ['node-list','edge-list','decision-list','panel','home','attention'].forEach(id => clear($(id))); if (renderer) renderer.update({nodes:[],edges:[],decisions:[],complete:false}, null); $('flow').hidden = true; $('home').hidden = true; $('accessible').hidden = true; $('decision').hidden = true; $('subtitle').textContent = ''; $('where').textContent = ''; }
function schedule() { clearTimeout(timer); if (!document.hidden) timer = setTimeout(refresh, 2000); }
$('phone-view-toggle').addEventListener('click',()=>{const diagram=$('flow').classList.toggle('phone-diagram');$('phone-view-toggle').dataset.i18n=diagram?'showFlowList':'showDiagram';$('phone-view-toggle').textContent=t(diagram?'showFlowList':'showDiagram');$('phone-view-toggle').setAttribute('aria-pressed',String(diagram));if(renderer&&view)renderer.update(view,selected);});
$('home-tab').addEventListener('click', () => { if (view) goHome(); });
$('flow-tab').addEventListener('click', () => { if (view) showGraph(); });
$('find').addEventListener('submit', event => { event.preventDefault(); if (find($('find-text').value)) $('find-text').value = ''; });
addEventListener('hashchange', readFragment);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !e.isComposing && view) { if (mode === 'decision') leaveDecision(); else if (mode === 'flow' && selected) closeNode(); else if(mode==='flow'&&(selectedEdge||edgeChoices.length))closeEdge(true); } });
document.addEventListener('visibilitychange', () => { clearTimeout(timer); if (renderer) renderer.wake(); if (!document.hidden) refresh(true); });
reduced.addEventListener('change', () => { if (renderer) renderer.wake(); });
notice('loading'); readFragment(); refresh();

function svg(tag, attributes = {}) {
  const element=document.createElementNS(['http:', '', 'www.w3.org/2000/svg'].join('/'),tag);
  Object.entries(attributes).forEach(([key,value])=>element.setAttribute(key,String(value)));return element;
}
function edgeMarker(relation) {
  const {paths,fill}=RELATION_MARKS[relation];
  const d=paths.map(path=>'M'+path.flat().join(' ')).join(' ')+(fill?'Z':'');
  return svg('path',{d,class:fill?'relation-fill':'relation-stroke'});
}
function typeIcon(kind) {
  const bounds={work:'4 3 16 18',review:'2 2 20 20',decision:'1 2 22 20',goal:'4 2 17 20'};
  const icon=svg('svg',{viewBox:bounds[kind]||bounds.work,'aria-hidden':'true',class:'type-icon','data-kind':kind});
  const paths={work:'M5 4H19V20H5Z M8 8H16 M8 12H16 M8 16H12',review:'M10 3A7 7 0 1 0 10 17A7 7 0 1 0 10 3 M15 15L21 21 M7 10L9 12L13 8',decision:'M12 3L22 12L12 21L2 12Z M12 7V13 M12 16V17',goal:'M5 21V3 M5 4H20L16 9L20 14H5'};
  icon.append(svg('path',{d:paths[kind]||paths.work,fill:'none',stroke:'currentColor','stroke-width':1.6,'stroke-linejoin':'round','stroke-linecap':'round'}));
  return icon;
}
function cardTone(n, state = displayState(n,view.decisions)) {if(['returned','failedFinal'].includes(state))return 'returned-card';return needs(n)||['held','awaiting_approval'].includes(n.status)?'waiting_for_you':n.status==='passed'||n.answered?'passed':['running','submitted','unverified'].includes(n.status)?'current':'unused';}
// A stable play mark is legible in a still frame and without colour.
function walker() {
  const mark=el('span','▶','walker');mark.setAttribute('aria-hidden','true');return mark;
}
const ACTIVITY_MARKS = Object.freeze({
  tool:['▤','activityNameTool'], skill:['✦','activityNameSkill'], mcp:['⬡','activityNameMcp'],
  session:['⇄','activityNameSession'], gf:['△','activityNameGf'], other:['✚','activityNameOther'],
  thinking:['◌','activityThinking'], stalled:['⊣','activityNameStalled'], repeating:['≋','activityNameRepeating'],
});
const activityName = key => t(ACTIVITY_MARKS[key][1]);
const graphNow = () => graphTestClock?.wall ?? Date.now();
const graphTestClock = new URL(location.href).searchParams.get('graphTest')==='1' ? {time:null,wall:null} : null;
const shortActivity = category => {
  const key={session:'cardSession',gf:'cardChecks',thinking:'cardThinking'}[category];
  return key?t(key):activityName(category);
};
const minutesWord = n => t(n===1?'cardMinute':'cardMinutes',{n});
const durationWord = ms => ms>=60000 ? minutesWord(Math.round(ms/6000)/10) :
  ms>=1000 ? t('cardSeconds',{n:Math.round(ms/100)/10}) : ms+' ms';
const attemptWord = n => t('cardAttempt',{n});
const laneWord = n => t('cardLane',{n});

function appendStrip(root, strip, facts) {
  if(strip){
    const rail=el('div',undefined,'card-strip');
    rail.setAttribute('aria-hidden','true');
    for(const segment of strip.segments){
      const mark=el('i',undefined,'strip-segment');mark.dataset.phase=segment.id;
      if(segment.pattern)mark.dataset.pattern=segment.pattern;
      mark.style.left=segment.left*100+'%';mark.style.width=segment.width*100+'%';
      rail.append(mark);
    }
    for(const dot of strip.dots){
      const mark=el('i',undefined,'call-dot');mark.dataset.call=dot.id;mark.style.left=dot.left*100+'%';rail.append(mark);
    }
    if(strip.head!=null){
      const head=el('i',ACTIVITY_MARKS[facts.now][0],'strip-head');head.dataset.category=facts.now;
      head.style.left=strip.head*100+'%';rail.append(head);
    }
    root.append(rail);
  }
  if(facts.totals.length){
    const rows=el('div',undefined,'card-totals');
    const maximum=Math.max(1,facts.totals[0].duration);
    for(const {category,duration} of facts.totals){
      const row=el('div',undefined,'card-total');row.dataset.category=category;row.dataset.duration=String(duration);
      const name=el('span',shortActivity(category),'total-name');
      const track=el('span',undefined,'total-track'),bar=el('i',undefined,'total-bar');
      bar.dataset.pattern=category;bar.style.width=duration/maximum*100+'%';track.append(bar);
      row.append(name,track,el('span',durationWord(duration),'total-duration'));rows.append(row);
    }
    root.append(rows);
  }
}
function nodeCard(n, expanded = false, level = 'detail', state, model) {
  const now=(isPast()?view?.observed_at_ms:graphTestClock?.wall) ?? view?.observed_at_ms ?? graphNow(), facts=model?.facts || cardFacts(n,view.decisions,now,language);
  state=facts.state;
  const {kind,lane}=facts;
  const root=el('article',undefined,'node-card '+cardTone(n,state)+(runningCard(state)?' working':'')+(expanded?' expanded':''));
  Object.assign(root.dataset,{node:n.id,state,clip:kind,cut:String(5+3*(lane||1))});
  root.style.setProperty('--cut-size',root.dataset.cut+'px');
  const plate=el('div',undefined,'node-plate');
  if(state==='awaiting')plate.dataset.hazard='answer';
  root.append(plate);
  if(planBlocked())root.classList.add('read-status');
  if(planBlocked())root.append(el('p',t('cardUnread'),'unread-mark'));
  const change=isPast()?null:planChanges?.find(c=>c.id===n.id);if(change)root.append(el('p',t(change.kind),'change-mark'));
  const header=button('',()=>selectNode(n.id),'node-header');
  const titleLine=el('span',undefined,'node-title-line');
  titleLine.append(typeIcon(kind),el('strong',title(n),'node-title'));
  if(lane)titleLine.append(el('span',laneWord(lane),'risk-level'));
  const stateLine=el('span',undefined,'node-status');
  const word=el('span',facts.word,'state-word');
  const glyph=el('span',statusGlyph(state),'status-glyph');glyph.setAttribute('aria-hidden','true');
  const stateValue=el('span',undefined,'state-value');stateValue.append(glyph,word);
  stateLine.append(el('span',facts.kindWord,'kind-word'),stateValue);
  const clauses=[title(n),facts.kindWord,facts.word];
  if(facts.age!=null){
    const age=minutesWord(facts.age);
    const wording=state==='awaiting'?t('cardWaiting',{age}):age;
    const mark=el('span',wording,'card-age');mark.dataset.minutes=String(facts.age);
    if(state==='awaiting')mark.dataset.humanWait='';
    stateLine.append(mark);clauses.push(wording);
  }
  if(facts.attempt){
    const word=attemptWord(facts.attempt);
    const caption=el('span','· '+word,'card-attempt');caption.dataset.ordinal=String(facts.attempt);
    stateLine.append(caption);clauses.push(word);
  }
  if(lane)clauses.push(laneWord(lane));
  header.append(titleLine,stateLine);
  if(facts.now){
    const text=t('cardNow',{category:shortActivity(facts.now)});
    const current=el('span',text,'card-now');current.dataset.category=facts.now;
    header.append(current);clauses.push(text);
  }
  if(facts.unread){
    const text=t(facts.unread==='unreadable'?'cardUnreadable':'cardUnobserved');
    header.append(el('span',text,'card-unobserved'));clauses.push(text);
  }
  if(graphAttempt(n)?.repeating){
    header.append(el('span',t('activityNameRepeating'),'card-repeating'));clauses.push(t('activityNameRepeating'));
  }
  clauses.push(...facts.totals.map(({category,duration})=>shortActivity(category)+' '+durationWord(duration)));
  const marks = [];
  if (cometCount(n) || state === 'returned') marks.push('↩');
  if ((view.planned_questions || []).some(q=>q.node===n.id)) marks.push(t('questionsMark'));
  header.title = clauses.join(' · ')+(marks.length?' · '+marks.join(' · '):'')+(state==='returned'&&returnActor(n)?' · '+returnActor(n):'');
  header.setAttribute('aria-label',clauses.join(' · '));header.setAttribute('aria-expanded',String(expanded));
  root.append(header);
  appendStrip(root,model?.strip ?? activityStrip(graphAttempt(n),facts,now),facts);
  if (level === 'overview') {root.classList.add('overview-card');return root;}
  const reference=el('div',undefined,'ref-line node-reference');
  if(n.planned_checks?.some(c=>c.runs_own_files)){const mark=el('span',t('ownCheckMark'),'own-check-mark');mark.title=t('ownCheckEffect');reference.append(mark);}
  if(n.status==='passed'&&cometCount(n))reference.append(el('span',t('returnTrace',{n:cometCount(n)})));

  const decision=view.decisions.find(d=>d.node===n.id);
  const footer=el('div',undefined,'node-footer');
  if(!decision && state==='returned') {
    const reason=returnedLine(n);
    const line=el('span',reason);line.title=line.textContent;footer.append(line);
    clear(reference);const actor=returnActor(n);if(actor)reference.append(el('span',actor));
  }
  if(n.attempts){
    const caption=el('span',attempts(n)||t('finishedAttempts',{n:n.attempts}),'attempt-caption');
    caption.dataset.attempts=String(n.attempts);reference.append(caption);
  }
  const essentials=el('div',undefined,'node-essentials');
  essentials.append(el('p',nodeSentence(n,view.nodes,language),'node-sentence'));
  if(change?.fields?.length){const diff=el('p',diffText(change.fields[0]),'change-preview');diff.title=change.fields.map(diffText).join('\n');essentials.append(diff);}
  const files=[...new Set(n.deliverables || [])].filter(value=>![STRINGS.ko.genericOutput,STRINGS.en.genericOutput].includes(value)||!(n.deliverables||[]).some(v=>![STRINGS.ko.genericOutput,STRINGS.en.genericOutput].includes(v)));
  const answered=(view.answered||[]).filter(d=>d.node===n.id&&d.verified&&!d.stale).at(-1);
  if(n.preapproval_submission)essentials.append(el('p',t('preapprovalExplanation'),'preapproval-note'));


  if(state==='notStarted'&&n.inputs?.length&&n.inputs.every(i=>i.delivered))essentials.append(el('p',t('inputsReady')));
  if(n.runLevel) essentials.append(el('p',view.goal,'run-goal-preview'));
  if(files.length&&!n.preapproval_submission&&!answered)essentials.append(el('p',t('planCardDelivery',{files:files.map(outputLabel).join(', ')})));
  if(n.planned_checks?.length && state!=='returned'&&!n.preapproval_submission) {
    const automated=n.planned_checks.filter(c=>c.type!=='human'),human=n.planned_checks.length-automated.length;
    for(const check of automated.slice(0,3)) {
      const result=n.check_results?.[check.id]||check.result;
      const preview=el('p',undefined,'card-check'),mark=result==='passed'?'✓ '+t('checkPassed'):result==='failed'?'✕ '+t('checkFailed'):'○ '+t('notStarted');
      preview.append(el('span',mark+' · '),el(commandTitle(check)?'code':'span',checkTitle(check,language)));essentials.append(preview);
    }
    if(human)essentials.append(el('p',t('humanCheckCount',{n:human})));
    if(automated.length>3)essentials.append(el('p',t('checksMore',{n:automated.length-3})));
  }
  const questions=(view.planned_questions || []).filter(q=>q.node===n.id);
  if(questions.length)essentials.append(el('p',t('planCardQuestion',{n:questions.length,question:questions.map(q=>answered?q.question:plannedQuestion(q)).join(' · ')}),'planned-question'));
  if(answered){const answer=el('details',undefined,'answered-result');answer.append(el('summary',t('answerExpand')),el('p',t('answerOutcome',{outcome:t(answered.outcome==='approved'?(answered.kind==='authorization'?'answeredPermission':'answeredApproval'):answered.outcome==='rejected'?'answeredRejection':answered.outcome==='revision_requested'?'answeredRevision':'evAnswered'),answer:answered.answer||''})));essentials.append(answer);}
  if(n.notices?.some(item=>item.code==='passes_before_work'))essentials.append(el('p',t('qBeforeWorkCount',{n:n.notices.filter(item=>item.code==='passes_before_work').length}),'check-notice'));
  root.append(essentials,footer,reference);
  const answer=essentials.querySelector('.answered-result');if(answer)answer.addEventListener('toggle',()=>{if(root.isConnected&&!root.classList.contains('card-measure'))renderer?.remeasure();});
  return root;
}
function mapViewportRect(){const e=document.querySelector('.map-viewport');return e?contentRect(e):null;}
function contentRect(element){const r=element.getBoundingClientRect();if(!Number.isFinite(element.clientWidth))return r;const left=r.left+(element.clientLeft||0),top=r.top+(element.clientTop||0);return {left,top,right:left+element.clientWidth,bottom:top+element.clientHeight};}
function titleTextRect(title){
  if(!title)return null;
  if(!document.createRange)return title.getBoundingClientRect();
  const range=document.createRange();range.selectNodeContents(title);return range.getBoundingClientRect();
}
// The scroll edge may hide whole lines, but never bisect their letters.
function wholeMapLines(card,viewport,scale) {
  wholeTextLines(card.querySelectorAll('.node-title,.node-status,.card-now,.card-unobserved,.card-repeating,.card-total,.node-essentials p,.node-footer>span,.node-reference>span,.unread-mark,.change-mark,summary'),viewport,scale);
}
function wholeTextLines(texts,viewport,scale) {
  if(!document.createRange)return;
  for(const text of texts){
    text.style.clipPath='';
    const range=document.createRange();range.selectNodeContents(text);
    const lines=[...range.getClientRects()].filter(r=>r.width&&r.height),box=text.getBoundingClientRect();
    if(!lines.length||lines.every(r=>r.top>=viewport.top-.5&&r.bottom<=viewport.bottom+.5))continue;
    const whole=lines.filter(r=>r.top>=viewport.top-.5&&r.bottom<=viewport.bottom+.5);
    text.style.clipPath=whole.length?`inset(${Math.max(0,(Math.min(...whole.map(r=>r.top))-box.top)/scale)}px 0 ${Math.max(0,(box.bottom-Math.max(...whole.map(r=>r.bottom)))/scale)}px 0)`:'inset(100%)';
  }
}

const MINIMAP_WIDTH=142, MINIMAP_HEIGHT=88, MINIMAP_PAD=7;
const MINI_KINDS={
  work:{color:'#3fd8e8',points:[[-1,-1],[1,-1],[1,1],[-1,1]]},
  review:{color:'#3fd8e8',points:Array.from({length:12},(_,i)=>[Math.cos(i*Math.PI/6),Math.sin(i*Math.PI/6)])},
  decision:{color:'#3fd8e8',points:[[-1,0],[-.5,-1],[.5,-1],[1,0],[.5,1],[-.5,1]]},
  goal:{color:'#3fd8e8',points:[[-1,1],[0,-1],[1,1]]},
};
function createMinimap(area,viewport) {
  const mini=button('',()=>{},'map-mini');
  mini.dataset.i18nLabel='minimap';mini.hidden=true;
  const plot=svg('svg',{viewBox:`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`,'aria-hidden':'true'});
  const marks=svg('g'), indicator=svg('rect',{class:'mini-window'});
  const canvas=el('canvas');canvas.hidden=true;canvas.setAttribute('aria-hidden','true');
  plot.append(marks,indicator);mini.append(plot,canvas);area.append(mini);
  let scene, projection, miniFrame, drag;
  function reserve(layout,scale,height) {
    const width=viewport.clientWidth;
    mini.hidden=!width||!layout.cards.length||(layout.bounds.width*scale<=width&&layout.bounds.height*scale<=height);
    return mini.hidden?0:mini.offsetHeight+12;
  }
  function update(layout,box) {
    const {bounds,cards}=layout;
    if(mini.hidden){miniFrame=null;return;}
    if(scene!==layout){
      scene=layout;
      const ratio=Math.min((MINIMAP_WIDTH-2*MINIMAP_PAD)/bounds.width,(MINIMAP_HEIGHT-2*MINIMAP_PAD)/bounds.height);
      const left=(MINIMAP_WIDTH-bounds.width*ratio)/2, top=(MINIMAP_HEIGHT-bounds.height*ratio)/2;
      const points=cards.map(card=>{
        const {color,points}=MINI_KINDS[card.kind];
        const x=left+(card.x+card.width/2)*ratio,y=top+(card.y+card.height/2)*ratio;
        return {id:card.id,kind:card.kind,color,points:points.map(([dx,dy])=>[x+dx*3.2,y+dy*3.2])};
      });
      projection={ratio,left,top,points};
      marks.replaceChildren(...points.map(mark=>svg('polygon',{'data-node':mark.id,'data-kind':mark.kind,
        fill:mark.color,points:mark.points.map(point=>point.join(',')).join(' ')})));
    }
    const {ratio,left,top}=projection;
    const x=Math.max(0,-box.x/box.scale), y=Math.max(0,-box.y/box.scale);
    const right=Math.min(bounds.width,(box.width-box.x)/box.scale), bottom=Math.min(bounds.height,(box.height-box.y)/box.scale);
    const window={x:left+x*ratio,y:top+y*ratio,width:Math.max(0,right-x)*ratio,height:Math.max(0,bottom-y)*ratio};
    for(const [key,value] of Object.entries(window))indicator.setAttribute(key,value);
    miniFrame={width:MINIMAP_WIDTH,height:MINIMAP_HEIGHT,marks:projection.points,window,dpr:box.dpr};
  }
  function navigate(event) {
    const rect=plot.getBoundingClientRect(), {ratio,left,top}=projection;
    const scale=Number(area.closest('#map').dataset.scale);
    const x=((event.clientX-rect.left)*MINIMAP_WIDTH/rect.width-left)/ratio;
    const y=((event.clientY-rect.top)*MINIMAP_HEIGHT/rect.height-top)/ratio;
    const stage=viewport.querySelector('.map-stage');
    viewport.scrollTo(x*scale+stage.offsetLeft-viewport.clientWidth/2,y*scale+stage.offsetTop-viewport.clientHeight/2);
  }
  mini.addEventListener('pointerdown',e=>{
    if(e.button!==0||!projection)return;
    drag=e.pointerId;mini.setPointerCapture(drag);navigate(e);
  });
  mini.addEventListener('pointermove',e=>{if(e.pointerId===drag)navigate(e);});
  mini.addEventListener('lostpointercapture',()=>{drag=null;});
  mini.addEventListener('keydown',e=>{
    const offsets={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(!Object.hasOwn(offsets,e.key))return;
    e.preventDefault();
    const [x,y]=offsets[e.key];
    viewport.scrollBy(x*viewport.clientWidth/3,y*viewport.clientHeight/3);
  });
  mini.addEventListener('click',e=>{
    if(e.detail!==0||!projection)return;
    const r=plot.getBoundingClientRect();
    navigate({clientX:r.left+r.width/2,clientY:r.top+r.height/2});
  });
  return {reserve,update,canvas,frame:()=>miniFrame,setGPU:active=>{
    canvas.hidden=!active;
    mini.dataset.renderer=active?'webgl':'svg';
  }};
}

function createMap() {
  const map=$('map');map.tabIndex=0;
  const toolbar=el('div',undefined,'map-toolbar'),viewport=el('div',undefined,'map-viewport'),spacer=el('div',undefined,'map-spacer'),stage=el('div',undefined,'map-stage');
  viewport.tabIndex=0;viewport.setAttribute('aria-label',t('mapHelp'));spacer.append(stage);viewport.append(spacer);map.append(toolbar);
  const overflow=el('div',undefined,'map-overflow');
  overflow.setAttribute('aria-label',t('graphEdges'));overflow.dataset.i18nLabel='graphEdges';
  const area=el('div',undefined,'map-area');
  area.append(viewport);map.append(area);
  const visibleCount=el('span',undefined,'map-visible'),overflowButtons=new Map();overflow.append(visibleCount);
  let data={nodes:[],edges:[],decisions:[]},chosenNode=null,layout=null,scale=1,automatic=true,level='detail',layouts=null,rawData=null;
  Object.defineProperty(map, 'graphScene', {get:() => layout && structuredClone(layout)});
  const nodes=new Map(),chips=new Map();let drawing=null,fxLayer=null,tagLeads=null,placed=false,initialFitPending=false,layoutKey='',origin={x:0,y:0};
  const surface=el('div',undefined,'graph-webgl'),canvas=el('canvas');surface.hidden=true;
  surface.setAttribute('aria-hidden','true');surface.append(canvas);area.prepend(surface);
  const mini=createMinimap(area,viewport);
  map.dataset.renderer='svg';
  const capture=startup.searchParams.get('graphTest')==='1';
  let gpu=null, gpuRequested=startup.searchParams.get('renderer')==='svg'||typeof WebGL2RenderingContext==='undefined';
  let lastDraw, drawPending=false, svgStrokes=[], svgMarkers=[], keyboardNode=null, focusId=null, focus;
  let space, spaceFrame, spacePlane, spaceTags=[], sideScroll=0;
  const sideRail=el('div',undefined,'space-scroll'), sideTrack=el('div');
  sideRail.hidden=true;sideRail.tabIndex=0;sideRail.dataset.i18nLabel='spaceSide';
  sideRail.setAttribute('role','region');sideRail.append(sideTrack);area.append(sideRail);
  sideRail.addEventListener('scroll',()=>{
    if(sideRail.hidden||sideRail.scrollLeft===sideScroll)return;
    sideScroll=sideRail.scrollLeft;space?.refresh();
  });
  const phone=matchMedia('(max-width:760px)');
  const forcedColors=matchMedia('(forced-colors: active)');
  const highContrast=matchMedia('(prefers-contrast: more)');
  let motionPaused=false, motionRAF=0, motionFrames=0, pulseStarts=0, lastMotion=[];
  const fx=createGraphMotion(), marks=new Map(), edgeEffects=new Map();
  const motionClock=()=>graphTestClock?.time ?? performance.now();
  const pauseMotion=button('',()=>{
    motionPaused=!motionPaused;
    document.body.classList.toggle('graph-paused',motionPaused);
    $('panel').getAnimations?.().forEach(animation=>animation.cancel());
    workSummary?.globalMotion();
    space?.backendChanged();syncMotion();
  },'graph-motion');
  const attentionCount=el('span',undefined,'map-activity-count');
  const flowCount=el('span',undefined,'map-flow-count');
  const motionAllowed = () => gpu && !forcedColors.matches && !document.hidden && !reduced.matches &&
    !motionPaused && viewport.clientWidth && graphDetail(level,scale)!=='far';
  function applyMotion() {
    if(!layout||!fxLayer)return;
    const now=motionClock(), frame=fx.frame(now,motionAllowed());
    const seen=new Set(), traces=new Map(), busy=new Set();
    const style=(element,property,value)=>{
      if(!element)return;
      if(!seen.has(element)){
        for(const old of marks.get(element)||[])element.style.removeProperty(old);
        seen.add(element);element.dataset.motionPaint='';
      }
      element.style.setProperty(property,value);
    };
    for(const element of marks.keys())if(!element.isConnected)marks.delete(element);
    for(const event of frame){
      const {id,kind,progress}=event, p=motionEase(progress);
      const card=nodes.get(id)?.firstElementChild;
      if(card&&kind!=='halo'&&kind!=='dot'&&kind!=='strip') {
        const glyph=card.querySelector('.status-glyph');
        if(kind==='glyph')style(glyph,'--glyph-scale',String(progress<.6 ? .4+1.5*progress : 1.3-.75*(progress-.6)));
        if(kind==='flicker')style(card,'--flicker',String(Math.sin(Math.PI*progress)*.38));
        if(['pass','return','session'].includes(kind)){
          style(card,'--sweep-opacity',String((1-p)*.95));
          style(card,'--sweep-scale',String(1+p*.18));
          style(card,'--sweep-color',kind==='return'?'var(--coral)':kind==='session'?'var(--violet)':'var(--muted)');
        }
      }
      if(card&&kind==='halo')style(card,'--halo',String(event.strength));
      if(card&&kind==='dot'){
        const dot=[...card.querySelectorAll('.call-dot')].find(dot=>dot.dataset.call===String(event.record));
        style(dot,'--dot-scale',String(progress<.6 ? .1+1.9*progress : 1.24-.6*(progress-.6)));
      }
      if(card&&kind==='strip'){
        const current=layout.positions[id].strip;
        if(current){
          const prior=new Map((event.before?.segments||[]).map(segment=>[segment.id,segment]));
          for(const segment of current.segments){
            const from=prior.get(segment.id);
            const mark=[...card.querySelectorAll('.strip-segment')].find(el=>el.dataset.phase===segment.id);
            const width=(from?.width||0)+(segment.width-(from?.width||0))*p;
            style(mark,'--render-width',width*100+'%');
          }
          if(current.head!=null)style(card.querySelector('.strip-head'),'--render-left',
            ((event.before?.head??current.head)+(current.head-(event.before?.head??current.head))*p)*100+'%');
        }
      }
      if(['handoff','reverse','drift'].includes(kind)){
        const edge=layout.edges.find(edge=>edge.key===id);
        if(!edge||edge.points.length<2)continue;
        if(kind==='drift'){if(!traces.has(id))traces.set(id,{edge,event});continue;}
        const reverse=kind==='reverse',point=pointAlongRoute(edge.points,reverse?1-p:p);
        const path=edgeEffects.get(id)?.path, token=edgeEffects.get(id)?.token;
        if(path&&token){
          path.hidden=reverse;
          path.style.strokeDasharray=p+' 1';
          token.setAttribute('cx',point.x);token.setAttribute('cy',point.y);
          token.dataset.direction=kind;
          token.style.display='';
          if(!reverse)busy.add(edge.id);
        }
        traces.set(id,{edge,event});
      }
    }
    for(const [element,properties] of marks){
      if(seen.has(element))continue;
      for(const property of properties)element.style.removeProperty(property);
      delete element.dataset.motionPaint;
      marks.delete(element);
    }
    for(const element of seen){
      const properties=Array.from(element.style).filter(key=>key.startsWith('--')&&key!=='--cut-size');
      marks.set(element,properties);
    }
    for(const [id,{path,token,arrows}] of edgeEffects){
      const trace=traces.get(id);
      if(trace?.event.kind!=='handoff')path.style.display='none';
      else path.style.display='';
      if(!trace||trace.event.kind==='drift')token.style.display='none';
      if(trace?.event.kind!=='drift'||busy.has(trace.edge.id)){
        arrows.style.display='none';
        continue;
      }
      const {edge,event}=trace;
      const length=edge.points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-edge.points[i].x,p.y-edge.points[i].y),0);
      const count=Math.max(1,Math.min(3,Math.floor(length/55)));
      let d='';
      for(let i=0;i<count;i++){
        const u=(event.distance+i*length/count)%length/length;
        const a=pointAlongRoute(edge.points,Math.max(0,u-.01)),b=pointAlongRoute(edge.points,Math.min(1,u+.01));
        const c=pointAlongRoute(edge.points,u), angle=Math.atan2(b.y-a.y,b.x-a.x);
        const dx=Math.cos(angle)*4,dy=Math.sin(angle)*4;
        d+=`M${c.x-dx-dy} ${c.y-dy+dx}L${c.x} ${c.y}L${c.x-dx+dy} ${c.y-dy-dx}`;
      }
      arrows.setAttribute('d',d);arrows.style.display='';
    }
    const transfer=[...busy].join(',');
    if(map.dataset.transfers!==transfer){map.dataset.transfers=transfer;requestDrawing();}
    if(frame.length)motionFrames++;
    pulseStarts+=frame.filter(event=>['handoff','reverse'].includes(event.kind)&&
      !lastMotion.some(old=>old.kind===event.kind&&old.id===event.id&&old.record===event.record)).length;
    lastMotion=frame;
    space?.effects(frame);
  }
  function syncMotion() {
    pauseMotion.hidden=!gpu || reduced.matches || forcedColors.matches || !layout?.cards.length;
    pauseMotion.textContent=t(motionPaused?'graphResume':'graphPause');
    pauseMotion.setAttribute('aria-pressed',String(motionPaused));
    if(!motionAllowed()){
      fx.settle();
      if(motionRAF)cancelAnimationFrame(motionRAF);motionRAF=0;
    }
    applyMotion();
    if(motionAllowed()&&fx.active()&&!motionRAF&&graphTestClock?.time==null){
      motionRAF=requestAnimationFrame(()=>{motionRAF=0;syncMotion();});
    }
  }
  overflow.append(flowCount,attentionCount,pauseMotion);
  flowCount.hidden=attentionCount.hidden=pauseMotion.hidden=true;
  if(capture)Object.defineProperty(map,'graphTest',{value:{
    step(time,wall=graphTestClock.wall){
      graphTestClock.time=time;graphTestClock.wall=wall;timeBar?.tick(time);space?.tick(time);syncMotion();
      return structuredClone(lastMotion);
    },
    updateTime(time,wall){
      graphTestClock.time=time;graphTestClock.wall=wall;update(rawData,chosenNode);
      return structuredClone(lastMotion);
    },
    frame:()=>structuredClone(lastMotion),
    history:()=>timeBar?.describe(),
    seek:time=>timeBar?.seek(time),
    space:()=>space?.describe(),
  }});
  const flatBox=()=>({width:viewport.clientWidth,height:viewport.clientHeight,scale,
    x:origin.x-viewport.scrollLeft,y:origin.y-viewport.scrollTop,dpr:globalThis.devicePixelRatio||1,
    insetX:viewport.clientLeft,insetY:viewport.clientTop,focusId,
    transfers:map.dataset.transfers || '', highContrast:highContrast.matches, background:'#080b10'});
  const viewBox=()=>({...flatBox(),plane:spacePlane});
  function spaceNotes(rows) {
    const body=$('panel').querySelector('.panel-body');
    if(!body)return;
    let list=body.querySelector('.space-records');
    if(!rows.length){list?.remove();return;}
    const signature=JSON.stringify(rows.map(({ids,text})=>[ids,text]));
    if(list?.dataset.signature===signature)return;
    if(!list){
      list=el('details',undefined,'space-records');
      list.append(el('summary',t('spaceRecords')),el('ol'));
      const pending=body.querySelector(':scope>.paper');
      if(pending)pending.after(list);
      else body.prepend(list);
    }
    const items=rows.map(row=>{
      const item=el('li',row.text);
      item.dataset.records=row.ids.join(' ');
      item.dataset.duration=row.duration??0;
      return item;
    });
    list.lastElementChild.replaceChildren(...items);
    list.dataset.signature=signature;
  }
  function applySpace(next) {
    if(!next&&!spaceFrame)return;
    if(next&&!spaceFrame)sideScroll=0;
    spaceFrame=next;spacePlane=next?.projection.plane;
    if(next)map.dataset.space='';else delete map.dataset.space;
    area.classList.toggle('space-stage',!!next);
    const plane=spacePlane, box=flatBox();
    const matrix=plane?`matrix(${plane.a/scale},${plane.b/scale},${plane.c/scale},${plane.d/scale},${(plane.e-box.x)/scale},${(plane.f-box.y)/scale})`:'';
    for(const layer of [drawing,tagLeads,fxLayer]){
      if(!layer)continue;
      layer.style.transform=matrix;
      layer.style.opacity=plane?(layer===fxLayer?Math.max(0,2*plane.opacity-1):plane.opacity):'';
    }
    const projection=next?.projection, lean=projection?.lean||0, lanes=projection?.lanes||0;
    const lerp=(a,b,p)=>a+(b-a)*p;
    const fold=Math.min(1,lean*1.4);
    const chipsOnCut=projection&&layout.cards.map(card=>({
      id:card.id,point:projection.nodeAt(card.id,next.cut.at),
      width:Math.max(92,Math.min(lanes>.25?projection.laneWidth-14:192,card.width*projection.zoom)),height:36,
    }));
    if(chipsOnCut&&lanes<.85){
      for(const chip of chipsOnCut){
        if(chipsOnCut.some(other=>other!==chip&&Math.abs(chip.point.y-other.point.y)<40&&
          Math.abs(chip.point.x-other.point.x)<(chip.width+other.width)/2+4))chip.height=26;
      }
      for(const chip of chipsOnCut){
        for(const other of chipsOnCut){
          if(other===chip||Math.abs(chip.point.y-other.point.y)>=(chip.height+other.height)/2+3)continue;
          chip.width=Math.min(chip.width,Math.max(28,Math.abs(chip.point.x-other.point.x)-4));
        }
      }
    }
    const chipByNode=new Map(chipsOnCut?.map(chip=>[chip.id,chip]));
    for(const card of layout?.cards||[]){
      const element=nodes.get(card.id);if(!element)continue;
      const extras=element.querySelector('.node-essentials');
      if(extras)extras.inert=fold>.95;
      if(!projection){
        setRect(element,card);delete element.dataset.fold;delete element.dataset.compact;
        for(const key of ['--map-text','--kind-size','--status-size','--fold'])element.style.removeProperty(key);
        continue;
      }
      const {point:p,width:compactWidth,height:compactHeight}=chipByNode.get(card.id);
      const width=lerp(card.width,compactWidth/scale,lean);
      const height=lerp(card.height,compactHeight/scale,fold);
      setRect(element,{x:(p.x-box.x)/scale-width/2,y:(p.y-box.y)/scale-height/2,width,height});
      element.dataset.fold=String(fold>.95);
      element.dataset.compact=String(compactHeight===26&&fold>.95);
      element.style.visibility='visible';
      for(const label of element.querySelectorAll('[style*="clip-path"]'))label.style.clipPath='';
      element.style.setProperty('--map-text',Math.max(13/scale,14)+'px');
      element.style.setProperty('--kind-size',Math.max(14/scale,18)+'px');
      element.style.setProperty('--status-size',Math.max(15/scale,18)+'px');
      element.style.setProperty('--fold',String(fold));
    }
    for(const tag of layout?.tags||[]){
      const element=chips.get(tag.id);if(!element)continue;
      if(projection)element.hidden=true;
      else setRect(element,tag);
    }
    sideRail.hidden=!(lanes>.98&&projection.sideWidth>box.width);
    if(!sideRail.hidden){
      sideRail.style.left=viewport.clientLeft+'px';
      sideRail.style.width=box.width+'px';
      sideTrack.style.width=projection.sideWidth+'px';
      if(sideRail.scrollLeft!==sideScroll)sideRail.scrollLeft=sideScroll;
    }
    if(tagLeads&&projection)tagLeads.style.opacity='0';
    if(!projection){sideScroll=0;outside();}
    requestDrawing();
    return [...nodes.values()].map(wrapper=>wrapper.firstElementChild);
  }

  function updateFocus() {
    if(!layout)return;
    const keys=new Set(selectedEdge?[selectedEdge]:edgeChoices);
    const relations=keys.size?layout.edges.filter(edge=>keys.has(edgeKey(edge))):[];
    focusId=relations.length?('edge:'+relations.map(edge=>edge.id).join(',')):keyboardNode||chosenNode||null;
    focus=relations.length?{cards:new Set(relations.flatMap(edge=>[edge.from,edge.to])),
      edges:new Set(relations.map(edge=>edge.id))}:dependencyFocus(layout,focusId);
    if(!focus.cards.size)focusId=null;
    for(const [id,element] of nodes) {
      element.classList.toggle('graph-path',focus.cards.has(id));
      element.classList.toggle('graph-context',!!focusId&&!focus.cards.has(id));
    }
    const order=graphInkOrder(layout,focusId,focus);
    const layers=[];
    for(const {model,line,underlay} of svgStrokes) {
      const {weight,base,ink}=order.strokes.get(model.id);
      line.dataset.weight=weight;
      layers.push([base,underlay],[ink,line]);
    }
    for(const {model,line} of svgMarkers){
      const {weight,ink}=order.markers.get(model.id);
      line.dataset.weight=weight;
      const tone=weight==='context'&&model.tone==='structure'?'quiet':model.tone;
      line.dataset.role=tone;line.setAttribute('marker-end',`url(#arrow-${model.relation}-${tone})`);
      layers.push([ink,line]);
    }
    for(const [rank,element] of layers.sort((a,b)=>a[0]-b[0])){
      element.dataset.order=rank;
      drawing.append(element);
    }
    space?.refresh();
    requestDrawing();
  }
  stage.addEventListener('focusin',e=>{
    keyboardNode=e.target.matches(':focus-visible')?e.target.closest('.node-card')?.dataset.node:null;
    if(keyboardNode&&spaceFrame?.projection.lanes>.9){
      const point=spaceFrame.projection.nodeAt(keyboardNode,spaceFrame.cut.at);
      if(point.x<80||point.x>viewport.clientWidth-80)scrollSide(point.x-viewport.clientWidth/2);
    }
    updateFocus();
  });
  stage.addEventListener('focusout',e=>{
    if(!e.relatedTarget?.closest('.node-card')){keyboardNode=null;updateFocus();}
  });
  function useSVG() {
    gpu=null;surface.hidden=true;mini.setGPU(false);map.dataset.renderer='svg';
    space?.backendChanged();syncMotion();
  }
  function requestDrawing() {
    if(!layout||!viewport.clientWidth||!viewport.clientHeight)return;
    if(!gpuRequested&&!forcedColors.matches&&(layout.edges.length||layout.cards.some(card=>card.strip))) {
      gpuRequested=true;
      import('./graph-webgl.js').then(({createWebGLGraph})=>{
        gpu=createWebGLGraph(canvas,useSVG,capture,mini.canvas);
        if(gpu){space?.backendChanged();syncMotion();requestDrawing();}
      }).catch(useSVG);
    }
    if(!gpu||drawPending||forcedColors.matches)return;
    const box=viewBox();
    if(lastDraw?.layout===layout&&Object.keys(box).every(key=>lastDraw.box[key]===box[key]))return;
    drawPending=true;
    requestAnimationFrame(()=>{
      drawPending=false;
      if(!gpu||document.hidden||!viewport.clientWidth||!viewport.clientHeight)return;
      const next=viewBox();
      try {
        gpu.draw(layout,next,RELATION_MARKS,graphInkOrder(layout,focusId,focus));
        if(lastDraw?.layout!==layout || ['width','height','x','y','scale','dpr'].some(key=>lastDraw.box[key]!==next[key]))
          mini.setGPU(!spaceFrame&&gpu.drawMinimap(mini.frame()));
        lastDraw={layout,box:next};
        surface.style.left=next.insetX+'px';surface.style.top=next.insetY+'px';
        surface.hidden=false;map.dataset.renderer='webgl';
        syncMotion();
      } catch { useSVG(); }
    });
  }
  Object.defineProperty(map,'graphDrawing',{get:()=>{
    if(!layout)return null;
    const box=viewBox(), rect=contentRect(viewport);
    if(gpu&&lastDraw&&!forcedColors.matches)return {renderer:'webgl',box:{...lastDraw.box},...gpu.describe(),
      minimapMarks:gpu.describeMinimap(),motionFrames,pulseStarts,...gpu.diagnostics()};
    const inspect=({model,line,underlay})=>{
      const matrix=line.getScreenCTM();
      const points=line.getAttribute('d').slice(1).split(' L').map(pair=>{
        const [x,y]=pair.split(' ').map(Number);
        return {x:matrix.a*x+matrix.c*y+matrix.e-rect.left,y:matrix.b*x+matrix.d*y+matrix.f-rect.top};
      });
      const css=getComputedStyle(line);
      const order=[...drawing.children];
      return {id:model.id,points,visible:css.visibility==='visible',gate:model.gate,relation:model.relation,
        weight:line.dataset.weight,width:parseFloat(css.strokeWidth),order:order.indexOf(line),underlay:order.indexOf(underlay)};
    };
    return {renderer:'svg',box,strokes:svgStrokes.map(inspect),markers:svgMarkers.map(inspect),motionFrames:0,
      flowMarks:layout.flowMarks.map(model=>({id:model.id,cue:model.cue}))};
  }});
  const zoomText=el('output');zoomText.setAttribute('aria-live','polite');
  const rememberScroll=()=>{scrollPosition={left:viewport.scrollLeft,top:viewport.scrollTop};};
  let scrollPosition={left:0,top:0};
  const zoom=(amount,point=null)=>{
    if(!layout)return;
    automatic=false;
    const rect=contentRect(viewport),screenPoint=point?{x:rect.left+point.x,y:rect.top+point.y}:null;
    point ||= {x:viewport.clientWidth/2,y:viewport.clientHeight/2};
    const before=layout, anchor={x:(viewport.scrollLeft+point.x-origin.x)/scale,y:(viewport.scrollTop+point.y-origin.y)/scale};
    const next=zoomLevel(level,scale,amount);
    const changed=level!==next.level || next.scale!==scale&&
      (graphDetail(level,scale)==='far'||graphDetail(next.level,next.scale)==='far');
    level=next.level;scale=next.scale;
    if(changed)update(rawData,chosenNode);else size();
    const mapped=changed?mapAnchor(before,layout,anchor):anchor;
    const restoreAnchor=()=>{
      const after=contentRect(viewport);
      const x=screenPoint?screenPoint.x-after.left:viewport.clientWidth/2;
      const y=screenPoint?screenPoint.y-after.top:viewport.clientHeight/2;
      viewport.scrollLeft=Math.round(mapped.x*scale+origin.x-x);
      viewport.scrollTop=Math.round(mapped.y*scale+origin.y-y);
      return {...after,height:toolbar.offsetHeight};
    };
    const placement=restoreAnchor();
    rememberScroll();panIntent=false;clearTimeout(snapTimer);outside();
    if(screenPoint){
      // Hold a row that wrapped while the cursor anchor changed the scroll position.
      const current=contentRect(viewport);
      if(Math.abs(current.left-placement.left)>=.01||Math.abs(current.top-placement.top)>=.01){
        toolbar.style.minHeight=Math.max(placement.height,toolbar.offsetHeight)+'px';
        restoreAnchor();
        rememberScroll();
        outside();
      }
    }
  };
  const start=()=>{
    const plan=!!data.plan_approval && !(data.plan_approval.verified && data.plan_approval.outcome==='approved');
    const position=fitStart(layout,viewport.clientWidth,viewport.clientHeight,scale,data.nodes,plan);
    viewport.scrollLeft=position.left;viewport.scrollTop=position.top;rememberScroll();panIntent=true;snapTitles();revealSelection();outside();
    // An explicit level/fit action can resize the toolbar after layout.
    setTimeout(()=>{size();revealSelection();},50);
  };
  const fit=()=>{
    const next=fitGraph(layouts,viewport.clientWidth-24,viewport.clientHeight-24);
    origin={x:0,y:0};
    level=next.level;scale=next.scale;automatic=true;
    placed=false;update(rawData,chosenNode);size();start();
  };
  const zoomOut=button('−',()=>zoom(-.1)),zoomIn=button('+',()=>zoom(.1)),fitButton=button(t('fit'),fit);fitButton.dataset.action='fit';
  const overviewNote=el('span',undefined,'overview-note'),overviewLabel=button(t('overviewLevel'),()=>{automatic=true;level='overview';scale=fitScale(layouts.overview.bounds,viewport.clientWidth-24,viewport.clientHeight-24);update(rawData,chosenNode);start();}),detailButton=button(t('detailLevel'),()=>{automatic=false;level='detail';scale=1;update(rawData,chosenNode);start();});
  overviewLabel.dataset.i18n='overviewLevel';detailButton.dataset.i18n='detailLevel';
  overviewNote.append(overviewLabel,detailButton);overflow.append(button(t('listAll'),()=>{$('accessible').open=true;$('accessible').scrollIntoView({block:'start'});},'small'));
  toolbar.append(zoomOut,zoomIn,fitButton,zoomText,overviewNote,overflow);
  zoomOut.dataset.i18nLabel='zoomOut';zoomIn.dataset.i18nLabel='zoomIn';viewport.dataset.i18nLabel='mapHelp';
  const mapTitle=el('div',undefined,'map-title'), name=el('strong',t('graph')), direction=el('span',t('mapDirection'));
  name.dataset.i18n='graph';direction.dataset.i18n='mapDirection';mapTitle.append(name,direction);toolbar.prepend(mapTitle);translate();
  function updateCounts(visible) {
    const goals=layout.cards.filter(card=>card.kind==='goal').length;
    Object.assign(visibleCount.dataset,{plan:layout.cards.length-goals,wholeResult:goals,visible});
    visibleCount.textContent=t(graphDetail(level,scale)==='far'?'visibleFarCards':'visiblePlan',
      {total:layout.cards.length-goals,result:goals?t('visibleResult',{n:goals}):'',n:visible});
  }
  function outside() {
    if(!layout)return;
    if(!viewport.clientWidth){mini.update(layout,viewBox());updateCounts(0);return;}
    if(spaceFrame)return;
    const w=viewport.clientWidth,h=viewport.clientHeight,ox=origin.x,oy=origin.y,far=graphDetail(level,scale)==='far',vr=contentRect(viewport);
    const groups={offLeft:[],offRight:[],offTop:[],offBottom:[]}; let visible=0;
    for(const n of data.nodes) {
      const p=layout.positions[n.id],x=p.x*scale+ox-viewport.scrollLeft,y=p.y*scale+oy-viewport.scrollTop;
      const element=nodes.get(n.id),title=element?.querySelector('.node-title'),tr=far?null:titleTextRect(title);
      const cardRect={x,y,width:p.width*scale,height:p.height*scale};
      const rect=tr?{x:tr.left-vr.left,y:tr.top-vr.top,width:tr.width,height:tr.height}:cardRect;
      const horizontal=x>=-.5&&x+p.width*scale<=w+.5;
      const direction=offscreenDirection(horizontal?rect:{x,y,width:p.width*scale,height:p.height*scale},w,h);
      if(direction)groups[direction].push(n);
      if(horizontal&&titleVisibility(rect,w,h))visible++;
      if(element){element.style.visibility=horizontal&&intersectsViewport({x,y,width:p.width*scale,height:p.height*scale},w,h)?'visible':'hidden';wholeMapLines(element,vr,scale);}
    }
    if(tagLeads)tagLeads.style.display=far?'none':'';
    for(const tag of layout.tags){const element=chips.get(tag.id);if(element)element.hidden=far || !!offscreenDirection({x:tag.x*scale+ox-viewport.scrollLeft,y:tag.y*scale+oy-viewport.scrollTop,width:tag.width*scale,height:tag.height*scale},w,h);}
    // The viewport clips routes naturally: an off-screen neighbour leaves a visible continuing stub.
    recordGraphRead();
    updateCounts(visible);
    for(const [direction,b] of overflowButtons)b.hidden=!groups[direction].length;
    for(const [direction,items] of Object.entries(groups))if(items.length) {
      let b=overflowButtons.get(direction);
      if(!b){b=button('',()=>{},'small');overflowButtons.set(direction,b);overflow.append(b);}
      overflow.append(b);
      b.textContent=(items.some(n=>!n.runLevel)?t('offCount',{direction:t(direction),n:items.filter(n=>!n.runLevel).length})+(items.some(n=>n.runLevel)?' + '+t('runChecksTitle'):''):t(direction)+' '+t('offFinal')) + (items.some(n=>['running','reviewing','retrying','submitted'].includes(displayState(n,data.decisions))) ? t('offWorking',{n:items.filter(n=>['running','reviewing','retrying','submitted'].includes(displayState(n,data.decisions))).length}) : '') + (items.some(n=>data.decisions.some(d=>d.node===n.id)) ? t('offNeeds',{n:items.filter(n=>data.decisions.some(d=>d.node===n.id)).length}) : '');
      b.onclick=()=>{
        const horizontal=['offLeft','offRight'].includes(direction),back=['offLeft','offTop'].includes(direction);
        const sorted=[...items].sort((a,b)=>(layout.positions[a.id][horizontal?'x':'y']-layout.positions[b.id][horizontal?'x':'y'])*(back?-1:1));
        const p=layout.positions[sorted[0].id];
        viewport.scrollLeft=Math.max(0,p.x*scale-(w-p.width*scale)/2+ox);
        viewport.scrollTop=Math.max(0,p.y*scale-Math.max(12,(h-p.height*scale)/2)+oy);outside();viewport.focus({preventScroll:true});
      };
    }
    mini.update(layout,viewBox());
    requestDrawing();
  }
  let snapTimer=null,panIntent=false;
  function snapTitles(){
    if(!panIntent||!layout)return;panIntent=false;
    const vr=viewport.getBoundingClientRect(),titles=[...nodes.values()].map(e=>e.querySelector('.node-title')?.getBoundingClientRect()).filter(Boolean);
    const x=viewport.scrollLeft,y=viewport.scrollTop;
    viewport.scrollLeft=snapTitleOffset(x,viewport.clientWidth,viewport.scrollWidth-viewport.clientWidth,titles.map(r=>[r.x-vr.x+x,r.right-vr.x+x]));
    viewport.scrollTop=snapTitleOffset(y,viewport.clientHeight,viewport.scrollHeight-viewport.clientHeight,titles.map(r=>[r.y-vr.y+y,r.bottom-vr.y+y]));
    rememberScroll();outside();
  }
  viewport.addEventListener('scroll',()=>{
    if(scrollPosition.left!==viewport.scrollLeft || scrollPosition.top!==viewport.scrollTop)automatic=false;
    rememberScroll();outside();updateReadout();if(panIntent){clearTimeout(snapTimer);snapTimer=setTimeout(snapTitles,160);}
  });
  function updateReadout() {
    const fits=layout && layout.bounds.width*scale<=viewport.clientWidth && layout.bounds.height*scale<=viewport.clientHeight;
    fitButton.textContent=t(fits?'fit':'scrollView');fitButton.title=t(fits?'fit':'scrollViewHelp');
    fitButton.removeAttribute('aria-pressed');
    overviewNote.title=t('overviewHelp');overviewNote.hidden=false;overviewLabel.setAttribute('aria-pressed',String(level==='overview'));detailButton.setAttribute('aria-pressed',String(level==='detail'));map.dataset.level=level;map.dataset.lod=graphDetail(level,scale);map.dataset.fitted=String(automatic&&fits);map.dataset.scale=String(scale);
  }
  function size() {
    if(!layout)return;
    if(map.getBoundingClientRect){
      const phone=matchMedia('(max-width:760px)').matches;
      const selectedHeight=(layout.positions[chosenNode]?.height||0)*scale;
      // Size the scrolling area independently of wrapping navigation controls.
      const minimum=Math.max(phone?214:230,selectedHeight+48);
      const available=Math.max(minimum,innerHeight-map.getBoundingClientRect().top-38-(phone?120:60));
      const scrollbar=viewport.offsetHeight-viewport.clientHeight||0;
      const dock=mini.reserve(layout,scale,available-scrollbar);
      area.style.height=Math.max(minimum,available-dock)+dock+'px';
      map.style.height='auto';
      map.parentElement.style.setProperty('--drawer-top',(map.offsetTop+toolbar.offsetHeight+8)+'px');
      map.parentElement.style.setProperty('--drawer-height',Math.max(230,map.offsetHeight-toolbar.offsetHeight-16)+'px');
    }
    const w=viewport.clientWidth||900,h=viewport.clientHeight||600;
    if(!placed)origin={x:Math.max(0,(w-layout.bounds.width*scale)/2),y:Math.max(0,(h-layout.bounds.height*scale)/2)};
    Object.assign(stage.style,{left:origin.x+'px',top:origin.y+'px',width:layout.bounds.width+'px',height:layout.bounds.height+'px',transform:`scale(${scale})`});
    stage.style.setProperty('--map-text',Math.max(14,12/scale)+'px');
    stage.style.setProperty('--kind-size',Math.max(20,20/scale)+'px');
    stage.style.setProperty('--status-size',Math.max(20,16/scale)+'px');
    // Keep the final card clear of the reserved scrollbar gutter at minimum zoom.
    Object.assign(spacer.style,{
      width:layout.bounds.width*scale>w?Math.ceil(layout.bounds.width*scale+(viewport.clientLeft||0))+'px':'100%',
      height:layout.bounds.height*scale>h?layout.bounds.height*scale+'px':'100%',
    });
    if(!$('panel').hidden && $('panel').onscroll)$('panel').onscroll();
    zoomText.textContent=t(level==='overview'?'overviewLevel':'detailLevel')+' '+Math.round(scale*100)+'%';zoomOut.disabled=level==='overview'&&scale<=MIN_MAP_SCALE;zoomOut.title=zoomOut.disabled?t('minZoom'):t('zoomOut');zoomIn.disabled=level==='detail'&&scale>=1.6;updateReadout();rememberScroll();outside();space?.refresh();
  }
  const maxCardWidth=()=>matchMedia('(max-width:760px)').matches ? Math.max(156,(viewport.clientWidth || innerWidth-72)-24) : Infinity;
  let measuredWidth;
  const setRect=(element,rect)=>Object.assign(element.style,{left:rect.x+'px',top:rect.y+'px',width:rect.width+'px',height:rect.height+'px'});
  function update(next,id) {
    const initial=next.run!==rawData?.run || next.project!==rawData?.project;
    if(initial)fx.observe(null,motionClock(),false,true);
    rawData=next;next=planFlow(next,language);
    toolbar.style.minHeight='';
    if(layout)size();
    const planKey=JSON.stringify([next.nodes.map(n=>[n.id,n.title,n.kind,n.target]),next.edges.map(e=>[e.from,e.to,e.relation,e.label])]);
    if(planKey!==layoutKey){layoutKey=planKey;if(!placed){automatic=true;level='detail';}}
    data=next;chosenNode=id;
    measuredWidth=maxCardWidth();
    layouts=Object.fromEntries(['detail','overview'].map(level=>[level,layeredLayout(data.nodes,data.edges.map(e=>({...e,displayLabel:e.label?label(e.label):''})),data.decisions,true,{level,language,instrument:true,wrapLongChains:true,maxCardWidth:measuredWidth,measure:(n,width)=>{
      const sample=nodeCard(n,n.id===id,level);sample.classList.add('card-measure');sample.style.width=width+'px';
      const fontSize=graphDetail(level,scale)==='far'?Math.max(14,12/scale):14;
      sample.style.setProperty('--map-text',fontSize+'px');
      sample.style.setProperty('--kind-size',20/MIN_FIT_SCALE+'px');stage.append(sample);
      if(nodes.get(n.id)?.querySelector('.answered-result')?.open && sample.querySelector('.answered-result'))sample.querySelector('.answered-result').open=true;
      const height=sample.offsetHeight?Math.ceil(sample.getBoundingClientRect().height/scale):0;
      sample.remove();return height;
    }})]));
    layouts.overview=compactOverview(layouts.overview,viewport.clientWidth-24);
    const now=(isPast()?next.observed_at_ms:graphTestClock?.wall) ?? next.observed_at_ms ?? graphNow();
    for(const name of ['detail','overview'])layouts[name]=createGraphScene(data.nodes,layouts[name],data.decisions,name,now,language);
    layout=layouts[level];
    size();
    if(!placed && viewport.clientWidth){const fitted=fitGraph(layouts,viewport.clientWidth-24,viewport.clientHeight-24);level=fitted.level;scale=fitted.scale;layout=layouts[level];}
    const focused=document.activeElement?.closest?.('[data-node]')?.dataset.node;
    const activeIds=new Set(layout.cards.map(card=>card.id));
    for(const [key,element] of nodes)if(!activeIds.has(key)){element.remove();nodes.delete(key);}
    const byId = new Map(data.nodes.map(n => [n.id, n]));
    for(const model of layout.cards) {
      const n = byId.get(model.id);
      const expanded=n.id===chosenNode;
      const {activity, ...cardContent}=n;
      const signature=JSON.stringify([level,cardContent,model.facts,model.strip,graphAttempt(n)?.repeating,data.decisions.filter(d=>d.node===n.id),planChanges?.find(c=>c.id===n.id)]);
      let element=nodes.get(n.id);
      if(!element){element=el('div',undefined,'node-position');nodes.set(n.id,element);stage.append(element);}
      if(element.dataset.signature!==signature) {
        const card=nodeCard({...n,kind:model.kind},expanded,model.level,model.state,model);
        element.replaceChildren(card);element.dataset.signature=signature;
      }
    }
    name.textContent=planCounts(data.plan_counts||{work:data.nodes.filter(n=>n.kind==='work').length,review:data.nodes.filter(n=>n.kind==='review').length,decision:data.nodes.filter(n=>n.kind==='decision').length},language);mapTitle.classList.toggle('returned-title',$('flow').classList.contains('sent-plan'));
    // Reorder existing controls without replacing them: tab order follows the drawing.
    for(const card of layout.cards){const e=nodes.get(card.id);setRect(e,card);stage.append(e);}
    const tierTwo=layout.cards.filter(card=>card.tier===2).length;
    attentionCount.hidden=!tierTwo;
    attentionCount.textContent=t('activityAttentionCount',{n:tierTwo});
    const counts={delivered:0,progress:0,waiting:0,blocked:0};
    const buckets={delivered:'delivered',frontier:'progress',waiting:'waiting',unreachable:'waiting',blocked:'blocked',returned:'blocked'};
    for(const edge of layout.edges)if(edge.flow)counts[buckets[flowCue(edge.flow)]]++;
    flowCount.hidden=!layout.edges.some(edge=>edge.flow);
    flowCount.textContent=t('flowCounts',counts);
    if(drawing)drawing.remove();drawing=svg('svg',{width:layout.bounds.width,height:layout.bounds.height,class:'edge-layer','aria-hidden':'true'});
    svgStrokes=[];svgMarkers=[];
    const defs=svg('defs');
    for(const relation of Object.keys(RELATION_MARKS))for(const tone of ['structure','quiet','live','failure']){
      const marker=svg('marker',{id:'arrow-'+relation+'-'+tone,viewBox:'0 0 10 10',refX:10,refY:5,markerWidth:7,markerHeight:7,orient:'auto','data-role':tone});
      marker.append(edgeMarker(relation));defs.append(marker);
    }
    drawing.append(defs);stage.prepend(drawing);
    for(const {id,cue,paths} of layout.flowMarks){
      drawing.append(svg('path',{'data-flow-id':id,'data-flow':cue,class:'flow-mark '+cue,'data-role':toneForFlow(cue),
        d:paths.map(path=>roundedRoute(path,0)).join(' ')}));
    }
    for(const element of chips.values())element.remove();chips.clear();
    for(const model of layout.strokes){
      const d=roundedRoute(model.points,0);
      const underlay=svg('path',{d,class:'edge-underlay '+model.trace,'data-role':model.tone,'stroke-dashoffset':-model.distance});
      const line=svg('path',{d,class:'edge-path '+model.trace,'data-role':model.tone,'data-stroke-id':model.id,'stroke-dashoffset':-model.distance});
      svgStrokes.push({model,line,underlay});
    }
    const edgesById=new Map(layout.edges.map(edge=>[edge.id,edge]));
    for(const model of layout.markers){
      const {relation,members}=model;
      const attributes=members.length===1?{...edgeAttributes(edgesById.get(members[0])),'data-edge-id':members[0]}:{};
      const line=svg('path',{d:roundedRoute(model.points,0),...attributes,class:'edge-marker',
        'data-marker-id':model.id,'data-role':model.tone,'marker-end':`url(#arrow-${relation})`});
      svgMarkers.push({model,line});
    }
    const lineLength=([a,b])=>Math.hypot(a.x-b.x,a.y-b.y);
    const routedTags=new Map(layout.tags.map(tag=>[tag.id,tag]));
    spaceTags=layout.edges.flatMap(edge=>{
      const tag=routedTags.get(edge.id);
      if(tag)return [{key:edge.key,...tag}];
      const points=edge.points;
      if(points.length<2)return [];
      const [a,b]=points.slice(1).map((p,i)=>[points[i],p]).reduce((longest,part)=>
        lineLength(part)>lineLength(longest)?part:longest);
      return [{key:edge.key,...edgeTag(edge,language),anchor:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}];
    });
    tagLeads?.remove();
    tagLeads=svg('svg',{width:layout.bounds.width,height:layout.bounds.height,class:'tag-leads','aria-hidden':'true'});
    for(const tag of layout.tags){
      const {x,y}=tag.anchor;
      const edgeX=Math.max(tag.x,Math.min(x,tag.x+tag.width)),edgeY=Math.max(tag.y,Math.min(y,tag.y+tag.height));
      if(x!==edgeX||y!==edgeY)tagLeads.append(svg('path',{d:`M${x} ${y}L${edgeX} ${edgeY}`,'data-role':tag.tone}));
      const element=el('span',tag.text,'edge-tag');
      Object.assign(element.dataset,{edgeId:tag.id,flow:tag.cue,role:tag.tone});
      element.setAttribute('aria-hidden','true');
      setRect(element,tag);stage.append(element);chips.set(tag.id,element);
    }
    stage.append(tagLeads);
    fxLayer?.remove();
    fxLayer=svg('svg',{width:layout.bounds.width,height:layout.bounds.height,class:'graph-fx','aria-hidden':'true'});
    edgeEffects.clear();
    for(const edge of layout.edges){
      const path=svg('path',{class:'route-fill',d:roundedRoute(edge.points,0),pathLength:1});
      const token=svg('circle',{class:'route-token',r:4});
      const arrows=svg('path',{class:'route-drift'});
      for(const mark of [path,arrows,token]){mark.style.display='none';fxLayer.append(mark);}
      edgeEffects.set(edge.key,{path,arrows,token});
    }
    stage.append(fxLayer);
    const directionKey='mapDirection';
    direction.textContent=t(directionKey);direction.dataset.i18n=directionKey;
    mapTitle.classList.remove('map-complete');
    size();
    // Start at the beginning, with no clipped labels from a preceding column.
    if(!data.nodes.length){placed=false;initialFitPending=false;automatic=true;level='detail';}
    else if(!placed&&viewport.clientWidth){
      const fitted=fitGraph(layouts,viewport.clientWidth-24,viewport.clientHeight-24);
      if(fitted.level!==level||Math.abs(fitted.scale-scale)>.001){level=fitted.level;scale=fitted.scale;update(rawData,chosenNode);return;}
      placed=true;start();
      if(!initialFitPending && document.fonts){
        initialFitPending=true;
        // Fonts and the plan band finish sizing after the first DOM update.
        document.fonts.ready.then(()=>setTimeout(()=>{
          if(automatic)fit();
        },0));
      }
    }

    if(!isPast())fx.observe(layout,motionClock(),motionAllowed());
    updateFocus();outside();syncMotion();
    if(focused)nodes.get(focused)?.querySelector('button')?.focus({preventScroll:true});
  }
  map.addEventListener('keydown',e=>{
    if(!['map-viewport','map'].includes(e.target.id||e.target.className))return;
    if(space?.key(e)){e.preventDefault();return;}
    if(spaceFrame?.projection.lanes>.9&&['ArrowLeft','ArrowRight'].includes(e.key)){
      e.preventDefault();scrollSide(e.key==='ArrowLeft'?-120:120);return;
    }
    if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();
    if(e.key==='+'||e.key==='=')zoom(.1);if(e.key==='-')zoom(-.1);if(e.key==='0')fit();
    if(e.key.startsWith('Arrow')){automatic=false;panIntent=true;}
    if(e.key==='ArrowLeft')viewport.scrollLeft-=80;if(e.key==='ArrowRight')viewport.scrollLeft+=80;
    if(e.key==='ArrowUp')viewport.scrollTop-=80;if(e.key==='ArrowDown')viewport.scrollTop+=80;
  });
  let drag=null;
  viewport.addEventListener('pointerdown',e=>{
    if(e.button!==0 || e.target.closest('button,summary,a'))return;
    const orbit=space?.startDrag(e,map.dataset.fitted==='true');
    drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop,orbit,
      touch:e.pointerType==='touch',card:!!e.target.closest('.node-position')};
    if(drag.touch)return;
    automatic=false;viewport.setPointerCapture(e.pointerId);viewport.classList.add('panning');
  });
  viewport.addEventListener('pointermove',e=>{
    if(drag?.orbit){space.moveDrag(e);return;}
    if(drag&&!drag.touch){
      if(spaceFrame?.projection.lanes>.7){scrollSide(drag.x-e.clientX);drag.x=e.clientX;return;}
      viewport.scrollLeft=drag.left+drag.x-e.clientX;
      viewport.scrollTop=drag.top+drag.y-e.clientY;
    }
  });
  function release(event){
    const start=drag;drag=null;viewport.classList.remove('panning');panIntent=true;
    if(start?.orbit&&space.releaseDrag()){panIntent=false;return;}
    if(layout && start && !start.card && event.type==='pointerup' && Math.hypot(start.x-event.clientX,start.y-event.clientY)<5 &&
      start.left===viewport.scrollLeft && start.top===viewport.scrollTop){
      const rect=contentRect(viewport),box=viewBox();
      const screenPoint={x:event.clientX-rect.left,y:event.clientY-rect.top};
      if(spaceFrame){space.pick(screenPoint,viewport);panIntent=false;return;}
      const point={x:(screenPoint.x-box.x)/scale,y:(screenPoint.y-box.y)/scale};
      const hit=pickGraphEdges(layout,point,scale);
      const keys=layout.edges.filter(edge=>hit.includes(edge.id)).map(edgeKey);
      if(keys.length===1){selectEdge(keys[0],viewport);return;}
      if(keys.length>1){chooseEdge(keys,viewport);return;}
    }
    snapTitles();
  }
  viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
  function scrollSide(amount) {
    if(!spaceFrame)return;
    sideScroll=Math.max(0,Math.min(spaceFrame.projection.sideWidth-viewport.clientWidth,sideScroll+amount));
    space.refresh();
  }
  viewport.addEventListener('wheel',e=>{
    if(spaceFrame?.projection.lanes>.7){e.preventDefault();scrollSide(e.deltaX||e.deltaY);return;}
    panIntent=true;
    if(e.ctrlKey || e.metaKey){e.preventDefault();const r=contentRect(viewport);zoom(e.deltaY<0?.1:-.1,{x:e.clientX-r.left,y:e.clientY-r.top});}
    else automatic=false;
  },{passive:false});
  let lastWidth=0,lastHeight=0;
  function resize(selection = false) {
    if(!layout)return;
    const w=viewport.clientWidth,h=viewport.clientHeight;
    if(w===lastWidth&&h===lastHeight)return;
    lastWidth=w;lastHeight=h;
    if(w && measuredWidth!==maxCardWidth())update(rawData,chosenNode);
    else size();
  }
  reduced.addEventListener('change',()=>{syncMotion();space?.backendChanged();});
  phone.addEventListener('change',()=>{if(phone.matches)space?.view('flat');space?.refresh();});
  highContrast.addEventListener('change',requestDrawing);
  forcedColors.addEventListener('change',()=>{
    map.dataset.renderer=forcedColors.matches?'svg':gpu?'webgl':'svg';
    surface.hidden=forcedColors.matches||!gpu;mini.setGPU(!forcedColors.matches&&!!gpu&&!!mini.frame());
    space?.backendChanged();syncMotion();requestDrawing();
  });
  new ResizeObserver(()=>resize()).observe(viewport);
  addEventListener('resize',requestDrawing);
  function revealSelection() {
    const p=layout?.positions[chosenNode];if(spaceFrame||!p || !viewport.clientWidth)return;
    const w=viewport.clientWidth,h=viewport.clientHeight,ox=origin.x,oy=origin.y;
    const left=p.x*scale+ox,top=p.y*scale+oy,right=left+p.width*scale,bottom=top+p.height*scale;
    if(left<viewport.scrollLeft+12)viewport.scrollLeft=Math.max(0,left-12);
    else if(right>viewport.scrollLeft+w-12)viewport.scrollLeft=right-w+12;
    if(top<viewport.scrollTop+12)viewport.scrollTop=Math.max(0,top-12);
    else if(bottom>viewport.scrollTop+h-12)viewport.scrollTop=bottom-h+12;
    rememberScroll();outside();
  }
  function observeReplay(history) {
    const model=planFlow(history,language);
    const cards=model.nodes.map(node=>graphMotionCard(node,model.decisions,history.observed_at_ms,language));
    const positions=Object.fromEntries(cards.map(card=>[card.id,card]));
    const routes=new Map(layout?.edges.map(edge=>[edge.key,edge.points]));
    const edges=model.edges.map(edge=>({...edge,key:edgeKey(edge),points:routes.get(edgeKey(edge))||[],
      targetRunning:runningCard(positions[edge.to]?.state)}));
    fx.observe({cards,positions,edges},motionClock(),motionAllowed());
  }
  function enableSpace(createSpaceView) {
    if(space)return;
    viewport.setAttribute("aria-keyshortcuts", "1 2 3 Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight");
    space=createSpaceView({area,viewport,toolbar,svg,t,duration:ms=>historyDuration(ms,true),stamp:historyStamp,
      read:()=>layout&&timeCut&&viewport.clientWidth?{layout,cut:timeCut,box:flatBox(),sideScroll,
        selection:{node:selected,relation:selectedEdge},tags:spaceTags,
        focus:{active:!!focusId,cards:focus?.cards||new Set(),
          relations:new Set(layout.edges.filter(e=>focus?.edges.has(e.id)).map(e=>e.key))}}:null,
      apply:applySpace,load:()=>timeBar.history(),clock:motionClock,deterministic:()=>graphTestClock?.time!=null,
      canAnimate:()=>!reduced.matches&&!motionPaused,canOrbit:()=>!!gpu&&!forcedColors.matches,
      isPhone:()=>phone.matches,select:selectEdge,choose:chooseEdge,selectNode,
      notes:spaceNotes,nodeTitle:id=>layout.positions[id]?.title||id});
    space.refresh();
  }
  return {update,observeReplay,enableSpace,timeCut:()=>space?.refresh(),resetSpace:()=>space?.reset(),resetMotion:()=>fx.observe(null,motionClock(),false,true),
    baselineMotion:()=>fx.observe(layout,motionClock(),false,true),select:id=>{
    chosenNode=id;
    for(const [key,element] of nodes){element.firstElementChild.classList.toggle('expanded',key===id);element.querySelector('.node-header').setAttribute('aria-expanded',String(key===id));}
    updateFocus();resize(true);size();revealSelection();
  },wake(){syncMotion();space?.backendChanged();size();if(!document.hidden)requestDrawing();},remeasure:()=>update(rawData,chosenNode)};
}
renderer = createMap(); if(view)renderer.update(view,selected);
}
