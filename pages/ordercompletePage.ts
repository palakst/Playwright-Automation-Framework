import { Locator, Page } from "@playwright/test";
import { Helper } from "../utils/helper";
import { HomePage } from "./homePage";
export class OrderCompletePage extends Helper{
    readonly page:Page
    readonly orderSuccessMessage : Locator
    readonly backHomeButton:Locator

    constructor(page: Page){
        super(page)
        this.page = page;
        this.orderSuccessMessage = page.locator(".complete-header")
        this.backHomeButton = page.getByText("Back Home")
        }

    async getHeaderText():Promise<any>{
        let text = await this.orderSuccessMessage.textContent()
        return text
    }

    async goBackToHome():Promise<HomePage>{
        await this.backHomeButton.click()
        return new HomePage(this.page)
    }


  
}