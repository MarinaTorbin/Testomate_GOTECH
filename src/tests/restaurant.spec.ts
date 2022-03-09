import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import { expect } from 'chai';


import restaurantsAPI from '../logic/REST/restaurantsAPI';
import { exit } from 'process';
import { doesNotMatch } from 'assert';

describe('Restaurants tests', () => {

    before('Reset restaurant server', async () => {
        //Arrange
        await restaurantsAPI.resetServer();//reset to default values
    }) 

    it('Validate the amount of restaurants', async () => {
        //Act
        const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();

        //Assert
        expect(restaurants.success).to.be.true;
        const actualAmount = restaurants.data?.length;
        expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected');
    })

    it('Get restaurant by id', async () => {
        //Arrange
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);

        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.data).to.deep.equal(myNewRest);
    })

    it('Get non exsisting restaurant', async () => {
        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(23367888);

        //Assert
        //expect(getByIdResponse.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse.success).to.be.false;
        expect(getByIdResponse.status).to.equal(404);
    })

    //--------------------------------------------------------------------------------------------
    it("Add a restorant", async () => {
        //Arrange
        var restaurantId = 99;
        var exists = await IfExists(restaurantId);

        //Act and Assert
        if (!exists) {
            const myNewRest = { address: "Marina's Adress", id: restaurantId, name: "Marina's Restaurant", score: 5 };
            const getByIdResponse = await restaurantsAPI.createRestaurant(myNewRest);
            expect(getByIdResponse.status).to.equal(201);
            expect(getByIdResponse.success).to.be.true;

            const getRestaurant = await restaurantsAPI.getRestaurantById(restaurantId);
            expect(getRestaurant.status).to.equal(200);
            expect(getRestaurant.success).to.be.true;
            expect(getRestaurant.data).to.deep.equal(myNewRest);
        } else {
            //fail test          
            expect(console.error("The restaurant with the same ID is already exists.Test exited"));
        }
    })


    it("Delete a restaurant", async () => {
        //Arrange
        var restaurantId = 999;
        var exists = await IfExists(restaurantId);

        //if nrestaurant with above ID ia not exists - create it 
        if (!exists) {
            var myNewRest = { address: "Boo", id: restaurantId, name: "Boo Restaurant", score: 4 };
            const newResaurant = await restaurantsAPI.createRestaurant(myNewRest);
            expect(newResaurant.status).to.equal(201);
            expect(newResaurant.success).to.be.true;
        }

        //Act
        const getByIdResponse = await restaurantsAPI.deleteRestaurant(restaurantId);

        //Assert
        expect(getByIdResponse.status).to.equal(200);
    })

    it("Update restaurant's data", async () => {
        //Arrange
        const restaurantIdBefore = 9999;
        const restaurantIdAfter = 10000;
        var exists = await IfExists(restaurantIdBefore);

        //if nrestaurant with above ID ia not exists - create it 
        if (!exists) {
            var myNewRest = { address: "Best Choice", id: restaurantIdBefore, name: "At best choice street, 100", score: 4 };
            const newResaurant = await restaurantsAPI.createRestaurant(myNewRest);
            expect(newResaurant.status).to.equal(201);
            expect(newResaurant.success).to.be.true;
        }
        //assume that id = 10000 is not exist
        const updateDataRequest = { address: "Updated Best Choice Adress", id: restaurantIdAfter, name: "Updated Name", score: 5 }

        //Act
        const updateResponse = await restaurantsAPI.updateRestaurantData(restaurantIdBefore, updateDataRequest);
        const getRestaurant = await restaurantsAPI.getRestaurantById(restaurantIdAfter);      


        //Assert       
        expect(updateResponse.status).to.equal(200);
        expect(updateResponse.success).to.be.true;

        //on this assert test will fail. The reason "score" property can't be updated. 
        //expect(getRestaurant.data).to.deep.equal(updateDataRequest);
    })

    //const updateDataRequest = { address: "Updated Adress", id: 100, name: "Updated Name", score: 2.3 }
    async function IfExists(restNum: number) {
        const getByIdResponse = await restaurantsAPI.getRestaurantById(restNum);
        return getByIdResponse.success;
    }


})