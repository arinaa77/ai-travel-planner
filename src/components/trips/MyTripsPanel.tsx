"use client";

import { useEffect, useState } from "react";

interface Trip {
  id: string;
  destination: string;
  days: number;
  score: number;
  created_at: string;
}

interface MyTripsPanelProps {
  onClose: () => void;
}

function scoreLabel(score: number): { label: string; className: string } | null {
  if (score >= 85) return { label: "Top rated", className: "text-violet-500 bg-violet-50" };
  if (score >= 70) return { label: "Recommended", className: "text-emerald-600 bg-emerald-50" };
  return null;
}

export default function MyTripsPanel({ onClose }: MyTripsPanelProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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

  async function handleLoad(trip: Trip) {
    setLoadingId(trip.id);
    try {
      const res = await fetch(`/api/trips/${trip.id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Failed to load trip. Please try again.");
        return;
      }
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
      onClose();
    } finally {
      setLoadingId(null);
    }
  }

  function handleDeleteClick(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setConfirmingId(id);
  }

  async function handleDeleteConfirm(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setConfirmingId(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Failed to delete trip. Please try again.");
        return;
      }
      setTrips((prev) => prev.filter((t) => t.id !== id));
      window.dispatchEvent(new Event("tripmind_trips_updated"));
    } finally {
      setDeletingId(null);
    }
  }

  function handleDeleteCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmingId(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      {/* backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-800">My Trips</h2>
            <p className="text-xs text-gray-400 mt-0.5">{trips.length} saved itineraries</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-lg"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {loading && <p className="text-sm text-gray-400 animate-pulse">Loading…</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && trips.length === 0 && (
            <p className="text-sm text-gray-300">
              No saved trips yet. Generate one to get started!
            </p>
          )}
          {!loading && !error && trips.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => {
                const tag = scoreLabel(trip.score);
                return (
                  <div
                    key={trip.id}
                    onClick={() => confirmingId !== trip.id && handleLoad(trip)}
                    className="group relative bg-gray-50 hover:bg-violet-50 border border-gray-100 hover:border-violet-200 rounded-2xl p-5 cursor-pointer transition-all"
                  >
                    {confirmingId === trip.id ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-gray-700">Delete this trip?</p>
                        <p className="text-xs text-gray-400">This cannot be undone.</p>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleDeleteConfirm(e, trip.id)}
                            disabled={deletingId === trip.id}
                            className="flex-1 py-1.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-red-400 to-pink-400 hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            {deletingId === trip.id ? "Deleting…" : "Yes, delete"}
                          </button>
                          <button
                            onClick={handleDeleteCancel}
                            className="flex-1 py-1.5 text-xs font-semibold rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-100 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleDeleteClick(e, trip.id)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all text-sm"
                          aria-label="Delete trip"
                        >
                          ×
                        </button>

                        <p className="text-base font-bold text-gray-800 truncate pr-6">
                          {loadingId === trip.id ? "Loading…" : trip.destination}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{trip.days} days</p>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs font-semibold text-gray-500">
                            Score {trip.score}
                          </span>
                          {tag && (
                            <span
                              className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${tag.className}`}
                            >
                              {tag.label}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-300 mt-2">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
