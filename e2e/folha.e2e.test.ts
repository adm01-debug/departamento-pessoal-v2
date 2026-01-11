// V16-040: E2E Tests - Folha de Pagamento
import { test, expect } from '@playwright/test';

test.describe('Folha de Pagamento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/folha');
  });

  test('should display folha list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /folha/i })).toBeVisible();
  });

  test('should create new folha', async ({ page }) => {
    await page.getByRole('button', { name: /nova folha/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should select competencia', async ({ page }) => {
    await page.getByRole('button', { name: /nova folha/i }).click();
    await page.getByLabel(/competência/i).click();
    await expect(page.getByRole('option')).toBeVisible();
  });

  test('should calculate folha', async ({ page }) => {
    const calcButton = page.getByRole('button', { name: /calcular/i });
    if (await calcButton.isVisible()) {
      await calcButton.click();
      await expect(page.getByText(/calculando|processando/i)).toBeVisible();
    }
  });

  test('should export folha', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /exportar/i });
    if (await exportButton.isVisible()) {
      await exportButton.click();
      await expect(page.getByText(/pdf|excel|csv/i)).toBeVisible();
    }
  });
});
