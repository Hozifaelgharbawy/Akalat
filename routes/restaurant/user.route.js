const app = require("express").Router();
const userController = require("../../controllers/restaurant/user.controller")

app.get("/get", userController.getClientWithCart);


module.exports = app