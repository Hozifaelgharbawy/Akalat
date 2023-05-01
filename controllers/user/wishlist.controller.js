const wishlist = require('../../modules/Wishlist/wishlist.repo');

exports.addItemToWishlist = async (req, res) => {
    try {
        const record = await wishlist.addItem(req.query.user, req.query.meal);
        res.status(record.code).json(record)
    }
    catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}

exports.removeItemFromWishlist = async (req, res) => {
    try {
        const result = await wishlist.removeItem({ user: req.query.user }, req.query.meal);
        res.status(result.code).json(result);
    }
    catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}

exports.getWishlist = async (req, res) => {
    try {
        const filter = req.query;
        const result = await wishlist.get(filter);
        res.status(result.code).json(result);
    }
    catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}