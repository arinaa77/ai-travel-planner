---
name: fix-issue
description: Diagnose and fix a bug in TripMind given an issue number, error message, or description
---

You are fixing a bug in TripMind, an AI travel planner built with Next.js 15 App Router and the Anthropic SDK.

## Step 0: Understand the issue

The user will provide one of:
- A GitHub issue number (e.g. `#12`)
- An error message or stack trace
- A plain description of what is broken

Before touching any code:
1. Restate the bug in one sentence: what is broken, where, and what the expected behavior is
2. Identify the most likely file(s) responsible: check `src/services/`, `src/app/api/`, and `src/components/` first
3. Read those files before proposing any fix

Do not guess. Do not fix code you haven't read.

## Step 1: Reproduce the failure

Check whether a failing test already captures the bug:
```bash
npm run test
``` 

If no test fails, identify the code path that would exercise the bug. Note this: you will need it for Step 3.

## Step 2: Fix the bug

- Make the smallest change that fixes the root cause
- Do not refactor surrounding code, add comments, or improve unrelated logic
- Do not add error handling for scenarios that cannot happen
- If the fix touches an API route, confirm Zod validation is still present
- If the fix touches a service, confirm try/catch is still present
- Do not change TypeScript types to `any` to silence errors: find the real fix

## Step 3: Verify

Run in order:
```bash
npm run test          # all tests must pass
npx tsc --noEmit      # no type errors
```

If a test was already failing before your fix (pre-existing failure unrelated to this bug), note it explicitly: do not fix unrelated tests in the same change.

## Step 4: Summarize

After the fix, provide:
- **Root cause**: one sentence explaining why the bug happened
- **Fix**: what changed and why it resolves it
- **Files changed**: list of modified files
- **Commit message**: in `fix(scope): description` format

## Constraints

- TypeScript strict mode: no `any`, no `@ts-ignore`
- Absolute imports via `@/` alias
- Never inline long strings in service files: keep prompts in `src/services/prompts/`
- Do not create new files unless the fix genuinely requires it
- Do not push or open a PR: leave that to the developer
