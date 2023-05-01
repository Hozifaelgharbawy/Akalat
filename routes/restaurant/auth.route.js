const app = require("express").Router();
const restaurantController = require("../../controllers/restaurant/restaurant.controller")
const { createRestaurantValidation, loginValidation} = require("../../validation/Restaurant/restaurant.createValidation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createRestaurantValidation), restaurantController.register);
app.post("/login", validator(loginValidation), restaurantController.login);


module.exports = app