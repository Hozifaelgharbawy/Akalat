let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["delivery"]

const authRoutes = require("./auth.route");
const deliveryRoutes = require("./delivery.route");
const restaurantRoutes = require("./restaurant.route");
const orderRoutes = require("./order.route");
const reviewRoutes = require("./review.route");
const userRoutes = require("./user.route");


app.use(authRoutes)
app.use(checkToken(allowedUsers), deliveryRoutes);
app.use("/restaurant",checkToken(allowedUsers), restaurantRoutes);
app.use("/order",checkToken(allowedUsers), orderRoutes);
app.use("/review",checkToken(allowedUsers), reviewRoutes);
app.use("/user",checkToken(allowedUsers), userRoutes);

module.exports = app