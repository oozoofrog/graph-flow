# AGENTS.md

## Collaboration rules

- Before changing Graph Flow and again before finishing, read the [design sources](docs/design-sources.md) and apply the change checklist. Keep full source copies and local design work under the Git-ignored `_context/`.
- Use the `skill-creator` workflow when creating or materially updating skills. Keep the single skill source in `skills/graph-flow/`. Put long guidance in `references/`.
- Keep trigger wording aligned across `SKILL.md`, both plugin manifests, skill UI metadata, and the English README. Update both marketplace manifests and the distribution tests if the plugin identity or layout changes.
- Verify local links, installed paths, and executable bits in the Git index. Check user-visible changes against the changelog. Keep the launcher paths relative to their installed package.
- Run the relevant checks serially. Report the files changed, commands run, and remaining verification. Distinguish catalog discovery, installed state, and skill exposure in a fresh session.
