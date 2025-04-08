import { Locator, Page } from '@playwright/test'
import { CheckOutPage } from './checkoutPage';
import { LoginPage } from './loginPage';
import { Helper } from '../utils/helper';
import { CartPage } from './cartPage';

export class BasePage extends Helper{
    readonly page: Page;
    readonly cartButton: Locator;
    readonly sandwichmenuButton : Locator
    readonly logoutButton:Locator

    constructor(page: Page) {
        super(page)
        this.page = page;
        this.cartButton = page.locator('a.shopping_cart_link')
        this.sandwichmenuButton = page.getByRole('button',{name:'Open Menu'})
        this.logoutButton = page.getByText('Logout')
    }

    async userLogoutsOfSite() : Promise<LoginPage>{
        await this.sandwichmenuButton.click()
        await this.logoutButton.click()
        return new LoginPage(this.page)
    }

    async goToCartPage(): Promise<CartPage> {
        await this.cartButton.click();
        // const { Cart_Page } = await import('./cart_page');

        return new CartPage(this.page);
    }
}
