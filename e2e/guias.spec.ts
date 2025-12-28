import { test, expect } from '@playwright/test';
test.describe('guias', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/guias');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/guias');
    await expect(page.locator('body')).toBeVisible();
  });
});
