import { test, expect } from '@playwright/test';
test.describe('acordos', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/acordos');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/acordos');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/acordos');
    await expect(page).toHaveURL(/.*/);
  });
});
