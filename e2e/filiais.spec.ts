import { test, expect } from '@playwright/test';
test.describe('filiais', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/filiais');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/filiais');
    await expect(page.locator('body')).toBeVisible();
  });
});
