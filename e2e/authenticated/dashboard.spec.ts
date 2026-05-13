import { test, expect } from '@playwright/test';

test.describe('Dashboard Executivo (autenticado)', () => {
  test('carrega KPIs principais sem erros de runtime', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('pageerror', (e) => consoleErrors.push(e.message));

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);

    // Cabeçalho/sidebar do app autenticado
    await expect(page.getByRole('navigation').first()).toBeVisible({ timeout: 15_000 });

    // Pelo menos um KPI/cartão visível (Headcount / Folha / Turnover / etc.)
    const kpis = page.locator(
      'text=/Headcount|Colaboradores|Folha|Turnover|Absente[ií]smo|Custo/i',
    );
    await expect(kpis.first()).toBeVisible({ timeout: 15_000 });

    expect(consoleErrors, `Erros de runtime no dashboard: ${consoleErrors.join('\n')}`)
      .toHaveLength(0);
  });

  test('navega para módulo de colaboradores via sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /colaboradores/i }).first().click();
    await page.waitForURL(/\/colaboradores/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: /colaboradores/i }).first())
      .toBeVisible({ timeout: 10_000 });
  });
});
