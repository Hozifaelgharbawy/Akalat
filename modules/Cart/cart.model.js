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
    delivery: {
        type: mongoose.Types.ObjectId,
        ref: "deliverys"
    },
    items: [
        {
            meal: {
                type: Object,
                ref: "meals"
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