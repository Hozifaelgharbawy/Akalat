const app = require("express").Router();
const orderController = require("../../controllers/user/order.controller")
const { createOrderVaidation } = require("../../validation/Order/order.createValidation")
const validator = require("../../helpers/validation.helper")


app.get("/list", orderController.listOrders);
app.get("/get", orderController.getOrder);

app.post("/checkout", orderController.checkoutOrder);

module.exports = app