import { EvaluateInput } from "@/services/judgeService";

export const JUDGE_SYSTEM_PROMPT = `You are an expert travel planning evaluator. \
Assess trip itineraries on three dimensions: cost accuracy, diversity, and feasibility. \
Be specific and honest in your reasoning. Score each dimension 0–100.`;

export function buildJudgeUserPrompt(input: EvaluateInput): string {
  const agentSummary = input.agentOutputs
    .map((a) => `${a.name}:\n${a.items.map((i) => `  ${i.label}: ${i.value}`).join("\n")}`)
    .join("\n\n");

  return `Evaluate this ${input.days}-day trip to ${input.destination} with a $${input.budget} budget.

Agent outputs:
${agentSummary}

Score on:
- Cost accuracy (0-100): How well does the budget allocation match the destination and duration?
- Diversity (0-100): How varied are the activities, food, and experiences across all days?
- Feasibility (0-100): Are the logistics realistic (travel times, pacing, opening hours)?

Return an overall score, per-dimension scores with reasoning, and a one-sentence verdict.`;
}
