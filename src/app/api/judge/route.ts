import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateTrip } from "@/services/judgeService";

const AgentItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const AgentOutputSchema = z.object({
  id: z.enum(["budget", "attractions", "food"]),
  name: z.string(),
  status: z.enum(["idle", "running", "done", "error"]),
  items: z.array(AgentItemSchema),
});

const RequestSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  days: z.number().int().min(1).max(30),
  budget: z.number().min(0),
  agentOutputs: z.array(AgentOutputSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const evaluation = await evaluateTrip(parsed.data);
    return NextResponse.json(evaluation);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Evaluation failed" },
      { status: 500 }
    );
  }
}
