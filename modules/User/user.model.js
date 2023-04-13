let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let saltrouds = 5;

let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: null, required: true },
    password: { type: String, default: null, required: true },
    image: { type: Object },
    address: { type: String, required: true },
    phone: { type: String, default: null, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }
})
userSchema.pre("save", async function (next) {
    if (this.password) this.password = await bcrypt.hash(this.password, saltrouds);
    next();
})

let userModel = mongoose.model("users", userSchema)


module.exports = userModel;