let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["user"]

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

app.use(authRoutes)
app.use(checkToken(allowedUsers), userRoutes);

module.exports = app