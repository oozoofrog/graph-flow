# Graph Flow

[한국어](README.ko.md)

Graph Flow is a Claude Code and Codex plugin for planning, delegating, verifying,
and resuming multi-step work. It keeps a graph of tasks and their dependencies,
assignments, check results, attempts, and decisions. A local browser dashboard
shows progress and lets you approve plans and answer decisions.

Use when a user asks to plan, split, delegate, verify, or track multi-step work with checks that can fail, per-node sub-session assignment, human decision points, or a progress dashboard, or explicitly invokes graph-flow. Exclude simple edits and ordinary questions that need no coordination.

## Install

Graph Flow supports macOS only. You need Python 3 on `PATH` and Git.
Both hosts receive the skill and its MCP server. Workflow execution additionally
requires a host with a Workflow tool.

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

See the [installation guide](docs/plugin-installation.md#graph-flow) for local
checkout installation and verification.

## Quick start

1. Start a new session in your Git project and invoke `$graph-flow` in Codex or
   `/graph-flow:graph-flow` in Claude Code. Ask, for example, “Plan this work as a
   graph with checks, and track progress.”
2. Read the plan in the dashboard and approve it or send it back with changes.
   Graph Flow opens the browser again when a decision waits or the run ends.
   If the leader session stopped, tell it in chat when you have answered.
3. Ask the agent to open or close the dashboard. From your terminal, you can also
   use `graph-flow open`, `graph-flow serve`, or `graph-flow open --stop` after
   accepting the optional `gf setup` offer. That command adds `graph-flow` and
   `gf` to `~/.local/bin`. Use the full name if your shell already aliases `gf`. Run `gf setup --remove` to remove those launchers.

To resume a run from 0.2.1, repost and approve its current plan. Unchanged
submissions can continue with their recorded results. Set `GF_NO_OPEN=1` to
suppress automatic browser opening. Plan approval is still required.

## Local records and privacy

Graph Flow writes run plans, session and assignment records, human answers,
changed file names, and command check output under the project's `.graph-flow/`.
Keep this directory out of version control if those records are private.
Use the time bar under the graph to revisit a run or play back its records.
Space-time shows how work and handoffs unfolded. Side view makes start,
end and wait times easier to read. Choose **Live** to answer a current
question after viewing history.

The dashboard listens on loopback. The registry, dashboard token, and approval
signing key live in `${GF_HOME:-$HOME/.graph-flow}`. See the
[records reference](skills/graph-flow/references/records.md).

In 0.4.0-dev, asynchronous hooks in Claude Code and local Codex sessions write
activity metadata for an active run to its local `activity.jsonl`. Codex requires
you to trust the hooks. The log stores tool names, timestamps, optional timings,
session IDs, and attempt attribution. It omits prompts, tool arguments and
responses, command strings, and paths. The dashboard shows recent phases and a
detailed activity view. Sessions without observations show their recorded
starts, checks, and submissions. See the [activity record format](skills/graph-flow/references/records.md#local-activity-observations).

## Development

From the repository root, with Python 3.12, Node 24, Google Chrome, and ffmpeg:

```sh
python3.12 -I -S -B -m unittest discover -s skills/graph-flow/tests
python3.12 -I -S -B -m unittest discover -s scripts/tests
python3.12 -I -S -B -m unittest discover -s dev/eval/tests -t dev/eval
```

The first suite includes headless Chrome tests. Set `CHROME_BIN` to choose a
Chrome executable. See [screen captures](dev/screens/README.md),
[eval tasks](dev/eval/README.md), and the [design sources](docs/design-sources.md).

See [third-party notices](docs/third-party-notices.md) for the dashboard's bundled renderer and fonts.
