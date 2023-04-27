let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["admin"]

const authRoutes = require("./auth.route");
const adminRoutes = require("./admin.route");
const userRoutes = require("./user.route");
const cartRoutes = require("./cart.route");
const deliveryRoutes = require("./delivery.route");
const mealRoutes = require("./meal.route");
const orderRoutes = require("./order.route");
const restaurantRoutes = require("./restaurant.route");
const wishlistRoutes = require("./wishlist.route");
const reviewRoutes = require("./review.route");

app.use(authRoutes)
app.use(checkToken(allowedUsers), adminRoutes);
app.use("/user",checkToken(allowedUsers), userRoutes);
app.use("/cart",checkToken(allowedUsers), cartRoutes);
app.use("/delivery",checkToken(allowedUsers), deliveryRoutes);
app.use("/meal",checkToken(allowedUsers), mealRoutes);
app.use("/order",checkToken(allowedUsers), orderRoutes);
app.use("/restaurant",checkToken(allowedUsers), restaurantRoutes);
app.use("/wishlist",checkToken(allowedUsers), wishlistRoutes);
app.use("/review",checkToken(allowedUsers), reviewRoutes);

module.exports = app