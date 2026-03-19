// src/lib/mockData.ts
// Static mock data for UI development — swap these for real API calls later

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType = "travel" | "sight" | "food" | "hotel"

export interface ItineraryEvent {
  id: string
  time: string
  title: string
  subtitle: string
  type: EventType
  cost: number | null // null = free
}

export interface ItineraryDay {
  day: number
  title: string
  events: ItineraryEvent[]
}

export type AgentStatus = "idle" | "running" | "done" | "error"

export interface AgentItem {
  label: string
  value: string
}

export interface AgentOutput {
  id: "budget" | "attractions" | "food"
  name: string
  status: AgentStatus
  items: AgentItem[]
}

export interface JudgeScore {
  dimension: string
  score: number // 0–100
  reasoning: string
}

export interface JudgeEvaluation {
  overallScore: number
  scores: JudgeScore[]
  verdict: string
  model: string
  evaluatedAt: string
}

export interface Trip {
  id: string
  destination: string
  days: number
  budget: number
  totalCost: number
  interests: string[]
  itinerary: ItineraryDay[]
  agentOutputs: AgentOutput[]
  evaluation: JudgeEvaluation
  createdAt: string
}

// ─── Mock itinerary ────────────────────────────────────────────────────────────

export const MOCK_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival & Shinjuku",
    events: [
      {
        id: "d1-e1",
        time: "07:30",
        title: "Arrive Narita Airport",
        subtitle: "Narita Express to Shinjuku · 90 min",
        type: "travel",
        cost: 420,
      },
      {
        id: "d1-e2",
        time: "11:00",
        title: "Check in — Shinjuku hotel",
        subtitle: "3 nights · central location",
        type: "hotel",
        cost: 210,
      },
      {
        id: "d1-e3",
        time: "13:00",
        title: "Meiji Shrine",
        subtitle: "2 hrs · forested walk · serene",
        type: "sight",
        cost: null,
      },
      {
        id: "d1-e4",
        time: "15:30",
        title: "Shinjuku Gyoen Garden",
        subtitle: "1.5 hrs · seasonal garden",
        type: "sight",
        cost: 2,
      },
      {
        id: "d1-e5",
        time: "19:00",
        title: "Ichiran Ramen",
        subtitle: "Solo booth · Shinjuku · iconic",
        type: "food",
        cost: 12,
      },
    ],
  },
  {
    day: 2,
    title: "Tsukiji, Akihabara & Senso-ji",
    events: [
      {
        id: "d2-e1",
        time: "08:00",
        title: "Tsukiji Outer Market",
        subtitle: "Breakfast · fresh sushi & tamagoyaki",
        type: "food",
        cost: 10,
      },
      {
        id: "d2-e2",
        time: "10:30",
        title: "Senso-ji Temple",
        subtitle: "Asakusa · oldest temple in Tokyo",
        type: "sight",
        cost: null,
      },
      {
        id: "d2-e3",
        time: "13:00",
        title: "Nakamise-dori street food",
        subtitle: "Lunch · ningyo-yaki, melonpan",
        type: "food",
        cost: 8,
      },
      {
        id: "d2-e4",
        time: "15:00",
        title: "Akihabara electronics district",
        subtitle: "2 hrs · browse & shopping",
        type: "sight",
        cost: null,
      },
      {
        id: "d2-e5",
        time: "19:30",
        title: "Izakaya dinner, Ueno",
        subtitle: "Yakitori, sake · casual",
        type: "food",
        cost: 18,
      },
    ],
  },
  {
    day: 3,
    title: "Shibuya, teamLab & Departure",
    events: [
      {
        id: "d3-e1",
        time: "09:00",
        title: "Shibuya Crossing",
        subtitle: "Morning walk · best before crowds",
        type: "sight",
        cost: null,
      },
      {
        id: "d3-e2",
        time: "10:30",
        title: "teamLab Planets",
        subtitle: "2 hrs · immersive digital art",
        type: "sight",
        cost: 32,
      },
      {
        id: "d3-e3",
        time: "13:30",
        title: "Harajuku — Takeshita Street",
        subtitle: "Crepes, browse, last shopping",
        type: "food",
        cost: 6,
      },
      {
        id: "d3-e4",
        time: "17:00",
        title: "Return to Narita Airport",
        subtitle: "Allow 2.5 hrs for check-in",
        type: "travel",
        cost: null,
      },
    ],
  },
]

// ─── Mock agent outputs ────────────────────────────────────────────────────────

export const MOCK_AGENT_OUTPUTS: AgentOutput[] = [
  {
    id: "budget",
    name: "Budget agent",
    status: "done",
    items: [
      { label: "Flights (round trip)", value: "$420" },
      { label: "Hotel · 3 nights", value: "$210" },
      { label: "Food budget", value: "$54" },
      { label: "Activities", value: "$34" },
      { label: "Total", value: "$718" },
    ],
  },
  {
    id: "attractions",
    name: "Attractions agent",
    status: "done",
    items: [
      { label: "Day 1", value: "Shinjuku + Meiji Shrine" },
      { label: "Day 2", value: "Akihabara + Senso-ji" },
      { label: "Day 3", value: "Shibuya + teamLab" },
    ],
  },
  {
    id: "food",
    name: "Food agent",
    status: "done",
    items: [
      { label: "Day 1 dinner", value: "Ichiran Ramen" },
      { label: "Day 2 breakfast", value: "Tsukiji Market" },
      { label: "Day 3 lunch", value: "Harajuku crepes" },
    ],
  },
]

// ─── Mock judge evaluation ─────────────────────────────────────────────────────

export const MOCK_EVALUATION: JudgeEvaluation = {
  overallScore: 86,
  scores: [
    {
      dimension: "Cost accuracy",
      score: 92,
      reasoning:
        "Total estimated cost of $718 is within 10% of the $800 budget. Flight and hotel costs are realistic for the season.",
    },
    {
      dimension: "Diversity",
      score: 78,
      reasoning:
        "Good mix of cultural sights, food experiences, and modern attractions. Score docked for two consecutive temple visits on Day 2 — recommend spacing with a neighbourhood walk.",
    },
    {
      dimension: "Feasibility",
      score: 88,
      reasoning:
        "All travel times between events are realistic using Tokyo's subway system. Day 3 airport departure at 17:00 allows sufficient buffer.",
    },
  ],
  verdict:
    "Strong itinerary with accurate budget and good variety. Minor diversity penalty for back-to-back cultural sites on Day 2.",
  model: "claude-sonnet-4-5",
  evaluatedAt: "2026-03-19T10:30:00Z",
}

// ─── Mock full trip ────────────────────────────────────────────────────────────

export const MOCK_TRIP: Trip = {
  id: "trip-tokyo-001",
  destination: "Tokyo, Japan",
  days: 3,
  budget: 800,
  totalCost: 718,
  interests: ["food", "culture", "technology"],
  itinerary: MOCK_ITINERARY,
  agentOutputs: MOCK_AGENT_OUTPUTS,
  evaluation: MOCK_EVALUATION,
  createdAt: "2026-03-19T10:00:00Z",
}

// ─── Mock sidebar trips ────────────────────────────────────────────────────────

export const MOCK_RECENT_TRIPS = [
  { id: "trip-tokyo-001", destination: "Tokyo", days: 3, score: 86 },
  { id: "trip-kyoto-001", destination: "Kyoto", days: 5, score: 91 },
  { id: "trip-osaka-001", destination: "Osaka", days: 2, score: 79 },
]

export const MOCK_SAVED_TRIPS = [
  { id: "trip-seoul-001", destination: "Seoul", days: 4, score: 88 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTotalCost(itinerary: ItineraryDay[]): number {
  return itinerary
    .flatMap((day) => day.events)
    .reduce((sum, event) => sum + (event.cost ?? 0), 0)
}

export function getBudgetRemaining(budget: number, itinerary: ItineraryDay[]): number {
  return budget - getTotalCost(itinerary)
}

export function getOverallScore(evaluation: JudgeEvaluation): number {
  return Math.round(
    evaluation.scores.reduce((sum, s) => sum + s.score, 0) / evaluation.scores.length
  )
}