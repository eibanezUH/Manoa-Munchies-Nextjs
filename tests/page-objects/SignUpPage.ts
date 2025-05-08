// tests/page-objects/SignUpPage.ts
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

export class SignUpPage {
  readonly page: Page;

  readonly emailInput: Locator;

  readonly passwordInput: Locator;

  readonly confirmPasswordInput: Locator;

  readonly registerBtn: Locator;

  readonly resetBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.registerBtn = page.getByRole('button', { name: 'Register' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
  }

  async goto() {
    await this.page.goto(`${BASE}/auth/signup`);
    await expect(this.emailInput).toBeVisible();
  }

  async expectLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.registerBtn).toBeVisible();
    await expect(this.resetBtn).toBeVisible();
  }

  async resetForm() {
    await this.emailInput.fill('foo@bar.com');
    await this.passwordInput.fill('abcdef');
    await this.confirmPasswordInput.fill('abcdef');
    await this.resetBtn.click();
  }

  async expectEmpty() {
    await expect(this.emailInput).toHaveValue('');
    await expect(this.passwordInput).toHaveValue('');
    await expect(this.confirmPasswordInput).toHaveValue('');
  }
}
