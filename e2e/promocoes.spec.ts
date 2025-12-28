import { test, expect } from '@playwright/test';
test.describe('promocoes', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/promocoes');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/promocoes');
    await expect(page.locator('body')).toBeVisible();
  });
});
