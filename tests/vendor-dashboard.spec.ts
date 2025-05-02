// // // tests/vendor-dashboard.spec.ts
// // import { test, expect } from '@playwright/test';

// // test.describe('Vendor Dashboard', () => {
// //   test('renders hero, top-picks button, and all cards', async ({ page }) => {
// //     // 1) Login as vendor
// //     await page.goto('http://localhost:3000/');
// //     await page.getByRole('link', { name: 'Login/Signup' }).click();
// //     await expect(page).toHaveURL('http://localhost:3000/auth/signin');
// //     await page.fill('input[name="email"]', 'john@foo.com');
// //     await page.fill('input[name="password"]', 'changeme');
// //     await page.getByRole('button', { name: 'Signin' }).click();
// //     // await expect(page).toHaveURL('http://localhost:3000/vendor');

// //     // 2) Header & subtitle
// //     await expect(page.getByRole('heading', { name: 'Vendor Dashboard' })).toBeVisible();
// //     await expect(page.getByText("You're logged in as a Vendor")).toBeVisible();

// //     // 3) Profile card
// //     await expect(page.getByText('Vendor Profile')).toBeVisible();
// //     // check the two profile buttons
// //     const updateBtn = page.getByRole('link', { name: 'Update Profile' });
// //     await expect(updateBtn).toBeVisible();
// //     await expect(updateBtn).toHaveAttribute('href', '/vendor/update-info');
// //     const addMenuBtn = page.getByRole('link', { name: 'Add Menu Item' });
// //     await expect(addMenuBtn).toBeVisible();
// //     await expect(addMenuBtn).toHaveAttribute('href', '/vendor/add-menu-item');

// //     // 4) Logout
// //     await page.getByRole('button', { name: 'john@foo.com' }).click();
// //     await page.getByRole('link', { name: 'Sign Out' }).click();
// //   });
// // });

// import { test } from '@playwright/test';
// import { VendorLoginPage } from './page-objects/VendorLoginPage';
// import { VendorDashboardPage } from './page-objects/VendorDashboardPage';

// test.describe('Vendor Dashboard (POM)', () => {
//   test('vendor can sign in, view dashboard, and sign out', async ({ page }) => {
//     const loginPage = new VendorLoginPage(page);
//     const vendorPage = new VendorDashboardPage(page);

//     // 1) Sign in as vendor
//     await loginPage.goto();
//     await loginPage.login('john@foo.com', 'changeme');

//     // 2) Verify dashboard content
//     await vendorPage.expectLoaded();

//     // 3) Sign out
//     await vendorPage.logout();
//   });
// });
