import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Departamento Pessoal/);
  });

  test('should navigate to colaboradores', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Colaboradores');
    await expect(page).toHaveURL(/colaboradores/);
  });
});
