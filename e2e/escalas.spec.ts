import { test, expect } from '@playwright/test';
test.describe('escalas', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/escalas');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/escalas');
    await expect(page.locator('body')).toBeVisible();
  });
});
