"""Fail when a spec's at-a-glance summary drifts from its requirements.

Each spec under docs/spec (English and Korean reading copy) that has
requirement headings (`### <PREFIX>-R<n> — ...`) opens with a summary
table. The table must list exactly the same IDs in the same order, and
it must carry no RFC 2119 keyword, because the summary has no force.
"""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[2]
HEADINGS = ("## At a glance", "## 한눈에 보기")
REQUIREMENT = re.compile(r"^### ([A-Z]+-R\d+) —", re.M)
KEYWORD = re.compile(r"\b(MUST|SHALL|SHOULD|REQUIRED|RECOMMENDED|MAY|OPTIONAL)\b")


def summary_block(text):
    for heading in HEADINGS:
        start = text.find("\n" + heading + "\n")
        if start != -1:
            end = text.find("\n## ", start + 1)
            return text[start:end if end != -1 else len(text)]
    return None


class SpecSummaryTests(unittest.TestCase):
    def test_summaries_match_requirements(self):
        specs = sorted((ROOT / "docs" / "spec").glob("*.md"))
        checked = 0
        for spec in specs:
            text = spec.read_text(encoding="utf-8")
            ids = REQUIREMENT.findall(text)
            if not ids:
                continue
            checked += 1
            with self.subTest(spec=spec.name):
                block = summary_block(text)
                self.assertIsNotNone(block, f"{spec.name}: missing at-a-glance summary")
                rows = re.findall(r"^\| ([A-Z]+-R\d+) \|", block, re.M)
                self.assertEqual(rows, ids, f"{spec.name}: summary IDs differ from requirement headings")
                table = "\n".join(line for line in block.splitlines() if line.startswith("| "))
                self.assertIsNone(KEYWORD.search(table), f"{spec.name}: summary must not use RFC 2119 keywords")
        self.assertGreater(checked, 0, "no specs with requirements found")


if __name__ == "__main__":
    unittest.main()
