const app = require("express").Router();
const restaurantController = require("../../controllers/admin/restaurant.controller")
const { createRestaurantValidation, resetPasswordValidation } = require("../../validation/Restaurant/restaurant.createValidation")
const { updateRestaurantValidation } = require("../../validation/Restaurant/restaurant.updateValidation")
const validator = require("../../helpers/validation.helper")
const { uploadImage } = require("../../helpers/uploader.helper")
const upload = uploadImage("restaurants")


app.post("/create", validator(createRestaurantValidation), restaurantController.createRstaurant);

app.get("/get", restaurantController.getRestaurant);
app.get("/list", restaurantController.listrRstaurant);

app.put("/update", validator(updateRestaurantValidation), restaurantController.updateRestaurant);
app.delete("/remove", restaurantController.removeRestaurant);
app.post("/image", upload.array('image', 1), restaurantController.uploadImage)
app.delete("/image", restaurantController.deleteImage)

app.put("/resetPassword", validator(resetPasswordValidation), restaurantController.resetPassword);


module.exports = app