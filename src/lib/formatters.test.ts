import { describe, it, expect } from "vitest";
import { formatBudget, formatDuration, formatTripDate } from "./formatters";

describe("formatBudget", () => {
  it("formats whole numbers with dollar sign and commas", () => {
    expect(formatBudget(1500)).toBe("$1,500");
  });

  it("formats numbers under 1000 without commas", () => {
    expect(formatBudget(500)).toBe("$500");
  });

  it("formats large numbers with commas", () => {
    expect(formatBudget(10000)).toBe("$10,000");
  });

  it("formats zero as $0", () => {
    expect(formatBudget(0)).toBe("$0");
  });
});

describe("formatDuration", () => {
  it("returns singular for 1 day", () => {
    expect(formatDuration(1)).toBe("1 day");
  });

  it("returns plural for multiple days", () => {
    expect(formatDuration(5)).toBe("5 days");
  });

  it("returns plural for 0 days", () => {
    expect(formatDuration(0)).toBe("0 days");
  });
});

describe("formatTripDate", () => {
  it("formats an ISO date string as Month DD, YYYY", () => {
    expect(formatTripDate("2026-04-16T00:00:00.000Z")).toBe("Apr 16, 2026");
  });

  it("formats a different date correctly", () => {
    expect(formatTripDate("2026-12-25T00:00:00.000Z")).toBe("Dec 25, 2026");
  });

  it("returns Invalid Date for a bad input", () => {
    expect(formatTripDate("not-a-date")).toBe("Invalid Date");
  });
});
