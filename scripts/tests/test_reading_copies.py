"""Fail when a Korean reading copy no longer matches its English source.

Each canonical spec and ADR file has a `*.ko.md` partner. Each partner names
the SHA-256 hash of its English source (the same path without `.ko`).
See docs/adr/0006 and CEM-R4.
"""

from pathlib import Path
import hashlib
import re
import unittest


ROOT = Path(__file__).resolve().parents[2]
HASH_LINE = re.compile(r"원문 해시: `sha256:([0-9a-f]{64})`")


def reading_copies():
    return sorted((ROOT / "docs").rglob("*.ko.md"))


class ReadingCopyTests(unittest.TestCase):
    def test_reading_copies_exist(self):
        self.assertTrue(reading_copies(), "no Korean reading copies found under docs/")

    def test_each_canonical_document_has_a_reading_copy(self):
        canonical = sorted(
            path
            for folder in ("docs/spec", "docs/adr")
            for path in (ROOT / folder).glob("*.md")
            if not path.name.endswith(".ko.md")
        )
        self.assertTrue(canonical, "no canonical spec or ADR documents found")
        for source in canonical:
            with self.subTest(source=str(source.relative_to(ROOT))):
                copy = source.with_name(source.name[: -len(".md")] + ".ko.md")
                self.assertTrue(copy.is_file(), f"{source.name}: Korean reading copy {copy.name} is missing")

    def test_each_copy_matches_its_english_source(self):
        for copy in reading_copies():
            rel = copy.relative_to(ROOT)
            with self.subTest(copy=str(rel)):
                source = copy.with_name(copy.name[: -len(".ko.md")] + ".md")
                self.assertTrue(source.is_file(), f"{rel}: English source {source.name} is missing")
                found = HASH_LINE.findall(copy.read_text(encoding="utf-8"))
                self.assertEqual(len(found), 1, f"{rel}: expected one '원문 해시' line")
                actual = hashlib.sha256(source.read_bytes()).hexdigest()
                self.assertEqual(
                    found[0],
                    actual,
                    f"{rel} is stale: update it to match {source.name} (sha256 {actual})",
                )


if __name__ == "__main__":
    unittest.main()
