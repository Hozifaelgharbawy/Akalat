const app = require("express").Router();
const userController = require("../../controllers/delivery/user.controller")

app.get("/get", userController.getClientWithCart);


module.exports = app