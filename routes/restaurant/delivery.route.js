const app = require("express").Router();
const deliveryController = require("../../controllers/restaurant/delivery.controller")
const { createDeliveryValidation, resetPasswordValidation } = require("../../validation/Delivery/delivery.createValidation")
const { updateDeliveryValidation } = require("../../validation/Delivery/delivery.updateValidation")
const validator = require("../../helpers/validation.helper")
const { uploadImage } = require("../../helpers/uploader.helper")
const upload = uploadImage("delivery")

app.post("/create", validator(createDeliveryValidation), deliveryController.createDelivery);

app.get("/get", deliveryController.getDelivery);
app.get("/list", deliveryController.listDelivery);

app.put("/update", validator(updateDeliveryValidation), deliveryController.updateDelivery);
app.delete("/remove", deliveryController.removeDelivery);
app.put("/resetPassword", validator(resetPasswordValidation), deliveryController.resetPassword);

app.post("/image", upload.array('image', 1), deliveryController.uploadImage)
app.delete("/image", deliveryController.deleteImage)



module.exports = app