const app = require("express").Router();
const adminController = require("../../controllers/admin/admin.controller")
const { createUserValidation, resetPasswordValidation } = require("../../validation/User/user.createValidation")
const { updateUserValidation } = require("../../validation/User/user.updateValidation")
const validator = require("../../helpers/validation.helper")
const { uploadImage } = require("../../helpers/uploader.helper")
const upload = uploadImage("admins")

app.post("/create", validator(createUserValidation), adminController.register);

app.get("/get", adminController.getAdmin);
app.get("/list", adminController.listAdmins);

app.put("/update", validator(updateUserValidation), adminController.updateAdmin);
app.delete("/remove", adminController.removeAdmin);
app.put("/resetPassword", validator(resetPasswordValidation), adminController.resetPassword);

app.post("/image", upload.array('image', 1), adminController.uploadImage)
app.delete("/image", adminController.deleteImage)



module.exports = app