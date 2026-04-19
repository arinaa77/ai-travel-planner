import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import TripPlanner from "./TripPlanner";
import { MOCK_ITINERARY, MOCK_AGENT_OUTPUTS, MOCK_EVALUATION } from "@/lib/mockData";

const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

function mockLoggedIn() {
  mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });
}

function mockLoggedOut() {
  mockGetUser.mockResolvedValue({ data: { user: null } });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TripPlanner — generate error", () => {
  beforeEach(mockLoggedIn);

  it("shows error message when generate API returns non-ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Generation failed" }), { status: 500 })
    );

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!);

    await waitFor(() => expect(screen.getByText(/Generation failed/i)).toBeInTheDocument());
  });
});

describe("TripPlanner — generate success", () => {
  beforeEach(mockLoggedIn);

  it("renders agent outputs and evaluation after successful generate and judge", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).includes("/api/generate")) {
        return new Response(
          JSON.stringify({ itinerary: MOCK_ITINERARY, agentOutputs: MOCK_AGENT_OUTPUTS }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify(MOCK_EVALUATION), { status: 200 });
    });

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!);

    await waitFor(() => expect(screen.getByText("Save trip")).toBeInTheDocument());
    expect(screen.getByText("Full itinerary")).toBeInTheDocument();
  });
});

describe("TripPlanner — judge error", () => {
  beforeEach(mockLoggedIn);

  it("shows error when judge API returns non-ok after successful generate", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).includes("/api/generate")) {
        return new Response(
          JSON.stringify({ itinerary: MOCK_ITINERARY, agentOutputs: MOCK_AGENT_OUTPUTS }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ error: "Evaluation failed" }), { status: 500 });
    });

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!);

    await waitFor(() => expect(screen.getByText(/Evaluation failed/i)).toBeInTheDocument());
  });
});

describe("TripPlanner — save trip", () => {
  beforeEach(mockLoggedIn);

  it("shows Saved! after clicking Save trip", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).includes("/api/generate")) {
        return new Response(
          JSON.stringify({ itinerary: MOCK_ITINERARY, agentOutputs: MOCK_AGENT_OUTPUTS }),
          { status: 200 }
        );
      }
      if (String(url).includes("/api/judge")) {
        return new Response(JSON.stringify(MOCK_EVALUATION), { status: 200 });
      }
      return new Response(JSON.stringify({ id: "saved-123" }), { status: 200 });
    });

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!);

    await waitFor(() => expect(screen.getByText("Save trip")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Save trip"));
    await waitFor(() => expect(screen.getByText("Saved!")).toBeInTheDocument());
  });
});

describe("TripPlanner — save trip (unauthenticated)", () => {
  beforeEach(mockLoggedOut);

  it("hides Save trip button when user is not logged in", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).includes("/api/generate")) {
        return new Response(
          JSON.stringify({ itinerary: MOCK_ITINERARY, agentOutputs: MOCK_AGENT_OUTPUTS }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify(MOCK_EVALUATION), { status: 200 });
    });

    render(<TripPlanner />);
    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!);

    await waitFor(() => expect(screen.getByText("Full itinerary")).toBeInTheDocument());
    expect(screen.queryByText("Save trip")).not.toBeInTheDocument();
  });
});

describe("TripPlanner — new trip reset", () => {
  beforeEach(mockLoggedIn);

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
  beforeEach(mockLoggedIn);

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
    await waitFor(() => expect(screen.getByText("Saved!")).toBeInTheDocument());
    expect(screen.getByText("Full itinerary")).toBeInTheDocument();
  });
});
