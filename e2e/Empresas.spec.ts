// V14-018: e2e/Empresas.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Empresas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/empresas");
  });

  test("should display empresas list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /empresas/i })).toBeVisible();
  });

  test("should add new empresa", async ({ page }) => {
    await page.getByRole("button", { name: /nova|adicionar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should validate CNPJ", async ({ page }) => {
    await page.getByRole("button", { name: /nova|adicionar/i }).click();
    await page.getByLabel(/cnpj/i).fill("123");
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/cnpj.*inválido/i)).toBeVisible();
  });

  test("should view empresa details", async ({ page }) => {
    await page.getByRole("row").nth(1).click();
    await expect(page.getByText(/detalhes/i)).toBeVisible();
  });

  test("should switch empresa context", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole("button", { name: /selecionar/i }).click();
    await expect(page.getByText(/empresa.*selecionada/i)).toBeVisible();
  });
});

