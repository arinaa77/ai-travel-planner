import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AgentDebatePanel from "./AgentDebatePanel";

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
        agents={[{ id: "budget", name: "Budget", status: "done", items: [{ label: "Hotel", value: "$100" }] }]}
      />
    );
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders skeleton rows when agent is running with no items", () => {
    render(
      <AgentDebatePanel
        agents={[{ id: "budget", name: "Budget", status: "running", items: [] }]}
      />
    );
    expect(screen.getByText("Running…")).toBeInTheDocument();
  });

  it("renders error state when agent status is error", () => {
    render(
      <AgentDebatePanel
        agents={[{ id: "budget", name: "Budget", status: "error", items: [] }]}
      />
    );
    expect(screen.getByText("Agent failed to respond.")).toBeInTheDocument();
  });
});
