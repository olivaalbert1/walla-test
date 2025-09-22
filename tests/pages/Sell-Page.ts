import { Page } from "@playwright/test";
import path from 'path';

export class SellPage {

    readonly page: Page
    waitForLoadState: Promise<void>;

    constructor(page: Page) {
        this.page = page;
        this.waitForLoadState = page.waitForLoadState('load')
    }

    async gotoSellPage() {
        await this.page.goto('/', { waitUntil: 'load' });
        await this.page.getByRole('button', { name: 'Vender' }).click();
    }

    async fullfillNewItem(itemName: string, itemPrice: string, fileName: string) {
        await this.page.getByRole('button', { name: 'Consumer Goods Vertical' }).click();
        await this.page.getByRole('textbox', { name: 'Resumen del producto' }).click();
        await this.page.getByRole('textbox', { name: 'Resumen del producto' }).fill(itemName);
        await this.page.getByRole('button', { name: 'Continuar' }).click();

        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.getByRole('button', { name: 'Subir fotos' }).click();
        const fileChooser = await fileChooserPromise;
        const filePath = require('path').join(__dirname, '../fixtures', fileName);
        await fileChooser.setFiles(filePath);
        await this.page.locator('#step-photo').getByRole('button', { name: 'Continuar' }).click();

        await this.page.getByText('Categoría y subcategoría').click();
        await this.page.getByLabel('Tecnología y electrónica').getByText('Tecnología y electrónica').click();
        await this.page.getByText('Telefonía: móviles y').click();
        await this.page.getByText('Smartphones').click();
        await this.page.getByText('Color*').click();
        await this.page.getByText('Blanco').click();
        await this.page.getByText('Estado*').click();
        await this.page.getByText('En condiciones aceptables').click();
        await this.page.getByText('Precio').click();
        await this.page.getByRole('textbox', { name: 'Precio' }).fill(itemPrice);
        await this.page.locator('wallapop-toggle span').nth(2).click();

        await this.page.getByText('Capacidad de almacenamiento*').click();
        await this.page.getByRole('option', { name: '4 GB', exact: true }).locator('div').nth(1).click();
    }

    async publishItem() {
        let responsePublishedItems = await Promise.all([
            this.page.waitForResponse(response => response.url().includes('/api/v3/items') && response.status() === 200),
            this.page.getByRole('button', { name: 'Subir producto' }).click(),
        ]);

        let itemId = await responsePublishedItems[0].json();

        return itemId;
    }

    async catalogPublished(itemId: string) {
        let url = 'https://api.beta.wallapop.com/api/v3/user/items'

        let responseUserItems = await this.page.waitForResponse(response =>
            response.url() === url &&
            response.status() === 200 &&
            response.request().method() === 'GET')

        let responseUserItemsAwait = await responseUserItems.json()

        await this.page.locator('tsl-subscription-awareness-modal').getByRole('button', { name: 'Ahora no, gracias' }).click();
        await this.page.getByText('¡Yuhu! Producto subido').isVisible()
        await this.page.getByRole('button', { name: 'Ahora no, gracias' }).click();

        // @ts-ignore
        const itemFound = responseUserItemsAwait.data.some(item => item.id === itemId.id);
        return itemFound
    }

}