// V14-011: e2e/Folha.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Folha de Pagamento", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/folha");
  });

  test("should display folha list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /folha.*pagamento/i })).toBeVisible();
  });

  test("should filter by competencia", async ({ page }) => {
    await page.getByLabel(/competência|mês/i).click();
    await page.getByRole("option").first().click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should view folha details", async ({ page }) => {
    await page.getByRole("row").nth(1).click();
    await expect(page.getByText(/detalhes.*folha/i)).toBeVisible();
  });

  test("should generate new folha", async ({ page }) => {
    await page.getByRole("button", { name: /gerar.*folha|nova/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should export folha PDF", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /exportar|export/i }).click();
    await page.getByRole("menuitem", { name: /pdf/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/folha.*\.pdf/i);
  });

  test("should show folha summary", async ({ page }) => {
    await expect(page.getByTestId("folha-total-bruto")).toBeVisible();
    await expect(page.getByTestId("folha-total-descontos")).toBeVisible();
    await expect(page.getByTestId("folha-total-liquido")).toBeVisible();
  });
});

