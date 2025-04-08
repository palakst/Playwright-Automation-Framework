import { Locator, Page } from "@playwright/test";
import { Helper } from "../utils/helper";
import { CheckOutFinalPage } from "./checkoutfinalPage";
export class CheckOutPage extends Helper{
    readonly page:Page
    readonly firstName:Locator
    readonly lastName:Locator
    readonly postalCode:Locator
    readonly continueButton:Locator
    readonly errorMessage:Locator
    constructor(page: Page){
        super(page)
        this.page = page;
        this.firstName = page.getByPlaceholder("First Name")
        this.lastName = page.getByPlaceholder("Last Name")
        this.postalCode = page.getByPlaceholder("Zip/Postal Code")
        this.continueButton = page.getByText("CONTINUE")
        this.errorMessage=page.locator(".error-message-container.error h3")

        }
    
    async addUserDetailsInCheckOutPage(firstnm:string, lastnm:string,postcode:string){
        await this.firstName.pressSequentially(firstnm)
        await this.lastName.pressSequentially(lastnm)
        await this.postalCode.fill(postcode)
        
    }

    async clickOnContinue():Promise<CheckOutFinalPage>{
        await this.continueButton.click()
        return new CheckOutFinalPage(this.page)
    }
        async getErrorMessage(){
            let error_msg =await this.errorMessage.textContent()
            return error_msg
        }  
   

  
}