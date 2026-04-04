"use client";

import { useState } from "react";
import TripInputForm, { TripFormValues } from "@/components/layout/TripInputForm";
import AgentDebatePanel from "@/components/debate/AgentDebatePanel";
import JudgeScoreCard from "@/components/judge/JudgeScoreCard";
import { AgentOutput, JudgeEvaluation, ItineraryDay } from "@/lib/mockData";
import ItineraryTimeline from "@/components/itinerary/ItineraryTimeline";

export interface RecentTrip {
  id: string;
  destination: string;
  days: number;
  score: number;
}

function saveRecentTrip(trip: RecentTrip) {
  const key = "tripmind_recent_trips";
  const existing: RecentTrip[] = JSON.parse(localStorage.getItem(key) ?? "[]");
  const updated = [trip, ...existing.filter((t) => t.id !== trip.id)].slice(0, 5);
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event("tripmind_trips_updated"));
}

export default function TripPlanner() {
  const [agentOutputs, setAgentOutputs] = useState<AgentOutput[] | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [evaluation, setEvaluation] = useState<JudgeEvaluation | null>(null);
  const [generating, setGenerating] = useState(false);
  const [judging, setJudging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(values: TripFormValues) {
    setGenerating(true);
    setJudging(false);
    setError(null);
    setAgentOutputs(null);
    setItinerary(null);
    setEvaluation(null);

    try {
      // Step 1: generate — show results as soon as ready
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!genRes.ok) {
        const data = await genRes.json();
        throw new Error(data.error ?? "Generation failed");
      }
      const { agentOutputs: generatedOutputs, itinerary: generatedItinerary } = await genRes.json();
      setAgentOutputs(generatedOutputs);
      setItinerary(generatedItinerary);
      setGenerating(false);

      // Step 2: judge — runs after breakdown is already visible
      setJudging(true);
      const judgeRes = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: values.destination,
          days: values.days,
          budget: values.budget,
          agentOutputs: generatedOutputs,
        }),
      });
      if (!judgeRes.ok) {
        const data = await judgeRes.json();
        throw new Error(data.error ?? "Evaluation failed");
      }
      const evalResult: JudgeEvaluation = await judgeRes.json();
      setEvaluation(evalResult);

      const tripId = `${values.destination}-${Date.now()}`;
      saveRecentTrip({
        id: tripId,
        destination: values.destination,
        days: values.days,
        score: evalResult.overallScore,
      });

      // Save to Supabase if logged in (fire-and-forget)
      fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: values.destination,
          days: values.days,
          score: evalResult.overallScore,
          itinerary: generatedItinerary,
          agentOutputs: generatedOutputs,
          evaluation: evalResult,
        }),
      }).catch(() => {
        // Not logged in or network error — localStorage already saved
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setGenerating(false);
      setJudging(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pt-10 px-4">
      <h1 className="text-3xl font-black text-gray-800 mb-1">Plan a new trip</h1>
      <p className="text-gray-400 font-medium mb-8">
        Our AI agents will build your itinerary in seconds.
      </p>

      <TripInputForm onGenerate={handleGenerate} />

      {generating && (
        <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 animate-pulse">
            Generating your itinerary…
          </p>
        </div>
      )}

      {error && (
        <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {agentOutputs && (
        <div className="mt-10">
          <AgentDebatePanel agents={agentOutputs} />
        </div>
      )}

      {judging && (
        <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 animate-pulse">
            Evaluating your itinerary…
          </p>
        </div>
      )}

      {evaluation && (
        <div className="mt-6">
          <JudgeScoreCard evaluation={evaluation} />
        </div>
      )}

      {itinerary && (
        <div className="mt-6 pb-10">
          <ItineraryTimeline days={itinerary} />
        </div>
      )}
    </div>
  );
}
