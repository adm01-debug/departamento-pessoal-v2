// V15-110: e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('should display welcome step', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bem-vindo');
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1');
  });

  test('should navigate through steps', async ({ page }) => {
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('2');
    
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('3');
  });

  test('should go back to previous step', async ({ page }) => {
    await page.click('[data-testid="next-button"]');
    await page.click('[data-testid="back-button"]');
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1');
  });

  test('should complete company setup', async ({ page }) => {
    await page.click('[data-testid="next-button"]');
    await page.fill('[data-testid="company-name"]', 'Empresa Teste LTDA');
    await page.fill('[data-testid="company-cnpj"]', '12.345.678/0001-90');
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('3');
  });

  test('should skip optional steps', async ({ page }) => {
    await page.click('[data-testid="skip-button"]');
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('2');
  });

  test('should finish onboarding', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('[data-testid="next-button"]');
    }
    await page.click('[data-testid="finish-button"]');
    await expect(page).toHaveURL(/dashboard/);
  });
});
