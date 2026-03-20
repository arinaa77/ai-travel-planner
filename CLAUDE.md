# CLAUDE.md: TripAgent

## Project

**TripAgent**: AI travel planner using parallel multi-agent architecture.

**Members**: Yihan Wang, Kaichen Qu

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | `/app` dir; API routes in `/app/api/` |
| UI | Tailwind + shadcn/ui | Option A aesthetic: DM Sans + DM Serif Display |
| State | TanStack Query | All async/streaming state goes through this |
| AI | Claude API | Model: `claude-sonnet-4` |
| DB | Supabase (PostgreSQL) | Auth + RLS; never bypass RLS with service role on client |
| DB client | @supabase/supabase-js | Direct client; no ORM layer; RLS enforced in Supabase dashboard |
| Validation | Zod | Every API route input must be validated with a Zod schema before use |
| CI/CD | GitHub Actions + Vercel | 3 envs: preview (PR), staging (main), production (tag) |
| Monitoring | Sentry + Vercel Analytics | Import `@sentry/nextjs` for server errors; never log API keys |

---

## Architecture

```
middleware.ts          ← API gateway: auth + rate limiting on all /api/*
app/api/
  generate/route.ts    ← Orchestrates parallel agents
  judge/route.ts       ← LLM-as-judge evaluation
  trips/route.ts       ← Trip CRUD
src/services/
  agentOrchestrator.ts ← Promise.all([budget, attractions, food])
  coordinatorAgent.ts  ← Merges 3 agent outputs into itinerary
  judgeService.ts      ← Scores on cost accuracy, diversity, feasibility
  tripService.ts       ← Business logic; never put DB calls in route handlers
```

**Key pattern: parallel agents:**
```typescript
const [budget, attractions, food] = await Promise.all([
  budgetAgent(input),
  attractionsAgent(input),
  foodAgent(input),
]);
```

**Caching:** Use `unstable_cache` for identical destination+budget lookups. Check Supabase for existing trip before calling agents. No Redis.

---

## Coding Conventions

- **TypeScript strict mode**: no `any`, no `@ts-ignore` without a comment explaining why
- **File naming**: `camelCase.ts` for utilities, `PascalCase.tsx` for components
- **Imports**: absolute paths via `@/` alias (e.g. `@/services/tripService`)
- **API routes**: always validate input with Zod first, then call service layer
- **Components**: presentational only; no direct DB or API calls inside components
- **Error handling**: all `async` functions in services must have try/catch; surface errors via `NextResponse.json({ error }, { status })` with appropriate HTTP codes
- **Environment variables**: server-only vars (no `NEXT_PUBLIC_`) for API keys; never access `process.env.ANTHROPIC_API_KEY` in client components

---

## Database (Supabase)

Core tables: `users`, `trips`, `itinerary_versions`, `evaluations`

Use `@supabase/supabase-js` directly for all queries: no ORM. Row Level Security policies are defined in the Supabase dashboard and enforce per-user data isolation.

- Never bypass RLS by using the service role key in client-side code
- Use the anon key on the client; service role key only in server-side API routes
- Run SQL migrations via `npx supabase db push` or the Supabase dashboard SQL editor

---

## Testing Strategy

- **Unit tests (Vitest)**: pure functions in `src/services/` and `src/lib/`
- **Integration tests**: API routes tested with `next-test-api-route-handler`
- **No mocking of Anthropic API in integration tests**: use a real key in CI; keep test inputs short to control cost
- **Lighthouse CI**: run against staging; must score Perf ≥ 85, A11y ≥ 90
- Test files: co-located `*.test.ts` next to the source file

```bash
npm run test          # Vitest unit tests
npm run type-check    # tsc --noEmit
npm run lint          # ESLint
npm run lhci          # Lighthouse CI (needs LHCI_GITHUB_APP_TOKEN)
```

- Validate all user inputs with Zod before they touch a prompt or DB query
- Use `generateObject` with a typed Zod schema when you need structured JSON from Claude
- Keep agent prompts in `src/services/prompts/` as named constants: never inline long strings
- Use `unstable_cache` for expensive repeated lookups
- Add Sentry `captureException` in service-layer catch blocks
- Keep components pure: data fetching via TanStack Query hooks only

---

## Don'ts

- Don't put `ANTHROPIC_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_` vars
- Don't call Prisma or Supabase directly from React components or Client Components
- Don't use `any` type: use `unknown` and narrow with Zod or type guards
- Don't create new API routes without adding Zod validation and auth check in middleware
- Don't stream agent output directly to the client without sanitizing for XSS
- Don't commit `.env.local`: it's in `.gitignore`; use Vercel env dashboard for CI vars
- Don't run all 3 agents sequentially: always use `Promise.all()` for the parallel pattern

---

## Additional Context

@docs/TripagentPRD.pdf

---

## Context Management (Claude Code)

- Run `/clear` between unrelated tasks (e.g., switching from UI work to DB migrations)
- Run `/compact` when context grows large mid-feature: summarizes history, keeps working state
- Use `--continue` flag to resume the last session when picking up an interrupted task
- Reference this file with `/init` at the start of each new session to reload project context

---

## Permissions

Allowed tools in `.claude/settings.json`:
```json
{
  "allowedTools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
  "deniedTools": ["WebSearch"],
  "allowedCommands": ["npm run *", "npx prisma *", "git *"]
}
```

Sandboxing: Claude Code should not run `npm install <unknown-package>` without confirming with the team first.
