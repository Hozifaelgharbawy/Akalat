const order = require("../../modules/Order/order.repo");
const deliveryRepo = require("../../modules/Delivery/delivery.repo");


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

exports.applyOrder = async (req, res) => {
    try {
        let orderId = req.body.order ? req.body.order : req.query.order
        let result = await order.isExist({ _id: orderId, status: "pending" });
        let record = await deliveryRepo.isExist({ _id: req.tokenData._id })
        if (result.success && (record.record.restaurant).toString() != (result.record.restaurant).toString()) return res.status(400).json({ success: false, code: 400, error: "This order is not for a restaurant" });
        if (result.success && result.record.delivery) return res.status(400).json({ success: false, code: 400, error: "This order has delivery" });
        if (result.success) result = await order.update(result.record._id, { delivery: req.tokenData._id });
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

exports.checkoutOrder = async (req, res) => {
    try {
        let userId = req.body.user ? req.body.user : req.query.user
        let restaurantId = req.body.restaurant ? req.body.restaurant : req.query.restaurant
        let deliveryId = req.body.delivery ? req.body.delivery : req.query.delivery
        let orderId = req.body.order ? req.body.order : req.query.order
        let result = await order.isExist({_id: orderId, user: userId, delivery: deliveryId, restaurant: restaurantId, status: "pending" });
        if (result.success && result.record.acceptedUser != "accepted") return res.status(409).json({ success: false, error: "user not accepted order!", code: 409 });
        let today = new Date();
        if (result.success) result = await order.update(result.record._id, { status: "accepted", EndDate: today });
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