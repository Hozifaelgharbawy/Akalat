let Cart = require("./cart.model")
const meal = require("../Meal/meal.repo")


exports.isExist = async (filter) => {
  try {
    const cart = await Cart.findOne(filter);
    if (cart) {
      return {
        success: true,
        record: cart,
        code: 200
      };
    }
    else {
      const cart = new Cart({ user: filter.user, total: 0 })
      await cart.save();
      return {
        success: true,
        record: cart,
        code: 201
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
    let records = await Cart.find(filter);
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
    const cart = await this.isExist(filter)
      .populate({ path: 'restaurant', select: "name image" }).populate({ path: "delivery", select: "name image" });

    return {
      success: true,
      record: cart,
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



exports.calculateTotal = async (cart) => {
  try {
    let cartTotal = 0, originalTotal = 0;
    await cart.items.forEach(item => {
      let price = parseFloat(item.meal.price)
      let originalPrice = parseFloat(item.meal.originalPrice)
      price = price * item.quantity
      originalPrice = originalPrice * item.quantity
      cartTotal += price
      originalTotal += originalPrice;
    });
    if ((cart.items).length == 0) {
      await Cart.findOneAndUpdate({ _id: cart._id },
        {
          items: [], total: 0, originalTotal: 0,
          $unset: { restaurant: 1, delivery: 1 }
        });
      delete cart.restaurant;
      delete cart.delivery;
    }
    else {
      await Cart.findByIdAndUpdate({ _id: cart._id }, { items: cart.items, total: cartTotal, originalTotal, restaurant: cart.restaurant, delivery: cart.delivery })
    }
    cart.total = cartTotal
    cart.originalTotal = originalTotal
    return {
      success: true,
      record: cart,
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