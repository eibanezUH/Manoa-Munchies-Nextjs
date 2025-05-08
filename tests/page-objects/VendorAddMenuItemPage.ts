/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

export class VendorAddMenuItemPage {
  readonly page: Page;

  readonly heading: Locator;

  readonly nameInput: Locator;

  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // matches <h2>Add Menu Item</h2> (or whatever your heading is)
    this.heading = page.getByRole('heading', { name: 'Add Menu Item' });
    // assume there's at least one text-input named "name"
    this.nameInput = page.locator('input[name="name"]');
    this.saveBtn = page.getByRole('button', { name: 'Add Menu Item' });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.saveBtn).toBeVisible();
  }
}
