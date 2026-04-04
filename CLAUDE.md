# CLAUDE.md: TripAgent

## Project

**TripAgent**: AI travel planner using Claude to generate personalized itineraries with LLM-as-judge evaluation.

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
  generate/route.ts    ← Single Claude call → itinerary + agent panel data
  judge/route.ts       ← LLM-as-judge evaluation
  trips/route.ts       ← Trip CRUD
src/services/
  generateService.ts   ← Calls Claude once; returns itinerary + budget/attractions/food breakdowns
  judgeService.ts      ← Scores on cost accuracy, diversity, feasibility
  tripService.ts       ← Business logic; never put DB calls in route handlers
src/services/prompts/
  generatePrompt.ts    ← System + user prompt for itinerary generation
  judgePrompt.ts       ← System + user prompt for judge evaluation
```

**Key pattern: single Claude call returns structured output:**
```typescript
// generateService.ts — one call, structured via tool_use
const itinerary = await generateTrip({ destination, days, budget, style });
// itinerary includes: days[], agentOutputs (budget/attractions/food breakdown)
```

**Caching:** Use `unstable_cache` for identical destination+budget lookups. Check Supabase for existing trip before calling Claude. No Redis.

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
- Don't add separate budget/attractions/food agent files — generateService handles all three in one Claude call

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
