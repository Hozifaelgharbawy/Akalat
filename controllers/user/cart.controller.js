let cartRepo = require("../../modules/Cart/cart.repo")
const { isValidOrder } = require("../../helpers/user.helper")


exports.getCart = async (req, res) => {
    try {
        const isValid = isValidOrder(req);
        if (isValid) {
            const filter = req.query;
            const result = await cartRepo.get(filter);
            res.status(result.code).json(result);
        }
        else res.status(409).json({
            success: false,
            error: "You can only control your cart!",
            code: 409
        });
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }

}


exports.addItemToCart = async (req, res) => {
    try {
        const isValid = await isValidOrder(req);
        if (isValid) {
            const result = await cartRepo.addItem(req.query.user, req.query.meal, req.query.quantity)
            res.status(result.code).json(result)
        }
        else res.status(409).json({
            success: false,
            error: "You can only control your cart!",
            code: 409
        });
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}


exports.removeItemFromCart = async (req, res) => {
    try {
        const isValid = await isValidOrder(req);
        if (isValid) {
            const result = await cartRepo.removeItem(req.query.user, req.query.meal, req.query.quantity)
            res.status(result.code).json(result)
        }
        else res.status(409).json({
            success: false,
            error: "You can only control your cart!",
            code: 409
        });
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }

}


exports.flushCart = async (req, res) => {
    try {
        const isValid = await isValidOrder(req);
        if (isValid) {
            let result = await cartRepo.flush({ user: req.query.user })
            res.status(result.code).json(result)
        }
        else res.status(409).json({
            success: false,
            error: "You can only control your cart!",
            code: 409
        });
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }

}