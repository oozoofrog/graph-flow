"""Graph Flow package contracts; no live marketplace installation claims."""

import hashlib
import json
import re
import subprocess
import sys
import unittest
from pathlib import Path
from unittest import mock

from test_document_links import local_targets

ROOT = Path(__file__).resolve().parents[2]
SKILL = ROOT / "skills/graph-flow"


def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)


class GraphFlowDistributionTests(unittest.TestCase):
    def test_manifests_and_discovery_metadata_agree(self):
        claude = json.loads((ROOT / ".claude-plugin/plugin.json").read_text())
        codex = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
        description = (SKILL / "SKILL.md").read_text().split("description: ", 1)[1].splitlines()[0]
        self.assertIn("name: graph-flow\n", (SKILL / "SKILL.md").read_text())
        self.assertEqual("graph-flow", codex["name"])
        self.assertRegex(codex["version"], r"^\d+\.\d+\.\d+(?:-dev)?$")
        for key in ("name", "version", "description"):
            self.assertEqual(claude[key], codex[key], key)
        with mock.patch.object(sys, "path", [str(SKILL / "scripts"), *sys.path]):
            from graphflow import __version__
        self.assertEqual(__version__, codex["version"])
        self.assertEqual(description, codex["description"])
        self.assertEqual(description, codex["interface"]["longDescription"])
        self.assertEqual("./skills/", codex["skills"])
        metadata = dict(line.strip().split(": ", 1) for line in
                        (SKILL / "agents/openai.yaml").read_text().splitlines()[1:])
        metadata = {key: json.loads(value) for key, value in metadata.items()}
        for yaml_key, json_key in (("display_name", "displayName"),
                                  ("short_description", "shortDescription")):
            self.assertEqual(metadata[yaml_key], codex["interface"][json_key])
        self.assertTrue(25 <= len(metadata["short_description"]) <= 64)
        self.assertEqual([metadata["default_prompt"]], codex["interface"]["defaultPrompt"])
        self.assertIn("$graph-flow", metadata["default_prompt"])
        for name in ("README.md", "README.ko.md"):
            text = (ROOT / name).read_text()
            for expected in ("graph-flow@graph-flow", "$graph-flow",
                             "/graph-flow:graph-flow", "graph-flow serve",
                             "docs/plugin-installation.md#graph-flow"):
                self.assertIn(expected, text, name)
        self.assertIn(description, (ROOT / "README.md").read_text())
        self.assertIn("graph-flow", (ROOT / "CHANGELOG.md").read_text())

    def test_marketplaces_resolve_the_single_plugin(self):
        codex_market = json.loads((ROOT / ".agents/plugins/marketplace.json").read_text())
        claude_market = json.loads((ROOT / ".claude-plugin/marketplace.json").read_text())
        self.assertEqual("graph-flow", codex_market["name"])
        self.assertEqual("Graph Flow", codex_market["interface"]["displayName"])
        self.assertEqual(codex_market["name"], claude_market["name"])
        self.assertEqual("oozoofrog", claude_market["owner"]["name"])
        (codex,) = codex_market["plugins"]
        (claude,) = claude_market["plugins"]
        self.assertEqual("graph-flow", codex["name"])
        self.assertEqual(codex["name"], claude["name"])
        self.assertEqual({"source": "local", "path": "./"}, codex["source"])
        self.assertEqual({"installation": "AVAILABLE", "authentication": "ON_INSTALL"}, codex["policy"])
        self.assertEqual("Productivity", codex["category"])
        self.assertEqual("productivity", claude["category"])
        self.assertEqual(".", claude["source"])
        for directory, entry, source in (
            (".codex-plugin", codex, codex["source"]["path"]),
            (".claude-plugin", claude, claude["source"]),
        ):
            plugin = ROOT / source
            manifest = json.loads((plugin / directory / "plugin.json").read_text())
            self.assertEqual(entry["name"], manifest["name"])
            self.assertEqual("https://github.com/oozoofrog/graph-flow", manifest["repository"])
            self.assertTrue((plugin / "skills" / entry["name"] / "SKILL.md").is_file())
            if directory == ".claude-plugin":
                self.assertEqual(manifest["description"], entry["description"])
                self.assertNotIn("interface", manifest)
                self.assertNotIn("skills", manifest)

    def test_mcp_configurations_resolve_to_the_same_launcher(self):
        claude = json.loads((ROOT / ".claude-plugin/plugin.json").read_text())
        codex = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
        # Claude uses an inline server rooted at its installed plugin directory.
        self.assertEqual("./.mcp.json", codex["mcpServers"])
        config = json.loads((ROOT / codex["mcpServers"]).read_text())
        self.assertEqual({"graph-flow"}, set(config["mcpServers"]))
        self.assertEqual({"graph-flow"}, set(claude["mcpServers"]))
        local = config["mcpServers"]["graph-flow"]
        installed = claude["mcpServers"]["graph-flow"]
        self.assertEqual("python3", local["command"])
        self.assertEqual(local["command"], installed["command"])
        self.assertEqual(["./skills/graph-flow/scripts/gf", "mcp"], local["args"])
        self.assertEqual(local["args"], [arg.replace("${CLAUDE_PLUGIN_ROOT}", ".")
                                       for arg in installed["args"]])
        self.assertEqual(".", local["cwd"])
        self.assertEqual(local["cwd"], installed["cwd"].replace("${CLAUDE_PLUGIN_ROOT}", "."))
        self.assertTrue(local["enabled"])

    def test_launcher_is_executable_in_git_index(self):
        launcher = SKILL / "scripts/gf"
        self.assertTrue(launcher.is_file())
        result = subprocess.run(
            ["git", "ls-files", "--stage", "--", str(launcher.relative_to(ROOT))],
            cwd=ROOT, check=True, capture_output=True, text=True)
        self.assertEqual(["100755"], [line.split()[0] for line in result.stdout.splitlines()])

    def test_referenced_package_files_exist(self):
        for manifest in (ROOT / ".claude-plugin/plugin.json",
                         ROOT / ".codex-plugin/plugin.json", ROOT / ".mcp.json"):
            for value in strings(json.loads(manifest.read_text())):
                if value.startswith(("./", "${CLAUDE_PLUGIN_ROOT}")):
                    target = value.replace("${CLAUDE_PLUGIN_ROOT}", ".")
                    self.assertTrue((ROOT / target).exists(), (manifest, target))
        documents = [*SKILL.rglob("*.md"), *ROOT.glob("agents/*.md"),
                     *ROOT.glob("dev/**/README.md"), ROOT / ".github/copilot-instructions.md"]
        for document in documents:
            text = document.read_text()
            for target in local_targets(text):
                self.assertTrue((document.parent / target).is_file(), (document, target))
            if not document.is_relative_to(SKILL) and document.parent != ROOT / "agents":
                continue
            for target in re.findall(r"<skill-dir>/([^\s`]+)", text):
                self.assertTrue((SKILL / target).is_file(), (document, target))
        self.assertTrue((SKILL / "workflow.js").is_file())
        self.assertTrue((SKILL / "routing.json").is_file())

    def test_activity_hook_uses_claude_default_and_codex_override(self):
        claude = json.loads((ROOT / ".claude-plugin/plugin.json").read_text())
        codex = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
        self.assertNotIn("hooks", claude)
        codex_hooks = json.loads((ROOT / codex["hooks"]).read_text())["hooks"]
        self.assertEqual({"PreToolUse", "PostToolUse"}, set(codex_hooks))
        for (entry,) in codex_hooks.values():
            (handler,) = entry["hooks"]
            self.assertEqual("command", handler["type"])
            self.assertIs(handler["async"], True)
            self.assertEqual('python3 -I -S -B "${PLUGIN_ROOT}/skills/graph-flow/scripts/gf" '
                             '_observe-activity codex >/dev/null 2>&1 || :', handler["command"])
        registered = json.loads((ROOT / "hooks/hooks.json").read_text())["hooks"]
        self.assertEqual({"PreToolUse", "PostToolUse", "PostToolUseFailure", "SubagentStart", "SubagentStop"},
                         set(registered))
        for (entry,) in registered.values():
            (handler,) = entry["hooks"]
            self.assertEqual("command", handler["type"])
            self.assertIs(handler["async"], True)
            self.assertEqual('python3 -I -S -B "${CLAUDE_PLUGIN_ROOT}/skills/graph-flow/scripts/gf" '
                             '_observe-activity >/dev/null 2>&1 || :', handler["command"])

    def test_dashboard_assets_and_vendor_inventory_match_loopback_allowlist(self):
        with mock.patch.object(sys, "path", [str(SKILL / "scripts"), *sys.path]):
            from graphflow import server
        assets = [server.PAGE_PATH, *(server.STATIC_ROOT / name for name in server.STATIC_TYPES)]
        for path in assets:
            self.assertTrue(path.is_file(), path)
            self.assertGreater(path.stat().st_size, 0, path)
        for source in (server.PAGE_PATH, server.STATIC_ROOT / "page.js", server.STATIC_ROOT / "graph-webgl.js",
                       server.STATIC_ROOT / "activity-webgl.js"):
            for target in re.findall(r'/static/([^\s\"\'`<>]+)', source.read_text()):
                self.assertIn(target, server.STATIC_TYPES, (source, target))
        packaged = {
            path.relative_to(ROOT).as_posix() for path in (server.STATIC_ROOT / "vendor").rglob("*")
            if path.is_file()
        }
        declared = set()
        for name in ("three", "fonts"):
            vendor = server.STATIC_ROOT / "vendor" / name
            manifest = json.loads((vendor / "manifest.json").read_text())
            for asset, digest in manifest["sha256"].items():
                self.assertEqual(hashlib.sha256((vendor / asset).read_bytes()).hexdigest(), digest, asset)
            declared.update((vendor / asset).relative_to(ROOT).as_posix()
                            for asset in (*manifest["sha256"], "manifest.json"))
        self.assertEqual(packaged, declared)
        self.assertEqual(packaged, {
            (server.STATIC_ROOT / name).relative_to(ROOT).as_posix()
            for name in server.STATIC_TYPES if name.startswith("vendor/")
        })


if __name__ == "__main__":
    unittest.main()
