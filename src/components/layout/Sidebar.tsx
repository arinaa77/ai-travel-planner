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

async function fetchRecentTrips(): Promise<RecentTrip[]> {
  const res = await fetch("/api/trips");
  if (!res.ok) return [];
  const { trips } = await res.json();
  return trips ?? [];
}

export default function Sidebar() {
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);

  useEffect(() => {
    fetchRecentTrips().then(setRecentTrips);
    const handler = () => fetchRecentTrips().then(setRecentTrips);
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
          {recentTrips.length === 0 ? (
            <p className="text-xs text-gray-300 px-3">No trips yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentTrips.map((trip, i) => (
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
