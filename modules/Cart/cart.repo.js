let Cart = require("./cart.model")
const mael = require("../Meal/mael.repo")


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
      const cart = new Cart({ client: filter.client, total: 0 })
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
      .populate({ path: "delivery", select: "name image" });
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
    const cart = await Cart.findOne(filter)
      .populate({ path: "user", select: "name image" })
      .populate({ path: "restaurant", select: "name image" })
      .populate({ path: "delivery", select: "name image" });
    if (cart) {
      return {
        success: true,
        record: cart,
        code: 200
      };
    }
    else {
      const cart = new Cart({ client: filter.client, total: 0 })
      await cart.save();
      return {
        success: true,
        record: cart,
        code: 201
      };
    }
  } catch (err) {
    const cart = await Cart.findOne(filter)
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
          $unset: { restaurant: 1 }, $delivery: { delivery: 1 }
        });
      delete cart.delivery;
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

exports.addItem = async (clientId, maelId, quantity) => {
  try {
    const item = await mael.isExist({ _id: maelId })
    if (item.success) {
      let price = parseFloat(item.record.price)
      const cart = await this.isExist({ client: clientId })
      const itemExists = await this.isItemInCart(cart.record.items, maelId);
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
        cart.record.items.push({ _id: maelId, meal: item.record, quantity, total: (price * quantity) })
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

exports.removeItem = async (clientId, maelId, quantity) => {
  try {
    const cart = await this.isExist({ client: clientId })
    const itemExists = await this.isItemInCart(cart.record.items, maelId);
    if (itemExists.success) {
      let newQuantity = parseInt(itemExists.record.quantity) - parseInt(quantity)
      let itemTotal = parseFloat(itemExists.record.product.price) * newQuantity
      let foundItem = cart.record.items[itemExists.index]
      foundItem.quantity = newQuantity
      foundItem.total = itemTotal
      if (newQuantity <= 0) {
        await cart.record.items.splice(itemExists.index, 1);
        cartUpdate = await this.calculateTotal(cart.record)
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
        $unset: { restaurant: 1, delivery: 1 }
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

exports.isItemInCart = async (arrayOfItems, maelId) => {
  try {
    let i = -1
    const result = await arrayOfItems.find(element => {
      i++;
      if (element.mael._id == maelId) { return element }
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
