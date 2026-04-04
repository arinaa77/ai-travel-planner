import { describe, it, expect } from "vitest";
import { JUDGE_SYSTEM_PROMPT, buildJudgeUserPrompt } from "./judgePrompt";
import { MOCK_AGENT_OUTPUTS } from "@/lib/mockData";

describe("judgePrompt", () => {
  it("system prompt is a non-empty string", () => {
    expect(typeof JUDGE_SYSTEM_PROMPT).toBe("string");
    expect(JUDGE_SYSTEM_PROMPT.length).toBeGreaterThan(0);
  });

  it("buildJudgeUserPrompt includes destination, days, and budget", () => {
    const prompt = buildJudgeUserPrompt({
      destination: "Paris, France",
      days: 4,
      budget: 1500,
      agentOutputs: MOCK_AGENT_OUTPUTS,
    });
    expect(prompt).toContain("Paris, France");
    expect(prompt).toContain("4-day");
    expect(prompt).toContain("$1500");
  });

  it("buildJudgeUserPrompt includes agent output data", () => {
    const prompt = buildJudgeUserPrompt({
      destination: "Tokyo",
      days: 3,
      budget: 800,
      agentOutputs: MOCK_AGENT_OUTPUTS,
    });
    expect(prompt).toContain("Budget");
    expect(prompt).toContain("Attractions");
    expect(prompt).toContain("Food");
  });

  it("buildJudgeUserPrompt mentions all three scoring dimensions", () => {
    const prompt = buildJudgeUserPrompt({
      destination: "Tokyo",
      days: 3,
      budget: 800,
      agentOutputs: MOCK_AGENT_OUTPUTS,
    });
    expect(prompt).toMatch(/cost accuracy/i);
    expect(prompt).toMatch(/diversity/i);
    expect(prompt).toMatch(/feasibility/i);
  });
});
