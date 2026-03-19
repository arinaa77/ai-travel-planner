interface Props {
  score: number;
}

export default function ScoreBar({ score }: Props) {
  return (
    <div
      data-testid="score-bar"
      style={{ width: `${score}%` }}
    />
  );
}
