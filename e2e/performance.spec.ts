import { test, expect } from '@playwright/test';
test.describe('Performance', () => { test('dashboard deve carregar em menos de 3s', async ({ page }) => { const start = Date.now(); await page.goto('/dashboard'); await page.waitForLoadState('networkidle'); const duration = Date.now() - start; expect(duration).toBeLessThan(3000); }); });
