// V14-010: e2e/Ferias.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Férias", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/ferias");
  });

  test("should display ferias list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /férias/i })).toBeVisible();
  });

  test("should filter by status", async ({ page }) => {
    await page.getByRole("combobox", { name: /status/i }).click();
    await page.getByRole("option", { name: /aprovado/i }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should open new ferias request", async ({ page }) => {
    await page.getByRole("button", { name: /novo|solicitar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should validate ferias period", async ({ page }) => {
    await page.getByRole("button", { name: /novo|solicitar/i }).click();
    await page.getByLabel(/colaborador/i).click();
    await page.getByRole("option").first().click();
    await page.getByLabel(/início/i).fill("2026-02-01");
    await page.getByLabel(/fim/i).fill("2026-01-15"); // Data fim antes de início
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/data.*inválida|invalid/i)).toBeVisible();
  });

  test("should create ferias request", async ({ page }) => {
    await page.getByRole("button", { name: /novo|solicitar/i }).click();
    await page.getByLabel(/colaborador/i).click();
    await page.getByRole("option").first().click();
    await page.getByLabel(/início/i).fill("2026-02-01");
    await page.getByLabel(/fim/i).fill("2026-02-20");
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso|success/i)).toBeVisible();
  });
});

