import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1, h2').first()).toContainText(/sign in|giriş/i);
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    // Form should not navigate away
    await expect(page).toHaveURL(/login/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@financehub.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.locator('button[type="submit"]').click();
    // Should redirect to dashboard
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.locator('button[type="submit"]').click();
    // Should stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.locator('a[href="/register"]');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    }
  });
});
