import { Locator, Page } from "@playwright/test";
import { Helper } from "../utils/helper";
import { OrderCompletePage } from "./ordercompletePage";
import { HomePage } from "./homePage";
export class CheckOutFinalPage extends Helper{
    readonly page:Page
    readonly finishButton:Locator
    readonly itemName:Locator
    readonly errorMessage:Locator
    constructor(page: Page){
        super(page)
        this.page = page;
        this.finishButton = page.getByText("FINISH")
        this.itemName = page.locator(".inventory_item_name")
        }
 

 
    async finishTransaction():Promise<OrderCompletePage>{
        await this.finishButton.click()
        return new OrderCompletePage(this.page)
    }

    async listItemsPresentOnCart():Promise<any>{
        let itemArray : string[]=[]
        const help = new Helper(this.page)
        help.waitForCustomSeconds(0.5)        
        let count = await this.itemName.count()
        for(let i=0; i<count;i++){
            const itemText = await this.itemName.nth(i).textContent();
            if (itemText !== null) {
                itemArray.push(itemText);
            }
        }   
        return itemArray
    }

   
  
}