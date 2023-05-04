const review = require("../../modules/Review/review.repo")

exports.listReviews = async (req, res) => {
  try {
    const filter = { delivery: req.tokenData._id, type: "delivery", ...req.query }
    const result = await review.list(filter);
    res.status(result.code).json(result);
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
    const filter = { delivery: req.tokenData._id, type: "delivery", ...req.query }
    const result = await review.get(filter);
    res.status(result.code).json(result);
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}