const app = require("express").Router();
const deliveryController = require("../../controllers/user/delivery.controller")


app.get("/get", deliveryController.getDelivery);
app.get("/list", deliveryController.listDelivery);



module.exports = app