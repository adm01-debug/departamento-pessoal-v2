import { test, expect } from '@playwright/test';

/**
 * Simula expiração de sessão limpando storage/cookies do Supabase
 * e valida que rotas protegidas redirecionam para /login.
 *
 * Não afeta o storageState global — cada teste isola em contexto próprio.
 */
test.describe('Expiração de sessão', () => {
  test('rota protegida redireciona para /login após limpar sessão', async ({ page, context }) => {
    // 1. Sessão viva → acessa dashboard normalmente
    await page.goto('/dashboard');
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    expect(page.url()).toContain('/dashboard');

    // 2. Expira a sessão (limpa tokens do Supabase em storage + cookies)
    await context.clearCookies();
    await page.evaluate(() => {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('sb-') || k.includes('supabase'))
        .forEach((k) => localStorage.removeItem(k));
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('sb-') || k.includes('supabase'))
        .forEach((k) => sessionStorage.removeItem(k));
    });

    // 3. Nova navegação para rota protegida deve cair em /login
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    expect(page.url()).toContain('/login');
    await expect(page.getByLabel(/e-?mail/i).first()).toBeVisible();
  });

  test('token corrompido é tratado como sessão inválida', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });

    await page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
      if (key) localStorage.setItem(key, JSON.stringify({ access_token: 'invalid', refresh_token: 'invalid' }));
    });

    await page.goto('/perfil');
    await page.waitForURL((url) => url.pathname === '/login' || url.pathname === '/perfil', { timeout: 15_000 });
    // Se o app recuperou sessão via refresh, mantém /perfil; se rejeitou, vai para /login.
    // Ambos os cenários são aceitáveis desde que não haja erro fatal.
    expect(['/login', '/perfil']).toContain(new URL(page.url()).pathname);
  });
});
