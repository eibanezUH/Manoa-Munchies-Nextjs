/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */

import { Page, Locator } from '@playwright/test';

export class UserPreferencesPage {
  readonly page: Page;

  readonly welcomeHeading: Locator;

  readonly subtitle: Locator;

  readonly currentPrefHeading: Locator;

  readonly prefBadges: Locator;

  readonly currentAversionsHeading: Locator;

  readonly aversionsText: Locator;

  readonly editButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Top of page
    this.welcomeHeading = page.getByRole('heading', { name: /^Welcome .*!$/ });
    this.subtitle = page.getByText('Customize your food experience below.');

    // Current Preferences section
    this.currentPrefHeading = page.getByRole('heading', { name: 'Current Preferences' });
    this.prefBadges = page.locator('span.badge.bg-success');

    // Current Aversions section
    this.currentAversionsHeading = page.getByRole('heading', { name: 'Current Aversions' });
    this.aversionsText = page.getByText('No aversions set yet.');

    // Action
    this.editButton = page.getByRole('button', { name: 'Edit Preferences' });
  }
}
