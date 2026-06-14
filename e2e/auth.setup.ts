import { test as setup, expect } from '@playwright/test';
import path from 'node:path';

const AUTH_FILE = path.resolve('e2e/.auth/user.json');

const EMAIL = process.env.E2E_USER_EMAIL ?? 'admin@teste.local';
const PASSWORD = process.env.E2E_USER_PASSWORD ?? 'Admin@2026!';

/**
 * Autentica uma única vez e persiste a sessão (cookies + localStorage).
 * Os specs autenticados reusam esse arquivo, evitando múltiplos logins.
 *
 * Resiliência:
 *  - Tenta detectar se o app já está logado (sessão de dev) — pula o login.
 *  - Em ambiente sem credenciais válidas, falha cedo com mensagem clara.
 */
setup('autentica usuário de teste', async ({ page }) => {
  await page.goto('/login');

  // Desabilita a experiência de onboarding (tour guiado), cujo overlay full-screen
  // (z-[200]) intercepta cliques e quebra os testes de navegação autenticados.
  const disableOnboarding = async () => {
    await page.evaluate(() => localStorage.setItem('dp-tour-completed', 'true'));
  };

  // Caso a sessão já esteja persistida pelo dev, o app redireciona para /dashboard.
  if (page.url().includes('/dashboard')) {
    await disableOnboarding();
    await page.context().storageState({ path: AUTH_FILE });
    return;
  }

  const emailInput = page.getByLabel(/e-?mail/i).first();
  await expect(emailInput, 'tela de login deve estar visível').toBeVisible({ timeout: 15_000 });

  await emailInput.fill(EMAIL);
  await page.getByLabel(/senha|password/i).first().fill(PASSWORD);
  await page.getByRole('button', { name: /entrar|login|acessar/i }).first().click();

  // Aguarda redirect autenticado (qualquer rota dentro do app)
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 20_000 });

  await disableOnboarding();
  await page.context().storageState({ path: AUTH_FILE });
});
