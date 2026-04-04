import { NextResponse } from "next/server";
import { z } from "zod";
import { generateTrip } from "@/services/generateService";

const RequestSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  days: z.number().int().min(1).max(30),
  budget: z.number().min(0),
  style: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await generateTrip(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
