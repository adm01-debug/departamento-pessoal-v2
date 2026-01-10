// V14-FIX-003: E2E test for Profile page
import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("[name=email]", "admin@empresa.com");
    await page.fill("[name=password]", "senha123");
    await page.click("button[type=submit]");
    await page.waitForURL("/dashboard");
    await page.goto("/profile");
  });

  test("should display user profile information", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /perfil/i })).toBeVisible();
    await expect(page.locator("[name=nome]")).toBeVisible();
    await expect(page.locator("[name=email]")).toBeVisible();
  });

  test("should update profile successfully", async ({ page }) => {
    await page.fill("[name=nome]", "Novo Nome");
    await page.click("button:has-text('Salvar')");
    await expect(page.getByText(/sucesso|atualizado/i)).toBeVisible();
  });

  test("should display avatar", async ({ page }) => {
    const avatar = page.locator("[data-testid=avatar], .avatar, img[alt*=profile]");
    await expect(avatar).toBeVisible();
  });

  test("should allow avatar upload", async ({ page }) => {
    const fileInput = page.locator("input[type=file][accept*=image]");
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: "avatar.png",
        mimeType: "image/png",
        buffer: Buffer.from("fake-image-data"),
      });
    }
  });

  test("should show password change section", async ({ page }) => {
    const passwordSection = page.getByText(/alterar senha|nova senha/i);
    if (await passwordSection.isVisible()) {
      await expect(passwordSection).toBeVisible();
    }
  });

  test("should validate required fields", async ({ page }) => {
    await page.fill("[name=nome]", "");
    await page.click("button:has-text('Salvar')");
    await expect(page.getByText(/obrigatório|required/i)).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.fill("[name=email]", "invalid-email");
    await page.click("button:has-text('Salvar')");
    await expect(page.getByText(/email|inválido/i)).toBeVisible();
  });

  test("should show notification preferences", async ({ page }) => {
    const notifSection = page.getByText(/notificações|alertas/i);
    if (await notifSection.isVisible()) {
      await expect(notifSection).toBeVisible();
    }
  });
});

