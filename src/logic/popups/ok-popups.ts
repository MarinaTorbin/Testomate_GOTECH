import { By, WebElement } from "selenium-webdriver";
import { Browser } from "../../infra/driver-wrapper/browser";
import { PageBase } from "../../infra/pages-infra/page-base";
import { ClickableElement } from "../elements/clickable-element";

let okButton: ClickableElement;
class OkPopUp extends PageBase {

    constructor(browser: Browser) {
        super(browser);
    }

    async init() {
        okButton = await this.browser.findElement(ClickableElement, By.xpath("//*[@id='alert-popup']/div/button")); 
    }

}

export { OkPopUp }