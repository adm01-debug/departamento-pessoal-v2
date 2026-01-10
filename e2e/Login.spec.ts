// V14-005: e2e/Login.spec.ts - Testes E2E de Login
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /entrar|login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/senha|password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /entrar|login/i })).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await expect(page.getByText(/email.*obrigatório|required/i)).toBeVisible();
    await expect(page.getByText(/senha.*obrigatória|required/i)).toBeVisible();
  });

  test("should show error for invalid email format", async ({ page }) => {
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/senha|password/i).fill("password123");
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await expect(page.getByText(/email.*inválido|invalid/i)).toBeVisible();
  });

  test("should show error for wrong credentials", async ({ page }) => {
    await page.getByLabel(/email/i).fill("wrong@test.com");
    await page.getByLabel(/senha|password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await expect(page.getByText(/credenciais.*inválidas|invalid.*credentials/i)).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await expect(page).toHaveURL(/dashboard/i);
    await expect(page.getByText(/bem-vindo|welcome/i)).toBeVisible();
  });

  test("should navigate to forgot password", async ({ page }) => {
    await page.getByRole("link", { name: /esqueci.*senha|forgot.*password/i }).click();
    await expect(page).toHaveURL(/forgot-password|recuperar-senha/i);
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.getByLabel(/senha|password/i);
    await passwordInput.fill("testpassword");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: /mostrar|show|toggle/i }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("should persist session after login", async ({ page, context }) => {
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await expect(page).toHaveURL(/dashboard/i);
    
    // Verificar que sessão persiste em nova aba
    const newPage = await context.newPage();
    await newPage.goto("/dashboard");
    await expect(newPage).not.toHaveURL(/login/i);
  });
});

