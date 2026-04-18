"use client";

import { useEffect, useState } from "react";

const DOT_CLASSES = [
  "bg-violet-400",
  "bg-orange-400",
  "bg-emerald-400",
  "bg-pink-400",
  "bg-blue-400",
];

interface RecentTrip {
  id: string;
  destination: string;
  days: number;
  score: number;
}

type TripState = { status: "unauthenticated" } | { status: "loaded"; trips: RecentTrip[] };

interface TripTag {
  label: string;
  className: string;
}

function getTripTag(score: number): TripTag | null {
  if (score >= 85) return { label: "Top rated", className: "text-violet-500 bg-violet-50" };
  if (score >= 70) return { label: "Recommended", className: "text-emerald-600 bg-emerald-50" };
  return null;
}

async function fetchRecentTrips(): Promise<TripState> {
  const res = await fetch("/api/trips?limit=5");
  if (res.status === 401) return { status: "unauthenticated" };
  if (!res.ok) return { status: "loaded", trips: [] };
  const { trips } = await res.json();
  return { status: "loaded", trips: trips ?? [] };
}

export default function Sidebar() {
  const [state, setState] = useState<TripState>({ status: "unauthenticated" });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentTrips().then(setState);
    const handler = () => fetchRecentTrips().then(setState);
    window.addEventListener("tripmind_trips_updated", handler);
    return () => window.removeEventListener("tripmind_trips_updated", handler);
  }, []);

  async function handleLoad(trip: RecentTrip) {
    setLoadingId(trip.id);
    try {
      const res = await fetch(`/api/trips/${trip.id}`);
      const data = await res.json();
      if (!res.ok || data.error) return;
      const { itinerary, agent_outputs, evaluation } = data.trip;
      window.dispatchEvent(
        new CustomEvent("tripmind_load_trip", {
          detail: {
            id: trip.id,
            itinerary,
            agentOutputs: agent_outputs,
            evaluation,
            destination: trip.destination,
            days: trip.days,
          },
        })
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
      <div className="flex flex-col gap-8 p-5 flex-1">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Recent trips
          </p>
          {state.status === "unauthenticated" ? (
            <p className="text-xs text-gray-300 px-3">Sign in to see your trips</p>
          ) : state.trips.length === 0 ? (
            <p className="text-xs text-gray-300 px-3">No trips yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {state.trips.map((trip: RecentTrip, i: number) => {
                const tag = getTripTag(trip.score);
                return (
                  <button
                    key={trip.id}
                    onClick={() => handleLoad(trip)}
                    disabled={loadingId === trip.id}
                    className={`flex flex-col gap-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full disabled:opacity-50 ${
                      i === 0 ? "bg-violet-50 text-violet-600" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_CLASSES[i % DOT_CLASSES.length]}`}
                      />
                      {loadingId === trip.id ? "Loading…" : `${trip.destination} · ${trip.days}d`}
                    </div>
                    {tag && (
                      <span
                        className={`ml-5 text-xs font-semibold px-1.5 py-0.5 rounded-md w-fit ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
