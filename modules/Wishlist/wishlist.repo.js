let Wishlist = require("./wishlist.model");
const meal = require("../Meal/meal.repo")

exports.isExist = async (filter) => {
    try {
      const wishlist = await Wishlist.findOne(filter);
      if (wishlist) {
        return {
          success: true,
          record: wishlist,
          code: 200
        };
      }
      else {
        return {
          success: false,
          code: 404,
          error: "Wishlist is not found!"
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
        if (filter.user) {
            let wishlist = await Wishlist.findOne(filter)
                .populate({ path: "user", select: "name image" })
                .populate({ path: "items.restaurant", select: "name image" })
                .populate({ path: "items.meal", select: "name image" });
            if (wishlist) {
                return {
                    success: true,
                    record: wishlist,
                    code: 200
                };
            }
            else {
                wishlist = new Wishlist({ user: filter.user })
                await wishlist.save();
                wishlist = await Wishlist.findOne(filter)
                    .populate({ path: "user", select: "name image" })
                    .populate({ path: "items.restaurant", select: "name image" });
                return {
                    success: true,
                    record: wishlist,
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
        console.log(`err.message `, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error!"
        };
    }
}

exports.list = async (filter) => {
    try {
        let records = await Wishlist.find(filter)
            .populate({ path: "user", select: "name image" })
            .populate({ path: "items.restaurant", select: "name image" });
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

exports.addItem = async (userId, itemId) => {
    try {
        let Meal = await meal.isExist({ _id: itemId });
        if (Meal.success) {
            let wishlist = await this.get({ user: userId });
            if (wishlist.success) {
                let isExist = await this.isItemInWishlist(wishlist.record.items, itemId);
                if (isExist.success) {
                    return {
                        success: false,
                        code: 400,
                        error: "meal is already in the wishlist!"
                    }
                }
                else {
                    wishlist.record.items.push({ _id: Meal.record._id, meal: Meal.record, restaurant: Meal.record.restaurant });
                    await Wishlist.findByIdAndUpdate(
                        { _id: wishlist.record._id },
                        { items: wishlist.record.items }
                    );
                    return {
                        success: true,
                        record: wishlist.record,
                        code: 201
                    }
                }
            }
        }
        else {
            return {
                success: false,
                code: 404,
                error: "Meal is not found!"

            }
        }
    }
    catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error!"
        };
    }
}

exports.removeItem = async (filter, item) => {
    try {
        let wishlist = await this.isExist(filter);
        if (wishlist.success) {
            let isExist = await this.isItemInWishlist(wishlist.record.items, item);
            if (isExist.success) {
                wishlist.record.items.splice(isExist.index, 1);
                await Wishlist.findByIdAndUpdate(
                    { _id: wishlist.record._id },
                    { items: wishlist.record.items }
                )
                return {
                    success: true,
                    record: wishlist.record,
                    code: 201
                }
            }
            else {
                return {
                    success: false,
                    code: 404,
                    error: "item not found in wishlist!"
                }
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

exports.isItemInWishlist = async (arrayOfItems, itemId) => {
    try {
        let i = -1
        const result = await arrayOfItems.find(element => {
            i++;
            if (element._id == itemId) { return element }
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
                error: "item not found in wishlist",
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
