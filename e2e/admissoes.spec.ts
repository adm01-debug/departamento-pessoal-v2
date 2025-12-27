import { test, expect } from '@playwright/test';

test.describe('Admissoes', () => {
  test('should list admissoes', async ({ page }) => {
    await page.goto('/admissoes');
    await expect(page.locator('h1')).toContainText('Admissões');
  });

  test('should create new admissao', async ({ page }) => {
    await page.goto('/admissoes');
    await page.click('button:has-text("Nova")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});
