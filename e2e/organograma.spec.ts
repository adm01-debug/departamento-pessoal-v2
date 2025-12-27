import { test, expect } from '@playwright/test';
test.describe('Organograma', () => { test('deve exibir organograma', async ({ page }) => { await page.goto('/organograma'); await expect(page.locator('[data-testid="organograma-tree"]')).toBeVisible(); }); });
