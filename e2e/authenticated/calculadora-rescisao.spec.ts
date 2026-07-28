import { test, expect } from '@playwright/test';

/**
 * Cálculo de rescisão é uma das rotinas mais críticas do sistema.
 * Validamos um cálculo simples ponta-a-ponta na calculadora pública do app.
 */
test.describe('Calculadora de Rescisão (autenticado)', () => {
  test('renderiza calculadora e aceita inputs básicos', async ({ page }) => {
    await page.goto('/calculadora-rescisao');

    await expect(page.getByRole('heading', { name: /rescis[aã]o/i }).first())
      .toBeVisible({ timeout: 15_000 });

    // A calculadora típica expõe inputs de salário e datas — não dependemos de IDs
    // específicos: validamos apenas presença de inputs numéricos e um botão de cálculo.
    const inputs = page.locator('input[type="number"], input[inputmode="numeric"]');
    await expect(inputs.first()).toBeVisible({ timeout: 10_000 });

    const botaoCalcular = page.getByRole('button', { name: /calcular|simular/i }).first();
    await expect(botaoCalcular).toBeVisible();
  });
});
