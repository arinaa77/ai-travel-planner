import { AgentOutput, AgentStatus } from "@/lib/mockData";

// ─── Accent config ─────────────────────────────────────────────────────────────

interface AccentConfig {
  border: string;
  dot: string;
  value: string;
}

const ACCENT_MAP: Record<string, AccentConfig> = {
  budget:      { border: "border-t-violet-500", dot: "bg-violet-500",  value: "text-violet-600" },
  attractions: { border: "border-t-orange-500", dot: "bg-orange-500",  value: "text-orange-600" },
  food:        { border: "border-t-emerald-500", dot: "bg-emerald-500", value: "text-emerald-600" },
  _fallback:   { border: "border-t-gray-400",   dot: "bg-gray-400",    value: "text-gray-600" },
};

function getAccent(id: string): AccentConfig {
  return ACCENT_MAP[id] ?? ACCENT_MAP._fallback;
}

// ─── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AgentStatus, { dot: string; text: string; label: string }> = {
  idle:    { dot: "bg-gray-300",                    text: "text-gray-400",    label: "Idle" },
  running: { dot: "bg-yellow-400 animate-pulse",    text: "text-yellow-600",  label: "Running…" },
  done:    { dot: "bg-emerald-400",                 text: "text-emerald-600", label: "Done" },
  error:   { dot: "bg-red-400",                     text: "text-red-500",     label: "Error" },
};

function StatusBadge({ status }: { status: AgentStatus }) {
  const { dot, text, label } = STATUS_CONFIG[status];
  return (
    <span className={`flex items-center gap-1.5 text-sm font-medium ${text}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

// ─── Agent card ────────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: AgentOutput }) {
  const accent = getAccent(agent.id);
  const isRunning = agent.status === "running";
  const isError = agent.status === "error";

  const ringClass =
    isRunning ? `ring-2 ring-offset-1 ${accent.dot.replace("bg-", "ring-")}` :
    isError   ? "ring-2 ring-offset-1 ring-red-300" :
    "";

  return (
    <div className={`bg-white border border-gray-200 border-t-4 rounded-xl overflow-hidden ${accent.border} ${ringClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-800">{agent.name}</h3>
        <StatusBadge status={agent.status} />
      </div>

      {/* Item list */}
      <div className="px-5 pb-4 border-t border-gray-100">
        {isError ? (
          <p className="py-3 text-sm text-red-400">Agent failed to respond.</p>
        ) : isRunning && agent.items.length === 0 ? (
          // Skeleton rows
          <div className="flex flex-col gap-3 pt-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : agent.items.length === 0 ? (
          <p className="py-3 text-sm text-gray-400">No recommendations available.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {agent.items.map((item, i) => {
              const isLast = i === agent.items.length - 1;
              const highlight = isLast && agent.id === "budget";
              return (
                <li key={i} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span className={`text-sm truncate ${highlight ? "font-semibold text-gray-800" : "text-gray-400"}`}>
                    {item.label}
                  </span>
                  <span className={`text-sm font-semibold shrink-0 truncate ${highlight ? accent.value : "text-gray-800"}`}>
                    {item.value}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Panel ─────────────────────────────────────────────────────────────────────

interface AgentDebatePanelProps {
  agents: AgentOutput[];
}

export default function AgentDebatePanel({ agents }: AgentDebatePanelProps) {
  return (
    <section>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Trip breakdown
      </p>
      {agents.length === 0 ? (
        <p className="text-sm text-gray-400">No agents active.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </section>
  );
}
