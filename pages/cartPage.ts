import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { Helper } from "../utils/helper";
import { CheckOutPage } from "./checkoutPage";

export class CartPage extends Helper{
    readonly page: Page
    readonly cartItemCost:Locator
    readonly cartItemName:Locator
    readonly cartItemRemoveButton: Locator
    readonly checkOutButton:Locator
    readonly basePage: BasePage

    constructor(page:Page){
        super(page)
        this.page = page
        this.cartItemCost=page.locator(".cart_item_label .inventory_item_price")
        this.cartItemName=page.locator(".cart_item_label .inventory_item_name")
        this.cartItemRemoveButton=page.getByText("Remove")
        this.checkOutButton = page.getByText("CHECKOUT")
        this.basePage = new BasePage(page)
    }

    async listItemsPresentOnCart():Promise<any>{
        let itemArray : string[]=[]
        const help = new Helper(this.page)
        help.waitForCustomSeconds(0.5)        
        let count = await this.cartItemName.count()
        for(let i=0; i<count;i++){
            const itemText = await this.cartItemName.nth(i).textContent();
            if (itemText !== null) {
                itemArray.push(itemText);
            }
        }   
        return itemArray
    }

    async removeItemFromCartForAnItemName(itemName:string){
        const help = new Helper(this.page)
        help.waitForCustomSeconds(0.5)        
        let count = await this.cartItemName.count()
        for(let i=0; i<count;i++){
            const itemText = await this.cartItemName.nth(i).textContent();
            if (itemText?.trim() === itemName) {
                await this.cartItemRemoveButton.nth(i).click();
                break;
            }
        }        
    }

    async proceedToCheckOutPage():Promise<CheckOutPage>{
        await this.checkOutButton.click()

        return new CheckOutPage(this.page)
    }
}