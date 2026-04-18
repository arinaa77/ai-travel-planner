import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("renders trip destinations after fetch resolves", async () => {
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
    expect(await screen.findByText("3 days")).toBeInTheDocument();
    expect(screen.getByText("Score 86")).toBeInTheDocument();
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

  it("shows trip count in header", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 })
    );
    render(<MyTripsPanel onClose={vi.fn()} />);
    expect(await screen.findByText("2 saved itineraries")).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: [] }), { status: 200 })
    );
    const onClose = vi.fn();
    render(<MyTripsPanel onClose={onClose} />);
    const backdrop = document.querySelector(".fixed.inset-0 > .absolute");
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when × header button is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: [] }), { status: 200 })
    );
    const onClose = vi.fn();
    render(<MyTripsPanel onClose={onClose} />);
    await screen.findByText(/no saved trips/i);
    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("MyTripsPanel — load trip", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches tripmind_load_trip and closes on card click", async () => {
    const listRes = new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 });
    const tripRes = new Response(
      JSON.stringify({ trip: { itinerary: [], agent_outputs: [], evaluation: {} } }),
      { status: 200 }
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(listRes).mockResolvedValueOnce(tripRes);

    const handler = vi.fn();
    window.addEventListener("tripmind_load_trip", handler);

    const onClose = vi.fn();
    render(<MyTripsPanel onClose={onClose} />);
    fireEvent.click(await screen.findByText("Tokyo"));

    await waitFor(() => expect(handler).toHaveBeenCalledOnce());
    expect(onClose).toHaveBeenCalledOnce();

    window.removeEventListener("tripmind_load_trip", handler);
  });
});

describe("MyTripsPanel — delete with confirmation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows confirmation UI when delete × is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 })
    );
    render(<MyTripsPanel onClose={vi.fn()} />);
    await screen.findByText("Tokyo");

    fireEvent.click(screen.getAllByLabelText("Delete trip")[0]);
    expect(screen.getByText("Delete this trip?")).toBeInTheDocument();
    expect(screen.getByText("Yes, delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("dismisses confirmation on Cancel", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 })
    );
    render(<MyTripsPanel onClose={vi.fn()} />);
    await screen.findByText("Tokyo");

    fireEvent.click(screen.getAllByLabelText("Delete trip")[0]);
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete this trip?")).not.toBeInTheDocument();
  });

  it("removes trip after confirming delete", async () => {
    const listRes = new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 });
    const deleteRes = new Response(JSON.stringify({ ok: true }), { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(listRes).mockResolvedValueOnce(deleteRes);

    render(<MyTripsPanel onClose={vi.fn()} />);
    await screen.findByText("Tokyo");

    fireEvent.click(screen.getAllByLabelText("Delete trip")[0]);
    fireEvent.click(screen.getByText("Yes, delete"));

    await waitFor(() => expect(screen.queryByText("Tokyo")).not.toBeInTheDocument());
    expect(screen.getByText("Kyoto")).toBeInTheDocument();
  });

  it("shows error if delete API fails", async () => {
    const listRes = new Response(JSON.stringify({ trips: MOCK_DB_TRIPS }), { status: 200 });
    const deleteRes = new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(listRes).mockResolvedValueOnce(deleteRes);

    render(<MyTripsPanel onClose={vi.fn()} />);
    await screen.findByText("Tokyo");

    fireEvent.click(screen.getAllByLabelText("Delete trip")[0]);
    fireEvent.click(screen.getByText("Yes, delete"));

    await waitFor(() => expect(screen.getByText(/failed to delete/i)).toBeInTheDocument());
  });
});
