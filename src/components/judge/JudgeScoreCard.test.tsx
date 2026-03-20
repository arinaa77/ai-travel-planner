import { render, screen } from "@testing-library/react";
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
    const bars = document.querySelectorAll("[data-testid='score-bar']");
    expect(bars[0]).toHaveStyle("width: 92%");
    expect(bars[1]).toHaveStyle("width: 78%");
    expect(bars[2]).toHaveStyle("width: 88%");
  });

  it("renders each dimension's score number", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.getByText("92")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
  });
});

describe("JudgeScoreCard — reasoning and verdict", () => {
  it("renders the verdict text", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(
      screen.getByText(/Strong itinerary with accurate budget/i)
    ).toBeInTheDocument();
  });

  it("renders reasoning text for each dimension", () => {
    render(<JudgeScoreCard evaluation={MOCK_EVALUATION} />);
    expect(screen.getByText(/within 10% of the \$800 budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Good mix of cultural sights/i)).toBeInTheDocument();
    expect(screen.getByText(/realistic using Tokyo's subway/i)).toBeInTheDocument();
  });
});
