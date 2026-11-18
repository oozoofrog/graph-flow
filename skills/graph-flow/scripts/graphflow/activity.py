"""Private, best-effort activity observations, separate from the run ledger."""
import contextlib
import json
import os
import pathlib
import re
import sys
import time
from collections import Counter

LIMIT_BYTES = 4 * 1024 * 1024
CATEGORIES = ("tool", "skill", "mcp", "session", "gf", "other")
GAP_MS = 1000
STALL_MS = 300_000
REPEAT = 3
PHASE_LIMIT = 12
TOKEN = re.compile(r"[A-Za-z0-9_.:-]{1,160}")
CALL_ID = re.compile(r"[0-9a-f]{32}")
OBSERVED = {
    "PreToolUse": "start", "PostToolUse": "end", "PostToolUseFailure": "end",
    "SubagentStart": "start", "SubagentStop": "end",
}
BUILTINS = frozenset(("Bash PowerShell apply_patch Read Write Edit MultiEdit Glob Grep NotebookEdit WebFetch "
                      "WebSearch ToolSearch AskUserQuestion EnterPlanMode ExitPlanMode TodoWrite "
                      "TaskCreate TaskUpdate TaskGet TaskList TaskOutput TaskStop EnterWorktree "
                      "ExitWorktree ListMcpResourcesTool ReadMcpResourceTool").split())
SESSION_TOOLS = frozenset(("agent", "task", "sendmessage", "send_message", "delegate_task",
                           "t3_thread_send", "spawn_agent", "wait_agent", "followup_task",
                           "task_cancel", "interrupt_agent", "t3_thread_wait"))
READ_TOOLS = frozenset(("Read", "Glob", "Grep", "WebFetch", "WebSearch", "ToolSearch"))
BOUNDARIES = {"node.start": "start", "check.result": "check", "check.red": "check",
              "node.submit": "submit", "review.submit": "submit"}


def token(value):
    return value if isinstance(value, str) and TOKEN.fullmatch(value) else None


def _classify(name, payload):
    if name == "Skill":
        return "skill", None
    namespace = name.split("__", 2)
    provenance = payload.get("mcp_server")
    server = token(provenance.get("name")) if isinstance(provenance, dict) else None
    if not server and len(namespace) == 3 and namespace[0] == "mcp":
        server = token(namespace[1])
    bare = namespace[-1]
    if server in ("graph-flow", "graph_flow", "plugin_graph-flow_graph-flow", "plugin_graph_flow_graph_flow"):
        return "gf", None
    if bare.lower() in SESSION_TOOLS or name == "Subagent":
        return "session", None
    if server:
        return "mcp", server
    if name in ("Bash", "PowerShell"):
        inputs = payload.get("tool_input")
        command = inputs.get("command") if isinstance(inputs, dict) else None
        # Inspect only the executable prefix. No input survives classification.
        if isinstance(command, str):
            import shlex
            lexer = shlex.shlex(command, posix=True)
            lexer.whitespace_split = True
            with contextlib.suppress(ValueError):
                word = lexer.get_token() or ""
                if pathlib.PurePath(word).name == "env":
                    word = lexer.get_token() or ""
                while re.match(r"[A-Za-z_][A-Za-z_0-9]*=", word):
                    word = lexer.get_token() or ""
                if re.fullmatch(r"python3(?:\.\d+)?", pathlib.PurePath(word).name):
                    word = lexer.get_token() or ""
                    while re.fullmatch(r"-[BIEPsS]+", word):
                        word = lexer.get_token() or ""
                if pathlib.PurePath(word).name in ("gf", "graph-flow"):
                    return "gf", None
    return ("tool" if name in BUILTINS else "other"), None


def observation(payload, ts, host="claude"):
    if not isinstance(payload, dict):
        return None
    event = payload.get("hook_event_name")
    if not isinstance(event, str) or event not in OBSERVED:
        return None
    turn = token(payload.get("turn_id")) if host == "codex" else None
    if host == "codex" and (not turn or event not in ("PreToolUse", "PostToolUse")):
        return None
    session, agent = token(payload.get("session_id")), token(payload.get("agent_id"))
    if host == "codex":
        agent = None  # Tool events document a session and turn, not a separate agent ID.
    lifecycle = event in ("SubagentStart", "SubagentStop")
    name = "Subagent" if lifecycle else token(payload.get("tool_name"))
    invocation = agent if lifecycle else token(payload.get("tool_use_id"))
    if not (name and invocation and session):
        return None
    key = json.dumps(["codex", session, turn, invocation] if host == "codex"
                     else [session, agent, lifecycle, invocation])
    import hashlib
    category, server = _classify(name, payload)
    row = {"ts": ts, "phase": OBSERVED[event], "category": category, "tool": name,
           "session": session, "call": hashlib.sha256(key.encode()).hexdigest()[:32]}
    if agent:
        row["agent"] = agent
    if server:
        row["server"] = server
    if row["phase"] == "end" and host != "codex":
        row["outcome"] = "error" if event == "PostToolUseFailure" else "ok"
        duration = payload.get("duration_ms")
        if not lifecycle and type(duration) is int and duration >= 0:
            row["duration_ms"] = duration
    return row


def _milliseconds(stamp):
    from datetime import datetime
    return round(datetime.fromisoformat(stamp.removesuffix("Z") + "+00:00").timestamp() * 1000)


def _boundary_time(event):
    stamp = event.get("ts")
    if isinstance(stamp, str):
        with contextlib.suppress(ValueError, OverflowError, OSError):
            return _milliseconds(stamp)
    return None


def _clean(row):
    # Serving and compaction repeat the allowlist even for records written by other processes.
    required = ("ts", "phase", "category", "tool", "session", "call", "via", "node", "attempt")
    data = {field: row[field] for field in required}
    if (not isinstance(data["ts"], str) or not data["ts"].endswith("Z")
            or data["phase"] not in ("start", "end") or data["category"] not in CATEGORIES
            or not token(data["tool"]) or not token(data["session"])
            or not isinstance(data["call"], str) or not CALL_ID.fullmatch(data["call"])
            or data["via"] not in ("session", "cwd", "single", "unattributed")):
        raise ValueError("invalid activity")
    _milliseconds(data["ts"])
    if data["via"] == "unattributed":
        if data["node"] is not None or data["attempt"] is not None:
            raise ValueError("invalid run attribution")
    elif not token(data["node"]) or type(data["attempt"]) is not int or data["attempt"] < 1:
        raise ValueError("invalid node attribution")
    for field in ("agent", "server"):
        if token(row.get(field)):
            data[field] = row[field]
    if row.get("outcome") in ("ok", "error") and data["phase"] == "end":
        data["outcome"] = row["outcome"]
    if type(row.get("duration_ms")) is int and row["duration_ms"] >= 0 and data["phase"] == "end":
        data["duration_ms"] = row["duration_ms"]
    return data


def _read(path, call=None):
    try:
        with path.open("rb") as f:
            raw = f.read(LIMIT_BYTES + 1)
    except FileNotFoundError:
        return b"", []
    if len(raw) > LIMIT_BYTES:
        raise ValueError("activity size exceeded")
    raw = raw[:raw.rfind(b"\n") + 1]
    lines = raw.splitlines()
    if call is not None:
        key = call.encode()
        lines = (line for line in lines if key in line)
    return raw, [_clean(json.loads(line)) for line in lines]


def read(run_dir, node=None):
    try:
        _, rows = _read(pathlib.Path(run_dir) / "activity.jsonl")
    except (OSError, KeyError, TypeError, ValueError, OverflowError, RecursionError):
        return {"status": "unreadable", "records": []}
    return {"status": "ok", "records": [row for row in rows if node is None or row["node"] == node]}


def _append(run_dir, row, counterpart):
    path = run_dir / "activity.jsonl"
    if counterpart is not None and row["phase"] == "end" and "duration_ms" not in row:
        elapsed = _milliseconds(row["ts"]) - _milliseconds(counterpart["ts"])
        if elapsed >= 0:
            row["duration_ms"] = elapsed
    payload = _encode(_clean(row))
    size = path.stat().st_size if path.exists() else 0
    if size + len(payload) > LIMIT_BYTES:
        from . import store
        _, rows = _read(path)
        kept = b"".join(_encode(entry) for entry in rows)
        cut = kept.find(b"\n", max(0, len(kept) - LIMIT_BYTES // 2))
        store.atomic_write(path, kept[cut + 1:] if cut >= 0 else b"")
        size = path.stat().st_size
    fd = os.open(path, os.O_RDWR | os.O_CREAT | os.O_APPEND, 0o600)
    with os.fdopen(fd, "a+b") as f:
        # Repair only a torn tail. Each complete line is appended under the run lock.
        if size:
            cursor = size
            while cursor:
                start = max(0, cursor - 4096)
                f.seek(start)
                block = f.read(cursor - start)
                newline = block.rfind(b"\n")
                if newline != -1:
                    cursor = start + newline + 1
                    break
                cursor = start
            if cursor != size:
                f.truncate(cursor)
        f.write(payload)
        f.flush()
        os.fsync(f.fileno())


def _encode(row):
    return (json.dumps(row, separators=(",", ":")) + "\n").encode()


def _same_directory(left, right):
    if pathlib.Path(left) == right:
        return True
    with contextlib.suppress(OSError):
        return os.path.samefile(left, right)
    return False


def _matches(running, identity, cwd, host="claude"):
    sessions = [(n, v) for n, v in running.items()
                if identity and v.get("session") in (identity, host + ":" + identity)]
    if sessions:
        return "session", sessions
    directories = [(n, v) for n, v in running.items() if cwd and v.get("cwd") and
                   _same_directory(v["cwd"], cwd)]
    if directories:
        return "cwd", directories
    return "single", list(running.items())


def attribution(running, identity, cwd, host="claude"):
    """Return (node, attempt, rule); a tie at any priority stays ambiguous."""
    rule, matches = _matches(running, identity, cwd, host)
    if len(matches) != 1:
        return None, None, "unattributed"
    node, value = matches[0]
    return node, value["attempt"], rule


def _current(run_dir):
    from . import state, store

    events = store.events(run_dir)
    revision = store._last_plan_set(events)
    if not revision:
        return None
    plan = store._load_plan(run_dir, revision["data"]["revision"], revision["data"])
    derived = state.derive(plan, events)
    if derived["run"]["status"] == "complete":
        return None
    state.require_plan_approval(derived)
    running = {}
    for event in reversed(events):
        if event["type"] != "node.start":
            continue
        data = event["data"]
        node = data["node"]
        current = derived["nodes"].get(node, {})
        if node not in running and current.get("status") == "running" and event["seq"] > current.get("basis", 0):
            running[node] = {**data, "attempt": current["attempts"],
                             "session": (event.get("actor") or {}).get("session")}
    return running


def _run_paths(cwd):
    # The nearest Git root prevents attributing work in a nested repository to its parent.
    for root in (cwd, *cwd.parents):
        git = root / ".git"
        folder = root / ".graph-flow" / "runs"
        if folder.is_dir():
            yield from (p for p in folder.iterdir() if p.is_dir() and not p.is_symlink())
        if git.is_file():
            reference = git.read_text(encoding="utf-8").removeprefix("gitdir: ").strip()
            admin = (root / reference).resolve()
            common = admin / "commondir"
            if common.is_file():
                folder = (admin / common.read_text(encoding="utf-8").strip()).resolve().parent / ".graph-flow" / "runs"
                if folder.is_dir():
                    yield from (p for p in folder.iterdir() if p.is_dir() and not p.is_symlink())
        if git.exists() or folder.is_dir():
            return


def _select(paths, cwd, identity, host):
    from . import core

    candidates = []
    for run in paths:
        try:
            running = _current(run)
            if running is not None:
                candidates.append((run, _matches(running, identity, cwd, host)[0]))
        except (OSError, core.GFError):
            continue
    explicit = os.environ.get("GF_RUN")
    if explicit:
        path = pathlib.Path(explicit).resolve()
        if any(run == path for run, _ in candidates):
            return path
    if len(candidates) == 1:
        return candidates[0][0]
    for rule in ("session", "cwd"):
        matches = [run for run, match in candidates if match == rule]
        if matches:
            return matches[0] if len(matches) == 1 else None
    return None


def observe(payload, ts, host="claude"):
    if not isinstance(payload, dict):
        return
    cwd_value = payload.get("cwd")
    if not isinstance(cwd_value, str) or not pathlib.Path(cwd_value).is_absolute():
        return
    cwd = pathlib.Path(cwd_value).resolve(strict=True)
    paths = tuple(dict.fromkeys(_run_paths(cwd)))
    if not paths:
        return
    if isinstance(ts, float):
        from datetime import datetime, timezone
        ts = datetime.fromtimestamp(ts, timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    row = observation(payload, ts, host)
    if not row:
        return
    identity = row.get("agent", row["session"])
    run = _select(paths, cwd, identity, host)
    if run is None:
        return
    from . import store

    with store.locked(run / ".lock", timeout_s=0.5):
        running = _current(run)
        if running is None:
            return
        _, records = _read(run / "activity.jsonl", row["call"])
        counterpart = None
        for entry in reversed(records):
            if entry["call"] == row["call"]:
                if entry["phase"] == row["phase"]:
                    return
                counterpart = entry
        node, attempt, via = attribution(running, identity, cwd, host)
        if counterpart is not None:
            # Keep both edges of one invocation on the same attempt across submit/retry races.
            node, attempt, via = (counterpart[key] for key in ("node", "attempt", "via"))
        _append(run, dict(row, node=node, attempt=attempt, via=via), counterpart)


def hook(host="claude"):
    stamp = time.time()
    try:
        line = sys.stdin.buffer.read(8 * 1024 * 1024 + 1)
        if len(line) <= 8 * 1024 * 1024:
            observe(json.loads(line), stamp, host)
    except Exception:
        # The async observer has no response channel and never changes tool execution.
        pass
    return 0


def _calls(records):
    paired = {}
    for row in records:
        paired.setdefault(row["call"], {})[row["phase"]] = row
    calls = []
    for key, pair in paired.items():
        start, end = pair.get("start"), pair.get("end")
        row = start or end
        ended_at = _milliseconds(end["ts"]) if end else None
        duration = (end or {}).get("duration_ms")
        call_start = _milliseconds(start["ts"]) if start else ended_at - (duration or 0)
        if duration is None and start and end and ended_at >= call_start:
            duration = ended_at - call_start
        calls.append(dict(key=key, category=row["category"], tool=row["tool"],
                          start=call_start, end=max(call_start, ended_at) if end else None,
                          recorded_start=call_start if start else None, recorded_end=ended_at,
                          via={p["via"] for p in pair.values()},
                          duration=duration or 0, start_known=start is not None,
                          unknown=int(duration is None), error=int((end or {}).get("outcome") == "error")))
    return sorted(calls, key=lambda call: (call["start"], call["key"]))


def _repeat_indices(items, name, failed):
    streaks = []
    streak = []
    for index, item in enumerate(items):
        if not failed(item) or streak and name(items[streak[-1]]) != name(item):
            if len(streak) >= REPEAT:
                streaks.extend(streak)
            streak = []
        if failed(item):
            streak.append(index)
    if len(streak) >= REPEAT:
        streaks.extend(streak)
    return set(streaks)


def _phase(category, start, duration=0, *, count=0, errors=0, names=(), unknown=0,
           label=None, repeating=False, detail_start=None, end=None, longest=None, via=(), current=False,
           origin="observed"):
    return dict(category=category, start_ms=start, duration_ms=duration, count=count,
                names=Counter(names), errors=errors, unknown=unknown, label=label or category,
                repeating=repeating, inferred=category == "thinking", steps=1,
                detail_start_ms=detail_start, end_ms=end, longest_ms=longest, via=set(via),
                current=current, origins={origin})


def _merge(left, right, condensed=False):
    inferred = left["inferred"] and right["inferred"]
    def combine_time(key, choose):
        return choose((value for phase in (left, right) if (value := phase[key]) is not None), default=None)

    return dict(category=("thinking" if inferred else "other") if condensed else left["category"],
                label="more" if condensed else left["label"], start_ms=left["start_ms"],
                duration_ms=left["duration_ms"] + right["duration_ms"],
                count=left["count"] + right["count"], names=left["names"] + right["names"],
                errors=left["errors"] + right["errors"], unknown=left["unknown"] + right["unknown"],
                repeating=left["repeating"] or right["repeating"], inferred=inferred,
                includes_inferred=left.get("includes_inferred", left["inferred"]) or
                right.get("includes_inferred", right["inferred"]),
                steps=left["steps"] + right["steps"] if condensed else 1,
                detail_start_ms=combine_time("detail_start_ms", min),
                end_ms=combine_time("end_ms", max), longest_ms=combine_time("longest_ms", max),
                via=left["via"] | right["via"], origins=left["origins"] | right["origins"],
                current=left["current"] or right["current"])


def _observed_phases(calls, repeating, latest):
    phases = []
    covered_until = None
    pending = False
    for index, call in enumerate(calls):
        start, end = call["start"], call["end"]
        gap = start - covered_until if call["start_known"] and covered_until is not None and not pending else 0
        if gap >= GAP_MS:
            phases.append(_phase("thinking", covered_until, gap, detail_start=covered_until, end=start, origin="inferred"))
        category, name = call["category"], call["tool"]
        label = "read" if category == "tool" and name in READ_TOOLS else category
        phase = _phase(category, start, call["duration"], count=1, errors=call["error"],
                       names=(name,), unknown=call["unknown"], label=label, repeating=index in repeating,
                       detail_start=call["recorded_start"], end=call["recorded_end"],
                       longest=None if call["unknown"] else call["duration"], via=call["via"],
                       current=call["key"] == latest["call"])
        if phases and phases[-1]["category"] == category:
            if phases[-1]["label"] != label:
                phases[-1]["label"] = category
                phase["label"] = category
            phases[-1] = _merge(phases[-1], phase)
        else:
            phases.append(phase)
        if end is None:
            pending = True
        elif covered_until is None or end > covered_until:
            covered_until = end
    return phases


def _boundary_phases(events, repeating):
    phases = []
    checks = 0
    for event in events:
        label = BOUNDARIES.get(event["type"])
        if not label:
            continue
        data = event["data"]
        duration = data.get("duration_ms")
        duration = duration if type(duration) is int and duration >= 0 else 0
        is_check = label == "check"
        timestamp = _boundary_time(event)
        phase = _phase("gf", timestamp - duration if timestamp is not None else None, duration,
                       count=int(is_check), names=(data["check"],) if is_check else (),
                       errors=int(data.get("result") == "failed"), label=label,
                       repeating=is_check and checks in repeating, origin="boundary",
                       detail_start=(timestamp - duration if timestamp is not None else None),
                       end=timestamp if label != "start" else None,
                       longest=duration if is_check and type(data.get("duration_ms")) is int else None)
        checks += is_check
        if is_check and phases and phases[-1]["label"] == label:
            phases[-1] = _merge(phases[-1], phase)
        else:
            phases.append(phase)
    return phases


def _cap(phases):
    size = len(phases)
    if size <= PHASE_LIMIT:
        return phases
    import heapq
    previous = list(range(-1, size - 1))
    following = list(range(1, size + 1))

    def weight(left, right):
        return phases[left]["duration_ms"] + phases[right]["duration_ms"]

    edges = [(weight(i, i + 1), i, i + 1) for i in range(size - 1)]
    heapq.heapify(edges)
    remaining = size
    while remaining > PHASE_LIMIT:
        duration, left, right = heapq.heappop(edges)
        if phases[left] is None or following[left] != right or duration != weight(left, right):
            continue
        phases[left] = _merge(phases[left], phases[right], condensed=True)
        phases[right] = None
        after, before = following[right], previous[left]
        following[left] = after
        if after < size:
            previous[after] = left
            heapq.heappush(edges, (weight(left, after), left, after))
        if before >= 0:
            heapq.heappush(edges, (weight(before, left), before, left))
        remaining -= 1
    return [phase for phase in phases if phase is not None]


def condense(records, events, now_ms, running=False, unreadable=False):
    """One attempt. All clocks are inputs. Durations add even when observed calls overlap."""
    calls = _calls(records)
    checks = [event["data"] for event in events if event["type"] in ("check.result", "check.red")]
    repeated_tools = _repeat_indices(calls, lambda c: c["tool"], lambda c: c["error"])
    repeated_checks = _repeat_indices(checks, lambda c: c["check"], lambda c: c.get("result") == "failed")
    latest = max(records, key=lambda row: (row["ts"], row["phase"] == "end", row["call"])) if records else None
    phases = _observed_phases(calls, repeated_tools, latest) if calls else _boundary_phases(events, repeated_checks)
    cue = latest["category"] if latest else None
    if (latest and latest["phase"] == "start" and len(phases) >= 2 and phases[-2]["inferred"]
            and phases[-1]["start_ms"] == _milliseconds(latest["ts"])):
        cue = "thinking"
        for phase in phases:
            phase["current"] = phase is phases[-2]
    if calls and repeated_checks and not repeated_tools:
        failed_at = [_boundary_time(e) for e in events if e["type"] in ("check.result", "check.red")][max(repeated_checks)]
        if failed_at is not None:
            observed = [phase for phase in phases if not phase["inferred"]]
            min(observed, key=lambda phase: abs(phase["start_ms"] - failed_at))["repeating"] = True
    timestamps = [at for event in events if (at := _boundary_time(event)) is not None]
    timestamps.extend(_milliseconds(record["ts"]) for record in records)
    stalled = running and bool(timestamps) and now_ms - max(timestamps) >= STALL_MS
    totals = {}
    for phase in phases:
        total = totals.setdefault(phase["category"], {"count": 0, "duration_ms": 0})
        for key in total:
            total[key] += phase[key]
    phases = _cap(phases)
    if phases and stalled:
        phases[-1]["stalled"] = True
    current = None
    for index, phase in enumerate(phases):
        phase["id"] = str(index + 1)
        if phase.pop("current"):
            current = phase["id"]
        names, origins = phase.pop("names"), sorted(phase.pop("origins"))
        phase["distinct"] = len(names)
        phase["origin"] = origins[0] if len(origins) == 1 else "mixed"
        phase["checks" if phase["origin"] == "boundary" else "tools"] = dict(sorted(names.items()))
        phase["via"] = sorted(phase["via"])
    return dict(status="unreadable" if unreadable else "observed" if calls else "unobserved",
                phases=phases, latest=latest["category"] if latest else None, cue=cue,
                stalled=stalled, repeating=bool(repeated_tools or repeated_checks), current=current,
                totals=totals)


def summaries(activity, events, nodes, now_ms):
    """Index historical attempts once, then derive the shared scene/list input."""
    by_attempt = {}
    for event in events:
        data = event.get("data") or {}
        node = data.get("node") or (event.get("actor") or {}).get("node")
        if node not in nodes:
            continue
        if event["type"] == "node.start":
            attempts = by_attempt.setdefault(node, {})
            attempts[data.get("attempt") or len(attempts) + 1] = []
        attempts = by_attempt.get(node)
        if attempts:
            number = data.get("attempt") or next(reversed(attempts))
            if number in attempts:
                attempts[number].append(event)
    observed = {}
    for row in activity["records"]:
        observed.setdefault((row["node"], row["attempt"]), []).append(row)
    result = {}
    for node, attempts in by_attempt.items():
        current = nodes[node]
        result[node] = []
        for number, rows in attempts.items():
            observations = observed.get((node, number), [])
            summary = condense(observations, rows, now_ms,
                               current["status"] == "running" and current["attempts"] == number,
                               activity["status"] == "unreadable")
            boundaries = [_boundary_time(event) for event in rows]
            last = [stamp for stamp in boundaries if stamp is not None]
            last.extend(_milliseconds(record["ts"]) for record in observations)
            # Share the condensation inputs with the strip and time views.
            # Call arguments, names and inferred starts stay out of this list.
            calls = [{"id": call["key"], "category": call["category"],
                      "start_ms": call["recorded_start"], "end_ms": call["recorded_end"],
                      "duration_ms": None if call["unknown"] else call["duration"], "failed": bool(call["error"])}
                     for call in _calls(observations)]
            result[node].append(dict(attempt=number, started_ms=boundaries[0],
                                     last_ms=max(last, default=None), calls=calls,
                                     boundaries=[{"kind": event["type"], "seq": event.get("seq"), "time_ms": stamp}
                                                 for event, stamp in zip(rows, boundaries) if stamp is not None],
                                     **summary))
    return result
