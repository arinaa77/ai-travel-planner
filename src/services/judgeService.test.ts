import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: mockCreate };
  }
  return { default: MockAnthropic };
});

import { evaluateTrip } from "./judgeService";

const validToolUseResponse = {
  content: [
    {
      type: "tool_use",
      input: {
        overallScore: 82,
        scores: [
          { dimension: "cost_accuracy", score: 80, reasoning: "Within budget" },
          { dimension: "diversity", score: 85, reasoning: "Good variety" },
          { dimension: "feasibility", score: 81, reasoning: "Realistic schedule" },
        ],
        verdict: "A well-balanced trip with good value.",
      },
    },
  ],
};

const sampleInput = {
  destination: "Tokyo",
  days: 3,
  budget: 2000,
  agentOutputs: [
    { id: "budget" as const, name: "Budget", status: "done" as const, items: [] },
  ],
};

describe("evaluateTrip", () => {
  beforeEach(() => mockCreate.mockReset());

  it("returns evaluation with overallScore, scores, verdict, model, evaluatedAt", async () => {
    mockCreate.mockResolvedValue(validToolUseResponse);

    const result = await evaluateTrip(sampleInput);

    expect(result.overallScore).toBe(82);
    expect(result.scores).toHaveLength(3);
    expect(result.verdict).toBe("A well-balanced trip with good value.");
    expect(result.model).toBe("claude-sonnet-4-5");
    expect(result.evaluatedAt).toBeDefined();
  });

  it("includes evaluatedAt as a valid ISO timestamp", async () => {
    mockCreate.mockResolvedValue(validToolUseResponse);

    const result = await evaluateTrip(sampleInput);

    expect(new Date(result.evaluatedAt).getTime()).not.toBeNaN();
  });

  it("throws when no tool_use block in response", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "here is my eval" }] });

    await expect(evaluateTrip(sampleInput)).rejects.toThrow("Judge evaluation failed");
  });

  it("throws when overallScore is out of 0-100 range", async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: "tool_use",
          input: { overallScore: 150, scores: [], verdict: "bad" },
        },
      ],
    });

    await expect(evaluateTrip(sampleInput)).rejects.toThrow("Judge evaluation failed");
  });
});
