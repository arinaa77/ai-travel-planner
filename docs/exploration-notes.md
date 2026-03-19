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

## Plan

### Sub-components (single file)
Three internal components, one default export — no barrel file needed.

```
AgentDebatePanel        ← default export; receives agents: AgentOutput[]
  AgentCard             ← internal; one card per agent
    StatusBadge         ← internal; renders status text + dot indicator
```

### Props interface
```typescript
// Public
interface AgentDebatePanelProps {
  agents: AgentOutput[];
}

// Internal lookup type
interface AccentConfig {
  border: string;   // e.g. "border-t-violet-500"  — top border color
  dot: string;      // e.g. "bg-violet-500"         — status dot
  value: string;    // e.g. "text-violet-600"        — accent value color (e.g. Total row)
  done: string;     // e.g. "text-emerald-500"       — "Done" status text color
}
```

Agent id → AccentConfig lookup map (avoids conditional chains in JSX):
| id | border | accent |
|---|---|---|
| `budget` | `border-t-violet-500` | violet |
| `attractions` | `border-t-orange-500` | orange |
| `food` | `border-t-emerald-500` | emerald |
| fallback | `border-t-gray-400` | gray |

### Card layout (informed by sample design)
```
<div> white card, border, rounded-xl, border-t-4 in accent color
  ├── header row (flex justify-between, py-4 px-5)
  │   ├── <h3> agent.name  — font-semibold text-gray-800
  │   └── <StatusBadge>    — small dot + colored status text
  └── item list (px-5 pb-4, divide-y divide-gray-100)
      └── per item (flex justify-between py-2.5)
          ├── label  — text-sm text-gray-400
          └── value  — text-sm font-semibold text-gray-800
              (last item / "Total": accent color instead of gray-800)
```

### Status variants
| Status | Dot | Text | Card modifier |
|---|---|---|---|
| `idle` | `bg-gray-300` | `text-gray-400` "Idle" | none |
| `running` | `bg-yellow-400 animate-pulse` | `text-yellow-600` "Running…" | `ring-2 ring-offset-1` in accent color |
| `done` | `bg-emerald-400` | `text-emerald-600` "Done" | none |
| `error` | `bg-red-400` | `text-red-500` "Error" | `ring-2 ring-offset-1 ring-red-300` |

### Edge cases
- **`agents` empty** → "No agents active." message instead of blank grid
- **`running` + empty items** → 3 skeleton placeholder rows (`animate-pulse`)
- **`running` + partial items** → show real items (skeletons only when `items.length === 0`)
- **`done` + empty items** → "No recommendations available." in `text-gray-400`
- **Unknown `id`** → fallback gray `AccentConfig`
- **Long strings** → `truncate` on value span to prevent card overflow
- **SSR-safe** → no browser APIs; no `"use client"` needed

### Layout
```
<section>
  <p> "AGENT OUTPUTS"  — section label (uppercase, tracking-widest, text-gray-400)
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    AgentCard (budget)
    AgentCard (attractions)
    AgentCard (food)
```

---

## Implementation

**Files created/modified:**
- `src/components/debate/AgentDebatePanel.tsx` — new component (single file with `StatusBadge`, `AgentCard`, `AgentDebatePanel`)
- `src/app/page.tsx` — added `AgentDebatePanel` below `TripInputForm`, widened container from `max-w-2xl` to `max-w-5xl`

**What was built:**
- `AgentDebatePanel` accepts `agents: AgentOutput[]` and renders a `sm:grid-cols-3` grid of cards
- Each `AgentCard` has a `border-t-4` accent color (violet/orange/emerald), agent name, `StatusBadge`, and item list
- Last item in each card renders with bold label + accent-colored value (matching the "Total" row in the sample design)
- `StatusBadge` shows a colored dot + status text; `running` state pulses and shows skeleton rows when `items` is empty
- Error state swaps the item list for a plain error message and adds a red ring to the card
- `MOCK_AGENT_OUTPUTS` passed in from `src/lib/mockData` for development

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
