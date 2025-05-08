// tests/page-objects/AdminDashboardPage.ts
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

export class AdminDashboardPage {
  readonly page: Page;

  readonly heading: Locator;

  readonly subtitle: Locator;

  readonly addVendorLink: Locator;

  readonly userMenuToggle: Locator;

  readonly signOutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Admin Dashboard' });
    this.subtitle = page.getByText('View all registered users and vendors.');
    this.addVendorLink = page.getByRole('link', { name: 'Add Vendor' });
    this.userMenuToggle = page.getByRole('button', { name: /@/ });
    this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.subtitle).toBeVisible();
    await expect(this.addVendorLink).toBeVisible();
    await expect(this.addVendorLink).toHaveAttribute('href', '/admin/add-vendor');
  }

  async logout() {
    await this.userMenuToggle.click();
    await expect(this.signOutLink).toBeVisible();
    await this.signOutLink.click();
    await expect(this.page).toHaveURL(`${BASE}/auth/signout`);
  }
}
