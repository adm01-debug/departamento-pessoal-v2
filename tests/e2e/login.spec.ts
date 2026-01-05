import { test, expect } from "@playwright/test";
test.describe("Login", () => {
  test("deve exibir formulário de login", async ({ page }) => { await page.goto("/login"); await expect(page.locator("text=Faça login")).toBeVisible(); });
  test("deve fazer login com credenciais válidas", async ({ page }) => { await page.goto("/login"); await page.fill("input[type='email']", "admin@empresa.com"); await page.fill("input[type='password']", "senha123"); await page.click("text=Entrar"); await expect(page).toHaveURL("/"); });
  test("deve exibir erro com credenciais inválidas", async ({ page }) => { await page.goto("/login"); await page.fill("input[type='email']", "invalido@email.com"); await page.fill("input[type='password']", "senhaerrada"); await page.click("text=Entrar"); await expect(page.locator("text=Credenciais inválidas")).toBeVisible(); });
});
