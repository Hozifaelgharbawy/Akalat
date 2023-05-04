const app = require("express").Router();
const mealController = require("../../controllers/admin/meal.controller")
const { uploadImage } = require("../../helpers/uploader.helper")
const upload = uploadImage("meals")
const { createMealVaidation } = require("../../validation/Meal/meal.createValidation")
const { updateMealVaidation } = require("../../validation/Meal/meal.updateVaidation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createMealVaidation), mealController.createMeal);

app.get("/get", mealController.getMeal);
app.get("/list", mealController.listMeals);

app.put("/update", validator(updateMealVaidation), mealController.updateMeal);
app.delete("/remove", mealController.removeMeal);
app.post("/image", upload.array('image', 8), mealController.uploadImage)
app.post("/addImage", upload.array('image', 8), mealController.addToImagesArray)
app.delete("/image", mealController.deleteImage)
app.delete("/removeImage", mealController.removeFromImagesArray)

module.exports = app