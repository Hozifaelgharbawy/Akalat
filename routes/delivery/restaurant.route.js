const app = require("express").Router();
const restaurantController = require("../../controllers/delivery/restaurant.controller")


app.get("/get", restaurantController.getRestaurant);


module.exports = app