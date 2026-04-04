import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TripPlanner from "./TripPlanner";
import { MOCK_ITINERARY, MOCK_AGENT_OUTPUTS, MOCK_EVALUATION } from "@/lib/mockData";

// Minimal fetch mock — tests don't exercise the API
beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({}), { status: 200 })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TripPlanner — new trip reset", () => {
  it("clears results when tripmind_new_trip event fires", async () => {
    render(<TripPlanner />);
    expect(screen.getByText("Plan a new trip")).toBeInTheDocument();

    await act(async () => {
      window.dispatchEvent(new Event("tripmind_new_trip"));
    });

    expect(screen.queryByText(/generation failed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/generating your itinerary/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/evaluating your itinerary/i)).not.toBeInTheDocument();
  });

  it("renders the trip form on mount", () => {
    render(<TripPlanner />);
    expect(screen.getByText("Plan a new trip")).toBeInTheDocument();
    expect(screen.getByText("Generate →")).toBeInTheDocument();
  });
});

describe("TripPlanner — load trip event", () => {
  it("restores itinerary and shows Saved! on tripmind_load_trip", async () => {
    render(<TripPlanner />);

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("tripmind_load_trip", {
          detail: {
            id: "trip-123",
            itinerary: MOCK_ITINERARY,
            agentOutputs: MOCK_AGENT_OUTPUTS,
            evaluation: MOCK_EVALUATION,
          },
        })
      );
    });

    // Loaded trips are already saved — show Saved! not Save trip
    await waitFor(() =>
      expect(screen.getByText("Saved!")).toBeInTheDocument()
    );
    expect(screen.getByText("Full itinerary")).toBeInTheDocument();
  });
});
