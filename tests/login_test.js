// @ts-check
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

test.describe('Example test suite', () => {
  test('Basic test', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Wallapop/);
  });

  test('Login test', async ({ page }) => {
    await page.goto(process.env.BASEURL + '/login');

    // await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Aceptar todo' }).click();
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Fill in login form
    if (!process.env.USEREMAIL || !process.env.USERPSWD) {
      throw new Error('USEREMAIL or USERPSWD environment variable is not defined');
    }
    await page.getByText('Dirección de e-mail').fill(process.env.USEREMAIL);
    await page.getByText('Contraseña', { exact: true }).fill(process.env.USERPSWD);
    await page.waitForResponse(response => response.url().includes('https://www.google.com/recaptcha/enterprise/bframe') && response.status() === 200);

    // Handle reCAPTCHA iframe
    await page.keyboard.press('Tab'); // Focus on the reCAPTCHA checkbox
    await page.keyboard.press('Tab'); // Move to the checkbox
    await page.keyboard.press('Space'); // Press Space to check the box
    await page.keyboard.press('Enter'); // Press Enter to confirm

    // Wait for a short period to allow reCAPTCHA to process (adjust as necessary)
    await page.waitForResponse(response => response.url().includes('https://www.google.com/recaptcha/enterprise/userverify') && response.status() === 200);

    // Submit the login form
    await page.getByRole('button', { name: 'Acceder a Wallapop' }).click();

    await page.waitForURL('**/wall', { timeout: 15000 }); // Wait for navigation to home page

    // Expect to be logged in by checking for a logout button or user profile element
    await expect(page.getByRole('link', { name: 'User avatar Tú' })).toBeVisible();
    await page.close();
  });
});