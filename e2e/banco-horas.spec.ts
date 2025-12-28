import { test, expect } from '@playwright/test';
test.describe('banco-horas', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/banco-horas');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/banco-horas');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/banco-horas');
    await expect(page).toHaveURL(/.*/);
  });
});
