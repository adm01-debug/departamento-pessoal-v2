import { test, expect } from "@playwright/test";
test.describe("Férias", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/ferias"); });
  test("deve listar férias programadas", async ({ page }) => { await expect(page.locator("text=Gestão de Férias")).toBeVisible(); });
  test("deve exibir férias vencidas", async ({ page }) => { await expect(page.locator("text=Férias Vencidas")).toBeVisible(); });
  test("deve programar novas férias", async ({ page }) => { await page.click("text=Programar Férias"); await expect(page.locator("text=Data Início")).toBeVisible(); });
});
