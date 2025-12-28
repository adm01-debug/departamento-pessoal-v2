import { test, expect } from '@playwright/test';
test.describe('homologacao', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/homologacao');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/homologacao');
    await expect(page.locator('body')).toBeVisible();
  });
});
