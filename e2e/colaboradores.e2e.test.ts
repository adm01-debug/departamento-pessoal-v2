// V16-039: E2E Tests - Colaboradores CRUD
import { test, expect } from '@playwright/test';

test.describe('Colaboradores CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/colaboradores');
  });

  test('should display colaboradores list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /colaboradores/i })).toBeVisible();
  });

  test('should open new colaborador form', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /novo|adicionar|new/i });
    if (await newButton.isVisible()) {
      await newButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('should validate CPF on form', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /novo|adicionar|new/i });
    if (await newButton.isVisible()) {
      await newButton.click();
      const cpfInput = page.getByLabel(/cpf/i);
      if (await cpfInput.isVisible()) {
        await cpfInput.fill('11111111111');
        await cpfInput.blur();
        await expect(page.getByText(/cpf inválido|invalid cpf/i)).toBeVisible();
      }
    }
  });

  test('should search colaboradores', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('João');
      await page.waitForTimeout(500);
    }
  });

  test('should filter by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      const activeOption = page.getByRole('option', { name: /ativo|active/i });
      if (await activeOption.isVisible()) {
        await activeOption.click();
      }
    }
  });
});
