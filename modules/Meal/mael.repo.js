let Meal = require("./mael.model")
let fs = require("fs")
const Cart = require("../Cart/cart.model");
const Review = require("../Review/review.repo");
const Wishlist = require("../Wishlist/wishlist.model");
const Order = require("../Order/order.model");


exports.isExist = async (filter) => {
  try {
    const meal = await Meal.findOne(filter);
    if (meal) {
      return {
        success: true,
        record: meal,
        code: 200
      };
    }
    else {
      return {
        success: false,
        code: 404,
        error: "meal is not found!"
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

exports.get = async (filter) => {
  try {
    if (filter) {
      let record = await Meal.findOne(filter)
        .populate({ path: "restaurant", select: "name image" });
      if (record) {
        return {
          success: true,
          record: record,
          code: 200
        };
      }
      else {
        return {
          success: false,
          code: 404,
          error: "Meal is not found!"
        };
      }
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Meal ID is required!"
      }
    }
  } catch (err) {
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }

}

exports.list = async (filter) => {
  try {
    let meal = await Meal.find(filter)
      .populate({ path: "restaurant", select: "name image" });
    return {
      success: true,
      record: meal,
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

exports.create = async (form) => {
  try {
    const newMeal = new Meal(form);
    await newMeal.save();
    return {
      success: true,
      record: newMeal,
      code: 201
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

exports.update = async (_id, form) => {
  try {
    const meal = await this.isExist({ _id });
    if (meal.success) {
      await Meal.findByIdAndUpdate({ _id }, form)
      await Cart.deleteMany({ "items._id": _id })
      await Wishlist.deleteMany({ "items._id": _id })
      let mealUpdate = await this.isExist({ _id });
      return {
        success: true,
        record: mealUpdate.record,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: meal.error,
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
    const meal = await this.isExist({ _id });
    if (meal.success) {
      let oldImages = (meal.success && meal.record.image) ? (meal.record.image) : false
      if (oldImages) {
        try {
          await oldImages.map((image) => {
            fs.unlinkSync(image.path);
          })
        }
        catch (err) {
          console.log(`err`, err.errno);
        }
      }
      await Delivery.findByIdAndDelete({ _id })
      await Cart.deleteMany({ "items._id": _id })
      await Wishlist.deleteMany({ "items._id": _id })
      let reviews = await Review.list({ "meal": _id })
      await reviews.records.map((review) => {
        Review.remove( review._id )
      })
      await Order.deleteMany({ "items._id": _id })
      return {
        success: true,
        code: 200
      };
    }
    else {
      return {
        success: false,
        error: delivery.error,
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