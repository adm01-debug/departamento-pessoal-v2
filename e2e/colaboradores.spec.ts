import { test, expect } from '@playwright/test';

test.describe('Colaboradores', () => {
  test('should list colaboradores', async ({ page }) => {
    await page.goto('/colaboradores');
    await expect(page.locator('h1')).toContainText('Colaboradores');
  });

  test('should open new colaborador modal', async ({ page }) => {
    await page.goto('/colaboradores');
    await page.click('button:has-text("Novo")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});
