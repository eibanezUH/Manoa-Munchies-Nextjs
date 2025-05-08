/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

export class UserDashboardPage {
  readonly page: Page;

  readonly heroTitle: Locator;

  readonly heroSubtitle: Locator;

  readonly searchInput: Locator;

  readonly userMenuToggle: Locator;

  readonly signOutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroTitle = page.getByRole('heading', { name: 'Food Available Right Now' });
    this.heroSubtitle = page.getByText('Discover all dishes served today!');
    this.searchInput = page.getByPlaceholder('Search by name, vendor, cuisine, or ingredient...');
    this.userMenuToggle = page.getByRole('button', { name: /@/ }); // matches “testuser1@foo.com”
    this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
  }

  async expectLoaded() {
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroSubtitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async logout() {
    await this.userMenuToggle.click();
    await expect(this.signOutLink).toBeVisible();
    await this.signOutLink.click();
    await expect(this.page).toHaveURL('http://localhost:3000/auth/signout');
  }
}
