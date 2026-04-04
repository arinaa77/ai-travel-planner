# add-feature Skill Changelog

## v2 (Task 2)

### What changed and why

| # | Change | Reason |
|---|---|---|
| 1 | Replaced `generateObject` instruction with explicit `tool_use` + `tool_choice` pattern | `generateObject` is Vercel AI SDK: not available in `@anthropic-ai/sdk`. v1 produced broken code that wouldn't compile. |
| 2 | Fixed API route path to `src/app/api/<name>/route.ts` | v1 omitted the `src/` prefix; routes placed at `app/api/` don't exist in this project. |
| 3 | Added Step 0: check and install `@anthropic-ai/sdk` and `zod` | v1 assumed deps were installed: they weren't, causing runtime errors immediately. |
| 4 | Fixed model name to `claude-sonnet-4-5` | `claude-sonnet-4` is not a valid model ID; API calls failed with an unknown model error. |
| 5 | Removed "no frontend" constraint; added frontend wiring rules | Feature wasn't observable on localhost without a client component. v1 explicitly blocked this work, requiring manual intervention outside the skill. |
| 6 | Added rule: define `Input` interface in service file, import into prompt file | v1 gave no guidance, leading to uncertainty about circular imports when the prompt file needed the service's input type. |

## v1 (Task 1)

Initial skill covering: service file + API route + Zod validation + prompt constants.
See `docs/skills/task1-log.md` for full gap analysis.
