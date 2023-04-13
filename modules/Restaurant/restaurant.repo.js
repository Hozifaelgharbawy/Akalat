let Restaurant = require("./restaurant.model")
let bcrypt = require("bcrypt");


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
        error: "restaurant is not found!"
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
    let restaurants = await Restaurant.find(filter).select("-password");
    return {
      success: true,
      record: restaurants,
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
        const duplicate = await this.isExist({ email: form.email });
        if (duplicate.success && duplicate.record._id != client.record._id)
          return {
            success: false,
            error: "This Email is taken by another restaurant",
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
      await Restaurant.findByIdAndDelete({ _id })
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