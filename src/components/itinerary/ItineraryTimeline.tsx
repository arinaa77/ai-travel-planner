"use client";

import { useState } from "react";
import { ItineraryDay, ItineraryEvent, EventType } from "@/lib/mockData";

// Type config

const TYPE_CONFIG: Record<EventType, { dot: string; badge: string; label: string }> = {
  travel: { dot: "bg-blue-400", badge: "text-blue-500 bg-blue-50", label: "Travel" },
  sight: { dot: "bg-orange-400", badge: "text-orange-500 bg-orange-50", label: "Sight" },
  food: { dot: "bg-emerald-400", badge: "text-emerald-600 bg-emerald-50", label: "Food" },
  hotel: { dot: "bg-violet-400", badge: "text-violet-500 bg-violet-50", label: "Hotel" },
};

function formatItineraryAsText(days: ItineraryDay[]): string {
  return days
    .map((day) => {
      const events = day.events
        .map(
          (e) =>
            `  ${e.time}  ${e.title} — ${e.subtitle} (${e.cost === null ? "Free" : `$${e.cost}`})`
        )
        .join("\n");
      return `Day ${day.day}: ${day.title}\n${events}`;
    })
    .join("\n\n");
}

// Event row

function EventRow({ event }: { event: ItineraryEvent }) {
  const config = TYPE_CONFIG[event.type];
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 w-10 shrink-0 pt-0.5">{event.time}</span>
      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{event.title}</span>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${config.badge}`}>
            {config.label}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{event.subtitle}</p>
      </div>
      <span className="text-sm font-semibold text-gray-700 shrink-0">
        {event.cost === null ? "Free" : `$${event.cost}`}
      </span>
    </div>
  );
}

// Day section

function DaySection({ day }: { day: ItineraryDay }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Day {day.day} · {day.title}
      </p>
      <div>
        {day.events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

// Timeline

interface Props {
  days: ItineraryDay[];
}

export default function ItineraryTimeline({ days }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(formatItineraryAsText(days));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-800">Full itinerary</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy itinerary"}
          </button>
        </div>
      </div>

      {days.map((day) => (
        <DaySection key={day.day} day={day} />
      ))}
    </div>
  );
}
