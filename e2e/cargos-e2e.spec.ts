import { test, expect } from '@playwright/test';
test.describe('cargos-e2e', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/cargos-e2e');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/cargos-e2e');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/cargos-e2e');
    await expect(page).toHaveURL(/.*/);
  });
});
