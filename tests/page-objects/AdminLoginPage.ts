// tests/page-objects/AdminLoginPage.ts
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

export class AdminLoginPage {
  readonly page: Page;

  readonly signInLink: Locator;

  readonly emailInput: Locator;

  readonly passwordInput: Locator;

  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.getByRole('link', { name: 'Login/Signup' });
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitBtn = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto(BASE);
    await expect(this.signInLink).toBeVisible();
    await this.signInLink.click();
    await expect(this.page).toHaveURL(`${BASE}/auth/signin`);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
    await expect(this.page).toHaveURL(`${BASE}/admin`);
  }
}
