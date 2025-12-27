import { test, expect } from '@playwright/test';
test.describe('eSocial', () => { test('deve exibir eventos do eSocial', async ({ page }) => { await page.goto('/esocial'); await expect(page.locator('[data-testid="evento-card"]').first()).toBeVisible(); }); });
