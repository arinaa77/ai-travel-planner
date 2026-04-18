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
});
