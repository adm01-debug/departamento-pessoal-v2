import { test, expect } from '@playwright/test';
test.describe('contratos-e2e', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/contratos-e2e');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/contratos-e2e');
    await expect(page.locator('body')).toBeVisible();
  });
});
