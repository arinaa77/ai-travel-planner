# CLAUDE.md: TripMind

## Project

**TripMind**: AI travel planner: generates personalized itineraries with Claude and evaluates them with an LLM-as-judge.

**Members**: Yihan Wang, Kaichen Qu

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 App Router | `/src/app` dir; API routes in `/src/app/api/` |
| UI | Tailwind CSS 4 | DM Sans + DM Serif Display aesthetic |
| State | useState + fetch | Plain client components; no TanStack Query yet |
| AI | Claude API (`@anthropic-ai/sdk`) | Model: `claude-sonnet-4-5`; structured output via `tool_use` |
| Local persistence | localStorage | Recent trips (max 5) |
| DB | Supabase (PostgreSQL) | Auth + RLS; never bypass RLS with service role on client |
| DB client | @supabase/supabase-js | Direct client; no ORM layer |
| Validation | Zod | Every API route input validated before use |
| CI/CD | GitHub Actions + Vercel | Preview (PR), staging (main), production (tag) |
| Monitoring | Sentry + Vercel Analytics | Never log API keys |

---

## Permissions

```json
{
  "allowedTools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
  "deniedTools": ["WebSearch"],
  "allowedCommands": ["npm run *", "npx supabase *", "git *"]
}
```

Do not run `npm install <unknown-package>` without confirming with the team first.

---

## Context

@docs/TripagentPRD.pdf
@docs/claude/architecture.md
@docs/claude/conventions.md
@docs/claude/testing.md
@docs/claude/skills.md
