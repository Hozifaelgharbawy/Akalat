const app = require("express").Router();
const orderController = require("../../controllers/restaurant/order.controller")


app.get("/list", orderController.listOrders);
app.get("/get", orderController.getOrder);


app.put("/applyOrder", orderController.applyOrder);


module.exports = app