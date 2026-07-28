import { test, expect } from '@playwright/test';

test.describe('Tela de Login (público)', () => {
  test('renderiza formulário de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/e-?mail/i).first()).toBeVisible();
    await expect(page.getByLabel(/senha|password/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar|login|acessar/i }).first()).toBeVisible();
  });

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-?mail/i).first().fill('inexistente@teste.local');
    await page.getByLabel(/senha|password/i).first().fill('senha-errada-123');
    await page.getByRole('button', { name: /entrar|login|acessar/i }).first().click();

    // Aceita qualquer feedback de erro (toast, alert, mensagem inline)
    const erro = page.locator('[role="alert"], [data-sonner-toast], .text-destructive').first();
    await expect(erro).toBeVisible({ timeout: 10_000 });
  });

  test('protege rotas privadas redirecionando para /login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    expect(page.url()).toContain('/login');
  });
});
