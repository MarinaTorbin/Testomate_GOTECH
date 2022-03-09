import { By, WebElement } from "selenium-webdriver";
import { ClickableElement } from "../elements/clickable-element";
import { Browser } from "../../infra/driver-wrapper/browser";
import { CreateNewRestaurantPopUp } from "../popups/create-new-restaurant-popup";
import { extend, isEmpty } from "lodash";
import { PageBase } from "../../infra/pages-infra/page-base";
import { OkPopUp } from "../popups/ok-popups";
import { webcrypto } from "crypto";
import { LabelElement } from "../elements/label-element";


class RestaurantPage extends PageBase {

    private createNewRestaurantButtonLocator = "//button[text()='Create new']";
    private okAlertLocator = "//*[@id='alert-popup']/div/button";      
    private lastDeleteButtonInList = "/html/body/app-root/app-main/div[2]/div/table/tbody/tr[last()]/td[last()]/button";    
    private listLocator  = "//*[@id='main-table']/table/tbody/tr";
    private locator = "//*[@id='main-table']/table/tbody/tr[last()]/td[contains(text(), 'RestaurantID')]" 
    private newcustomLocator = "";

    constructor(browser: Browser) {
        super(browser);
    }

    async openCreateRestaurantPopup() {
        const button = await this.browser.findElement(ClickableElement, By.xpath(this.createNewRestaurantButtonLocator));
        button.click();
        return new CreateNewRestaurantPopUp(this.browser);
    }    

    async selectLastDeleteBtnOnList() {
        const deleteButton = await this.browser.findElement(ClickableElement, By.xpath(this.lastDeleteButtonInList));
        deleteButton.click();
        return new OkPopUp(this.browser);
    }

    async clickOk() { 
        const okButton = await this.browser.findElement(ClickableElement, By.xpath(this.okAlertLocator));             
        okButton.click();
        this.browser.refresh();
        return new OkPopUp(this.browser);
    }
    
}

export { RestaurantPage }