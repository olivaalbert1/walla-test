// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';
import timestamp from '../utils/timestamp'

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

    await Promise.all([
      page.waitForRequest(request => request.url().includes('/api/v3/users/me/') && request.method() === 'POST'),
      page.getByRole('button', { name: 'Guardar' }).click()
    ]);

    await page.getByText('Identificación guardada').isVisible();
    await page.getByRole('button', { name: 'Entendido' }).click();

    await expect(page.getByText('Tus datos se han editado')).toBeVisible();
  });

  test('sell new item', async ({ page }) => {
    let itemName = 'Iphone 8 ' + timestamp.year + timestamp.month + timestamp.day + timestamp.hour + timestamp.min + timestamp.sec
    await page.getByRole('button', { name: 'Vender' }).click();
    await page.getByRole('button', { name: 'Consumer Goods Vertical' }).click();
    await page.getByRole('textbox', { name: 'Resumen del producto' }).click();
    await page.getByRole('textbox', { name: 'Resumen del producto' }).fill(itemName);
    await page.getByRole('button', { name: 'Continuar' }).click();

    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.getByRole('button', { name: 'Subir fotos' }).click();
    const fileChooser = await fileChooserPromise;
    const filePath = path.join(__dirname, 'fixtures', 'profile-pic.jpg');
    await fileChooser.setFiles(filePath);

    await page.locator('#step-photo').getByRole('button', { name: 'Continuar' }).click();
    await page.getByText('Categoría y subcategoría').click();
    await page.getByLabel('Tecnología y electrónica').getByText('Tecnología y electrónica').click();
    await page.getByText('Telefonía: móviles y').click();
    await page.getByText('Smartphones').click();
    await page.getByText('Color*').click();
    await page.getByText('Blanco').click();
    await page.getByText('Estado*').click();
    await page.getByText('En condiciones aceptables').click();
    await page.getByText('Precio').click();
    await page.getByRole('textbox', { name: 'Precio' }).fill('50');
    await page.locator('wallapop-toggle span').nth(2).click();

    await page.getByText('Capacidad de almacenamiento*').click();
    await page.getByRole('option', { name: '4 GB', exact: true }).locator('div').nth(1).click();

    let response = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/v3/items') && response.status() === 200),
      page.getByRole('button', { name: 'Subir producto' }).click(),
    ]);

    // get the json response and extract the item id
    let itemId = await response[0].json();

    console.log('itemID = ' + itemId.id)

    let url = 'https://api.beta.wallapop.com/api/v3/user/items'

    let response2 = await page.waitForResponse(response =>
      response.url() === url &&
      response.status() === 200 &&
      response.request().method() === 'GET')

    let response2await = await response2.json()
    console.log(response2await)

    
    await page.locator('tsl-subscription-awareness-modal').getByRole('button', { name: 'Ahora no, gracias' }).click();
    await page.getByText('¡Yuhu! Producto subido').click();
    await page.getByRole('button', { name: 'Ahora no, gracias' }).click();

    // @ts-ignore
    const itemFound = response2await.data.some(item => item.id === itemId.id);

    // Then, we use a simple assertion to confirm the result.
    expect(itemFound).toBe(true);

  });

});