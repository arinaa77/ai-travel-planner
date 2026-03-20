import { JudgeEvaluation } from "@/lib/mockData";
import ScoreBar from "./ScoreBar";
import ReasoningAccordion from "./ReasoningAccordion";

interface Props {
  evaluation: JudgeEvaluation;
}

export default function JudgeScoreCard({ evaluation }: Props) {
  return (
    <div>
      <div>{evaluation.overallScore}</div>

      {evaluation.scores.map((s) => (
        <div key={s.dimension}>
          <span>{s.dimension}</span>
          <span>{s.score}</span>
          <ScoreBar score={s.score} />
        </div>
      ))}

      <ReasoningAccordion scores={evaluation.scores} verdict={evaluation.verdict} />
    </div>
  );
}
