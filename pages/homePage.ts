import { expect, Locator, Page } from "@playwright/test";
import { Helper } from "../utils/helper";
import { LoginPage } from "./loginPage";
import { ItemPage } from "./itemPage";
import { CheckOutPage } from "./checkoutPage";
import { BasePage } from "./basePage";
import { count } from "console";
export class HomePage extends BasePage{
    readonly page:Page
    readonly basePage : BasePage
    readonly addToCartButton: Locator
    readonly removeFromCartButon : Locator
    readonly itemNameLabel:Locator
    readonly itemPriceLabel:Locator
    readonly sortOption:Locator
    constructor(page: Page){
        super(page)
        this.page=page
        this.basePage=new BasePage(page)
        this.itemNameLabel = page.locator(".inventory_item_name")
        this.itemPriceLabel = page.locator(".inventory_item_price")
        this.addToCartButton = page.getByText('Add to cart')
        this.removeFromCartButon = page.getByText('Remove')
        this.sortOption = page.locator(".product_sort_container")
    }



    async sortTheItemsPresent(sortOrder:string){
       await this.sortOption.selectOption(sortOrder)
    }

    
    async validateSorting(sortOrder: string): Promise<boolean> {
        switch (sortOrder) {
            case 'az': {
                let az = await this.get_array_Elements('az');
                expect([...az].sort((a, b) => a.localeCompare(b))).toEqual(az);
                break;
            }
            case 'za': {
                let za = await this.get_array_Elements('za');
                expect([...za].sort((a, b) => b.localeCompare(a))).toEqual(za);
                break;
            }
            case 'lohi': {
                let lohi = await this.get_array_Elements('lohi');
                const numericPrices = lohi.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
                expect([...numericPrices].sort((a, b) => a - b)).toEqual(numericPrices);
                break;
            }
            case 'hilo': {
                let hilo = await this.get_array_Elements('hilo');
                const numericPrices = hilo.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
                expect([...numericPrices].sort((a, b) => b - a)).toEqual(numericPrices);
                break;
            }
            default:
                return false;
        }
        return true;
    }
    

    async get_array_Elements(sortOrder: string) {
        let actualList: string[] = [];
    
        if (sortOrder === "az" || sortOrder === "za") {
            let count = await this.itemNameLabel.count();
            for (let i = 0; i < count; i++) {
                const nm = await this.itemNameLabel.nth(i).textContent();
                if (nm !== null) {
                    actualList.push(nm);
                }
            }
            return actualList;
        }
        else if (sortOrder === "lohi" || sortOrder === "hilo") {
            let count = await this.itemPriceLabel.count();
            for (let i = 0; i < count; i++) {
                const price = await this.itemPriceLabel.nth(i).textContent();
                if (price !== null) {
                    actualList.push(price);
                }
            }
            return actualList;
        }
        else {
            return actualList;
        }
    }
    


    async AddItemsWithNamesToCart(itemNames: string[]) {
        for (const name of itemNames) {
            const productCard = this.page.locator('.inventory_item').filter({
                has: this.page.locator('a', { hasText: name }),
            });
    
            const addToCartButton = productCard.locator('button', { hasText: 'Add to cart' });
    
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click()
            }
            else{
                console.log(`ITEM NOT PRESENT ${name}`)
            }
        }
    }

    async RemoveItemFromCart(itemName: string[]) {
        for (const name of itemName) {
            const productCard = this.page.locator('.inventory_item').filter({
                has: this.page.locator('a', { hasText: name }),
            });
            const removebtttn = productCard.locator('button', { hasText: 'Remove' });

            if (await removebtttn.isVisible()) {
                 await removebtttn.click()
            }
            else{
                console.log(`ITEM NOT PRESENT ${name}`)
            }
        }
    }


    async SelectItemAndGoToItemPage(itemName:string):Promise<ItemPage>{
        const productCard = this.page.locator('.inventory_item_name',{ hasText: itemName })
        productCard.click()
        return new ItemPage(this.page)
    }
    


}