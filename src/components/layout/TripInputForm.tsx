"use client";

import { useState } from "react";

interface TripFormValues {
  destination: string;
  days: number;
  budget: number;
  style: string;
}

const TRAVEL_STYLES = [
  { label: "🏔️ Adventure", value: "Adventure" },
  { label: "🏛️ Cultural", value: "Cultural" },
  { label: "🌊 Relaxation", value: "Relaxation" },
  { label: "🍜 Foodie", value: "Foodie" },
  { label: "💸 Budget", value: "Budget" },
];

export default function TripInputForm() {
  const [form, setForm] = useState<TripFormValues>({
    destination: "",
    days: 5,
    budget: 2000,
    style: "Cultural",
  });

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Trip submitted:", form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6"
    >
      {/* Top row: Destination + Duration + Budget */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-[2]">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Destination
          </label>
          <input
            type="text"
            placeholder="Tokyo, Japan"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-violet-300 transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Duration
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={form.days}
            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
            className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-violet-300 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Budget (USD)
          </label>
          <input
            type="number"
            min={100}
            step={100}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-violet-300 transition-colors"
          />
        </div>
      </div>

      {/* Travel Style */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Travel Style
        </label>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setForm({ ...form, style: s.value })}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                form.style === s.value
                  ? "bg-violet-50 text-violet-600 border-violet-300"
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all shadow-sm"
      >
        Generate →
      </button>
    </form>
  );
}
