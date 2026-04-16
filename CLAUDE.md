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

## Security Gates

Minimum 4 of the 8 pipeline gates must pass on every PR:

1. **Pre-commit secrets detection** — `.env` file edits blocked by Claude Code PreToolUse hook; Gitleaks to be added
2. **Dependency scanning** — `npm audit --audit-level=high` runs in `ci.yml`
3. **SAST** — ESLint with security rules; AI PR review via `claude-code-action`
4. **Security acceptance criteria** — every PR must confirm: no new `NEXT_PUBLIC_` API keys, RLS not bypassed, all inputs Zod-validated

### OWASP Top 10 Awareness

| # | Risk | Mitigation in TripMind |
|---|---|---|
| A01 | Broken Access Control | Supabase RLS enforces per-user row isolation; anon key only on client |
| A02 | Cryptographic Failures | API keys in server-only env vars; never in `NEXT_PUBLIC_` or logs |
| A03 | Injection | Supabase parameterized queries; Zod validation at all API boundaries |
| A04 | Insecure Design | Input constraints on destination/budget; judge output never exec'd |
| A05 | Security Misconfiguration | Service role key server-side only; `.env` edits blocked in Claude Code |
| A06 | Vulnerable Components | `npm audit` in CI; dependabot alerts on repo |
| A07 | Auth Failures | Supabase Auth handles sessions; no custom JWT logic |
| A08 | Software Integrity | `npm ci` (lockfile) in all CI jobs; no untrusted scripts |
| A09 | Logging Failures | Never log API keys; Sentry for errors; no sensitive data in Next.js logs |
| A10 | SSRF | Claude API called server-side only; no user-supplied URLs passed to fetch |

---

## References

| Resource | URL / Location |
|---|---|
| GitHub repo | https://github.com/arinaa77/ai-travel-planner |
| Supabase dashboard | https://supabase.com/dashboard (project: ai-travel-planner) |
| Vercel project | https://vercel.com/dashboard (project: ai-travel-planner) |
| Anthropic console | https://console.anthropic.com |
| CI workflows | `.github/workflows/ci.yml`, `.github/workflows/ai-review.yml` |
| MCP setup guide | `docs/mcp-setup.md` |

---

## Context

@docs/TripagentPRD.pdf
@docs/claude/architecture.md
@docs/claude/conventions.md
@docs/claude/testing.md
@docs/claude/skills.md
