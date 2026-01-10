// V14-015: e2e/Relatorios.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Relatórios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/relatorios");
  });

  test("should display reports page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /relatórios/i })).toBeVisible();
  });

  test("should list available reports", async ({ page }) => {
    await expect(page.getByText(/folha.*pagamento/i)).toBeVisible();
    await expect(page.getByText(/férias/i)).toBeVisible();
    await expect(page.getByText(/ponto/i)).toBeVisible();
  });

  test("should generate PDF report", async ({ page }) => {
    await page.getByRole("button", { name: /folha.*pagamento/i }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /gerar.*pdf/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });

  test("should generate Excel report", async ({ page }) => {
    await page.getByRole("button", { name: /colaboradores/i }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /gerar.*excel/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
  });

  test("should filter report by period", async ({ page }) => {
    await page.getByRole("button", { name: /folha/i }).click();
    await page.getByLabel(/início/i).fill("2026-01-01");
    await page.getByLabel(/fim/i).fill("2026-01-31");
    await expect(page.getByRole("button", { name: /gerar/i })).toBeEnabled();
  });
});

