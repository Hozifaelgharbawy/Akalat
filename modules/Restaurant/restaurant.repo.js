let Restaurant = require("./restaurant.model")
let bcrypt = require("bcrypt");
const Cart = require("../Cart/cart.model");
const Review = require("../Review/review.repo");
const Wishlist = require("../Wishlist/wishlist.model");
const Order = require("../Order/order.model");
const Delivery = require("../Delivery/delivery.model");



exports.isExist = async (filter) => {
  try {
    const restaurant = await Restaurant.findOne(filter);
    if (restaurant) {
      return {
        success: true,
        record: restaurant,
        code: 200
      };
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Restaurant is not found!"
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
      let record = await Restaurant.findOne(filter).select("-password");
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
          error: "Restaurant is not found!"
        };
      }
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Restaurant ID is required!"
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
    let restaurant = await Restaurant.find(filter).select("-password");
    return {
      success: true,
      record: restaurant,
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
    if (form.email) form.email = form.email.toLowerCase()
    let restaurant = await this.isExist({ email: form.email });
    if (!restaurant.success) {
      const newRestaurant = new Restaurant(form);
      await newRestaurant.save();
      return {
        success: true,
        record: newRestaurant,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: "Restaurant already exists!",
        code: 409
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
    const restaurant = await this.isExist({ _id });
    if (restaurant.success) {
      if (form.email) {
        form.email = form.email.toLowerCase()
        const duplicate = await this.isExist({ email: form.email });
        if (duplicate.success && duplicate.record._id != restaurant.record._id)
          return {
            success: false,
            error: "This Email is taken by another Restaurant",
            code: 409
          };
      }
      await Restaurant.findByIdAndUpdate({ _id }, form)
      let restaurantUpdate = await this.isExist({ _id });
      return {
        success: true,
        record: restaurantUpdate.record,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: restaurant.error,
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
    const restaurant = await this.isExist({ _id });
    if (restaurant.success) {
      let oldImage = (restaurant.success && restaurant.record.image) ? (restaurant.record.image) : false
      if (oldImage) {
        try {
          await fs.unlinkSync(oldImage.path);
        }
        catch (err) {
          console.log(`err`, err.errno);
        }
      }
      await Restaurant.findByIdAndDelete({ _id })
      await Cart.deleteMany({ "restaurant": _id })
      await Wishlist.deleteMany({ "items.restaurant": _id })
      let reviews = await Review.list({ "restaurant": _id })
      await reviews.records.map((review) => {
        Review.remove( review._id )
      })
      await Order.deleteMany({ "restaurant": _id })
      await Delivery.deleteMany({ "restaurant": _id })
      return {
        success: true,
        code: 200
      };
    }
    else {
      return {
        success: false,
        error: restaurant.error,
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

exports.comparePassword = async (email, password) => {
  try {
    email = email.toLowerCase()
    let restaurant = await this.isExist({ email })
    if (restaurant.success) {
      let match = await bcrypt.compare(password, restaurant.record.password)
      if (match) {
        return {
          success: true,
          record: restaurant.record,
          code: 200
        };
      }
      else {
        return {
          success: false,
          code: 409,
          error: "Incorrect Password"
        };
      }

    } else return {
      success: false,
      error: restaurant.error,
      code: 404
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

exports.resetPassword = async (email, newPassword) => {
  try {
    email = email.toLowerCase()
    let restaurant = await this.isExist({ email })
    let saltrouds = 5;
    if (restaurant.success) {
      let hashedPassword = await bcrypt.hash(newPassword, saltrouds)
      await Restaurant.findOneAndUpdate({ email }, { password: hashedPassword })
      return {
        success: true,
        code: 200
      };
    } else return {
      success: false,
      code: 404,
      error: restaurant.error
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