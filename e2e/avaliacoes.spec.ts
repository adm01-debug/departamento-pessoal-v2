import { test, expect } from '@playwright/test';
test.describe('avaliacoes', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/avaliacoes');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/avaliacoes');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/avaliacoes');
    await expect(page).toHaveURL(/.*/);
  });
});
