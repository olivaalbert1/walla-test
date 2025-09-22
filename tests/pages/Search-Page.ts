import { Page } from "@playwright/test";

export class SearchPage {

  readonly page: Page
  waitForLoadState: Promise<void>;

  constructor(page: Page) {
    this.page = page;
    // this.getList = page.locator('[id="favourite-apps"]');
    // this.getMenu = page.locator('[role="menubar"]');
    // this.pageTestId = page.getByTestId('page')
    this.waitForLoadState = page.waitForLoadState('load')
  }

  async gotoSearchPage() {
    await this.page.goto('/', { waitUntil: 'load' });
  }

  async searchBox(searchWord: string) {
    // await this.page.locator('#searchbox-form-input').click();

    let responseMessage = await Promise.all([
      this.page.locator('#searchbox-form-input').fill(searchWord),
      this.page.locator('#searchbox-form-input').press('Enter'),
      this.page.waitForResponse(response =>
        response.url().includes('&search_id') &&
        response.status() === 200 &&
        response.request().method() === 'GET')
    ])
    let body = await responseMessage[2].json()
    let itemsArray = body.data.section.payload.items
    let wordToFind = searchWord.toLocaleLowerCase().trim()
    let firstItem = itemsArray.find((item: { title: string; }) =>
      item.title.toLowerCase().includes(wordToFind)
    )
    //look for some of the search box to click on
    await this.page.getByText('Resultados de búsqueda').isVisible()

    return firstItem.title
  }

  async clickOnFirstItem(itemFound: string) {
    // await this.page.getByRole('link', { name: itemFound }).click();
    await this.page.getByRole('link', { name: itemFound }).first().click();
  }

}