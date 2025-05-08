// tests/admin-dashboard.spec.ts
import { test } from '@playwright/test';
import { AdminLoginPage } from './page-objects/AdminLoginPage';
import { AdminDashboardPage } from './page-objects/AdminDashboardPage';
import { AdminAddVendorPage } from './page-objects/AdminAddVendorPage';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

test.describe('Admin Dashboard (POM)', () => {
  test('admin can sign in, view dashboard, visit add-vendor, and sign out', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);
    const addVendorPage = new AdminAddVendorPage(page);

    // 1) sign in
    await loginPage.goto();
    await loginPage.login('admin@foo.com', 'changeme');

    // 2) dashboard loaded
    await dashboardPage.expectLoaded();

    // 3) navigate to add-vendor
    await Promise.all([
      page.waitForURL(`${BASE}/admin/add-vendor`),
      dashboardPage.addVendorLink.click(),
    ]);
    await addVendorPage.expectLoaded();

    // back to dashboard
    await page.goBack();
    await dashboardPage.expectLoaded();

    // 4) sign out
    await dashboardPage.logout();
  });
});
