// V14-014: e2e/ESocial.spec.ts
import { test, expect } from "@playwright/test";

test.describe("eSocial", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/esocial");
  });

  test("should display esocial dashboard", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /esocial/i })).toBeVisible();
  });

  test("should show pending events", async ({ page }) => {
    await expect(page.getByTestId("eventos-pendentes")).toBeVisible();
  });

  test("should filter by event type", async ({ page }) => {
    await page.getByRole("combobox", { name: /evento/i }).click();
    await page.getByRole("option", { name: /S-2200/i }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should send event to government", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /confirmar/i }).click();
    await expect(page.getByText(/enviado|processando/i)).toBeVisible();
  });

  test("should view event details", async ({ page }) => {
    await page.getByRole("row").nth(1).click();
    await expect(page.getByText(/xml|detalhes/i)).toBeVisible();
  });

  test("should show transmission status", async ({ page }) => {
    await expect(page.getByTestId("status-transmissao")).toBeVisible();
  });
});

