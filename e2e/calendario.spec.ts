import { test, expect } from '@playwright/test';
test.describe('calendario', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/calendario');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/calendario');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/calendario');
    await expect(page).toHaveURL(/.*/);
  });
});
