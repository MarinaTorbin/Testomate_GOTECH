import { Browser } from "../driver-wrapper/browser";
import { By, WebElement } from "selenium-webdriver";

abstract class PageBase {

    protected browser: Browser;

    constructor(browser: Browser) {
        this.browser = browser;
    }
}

export { PageBase }
