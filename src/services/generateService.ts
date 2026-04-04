import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AgentOutput, ItineraryDay } from "@/lib/mockData";
import { GENERATE_SYSTEM_PROMPT, buildGenerateUserPrompt } from "@/services/prompts/generatePrompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GenerateInput {
  destination: string;
  days: number;
  budget: number;
  style: string;
}

export interface GenerateResult {
  itinerary: ItineraryDay[];
  agentOutputs: AgentOutput[];
}

const GenerateResultSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      events: z.array(
        z.object({
          id: z.string(),
          time: z.string(),
          title: z.string(),
          subtitle: z.string(),
          type: z.enum(["travel", "sight", "food", "hotel"]),
          cost: z.number().nullable(),
        })
      ),
    })
  ),
  budgetItems: z.array(z.object({ label: z.string(), value: z.string() })),
  attractionItems: z.array(z.object({ label: z.string(), value: z.string() })),
  foodItems: z.array(z.object({ label: z.string(), value: z.string() })),
});

export async function generateTrip(input: GenerateInput): Promise<GenerateResult> {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: GENERATE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildGenerateUserPrompt(input) }],
      tools: [
        {
          name: "submit_itinerary",
          description: "Submit the complete trip itinerary and breakdowns",
          input_schema: {
            type: "object" as const,
            properties: {
              itinerary: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: { type: "number" },
                    title: { type: "string" },
                    events: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          time: { type: "string" },
                          title: { type: "string" },
                          subtitle: { type: "string" },
                          type: { type: "string", enum: ["travel", "sight", "food", "hotel"] },
                          cost: { anyOf: [{ type: "number" }, { type: "null" }] },
                        },
                        required: ["id", "time", "title", "subtitle", "type", "cost"],
                      },
                    },
                  },
                  required: ["day", "title", "events"],
                },
              },
              budgetItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: { label: { type: "string" }, value: { type: "string" } },
                  required: ["label", "value"],
                },
              },
              attractionItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: { label: { type: "string" }, value: { type: "string" } },
                  required: ["label", "value"],
                },
              },
              foodItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: { label: { type: "string" }, value: { type: "string" } },
                  required: ["label", "value"],
                },
              },
            },
            required: ["itinerary", "budgetItems", "attractionItems", "foodItems"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "submit_itinerary" },
    });

    const toolUse = response.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("No structured response from generation model");
    }

    const parsed = GenerateResultSchema.parse(toolUse.input as Record<string, unknown>);

    const agentOutputs: AgentOutput[] = [
      { id: "budget", name: "Budget", status: "done", items: parsed.budgetItems },
      { id: "attractions", name: "Attractions", status: "done", items: parsed.attractionItems },
      { id: "food", name: "Food", status: "done", items: parsed.foodItems },
    ];

    return { itinerary: parsed.itinerary, agentOutputs };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[generateService] error:", msg);
    throw new Error(`Trip generation failed: ${msg}`);
  }
}
