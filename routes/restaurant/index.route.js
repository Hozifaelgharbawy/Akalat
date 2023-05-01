let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["restaurant"]

const authRoutes = require("./auth.route");
const restaurantRoutes = require("./restaurant.route");
const userRoutes = require("./user.route");
const deliveryRoutes = require("./delivery.route");
const mealRoutes = require("./meal.route");
const orderRoutes = require("./order.route");
const reviewRoutes = require("./review.route");

app.use(authRoutes)
app.use(checkToken(allowedUsers), restaurantRoutes);
app.use("/user",checkToken(allowedUsers), userRoutes);
app.use("/delivery",checkToken(allowedUsers), deliveryRoutes);
app.use("/meal",checkToken(allowedUsers), mealRoutes);
app.use("/order",checkToken(allowedUsers), orderRoutes);
app.use("/review",checkToken(allowedUsers), reviewRoutes);

module.exports = app