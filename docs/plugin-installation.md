# Plugin installation

## Graph Flow

The repository is the plugin root. Claude Code reads
`.claude-plugin/marketplace.json` and resolves the single plugin's source `.`
to that root. Codex reads `.agents/plugins/marketplace.json` and resolves
its local source `./` from the marketplace root. See the
[Claude Code marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference#relative-path-plugin-source)
and [Codex marketplace metadata](https://developers.openai.com/plugins/build/plugins#marketplace-metadata).

Install the published marketplace on macOS using the commands in the
[README](../README.md#install). To install from a local checkout, run the
commands for your host from the repository root:

```sh
# Claude Code
claude plugin marketplace add "$PWD"
claude plugin install graph-flow@graph-flow

# Codex
codex plugin marketplace add "$PWD"
codex plugin add graph-flow@graph-flow
```

If `graph-flow` is already registered, confirm the source with
`claude plugin marketplace list` or `codex plugin marketplace list` before
switching. Run `claude plugin validate . --strict` to check the Claude Code
catalog and bundle. Check the installed entry with `claude plugin list` or
`codex plugin list`, then open a fresh session and invoke
`/graph-flow:graph-flow` or `$graph-flow`, respectively.

Codex's manifest loads [the packaged MCP settings](../.mcp.json). Claude Code
uses its own MCP settings with `${CLAUDE_PLUGIN_ROOT}` as the base for the
installed launcher. The [dashboard guide](../skills/graph-flow/references/dashboard.md)
covers run approval, browser controls, and recovery.
