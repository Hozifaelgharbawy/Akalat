const app = require("express").Router();
const reviewController = require("../../controllers/user/review.controller")
const { createReviewVaidation } = require("../../validation/Review/review.createValidation")
const { updateReviewVaidation } = require("../../validation/Review/review.updateVaidation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createReviewVaidation), reviewController.createReview);

app.get("/get", reviewController.getReview);
app.get("/list", reviewController.listReviews);

app.put("/update", validator(updateReviewVaidation), reviewController.updateReview);
app.delete("/remove", reviewController.deleteReview);

module.exports = app