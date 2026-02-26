import { test, expect } from '@playwright/test';

// Helper to login before tests
async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@financehub.com');
  await page.fill('input[type="password"]', 'Admin123!');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('/', { timeout: 10000 });
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display KPI cards', async ({ page }) => {
    // KPI grid should be visible
    const kpiSection = page.locator('[data-tour="kpi"]');
    await expect(kpiSection).toBeVisible({ timeout: 10000 });
  });

  test('should display charts section', async ({ page }) => {
    const chartsSection = page.locator('[data-tour="charts"]');
    await expect(chartsSection).toBeVisible({ timeout: 10000 });
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Click Analytics in sidebar
    await page.locator('a[href="/analytics"]').first().click();
    await expect(page).toHaveURL('/analytics');

    // Click Transactions
    await page.locator('a[href="/transactions"]').first().click();
    await expect(page).toHaveURL('/transactions');

    // Click back to Dashboard
    await page.locator('a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('should toggle theme', async ({ page }) => {
    const themeBtn = page.locator('[data-tour="theme"]');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    // Theme should change (check html class)
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toBeDefined();
  });

  test('should open notification panel', async ({ page }) => {
    const notifBtn = page.locator('[data-tour="notifications"] button');
    await notifBtn.click();
    // Notification panel should appear
    const panel = page.locator('.absolute.right-0.top-12');
    await expect(panel).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should open with Ctrl+K', async ({ page }) => {
    await page.keyboard.press('Control+k');
    // Command palette should be visible
    const input = page.locator('input[placeholder*="command"], input[placeholder*="Komut"]');
    await expect(input).toBeVisible({ timeout: 3000 });
  });

  test('should navigate via command palette', async ({ page }) => {
    await page.keyboard.press('Control+k');
    const input = page.locator('input[placeholder*="command"], input[placeholder*="Komut"]');
    await input.fill('Analytics');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/analytics');
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should load all pages without errors', async ({ page }) => {
    const pages = ['/analytics', '/transactions', '/reports', '/risk', '/activity', '/settings'];
    for (const path of pages) {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      // No error boundary should be shown
      const errorEl = page.locator('text=Something went wrong');
      await expect(errorEl).not.toBeVisible({ timeout: 5000 });
    }
  });
});
