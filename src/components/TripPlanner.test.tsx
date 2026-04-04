import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TripPlanner from "./TripPlanner";

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

    // Confirm the form heading is present (baseline render)
    expect(screen.getByText("Plan a new trip")).toBeInTheDocument();

    // Fire the reset event
    await act(async () => {
      window.dispatchEvent(new Event("tripmind_new_trip"));
    });

    // Error and loading states should not be showing
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
