# Exploration Notes: AgentDebatePanel

**Task**: Implement `src/components/debate/AgentDebatePanel.tsx`

---

## Commands Run

### Glob patterns
```
src/components/**/*.tsx      → found Topbar, Sidebar, TripInputForm
src/lib/**/*.ts              → found mockData.ts
src/app/**/*.tsx             → found layout.tsx, page.tsx
src/**/*.ts                  → found no service/hook files yet (empty dirs)
```

### Files read
- `src/lib/mockData.ts` — types + mock data
- `src/components/layout/Sidebar.tsx` — style reference
- `src/components/layout/Topbar.tsx` — style reference
- `src/components/layout/TripInputForm.tsx` — style reference
- `src/app/layout.tsx` — root layout structure
- `src/app/page.tsx` — home page
- `README.md` — feature list and planned architecture
- `CLAUDE.md` — conventions and architecture rules

---

## What We Found

### Component structure
```
src/components/
  layout/
    Topbar.tsx          ← fixed header; nav buttons (non-functional)
    Sidebar.tsx         ← recent trips, saved trips, budget tracker
    TripInputForm.tsx   ← destination/duration/budget/style inputs
  debate/               ← empty; target for AgentDebatePanel
  itinerary/            ← empty; planned for ItineraryTimeline
  judge/                ← empty; planned for JudgeScoreCard
```

### Relevant types (from `src/lib/mockData.ts`)
```typescript
type AgentStatus = "idle" | "running" | "done" | "error"

interface AgentItem {
  label: string
  value: string
}

interface AgentOutput {
  id: "budget" | "attractions" | "food"
  name: string
  status: AgentStatus
  items: AgentItem[]
}
```

### Mock data shape (`MOCK_AGENT_OUTPUTS`)
- **Budget agent** (done): 5 items — Flights, Hotel, Food budget, Activities, Total
- **Attractions agent** (done): 3 items — Day 1/2/3 sight recommendations
- **Food agent** (done): 3 items — Day 1/2/3 restaurant picks

### Design system observed in existing components
- White cards (`bg-white`) with `border border-gray-100` and `rounded-2xl`
- Section labels: `text-xs font-bold text-gray-400 uppercase tracking-widest`
- Accent palette used in Sidebar for trip dots:
  - `bg-violet-400` (index 0 / budget)
  - `bg-orange-400` (index 1 / attractions)
  - `bg-emerald-400` (index 2 / food)
- Gradient: `from-violet-400 to-pink-400` used in budget progress bar
- Background: `#f5f5f7` (light gray page background)
- Font: Inter (globals.css) — DM Sans/DM Serif planned per CLAUDE.md but not yet applied

### Architecture constraints (from CLAUDE.md)
- Components must be **presentational only** — no direct DB or API calls
- No `any` types; use exported types from `@/lib/mockData`
- Absolute imports via `@/` alias
- No inline long strings; keep logic minimal in components

---

## Decisions Made

| Decision | Rationale |
|---|---|
| Accept `agents: AgentOutput[]` as prop | Keeps component presentational; caller supplies data |
| Map agent `id` to accent color | Reuses violet/orange/emerald palette already established in Sidebar |
| Render status as a badge | Four statuses need distinct visual treatment; badge pattern is compact |
| Animate `running` status | `animate-pulse` gives live feedback with zero extra JS |
| `grid-cols-1 sm:grid-cols-3` layout | 3 agents side-by-side on desktop; stacks on mobile |
| Empty-state message per card | `items` could be empty during `idle`/`running`; avoid blank card |
| `divide-y divide-gray-50` between items | Low-contrast separator keeps list readable without heavy borders |
