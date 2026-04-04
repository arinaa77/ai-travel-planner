import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MyTripsPanel from "./MyTripsPanel";
import { MOCK_DB_TRIPS } from "@/lib/mockData";

describe("MyTripsPanel — structure", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));
    render(<MyTripsPanel onClose={vi.fn()} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders trip list after fetch resolves", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 })
    );
    render(<MyTripsPanel onClose={vi.fn()} />);

    expect(await screen.findByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Kyoto")).toBeInTheDocument();
  });

  it("renders days and score for each trip", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 })
    );
    render(<MyTripsPanel onClose={vi.fn()} />);

    expect(await screen.findByText("3d · score 86")).toBeInTheDocument();
    expect(screen.getByText("5d · score 91")).toBeInTheDocument();
  });

  it("shows empty state when no trips", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: [] }), { status: 200 })
    );
    render(<MyTripsPanel onClose={vi.fn()} />);

    expect(await screen.findByText(/no saved trips/i)).toBeInTheDocument();
  });

  it("shows error state on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));
    render(<MyTripsPanel onClose={vi.fn()} />);

    expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: [] }), { status: 200 })
    );
    const onClose = vi.fn();
    render(<MyTripsPanel onClose={onClose} />);

    // backdrop is the fixed inset-0 div behind the panel
    const backdrop = document.querySelector(".fixed.inset-0 > .absolute");
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when × is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: [] }), { status: 200 })
    );
    const onClose = vi.fn();
    render(<MyTripsPanel onClose={onClose} />);

    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
