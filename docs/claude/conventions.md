# Coding Conventions

## General

- **TypeScript strict mode**: no `any`, no `@ts-ignore` without a comment explaining why
- **File naming**: `camelCase.ts` for utilities, `PascalCase.tsx` for components
- **Imports**: absolute paths via `@/` alias (e.g. `@/services/judgeService`)
- **API routes**: always validate input with Zod first, then call service layer
- **Components**: presentational only; no direct DB or API calls inside components
- **Error handling**: all `async` functions in services must have try/catch; surface errors via `NextResponse.json({ error }, { status })` with appropriate HTTP codes
- **Environment variables**: server-only vars (no `NEXT_PUBLIC_`) for API keys; never access `process.env.ANTHROPIC_API_KEY` in client components

## Claude API

- Use `client.messages.create` with `tool_use` + `tool_choice` for structured output
- Model: `claude-sonnet-4-5`
- Keep prompts in `src/services/prompts/` as named constants: never inline long strings in service files
- Define the `Input` interface in the service file; import it into the prompt file

## State & Data Fetching

- Use `useState` + `fetch` in client components for now
- Migrate to TanStack Query when added

## Don'ts

- Don't put `ANTHROPIC_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_` vars
- Don't call Supabase directly from React components or Client Components
- Don't use `any` type: use `unknown` and narrow with Zod or type guards
- Don't create new API routes without Zod validation
- Don't stream output to the client without sanitizing for XSS
- Don't commit `.env.local`: use Vercel env dashboard for CI vars
- Don't add separate agent files: `generateService.ts` handles all breakdowns in one Claude call
