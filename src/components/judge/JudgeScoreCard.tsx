import { JudgeEvaluation } from "@/lib/mockData";
import ScoreBar from "./ScoreBar";
import ReasoningAccordion from "./ReasoningAccordion";

interface Props {
  evaluation: JudgeEvaluation;
}

const DIMENSION_COLORS: Record<string, string> = {
  "Cost accuracy": "bg-blue-500",
  "Diversity": "bg-amber-400",
  "Feasibility": "bg-emerald-500",
};

function getFallbackColor(index: number) {
  const colors = ["bg-blue-500", "bg-amber-400", "bg-emerald-500", "bg-violet-500"];
  return colors[index % colors.length];
}

export default function JudgeScoreCard({ evaluation }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-800">LLM judge evaluation</h2>
        <span className="text-2xl font-black text-blue-500">
          {evaluation.overallScore}
          <span className="text-sm font-medium text-gray-400"> / 100</span>
        </span>
      </div>

      {/* Dimension scores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        {evaluation.scores.map((s, i) => {
          const color = DIMENSION_COLORS[s.dimension] ?? getFallbackColor(i);
          return (
            <div key={s.dimension} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {s.dimension}
                </span>
                <span className="text-sm font-semibold text-gray-800">{s.score} / 100</span>
              </div>
              <ScoreBar score={s.score} color={color} />
            </div>
          );
        })}
      </div>

      {/* Reasoning + verdict */}
      <ReasoningAccordion scores={evaluation.scores} verdict={evaluation.verdict} />
    </div>
  );
}
