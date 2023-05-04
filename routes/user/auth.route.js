const app = require("express").Router();
const userController = require("../../controllers/user/user.controller")
const { createUserValidation, loginValidation} = require("../../validation/User/user.createValidation")
const validator = require("../../helpers/validation.helper")


app.post("/register", validator(createUserValidation), userController.register);
app.post("/login", validator(loginValidation), userController.login);


module.exports = app