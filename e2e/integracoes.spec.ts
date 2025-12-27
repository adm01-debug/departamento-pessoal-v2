import { test, expect } from '@playwright/test';
test.describe('Integrações', () => { test('deve exibir integrações disponíveis', async ({ page }) => { await page.goto('/integracoes'); await expect(page.locator('[data-testid="integracao-card"]').first()).toBeVisible(); }); });
