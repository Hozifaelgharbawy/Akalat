let mongoose = require("mongoose");


let wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users", required: true
    },
    items: [{
        _id: { type: mongoose.Types.ObjectId, ref: "meals" },
        meal: {
            type: Object,
            ref: "meals"
        },
        restaurant: { type: mongoose.Types.ObjectId, ref: "restaurants" }
    }]
})


let wishlistModel = mongoose.model("wishlists", wishlistSchema)


module.exports = wishlistModel;