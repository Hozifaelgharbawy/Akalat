const app = require("express").Router();
const wishlistController = require("../../controllers/user/wishlist.controller")

app.get("/get", wishlistController.getWishlist);
app.post("/addItem", wishlistController.addItemToWishlist);
app.delete("/removeItem", wishlistController.removeItemFromWishlist);

module.exports = app