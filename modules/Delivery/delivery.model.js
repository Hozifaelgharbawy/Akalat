let mongoose = require("mongoose");

let deliverySchema = mongoose.Schema({
    name: { type: String, required: true },
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: "restaurants"
    },
    email: { type: String, default: null, required: true },
    password: { type: String, default: null, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: null, required: true },
    image: {type: Object},
    gender: { type: String, enum: ["male", "female"], required: true },
    rate: { type: Number, min: 1, max: 5, default: 2.5 }

})


let deliveryModel = mongoose.model("deliverys", deliverySchema)


module.exports = deliveryModel;