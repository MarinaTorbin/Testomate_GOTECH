import { expect } from 'chai';
import { Browser } from '../infra/driver-wrapper/browser';
import { By } from 'selenium-webdriver';
import { RestaurantPage } from '../logic/pages/restaurant-page';
import { CreateNewRestaurantPopUp } from '../logic/popups/create-new-restaurant-popup';
import { PageBase } from '../infra/pages-infra/page-base';
import jsonConfig from '../../config.json';
import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import restaurantsAPI from '../logic/REST/restaurantsAPI';
import { exit } from 'process';
import { ClickableElement } from '../logic/elements/clickable-element';
import { OkPopUp } from '../logic/popups/ok-popups';
import { WebElement } from "selenium-webdriver";
import exp from 'constants';


const baseUiUrl = jsonConfig.baseUiUrl + '/';


describe('Hybrid tests', () => {
    let browser: Browser;
    let page: RestaurantPage;
    let okPopUp: OkPopUp;

    before('Start browser', async () => {
        browser = new Browser();
        await browser.navigateToUrl(baseUiUrl);
        await restaurantsAPI.resetServer();
        page = new RestaurantPage(browser);
        okPopUp = new OkPopUp(browser); 
        await okPopUp.init();       
    })

    beforeEach('Start browser', async () => {        
        await browser.navigateToUrl(baseUiUrl);
    })

    afterEach('Close browser', async () => {
        await browser.close();
    })

    after('Quit driver', async () => {
        await browser.quit();
    })

    it('Create&Delete the new Restaurant', async function () {
        const idInputElement = 123456;        
        const popup = await page.openCreateRestaurantPopup();
        const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();
        const defaultAmount = restaurants.data?.length;

        if (await Exists(idInputElement)) {
            expect(console.error("The restaurant with the same ID is already exists.Test exited"));
            exit;
        }

        await popup.init();
        await popup.cleareAllTexs();
        await popup.fillAllData(idInputElement, "Name", "Adress", 5);
        await popup.submitData();

        //this is not a best choice/ We should wait till submit is done or until OK button element is located (conditional wait), but I don't remember how to do this how to do this :)) (or :(()
        //need to use webdriverwait API...
        await delay(500);

        await page.clickOk();        

        //Check that a restaurant was created        
        const getByIdResponse = await restaurantsAPI.getRestaurantById(idInputElement);
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;       

        //Act
        //Since data was reset, the newly added row will be the last        
        await page.selectLastDeleteBtnOnList();
        await delay(500);//not optimal at all        
        await page.clickOk();
        
        //Assert
        //API
        const getByIdResponseAfterDeletion = await restaurantsAPI.getRestaurantById(idInputElement);
        expect(getByIdResponseAfterDeletion.status).to.equal(404);
        expect(getByIdResponseAfterDeletion.success).to.be.false;
    })

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }    
    
    async function Exists(restNum: number) {
            const getByIdResponse = await restaurantsAPI.getRestaurantById(restNum);
            return getByIdResponse.success;
        }
        
})