const app = require("express").Router();
const reviewController = require("../../controllers/delivery/review.controller")


app.get("/get", reviewController.getReview);
app.get("/list", reviewController.listReviews);




module.exports = app