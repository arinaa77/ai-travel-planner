# Architecture

## File Structure

```
src/app/api/
  generate/route.ts    ← Single Claude call → itinerary + trip breakdown data
  judge/route.ts       ← LLM-as-judge evaluation
src/services/
  generateService.ts   ← Calls Claude once via tool_use; returns itinerary + budget/attractions/food breakdowns
  judgeService.ts      ← Scores on cost accuracy, diversity, feasibility
src/services/prompts/
  generatePrompt.ts    ← System + user prompt for itinerary generation
  judgePrompt.ts       ← System + user prompt for judge evaluation
src/components/
  TripPlanner.tsx      ← Client component; chains generate → judge with split loading states
  layout/Sidebar.tsx   ← Reads recent trips from localStorage; updates via tripmind_trips_updated event
```

## Key Pattern: Single Claude Call via tool_use

```typescript
// generateService.ts
const result = await generateTrip({ destination, days, budget, style });
// result.itinerary      → ItineraryDay[]
// result.agentOutputs   → budget / attractions / food breakdowns for the panel
```

Use `client.messages.create` with `tool_use` + `tool_choice` for structured JSON from Claude.
`generateObject` is Vercel AI SDK: not available in `@anthropic-ai/sdk`.

## Recent Trips (localStorage)

- Saved to `tripmind_recent_trips` key after each successful generate + judge
- Max 5 entries; newest first
- Sidebar subscribes to `tripmind_trips_updated` window event for live updates
- Will migrate to Supabase when auth is added

## Split Loading UX

Generate and judge are sequential but display independently: trip breakdown renders as soon as generate completes, judge evaluation appears below when ready.

## Database (Supabase)

Core tables: `users`, `trips`, `itinerary_versions`, `evaluations`

Use `@supabase/supabase-js` directly: no ORM. Row Level Security enforces per-user data isolation.

- Never bypass RLS with the service role key in client-side code
- Use the anon key on the client; service role key only in server-side API routes
- Run SQL migrations via `npx supabase db push` or the Supabase dashboard SQL editor
