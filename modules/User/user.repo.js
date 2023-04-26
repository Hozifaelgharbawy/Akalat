let User = require("./user.model")
let bcrypt = require("bcrypt");
let fs = require("fs")


exports.isExist = async (filter) => {
  try {
    const user = await User.findOne(filter);
    if (user) {
      return {
        success: true,
        record: user,
        code: 200
      };
    }
    else {
      return {
        success: false,
        code: 404,
        error: "User is not found!"
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
      let record = await User.findOne(filter).select("-password");
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
          error: "Delivery is not found!"
        };
      }
    }
    else {
      return {
        success: false,
        code: 404,
        error: "User ID is required!"
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
    let users = await User.find(filter).select("-password");
    return {
      success: true,
      record: users,
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
    let user = await this.isExist({ email: form.email });
    if (!user.success) {
      const newUser = new User(form);
      await newUser.save();
      return {
        success: true,
        record: newUser,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: "User already exists!",
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
    const user = await this.isExist({ _id });
    if (user.success) {
      if (form.email) {
        form.email = form.email.toLowerCase()
        const duplicate = await this.isExist({ email: form.email });
        if (duplicate.success && duplicate.record._id != user.record._id)
          return {
            success: false,
            error: "This Email is taken by another user",
            code: 409
          };
      }
      await User.findByIdAndUpdate({ _id }, form)
      let userUpdate = await this.isExist({ _id });
      return {
        success: true,
        record: userUpdate.record,
        code: 201
      };
    }
    else {
      return {
        success: false,
        error: user.error,
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


exports.remove = async (_id, role) => {
  try {
    const user = await this.isExist({ _id, role: role });
    if (user.success) {
      let oldImage = (user.success && user.record.image) ? (user.record.image) : false
      if (oldImage) {
        try {
          await fs.unlinkSync(oldImage.path);
        }
        catch (err) {
          console.log(`err`, err.errno);
        }
      }
      await User.findByIdAndDelete({ _id })
      return {
        success: true,
        code: 200
      };
    }
    else {
      return {
        success: false,
        error: user.error,
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
    let user = await this.isExist({ email })
    if (user.success) {
      let match = await bcrypt.compare(password, user.record.password)
      if (match) {
        return {
          success: true,
          record: user.record,
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
      error: user.error,
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
    let user = await this.isExist({ email })
    let saltrouds = 5;
    if (user.success) {
      let hashedPassword = await bcrypt.hash(newPassword, saltrouds)
      await User.findOneAndUpdate({ email }, { password: hashedPassword })
      return {
        success: true,
        code: 200
      };
    } else return {
      success: false,
      code: 404,
      error: user.error
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