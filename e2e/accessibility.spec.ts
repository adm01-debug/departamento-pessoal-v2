import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
test.describe('Accessibility', () => { test('dashboard deve ser acessível', async ({ page }) => { await page.goto('/dashboard'); await injectAxe(page); await checkA11y(page); }); test('formulários devem ter labels', async ({ page }) => { await page.goto('/login'); const inputs = page.locator('input'); for (const input of await inputs.all()) { await expect(input).toHaveAttribute('aria-label'); } }); });
