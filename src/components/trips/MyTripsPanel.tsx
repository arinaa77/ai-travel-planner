"use client";

import { useEffect, useState } from "react";

interface Trip {
  id: string;
  destination: string;
  days: number;
  score: number;
  created_at: string;
}

const DOT_CLASSES = [
  "bg-violet-400",
  "bg-orange-400",
  "bg-emerald-400",
  "bg-pink-400",
  "bg-blue-400",
];

interface MyTripsPanelProps {
  onClose: () => void;
}

export default function MyTripsPanel({ onClose }: MyTripsPanelProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/trips")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTrips(data.trips ?? []);
      })
      .catch(() => setError("Failed to load trips"))
      .finally(() => setLoading(false));
  }, []);

  async function handleLoad(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/trips/${id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Failed to load trip. Please try again.");
        return;
      }
      const { itinerary, agent_outputs, evaluation } = data.trip;
      window.dispatchEvent(
        new CustomEvent("tripmind_load_trip", {
          detail: { id, itinerary, agentOutputs: agent_outputs, evaluation },
        })
      );
      onClose();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await fetch(`/api/trips/${id}`, { method: "DELETE" });
      setTrips((prev) => prev.filter((t) => t.id !== id));
      window.dispatchEvent(new Event("tripmind_trips_updated"));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* panel */}
      <div className="relative w-80 h-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">My trips</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <p className="text-sm text-gray-400 animate-pulse px-2 pt-2">Loading…</p>
          )}
          {error && (
            <p className="text-sm text-red-400 px-2 pt-2">{error}</p>
          )}
          {!loading && !error && trips.length === 0 && (
            <p className="text-sm text-gray-300 px-2 pt-2">No saved trips yet.</p>
          )}
          {!loading && !error && trips.length > 0 && (
            <div className="flex flex-col gap-1">
              {trips.map((trip, i) => (
                <div
                  key={trip.id}
                  onClick={() => handleLoad(trip.id)}
                  className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_CLASSES[i % DOT_CLASSES.length]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {loadingId === trip.id ? "Loading…" : trip.destination}
                    </p>
                    <p className="text-xs text-gray-400">
                      {trip.days}d · score {trip.score}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, trip.id)}
                    disabled={deletingId === trip.id}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none disabled:opacity-40"
                    aria-label="Delete trip"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
