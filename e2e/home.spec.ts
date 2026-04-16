import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("shows the TripAgent brand in the topbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("TripAgent")).toBeVisible();
  });

  test("shows the trip input form with all fields", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByPlaceholder("Tokyo, Japan")).toBeVisible();
    await expect(page.getByText("Duration")).toBeVisible();
    await expect(page.getByText("Budget (USD)")).toBeVisible();
    await expect(page.getByText("Travel Style")).toBeVisible();
  });

  test("shows all travel style options", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Adventure/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Cultural/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Relaxation/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Foodie/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Budget/i })).toBeVisible();
  });

  test("shows the Generate button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Generate/i })).toBeVisible();
  });

  test("shows Sign in button when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Sign in/i })).toBeVisible();
  });
});

test.describe("Auth modal", () => {
  test("opens when Sign in is clicked", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Sign in/i }).click();
    await expect(page.getByRole("heading", { name: /Sign in|Log in|Welcome/i })).toBeVisible();
  });
});

test.describe("New trip confirmation", () => {
  test("opens dialog when New trip is clicked", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /New trip/i }).click();
    await expect(page.getByText("Start a new trip?")).toBeVisible();
    await expect(page.getByRole("button", { name: /Cancel/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Yes, reset/i })).toBeVisible();
  });

  test("closes dialog when Cancel is clicked", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /New trip/i }).click();
    await page.getByRole("button", { name: /Cancel/i }).click();
    await expect(page.getByText("Start a new trip?")).not.toBeVisible();
  });
});
