import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AgentOutput, JudgeEvaluation } from "@/lib/mockData";
import { JUDGE_SYSTEM_PROMPT, buildJudgeUserPrompt } from "@/services/prompts/judgePrompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface EvaluateInput {
  destination: string;
  days: number;
  budget: number;
  agentOutputs: AgentOutput[];
}

const JudgeResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scores: z.array(
    z.object({
      dimension: z.string(),
      score: z.number().min(0).max(100),
      reasoning: z.string(),
    })
  ),
  verdict: z.string(),
});

export async function evaluateTrip(input: EvaluateInput): Promise<JudgeEvaluation> {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: JUDGE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildJudgeUserPrompt(input) }],
      tools: [
        {
          name: "submit_evaluation",
          description: "Submit the structured trip evaluation",
          input_schema: {
            type: "object" as const,
            properties: {
              overallScore: { type: "number", description: "Weighted overall score 0–100" },
              scores: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    dimension: { type: "string" },
                    score: { type: "number" },
                    reasoning: { type: "string" },
                  },
                  required: ["dimension", "score", "reasoning"],
                },
              },
              verdict: { type: "string", description: "One-sentence summary verdict" },
            },
            required: ["overallScore", "scores", "verdict"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "submit_evaluation" },
    });

    const toolUse = response.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("No structured response from judge model");
    }

    const parsed = JudgeResultSchema.parse(toolUse.input);

    return {
      ...parsed,
      model: "claude-sonnet-4-5",
      evaluatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(
      `Judge evaluation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
