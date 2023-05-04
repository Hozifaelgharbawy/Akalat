const app = require("express").Router();
const mealController = require("../../controllers/user/meal.controller")

app.get("/get", mealController.getMeal);
app.get("/list", mealController.listMeals);


module.exports = app