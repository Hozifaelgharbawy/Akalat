let mongoose = require("mongoose");

let mealSchema = mongoose.Schema({
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: "restaurants"
    },
    name: { type: String, required: true },
    description: { type: String },
    image: [{ type: Object }],
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    rate: { type: Number, min: 1, max: 5, default: 2.5 },
    numOfReviews: { type: Number, default: 0 },

})


let mealModel = mongoose.model("meals", mealSchema)


module.exports = mealModel;