const order = require("../../modules/Order/order.repo");



exports.listOrders = async (req, res) => {
    try {
        const filter = req.query;
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
        const filter = req.query;
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
        const userCart = await cartRepo.isExist({ user: userId });
        if (userCart.record.items.length == 0) return res.status(400).json({ success: false, error: "cart is currently empty", code: 400 });
        const form = {
            restaurant: userCart.record.restaurant,
            delivery: userCart.record.delivery,
            items: userCart.record.items,
            total: userCart.record.total,
            originalTotal: userCart.record.originalTotal,
            checkoutDate: Date.now()
        };
        const result = await orderRepo.create(form);
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