# Claude Code Workflow

How the TripMind team used Claude Code throughout development.

## Daily Workflow

Each session starts with `/init` to reload CLAUDE.md context, then switches to the relevant task. We used `/clear` between unrelated tasks (e.g. switching from UI work to CI config) and `/compact` when context grew large mid-feature.

Typical session flow:
```
/init
# read CLAUDE.md + @imports automatically loaded
# start feature work or debugging
/fix-issue   # for bugs
/add-feature # for new Claude-powered services
/clear       # between unrelated tasks
```

## Skills

Two skills in `.claude/skills/` were used throughout the project:

**`/add-feature` (v1 → v2)**
Used to scaffold new Claude-powered backend features following the service + API route + Zod pattern. First used for the LLM-as-judge feature (Sprint 1). The task1 session log (`docs/skills/task1-log.md`) recorded 6 gaps in v1: wrong SDK method (`generateObject` instead of `tool_use`), missing `src/` prefix on route paths, wrong model name, and no frontend wiring guidance. These were fixed in v2 (`docs/skills/changelog.md`).

**`/fix-issue`**
Used for targeted bug fixes: most notably fixing the ESLint flat config error in CI (switching from spread syntax to `FlatCompat`) and the Vitest/Playwright conflict where `e2e/` was being picked up by Vitest.

## Hooks

Three hooks run automatically on every session:

**PreToolUse (Edit|Write)**: blocks any edit to `.env` files:
```
ERROR: Editing .env files is blocked to prevent accidental secret exposure.
```
Triggered once during Sprint 2 when attempting to update `.env.local` directly. Redirected to Vercel dashboard instead.

**PostToolUse (Edit|Write)**: runs `tsc --noEmit` after every file edit. Caught type errors inline, including a missing `as const` on `AgentOutput.id` in the judge service test.

**Stop**: runs `npm run test` at the end of every session. Caught the Vitest/Playwright conflict before it was pushed to CI.

## GitHub MCP

The GitHub MCP (`@modelcontextprotocol/server-github`) was configured via `.mcp.json` and used throughout Sprint 2 for:

PR creation with AI disclosure metadata and C.L.E.A.R. checklist (PR #1 and PR #2)
Reading issue state and repo context without leaving the terminal
Checking CI status on open PRs

Setup documented in `docs/mcp-setup.md`.

## Security Reviewer Agent

The `.claude/agents/security-reviewer.md` sub-agent was run before merging the auth and trips features. It checks:

OWASP A01/A02/A03/A07 (access control, secrets, injection, auth failures)
Every API route for Zod validation at input boundaries
Supabase service role key not used in client components
No `any` types or `NEXT_PUBLIC_` API keys

Running it on the auth PR flagged a missing 401 check on `GET /api/trips` before the session was fully authenticated: fixed before merge.

## Worktrees (Parallel Development)

In Sprint 2, git worktrees allowed two features to be developed simultaneously:

```bash
git worktree add -b feat/coverage-config ../tripmind-coverage
git worktree add -b feat/sprint-docs ../tripmind-sprints
```

Terminal A (`../tripmind-coverage`): added Vitest v8 coverage config with 70% thresholds
Terminal B (`../tripmind-sprints`): wrote sprint planning and retrospective docs

Both commits are visible in the git log with interleaved timestamps, merged back to main via separate merge commits.

## Writer/Reviewer Pattern

Two PRs followed the writer/reviewer pattern:

**PR #1: feat(mcp): add GitHub MCP integration**
Claude wrote the `.mcp.json` config and `docs/mcp-setup.md`. Yihan reviewed architecture decisions and tested the MCP connection manually before merging.

**PR #2: feat(e2e): add Playwright E2E tests**
Claude scaffolded `playwright.config.ts`, `e2e/home.spec.ts`, and the CI E2E job. Kaichen reviewed test selectors against actual component source and verified all 8 tests passed locally before approving.

Both PRs include a C.L.E.A.R. checklist (Correct, Lean, Explicit, Accurate, Resilient) and AI disclosure metadata showing percentage AI-generated and human review applied.

## TDD Workflow

Three features followed red-green-refactor:

1. **JudgeScoreCard**: `9a7c949` (failing tests) → `2ea5197` (implementation)
2. **ReasoningAccordion/Verdict**: `8465069` (failing tests) → `b922b1f` (implementation)
3. **Formatters utility**: `d9dc82f` (failing tests) → `7a315d5` (implementation)

In each case, `npm run test` failed on the commit with just the test file, confirming the red state before implementation.
