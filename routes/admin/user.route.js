const app = require("express").Router();
const userController = require("../../controllers/admin/user.controller")
const { createUserValidation, resetPasswordValidation } = require("../../validation/User/user.createValidation")
const { updateUserValidation } = require("../../validation/User/user.updateValidation")
const validator = require("../../helpers/validation.helper")
const { uploadImage } = require("../../helpers/uploader.helper")
const upload = uploadImage("users")

app.post("/create", validator(createUserValidation), userController.createUser);

app.get("/get", userController.getUser);
app.get("/list", userController.listUsers);

app.put("/update", validator(updateUserValidation), userController.updateUser);
app.delete("/remove", userController.removeUser);
app.put("/resetPassword", validator(resetPasswordValidation), userController.resetPassword);

app.post("/image", upload.array('image', 1), userController.uploadImage)
app.delete("/image", userController.deleteImage)



module.exports = app