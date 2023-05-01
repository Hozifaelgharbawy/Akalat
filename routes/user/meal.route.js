const app = require("express").Router();
const mealController = require("../../controllers/user/meal.controller")

app.get("/get", mealController.getMael);
app.get("/list", mealController.listMaels);


module.exports = app