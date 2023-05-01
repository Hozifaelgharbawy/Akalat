const app = require("express").Router();
const orderController = require("../../controllers/restaurant/order.controller")


app.get("/list", orderController.listOrders);
app.get("/get", orderController.getOrder);


module.exports = app