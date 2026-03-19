import { MOCK_RECENT_TRIPS, MOCK_SAVED_TRIPS, MOCK_TRIP } from "@/lib/mockData";

const DOT_CLASSES = [
  "bg-violet-400",
  "bg-orange-400",
  "bg-emerald-400",
  "bg-pink-400",
];

export default function Sidebar() {
  const budgetUsed = MOCK_TRIP.totalCost;
  const budgetTotal = MOCK_TRIP.budget;
  const budgetPct = Math.round((budgetUsed / budgetTotal) * 100);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
      <div className="flex flex-col gap-8 p-5 flex-1">

        {/* Recent Trips */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Recent trips
          </p>
          <div className="flex flex-col gap-1">
            {MOCK_RECENT_TRIPS.map((trip, i) => (
              <button
                key={trip.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                  i === 0
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_CLASSES[i]}`} />
                {trip.destination} · {trip.days} days
              </button>
            ))}
          </div>
        </div>

        {/* Saved */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Saved
          </p>
          <div className="flex flex-col gap-1">
            {MOCK_SAVED_TRIPS.map((trip, i) => (
              <button
                key={trip.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all text-left w-full"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_CLASSES[MOCK_RECENT_TRIPS.length + i]}`} />
                {trip.destination} · {trip.days} days
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Budget Used */}
      <div className="p-5 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Budget used
        </p>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-600">${budgetUsed} of ${budgetTotal}</span>
          <span className="font-bold text-violet-500">{budgetPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-400"
            style={{ width: `${budgetPct}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
