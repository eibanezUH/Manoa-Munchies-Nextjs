// tests/signup.spec.ts
import { test } from '@playwright/test';
import { SignUpPage } from './page-objects/SignUpPage';

test.describe('Sign Up Page (POM)', () => {
  test('form fields and buttons are visible and reset works', async ({ page }) => {
    const signup = new SignUpPage(page);

    // navigate to sign up page
    await signup.goto();

    // assert form is loaded
    await signup.expectLoaded();

    // exercise reset functionality
    await signup.resetForm();
    await signup.expectEmpty();
  });
});
