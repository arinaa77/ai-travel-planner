import TripInputForm from "@/components/layout/TripInputForm";
import AgentDebatePanel from "@/components/debate/AgentDebatePanel";
import { MOCK_AGENT_OUTPUTS } from "@/lib/mockData";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto pt-10 px-4">
      <h1 className="text-3xl font-black text-gray-800 mb-1">Plan a new trip</h1>
      <p className="text-gray-400 font-medium mb-8">Our AI agents will build your itinerary in seconds.</p>
      <TripInputForm />
      <div className="mt-10">
        <AgentDebatePanel agents={MOCK_AGENT_OUTPUTS} />
      </div>
    </div>
  );
}
