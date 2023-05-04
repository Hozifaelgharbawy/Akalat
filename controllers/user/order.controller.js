const order = require("../../modules/Order/order.repo");
const cartRepo = require("../../modules/Cart/cart.repo");


exports.listOrders = async (req, res) => {
    try {
        const filter = { user: req.tokenData._id, ...req.query }
        const records = await order.list(filter);
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

exports.getOrder = async (req, res) => {
    try {
        let filter
        if (Object.keys(req.query).length != 0) filter = { user: req.tokenData._id, ...req.query }
        const record = await order.get(filter);
        res.status(record.code).json(record);
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}

exports.checkoutOrder = async (req, res) => {
    try {
        let userId = req.body.user ? req.body.user : req.query.user
        if (userId !=req.tokenData._id) return res.status(409).json({ success: false, error: "You can only control your cart!", code: 409 });
        const userCart = await cartRepo.isExist({ user: userId });
        if (userCart.record.items.length == 0) return res.status(400).json({ success: false, error: "cart is currently empty", code: 400 });
        let today = new Date();
        let nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const form = {
            user: userCart.record.user,
            restaurant: userCart.record.restaurant,
            items: userCart.record.items,
            total: userCart.record.total,
            originalTotal: userCart.record.originalTotal,
            startDate: today,
            defaultEndDate: nextWeek,
            status: "pending"
        };
        const result = await order.create(form);
        await cartRepo.flush({ user: userId });
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