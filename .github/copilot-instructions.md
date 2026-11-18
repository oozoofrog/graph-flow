# Review instructions

Report defects with a concrete trigger and consequence.

- Before starting and before finishing a Graph Flow review, read the [design sources](../docs/design-sources.md) and apply the change checklist.
- Check that trigger wording agrees in `skills/graph-flow/SKILL.md`, both plugin manifests, skill UI metadata, and the English README. Check both marketplace manifests against the distribution tests.
- Verify local links and plugin-root-relative paths. Keep machine-specific paths and symlinks out of the skill, and preserve Git mode `100755` on directly executed scripts.
- Record user-visible changes in the changelog and keep versions synchronized in both plugin manifests.
- Keep secrets out of command arguments, logs, and committed fixtures.
