const app = require("express").Router();
const mealController = require("../../controllers/admin/mael.controller")
const { uploadImage } = require("../../helpers/uploader.helper")
const upload = uploadImage("meals")
const { createMealVaidation } = require("../../validation/Meal/meal.createValidation")
const { updateMealVaidation } = require("../../validation/Meal/meal.updateVaidation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createMealVaidation), mealController.createMael);

app.get("/get", mealController.getMael);
app.get("/list", mealController.listMaels);

app.put("/update", validator(updateMealVaidation), mealController.updateMael);
app.delete("/remove", mealController.removeMael);
app.post("/image", upload.array('image', 8), mealController.uploadImage)
app.post("/addImage", upload.array('image', 8), mealController.addToImagesArray)
app.delete("/image", mealController.deleteImage)
app.delete("/removeImage", mealController.removeFromImagesArray)

module.exports = app