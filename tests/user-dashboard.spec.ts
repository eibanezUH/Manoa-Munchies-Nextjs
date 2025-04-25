// tests/vendor-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test('renders hero, top-picks button, and all cards', async ({ page }) => {
    // 1) Login as vendor
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Login/Signup' }).click();
    await expect(page).toHaveURL('http://localhost:3000/auth/signin');
    await page.fill('input[name="email"]', 'testuser1@foo.com');
    await page.fill('input[name="password"]', 'password');
    await page.getByRole('button', { name: 'Signin' }).click();
    await expect(page).toHaveURL('http://localhost:3000/user');

    // 2) Header & subtitle
    await expect(page.getByRole('heading', { name: 'Food Available Right Now!' })).toBeVisible();
    await expect(page.getByText('Explore available menu items')).toBeVisible();

    // 3) “View Top Picks” link
    const topPicks = page.getByRole('link', { name: 'View Top Picks' });
    await expect(topPicks).toBeVisible();
    await expect(topPicks).toHaveAttribute('href', '/user/toppicks');

    // 3) Vendor/Food Search Bar
    await expect(page.getByPlaceholder('Search by name, vendor, cuisine, or ingredient...')).toBeVisible();

    // 4) Logout
    await page.getByRole('button', { name: 'testuser1@foo.com' }).click();
    await page.getByRole('link', { name: 'Sign Out' }).click();
  });
});
