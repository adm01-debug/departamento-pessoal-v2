import { test, expect } from "@playwright/test";
test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });
  test("deve exibir cards de estatísticas", async ({ page }) => { await expect(page.locator("text=Total Colaboradores")).toBeVisible(); await expect(page.locator("text=Custo Folha")).toBeVisible(); });
  test("deve exibir alertas", async ({ page }) => { await expect(page.locator("text=Alertas")).toBeVisible(); });
  test("deve navegar para colaboradores", async ({ page }) => { await page.click("text=Colaboradores"); await expect(page).toHaveURL(/colaboradores/); });
});
