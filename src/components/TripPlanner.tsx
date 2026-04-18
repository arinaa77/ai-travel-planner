"use client";

import { useState, useEffect } from "react";
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

export default function TripPlanner() {
  const [agentOutputs, setAgentOutputs] = useState<AgentOutput[] | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [evaluation, setEvaluation] = useState<JudgeEvaluation | null>(null);
  const [lastValues, setLastValues] = useState<TripFormValues | null>(null);
  const [generating, setGenerating] = useState(false);
  const [judging, setJudging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    function handleReset() {
      setAgentOutputs(null);
      setItinerary(null);
      setEvaluation(null);
      setGenerating(false);
      setJudging(false);
      setSavedTripId(null);
      setError(null);
      setIsViewing(false);
    }

    function handleLoad(e: Event) {
      const { id, itinerary: i, agentOutputs: a, evaluation: ev } = (e as CustomEvent).detail;
      setItinerary(i);
      setAgentOutputs(a);
      setEvaluation(ev);
      setSavedTripId(id ?? "loaded");
      setIsViewing(true);
    }

    window.addEventListener("tripmind_new_trip", handleReset);
    window.addEventListener("tripmind_load_trip", handleLoad);
    return () => {
      window.removeEventListener("tripmind_new_trip", handleReset);
      window.removeEventListener("tripmind_load_trip", handleLoad);
    };
  }, []);

  async function handleSave() {
    if (!itinerary || !agentOutputs || !evaluation || !lastValues) return;
    setSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: lastValues.destination,
          days: lastValues.days,
          score: evaluation.overallScore,
          itinerary,
          agentOutputs,
          evaluation,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        setError("Failed to save trip.");
        return;
      }
      setSavedTripId(data.id);
      window.dispatchEvent(new Event("tripmind_trips_updated"));
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate(values: TripFormValues) {
    setGenerating(true);
    setJudging(false);
    setError(null);
    setAgentOutputs(null);
    setItinerary(null);
    setEvaluation(null);
    setSavedTripId(null);
    setLastValues(values);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setGenerating(false);
      setJudging(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pt-10 px-4">
      {!isViewing && (
        <>
          <h1 className="text-3xl font-black text-gray-800 mb-1">Plan a new trip</h1>
          <p className="text-gray-400 font-medium mb-8">
            Our AI agents will build your itinerary in seconds.
          </p>
          <TripInputForm onGenerate={handleGenerate} disabled={generating || judging} />
        </>
      )}

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
          <div className="mt-4 flex justify-end">
            {savedTripId ? (
              <span className="text-sm font-semibold text-emerald-500">Saved!</span>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-bold rounded-full text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all shadow-sm disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save trip"}
              </button>
            )}
          </div>
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
