import { test, expect } from '@playwright/test';

test.describe('Privacidade Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacidade');
  });

  test('should load correctly', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper structure', async ({ page }) => {
    const content = page.locator('main, [role="main"], .container, #root');
    await expect(content.first()).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});
