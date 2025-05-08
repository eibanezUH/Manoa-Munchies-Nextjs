// tests/page-objects/AdminAddVendorPage.ts
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

export class AdminAddVendorPage {
  readonly page: Page;

  readonly heading: Locator;

  readonly userSelect: Locator;

  readonly nameInput: Locator;

  readonly createBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Add Vendor' });
    this.userSelect = page.locator('select[name="userEmail"]');
    this.nameInput = page.locator('input[name="name"]');
    this.createBtn = page.getByRole('button', { name: 'Create Vendor' });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.userSelect).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.createBtn).toBeVisible();
  }
}
