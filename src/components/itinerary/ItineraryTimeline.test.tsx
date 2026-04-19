import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ItineraryTimeline from "./ItineraryTimeline";
import { MOCK_ITINERARY } from "@/lib/mockData";

const mockWriteText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: mockWriteText },
    writable: true,
  });
  mockWriteText.mockClear();
});

describe("ItineraryTimeline — structure", () => {
  it("renders the full itinerary heading", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.getByText("Full itinerary")).toBeInTheDocument();
  });

  it("renders Copy itinerary button", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.queryByText("Remix a day")).not.toBeInTheDocument();
    expect(screen.getByText("Copy itinerary")).toBeInTheDocument();
  });

  it("renders a day header for each day", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    MOCK_ITINERARY.forEach((day) => {
      expect(screen.getByText(new RegExp(`Day ${day.day}`, "i"))).toBeInTheDocument();
    });
  });
});

describe("ItineraryTimeline — events", () => {
  it("renders all event titles", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.getByText("Arrive Narita Airport")).toBeInTheDocument();
    expect(screen.getByText("Meiji Shrine")).toBeInTheDocument();
    expect(screen.getByText("Ichiran Ramen")).toBeInTheDocument();
  });

  it("renders event times", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.getByText("07:30")).toBeInTheDocument();
    expect(screen.getAllByText("13:00").length).toBeGreaterThan(0);
  });

  it("renders Free for null-cost events", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.getAllByText("Free").length).toBeGreaterThan(0);
  });

  it("renders dollar cost for paid events", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.getByText("$420")).toBeInTheDocument();
    expect(screen.getByText("$12")).toBeInTheDocument();
  });

  it("renders type badges", () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    expect(screen.getAllByText("Travel").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sight").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Food").length).toBeGreaterThan(0);
  });
});

describe("ItineraryTimeline — copy itinerary", () => {
  it("copies itinerary text to clipboard on button click", async () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    fireEvent.click(screen.getByText("Copy itinerary"));
    expect(mockWriteText).toHaveBeenCalledOnce();
    expect(mockWriteText.mock.calls[0][0]).toContain("Day 1");
  });

  it("shows Copied! feedback after click", async () => {
    render(<ItineraryTimeline days={MOCK_ITINERARY} />);
    fireEvent.click(screen.getByText("Copy itinerary"));
    await waitFor(() => expect(screen.getByText("Copied!")).toBeInTheDocument());
  });
});
