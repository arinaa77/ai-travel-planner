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

async function fetchRecentTrips(): Promise<TripState> {
  const res = await fetch("/api/trips?limit=5");
  if (res.status === 401) return { status: "unauthenticated" };
  if (!res.ok) return { status: "loaded", trips: [] };
  const { trips } = await res.json();
  return { status: "loaded", trips: trips ?? [] };
}

export default function Sidebar() {
  const [state, setState] = useState<TripState>({ status: "unauthenticated" });

  useEffect(() => {
    fetchRecentTrips().then(setState);
    const handler = () => fetchRecentTrips().then(setState);
    window.addEventListener("tripmind_trips_updated", handler);
    return () => window.removeEventListener("tripmind_trips_updated", handler);
  }, []);

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
              {state.trips.map((trip: RecentTrip, i: number) => (
                <button
                  key={trip.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                    i === 0
                      ? "bg-violet-50 text-violet-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_CLASSES[i % DOT_CLASSES.length]}`} />
                  {trip.destination} · {trip.days}d
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
