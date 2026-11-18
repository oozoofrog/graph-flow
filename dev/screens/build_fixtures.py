#!/usr/bin/env python3
"""Durable dashboard fixtures. Normal history is produced only by scripts/gf."""
import argparse
import contextlib
import io
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from unittest import mock

HERE = Path(__file__).resolve().parent
SKILL = HERE.parents[1] / 'skills/graph-flow'
sys.path[:0] = [str(SKILL / 'scripts'), str(SKILL / 'tests')]
from human_support import human_answer
from test_review11 import Review11Tests
from graphflow import activity, cli

SCENARIOS = {
    'graph-spacetime': 'Recorded rework, review and an open decision on a minute-scale timeline',
    'graph-spacetime-long': 'The same run with a three-day gap before the decision',
    'graph-spacetime-short': 'A ten-minute run with a burst of short tool calls of one category',
    'graph-spacetime-short-en': 'The ten-minute run in English',
    'graph-instrument': 'A branched live graph with recorded work, a decision, stalls and a return',
    'graph-flow-states': 'Delivered, frontier, waiting, blocked, returned and unreachable relations',
    'graph-activity-unreadable': 'A damaged activity log with readable boundary records',
    'graph-activity': 'Mixed observed, stalled, repeated, boundary-only, and waiting work',
    'graph-verification': 'Graph kinds, parallel relations, current failure and retry history',
    'graph-wrap': 'A chain whose authored order differs from dependency order',
    'graph-chain-60': 'Sixty stages in a dependency chain',
    'graph-dense': 'Three complete adjacent layers for comparing full context and a selected dependency path',
    'graph-empty': 'An initialized run with no posted plan',
    'check-lines': '검사 네 개의 제목과 통과·실패·아직 안 함 표시',
    'notices': '뒤 작업의 파일을 쓰는 전체 검사와 작업 전 통과 알림',
    'trajectory': '세 번째 제출: 전체 검사 반려, 자체 검사 반려, 실패 후 통과한 검토',
    'lane3': '제출 결과 사용 허가',
    'decision-review': '검토 결정',
    'hold-check': '자동으로 확정할 수 없는 검사 실패',
    'reasked': '근거가 바뀌어 다시 물은 사람 검사',
    'reapproval': '계획 변경 후 재승인',
    'long-text': '최대 길이 한국어 제목 60자·요약 300자·검사 제목 120자',
    'demo': '여섯 작업의 진행, 근거가 있는 확인 요청과 자유 질문',
    'real': '명령 검사, lane 2 검토, lane 3 허가를 포함한 코드 작업',
    'many': '열세 작업이 분기하고 합쳐지는 진행 화면',
    'files': '제출한 안내 파일을 읽고 판단하는 사람 검사',
    'nothing': '첨부 근거가 없는 허가 결정',
    'plan': '사람 검사와 결정 시점이 포함된 새 계획',
    'sent-back': '사람이 수정 요청을 보낸 계획',
    'large-plan': '열세 작업의 승인 대기 계획',
    'large-run': '열세 작업 중 일부가 끝나고 실행 중인 작업',
    'thirty-plan': '서른 작업의 승인 대기 계획',
    'thirty-run': '서른 작업의 진행 화면',
    'tampered': '저장된 계획 파일이 변조된 상태',
    'unverified': '승인 답변의 서명이 변조된 상태',
    'superseded': '문구 변경 뒤 게이트가 다시 요청한 결정의 이전 링크',
    'old': '테스트에 보존된 실제 0.2.1 실행 기록',
    'old-continue': '0.2.1 제출물을 유지하고 새 계획 승인을 기다림',
    'old-reasked': '0.2.1 계획 승인 후 현재 게이트가 다시 묻는 확인',
    'key-mismatch': '승인 후 격리 홈의 키가 바뀐 상태',
    'key-repinned': '테스트의 사람 터미널 경로로 키를 복구한 새 승인',
    'replaced': '변조된 계획을 정상 CLI로 교체한 상태',
    'constraints': '통합 검사와 승격 검사, 적용 지침을 담은 계획',
    'moved': '승인 후 프로젝트 경로가 이동한 상태',
    'changed-live': '열린 승인 화면에서 검사 계약을 바꾸는 계획',
    'check-options': '검사의 작업 폴더와 제한 시간이 있는 계획',
    'file-changed-live': '열린 판단 화면에서 첨부 파일의 내용이 달라짐',
    'key-recovery-live': '현재 화면에서 키 복구를 확인하고 새 계획 승인으로 진행함',
    'hold': '검토 실패 후 게이트가 요청하는 보류 판단',
    'outcomes': '후속 작업을 허용하는 허가 결정',
    'own-files': '소유한 검사 스크립트를 실행하는 계획',
    'answered': '이미 답한 결정이 남아 있는 진행 계획',
    'free': '에이전트가 보낸 비구속 자유 질문',
    'review-awaited': 'lane 1 작업의 예정된 검토를 기다림',
    'revised': '돌려보낸 결정 질문을 수정하고 다시 요청함',
    'wording': '질문 문구만 바꾼 재게시의 기록',
}


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def work(node='a', title='안내 쓰기', needs=()):
    file = 'guide.txt' if node == 'a' else node + '.txt'
    return dict(id=node, kind='work', title=title, goal=title + ' 작업을 마치고 결과를 확인해요.',
                lane=1, grade='daily', owns=[file], outputs=['결과'],
                needs=[{'from': n, 'artifact': '결과'} for n in needs],
                checks=[dict(id='text', type='cmd', title='결과 파일에 내용이 있어요', run='test -s ' + file)])


def question():
    return dict(id='q', kind='decision', lane=1, title='배포 범위 확인', goal='배포할 범위를 확인해요.',
                question='이 안내를 시험 환경에 공개할까요?', decision_kind='authorization', outputs=['허가'],
                context={'why': '검토를 마친 안내를 시험 환경에서 확인하려고 해요.', 'undo': '공개한 안내는 다시 내릴 수 있어요.'})


def review(target='a', node='r'):
    return dict(id=node, kind='review', title={'html':'검색 화면 검토','guide':'배포 안내 검토','b':'예제 검토'}.get(target,'안내 검토'), goal='안내의 내용과 안전성을 검토해요.',
                target=target, lens='정확성 · 접근성 · 빠진 예외', lane=1, grade='daily')


class Fixture:
    def __init__(self, root, scenario):
        self.root = root / scenario
        self.root.mkdir()
        self.home = self.root / 'gf-home'
        self.project = self.root / 'project'
        self.project.mkdir()
        self.env = {k: v for k, v in os.environ.items() if not k.startswith('GF_')}
        self.env.update(GF_HOME=str(self.home), GF_NO_OPEN='1', GF_ROLE='leader', GF_SESSION='screens-r20',
                        GIT_AUTHOR_DATE='2026-11-17T00:00:00+0000', GIT_COMMITTER_DATE='2026-11-17T00:00:00+0000')
        self.commands = []
        self.git('init', '-q')
        self.git('-c', 'user.name=Screens', '-c', 'user.email=screens@example.invalid', 'commit', '--allow-empty', '-qm', '화면 재현 기준')
        self.run = self.project / '.graph-flow/runs' / scenario
        self.call('init', scenario, initial=True)
        self.raw = dict(schema_version=1, title='안내 만들기', goal='확인할 수 있는 안내와 사용 설명서를 만들어요.', nodes=[work()])
        self.decision = None
        self.approval = None
        self.activity_epoch = None
        self.history_epoch = None

    def git(self, *args, **kwargs):
        return subprocess.run(['git', '-C', str(self.project), *args], env=self.env, check=True, capture_output=True, **kwargs)

    def call(self, *args, code=0, initial=False):
        command = [sys.executable, '-I', '-S', '-B', str(SKILL / 'scripts/gf'), '--json', '--project', str(self.project)]
        if not initial:
            command += ['--run', str(self.run)]
        result = subprocess.run(command + list(args), cwd=self.project, env=self.env, capture_output=True, text=True)
        self.commands.append(dict(args=list(args), code=result.returncode))
        try:
            data = json.loads(result.stdout)
        except ValueError:
            raise AssertionError((args, result.stdout, result.stderr))
        assert result.returncode == code, (self.root.name, args, data, result.stderr)
        return data

    def post(self, approve=False):
        path = self.root / 'plan.json'
        write_json(path, self.raw)
        self.approval = self.call('plan', 'set', str(path))['decision']
        if approve:
            self.answer(self.approval)
        return self.approval

    def answer(self, decision, outcome='approved', text='내용과 결과를 확인했어요.'):
        # The same isolated human terminal and signing path used by the test suite.
        with mock.patch.dict(os.environ, self.env, clear=True):
            human_answer(self.run, decision, outcome, '내용과 결과를 확인했어요.' if outcome == 'approved' else text)

    def assign(self, node, reviewer=False):
        self.call('assign', node, '--executor', 'inline', '--model', '화면-검증', '--effort', 'high',
                  '--provider', 'fixture', '--family', 'openai' if reviewer else 'claude', '--isolation', 'shared')

    def submit(self, node='a', pass_gate=False):
        self.assign(node)
        self.call('start', node)
        entry = next(n for n in self.raw['nodes'] if n['id'] == node)
        for file in entry.get('owns', []):
            if file in ('own.ok','run.ok'):
                continue
            path = self.project / file
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('사용 안내\n\n1. 작업할 내용을 확인해요.\n2. 변경한 결과를 검사해요.\n3. 근거를 읽고 다음 단계를 결정해요.\n', encoding='utf-8')
        self.call('check', 'run', node, 'text')
        self.call('submit', node, '--notes', '안내 파일을 작성하고 명령 검사로 내용이 있는지 확인했어요.')
        if pass_gate:
            self.call('gate', node)

    def metadata(self):
        result = dict(scenario=self.root.name, project=str(self.project), run=self.run.name,
                      home=str(self.home), decision=self.decision, approval=self.approval,
                      plan=str(self.root / 'plan.json'), commands=self.commands)
        if self.activity_epoch:
            result['activity_epoch'] = self.activity_epoch
        if self.history_epoch:
            result['history_epoch'] = self.history_epoch
        write_json(self.root / 'fixture.json', result)
        return result


def branching(count):
    deps = [[], [0], [0], [1], [1], [1], [2], [2], [2], [6, 7], [3, 4], [8, 9, 10], [5, 11]]
    titles = ['자료 읽기', '요약 작성', '화면 구성', '검색 구현', '목록 구현', '사용 안내', '입력 검증', '오류 안내', '접근성 확인', '화면 통합', '기능 통합', '통합 검사', '배포 준비']
    return [work('n%d' % i, titles[i] if i < 13 else '후속 작업 %02d' % (i + 1),
                 ['n%d' % n for n in (deps[i] if i < 13 else [i - 1])]) for i in range(count)]


def activity_fixture(f, instrument=False):
    f.raw['nodes'] = [work('rich', '검색 화면 정리'), work('stalled', '배포 안내 확인'),
                      work('repeating', '검색 검사 수정'), work('blind', '예제 검토'), question()]
    if instrument:
        f.raw['title'] = '검색 안내와 배포 준비'
        f.raw['nodes'].insert(0, work('a', '요구 정리'))
        for node in ('rich', 'stalled', 'q'):
            nxt = next(row for row in f.raw['nodes'] if row['id'] == node)
            nxt['needs'] = [{'from': 'a', 'artifact': '결과'}]
        f.raw['nodes'].extend([
            review('release'), work('release', '안내 통합', ['rich', 'q']), work('broken', '예제 검사'),
        ])
        f.raw['nodes'][-2]['needs'][-1]['artifact'] = '허가'
    f.post(True)
    if instrument:
        f.submit('a', True)
        f.assign('broken')
        f.call('start', 'broken')
        f.call('submit', 'broken')
        f.call('gate', 'broken', code=1)
    f.call('start', 'rich')
    f.call('submit', 'rich')
    f.call('gate', 'rich', code=1)
    f.call('start', 'rich')
    for node in ('stalled', 'repeating', 'blind'):
        f.git('worktree', 'add', '--detach', '-q', str(f.root / node))
        f.call('assign', node, '--executor', 'subagent', '--model', '화면-검증', '--effort', 'high',
               '--provider', 'fixture', '--family', 'claude', '--isolation', 'worktree')
        f.call('start', node, '--cwd', str(f.root / node))
    f.call('check', 'run', 'blind', 'text', '--cwd', str(f.root / 'blind'), code=1)
    f.decision = f.call('gate', 'q', code=1)['asks'][0]
    now = datetime.now(timezone.utc)

    def stamp(value):
        return value.isoformat(timespec="milliseconds").replace("+00:00", "Z")

    f.activity_epoch = stamp(now)

    rows = []
    invocations = {}

    def series(node, tools, age, attempt=1, open_last=False):
        offset = invocations.get((node, attempt), 0)
        invocations[node, attempt] = offset + len(tools)
        cursor = now - timedelta(seconds=age)
        for index, (tool, gap, duration, failed) in enumerate(tools):
            cursor += timedelta(milliseconds=gap)
            end = cursor + timedelta(milliseconds=duration)
            observations = [('PreToolUse', cursor)]
            if not open_last or index != len(tools) - 1:
                observations.append(('PostToolUseFailure' if failed else 'PostToolUse', end))
            for event, at in observations:
                secret = 'sk-payload-secret-123456789'
                record = activity.observation(dict(hook_event_name=event, session_id='screens-' + node,
                    tool_name=tool, tool_use_id=f'{attempt}-{offset + index}', tool_input={'argument': secret},
                    tool_response={'content': secret}, transcript_path=secret, error=secret), stamp(at))
                record.update(node=node, attempt=attempt, via='cwd')
                if record['phase'] == 'end':
                    record['duration_ms'] = duration
                rows.append(record)
            cursor = end

    series('rich', [('Read', 0, 1100, False)], 485)
    series('rich', [('Read', 0, 900, False), ('Grep', 80, 500, False),
        ('Skill', 1300, 1700, False), ('mcp__catalog__search', 70, 1400, False),
        ('Agent', 80, 2400, False), ('mcp__graph-flow__check_run', 0, 800, True),
        ('Custom', 70, 500, False)], 10, attempt=2)
    series('stalled', [('mcp__catalog__search', 0, 1200, False)], 400)
    series('repeating', [('Bash', gap, 700, True) for gap in (0, 90, 90)], 3)
    if instrument:
        series('a', [('Skill', 0, 3100, False), ('Read', 70, 1900, False),
                     ('mcp__graph-flow__check_run', 0, 1400, False)], 425)
        series('rich', [('Agent', 0, 45000, False)], 1, attempt=2, open_last=True)
    events_path = f.run / 'events.jsonl'
    events = [json.loads(line) for line in events_path.read_text().splitlines()]
    for event in events:
        if event['type'] == 'node.start' and event['data']['node'] in ('a', 'rich', 'stalled', 'repeating'):
            age = 500 if event['data']['node'] == 'rich' and event['data']['attempt'] == 1 else 450
            event['ts'] = (now - timedelta(seconds=age)).strftime('%Y-%m-%dT%H:%M:%SZ')
        if instrument and event['type'] == 'decision.ask' and event['data'].get('node') == 'q':
            event['ts'] = (now - timedelta(minutes=6, seconds=15)).strftime('%Y-%m-%dT%H:%M:%SZ')
    events_path.write_text(''.join(json.dumps(event) + '\n' for event in events))
    (f.run / 'activity.jsonl').write_bytes(b''.join(activity._encode(row) for row in sorted(rows, key=lambda row: row['ts'])))


def spacetime_fixture(f, long_gap, short, english):
    q = question()
    q['needs'] = [{'from': 'api', 'artifact': '결과'}]
    integration = work('release', '통합', ['api', 'screen', 'q'])
    integration['needs'][-1]['artifact'] = '허가'
    r = review('api')
    r['title'] = 'API 검토'
    f.raw.update(title='검색 API와 배포 안내', nodes=[
        work('a', '요구 정리'), work('api', '검색 API', ['a']), work('screen', '화면 구성', ['a']),
        r, q, work('guide', '안내 문서', ['screen']), integration,
    ])
    if english:
        f.raw.update(title='Search API and release notes', goal='Prepare the search API and release notes.')
        titles = ('Gather requirements', 'Search API', 'Search interface', 'API review',
                  'Release scope', 'Release notes', 'Integration')
        artifacts = {'결과': 'Result', '허가': 'Approval'}
        for node, title in zip(f.raw['nodes'], titles):
            node.update(title=title, goal=title + ' for the test release.')
            if 'outputs' in node:
                node['outputs'] = [artifacts[name] for name in node['outputs']]
            for need in node.get('needs', []):
                need['artifact'] = artifacts[need['artifact']]
            for check in node.get('checks', []):
                check['title'] = 'The result file has content'
        r['lens'] = 'Accuracy, accessibility and missing cases'
        q['question'] = 'Publish the guide to the test environment?'
        q['context'] = {'why': 'Check the reviewed guide in the test environment.',
                        'undo': 'The guide can be taken down.'}
    own = f.raw['nodes'][1]
    fix = 'Handle empty results' if english else '빈 결과 처리'
    own['checks'][0]['run'] = 'grep -q "' + fix + '" api.txt'
    f.post(True)
    f.submit('a', True)
    f.submit('screen', True)
    own_path = f.project / own['owns'][0]
    f.assign('api')
    f.assign('r', True)
    findings = f.root / 'findings.json'
    for attempt in (1, 2):
        f.call('start', 'api')
        content = 'Search results' if english else '검색 결과'
        own_path.write_text(content + ('\n' + fix if attempt == 2 else '') + '\n', encoding='utf-8')
        f.call('check', 'run', 'api', 'text', code=1 if attempt == 1 else 0)
        f.call('submit', 'api')
        f.call('start', 'r')
        write_json(findings, [dict(severity='high', file='api.txt', line=1,
            text='검색어가 비어 있을 때의 응답을 확인해야 해요.')] if attempt == 1 else [])
        f.call('--role', 'reviewer', '--node', 'r', 'review', 'submit', 'r',
               '--verdict', 'fail' if attempt == 1 else 'pass', '--findings', str(findings))
        f.call('gate', 'r')
        f.call('gate', 'api', code=1 if attempt == 1 else 0)
    f.call('start', 'guide')
    f.decision = f.call('gate', 'q', code=1)['asks'][0]

    # Spread real CLI boundaries and ordinary hook observations across a readable axis.
    ledger = f.run / 'events.jsonl'
    events = [json.loads(line) for line in ledger.read_text().splitlines()]
    boundaries = {
        ('a', 'node.start', 1): 2, ('a', 'node.submit', 1): 9, ('a', 'gate.verdict', 1): 9,
        ('screen', 'node.start', 1): 10, ('screen', 'node.submit', 1): 24, ('screen', 'gate.verdict', 1): 25,
        ('api', 'node.start', 1): 25, ('api', 'node.submit', 1): 33, ('api', 'gate.verdict', 1): 41,
        ('api', 'node.start', 2): 44, ('api', 'node.submit', 2): 69, ('api', 'gate.verdict', 2): 79,
        ('guide', 'node.start', 1): 83, ('q', 'decision.ask', None): 84,
    }
    review_starts = iter((35, 71))
    review_submits = iter((39, 76))
    review_verdicts = iter((40, 77))
    gap = timedelta(days=3) if long_gap else timedelta(0)
    now = datetime.now(timezone.utc).replace(microsecond=0)
    minute_size = 60 / 9 if short else 60
    floor = now - timedelta(seconds=90 * minute_size) - gap

    def stamp(value, precision='seconds'):
        return value.isoformat(timespec=precision).replace('+00:00', 'Z')
    minute = 0
    for event in events:
        kind, data = event['type'], event['data']
        node = data.get('node')
        key = (node, kind, data.get('attempt'))
        if node == 'r' and kind in ('node.start', 'review.submit', 'gate.verdict'):
            minute = next({'node.start':review_starts,'review.submit':review_submits,'gate.verdict':review_verdicts}[kind])
        elif kind == 'check.result' and data.get('phase') == 'loop':
            minute = boundaries.get((node,'node.submit',data.get('attempt')), minute) - 1
        elif key in boundaries:
            minute = boundaries[key]
        at = floor + timedelta(seconds=minute * minute_size) + (gap if minute >= 84 else timedelta(0))
        event['ts'] = stamp(at)
    ledger.write_text(''.join(json.dumps(event) + '\n' for event in events))
    calls = {
        ('a',1): [('Skill',2,4), ('Read',4,7), ('Bash',7,8)],
        ('screen',1): [('Read',10,16), ('Skill',16,21), ('mcp__figma__inspect',21,23)],
        ('api',1): [('Read',25,29), ('Bash',29,32)],
        ('api',2): [('Read',44,51), ('mcp__catalog__search',54,57), ('Bash',58,64), ('Skill',64,68)],
        ('guide',1): [('Read',83,83.6)],
        ('r',1): [('Read',35,38), ('Bash',71,75)],
    }
    if short:
        # Each call projects below a line; together they occupy a readable part of the pillar.
        calls['api', 2][0:1] = [('Read', 44 + i * .55, 44 + (i + 1) * .55) for i in range(12)]
    rows = []
    for (node, attempt), entries in calls.items():
        for i, (tool, start, end) in enumerate(entries):
            for kind, at in [('PreToolUse', start), ('PostToolUse', end)]:
                row = activity.observation(dict(hook_event_name=kind,session_id='screens-'+node,tool_name=tool,
                    tool_use_id='%s-%s' % (attempt,i)), stamp(floor+timedelta(seconds=at * minute_size), 'milliseconds' if short else 'seconds'))
                row.update(node=node,attempt=attempt,via='session')
                if short and node == 'api' and attempt == 2 and i < 12 and kind == 'PostToolUse':
                    row['duration_ms'] = 3650 + i
                rows.append(row)
    (f.run / 'activity.jsonl').write_bytes(b''.join(activity._encode(row) for row in sorted(rows,key=lambda row:row['ts'])))
    f.history_epoch = stamp(now)


def build(root, scenario):
    f = Fixture(root, scenario)
    if scenario.startswith('graph-spacetime'):
        spacetime_fixture(f, long_gap=scenario.endswith('-long'), short='-short' in scenario,
                          english=scenario.endswith('-en'))
        return f.metadata()
    if scenario == 'graph-flow-states':
        f.raw['nodes'] = [work('a', '초안 준비'), work('done', '초안 반영', ['a']),
                          work('next', '배포 준비', ['a']), work('broken', '예제 검사'),
                          work('retry', '예제 정리', ['broken']), question(),
                          work('release', '안내 공개', ['q']), work('late', '사용 기록 정리', ['release']),
                          work('waiting', '추가 자료 수집'), work('use', '추가 자료 정리', ['waiting'])]
        f.raw['nodes'][6]['needs'][0]['artifact'] = '허가'
        f.post(True)
        f.submit('a', True)
        f.submit('done', True)
        f.assign('broken')
        f.call('start', 'broken')
        f.call('submit', 'broken')
        f.call('gate', 'broken', code=1)
        f.decision = f.call('gate', 'q', code=1)['asks'][0]
        return f.metadata()
    if scenario in ('graph-activity', 'graph-activity-unreadable', 'graph-instrument'):
        activity_fixture(f, instrument=scenario == 'graph-instrument')
        if scenario == 'graph-activity-unreadable':
            (f.run / 'activity.jsonl').write_text('invalid complete line\n')
        return f.metadata()
    if scenario == 'graph-empty':
        return f.metadata()
    if scenario in ('graph-chain-60', 'graph-dense'):
        if scenario == 'graph-chain-60':
            nodes = [work(f'n{i}', f'안내 단계 {i+1}', [f'n{i-1}'] if i else []) for i in range(60)]
        else:
            layers = [('a', 'b', 'c'), ('d', 'e', 'f'), ('g', 'h', 'i')]
            nodes = [work(node, f'안내 {node.upper()}', list(layers[i-1]) if i else [])
                     for i, layer in enumerate(layers) for node in layer]
        f.raw['nodes'] = nodes
        f.post(True)
        return f.metadata()
    if scenario == 'graph-wrap':
        steps = [work(f's{i}', f'단계 {i}', [f's{i-1}'] if i else []) for i in range(9)]
        f.raw['nodes'] = list(reversed(steps))
        f.post(True)
        return f.metadata()
    if scenario == 'graph-verification':
        f.raw['nodes'] = [work('a', '예제 확인'), work('b', '복구 안내'), work('c', '복구 안내'),
                          work('d', '안내 고치기'), work('p', '자료 정리'), question(),
                          work('t', '안내 편집', ['b', 'p', 'q']), review('t')]
        _, b, _, d, _, _, _, reviewer = f.raw['nodes']
        for node in (b, d):
            node['checks'].append(dict(id='example', type='cmd', title='예제 파일을 확인할 수 있어요',
                                       run='test -s missing-example.txt'))
        f.raw['nodes'][-2]['needs'][-1]['artifact'] = '허가'
        reviewer['needs'] = [dict(**{'from': 't'}, artifact='결과', label='편집한 안내')]
        f.raw['integration_checks'] = [dict(id='all', type='cmd', title='전체 안내를 열 수 있어요',
                                            run='test -s missing-final.txt', requires_passed=['t'])]
        f.post(True)
        f.decision = f.call('decide', 'ask', '--kind', 'information', '--question', '이 예제를 따라갈 수 있을까요?', '--node', 'a')['id']
        for node in ('b', 'd'):
            f.submit(node)
            f.call('gate', node, code=1)
        f.submit('p', True)
        f.call('start', 'd')
        f.call('decide', 'ask', '--kind', 'information', '--question', '정리한 자료를 누가 읽을까요?', '--node', 'p')
        f.call('gate', 'q', code=1)
        assert f.call('gate', '--final', code=1)['result'] == 'failed'
        # Exercise the reader of historical events with an unrecognized actor role.
        with mock.patch.dict(os.environ, f.env, clear=True):
            Review11Tests.rewrite(f, lambda events: next(e for e in events
                if e['type'] == 'gate.verdict' and e['data']['node'] == 'b')['actor'].update(role='historical'))
        return f.metadata()
    if scenario == 'check-lines':
        f.raw['nodes'][0]['checks'] += [
            dict(id='restore', type='cmd', title='문제가 생기면 되돌리는 순서가 있어요', run='test -f restore.txt'),
            dict(id='readable', type='cmd', title='처음 읽는 사람도 순서를 따라갈 수 있어요', run='test -r guide.txt'),
            dict(id='example', type='cmd', title='따라 할 예제가 있어요', run='test -s example.txt')]
        f.post(True)
        f.call('start','a')
        (f.project/'guide.txt').write_text('안내를 작성했어요.\n')
        f.call('check','run','a','text')
        f.call('check','run','a','restore',code=1)
        return f.metadata()
    if scenario == 'notices':
        f.raw['nodes'] += [review(), work('b', '안내 묶음 만들기', ['a'])]
        f.raw['nodes'][0]['lane'] = 2
        f.raw['nodes'][0]['checks'].append(dict(id='empty', type='cmd', title='빈 안내는 통과하지 않아요', run='test ! -e guide.txt'))
        f.raw['integration_checks'] = [dict(id='all', type='cmd', title='전체 안내 묶음이 준비됐어요', run='test -s b.txt')]
        f.post(True)
        f.call('start','a');f.call('red','a','empty')
        f.raw['nodes'].append(work('c','그림 설명 쓰기'))
        f.decision=f.post()
        return f.metadata()
    if scenario in ('trajectory', 'lane3'):
        f.raw['nodes'] += [review(), work('b', '안내 전달', ['a'])]
        f.raw['nodes'][0]['lane'] = 2 if scenario == 'trajectory' else 3
        if scenario == 'trajectory':
            f.raw['nodes'][0]['owns'] += ['own.ok', 'run.ok']
            f.raw['nodes'][0]['checks'].append(dict(id='own', type='cmd', title='안내에 복구 순서가 있어요', run='test -f own.ok'))
            f.raw['integration_checks'] = [dict(id='all', type='cmd', title='전체 안내 묶음이 준비됐어요', run='test -f run.ok')]
        f.post(True)
        for attempt in range(1, 4 if scenario == 'trajectory' else 2):
            if attempt == 2:
                (f.project / 'run.ok').write_text('ready')
            if attempt in (1, 3):
                (f.project / 'own.ok').write_text('ready')
            elif attempt == 2:
                (f.project / 'own.ok').unlink()
            f.submit()
            f.assign('r', True)
            f.call('start', 'r')
            findings = f.root / ('findings-%s.json' % attempt)
            write_json(findings, [dict(severity='high', file='guide.txt', line=2,
                text='실패했을 때 되돌리는 순서가 빠져 있어요.', evidence='2번째 줄 뒤에 복구 안내가 없어요.')] if attempt == 1 and scenario == 'trajectory' else [])
            f.call('--role', 'reviewer', '--node', 'r', 'review', 'submit', 'r', '--verdict', 'fail' if attempt == 1 and scenario == 'trajectory' else 'pass', '--findings', str(findings))
            f.call('gate', 'r')
            outcome = f.call('gate', 'a', code=1)
            if outcome.get('asks'):
                f.decision = outcome['asks'][0]
        return f.metadata()
    if scenario == 'reapproval':
        f.post(True)
        f.raw['nodes'].append(work('b', '예제 작성', ['a']))
        f.raw['nodes'][0]['checks'][0]['run'] = 'test -s guide.txt && test -r guide.txt'
        f.decision = f.post()
        return f.metadata()
    if scenario == 'decision-review':
        f.raw['nodes'] = [question(), work()]
        f.raw['nodes'][0].update(title='공개 안내 확인', question='이 공개 안내를 받아들일까요?', decision_kind='review')
        f.raw['nodes'][1]['needs'] = [{'from': 'q', 'artifact': '허가'}]
        f.post(True)
        f.decision = f.call('gate', 'q', code=1)['asks'][0]
        return f.metadata()
    if scenario == 'hold-check':
        f.raw['nodes'][0]['checks'].append(dict(id='visual', type='host', tool='browser', expect='문장이 잘리지 않아요', title='작은 화면에서 안내가 읽혀요'))
        f.post(True)
        f.assign('a')
        f.call('start','a')
        (f.project/'guide.txt').write_text('안내 내용\n')
        # Host observations are grade 2 and produce the existing hold decision.
        f.call('check', 'record', 'a', 'visual', '--result', 'failed', '--note', '작은 화면에서 안내 문장이 잘려요.')
        f.call('submit','a')
        f.decision = f.call('gate', 'a', code=1)['asks'][0]
        return f.metadata()
    if scenario == 'reasked':
        f.raw['nodes'][0]['checks'].append(dict(id='human',type='human',prompt='이 안내를 사용자가 따라갈 수 있을까요?'))
        f.post(True)
        f.submit()
        f.decision=f.call('gate','a',code=1)['asks'][0]
        (f.project / 'guide.txt').write_text('사용 안내를 고쳤어요.\n실패하면 이전 설정으로 되돌려요.\n')
        f.decision=f.call('gate','a',code=1)['asks'][0]
        return f.metadata()
    if scenario == 'long-text':
        f.raw['nodes'] = [work(), work('b', needs=['a']), review('b'), question()]
        for i, node in enumerate(f.raw['nodes']):
            node['title'] = (str(i + 1) + ' 사용자가 읽는 긴 한국어 작업 제목을 줄바꿈하여 모두 보여 주는지 확인해요 ' * 3)[:60]
            node['summary'] = ('작업의 목적과 만드는 결과를 처음 읽는 사람도 이해할 수 있도록 한국어로 설명하고 빠진 내용을 확인해요. ' * 7)[:300]
            node['goal'] = 'Keep this English goal below the Korean summary.'
            for check in node.get('checks', []):
                check['title'] = ('결과 파일에 내용이 있는지와 사용자가 따라 할 수 있는 설명과 복구 순서가 모두 있는지 검사해요 ' * 4)[:120]
        f.post()
        return f.metadata()
    if scenario.startswith('old'):
        legacy = json.loads((SKILL / 'tests/fixtures/legacy021.json').read_text().replace('Read this guide', '안내를 읽고 확인해 주세요'))
        # Localize the unsigned historical fixture consistently with its stored plan bytes.
        history = [json.loads(line) for line in legacy['files']['events.jsonl'].splitlines()]
        for event in history:
            if event['type'] == 'plan.set':
                plan_bytes = legacy['files']['plans/%04d.json' % event['data']['revision']].encode()
                event['data']['plan_sha256'] = hashlib.sha256(plan_bytes).hexdigest()
        legacy['files']['events.jsonl'] = ''.join(json.dumps(e, ensure_ascii=False) + '\n' for e in history)
        shutil.rmtree(f.run)  # Only our just-created empty run is replaced by the preserved historical fixture.
        f.run.mkdir()
        for relative, text in legacy['files'].items():
            path = f.run / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding='utf-8')
        f.git('hash-object', '-t', 'commit', '-w', '--stdin', input=legacy['git_base_commit'].encode())
        (f.project / 'guide.txt').write_text('이전 버전에서 제출한 안내예요.\n', encoding='utf-8')
        f.raw = legacy['raw_plan']
        f.call('status')
        if scenario != 'old':
            f.post(approve=scenario == 'old-reasked')
        if scenario == 'old-reasked':
            f.decision = f.call('gate', 'a', code=1)['asks'][0]
        return f.metadata()
    if scenario in ('many', 'large-plan', 'large-run', 'thirty-plan', 'thirty-run'):
        f.raw.update(title='안내 서비스 만들기', nodes=branching(30 if scenario.startswith('thirty') else 13))
        f.post(approve=scenario in ('many', 'large-run', 'thirty-run'))
        if scenario in ('many', 'large-run', 'thirty-run'):
            f.submit('n0', True)
            f.submit('n1', True)
            if scenario == 'large-run':
                f.submit('n2', True)
                f.call('start', 'n3')
            else:
                f.call('start', 'n2')
        return f.metadata()
    if scenario == 'real':
        f.raw.update(title='검색 기능 개선', nodes=[work('reader', '기록 읽기'), work('summary', '검색 결과 정리', ['reader']),
            work('html', '검색 화면 구현', ['reader']), review('html', 'html-review'), work('guide', '배포 안내 작성', ['summary', 'html']), review('guide', 'guide-review')])
        f.raw['nodes'][2]['lane'] = 2
        f.raw['nodes'][4]['lane'] = 3
        f.post(True)
        f.submit('reader', True)
        f.submit('summary', True)
        f.submit('html')
        f.call('gate', 'html', code=1)
        f.call('start', 'html-review')
        return f.metadata()
    if scenario == 'demo':
        f.raw.update(title='사용 안내 개선', nodes=[work(), work('b', '예제 작성', ['a']), work('c', '설명 확인', ['a']),
            work('d', '화면 정리', ['b']), work('e', '최종 확인', ['c', 'd']), work('f', '안내 전달', ['e'])])
        f.raw['nodes'][1]['checks'].append(dict(id='human', type='human', prompt='예제의 순서와 설명이 충분한가요?'))
        f.post(True)
        f.submit('a', True)
        f.submit('c', True)
        f.submit('b')
        f.decision = f.call('gate', 'b', code=1)['asks'][0]
        f.call('decide', 'ask', '--kind', 'information', '--question', '처음 사용하는 분을 위한 예제를 더 넣을까요?')
        return f.metadata()
    if scenario in ('plan', 'sent-back', 'changed-live', 'constraints', 'check-options', 'own-files', 'wording'):
        f.raw['nodes'][0]['checks'].append(dict(id='human', type='human', title='안내 확인', prompt='안내의 순서를 확인해 주시겠어요?'))
        f.raw['nodes'] += [question(), work('b', '예제 작성', ['a']), review('b')]
        if scenario == 'constraints':
            planned = f.raw
            f.raw = dict(schema_version=1, title='지침 확인', goal='안내 작성에서 배운 지침을 남겨요.', nodes=[work()])
            f.post(True)
            f.submit('a', True)
            f.raw = planned
            f.raw['nodes'][0] = work()
            item = f.call('learn', 'add', '--from', 'a', '--text', '안내에는 실행 순서와 되돌리는 방법을 적어요.', '--review-when', '배포 방식이 바뀔 때')
            f.call('learn', 'promote', item['id'], '--run', 'test -s guide.txt')
            f.call('learn', 'add', '--from', 'a', '--text', '새 오류 메시지는 한국어로 작성해요.', '--review-when', '언어가 바뀔 때')
            f.raw['integration_checks'] = [dict(id='all', type='cmd', title='전체 안내를 검사해요', run='test -s guide.txt')]
        if scenario == 'check-options':
            (f.project / 'docs').mkdir()
            f.raw['nodes'][0]['owns'] = ['docs/guide.txt']
            f.raw['nodes'][0]['checks'][0].update(cwd='docs', timeout_s=12)
        if scenario == 'own-files':
            f.raw['nodes'][0]['owns'].append('check.sh')
            f.raw['nodes'][0]['checks'][0].update(run='bash check.sh', title='직접 작성한 검사 스크립트를 실행해요')
        if scenario == 'wording':
            f.raw['nodes'][0]['checks'][-1].pop('prompt')
        f.post(approve=scenario == 'wording')
        if scenario == 'sent-back':
            f.answer(f.approval, 'revision_requested', '설치 순서와 실패했을 때 되돌리는 방법을 추가해 주세요.')
        if scenario == 'changed-live':
            revised = json.loads(json.dumps(f.raw))
            revised['nodes'][0]['checks'][0]['run'] = 'test -s guide.txt && test -r guide.txt'
            revised['nodes'].append(work('extra', '복구 안내 작성', ['b']))
            write_json(f.root / 'changed-plan.json', revised)
        if scenario == 'wording':
            f.raw['nodes'][0]['checks'][-1]['title'] = '처음 사용하는 분도 안내 순서를 따라갈 수 있나요?'
            f.raw['nodes'][1]['context']['why'] = '공개 범위를 먼저 확인하고 안내를 전달해요.'
            f.post()
        return f.metadata()
    if scenario in ('nothing', 'outcomes', 'answered', 'revised'):
        f.raw['nodes'] = [question(), work()]
        f.raw['nodes'][1]['needs'] = [{'from': 'q', 'artifact': '허가'}]
        if scenario == 'nothing':
            f.raw['nodes'][0].pop('context')
        f.post(True)
        f.decision = f.call('gate', 'q', code=1)['asks'][0]
        if scenario == 'answered':
            f.answer(f.decision)
            f.call('gate', 'q')
            f.call('start', 'a')
        if scenario == 'revised':
            f.answer(f.decision, 'rejected', '전체 공개 전에 시험 환경에서 먼저 확인해 주세요.')
            f.call('gate', 'q', code=1)
            f.raw['nodes'][0]['question'] = '전체 공개 대신 내부 시험 환경에만 안내를 공개할까요?'
            f.post(True)
            f.decision = f.call('gate', 'q', code=1)['asks'][0]
        return f.metadata()
    if scenario in ('hold', 'review-awaited'):
        f.raw['nodes'].append(review())
        f.post(True)
        f.submit()
        if scenario == 'hold':
            f.assign('r', True)
            f.call('start', 'r')
            findings = f.root / 'findings.json'
            write_json(findings, [dict(file='guide.txt', line=2, text='실패했을 때 되돌리는 절차가 빠져 있어요.')])
            f.call('--role', 'reviewer', '--node', 'r', 'review', 'submit', 'r', '--verdict', 'fail', '--findings', str(findings))
            f.call('gate', 'r')
            f.decision = f.call('gate', 'a', code=1)['asks'][0]
        else:
            f.call('gate', 'a', code=1)
        return f.metadata()
    if scenario == 'free':
        f.post(True)
        f.call('start', 'a')
        f.decision = f.call('decide', 'ask', '--kind', 'information', '--question', '안내를 누가 읽도록 쓸까요?', '--node', 'a', '--option', '처음 쓰는 사람', '--option', '이미 써 본 사람')['id']
        return f.metadata()
    if scenario in ('files', 'superseded', 'file-changed-live'):
        f.raw['nodes'][0]['checks'].append(dict(id='human', type='human', prompt='이 안내를 사용자가 따라갈 수 있을까요?', context={'why': '설명의 흐름은 사람이 읽고 확인해요.'}))
        f.post(True)
        f.submit()
        f.decision = f.call('gate', 'a', code=1)['asks'][0]
        if scenario == 'superseded':
            f.raw['nodes'][0]['checks'][-1]['context']['why'] = '수정한 안내를 공개하기 전에 설명을 확인해요.'
            f.post()
            f.call('gate', 'a', code=1)
        return f.metadata()
    f.post(True)
    if scenario in ('tampered', 'replaced'):
        # The exact damaged-plan operation used by IntegrityReadTests in test_round16.py.
        (f.run / 'plans/0001.json').write_text('{invalid', encoding='utf-8')
        if scenario == 'replaced':
            f.post()
    elif scenario == 'unverified':
        # Reuse the suite's tampering helper; do not fabricate an agent-role answer.
        with mock.patch.dict(os.environ, f.env, clear=True):
            Review11Tests.rewrite(f, lambda events: next(e['data'] for e in events if e['type'] == 'decision.answer').update(sig='tampered-signature'))
    elif scenario in ('key-mismatch', 'key-repinned', 'key-recovery-live'):
        f.raw['goal'] += ' 복구 절차도 함께 확인해요.'
        f.post()
        (f.home / 'human.key').write_bytes(b'rotated')
        if scenario == 'key-repinned':
            # Same terminal simulation as Review9Tests.test_n4; never an agent-role answer.
            with mock.patch.dict(os.environ, dict(f.env, GF_HUMAN_TERMINAL='1'), clear=True), mock.patch('sys.stdin.isatty', return_value=True), contextlib.redirect_stdout(io.StringIO()):
                assert cli.main(['--json', '--run', str(f.run), '--role', 'human', 'key', 'repin']) == 0
    elif scenario == 'moved':
        moved = f.root / 'moved-project'
        f.project.rename(moved)
        f.project = moved
        f.run = moved / '.graph-flow/runs' / scenario
        f.call('status')
    else:
        raise AssertionError(scenario)
    return f.metadata()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path, help='durable output directory; creates fixtures/ beneath it')
    args = parser.parse_args()
    root = args.output.resolve() / 'fixtures'
    if str(root).startswith(('/tmp/', '/private/tmp/')) or root == Path.home() / '.graph-flow':
        parser.error('use a durable isolated output directory')
    marker = root / '.screens-fixtures'
    if root.exists():
        if not marker.is_file():
            parser.error('refusing to replace an unmarked fixture directory')
        shutil.rmtree(root)
    root.mkdir(parents=True)
    marker.write_text('Owned by graph-flow dev/screens/build_fixtures.py\n')
    entries = {}
    for scenario in SCENARIOS:
        print('Building ' + scenario, flush=True)
        entries[scenario] = build(root, scenario)
    write_json(root / 'index.json', entries)
    print('Built %d scenarios in %s' % (len(entries), root))


if __name__ == '__main__':
    main()
