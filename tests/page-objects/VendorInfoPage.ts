/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

export class VendorInfoPage {
  readonly page: Page;

  readonly heading: Locator;

  readonly updateBtn: Locator;

  readonly cancelBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // matches <h2>Update Vendor Profile</h2>
    this.heading = page.getByRole('heading', { name: 'Update Vendor Profile' });
    this.updateBtn = page.getByRole('button', { name: 'Update Profile' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.updateBtn).toBeVisible();
    await expect(this.cancelBtn).toBeVisible();
  }
}
