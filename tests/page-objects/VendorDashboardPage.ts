// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable import/prefer-default-export */
// import { Page, Locator, expect } from '@playwright/test';

// export class VendorDashboardPage {
//   readonly page: Page;

//   readonly heading: Locator;

//   readonly subtitle: Locator;

//   readonly profileLabel: Locator;

//   readonly updateProfileLink: Locator;

//   readonly addMenuItemLink: Locator;

//   readonly userMenuToggle: Locator;

//   readonly signOutLink: Locator;

//   constructor(page: Page) {
//     this.page = page;
//     this.heading = page.getByRole('heading', { name: 'Vendor Dashboard' });
//     this.subtitle = page.getByText("You're logged in as a Vendor");
//     this.profileLabel = page.getByText('Vendor Profile');
//     this.updateProfileLink = page.getByRole('link', { name: 'Update Profile' });
//     this.addMenuItemLink = page.getByRole('link', { name: 'Add Menu Item' });
//     this.userMenuToggle = page.getByRole('button', { name: /@/ });
//     this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
//   }

//   async expectLoaded() {
//     await expect(this.heading).toBeVisible();
//     await expect(this.subtitle).toBeVisible();
//     await expect(this.profileLabel).toBeVisible();
//     await expect(this.updateProfileLink).toBeVisible();
//     await expect(this.updateProfileLink).toHaveAttribute('href', '/vendor/update-info');
//     await expect(this.addMenuItemLink).toBeVisible();
//     await expect(this.addMenuItemLink).toHaveAttribute('href', '/vendor/add-menu-item');
//   }

//   async logout() {
//     await this.userMenuToggle.click();
//     await expect(this.signOutLink).toBeVisible();
//     await this.signOutLink.click();
//     await expect(this.page).toHaveURL('http://localhost:3000/auth/signout');
//   }
// }
