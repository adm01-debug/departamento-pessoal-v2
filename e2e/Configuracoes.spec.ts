// V14-016: e2e/Configuracoes.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Configurações", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/configuracoes");
  });

  test("should display settings page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /configurações/i })).toBeVisible();
  });

  test("should show empresa settings", async ({ page }) => {
    await page.getByRole("tab", { name: /empresa/i }).click();
    await expect(page.getByLabel(/razão.*social/i)).toBeVisible();
  });

  test("should update empresa data", async ({ page }) => {
    await page.getByRole("tab", { name: /empresa/i }).click();
    await page.getByLabel(/telefone/i).fill("1199999999");
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso/i)).toBeVisible();
  });

  test("should configure notifications", async ({ page }) => {
    await page.getByRole("tab", { name: /notificações/i }).click();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("should configure integrations", async ({ page }) => {
    await page.getByRole("tab", { name: /integrações/i }).click();
    await expect(page.getByText(/bitrix|erp|contábil/i)).toBeVisible();
  });

  test("should backup data", async ({ page }) => {
    await page.getByRole("tab", { name: /backup/i }).click();
    await page.getByRole("button", { name: /fazer.*backup/i }).click();
    await expect(page.getByText(/backup.*iniciado/i)).toBeVisible();
  });
});

