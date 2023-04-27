let mongoose = require("mongoose");

let reviewSchema = mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    restaurant: { type: mongoose.Types.ObjectId, ref: "restaurants" },
    mael: { type: mongoose.Types.ObjectId, ref: "maels" },
    delivery: { type: mongoose.Types.ObjectId, ref: "deliverys" },
    review: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5, default: 2.5 },
    type: { type: String, required: true, enum: ["mael", "restaurant", "delivery"] },
})


let reviewModel = mongoose.model("reviews", reviewSchema)


module.exports = reviewModel;