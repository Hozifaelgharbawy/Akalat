const app = require("express").Router();
const orderController = require("../../controllers/user/order.controller")


app.get("/list", orderController.listOrders);
app.get("/get", orderController.getOrder);

app.post("/checkout", orderController.checkoutOrder);
app.put("/accepteOrder", orderController.accepteOrder);


module.exports = app