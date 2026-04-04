interface Props {
  score: number;
  color?: string;
}

export default function ScoreBar({ score, color = "bg-blue-500" }: Props) {
  return (
    <div data-testid="score-bar" className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}
