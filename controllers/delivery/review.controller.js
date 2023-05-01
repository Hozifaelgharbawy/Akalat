const review = require("../../modules/Review/review.repo")
const { isValid } = require("../../helpers/delivery.helper")

exports.listReviews = async (req, res) => {
  try {
    const isValidDelivery = await isValid(req);
    if (isValidDelivery) {
      const filter = req.query;
      const result = await review.list(filter);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only see your reviews!",
        code: 409
      });
    }
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}


exports.getReview = async (req, res) => {
  try {
    const isValidDelivery = await isValid(req);
    if (isValidDelivery) {
      const filter = req.query;
      const result = await review.get(filter);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only see your reviews!",
        code: 409
      });
    }
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}