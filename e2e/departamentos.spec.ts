import { test, expect } from '@playwright/test';
test.describe('Departamentos', () => { test('deve listar departamentos', async ({ page }) => { await page.goto('/departamentos'); await expect(page.locator('[data-testid="departamento-card"]').first()).toBeVisible(); }); });
