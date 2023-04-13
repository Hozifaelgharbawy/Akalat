let Delivery = require("./delivery.model")
let bcrypt = require("bcrypt");


exports.isExist = async (filter) => {
  try {
    const delivery = await Delivery.findOne(filter);
    if (delivery) {
      return {
        success: true,
        record: delivery,
        code: 200
      };
    }
    else {
      return {
        success: false,
        code: 404,
        error: "delivery is not found!"
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
    let deliverys = await Delivery.find(filter).select("-password");
    return {
      success: true,
      record: deliverys,
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
    let delivery = await this.isExist({ email: form.email });
    if (!delivery.success) {
      const newDelivery = new Delivery(form);
      await newDelivery.save();
      return {
        success: true,
        record: newDelivery,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: "Delivery already exists!",
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
    const delivery = await this.isExist({ _id });
    if (delivery.success) {
      if (form.email) {
        const duplicate = await this.isExist({ email: form.email });
        if (duplicate.success && duplicate.record._id != delivery.record._id)
          return {
            success: false,
            error: "This Email is taken by another delivery",
            code: 409
          };
      }
      await Delivery.findByIdAndUpdate({ _id }, form)
      let deliveryUpdate = await this.isExist({ _id });
      return {
        success: true,
        record: deliveryUpdate.record,
        code: 201
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


exports.remove = async (_id) => {
  try {
    const delivery = await this.isExist({ _id });
    if (delivery.success) {
      await Delivery.findByIdAndDelete({ _id })
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



exports.comparePassword = async (email, password) => {
  try {
    let delivery = await this.isExist({ email })
    if (delivery.success) {
      let match = await bcrypt.compare(password, delivery.record.password)
      if (match) {
        return {
          success: true,
          record: delivery.record,
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
      error: delivery.error,
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
    let delivery = await this.isExist({ email })
    let saltrouds = 5;
    if (delivery.success) {
      let hashedPassword = await bcrypt.hash(newPassword, saltrouds)
      await Delivery.findOneAndUpdate({ email }, { password: hashedPassword })
      return {
        success: true,
        code: 200
      };
    } else return {
      success: false,
      code: 404,
      error: delivery.error
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