import { test, expect } from '@playwright/test';
test.describe('Benefícios', () => { test('deve listar benefícios', async ({ page }) => { await page.goto('/beneficios'); await expect(page.locator('[data-testid="beneficio-card"]').first()).toBeVisible(); }); });
