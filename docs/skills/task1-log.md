# Task 1 Session Log: Skill v1

**Skill used:** `.claude/skills/add-feature.md` (v1)
**Feature built:** LLM-as-judge evaluation
**Files produced:**
- `src/services/prompts/judgePrompt.ts`
- `src/services/judgeService.ts`
- `src/app/api/judge/route.ts`
- `src/components/judge/JudgeScoreCard.tsx` (styled)
- `src/components/judge/ScoreBar.tsx` (styled)
- `src/components/judge/ReasoningAccordion.tsx` (styled)
- `src/components/TripPlanner.tsx` (frontend wiring)
- `src/components/layout/TripInputForm.tsx` (added `onGenerate` prop)
- `src/app/page.tsx` (updated to use TripPlanner)

---

## What the skill got right

- Correctly scaffolded `judgeService.ts` + `app/api/judge/route.ts` as separate files
- Zod validation was applied at the route boundary before calling the service
- Try/catch with re-thrown errors in the service layer
- Prompts extracted to `src/services/prompts/judgePrompt.ts` as named constants
- Types imported from `@/lib/mockData` rather than redefined

---

## What the skill got wrong or missed

### 1. Wrong SDK method: `generateObject` doesn't exist in `@anthropic-ai/sdk`
The skill said: _"Use `generateObject` with a typed Zod schema"_

This is a Vercel AI SDK function, not the Anthropic SDK. Since the project uses `@anthropic-ai/sdk` directly, the correct approach is `client.messages.create` with `tool_use` + `tool_choice: { type: "tool", name: "..." }`. The skill gave no guidance on this.

### 2. Wrong API route path
The skill said: _"API route at `app/api/<name>/route.ts`"_

The actual path in this project is `src/app/api/<name>/route.ts`. The `src/` prefix is required.

### 3. No mention of package installation
The skill assumed `@anthropic-ai/sdk` and `zod` were already installed. They were not. The skill should note to check `package.json` and install missing deps before scaffolding.

### 4. Model name was wrong
The skill said: _"Model must be `claude-sonnet-4`"_

The correct model ID is `claude-sonnet-4-5` (or `claude-sonnet-4-6`). `claude-sonnet-4` alone is not a valid model string.

### 5. Scope was too narrow: didn't cover frontend wiring
The skill explicitly said: _"Do not create a frontend hook or component"_

In practice, the feature isn't observable on localhost without wiring the frontend. A `TripPlanner` client component and an `onGenerate` prop on `TripInputForm` were both needed. The skill should either include frontend wiring as a step or clarify that a separate task handles it.

### 6. No guidance on exported types across files
The `EvaluateInput` interface is defined in `judgeService.ts` and imported in `judgePrompt.ts`. The skill gave no guidance on where to define shared input types to avoid circular imports.

---

## v1 → v2 improvements to make

- Replace `generateObject` instruction with the correct `tool_use` pattern for `@anthropic-ai/sdk`
- Fix route path to include `src/` prefix
- Add a step: check `package.json` for `@anthropic-ai/sdk` and `zod`; install if missing
- Fix model name to `claude-sonnet-4-5`
- Remove the "no frontend" constraint: replace with: scaffold service + route first, then wire a minimal client component if needed for localhost verification
- Add guidance: define the `Input` interface in the service file and import it into the prompt file
