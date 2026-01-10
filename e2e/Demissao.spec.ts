// V14-009: e2e/Demissao.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Demissão", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/demissao");
  });

  test("should display demissao page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /demissão|desligamento/i })).toBeVisible();
  });

  test("should search colaborador to demit", async ({ page }) => {
    await page.getByPlaceholder(/buscar.*colaborador/i).fill("João");
    await expect(page.getByRole("listbox")).toBeVisible();
  });

  test("should select motivo demissao", async ({ page }) => {
    await page.getByLabel(/motivo/i).click();
    await expect(page.getByRole("option", { name: /sem justa causa/i })).toBeVisible();
  });

  test("should calculate rescisao preview", async ({ page }) => {
    await page.getByPlaceholder(/buscar.*colaborador/i).fill("João");
    await page.getByRole("option").first().click();
    await page.getByLabel(/motivo/i).click();
    await page.getByRole("option", { name: /sem justa causa/i }).click();
    await page.getByLabel(/data.*demissão/i).fill("2026-01-15");
    await page.getByRole("button", { name: /calcular/i }).click();
    await expect(page.getByText(/valores.*rescisão/i)).toBeVisible();
  });
});

