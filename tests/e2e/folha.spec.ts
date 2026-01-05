import { test, expect } from "@playwright/test";
test.describe("Folha de Pagamento", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/folha"); });
  test("deve exibir competência atual", async ({ page }) => { await expect(page.locator("text=Competência")).toBeVisible(); });
  test("deve exibir status da folha", async ({ page }) => { await expect(page.locator("text=Status da Folha")).toBeVisible(); });
  test("deve calcular folha", async ({ page }) => { await page.click("text=Calcular Folha"); await expect(page.locator("text=Calculando")).toBeVisible(); });
  test("deve exibir totais", async ({ page }) => { await expect(page.locator("text=Total Proventos")).toBeVisible(); await expect(page.locator("text=Total Descontos")).toBeVisible(); });
});
