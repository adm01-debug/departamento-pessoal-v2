import { test, expect } from "@playwright/test";
test.describe("Colaboradores", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/colaboradores"); });
  test("deve listar colaboradores", async ({ page }) => { await expect(page.locator("text=Colaboradores")).toBeVisible(); });
  test("deve abrir modal de novo colaborador", async ({ page }) => { await page.click("text=Novo Colaborador"); await expect(page.locator("text=Dados Pessoais")).toBeVisible(); });
  test("deve filtrar por status", async ({ page }) => { await page.click("text=Status"); await page.click("text=Ativos"); await expect(page.locator("[data-status='ativo']")).toBeVisible(); });
  test("deve buscar por nome", async ({ page }) => { await page.fill("input[placeholder*='Buscar']", "João"); await expect(page.locator("text=João")).toBeVisible(); });
});
