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
- Apr 10 (Yihan): auth routes done, starting MyTripsPanel, tests will follow after
- Apr 10 (Kaichen): reviewing auth PR, will write trip CRUD tests
- Apr 14 (Yihan): CI pipeline merged, fixing eslint flat config issue
- Apr 14 (Kaichen): Gitleaks config added, PR template drafted
- Apr 16 (Yihan): worktrees set up for coverage + sprint docs, TDD formatters complete
