let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let saltrouds = 5;

let restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: null, required: true },
    password: { type: String, default: null, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: null, required: true },
    image: { type: Object, default: null },
    rate: { type: Number, min: 1, max: 5, default: 2.5 },
    url:{ type: String },
    role: { type: String, default: "restaurant" },
    numOfReviews: { type: Number, default: 0 },
})
restaurantSchema.pre("save", async function (next) {
    if (this.password) this.password = await bcrypt.hash(this.password, saltrouds);
    next();
})

let restaurantModel = mongoose.model("restaurants", restaurantSchema)


module.exports = restaurantModel;