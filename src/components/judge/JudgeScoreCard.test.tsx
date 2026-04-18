import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import JudgeScoreCard from "./JudgeScoreCard";
import { MOCK_EVALUATION } from "@/lib/mockData";

describe("JudgeScoreCard — score display", () => {
  it("renders the overall score", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.getByText("86")).toBeInTheDocument();
  });

  it("renders all dimension labels", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.getByText("Cost accuracy")).toBeInTheDocument();
    expect(screen.getByText("Diversity")).toBeInTheDocument();
    expect(screen.getByText("Feasibility")).toBeInTheDocument();
  });

  it("renders score bar with correct width for each dimension", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    const wrappers = document.querySelectorAll("[data-testid='score-bar']");
    // width style is on the inner fill div
    expect(wrappers[0].firstElementChild).toHaveStyle("width: 92%");
    expect(wrappers[1].firstElementChild).toHaveStyle("width: 78%");
    expect(wrappers[2].firstElementChild).toHaveStyle("width: 88%");
  });

  it("renders each dimension's score number", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.getByText("92 / 100")).toBeInTheDocument();
    expect(screen.getByText("78 / 100")).toBeInTheDocument();
    expect(screen.getByText("88 / 100")).toBeInTheDocument();
  });
});

describe("JudgeScoreCard — fallback color", () => {
  it("renders without crashing when dimension has no mapped color", () => {
    const evalWithUnknown = {
      ...MOCK_EVALUATION,
      scores: [{ dimension: "Unknown dimension", score: 75, reasoning: "test" }],
    };
    render(<JudgeScoreCard evaluation={evalWithUnknown} />);
    expect(screen.getByText("Unknown dimension")).toBeInTheDocument();
  });
});

describe("JudgeScoreCard — reasoning and verdict", () => {
  it("renders the verdict text", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.getByText(/Strong itinerary with accurate budget/i)).toBeInTheDocument();
  });

  it("renders reasoning text for each dimension after opening accordion", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    fireEvent.click(screen.getByText(/Show reasoning/i));
    expect(screen.getByText(/within 10% of the \$800 budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Good mix of cultural sights/i)).toBeInTheDocument();
    expect(screen.getByText(/realistic using Tokyo's subway/i)).toBeInTheDocument();
  });

  it("toggles reasoning visibility on button click", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.queryByText(/within 10% of the \$800 budget/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(/Show reasoning/i));
    expect(screen.getByText(/within 10% of the \$800 budget/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Hide reasoning/i));
    expect(screen.queryByText(/within 10% of the \$800 budget/i)).not.toBeInTheDocument();
  });
});
