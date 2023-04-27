let cart = require("../../modules/Cart/cart.repo")


exports.getCart = async (req, res) => {
    try {
        const filter = req.query;
        const result = await cart.get(filter);
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

exports.listCarts = async (req, res) => {
    try {
        const filter = req.query;
        const result = await cart.list(filter);
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