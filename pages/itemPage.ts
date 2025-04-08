import { Locator, Page } from "@playwright/test";
import { Helper } from "../utils/helper";
import { CheckOutPage } from "./checkoutPage";
import { BasePage } from "./basePage";

export class ItemPage extends BasePage{
    readonly page: Page
    readonly basePage : BasePage
    readonly addToCartButton:Locator
    readonly removeFromCartButton:Locator
    readonly itemName:Locator
    readonly itemCost:Locator

    readonly cost:string
    constructor(page:Page){
        super(page)
        this.page=page
        this.basePage = new BasePage(page)
        this.addToCartButton = page.getByText("ADD TO CART")
        this.removeFromCartButton = page.getByText("REMOVE")
        this.itemName = page.locator(".inventory_details_name")
        this.itemCost = page.locator(".inventory_details_price")
    }

    async itemCostShown(){
        const help = new Helper(this.page)
        help.waitForCustomSeconds(0.5)
        const cost = help.convertCostToInt((await this.itemCost.textContent())!)
    }

    
    async addItemToCartFromItemPage(){
        const help = new Helper(this.page)
        await help.waitForCustomSeconds(0.5)
        await this.addToCartButton.click()
        this.convertCostToInt((await this.itemCost.textContent())!)
    }
    async removeItemToCartFromItemPage(){
        const help = new Helper(this.page)
        await help.waitForCustomSeconds(0.5)
        await this.removeFromCartButton.click()
        this.convertCostToInt((await this.itemCost.textContent())!)
    }
}