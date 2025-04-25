// import { test, expect } from '@playwright/test';

// test.describe('Landing page', () => {
//   test('landing page loads', async ({ page }) => {
//     await page.goto('http://localhost:3000/');
//     await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

//     // 2) Hero section
//     await expect(page.getByRole('heading', { name: 'Welcome to Manoa Munchies' })).toBeVisible();
//     await expect(page.getByText('Discover the best dining options on UH Campus')).toBeVisible();

//     // 4) Tutorial header
//     await expect(page.getByRole('heading', { name: 'How to Access and Use the Website' })).toBeVisible();
//     // 5) Exactly three instruction cards
//     const cards = page.locator('.card.no-hover');
//     await expect(cards).toHaveCount(3);

//     // 6) Each step number appears
//     for (const step of ['Step 1', 'Step 2', 'Step 3']) {
//       // eslint-disable-next-line no-await-in-loop
//       await expect(page.getByText(step)).toBeVisible();
//     }

//     // 3) Login/Signup button (just check the single primary button in the hero)
//     const loginLink = page.getByRole('link', { name: 'Login/Signup' });
//     await expect(loginLink).toBeVisible();
//     await loginLink.click();
//     await expect(page).toHaveURL('http://localhost:3000/auth/signin');
//   });
// });

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
    await expect(page).toHaveURL('http://localhost:3000/auth/signin');
  });
});
