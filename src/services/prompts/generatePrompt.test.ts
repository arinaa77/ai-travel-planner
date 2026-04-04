import { describe, it, expect } from "vitest";
import { GENERATE_SYSTEM_PROMPT, buildGenerateUserPrompt } from "./generatePrompt";

describe("generatePrompt", () => {
  it("system prompt is a non-empty string", () => {
    expect(typeof GENERATE_SYSTEM_PROMPT).toBe("string");
    expect(GENERATE_SYSTEM_PROMPT.length).toBeGreaterThan(0);
  });

  it("buildGenerateUserPrompt includes destination, days, and budget", () => {
    const prompt = buildGenerateUserPrompt({
      destination: "Kyoto, Japan",
      days: 5,
      budget: 2000,
      style: "Cultural",
    });
    expect(prompt).toContain("Kyoto, Japan");
    expect(prompt).toContain("5-day");
    expect(prompt).toContain("$2000");
  });

  it("buildGenerateUserPrompt includes travel style", () => {
    const prompt = buildGenerateUserPrompt({
      destination: "Barcelona",
      days: 3,
      budget: 1000,
      style: "Foodie",
    });
    expect(prompt).toContain("Foodie");
  });

  it("buildGenerateUserPrompt requests budget, attractions, and food breakdowns", () => {
    const prompt = buildGenerateUserPrompt({
      destination: "Tokyo",
      days: 3,
      budget: 800,
      style: "Adventure",
    });
    expect(prompt).toMatch(/budget breakdown/i);
    expect(prompt).toMatch(/attraction/i);
    expect(prompt).toMatch(/food/i);
  });

  it("buildGenerateUserPrompt enforces short value format", () => {
    const prompt = buildGenerateUserPrompt({
      destination: "Tokyo",
      days: 3,
      budget: 800,
      style: "Cultural",
    });
    expect(prompt).toMatch(/short.*name/i);
  });
});
