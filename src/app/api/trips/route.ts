import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const SaveTripSchema = z.object({
  destination: z.string(),
  days: z.number(),
  score: z.number(),
  itinerary: z.unknown(),
  agentOutputs: z.unknown(),
  evaluation: z.unknown(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("trips")
    .select("id, destination, days, score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ trips: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = SaveTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { destination, days, score, itinerary, agentOutputs, evaluation } = parsed.data;

  const { data, error } = await supabase.from("trips").insert({
    user_id: user.id,
    destination,
    days,
    score,
    itinerary,
    agent_outputs: agentOutputs,
    evaluation,
  }).select("id").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
