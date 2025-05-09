/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page, Locator, expect } from '@playwright/test';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

export class UserLoginPage {
  readonly page: Page;

  readonly emailField: Locator;

  readonly passwordField: Locator;

  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('input[name="email"]');
    this.passwordField = page.locator('input[name="password"]');
    this.submitBtn = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto(BASE);
    await this.page.getByRole('link', { name: 'Login/Signup' }).click();
    await expect(this.page).toHaveURL(`${BASE}/auth/signin`);
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.submitBtn.click();
    await expect(this.page).toHaveURL(`${BASE}/user`);
  }
}
