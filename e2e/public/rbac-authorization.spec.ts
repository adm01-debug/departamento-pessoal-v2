import { test, expect } from '@playwright/test';

/**
 * Autorização por roles / rotas protegidas.
 *
 * Cenário público (sem sessão): TODAS as rotas privadas devem redirecionar
 * para /login, incluindo áreas administrativas. Isso protege contra
 * enumeração de rotas e vazamento de UI sensível.
 */
const rotasProtegidas = [
  '/dashboard',
  '/perfil',
  '/colaboradores',
  '/folha',
  '/empresas',
  '/admin/telemetria',
];

test.describe('RBAC — proteção de rotas (usuário anônimo)', () => {
  for (const rota of rotasProtegidas) {
    test(`rota ${rota} redireciona anônimo para /login`, async ({ page }) => {
      await page.goto(rota);
      await page.waitForURL(/\/login/, { timeout: 15_000 });
      expect(page.url()).toContain('/login');
      await expect(page.getByLabel(/e-?mail/i).first()).toBeVisible();
    });
  }

  test('deep-link com query string preserva redirecionamento', async ({ page }) => {
    await page.goto('/colaboradores?filtro=ativos');
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    expect(page.url()).toContain('/login');
  });
});
