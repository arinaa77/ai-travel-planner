import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Sidebar from "./Sidebar";

type Trip = { id: string; destination: string; days: number; score: number };

function mockFetch(trips: Trip[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ trips }),
    })
  );
}

function mockFetchUnauthed() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    })
  );
}

describe("Sidebar", () => {
  beforeEach(() => {
    mockFetch([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the Recent trips label", async () => {
    render(<Sidebar />);
    expect(screen.getByText(/recent trips/i)).toBeInTheDocument();
  });

  it("shows 'No trips yet' when API returns empty list", async () => {
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText(/no trips yet/i)).toBeInTheDocument());
  });

  it("shows sign in prompt when unauthenticated", async () => {
    mockFetchUnauthed();
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText(/sign in to see your trips/i)).toBeInTheDocument());
  });

  it("renders trip destinations from API", async () => {
    mockFetch([
      { id: "1", destination: "Tokyo", days: 5, score: 88 },
      { id: "2", destination: "Paris", days: 3, score: 76 },
    ]);
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText(/Tokyo/)).toBeInTheDocument());
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
  });

  it("shows trip duration alongside destination", async () => {
    mockFetch([{ id: "1", destination: "Tokyo", days: 5, score: 88 }]);
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText(/Tokyo · 5d/)).toBeInTheDocument());
  });

  it("does not show 'No trips yet' when trips exist", async () => {
    mockFetch([{ id: "1", destination: "Tokyo", days: 5, score: 88 }]);
    render(<Sidebar />);
    await waitFor(() => expect(screen.queryByText(/no trips yet/i)).not.toBeInTheDocument());
  });

  it("updates when tripmind_trips_updated event fires", async () => {
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText(/no trips yet/i)).toBeInTheDocument());

    mockFetch([{ id: "1", destination: "Berlin", days: 4, score: 80 }]);
    await act(async () => {
      window.dispatchEvent(new Event("tripmind_trips_updated"));
    });

    await waitFor(() => expect(screen.getByText(/Berlin/)).toBeInTheDocument());
  });

  it("shows Top rated tag for score >= 85", async () => {
    mockFetch([{ id: "1", destination: "Tokyo", days: 5, score: 90 }]);
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText("Top rated")).toBeInTheDocument());
  });

  it("shows Recommended tag for score >= 70 and < 85", async () => {
    mockFetch([{ id: "1", destination: "Paris", days: 3, score: 75 }]);
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText("Recommended")).toBeInTheDocument());
  });

  it("shows no tag for score below 70", async () => {
    mockFetch([{ id: "1", destination: "Lima", days: 4, score: 60 }]);
    render(<Sidebar />);
    await waitFor(() => expect(screen.getByText(/Lima/)).toBeInTheDocument());
    expect(screen.queryByText("Top rated")).not.toBeInTheDocument();
    expect(screen.queryByText("Recommended")).not.toBeInTheDocument();
  });

  it("dispatches tripmind_load_trip when a trip is clicked", async () => {
    mockFetch([{ id: "1", destination: "Tokyo", days: 5, score: 88 }]);

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ trips: [{ id: "1", destination: "Tokyo", days: 5, score: 88 }] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ trip: { itinerary: [], agent_outputs: [], evaluation: {} } }),
        })
    );

    const handler = vi.fn();
    window.addEventListener("tripmind_load_trip", handler);

    render(<Sidebar />);
    const btn = await screen.findByText(/Tokyo/);
    await act(async () => {
      btn.click();
    });

    await waitFor(() => expect(handler).toHaveBeenCalledOnce());
    window.removeEventListener("tripmind_load_trip", handler);
  });

  it("shows Loading… while trip is being fetched", async () => {
    let resolveFetch!: (v: unknown) => void;
    const tripPromise = new Promise((r) => {
      resolveFetch = r;
    });

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ trips: [{ id: "1", destination: "Tokyo", days: 5, score: 88 }] }),
        })
        .mockReturnValueOnce(tripPromise)
    );

    render(<Sidebar />);
    const btn = await screen.findByText(/Tokyo/);
    act(() => {
      btn.click();
    });

    await waitFor(() => expect(screen.getByText("Loading…")).toBeInTheDocument());
    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({ trip: { itinerary: [], agent_outputs: [], evaluation: {} } }),
    });
  });
});
