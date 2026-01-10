// V14-013: e2e/Beneficios.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Benefícios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/beneficios");
  });

  test("should display beneficios list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /benefícios/i })).toBeVisible();
  });

  test("should filter by type", async ({ page }) => {
    await page.getByRole("combobox", { name: /tipo/i }).click();
    await page.getByRole("option", { name: /vale.*transporte/i }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should add new beneficio", async ({ page }) => {
    await page.getByRole("button", { name: /novo|adicionar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should view beneficio details", async ({ page }) => {
    await page.getByRole("row").nth(1).click();
    await expect(page.getByText(/detalhes/i)).toBeVisible();
  });

  test("should calculate VT automatically", async ({ page }) => {
    await page.getByRole("button", { name: /calcular.*vt/i }).click();
    await expect(page.getByText(/cálculo.*realizado/i)).toBeVisible();
  });
});

