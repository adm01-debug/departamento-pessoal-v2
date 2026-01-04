import { test, expect } from "@playwright/test";

test.describe("dashboard E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load dashboard page", async ({ page }) => {
    await expect(page).toHaveTitle(/Departamento Pessoal/);
  });

  test("should navigate to dashboard", async ({ page }) => {
    await page.click("[data-testid='nav-dashboard']");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should display dashboard content", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
  });

  test("should handle dashboard interactions", async ({ page }) => {
    await page.goto("/dashboard");
    const buttons = page.locator("button");
    if (await buttons.count() > 0) {
      await buttons.first().click();
      await expect(page).not.toHaveURL(/error/);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should handle keyboard navigation", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("should have accessible elements", async ({ page }) => {
    await page.goto("/dashboard");
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const btn = buttons.nth(i);
      const label = await btn.getAttribute("aria-label") || await btn.textContent();
      expect(label).toBeTruthy();
    }
  });

  test("should handle errors gracefully", async ({ page }) => {
    await page.route("**/api/**", (route) => route.abort());
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });
});
