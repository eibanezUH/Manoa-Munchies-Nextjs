/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

export class UserDashboardPage {
  readonly page: Page;

  readonly heroTitle: Locator;

  readonly heroSubtitle: Locator;

  readonly topPicksLink: Locator;

  readonly searchInput: Locator;

  readonly userMenuToggle: Locator;

  readonly signOutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroTitle = page.getByRole('heading', { name: 'Foods Available Right Now' });
    this.heroSubtitle = page.getByText('Discover all dishes served today!');
    this.topPicksLink = page.getByRole('link', { name: 'Top Picks' });
    this.searchInput = page.getByPlaceholder(/Search by name/);
    this.userMenuToggle = page.getByRole('button', { name: /@/ });
    this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
  }

  async expectLoaded() {
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroSubtitle).toBeVisible();
    await expect(this.topPicksLink).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async logout() {
    await this.userMenuToggle.click();
    await expect(this.signOutLink).toBeVisible();
    await this.signOutLink.click();
    await expect(this.page).toHaveURL(`${BASE}/auth/signout`);
  }
}
