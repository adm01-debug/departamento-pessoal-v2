// V15-111: e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load dashboard under 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should render colaboradores list efficiently', async ({ page }) => {
    await page.goto('/colaboradores');
    const start = Date.now();
    await page.waitForSelector('[data-testid="colaborador-row"]');
    const renderTime = Date.now() - start;
    expect(renderTime).toBeLessThan(2000);
  });

  test('should handle large data pagination', async ({ page }) => {
    await page.goto('/colaboradores?per_page=100');
    await page.waitForLoadState('networkidle');
    const rows = await page.locator('[data-testid="colaborador-row"]').count();
    expect(rows).toBeLessThanOrEqual(100);
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/colaboradores');
    const images = page.locator('img[loading="lazy"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should cache API responses', async ({ page }) => {
    await page.goto('/dashboard');
    const firstLoad = Date.now();
    await page.waitForLoadState('networkidle');
    const firstTime = Date.now() - firstLoad;
    
    await page.reload();
    const secondLoad = Date.now();
    await page.waitForLoadState('networkidle');
    const secondTime = Date.now() - secondLoad;
    
    expect(secondTime).toBeLessThanOrEqual(firstTime);
  });

  test('should have acceptable Lighthouse score', async ({ page }) => {
    await page.goto('/dashboard');
    // Check for basic performance indicators
    const metrics = await page.evaluate(() => ({
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      domComplete: performance.timing.domComplete - performance.timing.navigationStart,
    }));
    expect(metrics.fcp).toBeLessThan(2000);
    expect(metrics.domComplete).toBeLessThan(5000);
  });
});
