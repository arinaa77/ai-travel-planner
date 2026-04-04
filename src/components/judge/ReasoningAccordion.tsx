"use client";

import { useState } from "react";
import { JudgeScore } from "@/lib/mockData";

interface Props {
  scores: JudgeScore[];
  verdict: string;
}

export default function ReasoningAccordion({ scores, verdict }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-100 pt-4">
      {/* Verdict */}
      <p className="text-sm text-gray-600 mb-3">{verdict}</p>

      {/* Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-semibold text-violet-500 hover:text-violet-600 transition-colors"
      >
        {open ? "Hide reasoning ↑" : "Show reasoning ↓"}
      </button>

      {/* Expanded reasoning */}
      {open && (
        <div className="mt-4 flex flex-col gap-4">
          {scores.map((s) => (
            <div key={s.dimension}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                {s.dimension}
              </p>
              <p className="text-sm text-gray-600">{s.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
