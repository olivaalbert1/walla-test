import { test, expect } from './pages/base'
import { randomItemName } from '../utils/randomItems'

test.describe('Search page', () => {
  test.beforeEach(async ({ searchPage }) => {
    await searchPage.gotoSearchPage()
  })

  test.afterEach(async ({ page }) => {
    await page.close()
  })

  test('filter iPhone 8', async ({ page, searchPage }) => {
    let itemFound = await searchPage.searchBox('iPhone 8')

    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: itemFound }).first().click();
    const page2 = await page2Promise;

    await expect(page2.getByRole('heading', { name: itemFound })).toBeVisible();

    await page2.close();
  });
})

test.describe('Profile', () => {

  test.beforeEach(async ({ profilePage }) => {
    await profilePage.gotoProfilePage();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Edit', async ({ profilePage }) => {
    await profilePage.writeName('Nombre')
    await profilePage.writeLastName('Apellido')
    await profilePage.uploadProfilePicture('profile-pic.jpg')
    await profilePage.toggleUsageType()
    await profilePage.setLocation('barcelona')
    await profilePage.saveChanges()

    let response = await profilePage.refreshProfilePage();

    // Assert the info is saved correctly
    let dataSendedMatch = await profilePage.checkInfoSended(response, 'Nombre', 'Apellido', 'Barcelona')
    expect(dataSendedMatch).toBe(true);
  });
});

test.describe('Upload', () => {

  test.beforeEach(async ({ sellPage }) => {
    await sellPage.gotoSellPage();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });


  test('new item', async ({ page, sellPage }) => {
    let itemName = randomItemName();

    await sellPage.fullfillNewItem(itemName, '50', 'phone.png')
    let itemId = await sellPage.publishItem();
    let itemPublished = await sellPage.catalogPublished(itemId);

    expect(itemPublished).toBe(true);

    const regex = new RegExp(itemName, 'i');
    let itemVisible = await page.getByRole('link', { name: regex }).isVisible()    
    expect(itemVisible).toBe(true);
  });
})