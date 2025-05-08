// tests/vendor-dashboard.spec.ts

import { test } from '@playwright/test';
import { VendorLoginPage } from './page-objects/VendorLoginPage';
import { VendorDashboardPage } from './page-objects/VendorDashboardPage';
import { VendorInfoPage } from './page-objects/VendorInfoPage';
import { VendorAddMenuItemPage } from './page-objects/VendorAddMenuItemPage';
import { VendorEditMenuFormPage } from './page-objects/VendorEditMenuFormPage';

test.describe('Vendor Dashboard (POM)', () => {
  test('vendor can sign in, view dashboard, AND visit both sub-pages, then sign out', async ({ page }) => {
    const loginPage = new VendorLoginPage(page);
    const vendorPage = new VendorDashboardPage(page);
    const infoPage = new VendorInfoPage(page);
    const addPage = new VendorAddMenuItemPage(page);
    const editPage = new VendorEditMenuFormPage(page);

    // 1) Sign in as vendor
    await loginPage.goto();
    await loginPage.login('john@foo.com', 'changeme');

    // 2) Verify dashboard content
    await vendorPage.expectLoaded();

    // 3) Update Profile page
    await vendorPage.updateProfileLink.click();
    await infoPage.expectLoaded();
    await page.goBack();
    await vendorPage.expectLoaded();

    // 4) Add Menu Item page
    await Promise.all([
      page.waitForURL('**/vendor/add-menu-item'),
      vendorPage.addMenuItemLink.click(),
    ]);
    await addPage.expectLoaded();
    await page.goBack();
    await vendorPage.expectLoaded();

    // 5) Edit Menu Item page (first link found)
    await page.locator('a[href^="/vendor/edit/"]').first().click();
    await editPage.expectLoaded();
    await page.goBack();
    await vendorPage.expectLoaded();

    // 6) Sign out
    await vendorPage.logout();
  });
});
