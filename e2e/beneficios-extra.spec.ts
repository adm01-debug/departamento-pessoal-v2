import { test, expect } from '@playwright/test';
test.describe('beneficios-extra', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/beneficios-extra');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/beneficios-extra');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/beneficios-extra');
    await expect(page).toHaveURL(/.*/);
  });
});
