import { test, expect } from '@playwright/test';
test.describe('transferencias', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/transferencias');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/transferencias');
    await expect(page.locator('body')).toBeVisible();
  });
});
