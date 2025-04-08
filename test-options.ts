import {test as base} from '@playwright/test'
import { LoginPage } from './pages/loginPage'
import { HomePage } from './pages/homePage'
import { BasePage } from './pages/basePage'


export type TestOptions ={
    home_page : HomePage
    base_page : BasePage
}

const valid_username = "standard_user"
const valid_password = "secret_sauce"
export const test = base.extend<TestOptions>({
    home_page: async ({ page }, use) => {
        await page.goto('/')
        const loginPage = new LoginPage(page)
        const home_page = await loginPage.successLogin(valid_username,valid_password)
        await use(home_page)
        await home_page.userLogoutsOfSite()
      }
})