---
name: add-feature
description: Scaffold a new backend feature for TripMind following the service + API route + Zod pattern (v2)
---

You are implementing a new backend feature for TripMind, an AI travel planner built with Next.js 14 App Router, the Anthropic SDK (`@anthropic-ai/sdk`), and Supabase.

## Step 0: Check dependencies

Before writing any code, check `package.json` to confirm `@anthropic-ai/sdk` and `zod` are listed as dependencies. If either is missing, run:

```bash
npm install @anthropic-ai/sdk zod
```

## What to build

The user will name a feature (e.g., "judge evaluation", "trip generation"). You must create:

1. **Prompt file** at `src/services/prompts/<name>Prompt.ts`
2. **Service file** at `src/services/<name>Service.ts`
3. **API route** at `src/app/api/<name>/route.ts`
4. **Frontend wiring** — a minimal client component or hook so the feature is observable on localhost

## Prompt file rules

- Export a `SYSTEM_PROMPT` string constant
- Export a `buildUserPrompt(input: InputType)` function that returns a string
- Import `InputType` from `@/services/<name>Service` — never redefine it here

## Service file rules

- Export one primary async function (e.g., `evaluateTrip`, `generateTrip`)
- Export the `Input` interface for this service — this is what the prompt file imports
- Use `@anthropic-ai/sdk` directly with `client.messages.create`. Do NOT use `generateObject` (that is a Vercel AI SDK function and is not available here)
- For structured output, use tool_use with `tool_choice: { type: "tool", name: "..." }`:

```typescript
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: SYSTEM_PROMPT,
  messages: [{ role: "user", content: buildUserPrompt(input) }],
  tools: [{ name: "submit_result", description: "...", input_schema: { type: "object", properties: { ... }, required: [...] } }],
  tool_choice: { type: "tool", name: "submit_result" },
});

const toolUse = response.content.find((c) => c.type === "tool_use");
if (!toolUse || toolUse.type !== "tool_use") throw new Error("No structured response");
const parsed = ResultSchema.parse(toolUse.input);
```

- Model must be `claude-sonnet-4-5`
- Wrap all logic in try/catch; re-throw as `new Error("descriptive message")`
- Import existing types from `@/lib/mockData` — do not redefine them
- Define the `Input` interface in this file; import it into the prompt file (not the other way around)

## API route rules

- File must export `POST` (named export, not default)
- Path is `src/app/api/<name>/route.ts` (note: `src/` prefix is required)
- First thing: validate request body with a Zod schema before any other logic
- Call the service function; never put business logic in the route handler
- Return `NextResponse.json({ error }, { status })` on failure:
  - 400 for validation errors
  - 500 for service errors
- Never access `process.env.ANTHROPIC_API_KEY` in the route

## Frontend wiring rules

- Create or update a `"use client"` component to call the new route via `fetch`
- Use `useState` for loading, error, and result state
- Wire it so the feature is visible on localhost after implementation
- Do not install TanStack Query just for this — plain `fetch` in a client component is fine unless it's already set up

## Constraints

- TypeScript strict mode: no `any`, no `@ts-ignore`
- Absolute imports via `@/` alias
- No Supabase DB calls unless explicitly requested

## Expected output

Show all files in full. After each file, confirm:
- The Zod schema shape for the Claude response
- The POST body shape
- What a successful response JSON looks like
