// V16-038: E2E Tests - Authentication Flow
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /entrar|login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/senha/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar|login/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid@test.com');
    await page.getByLabel(/senha/i).fill('wrongpassword');
    await page.getByRole('button', { name: /entrar|login/i }).click();
    await expect(page.getByText(/incorretos|inválido|error/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /entrar|login/i }).click();
    await expect(page.getByText(/obrigatório|required/i)).toBeVisible();
  });

  test('should navigate to forgot password', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: /esqueci|forgot/i });
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      await expect(page).toHaveURL(/reset|recuperar/i);
    }
  });
});
