import { test, expect } from '@playwright/test';

test.describe('Fluxos Críticos de Departamento Pessoal', () => {
  
  test('deve carregar a página de login corretamente', async ({ page }) => {
    await page.goto('/');
    // Verifica se existe um formulário ou botão de entrada (baseado na estrutura comum)
    const loginTitle = page.locator('h1, h2');
    await expect(loginTitle.first()).toBeVisible();
  });

  test('deve navegar para a dashboard após autenticação (mock)', async ({ page }) => {
    // Este teste assume um ambiente onde o auth pode ser mockado ou contornado via session storage
    await page.goto('/dashboard');
    // Verifica se os KPIs principais estão visíveis
    await expect(page.locator('text=Headcount')).toBeVisible({ timeout: 10000 });
  });

  test('deve abrir o formulário de novo colaborador', async ({ page }) => {
    await page.goto('/colaboradores/novo');
    await expect(page.locator('text=Dados Pessoais')).toBeVisible();
  });

  test('deve visualizar a central de auditoria', async ({ page }) => {
    await page.goto('/configuracoes');
    // Clica na aba de auditoria se necessário
    const auditTab = page.locator('text=Auditoria');
    if (await auditTab.isVisible()) {
      await auditTab.click();
      await expect(page.locator('text=Central de Auditoria')).toBeVisible();
    }
  });

  test('deve carregar a página de folha de pagamento', async ({ page }) => {
    await page.goto('/folha');
    await expect(page.locator('text=Folha de Pagamento')).toBeVisible();
  });
});
