// tests/landing-page.spec.ts
import { test, expect } from '@playwright/test';
import { LandingPage } from './page-objects/LandingPage';

test.describe('Landing page (POM)', () => {
  test('loads all sections and navigates to sign-in', async ({ page }) => {
    const landing = new LandingPage(page);

    // 1) Load the page
    await landing.goto();

    // 2) Assert all hero & tutorial content
    await landing.expectPageAvailable();

    // 3) Click the Login/Signup button and verify navigation
    await landing.goToSignin();
    await expect(page).toHaveURL('https://manoa-munchies-nextjs.vercel.app/auth/signin');
  });
});
