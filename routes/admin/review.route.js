const app = require("express").Router();
const reviewController = require("../../controllers/admin/review.controller")


app.get("/get", reviewController.getReview);
app.get("/list", reviewController.listReviews);

app.delete("/remove", reviewController.deleteReview);



module.exports = app