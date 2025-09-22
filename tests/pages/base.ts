import { test as base } from '@playwright/test'
import { SearchPage } from './Search-Page'
import { ProfilePage } from './Profile-Page'
import { SellPage } from './Sell-Page'

type MyFixtures = {
    searchPage: SearchPage,
    profilePage: ProfilePage,
    sellPage: SellPage
}

export const test = base.extend<MyFixtures>({
    searchPage: async ({ page }, use ) => {
        await use(new SearchPage(page))
    },
    profilePage: async ({ page }, use ) => {
        await use(new ProfilePage(page))
    },
    sellPage: async ({ page }, use ) => {
        await use(new SellPage(page))
    }
})

export { expect } from '@playwright/test'