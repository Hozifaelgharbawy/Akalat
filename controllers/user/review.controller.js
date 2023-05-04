const reviewRepo = require("../../modules/Review/review.repo");
const orderRepo = require("../../modules/Order/order.repo");
const mealRepo = require("../../modules/Meal/meal.repo");
const restaurantRepo = require("../../modules/Restaurant/restaurant.repo");
const deliveryRepo = require("../../modules/Delivery/delivery.repo");
const { isValidOrder } = require("../../helpers/user.helper");

exports.createReview = async (req, res) => {
  try {
    const isValid = await isValidOrder(req);
    if (!isValid) return res.status(409).json({ success: false, error: "You can only control your Reviews!", code: 409 });
    let clientOrders;
    if (req.body.type === "meal") {
      clientOrders = await orderRepo.isExist({ user: req.body.user, restaurant: req.body.restaurant, 'items._id': req.body.meal });
    } else if (req.body.type === "restaurant") {
      clientOrders = await orderRepo.isExist({ user: req.body.user, restaurant: req.body.restaurant });
    } else if (req.body.type === "delivery") {
      clientOrders = await orderRepo.isExist({ user: req.body.user, restaurant: req.body.restaurant, delivery: req.body.delivery });
    }
    if (!clientOrders.success) {
      if (req.body.type === "meal") return res.status(400).json({ success: false, error: "to review a meal you have to buy it first", code: 400 });
      else if (req.body.type === "restaurant") return res.status(400).json({ success: false, error: "to review a restaurant you have to buy from them first", code: 400 });
      else if (req.body.type === "delivery") return res.status(400).json({ success: false, error: "To check delivery, you must pick up from delivery first", code: 400 });
    }
    const result = await reviewRepo.create(req.body);
    if (req.body.type === "meal") {
      const meal = await mealRepo.isExist({ _id: req.body.meal });
      const newRateSum = meal.record.rate * meal.record.numOfReviews + req.body.rating;
      const newRate = newRateSum / (meal.record.numOfReviews + 1);
      await mealRepo.update(req.body.meal, { numOfReviews: meal.record.numOfReviews + 1, rate: newRate });
    } else if (req.body.type === "restaurant") {
      const restaurant = await restaurantRepo.isExist({ _id: req.body.restaurant });
      const newRateSum = restaurant.record.rate * restaurant.record.numOfReviews + req.body.rating;
      const newRate = newRateSum / (restaurant.record.numOfReviews + 1);
      await restaurantRepo.update(req.body.restaurant, { numOfReviews: restaurant.record.numOfReviews + 1, rate: newRate });
    } else if (req.body.type === "delivery") {
      const delivery = await this.deleteReview.isExist({ _id: req.body.restaurant });
      const newRateSum = delivery.record.rate * delivery.record.numOfReviews + req.body.rating;
      const newRate = newRateSum / (delivery.record.numOfReviews + 1);
      await deliveryRepo.update(req.body.delivery, { numOfReviews: delivery.record.numOfReviews + 1, rate: newRate });
    }
    res.status(result.code).json(result);
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({ success: false, code: 500, error: "Unexpected Error!" });
  }
};

exports.listReviews = async (req, res) => {
  try {
    const filter = req.query;
    const result = await reviewRepo.list(filter);
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
    const filter = req.query;
    const result = await reviewRepo.get(filter);
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

exports.updateReview = async (req, res) => {
  try {
    if (req.body.rating) {
      let review = await reviewRepo.isExist({ _id: req.query._id })
      if (review.success) {
        if (review.record.user != req.token._id) return res.status(409).json({ success: false, error: "You can only update your Reviews!", code: 409 });
        let clientOldRating = review.record.rating
        let clientNewRating = req.body.rating;
        if (review.record.type === "meal") {
          const meal = await mealRepo.isExist({ _id: review.record.meal });
          let mealOldRating = meal.record.rating
          const newRateSum = mealOldRating * meal.record.numOfReviews + (clientNewRating - clientOldRating);
          const newRate = newRateSum / (meal.record.numOfReviews);
          await mealRepo.update(review.record.meal, { rate: newRate });
        } else if (review.record.type === "restaurant") {
          const restaurant = await restaurantRepo.isExist({ _id: req.body.restaurant });
          let restaurantOldRating = restaurant.record.rating
          const newRateSum = restaurantOldRating * restaurant.record.numOfReviews + (clientNewRating - clientOldRating);
          const newRate = newRateSum / (restaurant.record.numOfReviews);
          await restaurantRepo.update(review.record.restaurant, { rate: newRate });
        } else if (review.record.type === "delivery") {
          const delivery = await deliveryRepo.isExist({ _id: review.record.delivery });
          let deliveryOldRating = delivery.record.rating
          const newRateSum = deliveryOldRating * delivery.record.numOfReviews + (clientNewRating - clientOldRating);
          const newRate = newRateSum / (delivery.record.numOfReviews);
          await deliveryRepo.update(review.record.delivery, { rate: newRate });
        }
      }
      else {
        return res.status(review.code).json(review);
      }
    }
    const result = await reviewRepo.update(req.query._id, req.body);
    res.status(result.code).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const result = await reviewRepo.remove(req.query._id);
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