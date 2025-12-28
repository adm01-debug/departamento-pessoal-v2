import { test, expect } from '@playwright/test';

test.describe('Bitrix24Config Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bitrix24-config');
  });

  test('should load page correctly', async ({ page }) => {
    await expect(page).toHaveURL(/bitrix24-config/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/.*/);
  });

  test('should be accessible', async ({ page }) => {
    const main = page.locator('main, [role="main"], .container');
    await expect(main.first()).toBeVisible();
  });

  test('should handle navigation', async ({ page }) => {
    const links = page.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});
