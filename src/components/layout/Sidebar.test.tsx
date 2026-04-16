import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Sidebar from "./Sidebar";

const STORAGE_KEY = "tripmind_recent_trips";

let store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { store = {}; },
};

function setTrips(trips: { id: string; destination: string; days: number; score: number }[]) {
  store[STORAGE_KEY] = JSON.stringify(trips);
}

describe("Sidebar", () => {
  beforeEach(() => {
    store = {};
    vi.stubGlobal("localStorage", localStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the Recent trips label", () => {
    render(<Sidebar />);
    expect(screen.getByText(/recent trips/i)).toBeInTheDocument();
  });

  it("shows 'No trips yet' when localStorage is empty", () => {
    render(<Sidebar />);
    expect(screen.getByText(/no trips yet/i)).toBeInTheDocument();
  });

  it("renders trip destinations from localStorage", () => {
    setTrips([
      { id: "1", destination: "Tokyo", days: 5, score: 88 },
      { id: "2", destination: "Paris", days: 3, score: 76 },
    ]);
    render(<Sidebar />);
    expect(screen.getByText(/Tokyo/)).toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
  });

  it("shows trip duration alongside destination", () => {
    setTrips([{ id: "1", destination: "Tokyo", days: 5, score: 88 }]);
    render(<Sidebar />);
    expect(screen.getByText(/Tokyo · 5d/)).toBeInTheDocument();
  });

  it("does not show 'No trips yet' when trips exist", () => {
    setTrips([{ id: "1", destination: "Tokyo", days: 5, score: 88 }]);
    render(<Sidebar />);
    expect(screen.queryByText(/no trips yet/i)).not.toBeInTheDocument();
  });

  it("updates when tripmind_trips_updated event fires", () => {
    render(<Sidebar />);
    expect(screen.getByText(/no trips yet/i)).toBeInTheDocument();

    act(() => {
      setTrips([{ id: "1", destination: "Berlin", days: 4, score: 80 }]);
      window.dispatchEvent(new Event("tripmind_trips_updated"));
    });

    expect(screen.getByText(/Berlin/)).toBeInTheDocument();
  });
});
