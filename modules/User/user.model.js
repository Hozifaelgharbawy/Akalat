let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: null, required: true },
    password: { type: String, default: null, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: null, required: true },
    type: { type: String, enum: ["admin", "user"], default: "user" }
})


let userModel = mongoose.model("users", userSchema)


module.exports = userModel;