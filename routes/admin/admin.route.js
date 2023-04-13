const app = require("express").Router();
const adminController = require("../../controllers/admin/admin.controller")
const { createUserValidation } = require("../../validation/User/user.createValidation")
const validator = require("../../helpers/validation.helper")

app.post("/create", validator(createUserValidation) , adminController.register);


module.exports = app