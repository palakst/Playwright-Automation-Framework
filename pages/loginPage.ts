import { Locator, Page } from "@playwright/test";
import { HomePage } from "./homePage";
import { Helper } from '../utils/helper';

export class LoginPage extends Helper{
    readonly page:Page
    readonly userNameField: Locator
    readonly passwordField: Locator
    readonly submitField: Locator
    readonly errorMessage:Locator

    constructor(page: Page){
        super(page)
        this.page = page
        this.userNameField = page.getByPlaceholder('Username')  
        this.passwordField = page.getByPlaceholder('Password')
        this.submitField=page.locator(".btn_action")
        this.errorMessage = page.locator(".error-message-container.error h3")
    }

    async successLogin(username:string,password:string) : Promise<HomePage>{
        await this.enterUsernamePassword(username,password)
        return new HomePage(this.page)
    }

    private async enterUsernamePassword(username:string,password:string){
        // await this.waitForCustomSeconds(3)
        await this.userNameField.fill(username)
        await this.passwordField.fill(password)
        await this.submitField.click()
        
    }
}