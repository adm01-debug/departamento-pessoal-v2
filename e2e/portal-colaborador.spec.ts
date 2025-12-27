import { test, expect } from '@playwright/test';
test.describe('Portal Colaborador', () => { test('deve exibir dados do colaborador', async ({ page }) => { await page.goto('/portal-colaborador'); await expect(page.locator('[data-testid="profile-card"]')).toBeVisible(); }); });
