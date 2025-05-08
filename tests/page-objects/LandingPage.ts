/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
// tests/page-objects/LandingPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  readonly navLogin: Locator;

  readonly heroTitle: Locator;

  readonly heroSubtitle: Locator;

  readonly tutorialHeader: Locator;

  readonly steps: Locator;

  readonly signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLogin = page.getByRole('link', { name: 'Login' });
    this.heroTitle = page.getByRole('heading', { name: 'Welcome to Campus Cravings' });
    this.heroSubtitle = page.getByText("Discover the dining options around UH Manoa's Campus");
    this.tutorialHeader = page.getByRole('heading', { name: 'How to Access and Use the Website' });
    this.steps = page.locator('.card.no-hover');
    this.signupButton = page.getByRole('link', { name: 'Login/Signup' });
  }

  async goto() {
    await this.page.goto('https://manoa-munchies-nextjs.vercel.app');
  }

  async expectPageAvailable() {
    await expect(this.navLogin).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroSubtitle).toBeVisible();
    await expect(this.tutorialHeader).toBeVisible();
    await expect(this.steps).toHaveCount(3);

    for (const step of ['Step 1', 'Step 2', 'Step 3']) {
      // eslint-disable-next-line no-await-in-loop
      await expect(this.page.getByText(step)).toBeVisible();
    }
  }

  async goToSignin() {
    await expect(this.signupButton).toBeVisible();
    await this.signupButton.click();
  }
}
