// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable import/prefer-default-export */
// import { Page, Locator, expect } from '@playwright/test';

// export class VendorLoginPage {
//   readonly page: Page;

//   readonly signInLink: Locator;

//   readonly emailInput: Locator;

//   readonly passwordInput: Locator;

//   readonly submitBtn: Locator;

//   constructor(page: Page) {
//     this.page = page;
//     this.signInLink = page.getByRole('link', { name: 'Login/Signup' });
//     this.emailInput = page.locator('input[name="email"]');
//     this.passwordInput = page.locator('input[name="password"]');
//     this.submitBtn = page.getByRole('button', { name: 'Signin' });
//   }

//   async goto() {
//     // assumes baseURL is set to http://localhost:3000
//     await this.page.goto('http://localhost:3000');
//     await expect(this.signInLink).toBeVisible();
//     await this.signInLink.click();
//     await expect(this.page).toHaveURL('http://localhost:3000/auth/signin');
//   }

//   async login(email: string, password: string) {
//     await this.emailInput.fill(email);
//     await this.passwordInput.fill(password);
//     await this.submitBtn.click();
//     // waits for redirect to /vendor
//     await expect(this.page).toHaveURL('http://localhost:3000/vendor');
//   }
// }
