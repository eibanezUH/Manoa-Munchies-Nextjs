import { test, expect } from '@playwright/test';
import { UserLoginPage } from './page-objects/UserLoginPage';
import { UserDashboardPage } from './page-objects/UserDashboardPage';
import { UserPreferencesPage } from './page-objects/UserPreferencesPage';

const BASE = 'https://manoa-munchies-nextjs.vercel.app';

test('User can sign in, view dashboard, profile prefs, and sign out', async ({ page }) => {
  const login = new UserLoginPage(page);
  const dashboard = new UserDashboardPage(page);
  const prefs = new UserPreferencesPage(page);

  // 1) Sign in
  await login.goto();
  await login.login('testuser1@foo.com', 'password');

  // 2) Dashboard smoke-check
  await dashboard.expectLoaded();

  // 3) Navigate to Profile / Preferences
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL(`${BASE}/profile`);

  // 4) Assert key texts + button
  await expect(prefs.welcomeHeading).toHaveText('Welcome testuser1@foo.com!');
  await expect(prefs.subtitle).toBeVisible();
  await expect(prefs.currentPrefHeading).toBeVisible();
  await expect(prefs.prefBadges.first()).toHaveText('Pasta');
  await expect(prefs.currentAversionsHeading).toBeVisible();
  await expect(prefs.aversionsText).toBeVisible();
  await expect(prefs.editButton).toBeVisible();

  // 5) Sign out
  await dashboard.logout();
});
