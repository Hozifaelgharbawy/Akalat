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
      const cart = new Cart({ user: filter.user, total: 0, originalTotal: 0 })
      await cart.save();
      return {
        success: true,
        record: cart,
        code: 201
      };
    }
  } catch (err) {
    const cart = await Cart.findOne(filter).lean()
    if (cart) {
      return {
        success: false,
        code: 500,
        error: "Unexpected Error!"
      };
    }
  }
}

exports.list = async (filter) => {
  try {
    let records = await Cart.find(filter)
      .populate({ path: "user", select: "name image" })
      .populate({ path: "restaurant", select: "name image" })
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
    if (filter.user) {
      let cart = await Cart.findOne(filter)
        .populate({ path: "user", select: "name image" })
        .populate({ path: "restaurant", select: "name image" })
      if (cart) {
        return {
          success: true,
          record: cart,
          code: 200
        };
      }
      else {
        cart = new Cart({ user: filter.user, total: 0, originalTotal: 0 })
        await cart.save();
        return {
          success: true,
          record: cart,
          code: 201
        };
      }
    } else {
      return {
        success: false,
        code: 404,
        error: "User ID is required!"
      };
    }
  } catch (err) {
    let cart = await Cart.findOne(filter)
    if (cart) {
      return {
        success: false,
        code: 500,
        error: "Unexpected Error!"
      };
    }
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
          $unset: { restaurant: 1 }
        });
      delete cart.restaurant;
    }
    else {
      await Cart.findByIdAndUpdate({ _id: cart._id }, { items: cart.items, total: cartTotal, originalTotal, restaurant: cart.restaurant })
    }
    cart.total = cartTotal
    cart.originalTotal = originalTotal
    return {
      success: true,
      record: cart,
      code: 200
    };
  } catch (err) {
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }
}

exports.addItem = async (userId, mealId, quantity) => {
  try {
    const item = await meal.isExist({ _id: mealId })
    if (item.success) {
      let price = parseFloat(item.record.price)
      const cart = await this.isExist({ user: userId })
      const itemExists = await this.isItemInCart(cart.record.items, mealId);
      if (itemExists.success) {
        let newQuantity = parseInt(itemExists.record.quantity) + parseInt(quantity)
        let itemTotal = price * newQuantity
        let foundItem = cart.record.items[itemExists.index]
        foundItem.quantity = newQuantity
        foundItem.total = itemTotal
        let cartUpdate = await this.calculateTotal(cart.record)
        return {
          success: true,
          record: cartUpdate.record,
          code: 201
        };
      }
      else {
        cart.record.restaurant = item.record.restaurant
        cart.record.items.push({ _id: mealId, meal: item.record, quantity, total: (price * quantity) })
        let cartUpdate = await this.calculateTotal(cart.record)
        return {
          success: true,
          record: cartUpdate.record,
          code: 201
        }

      }
    }
    else {
      return {
        success: false,
        error: item.error,
        code: 404
      };
    }
  } catch (err) {
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }
}

exports.removeItem = async (userId, mealId, quantity) => {
  try {
    const cart = await this.isExist({ user: userId })
    const itemExists = await this.isItemInCart(cart.record.items, mealId);
    if (itemExists.success) {
      let newQuantity = parseInt(itemExists.record.quantity) - parseInt(quantity)
      let itemTotal = parseFloat(itemExists.record.meal.price) * newQuantity
      let foundItem = cart.record.items[itemExists.index]
      foundItem.quantity = newQuantity
      foundItem.total = itemTotal
      if (newQuantity <= 0) {
        await cart.record.items.splice(itemExists.index, 1);
        cartUpdate = await this.calculateTotal(cart.record)
        console.log(cartUpdate);
        return {
          success: true,
          record: cartUpdate.record,
          code: 200
        };
      }
      await cart.record.items.splice(itemExists.index, 1, foundItem);
      cartUpdate = await this.calculateTotal(cart.record)
      return {
        success: true,
        record: cartUpdate.record,
        code: 200
      };
    }
    else {
      return {
        success: false,
        error: "Item is not found in the Cart",
        code: 404
      }

    }
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }
}

exports.flush = async (filter) => {
  try {
    await Cart.findOneAndUpdate(filter,
      {
        items: [], total: 0, originalTotal: 0,
        $unset: { restaurant: 1 }
      });

    return {
      success: true,
      code: 200
    };

  } catch (err) {
    console.log(`err`, err);
    return {
      success: false,
      code: 404,
      error: "Cart not found!"
    };
  }
}

exports.isItemInCart = async (arrayOfItems, mealId) => {
  try {
    let i = -1
    const result = await arrayOfItems.find(element => {
      i++;
      if (element._id == mealId) { return element }
    });
    if (result) {
      return {
        success: true,
        record: result,
        index: i,
        code: 200
      };
    }
    else {
      return {
        success: false,
        error: "item not found in cart",
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

exports.update = async (filter, form) => {
  try {
    let cart = await this.isExist(filter);
    if (cart.success) {
      await Cart.findByIdAndUpdate({ _id: cart.record._id }, form)
      return {
        success: true,
        code: 201
      };
    }
    else {
      return {
        success: true,
        error: cart.error,
        code: 201
      };
    }
  } catch (err) {
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }
}
