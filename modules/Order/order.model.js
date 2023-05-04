let mongoose = require("mongoose");

let orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users"
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
            _id: { type: mongoose.Types.ObjectId, ref: "meals" },
            meal: {
                type: Object
            },
            quantity: Number,
            total: Number
        }
    ],
    total: { type: Number, required: true },
    originalTotal: { type: Number, required: true },
    startDate: { type: Date },
    defaultEndDate: { type: Date },
    EndDate: { type: Date },
    status: { type: String, enum: ["accepted", "pending"], default: "pending" }
})


let orderModel = mongoose.model("orders", orderSchema)


module.exports = orderModel;