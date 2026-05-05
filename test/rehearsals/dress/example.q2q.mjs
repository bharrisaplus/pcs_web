import { test, expect } from '@playwright/test';

test.describe('Example', () => {
  test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    await expect(page).toHaveTitle(/Playwright/);
  });
});
