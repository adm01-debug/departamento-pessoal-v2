// V14-012: e2e/Ponto.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Ponto", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/ponto");
  });

  test("should display ponto page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /ponto|frequência/i })).toBeVisible();
  });

  test("should show calendar view", async ({ page }) => {
    await expect(page.getByTestId("ponto-calendar")).toBeVisible();
  });

  test("should register entrada", async ({ page }) => {
    await page.getByRole("button", { name: /entrada/i }).click();
    await expect(page.getByText(/entrada.*registrada/i)).toBeVisible();
  });

  test("should register saida", async ({ page }) => {
    await page.getByRole("button", { name: /saída/i }).click();
    await expect(page.getByText(/saída.*registrada/i)).toBeVisible();
  });

  test("should view espelho de ponto", async ({ page }) => {
    await page.getByRole("button", { name: /espelho/i }).click();
    await expect(page.getByText(/espelho.*ponto/i)).toBeVisible();
  });

  test("should filter by colaborador", async ({ page }) => {
    await page.getByLabel(/colaborador/i).click();
    await page.getByRole("option").first().click();
    await expect(page.getByRole("table")).toBeVisible();
  });
});

