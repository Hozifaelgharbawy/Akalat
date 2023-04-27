const wishlist = require('../../modules/Wishlist/wishlist.repo');

exports.getWishlist = async (req, res) => {
    try {
        const filter = req.query;
        const records = await wishlist.get(filter);
        res.status(records.code).json(records);
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}


exports.listWishlists = async (req, res) => {
    try {
        const filter = req.query;
        const result = await wishlist.list(filter);
        res.status(result.code).json(result);
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }

}