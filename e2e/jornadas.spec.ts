import { test, expect } from '@playwright/test';
test.describe('jornadas', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/jornadas');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/jornadas');
    await expect(page.locator('body')).toBeVisible();
  });
});
