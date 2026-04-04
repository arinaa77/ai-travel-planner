"use client";

import { useState } from "react";
import TripInputForm, { TripFormValues } from "@/components/layout/TripInputForm";
import AgentDebatePanel from "@/components/debate/AgentDebatePanel";
import JudgeScoreCard from "@/components/judge/JudgeScoreCard";
import { MOCK_AGENT_OUTPUTS, JudgeEvaluation } from "@/lib/mockData";

export default function TripPlanner() {
  const [evaluation, setEvaluation] = useState<JudgeEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(values: TripFormValues) {
    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: values.destination,
          days: values.days,
          budget: values.budget,
          agentOutputs: MOCK_AGENT_OUTPUTS,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Evaluation failed");
      }

      setEvaluation(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pt-10 px-4">
      <h1 className="text-3xl font-black text-gray-800 mb-1">Plan a new trip</h1>
      <p className="text-gray-400 font-medium mb-8">
        Our AI agents will build your itinerary in seconds.
      </p>

      <TripInputForm onGenerate={handleGenerate} />

      <div className="mt-10">
        <AgentDebatePanel agents={MOCK_AGENT_OUTPUTS} />
      </div>

      {loading && (
        <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 animate-pulse">
            LLM judge evaluating your itinerary…
          </p>
        </div>
      )}

      {error && (
        <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {evaluation && (
        <div className="mt-10">
          <JudgeScoreCard evaluation={evaluation} />
        </div>
      )}
    </div>
  );
}
