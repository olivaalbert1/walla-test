// @ts-check
import { test, expect } from '@playwright/test';
// 'https://es.beta.wallapop.com'

test.describe('Example test suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });


  test('Search and filter bicycles', async ({ page }) => {
    await page.locator('#searchbox-form-input').click();
    await page.locator('#searchbox-form-input').fill('bicicleta niño de 8 años');
    await page.locator('#searchbox-form-input').press('Enter');
    await expect(page.locator('a').filter({ hasText: '30 €BicicletaSólo venta en' })).toBeVisible();
    await page.getByText('Resultados de búsqueda').click();

    await page.getByRole('button', { name: 'Ordenar por: Relevancia' }).click();
    await page.getByRole('button', { name: 'De más barato a más caro' }).click();
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'CAMBIO BICI Y 2 TABLETS' }).click();
    const page2 = await page2Promise;
    await page2.getByRole('heading', { name: 'Nada por aquí' }).click();
    await page2.getByText('Esta página no existe en').click();

    await expect(page2.getByText('Esta página no existe en')).toBeVisible();
    await page2.close();
  });

  test('Edit profile', async ({ page }) => {
    await page.goto('/app/profile/info');

    await page.waitForRequest(request => request.url().includes('app/4806.908231f8617bde81.js') && request.method() === 'GET');

    await page.getByRole('textbox', { name: 'Nombre' }).fill('Nuevo Nombre');
    await page.getByRole('textbox', { name: 'Apellidos' }).fill('Nuevo Apellido');

    if (await page.getByRole('radio', { name: 'Uso personal' }).isChecked()) {
      await page.getByRole('radio', { name: 'Uso profesional' }).check();
    } else {
      await page.getByRole('radio', { name: 'Uso personal' }).check();
    }

    // if set location is not selected set it
    if (await page.locator('section').filter({ hasText: 'Tus productos se verán en:Este es el punto donde está ubicado tu perfil de' }).getByPlaceholder('Marca la localización').isVisible()) {
      await page.locator('section').filter({ hasText: 'Tus productos se verán en:Este es el punto donde está ubicado tu perfil de' }).getByPlaceholder('Marca la localización').click();
      await page.locator('.fake-map').first().click();
      await page.locator('section').filter({ hasText: 'Tus productos se verán en:Este es el punto donde está ubicado tu perfil de' }).getByPlaceholder('Marca la localización').click();
      await page.getByRole('combobox', { name: 'Geolocation' }).fill('barcelona');
      await page.getByRole('option', { name: 'Barcelona, Cataluña, ESP' }).click();
      await page.waitForResponse(response => response.url().includes('/design-system/') && response.status() === 200);
      await page.getByRole('button', { name: 'Aplicar' }).click();
    }

    // scroll to bottom
    await page.getByRole('button', { name: 'Guardar' }).scrollIntoViewIfNeeded();

    // await page.getByText('Subir foto').click();
    // const [fileChooser] = await Promise.all([
    //   page.waitForEvent('filechooser'),
    //   page.getByText('Seleccionar foto').click() // some button that triggers file selection
    // ]);
    // await fileChooser.setFiles('tests/fixtures/profile-pic.jpg');
    // await page.waitForRequest(request => request.url().includes('/api/user') && request.method() === 'PUT');


    // await page.getByRole('textbox', { name: 'Descripción' }).fill('Nueva descripción del perfil de prueba automatizada');

    await Promise.all([
      page.waitForRequest(request => request.url().includes('/api/v3/users/me/') && request.method() === 'POST'),
      page.getByRole('button', { name: 'Guardar' }).click()
    ]);

    await page.getByText('Identificación guardada').isVisible();
    await page.getByRole('button', { name: 'Entendido' }).click();
    // or fill more data
    // await page.getByRole('button', { name: 'Rellenar mis datos legales' }).click();
    // await expect().toBeVisible();
    await expect(page.getByText('Tus datos se han editado')).toBeVisible();
  });
});