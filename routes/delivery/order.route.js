const app = require("express").Router();
const orderController = require("../../controllers/delivery/order.controller")


app.get("/list", orderController.listOrders);
app.get("/get", orderController.getOrder);

app.put("/checkout", orderController.checkoutOrder);
app.put("/applyOrder", orderController.applyOrder);



module.exports = app