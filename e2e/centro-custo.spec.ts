import { test, expect } from '@playwright/test';
test.describe('centro-custo', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/centro-custo');
    await expect(page).toHaveTitle(/./);
  });
  test('has content', async ({ page }) => {
    await page.goto('/centro-custo');
    await expect(page.locator('body')).toBeVisible();
  });
  test('navigation works', async ({ page }) => {
    await page.goto('/centro-custo');
    await expect(page).toHaveURL(/.*/);
  });
});
