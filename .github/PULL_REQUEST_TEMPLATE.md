## Summary

- 
- 
- 

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] CI/CD / config
- [ ] Documentation

## Test plan

- [ ] Unit tests added or updated
- [ ] `npm run test` passes locally
- [ ] `npm run type-check` passes locally
- [ ] `npm run lint` passes locally

## Security acceptance criteria

- [ ] No API keys or secrets in client-side code (no `NEXT_PUBLIC_ANTHROPIC_*` or `NEXT_PUBLIC_SUPABASE_SERVICE_*`)
- [ ] All new API routes validate input with Zod before use
- [ ] Supabase RLS not bypassed (no service role key used in client components)
- [ ] No direct DB or API calls inside React components
- [ ] No `any` types introduced (TypeScript strict mode)

## C.L.E.A.R. Review Checklist

- [ ] **Correct** — no bugs, logic errors, or incorrect assumptions
- [ ] **Lean** — no dead code, over-engineering, or unnecessary complexity
- [ ] **Explicit** — types, names, and API contracts are clear
- [ ] **Accurate** — implementation matches what this PR claims to do
- [ ] **Resilient** — edge cases handled; Zod validation at API boundaries

## AI Disclosure

- **AI-generated:** _% (Claude Code / claude-sonnet-4-5)
- **Tool used:** Claude Code
- **Human review applied:** Yes / No — _describe what was verified manually_
