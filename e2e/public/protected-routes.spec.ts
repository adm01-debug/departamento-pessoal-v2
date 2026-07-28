import { test, expect } from '@playwright/test';

test.describe('Acesso a Rotas Protegidas e Redirecionamento', () => {
  
  test('redireciona para /login ao acessar rota protegida sem auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('redireciona para /login ao acessar /perfil sem auth', async ({ page }) => {
    await page.goto('/perfil');
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });

  test('permite acesso a rota pública /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /bem-vindo/i }).first()).toBeVisible();
  });

  test('permite acesso a rota pública /contratacao', async ({ page }) => {
    await page.goto('/contratacao');
    // Verifica se a página de contratação carrega algo identificável
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });
});
