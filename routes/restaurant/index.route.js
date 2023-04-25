let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["restaurant"]

const userRoutes = require("./user.route");

app.use("/user",checkToken(allowedUsers), userRoutes);

module.exports = app