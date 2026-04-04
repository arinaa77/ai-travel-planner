# Claude Code Skills

Skills live in `.claude/skills/`. Use them with `/skill-name` in a Claude Code session.

## Available Skills

### `/add-feature`
Scaffolds a new backend feature following the project pattern:
1. Prompt file in `src/services/prompts/`
2. Service file in `src/services/`
3. API route in `src/app/api/`
4. Frontend wiring in a client component

Use when: adding a new Claude-powered service or API endpoint.

### `/fix-issue`
Diagnoses and fixes a bug given an issue number, error message, or description.
Steps: read the code → identify root cause → minimal fix → verify with tests + type-check.

Use when: something is broken and you need a focused, surgical fix without refactoring scope creep.

## Session Management

- Run `/clear` between unrelated tasks (e.g. switching from UI work to DB migrations)
- Run `/compact` when context grows large mid-feature
- Use `--continue` flag to resume the last interrupted session
- Reference CLAUDE.md with `/init` at the start of each new session

## MCP

GitHub MCP is configured in `.mcp.json`. See `docs/mcp-setup.md` for setup instructions.

Once connected, Claude Code can read repo state, create PRs, and add AI disclosure metadata inline during development.
