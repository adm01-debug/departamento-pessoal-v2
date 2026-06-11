import { test, expect } from '@playwright/test';

/**
 * Smoke mobile do registro de ponto — validamos que a tela responsiva
 * carrega e expõe ações essenciais (entrada/saída) em viewport pequeno.
 */
test.describe('Ponto Mobile (smoke)', () => {
  test('renderiza tela de ponto em viewport mobile', async ({ page }) => {
    await page.goto('/ponto');

    // TEMP(debug e2e): diagnóstico do estado de auth no contexto mobile.
    await page.waitForTimeout(3000);
    const diag = await page.evaluate(() => {
      const entries = Object.entries(localStorage);
      return {
        url: location.href,
        lsKeys: entries.map(([k]) => k),
        authEntries: entries
          .filter(([k]) => k.startsWith('sb-') || k.toLowerCase().includes('auth'))
          .map(([k, v]) => `${k}=${(v || '').slice(0, 60)}`),
        bodyText: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 160),
      };
    });
    console.log('MOBILE_PONTO_DIAG ' + JSON.stringify(diag));

    await expect(page.getByRole('heading', { name: /ponto/i }).first())
      .toBeVisible({ timeout: 15_000 });

    // Botão principal de batida (entrada/saída/registrar)
    const botaoBatida = page
      .getByRole('button', { name: /registrar|entrada|sa[ií]da|bater ponto/i })
      .first();
    await expect(botaoBatida).toBeVisible({ timeout: 10_000 });
  });
});
