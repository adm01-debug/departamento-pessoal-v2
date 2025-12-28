import { test, expect } from '@playwright/test';
test.describe('turnos', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/turnos');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/turnos');
    await expect(page.locator('body')).toBeVisible();
  });
});
