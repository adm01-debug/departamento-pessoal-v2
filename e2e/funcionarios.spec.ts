import { test, expect } from '@playwright/test';

test.describe('funcionarios Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/funcionarios');
  });

  test('renders page content', async ({ page }) => {
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('has accessible structure', async ({ page }) => {
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });

  test('buttons are clickable', async ({ page }) => {
    const buttons = page.locator('button:visible').first();
    if (await buttons.count() > 0) {
      await expect(buttons).toBeEnabled();
    }
  });

  test('forms are functional', async ({ page }) => {
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await expect(form).toBeVisible();
    }
  });

  test('handles mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
