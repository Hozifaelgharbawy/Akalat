const app = require("express").Router();
const userController = require("../../controllers/restaurant/user.controller")

app.get("/get", userController.getUser);
app.get("/list", userController.listUsers);


module.exports = app