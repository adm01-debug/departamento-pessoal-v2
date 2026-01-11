// V15-109: e2e/responsive.spec.ts
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test.describe('Mobile (iPhone 12)', () => {
    test.use({ ...devices['iPhone 12'] });

    test('should show mobile menu button', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    });

    test('should hide sidebar by default', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.locator('[data-testid="sidebar"]')).toBeHidden();
    });

    test('should open mobile menu on click', async ({ page }) => {
      await page.goto('/dashboard');
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    });

    test('should stack cards vertically', async ({ page }) => {
      await page.goto('/dashboard');
      const cards = page.locator('[data-testid="dashboard-card"]');
      const count = await cards.count();
      if (count > 1) {
        const box1 = await cards.nth(0).boundingBox();
        const box2 = await cards.nth(1).boundingBox();
        expect(box1!.y).toBeLessThan(box2!.y);
      }
    });
  });

  test.describe('Tablet (iPad)', () => {
    test.use({ ...devices['iPad Pro'] });

    test('should show condensed sidebar', async ({ page }) => {
      await page.goto('/dashboard');
      const sidebar = page.locator('[data-testid="sidebar"]');
      await expect(sidebar).toBeVisible();
    });

    test('should display grid with 2 columns', async ({ page }) => {
      await page.goto('/colaboradores');
      const grid = page.locator('[data-testid="data-grid"]');
      const style = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
      expect(style.split(' ').length).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should show full sidebar', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="sidebar-label"]').first()).toBeVisible();
    });
  });
});
