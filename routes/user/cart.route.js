const app = require("express").Router();
const cartController = require("../../controllers/user/cart.controller")

app.get("/get", cartController.getCart);

app.post("/item", cartController.addItemToCart);

app.delete("/flush", cartController.flushCart);

app.delete("/item", cartController.removeItemFromCart);

module.exports = app