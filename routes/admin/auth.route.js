const app = require("express").Router();
const adminController = require("../../controllers/admin/admin.controller")
const { loginValidation} = require("../../validation/User/user.createValidation")
const validator = require("../../helpers/validation.helper")

app.post("/login", validator(loginValidation), adminController.login);


module.exports = app