/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

export class VendorEditMenuFormPage {
  readonly page: Page;

  readonly heading: Locator;

  readonly nameInput: Locator;

  readonly descriptionInput: Locator;

  readonly priceInput: Locator;

  readonly submitBtn: Locator;

  readonly resetBtn: Locator;

  readonly cancelBtn: Locator;

  readonly deleteBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Edit Menu Item' });
    this.nameInput = page.locator('input[name="name"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.priceInput = page.getByRole('spinbutton'); // the numeric “Price” field
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.deleteBtn = page.getByRole('button', { name: 'Delete Menu Item' });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.priceInput).toBeVisible();
    await expect(this.submitBtn).toBeVisible();
    await expect(this.resetBtn).toBeVisible();
    await expect(this.cancelBtn).toBeVisible();
    await expect(this.deleteBtn).toBeVisible();
  }
}
