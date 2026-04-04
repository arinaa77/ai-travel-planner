---
name: add-feature
description: Scaffold a new backend feature for TripMind following the project's service + API route + Zod pattern
---

You are implementing a new backend feature for TripMind, an AI travel planner built with Next.js 14 App Router, Claude API, and Supabase.

## What to build

The user will name a feature (e.g., "judge evaluation", "trip generation"). You must create:

1. **Service file** at `src/services/<name>Service.ts`
2. **API route** at `app/api/<name>/route.ts`

## Service file rules

- Export one primary async function named after the service (e.g., `evaluateTrip`, `generateTrip`)
- Use `generateObject` from the Anthropic SDK with a typed Zod schema to get structured output from Claude
- Model must be `claude-sonnet-4` (from `process.env.ANTHROPIC_API_KEY`)
- Wrap all logic in try/catch; re-throw errors as `new Error("descriptive message")`
- Import types from `@/lib/mockData` if they already exist there — do not redefine them
- Keep prompts in `src/services/prompts/` as named string constants — never inline long prompt strings in the function body

## API route rules

- File must export `POST` (named export, not default)
- First thing: validate request body with a Zod schema before any other logic
- Call the service function, never put business logic directly in the route handler
- Return `NextResponse.json({ error }, { status })` with appropriate HTTP codes on failure:
  - 400 for validation errors
  - 500 for service errors
- Never access `process.env.ANTHROPIC_API_KEY` in the route — that belongs in the service

## Constraints

- TypeScript strict mode: no `any`, no `@ts-ignore`
- Use absolute imports via `@/` alias
- Do not add Supabase DB calls unless the user explicitly asks
- Do not create a frontend hook or component — only the service and route

## Expected output

For each file, show the full file content. After both files, confirm:
- Which Zod schema shapes the Claude response
- What the POST body shape is
- What a successful response JSON looks like
