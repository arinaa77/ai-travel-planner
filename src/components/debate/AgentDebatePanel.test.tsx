import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AgentDebatePanel from "./AgentDebatePanel";

const BUDGET_ITEMS = [
  { label: "Flights", value: "$800" },
  { label: "Hotel", value: "$280" },
  { label: "Total", value: "$1080" },
];

describe("AgentDebatePanel", () => {
  it("renders the Trip breakdown label", () => {
    render(<AgentDebatePanel agents={[]} />);
    expect(screen.getByText(/trip breakdown/i)).toBeInTheDocument();
  });

  it("shows 'No agents active' when agents array is empty", () => {
    render(<AgentDebatePanel agents={[]} />);
    expect(screen.getByText("No agents active.")).toBeInTheDocument();
  });

  it("renders agent name and done status", () => {
    render(
      <AgentDebatePanel
        agents={[{ id: "budget", name: "Budget", status: "done", items: BUDGET_ITEMS }]}
      />
    );
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders skeleton rows when agent is running with no items", () => {
    render(
      <AgentDebatePanel agents={[{ id: "budget", name: "Budget", status: "running", items: [] }]} />
    );
    expect(screen.getByText("Running…")).toBeInTheDocument();
  });

  it("renders error state when agent status is error", () => {
    render(
      <AgentDebatePanel agents={[{ id: "budget", name: "Budget", status: "error", items: [] }]} />
    );
    expect(screen.getByText("Agent failed to respond.")).toBeInTheDocument();
  });

  describe("BudgetChart", () => {
    it("renders bar chart rows for budget card line items (excluding Total)", () => {
      render(
        <AgentDebatePanel
          agents={[{ id: "budget", name: "Budget", status: "done", items: BUDGET_ITEMS }]}
        />
      );
      // Chart labels (Flights, Hotel) should appear in the bars section
      const flightsEls = screen.getAllByText("Flights");
      expect(flightsEls.length).toBeGreaterThanOrEqual(1);
    });

    it("only shows Total row in the item list, not line items", () => {
      render(
        <AgentDebatePanel
          agents={[{ id: "budget", name: "Budget", status: "done", items: BUDGET_ITEMS }]}
        />
      );
      // Total must appear in the list
      expect(screen.getByText("Total")).toBeInTheDocument();
      // Line item labels appear once (in chart bars only, not duplicated in list)
      expect(screen.getAllByText("Flights")).toHaveLength(1);
      expect(screen.getAllByText("Hotel")).toHaveLength(1);
    });

    it("does not render bar chart for non-budget cards", () => {
      render(
        <AgentDebatePanel
          agents={[
            {
              id: "attractions",
              name: "Attractions",
              status: "done",
              items: [
                { label: "Day 1", value: "Eiffel Tower" },
                { label: "Day 2", value: "Louvre" },
              ],
            },
          ]}
        />
      );
      // Both items should appear in the list (no chart suppression)
      expect(screen.getByText("Day 1")).toBeInTheDocument();
      expect(screen.getByText("Day 2")).toBeInTheDocument();
    });

    it("does not render bar chart when budget has only one item", () => {
      const { container } = render(
        <AgentDebatePanel
          agents={[
            {
              id: "budget",
              name: "Budget",
              status: "done",
              items: [{ label: "Total", value: "$500" }],
            },
          ]}
        />
      );
      // No bar elements rendered (chart requires items.length > 1)
      expect(container.querySelectorAll(".bg-violet-400").length).toBe(0);
    });

    it("handles range values in bar chart without crashing", () => {
      render(
        <AgentDebatePanel
          agents={[
            {
              id: "budget",
              name: "Budget",
              status: "done",
              items: [
                { label: "Food", value: "$50–80" },
                { label: "Hotel", value: "~$200" },
                { label: "Total", value: "$265" },
              ],
            },
          ]}
        />
      );
      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("$265")).toBeInTheDocument();
    });
  });
});
