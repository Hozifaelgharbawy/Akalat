let app = require("express").Router();

let adminRoutes = require("./admin/index.route")
let userRoutes = require("./user/index.route")
let deliveryRoutes = require("./delivery/index.route")
let restaurantRoutes = require("./restaurant/index.route")

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/delivery", deliveryRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);


app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Welcome to Akalat Server!", code: 200 })
})

app.get("*", (req, res) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

app.post("*", (req, res) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

app.put("*", (req, res) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

app.delete("*", (req, res) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})


app.patch("*", (req, res) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

module.exports = app;
