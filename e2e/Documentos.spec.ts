// V14-017: e2e/Documentos.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Documentos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/documentos");
  });

  test("should display documents page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /documentos/i })).toBeVisible();
  });

  test("should list documents", async ({ page }) => {
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should filter by document type", async ({ page }) => {
    await page.getByRole("combobox", { name: /tipo/i }).click();
    await page.getByRole("option", { name: /contrato/i }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should upload new document", async ({ page }) => {
    await page.getByRole("button", { name: /upload|enviar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should preview document", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole("button", { name: /visualizar/i }).click();
    await expect(page.getByTestId("document-preview")).toBeVisible();
  });

  test("should download document", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("row").nth(1).getByRole("button", { name: /download|baixar/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();
  });
});

