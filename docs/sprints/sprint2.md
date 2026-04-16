# Sprint 2

**Dates**: Apr 3 – Apr 16, 2026  
**Goal**: Auth, trip persistence, CI/CD pipeline, and Claude Code mastery requirements

## Planning

### Goals
- Add Supabase email auth (sign in / sign up / sign out)
- Add trip save, load, and delete per user
- Set up GitHub Actions CI pipeline (lint, type-check, tests, security scan)
- Add Gitleaks secret scanning and PR template
- Add security-reviewer sub-agent and agents directory
- Demonstrate TDD with formatters utility
- Set up git worktrees for parallel feature development

### Issues
- #5 Add Supabase auth routes and AuthModal
- #6 Add MyTripsPanel and trip CRUD API
- #7 Set up CI/CD with lint, type-check, npm audit, and AI review
- #8 Add Gitleaks and PR template for security gates
- #9 TDD: formatters utility (formatBudget, formatDuration, formatTripDate)
- #10 Parallel dev: coverage config and sprint docs via git worktrees

## Retrospective

### What went well
- CI pipeline came together quickly once eslint flat config was fixed
- TDD on formatters was the cleanest red-green cycle of the project
- Security gates now cover 5 of 8 requirements
- Worktrees made it easy to work on coverage config and sprint docs simultaneously

### What to improve
- E2E tests (Playwright) still outstanding — should have been set up earlier
- Sprint docs should be written during the sprint, not at the end
- Need to open GitHub Issues with proper acceptance criteria before starting work

### Async Standups
Apr 5 (Yihan): Supabase auth routes done, starting MyTripsPanel and trips CRUD API
Apr 5 (Kaichen): reviewing auth PR, will write trip CRUD tests this week
Apr 10 (Yihan): trip save/load/delete working with RLS, CI pipeline being set up
Apr 10 (Kaichen): trip CRUD tests done, starting security-reviewer agent in .claude/agents/
Apr 14 (Yihan): CI pipeline merged after fixing ESLint flat config issue, Gitleaks added
Apr 14 (Kaichen): PR template with C.L.E.A.R. checklist drafted and merged
Apr 16 (Yihan): worktrees used for parallel development of coverage config and sprint docs, TDD formatters complete
