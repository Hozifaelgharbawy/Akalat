let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["admin"]

const authRoutes = require("./auth.route");
const adminRoutes = require("./admin.route");
const userRoutes = require("./user.route");

app.use(authRoutes)
app.use(checkToken(allowedUsers), adminRoutes);
app.use("/user",checkToken(allowedUsers), userRoutes);

module.exports = app