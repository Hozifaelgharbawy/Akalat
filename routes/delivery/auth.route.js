const app = require("express").Router();
const deliveryController = require("../../controllers/delivery/delivery.controller")
const { createDeliveryValidation, loginValidation} = require("../../validation/Delivery/delivery.createValidation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createDeliveryValidation), deliveryController.register);
app.post("/login", validator(loginValidation), deliveryController.login);


module.exports = app