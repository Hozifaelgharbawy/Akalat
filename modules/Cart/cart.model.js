let mongoose = require("mongoose");

let cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users", required: true
    },
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: "restaurants"
    },
    items: [
        {
            _id: { type: mongoose.Types.ObjectId, ref: "meals" },
            meal: {
                type: Object
            },
            quantity: Number,
            total: Number
        }
    ],
    total: { type: Number, required: true },
    originalTotal: { type: Number, required: true }
})


let cartModel = mongoose.model("carts", cartSchema)


module.exports = cartModel;