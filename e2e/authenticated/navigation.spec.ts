import { test, expect } from '@playwright/test';

test.describe('Fluxo de Navegação e Logout (autenticado)', () => {
  test.beforeEach(async ({ page }) => {
    // A autenticação já deve ter sido feita pelo setup (e2e/.auth/user.json)
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('navegação entre módulos via sidebar', async ({ page }) => {
    // Abrir o grupo "Tempo & Ausências" se estiver fechado (o sidebar costuma vir aberto)
    const grupoTempo = page.getByRole('button', { name: /tempo & ausências/i });
    if (await grupoTempo.isVisible()) {
      const isExpanded = await grupoTempo.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await grupoTempo.click();
      }
    }

    // Navegar para Férias
    await page.getByRole('link', { name: /férias/i }).first().click();
    await expect(page).toHaveURL(/\/ferias/);
    await expect(page.getByRole('heading', { name: /férias/i }).first()).toBeVisible();

    // Navegar para Colaboradores
    await page.getByRole('link', { name: /colaboradores/i }).first().click();
    await expect(page).toHaveURL(/\/colaboradores/);
    await expect(page.getByRole('heading', { name: /colaboradores/i }).first()).toBeVisible();
  });

  test('fluxo de logout completo', async ({ page }) => {
    // O menu de perfil está no Header
    const profileButton = page.getByRole('button', { name: /usuário/i }).first();
    await expect(profileButton).toBeVisible();
    await profileButton.click();

    // Clicar em "Sair" no dropdown
    const logoutItem = page.getByRole('menuitem', { name: /sair/i });
    await expect(logoutItem).toBeVisible();
    await logoutItem.click();

    // Verificar redirecionamento para login
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page.getByLabel(/e-?mail/i).first()).toBeVisible();
    
    // Tentar voltar para uma rota protegida após logout
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });
});
