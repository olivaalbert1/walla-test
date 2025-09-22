import { Page } from "@playwright/test";
import path from 'path';

export class ProfilePage {

    readonly page: Page
    waitForLoadState: Promise<void>;

    constructor(page: Page) {
        this.page = page;
        this.waitForLoadState = page.waitForLoadState('load')
    }

    async gotoProfilePage() {
        await this.page.goto('/app/profile/info');
        await this.page.waitForRequest(request => request.url().includes('app/4806.908231f8617bde81.js') && request.method() === 'GET');
    }

    async writeName(name: string) {
        await this.page.getByRole('textbox', { name: 'Nombre' }).fill(name);
    }

    async writeLastName(lastName: string) {
        await this.page.getByRole('textbox', { name: 'Apellidos' }).fill(lastName);
    }

    async uploadProfilePicture(fileName: string) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');

        if (await this.page.locator('label').filter({ hasText: 'Subir foto' }).isVisible()) {
            await this.page.locator('label').filter({ hasText: 'Subir foto' }).click();
        }

        if (await this.page.locator('label').filter({ hasText: 'Cambiar foto' }).isVisible()) {
            await this.page.locator('label').filter({ hasText: 'Cambiar foto' }).click()
        }

        const fileChooser = await fileChooserPromise;
        const filePath = path.join(__dirname, '../fixtures', fileName);
        await fileChooser.setFiles(filePath);
        await this.page.waitForResponse(response => response.url().includes('api/v3/users/me/image') && response.status() === 204);
    }

    async toggleUsageType() {
        if (await this.page.getByRole('radio', { name: 'Uso personal' }).isChecked()) {
            await this.page.getByRole('radio', { name: 'Uso profesional' }).check();
        } else {
            await this.page.getByRole('radio', { name: 'Uso personal' }).check();
        }
    }

    async setLocation(location: string) {
        await this.page.locator('section').filter({ hasText: 'Tus productos se verán en:Este es el punto donde está ubicado tu perfil de' }).getByPlaceholder('Marca la localización').click();
        await this.page.getByRole('combobox', { name: 'Geolocation' }).fill(location);
        await this.page.getByRole('option', { name: 'Barcelona, Cataluña, ESP' }).click();
        await this.page.getByRole('button', { name: 'Aplicar' }).click();
    }

    async saveChanges() {
        // scroll to bottom
        await this.page.getByRole('button', { name: 'Guardar' }).scrollIntoViewIfNeeded();

        let response = await Promise.all([
            this.page.waitForResponse(response => response.url().includes('/api/v3/users/me/') && response.status() === 200 && response.request().method() === 'POST'),
            this.page.getByRole('button', { name: 'Guardar' }).click()
        ]);

        if (await this.page.getByText('Identificación guardada').isVisible()) {
            await this.page.getByRole('button', { name: 'Entendido' }).click();
            await this.page.getByText('Tus datos se han editado').isVisible();
        }
        // extract json response
        let jsonResponse = await response[0].json()
        return jsonResponse
    }

    async refreshProfilePage() {
        let response = await Promise.all([
            this.page.waitForResponse(response => response.url().includes('/api/v3/users/me/') && response.status() === 200 && response.request().method() === 'GET'),
            this.page.goto('/app/profile/info')
        ])
        let jsonResponse = await response[0].json()

        return jsonResponse
    }

    async checkInfoSended(body: any, name: string, lastName: string, location: string) {
        let dataMatch = body.first_name === name && body.last_name === lastName && body.location.city === location
        return dataMatch
    }
}