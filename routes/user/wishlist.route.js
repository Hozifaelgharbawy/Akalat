const app = require("express").Router();
const wishlistController = require("../../controllers/user/wishlist.controller")

app.get("/get", wishlistController.getWishlist);
app.post("/item", wishlistController.addItemToWishlist);
app.delete("/item", wishlistController.removeItemFromWishlist);

module.exports = app