import { JudgeScore } from "@/lib/mockData";

interface Props {
  scores: JudgeScore[];
  verdict: string;
}

export default function ReasoningAccordion({ scores, verdict }: Props) {
  return (
    <div>
      {scores.map((s) => (
        <p key={s.dimension}>{s.reasoning}</p>
      ))}
      <p>{verdict}</p>
    </div>
  );
}
