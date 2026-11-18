"""The activity ledger's capture, ownership and display contracts (A1–A4, A6, A10)."""
import contextlib
import errno
import http.client
import io
import json
import os
import pathlib
import random
import shlex
import subprocess
import sys
import tempfile
import threading
import unittest
from datetime import datetime, timezone
from unittest import mock
from urllib.parse import urlencode

SCRIPTS = pathlib.Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS))
from graphflow import activity, checks, cli, mcp, server, store
from human_support import approve_plan

PLUGIN = SCRIPTS.parents[2]
EPOCH = 1_794_900_000_000


def stamp(offset):
    return datetime.fromtimestamp((EPOCH + offset) / 1000, timezone.utc).isoformat(
        timespec="milliseconds").replace("+00:00", "Z")


def payload(event, cwd, tool="Read", key="call-1", **fields):
    return dict(hook_event_name=event, cwd=str(cwd), session_id="session-1",
                tool_name=tool, tool_use_id=key, **fields)


def observed(event, offset, tool, key, **fields):
    row = activity.observation(payload(event, "/", tool, key, **fields), stamp(offset))
    return dict(row, node="a", attempt=1, via="session")


class ActivityTests(unittest.TestCase):
    def test_a2_attribution_priority_and_ties(self):
        a = dict(attempt=1, cwd="/alpha", session="claude:agent-a")
        b = dict(attempt=2, cwd="/beta", session="session-b")
        cases = [
            ({"a": a, "b": b}, "agent-a", "/beta", ("a", 1, "session")),
            ({"a": a, "b": b}, "session-b", "/alpha", ("b", 2, "session")),
            ({"a": a, "b": b}, "unknown", "/beta", ("b", 2, "cwd")),
            ({"a": a}, None, "/elsewhere", ("a", 1, "single")),
            ({}, "agent-a", "/alpha", (None, None, "unattributed")),
            ({"a": a, "b": b}, "unknown", "/elsewhere", (None, None, "unattributed")),
            ({"a": a, "b": {**b, "session": a["session"]}}, "agent-a", "/alpha", (None, None, "unattributed")),
            ({"a": a, "b": {**b, "cwd": a["cwd"]}}, None, "/alpha", (None, None, "unattributed")),
        ]
        for running, identity, cwd, expected in cases:
            with self.subTest(running=running, identity=identity, cwd=cwd):
                self.assertEqual(activity.attribution(running, identity, pathlib.Path(cwd)), expected)

    def test_categories(self):
        for name, fields, expected in [
            ("Grep", {}, ("tool", None)), ("Skill", {}, ("skill", None)),
            ("mcp__files__lookup", {}, ("mcp", "files")),
            ("mcp__t3_code__delegate_task", {}, ("session", None)),
            ("Agent", {}, ("session", None)),
            ("mcp__graph-flow__node_start", {}, ("gf", None)),
            ("Bash", {"tool_input": {"command": "GF_ROLE=leader python3 -I -S -B '/plugins/scripts/gf' ready"}}, ("gf", None)),
            ("Unknown", {}, ("other", None)),
        ]:
            with self.subTest(name=name):
                row = observed("PreToolUse", 0, name, "test", **fields)
                self.assertEqual((row["category"], row.get("server")), expected)
        mcp_row = observed("PostToolUse", 0, "mcp__alias__lookup", "test",
                           mcp_server={"name": "actual", "source": "plugin"}, duration_ms=321)
        self.assertEqual((mcp_row["server"], mcp_row["duration_ms"]), ("actual", 321))
        start = observed("SubagentStart", 0, "", "", agent_id="worker-2", agent_type="review")
        stop = observed("SubagentStop", 1, "", "", agent_id="worker-2", last_assistant_message="private")
        self.assertEqual(start["call"], stop["call"])
        self.assertEqual((start["tool"], start["category"], start["agent"]), ("Subagent", "session", "worker-2"))

    def test_a4_generated_and_fixture_condensation(self):
        rng = random.Random(187)
        for count in (1, 10, 35, 180):
            rows, durations, gaps = [], [], []
            offset = 0
            for index in range(count):
                gap, duration = rng.choice((50, 1100, 2500)), rng.randrange(40, 900)
                if index:
                    offset += gap
                    if gap >= activity.GAP_MS:
                        gaps.append(gap)
                tool = rng.choice(("Read", "Grep", "Skill", "mcp__db__read", "SendMessage", "mcp__graph-flow__node_start", "Example"))
                durations.append(duration)
                rows.extend((observed("PreToolUse", offset, tool, str(index)),
                             observed("PostToolUse", offset + duration, tool, str(index))))
                offset += duration
            out = activity.condense(rows, [], EPOCH + offset)
            self.assertEqual(out, activity.condense(list(reversed(rows)), [], EPOCH + offset))
            phases = out["phases"]
            self.assertLessEqual(len(phases), activity.PHASE_LIMIT)
            self.assertEqual(sum(p["count"] for p in phases), count)
            self.assertEqual(sum(p["duration_ms"] for p in phases), sum(durations + gaps))
            self.assertEqual(sorted(p["start_ms"] for p in phases), [p["start_ms"] for p in phases])
            with mock.patch.object(activity, "PHASE_LIMIT", 1000):
                uncapped = activity.condense(rows, [], EPOCH + offset)["phases"]
            self.assertEqual(sum(p["steps"] for p in phases), len(uncapped))
            self.assertEqual(any(p["label"] == "more" for p in phases), len(uncapped) > activity.PHASE_LIMIT)

    def test_cap_uses_the_shortest_adjacent_pair_and_first_tie(self):
        phases = [activity._phase("tool", i, duration, count=1) for i, duration in enumerate((6, 2, 2, 2, 6))]
        with mock.patch.object(activity, "PHASE_LIMIT", 3):
            result = activity._cap(phases)
        self.assertEqual([(p["start_ms"], p["duration_ms"], p["count"], p["steps"]) for p in result],
                         [(0, 6, 1, 1), (1, 6, 3, 3), (4, 6, 1, 1)])

    def test_a6_only_bounded_gaps_and_repeating_and_stalled(self):
        rows = [observed("PreToolUse", 0, "Bash", "1"),
                observed("PostToolUseFailure", 600, "Bash", "1"),
                observed("PreToolUse", 2400, "Bash", "2"),
                observed("PostToolUseFailure", 3000, "Bash", "2"),
                observed("PreToolUse", 3100, "Bash", "3"),
                observed("PostToolUseFailure", 3500, "Bash", "3")]
        out = activity.condense(rows, [], EPOCH + 3500 + activity.STALL_MS, running=True)
        phases = out["phases"]
        self.assertEqual([(p["category"], p["inferred"], p["duration_ms"], p["count"]) for p in phases],
                         [("tool", False, 600, 1), ("thinking", True, 1800, 0), ("tool", False, 1000, 2)])
        self.assertTrue(out["stalled"])
        self.assertTrue(out["repeating"])
        self.assertTrue(phases[-1]["stalled"])
        self.assertTrue(phases[-1]["repeating"])
        self.assertFalse(any(p["inferred"] for p in activity.condense(rows[1::2][:1], [], EPOCH + 5000)["phases"]))
        bounded = activity.condense(rows[:3], [], EPOCH + 9000, running=True)
        self.assertEqual((bounded["latest"], bounded["cue"]), ("tool", "thinking"))
        end_only = activity.condense(rows[:2] + [rows[3]], [], EPOCH + 5000)
        self.assertFalse(any(p["inferred"] for p in end_only["phases"]))
        pending = [rows[0], *rows[2:]]
        self.assertFalse(any(p["inferred"] for p in activity.condense(pending, [], EPOCH + 5000)["phases"]))

    def test_a10_boundary_only_and_unreadable(self):
        boundaries = [dict(type="node.start", ts=stamp(0), data={})]
        boundaries += [dict(type="check.result", ts=stamp(i * 1000),
                            data=dict(result="failed", check="test", duration_ms=100)) for i in (1, 2, 3)]
        boundaries += [dict(type="node.submit", ts=stamp(4000), data={})]
        out = activity.condense([], boundaries, EPOCH + 5000)
        self.assertEqual(out["status"], "unobserved")
        self.assertIsNone(out["latest"])
        self.assertTrue(out["repeating"])
        self.assertEqual([(p["label"], p["count"], p["duration_ms"], p["errors"], p["inferred"])
                          for p in out["phases"]],
                         [("start", 0, 0, 0, False), ("check", 3, 300, 3, False), ("submit", 0, 0, 0, False)])
        self.assertEqual(activity.condense([], boundaries, EPOCH, unreadable=True)["status"], "unreadable")

    def test_older_boundary_without_a_timestamp_has_no_implied_time(self):
        node = {"status": "running", "attempts": 1}
        events = [{"type": "node.start", "data": {"node": "a"}}]
        out = activity.summaries({"status": "ok", "records": []}, events, {"a": node}, EPOCH)["a"][0]
        self.assertEqual(out["attempt"], 1)
        self.assertEqual(out["phases"][0]["label"], "start")
        self.assertIsNone(out["phases"][0]["start_ms"])
        self.assertFalse(out["stalled"])


class CaptureTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = pathlib.Path(directory.name).resolve()
        env = mock.patch.dict(os.environ, dict(GF_HOME=str(self.root / "home"), GF_NO_OPEN="1", GF_SESSION="claude:session-1"))
        env.start()
        self.addCleanup(env.stop)
        subprocess.run(["git", "init", "-q", str(self.root)], check=True)
        subprocess.run(["git", "-C", str(self.root), "-c", "user.name=Fixture", "-c",
                        "user.email=fixture@example.invalid", "commit", "--allow-empty", "-qm", "fixture"], check=True)
        self.run = store.init_run(self.root, "activity", dict(role="leader", session=None))
        self.path = self.run / "activity.jsonl"
        path = self.root / "plan.json"
        path.write_text(json.dumps(dict(schema_version=1, title="Fixture", goal="Work", nodes=[
            dict(id="a", kind="work", goal="Work", lane=1, grade="daily", owns=["a"], outputs=["a"],
                 checks=[dict(id="test", type="cmd", run="test -s a")])])))
        self.cli("plan", "set", str(path))
        approve_plan(self.run)
        checks.start(self.run, "a", self.root, dict(role="leader", session="claude:session-1", node=None))

    def cli(self, *args, code=0, role="leader", node=None):
        out = io.StringIO()
        argv = ["--run", str(self.run), "--role", role, "--json"]
        if node:
            argv += ["--node", node]
        with contextlib.redirect_stdout(out):
            self.assertEqual(cli.main(argv + list(args)), code)
        return json.loads(out.getvalue())

    def invoke(self, raw):
        hooks = json.loads((PLUGIN / "hooks/hooks.json").read_text())["hooks"]
        command = hooks["PreToolUse"][0]["hooks"][0]["command"]
        result = subprocess.run(["sh", "-c", command], cwd=self.root, text=True, capture_output=True,
                                input=raw, env=dict(os.environ, CLAUDE_PLUGIN_ROOT=str(PLUGIN)))
        self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_a1_hook_secret_never_reaches_ledger_cli_mcp_or_served_view(self):
        secret = "sk-payload-secret-123456789"
        events_before = (self.run / "events.jsonl").read_bytes()
        for event in ("PreToolUse", "PostToolUseFailure"):
            self.invoke(json.dumps(payload(event, self.root, "Bash", tool_input={"command": "gf status " + secret},
                                           tool_response={"content": secret}, error=secret, transcript_path=secret)))
        self.assertEqual((self.run / "events.jsonl").read_bytes(), events_before)
        raw = self.path.read_text()
        rows = [json.loads(line) for line in raw.splitlines()]
        self.assertEqual(len(rows), 2)
        self.assertEqual(set(rows[0]), {"ts", "phase", "category", "tool", "session", "call", "via", "node", "attempt"})
        self.assertEqual(set(rows[1]) - set(rows[0]), {"outcome", "duration_ms"})
        self.assertEqual([r["via"] for r in rows], ["session", "session"])
        self.assertEqual(rows[1]["outcome"], "error")
        self.assertEqual(rows[0]["category"], "gf")
        command = [sys.executable, "-I", "-S", "-B", str(SCRIPTS / "gf"),
                   "--run", str(self.run), "--role", "leader", "--json", "activity"]
        output = subprocess.run(command, cwd=self.root, text=True, capture_output=True, check=True)
        leader = json.loads(output.stdout)
        self.assertEqual(leader["records"], rows)
        self.assertEqual(self.cli("activity", role="human")["records"], rows)
        self.assertEqual(self.cli("activity", role="worker", node="a")["records"], rows)
        self.assertEqual(self.cli("activity", "b", role="worker", node="a", code=3)["code"], "forbidden")
        self.assertEqual(self.cli("activity", role="worker", node="b")["records"], [])
        self.assertEqual(self.cli("activity", role="reviewer", node="a", code=3)["code"], "forbidden")
        with mock.patch.dict(os.environ, {"GF_ROLE": "worker", "GF_NODE": "a"}):
            served_mcp = mcp._call(mcp._visible_tools()["run_activity"], {"run": str(self.run)})
        httpd, token = server.make_server()
        thread = threading.Thread(target=httpd.serve_forever, kwargs={"poll_interval": 0.01}, daemon=True)
        thread.start()
        conn = http.client.HTTPConnection("127.0.0.1", httpd.server_address[1], timeout=5)
        try:
            conn.request("GET", "/api/run?" + urlencode(dict(project=str(self.root), run=self.run.name)),
                         headers={"X-GF-Token": token})
            response = conn.getresponse()
            self.assertEqual(response.status, 200)
            served = response.read().decode()
        finally:
            conn.close()
            httpd.shutdown()
            httpd.server_close()
            thread.join(5)
        view = json.loads(served)["view"]
        self.assertEqual(view["nodes"][0]["activity"][0]["phases"][0]["count"], 1)
        for value in (raw, json.dumps(leader), json.dumps(served_mcp), served):
            self.assertNotIn(secret, value)
        self.path.write_text(raw + '{"torn":')
        self.assertEqual(activity.read(self.run)["records"], rows)

    def test_a3_missing_run_malformed_payload_and_full_disk(self):
        self.invoke("not json")
        self.invoke(json.dumps(payload("PreToolUse", self.root.parent)))
        self.assertFalse(self.path.exists())
        packaged = SCRIPTS / "gf"
        with mock.patch("sys.stdin", io.TextIOWrapper(io.BytesIO(json.dumps(payload("PreToolUse", self.root)).encode()))), \
                mock.patch("graphflow.activity._append", side_effect=OSError(errno.ENOSPC, "disk full")), \
                mock.patch.object(sys, "argv", [str(packaged), "_observe-activity"]), \
                contextlib.redirect_stdout(io.StringIO()) as out, contextlib.redirect_stderr(io.StringIO()) as err:
            import runpy
            with self.assertRaises(SystemExit) as stopped:
                runpy.run_path(str(packaged))
        self.assertEqual((stopped.exception.code, out.getvalue(), err.getvalue()), (0, "", ""))
        self.assertFalse(self.path.exists())

    def test_retention_keeps_recent_valid_lines(self):
        with mock.patch.object(activity, "LIMIT_BYTES", 1024):
            for index in range(12):
                activity.observe(payload("PreToolUse", self.root, key=str(index)), stamp(index))
        rows = activity.read(self.run)["records"]
        self.assertGreater(len(rows), 1)
        self.assertLess(len(rows), 12)
        self.assertEqual(rows[-1]["ts"], stamp(11))


if __name__ == "__main__":
    unittest.main()
