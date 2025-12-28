import { test, expect } from '@playwright/test';
test.describe('exames', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/exames');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/exames');
    await expect(page.locator('body')).toBeVisible();
  });
});
