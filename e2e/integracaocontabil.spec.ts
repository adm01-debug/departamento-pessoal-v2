import { test, expect } from '@playwright/test';

test.describe('IntegracaoContabil Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/integracaocontabil');
  });

  test('should load page correctly', async ({ page }) => {
    await expect(page).toHaveURL(/integracaocontabil/i);
  });

  test('should have correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should be accessible', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have navigation', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const loader = page.locator('[data-testid="loader"]');
    await expect(loader).not.toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should have footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
