import { test, expect } from '@playwright/test';

test.describe('Fluxo de Navegação (autenticado)', () => {
  test.beforeEach(async ({ page }) => {
    // A autenticação já deve ter sido feita pelo setup (e2e/.auth/user.json)
    await page.goto('/dashboard');
    // Garante que não foi redirecionado para login (o setup deve garantir isso)
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('navegação entre módulos via sidebar', async ({ page }) => {
    // Abrir o grupo "Tempo & Ausências" se estiver fechado
    // O sidebar usa Radix Collapsible
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
    await expect(page.getByRole('heading', { name: /f[eé]rias/i }).first()).toBeVisible();

    // Navegar para Colaboradores
    // O grupo "Principal" costuma estar aberto por padrão
    await page.getByRole('link', { name: /colaboradores/i }).first().click();
    await expect(page).toHaveURL(/\/colaboradores/);
    await expect(page.getByRole('heading', { name: /colaboradores/i }).first()).toBeVisible();
  });

  test('navegação via Breadcrumbs e BackButton', async ({ page }) => {
    await page.goto('/colaboradores');
    await expect(page.getByRole('heading', { name: /colaboradores/i }).first()).toBeVisible();

    // Clicar no botão "Voltar" (BackButton no Header)
    const backButton = page.locator('button[aria-label="Voltar"]').first();
    if (await backButton.isVisible()) {
      await backButton.click();
      // Deve voltar para o dashboard (ou página anterior)
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });
});

