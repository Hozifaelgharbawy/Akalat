let Wishlist = require("./wishlist.model");
const mael = require("../Meal/mael.repo")

exports.get = async (filter) => {
    try {
        const wishlist = await Wishlist.findOne(filter)
            .populate({ path: "user", select: "name image" })
            .populate({ path: "items.restaurant", select: "name image" });
        if (wishlist) {
            return {
                success: true,
                record: wishlist,
                code: 200
            };
        }
        else {
            const wishlist = new Wishlist({ client: filter.client })
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

exports.addItem = async (clientId, itemId) => {
    try {
        let Mael = await mael.isExist({ _id: itemId });
        if (Mael.success) {
            let wishlist = await this.get({ client: clientId });
            if (wishlist.success) {
                let isExist = await this.isItemInWishlist(wishlist.record.items, itemId);
                if (isExist.success) {
                    return {
                        success: false,
                        code: 400,
                        error: "mael is already in the wishlist!"
                    }
                }
                else {
                    wishlist.record.items.push({ mael: Mael.record, restaurant: Mael.record.restaurant });
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
                error: "Mael is not found!"

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
        let wishlist = await this.get(filter);
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
            if (element.mael._id == itemId) { return element }
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
