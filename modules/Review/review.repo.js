let Review = require("./review.model")
const mealRepo = require("../Meal/meal.repo");
const restaurantRepo = require("../Restaurant/restaurant.repo");
const deliveryRepo = require("../Delivery/delivery.repo");



exports.isExist = async (filter) => {
  try {
    const review = await Review.findOne(filter).lean();
    if (review) {
      return {
        success: true,
        record: review,
        code: 200
      };
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Review is not found!"
      };
    }
  } catch (err) {
    console.log(`err.message`, err.message);
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }

}

exports.list = async (filter) => {
  try {
    let records = await Review.find(filter)
      .populate({ path: "user", select: "name image" })
      .populate({ path: "restaurant", select: "name image" })
      .populate({ path: "delivery", select: "name image" })
      .populate({ path: "meal", select: "name image" });
    return {
      success: true,
      records,
      code: 200
    };
  } catch (err) {
    console.log(`err.message`, err.message);
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }

}

exports.get = async (filter) => {
  try {
    if (filter) {
      let record = await Review.findOne(filter)
        .populate({ path: "user", select: "name image" })
        .populate({ path: "restaurant", select: "name image" })
        .populate({ path: "delivery", select: "name image" })
        .populate({ path: "meal", select: "name image" });
      if (record) {
        return {
          success: true,
          record,
          code: 200
        };
      }
      else {
        return {
          success: false,
          code: 404,
          error: "Review is not found!"
        }
      }
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Review ID is required!"
      }
    }
  } catch (err) {
    console.log(`err.message`, err.message);
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }

}

exports.create = async (form) => {
  try {
    let review;
    if (form.type == "meal") {
      review = await this.isExist({ user: form.user, restaurant: form.restaurant, meal: form.meal, type: form.type });
    }
    else if (form.type == "restaurant") {
      review = await this.isExist({ user: form.user, restaurant: form.restaurant, type: form.type })
    }
    else if (form.type == "delivery") {
      review = await this.isExist({ user: form.user, delivery: form.delivery, type: form.type })
    }
    if (!review.success) {
      const newReview = new Review(form);
      await newReview.save();
      return {
        success: true,
        record: newReview,
        code: 201
      };
    }
    else {
      return {
        success: true,
        error: "Review already exists",
        code: 404
      };
    }

  } catch (err) {
    console.log(`err.message`, err.message);
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }


}

exports.update = async (_id, form) => {
  try {
    const review = await this.isExist({ _id });
    if (review.success) {
      await Review.findByIdAndUpdate({ _id }, form)
      let reviewUpdate = await this.isExist({ _id });
      return {
        success: true,
        record: reviewUpdate.record,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: review.error,
        code: 404
      };
    }
  } catch (err) {
    console.log(`err.message`, err.message);
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }
}

exports.remove = async (_id) => {
  try {
    let review = await this.isExist({ _id })
    if (review.success) {
      let clientOldRating = review.record.rating
      if (review.record.type === "meal") {
        const meal = await mealRepo.isExist({ _id: review.record.meal });
        let mealOldRating = meal.record.rate
        const newRateSum = mealOldRating * (meal.record.numOfReviews - 1) - clientOldRating;
        const newRate = newRateSum / (meal.record.numOfReviews - 1);
        await mealRepo.update(review.record.meal, { rate: newRate, numOfReviews: meal.record.numOfReviews - 1 });
      } else if (review.record.type === "restaurant") {
        const restaurant = await restaurantRepo.isExist({ _id:review.record.restaurant });
        let restaurantOldRating = restaurant.record.rate
        const newRateSum = restaurantOldRating * (restaurant.record.numOfReviews - 1) - clientOldRating;
        const newRate = newRateSum / (restaurant.record.numOfReviews - 1);
        await restaurantRepo.update(review.record.restaurant, { rate: newRate, numOfReviews: restaurant.record.numOfReviews - 1 });
      } else if (review.record.type === "delivery") {
        const delivery = await deliveryRepo.isExist({ _id: review.record.delivery });
        let deliveryOldRating = delivery.record.rate
        const newRateSum = deliveryOldRating * (delivery.record.numOfReviews - 1) - clientOldRating;
        const newRate = newRateSum / (delivery.record.numOfReviews - 1);
        await deliveryRepo.update(review.record.delivery, { rate: newRate, numOfReviews: delivery.record.numOfReviews - 1 });
      }
      await Review.findByIdAndDelete({ _id })
      return {
        success: true,
        code: 200
      };
    }
    else {
      return {
        success: false,
        error: review.error,
        code: 404
      };
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