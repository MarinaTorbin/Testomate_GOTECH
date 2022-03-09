import { stringify } from "querystring";
import { By, WebElement } from "selenium-webdriver";
import { Browser } from "../../infra/driver-wrapper/browser";
import { PageBase } from "../../infra/pages-infra/page-base";
import { ClickableElement } from "../elements/clickable-element";
import { InputElement } from "../elements/input-element";
import { LabelElement } from "../elements/label-element";


let idInputElement: InputElement;
let nameInputElement: InputElement;
let addressInputElement: InputElement;
let submitButtonElement: ClickableElement;
let scoreInputElement: InputElement;

class CreateNewRestaurantPopUp extends PageBase {

    constructor(browser: Browser) {
        super(browser);
    }

    async init() {                                                                      
        submitButtonElement = await this.browser.findElement(ClickableElement, By.xpath("//button[text()='Submit']"));//"//button[text()='Submit']"               //*[@id='create-new-popup']/form/button"                                                                           
        nameInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Name']/../input"));
        addressInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Address']/../input"));
        scoreInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Score']/../input"));
        idInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Id']/../input"));
    }

    async getTitle() {
        const titleElement = await this.browser.findElement(LabelElement, By.xpath("//h2[text()='Create new restaurant']"));
        return titleElement.text();
    }

    async fillAllData(id: number, name: string, adress: string, score: number) {
        await nameInputElement.setText(name);
        await addressInputElement.setText(adress);
        await scoreInputElement.setText(score.toString());
        await idInputElement.setText(id.toString());
    }

    async cleareAllTexs() {
        await nameInputElement.clearText();
        await addressInputElement.clearText();
        await scoreInputElement.clearText();
        await idInputElement.clearText();
    }

    async submitData() {
        await submitButtonElement.click();
    }
}

export { CreateNewRestaurantPopUp }