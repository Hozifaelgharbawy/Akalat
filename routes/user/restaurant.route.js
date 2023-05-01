const app = require("express").Router();
const restaurantController = require("../../controllers/user/restaurant.controller")


app.get("/get", restaurantController.getRestaurant);
app.get("/list", restaurantController.listRstaurants);


module.exports = app