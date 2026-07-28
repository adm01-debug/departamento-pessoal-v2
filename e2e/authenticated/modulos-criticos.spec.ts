import { test, expect } from '@playwright/test';

/**
 * Smoke E2E dos módulos críticos de DP.
 * Valida apenas carregamento e ausência de erros de runtime — testes
 * detalhados ficam por conta dos unit/integration (Vitest).
 */
const ROTAS_CRITICAS: Array<{ rota: string; titulo: RegExp }> = [
  { rota: '/colaboradores', titulo: /colaboradores/i },
  { rota: '/folha', titulo: /folha de pagamento|folha/i },
  { rota: '/holerites', titulo: /holerites/i },
  { rota: '/ponto', titulo: /ponto/i },
  { rota: '/ferias', titulo: /f[eé]rias/i },
  { rota: '/esocial', titulo: /eSocial/i },
  { rota: '/relatorios', titulo: /relat[oó]rios/i },
  { rota: '/configuracoes', titulo: /configura[çc][oõ]es/i },
];

for (const { rota, titulo } of ROTAS_CRITICAS) {
  test(`módulo carrega: ${rota}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
    });

    const resp = await page.goto(rota, { waitUntil: 'domcontentloaded' });
    expect(resp?.status() ?? 200, `HTTP status para ${rota}`).toBeLessThan(500);

    // Garante que não foi redirecionado para login
    await expect(page).not.toHaveURL(/\/login/);

    // Heading principal do módulo
    await expect(page.getByRole('heading').filter({ hasText: titulo }).first())
      .toBeVisible({ timeout: 15_000 });

    // Filtra ruído conhecido (extensões, telemetria third-party)
    const fatais = errors.filter(
      (e) => !/(ResizeObserver|chrome-extension|favicon|net::ERR_BLOCKED_BY_CLIENT)/i.test(e),
    );
    expect(fatais, `Erros em ${rota}:\n${fatais.join('\n')}`).toHaveLength(0);
  });
}
