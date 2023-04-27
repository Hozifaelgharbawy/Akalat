const app = require("express").Router();
const wishlistController = require("../../controllers/admin/wishlist.controller");

app.get("/get", wishlistController.getWishlist);
app.get("/list", wishlistController.listWishlists);


module.exports = app;