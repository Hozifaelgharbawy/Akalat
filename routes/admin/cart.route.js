const app = require("express").Router();
const cartController = require("../../controllers/admin/cart.controller")


app.get("/get", cartController.getCart);
app.get("/list", cartController.listCarts);


module.exports = app