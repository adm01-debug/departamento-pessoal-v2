import { test, expect } from '@playwright/test';

test.describe('Configuracoes', () => {
  test('should show settings page', async ({ page }) => {
    await page.goto('/configuracoes');
    await expect(page.locator('h1')).toContainText('Configurações');
  });

  test('should save settings', async ({ page }) => {
    await page.goto('/configuracoes');
    await page.click('button:has-text("Salvar")');
  });
});
