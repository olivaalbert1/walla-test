// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Example test suite', () => {
  test('First test', async ({ page }) => {
    await page.goto('/');

    await page.waitForURL('**/wall');
    
    await page.close();
  });

  test('Basic test', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Wallapop/);
  });

  
});