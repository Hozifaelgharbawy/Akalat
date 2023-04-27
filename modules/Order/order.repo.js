let Order = require("./order.model")


exports.isExist = async (filter) => {
  try {
    const order = await Order.findOne(filter);
    if (order) {
      return {
        success: true,
        record: order,
        code: 200
      };
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Order is not found!"
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

exports.list = async (filter) => {
  try {
    let records = await Order.find(filter)
      .populate({ path: "user", select: "name image" })
      .populate({ path: "restaurant", select: "name image" })
      .populate({ path: "delivery", select: "name image" });;
    return {
      success: true,
      records,
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

exports.get = async (filter) => {
  try {
    if (filter) {
      record = await Order.findOne(filter)
        .populate({ path: "user", select: "name image" })
        .populate({ path: "restaurant", select: "name image" })
        .populate({ path: "delivery", select: "name image" });;
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
          error: "Order is not found!"
        };
      }
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Order ID is required!"
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

exports.create = async (form) => {
  try {
    const newOrder = new Order(form);
    await newOrder.save();
    return {
      success: true,
      record: newOrder,
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
    await Order.findByIdAndUpdate({ _id }, form)
    return {
      success: true,
      code: 201
    };
  } catch (err) {
    return {
      success: false,
      code: 500,
      error: "Unexpected Error!"
    };
  }

}

exports.remove = async (_id) => {
  try {
    if (_id) {
      const order = await this.isExist(filter);
      if (order.success) {
        await Order.findByIdAndDelete({ _id })
        return {
          success: true,
          code: 200
        };
      }
      else {
        return {
          success: false,
          error: "order not found",
          code: 404
        };
      }
    }
    else {
      return {
        success: false,
        code: 404,
        error: "Order ID is required!"
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
