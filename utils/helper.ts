import { Page } from "@playwright/test";

export class Helper{
    readonly page:Page

    constructor(page:Page){
        this.page = page
    }

    async waitForCustomSeconds(timeInSeconds:number){
        await this.page.waitForTimeout(timeInSeconds*1000)
    }

    async convertCostToInt(dollarCost:string){
        let costString = dollarCost.replace("$","")
        let numberValue: number = +costString;
        return numberValue
    } 

    async captureImage(){
        let file_name = Date.now()
        await this.page.screenshot({path:`screenshots/${file_name}.png`})

    }
}