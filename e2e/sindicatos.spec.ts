import { test, expect } from '@playwright/test';
test.describe('sindicatos', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/sindicatos');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/sindicatos');
    await expect(page.locator('body')).toBeVisible();
  });
});
