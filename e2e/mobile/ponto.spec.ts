import { test, expect } from '@playwright/test';

/**
 * Smoke mobile do registro de ponto — validamos que a tela responsiva
 * carrega e expõe ações essenciais (entrada/saída) em viewport pequeno.
 */
test.describe('Ponto Mobile (smoke)', () => {
  test('renderiza tela de ponto em viewport mobile', async ({ page }) => {
    await page.goto('/ponto');

    await expect(page.getByRole('heading', { name: /ponto/i }).first())
      .toBeVisible({ timeout: 15_000 });

    // Botão principal de batida (entrada/saída/registrar)
    const botaoBatida = page
      .getByRole('button', { name: /registrar|entrada|sa[ií]da|bater ponto/i })
      .first();
    await expect(botaoBatida).toBeVisible({ timeout: 10_000 });
  });
});
