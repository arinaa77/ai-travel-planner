import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: mockCreate };
  }
  return { default: MockAnthropic };
});

import { generateTrip } from "./generateService";

const validToolUseResponse = {
  content: [
    {
      type: "tool_use",
      input: {
        itinerary: [
          {
            day: 1,
            title: "Day 1 in Tokyo",
            events: [
              {
                id: "e1",
                time: "9:00 AM",
                title: "Senso-ji Temple",
                subtitle: "Ancient Buddhist temple",
                type: "sight",
                cost: 0,
              },
            ],
          },
        ],
        budgetItems: [{ label: "Hotel", value: "$120/night" }],
        attractionItems: [{ label: "Senso-ji", value: "Free entry" }],
        foodItems: [{ label: "Ramen", value: "$15" }],
      },
    },
  ],
};

describe("generateTrip", () => {
  beforeEach(() => mockCreate.mockReset());

  it("returns itinerary and agentOutputs on success", async () => {
    mockCreate.mockResolvedValue(validToolUseResponse);

    const result = await generateTrip({
      destination: "Tokyo",
      days: 1,
      budget: 2000,
      style: "Cultural",
    });

    expect(result.itinerary).toHaveLength(1);
    expect(result.itinerary[0].title).toBe("Day 1 in Tokyo");
    expect(result.agentOutputs).toHaveLength(3);
    expect(result.agentOutputs[0].id).toBe("budget");
    expect(result.agentOutputs[1].id).toBe("attractions");
    expect(result.agentOutputs[2].id).toBe("food");
  });

  it("maps budget, attraction and food items into agentOutputs", async () => {
    mockCreate.mockResolvedValue(validToolUseResponse);

    const result = await generateTrip({
      destination: "Tokyo",
      days: 1,
      budget: 2000,
      style: "Cultural",
    });

    expect(result.agentOutputs[0].items).toEqual([{ label: "Hotel", value: "$120/night" }]);
    expect(result.agentOutputs[1].items).toEqual([{ label: "Senso-ji", value: "Free entry" }]);
    expect(result.agentOutputs[2].items).toEqual([{ label: "Ramen", value: "$15" }]);
  });

  it("throws when no tool_use block in response", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "hello" }] });

    await expect(
      generateTrip({ destination: "Tokyo", days: 1, budget: 2000, style: "Cultural" })
    ).rejects.toThrow("Trip generation failed");
  });

  it("throws when tool_use input fails Zod validation", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "tool_use", input: { itinerary: "not-an-array" } }],
    });

    await expect(
      generateTrip({ destination: "Tokyo", days: 1, budget: 2000, style: "Cultural" })
    ).rejects.toThrow("Trip generation failed");
  });
});
