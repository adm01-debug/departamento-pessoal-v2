// V14-019: e2e/Profile.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Perfil do Usuário", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/perfil");
  });

  test("should display profile page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /perfil|minha conta/i })).toBeVisible();
  });

  test("should show user info", async ({ page }) => {
    await expect(page.getByLabel(/nome/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("should update profile", async ({ page }) => {
    await page.getByLabel(/telefone/i).fill("11999888777");
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByText(/sucesso/i)).toBeVisible();
  });

  test("should change password", async ({ page }) => {
    await page.getByRole("tab", { name: /senha|segurança/i }).click();
    await page.getByLabel(/senha.*atual/i).fill("admin123");
    await page.getByLabel(/nova.*senha/i).fill("newpassword123");
    await page.getByLabel(/confirmar.*senha/i).fill("newpassword123");
    await page.getByRole("button", { name: /alterar/i }).click();
    await expect(page.getByText(/senha.*alterada/i)).toBeVisible();
  });

  test("should upload avatar", async ({ page }) => {
    await page.getByTestId("avatar-upload").click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should configure 2FA", async ({ page }) => {
    await page.getByRole("tab", { name: /segurança/i }).click();
    await page.getByRole("button", { name: /ativar.*2fa/i }).click();
    await expect(page.getByText(/qr.*code|autenticador/i)).toBeVisible();
  });
});

